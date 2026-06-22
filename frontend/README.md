# Wisora Frontend — React + Vite + TypeScript

A feature-sliced React SPA. Tailwind for styling, Zustand for client state,
React Query for server state, React Router for routing, Axios for HTTP.

## Folder structure

```
src/
├── main.tsx              # React entry: mounts <App/> with providers
├── vite-env.d.ts         # Vite/env type declarations
│
├── app/                  # application shell & global wiring
│   ├── App.tsx           #   composes providers + router
│   ├── providers/        #   QueryClient, theme, error boundary
│   ├── router/           #   route table, lazy routes, route guards
│   └── store/            #   global Zustand stores (auth/session, ui)
│
├── features/             # ★ vertical slices — one folder per domain
│   └── <feature>/        #   auth · books · chapters · reader · payments · profile · library
│       ├── api/          #     React Query hooks + endpoint calls
│       ├── components/   #     UI used only by this feature
│       ├── hooks/        #     feature-specific hooks
│       ├── store/        #     feature-local Zustand slice
│       ├── types/        #     feature types
│       ├── utils/        #     feature helpers
│       └── index.ts      #     PUBLIC API — the only thing other code imports
│
├── shared/               # used by 2+ features only
│   ├── components/ui/    #   design-system primitives (Button, Card, Modal)
│   ├── components/layout/#   Header, Footer, Shell, Sidebar
│   ├── hooks/            #   useDebounce, useMediaQuery…
│   ├── lib/              #   configured 3rd-party clients (axios instance)
│   ├── utils/            #   pure helpers (formatCurrency, cn)
│   ├── constants/        #   routes, query keys
│   ├── types/            #   global types (ApiEnvelope mirror)
│   └── styles/           #   global.css, Tailwind layers
│
├── pages/                # thin route components that COMPOSE features
├── assets/               # images, fonts, svgs
├── config/               # typed env access, feature flags
└── i18n/                 # internationalization (locales/)
```

## Rules

- **Features are isolated** — `features/A` must not import from `features/B`.
  Cross-feature reuse goes through `shared/`.
- **Import only a feature's `index.ts`**, never its internals.
- **Pages stay thin** — they arrange features and layout; logic lives in features.
- **One Axios instance** (`shared/lib/axios.ts`) owns base URL + auth/refresh/error
  interceptors. Feature `api/` files build on it.
- **Server state → React Query**, **client/UI state → Zustand**. Don't duplicate
  server data into Zustand.
- **Strict TS, no `any`.** Use the path aliases (`@features/*`, `@shared/*`, …).

## Scripts

```bash
npm run dev         # vite dev server (http://localhost:5173)
npm run build       # type-check + production build
npm run preview     # preview the build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # vitest
npm run test:e2e    # playwright
```
