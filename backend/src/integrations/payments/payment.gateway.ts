import { Currency } from '@common/constants';

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

export interface IPaymentGateway {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyWebhook(signature: string, payload: Buffer): boolean;
}
