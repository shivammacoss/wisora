import type { CookieOptions, Response } from 'express';
import { isProduction } from '@config/env';

/** Name of the httpOnly cookie that mirrors the refresh token. */
export const REFRESH_COOKIE = 'wisora_rt';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const baseOptions: CookieOptions = {
  httpOnly: true, // not readable by JS → mitigates XSS token theft
  secure: isProduction, // HTTPS-only in production
  sameSite: 'lax', // CSRF-resistant for top-level navigations
  path: '/api/v1/auth', // only sent to auth endpoints
};

/** Persist the refresh token as a hardened httpOnly cookie. */
export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, { ...baseOptions, maxAge: SEVEN_DAYS_MS });
}

/** Remove the refresh cookie (logout). */
export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, baseOptions);
}
