import { create } from 'zustand';
import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyOption } from '@shared/constants/currencies';
import type { Currency } from '@shared/types';

const STORAGE_KEY = 'wisora.currency';

/** Restore the last-picked currency, defaulting to INR. */
function loadCurrency(): CurrencyOption {
  try {
    const code = localStorage.getItem(STORAGE_KEY);
    return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

interface CurrencyState {
  currency: CurrencyOption;
  setCurrency: (currency: CurrencyOption) => void;
}

/**
 * Global display currency. Defaults to INR and persists across refreshes so the
 * choice made on the pricing teaser also drives the chapter prices everywhere.
 */
export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: loadCurrency(),
  setCurrency: (currency) => {
    try {
      localStorage.setItem(STORAGE_KEY, currency.code);
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    set({ currency });
  },
}));

/** Currencies the payment gateways can actually charge in (Razorpay INR, Stripe USD/EUR). */
const PAYMENT_CURRENCIES: readonly Currency[] = ['INR', 'USD', 'EUR'];

/**
 * Maps a chosen display currency to one the backend can charge in. Currencies
 * without a configured gateway (GBP/JPY/AUD/CAD) fall back to INR for checkout.
 */
export function toPaymentCurrency(code: string): Currency {
  return (PAYMENT_CURRENCIES as readonly string[]).includes(code) ? (code as Currency) : 'INR';
}
