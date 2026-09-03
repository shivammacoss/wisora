import { z } from 'zod';

/** Route params: which book + chapter. */
export const chapterParamsSchema = z.object({
  bookSlug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid book slug'),
  chapterOrder: z.coerce.number().int().min(0).max(1000),
});

/** Body: the authored content — blocks plus optional title / essence overrides. */
export const saveContentSchema = z.object({
  blocks: z.array(z.string().max(5000)).max(1000),
  title: z.string().trim().max(200).optional(),
  essence: z.string().trim().max(2000).optional(),
});

/** Route param: just the book slug. */
export const bookSlugParamsSchema = z.object({
  bookSlug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid book slug'),
});

/** Body: seed the managed list from bundled chapters. */
export const initChaptersSchema = z.object({
  chapters: z
    .array(
      z.object({
        order: z.coerce.number().int().min(0).max(1000),
        title: z.string().trim().min(1).max(200),
        essence: z.string().trim().max(2000).optional(),
        readingTimeMins: z.coerce.number().int().min(1).max(600).optional(),
        isFree: z.boolean().optional(),
        blocks: z.array(z.string().max(5000)).max(1000).optional(),
      }),
    )
    .min(1)
    .max(1000),
});

/** Body: add a new chapter. */
export const addChapterSchema = z.object({
  title: z.string().trim().min(1).max(200),
  readingTimeMins: z.coerce.number().int().min(1).max(600).optional(),
  isFree: z.boolean().optional(),
});

/** Body: reorder — the new sequence of chapter ids. */
export const reorderChaptersSchema = z.object({
  order: z.array(z.string().trim().min(1)).min(1).max(1000),
});

export type ChapterParams = z.infer<typeof chapterParamsSchema>;
export type SaveContentDto = z.infer<typeof saveContentSchema>;
