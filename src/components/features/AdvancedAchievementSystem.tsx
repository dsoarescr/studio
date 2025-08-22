'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Star, Flame, Award, Zap, Target, TrendingUp, Coins, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewards: {
    credits: number;
    xp: number;
    specialRewards?: string[];
  };
  tier: number;
  maxTier: number;
}

interface Title {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  requirements: string[];
  effects: string[];
}

interface PrestigeLevel {
  level: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirements: {
    achievements: number;
    titles: number;
    totalXP: number;
  };
  isUnlocked: boolean;
  rewards: string[];
}

const achievements: Achievement[] = [
  {
    id: 'first_pixel',
    name: 'Primeiro Pixel',
    description: 'Compre o seu primeiro pixel',
    icon: <MapPin className="h-5 w-5" />,
    category: 'collection',
    rarity: 'common',
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '2024-01-15T10:30:00Z',
    rewards: { credits: 100, xp: 50 },
    tier: 1,
    maxTier: 1
  },
  {
    id: 'pixel_collector',
    name: 'Colecionador de Pixels',
    description: 'Possua 100 pixels',
    icon: <Target className="h-5 w-5" />,
    category: 'collection',
    rarity: 'uncommon',
    progress: 75,
    maxProgress: 100,
    isUnlocked: false,
    rewards: { credits: 500, xp: 200 },
    tier: 1,
    maxTier: 3
  },
  {
    id: 'streak_master',
    name: 'Mestre da Sequência',
    description: 'Mantenha uma sequência de 30 dias',
    icon: <Flame className="h-5 w-5" />,
    category: 'consistency',
    rarity: 'rare',
    progress: 25,
    maxProgress: 30,
    isUnlocked: false,
    rewards: { credits: 1000, xp: 500, specialRewards: ['Badge de Fogo'] },
    tier: 1,
    maxTier: 1
  },
  {
    id: 'art_virtuoso',
    name: 'Virtuoso da Arte',
    description: 'Crie 50 pixels com qualidade artística superior',
    icon: <Star className="h-5 w-5" />,
    category: 'art',
    rarity: 'epic',
    progress: 30,
    maxProgress: 50,
    isUnlocked: false,
    rewards: { credits: 2000, xp: 1000, specialRewards: ['Título de Artista'] },
    tier: 1,
    maxTier: 1
  },
  {
    id: 'market_king',
    name: 'Rei do Mercado',
    description: 'Realize 1000 transações',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'trading',
    rarity: 'legendary',
    progress: 750,
    maxProgress: 1000,
    isUnlocked: false,
    rewards: { credits: 5000, xp: 2500, specialRewards: ['Título de Mercador', 'Pixel Dourado'] },
    tier: 1,
    maxTier: 1
  }
];

const titles: Title[] = [
  {
    id: 'pixel_novice',
    name: 'Novato dos Pixels',
    description: 'O início de uma grande jornada',
    icon: <Star className="h-4 w-4" />,
    rarity: 'common',
    isUnlocked: true,
    requirements: ['Comprar primeiro pixel'],
    effects: ['+5% XP ganho']
  },
  {
    id: 'pixel_collector',
    name: 'Colecionador',
    description: 'Um verdadeiro colecionador de pixels',
    icon: <Target className="h-4 w-4" />,
    rarity: 'uncommon',
    isUnlocked: false,
    requirements: ['Possuir 100 pixels', 'Desbloquear 10 conquistas'],
    effects: ['+10% XP ganho', '+5% créditos ganhos']
  },
  {
    id: 'pixel_artist',
    name: 'Artista dos Pixels',
    description: 'Um mestre da arte pixel',
    icon: <Award className="h-4 w-4" />,
    rarity: 'rare',
    isUnlocked: false,
    requirements: ['Criar 50 pixels artísticos', 'Receber 1000 gostos'],
    effects: ['+15% XP ganho', '+10% valor de pixels', 'Badge especial']
  },
  {
    id: 'pixel_legend',
    name: 'Lenda dos Pixels',
    description: 'Uma lenda viva do Pixel Universe',
    icon: <Crown className="h-4 w-4" />,
    rarity: 'legendary',
    isUnlocked: false,
    requirements: ['Top 1% do ranking', '1000 dias de sequência', 'Todas as conquistas'],
    effects: ['+25% XP ganho', '+20% créditos ganhos', 'Título único', 'Pixel lendário']
  }
];

const prestigeLevels: PrestigeLevel[] = [
  {
    level: 1,
    name: 'Iniciante',
    description: 'O começo da sua jornada',
    icon: <Star className="h-4 w-4" />,
    color: 'text-gray-500',
    requirements: { achievements: 0, titles: 0, totalXP: 0 },
    isUnlocked: true,
    rewards: ['Acesso básico']
  },
  {
    level: 2,
    name: 'Aventureiro',
    description: 'Um aventureiro experiente',
    icon: <Target className="h-4 w-4" />,
    color: 'text-green-500',
    requirements: { achievements: 5, titles: 1, totalXP: 1000 },
    isUnlocked: false,
    rewards: ['+10% XP', 'Badge de Aventureiro']
  },
  {
    level: 3,
    name: 'Veterano',
    description: 'Um veterano do Pixel Universe',
    icon: <Award className="h-4 w-4" />,
    color: 'text-blue-500',
    requirements: { achievements: 15, titles: 3, totalXP: 5000 },
    isUnlocked: false,
    rewards: ['+20% XP', 'Título de Veterano', 'Pixels especiais']
  },
  {
    level: 4,
    name: 'Mestre',
    description: 'Um mestre reconhecido',
    icon: <Crown className="h-4 w-4" />,
    color: 'text-purple-500',
    requirements: { achievements: 30, titles: 5, totalXP: 15000 },
    isUnlocked: false,
    rewards: ['+30% XP', 'Título de Mestre', 'Pixels lendários']
  },
  {
    level: 5,
    name: 'Lenda',
    description: 'Uma lenda imortal',
    icon: <Trophy className="h-4 w-4" />,
    color: 'text-yellow-500',
    requirements: { achievements: 50, titles: 10, totalXP: 50000 },
    isUnlocked: false,
    rewards: ['+50% XP', 'Título de Lenda', 'Pixel único', 'Acesso VIP']
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-500';
    case 'uncommon': return 'text-green-500';
    case 'rare': return 'text-blue-500';
    case 'epic': return 'text-purple-500';
    case 'legendary': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};

const getRarityBorder = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'border-gray-500/20';
    case 'uncommon': return 'border-green-500/20';
    case 'rare': return 'border-blue-500/20';
    case 'epic': return 'border-purple-500/20';
    case 'legendary': return 'border-yellow-500/20';
    default: return 'border-gray-500/20';
  }
};

