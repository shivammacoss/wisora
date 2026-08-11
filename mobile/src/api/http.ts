import { API_BASE } from '../api';
import { clearSession, loadSession, saveSession, type Session } from './auth';

/** Single in-flight refresh shared across concurrent 401s (refresh tokens rotate). */
let refreshPromise: Promise<Session | null> | null = null;

async function doRefresh(): Promise<Session | null> {
  const session = await loadSession();
  if (!session?.tokens?.refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.tokens.refreshToken }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { user?: Session['user']; tokens?: Session['tokens'] } };
    const data = json.data;
    if (!data?.tokens?.accessToken) return null;
    const next: Session = { user: data.user ?? session.user, tokens: data.tokens };
    await saveSession(next); // persist the ROTATED refresh token too
    return next;
  } catch {
    return null;
  }
}

function refreshSession(): Promise<Session | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/** Authenticated JSON request. Attaches the access token and auto-refreshes on 401. */
export async function authRequest<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const send = async (token?: string): Promise<Response> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_BASE}${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  };

  const session = await loadSession();
  let res = await send(session?.tokens?.accessToken);

  // Access token likely expired → refresh once and retry.
  if (res.status === 401 && session?.tokens?.refreshToken) {
    const refreshed = await refreshSession();
    if (refreshed?.tokens?.accessToken) {
      res = await send(refreshed.tokens.accessToken);
    } else {
      await clearSession();
    }
  }

  let json: { data?: T; error?: { message?: string } } = {};
  try {
    json = (await res.json()) as typeof json;
  } catch {
    /* empty / non-json body (e.g. 204) */
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('Your session expired. Please log in again.');
    if (res.status === 403) throw new Error('You do not have permission for this.');
    throw new Error(json.error?.message ?? 'Request failed.');
  }
  return json.data as T;
}
