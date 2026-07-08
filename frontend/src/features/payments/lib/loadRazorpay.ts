const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loader: Promise<boolean> | null = null;

/**
 * Injects the Razorpay Checkout script once and resolves when it's ready.
 * Resolves `false` if it can't load (offline / blocked) so callers can fall
 * back gracefully. Memoized — concurrent callers share one script tag.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  loader ??= new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loader = null; // allow a retry on the next attempt
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loader;
}
