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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, UserPlus, MapPin, Trophy, Coins, Gift, Star, Crown, 
  Sparkles, Target, Zap, Eye, Heart, Users, TrendingUp, 
  Compass, Palette, Award, Gem, X, ChevronRight, Play,
  Lightbulb, Rocket, Shield, Globe, Calendar, Clock
} from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { level, xp, xpMax, credits, specialCredits, achievements, pixels } = useUserStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showQuickStats, setShowQuickStats] = useState(true);
  
  const xpPercentage = xpMax > 0 ? (xp / xpMax) * 100 : 0;
  
  // Show welcome message for new visitors
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('pixel-universe-welcome-seen');
    if (!hasSeenWelcome && !user) {
      setShowWelcome(true);
    }
  }, [user]);
  
  // Tutorial tips for new users
  const tutorialTips = [
    {
      title: "Bem-vindo ao Pixel Universe! 🎨",
      description: "Explore o mapa interativo de Portugal e descubra pixels únicos para comprar e personalizar.",
      icon: <Globe className="h-6 w-6" />,
      action: "Começar Exploração"
    },
    {
      title: "Navegue pelo Mapa 🗺️",
      description: "Use o zoom, arraste para navegar e clique em pixels para ver detalhes. Pixels dourados estão disponíveis!",
      icon: <Compass className="h-6 w-6" />,
      action: "Explorar Mapa"
    },
    {
      title: "Compre Seu Primeiro Pixel 💎",
      description: "Clique num pixel disponível e personalize-o com cores, título e descrição únicos.",
      icon: <MapPin className="h-6 w-6" />,
      action: "Ver Marketplace"
    },
    {
      title: "Desbloqueie Conquistas 🏆",
      description: "Ganhe XP, créditos e badges especiais completando desafios e explorando o universo.",
      icon: <Trophy className="h-6 w-6" />,
      action: "Ver Conquistas"
    }
  ];
  
  const quickStats = [
    { label: "Pixels Ativos", value: "12.5K", icon: <MapPin className="h-4 w-4" />, color: "text-primary" },
    { label: "Utilizadores Online", value: "1.2K", icon: <Users className="h-4 w-4" />, color: "text-green-500" },
    { label: "Transações Hoje", value: "89", icon: <TrendingUp className="h-4 w-4" />, color: "text-blue-500" },
    { label: "Valor Médio", value: "€42", icon: <Coins className="h-4 w-4" />, color: "text-accent" }
  ];
  
  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('pixel-universe-welcome-seen', 'true');
  };
  
  const nextTip = () => {
    if (currentTip < tutorialTips.length - 1) {
      setCurrentTip(prev => prev + 1);
    } else {
      setShowTutorial(false);
      setCurrentTip(0);
    }
  };
  
  const skipTutorial = () => {
    setShowTutorial(false);
    setCurrentTip(0);
  };
  
  return (
    <SidebarProvider>
      <div className="relative w-full flex h-full overflow-hidden">
        <MapSidebar />
        <div className="flex-1 h-full relative">
          <PixelGrid />
          
          {/* Quick Stats Overlay - Top */}
          {showQuickStats && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 right-4 z-20 pointer-events-none"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl mx-auto">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-background/80 backdrop-blur-md border-primary/20 shadow-lg pointer-events-auto">
                      <CardContent className="p-3 text-center">
                        <div className={`mx-auto mb-1 ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuickStats(false)}
                className="absolute top-2 right-2 h-6 w-6 bg-background/50 hover:bg-background/80"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
          
          {/* User Progress Overlay - Authenticated Users */}
          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 z-20 max-w-xs"
            >
              <Card className="bg-background/90 backdrop-blur-md border-primary/30 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Nível {level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso XP</span>
                      <span className="font-mono">{xp}/{xpMax}</span>
                    </div>
                    <Progress value={xpPercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="font-bold text-primary">{credits.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Créditos</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="font-bold text-accent">{pixels}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Pixels</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs" asChild>
                      <a href="/achievements">
                        <Trophy className="h-3 w-3 mr-1" />
                        Conquistas
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                      <a href="/marketplace">
                        <Gem className="h-3 w-3 mr-1" />
                        Market
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Welcome Overlay for Non-Authenticated Users */}
          <AnimatePresence>
            {showWelcome && !user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <Card className="max-w-md w-full bg-background/95 backdrop-blur-md border-primary/30 shadow-2xl">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-headline text-gradient-gold">
                      Bem-vindo ao Pixel Universe!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground leading-relaxed">
                      Explore o mapa interativo de Portugal, compre pixels únicos e crie arte digital colaborativa. 
                      Junte-se a milhares de artistas e colecionadores!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">10M+ Pixels</p>
                        <p className="text-xs text-muted-foreground">Para explorar</p>
                      </div>
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Users className="h-6 w-6 text-accent mx-auto mb-1" />
                        <p className="text-sm font-medium">1.2K+ Artistas</p>
                        <p className="text-xs text-muted-foreground">Ativos</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <AuthModal defaultTab="register">
                        <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Começar Grátis
                        </Button>
                      </AuthModal>
                      <AuthModal defaultTab="login">
                        <Button variant="outline" className="flex-1">
                          <LogIn className="h-4 w-4 mr-2" />
                          Entrar
                        </Button>
                      </AuthModal>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowTutorial(true)}
                        className="text-xs"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Tutorial
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleDismissWelcome}
                        className="text-xs"
                      >
                        Explorar Livremente
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tutorial Overlay */}
          <AnimatePresence>
            {showTutorial && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="max-w-md w-full"
                >
                  <Card className="bg-background/95 backdrop-blur-md border-primary/30 shadow-2xl">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        {tutorialTips[currentTip].icon}
                      </div>
                      <CardTitle className="text-xl font-headline">
                        {tutorialTips[currentTip].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-center text-muted-foreground leading-relaxed">
                        {tutorialTips[currentTip].description}
                      </p>
                      
                      <div className="flex justify-center gap-2">
                        {tutorialTips.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentTip ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="ghost" size="sm" onClick={skipTutorial}>
                          Pular Tutorial
                        </Button>
                        
                        <div className="flex gap-2">
                          {currentTip > 0 && (
                            <Button variant="outline" size="sm" onClick={() => setCurrentTip(prev => prev - 1)}>
                              Anterior
                            </Button>
                          )}
                          <Button onClick={nextTip}>
                            {currentTip === tutorialTips.length - 1 ? 'Começar!' : 'Próximo'}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Quick Actions Floating Menu - Bottom Right */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-6 right-6 z-20"
            >
              <div className="flex flex-col gap-3">
                {/* Quick Stats Toggle */}
                {!showQuickStats && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowQuickStats(true)}
                    className="bg-background/80 backdrop-blur-sm border-primary/30 shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <a href="/marketplace">
                      <Gem className="h-5 w-5" />
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm border-primary/30 shadow-lg"
                    asChild
                  >
                    <a href="/achievements">
                      <Trophy className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm border-primary/30 shadow-lg"
                    onClick={() => setShowTutorial(true)}
                  >
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Daily Challenge Notification - Bottom Left */}
          {user && Math.random() > 0.7 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="absolute bottom-6 left-6 z-20 max-w-sm"
            >
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-full">
                      <Target className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">Desafio Diário</h3>
                      <p className="text-xs text-muted-foreground">Compre 3 pixels hoje</p>
                      <Progress value={33} className="h-1.5 mt-1" />
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href="/achievements">
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Live Activity Feed - Top Left */}
          {user && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-20 left-4 z-20 max-w-xs"
            >
              <Card className="bg-background/80 backdrop-blur-md border-primary/20 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-500 animate-pulse" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { user: 'PixelMaster', action: 'comprou pixel em Lisboa', time: '2m' },
                    { user: 'ArtCollector', action: 'desbloqueou conquista', time: '5m' },
                    { user: 'ColorQueen', action: 'criou álbum', time: '8m' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-medium text-primary">{activity.user}</span>
                      <span className="text-muted-foreground">{activity.action}</span>
                      <span className="text-muted-foreground ml-auto">{activity.time}</span>
                    </div>
                  ))}
                  
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-2" asChild>
                    <a href="/community">
                      Ver Mais
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Premium Promotion - Occasional */}
          {user && !showWelcome && Math.random() > 0.8 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
              className="absolute bottom-24 right-6 z-20 max-w-xs"
            >
              <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 shadow-lg">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <Crown className="h-8 w-8 text-amber-500 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-amber-500">Upgrade Premium</h3>
                      <p className="text-xs text-muted-foreground">
                        Desbloqueie ferramentas avançadas e pixels exclusivos
                      </p>
                    </div>
                    <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-500" asChild>
                      <a href="/premium">
                        <Rocket className="h-3 w-3 mr-1" />
                        Saber Mais
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        <PerformanceMonitor />
      </div>
    </SidebarProvider>
  );
}
