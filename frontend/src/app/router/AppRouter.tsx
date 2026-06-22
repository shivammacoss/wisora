import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@shared/constants';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy-loaded pages → automatic code-splitting per route.
const LoginPage = lazy(() => import('@pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('@pages/ResetPasswordPage'));
const LibraryPage = lazy(() => import('@pages/LibraryPage'));
const BookDetailPage = lazy(() => import('@pages/BookDetailPage'));
const ReaderPage = lazy(() => import('@pages/ReaderPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage'));

const router = createBrowserRouter([
  // Public login gate.
  { path: ROUTES.home, element: <LoginPage /> },
  { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
  // Everything below requires a session (a real login OR "Continue as Guest").
  {
    element: <ProtectedRoute />,
    children: [
      { path: ROUTES.library, element: <LibraryPage /> },
      { path: ROUTES.bookDetail(), element: <BookDetailPage /> },
      { path: ROUTES.reader(), element: <ReaderPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
    ],
  },
]);

export function AppRouter(): JSX.Element {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
