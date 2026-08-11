import { authRequest } from './http';

export interface MyFeedback {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'replied';
  createdAt: string;
}

/** Submit reader feedback for a chapter. Requires a logged-in (non-guest) session. */
export function submitFeedback(subject: string, message: string): Promise<MyFeedback> {
  return authRequest<MyFeedback>('/feedback', { method: 'POST', body: { subject, message } });
}
