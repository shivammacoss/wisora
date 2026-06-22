import type { Currency, UserRole } from '@shared/types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currency: Currency;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  currency?: Currency;
}

export interface AuthResult {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
}
