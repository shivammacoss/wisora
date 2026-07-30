import { z } from 'zod';

/** Route params: which book + chapter. */
export const chapterParamsSchema = z.object({
  bookSlug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid book slug'),
  chapterOrder: z.coerce.number().int().positive().max(1000),
});

/** Body: the authored content as an array of blocks. */
export const saveContentSchema = z.object({
  blocks: z.array(z.string().max(5000)).max(1000),
});

export type ChapterParams = z.infer<typeof chapterParamsSchema>;
export type SaveContentDto = z.infer<typeof saveContentSchema>;
