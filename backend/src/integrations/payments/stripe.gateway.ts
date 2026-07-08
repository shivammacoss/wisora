import Stripe from 'stripe';
import { env } from '@config/env';
import { PaymentProvider } from '@common/constants';
import type {
  CreateOrderInput,
  CreateOrderResult,
  IPaymentGateway,
  VerifyPaymentInput,
} from './payment.gateway';

/** Stripe adapter (handles USD/EUR). */
export class StripeGateway implements IPaymentGateway {
  readonly provider = PaymentProvider.STRIPE;

  // Lazy — mirror the Razorpay adapter so the app boots without Stripe keys.
  private client: Stripe | null = null;

  isConfigured(): boolean {
    return Boolean(env.STRIPE_SECRET_KEY);
  }

  publicKey(): string | null {
    // The browser uses the publishable key (VITE_STRIPE_PUBLISHABLE_KEY),
    // never the secret one — so nothing to expose from the server here.
    return null;
  }

  private getClient(): Stripe {
    if (!this.isConfigured()) throw new Error('Stripe is not configured (STRIPE_SECRET_KEY missing)');
    this.client ??= new Stripe(env.STRIPE_SECRET_KEY as string);
    return this.client;
  }

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const intent = await this.getClient().paymentIntents.create({
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

  /**
   * Stripe has no order|payment signature like Razorpay — a completed payment is
   * verified by fetching the PaymentIntent and checking it actually succeeded.
   * `paymentId` here is the PaymentIntent id returned by the client.
   */
  async verifyPayment({ paymentId }: VerifyPaymentInput): Promise<boolean> {
    const intent = await this.getClient().paymentIntents.retrieve(paymentId);
    return intent.status === 'succeeded';
  }

  verifyWebhook(signature: string, payload: Buffer): boolean {
    try {
      this.getClient().webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET ?? '');
      return true;
    } catch {
      return false;
    }
  }
}
