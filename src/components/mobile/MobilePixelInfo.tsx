'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, User, Coins, Eye, Heart, Share2, ShoppingCart,
  Star, Crown, Gem, Calendar, Clock, Info, X, ChevronUp,
  ChevronDown, Palette, Edit, Flag, Bookmark, ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PixelInfo {
  x: number;
  y: number;
  region: string;
  owner?: string;
  price: number;
  rarity: string;
  views: number;
  likes: number;
  description?: string;
  lastModified?: string;
  isOwned: boolean;
  isFavorited: boolean;
}

interface MobilePixelInfoProps {
  pixelInfo: PixelInfo | null;
  isVisible: boolean;
  onClose: () => void;
  onPurchase?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  className?: string;
}

export default function MobilePixelInfo({
  pixelInfo,
  isVisible,
  onClose,
  onPurchase,
  onEdit,
  onShare,
  onToggleFavorite,
  className
}: MobilePixelInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  if (!pixelInfo) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'comum': return 'text-gray-500 bg-gray-500/10';
      case 'incomum': return 'text-green-500 bg-green-500/10';
      case 'raro': return 'text-blue-500 bg-blue-500/10';
      case 'épico': return 'text-purple-500 bg-purple-500/10';
      case 'lendário': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'purchase':
        onPurchase?.();
        break;
      case 'edit':
        onEdit?.();
        break;
      case 'share':
        onShare?.();
        break;
      case 'favorite':
        onToggleFavorite?.();
        toast({
          title: pixelInfo.isFavorited ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
          description: `Pixel (${pixelInfo.x}, ${pixelInfo.y})`,
        });
        break;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 max-h-[70vh]",
            className
          )}
        >
          <Card className="rounded-t-2xl border-t border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-2">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Pixel ({pixelInfo.x}, {pixelInfo.y})
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {pixelInfo.region}
                      </Badge>
                      <Badge className={cn("text-xs", getRarityColor(pixelInfo.rarity))}>
                        {pixelInfo.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold text-primary">
                    €{pixelInfo.price}
                  </div>
                  <div className="text-xs text-muted-foreground">Preço</div>
                </div>
                
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-500">
                    {pixelInfo.views}
                  </div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold text-red-500">
                    {pixelInfo.likes}
                  </div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
              </div>

              {/* Owner Info */}
              {pixelInfo.owner && (
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://placehold.co/32x32.png?text=${pixelInfo.owner[0]}`} />
                    <AvatarFallback>{pixelInfo.owner[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{pixelInfo.owner}</div>
                    <div className="text-xs text-muted-foreground">Proprietário</div>
                  </div>
                  {pixelInfo.owner !== 'Sistema' && (
                    <Button variant="outline" size="sm">
                      <User className="h-3 w-3 mr-1" />
                      Ver Perfil
                    </Button>
                  )}
                </div>
              )}

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {pixelInfo.description && (
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-sm font-medium mb-1">Descrição</div>
                        <div className="text-sm text-muted-foreground">
                          {pixelInfo.description}
                        </div>
                      </div>
                    )}

                    {pixelInfo.lastModified && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Última modificação:</span>
                        <span className="font-medium">{pixelInfo.lastModified}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {!pixelInfo.isOwned && pixelInfo.price > 0 && (
                  <Button
                    onClick={() => handleAction('purchase')}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </Button>
                )}
                
                {pixelInfo.isOwned && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction('edit')}
                    className="touch-target"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => handleAction('favorite')}
                  className={cn(
                    "touch-target",
                    pixelInfo.isFavorited && "text-red-500 border-red-500/50"
                  )}
                >
                  <Heart className={`h-4 w-4 mr-2 ${pixelInfo.isFavorited ? 'fill-current' : ''}`} />
                  {pixelInfo.isFavorited ? 'Favorito' : 'Favoritar'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleAction('share')}
                  className="touch-target"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar
                </Button>
                
                <Button
                  variant="outline"
                  className="touch-target"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Reportar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}