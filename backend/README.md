# Backend — NestJS + TypeScript

A modular, **layered** NestJS architecture built for scale. Each business domain
is a self-contained **module**; cross-cutting concerns live in `common/`.

## Layering

```
HTTP request
   │
   ▼
Controller   →  handles routing, request/response, validation (DTOs)
   │
   ▼
Service      →  business logic, orchestration, transactions
   │
   ▼
Repository   →  data access (ORM queries); the ONLY layer touching the DB
   │
   ▼
Database
```

A layer only ever calls the layer directly below it. Controllers never touch
repositories; services never parse HTTP.

## Folder structure

```
backend/
└── src/
    ├── main.ts             # app bootstrap (entrypoint)
    ├── app.module.ts       # root module that wires everything together
    │
    ├── modules/            # ★ business domains, one folder per module
    │   ├── users/          # example module — replicate this shape
    │   │   ├── controllers/    # @Controller classes (HTTP layer)
    │   │   ├── services/       # @Injectable business logic
    │   │   ├── repositories/   # data-access classes
    │   │   ├── entities/       # ORM entities / schemas (DB models)
    │   │   ├── dto/            # request/response DTOs + validation
    │   │   └── interfaces/     # module-local TS contracts
    │   └── auth/           # authentication module
    │       ├── dto/
    │       ├── strategies/     # Passport strategies (JWT, local, OAuth)
    │       └── guards/         # auth/role guards specific to auth
    │
    ├── common/             # cross-cutting, reusable building blocks
    │   ├── decorators/     # custom @Decorators (@CurrentUser, @Roles)
    │   ├── filters/        # exception filters (global error formatting)
    │   ├── guards/         # shared guards (RolesGuard, ThrottlerGuard)
    │   ├── interceptors/   # logging, transform, timeout interceptors
    │   ├── middleware/     # Express/Nest middleware (request-id, logging)
    │   ├── pipes/          # validation/transformation pipes
    │   ├── constants/      # shared constants & tokens
    │   ├── interfaces/     # shared TS interfaces & types
    │   └── utils/          # pure helper functions
    │
    ├── config/            # @nestjs/config setup + env schema validation
    ├── database/          # DB connection, migrations, seeds, factories
    │   ├── migrations/    # versioned schema migrations
    │   ├── seeds/         # seed data scripts
    │   └── factories/     # test/seed data factories
    └── shared/            # shared providers/modules used across modules
                           # (MailModule, CacheModule, LoggerModule, etc.)

test/
├── unit/                 # *.spec.ts unit tests (also colocate next to code)
└── e2e/                  # *.e2e-spec.ts end-to-end tests
```

## Rules of the road

- **One module per domain.** A module owns its controller(s), service(s),
  repository, entities, and DTOs. Register them in the module's `*.module.ts`.
- **Modules talk via exported providers**, never by reaching into another
  module's internals. Export a service, import the module.
- **DTOs guard the boundary.** Every request body/query is a `class-validator`
  DTO. Entities are DB models — never expose them directly; map to response DTOs.
- **`common/` is global plumbing**; `shared/` is for reusable feature-agnostic
  modules (mailer, cache, logger). `config/` reads and validates env once.
- **Guards / pipes / filters / interceptors**: register globally in
  `app.module.ts` when cross-cutting, or per-route via decorators when scoped.

## How to add a new module

1. `nest g module modules/<name>` (or create the folder following `users/`).
2. Generate controller, service, and repository; wire them in `<name>.module.ts`.
3. Add DTOs in `dto/` and the entity in `entities/`.
4. Import the module into `app.module.ts`.
