// src/components/auth/RequireAuth.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from './AuthModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, UserPlus } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <Card className="p-6 text-center">
          <CardContent className="px-0 pb-4 pt-6">
            <Lock className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Autenticação Necessária</h3>
            <p className="mb-6 text-muted-foreground">
              Precisa de iniciar sessão para aceder a esta funcionalidade.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <AuthModal defaultTab="login">
                <Button>Iniciar Sessão</Button>
              </AuthModal>
              <AuthModal defaultTab="register">
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Conta
                </Button>
              </AuthModal>
            </div>
          </CardContent>
        </Card>
      )
    );
  }

  return <>{children}</>;
}
