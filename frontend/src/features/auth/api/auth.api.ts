import { http } from '@shared/lib/axios';
import type { ApiEnvelope } from '@shared/types';
import type { AuthResult, LoginPayload, RegisterPayload } from '../types';

/** Raw endpoint calls for the auth feature. Hooks wrap these with React Query. */
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await http.post<ApiEnvelope<AuthResult>>('/auth/login', payload);
    return data.data as AuthResult;
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await http.post<ApiEnvelope<AuthResult>>('/auth/register', payload);
    return data.data as AuthResult;
  },

  /** Request a password-reset link. `devResetUrl` is only present in development. */
  async forgotPassword(email: string): Promise<{ message: string; devResetUrl?: string }> {
    const { data } = await http.post<ApiEnvelope<{ message: string; devResetUrl?: string }>>(
      '/auth/forgot-password',
      { email },
    );
    return data.data as { message: string; devResetUrl?: string };
  },

  /** Set a new password using the token from the reset link. */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const { data } = await http.post<ApiEnvelope<{ message: string }>>('/auth/reset-password', {
      token,
      password,
    });
    return data.data as { message: string };
  },
};
