'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-provider';
import { PeriodProvider } from '@/contexts/period-provider';
import { ThemeProvider } from '@/contexts/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export const Contexts = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <ThemeProvider>
              <PeriodProvider>{children}</PeriodProvider>
            </ThemeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};
