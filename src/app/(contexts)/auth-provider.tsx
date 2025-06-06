'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthResponse } from '../(types)/auth'

interface AuthContextProps {
  user: AuthResponse['user'] | null
  token: string | null
  setAuth: (data: AuthResponse) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
      }
    }
  }, [])

  const setAuth = (data: AuthResponse) => {
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    localStorage.setItem('auth_token', data.token)
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, setAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
