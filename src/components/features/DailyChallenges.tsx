'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import {
  Calendar,
  Star,
  Trophy,
  Target,
  Zap,
  Gift,
  Timer,
  Sparkles,
  ArrowUp,
  CheckCircle2,
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  progress: number;
  goal: number;
  rewards: {
    xp: number;
    credits: number;
    special?: string;
  };
  expiresAt: string;
  completed: boolean;
}

const difficultyConfig = {
  easy: {
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    label: 'Fácil',
  },
  medium: {
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    label: 'Médio',
  },
  hard: {
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    label: 'Difícil',
  },
  epic: {
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    label: 'Épico',
  },
};

const mockChallenges: Challenge[] = [
  {
    id: 'daily-1',
    title: 'Artista do Dia',
    description: 'Crie 5 pixels artísticos em diferentes regiões',
    type: 'daily',
    difficulty: 'easy',
    progress: 3,
    goal: 5,
    rewards: {
      xp: 100,
      credits: 50,
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 'daily-2',
    title: 'Explorador Regional',
    description: 'Visite 3 regiões diferentes do mapa',
    type: 'daily',
    difficulty: 'medium',
    progress: 1,
    goal: 3,
    rewards: {
      xp: 150,
      credits: 75,
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 'weekly-1',
    title: 'Mestre das Cores',
    description: 'Use 10 cores diferentes em seus pixels',
    type: 'weekly',
    difficulty: 'hard',
    progress: 6,
    goal: 10,
    rewards: {
      xp: 300,
      credits: 150,
      special: 'Paleta Especial',
    },
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 'special-1',
    title: 'Evento Especial: Pixel Festival',
    description: 'Participe do evento criando uma obra de arte colaborativa',
    type: 'special',
    difficulty: 'epic',
    progress: 0,
    goal: 1,
    rewards: {
      xp: 500,
      credits: 250,
      special: 'Badge Exclusiva do Evento',
    },
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
];

export function DailyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');
  const { toast } = useToast();
  const { addXp, addCredits } = useUserStore();

  const handleClaimReward = (challenge: Challenge) => {
    if (!challenge.completed) {
      toast({
        title: 'Desafio não completado',
        description: 'Complete o desafio primeiro para receber a recompensa!',
        variant: 'destructive',
      });
      return;
    }

    // Adicionar recompensas
    addXp(challenge.rewards.xp);
    addCredits(challenge.rewards.credits);

    // Atualizar estado
    setChallenges(prev => prev.map(c => (c.id === challenge.id ? { ...c, claimed: true } : c)));

    // Mostrar notificação
    toast({
      title: 'Recompensa Recebida!',
      description: `Você recebeu ${challenge.rewards.xp} XP e ${challenge.rewards.credits} créditos!`,
      variant: 'default',
    });
  };

  const filteredChallenges = challenges.filter(
    challenge => activeFilter === 'all' || challenge.type === activeFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('all')}
          className="text-sm"
        >
          <Star className="mr-2 h-4 w-4" />
          Todos
        </Button>
        <Button
          variant={activeFilter === 'daily' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('daily')}
          className="text-sm"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Diários
        </Button>
        <Button
          variant={activeFilter === 'weekly' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('weekly')}
          className="text-sm"
        >
          <Target className="mr-2 h-4 w-4" />
          Semanais
        </Button>
        <Button
          variant={activeFilter === 'special' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('special')}
          className="text-sm"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Especiais
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredChallenges.map(challenge => {
          const config = difficultyConfig[challenge.difficulty];
          const timeLeft = new Date(challenge.expiresAt).getTime() - Date.now();
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const progressPercentage = (challenge.progress / challenge.goal) * 100;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`border-2 ${config.border} transition-all duration-300 hover:shadow-lg`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {challenge.title}
                        <Badge className={`${config.color} ${config.bg}`}>{config.label}</Badge>
                      </CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {hoursLeft}h
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span className="font-mono">
                        {challenge.progress}/{challenge.goal}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center">
                      <Zap className="mr-1 h-3 w-3" />
                      {challenge.rewards.xp} XP
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      {challenge.rewards.credits} Créditos
                    </Badge>
                    {challenge.rewards.special && (
                      <Badge
                        variant="default"
                        className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        <Gift className="mr-1 h-3 w-3" />
                        {challenge.rewards.special}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {challenge.completed ? (
                    <Button className="w-full" onClick={() => handleClaimReward(challenge)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Reclamar Recompensa
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <Target className="mr-2 h-4 w-4" />
                      Em Progresso
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
