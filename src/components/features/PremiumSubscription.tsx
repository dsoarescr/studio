'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { useStripePayment, StripePaymentElements } from "@/components/payment/StripePaymentProvider";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Star, Zap, Shield, Sparkles, Check, X, CreditCard, Gift,
  Palette, Users, Globe, Headphones, Eye, Settings, Award, Gem,
  Rocket, Heart, Coins, Calendar, Clock, ArrowRight,
  ChevronRight, Info, AlertTriangle, CheckCircle, Flame, Target,
  TrendingUp, BarChart3, UserPlus, Share2, Trophy, Medal, Diamond,
  Play, Pause, Square, MousePointer, Layers, Filter, Wand2,
  MessageCircle, Video, BookOpen, Calculator, Percent, DollarSign,
  ShoppingCart, Tag, Timer, Bell, Lock, Unlock, RefreshCw
} from "lucide-react";
import { cn } from '@/lib/utils';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 0,
    period: 'Grátis',
    description: 'Perfeito para começar',
    features: [
      'Compra e venda de pixels',
      'Personalização básica',
      'Acesso ao mapa completo',
      'Participação em eventos',
      'Suporte por email'
    ],
    limitations: [
      'Máximo 10 pixels por dia',
      'Sem acesso a pixels premium',
      'Anúncios ocasionais'
    ],
    color: 'from-gray-500 to-gray-600',
    icon: <Users className="h-6 w-6" />,
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'mês',
    description: 'Para criadores sérios',
    features: [
      'Pixels ilimitados',
      'Acesso a pixels exclusivos',
      'Ferramentas avançadas de edição',
      'Sem anúncios',
      'Suporte prioritário',
      'Estatísticas detalhadas',
      'Backup automático',
      'Temas personalizados'
    ],
    bonuses: [
      '100 créditos especiais/mês',
      '15% desconto em compras',
      'Acesso antecipado a funcionalidades'
    ],
    color: 'from-primary to-accent',
    icon: <Crown className="h-6 w-6" />,
    popular: true
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 19.99,
    period: 'mês',
    description: 'Para profissionais',
    features: [
      'Tudo do Premium',
      'API de desenvolvedor',
      'Pixels animados',
      'Colaboração em equipe',
      'Analytics avançados',
      'Suporte VIP 24/7',
      'Consultoria personalizada',
      'Eventos exclusivos'
    ],
    bonuses: [
      '300 créditos especiais/mês',
      '25% desconto em compras',
      'Acesso beta a novas funcionalidades',
      'Sessões de mentoria mensais'
    ],
    color: 'from-purple-500 to-pink-500',
    icon: <Rocket className="h-6 w-6" />,
    popular: false
  }
];

const premiumFeatures = [
  {
    icon: <Palette className="h-8 w-8" />,
    title: 'Editor Avançado',
    description: 'Ferramentas profissionais de pixel art com camadas, filtros e efeitos especiais.',
    color: 'text-blue-500'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Colaboração',
    description: 'Trabalhe em projetos com outros artistas em tempo real.',
    color: 'text-green-500'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Galeria Global',
    description: 'Exponha suas criações para milhões de usuários ao redor do mundo.',
    color: 'text-purple-500'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Backup Seguro',
    description: 'Seus pixels são automaticamente salvos e protegidos na nuvem.',
    color: 'text-orange-500'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Performance',
    description: 'Renderização ultra-rápida e ferramentas otimizadas para produtividade.',
    color: 'text-yellow-500'
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: 'Suporte VIP',
    description: 'Atendimento prioritário com especialistas em pixel art.',
    color: 'text-red-500'
  }
];

// Novos dados para melhorias premium
const premiumBenefits = [
  {
    id: 'loyalty',
    title: 'Programa de Fidelidade',
    description: 'Ganhe recompensas exclusivas quanto mais tempo for premium',
    icon: <Diamond className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Créditos bônus mensais crescentes',
      'Descontos progressivos no marketplace',
      'Títulos exclusivos por tempo de premium',
      'Acesso antecipado a funcionalidades'
    ]
  },
  {
    id: 'referral',
    title: 'Programa de Referências',
    description: 'Indique amigos e ganhe recompensas para ambos',
    icon: <UserPlus className="h-6 w-6" />,
    color: 'from-green-500 to-blue-500',
    features: [
      '100 créditos por indicação bem-sucedida',
      '1 mês grátis para ambos os usuários',
      'Desconto de 20% na próxima renovação',
      'Badge especial de "Influenciador"'
    ]
  },
  {
    id: 'community',
    title: 'Comunidade Premium',
    description: 'Acesso exclusivo a grupos e eventos VIP',
    icon: <Users className="h-6 w-6" />,
    color: 'from-orange-500 to-red-500',
    features: [
      'Grupos exclusivos por categoria',
      'Eventos mensais com especialistas',
      'Sessões de mentoria gratuitas',
      'Networking com artistas profissionais'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics Avançados',
    description: 'Insights detalhados sobre seus pixels e performance',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Dashboard de performance personalizado',
      'Análise de tendências de mercado',
      'Previsões de valorização',
      'Relatórios semanais automáticos'
    ]
  }
];

