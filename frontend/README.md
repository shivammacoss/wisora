# Frontend — React + Vite + TypeScript

A scalable, **feature-based** React architecture (inspired by Feature-Sliced
Design and the bulletproof-react conventions). The guiding rule: **code that
changes together lives together.**

## Folder structure

```
frontend/
├── public/                 # static files served as-is (favicon, robots.txt)
└── src/
    ├── app/                # application shell & global wiring
    │   ├── providers/      # context providers (theme, auth, query client)
    │   ├── router/         # route definitions, route guards, lazy routes
    │   └── store/          # global store setup (Redux/Zustand root config)
    │
    ├── assets/             # static assets imported by code
    │   ├── images/
    │   ├── fonts/
    │   └── icons/
    │
    ├── components/         # SHARED, reusable presentational components
    │   ├── ui/             # design-system primitives (Button, Input, Modal)
    │   ├── layout/         # page scaffolding (Header, Sidebar, Footer, Shell)
    │   └── common/         # composite shared widgets (DataTable, EmptyState)
    │
    ├── config/             # typed env access & app-wide constants/flags
    ├── constants/          # enums, route paths, static maps
    │
    ├── features/           # ★ business domains — the heart of the app
    │   └── auth/           # example feature; replicate this shape per domain
    │       ├── api/        # data-fetching hooks/queries for this feature
    │       ├── components/ # UI used ONLY by this feature
    │       ├── hooks/      # feature-specific hooks
    │       ├── store/      # feature-local state slice
    │       ├── types/      # feature-specific TypeScript types
    │       └── utils/      # feature-specific helpers
    │
    ├── hooks/              # SHARED custom hooks (useDebounce, useMediaQuery)
    ├── lib/                # configured third-party clients (axios, dayjs, etc.)
    ├── pages/              # thin route components that compose features
    ├── services/           # cross-cutting API layer / HTTP client wrapper
    ├── store/              # cross-cutting global state slices
    ├── styles/             # global CSS, theme tokens, Tailwind/SCSS base
    ├── types/              # global/shared TypeScript types & module declarations
    └── utils/              # generic pure helpers (formatDate, classNames)

tests/
├── unit/                   # component & hook unit tests (Vitest + RTL)
└── e2e/                    # end-to-end tests (Playwright/Cypress)
```

## Rules of the road

- **Features are isolated.** `features/A` must NOT import from `features/B`.
  Share via `components/`, `hooks/`, `lib/`, or `services/` instead.
- **`pages/` stay thin.** A page wires features together and handles layout;
  business logic belongs inside the feature.
- **`components/ui` is your design system.** Dumb, reusable, no business logic,
  no API calls.
- **`lib/` vs `services/`** — `lib/` configures a third-party tool once (e.g. the
  axios instance with interceptors); `services/` exposes app API calls built on
  top of it.
- **Absolute imports** — configure `@/` → `src/` in `tsconfig` + Vite so you
  never write `../../../`.

## How to add a new feature

1. Create `src/features/<name>/` and mirror the `auth/` subfolder shape.
2. Keep all of the feature's UI, hooks, state, types, and API inside it.
3. Expose a small public surface via an `index.ts` barrel; import only that
   from outside the feature.
4. Add a route in `src/app/router/` and a thin wrapper in `src/pages/`.
