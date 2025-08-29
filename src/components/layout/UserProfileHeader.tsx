'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationCenter from '@/components/layout/NotificationCenter';
import { RealTimeChat } from '@/components/features/RealTimeChat';

import { useUserStore } from '@/lib/store';
import SearchSystem from './SearchSystem';
import {
  Award,
  Sparkles,
  Gift,
  Bell,
  Settings,
  Menu,
  Search,
  Plus,
  Crown,
  Star,
  LogOut,
  HelpCircle,
  BarChart3,
  Users,
  Palette,
  Coins,
  Home,
  ShoppingCart,
  RefreshCw,
  Shield,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HelpCenter from '@/components/features/HelpCenter';
import { useAuth } from '@/lib/auth-context';
import { UserMenu } from '@/components/auth/UserMenu';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';
import { useAppStore } from '@/lib/store';

const navLinks = [
  {
    href: '/',
    label: 'Universo',
    icon: Home,
    color: 'text-blue-500',
    description: 'Explorar o mapa',
  },
  {
    href: '/marketplace',
    label: 'Market',
    icon: ShoppingCart,
    color: 'text-green-500',
    description: 'Comprar píxeis',
  },
  {
    href: '/pixels',
    label: 'Galeria',
    icon: Palette,
    color: 'text-purple-500',
    badge: 12,
    description: 'Ver píxeis',
  },
  {
    href: '/member',
    label: 'Perfil',
    icon: Users,
    color: 'text-orange-500',
    description: 'Seu perfil',
  },
  {
    href: '/ranking',
    label: 'Ranking',
    icon: BarChart3,
    color: 'text-amber-500',
    badge: 2,
    description: 'Classificações',
  },
  {
    href: '/community',
    label: 'Comunidade',
    icon: Users,
    color: 'text-pink-500',
    description: 'Interagir com a comunidade',
  },
  {
    href: '/settings',
    label: 'Ajustes',
    icon: Settings,
    color: 'text-gray-500',
    description: 'Configurações',
  },
  {
    href: '/achievements',
    label: 'Conquistas',
    icon: Award,
    color: 'text-yellow-500',
    description: 'Suas conquistas',
  },
];

export default function UserProfileHeader() {
  const {
    credits,
    specialCredits,
    level,
    xp,
    xpMax,
    pixels,
    achievements,
    notifications,
    isPremium,
    isVerified,
    clearNotifications,
  } = useUserStore();

  const pathname = usePathname();
  const { user } = useAuth();
  const { isOnline } = useAppStore();

  const [formattedCredits, setFormattedCredits] = useState<string | null>(null);
  const [formattedSpecialCredits, setFormattedSpecialCredits] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Combine store data with mock data for a complete user object
  const userData = {
    name: 'PixelMasterPT',
    avatarUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'profile avatar',
    level,
    xp,
    xpMax,
    credits,
    specialCredits,
    pixels,
    achievements,
    notifications,
    isPremium,
    isVerified,
  };

  useEffect(() => {
    setFormattedCredits(credits.toLocaleString('pt-PT'));
    setFormattedSpecialCredits(specialCredits.toLocaleString('pt-PT'));
  }, [credits, specialCredits]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const xpPercentage = (xp / xpMax) * 100;

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500',
        isScrolled
          ? 'border-primary/20 bg-background/95 shadow-lg shadow-primary/10 backdrop-blur-xl'
          : 'border-transparent bg-background/70 backdrop-blur-md'
      )}
    >
      {/* Animated background */}
      <div
        className="animate-shimmer absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
        style={{ backgroundSize: '300% 100%' }}
      />

      <div className="container relative flex h-14 max-w-screen-2xl items-center justify-between px-3 sm:px-4">
        {/* Left: Logo + Menu (Mobile) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-colors hover:bg-primary/10 sm:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="border-b bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                <div className="animate-fade-in flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-primary shadow-lg">
                      <AvatarImage
                        src={userData.avatarUrl}
                        alt={userData.name}
                        data-ai-hint={userData.dataAiHint}
                      />
                      <AvatarFallback className="font-headline text-3xl">
                        {userData.name.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                      <Badge className="flex h-6 w-6 items-center justify-center bg-primary p-0 text-primary-foreground">
                        {userData.level}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <SheetTitle className="text-gradient-gold text-left font-headline text-xl">
                      {userData.name}
                    </SheetTitle>
                    <div className="flex items-center gap-2">
                      <div className="font-code text-xs text-muted-foreground">
                        @{userData.name.toLowerCase()}
                      </div>
                      {userData.isPremium && <Crown className="h-3 w-3 text-amber-400" />}
                      {userData.isVerified && <Star className="h-3 w-3 text-blue-400" />}
                    </div>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="animate-slide-in-up animation-delay-300 mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progresso XP</span>
                    <span className="font-code">
                      {userData.xp}/{userData.xpMax}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-2 animate-pulse rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 p-4">
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary/10 p-3 text-center shadow-inner">
                    <Coins className="mx-auto mb-1 h-5 w-5 text-primary" />
                    <p className="text-sm font-bold text-primary">{formattedCredits || '...'}</p>
                    <p className="text-xs text-muted-foreground">Créditos</p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3 text-center shadow-inner">
                    <Gift className="mx-auto mb-1 h-5 w-5 text-accent" />
                    <p className="text-sm font-bold text-accent">
                      {formattedSpecialCredits || '...'}
                    </p>
                    <p className="text-xs text-muted-foreground">Especiais</p>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-3 text-center shadow-inner">
                    <Award className="mx-auto mb-1 h-5 w-5 text-green-500" />
                    <p className="text-sm font-bold text-green-500">{userData.achievements}</p>
                    <p className="text-xs text-muted-foreground">Conquistas</p>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 p-3 text-center shadow-inner">
                    <Sparkles className="mx-auto mb-1 h-5 w-5 text-purple-500" />
                    <p className="text-sm font-bold text-purple-500">{userData.pixels}</p>
                    <p className="text-xs text-muted-foreground">Pixels</p>
                  </div>
                </div>

                {/* Enhanced Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link href={link.href} key={link.href}>
                        <Button
                          variant={pathname === link.href ? 'default' : 'ghost'}
                          className="h-10 w-full justify-start text-sm transition-all duration-300"
                        >
                          <Icon
                            className={cn(
                              'mr-3 h-4 w-4',
                              pathname === link.href ? link.color : 'text-muted-foreground'
                            )}
                          />
                          {link.label}
                          {link.badge && (
                            <Badge className="ml-auto bg-red-500 text-white">{link.badge}</Badge>
                          )}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <div className="space-y-1 border-t border-border/50 pt-4">
                  <Link href="/settings">
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-transform duration-200 hover:scale-105"
                      size="sm"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Definições
                    </Button>
                  </Link>
                  <HelpCenter>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Ajuda & Suporte
                    </Button>
                  </HelpCenter>
                  <Link href="/security">
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-transform duration-200 hover:scale-105"
                      size="sm"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Segurança
                    </Button>
                  </Link>
                  <Link href="/premium">
                    <Button
                      variant="default"
                      className="animate-gradient-x w-full justify-start bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Tornar-se Premium
                    </Button>
                  </Link>
                  <Button variant="destructive" className="mt-4 w-full justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <Link href="/credits">Comprar Mais</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 opacity-50 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
              <Image
                src="/logo.png"
                alt="Pixel Universe"
                width={32}
                height={32}
                className="relative z-10 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-gradient-gold-animated hidden font-headline text-lg font-bold transition-all duration-300 group-hover:scale-105 sm:block">
              Pixel Universe
            </span>
          </Link>
        </div>

        {/* Enhanced Center: Search (Desktop) */}
        <div className="relative mx-4 hidden max-w-md flex-1 md:flex">
          <SearchSystem>
            <div className="group relative w-full cursor-pointer">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground transition-colors group-hover:text-primary" />
              <div className="flex h-9 w-full items-center rounded-full border border-border/60 bg-background/50 pl-10 pr-4 text-sm text-muted-foreground transition-all duration-300 hover:scale-105 group-hover:border-primary/50 group-hover:bg-background/80">
                Pesquisar pixels, utilizadores...
              </div>
              <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 animate-pulse rounded-full border border-primary/20" />
              </div>
            </div>
          </SearchSystem>
        </div>

        {/* Right: User Info + Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search */}
          <SearchSystem>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-colors hover:bg-primary/10 md:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>
          </SearchSystem>

          {/* Quick Add */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 transition-colors hover:bg-primary/10 sm:flex"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <NotificationCenter>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => clearNotifications()}
                className="relative h-8 w-8 transition-colors hover:bg-primary/10"
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
                    <span className="animate-heartbeat absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  </span>
                )}
              </Button>
            </NotificationCenter>
          </motion.div>

          {/* Real-time Chat */}
          <RealTimeChat />

          {/* Credits (Mobile Compact) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <EnhancedTooltip
              title="Créditos"
              description="Sua moeda principal para comprar pixels"
              stats={[
                {
                  label: 'Saldo Atual',
                  value: formattedCredits || '...',
                  icon: <Coins className="h-4 w-4" />,
                },
                {
                  label: 'Especiais',
                  value: formattedSpecialCredits || '...',
                  icon: <Gift className="h-4 w-4" />,
                },
              ]}
              actions={[
                { label: 'Comprar Mais', onClick: () => {}, icon: <Plus className="h-4 w-4" /> },
              ]}
            >
              <div
                className={cn(
                  'group flex cursor-pointer items-center rounded-full bg-primary/10 px-2 py-1 text-foreground transition-all duration-300 hover:scale-105',
                  isAnimating && 'animate-bounce-slow'
                )}
              >
                <Coins
                  className="mr-1 h-3 w-3 animate-pulse text-primary transition-colors group-hover:text-primary/80 sm:h-4 sm:w-4"
                  style={{ animationDuration: '3s' }}
                />
                {formattedCredits !== null ? (
                  <span className="font-code text-xs font-bold text-primary transition-colors group-hover:text-primary/80 sm:text-sm">
                    {typeof window !== 'undefined' && window.innerWidth < 640
                      ? `${Math.floor(credits / 1000)}K`
                      : formattedCredits}
                  </span>
                ) : (
                  <span className="loading-dots font-code text-xs">...</span>
                )}
              </div>
            </EnhancedTooltip>

            <EnhancedTooltip
              title="Créditos Especiais"
              description="Moeda premium para itens exclusivos"
              stats={[
                {
                  label: 'Saldo Especial',
                  value: formattedSpecialCredits || '...',
                  icon: <Gift className="h-4 w-4" />,
                },
              ]}
              badges={[{ label: 'Premium', variant: 'default' }]}
            >
              <div
                className={cn(
                  'group hidden cursor-pointer items-center rounded-full bg-accent/10 px-2 py-1 text-foreground transition-all duration-300 hover:scale-105 sm:flex',
                  isAnimating && 'animate-bounce-slow animation-delay-100'
                )}
              >
                <Gift
                  className="mr-1 h-4 w-4 animate-pulse text-accent transition-colors group-hover:text-accent/80"
                  style={{ animationDuration: '4s' }}
                />
                {formattedSpecialCredits !== null ? (
                  <span className="font-code text-sm font-bold text-accent transition-colors group-hover:text-accent/80">
                    {formattedSpecialCredits}
                  </span>
                ) : (
                  <span className="loading-dots font-code text-xs">...</span>
                )}
              </div>
            </EnhancedTooltip>
          </div>

          {/* User Menu */}
          <UserMenu />

          {/* Connection status indicator */}
          <div className="flex items-center">
            <EnhancedTooltip
              title={isOnline ? 'Conectado' : 'Offline'}
              description={isOnline ? 'Todas as funcionalidades disponíveis' : 'Modo offline ativo'}
            >
              <div
                className={`h-2 w-2 rounded-full ${isOnline ? 'animate-pulse bg-green-500' : 'bg-red-500'}`}
              />
            </EnhancedTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
