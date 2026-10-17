'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserInfo } from '@/types';
import { AUTH_SESSION_EXPIRES_AT_KEY, authService } from '@/services/auth.service';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const accessToken = localStorage.getItem('access_token');
    const expiresAtValue = localStorage.getItem(AUTH_SESSION_EXPIRES_AT_KEY);
    const expiresAt = Number(expiresAtValue);

    if (currentUser && !accessToken) {
      setUser(currentUser);
    } else if (currentUser && accessToken && expiresAtValue && Number.isFinite(expiresAt) && Date.now() < expiresAt) {
      setUser(currentUser);
      apiClient.setAccessToken(accessToken);
    } else if (currentUser || accessToken || localStorage.getItem('refresh_token')) {
      void authService.logout();
      router.replace('/login');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!user || !localStorage.getItem('access_token')) return;

    const expiresAt = Number(localStorage.getItem(AUTH_SESSION_EXPIRES_AT_KEY));
    const checkExpiry = () => {
      if (Date.now() >= expiresAt) {
        void logout();
      }
    };

    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      void logout();
      return;
    }

    const timeoutId = window.setTimeout(checkExpiry, expiresAt - Date.now());
    document.addEventListener('visibilitychange', checkExpiry);
    window.addEventListener('focus', checkExpiry);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', checkExpiry);
      window.removeEventListener('focus', checkExpiry);
    };
  }, [user, logout]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      setUser(response.user);
      authService.setCurrentUser(response.user);
      router.push('/products');
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const user = await authService.register({ username, password });
      setUser(user);
      authService.setCurrentUser(user);
      router.push('/products');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
