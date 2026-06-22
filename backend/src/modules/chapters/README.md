# Chapters module

Chapter-by-chapter summaries belonging to a book. Chapter 1 is free; the rest
are unlocked per-user via the payments + library modules.

Follow the `auth` module shape:

```
chapters.model.ts        schema: bookId (ref), order, title, summary (rich text),
                         isFree (true only for order === 1), readingTimeMins
chapters.repository.ts   findByBook, findOne, listByBook
chapters.service.ts      enforces access: returns full summary only if isFree
                         OR the user owns it (checked via library module)
chapters.controller.ts   HTTP layer
chapters.dto.ts          ChapterDto, ChapterPreviewDto (locked)
chapters.validation.ts   Zod schemas
chapters.routes.ts       GET /books/:bookId/chapters, GET /chapters/:id
index.ts                 public surface
```
