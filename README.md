# Wisora Web

A full-stack web application.

- **Frontend** — React + Vite + TypeScript (feature-based architecture)
- **Backend** — NestJS + TypeScript (modular, layered architecture)

This repository follows a monorepo-style layout with two independently
deployable apps. Each app owns its own `package.json`, tooling, and lifecycle.

```
wisora_web/
├── frontend/        # React SPA  — see frontend/README.md
├── backend/         # NestJS API — see backend/README.md
└── README.md        # you are here
```

## Getting started

Each app is bootstrapped separately. Once you scaffold the actual tooling:

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (in a second terminal)
cd frontend
npm install
npm run dev
```

## Architecture principles

These conventions keep the codebase scalable as the team and feature set grow:

1. **Feature-first, not type-first** — group code by business domain
   (`features/auth`, `modules/users`), not by technical kind. A feature owns
   its UI, state, API calls, and types so it can grow or be deleted in one place.
2. **Clear layering on the backend** — `controller → service → repository`.
   Controllers handle HTTP, services hold business logic, repositories handle
   data access. No layer skips another.
3. **Shared code is explicit** — anything reused across features lives in
   `common/`, `shared/`, `lib/`, or `components/ui`. Features never import from
   each other directly; they go through shared modules.
4. **Configuration over hardcoding** — all environment-specific values come from
   `config/` modules that read validated env vars.
5. **Colocation of tests** — unit tests live next to the code; integration and
   e2e tests live under `test/` (backend) and `tests/` (frontend).
