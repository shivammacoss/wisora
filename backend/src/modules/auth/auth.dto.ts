import type { UserRole, Currency } from '@common/constants';

/** Input/output contracts for the auth module (transport-agnostic). */

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  currency?: Currency;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currency: Currency;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResultDto {
  user: AuthUserDto;
  tokens: AuthTokensDto;
}