const premiumTools = [
  {
    name: 'Editor Avançado',
    icon: <Layers className="h-8 w-8" />,
    description: 'Camadas, filtros e efeitos profissionais',
    demo: 'preview-editor',
    color: 'text-blue-500'
  },
  {
    name: 'Ferramentas de Análise',
    icon: <TrendingUp className="h-8 w-8" />,
    description: 'Insights de mercado em tempo real',
    demo: 'preview-analytics',
    color: 'text-green-500'
  },
  {
    name: 'Colaboração em Tempo Real',
    icon: <MessageCircle className="h-8 w-8" />,
    description: 'Trabalhe com outros artistas simultaneamente',
    demo: 'preview-collaboration',
    color: 'text-purple-500'
  },
  {
    name: 'Marketplace Premium',
    icon: <ShoppingCart className="h-8 w-8" />,
    description: 'Acesso a pixels exclusivos e leilões VIP',
    demo: 'preview-marketplace',
    color: 'text-orange-500'
  }
];

const loyaltyLevels = [
  { level: 1, name: 'Iniciante', days: 0, bonus: 50, discount: 5 },
  { level: 2, name: 'Entusiasta', days: 30, bonus: 100, discount: 10 },
  { level: 3, name: 'Profissional', days: 90, bonus: 200, discount: 15 },
  { level: 4, name: 'Mestre', days: 180, bonus: 300, discount: 20 },
  { level: 5, name: 'Lendário', days: 365, bonus: 500, discount: 25 }
];

