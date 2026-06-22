import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lock, X } from 'lucide-react';
import { Button } from '@features/landing/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { Currency } from '@shared/types';
import type { Book, Chapter } from '@features/books';

interface PaywallModalProps {
  open: boolean;
  book: Book;
  chapter: Chapter | null;
  currency: Currency;
  onClose: () => void;
  /** Confirm purchase → unlock the chapter and open the reader. */
  onConfirm: () => void;
}

/** Lightweight paywall for locked chapters. Mock — wire to real payments later. */
export function PaywallModal({
  open,
  book,
  chapter,
  currency,
  onClose,
  onConfirm,
}: PaywallModalProps): JSX.Element {
  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && chapter && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          {/* dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="paywall-title"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-gold/25 bg-cream-surface p-8 shadow-lift"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition-colors hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft">
              <Lock className="h-6 w-6 text-gold" />
            </div>

            <h2 id="paywall-title" className="mt-5 font-serif text-2xl font-bold text-ink">
              Unlock this chapter
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              <span className="font-semibold text-ink">
                Chapter {chapter.order} · {chapter.title}
              </span>{' '}
              from <span className="italic">{book.title}</span>. Pay once, read forever.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-serif text-5xl font-extrabold text-gold">
                {formatCurrency(1, currency)}
              </span>
              <span className="text-sm text-muted">lifetime access</span>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-body">
              {['One-time payment — no subscription', 'Yours forever across all devices'].map(
                (line) => (
                  <li key={line} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> {line}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
              <Button variant="gold" className="sm:flex-1" onClick={onConfirm}>
                Unlock for {formatCurrency(1, currency)}
              </Button>
              <Button variant="outline" className="sm:flex-1" onClick={onClose}>
                Maybe later
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Demo checkout — no real payment is taken.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
