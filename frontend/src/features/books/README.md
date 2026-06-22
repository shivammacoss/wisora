# books feature

Browse & search the catalog of sacred texts. Mirror the `auth` feature shape:

```
api/         useBooks(), useBook(slug) — React Query hooks on the axios instance
components/  BookGrid, BookCard, BookHeader
hooks/       useBookFilters
types/       Book, BookListItem
utils/       sortBooks
index.ts     public surface (export only what pages/other features need)
```
Consumed by `HomePage` and `BookDetailPage`.
