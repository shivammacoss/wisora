/** Wisora brand palette — mirrors the web app's tokens. */
export const colors = {
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
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  full: 999,
} as const;

export const spacing = (n: number): number => n * 4;
