import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, type Colors } from '../theme';

export type ThemeMode = 'light' | 'dark';

const KEY = 'wisora.theme';

interface ThemeState {
  mode: ThemeMode;
  colors: Colors;
  isDark: boolean;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((m) => {
        if (m === 'dark' || m === 'light') setModeState(m);
      })
      .catch(() => undefined);
  }, []);

  const setMode = (m: ThemeMode): void => {
    setModeState(m);
    void AsyncStorage.setItem(KEY, m);
  };

  const value: ThemeState = {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    isDark: mode === 'dark',
    toggle: () => setMode(mode === 'dark' ? 'light' : 'dark'),
    setMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
