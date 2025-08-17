'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserMenu } from '@/components/auth/UserMenu';
import { useUserStore } from '@/lib/store';
import { 
  Coins, Gift, Zap, Star, Crown, Bell, 
  TrendingUp, Target, Award, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    isVerified
  } = useUserStore();

  const xpPercentage = (xp / xpMax) * 100;

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-gold">Pixel Universe</h1>
              <p className="text-xs text-muted-foreground">Mapa de Portugal</p>
            </div>
          </div>

          {/* User Stats - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Credits */}
            <Card className="bg-background/50">
              <CardContent className="p-2 flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    {credits.toLocaleString('pt-PT')}
                  </div>
                  <div className="text-xs text-muted-foreground">Créditos</div>
                </div>
              </CardContent>
            </Card>

            {/* Special Credits */}
            {specialCredits > 0 && (
              <Card className="bg-background/50">
                <CardContent className="p-2 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-accent" />
                  <div className="text-right">
                    <div className="text-sm font-semibold text-accent">
                      {specialCredits.toLocaleString('pt-PT')}
                    </div>
                    <div className="text-xs text-muted-foreground">Especiais</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Level & XP */}
            <Card className="bg-background/50">
              <CardContent className="p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <Badge variant="secondary" className="text-xs">
                    Nível {level}
                  </Badge>
                  {isPremium && (
                    <Crown className="h-3 w-3 text-amber-500" />
                  )}
                </div>
                <div className="w-24">
                  <Progress value={xpPercentage} className="h-1" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {xp}/{xpMax} XP
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pixels Owned */}
            <Card className="bg-background/50">
              <CardContent className="p-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-500">
                    {pixels}
                  </div>
                  <div className="text-xs text-muted-foreground">Pixels</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Notifications & User Menu */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>

            {/* Achievements - Mobile only */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <Award className="h-5 w-5 text-yellow-500" />
                {achievements > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-yellow-500">
                    {achievements}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Stats Bar */}
        <div className="md:hidden mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Coins className="h-3 w-3 text-primary" />
            <span className="font-semibold text-primary">{credits.toLocaleString('pt-PT')}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-blue-500" />
            <span className="font-semibold text-blue-500">{pixels}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="font-semibold">Nível {level}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-yellow-500" />
            <span className="font-semibold">{achievements}</span>
          </div>
        </div>
      </div>
    </div>
  );
}