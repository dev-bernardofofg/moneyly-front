'use client';

import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { InitialConfigDialog } from '@/components/dialogs/initial-config-dialog';
import { LoadingScreen } from '@/components/layout/loading-screen';

interface InitialConfigGuardProps {
  children: React.ReactNode;
}

export const InitialConfigGuard = ({ children }: InitialConfigGuardProps) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const needsInitialConfig = user?.firstAccess;

  useEffect(() => {
    // Se não há usuário autenticado, não faz nada (será redirecionado pelo auth guard)
    if (!user || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChecking(false);
      return;
    }

    // Se precisa de configuração inicial, mostra o dialog
    if (needsInitialConfig) {
      setShowConfigDialog(true);
      setIsChecking(false);
      return;
    }

    // Se chegou aqui, está tudo ok
    setIsChecking(false);
  }, [user, token, needsInitialConfig]);

  // Mostra loading enquanto verifica
  if (isChecking) {
    return <LoadingScreen />;
  }

  return (
    <>
      {children}
      {showConfigDialog && (
        <InitialConfigDialog
          open={showConfigDialog}
          onOpenChange={setShowConfigDialog}
          onSuccess={() => {
            setShowConfigDialog(false);
            router.push('/dashboard');
          }}
        />
      )}
    </>
  );
};
