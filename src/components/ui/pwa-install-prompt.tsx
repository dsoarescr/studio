'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Download, Smartphone, Monitor, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already installed
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after user has been on site for a bit
      setTimeout(() => {
        if (!isStandalone && !localStorage.getItem('pwa-install-dismissed')) {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      toast({
        title: 'App Instalado! 🎉',
        description: 'Pixel Universe foi instalado no seu dispositivo.',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, toast]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install prompt failed:', error);
      toast({
        title: 'Erro na Instalação',
        description: 'Não foi possível instalar a aplicação.',
        variant: 'destructive',
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed or in standalone mode
  if (isStandalone || isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <Card className="shadow-2xl border-primary/30 bg-card/95 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Instalar App</CardTitle>
                    <Badge className="bg-green-500 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Mais Rápido
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDismiss}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Instale o Pixel Universe no seu dispositivo para uma experiência mais rápida e acesso offline.
              </p>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-muted/20 rounded">
                  <Zap className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <span>Mais Rápido</span>
                </div>
                <div className="p-2 bg-muted/20 rounded">
                  <Monitor className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <span>Ecrã Completo</span>
                </div>
                <div className="p-2 bg-muted/20 rounded">
                  <Download className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                  <span>Offline</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDismiss} className="flex-1">
                  Agora Não
                </Button>
                <Button onClick={handleInstall} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Instalar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}