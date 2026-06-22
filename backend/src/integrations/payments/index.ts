import { Currency } from '@common/constants';
import type { IPaymentGateway } from './payment.gateway';
import { RazorpayGateway } from './razorpay.gateway';
import { StripeGateway } from './stripe.gateway';

const razorpay = new RazorpayGateway();
const stripe = new StripeGateway();

/** Selects the right gateway for a currency (Razorpay → INR, Stripe → USD/EUR). */
export function getPaymentGateway(currency: Currency): IPaymentGateway {
  return currency === Currency.INR ? razorpay : stripe;
}

export type { IPaymentGateway, CreateOrderInput, CreateOrderResult } from './payment.gateway';
