# library feature

The user's owned (unlocked) chapters — their lifetime access list. Mirror the
`auth` feature shape:

```
api/         useLibrary(), useHasAccess(chapterId)
components/  OwnedChapters, ContinueReadingCard
hooks/       useOwnedChapter
types/       LibraryItem
index.ts     public surface
```
Consumed by `ProfilePage`; access checks are read by `chapters` and `reader`.
