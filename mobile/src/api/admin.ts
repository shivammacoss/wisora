import { authRequest } from './http';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  currency: string;
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

export const adminApi = {
  users: {
    list: (): Promise<AdminUser[]> =>
      authRequest<AdminUser[]>('/users?limit=100').then((d) => d ?? []),
    updateRole: (id: string, role: 'user' | 'admin'): Promise<AdminUser> =>
      authRequest<AdminUser>(`/users/${id}/role`, { method: 'PATCH', body: { role } }),
    remove: (id: string): Promise<void> =>
      authRequest<void>(`/users/${id}`, { method: 'DELETE' }),
  },
  feedback: {
    list: (): Promise<AdminFeedback[]> =>
      authRequest<AdminFeedback[]>('/feedback').then((d) => d ?? []),
    reply: (id: string, reply: string): Promise<AdminFeedback> =>
      authRequest<AdminFeedback>(`/feedback/${id}/reply`, { method: 'PATCH', body: { reply } }),
  },
  payments: {
    history: (): Promise<AdminPayment[]> =>
      authRequest<AdminPayment[]>('/payments/history').then((d) => d ?? []),
  },
};
