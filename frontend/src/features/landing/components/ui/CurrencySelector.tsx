import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@shared/utils/cn';

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

/** Supported display currencies for the pricing teaser. */
export const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
];

interface CurrencySelectorProps {
  value: CurrencyOption;
  onChange: (currency: CurrencyOption) => void;
}

/** Accessible pill-shaped currency dropdown (Globe + code + chevron). */
export function CurrencySelector({ value, onChange }: CurrencySelectorProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-ink shadow-soft',
          'transition-colors duration-300 hover:border-gold/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        )}
      >
        <Globe className="h-4 w-4 text-gold" aria-hidden />
        <span>
          {value.code} {value.symbol}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-muted transition-transform duration-300', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select currency"
          className="absolute left-1/2 z-20 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-hairline bg-white p-1 shadow-lift"
        >
          {CURRENCIES.map((c) => {
            const selected = c.code === value.code;
            return (
              <li key={c.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors',
                    selected ? 'bg-cream-surface text-ink' : 'text-body hover:bg-cream-surface',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 font-semibold text-gold">{c.symbol}</span>
                    {c.label}
                  </span>
                  <span className="text-xs font-medium text-muted">{c.code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
