'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Home, ShoppingCart, Users, Trophy, User, 
  Palette, BarChart3, Settings 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/', label: 'Mapa', icon: Home },
  { href: '/marketplace', label: 'Market', icon: ShoppingCart },
  { href: '/community', label: 'Social', icon: Users },
  { href: '/achievements', label: 'Conquistas', icon: Trophy },
  { href: '/member', label: 'Perfil', icon: User },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border/50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3",
                  isActive && "text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}