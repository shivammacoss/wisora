import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import { env } from '@config/env';
import { PaymentProvider } from '@common/constants';
import type {
  CreateOrderInput,
  CreateOrderResult,
  IPaymentGateway,
  VerifyPaymentInput,
} from './payment.gateway';

/** Razorpay adapter (handles INR). */
export class RazorpayGateway implements IPaymentGateway {
  readonly provider = PaymentProvider.RAZORPAY;

  // Instantiated lazily: the Razorpay SDK throws if key_id is missing, so we
  // must NOT build a client at import time when the app runs without keys
  // (demo mode). Created on first real use, once we know it's configured.
  private client: Razorpay | null = null;

  isConfigured(): boolean {
    return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
  }

  publicKey(): string | null {
    return env.RAZORPAY_KEY_ID ?? null;
  }

  private getClient(): Razorpay {
    if (!this.isConfigured()) {
      throw new Error('Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing)');
    }
    this.client ??= new Razorpay({
      key_id: env.RAZORPAY_KEY_ID as string,
      key_secret: env.RAZORPAY_KEY_SECRET as string,
    });
    return this.client;
  }

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const order = await this.getClient().orders.create({
      amount: input.amount,
      currency: input.currency,
      receipt: input.receipt,
    });
    return {
      providerOrderId: order.id,
      amount: Number(order.amount),
      currency: input.currency,
    };
  }

  /**
   * Verify a completed Checkout payment. Razorpay signs `${orderId}|${paymentId}`
   * with the key secret (HMAC-SHA256); a matching signature proves the callback
   * is authentic and untampered. Compared in constant time.
   */
  async verifyPayment({ orderId, paymentId, signature }: VerifyPaymentInput): Promise<boolean> {
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET ?? '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return timingSafeEqualHex(expected, signature);
  }

  verifyWebhook(signature: string, payload: Buffer): boolean {
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET ?? '')
      .update(payload)
      .digest('hex');
    return timingSafeEqualHex(expected, signature);
  }
}

/** Constant-time comparison of two hex strings (guards against length leaks). */
function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length || bufA.length === 0) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