export default function PremiumSubscription() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [showDemo, setShowDemo] = useState<string | null>(null);
  const [loyaltyDays, setLoyaltyDays] = useState(45); // Mock data
  const [referralCode, setReferralCode] = useState('PIXEL2024');
  const [referralCount, setReferralCount] = useState(3); // Mock data
  
  const { createSubscription } = useStripePayment();
  const { toast } = useToast();
  const { isPremium, addCredits, addSpecialCredits } = useUserStore();

  // Calcular nível de fidelidade
  const currentLoyaltyLevel = loyaltyLevels.find(level => loyaltyDays >= level.days) || loyaltyLevels[0];
  const nextLevel = loyaltyLevels.find(level => level.days > loyaltyDays);
  const progressToNextLevel = nextLevel ? ((loyaltyDays - currentLoyaltyLevel.days) / (nextLevel.days - currentLoyaltyLevel.days)) * 100 : 100;

  // Calcular economia anual
  const calculateAnnualSavings = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan || plan.price === 0) return 0;
    const monthlyCost = plan.price * 12;
    const annualCost = getDiscountedPrice(plan.price);
    return monthlyCost - annualCost;
  };

  const getDiscountedPrice = (price: number) => {
    return isAnnual ? price * 10 : price; // 2 months free on annual
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === 'basic') {
      toast({
        title: "Plano Básico",
        description: "Você já tem acesso ao plano básico gratuitamente!",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const priceId = `price_${planId}_${isAnnual ? 'annual' : 'monthly'}`;
      const result = await createSubscription(priceId);
      
      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
      }
    } catch (error) {
      toast({
        title: "Erro na Subscrição",
        description: "Não foi possível processar a subscrição. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    addCredits(500);
    addSpecialCredits(100);
    
    toast({
      title: "Bem-vindo ao Premium!",
      description: "Sua subscrição foi ativada com sucesso. Recebeu 500 créditos + 100 especiais de bônus!",
    });
    
    setClientSecret(null);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Código Copiado!",
      description: "Código de referência copiado para a área de transferência.",
    });
  };

  if (clientSecret) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-md">
        <StripePaymentElements clientSecret={clientSecret}>
          <CheckoutForm
            amount={getDiscountedPrice(subscriptionPlans.find(p => p.id === selectedPlan)?.price || 0) * 100}
            description={`Subscrição ${subscriptionPlans.find(p => p.id === selectedPlan)?.name} - ${isAnnual ? 'Anual' : 'Mensal'}`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setClientSecret(null)}
          />
        </StripePaymentElements>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-gradient-gold-animated">
              Desbloqueie Todo o Potencial
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Transforme sua experiência no Pixel Universe com ferramentas profissionais e recursos exclusivos
            </p>
          </motion.div>
          
          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <Label htmlFor="billing-toggle" className={cn("font-medium", !isAnnual && "text-primary")}>
              Mensal
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="billing-toggle" className={cn("font-medium", isAnnual && "text-primary")}>
              Anual
            </Label>
            {isAnnual && (
              <Badge className="bg-green-500 text-white animate-pulse">
                2 meses grátis!
              </Badge>
            )}
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 h-12 bg-card/50 backdrop-blur-sm shadow-md">
              <TabsTrigger value="plans" className="font-headline">
                <CreditCard className="h-4 w-4 mr-2"/> Planos
              </TabsTrigger>
              <TabsTrigger value="benefits" className="font-headline">
                <Gift className="h-4 w-4 mr-2"/> Benefícios
              </TabsTrigger>
              <TabsTrigger value="demo" className="font-headline">
                <Play className="h-4 w-4 mr-2"/> Demo
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="font-headline">
                <Diamond className="h-4 w-4 mr-2"/> Fidelidade
              </TabsTrigger>
              <TabsTrigger value="referral" className="font-headline">
                <UserPlus className="h-4 w-4 mr-2"/> Referências
              </TabsTrigger>
              <TabsTrigger value="compare" className="font-headline">
                <BarChart3 className="h-4 w-4 mr-2"/> Comparar
              </TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {subscriptionPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "relative overflow-hidden transition-all duration-300 hover:shadow-2xl",
                      plan.popular && "border-primary/50 shadow-primary/20 scale-105",
                      selectedPlan === plan.id && "ring-2 ring-primary"
                    )}>
                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent text-primary-foreground text-center py-2 text-sm font-medium">
                          <Sparkles className="inline h-4 w-4 mr-1" />
                          Mais Popular
                        </div>
                      )}
                      
                      <CardHeader className={cn("text-center", plan.popular && "pt-12")}>
                        <div className={cn(
                          "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4",
                          `bg-gradient-to-br ${plan.color} text-white shadow-lg`
                        )}>
                          {plan.icon}
                        </div>
                        
                        <CardTitle className="text-2xl font-headline">{plan.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                        
                        <div className="space-y-2">
                          <div className="text-4xl font-bold">
                            {plan.price === 0 ? (
                              <span className="text-green-500">Grátis</span>
                            ) : (
                              <>
                                <span className="text-primary">
                                  {getDiscountedPrice(plan.price).toFixed(2)}€
                                </span>
                                <span className="text-lg text-muted-foreground">
                                  /{isAnnual ? 'ano' : plan.period}
                                </span>
                              </>
                            )}
                          </div>
                          {isAnnual && plan.price > 0 && (
                            <p className="text-sm text-green-500">
                              Poupa {(plan.price * 2).toFixed(2)}€ por ano
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {plan.bonuses && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-accent flex items-center">
                                <Gift className="h-4 w-4 mr-2" />
                                Bônus Inclusos
                              </h4>
                              {plan.bonuses.map((bonus, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <Sparkles className="h-4 w-4 text-accent flex-shrink-0" />
                                  <span className="text-sm text-accent">{bonus}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        
                        {plan.limitations && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-muted-foreground">Limitações</h4>
                              {plan.limitations.map((limitation, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{limitation}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </CardContent>
                      
                      <CardFooter>
                        <Button
                          className={cn(
                            "w-full transition-all duration-300",
                            plan.id === 'basic' && isPremium && "opacity-50 cursor-not-allowed",
                            plan.popular && "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                          )}
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={isProcessing || (plan.id === 'basic' && isPremium)}
                        >
                          {isProcessing ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Processando...
                            </div>
                          ) : plan.id === 'basic' ? (
                            isPremium ? 'Plano Atual' : 'Começar Grátis'
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Subscrever Agora
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {premiumBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                          `bg-gradient-to-br ${benefit.color} text-white`
                        )}>
                          {benefit.icon}
                        </div>
                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {benefit.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Demo Tab */}
            <TabsContent value="demo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {premiumTools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => setShowDemo(tool.demo)}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={tool.color}>
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{tool.name}</h3>
                            <p className="text-muted-foreground text-sm">{tool.description}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Demo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Diamond className="h-6 w-6 text-purple-500" />
                    Programa de Fidelidade Premium
                  </CardTitle>
                  <CardDescription>
                    Quanto mais tempo for premium, mais benefícios exclusivos recebe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Level */}
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-purple-500">
                      Nível {currentLoyaltyLevel.level}: {currentLoyaltyLevel.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {loyaltyDays} dias como premium
                    </div>
                    <Progress value={progressToNextLevel} className="h-3" />
                    {nextLevel && (
                      <div className="text-sm text-muted-foreground">
                        {nextLevel.days - loyaltyDays} dias para o próximo nível
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <span>Créditos Bônus</span>
                      </div>
                      <Badge variant="secondary">{currentLoyaltyLevel.bonus}/mês</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Percent className="h-5 w-5 text-green-500" />
                        <span>Desconto Marketplace</span>
                      </div>
                      <Badge variant="secondary">{currentLoyaltyLevel.discount}%</Badge>
                    </div>
                  </div>

                  {/* Levels */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Próximos Níveis</h3>
                    {loyaltyLevels.slice(currentLoyaltyLevel.level).map((level) => (
                      <div key={level.level} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                            loyaltyDays >= level.days ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                          )}>
                            {level.level}
                          </div>
                          <div>
                            <div className="font-medium">{level.name}</div>
                            <div className="text-sm text-muted-foreground">{level.days} dias</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">+{level.bonus} créditos</div>
                          <div className="text-sm text-muted-foreground">{level.discount}% desconto</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Referral Tab */}
            <TabsContent value="referral" className="space-y-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-green-500" />
                    Programa de Referências
                  </CardTitle>
                  <CardDescription>
                    Indique amigos e ganhe recompensas para ambos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">{referralCount}</div>
                      <div className="text-sm text-muted-foreground">Indicações</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">{referralCount * 100}</div>
                      <div className="text-sm text-muted-foreground">Créditos Ganhos</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">€{(referralCount * 9.99).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Valor Gerado</div>
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Seu Código de Referência</h3>
                    <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                      <div className="flex-1 font-mono text-lg font-bold text-primary">
                        {referralCode}
                      </div>
                      <Button onClick={copyReferralCode} size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Recompensas por Indicação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">100 créditos</div>
                          <div className="text-sm text-muted-foreground">Para ambos os usuários</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">1 mês grátis</div>
                          <div className="text-sm text-muted-foreground">Para o novo usuário</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
                        <Percent className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">20% desconto</div>
                          <div className="text-sm text-muted-foreground">Na próxima renovação</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
                        <Award className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="font-medium">Badge especial</div>
                          <div className="text-sm text-muted-foreground">"Influenciador"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Comparador de Planos
                  </CardTitle>
                  <CardDescription>
                    Compare detalhadamente todos os planos e calcule sua economia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Funcionalidade</th>
                          <th className="text-center p-4">Básico</th>
                          <th className="text-center p-4">Premium</th>
                          <th className="text-center p-4">Ultimate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-4 font-medium">Preço Mensal</td>
                          <td className="text-center p-4 text-green-500 font-bold">Grátis</td>
                          <td className="text-center p-4 font-bold">€9.99</td>
                          <td className="text-center p-4 font-bold">€19.99</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium">Economia Anual</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4 text-green-500">€19.98</td>
                          <td className="text-center p-4 text-green-500">€39.96</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium">Pixels por Dia</td>
                          <td className="text-center p-4">10</td>
                          <td className="text-center p-4 text-green-500">Ilimitados</td>
                          <td className="text-center p-4 text-green-500">Ilimitados</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium">Créditos Especiais</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4">100/mês</td>
                          <td className="text-center p-4">300/mês</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium">Desconto Marketplace</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4">15%</td>
                          <td className="text-center p-4">25%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium">Suporte</td>
                          <td className="text-center p-4">Email</td>
                          <td className="text-center p-4">Prioritário</td>
                          <td className="text-center p-4">VIP 24/7</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium">ROI Estimado</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4 text-green-500">+150%</td>
                          <td className="text-center p-4 text-green-500">+300%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Demo Modal */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDemo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Demonstração Interativa</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowDemo(null)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">🎨</div>
                      <h3 className="text-xl font-semibold">Demonstração em Desenvolvimento</h3>
                      <p className="text-muted-foreground">
                        Esta funcionalidade estará disponível em breve!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">
                Pronto para Começar?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Junte-se a milhares de artistas que já descobriram o poder do Pixel Universe Premium.
                Comece sua jornada hoje mesmo!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => handleSubscribe('premium')}
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Começar Premium
                </Button>
                <Button variant="outline" size="lg" onClick={() => setActiveTab('demo')}>
                  <Eye className="h-5 w-5 mr-2" />
                  Ver Demonstração
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
