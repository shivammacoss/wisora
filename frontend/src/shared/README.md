# shared/

Code reused by **2+ features**. If only one feature uses it, it belongs inside
that feature instead.

- **components/ui/** — design-system primitives (Button, Card, Modal, Input).
  Dumb, reusable, no business logic, no API calls.
- **components/layout/** — page scaffolding (Header, Footer, Shell, Sidebar).
- **hooks/** — generic hooks (useDebounce, useMediaQuery).
- **lib/** — configured third-party clients: the single `axios` instance with
  auth/refresh/error interceptors, and `tokenStorage`.
- **utils/** — pure helpers (`cn`, `formatCurrency`).
- **constants/** — route paths and React Query keys.
- **types/** — global types, incl. the `ApiEnvelope` mirror of the backend shape.
- **styles/** — global CSS + Tailwind layers.
