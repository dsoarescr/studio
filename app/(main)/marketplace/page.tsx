'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useToast } from "../../hooks/use-toast";
import { motion } from "framer-motion";
import { 
  ShoppingCart, TrendingUp, Star, Crown, Gem, MapPin, Eye, Heart, 
  Filter, Search, Coins, Gift, Zap, Target, Award, Sparkles, 
  Flame, DollarSign, Users, Calendar, Clock, Share2, Bookmark, 
  MoreHorizontal, Play, Pause, Volume2, Settings, User, Edit3,
  Camera, Video, Music, Image as ImageIcon, Globe, MessageSquare
} from "lucide-react";
import { useUserStore } from '../../lib/store';
import { SoundEffect, SOUND_EFFECTS } from '../../components/ui/sound-effect';
import { Confetti } from '../../components/ui/confetti';

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
    tags: string[];
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  };
  owner: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    rating: number;
    totalSales: number;
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
    negotiable: boolean;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  stats: {
    views: number;
    likes: number;
    shares: number;
    saves: number;
    comments: number;
  };
  media: {
    type: 'image' | 'video' | 'animation' | 'interactive';
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  features: string[];
  isHot: boolean;
  isFeatured: boolean;
  isNew: boolean;
  listedAt: string;
  category: 'art' | 'investment' | 'utility' | 'collectible' | 'gaming' | 'social';
  story?: {
    title: string;
    content: string;
    chapters: number;
  };
}

