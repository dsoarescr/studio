
'use client';

import React, { useState } from 'react';
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
import { motion } from "framer-motion";
import {
  Crown, Star, Zap, Shield, Sparkles, Check, X, CreditCard, Gift,
  Palette, Users, Globe, Headphones, Eye, Settings, Award, Gem,
  Rocket, Heart, Lightning, Coins, Calendar, Clock, ArrowRight,
  ChevronRight, Info, AlertTriangle, CheckCircle, Flame, Target
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

export default function PremiumSubscription() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { createSubscription } = useStripePayment();
  const { toast } = useToast();
  const { isPremium, addCredits, addSpecialCredits } = useUserStore();

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
      // Mock price IDs - in real app these would come from Stripe
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
    
    // Add welcome bonus
    addCredits(500);
    addSpecialCredits(100);
    
    toast({
      title: "Bem-vindo ao Premium!",
      description: "Sua subscrição foi ativada com sucesso. Recebeu 500 créditos + 100 especiais de bônus!",
    });
    
    setClientSecret(null);
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

        {/* Pricing Cards */}
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

        {/* Premium Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline text-primary">
                Funcionalidades Premium
              </CardTitle>
              <CardDescription>
                Descubra o que torna o Pixel Universe Premium tão especial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-center space-y-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                  >
                    <div className={cn("mx-auto", feature.color)}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">
                Perguntas Frequentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Posso cancelar a qualquer momento?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sim! Você pode cancelar sua subscrição a qualquer momento sem taxas de cancelamento.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    Meus pixels ficam seguros?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Absolutamente! Todos os seus pixels são salvos automaticamente e protegidos com backup na nuvem.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-accent" />
                    Como funcionam os créditos especiais?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Créditos especiais podem ser usados para pixels exclusivos, ferramentas premium e itens únicos.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Headphones className="h-4 w-4 mr-2 text-blue-500" />
                    Que tipo de suporte recebo?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Premium inclui suporte prioritário por email, Ultimate inclui suporte VIP 24/7 e consultoria.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
                <Button variant="outline" size="lg">
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
