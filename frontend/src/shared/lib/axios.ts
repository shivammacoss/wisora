import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@config/index';
import { tokenStorage } from './tokenStorage';
import type { ApiEnvelope } from '@shared/types';

/**
 * The single Axios instance for the whole app.
 * - Request interceptor: attaches the Bearer access token.
 * - Response interceptor: on 401, tries a one-time refresh, then retries.
 *   Unwraps the { success, data, error } envelope into `data` for callers.
 */
export const http = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const tokens = tokenStorage.get();
  if (tokens?.accessToken) {
    req.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return req;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const tokens = tokenStorage.get();
  if (!tokens?.refreshToken) return null;
  try {
    const { data } = await axios.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>(
      `${config.apiBaseUrl}/auth/refresh`,
      { refreshToken: tokens.refreshToken },
    );
    if (data.data) {
      tokenStorage.set(data.data);
      return data.data.accessToken;
    }
    return null;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      refreshing ??= refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      }
      tokenStorage.clear();
    }
    return Promise.reject(error);
  },
);

/** Helper that unwraps the API envelope and returns just the payload. */
export async function apiGet<T>(url: string): Promise<T> {
  const { data } = await http.get<ApiEnvelope<T>>(url);
  return data.data as T;
}
