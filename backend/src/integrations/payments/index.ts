import { Currency, PaymentProvider } from '@common/constants';
import type { IPaymentGateway } from './payment.gateway';
import { RazorpayGateway } from './razorpay.gateway';
import { StripeGateway } from './stripe.gateway';

const razorpay = new RazorpayGateway();
const stripe = new StripeGateway();

/** Selects the right gateway for a currency (Razorpay → INR, Stripe → USD/EUR). */
export function getPaymentGateway(currency: Currency): IPaymentGateway {
  return currency === Currency.INR ? razorpay : stripe;
}

/** Selects a gateway by provider name — used when verifying a completed payment. */
export function getPaymentGatewayByProvider(provider: PaymentProvider): IPaymentGateway {
  return provider === PaymentProvider.RAZORPAY ? razorpay : stripe;
}

export type {
  IPaymentGateway,
  CreateOrderInput,
  CreateOrderResult,
  VerifyPaymentInput,
} from './payment.gateway';
