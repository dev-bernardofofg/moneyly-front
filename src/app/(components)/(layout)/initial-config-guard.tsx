'use client'

import { useAuth } from '@/app/(contexts)/auth-provider'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InitialConfigDialog } from '../(dialogs)/initial-config-dialog'
import { LoadingScreen } from './loading-screen'

interface InitialConfigGuardProps {
  children: React.ReactNode
}

export const InitialConfigGuard = ({ children }: InitialConfigGuardProps) => {
  const { user, token } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [showConfigDialog, setShowConfigDialog] = useState(false)

  const needsInitialConfig = user?.firstAccess

  useEffect(() => {
    // Se não há usuário autenticado, não faz nada (será redirecionado pelo auth guard)
    if (!user || !token) {
      setIsChecking(false)
      return
    }

    // Se precisa de configuração inicial, mostra o dialog
    if (needsInitialConfig) {
      setShowConfigDialog(true)
      setIsChecking(false)
      return
    }

    // Se já está configurado e está na rota de configuração, redireciona para dashboard
    if (!needsInitialConfig && pathname === '/initial-config') {
      router.replace('/dashboard')
      return
    }

    // Se chegou aqui, está tudo ok
    setIsChecking(false)
  }, [user, token, needsInitialConfig, pathname, router])

  // Mostra loading enquanto verifica
  if (isChecking) {
    return <LoadingScreen />
  }

  return (
    <>
      {children}
      {showConfigDialog && (
        <InitialConfigDialog
          open={showConfigDialog}
          onOpenChange={setShowConfigDialog}
          onSuccess={() => {
            setShowConfigDialog(false)
            router.push('/dashboard')
          }}
        />
      )}
    </>
  )
} 