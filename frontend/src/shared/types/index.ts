/** Mirror of the backend response envelope: { success, data, error, meta }. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { message: string; details?: unknown } | null;
  meta?: Record<string, unknown>;
}

export type Currency = 'INR' | 'USD' | 'EUR';
export type UserRole = 'user' | 'admin';
