'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import {
  Zap,
  Star,
  Trophy,
  Crown,
  Gift,
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  Rocket,
} from 'lucide-react';

interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  rewards: {
    credits: number;
    items: string[];
    perks: string[];
  };
  icon: React.ReactNode;
}

const levels: Level[] = [
  {
    level: 1,
    title: 'Iniciante',
    minXP: 0,
    maxXP: 100,
    rewards: {
      credits: 100,
      items: ['Paleta Básica'],
      perks: ['Acesso ao Tutorial Avançado'],
    },
    icon: <Star className="h-6 w-6 text-slate-400" />,
  },
  {
    level: 2,
    title: 'Explorador',
    minXP: 100,
    maxXP: 300,
    rewards: {
      credits: 200,
      items: ['Paleta Expandida', 'Badge de Explorador'],
      perks: ['Zoom Aumentado'],
    },
    icon: <Trophy className="text-bronze-400 h-6 w-6" />,
  },
  {
    level: 3,
    title: 'Artista',
    minXP: 300,
    maxXP: 600,
    rewards: {
      credits: 300,
      items: ['Ferramentas Especiais', 'Efeitos de Pixel'],
      perks: ['Criação de Padrões'],
    },
    icon: <Award className="text-silver-400 h-6 w-6" />,
  },
  {
    level: 4,
    title: 'Mestre',
    minXP: 600,
    maxXP: 1000,
    rewards: {
      credits: 500,
      items: ['Paleta Premium', 'Moldura Exclusiva'],
      perks: ['Criação de Coleções'],
    },
    icon: <Crown className="text-gold-400 h-6 w-6" />,
  },
  {
    level: 5,
    title: 'Lenda',
    minXP: 1000,
    maxXP: 1500,
    rewards: {
      credits: 1000,
      items: ['Título Personalizado', 'Aura de Pixel'],
      perks: ['Criação de Eventos'],
    },
    icon: <Sparkles className="h-6 w-6 text-amber-400" />,
  },
];

export function LevelSystem() {
  const { toast } = useToast();
  const { xp, addXp, addCredits } = useUserStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);

  // Encontrar o nível atual baseado no XP
  useEffect(() => {
    const level = levels.find(l => xp >= l.minXP && xp < l.maxXP) || levels[0];
    const progress = ((xp - level.minXP) / (level.maxXP - level.minXP)) * 100;

    if (level.level !== currentLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    setCurrentLevel(level.level);
    setLevelProgress(progress);
  }, [xp, currentLevel]);

  const currentLevelData = levels.find(l => l.level === currentLevel) || levels[0];
  const nextLevelData = levels.find(l => l.level === currentLevel + 1);

  return (
    <div className="space-y-6">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="space-y-4 rounded-xl bg-black/80 p-8 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }}>
                <Sparkles className="h-16 w-16 text-yellow-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Nível Aumentado!</h2>
              <p className="text-lg text-yellow-400">Você alcançou o nível {currentLevel}</p>
              <p className="text-white/80">Novo título: {currentLevelData.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Level Card */}
      <Card className="via-background/98 border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                {currentLevelData.icon}
                Nível {currentLevel} - {currentLevelData.title}
              </CardTitle>
              <CardDescription>
                Continue ganhando XP para subir de nível e desbloquear recompensas
              </CardDescription>
            </div>
            <Badge className="bg-primary/20 px-4 py-2 text-lg text-primary">{xp} XP</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso para o próximo nível</span>
              <span className="font-mono">
                {xp - currentLevelData.minXP}/{currentLevelData.maxXP - currentLevelData.minXP} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>

          {/* Current Level Perks */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Gift className="h-5 w-5 text-primary" />
                Recompensas Desbloqueadas
              </h3>
              <div className="space-y-2">
                {currentLevelData.rewards.items.map((item, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Rocket className="h-5 w-5 text-primary" />
                Vantagens Ativas
              </h3>
              <div className="space-y-2">
                {currentLevelData.rewards.perks.map((perk, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {perk}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Level Preview */}
      {nextLevelData && (
        <Card className="border-2 border-dashed border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Próximo Nível: {nextLevelData.title}
            </CardTitle>
            <CardDescription>
              Desbloqueie estas recompensas ao atingir o nível {nextLevelData.level}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <Gift className="h-4 w-4 text-primary" />
                  Novas Recompensas
                </h4>
                <ul className="space-y-2">
                  {nextLevelData.rewards.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <Rocket className="h-4 w-4 text-primary" />
                  Novas Vantagens
                </h4>
                <ul className="space-y-2">
                  {nextLevelData.rewards.perks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Faltam {nextLevelData.minXP - xp} XP para o próximo nível
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
