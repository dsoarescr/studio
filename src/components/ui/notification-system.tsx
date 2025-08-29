'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, Settings, X, CheckCircle, AlertTriangle, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'purchase' | 'price_alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  data?: any;
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  priceAlerts: boolean;
  achievementAlerts: boolean;
  activityAlerts: boolean;
  soundEnabled: boolean;
}

const defaultSettings: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: true,
  priceAlerts: true,
  achievementAlerts: true,
  activityAlerts: true,
  soundEnabled: true,
};

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pixel-universe-notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pixel-universe-notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 99)]); // Keep only last 100

      // Show toast if enabled
      if (settings.pushEnabled) {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 'default',
        });
      }

      // Play sound if enabled
      if (settings.soundEnabled) {
        playNotificationSound(notification.type);
      }
    },
    [settings, toast]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    notifications,
    settings,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,
  };
};

const playNotificationSound = (type: Notification['type']) => {
  const audio = new Audio();

  switch (type) {
    case 'achievement':
      audio.src = '/sounds/achievement.mp3';
      break;
    case 'purchase':
      audio.src = '/sounds/purchase.mp3';
      break;
    case 'success':
      audio.src = '/sounds/success.mp3';
      break;
    case 'error':
      audio.src = '/sounds/error.mp3';
      break;
    default:
      audio.src = '/sounds/notification.mp3';
  }

  audio.play().catch(() => {
    // Ignore errors if audio fails to play
  });
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'achievement':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'purchase':
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case 'price_alert':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'border-green-500/20 bg-green-500/5';
    case 'warning':
      return 'border-yellow-500/20 bg-yellow-500/5';
    case 'error':
      return 'border-red-500/20 bg-red-500/5';
    case 'achievement':
      return 'border-yellow-500/20 bg-yellow-500/5';
    case 'purchase':
      return 'border-blue-500/20 bg-blue-500/5';
    case 'price_alert':
      return 'border-orange-500/20 bg-orange-500/5';
    default:
      return 'border-blue-500/20 bg-blue-500/5';
  }
};

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,
  } = useNotificationSystem();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
        {unreadCount > 0 ? (
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        ) : null}
        <Bell className="h-5 w-5" />
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-background shadow-lg">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Notificações</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                      Marcar como lidas
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {showSettings ? (
                <NotificationSettings settings={settings} onUpdate={updateSettings} />
              ) : (
                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                  onClearAll={clearAll}
                  formatTime={formatTime}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const NotificationList: React.FC<{
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  formatTime: (date: Date) => string;
}> = ({ notifications, onMarkAsRead, onRemove, onClearAll, formatTime }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <BellOff className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p className="text-sm">Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div>
      <ScrollArea className="h-64">
        <div className="space-y-1 p-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`cursor-pointer rounded-lg border p-3 transition-all hover:bg-muted/50 ${
                notification.read ? 'opacity-75' : ''
              } ${getNotificationColor(notification.type)}`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="truncate text-sm font-medium">{notification.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-50 hover:opacity-100"
                      onClick={e => {
                        e.stopPropagation();
                        onRemove(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {notifications.length > 0 && (
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" onClick={onClearAll} className="w-full text-xs">
            Limpar todas
          </Button>
        </div>
      )}
    </div>
  );
};

const NotificationSettings: React.FC<{
  settings: NotificationSettings;
  onUpdate: (settings: Partial<NotificationSettings>) => void;
}> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications" className="text-sm">
            Notificações Push
          </Label>
          <Switch
            id="push-notifications"
            checked={settings.pushEnabled}
            onCheckedChange={checked => onUpdate({ pushEnabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="text-sm">
            Notificações por Email
          </Label>
          <Switch
            id="email-notifications"
            checked={settings.emailEnabled}
            onCheckedChange={checked => onUpdate({ emailEnabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="price-alerts" className="text-sm">
            Alertas de Preço
          </Label>
          <Switch
            id="price-alerts"
            checked={settings.priceAlerts}
            onCheckedChange={checked => onUpdate({ priceAlerts: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="achievement-alerts" className="text-sm">
            Alertas de Conquistas
          </Label>
          <Switch
            id="achievement-alerts"
            checked={settings.achievementAlerts}
            onCheckedChange={checked => onUpdate({ achievementAlerts: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="activity-alerts" className="text-sm">
            Alertas de Atividade
          </Label>
          <Switch
            id="activity-alerts"
            checked={settings.activityAlerts}
            onCheckedChange={checked => onUpdate({ activityAlerts: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sound-enabled" className="text-sm">
            Sons de Notificação
          </Label>
          <Switch
            id="sound-enabled"
            checked={settings.soundEnabled}
            onCheckedChange={checked => onUpdate({ soundEnabled: checked })}
          />
        </div>
      </div>
    </div>
  );
};
