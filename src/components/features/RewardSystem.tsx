'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, Crown, Medal, Star, Flame, Award, Zap, Sparkles, 
  Target, Users, MapPin, Calendar, Clock, TrendingUp, 
  ChevronUp, ChevronDown, Minus, Activity, BarChart3, 
  Gift, Coins, Gem, Shield, Sword, Heart, Eye, ShoppingCart,
  CreditCard, Wallet, PiggyBank, TrendingDown, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'daily' | 'weekly' | 'achievement' | 'position' | 'streak' | 'special';
  value: number;
  currency: 'credits' | 'xp' | 'special_credits';
  isClaimed: boolean;
  isAvailable: boolean;
  expiresAt?: string;
  requirements?: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface PositionReward {
  position: number;
  credits: number;
  xp: number;
  specialRewards: string[];
  isClaimed: boolean;
}

interface StreakReward {
  days: number;
  credits: number;
  xp: number;
  bonus: number;
  isClaimed: boolean;
}

interface UserStats {
  totalCredits: number;
  totalXP: number;
  specialCredits: number;
  currentStreak: number;
  longestStreak: number;
  totalRewards: number;
  currentPosition: number;
  level: number;
}

const dailyRewards: Reward[] = [
  {
    id: 'daily-1',
    name: 'Recompensa Diária',
    description: 'Faça login diariamente para receber recompensas',
    icon: <Calendar className="h-5 w-5" />,
    type: 'daily',
    value: 50,
    currency: 'credits',
    isClaimed: false,
    isAvailable: true,
    rarity: 'common'
  },
  {
    id: 'daily-2',
    name: 'Bônus de Atividade',
    description: 'Complete 5 ações hoje',
    icon: <Activity className="h-5 w-5" />,
    type: 'daily',
    value: 25,
    currency: 'credits',
    isClaimed: false,
    isAvailable: false,
    requirements: ['5 ações completadas'],
    rarity: 'uncommon'
  },
  {
    id: 'daily-3',
    name: 'Pixel Master',
    description: 'Compre 3 pixels hoje',
    icon: <MapPin className="h-5 w-5" />,
    type: 'daily',
    value: 100,
    currency: 'credits',
    isClaimed: false,
    isAvailable: false,
    requirements: ['3 pixels comprados'],
    rarity: 'rare'
  }
];

const weeklyRewards: Reward[] = [
  {
    id: 'weekly-1',
    name: 'Recompensa Semanal',
    description: 'Faça login 7 dias seguidos',
    icon: <Calendar className="h-5 w-5" />,
    type: 'weekly',
    value: 500,
    currency: 'credits',
    isClaimed: false,
    isAvailable: true,
    rarity: 'uncommon'
  },
  {
    id: 'weekly-2',
    name: 'Colecionador Semanal',
    description: 'Colecione 20 pixels únicos esta semana',
    icon: <Target className="h-5 w-5" />,
    type: 'weekly',
    value: 250,
    currency: 'credits',
    isClaimed: false,
    isAvailable: false,
    requirements: ['20 pixels únicos'],
    rarity: 'rare'
  },
  {
    id: 'weekly-3',
    name: 'Artista da Semana',
    description: 'Crie 10 pixels artísticos esta semana',
    icon: <Star className="h-5 w-5" />,
    type: 'weekly',
    value: 750,
    currency: 'credits',
    isClaimed: false,
    isAvailable: false,
    requirements: ['10 pixels artísticos'],
    rarity: 'epic'
  }
];

const positionRewards: PositionReward[] = [
  {
    position: 1,
    credits: 10000,
    xp: 5000,
    specialRewards: ['Título de Campeão', 'Pixel Dourado', 'Badge Especial'],
    isClaimed: false
  },
  {
    position: 2,
    credits: 5000,
    xp: 2500,
    specialRewards: ['Título de Vice-Campeão', 'Pixel Prateado'],
    isClaimed: false
  },
  {
    position: 3,
    credits: 2500,
    xp: 1250,
    specialRewards: ['Título de Terceiro Lugar', 'Pixel de Bronze'],
    isClaimed: false
  },
  {
    position: 10,
    credits: 1000,
    xp: 500,
    specialRewards: ['Badge Top 10'],
    isClaimed: false
  },
  {
    position: 50,
    credits: 500,
    xp: 250,
    specialRewards: ['Badge Top 50'],
    isClaimed: false
  },
  {
    position: 100,
    credits: 250,
    xp: 125,
    specialRewards: ['Badge Top 100'],
    isClaimed: false
  }
];

