/** Public API of the auth feature — import only from here. */
export { AuthModal } from './components/AuthModal';
export { LoginForm } from './components/LoginForm';
export { useLogin } from './hooks/useLogin';
export { authApi } from './api/auth.api';
export type { AuthUser, LoginPayload, RegisterPayload, AuthResult } from './types';
