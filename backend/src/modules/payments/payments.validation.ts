import { z } from 'zod';
import { Currency, PaymentProvider } from '@common/constants';

/** Zod schemas consumed by the `validate` middleware at the HTTP boundary. */

export const createOrderSchema = z.object({
  bookSlug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid book slug'),
  chapterOrder: z.coerce.number().int().positive().max(1000),
  currency: z.nativeEnum(Currency).default(Currency.INR),
});

export const verifyPaymentSchema = z.object({
  provider: z.nativeEnum(PaymentProvider),
  orderId: z.string().min(1).max(120),
  paymentId: z.string().min(1).max(120),
  signature: z.string().min(1).max(256),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
