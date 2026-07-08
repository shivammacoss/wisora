import { http } from '@shared/lib/axios';
import type { ApiEnvelope } from '@shared/types';
import type { CreateOrderPayload, OrderResult, VerifyPayload } from '../types';

/** Raw endpoint calls for the payments feature. */
export const paymentsApi = {
  /** Create a gateway order (or a mock order in demo mode) for a chapter. */
  async createOrder(payload: CreateOrderPayload): Promise<OrderResult> {
    const { data } = await http.post<ApiEnvelope<OrderResult>>('/payments/order', payload);
    return data.data as OrderResult;
  },

  /** Verify a completed Checkout payment. Throws (rejects) if not verified. */
  async verify(payload: VerifyPayload): Promise<{ verified: boolean }> {
    const { data } = await http.post<ApiEnvelope<{ verified: boolean }>>('/payments/verify', payload);
    return data.data as { verified: boolean };
  },
};
