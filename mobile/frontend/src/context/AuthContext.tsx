import React, { createContext, useContext, useState } from 'react';
import { UserInfo } from '../api/interface';

type AuthContextType = {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (isLoggingOut: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggingOut, setIsLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};