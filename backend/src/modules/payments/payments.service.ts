import { getPaymentGateway, getPaymentGatewayByProvider } from '@integrations/payments';
import { CHAPTER_PRICE, PaymentStatus } from '@common/constants';
import { isProduction } from '@config/env';
import { logger } from '@common/utils/logger';
import { PaymentModel, type PaymentDocument } from './payment.model';
import type { CreateOrderDto, OrderResultDto, VerifyPaymentDto, VerifyResultDto } from './payments.dto';

/**
 * Payments orchestration. Framework-agnostic (no req/res). Delegates the actual
 * money movement to the currency-appropriate gateway via `@integrations/payments`.
 *
 * Stateless by design for now: the client-side library owns unlock state, so we
 * only need to (a) create a gateway order and (b) verify the completed payment's
 * signature. Persisting a payments record (userId, status…) is the follow-up
 * once real auth + a server-side library land — see the module README.
 *
 * Demo fallback: when a gateway has no keys configured, `createOrder` returns a
 * `mock` order the browser renders with a stand-in checkout sheet. No charge.
 */
export class PaymentsService {
  async createOrder(dto: CreateOrderDto): Promise<OrderResultDto> {
    const gateway = getPaymentGateway(dto.currency);

    // Price is one major unit (₹1 / $1 / €1) → convert to the smallest unit the
    // gateways expect (paise / cents). CHAPTER_PRICE is the major-unit price.
    const amount = CHAPTER_PRICE[dto.currency] * MINOR_UNITS_PER_MAJOR;
    const receipt = buildReceipt(dto.chapterOrder);

    if (!gateway.isConfigured()) {
      logger.warn(
        `[payments] ${gateway.provider} not configured — issuing a MOCK order (demo checkout).`,
      );
      const mockResult: OrderResultDto = {
        mock: true,
        provider: gateway.provider,
        keyId: null,
        orderId: null,
        amount,
        currency: dto.currency,
        receipt,
      };
      await this.recordOrder(dto, mockResult);
      return mockResult;
    }

    const order = await gateway.createOrder({ amount, currency: dto.currency, receipt });
    const result: OrderResultDto = {
      mock: false,
      provider: gateway.provider,
      keyId: gateway.publicKey(),
      orderId: order.providerOrderId,
      amount: order.amount,
      currency: dto.currency,
      receipt,
    };
    await this.recordOrder(dto, result);
    return result;
  }

  async verify(dto: VerifyPaymentDto): Promise<VerifyResultDto> {
    const gateway = getPaymentGatewayByProvider(dto.provider);

    // No keys → this must be a demo (mock) checkout. Accept it in non-prod only;
    // never let an unverifiable payment through in production.
    if (!gateway.isConfigured()) {
      return { verified: !isProduction };
    }

    const verified = await gateway.verifyPayment({
      orderId: dto.orderId,
      paymentId: dto.paymentId,
      signature: dto.signature,
    });
    if (verified) await this.markPaid(dto);
    return { verified };
  }

  /** Admin: full payment history, newest first. */
  async listAll(page: number, limit: number): Promise<{ items: PublicPayment[]; total: number }> {
    const [items, total] = await Promise.all([
      PaymentModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec(),
      PaymentModel.countDocuments().exec(),
    ]);
    return { items: items.map(toPublicPayment), total };
  }

  /** Persist an order attempt (best-effort — never blocks checkout). */
  private async recordOrder(dto: CreateOrderDto, result: OrderResultDto): Promise<void> {
    try {
      await PaymentModel.create({
        provider: result.provider,
        currency: result.currency,
        amount: result.amount,
        chapterOrder: dto.chapterOrder,
        receipt: result.receipt,
        orderId: result.orderId ?? undefined,
        status: 'created',
      });
    } catch (err) {
      logger.warn(`[payments] could not record order: ${(err as Error).message}`);
    }
  }

  /** Mark the matching order paid on successful verification (best-effort). */
  private async markPaid(dto: VerifyPaymentDto): Promise<void> {
    try {
      await PaymentModel.findOneAndUpdate(
        { orderId: dto.orderId },
        { status: PaymentStatus.PAID, paymentId: dto.paymentId },
      ).exec();
    } catch (err) {
      logger.warn(`[payments] could not mark paid: ${(err as Error).message}`);
    }
  }
}

export interface PublicPayment {
  id: string;
  provider: string;
  currency: string;
  amount: number;
  chapterOrder: number;
  receipt: string;
  orderId?: string;
  paymentId?: string;
  status: string;
  createdAt: Date;
}

function toPublicPayment(doc: PaymentDocument): PublicPayment {
  return {
    id: doc.id,
    provider: doc.provider,
    currency: doc.currency,
    amount: doc.amount,
    chapterOrder: doc.chapterOrder,
    receipt: doc.receipt,
    orderId: doc.orderId,
    paymentId: doc.paymentId,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

/** All three supported currencies have 100 minor units per major unit. */
const MINOR_UNITS_PER_MAJOR = 100;

/** Short, gateway-safe reference (Razorpay caps receipt at 40 chars). */
function buildReceipt(chapterOrder: number): string {
  return `wsr_${chapterOrder}_${Date.now().toString(36)}`;
}
