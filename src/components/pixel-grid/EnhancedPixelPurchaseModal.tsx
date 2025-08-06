'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from 'framer-motion';
import {
  ShoppingCart, CreditCard, Coins, Gift, Star, Crown, Gem, Sparkles,
  MapPin, Eye, Heart, Share2, Edit3, Palette, Upload, Link as LinkIcon,
  Tag, Flag, AlertTriangle, CheckCircle, X, Zap, Target, Award
} from 'lucide-react';

interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  views: number;
  likes: number;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  specialCreditsPrice?: number;
  description?: string;
  features?: string[];
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any) => Promise<boolean>;
}

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'special' | 'card'>('credits');
  const [customizations, setCustomizations] = useState({
    color: '#D4A757',
    title: '',
    description: '',
    tags: '',
    linkUrl: '',
    isPublic: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { toast } = useToast();
  const { addCredits, removeCredits, addXp, addPixel } = useUserStore();

  if (!pixelData) return null;

  const canAffordWithCredits = userCredits >= pixelData.price;
  const canAffordWithSpecial = userSpecialCredits >= (pixelData.specialCreditsPrice || 0);
  const isAffordable = canAffordWithCredits || canAffordWithSpecial;

  const handlePurchase = async () => {
    if (!isAffordable) {
      toast({
        title: "Créditos Insuficientes",
        description: "Não tem créditos suficientes para esta compra.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const success = await onPurchase(pixelData, paymentMethod, customizations);
      
      if (success) {
        // Deduct credits
        if (paymentMethod === 'credits') {
          removeCredits(pixelData.price);
        } else if (paymentMethod === 'special') {
          // Would need removeSpecialCredits method
        }
        
        // Add rewards
        addXp(50);
        addPixel();
        
        setShowConfetti(true);
        setPlaySuccessSound(true);
        
        toast({
          title: "Pixel Comprado! 🎉",
          description: `Pixel (${pixelData.x}, ${pixelData.y}) é agora seu!`,
        });
        
        onClose();
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
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3 text-primary" />
              <div>
                <h2 className="text-xl font-headline">Pixel ({pixelData.x}, {pixelData.y})</h2>
                <p className="text-sm text-muted-foreground">{pixelData.region}</p>
              </div>
            </div>
            <Badge className={getRarityColor(pixelData.rarity)}>
              {pixelData.rarity}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Pixel Info */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Região</p>
                  <p className="font-semibold">{pixelData.region}</p>
                </div>
                <div>
                  <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                  <p className="font-semibold">{pixelData.views}</p>
                </div>
                <div>
                  <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Curtidas</p>
                  <p className="font-semibold">{pixelData.likes}</p>
                </div>
                <div>
                  <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Raridade</p>
                  <p className="font-semibold">{pixelData.rarity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-primary" />
                Preço e Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  €{pixelData.price}
                </div>
                {pixelData.specialCreditsPrice && (
                  <div className="text-lg text-accent">
                    ou {pixelData.specialCreditsPrice} créditos especiais
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant={paymentMethod === 'credits' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('credits')}
                  disabled={!canAffordWithCredits}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Coins className="h-6 w-6 mb-2" />
                  <span>Créditos</span>
                  <span className="text-xs">{userCredits} disponíveis</span>
                </Button>

                {pixelData.specialCreditsPrice && (
                  <Button
                    variant={paymentMethod === 'special' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('special')}
                    disabled={!canAffordWithSpecial}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Gift className="h-6 w-6 mb-2" />
                    <span>Especiais</span>
                    <span className="text-xs">{userSpecialCredits} disponíveis</span>
                  </Button>
                )}

                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Cartão</span>
                  <span className="text-xs">Visa/Mastercard</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customizations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2 text-primary" />
                Personalização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pixel-color">Cor do Pixel</Label>
                <div className="flex gap-2">
                  <Input
                    id="pixel-color"
                    type="color"
                    value={customizations.color}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    value={customizations.color}
                    onChange={(e) => setCustomizations(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#D4A757"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixel-title">Título do Pixel</Label>
                <Input
                  id="pixel-title"
                  value={customizations.title}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Meu Pixel Especial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixel-description">Descrição</Label>
                <Textarea
                  id="pixel-description"
                  value={customizations.description}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o seu pixel..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixel-tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="pixel-tags"
                  value={customizations.tags}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="arte, lisboa, especial"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public-pixel"
                  checked={customizations.isPublic}
                  onCheckedChange={(checked) => setCustomizations(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="public-pixel">Tornar público na galeria</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/20">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {!isAffordable && (
                <div className="flex items-center text-red-500">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Créditos insuficientes
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button 
                onClick={handlePurchase} 
                disabled={!isAffordable || isProcessing}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar Pixel
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}