import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
];

export const DEFAULT_CURRENCY: CurrencyOption = CURRENCIES[0];

const KEY = 'wisora.currency';

interface CurrencyState {
  currency: CurrencyOption;
  setCurrency: (c: CurrencyOption) => void;
}

const CurrencyContext = createContext<CurrencyState | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [currency, setCurrencyState] = useState<CurrencyOption>(DEFAULT_CURRENCY);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((code) => {
        const found = CURRENCIES.find((c) => c.code === code);
        if (found) setCurrencyState(found);
      })
      .catch(() => undefined);
  }, []);

  const setCurrency = (c: CurrencyOption): void => {
    setCurrencyState(c);
    void AsyncStorage.setItem(KEY, c.code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyState {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
