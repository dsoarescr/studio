'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { 
  Bell, X, Check, Star, MessageSquare, ShoppingCart, Trophy, 
  Users, MapPin, Heart, Gift, Zap, Crown, Sparkles, Clock,
  Eye, Share2, Award, Gem, Target, Calendar, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type NotificationType = 
  | 'achievement' 
  | 'pixel_purchase' 
  | 'pixel_like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'system' 
  | 'event' 
  | 'marketplace'
  | 'community'
  | 'level_up'
  | 'daily_bonus'
  | 'auction_won'
  | 'auction_outbid';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  avatar?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

interface NotificationSystemProps {
  maxNotifications?: number;
  autoRemoveAfter?: number; // em milissegundos
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  achievement: <Trophy className="h-5 w-5 text-yellow-500" />,
  pixel_purchase: <ShoppingCart className="h-5 w-5 text-green-500" />,
  pixel_like: <Heart className="h-5 w-5 text-red-500" />,
  comment: <MessageSquare className="h-5 w-5 text-blue-500" />,
  follow: <Users className="h-5 w-5 text-purple-500" />,
  mention: <Star className="h-5 w-5 text-orange-500" />,
  system: <Bell className="h-5 w-5 text-gray-500" />,
  event: <Calendar className="h-5 w-5 text-cyan-500" />,
  marketplace: <MapPin className="h-5 w-5 text-indigo-500" />,
  community: <Users className="h-5 w-5 text-pink-500" />,
  level_up: <Zap className="h-5 w-5 text-primary" />,
  daily_bonus: <Gift className="h-5 w-5 text-green-500" />,
  auction_won: <Crown className="h-5 w-5 text-amber-500" />,
  auction_outbid: <Target className="h-5 w-5 text-red-500" />
};

const notificationColors: Record<NotificationType, string> = {
  achievement: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  pixel_purchase: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  pixel_like: 'from-red-500/20 to-pink-500/20 border-red-500/30',
  comment: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  follow: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  mention: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  system: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
  event: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30',
  marketplace: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30',
  community: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  level_up: 'from-primary/20 to-accent/20 border-primary/30',
  daily_bonus: 'from-green-500/20 to-lime-500/20 border-green-500/30',
  auction_won: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  auction_outbid: 'from-red-500/20 to-orange-500/20 border-red-500/30'
};

export function NotificationSystem({ 
  maxNotifications = 5,
  autoRemoveAfter = 5000,
  position = 'top-right'
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useUserStore();

  // Posicionamento
  const positionClasses = {
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4'
  };

  // Adicionar notificação
  const addNotificationToQueue = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    setPlayNotificationSound(true);
    addNotification();

    // Auto-remover se especificado
    if (autoRemoveAfter > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, autoRemoveAfter);
    }
  };

  // Remover notificação
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Marcar como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  // Simular notificações em tempo real
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance a cada 10 segundos
        const notificationTypes: NotificationType[] = [
          'pixel_like', 'comment', 'follow', 'achievement', 'daily_bonus'
        ];
        
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const mockNotifications: Record<NotificationType, Partial<Notification>> = {
          pixel_like: {
            type: 'pixel_like',
            title: 'Pixel Curtido!',
            message: 'PixelArtist123 curtiu o seu pixel em Lisboa',
            avatar: 'https://placehold.co/40x40.png',
            isImportant: false
          },
          comment: {
            type: 'comment',
            title: 'Novo Comentário',
            message: 'ColorMaster comentou no seu álbum',
            avatar: 'https://placehold.co/40x40.png',
            isImportant: false
          },
          follow: {
            type: 'follow',
            title: 'Novo Seguidor',
            message: 'ArtCollector começou a seguir você',
            avatar: 'https://placehold.co/40x40.png',
            isImportant: false
          },
          achievement: {
            type: 'achievement',
            title: 'Conquista Desbloqueada!',
            message: 'Parabéns! Desbloqueou "Colecionador"',
            isImportant: true
          },
          daily_bonus: {
            type: 'daily_bonus',
            title: 'Bónus Diário Disponível',
            message: 'Reclame o seu bónus de login diário',
            isImportant: false
          }
        };

        const notification = mockNotifications[randomType];
        if (notification) {
          addNotificationToQueue(notification as Omit<Notification, 'id' | 'timestamp' | 'isRead'>);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // API pública para outros componentes
  useEffect(() => {
    // Expor função global para adicionar notificações
    (window as any).addPixelUniverseNotification = addNotificationToQueue;
    
    return () => {
      delete (window as any).addPixelUniverseNotification;
    };
  }, []);

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora mesmo';
  };

  return (
    <>
      <SoundEffect 
        src={SOUND_EFFECTS.NOTIFICATION} 
        play={playNotificationSound} 
        onEnd={() => setPlayNotificationSound(false)} 
      />
      
      <div className={cn("fixed z-50 flex flex-col gap-3 w-80", positionClasses[position])}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className={cn(
                "shadow-lg backdrop-blur-sm border-2 transition-all hover:shadow-xl cursor-pointer",
                `bg-gradient-to-r ${notificationColors[notification.type]}`,
                !notification.isRead && "animate-pulse"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>
                            {notificationIcons[notification.type]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-background/80 flex items-center justify-center">
                          {notificationIcons[notification.type]}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm leading-tight">
                            {notification.title}
                            {notification.isImportant && (
                              <Sparkles className="inline h-3 w-3 ml-1 text-yellow-500" />
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Ações rápidas */}
                      <div className="flex items-center gap-2 mt-3">
                        {notification.type === 'pixel_like' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Pixel
                          </Button>
                        )}
                        {notification.type === 'follow' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Ver Perfil
                          </Button>
                        )}
                        {notification.type === 'achievement' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Trophy className="h-3 w-3 mr-1" />
                            Ver Conquista
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

// Hook para usar o sistema de notificações
export function useNotificationSystem() {
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    if ((window as any).addPixelUniverseNotification) {
      (window as any).addPixelUniverseNotification(notification);
    }
  };

  const showAchievementNotification = (achievementName: string, xpReward: number, creditsReward: number) => {
    addNotification({
      type: 'achievement',
      title: 'Conquista Desbloqueada! 🏆',
      message: `Parabéns! Desbloqueou "${achievementName}" (+${xpReward} XP, +${creditsReward} créditos)`,
      isImportant: true,
      metadata: { achievementName, xpReward, creditsReward }
    });
  };

  const showPixelPurchaseNotification = (x: number, y: number, region: string) => {
    addNotification({
      type: 'pixel_purchase',
      title: 'Pixel Adquirido! 🎉',
      message: `Parabéns! O pixel (${x}, ${y}) em ${region} agora é seu!`,
      isImportant: true,
      metadata: { x, y, region }
    });
  };

  const showLevelUpNotification = (newLevel: number, xpReward: number) => {
    addNotification({
      type: 'level_up',
      title: 'Subiu de Nível! ⚡',
      message: `Parabéns! Alcançou o nível ${newLevel}! (+${xpReward} XP bónus)`,
      isImportant: true,
      metadata: { newLevel, xpReward }
    });
  };

  const showDailyBonusNotification = (credits: number, streak: number) => {
    addNotification({
      type: 'daily_bonus',
      title: 'Bónus Diário Disponível! 🎁',
      message: `Reclame ${credits} créditos (Sequência: ${streak} dias)`,
      isImportant: false,
      metadata: { credits, streak }
    });
  };

  return {
    addNotification,
    showAchievementNotification,
    showPixelPurchaseNotification,
    showLevelUpNotification,
    showDailyBonusNotification
  };
}