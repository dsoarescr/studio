'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { 
  Coins, Gift, Crown, Star, Zap, Target, Award, 
  CreditCard, Smartphone, Wallet, Percent, Clock,
  TrendingUp, Shield, CheckCircle, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  specialCredits?: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
  bonus?: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const creditPacks: CreditPack[] = [
  {
    id: 'starter',
    name: 'Pack Iniciante',
    credits: 1000,
    price: 4.99,
    icon: <Coins className="h-8 w-8" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['1000 Créditos', 'Sem taxa de transação', 'Suporte básico']
  },
  {
    id: 'popular',
    name: 'Pack Popular',
    credits: 2500,
    specialCredits: 100,
    price: 9.99,
    originalPrice: 12.49,
    discount: 20,
    popular: true,
    bonus: '+100 Créditos Especiais',
    icon: <Star className="h-8 w-8" />,
    color: 'from-primary to-accent',
    features: ['2500 Créditos', '100 Créditos Especiais', '20% Desconto', 'Suporte prioritário']
  },
  {
    id: 'premium',
    name: 'Pack Premium',
    credits: 5000,
    specialCredits: 300,
    price: 19.99,
    originalPrice: 24.99,
    discount: 25,
    bonus: '+300 Créditos Especiais + Badge Exclusivo',
    icon: <Crown className="h-8 w-8" />,
    color: 'from-purple-500 to-pink-500',
    features: ['5000 Créditos', '300 Créditos Especiais', '25% Desconto', 'Badge Exclusivo', 'Suporte VIP']
  },
  {
    id: 'ultimate',
    name: 'Pack Ultimate',
    credits: 10000,
    specialCredits: 750,
    price: 39.99,
    originalPrice: 49.99,
    discount: 30,
    bonus: '+750 Créditos Especiais + NFT Exclusivo',
    icon: <Sparkles className="h-8 w-8" />,
    color: 'from-amber-500 to-orange-500',
    features: ['10000 Créditos', '750 Créditos Especiais', '30% Desconto', 'NFT Exclusivo', 'Acesso Beta', 'Consultoria 1:1']
  }
];

const paymentMethods = [
  { id: 'card', name: 'Cartão de Crédito/Débito', icon: CreditCard, description: 'Visa, Mastercard, American Express' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, description: 'Pagamento seguro via PayPal' },
  { id: 'mbway', name: 'MB WAY', icon: Smartphone, description: 'Pagamento instantâneo português' },
  { id: 'crypto', name: 'Criptomoedas', icon: Zap, description: 'Bitcoin, Ethereum, USDC' }
];

export default function CreditsPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { addCredits, addSpecialCredits, credits, specialCredits } = useUserStore();
  const { toast } = useToast();

  const handlePurchase = async (pack: CreditPack) => {
    setIsProcessing(true);
    setSelectedPack(pack.id);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Adicionar créditos
    addCredits(pack.credits);
    if (pack.specialCredits) {
      addSpecialCredits(pack.specialCredits);
    }
    
    setShowConfetti(true);
    setPlaySuccessSound(true);
    setIsProcessing(false);
    setSelectedPack(null);
    
    toast({
      title: "Compra Realizada com Sucesso! 🎉",
      description: `${pack.credits.toLocaleString()} créditos${pack.specialCredits ? ` + ${pack.specialCredits} especiais` : ''} adicionados à sua conta.`,
    });
  };

  const getDiscountedPrice = (price: number) => {
    return price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-8 max-w-7xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-headline text-gradient-gold-animated flex items-center justify-center">
              <Coins className="h-10 w-10 mr-3" />
              Loja de Créditos
            </CardTitle>
            <CardDescription className="text-xl">
              Potencialize sua experiência no Pixel Universe com mais créditos
            </CardDescription>
            
            {/* Saldo Atual */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{credits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Créditos Normais</div>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent">{specialCredits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Créditos Especiais</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ofertas Especiais */}
        <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-red-500 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Oferta Limitada!
                </h3>
                <p className="text-muted-foreground">Até 30% de desconto em todos os packs - Termina em 2 dias!</p>
              </div>
              <Badge className="bg-red-500 animate-pulse">
                LIMITADO
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Packs de Créditos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105",
                pack.popular && "border-primary/50 shadow-primary/20 scale-105",
                selectedPack === pack.id && "ring-2 ring-primary"
              )}>
                {pack.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    Mais Popular
                  </div>
                )}
                
                {pack.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{pack.discount}%
                  </div>
                )}
                
                <CardHeader className={cn("text-center", pack.popular && "pt-12")}>
                  <div className={cn(
                    "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-white shadow-lg",
                    `bg-gradient-to-br ${pack.color}`
                  )}>
                    {pack.icon}
                  </div>
                  
                  <CardTitle className="text-xl">{pack.name}</CardTitle>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      <span className="text-primary">€{pack.price}</span>
                      {pack.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through ml-2">
                          €{pack.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-lg font-semibold text-accent">
                      {pack.credits.toLocaleString()} Créditos
                    </div>
                    
                    {pack.specialCredits && (
                      <div className="text-sm text-purple-500">
                        +{pack.specialCredits} Créditos Especiais
                      </div>
                    )}
                    
                    {pack.bonus && (
                      <Badge className="bg-green-500 text-xs">
                        <Gift className="h-3 w-3 mr-1" />
                        {pack.bonus}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {pack.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                
                <CardFooter>
                  <Button
                    className={cn(
                      "w-full transition-all duration-300",
                      pack.popular && "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    )}
                    onClick={() => handlePurchase(pack)}
                    disabled={isProcessing && selectedPack === pack.id}
                  >
                    {isProcessing && selectedPack === pack.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processando...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Comprar Agora
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Métodos de Pagamento Seguros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paymentMethods.map(method => (
                <Card 
                  key={method.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedPayment === method.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <CardContent className="p-4 text-center">
                    <method.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium text-sm">{method.name}</h3>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vantagens dos Créditos */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Porquê Comprar Créditos?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Pixels Exclusivos</h3>
                <p className="text-sm text-muted-foreground">
                  Acesso a pixels raros e localizações premium
                </p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Investimento Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Pixels podem valorizar ao longo do tempo
                </p>
              </div>
              
              <div className="text-center">
                <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Recompensas Especiais</h3>
                <p className="text-sm text-muted-foreground">
                  Desbloqueie conquistas e conteúdo exclusivo
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Os créditos expiram?</h3>
                <p className="text-sm text-muted-foreground">
                  Não! Os seus créditos nunca expiram e ficam sempre disponíveis na sua conta.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Posso reembolsar créditos?</h3>
                <p className="text-sm text-muted-foreground">
                  Créditos não utilizados podem ser reembolsados dentro de 14 dias da compra.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Há descontos para compras grandes?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim! Quanto maior o pack, maior o desconto e mais bónus recebe.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Os pagamentos são seguros?</h3>
                <p className="text-sm text-muted-foreground">
                  Utilizamos encriptação SSL e processadores de pagamento certificados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}