const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    identity: {
      name: 'Portal do Tempo Lisboa',
      description: 'Uma identidade digital que conecta o passado e o futuro de Lisboa. Cada interação revela uma nova camada da história da capital portuguesa.',
      avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
      theme: 'Dourado Histórico',
      tags: ['lisboa', 'história', 'interativo', 'premium', 'cultura'],
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/portaltempo' },
        { platform: 'Twitter', url: 'https://twitter.com/portaltempo' }
      ]
    },
    owner: {
      name: 'HistoryKeeper',
      username: '@historykeeper',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 28,
      rating: 4.9,
      totalSales: 45
    },
    pricing: {
      current: 450,
      original: 600,
      currency: 'EUR',
      discount: 25,
      negotiable: true
    },
    rarity: 'Lendário',
    stats: {
      views: 15420,
      likes: 2340,
      shares: 456,
      saves: 789,
      comments: 234
    },
    media: {
      type: 'interactive',
      url: 'https://placehold.co/400x400/D4A757/FFFFFF?text=Lisboa+Interactive'
    },
    features: ['Animação 3D', 'Sons Ambientes', 'História Interativa', 'Realidade Aumentada', 'NFT Verificado'],
    isHot: true,
    isFeatured: true,
    isNew: false,
    listedAt: '2024-03-10',
    category: 'art',
    story: {
      title: 'A Lenda do Portal',
      content: 'Descoberto nas ruínas digitais de Lisboa...',
      chapters: 5
    }
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    identity: {
      name: 'Alma do Douro',
      description: 'Sinta a energia do rio Douro neste pixel que pulsa com a vida do Porto. Uma identidade digital que evolui com as marés.',
      theme: 'Azul Oceânico',
      tags: ['porto', 'douro', 'animação', 'água', 'energia'],
      socialLinks: []
    },
    owner: {
      name: 'RiverSoul',
      username: '@riversoul',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 19,
      rating: 4.7,
      totalSales: 12
    },
    pricing: {
      current: 280,
      currency: 'EUR',
      auction: {
        endTime: '2024-03-20T18:00:00Z',
        highestBid: 280,
        bidCount: 23
      },
      negotiable: false
    },
    rarity: 'Épico',
    stats: {
      views: 8930,
      likes: 1456,
      shares: 234,
      saves: 345,
      comments: 89
    },
    media: {
      type: 'animation',
      url: 'https://placehold.co/400x400/7DF9FF/000000?text=Porto+Animation',
      duration: 15
    },
    features: ['Animação Fluida', 'Efeitos Sonoros', 'Mudança de Cor Dinâmica'],
    isHot: true,
    isFeatured: false,
    isNew: true,
    listedAt: '2024-03-18',
    category: 'art'
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    identity: {
      name: 'Sabedoria Universitária',
      description: 'Um pixel que cresce em conhecimento. Perfeito para estudantes e académicos que querem uma identidade digital inteligente.',
      theme: 'Roxo Académico',
      tags: ['coimbra', 'universidade', 'educação', 'crescimento'],
      socialLinks: []
    },
    owner: {
      name: 'AcademicMind',
      username: '@academicmind',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 22,
      rating: 4.8,
      totalSales: 28
    },
    pricing: {
      current: 120,
      currency: 'CREDITS',
      negotiable: true
    },
    rarity: 'Raro',
    stats: {
      views: 5670,
      likes: 890,
      shares: 123,
      saves: 234,
      comments: 56
    },
    media: {
      type: 'image',
      url: 'https://placehold.co/400x400/9C27B0/FFFFFF?text=Coimbra+Academic'
    },
    features: ['Evolução Dinâmica', 'Sistema de Níveis', 'Conquistas Académicas'],
    isHot: false,
    isFeatured: false,
    isNew: false,
    listedAt: '2024-03-15',
    category: 'utility'
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
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  
  const { addPixel, addXp, removeCredits, credits } = useUserStore();
  const { toast } = useToast();

  const handlePurchase = async (pixel: MarketplacePixel) => {
    if (credits < pixel.pricing.current) {
      toast({
        title: "Créditos Insuficientes",
        description: "Você precisa de mais créditos para comprar este pixel.",
        variant: "destructive"
      });
      return;
    }

    setPlayPurchaseSound(true);
    
    // Simulate purchase process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    removeCredits(pixel.pricing.current);
    addPixel();
    addXp(100);
    
    setShowConfetti(true);
    
    toast({
      title: "🎉 Identidade Digital Adquirida!",
      description: `"${pixel.identity.name}" agora é sua! +100 XP ganhos.`,
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
    
    toast({
      title: "❤️ Curtido!",
      description: "Pixel adicionado aos seus favoritos",
    });
  };

  const handleSave = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            stats: { ...pixel.stats, saves: pixel.stats.saves + 1 }
          }
        : pixel
    ));
    
    toast({
      title: "🔖 Salvo!",
      description: "Pixel salvo na sua lista de desejos",
    });
  };

  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.identity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.identity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.identity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
      
      <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6 mb-20">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
                  <ShoppingCart className="h-8 w-8 mr-3" />
                  Marketplace de Identidades
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Descubra, compre e colecione pixels únicos com identidades digitais personalizadas
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 animate-pulse">
                  <Flame className="h-3 w-3 mr-1" />
                  {filteredPixels.length} Disponíveis
                </Badge>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Pesquisa e Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar identidades digitais únicas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-input bg-background rounded-md text-sm min-w-[140px]"
                >
                  <option value="all">🌟 Todas</option>
                  <option value="art">🎨 Arte Digital</option>
                  <option value="investment">💰 Investimento</option>
                  <option value="utility">⚡ Utilidade</option>
                  <option value="collectible">💎 Colecionável</option>
                  <option value="gaming">🎮 Gaming</option>
                  <option value="social">👥 Social</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-input bg-background rounded-md text-sm min-w-[140px]"
                >
                  <option value="featured">⭐ Em Destaque</option>
                  <option value="hot">🔥 Em Alta</option>
                  <option value="new">🆕 Mais Recentes</option>
                  <option value="price-low">💰 Preço: Menor</option>
                  <option value="price-high">💰 Preço: Maior</option>
                  <option value="popular">❤️ Mais Populares</option>
                  <option value="trending">📈 Trending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Identidades Digitais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPixels.map((pixel, index) => (
            <motion.div
              key={pixel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-card/90 backdrop-blur-sm">
                <div className="relative">
                  {/* Media Principal */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={pixel.media.url} 
                      alt={pixel.identity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay com informações */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Badges de Status */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className={getRarityColor(pixel.rarity)}>
                        <Gem className="h-3 w-3 mr-1" />
                        {pixel.rarity}
                      </Badge>
                      {pixel.isFeatured && (
                        <Badge className="bg-amber-500 animate-pulse">
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
                          <Sparkles className="h-3 w-3 mr-1" />
                          Novo
                        </Badge>
                      )}
                      {pixel.pricing.discount && (
                        <Badge className="bg-orange-500">
                          -{pixel.pricing.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    {/* Ações Rápidas */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleLike(pixel.id)}
                        className="h-10 w-10 bg-background/80 hover:bg-background backdrop-blur-sm touch-target"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(pixel.id)}
                        className="h-10 w-10 bg-background/80 hover:bg-background backdrop-blur-sm touch-target"
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* Informações do Pixel */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-bold text-lg mb-1">{pixel.identity.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>({pixel.x}, {pixel.y}) • {pixel.region}</span>
                      </div>
                    </div>
                    
                    {/* Timer para Leilões */}
                    {pixel.pricing.auction && (
                      <div className="absolute bottom-3 right-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">
                        <Clock className="h-4 w-4 inline mr-1" />
                        2h 30m
                      </div>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-4">
                  {/* Informações do Proprietário */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={pixel.owner.avatar} />
                      <AvatarFallback>{pixel.owner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{pixel.owner.name}</span>
                        {pixel.owner.verified && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Nível {pixel.owner.level}</span>
                        <span>•</span>
                        <span>{pixel.owner.totalSales} vendas</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{pixel.owner.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Descrição */}
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {pixel.identity.description}
                    </p>
                  </div>
                  
                  {/* Features Especiais */}
                  {pixel.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Funcionalidades:</h4>
                      <div className="flex flex-wrap gap-1">
                        {pixel.features.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            ✨ {feature}
                          </Badge>
                        ))}
                        {pixel.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pixel.features.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Estatísticas Sociais */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-blue-500" />
                        {pixel.stats.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        {pixel.stats.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                        {pixel.stats.comments}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {pixel.identity.tags.slice(0, 4).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Preço e Compra */}
                  <div className="space-y-3 pt-2 border-t border-border/50">
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
                          <p className="text-xs text-orange-500 font-medium">
                            Lance atual • {pixel.pricing.auction.bidCount} lances
                          </p>
                        )}
                        {pixel.pricing.negotiable && (
                          <p className="text-xs text-blue-500">
                            💬 Preço negociável
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handlePurchase(pixel)}
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-12 touch-target"
                      >
                        {pixel.pricing.auction ? (
                          <>
                            <Target className="h-5 w-5 mr-2" />
                            Licitar
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Comprar
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setSelectedPixel(pixel)}
                        className="h-12 w-12 touch-target"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Crie Sua Própria Identidade Digital</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Não encontrou o pixel perfeito? Explore o mapa interativo e encontre pixels únicos 
              para criar sua identidade digital personalizada do zero!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target">
                <MapPin className="h-5 w-5 mr-2" />
                Explorar Mapa
              </Button>
              <Button variant="outline" size="lg" className="touch-target">
                <User className="h-5 w-5 mr-2" />
                Ver Tutoriais
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Detalhes do Pixel */}
        {selectedPixel && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedPixel.identity.name}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPixel(null)}
                    className="touch-target"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="max-h-[60vh] p-6">
                <div className="space-y-4">
                  <img 
                    src={selectedPixel.media.url} 
                    alt={selectedPixel.identity.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedPixel.identity.description}
                  </p>
                  
                  {selectedPixel.story && (
                    <Card className="bg-purple-500/10 border-purple-500/30">
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-2">📖 {selectedPixel.story.title}</h4>
                        <p className="text-sm text-muted-foreground">{selectedPixel.story.content}</p>
                        <Badge className="mt-2">{selectedPixel.story.chapters} capítulos</Badge>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        handlePurchase(selectedPixel);
                        setSelectedPixel(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar €{selectedPixel.pricing.current}
                    </Button>
                    <Button variant="outline" className="touch-target">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}