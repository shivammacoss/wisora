export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/** How a user authenticates — local password or a federated provider. */
export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum Currency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
}

export enum PaymentProvider {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Price per unlockable chapter, in MAJOR units (₹1 / $1 / €1) — matches the
 * paywall display. Convert to a gateway's smallest unit (paise/cents) at the
 * point of charge, e.g. `CHAPTER_PRICE[currency] * 100`.
 */
export const CHAPTER_PRICE: Record<Currency, number> = {
  [Currency.INR]: 1,
  [Currency.USD]: 1,
  [Currency.EUR]: 1,
};
