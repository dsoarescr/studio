'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = () => {
      const savedUser = localStorage.getItem('pixel-universe-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate sign in
    const mockUser: User = {
      uid: 'mock-uid',
      email,
      displayName: 'PixelMaster',
      photoURL: null,
    };
    setUser(mockUser);
    localStorage.setItem('pixel-universe-user', JSON.stringify(mockUser));
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    // Simulate sign up
    const mockUser: User = {
      uid: 'mock-uid',
      email,
      displayName: displayName || 'PixelMaster',
      photoURL: null,
    };
    setUser(mockUser);
    localStorage.setItem('pixel-universe-user', JSON.stringify(mockUser));
  };

  const logOut = async () => {
    setUser(null);
    localStorage.removeItem('pixel-universe-user');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}