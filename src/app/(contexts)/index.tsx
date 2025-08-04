"use client";

import { ChildrenProps } from '@/app/(types)/global.type';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth-provider";
import { PeriodProvider } from "./period-provider";
import { ThemeProvider } from "./theme-provider";

export const queryClient = new QueryClient();

export const Contexts = ({ children }: ChildrenProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
          <ThemeProvider>
            <PeriodProvider>{children}</PeriodProvider>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};
