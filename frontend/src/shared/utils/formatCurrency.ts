import type { Currency } from '@shared/types';

const LOCALE: Record<Currency, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
};

/** Formats a numeric amount in the user's local currency (drops .00 for whole amounts). */
export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(LOCALE[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
