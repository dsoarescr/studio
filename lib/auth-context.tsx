'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao Pixel Universe.",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Utilizador não encontrado. Verifique o email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Password incorreta. Tente novamente.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido. Verifique o formato.";
      }
      
      toast({
        title: "Erro no Login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        await updateProfile(result.user, {
          displayName: displayName
        });
      }
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Pixel Universe!",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está em uso. Tente fazer login.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password muito fraca. Use pelo menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido. Verifique o formato.";
      }
      
      toast({
        title: "Erro no Registo",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Pixel Universe via Google.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no Login com Google",
        description: "Não foi possível fazer login com Google. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Pixel Universe via Facebook.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no Login com Facebook",
        description: "Não foi possível fazer login com Facebook. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithTwitter = async () => {
    try {
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Pixel Universe via Twitter.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no Login com Twitter",
        description: "Não foi possível fazer login com Twitter. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Pixel Universe via GitHub.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no Login com GitHub",
        description: "Não foi possível fazer login com GitHub. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado",
        description: "Até breve!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no Logout",
        description: "Não foi possível terminar a sessão.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email enviado!",
        description: "Verifique a sua caixa de entrada para redefinir a password.",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao enviar email de recuperação.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Utilizador não encontrado com este email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido. Verifique o formato.";
      }
      
      toast({
        title: "Erro na Recuperação",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signInWithGithub,
    logOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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