'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, CreditCard, Coins, Gift, Star, Crown, Zap, MapPin,
  Palette, Camera, Upload, Type, Link as LinkIcon, Tag, Globe,
  Heart, Eye, Share2, Info, AlertTriangle, CheckCircle, X,
  Sparkles, Target, Award, Gem, Shield, Lock, User, Calendar,
  Clock, TrendingUp, BarChart3, Activity, Settings, Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PixelCustomization {
  title: string;
  description: string;
  color: string;
  image?: string;
  tags: string[];
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  isPublic: boolean;
  allowComments: boolean;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: any;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: any, paymentMethod: string, customizations: PixelCustomization) => Promise<boolean>;
}

export function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const [customization, setCustomization] = useState<PixelCustomization>({
    title: '',
    description: '',
    color: '#D4A757',
    tags: [],
    socialLinks: [],
    isPublic: true,
    allowComments: true
  });

  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  if (!pixelData) return null;

  const canAffordCredits = userCredits >= pixelData.price;
  const canAffordSpecial = userSpecialCredits >= (pixelData.specialCreditsPrice || 0);
  const totalPrice = paymentMethod === 'special' ? pixelData.specialCreditsPrice : pixelData.price;

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Autenticação Necessária",
        description: "Por favor, inicie sessão para comprar pixels.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const success = await onPurchase(pixelData, paymentMethod, customization);
      
      if (success) {
        setShowConfetti(true);
        setPlaySuccessSound(true);
        setStep(3);
        
        toast({
          title: "Pixel Adquirido! 🎉",
          description: `Parabéns! O pixel (${pixelData.x}, ${pixelData.y}) agora é seu!`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Compra",
        description: "Não foi possível completar a compra. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !customization.tags.includes(newTag.trim())) {
      setCustomization(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCustomization(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10';
      case 'Incomum': return 'text-green-500 bg-green-500/10';
      case 'Raro': return 'text-blue-500 bg-blue-500/10';
      case 'Épico': return 'text-purple-500 bg-purple-500/10';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10';
      case 'Marco Histórico': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-gradient-to-br from-card via-card/95 to-primary/5">
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-b">
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-headline">Adquirir Pixel</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-sm">
                ({pixelData.x}, {pixelData.y}) • {pixelData.region}
              </Badge>
              <Badge className={cn("text-sm", getRarityColor(pixelData.rarity))}>
                {pixelData.rarity}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 p-4 border-b">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={cn(
                    "w-8 h-0.5 transition-all",
                    step > stepNum ? 'bg-primary' : 'bg-muted'
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Pixel Overview */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-xl mb-2">Pixel Único Disponível!</h3>
                      <p className="text-muted-foreground">
                        Este pixel em {pixelData.region} está disponível para se tornar sua identidade digital única.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                      <div className="font-bold">{pixelData.rarity}</div>
                      <div className="text-xs text-muted-foreground">Raridade</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <div className="font-bold">{pixelData.views || 0}</div>
                      <div className="text-xs text-muted-foreground">Visualizações</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                      <div className="font-bold">{pixelData.likes || 0}</div>
                      <div className="text-xs text-muted-foreground">Curtidas</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <div className="font-bold">€{pixelData.price}</div>
                      <div className="text-xs text-muted-foreground">Preço</div>
                    </div>
                  </div>

                  {pixelData.features && pixelData.features.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Características Especiais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {pixelData.features.map((feature: string, index: number) => (
                            <Badge key={index} variant="outline">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {!user ? (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Lock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-amber-600 font-medium">Autenticação Necessária</p>
                        <p className="text-sm text-muted-foreground">
                          Crie uma conta ou inicie sessão para comprar pixels
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <AuthModal defaultTab="login">
                          <Button variant="outline" className="flex-1">
                            Iniciar Sessão
                          </Button>
                        </AuthModal>
                        <AuthModal defaultTab="register">
                          <Button className="flex-1">
                            Criar Conta
                          </Button>
                        </AuthModal>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setStep(2)} className="w-full h-12 text-lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Continuar Compra
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Step 2: Payment & Customization */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Tabs defaultValue="payment" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="payment">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagamento
                      </TabsTrigger>
                      <TabsTrigger value="customize">
                        <Palette className="h-4 w-4 mr-2" />
                        Personalizar
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="payment" className="space-y-4">
                      <h3 className="text-lg font-bold text-center">Escolha o Método de Pagamento</h3>
                      
                      <div className="space-y-3">
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all",
                            paymentMethod === 'credits' ? 'border-primary bg-primary/5' : ''
                          )}
                          onClick={() => setPaymentMethod('credits')}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Coins className="h-6 w-6 text-primary" />
                                <div>
                                  <div className="font-medium">Créditos Normais</div>
                                  <div className="text-sm text-muted-foreground">
                                    Saldo: {userCredits.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">€{pixelData.price}</div>
                                {!canAffordCredits && (
                                  <Badge variant="destructive" className="text-xs">Insuficiente</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {pixelData.specialCreditsPrice && (
                          <Card 
                            className={cn(
                              "cursor-pointer transition-all",
                              paymentMethod === 'special' ? 'border-accent bg-accent/5' : ''
                            )}
                            onClick={() => setPaymentMethod('special')}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Gift className="h-6 w-6 text-accent" />
                                  <div>
                                    <div className="font-medium">Créditos Especiais</div>
                                    <div className="text-sm text-muted-foreground">
                                      Saldo: {userSpecialCredits.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg text-accent">
                                    {pixelData.specialCreditsPrice}
                                  </div>
                                  {!canAffordSpecial && (
                                    <Badge variant="destructive" className="text-xs">Insuficiente</Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="customize" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Nome da Identidade</Label>
                          <Input
                            id="title"
                            placeholder="Ex: Meu Cantinho em Lisboa"
                            value={customization.title}
                            onChange={(e) => setCustomization(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            placeholder="Conte a história do seu pixel..."
                            value={customization.description}
                            onChange={(e) => setCustomization(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Cor Principal</Label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={customization.color}
                              onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                              className="w-12 h-10 rounded border border-input"
                            />
                            <Input
                              value={customization.color}
                              onChange={(e) => setCustomization(prev => ({ ...prev, color: e.target.value }))}
                              placeholder="#D4A757"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Adicionar tag..."
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addTag()}
                            />
                            <Button onClick={addTag} disabled={!newTag.trim()}>
                              <Tag className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {customization.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                                #{tag}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Voltar
                    </Button>
                    <Button 
                      onClick={handlePurchase}
                      disabled={!((paymentMethod === 'credits' && canAffordCredits) || 
                                  (paymentMethod === 'special' && canAffordSpecial)) || isProcessing}
                      className="flex-1 h-12"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar por {paymentMethod === 'special' ? `${pixelData.specialCreditsPrice} especiais` : `€${pixelData.price}`}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-green-500 mb-2">Parabéns! 🎉</h3>
                    <p className="text-muted-foreground">
                      Você agora é proprietário do pixel ({pixelData.x}, {pixelData.y})!
                    </p>
                  </div>

                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Trophy className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Recompensas Recebidas</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>XP Ganho:</span>
                          <span className="font-bold text-primary">+50 XP</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pixel Adquirido:</span>
                          <span className="font-bold text-accent">+1 Pixel</span>
                        </div>
                        {customization.title && (
                          <div className="flex justify-between">
                            <span>Identidade:</span>
                            <span className="font-bold text-purple-500">"{customization.title}"</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Button onClick={onClose} className="w-full h-12">
                      <Palette className="h-5 w-5 mr-2" />
                      Explorar Meu Pixel
                    </Button>
                    <Button variant="outline" onClick={onClose} className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar Conquista
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}