const streakRewards: StreakReward[] = [
  {
    days: 7,
    credits: 100,
    xp: 50,
    bonus: 10,
    isClaimed: false
  },
  {
    days: 14,
    credits: 250,
    xp: 125,
    bonus: 15,
    isClaimed: false
  },
  {
    days: 30,
    credits: 750,
    xp: 375,
    bonus: 25,
    isClaimed: false
  },
  {
    days: 60,
    credits: 1500,
    xp: 750,
    bonus: 50,
    isClaimed: false
  },
  {
    days: 100,
    credits: 3000,
    xp: 1500,
    bonus: 100,
    isClaimed: false
  }
];

const userStats: UserStats = {
  totalCredits: 12500,
  totalXP: 8500,
  specialCredits: 250,
  currentStreak: 12,
  longestStreak: 45,
  totalRewards: 23,
  currentPosition: 15,
  level: 18
};

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

export const RewardSystem: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('daily');
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const handleClaimReward = (rewardId: string) => {
    if (!claimedRewards.includes(rewardId)) {
      setClaimedRewards([...claimedRewards, rewardId]);
    }
  };

  const getAvailablePositionRewards = () => {
    return positionRewards.filter(reward => 
      userStats.currentPosition <= reward.position && !reward.isClaimed
    );
  };

  const getAvailableStreakRewards = () => {
    return streakRewards.filter(reward => 
      userStats.currentStreak >= reward.days && !reward.isClaimed
    );
  };

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Gift className="h-5 w-5 mr-2" />
            Sistema de Recompensas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.totalCredits.toLocaleString('pt-PT')}</div>
              <div className="text-sm text-muted-foreground">Créditos Totais</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">{userStats.totalXP.toLocaleString('pt-PT')}</div>
              <div className="text-sm text-muted-foreground">XP Total</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{userStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Sequência Atual</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{userStats.totalRewards}</div>
              <div className="text-sm text-muted-foreground">Recompensas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Award className="h-5 w-5 mr-2" />
            Recompensas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Diárias</span>
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Semanais</span>
              </TabsTrigger>
              <TabsTrigger value="position" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden md:inline">Posição</span>
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span className="hidden md:inline">Sequência</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Daily Rewards */}
            <TabsContent value="daily" className="mt-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {dailyRewards.map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "transition-all duration-300 hover:shadow-lg",
                        claimedRewards.includes(reward.id) ? "ring-2 ring-green-500/20 bg-green-500/5" : "",
                        getRarityBorder(reward.rarity)
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn("p-3 rounded-lg", getRarityColor(reward.rarity))}>
                                {reward.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{reward.name}</h3>
                                  <Badge variant="outline" className={cn("text-xs", getRarityColor(reward.rarity))}>
                                    {reward.rarity.toUpperCase()}
                                  </Badge>
                                  {claimedRewards.includes(reward.id) && (
                                    <Badge variant="default" className="bg-green-500 text-xs">
                                      Reclamado
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                                {reward.requirements && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {reward.requirements.map((req, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                {reward.currency === 'credits' && <Coins className="h-4 w-4 text-yellow-500" />}
                                {reward.currency === 'xp' && <Zap className="h-4 w-4 text-blue-500" />}
                                {reward.currency === 'special_credits' && <Gem className="h-4 w-4 text-purple-500" />}
                                <span className="font-bold">{reward.value}</span>
                              </div>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleClaimReward(reward.id)}
                                disabled={!reward.isAvailable || claimedRewards.includes(reward.id)}
                              >
                                {claimedRewards.includes(reward.id) ? 'Reclamado' : 'Reclamar'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Weekly Rewards */}
            <TabsContent value="weekly" className="mt-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {weeklyRewards.map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        "transition-all duration-300 hover:shadow-lg",
                        claimedRewards.includes(reward.id) ? "ring-2 ring-green-500/20 bg-green-500/5" : "",
                        getRarityBorder(reward.rarity)
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn("p-3 rounded-lg", getRarityColor(reward.rarity))}>
                                {reward.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{reward.name}</h3>
                                  <Badge variant="outline" className={cn("text-xs", getRarityColor(reward.rarity))}>
                                    {reward.rarity.toUpperCase()}
                                  </Badge>
                                  {claimedRewards.includes(reward.id) && (
                                    <Badge variant="default" className="bg-green-500 text-xs">
                                      Reclamado
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                                {reward.requirements && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {reward.requirements.map((req, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                {reward.currency === 'credits' && <Coins className="h-4 w-4 text-yellow-500" />}
                                {reward.currency === 'xp' && <Zap className="h-4 w-4 text-blue-500" />}
                                {reward.currency === 'special_credits' && <Gem className="h-4 w-4 text-purple-500" />}
                                <span className="font-bold">{reward.value}</span>
                              </div>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleClaimReward(reward.id)}
                                disabled={!reward.isAvailable || claimedRewards.includes(reward.id)}
                              >
                                {claimedRewards.includes(reward.id) ? 'Reclamado' : 'Reclamar'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Position Rewards */}
            <TabsContent value="position" className="mt-4">
              <div className="space-y-4">
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Sua Posição Atual: #{userStats.currentPosition}</h3>
                  <p className="text-sm text-muted-foreground">
                    Recompensas baseadas na sua posição no ranking geral
                  </p>
                </div>
                
                <AnimatePresence>
                  {getAvailablePositionRewards().map((reward, index) => (
                    <motion.div
                      key={reward.position}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-primary/10">
                                {reward.position === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                                {reward.position === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                                {reward.position === 3 && <Medal className="h-5 w-5 text-orange-400" />}
                                {reward.position > 3 && <Trophy className="h-5 w-5 text-primary" />}
                              </div>
                              <div>
                                <h3 className="font-semibold">Top {reward.position}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Recompensa por estar no top {reward.position} do ranking
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {reward.specialRewards.map((special, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {special}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="space-y-1 mb-2">
                                <div className="flex items-center gap-1">
                                  <Coins className="h-4 w-4 text-yellow-500" />
                                  <span className="font-bold">{reward.credits}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="h-4 w-4 text-blue-500" />
                                  <span className="font-bold">{reward.xp} XP</span>
                                </div>
                              </div>
                              <Button 
                                variant="default" 
                                size="sm"
                                disabled={reward.isClaimed}
                              >
                                {reward.isClaimed ? 'Reclamado' : 'Reclamar'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Streak Rewards */}
            <TabsContent value="streak" className="mt-4">
              <div className="space-y-4">
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Sequência Atual: {userStats.currentStreak} dias</h3>
                  <p className="text-sm text-muted-foreground">
                    Mantenha a sequência para desbloquear recompensas especiais
                  </p>
                  <Progress value={(userStats.currentStreak / 100) * 100} className="mt-2" />
                </div>
                
                <AnimatePresence>
                  {getAvailableStreakRewards().map((reward, index) => (
                    <motion.div
                      key={reward.days}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-orange-500/10">
                                <Flame className="h-5 w-5 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{reward.days} Dias de Sequência</h3>
                                <p className="text-sm text-muted-foreground">
                                  Recompensa por manter {reward.days} dias de atividade
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    +{reward.bonus}% Bônus
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="space-y-1 mb-2">
                                <div className="flex items-center gap-1">
                                  <Coins className="h-4 w-4 text-yellow-500" />
                                  <span className="font-bold">{reward.credits}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="h-4 w-4 text-blue-500" />
                                  <span className="font-bold">{reward.xp} XP</span>
                                </div>
                              </div>
                              <Button 
                                variant="default" 
                                size="sm"
                                disabled={reward.isClaimed}
                              >
                                {reward.isClaimed ? 'Reclamado' : 'Reclamar'}
                              </Button>
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

      {/* Special Advantages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Shield className="h-5 w-5 mr-2" />
            Vantagens Especiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Bônus de XP</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                +15% XP ganho devido ao seu nível e posição no ranking
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-500">Ativo</Badge>
                <span className="text-sm text-green-500">+15% XP</span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Coins className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Bônus de Créditos</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                +10% créditos ganhos devido às suas conquistas
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-500">Ativo</Badge>
                <span className="text-sm text-blue-500">+10% Créditos</span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Desconto no Marketplace</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                -5% em todas as compras devido ao seu status premium
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-purple-500">Ativo</Badge>
                <span className="text-sm text-purple-500">-5% Compras</span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Recompensas Extras</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Recompensas especiais desbloqueadas devido à sua sequência
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-orange-500">Ativo</Badge>
                <span className="text-sm text-orange-500">Recompensas +</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
