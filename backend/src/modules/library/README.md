# Library module

A user's "owned" chapters — the source of truth for lifetime access. A row is
created when a payment succeeds (or for free chapters on first read).

Follow the `auth` module shape:

```
library.model.ts        schema: userId, chapterId, bookId, acquiredAt, source
                        (free|purchase); unique compound index (userId, chapterId)
library.repository.ts   grantAccess, hasAccess, listOwnedByUser
library.service.ts      ownership checks consumed by the chapters module
library.controller.ts   HTTP layer
library.dto.ts          LibraryItemDto
library.validation.ts   Zod schemas
library.routes.ts       GET /library, GET /library/access/:chapterId
index.ts                public surface
```
