'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import { safeNextPath } from '../utils';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, next?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Listen for unrecoverable auth failure from the API client
  useEffect(() => {
    const handler = () => {
      setUser(null);
      router.push('/login');
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [router]);

  const login = useCallback(async (email: string, password: string, next?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setUser(res.data);
      router.push(safeNextPath(next, '/feed'));
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // ignore errors on logout
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  const refresh = useCallback(async () => {
    try {
      const res = await usersApi.me();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
