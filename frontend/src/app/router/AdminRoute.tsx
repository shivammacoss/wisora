import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@app/store';
import { ROUTES } from '@shared/constants';

/**
 * Route guard for the admin panel. Requires a signed-in user whose role is
 * `admin`. Unauthenticated users go to the login gate; signed-in non-admins are
 * bounced to their library.
 */
export function AdminRoute(): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);

  if (!isAuthenticated) return <Navigate to={ROUTES.home} replace />;
  if (role !== 'admin') return <Navigate to={ROUTES.library} replace />;
  return <Outlet />;
}
