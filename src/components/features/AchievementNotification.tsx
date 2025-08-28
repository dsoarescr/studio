'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/data/achievements-data';
import { SoundEffect } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';

interface AchievementNotificationProps {
  achievement: Achievement;
  tier: number;
  onClose: () => void;
}

const rarityColors = {
  common: 'bg-slate-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500'
};

const rarityIcons = {
  common: Trophy,
  uncommon: Trophy,
  rare: Star,
  epic: Star,
  legendary: Award
};

export function AchievementNotification({ achievement, tier, onClose }: AchievementNotificationProps) {
  const { toast } = useToast();
  const Icon = rarityIcons[achievement.rarity] || Trophy;

  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.3 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Card className="p-4 shadow-lg border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${rarityColors[achievement.rarity]}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{achievement.name}</h4>
              <p className="text-sm text-muted-foreground">
                {achievement.tiers[tier - 1].description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  +{achievement.tiers[tier - 1].xpReward} XP
                </Badge>
                <Badge variant="outline">
                  +{achievement.tiers[tier - 1].creditsReward} Créditos
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        <SoundEffect src="/sounds/achievement.mp3" />
        <Confetti active duration={2500} />
      </motion.div>
    </AnimatePresence>
  );
}

export function useAchievementNotification() {
  const { toast } = useToast();

  const showAchievementNotification = (achievement: Achievement, tier: number) => {
    const notificationId = `achievement-${achievement.id}-${tier}`;
    
    toast({
      id: notificationId,
      duration: 5000,
      render: ({ onClose }) => (
        <AchievementNotification
          achievement={achievement}
          tier={tier}
          onClose={onClose}
        />
      ),
    });
  };

  return { showAchievementNotification };
}