export const AdvancedAchievementSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.isUnlocked).length,
    totalTitles: titles.length,
    unlockedTitles: titles.filter(t => t.isUnlocked).length,
    currentPrestige: 1,
    totalXP: 2500
  });

  const categories = [
    { id: 'all', name: 'Todas', icon: <Trophy className="h-4 w-4" /> },
    { id: 'collection', name: 'Coleção', icon: <Target className="h-4 w-4" /> },
    { id: 'consistency', name: 'Consistência', icon: <Flame className="h-4 w-4" /> },
    { id: 'art', name: 'Arte', icon: <Star className="h-4 w-4" /> },
    { id: 'trading', name: 'Trading', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Trophy className="h-5 w-5 mr-2" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userProgress.unlockedAchievements}</div>
              <div className="text-sm text-muted-foreground">Conquistas</div>
              <Progress value={(userProgress.unlockedAchievements / userProgress.totalAchievements) * 100} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">{userProgress.unlockedTitles}</div>
              <div className="text-sm text-muted-foreground">Títulos</div>
              <Progress value={(userProgress.unlockedTitles / userProgress.totalTitles) * 100} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{userProgress.currentPrestige}</div>
              <div className="text-sm text-muted-foreground">Prestígio</div>
              <Progress value={(userProgress.currentPrestige / 5) * 100} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{userProgress.totalXP.toLocaleString('pt-PT')}</div>
              <div className="text-sm text-muted-foreground">XP Total</div>
              <Progress value={(userProgress.totalXP / 50000) * 100} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prestige System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Crown className="h-5 w-5 mr-2" />
            Sistema de Prestígio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prestigeLevels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "transition-all duration-300",
                  level.isUnlocked ? "ring-2 ring-primary bg-primary/5" : "opacity-60"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg", level.color)}>
                          {level.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{level.name}</h3>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={level.isUnlocked ? "default" : "secondary"}>
                          Nível {level.level}
                        </Badge>
                        {level.isUnlocked && (
                          <div className="text-xs text-green-500 mt-1">Desbloqueado</div>
                        )}
                      </div>
                    </div>
                    
                    {!level.isUnlocked && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Requisitos:</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>Conquistas: {level.requirements.achievements}</div>
                          <div>Títulos: {level.requirements.titles}</div>
                          <div>XP: {level.requirements.totalXP.toLocaleString('pt-PT')}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Recompensas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {level.rewards.map((reward, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Award className="h-5 w-5 mr-2" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "transition-all duration-300 hover:shadow-lg",
                        achievement.isUnlocked ? "ring-2 ring-green-500/20 bg-green-500/5" : "",
                        getRarityBorder(achievement.rarity)
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn("p-3 rounded-lg", getRarityColor(achievement.rarity))}>
                                {achievement.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{achievement.name}</h3>
                                  <Badge variant="outline" className={cn("text-xs", getRarityColor(achievement.rarity))}>
                                    {achievement.rarity.toUpperCase()}
                                  </Badge>
                                  {achievement.isUnlocked && (
                                    <Badge variant="default" className="bg-green-500 text-xs">
                                      Desbloqueado
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-2">
                                    <Coins className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm">{achievement.rewards.credits}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{achievement.rewards.xp} XP</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {achievement.progress} / {achievement.maxProgress}
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="w-24 mt-1" 
                              />
                              {achievement.isUnlocked && achievement.unlockedAt && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(achievement.unlockedAt).toLocaleDateString('pt-PT')}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Titles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Crown className="h-5 w-5 mr-2" />
            Títulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {titles.map((title, index) => (
              <motion.div
                key={title.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg",
                    title.isUnlocked ? "ring-2 ring-primary bg-primary/5" : "opacity-60",
                    getRarityBorder(title.rarity)
                  )}
                  onClick={() => setSelectedTitle(selectedTitle === title.id ? null : title.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", getRarityColor(title.rarity))}>
                          {title.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{title.name}</h3>
                          <p className="text-sm text-muted-foreground">{title.description}</p>
                        </div>
                      </div>
                      <Badge variant={title.isUnlocked ? "default" : "secondary"} className={getRarityColor(title.rarity)}>
                        {title.rarity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {selectedTitle === title.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div>
                          <h4 className="text-sm font-medium mb-2">Requisitos:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {title.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Efeitos:</h4>
                          <div className="flex flex-wrap gap-1">
                            {title.effects.map((effect, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

