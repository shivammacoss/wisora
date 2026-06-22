import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import { env } from '@config/env';
import type { CreateOrderInput, CreateOrderResult, IPaymentGateway } from './payment.gateway';

/** Razorpay adapter (handles INR). */
export class RazorpayGateway implements IPaymentGateway {
  private readonly client = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID ?? '',
    key_secret: env.RAZORPAY_KEY_SECRET ?? '',
  });

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const order = await this.client.orders.create({
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

  verifyWebhook(signature: string, payload: Buffer): boolean {
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET ?? '')
      .update(payload)
      .digest('hex');
    return expected === signature;
  }
}
