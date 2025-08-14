'use client';

import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AuthModal } from './AuthModal';
import { Lock, LogIn, UserPlus } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <p className="text-muted-foreground">
              Você precisa estar logado para acessar esta página.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuthModal defaultTab="login">
              <Button className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
            </AuthModal>
            <AuthModal defaultTab="register">
              <Button variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Conta
              </Button>
            </AuthModal>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}