'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Target, Flame, Star, Crown, Gem, Zap, Gift, 
  Calendar, Clock, Users, MapPin, Palette, Award, Medal,
  TrendingUp, BarChart3, Sparkles, Rocket, Shield, Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/store';
import { Confetti } from '@/components/ui/confetti';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  reward: {
    xp: number;
    credits: number;
    specialCredits?: number;
  };
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Extremo';
  timeLeft: number; // em horas
  completed: boolean;
}

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  rewards: Array<{
    milestone: number;
    reward: string;
    claimed: boolean;
  }>;
  specialPixels: Array<{
    x: number;
    y: number;
    rarity: string;
    price: number;
  }>;
}

interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly';
  users: Array<{
    rank: number;
    name: string;
    avatar: string;
    score: number;
    change: number;
  }>;
}

interface PixelGameificationProps {
  children: React.ReactNode;
}

const mockChallenges: DailyChallenge[] = [
  {
    id: '1',
    title: 'Explorador Diário',
    description: 'Visite 5 regiões diferentes do mapa',
    icon: <MapPin className="h-6 w-6" />,
    progress: 3,
    target: 5,
    reward: { xp: 100, credits: 50 },
    difficulty: 'Fácil',
    timeLeft: 18,
    completed: false
  },
  {
    id: '2',
    title: 'Artista Colorido',
    description: 'Use 10 cores diferentes em seus pixels',
    icon: <Palette className="h-6 w-6" />,
    progress: 7,
    target: 10,
    reward: { xp: 150, credits: 75, specialCredits: 10 },
    difficulty: 'Médio',
    timeLeft: 18,
    completed: false
  },
  {
    id: '3',
    title: 'Colecionador Premium',
    description: 'Compre 3 pixels raros ou superiores',
    icon: <Gem className="h-6 w-6" />,
    progress: 1,
    target: 3,
    reward: { xp: 300, credits: 200, specialCredits: 25 },
    difficulty: 'Difícil',
    timeLeft: 18,
    completed: false
  }
];

const mockEvent: SeasonalEvent = {
  id: 'winter2024',
  name: 'Festival de Inverno 2024',
  description: 'Celebre o inverno com pixels especiais e recompensas exclusivas!',
  startDate: '2024-12-01',
  endDate: '2024-12-31',
  progress: 65,
  rewards: [
    { milestone: 25, reward: 'Badge de Neve', claimed: true },
    { milestone: 50, reward: '500 Créditos Especiais', claimed: true },
    { milestone: 75, reward: 'Pixel Lendário Exclusivo', claimed: false },
    { milestone: 100, reward: 'Título: Mestre do Inverno', claimed: false }
  ],
  specialPixels: [
    { x: 300, y: 200, rarity: 'Épico', price: 150 },
    { x: 450, y: 350, rarity: 'Lendário', price: 500 }
  ]
};

const mockLeaderboard: Leaderboard = {
  period: 'weekly',
  users: [
    { rank: 1, name: 'PixelKing', avatar: 'https://placehold.co/40x40.png', score: 15420, change: 2 },
    { rank: 2, name: 'ArtMaster', avatar: 'https://placehold.co/40x40.png', score: 14890, change: -1 },
    { rank: 3, name: 'ColorQueen', avatar: 'https://placehold.co/40x40.png', score: 13560, change: 1 },
    { rank: 4, name: 'PixelPro', avatar: 'https://placehold.co/40x40.png', score: 12340, change: 0 },
    { rank: 5, name: 'Você', avatar: 'https://placehold.co/40x40.png', score: 11890, change: 3 }
  ]
};

