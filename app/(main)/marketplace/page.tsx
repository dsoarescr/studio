'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from "framer-motion";
import { 
  ShoppingCart, Search, Filter, Grid3X3, List, MapPin, Eye, Heart, 
  Star, Crown, Gem, Sparkles, TrendingUp, Clock, Users, Share2, 
  Bookmark, ExternalLink, Gavel, Timer, Flame, Target, Award, 
  Trophy, Coins, Gift, Zap, Send, Check, X, ChevronRight, 
  ArrowUp, ArrowDown, BarChart3, PieChart, LineChart, Activity,
  Calendar, Globe, Navigation, Compass, Info, AlertTriangle,
  CheckCircle, Plus, Minus, Copy, Download, Upload, Settings,
  Bell, MessageSquare, UserPlus, ThumbsUp, Mail, Phone
} from "lucide-react";
import { cn } from '@/lib/utils';

interface PixelData {
  id: string;
  x: number;
  y: number;
  region: string;
  price: number;
  specialPrice?: number;
  owner: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  views: number;
  likes: number;
  comments: number;
  followers: number;
  isLiked: boolean;
  isFollowing: boolean;
  color: string;
  title?: string;
  description?: string;
  tags: string[];
  features: string[];
  lastSale?: number;
  priceHistory: Array<{ date: string; price: number }>;
  isAuction?: boolean;
  auctionEndTime?: Date;
  currentBid?: number;
  bidCount?: number;
  gpsCoords?: { lat: number; lon: number };
}

interface Offer {
  id: string;
  pixelId: string;
  buyerName: string;
  buyerAvatar: string;
  amount: number;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface SaleData {
  id: string;
  pixel: PixelData;
  offers: Offer[];
  views: number;
  likes: number;
  comments: number;
  followers: number;
  isPromoted: boolean;
  promotionEndsAt?: Date;
}

const mockPixels: PixelData[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    price: 150,
    specialPrice: 120,
    owner: 'PixelCollector',
    rarity: 'Épico',
    views: 1234,
    likes: 89,
    comments: 23,
    followers: 45,
    isLiked: false,
    isFollowing: false,
    color: '#D4A757',
    title: 'Vista do Tejo',
    description: 'Pixel premium com vista para o Rio Tejo no coração de Lisboa',
    tags: ['lisboa', 'rio', 'premium'],
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade'],
    lastSale: 120,
    priceHistory: [
      { date: '2024-01-01', price: 100 },
      { date: '2024-02-01', price: 120 },
      { date: '2024-03-01', price: 150 }
    ],
    gpsCoords: { lat: 38.7223, lon: -9.1393 }
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    price: 89,
    owner: 'PortoArtist',
    rarity: 'Raro',
    views: 567,
    likes: 34,
    comments: 12,
    followers: 23,
    isLiked: true,
    isFollowing: false,
    color: '#7DF9FF',
    title: 'Arte Ribeirinha',
    description: 'Pixel artístico na zona ribeirinha do Porto',
    tags: ['porto', 'arte', 'ribeira'],
    features: ['Zona Ribeirinha', 'Património UNESCO'],
    lastSale: 75,
    priceHistory: [
      { date: '2024-01-01', price: 60 },
      { date: '2024-02-01', price: 75 },
      { date: '2024-03-01', price: 89 }
    ],
    isAuction: true,
    auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    currentBid: 89,
    bidCount: 15,
    gpsCoords: { lat: 41.1579, lon: -8.6291 }
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    price: 67,
    owner: 'StudentArtist',
    rarity: 'Incomum',
    views: 234,
    likes: 18,
    comments: 8,
    followers: 12,
    isLiked: false,
    isFollowing: true,
    color: '#9C27B0',
    title: 'Universidade Histórica',
    description: 'Pixel na zona universitária histórica de Coimbra',
    tags: ['coimbra', 'universidade', 'história'],
    features: ['Zona Universitária', 'Património Histórico'],
    lastSale: 55,
    priceHistory: [
      { date: '2024-01-01', price: 45 },
      { date: '2024-02-01', price: 55 },
      { date: '2024-03-01', price: 67 }
    ],
    gpsCoords: { lat: 40.2033, lon: -8.4103 }
  }
];

