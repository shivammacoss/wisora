import { z } from 'zod';

export const createFeedbackSchema = z.object({
  subject: z.string().trim().min(2, 'Subject is too short').max(120),
  message: z.string().trim().min(2, 'Message is too short').max(2000),
});

export const replyFeedbackSchema = z.object({
  reply: z.string().trim().min(1, 'Reply cannot be empty').max(2000),
});

export type CreateFeedbackDto = z.infer<typeof createFeedbackSchema>;
export type ReplyFeedbackDto = z.infer<typeof replyFeedbackSchema>;