export default function PixelGameification({ children }: PixelGameificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [challenges, setChallenges] = useState(mockChallenges);
  const [currentEvent] = useState(mockEvent);
  const [leaderboard] = useState(mockLeaderboard);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [streak, setStreak] = useState(7);
  const [dailyBonus, setDailyBonus] = useState(false);
  
  const { addCredits, addSpecialCredits, addXp } = useUserStore();
  const { toast } = useToast();

  // Simular progresso dos desafios
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setChallenges(prev => prev.map(challenge => {
        if (challenge.completed) return challenge;
        
        const shouldProgress = Math.random() > 0.8;
        if (shouldProgress && challenge.progress < challenge.target) {
          const newProgress = Math.min(challenge.progress + 1, challenge.target);
          const isCompleted = newProgress >= challenge.target;
          
          if (isCompleted) {
            setShowConfetti(true);
            setPlaySuccessSound(true);
            
            toast({
              title: "Desafio Concluído! 🎉",
              description: `${challenge.title} - Recompensas recebidas!`,
            });
            
            addXp(challenge.reward.xp);
            addCredits(challenge.reward.credits);
            if (challenge.reward.specialCredits) {
              addSpecialCredits(challenge.reward.specialCredits);
            }
          }
          
          return { ...challenge, progress: newProgress, completed: isCompleted };
        }
        
        return challenge;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, addCredits, addSpecialCredits, addXp, toast]);

  const claimDailyBonus = () => {
    if (dailyBonus) return;
    
    setDailyBonus(true);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    const bonusAmount = streak * 10;
    addCredits(bonusAmount);
    addXp(streak * 5);
    
    toast({
      title: "Bónus Diário Reclamado! 🎁",
      description: `${bonusAmount} créditos + ${streak * 5} XP (Sequência: ${streak} dias)`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-500 bg-green-500/10';
      case 'Médio': return 'text-yellow-500 bg-yellow-500/10';
      case 'Difícil': return 'text-orange-500 bg-orange-500/10';
      case 'Extremo': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <DialogTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Centro de Gamificação
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Novo!
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="challenges" className="flex-1 flex flex-col">
          <TabsList className="px-4 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="challenges">
              <Target className="h-4 w-4 mr-2" />
              Desafios
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Classificação
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Gift className="h-4 w-4 mr-2" />
              Recompensas
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            {/* Desafios Diários */}
            <TabsContent value="challenges" className="h-full p-4 space-y-4">
              {/* Bónus Diário */}
              <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-500/20 rounded-full">
                        <Gift className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Bónus Diário</h3>
                        <p className="text-sm text-muted-foreground">
                          Sequência: {streak} dias consecutivos
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-500">
                        +{streak * 10} créditos
                      </div>
                      <Button 
                        onClick={claimDailyBonus}
                        disabled={dailyBonus}
                        className="mt-2"
                      >
                        {dailyBonus ? 'Reclamado' : 'Reclamar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Lista de Desafios */}
              <div className="space-y-4">
                {challenges.map(challenge => (
                  <Card key={challenge.id} className={challenge.completed ? 'bg-green-500/5 border-green-500/30' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                            {challenge.completed && (
                              <Badge className="bg-green-500">
                                <Trophy className="h-3 w-3 mr-1" />
                                Concluído
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {challenge.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span className="font-mono">
                                {challenge.progress}/{challenge.target}
                              </span>
                            </div>
                            <Progress 
                              value={(challenge.progress / challenge.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-primary" />
                              <span>+{challenge.reward.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-accent" />
                              <span>+{challenge.reward.credits}</span>
                            </div>
                            {challenge.reward.specialCredits && (
                              <div className="flex items-center gap-1">
                                <Gem className="h-3 w-3 text-purple-500" />
                                <span>+{challenge.reward.specialCredits}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {challenge.timeLeft}h restantes
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Eventos Sazonais */}
            <TabsContent value="events" className="h-full p-4">
              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                    {currentEvent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{currentEvent.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso do Evento</span>
                      <span className="font-mono">{currentEvent.progress}%</span>
                    </div>
                    <Progress value={currentEvent.progress} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentEvent.rewards.map(reward => (
                      <div 
                        key={reward.milestone}
                        className={`p-3 rounded-lg border text-center ${
                          reward.claimed ? 'bg-green-500/10 border-green-500/30' : 
                          currentEvent.progress >= reward.milestone ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-muted/20'
                        }`}
                      >
                        <div className="text-lg font-bold mb-1">{reward.milestone}%</div>
                        <div className="text-xs text-muted-foreground mb-2">{reward.reward}</div>
                        {reward.claimed ? (
                          <Badge className="bg-green-500 text-xs">Reclamado</Badge>
                        ) : currentEvent.progress >= reward.milestone ? (
                          <Button size="sm" className="text-xs">Reclamar</Button>
                        ) : (
                          <Badge variant="outline" className="text-xs">Bloqueado</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Pixels Especiais do Evento */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Pixels Especiais do Evento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentEvent.specialPixels.map((pixel, index) => (
                        <Card key={index} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium">Pixel ({pixel.x}, {pixel.y})</h5>
                                <Badge className="mt-1">{pixel.rarity}</Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">€{pixel.price}</div>
                                <Button size="sm" className="mt-1">Comprar</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Classificação */}
            <TabsContent value="leaderboard" className="h-full p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                      Classificação Semanal
                    </span>
                    <Badge variant="outline">Atualiza em 2 dias</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.users.map(user => (
                      <div 
                        key={user.rank}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          user.name === 'Você' ? 'bg-primary/10 border border-primary/30' : 'bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                          <span className="font-bold text-lg">#{user.rank}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-1">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.score.toLocaleString()} pontos
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {user.change > 0 && (
                            <div className="flex items-center text-green-500 text-sm">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              +{user.change}
                            </div>
                          )}
                          {user.change < 0 && (
                            <div className="flex items-center text-red-500 text-sm">
                              <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                              {user.change}
                            </div>
                          )}
                          {user.change === 0 && (
                            <div className="text-muted-foreground text-sm">-</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Sistema de Recompensas */}
            <TabsContent value="rewards" className="h-full p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recompensas por Login */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-green-500" />
                      Login Diário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div 
                          key={index}
                          className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-bold ${
                            index < streak ? 'bg-green-500 border-green-500 text-white' :
                            index === streak ? 'bg-yellow-500 border-yellow-500 text-white animate-pulse' :
                            'bg-muted border-muted-foreground/20'
                          }`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Sequência atual: {streak} dias
                    </p>
                  </CardContent>
                </Card>
                
                {/* Conquistas Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-purple-500" />
                      Conquistas Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Primeiro Pixel', icon: <MapPin className="h-4 w-4" />, date: 'Hoje' },
                        { name: 'Colecionador', icon: <Gem className="h-4 w-4" />, date: 'Ontem' },
                        { name: 'Social', icon: <Users className="h-4 w-4" />, date: '2 dias' }
                      ].map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                          <div className="p-2 bg-purple-500/20 rounded">
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground">{achievement.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Programa VIP */}
              <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-amber-500" />
                    Programa VIP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Status Atual:</span>
                      <Badge className="bg-amber-500">Ouro</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso para Platina</span>
                        <span>2,450 / 5,000 pontos</span>
                      </div>
                      <Progress value={49} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-amber-500">15%</div>
                        <div className="text-xs text-muted-foreground">Desconto em Compras</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-500">2x</div>
                        <div className="text-xs text-muted-foreground">XP em Eventos</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}