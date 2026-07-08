import { Currency, PaymentProvider } from '@common/constants';

/**
 * Provider-agnostic payment gateway contract. Razorpay (INR) and Stripe
 * (USD/EUR) each implement this; the payments module selects one by currency.
 * Depending on the interface (not the SDK) keeps the domain testable.
 */
export interface CreateOrderInput {
  amount: number; // smallest currency unit (paise/cents)
  currency: Currency;
  receipt: string; // internal reference (e.g. chapter purchase id)
}

export interface CreateOrderResult {
  providerOrderId: string;
  amount: number;
  currency: Currency;
}

/** Fields returned to the browser by a client-side checkout on success. */
export interface VerifyPaymentInput {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface IPaymentGateway {
  /** Which provider this adapter speaks to. */
  readonly provider: PaymentProvider;
  /** True only when the provider's secret credentials are present in the env. */
  isConfigured(): boolean;
  /** The publishable key the browser checkout needs (null when not applicable). */
  publicKey(): string | null;
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  /** Verify an authenticated client-side payment (post-checkout). */
  verifyPayment(input: VerifyPaymentInput): Promise<boolean>;
  /** Verify an async server-to-server webhook using its raw body. */
  verifyWebhook(signature: string, payload: Buffer): boolean;
}
