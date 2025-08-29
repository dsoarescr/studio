'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Crown,
  Diamond,
  Star,
  Zap,
  Sparkles,
  Palette,
  Wand2,
  Shield,
  Gift,
  Clock,
  Award,
  Rocket,
  TrendingUp,
  Users,
  Settings,
  Lock,
  Check,
} from 'lucide-react';

interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    name: string;
    description: string;
    icon: React.ReactNode;
  }[];
  benefits: string[];
  recommended?: boolean;
}

const premiumPlans: PremiumPlan[] = [
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para artistas e colecionadores ativos',
    price: {
      monthly: 100,
      yearly: 1000,
    },
    features: [
      {
        name: 'Ferramentas Avançadas',
        description: 'Acesso a ferramentas premium de edição',
        icon: <Wand2 className="h-4 w-4" />,
      },
      {
        name: 'Destaques Mensais',
        description: '2 destaques gratuitos por mês',
        icon: <Star className="h-4 w-4" />,
      },
      {
        name: 'Suporte Prioritário',
        description: 'Atendimento em até 24h',
        icon: <Shield className="h-4 w-4" />,
      },
    ],
    benefits: [
      'Sem anúncios',
      'Badge Pro exclusiva',
      'Descontos em promoções',
      'Estatísticas avançadas',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para empresas e investidores',
    price: {
      monthly: 250,
      yearly: 2500,
    },
    features: [
      {
        name: 'Tudo do Pro',
        description: 'Todas as funcionalidades do plano Pro',
        icon: <Check className="h-4 w-4" />,
      },
      {
        name: 'API Dedicada',
        description: 'Acesso à API com limites elevados',
        icon: <Settings className="h-4 w-4" />,
      },
      {
        name: 'Gerenciamento em Massa',
        description: 'Ferramentas para gestão de múltiplos pixels',
        icon: <Users className="h-4 w-4" />,
      },
    ],
    benefits: [
      'Suporte 24/7',
      'Relatórios personalizados',
      'Acesso antecipado a novidades',
      'Consultoria dedicada',
    ],
    recommended: true,
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    description: 'A experiência definitiva',
    price: {
      monthly: 500,
      yearly: 5000,
    },
    features: [
      {
        name: 'Tudo do Business',
        description: 'Todas as funcionalidades do plano Business',
        icon: <Check className="h-4 w-4" />,
      },
      {
        name: 'Recursos Exclusivos',
        description: 'Acesso a recursos em desenvolvimento',
        icon: <Lock className="h-4 w-4" />,
      },
      {
        name: 'Eventos VIP',
        description: 'Participação em eventos exclusivos',
        icon: <Crown className="h-4 w-4" />,
      },
    ],
    benefits: [
      'Pixels exclusivos',
      'Customização total',
      'Prioridade em leilões',
      'Benefícios personalizados',
    ],
  },
];

export function PremiumFeatures() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    toast({
      title: 'Assinatura Iniciada',
      description: 'Bem-vindo ao clube premium!',
    });
    setSelectedPlan(planId);
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <Card className="via-background/98 border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Crown className="h-6 w-6 text-primary" />
                Recursos Premium
              </CardTitle>
              <CardDescription>Desbloqueie todo o potencial da plataforma</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Pagamento</span>
              <div className="flex items-center gap-2">
                <span
                  className={billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground'}
                >
                  Mensal
                </span>
                <Switch
                  checked={billingCycle === 'yearly'}
                  onCheckedChange={checked => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <span
                  className={billingCycle === 'yearly' ? 'text-primary' : 'text-muted-foreground'}
                >
                  Anual
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Planos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {premiumPlans.map(plan => (
              <Card
                key={plan.id}
                className={cn(
                  'relative overflow-hidden transition-all duration-300',
                  plan.recommended
                    ? 'scale-105 border-primary shadow-lg'
                    : 'hover:border-primary/50'
                )}
              >
                {plan.recommended && (
                  <div className="absolute right-0 top-0">
                    <Badge className="rounded-none rounded-bl bg-primary">Recomendado</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.id === 'ultimate' && (
                      <Badge variant="secondary" className="animate-pulse">
                        <Diamond className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Preço */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {plan.price[billingCycle]} créditos
                      <span className="text-sm text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <Badge variant="secondary" className="mt-2">
                        Economize {plan.price.monthly * 12 - plan.price.yearly} créditos
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                      >
                        <div className="rounded-full bg-primary/10 p-2">{feature.icon}</div>
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {plan.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.recommended ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {selectedPlan === plan.id ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Assinar Agora
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Benefícios Premium */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Benefícios Premium</CardTitle>
              <CardDescription>
                Explore todos os benefícios exclusivos para membros premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="w-fit rounded-full bg-primary/10 p-3">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Ferramentas Exclusivas</h3>
                  <p className="text-muted-foreground">
                    Acesso a ferramentas avançadas de edição e criação de pixel art
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-fit rounded-full bg-primary/10 p-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Prioridade no Marketplace</h3>
                  <p className="text-muted-foreground">
                    Seus pixels aparecem primeiro nas buscas e têm destaque especial
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-fit rounded-full bg-primary/10 p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Recompensas Exclusivas</h3>
                  <p className="text-muted-foreground">
                    Receba recompensas especiais e participe de eventos VIP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Como funciona o pagamento?</h4>
                  <p className="text-sm text-muted-foreground">
                    O pagamento é feito em créditos, que podem ser adquiridos na plataforma. A
                    assinatura é renovada automaticamente.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Posso cancelar a qualquer momento?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sim, você pode cancelar sua assinatura a qualquer momento. Os benefícios
                    continuam até o fim do período pago.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Como funciona o plano anual?</h4>
                  <p className="text-sm text-muted-foreground">
                    O plano anual oferece um desconto significativo em relação ao mensal. O
                    pagamento é feito uma vez por ano.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Quais são os benefícios exclusivos?</h4>
                  <p className="text-sm text-muted-foreground">
                    Cada plano tem seus benefícios únicos, incluindo ferramentas especiais, suporte
                    prioritário e eventos exclusivos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
