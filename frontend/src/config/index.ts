/** Typed, centralized access to Vite env vars + feature flags. */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME ?? 'Wisora',
  payments: {
    razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },
} as const;

/** Feature flags — flip behaviour without scattering conditionals. */
export const featureFlags = {
  enableI18n: false,
} as const;
