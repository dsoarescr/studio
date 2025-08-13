'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, CreditCard, Coins, Gift, Star, Crown, Zap, 
  CheckCircle, ArrowRight, ArrowLeft, Sparkles, Heart, Eye,
  MapPin, Palette, Trophy, Target, Gem, Shield, Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';

interface PixelPurchaseFlowProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: any;
  onPurchaseComplete: (pixelData: any) => void;
}

export function PixelPurchaseFlow({ isOpen, onClose, pixelData, onPurchaseComplete }: PixelPurchaseFlowProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { credits, specialCredits, removeCredits, removeSpecialCredits, addPixel, addXp } = useUserStore();
  const { toast } = useToast();

  if (!pixelData) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (paymentMethod === 'credits' && credits >= pixelData.price) {
      removeCredits(pixelData.price);
    } else if (paymentMethod === 'special' && specialCredits >= pixelData.specialCreditsPrice) {
      removeSpecialCredits(pixelData.specialCreditsPrice);
    }
    
    addPixel();
    addXp(50);
    
    setShowConfetti(true);
    setPlaySuccessSound(true);
    setStep(3);
    setIsProcessing(false);
    
    setTimeout(() => {
      onPurchaseComplete(pixelData);
    }, 2000);
  };

  const canAfford = (paymentMethod === 'credits' && credits >= pixelData.price) ||
                   (paymentMethod === 'special' && specialCredits >= pixelData.specialCreditsPrice);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-md p-0 bg-gradient-to-br from-card via-card/95 to-primary/5">
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/20 to-accent/20">
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-xl font-headline">Comprar Pixel</span>
            </div>
            <Badge variant="outline" className="text-sm">
              ({pixelData.x}, {pixelData.y}) • {pixelData.region}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Pixel Único Disponível!</h3>
                    <p className="text-muted-foreground text-sm">
                      Este pixel em {pixelData.region} está disponível para se tornar sua identidade digital única.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <div className="font-bold">{pixelData.rarity}</div>
                    <div className="text-xs text-muted-foreground">Raridade</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="font-bold">{pixelData.views}</div>
                    <div className="text-xs text-muted-foreground">Visualizações</div>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full h-12 text-lg">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Continuar Compra
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-center">Escolha o Método de Pagamento</h3>
                
                <div className="space-y-3">
                  <Card 
                    className={`cursor-pointer transition-all ${paymentMethod === 'credits' ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setPaymentMethod('credits')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Coins className="h-6 w-6 text-primary" />
                          <div>
                            <div className="font-medium">Créditos Normais</div>
                            <div className="text-sm text-muted-foreground">
                              Saldo: {credits.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">€{pixelData.price}</div>
                          {credits < pixelData.price && (
                            <Badge variant="destructive" className="text-xs">Insuficiente</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${paymentMethod === 'special' ? 'border-accent bg-accent/5' : ''}`}
                    onClick={() => setPaymentMethod('special')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Gift className="h-6 w-6 text-accent" />
                          <div>
                            <div className="font-medium">Créditos Especiais</div>
                            <div className="text-sm text-muted-foreground">
                              Saldo: {specialCredits.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-accent">{pixelData.specialCreditsPrice}</div>
                          {specialCredits < pixelData.specialCreditsPrice && (
                            <Badge variant="destructive" className="text-xs">Insuficiente</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    onClick={handlePurchase}
                    disabled={!canAfford || isProcessing}
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
                        Comprar Agora
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-green-500 mb-2">Parabéns! 🎉</h3>
                  <p className="text-muted-foreground">
                    Você agora é proprietário do pixel ({pixelData.x}, {pixelData.y})!
                  </p>
                </div>

                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Recompensas Recebidas</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>XP Ganho:</span>
                        <span className="font-bold text-primary">+50 XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pixel Adquirido:</span>
                        <span className="font-bold text-accent">+1 Pixel</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => onPurchaseComplete(pixelData)} className="w-full h-12">
                  <Palette className="h-5 w-5 mr-2" />
                  Criar Identidade Digital
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}