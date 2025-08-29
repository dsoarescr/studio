'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementProgressProps {
  currentTier: number;
  maxTier: number;
  progress: number;
  maxProgress: number;
  rarity: keyof typeof rarityGradients;
  isUnlocked: boolean;
}

const rarityGradients = {
  common: 'from-slate-400 to-slate-500',
  uncommon: 'from-green-400 to-green-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-amber-400 to-amber-500',
};

export function AchievementProgress({
  currentTier,
  maxTier,
  progress,
  maxProgress,
  rarity,
  isUnlocked,
}: AchievementProgressProps) {
  const progressPercentage = (progress / maxProgress) * 100;
  const gradient = rarityGradients[rarity] || rarityGradients.common;

  return (
    <div className="space-y-2">
      {/* Barra de Progresso Animada */}
      <div className="relative">
        <Progress
          value={progressPercentage}
          className={cn('h-2 bg-background/50', isUnlocked && 'bg-gradient-to-r ' + gradient)}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1 -top-1"
        >
          {isUnlocked && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className={cn('bg-gradient-to-r shadow-lg', gradient)}>
                {progress}/{maxProgress}
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Indicador de Tier */}
      <div className="flex items-center justify-between">
        {Array.from({ length: maxTier }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              index < currentTier
                ? 'bg-gradient-to-br ' + gradient + ' text-white'
                : 'bg-background/50 text-muted-foreground'
            )}
          >
            {index < currentTier ? (
              rarity === 'legendary' ? (
                <Award className="h-4 w-4" />
              ) : rarity === 'epic' || rarity === 'rare' ? (
                <Star className="h-4 w-4" />
              ) : (
                <Trophy className="h-4 w-4" />
              )
            ) : (
              <span className="text-sm">{index + 1}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
