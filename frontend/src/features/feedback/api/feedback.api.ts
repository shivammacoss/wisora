import { http } from '@shared/lib/axios';
import type { ApiEnvelope } from '@shared/types';

export interface MyFeedback {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'replied';
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

/** User-facing feedback endpoints. */
export const feedbackApi = {
  async submit(subject: string, message: string): Promise<MyFeedback | null> {
    const { data } = await http.post<ApiEnvelope<MyFeedback>>('/feedback', { subject, message });
    return data.data;
  },
  async mine(): Promise<MyFeedback[]> {
    const { data } = await http.get<ApiEnvelope<MyFeedback[]>>('/feedback/mine');
    return data.data ?? [];
  },
};
