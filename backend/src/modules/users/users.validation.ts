import { z } from 'zod';
import { Currency } from '@common/constants';

/** Zod schemas for the users module (consumed by the `validate` middleware). */

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(80).optional(),
    currency: z.nativeEnum(Currency).optional(),
  })
  .refine((d) => d.name !== undefined || d.currency !== undefined, {
    message: 'Provide at least one field to update',
  });

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
