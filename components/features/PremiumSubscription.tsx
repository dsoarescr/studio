'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { 
  Crown, Check, Star, Zap, Gift, Sparkles, 
  Palette, Target, Award, Users, Shield, 
  TrendingUp, Coins, Heart, Eye, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
  included: boolean;
  premium?: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
  color: string;
  icon: React.ReactNode;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    period: 'para sempre',
    description: 'Perfeito para começar a explorar o Pixel Universe',
    features: [
      { text: 'Comprar até 10 pixels por dia', included: true },
      { text: 'Paleta de cores básica', included: true },
      { text: 'Acesso ao mapa completo', included: true },
      { text: 'Conquistas básicas', included: true },
      { text: 'Suporte por email', included: true },
      { text: 'Cores premium', included: false },
      { text: 'Pixels ilimitados', included: false },
      { text: 'Análises avançadas', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
    color: 'border-gray-200',
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'por mês',
    description: 'Para artistas sérios e colecionadores dedicados',
    popular: true,
    features: [
      { text: 'Pixels ilimitados por dia', included: true, premium: true },
      { text: 'Paleta de cores completa', included: true, premium: true },
      { text: 'Cores exclusivas premium', included: true, premium: true },
      { text: 'Análises detalhadas', included: true, premium: true },
      { text: 'Histórico completo', included: true, premium: true },
      { text: 'Suporte prioritário', included: true, premium: true },
      { text: 'Badge premium', included: true, premium: true },
      { text: 'Desconto em pixels', included: true, premium: true },
      { text: 'Acesso antecipado', included: true, premium: true },
    ],
    color: 'border-primary',
    icon: <Crown className="h-6 w-6" />
  },
  {
    id: 'annual',
    name: 'Premium Anual',
    price: 99.99,
    period: 'por ano',
    description: 'Melhor valor! Economize 17% com o plano anual',
    features: [
      { text: 'Tudo do Premium', included: true, premium: true },
      { text: '2 meses grátis', included: true, premium: true },
      { text: 'Créditos bônus mensais', included: true, premium: true },
      { text: 'Acesso beta exclusivo', included: true, premium: true },
      { text: 'Consultoria personalizada', included: true, premium: true },
    ],
    color: 'border-amber-400',
    icon: <Sparkles className="h-6 w-6" />
  }
];

const premiumBenefits = [
  {
    icon: <Palette className="h-8 w-8 text-purple-500" />,
    title: 'Cores Exclusivas',
    description: 'Acesso a mais de 1000 cores premium e gradientes únicos'
  },
  {
    icon: <Target className="h-8 w-8 text-blue-500" />,
    title: 'Pixels Ilimitados',
    description: 'Compre quantos pixels quiser sem limites diários'
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-green-500" />,
    title: 'Análises Avançadas',
    description: 'Estatísticas detalhadas e insights sobre seus investimentos'
  },
  {
    icon: <Shield className="h-8 w-8 text-red-500" />,
    title: 'Suporte Prioritário',
    description: 'Atendimento VIP com resposta em menos de 2 horas'
  }
];

export default function PremiumSubscription() {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { isPremium, addCredits, addSpecialCredits } = useUserStore();

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;
    
    setIsProcessing(true);
    
    // Simulate subscription process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add bonus credits for subscription
    const bonusCredits = planId === 'annual' ? 1000 : 500;
    addCredits(bonusCredits);
    addSpecialCredits(100);
    
    toast({
      title: "Subscrição Ativada!",
      description: `Bem-vindo ao Pixel Universe Premium! Recebeu ${bonusCredits} créditos de bônus.`,
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 mb-16 space-y-8 max-w-6xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative z-10 text-center">
            <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center justify-center">
              <Crown className="h-8 w-8 mr-3 animate-glow" />
              Pixel Universe Premium
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Desbloqueie todo o potencial do Pixel Universe com funcionalidades exclusivas
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Current Status */}
        {isPremium && (
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Já é Premium!</h3>
              </div>
              <p className="text-muted-foreground">
                Obrigado por apoiar o Pixel Universe. Sua subscrição está ativa.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumBenefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                plan.color,
                selectedPlan === plan.id && "ring-2 ring-primary",
                plan.popular && "scale-105 shadow-lg"
              )}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "p-3 rounded-full",
                    plan.id === 'free' ? 'bg-gray-100' : 
                    plan.id === 'premium' ? 'bg-primary/10' : 'bg-amber-100'
                  )}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Grátis' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className={cn(
                        "h-4 w-4",
                        feature.premium ? "text-primary" : "text-green-500"
                      )} />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted" />
                    )}
                    <span className={cn(
                      "text-sm",
                      !feature.included && "text-muted-foreground line-through"
                    )}>
                      {feature.text}
                    </span>
                    {feature.premium && (
                      <Badge variant="outline" className="text-xs">Premium</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.id === 'free' ? 'outline' : 'default'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || (isPremium && plan.id !== 'free')}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </>
                  ) : plan.id === 'free' ? (
                    'Plano Atual'
                  ) : isPremium ? (
                    'Já Premium'
                  ) : (
                    `Escolher ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, pode cancelar a sua subscrição a qualquer momento. Continuará a ter acesso premium até ao final do período pago.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">O que acontece aos meus pixels se cancelar?</h4>
              <p className="text-sm text-muted-foreground">
                Todos os pixels que comprou continuam seus para sempre. Apenas perderá acesso às funcionalidades premium.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Há desconto para estudantes?</h4>
              <p className="text-sm text-muted-foreground">
                Sim! Contacte o nosso suporte com comprovativo de estudante para receber 50% de desconto.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}