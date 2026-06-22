# Users module

User profile management (the User schema itself lives in the `auth` module since
auth owns credentials). This module exposes profile read/update and account
operations.

Follow the `auth` module shape:

```
users.repository.ts   reuse/extend the auth User model (findById, updateProfile)
users.service.ts      profile business logic (update name/currency, etc.)
users.controller.ts   HTTP layer
users.dto.ts          UpdateProfileDto, ProfileDto
users.validation.ts   Zod schemas
users.routes.ts       GET /users/me, PATCH /users/me   (behind `authenticate`)
index.ts              public surface
```
