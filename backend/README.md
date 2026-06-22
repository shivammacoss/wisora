# Wisora Backend — Express + TypeScript + MongoDB

A layered, domain-modular REST API. Built for testability, type-safety, and
12-Factor compliance.

## Layering & request lifecycle

```
HTTP
 └─▶ routes/            versioned router mounts module routers under /api/v1
      └─▶ middleware     auth (JWT) → validate (Zod DTO) → rate-limit
           └─▶ controller   parses input, calls service, shapes response — NO db
                └─▶ service     business logic, framework-agnostic — NO req/res
                     └─▶ repository   the ONLY layer touching Mongoose
                          └─▶ model        schema definition only
```

**Rules:** Controllers never touch the DB. Services never touch `req`/`res`.
Repositories abstract Mongoose so services depend on an interface, not the ORM.

## Folder structure

```
src/
├── server.ts              # process entrypoint: load env, connect db, start http
├── app.ts                 # builds & configures the Express app (no listen)
│
├── config/                # 12-factor config: env parsing/validation, db, constants
│   ├── env.ts             #   parse + Zod-validate process.env into a typed object
│   ├── database.ts        #   Mongoose connection lifecycle
│   └── index.ts           #   barrel export
│
├── loaders/               # bootstrapping steps composed by app.ts
│   ├── express.ts         #   global middleware (helmet, cors, json, logging)
│   └── mongoose.ts        #   db connection loader
│
├── common/                # cross-cutting, framework-level building blocks
│   ├── errors/            #   AppError + typed subclasses
│   ├── middlewares/       #   errorHandler, notFound, auth, validate, rateLimiter
│   ├── utils/             #   ApiResponse, asyncHandler, logger, jwt, password
│   ├── interfaces/        #   shared TS contracts (e.g. AuthenticatedRequest)
│   ├── constants/         #   enums, role names, currency codes
│   └── types/             #   ambient/global type declarations
│
├── integrations/          # infrastructure adapters for 3rd-party services
│   ├── email/             #   Nodemailer transport + templated senders
│   └── payments/          #   Razorpay + Stripe gateway adapters
│
├── modules/               # ★ business domains (vertical layered slices)
│   └── <module>/
│       ├── <m>.routes.ts       # express.Router for the module
│       ├── <m>.controller.ts   # HTTP layer
│       ├── <m>.service.ts      # business logic
│       ├── <m>.repository.ts   # data access
│       ├── <m>.model.ts        # Mongoose schema/model
│       ├── <m>.dto.ts          # input/output contracts (types)
│       ├── <m>.validation.ts   # Zod schemas for requests
│       └── index.ts            # public surface of the module
│
├── routes/                # /api/v1 router that composes all module routers
└── database/seeds/        # seed scripts for local/dev data
```

Modules present: `auth`, `users`, `books`, `chapters`, `payments`, `library`.
`auth` is fully fleshed out as the reference implementation; the others are
placeholders following the same shape.

## Conventions

- **Path aliases:** `@config/*`, `@common/*`, `@modules/*`, `@integrations/*`,
  `@loaders/*`, `@routes/*`, `@/*` (see `tsconfig.json`). Resolved at build time
  by `tsc-alias`, at test time by Jest `moduleNameMapper`.
- **Response shape:** every endpoint returns `{ success, data, error, meta }`
  via the `ApiResponse` helper.
- **Errors:** throw an `AppError` subclass anywhere; the central `errorHandler`
  middleware serializes it. Wrap async controllers in `asyncHandler`.
- **Validation:** every request body/params/query is validated by a Zod schema
  through the `validate` middleware before reaching the controller.
- **DI:** services receive repositories (and integrations) via their constructor
  so tests can inject mocks.

## Scripts

```bash
npm run dev         # hot-reload dev server (tsx watch)
npm run build       # compile to dist/ (+ resolve path aliases)
npm start           # run compiled server
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # jest
npm run seed        # seed the database
```
