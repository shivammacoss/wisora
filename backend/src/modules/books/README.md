# Books module

Catalog of sacred texts (Bhagavad Gita, Bible, Quran, Tao Te Ching, Dhammapada…).

Follow the `auth` module shape:

```
books.model.ts        Mongoose schema: title, author/tradition, slug, coverImage,
                      description, language, chapterCount, isPublished
books.repository.ts   data access (list, findBySlug, search, paginate)
books.service.ts      business logic (catalog listing, filtering)
books.controller.ts   HTTP layer
books.dto.ts          BookDto, BookListItemDto
books.validation.ts   Zod schemas for query/params
books.routes.ts       GET /books, GET /books/:slug
index.ts              public surface
```
