// src/app/(main)/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn, UserPlus, Sparkles, Crown, Zap, Target, TrendingUp, Users, MapPin, Trophy, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/store';
import { Confetti } from '@/components/ui/confetti';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addCredits, addXp } = useUserStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playWelcomeSound, setPlayWelcomeSound] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    activeUsers: 1247,
    pixelsSold: 156,
    newArtworks: 89,
    totalValue: 45230
  });

  // Welcome animation for new users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('pixel-universe-welcome-seen');
    if (!hasSeenWelcome && !user) {
      setShowWelcome(true);
      setShowConfetti(true);
      setPlayWelcomeSound(true);
      localStorage.setItem('pixel-universe-welcome-seen', 'true');
    }
  }, [user]);

  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        pixelsSold: prev.pixelsSold + Math.floor(Math.random() * 3),
        newArtworks: prev.newArtworks + Math.floor(Math.random() * 2),
        totalValue: prev.totalValue + Math.floor(Math.random() * 100)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    addCredits(100);
    addXp(50);
  };

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playWelcomeSound} onEnd={() => setPlayWelcomeSound(false)} />
      <Confetti active={showConfetti} duration={5000} onComplete={() => setShowConfetti(false)} />
      
      <SidebarProvider>
        <div className="relative h-full w-full flex">
          <MapSidebar />
          <div className="flex-1 h-full relative">
            <PixelGrid />
            
            {/* Live Stats Overlay */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
              <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="font-bold">{dailyStats.activeUsers}</span>
                      <span className="text-muted-foreground">online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-bold">{dailyStats.pixelsSold}</span>
                      <span className="text-muted-foreground">vendidos hoje</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span className="font-bold">€{dailyStats.totalValue.toLocaleString()}</span>
                      <span className="text-muted-foreground">volume</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Welcome Modal for New Users */}
            <AnimatePresence>
              {showWelcome && !user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="max-w-2xl w-full"
                  >
                    <Card className="bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 shadow-2xl">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-10 w-10 text-white" />
                          </div>
                          <h1 className="text-3xl font-headline font-bold text-gradient-gold mb-4">
                            Bem-vindo ao Pixel Universe! 🎨
                          </h1>
                          <p className="text-lg text-muted-foreground mb-6">
                            O primeiro mapa colaborativo de Portugal onde cada pixel conta uma história única.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Explore</h3>
                            <p className="text-sm text-muted-foreground">Descubra pixels únicos por todo Portugal</p>
                          </div>
                          <div className="p-4 bg-accent/10 rounded-lg">
                            <Crown className="h-8 w-8 text-accent mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Crie</h3>
                            <p className="text-sm text-muted-foreground">Transforme pixels em obras de arte</p>
                          </div>
                          <div className="p-4 bg-green-500/10 rounded-lg">
                            <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Ganhe</h3>
                            <p className="text-sm text-muted-foreground">Monetize sua criatividade</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <AuthModal defaultTab="register">
                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                              <UserPlus className="h-5 w-5 mr-2" />
                              Começar Gratuitamente
                            </Button>
                          </AuthModal>
                          <AuthModal defaultTab="login">
                            <Button variant="outline" size="lg">
                              <LogIn className="h-5 w-5 mr-2" />
                              Já Tenho Conta
                            </Button>
                          </AuthModal>
                          <Button variant="ghost" size="lg" onClick={handleWelcomeComplete}>
                            Explorar Sem Conta
                          </Button>
                        </div>
                        
                        <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
                          <Gift className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-green-500 font-medium">
                            🎁 Bónus de Boas-vindas: 100 Créditos + 50 XP ao registar-se!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <PerformanceMonitor />
        </div>
      </SidebarProvider>
    </>
  );
}
