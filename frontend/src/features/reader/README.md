# reader feature

The reading experience for a single chapter summary (typography, progress,
next/prev navigation, paywall handoff). Mirror the `auth` feature shape:

```
api/         useChapterContent(bookSlug, chapter)
components/  ChapterReader, ReaderToolbar, Paywall (locked CTA → payments)
hooks/       useReadingProgress
types/       ReaderState
index.ts     public surface
```
Consumed by `ReaderPage`. Triggers `payments` when a locked chapter is opened.
