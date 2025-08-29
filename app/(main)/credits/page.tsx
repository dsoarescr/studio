'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import {
  Coins,
  Gift,
  Crown,
  Star,
  Zap,
  Target,
  Award,
  CreditCard,
  Smartphone,
  Wallet,
  Percent,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle,
  Sparkles,
  Gem as GemIcon,
  ShoppingCart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const creditPacks = [
  {
    id: 'pack_1',
    credits: 500,
    price: 4.99,
    bonus: 0,
    badge: null,
    icon: <Coins className="h-6 w-6" />,
    color: 'border-slate-400/60 hover:border-slate-400',
    bgColor: 'bg-slate-500/10',
  },
  {
    id: 'pack_2',
    credits: 1200,
    price: 9.99,
    bonus: 200,
    badge: 'Popular',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'border-primary/60 hover:border-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'pack_3',
    credits: 2500,
    price: 19.99,
    bonus: 500,
    badge: 'Melhor Valor',
    icon: <Star className="h-6 w-6" />,
    color: 'border-green-500/60 hover:border-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'pack_4',
    credits: 7500,
    price: 49.99,
    bonus: 2500,
    badge: 'Para Profissionais',
    icon: <GemIcon className="h-6 w-6" />,
    color: 'border-purple-500/60 hover:border-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'pack_5',
    credits: 20000,
    price: 99.99,
    bonus: 7500,
    badge: 'Ultimate',
    icon: <Crown className="h-6 w-6" />,
    color: 'border-amber-400/60 hover:border-amber-400',
    bgColor: 'bg-amber-500/10',
  },
];

export default function CreditsPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addCredits, addSpecialCredits } = useUserStore();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);

  const handlePurchase = async (packId: string) => {
    setSelectedPack(packId);
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pack = creditPacks.find(p => p.id === packId);
    if (pack) {
      addCredits(pack.credits);
      if (pack.bonus > 500) addSpecialCredits(Math.floor(pack.bonus / 100));

      setShowConfetti(true);
      setPlayPurchaseSound(true);

      toast({
        title: 'Compra Bem-Sucedida!',
        description: `Você adicionou ${pack.credits.toLocaleString('pt-PT')} créditos e ${pack.bonus.toLocaleString('pt-PT')} de bônus à sua conta.`,
      });
    }

    setIsProcessing(false);
    setSelectedPack(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect
        src={SOUND_EFFECTS.PURCHASE}
        play={playPurchaseSound}
        onEnd={() => setPlayPurchaseSound(false)}
      />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />

      <div className="container mx-auto mb-16 max-w-5xl space-y-8 px-4 py-6">
        {/* Header */}
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 shadow-2xl">
          <div
            className="animate-shimmer absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            style={{ backgroundSize: '200% 200%' }}
          />
          <CardHeader className="relative z-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-gradient-gold flex items-center font-headline text-3xl">
                  <Coins className="animate-glow mr-3 h-8 w-8" />
                  Loja de Créditos
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  Recarregue seus créditos para comprar pixels e itens exclusivos no Pixel Universe
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Credit Packs */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creditPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl',
                  pack.color,
                  selectedPack === pack.id && 'ring-2 ring-primary'
                )}
              >
                {pack.badge && (
                  <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                    {pack.badge}
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div
                    className={cn(
                      'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
                      pack.bgColor
                    )}
                  >
                    {pack.icon}
                  </div>
                  <CardTitle className="font-headline text-2xl">
                    {pack.credits.toLocaleString('pt-PT')} Créditos
                  </CardTitle>
                  {pack.bonus > 0 && (
                    <CardDescription className="font-medium text-green-500">
                      + {pack.bonus.toLocaleString('pt-PT')} Bônus!
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="text-center">
                  <p className="mb-4 text-4xl font-bold text-primary">
                    {pack.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    onClick={() => handlePurchase(pack.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing && selectedPack === pack.id ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        Processando...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Comprar Agora
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento Seguros</CardTitle>
            <CardDescription>Aceitamos os métodos de pagamento mais populares</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span>Cartão de Crédito/Débito</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <span>MB WAY</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span>PayPal</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
