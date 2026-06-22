import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Path aliases mirror tsconfig.json "paths".
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': r('./src'),
      '@app': r('./src/app'),
      '@features': r('./src/features'),
      '@shared': r('./src/shared'),
      '@components': r('./src/shared/components'),
      '@hooks': r('./src/shared/hooks'),
      '@lib': r('./src/shared/lib'),
      '@utils': r('./src/shared/utils'),
      '@pages': r('./src/pages'),
      '@config': r('./src/config'),
      '@assets': r('./src/assets'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
