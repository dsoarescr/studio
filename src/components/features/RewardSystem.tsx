'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import {
  Gift, Star, Crown, Palette, Brush, Sparkles,
  Gem, Coins, Clock, Calendar, Trophy, Medal,
  Shield, Wand2, Rocket, Zap, Box
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'item' | 'cosmetic' | 'boost' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  icon: React.ReactNode;
  effects?: string[];
  duration?: number; // em horas
  preview?: string;
}

const rewards: Reward[] = [
  {
    id: 'palette_pro',
    name: 'Paleta Profissional',
    description: 'Desbloqueie uma paleta de cores exclusiva com tons premium',
    type: 'item',
    rarity: 'rare',
    cost: 500,
    icon: <Palette className="h-6 w-6" />,
    effects: ['20 novas cores', 'Gradientes especiais', 'Efeitos de transição']
  },
  {
    id: 'pixel_brush',
    name: 'Pincel Mágico',
    description: 'Um pincel especial que permite criar efeitos únicos',
    type: 'item',
    rarity: 'epic',
    cost: 1000,
    icon: <Brush className="h-6 w-6" />,
    effects: ['Efeito de brilho', 'Traços suaves', 'Padrões automáticos']
  },
  {
    id: 'golden_frame',
    name: 'Moldura Dourada',
    description: 'Uma moldura exclusiva para seus pixels mais especiais',
    type: 'cosmetic',
    rarity: 'legendary',
    cost: 2000,
    icon: <Crown className="h-6 w-6" />,
    preview: 'URL_DA_PREVIEW'
  },
  {
    id: 'xp_boost',
    name: 'Impulso de XP',
    description: 'Ganhe o dobro de XP por 24 horas',
    type: 'boost',
    rarity: 'rare',
    cost: 300,
    icon: <Zap className="h-6 w-6" />,
    duration: 24
  }
];

const rarityStyles = {
  common: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-500',
    label: 'Comum'
  },
  rare: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    label: 'Raro'
  },
  epic: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    label: 'Épico'
  },
  legendary: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    label: 'Lendário'
  }
};

export function RewardSystem() {
  const [activeTab, setActiveTab] = useState<'store' | 'inventory' | 'boosts'>('store');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const { toast } = useToast();
  const { credits, removeCredits, addInventoryItem } = useUserStore();

  const handlePurchase = (reward: Reward) => {
    if (credits < reward.cost) {
      toast({
        title: "Créditos Insuficientes",
        description: "Você não tem créditos suficientes para esta recompensa.",
        variant: "destructive"
      });
      return;
    }

    removeCredits(reward.cost);
    addInventoryItem(reward.id);

    toast({
      title: "Compra Realizada!",
      description: `Você adquiriu ${reward.name}!`,
      variant: "success"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Central de Recompensas
          </CardTitle>
          <CardDescription>
            Use seus créditos para adquirir itens especiais e melhorar sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Coins className="h-4 w-4 mr-2 text-primary" />
                {credits} Créditos
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="store" className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                Loja
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Gem className="h-4 w-4" />
                Inventário
              </TabsTrigger>
              <TabsTrigger value="boosts" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Impulsos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="store" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => {
                  const style = rarityStyles[reward.rarity];
                  
                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-lg border-2 ${style.border} p-4 cursor-pointer`}
                      onClick={() => setSelectedReward(reward)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${style.bg}`}>
                          {React.cloneElement(reward.icon as any, { className: `h-6 w-6 ${style.text}` })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{reward.name}</h3>
                            <Badge className={`${style.bg} ${style.text}`}>
                              {style.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {reward.description}
                          </p>
                          {reward.effects && (
                            <div className="space-y-1 mb-3">
                              {reward.effects.map((effect, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Star className="h-3 w-3 text-primary" />
                                  <span>{effect}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {reward.duration && (
                            <div className="flex items-center gap-2 text-sm mb-3">
                              <Clock className="h-3 w-3 text-primary" />
                              <span>Duração: {reward.duration}h</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Coins className="h-3 w-3" />
                              {reward.cost}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchase(reward);
                              }}
                              disabled={credits < reward.cost}
                              className={credits < reward.cost ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                              Comprar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <Box className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Seu Inventário</h3>
                <p className="text-muted-foreground">
                  Aqui você encontrará todos os seus itens adquiridos
                </p>
              </div>
            </TabsContent>

            <TabsContent value="boosts" className="min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <Rocket className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Impulsos Ativos</h3>
                <p className="text-muted-foreground">
                  Visualize e ative seus impulsos especiais
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background p-6 rounded-lg max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className={`p-6 rounded-full mx-auto w-fit ${rarityStyles[selectedReward.rarity].bg}`}>
                  {React.cloneElement(selectedReward.icon as any, { 
                    className: `h-12 w-12 ${rarityStyles[selectedReward.rarity].text}` 
                  })}
                </div>
                <h2 className="text-2xl font-bold">{selectedReward.name}</h2>
                <p className="text-muted-foreground">{selectedReward.description}</p>
                
                {selectedReward.effects && (
                  <div className="space-y-2 text-left">
                    <h3 className="font-semibold">Efeitos:</h3>
                    {selectedReward.effects.map((effect, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 space-x-2">
                  <Button
                    onClick={() => handlePurchase(selectedReward)}
                    disabled={credits < selectedReward.cost}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Comprar por {selectedReward.cost} créditos
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedReward(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}