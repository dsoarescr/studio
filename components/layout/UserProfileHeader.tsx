'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../lib/auth-context';
import { useUserStore } from '../../lib/store';
import { User, Coins, Gift, Bell } from 'lucide-react';

export default function UserProfileHeader() {
  const { user } = useAuth();
  const { credits, specialCredits, level } = useUserStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">Pixel Universe</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              <Coins className="h-3 w-3 mr-1" />
              {credits.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Gift className="h-3 w-3 mr-1" />
              {specialCredits}
            </Badge>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Badge>Nível {level}</Badge>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm">
              <User className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}