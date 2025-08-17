// app/page.tsx
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-gradient-gold">
            Pixel Universe
          </CardTitle>
          <p className="text-muted-foreground">
            Bem-vindo ao mapa interativo de Portugal
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Olá, {user.displayName || user.email}!
              </p>
              <Button className="w-full">
                Explorar Mapa
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AuthModal defaultTab="login">
                <Button variant="outline" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sessão
                </Button>
              </AuthModal>
              <AuthModal defaultTab="register">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </Button>
              </AuthModal>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}