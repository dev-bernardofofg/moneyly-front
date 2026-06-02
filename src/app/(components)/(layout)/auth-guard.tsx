'use client';

import { useAuth } from '@/app/(contexts)/auth-provider';
import { LoadingScreen } from './loading-screen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, token } = useAuth();
  const isChecking = user === null && token === null;

  if (isChecking) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
