// src/components/auth/UserMenu.tsx
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from './AuthModal';
import { useUserStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Crown, Coins, Bell, Award, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export function UserMenu() {
  const { user, logOut } = useAuth();
  const {
    credits,
    specialCredits,
    level,
    xp,
    xpMax,
    achievements,
    notifications,
    isPremium,
    isVerified,
    clearNotifications,
  } = useUserStore();
  const { toast } = useToast();

  const xpPercentage = (xp / xpMax) * 100;

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <AuthModal>
        <Button variant="default" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span>Entrar</span>
        </Button>
      </AuthModal>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full p-0 transition-colors hover:bg-primary/10"
          >
            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-primary/50 transition-colors hover:border-primary">
                <AvatarImage
                  src={
                    user.photoURL ||
                    `https://placehold.co/40x40.png?text=${user.displayName?.charAt(0) || 'U'}`
                  }
                  alt={user.displayName || 'User'}
                  className="transition-transform duration-300 hover:scale-110"
                />
                <AvatarFallback className="font-headline text-xs">
                  {user.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="mt-1 w-64 border border-primary/20 bg-background/95 p-2 shadow-2xl backdrop-blur-xl"
          align="end"
          forceMount
        >
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage
                src={
                  user.photoURL ||
                  `https://placehold.co/40x40.png?text=${user.displayName?.charAt(0) || 'U'}`
                }
                alt={user.displayName || 'User'}
              />
              <AvatarFallback className="font-headline text-sm">
                {user.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-none">
                {user.displayName || 'Utilizador'}
              </p>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-1 flex items-center gap-2"
              >
                <Badge variant="secondary" className="text-xs">
                  Nível {level}
                </Badge>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs">
                    <Crown className="mr-1 h-3 w-3" />
                    Pro
                  </Badge>
                )}
              </motion.div>
            </div>
          </div>

          <div className="mt-2 rounded-lg bg-muted/20 p-2">
            <div className="mb-1 flex justify-between text-xs">
              <span>
                Progresso XP: {xp}/{xpMax}
              </span>
              <span>{Math.round(xpPercentage)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50 shadow-inner">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>

          <DropdownMenuSeparator className="my-2" />

          <Link href="/member">
            <DropdownMenuItem className="cursor-pointer transition-colors hover:scale-[1.02] hover:bg-primary/10">
              <User className="mr-2 h-4 w-4 text-primary" />
              Meu Perfil
            </DropdownMenuItem>
          </Link>

          <Link href="/achievements">
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-primary/10">
              <Award
                className="mr-2 h-4 w-4 animate-pulse text-yellow-500"
                style={{ animationDuration: '3s' }}
              />
              <span>Conquistas</span>
              <Badge className="ml-auto bg-red-500 text-xs text-white">{achievements}</Badge>
            </DropdownMenuItem>
          </Link>

          <Link href="/premium">
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-primary/10">
              <Crown
                className="mr-2 h-4 w-4 animate-pulse text-amber-500"
                style={{ animationDuration: '3s' }}
              />
              Upgrade Premium
              {isPremium && (
                <Badge className="ml-auto bg-green-500 text-xs text-white">Ativo</Badge>
              )}
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-primary/10">
            <CreditCard className="mr-2 h-4 w-4 text-green-500" />
            Meus Créditos
            <span className="ml-auto text-xs text-muted-foreground">
              {credits.toLocaleString('pt-PT')}
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-primary/10">
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              Configurações
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="cursor-pointer text-red-500 transition-colors hover:bg-red-500/10"
            onClick={() => {
              handleLogout();
              toast({
                title: 'Sessão Terminada',
                description: 'Você foi desconectado com sucesso.',
              });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Terminar Sessão</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
