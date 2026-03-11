'use client'

import { deleteCookie, getCookie, setCookie } from '@/app/(utils)/cookies'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthResponse, User } from '../(resources)/(generated)'

interface AuthContextProps {
  user: User | null
  token: string | null
  setAuth: (data: AuthResponse) => void
  updateUser: (userData: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
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
        deleteCookie('refresh_token')
        setUser(null)
        setToken(null)
        router.push('/auth')
      }
    }
  }, [])

  const setAuth = ({ data }: AuthResponse) => {
    setUser(data?.user ?? null)
    setToken(data?.accessToken ?? null)
    localStorage.setItem('auth_user', JSON.stringify(data?.user ?? null))
    setCookie('auth_token', data?.accessToken ?? '')
    if (data?.refreshToken) {
      setCookie('refresh_token', data.refreshToken ?? '')
    }
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
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
    <AuthContext.Provider value={{ user, token, setAuth, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
