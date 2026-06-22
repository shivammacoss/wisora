import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@app/store';
import { ROUTES } from '@shared/constants';
import { authApi } from '../api/auth.api';
import type { LoginPayload } from '../types';

/** Login mutation: on success, persists the session and redirects to the library. */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => {
      setSession(result.user, result.tokens);
      navigate(ROUTES.library);
    },
  });
}
