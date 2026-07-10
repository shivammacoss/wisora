import { create } from 'zustand';
import { tokenStorage, type AuthTokens } from '@shared/lib/tokenStorage';
import { USER_STORAGE_KEY } from '@shared/constants';
import type { Currency, UserRole } from '@shared/types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currency: Currency;
}

const GUEST_USER: AuthUser = {
  id: 'guest',
  name: 'Guest',
  email: 'guest@wisora.app',
  role: 'user',
  currency: 'INR',
};

/** Fake tokens for mock provider/email logins (no backend yet). */
const MOCK_TOKENS: AuthTokens = { accessToken: 'mock-access', refreshToken: 'mock-refresh' };

/** Persist the signed-in user so a refresh keeps them logged in. */
function persistUser(user: AuthUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}
function loadPersistedUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}
function clearPersistedUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Mock "accounts database" in localStorage so sign-up/login actually validate
 * (duplicate email check, wrong-password check). Swap for the real API later.
 */
const ACCOUNTS_STORAGE_KEY = 'wisora.accounts';
interface StoredAccount {
  name: string;
  email: string;
  password: string;
}
function loadAccounts(): StoredAccount[] {
  const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
}
function saveAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

/** Result returned by the email auth actions so the UI can show inline errors. */
export interface AuthResultStatus {
  ok: boolean;
  error?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  setSession: (user: AuthUser, tokens: AuthTokens) => void;
  continueAsGuest: () => void;
  loginWithMagicLink: (email: string) => void;
  signUp: (name: string, email: string, password: string) => AuthResultStatus;
  loginWithPassword: (email: string, password: string) => AuthResultStatus;
  logout: () => void;
}

// A persisted token means a real account session survived a refresh.
const persistedUser = loadPersistedUser();
const hasToken = Boolean(tokenStorage.get());

/** Global client-side auth/session state. Server data still flows via React Query. */
export const useAuthStore = create<AuthState>((set) => ({
  user: hasToken ? persistedUser : null,
  isAuthenticated: hasToken,
  isGuest: false,

  setSession: (user, tokens) => {
    tokenStorage.set(tokens);
    persistUser(user);
    set({ user, isAuthenticated: true, isGuest: false });
  },

  continueAsGuest: () => {
    // Guest mode: a temporary session — browse without an account, not persisted.
    set({ user: GUEST_USER, isAuthenticated: true, isGuest: true });
  },

  loginWithMagicLink: (email) => {
    // Mock magic-link sign-in — persisted across refresh.
    const name = email.split('@')[0] || 'Reader';
    const user: AuthUser = {
      id: `email-${email}`,
      name,
      email,
      role: 'user',
      currency: 'INR',
    };
    tokenStorage.set(MOCK_TOKENS);
    persistUser(user);
    set({ user, isAuthenticated: true, isGuest: false });
  },

  signUp: (name, email, password) => {
    const normalized = email.trim().toLowerCase();
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === normalized)) {
      return { ok: false, error: 'An account with this email already exists. Try logging in.' };
    }
    accounts.push({ name: name.trim(), email: normalized, password });
    saveAccounts(accounts);

    const user: AuthUser = {
      id: `email-${normalized}`,
      name: name.trim(),
      email: normalized,
      role: 'user',
      currency: 'INR',
    };
    tokenStorage.set(MOCK_TOKENS);
    persistUser(user);
    set({ user, isAuthenticated: true, isGuest: false });
    return { ok: true };
  },

  loginWithPassword: (email, password) => {
    const normalized = email.trim().toLowerCase();
    const account = loadAccounts().find((a) => a.email === normalized);
    if (!account || account.password !== password) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const user: AuthUser = {
      id: `email-${normalized}`,
      name: account.name,
      email: normalized,
      role: 'user',
      currency: 'INR',
    };
    tokenStorage.set(MOCK_TOKENS);
    persistUser(user);
    set({ user, isAuthenticated: true, isGuest: false });
    return { ok: true };
  },

  logout: () => {
    tokenStorage.clear();
    clearPersistedUser();
    set({ user: null, isAuthenticated: false, isGuest: false });
  },
}));
