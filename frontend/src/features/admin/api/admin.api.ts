import { http } from '@shared/lib/axios';
import type { ApiEnvelope, Currency, UserRole } from '@shared/types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currency: Currency;
  createdAt: string;
}

export interface AdminFeedback {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'replied';
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  provider: string;
  currency: string;
  amount: number;
  chapterOrder: number;
  receipt: string;
  orderId?: string;
  paymentId?: string;
  status: string;
  createdAt: string;
}

/** All admin-only endpoints. Requires an admin access token (sent by the http client). */
export const adminApi = {
  users: {
    async list(): Promise<AdminUser[]> {
      const { data } = await http.get<ApiEnvelope<AdminUser[]>>('/users', { params: { limit: 100 } });
      return data.data ?? [];
    },
    async updateRole(id: string, role: UserRole): Promise<AdminUser | null> {
      const { data } = await http.patch<ApiEnvelope<AdminUser>>(`/users/${id}/role`, { role });
      return data.data;
    },
    async remove(id: string): Promise<void> {
      await http.delete(`/users/${id}`);
    },
  },
  feedback: {
    async list(): Promise<AdminFeedback[]> {
      const { data } = await http.get<ApiEnvelope<AdminFeedback[]>>('/feedback');
      return data.data ?? [];
    },
    async reply(id: string, reply: string): Promise<AdminFeedback | null> {
      const { data } = await http.patch<ApiEnvelope<AdminFeedback>>(`/feedback/${id}/reply`, { reply });
      return data.data;
    },
  },
  payments: {
    async history(): Promise<AdminPayment[]> {
      const { data } = await http.get<ApiEnvelope<AdminPayment[]>>('/payments/history');
      return data.data ?? [];
    },
  },
};
