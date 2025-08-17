'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, Trophy, ShoppingCart, CreditCard, Settings,
  Users, TrendingUp, Award, Coins, User
} from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/',
    label: 'Mapa',
    icon: Map,
    color: 'text-primary'
  },
  {
    href: '/ranking',
    label: 'Ranking',
    icon: TrendingUp,
    color: 'text-blue-500'
  },
  {
    href: '/achievements',
    label: 'Conquistas',
    icon: Trophy,
    color: 'text-yellow-500',
    badge: true
  },
  {
    href: '/credits',
    label: 'Créditos',
    icon: CreditCard,
    color: 'text-green-500'
  },
  {
    href: '/settings',
    label: 'Definições',
    icon: Settings,
    color: 'text-gray-500'
  }
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { achievements, notifications } = useUserStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="relative">
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[60px]",
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? 'text-primary' : item.color)} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
              
              {/* Badge for achievements */}
              {item.badge && achievements > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600"
                >
                  {achievements > 9 ? '9+' : achievements}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}