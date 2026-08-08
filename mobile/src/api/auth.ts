import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  currency: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export interface Session {
  user: AuthUser;
  tokens: Tokens;
}

const SESSION_KEY = 'wisora.session';

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
export async function loadSession(): Promise<Session | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

async function authRequest(path: string, body: unknown): Promise<Session> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { data?: Session; error?: { message?: string } };
  if (!res.ok || !json.data) {
    throw new Error(json.error?.message ?? 'Something went wrong. Please try again.');
  }
  return json.data;
}

export function login(email: string, password: string): Promise<Session> {
  return authRequest('/auth/login', { email, password });
}
export function register(name: string, email: string, password: string): Promise<Session> {
  return authRequest('/auth/register', { name, email, password });
}
