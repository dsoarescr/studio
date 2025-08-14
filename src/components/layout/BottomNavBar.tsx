'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/lib/store';
import { 
  Home, Trophy, BarChart3, User, Coins, Crown, 
  Settings, ShoppingCart, Users, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Mapa', icon: Home, exact: true },
  { href: '/achievements', label: 'Conquistas', icon: Trophy },
  { href: '/ranking', label: 'Rankings', icon: BarChart3 },
  { href: '/credits', label: 'Créditos', icon: Coins },
  { href: '/member', label: 'Perfil', icon: User },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { credits, specialCredits, achievements, isPremium } = useUserStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50 h-[var(--bottom-nav-height)]">
      <div className="container mx-auto px-2 h-full">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center gap-1 h-full w-full rounded-none relative",
                    isActive && "text-primary bg-primary/10"
                  )}
                >
                  <div className="relative">
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    
                    {/* Notification badges */}
                    {item.href === '/achievements' && achievements > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-500">
                        {achievements > 9 ? '9+' : achievements}
                      </Badge>
                    )}
                    
                    {item.href === '/member' && isPremium && (
                      <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-400" />
                    )}
                  </div>
                  
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}