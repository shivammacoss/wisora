import { Platform } from 'react-native';

/** Serif display face for headlines — mirrors the web's Fraunces/serif type. */
export const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export interface Colors {
  gold: string;
  goldDeep: string;
  cream: string;
  creamSurface: string;
  surface: string;
  ink: string;
  body: string;
  muted: string;
  hairline: string;
  emerald: string;
}

/** Light palette — mirrors the web app's default tokens. */
export const lightColors: Colors = {
  gold: '#D4A017',
  goldDeep: '#B8860B',
  cream: '#FAFAF7',
  creamSurface: '#FBF6EC',
  surface: '#FFFFFF',
  ink: '#1A1A1A',
  body: '#4B5563',
  muted: '#9CA3AF',
  hairline: '#E5E7EB',
  emerald: '#059669',
};

/** Dark palette — mirrors the web app's `.dark` tokens (warm near-black). */
export const darkColors: Colors = {
  gold: '#D4A017',
  goldDeep: '#C79A2E',
  cream: '#14120E',
  creamSurface: '#1E1B15',
  surface: '#211E18',
  ink: '#F5F1E8',
  body: '#BEB8AC',
  muted: '#8D887D',
  hairline: '#342F26',
  emerald: '#10B981',
};

/** Static default (light) — kept for any module that reads colors at import time. */
export const colors = lightColors;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  full: 999,
} as const;

export const spacing = (n: number): number => n * 4;
