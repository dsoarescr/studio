'use client';

import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, Star, Heart, Eye, MapPin, Calendar, User, Coins, 
  Trophy, Crown, Gem, Sparkles, Zap, Target, Award, Shield, UserPlus
} from 'lucide-react';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
  }>;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    color?: string;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    icon?: React.ReactNode;
  }>;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  maxWidth?: string;
  showArrow?: boolean;
  interactive?: boolean;
}

export function EnhancedTooltip({
  children,
  title,
  description,
  stats = [],
  badges = [],
  actions = [],
  side = 'top',
  align = 'center',
  delayDuration = 300,
  maxWidth = '320px',
  showArrow = true,
  interactive = false
}: EnhancedTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className="p-0 border-primary/20 shadow-2xl"
          style={{ maxWidth }}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
            >
              <Card className="border-0 shadow-none bg-background/95 backdrop-blur-sm">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    {description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge, index) => (
                        <Badge 
                          key={index} 
                          variant={badge.variant || 'outline'}
                          className={badge.color ? `${badge.color} border-current` : ''}
                        >
                          {badge.label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  {stats.length > 0 && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-3">
                        {stats.map((stat, index) => (
                          <div key={index} className="text-center space-y-1">
                            {stat.icon && (
                              <div className={`mx-auto ${stat.color || 'text-primary'}`}>
                                {stat.icon}
                              </div>
                            )}
                            <p className={`font-bold ${stat.color || 'text-foreground'}`}>
                              {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  {actions.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex gap-2">
                        {actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={() => {
                              action.onClick();
                              if (!interactive) setIsOpen(false);
                            }}
                            className="flex-1"
                          >
                            {action.icon && (
                              <span className="mr-2">{action.icon}</span>
                            )}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Predefined tooltip variants for common use cases
export function PixelTooltip({ 
  children, 
  pixelData 
}: { 
  children: React.ReactNode;
  pixelData: {
    coordinates: { x: number; y: number };
    region: string;
    owner?: string;
    price?: number;
    rarity?: string;
    views?: number;
    likes?: number;
  };
}) {
  return (
    <EnhancedTooltip
      title={`Pixel (${pixelData.coordinates.x}, ${pixelData.coordinates.y})`}
      description={`Localizado em ${pixelData.region}`}
      badges={[
        ...(pixelData.rarity ? [{ label: pixelData.rarity, variant: 'outline' as const }] : []),
        ...(pixelData.owner ? [{ label: `Proprietário: ${pixelData.owner}`, variant: 'secondary' as const }] : [])
      ]}
      stats={[
        ...(pixelData.views ? [{ label: 'Visualizações', value: pixelData.views, icon: <Eye className="h-4 w-4" /> }] : []),
        ...(pixelData.likes ? [{ label: 'Curtidas', value: pixelData.likes, icon: <Heart className="h-4 w-4" />, color: 'text-red-500' }] : []),
        ...(pixelData.price ? [{ label: 'Preço', value: `€${pixelData.price}`, icon: <Coins className="h-4 w-4" />, color: 'text-primary' }] : [])
      ]}
    >
      {children}
    </EnhancedTooltip>
  );
}

export function UserTooltip({ 
  children, 
  userData 
}: { 
  children: React.ReactNode;
  userData: {
    name: string;
    level: number;
    pixels: number;
    achievements: number;
    verified?: boolean;
    premium?: boolean;
  };
}) {
  return (
    <EnhancedTooltip
      title={userData.name}
      badges={[
        { label: `Nível ${userData.level}`, variant: 'secondary' },
        ...(userData.verified ? [{ label: 'Verificado', variant: 'default' as const, color: 'text-blue-500' }] : []),
        ...(userData.premium ? [{ label: 'Premium', variant: 'default' as const, color: 'text-amber-500' }] : [])
      ]}
      stats={[
        { label: 'Pixels', value: userData.pixels, icon: <MapPin className="h-4 w-4" /> },
        { label: 'Conquistas', value: userData.achievements, icon: <Trophy className="h-4 w-4" />, color: 'text-yellow-500' }
      ]}
      actions={[
        { label: 'Ver Perfil', onClick: () => {}, icon: <User className="h-4 w-4" /> },
        { label: 'Seguir', onClick: () => {}, variant: 'default', icon: <UserPlus className="h-4 w-4" /> }
      ]}
      interactive={true}
    >
      {children}
    </EnhancedTooltip>
  );
}

export function AchievementTooltip({ 
  children, 
  achievementData 
}: { 
  children: React.ReactNode;
  achievementData: {
    name: string;
    description: string;
    rarity: string;
    xpReward: number;
    creditsReward: number;
    unlockedAt?: string;
    progress?: number;
  };
}) {
  return (
    <EnhancedTooltip
      title={achievementData.name}
      description={achievementData.description}
      badges={[
        { label: achievementData.rarity, variant: 'outline', color: 'text-primary' }
      ]}
      stats={[
        { label: 'XP', value: `+${achievementData.xpReward}`, icon: <Zap className="h-4 w-4" />, color: 'text-primary' },
        { label: 'Créditos', value: `+${achievementData.creditsReward}`, icon: <Coins className="h-4 w-4" />, color: 'text-accent' }
      ]}
    >
      {children}
    </EnhancedTooltip>
  );
}