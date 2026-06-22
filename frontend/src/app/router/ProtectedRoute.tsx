import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@app/store';
import { ROUTES } from '@shared/constants';

/** Route guard: redirects unauthenticated users to /login, preserving intent. */
export function ProtectedRoute(): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // No session → bounce back to the login gate (the home page).
    return <Navigate to={ROUTES.home} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
