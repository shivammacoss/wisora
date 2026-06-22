# Wisora — Sacred Wisdom, Daily

A book-summary platform delivering chapter-by-chapter summaries of sacred texts
(Bhagavad Gita, Bible, Quran, Tao Te Ching, Dhammapada, …). The first chapter of
every book is free; each subsequent chapter costs **1 unit of the user's local
currency (₹1 / $1 / €1)** for **lifetime access**.

---

## Monorepo layout

```
wisora/
├── frontend/        React + Vite + TypeScript + Tailwind + Zustand + React Router + Axios
├── backend/         Node.js + Express + TypeScript + MongoDB (Mongoose) + JWT + Razorpay + Stripe + Nodemailer
├── .github/         CI/CD workflows
├── docker-compose.yml
└── README.md
```

Each app is independently deployable and owns its own `package.json`, tooling,
Dockerfile, and lifecycle. The root `package.json` provides convenience scripts
and shared Git hooks.

---

## Architecture overview

### Guiding principles

| Principle | How it shows up |
| --- | --- |
| **Separation of concerns** | Strict layers on the backend (`route → controller → service → repository → model`); vertical feature slices on the frontend. |
| **Domain-driven modularity** | Code is grouped by business domain (`auth`, `books`, `chapters`, `payments`…), not by technical type. |
| **Clean / layered architecture** | Business logic is framework-agnostic and never imports HTTP or DB concerns directly. |
| **SOLID + SRP** | One responsibility per file; services depend on repository *interfaces*, not concretions. |
| **Dependency injection** | Services receive their repositories/integrations via constructor injection, making them mockable. |
| **Scalability** | A new feature is a new folder — adding it touches no unrelated code. |
| **Testability** | Layers communicate through typed interfaces and DTOs; every dependency is injectable. |
| **Type safety end-to-end** | `strict: true`, no implicit `any`, shared DTO contracts. |
| **12-Factor compliance** | Config from env, stateless processes, explicit dependencies, dev/prod parity via Docker. |

### Backend layering

```
HTTP ─▶ Route ─▶ Middleware (auth, validate) ─▶ Controller ─▶ Service ─▶ Repository ─▶ Mongoose Model ─▶ MongoDB
                                                    │            │
                                              (HTTP only)  (business logic,
                                                            framework-agnostic)
```

- **Controllers** parse/validate input and shape the HTTP response — never touch the DB.
- **Services** hold business logic — never touch `req`/`res`.
- **Repositories** are the only layer that talks to Mongoose.
- **DTOs** define input/output contracts; **Zod** validates requests at the edge.
- Custom error classes (`AppError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`) are caught by a central error middleware.
- Every response uses the shape `{ success, data, error, meta }`.
- All routes are versioned under `/api/v1/...`.

### Frontend architecture

- **Feature folders are self-contained** — a feature can be deleted without breaking others.
- **`shared/`** holds only code used by **2+** features.
- **Pages are thin** — they compose features, they don't implement logic.
- A **single Axios instance** with interceptors handles auth, errors, and token refresh.
- **Strict TypeScript** everywhere; no `any`.

---

## Folder structure rationale

- **Why vertical slices (frontend)?** Grouping by feature keeps everything that
  changes together in one place, so features stay independent and deletable.
- **Why layered modules (backend)?** Clear boundaries make business logic
  testable in isolation and let us swap the persistence or transport layer
  without rewriting domain code.
- **Why `integrations/`?** Third-party concerns (email, Razorpay, Stripe) are
  infrastructure — isolating them behind interfaces keeps the domain pure.

---

## Setup & run

### Prerequisites
- Node.js ≥ 20, npm ≥ 10
- Docker + Docker Compose (for the containerized workflow)
- A MongoDB instance (local, Atlas, or the bundled Docker service)

### Local (without Docker)

```bash
# install everything (root + workspaces)
npm install

# backend
cd backend
cp .env.example .env        # fill in secrets
npm run dev                 # http://localhost:8080

# frontend (second terminal)
cd frontend
cp .env.example .env
npm run dev                 # http://localhost:5173
```

### Docker (everything at once)

```bash
docker compose up --build
# frontend → http://localhost:5173
# backend  → http://localhost:8080
# mongo    → mongodb://localhost:27017
```

---

## Coding conventions

- **Language:** TypeScript everywhere, `strict: true`, no `any`.
- **Imports:** use path aliases (`@/...`) — no `../../../` chains.
- **Naming:** `camelCase` for variables/functions, `PascalCase` for types/components/classes, `SCREAMING_SNAKE_CASE` for constants.
- **Files:** one responsibility per file. Backend module files are suffixed by role (`*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.model.ts`, `*.dto.ts`, `*.routes.ts`, `*.validation.ts`).
- **Linting/formatting:** ESLint + Prettier, enforced on commit via Husky + lint-staged.
- **Commits:** Conventional Commits, enforced by commitlint (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`…).

## Branching strategy

- `main` — production, always deployable. Protected.
- `develop` — integration branch for the next release.
- `feat/<scope>` — new features, branched from `develop`.
- `fix/<scope>` — bug fixes.
- `hotfix/<scope>` — urgent production fixes, branched from `main`.

PRs require passing CI (lint + test + build) and at least one review before merge.
