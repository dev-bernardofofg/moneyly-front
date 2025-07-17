'use client'

import { AuthResponse, User } from '@/app/(types)/auth'
import { deleteCookie, getCookie, setCookie } from '@/app/(utils)/cookies'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextProps {
  user: User | null
  token: string | null
  setAuth: (data: AuthResponse) => void
  getMe: (data: AuthResponse) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    const cookieToken = getCookie('auth_token')

    if (storedUser && cookieToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(cookieToken)
      } catch {
        localStorage.removeItem('auth_user')
        deleteCookie('auth_token')
      }
    }
  }, [])

  const setAuth = ({ data }: AuthResponse) => {
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setCookie('auth_token', data.token)
  }

  const getMe = (data: AuthResponse) => {
    setUser(data.data.user)
    setToken(data.data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.data.user))
    setCookie('auth_token', data.data.token)
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    deleteCookie('auth_token')
    router.push('/auth')
  }

  return (
    <AuthContext.Provider value={{ user, token, setAuth, getMe, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
