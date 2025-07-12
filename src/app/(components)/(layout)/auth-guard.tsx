'use client'

import { useAuth } from '@/app/(contexts)/auth-provider'
import { useEffect, useState } from 'react'
import { LoadingScreen } from './loading-screen'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (user !== null || token !== null) {
      setIsChecking(false)
    }
  }, [user, token])

  if (isChecking) {
    return <LoadingScreen />
  }

  return <>{children}</>
} 