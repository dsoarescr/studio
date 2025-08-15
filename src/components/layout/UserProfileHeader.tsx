'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { LogIn, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import Image from 'next/image';

export default function UserProfileHeader() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-card/80 backdrop-blur-md border-b border-primary/20"
      style={{ '--header-height': '60px' } as React.CSSProperties}
    >
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pixel Universe Logo" width={40} height={40} />
          {!isMobile && (
            <h1 className="text-xl font-headline font-bold text-gradient-gold">
              Pixel Universe
            </h1>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <AuthModal defaultTab="login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </AuthModal>
            <AuthModal defaultTab="register">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Registar
              </Button>
            </AuthModal>
          </>
        )}
      </div>
    </header>
  );
}
