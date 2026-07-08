import { useCallback, useRef, useState } from 'react';
import { config } from '@config/index';
import { useAuthStore } from '@app/store';
import type { Currency } from '@shared/types';
import type { Book, Chapter } from '@features/books';
import { paymentsApi } from '../api/payments.api';
import { loadRazorpayScript } from '../lib/loadRazorpay';
import type { OrderResult, RazorpaySuccess } from '../types';

/** Wisora brand gold — themes the Razorpay Checkout surface. */
const BRAND_COLOR = '#D4A017';

interface UseChapterCheckoutOptions {
  /** Called once payment is verified — grant access here. */
  onSuccess: (chapter: Chapter) => void;
}

interface UseChapterCheckout {
  /** Kick off checkout for a chapter — opens Razorpay Checkout. */
  start: (book: Book, chapter: Chapter, currency: Currency) => void;
  /** True while creating the order / opening checkout / verifying. */
  processing: boolean;
  /** Human-readable error from the last attempt (null when clear). */
  error: string | null;
  clearError: () => void;
}

/**
 * Orchestrates a chapter unlock via Razorpay Checkout:
 *  1. Ask the backend to create an order.
 *  2. Open Razorpay Checkout with that order.
 *  3. Verify the returned signature server-side before granting access.
 *
 * Razorpay requires configured keys — if the gateway isn't set up (or the
 * script can't load) we surface a clear error rather than a fake checkout.
 */
export function useChapterCheckout({ onSuccess }: UseChapterCheckoutOptions): UseChapterCheckout {
  const user = useAuthStore((s) => s.user);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest values without changing `start`'s identity every render.
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const userRef = useRef(user);
  userRef.current = user;

  const verifyAndGrant = useCallback(
    async (order: OrderResult, chapter: Chapter, response: RazorpaySuccess): Promise<void> => {
      setProcessing(true);
      try {
        const { verified } = await paymentsApi.verify({
          provider: order.provider,
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        if (verified) {
          onSuccessRef.current(chapter);
        } else {
          setError('We could not verify your payment. If you were charged, contact support.');
        }
      } catch {
        setError('We could not verify your payment. If you were charged, contact support.');
      } finally {
        setProcessing(false);
      }
    },
    [],
  );

  const openRazorpay = useCallback(
    (order: OrderResult, book: Book, chapter: Chapter): void => {
      if (!window.Razorpay || !order.keyId || !order.orderId) return;

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: config.appName,
        description: `Chapter ${chapter.order} · ${chapter.title}`,
        order_id: order.orderId,
        prefill: {
          name: userRef.current?.name,
          email: userRef.current?.email,
        },
        notes: { bookSlug: book.slug, chapterOrder: String(chapter.order) },
        theme: { color: BRAND_COLOR },
        handler: (response: RazorpaySuccess) => {
          void verifyAndGrant(order, chapter, response);
        },
        modal: {
          // User closed the sheet without paying — just stop the spinner.
          ondismiss: () => setProcessing(false),
        },
      });

      rzp.on('payment.failed', () => {
        setError('Payment failed. No money was deducted — please try again.');
        setProcessing(false);
      });

      rzp.open();
      // Razorpay now owns the screen; our own "opening…" spinner can stop.
      setProcessing(false);
    },
    [verifyAndGrant],
  );

  const start = useCallback(
    async (book: Book, chapter: Chapter, currency: Currency): Promise<void> => {
      setError(null);
      setProcessing(true);

      let order: OrderResult;
      try {
        order = await paymentsApi.createOrder({
          bookSlug: book.slug,
          chapterOrder: chapter.order,
          currency,
        });
      } catch {
        setProcessing(false);
        setError('Could not reach the payment server. Please try again.');
        return;
      }

      // Gateway not configured (no keys) → real Razorpay can't render.
      if (order.mock || !order.orderId || !order.keyId) {
        setProcessing(false);
        setError('Payments are not configured yet. Please add Razorpay keys and try again.');
        return;
      }

      const ready = await loadRazorpayScript();
      if (!ready || !window.Razorpay) {
        setProcessing(false);
        setError('Could not load Razorpay Checkout. Check your connection and try again.');
        return;
      }

      openRazorpay(order, book, chapter);
    },
    [openRazorpay],
  );

  const clearError = useCallback((): void => setError(null), []);

  return {
    start: (book, chapter, currency) => void start(book, chapter, currency),
    processing,
    error,
    clearError,
  };
}
