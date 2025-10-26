// contexts/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import * as storage from '@/lib/storage';
import { hashPassword, verifyPassword } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const existingUser = storage.getUserByUsername(username);
      if (existingUser) {
        return false; // User already exists
      }

      const hashedPassword = await hashPassword(password);
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      storage.saveUser(newUser);
      storage.setCurrentUser(newUser.id);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = storage.getUserByUsername(username);
      if (!user) {
        return false;
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return false;
      }

      storage.setCurrentUser(user.id);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    storage.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
