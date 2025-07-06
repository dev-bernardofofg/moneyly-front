'use client'

import { useAuth } from '@/app/(contexts)/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingScreen } from './loading-screen'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, token } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      router.replace('/auth')
      return
    }

    setIsChecking(false)
  }, [user, token, router])

  if (isChecking) {
    return <LoadingScreen />
  }

  return <>{children}</>
} 