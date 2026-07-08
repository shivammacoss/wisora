import type { Currency, PaymentProvider } from '@common/constants';

/** Input/output contracts for the payments module (transport-agnostic). */

export interface CreateOrderDto {
  bookSlug: string;
  chapterOrder: number;
  currency: Currency;
}

/**
 * What the browser needs to launch checkout. In demo mode (no gateway keys)
 * `mock` is true and `orderId`/`keyId` are null — the client renders a stand-in
 * checkout sheet and no real charge occurs.
 */
export interface OrderResultDto {
  mock: boolean;
  provider: PaymentProvider;
  keyId: string | null;
  orderId: string | null;
  amount: number; // smallest currency unit (paise/cents)
  currency: Currency;
  receipt: string;
}

export interface VerifyPaymentDto {
  provider: PaymentProvider;
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyResultDto {
  verified: boolean;
}
