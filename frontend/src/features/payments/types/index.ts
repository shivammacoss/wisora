import type { Currency } from '@shared/types';

/** Provider identifiers — mirror the backend `PaymentProvider` enum values. */
export type PaymentProvider = 'razorpay' | 'stripe';

/** Request body for `POST /payments/order`. */
export interface CreateOrderPayload {
  bookSlug: string;
  chapterOrder: number;
  currency: Currency;
}

/** Response from `POST /payments/order`. Mirrors the backend `OrderResultDto`. */
export interface OrderResult {
  mock: boolean;
  provider: PaymentProvider;
  keyId: string | null;
  orderId: string | null;
  amount: number; // smallest currency unit (paise/cents)
  currency: Currency;
  receipt: string;
}

/** Request body for `POST /payments/verify`. */
export interface VerifyPayload {
  provider: PaymentProvider;
  orderId: string;
  paymentId: string;
  signature: string;
}

/* ── Razorpay Checkout (loaded from checkout.razorpay.com) ────────────────── */

/** Shape returned by Razorpay Checkout to the success handler. */
export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccess) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

export interface RazorpayInstance {
  open(): void;
  on(event: 'payment.failed', handler: (response: unknown) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
