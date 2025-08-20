'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Trophy, Star, Crown, Award, Target, Flame, TrendingUp,
  Users, MessageSquare, Heart, Share2, Zap, Gift, Coins,
  Medal, Shield, Sparkles, Gem, Lightbulb, UserCheck, CheckCircle
} from "lucide-react";
import { cn } from '@/lib/utils';

interface UserReputation {
  level: number;
  currentXp: number;
  xpToNext: number;
  totalXp: number;
  rank: string;
  badges: Badge[];
  titles: Title[];
  karma: number;
  streaks: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earnedAt: string;
  progress?: number;
  maxProgress?: number;
}

interface Title {
  id: string;
  name: string;
  description: string;
  effect: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  unlockedAt: string;
}

interface KarmaActivity {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  timestamp: string;
  category: string;
}

const mockReputation: UserReputation = {
  level: 23,
  currentXp: 2750,
  xpToNext: 500,
  totalXp: 15420,
  rank: 'Artista Experiente',
  badges: [],
  titles: [],
  karma: 1340,
  streaks: {
    daily: 7,
    weekly: 3,
    monthly: 1
  }
};

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Primeiro Post',
    description: 'Publicou seu primeiro post na comunidade',
    icon: '📝',
    rarity: 'common',
    category: 'Iniciante',
    earnedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Viral',
    description: 'Post recebeu mais de 100 likes',
    icon: '🔥',
    rarity: 'rare',
    category: 'Social',
    earnedAt: '2024-01-12T15:30:00Z'
  },
  {
    id: '3',
    name: 'Mentor',
    description: 'Ajudou 10 novos membros',
    icon: '🎓',
    rarity: 'epic',
    category: 'Comunidade',
    earnedAt: '2024-01-14T09:20:00Z'
  },
  {
    id: '4',
    name: 'Pixel Master',
    description: 'Criou uma obra-prima reconhecida',
    icon: '🎨',
    rarity: 'legendary',
    category: 'Arte',
    earnedAt: '2024-01-15T18:45:00Z'
  },
  {
    id: '5',
    name: 'Série Diária',
    description: 'Manteve atividade por 30 dias consecutivos',
    icon: '⚡',
    rarity: 'rare',
    category: 'Dedicação',
    progress: 25,
    maxProgress: 30,
    earnedAt: ''
  }
];

const mockTitles: Title[] = [
  {
    id: '1',
    name: 'Influenciador',
    description: 'Reconhecido pela comunidade como influência positiva',
    effect: '+10% XP em interações sociais',
    rarity: 'epic',
    isActive: true,
    unlockedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '2',
    name: 'Pioneiro',
    description: 'Entre os primeiros 100 membros da comunidade',
    effect: 'Badge especial e reconhecimento',
    rarity: 'legendary',
    isActive: false,
    unlockedAt: '2024-01-05T08:00:00Z'
  },
  {
    id: '3',
    name: 'Mentor Certificado',
    description: 'Certificado para orientar novos artistas',
    effect: 'Acesso a ferramentas de mentoria',
    rarity: 'rare',
    isActive: false,
    unlockedAt: '2024-01-14T16:30:00Z'
  }
];

const mockKarmaHistory: KarmaActivity[] = [
  {
    id: '1',
    type: 'earned',
    amount: 50,
    reason: 'Post popular (+100 likes)',
    timestamp: '2024-01-15T14:30:00Z',
    category: 'Social'
  },
  {
    id: '2',
    type: 'earned',
    amount: 25,
    reason: 'Comentário útil marcado como melhor resposta',
    timestamp: '2024-01-15T12:15:00Z',
    category: 'Ajuda'
  },
  {
    id: '3',
    type: 'spent',
    amount: 100,
    reason: 'Destacar post no feed',
    timestamp: '2024-01-15T10:00:00Z',
    category: 'Promoção'
  }
];

