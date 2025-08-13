'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  ShoppingCart, TrendingUp, Star, Crown, Gem, MapPin, Eye, Heart, 
  Filter, Search, Coins, Gift, Zap, Target, Award, Sparkles, 
  Flame, Lightning, DollarSign, Users, Calendar, Clock, Share2,
  Bookmark, MoreHorizontal, Play, Pause, Volume2, Settings
} from "lucide-react";
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';

interface MarketplacePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  identity: {
    name: string;
    description: string;
    avatar?: string;
    theme: string;
  };
  owner: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    rating: number;
  };
  pricing: {
    current: number;
    original?: number;
    currency: 'EUR' | 'CREDITS' | 'SPECIAL';
    discount?: number;
    auction?: {
      endTime: string;
      highestBid: number;
      bidCount: number;
    };
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  stats: {
    views: number;
    likes: number;
    shares: number;
    saves: number;
  };
  media: {
    type: 'image' | 'video' | 'animation' | 'interactive';
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  tags: string[];
  features: string[];
  isHot: boolean;
  isFeatured: boolean;
  isNew: boolean;
  listedAt: string;
  category: 'art' | 'investment' | 'utility' | 'collectible' | 'gaming';
}

const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    identity: {
      name: 'Portal do Tempo Lisboa',
      description: 'Uma janela mágica para a história de Lisboa, onde cada clique revela segredos da capital',
      avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
      theme: 'golden'
    },
    owner: {
      name: 'HistoryKeeper',
      username: '@historykeeper',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 28,
      rating: 4.9
    },
    pricing: {
      current: 450,
      original: 600,
      currency: 'EUR',
      discount: 25
    },
    rarity: 'Lendário',
    stats: {
      views: 15420,
      likes: 2340,
      shares: 456,
      saves: 789
    },
    media: {
      type: 'interactive',
      url: 'https://placehold.co/400x400/D4A757/FFFFFF?text=Lisboa+Interactive'
    },
    tags: ['lisboa', 'história', 'interativo', 'premium'],
    features: ['Animação 3D', 'Sons Ambientes', 'História Interativa', 'Realidade Aumentada'],
    isHot: true,
    isFeatured: true,
    isNew: false,
    listedAt: '2024-03-10',
    category: 'art'
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    identity: {
      name: 'Alma do Douro',
      description: 'Sinta a energia do rio Douro neste pixel que pulsa com a vida do Porto',
      theme: 'ocean'
    },
    owner: {
      name: 'RiverSoul',
      username: '@riversoul',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 19,
      rating: 4.7
    },
    pricing: {
      current: 280,
      currency: 'EUR',
      auction: {
        endTime: '2024-03-20T18:00:00Z',
        highestBid: 280,
        bidCount: 23
      }
    },
    rarity: 'Épico',
    stats: {
      views: 8930,
      likes: 1456,
      shares: 234,
      saves: 345
    },
    media: {
      type: 'animation',
      url: 'https://placehold.co/400x400/7DF9FF/000000?text=Porto+Animation',
      duration: 15
    },
    tags: ['porto', 'douro', 'animação', 'água'],
    features: ['Animação Fluida', 'Efeitos Sonoros', 'Mudança de Cor'],
    isHot: true,
    isFeatured: false,
    isNew: true,
    listedAt: '2024-03-18',
    category: 'art'
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState(mockMarketplacePixels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  
  const { addPixel, addXp, removeCredits } = useUserStore();
  const { toast } = useToast();

  const handlePurchase = async (pixel: MarketplacePixel) => {
    setPlayPurchaseSound(true);
    
    // Simulate purchase process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    removeCredits(pixel.pricing.current);
    addPixel();
    addXp(100);
    
    setShowConfetti(true);
    
    toast({
      title: "Pixel Adquirido! 🎉",
      description: `"${pixel.identity.name}" agora é seu! Recebeu 100 XP.`,
    });
  };

  const handleLike = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            stats: { ...pixel.stats, likes: pixel.stats.likes + 1 }
          }
        : pixel
    ));
  };

  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.identity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.identity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || pixel.category === selectedCategory;
    const matchesPrice = pixel.pricing.current >= priceRange[0] && pixel.pricing.current <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3" />
              Marketplace de Identidades Digitais
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Descubra, compre e colecione pixels únicos com identidades digitais personalizadas
            </p>
          </CardHeader>
        </Card>

        {/* Filtros e Pesquisa */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar identidades digitais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">Todas Categorias</option>
                  <option value="art">🎨 Arte</option>
                  <option value="investment">💰 Investimento</option>
                  <option value="utility">⚡ Utilidade</option>
                  <option value="collectible">💎 Colecionável</option>
                  <option value="gaming">🎮 Gaming</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="featured">⭐ Em Destaque</option>
                  <option value="hot">🔥 Em Alta</option>
                  <option value="new">🆕 Mais Recentes</option>
                  <option value="price-low">💰 Preço: Menor</option>
                  <option value="price-high">💰 Preço: Maior</option>
                  <option value="popular">❤️ Mais Populares</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Pixels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPixels.map((pixel, index) => (
            <motion.div
              key={pixel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="relative">
                  {/* Media */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pixel.media.url} 
                      alt={pixel.identity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {pixel.media.type === 'video' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" className="rounded-full bg-white/90 text-black">
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                    
                    {pixel.media.type === 'animation' && (
                      <Badge className="absolute bottom-2 left-2 bg-purple-500">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Animado
                      </Badge>
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className={getRarityColor(pixel.rarity)}>
                      {pixel.rarity}
                    </Badge>
                    {pixel.isFeatured && (
                      <Badge className="bg-amber-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                    {pixel.isHot && (
                      <Badge className="bg-red-500 animate-pulse">
                        <Flame className="h-3 w-3 mr-1" />
                        HOT
                      </Badge>
                    )}
                    {pixel.isNew && (
                      <Badge className="bg-green-500">
                        🆕 Novo
                      </Badge>
                    )}
                    {pixel.pricing.discount && (
                      <Badge className="bg-orange-500">
                        -{pixel.pricing.discount}%
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLike(pixel.id)}
                      className="h-8 w-8 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-background/80 hover:bg-background"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Auction Timer */}
                  {pixel.pricing.auction && (
                    <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                      <Clock className="h-3 w-3 inline mr-1" />
                      2h 30m
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  {/* Owner Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={pixel.owner.avatar} />
                      <AvatarFallback>{pixel.owner.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{pixel.owner.name}</span>
                    {pixel.owner.verified && (
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      Nv.{pixel.owner.level}
                    </Badge>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{pixel.owner.rating}</span>
                    </div>
                  </div>
                  
                  {/* Identity */}
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1">{pixel.identity.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pixel.identity.description}
                    </p>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>({pixel.x}, {pixel.y}) • {pixel.region}</span>
                  </div>
                  
                  {/* Features */}
                  {pixel.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {pixel.features.slice(0, 2).map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            ✨ {feature}
                          </Badge>
                        ))}
                        {pixel.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pixel.features.length - 2} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {pixel.stats.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {pixel.stats.likes}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{pixel.listedAt}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pixel.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Pricing and Purchase */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {pixel.pricing.currency === 'EUR' ? '€' : ''}
                            {pixel.pricing.current}
                            {pixel.pricing.currency === 'CREDITS' ? ' créditos' : ''}
                            {pixel.pricing.currency === 'SPECIAL' ? ' especiais' : ''}
                          </span>
                          {pixel.pricing.original && (
                            <span className="text-sm text-muted-foreground line-through">
                              €{pixel.pricing.original}
                            </span>
                          )}
                        </div>
                        {pixel.pricing.auction && (
                          <p className="text-xs text-orange-500">
                            Lance atual • {pixel.pricing.auction.bidCount} lances
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handlePurchase(pixel)}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10"
                    >
                      {pixel.pricing.auction ? (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Licitar
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar Agora
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Não Encontrou o Pixel Perfeito?</h2>
            <p className="text-muted-foreground mb-6">
              Explore o mapa interativo e encontre pixels únicos para criar sua própria identidade digital
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <MapPin className="h-5 w-5 mr-2" />
              Explorar Mapa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}