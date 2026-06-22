import Stripe from 'stripe';
import { env } from '@config/env';
import type { CreateOrderInput, CreateOrderResult, IPaymentGateway } from './payment.gateway';

/** Stripe adapter (handles USD/EUR). */
export class StripeGateway implements IPaymentGateway {
  private readonly client = new Stripe(env.STRIPE_SECRET_KEY ?? '');

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const intent = await this.client.paymentIntents.create({
      amount: input.amount,
      currency: input.currency.toLowerCase(),
      metadata: { receipt: input.receipt },
      automatic_payment_methods: { enabled: true },
    });
    return {
      providerOrderId: intent.id,
      amount: intent.amount,
      currency: input.currency,
    };
  }

  verifyWebhook(signature: string, payload: Buffer): boolean {
    try {
      this.client.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET ?? '');
      return true;
    } catch {
      return false;
    }
  }
}
