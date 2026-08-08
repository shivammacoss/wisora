import { API_BASE } from '../api';
import { loadSession } from './auth';

/** Authenticated JSON request. Attaches the stored access token as a Bearer header. */
export async function authRequest<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const session = await loadSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.tokens?.accessToken) {
    headers.Authorization = `Bearer ${session.tokens.accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

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
