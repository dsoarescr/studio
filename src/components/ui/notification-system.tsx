'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Star, Trophy, Coins, Gift, Heart, MessageSquare, UserPlus, MapPin, Palette, Crown, Gem, Sparkles, Zap, Target, Award, Shield, Activity, TrendingUp, Calendar, Clock, Info, AlertTriangle, CheckCircle, XCircle, Flame, CloudLightning as Lightning } from 'lucide-react';

export type NotificationType = 
  | 'achievement' 
  | 'level_up' 
  | 'purchase' 
  | 'sale' 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'system' 
  | 'event' 
  | 'reward'
  | 'warning'
  | 'error'
  | 'success';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  important: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    userId?: string;
    pixelId?: string;
    achievementId?: string;
    amount?: number;
    level?: number;
    xp?: number;
    credits?: number;
  };
  avatar?: string;
  icon?: React.ReactNode;
  color?: string;
  progress?: number;
  autoHide?: boolean;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: NotificationData[];
  onNotificationRead?: (id: string) => void;
  onNotificationDismiss?: (id: string) => void;
  onNotificationAction?: (notification: NotificationData) => void;
  maxVisible?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  showSounds?: boolean;
  showConfetti?: boolean;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  achievement: <Trophy className="h-5 w-5" />,
  level_up: <Star className="h-5 w-5" />,
  purchase: <Coins className="h-5 w-5" />,
  sale: <TrendingUp className="h-5 w-5" />,
  like: <Heart className="h-5 w-5" />,
  comment: <MessageSquare className="h-5 w-5" />,
  follow: <UserPlus className="h-5 w-5" />,
  mention: <Bell className="h-5 w-5" />,
  system: <Info className="h-5 w-5" />,
  event: <Calendar className="h-5 w-5" />,
  reward: <Gift className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />
};

const notificationColors: Record<NotificationType, string> = {
  achievement: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  level_up: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  purchase: 'text-green-500 bg-green-500/10 border-green-500/20',
  sale: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  like: 'text-red-500 bg-red-500/10 border-red-500/20',
  comment: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  follow: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  mention: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  system: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  event: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  reward: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  warning: 'text-yellow-600 bg-yellow-600/10 border-yellow-600/20',
  error: 'text-red-600 bg-red-600/10 border-red-600/20',
  success: 'text-green-600 bg-green-600/10 border-green-600/20'
};

const notificationSounds: Record<NotificationType, string> = {
  achievement: SOUND_EFFECTS.ACHIEVEMENT,
  level_up: SOUND_EFFECTS.SUCCESS,
  purchase: SOUND_EFFECTS.PURCHASE,
  sale: SOUND_EFFECTS.SUCCESS,
  like: SOUND_EFFECTS.NOTIFICATION,
  comment: SOUND_EFFECTS.NOTIFICATION,
  follow: SOUND_EFFECTS.NOTIFICATION,
  mention: SOUND_EFFECTS.NOTIFICATION,
  system: SOUND_EFFECTS.NOTIFICATION,
  event: SOUND_EFFECTS.NOTIFICATION,
  reward: SOUND_EFFECTS.SUCCESS,
  warning: SOUND_EFFECTS.ERROR,
  error: SOUND_EFFECTS.ERROR,
  success: SOUND_EFFECTS.SUCCESS
};

