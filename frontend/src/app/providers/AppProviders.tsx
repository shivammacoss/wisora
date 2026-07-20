import { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { config } from '@config/index';

/** Single React Query client for the app. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Composes all global providers (query, google-oauth, theme, etc.) in one place. */
export function AppProviders({ children }: PropsWithChildren): JSX.Element {
  const tree = <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

  // Only enable Google OAuth once a Client ID is configured in .env.
  return config.googleClientId ? (
    <GoogleOAuthProvider clientId={config.googleClientId}>{tree}</GoogleOAuthProvider>
  ) : (
    tree
  );
}