export function CommunityGamification() {
  const [reputation, setReputation] = useState<UserReputation>(mockReputation);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [titles, setTitles] = useState<Title[]>(mockTitles);
  const [karmaHistory, setKarmaHistory] = useState<KarmaActivity[]>(mockKarmaHistory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-200';
      case 'rare': return 'text-blue-500 border-blue-200';
      case 'epic': return 'text-purple-500 border-purple-200';
      case 'legendary': return 'text-yellow-500 border-yellow-200';
      default: return 'text-gray-500 border-gray-200';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50';
      case 'rare': return 'bg-blue-50';
      case 'epic': return 'bg-purple-50';
      case 'legendary': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  const activateTitle = (titleId: string) => {
    setTitles(prev => prev.map(title => ({
      ...title,
      isActive: title.id === titleId
    })));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-purple-500" />
            Sistema de Gamificação
          </CardTitle>
          <CardDescription>
            Ganhe XP, badges, títulos e karma por participação ativa na comunidade
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Reputation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Reputação da Comunidade
            </div>
            <Badge className="bg-purple-500">Nível {reputation.level}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{reputation.rank}</span>
              <span className="text-muted-foreground">
                {reputation.currentXp}/{reputation.currentXp + reputation.xpToNext} XP
              </span>
            </div>
            <Progress 
              value={(reputation.currentXp / (reputation.currentXp + reputation.xpToNext)) * 100} 
              className="h-3"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{reputation.karma}</div>
              <div className="text-sm text-muted-foreground">Karma</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{badges.filter(b => b.earnedAt).length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{titles.length}</div>
              <div className="text-sm text-muted-foreground">Títulos</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">{reputation.streaks.daily}</div>
              <div className="text-sm text-muted-foreground">Série Diária</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="badges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="badges">
            <Award className="h-4 w-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="titles">
            <Crown className="h-4 w-4 mr-2" />
            Títulos
          </TabsTrigger>
          <TabsTrigger value="karma">
            <Coins className="h-4 w-4 mr-2" />
            Karma
          </TabsTrigger>
          <TabsTrigger value="streaks">
            <Flame className="h-4 w-4 mr-2" />
            Séries
          </TabsTrigger>
        </TabsList>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                  getRarityColor(badge.rarity),
                  !badge.earnedAt && "opacity-60"
                )}>
                  <CardContent className={cn("p-4", getRarityBg(badge.rarity))}>
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{badge.icon}</div>
                      <div>
                        <h3 className="font-semibold">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {badge.rarity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {badge.category}
                        </Badge>
                      </div>
                      {badge.progress !== undefined && (
                        <div className="space-y-1">
                          <Progress value={(badge.progress / badge.maxProgress!) * 100} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {badge.progress}/{badge.maxProgress}
                          </div>
                        </div>
                      )}
                      {badge.earnedAt && (
                        <div className="text-xs text-muted-foreground">
                          Conquistado em {new Date(badge.earnedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Titles Tab */}
        <TabsContent value="titles" className="space-y-4">
          <div className="space-y-3">
            {titles.map((title) => (
              <Card key={title.id} className={cn(
                "transition-all duration-300",
                title.isActive && "ring-2 ring-purple-500 bg-purple-50"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        title.isActive ? "bg-purple-500 text-white" : "bg-gray-100"
                      )}>
                        <Crown className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{title.name}</h3>
                          <Badge className={cn("capitalize text-xs", getRarityColor(title.rarity))}>
                            {title.rarity}
                          </Badge>
                          {title.isActive && (
                            <Badge className="bg-green-500 text-xs">Ativo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{title.description}</p>
                        <p className="text-xs text-blue-600 font-medium">{title.effect}</p>
                      </div>
                    </div>
                    {!title.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => activateTitle(title.id)}
                      >
                        Ativar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Karma Tab */}
        <TabsContent value="karma" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                Sistema de Karma
              </CardTitle>
              <CardDescription>
                Ganhe karma por contribuições positivas e use para destacar conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-4xl font-bold text-yellow-600">{reputation.karma}</div>
                <div className="text-sm text-muted-foreground">Karma Total</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold">Histórico de Karma</h3>
            {karmaHistory.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        activity.type === 'earned' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {activity.type === 'earned' ? <TrendingUp className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{activity.reason}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.category} • {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "font-bold",
                      activity.type === 'earned' ? "text-green-600" : "text-red-600"
                    )}>
                      {activity.type === 'earned' ? '+' : '-'}{activity.amount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Streaks Tab */}
        <TabsContent value="streaks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <Flame className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-600">{reputation.streaks.daily}</div>
                <div className="text-sm text-muted-foreground">Dias Consecutivos</div>
                <Progress value={70} className="mt-3 h-2" />
                <div className="text-xs text-muted-foreground mt-1">7/10 para próximo prêmio</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600">{reputation.streaks.weekly}</div>
                <div className="text-sm text-muted-foreground">Semanas Ativas</div>
                <Progress value={75} className="mt-3 h-2" />
                <div className="text-xs text-muted-foreground mt-1">3/4 para badge especial</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Crown className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600">{reputation.streaks.monthly}</div>
                <div className="text-sm text-muted-foreground">Meses Ativos</div>
                <Progress value={33} className="mt-3 h-2" />
                <div className="text-xs text-muted-foreground mt-1">1/3 para título épico</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recompensas de Série</CardTitle>
              <CardDescription>
                Mantenha sua atividade e desbloqueie recompensas exclusivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">7 Dias Consecutivos</div>
                      <div className="text-sm text-muted-foreground">+50 XP e 25 Karma</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Conquistado</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">10 Dias Consecutivos</div>
                      <div className="text-sm text-muted-foreground">Badge especial + 100 XP</div>
                    </div>
                  </div>
                  <Badge variant="outline">3 dias restantes</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
