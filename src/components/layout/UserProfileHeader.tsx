'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';
import { 
  User, LogIn, UserPlus, Coins, Gift, Crown, Settings, 
  Bell, Search, Menu, Zap, Trophy, Star
} from 'lucide-react';
import Link from 'next/link';

export default function UserProfileHeader() {
  const { user } = useAuth();
  const { credits, specialCredits, level, xp, xpMax, isPremium } = useUserStore();

  const xpPercentage = (xp / xpMax) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 h-14">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PU</span>
          </div>
          <span className="font-headline font-bold text-lg hidden sm:block">Pixel Universe</span>
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Credits Display */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{credits.toLocaleString()}</span>
                </div>
                
                {specialCredits > 0 && (
                  <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
                    <Gift className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{specialCredits}</span>
                  </div>
                )}
              </div>

              {/* Level and XP */}
              <div className="hidden lg:flex items-center gap-2">
                <Badge variant="secondary" className="font-code">
                  Nível {level}
                </Badge>
                <div className="w-16 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>

              {/* User Avatar */}
              <Link href="/member">
                <div className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded-lg transition-colors">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarImage 
                        src={user.photoURL || `https://placehold.co/32x32/D4A757/FFFFFF?text=${user.displayName?.charAt(0) || 'U'}`} 
                        alt={user.displayName || 'User'} 
                      />
                      <AvatarFallback className="text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isPremium && (
                      <Crown className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user.displayName || 'PixelMaster'}
                  </span>
                </div>
              </Link>

              {/* Settings */}
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <AuthModal defaultTab="login">
                <Button variant="ghost" size="sm">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}