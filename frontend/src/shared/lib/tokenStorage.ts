import { TOKEN_STORAGE_KEY } from '@shared/constants';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Small wrapper around localStorage so token access is centralized & typed. */
export const tokenStorage = {
  get(): AuthTokens | null {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  },
  set(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  },
  clear(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};
