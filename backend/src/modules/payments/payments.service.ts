import { getPaymentGateway, getPaymentGatewayByProvider } from '@integrations/payments';
import { CHAPTER_PRICE } from '@common/constants';
import { isProduction } from '@config/env';
import { logger } from '@common/utils/logger';
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
      return {
        mock: true,
        provider: gateway.provider,
        keyId: null,
        orderId: null,
        amount,
        currency: dto.currency,
        receipt,
      };
    }

    const order = await gateway.createOrder({ amount, currency: dto.currency, receipt });
    return {
      mock: false,
      provider: gateway.provider,
      keyId: gateway.publicKey(),
      orderId: order.providerOrderId,
      amount: order.amount,
      currency: dto.currency,
      receipt,
    };
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
    return { verified };
  }
}

/** All three supported currencies have 100 minor units per major unit. */
const MINOR_UNITS_PER_MAJOR = 100;

/** Short, gateway-safe reference (Razorpay caps receipt at 40 chars). */
function buildReceipt(chapterOrder: number): string {
  return `wsr_${chapterOrder}_${Date.now().toString(36)}`;
}
