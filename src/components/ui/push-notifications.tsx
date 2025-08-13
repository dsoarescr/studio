'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useSettingsStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, Smartphone, CheckCircle, AlertTriangle,
  X, Settings, Crown, Trophy, ShoppingCart, MessageSquare,
  Calendar, Zap, Shield, Info
} from 'lucide-react';

interface NotificationPermission {
  state: 'default' | 'granted' | 'denied';
  supported: boolean;
}

interface NotificationSettings {
  achievements: boolean;
  purchases: boolean;
  social: boolean;
  events: boolean;
  marketing: boolean;
  security: boolean;
}

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    state: 'default',
    supported: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    achievements: true,
    purchases: true,
    social: true,
    events: true,
    marketing: false,
    security: true,
  });
  
  const { user } = useAuth();
  const { notifications } = useSettingsStore();
  const { toast } = useToast();

  useEffect(() => {
    // Check notification support and permission
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    const currentPermission = supported ? Notification.permission : 'denied';
    
    setPermission({
      state: currentPermission,
      supported
    });

    // Load saved settings
    const saved = localStorage.getItem('pixel-universe-notification-settings');
    if (saved) {
      try {
        setNotificationSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!permission.supported) {
      toast({
        title: 'Não Suportado',
        description: 'Notificações push não são suportadas neste dispositivo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(prev => ({ ...prev, state: result }));
      
      if (result === 'granted') {
        await subscribeToNotifications();
        toast({
          title: 'Notificações Ativadas! 🔔',
          description: 'Você receberá notificações sobre atividades importantes.',
        });
      } else {
        toast({
          title: 'Permissão Negada',
          description: 'Não será possível enviar notificações push.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível solicitar permissão para notificações.',
        variant: 'destructive',
      });
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // In production, you would use your VAPID public key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'your-vapid-public-key-here'
      });

      // Send subscription to your server
      console.log('Push subscription:', subscription);
      
      // Store subscription info
      localStorage.setItem('pixel-universe-push-subscription', JSON.stringify(subscription));
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
    }
  };

  const updateNotificationSettings = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    localStorage.setItem('pixel-universe-notification-settings', JSON.stringify(newSettings));
  };

  const sendTestNotification = () => {
    if (permission.state !== 'granted') {
      toast({
        title: 'Permissão Necessária',
        description: 'Ative as notificações primeiro.',
        variant: 'destructive',
      });
      return;
    }

    new Notification('Pixel Universe', {
      body: 'Esta é uma notificação de teste! 🎉',
      icon: '/logo.png',
      badge: '/apple-icon.png',
      tag: 'test',
      vibrate: [200, 100, 200],
    });

    toast({
      title: 'Notificação Enviada',
      description: 'Verifique se recebeu a notificação de teste.',
    });
  };

  const getPermissionIcon = () => {
    switch (permission.state) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPermissionText = () => {
    switch (permission.state) {
      case 'granted':
        return 'Notificações Ativadas';
      case 'denied':
        return 'Notificações Bloqueadas';
      default:
        return 'Notificações Não Configuradas';
    }
  };

  const notificationTypes = [
    {
      key: 'achievements' as keyof NotificationSettings,
      label: 'Conquistas',
      description: 'Quando desbloquear novas conquistas',
      icon: <Trophy className="h-4 w-4 text-yellow-500" />
    },
    {
      key: 'purchases' as keyof NotificationSettings,
      label: 'Compras e Vendas',
      description: 'Transações de pixels',
      icon: <ShoppingCart className="h-4 w-4 text-green-500" />
    },
    {
      key: 'social' as keyof NotificationSettings,
      label: 'Atividade Social',
      description: 'Curtidas, comentários e seguidores',
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />
    },
    {
      key: 'events' as keyof NotificationSettings,
      label: 'Eventos',
      description: 'Eventos especiais e competições',
      icon: <Calendar className="h-4 w-4 text-purple-500" />
    },
    {
      key: 'security' as keyof NotificationSettings,
      label: 'Segurança',
      description: 'Alertas de segurança da conta',
      icon: <Shield className="h-4 w-4 text-red-500" />
    },
    {
      key: 'marketing' as keyof NotificationSettings,
      label: 'Promoções',
      description: 'Ofertas especiais e novidades',
      icon: <Zap className="h-4 w-4 text-orange-500" />
    },
  ];

  if (!permission.supported) {
    return null;
  }

  return (
    <>
      {/* Notification Settings Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSettings(true)}
        className="fixed top-32 right-4 z-40"
      >
        {getPermissionIcon()}
        <span className="ml-2 hidden sm:inline">{getPermissionText()}</span>
      </Button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="bg-card/95 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-primary" />
                      Notificações Push
                    </CardTitle>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Permission Status */}
                  <div className={`p-3 rounded-lg border ${
                    permission.state === 'granted' 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : permission.state === 'denied'
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getPermissionIcon()}
                      <span className="font-medium">{getPermissionText()}</span>
                    </div>
                    
                    {permission.state === 'default' && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Ative as notificações para receber atualizações importantes sobre suas atividades no Pixel Universe.
                        </p>
                        <Button onClick={requestPermission} className="w-full">
                          <Bell className="h-4 w-4 mr-2" />
                          Ativar Notificações
                        </Button>
                      </div>
                    )}
                    
                    {permission.state === 'denied' && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          As notificações foram bloqueadas. Para ativar, vá às configurações do seu navegador.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Abrir Configurações do Navegador
                        </Button>
                      </div>
                    )}
                    
                    {permission.state === 'granted' && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Notificações ativadas! Configure abaixo que tipos deseja receber.
                        </p>
                        <Button variant="outline" size="sm" onClick={sendTestNotification}>
                          <Bell className="h-4 w-4 mr-2" />
                          Enviar Teste
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Notification Types */}
                  {permission.state === 'granted' && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Tipos de Notificação</h4>
                      
                      {notificationTypes.map(type => (
                        <div key={type.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {type.icon}
                            <div>
                              <Label className="text-sm font-medium">{type.label}</Label>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                          
                          <Switch
                            checked={notificationSettings[type.key]}
                            onCheckedChange={(checked) => updateNotificationSettings(type.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Sobre as Notificações</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Só enviamos notificações relevantes</li>
                          <li>• Pode desativar a qualquer momento</li>
                          <li>• Dados nunca são partilhados com terceiros</li>
                          <li>• Funciona mesmo com a app fechada</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for sending notifications
export function useNotifications() {
  const { user } = useAuth();
  const { notifications: notificationsEnabled } = useSettingsStore();

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!notificationsEnabled || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(title, {
      icon: '/logo.png',
      badge: '/apple-icon.png',
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  };

  const sendAchievementNotification = (achievementName: string) => {
    return sendNotification('Conquista Desbloqueada! 🏆', {
      body: `Parabéns! Você desbloqueou "${achievementName}"`,
      tag: 'achievement',
      vibrate: [200, 100, 200],
    });
  };

  const sendPurchaseNotification = (pixelCoords: string, price: number) => {
    return sendNotification('Pixel Comprado! 🎉', {
      body: `Você comprou o pixel ${pixelCoords} por €${price}`,
      tag: 'purchase',
      vibrate: [100, 50, 100],
    });
  };

  const sendSocialNotification = (type: 'like' | 'comment' | 'follow', userName: string) => {
    const messages = {
      like: `${userName} curtiu seu pixel`,
      comment: `${userName} comentou em seu pixel`,
      follow: `${userName} começou a seguir você`,
    };

    return sendNotification('Nova Atividade Social 💬', {
      body: messages[type],
      tag: 'social',
      vibrate: [50],
    });
  };

  return {
    sendNotification,
    sendAchievementNotification,
    sendPurchaseNotification,
    sendSocialNotification,
    isSupported: permission.supported,
    hasPermission: Notification.permission === 'granted',
  };
}