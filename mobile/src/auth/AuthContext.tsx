import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSession,
  loadSession,
  login as apiLogin,
  register as apiRegister,
  saveSession,
  type AuthUser,
} from '../api/auth';

interface AuthState {
  user: AuthUser | null;
  ready: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const GUEST: AuthUser = {
  id: 'guest',
  name: 'Guest',
  email: '',
  role: 'user',
  currency: 'INR',
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSession()
      .then((s) => {
        if (s) setUser(s.user);
      })
      .finally(() => setReady(true));
  }, []);

  const value: AuthState = {
    user,
    ready,
    isGuest,
    async login(email, password) {
      const session = await apiLogin(email, password);
      await saveSession(session);
      setIsGuest(false);
      setUser(session.user);
    },
    async register(name, email, password) {
      const session = await apiRegister(name, email, password);
      await saveSession(session);
      setIsGuest(false);
      setUser(session.user);
    },
    continueAsGuest() {
      setIsGuest(true);
      setUser(GUEST);
    },
    async logout() {
      await clearSession();
      setIsGuest(false);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