export function NotificationSystem({
  notifications,
  onNotificationRead,
  onNotificationDismiss,
  onNotificationAction,
  maxVisible = 5,
  position = 'top-right',
  showSounds = true,
  showConfetti = true
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationData[]>([]);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [showConfettiEffect, setShowConfettiEffect] = useState(false);

  useEffect(() => {
    // Show new notifications
    const newNotifications = notifications
      .filter(n => !n.read)
      .slice(0, maxVisible);
    
    setVisibleNotifications(newNotifications);

    // Play sound for new notifications
    if (showSounds && newNotifications.length > 0) {
      const latestNotification = newNotifications[0];
      setPlayingSound(notificationSounds[latestNotification.type]);
    }

    // Show confetti for special notifications
    if (showConfetti && newNotifications.some(n => 
      ['achievement', 'level_up', 'reward'].includes(n.type)
    )) {
      setShowConfettiEffect(true);
    }

    // Auto-hide notifications
    newNotifications.forEach(notification => {
      if (notification.autoHide !== false) {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          handleDismiss(notification.id);
        }, duration);
      }
    });
  }, [notifications, maxVisible, showSounds, showConfetti]);

  const handleDismiss = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
    onNotificationDismiss?.(id);
  };

  const handleMarkAsRead = (id: string) => {
    onNotificationRead?.(id);
  };

  const handleAction = (notification: NotificationData) => {
    onNotificationAction?.(notification);
    handleDismiss(notification.id);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <>
      {/* Sound Effects */}
      {playingSound && (
        <SoundEffect
          src={playingSound}
          play={true}
          onEnd={() => setPlayingSound(null)}
          volume={0.3}
        />
      )}

      {/* Confetti */}
      <Confetti
        active={showConfettiEffect}
        duration={3000}
        onComplete={() => setShowConfettiEffect(false)}
        particleCount={100}
      />

      {/* Notifications Container */}
      <div className={`fixed z-[100] ${getPositionClasses()} space-y-3 max-w-sm w-full pointer-events-none`}>
        <AnimatePresence>
          {visibleNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: position.includes('right') ? 300 : -300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 300 : -300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.1 
              }}
              className="pointer-events-auto"
            >
              <NotificationCard
                notification={notification}
                onDismiss={() => handleDismiss(notification.id)}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                onAction={() => handleAction(notification)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

interface NotificationCardProps {
  notification: NotificationData;
  onDismiss: () => void;
  onMarkAsRead: () => void;
  onAction: () => void;
}

function NotificationCard({ notification, onDismiss, onMarkAsRead, onAction }: NotificationCardProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.autoHide !== false) {
      const duration = notification.duration || 5000;
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return Math.max(0, newProgress);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [notification.autoHide, notification.duration]);

  const colorClasses = notificationColors[notification.type];
  const icon = notification.icon || notificationIcons[notification.type];

  return (
    <Card className={`shadow-2xl border-2 ${colorClasses} backdrop-blur-sm bg-background/95 overflow-hidden`}>
      {/* Progress Bar */}
      {notification.autoHide !== false && (
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon/Avatar */}
          <div className="flex-shrink-0">
            {notification.avatar ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.avatar} />
                <AvatarFallback>{notification.title[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <div className={`p-2 rounded-full ${colorClasses}`}>
                {icon}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
              <div className="flex items-center gap-1">
                {notification.important && (
                  <Flame className="h-3 w-3 text-orange-500" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDismiss}
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
              {notification.message}
            </p>

            {/* Metadata */}
            {notification.metadata && (
              <div className="flex flex-wrap gap-2 mb-2">
                {notification.metadata.xp && (
                  <Badge variant="outline" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    +{notification.metadata.xp} XP
                  </Badge>
                )}
                {notification.metadata.credits && (
                  <Badge variant="outline" className="text-xs">
                    <Coins className="h-3 w-3 mr-1" />
                    +{notification.metadata.credits}
                  </Badge>
                )}
                {notification.metadata.level && (
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Nível {notification.metadata.level}
                  </Badge>
                )}
              </div>
            )}

            {/* Progress Bar for Achievements */}
            {notification.progress !== undefined && (
              <div className="mb-2">
                <Progress value={notification.progress} className="h-2" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {notification.timestamp.toLocaleTimeString('pt-PT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>

              <div className="flex gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAsRead}
                    className="h-6 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Marcar como Lida
                  </Button>
                )}

                {notification.actionLabel && (
                  <Button
                    size="sm"
                    onClick={onAction}
                    className="h-6 text-xs"
                  >
                    {notification.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility functions for creating notifications
export function createAchievementNotification(
  achievementName: string,
  description: string,
  xp: number,
  credits: number
): NotificationData {
  return {
    id: `achievement-${Date.now()}`,
    type: 'achievement',
    title: 'Conquista Desbloqueada!',
    message: `Parabéns! Você desbloqueou "${achievementName}": ${description}`,
    timestamp: new Date(),
    read: false,
    important: true,
    metadata: { xp, credits },
    autoHide: false,
    actionLabel: 'Ver Conquistas',
    actionUrl: '/achievements'
  };
}

export function createLevelUpNotification(
  newLevel: number,
  xpGained: number
): NotificationData {
  return {
    id: `level-up-${Date.now()}`,
    type: 'level_up',
    title: 'Nível Aumentado!',
    message: `Parabéns! Você alcançou o nível ${newLevel}!`,
    timestamp: new Date(),
    read: false,
    important: true,
    metadata: { level: newLevel, xp: xpGained },
    autoHide: false,
    actionLabel: 'Ver Perfil',
    actionUrl: '/member'
  };
}

export function createPurchaseNotification(
  pixelTitle: string,
  coordinates: { x: number; y: number },
  amount: number
): NotificationData {
  return {
    id: `purchase-${Date.now()}`,
    type: 'purchase',
    title: 'Pixel Comprado!',
    message: `Você comprou "${pixelTitle}" em (${coordinates.x}, ${coordinates.y}) por €${amount}`,
    timestamp: new Date(),
    read: false,
    important: false,
    metadata: { amount },
    duration: 4000
  };
}

export function createSaleNotification(
  pixelTitle: string,
  amount: number,
  buyerName: string
): NotificationData {
  return {
    id: `sale-${Date.now()}`,
    type: 'sale',
    title: 'Pixel Vendido!',
    message: `${buyerName} comprou seu pixel "${pixelTitle}" por €${amount}`,
    timestamp: new Date(),
    read: false,
    important: true,
    metadata: { amount },
    duration: 6000
  };
}

export function createLikeNotification(
  userName: string,
  pixelTitle: string,
  userAvatar?: string
): NotificationData {
  return {
    id: `like-${Date.now()}`,
    type: 'like',
    title: 'Novo Like!',
    message: `${userName} curtiu seu pixel "${pixelTitle}"`,
    timestamp: new Date(),
    read: false,
    important: false,
    avatar: userAvatar,
    duration: 3000
  };
}

export function createSystemNotification(
  title: string,
  message: string,
  type: 'info' | 'warning' | 'error' | 'success' = 'info'
): NotificationData {
  return {
    id: `system-${Date.now()}`,
    type: type === 'info' ? 'system' : type,
    title,
    message,
    timestamp: new Date(),
    read: false,
    important: type === 'error' || type === 'warning',
    duration: type === 'error' ? 8000 : 5000
  };
}