const mockSales: SaleData[] = [
  {
    id: 'sale1',
    pixel: mockPixels[0],
    offers: [
      {
        id: 'offer1',
        pixelId: '1',
        buyerName: 'InvestorPro',
        buyerAvatar: 'https://placehold.co/40x40.png',
        amount: 140,
        message: 'Interessado neste pixel para minha coleção de Lisboa!',
        timestamp: '2h atrás',
        status: 'pending'
      },
      {
        id: 'offer2',
        pixelId: '1',
        buyerName: 'ArtCollector',
        buyerAvatar: 'https://placehold.co/40x40.png',
        amount: 135,
        timestamp: '4h atrás',
        status: 'pending'
      }
    ],
    views: 1234,
    likes: 89,
    comments: 23,
    followers: 45,
    isPromoted: true,
    promotionEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<PixelData[]>(mockPixels);
  const [sales, setSales] = useState<SaleData[]>(mockSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'views' | 'likes' | 'recent'>('price');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPixel, setSelectedPixel] = useState<PixelData | null>(null);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { toast } = useToast();
  const { credits, specialCredits, addCredits, removeCredits, addXp, addPixel } = useUserStore();

  // Filtrar pixels
  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRarity = selectedRarity === 'all' || pixel.rarity === selectedRarity;
    const matchesRegion = selectedRegion === 'all' || pixel.region === selectedRegion;
    
    return matchesSearch && matchesRarity && matchesRegion;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price - b.price;
      case 'views': return b.views - a.views;
      case 'likes': return b.likes - a.likes;
      case 'recent': return b.id.localeCompare(a.id);
      default: return 0;
    }
  });

  const handleBuyPixel = (pixel: PixelData) => {
    setSelectedPixel(pixel);
    setShowBuyModal(true);
  };

  const handleBidPixel = (pixel: PixelData) => {
    setSelectedPixel(pixel);
    setShowBidModal(true);
  };

  const handleViewPixel = (pixel: PixelData) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedPixel) return;
    
    if (credits < selectedPixel.price) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${selectedPixel.price - credits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }

    removeCredits(selectedPixel.price);
    addXp(100);
    addPixel();
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    toast({
      title: "Pixel Comprado! 🎉",
      description: `Pixel (${selectedPixel.x}, ${selectedPixel.y}) é agora seu! +100 XP`,
    });
    
    setShowBuyModal(false);
    setSelectedPixel(null);
  };

  const placeBid = () => {
    if (!selectedPixel || !bidAmount) return;
    
    const amount = parseFloat(bidAmount);
    const minBid = (selectedPixel.currentBid || selectedPixel.price) + 10;
    
    if (amount < minBid) {
      toast({
        title: "Lance Insuficiente",
        description: `Lance mínimo: €${minBid}`,
        variant: "destructive"
      });
      return;
    }

    if (credits < amount) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${amount - credits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }

    addXp(50);
    setPlaySuccessSound(true);
    
    toast({
      title: "Lance Colocado! 🎯",
      description: `Lance de €${amount} registado com sucesso! +50 XP`,
    });
    
    setBidAmount('');
    setShowBidModal(false);
    setSelectedPixel(null);
  };

  const makeOffer = () => {
    if (!selectedPixel || !offerAmount) return;
    
    const amount = parseFloat(offerAmount);
    
    if (amount >= selectedPixel.price) {
      toast({
        title: "Oferta Muito Alta",
        description: "A oferta deve ser inferior ao preço de venda.",
        variant: "destructive"
      });
      return;
    }

    addXp(25);
    setPlaySuccessSound(true);
    
    toast({
      title: "Oferta Enviada! 📤",
      description: `Oferta de €${amount} enviada ao proprietário! +25 XP`,
    });
    
    setOfferAmount('');
    setOfferMessage('');
    setShowOfferModal(false);
    setSelectedPixel(null);
  };

  const handleLikePixel = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isLiked: !pixel.isLiked,
            likes: pixel.isLiked ? pixel.likes - 1 : pixel.likes + 1
          }
        : pixel
    ));
    
    addXp(5);
    addCredits(2);
    setPlaySuccessSound(true);
    
    const pixel = pixels.find(p => p.id === pixelId);
    toast({
      title: pixel?.isLiked ? "💔 Like Removido" : "❤️ Pixel Curtido!",
      description: pixel?.isLiked ? "Like removido." : "Recebeu 5 XP + 2 créditos!",
    });
  };

  const handleFollowPixel = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isFollowing: !pixel.isFollowing,
            followers: pixel.isFollowing ? pixel.followers - 1 : pixel.followers + 1
          }
        : pixel
    ));
    
    addXp(10);
    addCredits(5);
    setPlaySuccessSound(true);
    
    const pixel = pixels.find(p => p.id === pixelId);
    toast({
      title: pixel?.isFollowing ? "👋 Deixou de Seguir" : "🔔 A Seguir Pixel!",
      description: pixel?.isFollowing ? "Não receberá mais notificações." : "Receberá notificações sobre este pixel! +10 XP + 5 créditos",
    });
  };

  const handleAcceptOffer = (saleId: string, offerId: string) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? {
            ...sale,
            offers: sale.offers.map(offer => 
              offer.id === offerId 
                ? { ...offer, status: 'accepted' as const }
                : offer
            )
          }
        : sale
    ));
    
    const sale = sales.find(s => s.id === saleId);
    const offer = sale?.offers.find(o => o.id === offerId);
    
    if (offer) {
      addCredits(offer.amount);
      addXp(200);
      setShowConfetti(true);
      setPlaySuccessSound(true);
      
      toast({
        title: "Oferta Aceite! 🎉",
        description: `Vendeu pixel por €${offer.amount}! +200 XP`,
      });
    }
  };

  const handleRejectOffer = (saleId: string, offerId: string) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? {
            ...sale,
            offers: sale.offers.map(offer => 
              offer.id === offerId 
                ? { ...offer, status: 'rejected' as const }
                : offer
            )
          }
        : sale
    ));
    
    toast({
      title: "Oferta Rejeitada",
      description: "A oferta foi rejeitada com sucesso.",
    });
  };

  const handlePromotePixel = (saleId: string) => {
    if (credits < 50) {
      toast({
        title: "Créditos Insuficientes",
        description: "Precisa de 50 créditos para promover um pixel.",
        variant: "destructive"
      });
      return;
    }

    removeCredits(50);
    setSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? { 
            ...sale, 
            isPromoted: true,
            promotionEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        : sale
    ));
    
    toast({
      title: "Pixel Promovido! 📢",
      description: "Seu pixel terá destaque por 24 horas!",
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-4 px-3 sm:px-4 space-y-6 max-w-7xl mb-20">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative z-10 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-2xl sm:text-3xl text-gradient-gold flex items-center">
                  <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 mr-3 animate-glow" />
                  Marketplace de Pixels
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Descubra, compre e venda pixels únicos no mapa de Portugal
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filtros e Pesquisa */}
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar pixels por região, título, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm flex-1"
              >
                <option value="all">Todas as Raridades</option>
                <option value="Comum">Comum</option>
                <option value="Incomum">Incomum</option>
                <option value="Raro">Raro</option>
                <option value="Épico">Épico</option>
                <option value="Lendário">Lendário</option>
              </select>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm flex-1"
              >
                <option value="all">Todas as Regiões</option>
                <option value="Lisboa">Lisboa</option>
                <option value="Porto">Porto</option>
                <option value="Coimbra">Coimbra</option>
                <option value="Braga">Braga</option>
                <option value="Faro">Faro</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm flex-1"
              >
                <option value="price">Preço</option>
                <option value="views">Mais Vistos</option>
                <option value="likes">Mais Curtidos</option>
                <option value="recent">Mais Recentes</option>
              </select>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="marketplace" className="font-headline text-xs sm:text-sm">
              <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2"/>
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="following" className="font-headline text-xs sm:text-sm">
              <Bell className="h-4 w-4 mr-1 sm:mr-2"/>
              A Seguir
            </TabsTrigger>
            <TabsTrigger value="liked" className="font-headline text-xs sm:text-sm">
              <Heart className="h-4 w-4 mr-1 sm:mr-2"/>
              Curtidos
            </TabsTrigger>
            <TabsTrigger value="auctions" className="font-headline text-xs sm:text-sm">
              <Gavel className="h-4 w-4 mr-1 sm:mr-2"/>
              Leilões
            </TabsTrigger>
            <TabsTrigger value="sales" className="font-headline text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 sm:mr-2"/>
              Vendas
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Principal */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className={cn(
              "grid gap-4 sm:gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {filteredPixels.map((pixel, index) => (
                <motion.div
                  key={pixel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    <div 
                      className="relative h-32 sm:h-40 flex items-center justify-center text-4xl sm:text-6xl font-bold border-b-2 border-primary/20"
                      style={{ backgroundColor: pixel.color }}
                      onClick={() => handleViewPixel(pixel)}
                    >
                      🎨
                      
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className={getRarityColor(pixel.rarity)}>
                          {pixel.rarity}
                        </Badge>
                        {pixel.isAuction && (
                          <Badge className="bg-red-500 animate-pulse">
                            <Timer className="h-3 w-3 mr-1" />
                            Leilão
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePixel(pixel.id);
                          }}
                        >
                          <Heart className={`h-4 w-4 ${pixel.isLiked ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowPixel(pixel.id);
                          }}
                        >
                          <Bell className={`h-4 w-4 ${pixel.isFollowing ? 'fill-current text-blue-500' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm px-2 py-1 rounded text-center">
                          ({pixel.x}, {pixel.y}) • {pixel.region}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      <div className="space-y-2">
                        {pixel.title && (
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{pixel.title}</h3>
                        )}
                        {pixel.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {pixel.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {pixel.comments}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground">Preço:</span>
                          <div className="text-right">
                            <span className="text-lg sm:text-xl font-bold text-primary">€{pixel.price}</span>
                            {pixel.specialPrice && (
                              <div className="text-xs text-accent">
                                ou {pixel.specialPrice} especiais
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {pixel.isAuction && pixel.auctionEndTime && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Termina em:</span>
                            <span className="font-mono text-red-500">
                              {formatTimeLeft(pixel.auctionEndTime)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {pixel.isAuction ? (
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBidPixel(pixel);
                            }}
                            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            Licitar €{(pixel.currentBid || pixel.price) + 10}
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyPixel(pixel);
                              }}
                              className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Comprar
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPixel(pixel);
                                setShowOfferModal(true);
                              }}
                              className="flex-1 h-12"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Oferta
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* A Seguir */}
          <TabsContent value="following">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {pixels.filter(p => p.isFollowing).map(pixel => (
                <Card key={pixel.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getRarityColor(pixel.rarity)}>
                        {pixel.rarity}
                      </Badge>
                      <Badge className="bg-blue-500">A Seguir</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">
                      Pixel ({pixel.x}, {pixel.y})
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pixel.region} • €{pixel.price}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewPixel(pixel)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Curtidos */}
          <TabsContent value="liked">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {pixels.filter(p => p.isLiked).map(pixel => (
                <Card key={pixel.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getRarityColor(pixel.rarity)}>
                        {pixel.rarity}
                      </Badge>
                      <Badge className="bg-red-500">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Curtido
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">
                      Pixel ({pixel.x}, {pixel.y})
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pixel.region} • €{pixel.price}
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => handleBuyPixel(pixel)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leilões */}
          <TabsContent value="auctions">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pixels.filter(p => p.isAuction).map(pixel => (
                <Card key={pixel.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <div 
                      className="h-32 sm:h-40 flex items-center justify-center text-4xl sm:text-6xl"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                      <Timer className="h-3 w-3 mr-1" />
                      Leilão
                    </Badge>
                    
                    {pixel.auctionEndTime && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {formatTimeLeft(pixel.auctionEndTime)}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold">Pixel ({pixel.x}, {pixel.y})</h3>
                      <p className="text-sm text-muted-foreground">{pixel.region}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Lance Atual:</span>
                        <span className="font-bold text-primary">€{pixel.currentBid || pixel.price}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{pixel.bidCount || 0} lances</span>
                        <span>{pixel.views} visualizações</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBidPixel(pixel);
                      }}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500"
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Licitar €{(pixel.currentBid || pixel.price) + 10}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Minhas Vendas */}
          <TabsContent value="sales" className="space-y-6">
            {/* Estatísticas de Vendas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="text-center p-4 sm:p-6">
                <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">€1,247</div>
                <div className="text-sm text-muted-foreground">Total Vendido</div>
              </Card>
              
              <Card className="text-center p-4 sm:p-6">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-500">€89</div>
                <div className="text-sm text-muted-foreground">Comissões Pagas</div>
              </Card>
              
              <Card className="text-center p-4 sm:p-6">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-500">4.8</div>
                <div className="text-sm text-muted-foreground">Rating Vendedor</div>
              </Card>
              
              <Card className="text-center p-4 sm:p-6">
                <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-500">23</div>
                <div className="text-sm text-muted-foreground">Pixels à Venda</div>
              </Card>
            </div>

            {/* Pixels à Venda */}
            <div className="space-y-4 sm:space-y-6">
              {sales.map(sale => (
                <Card key={sale.id} className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      {/* Informações do Pixel */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold"
                            style={{ backgroundColor: sale.pixel.color }}
                          >
                            🎨
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="text-lg sm:text-xl font-semibold">
                                {sale.pixel.title || `Pixel (${sale.pixel.x}, ${sale.pixel.y})`}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge className={getRarityColor(sale.pixel.rarity)}>
                                  {sale.pixel.rarity}
                                </Badge>
                                {sale.isPromoted && (
                                  <Badge className="bg-yellow-500 animate-pulse">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Promovido
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-sm text-muted-foreground">
                                {sale.pixel.region} • Preço: €{sale.pixel.price}
                              </span>
                              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {sale.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {sale.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bell className="h-3 w-3" />
                                  {sale.followers}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ações de Gestão */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button variant="outline" className="flex-1 h-10 sm:h-12">
                            <Settings className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 h-10 sm:h-12"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromotePixel(sale.id);
                            }}
                            disabled={sale.isPromoted}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {sale.isPromoted ? 'Promovido' : 'Promover (50₡)'}
                          </Button>
                          <Button variant="outline" className="flex-1 h-10 sm:h-12">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Estatísticas
                          </Button>
                        </div>
                      </div>
                      
                      {/* Ofertas */}
                      {sale.offers.length > 0 && (
                        <div className="lg:w-80 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Ofertas ({sale.offers.length})</h4>
                            <Badge variant="outline">
                              {sale.offers.filter(o => o.status === 'pending').length} pendentes
                            </Badge>
                          </div>
                          
                          <ScrollArea className="h-48 lg:h-64">
                            <div className="space-y-3">
                              {sale.offers.map(offer => (
                                <Card key={offer.id} className={cn(
                                  "p-3 sm:p-4",
                                  offer.status === 'accepted' && "bg-green-500/10 border-green-500/30",
                                  offer.status === 'rejected' && "bg-red-500/10 border-red-500/30"
                                )}>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={offer.buyerAvatar} />
                                        <AvatarFallback>{offer.buyerName[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{offer.buyerName}</div>
                                        <div className="text-xs text-muted-foreground">{offer.timestamp}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-bold text-primary">€{offer.amount}</div>
                                        <Badge variant={
                                          offer.status === 'pending' ? 'secondary' :
                                          offer.status === 'accepted' ? 'default' : 'destructive'
                                        } className="text-xs">
                                          {offer.status === 'pending' ? 'Pendente' :
                                           offer.status === 'accepted' ? 'Aceite' : 'Rejeitada'}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {offer.message && (
                                      <p className="text-sm text-muted-foreground italic">
                                        "{offer.message}"
                                      </p>
                                    )}
                                    
                                    {offer.status === 'pending' && (
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <Button 
                                          size="sm" 
                                          className="flex-1 bg-green-600 hover:bg-green-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAcceptOffer(sale.id, offer.id);
                                          }}
                                        >
                                          <Check className="h-4 w-4 mr-2" />
                                          Aceitar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="flex-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRejectOffer(sale.id, offer.id);
                                          }}
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          Rejeitar
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes do Pixel */}
      <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
        <DialogContent className="max-w-md sm:max-w-2xl h-[90vh] p-0 gap-0">
          <DialogHeader className="p-4 sm:p-6 border-b bg-gradient-to-br from-primary/5 to-accent/5">
            <DialogTitle className="flex items-center text-xl sm:text-2xl font-headline">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              {selectedPixel?.title || `Pixel (${selectedPixel?.x}, ${selectedPixel?.y})`}
            </DialogTitle>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{selectedPixel?.region}</span>
                {selectedPixel?.gpsCoords && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-xs">
                      {selectedPixel.gpsCoords.lat.toFixed(4)}, {selectedPixel.gpsCoords.lon.toFixed(4)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedPixel && (
                  <Badge className={getRarityColor(selectedPixel.rarity)}>
                    {selectedPixel.rarity}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Preview do Pixel */}
              <Card className="overflow-hidden shadow-lg">
                <div 
                  className="w-full h-40 sm:h-48 flex items-center justify-center text-5xl sm:text-6xl font-bold"
                  style={{ backgroundColor: selectedPixel?.color || '#D4A757' }}
                >
                  🎨
                </div>
                
                {selectedPixel?.description && (
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
                      {selectedPixel.description}
                    </p>
                  </CardContent>
                )}
              </Card>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <Card className="text-center p-3 sm:p-4">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">{selectedPixel?.views.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Views</div>
                </Card>
                
                <Card className="text-center p-3 sm:p-4">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">{selectedPixel?.likes.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Likes</div>
                </Card>
                
                <Card className="text-center p-3 sm:p-4">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">{selectedPixel?.comments.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Comentários</div>
                </Card>
                
                <Card className="text-center p-3 sm:p-4">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">{selectedPixel?.followers.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Seguidores</div>
                </Card>
              </div>

              {/* Ações */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleLikePixel(selectedPixel?.id || '')}
                    className="h-12 sm:h-14"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${selectedPixel?.isLiked ? 'fill-current text-red-500' : ''}`} />
                    {selectedPixel?.isLiked ? 'Curtido' : 'Curtir'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleFollowPixel(selectedPixel?.id || '')}
                    className="h-12 sm:h-14"
                  >
                    <Bell className={`h-4 w-4 mr-2 ${selectedPixel?.isFollowing ? 'fill-current text-blue-500' : ''}`} />
                    {selectedPixel?.isFollowing ? 'A Seguir' : 'Seguir'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (selectedPixel?.gpsCoords) {
                        const { lat, lon } = selectedPixel.gpsCoords;
                        window.open(`https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`, '_blank');
                      }
                    }}
                    className="h-12 sm:h-14"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`Pixel (${selectedPixel?.x}, ${selectedPixel?.y}) - ${window.location.href}`);
                      toast({
                        title: "Link Copiado!",
                        description: "Link do pixel copiado para a área de transferência.",
                      });
                    }}
                    className="h-12 sm:h-14"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar
                  </Button>
                </div>
              </div>

              {/* Botões de Compra/Oferta */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        €{selectedPixel?.price}
                      </span>
                    </div>
                    
                    {selectedPixel?.specialPrice && (
                      <div className="flex items-center justify-center gap-2">
                        <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                        <span className="text-base sm:text-lg font-medium text-accent">
                          ou {selectedPixel.specialPrice} créditos especiais
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Button 
                      onClick={() => {
                        setShowPixelModal(false);
                        setShowBuyModal(true);
                      }}
                      className="h-12 sm:h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-base sm:text-lg font-semibold"
                    >
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Comprar
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowPixelModal(false);
                        setShowOfferModal(true);
                      }}
                      className="h-12 sm:h-14 text-base sm:text-lg font-semibold"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Fazer Oferta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal de Compra */}
      <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
              Confirmar Compra
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedPixel && (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    {selectedPixel.title || `Pixel (${selectedPixel.x}, ${selectedPixel.y})`}
                  </h3>
                  <p className="text-muted-foreground">{selectedPixel.region}</p>
                </div>
                
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between">
                    <span>Preço do Pixel:</span>
                    <span className="font-bold">€{selectedPixel.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Transação (5%):</span>
                    <span>€{(selectedPixel.price * 0.05).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">€{(selectedPixel.price * 1.05).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Seus Créditos:</span>
                    <span className="font-mono">{credits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Após Compra:</span>
                    <span className="font-mono">{(credits - selectedPixel.price * 1.05).toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowBuyModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={confirmPurchase} className="flex-1">
              Confirmar Compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Licitação */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Gavel className="h-5 w-5 mr-2 text-orange-500" />
              Fazer Lance
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedPixel && (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    Pixel ({selectedPixel.x}, {selectedPixel.y})
                  </h3>
                  <p className="text-muted-foreground">{selectedPixel.region}</p>
                  {selectedPixel.auctionEndTime && (
                    <Badge className="bg-red-500 animate-pulse">
                      Termina em {formatTimeLeft(selectedPixel.auctionEndTime)}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Lance Atual:</span>
                    <span className="font-bold text-primary">€{selectedPixel.currentBid || selectedPixel.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lance Mínimo:</span>
                    <span className="font-bold">€{(selectedPixel.currentBid || selectedPixel.price) + 10}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bid-amount">Seu Lance (€)</Label>
                  <Input
                    id="bid-amount"
                    type="number"
                    placeholder={`Mínimo: ${(selectedPixel.currentBid || selectedPixel.price) + 10}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={(selectedPixel.currentBid || selectedPixel.price) + 10}
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowBidModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={placeBid} className="flex-1">
              <Gavel className="h-4 w-4 mr-2" />
              Licitar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Oferta */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-blue-500" />
              Fazer Oferta
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedPixel && (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    {selectedPixel.title || `Pixel (${selectedPixel.x}, ${selectedPixel.y})`}
                  </h3>
                  <p className="text-muted-foreground">{selectedPixel.region}</p>
                  <div className="text-lg font-bold text-primary">Preço: €{selectedPixel.price}</div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer-amount">Valor da Oferta (€)</Label>
                    <Input
                      id="offer-amount"
                      type="number"
                      placeholder="Valor da sua oferta"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      max={selectedPixel.price - 1}
                    />
                    <p className="text-xs text-muted-foreground">
                      A oferta deve ser inferior ao preço de venda (€{selectedPixel.price})
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="offer-message">Mensagem (opcional)</Label>
                    <Input
                      id="offer-message"
                      placeholder="Adicione uma mensagem ao vendedor..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowOfferModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={makeOffer} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Enviar Oferta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}