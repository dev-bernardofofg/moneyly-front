"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth-provider";
import { PeriodProvider } from "./period-provider";
import { ThemeProvider } from "./theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const queryClient = new QueryClient();

export const Contexts = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
          <ThemeProvider>
            <PeriodProvider>
              {children}</PeriodProvider>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};
