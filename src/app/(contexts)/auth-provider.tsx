'use client';

import { deleteCookie, getCookie, setCookie } from '@/app/(utils)/cookies';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { PostAuthSignIn200, User } from '../(resources)/(generated)';

type AuthSuccessResponse = PostAuthSignIn200;

interface AuthContextProps {
  user: User | null;
  token: string | null;
  setAuth: (response: AuthSuccessResponse) => void;
  updateUser: (userData: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      localStorage.removeItem('auth_user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCookie('auth_token') || null;
  });
  const router = useRouter();

  const setAuth = ({ data }: AuthSuccessResponse) => {
    setUser(data.user);
    setToken(data.accessToken);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setCookie('auth_token', data.accessToken);
    if (data.refreshToken) {
      setCookie('refresh_token', data.refreshToken);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    deleteCookie('auth_token');
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
