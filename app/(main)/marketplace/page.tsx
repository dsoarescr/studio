'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Search, Filter, Star, Heart, Eye, MessageSquare, 
  MapPin, Clock, TrendingUp, Flame, Crown, Gem, Sparkles, 
  Coins, Gift, Gavel, Timer, Users, Share2, ExternalLink,
  Grid3X3, List, SortAsc, ChevronDown, ChevronUp, Send,
  Target, Award, BarChart3, Activity, Calendar, Globe,
  Zap, CheckCircle, AlertTriangle, Info, X, Plus, Minus,
  ThumbsUp, UserPlus, Bell, BellOff, Navigation, Bookmark,
  BookmarkCheck, TrendingDown, DollarSign, Percent
} from "lucide-react";
import { cn } from '@/lib/utils';

interface MarketplacePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  title: string;
  description: string;
  price: number;
  specialCreditsPrice?: number;
  seller: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
    isPremium: boolean;
    rating: number;
    totalSales: number;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  color: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  isLiked: boolean;
  isFollowing: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isAuction: boolean;
  auctionEndTime?: number;
  currentBid?: number;
  bidCount?: number;
  tags: string[];
  features: string[];
  listedDate: string;
  priceHistory: Array<{ date: string; price: number }>;
  gpsCoords?: { lat: number; lon: number };
}

interface UserPixelForSale {
  id: string;
  x: number;
  y: number;
  region: string;
  title: string;
  price: number;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  offers: Array<{
    id: string;
    buyer: string;
    amount: number;
    message?: string;
    timestamp: string;
  }>;
  listedDate: string;
  isPromoted: boolean;
}

const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    title: 'Vista Premium do Tejo',
    description: 'Pixel exclusivo com vista para o Rio Tejo no coração de Lisboa',
    price: 450,
    specialCreditsPrice: 180,
    seller: {
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      level: 25,
      verified: true,
      isPremium: true,
      rating: 4.9,
      totalSales: 156
    },
    rarity: 'Lendário',
    color: '#D4A757',
    imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa+Premium',
    views: 2340,
    likes: 189,
    comments: 45,
    followers: 67,
    isLiked: false,
    isFollowing: false,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    isAuction: true,
    auctionEndTime: Date.now() + 3600000, // 1 hora
    currentBid: 420,
    bidCount: 23,
    tags: ['vista', 'rio', 'premium', 'lisboa'],
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade'],
    listedDate: '2024-03-15',
    priceHistory: [
      { date: '2024-03-10', price: 300 },
      { date: '2024-03-12', price: 350 },
      { date: '2024-03-15', price: 450 }
    ],
    gpsCoords: { lat: 38.7223, lon: -9.1393 }
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    title: 'Arte Ribeirinha',
    description: 'Pixel artístico na zona ribeirinha do Porto',
    price: 280,
    seller: {
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      level: 18,
      verified: false,
      isPremium: false,
      rating: 4.6,
      totalSales: 89
    },
    rarity: 'Épico',
    color: '#7DF9FF',
    imageUrl: 'https://placehold.co/200x200/7DF9FF/000000?text=Porto+Art',
    views: 1560,
    likes: 134,
    comments: 28,
    followers: 45,
    isLiked: true,
    isFollowing: true,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    isAuction: false,
    tags: ['arte', 'ribeira', 'porto'],
    features: ['Zona Ribeirinha', 'Património UNESCO'],
    listedDate: '2024-03-16',
    priceHistory: [
      { date: '2024-03-16', price: 280 }
    ],
    gpsCoords: { lat: 41.1579, lon: -8.6291 }
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    title: 'Universidade Histórica',
    description: 'Pixel na zona universitária histórica de Coimbra',
    price: 320,
    specialCreditsPrice: 120,
    seller: {
      name: 'StudentArt',
      avatar: 'https://placehold.co/40x40.png',
      level: 12,
      verified: false,
      isPremium: true,
      rating: 4.3,
      totalSales: 34
    },
    rarity: 'Raro',
    color: '#9C27B0',
    imageUrl: 'https://placehold.co/200x200/9C27B0/FFFFFF?text=Coimbra',
    views: 890,
    likes: 67,
    comments: 15,
    followers: 23,
    isLiked: false,
    isFollowing: false,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    isAuction: false,
    tags: ['universidade', 'história', 'coimbra'],
    features: ['Zona Universitária', 'Património Mundial'],
    listedDate: '2024-03-14',
    priceHistory: [
      { date: '2024-03-14', price: 320 }
    ],
    gpsCoords: { lat: 40.2033, lon: -8.4103 }
  }
];

const mockUserPixelsForSale: UserPixelForSale[] = [
  {
    id: 'user1',
    x: 400,
    y: 300,
    region: 'Braga',
    title: 'Meu Pixel em Braga',
    price: 150,
    views: 234,
    likes: 23,
    comments: 8,
    followers: 12,
    offers: [
      {
        id: 'offer1',
        buyer: 'PixelHunter',
        amount: 140,
        message: 'Aceita 140€? É um bom negócio!',
        timestamp: '2024-03-16T10:30:00Z'
      },
      {
        id: 'offer2',
        buyer: 'ArtCollector',
        amount: 135,
        timestamp: '2024-03-16T09:15:00Z'
      }
    ],
    listedDate: '2024-03-15',
    isPromoted: false
  },
  {
    id: 'user2',
    x: 500,
    y: 400,
    region: 'Faro',
    title: 'Pixel do Algarve',
    price: 200,
    views: 456,
    likes: 45,
    comments: 12,
    followers: 18,
    offers: [],
    listedDate: '2024-03-14',
    isPromoted: true
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<MarketplacePixel[]>(mockMarketplacePixels);
  const [userPixelsForSale, setUserPixelsForSale] = useState<UserPixelForSale[]>(mockUserPixelsForSale);
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { credits, specialCredits, addCredits, addXp, removeCredits, removeSpecialCredits } = useUserStore();
  const { toast } = useToast();

  // Filtrar pixels
  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRegion = selectedRegion === 'all' || pixel.region === selectedRegion;
    const matchesRarity = selectedRarity === 'all' || pixel.rarity === selectedRarity;
    const matchesPrice = pixel.price >= priceRange[0] && pixel.price <= priceRange[1];
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'following' && pixel.isFollowing) ||
      (activeTab === 'liked' && pixel.isLiked) ||
      (activeTab === 'auctions' && pixel.isAuction);
    
    return matchesSearch && matchesRegion && matchesRarity && matchesPrice && matchesTab;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.views - a.views;
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'popularity':
        return (b.likes + b.views) - (a.likes + a.views);
      case 'newest':
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      default:
        return 0;
    }
  });

  const handlePixelClick = (pixel: MarketplacePixel) => {
    // Incrementar views
    setPixels(prev => prev.map(p => 
      p.id === pixel.id ? { ...p, views: p.views + 1 } : p
    ));
    
    setSelectedPixel(pixel);
  };

  const handleLike = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isLiked: !pixel.isLiked,
            likes: pixel.isLiked ? pixel.likes - 1 : pixel.likes + 1
          }
        : pixel
    ));
    
    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel && !pixel.isLiked) {
      addXp(5);
      addCredits(2);
      toast({
        title: "❤️ Pixel Curtido!",
        description: "Recebeu 5 XP + 2 créditos!",
      });
    }
  };

  const handleFollow = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isFollowing: !pixel.isFollowing,
            followers: pixel.isFollowing ? pixel.followers - 1 : pixel.followers + 1
          }
        : pixel
    ));
    
    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel && !pixel.isFollowing) {
      addXp(10);
      addCredits(5);
      toast({
        title: "🔔 A Seguir Pixel!",
        description: "Receberá notificações sobre este pixel. +10 XP +5 créditos!",
      });
    } else {
      toast({
        title: "🔕 Deixou de Seguir",
        description: "Não receberá mais notificações sobre este pixel.",
      });
    }
  };

  const handlePurchase = () => {
    if (!selectedPixel) return;
    
    const totalPrice = selectedPixel.price;
    const commission = selectedPixel.seller.isPremium ? totalPrice * 0.05 : totalPrice * 0.07;
    const sellerReceives = totalPrice - commission;
    
    if (credits < totalPrice) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${totalPrice - credits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }
    
    removeCredits(totalPrice);
    addXp(100);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    // Remover pixel do marketplace
    setPixels(prev => prev.filter(p => p.id !== selectedPixel.id));
    
    toast({
      title: "🎉 Pixel Comprado!",
      description: `Comprou "${selectedPixel.title}" por €${totalPrice}. +100 XP!`,
    });
    
    setSelectedPixel(null);
    setShowPurchaseModal(false);
  };

  const handleBid = () => {
    if (!selectedPixel || !bidAmount) return;
    
    const bid = parseFloat(bidAmount);
    const minBid = (selectedPixel.currentBid || selectedPixel.price) + 10;
    
    if (bid < minBid) {
      toast({
        title: "Lance Inválido",
        description: `Lance mínimo: €${minBid}`,
        variant: "destructive"
      });
      return;
    }
    
    if (credits < bid) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${bid - credits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }
    
    // Atualizar leilão
    setPixels(prev => prev.map(p => 
      p.id === selectedPixel.id 
        ? { ...p, currentBid: bid, bidCount: (p.bidCount || 0) + 1 }
        : p
    ));
    
    addXp(25);
    addCredits(5);
    
    toast({
      title: "🔨 Lance Colocado!",
      description: `Lance de €${bid} registado. +25 XP +5 créditos!`,
    });
    
    setBidAmount('');
    setShowBidModal(false);
  };

  const handleOffer = () => {
    if (!selectedPixel || !offerAmount) return;
    
    const offer = parseFloat(offerAmount);
    
    if (offer >= selectedPixel.price) {
      toast({
        title: "Oferta Muito Alta",
        description: "A oferta deve ser inferior ao preço de venda.",
        variant: "destructive"
      });
      return;
    }
    
    if (credits < offer) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${offer - credits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }
    
    addXp(15);
    addCredits(3);
    
    toast({
      title: "💌 Oferta Enviada!",
      description: `Oferta de €${offer} enviada ao vendedor. +15 XP +3 créditos!`,
    });
    
    setOfferAmount('');
    setOfferMessage('');
    setShowOfferModal(false);
  };

  const handleViewOnMap = (pixel: MarketplacePixel) => {
    // Simular navegação para o mapa
    window.open(`/?pixel=${pixel.x},${pixel.y}`, '_blank');
    
    toast({
      title: "🗺️ Abrindo Mapa",
      description: `Navegando para pixel (${pixel.x}, ${pixel.y})`,
    });
  };

  const handleViewOnGoogleMaps = (pixel: MarketplacePixel) => {
    if (pixel.gpsCoords) {
      const { lat, lon } = pixel.gpsCoords;
      const url = `https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`;
      window.open(url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "🌍 Google Maps",
        description: "Abrindo localização real do pixel.",
      });
    }
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

  const formatTimeLeft = (endTime: number) => {
    const timeLeft = Math.max(0, endTime - Date.now());
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'following': return pixels.filter(p => p.isFollowing).length;
      case 'liked': return pixels.filter(p => p.isLiked).length;
      case 'auctions': return pixels.filter(p => p.isAuction).length;
      case 'sales': return userPixelsForSale.length;
      default: return pixels.length;
    }
  };

  const handlePromotePixel = (pixelId: string) => {
    setUserPixelsForSale(prev => prev.map(p => 
      p.id === pixelId ? { ...p, isPromoted: !p.isPromoted } : p
    ));
    
    const pixel = userPixelsForSale.find(p => p.id === pixelId);
    const cost = 50;
    
    if (pixel?.isPromoted) {
      addCredits(cost);
      toast({
        title: "Promoção Cancelada",
        description: `Recebeu ${cost} créditos de volta.`,
      });
    } else {
      if (credits < cost) {
        toast({
          title: "Créditos Insuficientes",
          description: `Precisa de ${cost} créditos para promover.`,
          variant: "destructive"
        });
        return;
      }
      
      removeCredits(cost);
      toast({
        title: "Pixel Promovido!",
        description: `Pixel em destaque por 24h. Custo: ${cost} créditos.`,
      });
    }
  };

  const handleAcceptOffer = (pixelId: string, offerId: string) => {
    const pixel = userPixelsForSale.find(p => p.id === pixelId);
    const offer = pixel?.offers.find(o => o.id === offerId);
    
    if (offer) {
      const commission = 0.07; // 7% para utilizadores normais
      const sellerReceives = offer.amount * (1 - commission);
      
      addCredits(Math.floor(sellerReceives));
      addXp(50);
      setShowConfetti(true);
      setPlaySuccessSound(true);
      
      // Remover pixel das vendas
      setUserPixelsForSale(prev => prev.filter(p => p.id !== pixelId));
      
      toast({
        title: "🎉 Oferta Aceite!",
        description: `Vendeu por €${offer.amount}. Recebeu €${sellerReceives.toFixed(2)} (após comissão). +50 XP!`,
      });
    }
  };

  const handleRejectOffer = (pixelId: string, offerId: string) => {
    setUserPixelsForSale(prev => prev.map(p => 
      p.id === pixelId 
        ? { ...p, offers: p.offers.filter(o => o.id !== offerId) }
        : p
    ));
    
    toast({
      title: "Oferta Rejeitada",
      description: "A oferta foi rejeitada.",
    });
  };

  // Timer para leilões
  useEffect(() => {
    const interval = setInterval(() => {
      setPixels(prev => prev.map(pixel => {
        if (pixel.isAuction && pixel.auctionEndTime) {
          const timeLeft = pixel.auctionEndTime - Date.now();
          if (timeLeft <= 0) {
            // Leilão terminou
            return { ...pixel, isAuction: false };
          }
        }
        return pixel;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <ShoppingCart className="h-8 w-8 mr-3 animate-glow" />
                  Marketplace de Pixels
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Compre e venda pixels únicos com outros utilizadores da comunidade
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-muted-foreground font-code">
                    {pixels.length} pixels disponíveis
                  </span>
                </div>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="all" className="font-headline">
              <ShoppingCart className="h-4 w-4 mr-2"/>
              Todos ({getTabCount('all')})
            </TabsTrigger>
            <TabsTrigger value="following" className="font-headline">
              <Bell className="h-4 w-4 mr-2"/>
              A Seguir ({getTabCount('following')})
            </TabsTrigger>
            <TabsTrigger value="liked" className="font-headline">
              <Heart className="h-4 w-4 mr-2"/>
              Curtidos ({getTabCount('liked')})
            </TabsTrigger>
            <TabsTrigger value="auctions" className="font-headline">
              <Gavel className="h-4 w-4 mr-2"/>
              Leilões ({getTabCount('auctions')})
            </TabsTrigger>
            <TabsTrigger value="sales" className="font-headline">
              <BarChart3 className="h-4 w-4 mr-2"/>
              Minhas Vendas ({getTabCount('sales')})
            </TabsTrigger>
          </TabsList>

          {/* Filtros e Pesquisa */}
          <Card className="card-hover-glow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Pesquisa */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar pixels, regiões, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-4">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Regiões</SelectItem>
                      <SelectItem value="Lisboa">Lisboa</SelectItem>
                      <SelectItem value="Porto">Porto</SelectItem>
                      <SelectItem value="Coimbra">Coimbra</SelectItem>
                      <SelectItem value="Braga">Braga</SelectItem>
                      <SelectItem value="Faro">Faro</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Raridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Comum">Comum</SelectItem>
                      <SelectItem value="Incomum">Incomum</SelectItem>
                      <SelectItem value="Raro">Raro</SelectItem>
                      <SelectItem value="Épico">Épico</SelectItem>
                      <SelectItem value="Lendário">Lendário</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Em Destaque</SelectItem>
                      <SelectItem value="price_low">Preço: Baixo → Alto</SelectItem>
                      <SelectItem value="price_high">Preço: Alto → Baixo</SelectItem>
                      <SelectItem value="popularity">Popularidade</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filtros Avançados
                  </Button>
                </div>

                {/* Filtros Avançados */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t"
                  >
                    <div className="space-y-2">
                      <Label>Faixa de Preço: €{priceRange[0]} - €{priceRange[1]}</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conteúdo das Tabs */}
          <TabsContent value="all" className="space-y-6">
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {filteredPixels.map((pixel, index) => (
                  <motion.div
                    key={pixel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] card-hover-glow"
                      onClick={() => handlePixelClick(pixel)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative">
                            <div 
                              className="w-24 h-24 rounded-lg border-2 border-primary/30 flex items-center justify-center text-2xl font-bold shadow-lg"
                              style={{ backgroundColor: pixel.color }}
                            >
                              🎨
                            </div>
                            
                            {pixel.isFeatured && (
                              <Badge className="absolute -top-2 -right-2 bg-yellow-500 animate-pulse">
                                <Star className="h-3 w-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{pixel.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ({pixel.x}, {pixel.y}) • {pixel.region}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  €{pixel.price}
                                </div>
                                {pixel.specialCreditsPrice && (
                                  <div className="text-sm text-accent">
                                    ou {pixel.specialCreditsPrice} especiais
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getRarityColor(pixel.rarity)}>
                                {pixel.rarity}
                              </Badge>
                              {pixel.isTrending && (
                                <Badge className="bg-orange-500">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Em Alta
                                </Badge>
                              )}
                              {pixel.isNew && (
                                <Badge className="bg-green-500">Novo</Badge>
                              )}
                              {pixel.isAuction && (
                                <Badge className="bg-red-500 animate-pulse">
                                  <Gavel className="h-3 w-3 mr-1" />
                                  Leilão
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {pixel.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {pixel.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {pixel.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {pixel.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bell className="h-4 w-4" />
                                  {pixel.followers}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(pixel.id);
                                  }}
                                  className={pixel.isLiked ? 'text-red-500' : ''}
                                >
                                  <Heart className={`h-4 w-4 ${pixel.isLiked ? 'fill-current' : ''}`} />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollow(pixel.id);
                                  }}
                                  className={pixel.isFollowing ? 'text-blue-500' : ''}
                                >
                                  <Bell className={`h-4 w-4 ${pixel.isFollowing ? 'fill-current' : ''}`} />
                                </Button>
                                
                                {pixel.isAuction ? (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPixel(pixel);
                                      setShowBidModal(true);
                                    }}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    <Gavel className="h-4 w-4 mr-2" />
                                    Licitar
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPixel(pixel);
                                      setShowPurchaseModal(true);
                                    }}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Comprar
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {pixel.isAuction && pixel.auctionEndTime && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-red-500 font-medium">
                                  Lance atual: €{pixel.currentBid}
                                </span>
                                <span className="text-muted-foreground">
                                  <Timer className="h-4 w-4 inline mr-1" />
                                  {formatTimeLeft(pixel.auctionEndTime)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredPixels.map((pixel, index) => (
                  <motion.div
                    key={pixel.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 card-hover-glow"
                      onClick={() => handlePixelClick(pixel)}
                    >
                      <div className="relative">
                        <div 
                          className="aspect-square w-full flex items-center justify-center text-xl font-bold border-b-2 border-primary/20"
                          style={{ backgroundColor: pixel.color }}
                        >
                          🎨
                        </div>
                        
                        {pixel.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-xs">
                            <Star className="h-3 w-3" />
                          </Badge>
                        )}
                        
                        {pixel.isAuction && (
                          <Badge className="absolute top-2 right-2 bg-red-500 animate-pulse text-xs">
                            <Gavel className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-3 space-y-2">
                        <div className="text-center">
                          <h4 className="font-medium text-sm truncate">{pixel.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            ({pixel.x}, {pixel.y})
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            €{pixel.isAuction ? pixel.currentBid : pixel.price}
                          </div>
                          <Badge className={cn("text-xs", getRarityColor(pixel.rarity))}>
                            {pixel.rarity}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.likes}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-2">
                          {pixel.isAuction ? (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPixel(pixel);
                                setShowBidModal(true);
                              }}
                              className="flex-1 text-xs h-8 bg-red-500 hover:bg-red-600"
                            <Button 
                              size="sm" 
                              className="w-full text-xs h-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBidOnPixel(pixel);
                              }}
                            >
                              <Gavel className="h-3 w-3 mr-1" />
                              Licitar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="w-full text-xs h-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyPixel(pixel);
                              }}
                            >
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPixel(pixel);
                                setShowPurchaseModal(true);
                              }}
                              className="flex-1 text-xs h-8"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Comprar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs h-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMakeOffer(pixel);
                            }}
                          >
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab A Seguir */}
          <TabsContent value="following" className="space-y-4">
            <div className="text-center py-8">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pixels que Está a Seguir</h3>
              <p className="text-muted-foreground">
                {filteredPixels.length > 0 
                  ? `Está a seguir ${filteredPixels.length} pixels`
                  : 'Ainda não está a seguir nenhum pixel. Comece a seguir pixels para receber notificações!'
                }
              </p>
            </div>
            
            {filteredPixels.length > 0 && (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-4"
              }>
                {/* Mesmo layout dos pixels, mas apenas os que está a seguir */}
              </div>
            )}
          </TabsContent>

          {/* Tab Curtidos */}
          <TabsContent value="liked" className="space-y-4">
            <div className="text-center py-8">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pixels que Curtiu</h3>
              <p className="text-muted-foreground">
                {filteredPixels.length > 0 
                  ? `Curtiu ${filteredPixels.length} pixels`
                  : 'Ainda não curtiu nenhum pixel. Comece a curtir pixels que gosta!'
                }
              </p>
            </div>
          </TabsContent>

          {/* Tab Leilões */}
          <TabsContent value="auctions" className="space-y-4">
            <div className="text-center py-8">
              <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Leilões Ativos</h3>
              <p className="text-muted-foreground">
                {filteredPixels.length > 0 
                  ? `${filteredPixels.length} leilões ativos`
                  : 'Não há leilões ativos no momento.'
                }
              </p>
            </div>
          </TabsContent>

          {/* Tab Minhas Vendas */}
          <TabsContent value="sales" className="space-y-6">
            {/* Dashboard de Vendas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">€{userPixelsForSale.reduce((sum, p) => sum + p.price, 0)}</div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">{userPixelsForSale.reduce((sum, p) => sum + p.views, 0)}</div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-500">{userPixelsForSale.reduce((sum, p) => sum + p.likes, 0)}</div>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-500">{userPixelsForSale.reduce((sum, p) => sum + p.offers.length, 0)}</div>
                  <p className="text-sm text-muted-foreground">Ofertas Recebidas</p>
                </CardContent>
              </Card>
            </div>

            {/* Pixels à Venda */}
            <div className="space-y-4">
              {userPixelsForSale.map(pixel => (
                <Card key={pixel.id} className="card-hover-glow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div 
                        className="w-20 h-20 rounded-lg border-2 border-primary/30 flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: '#D4A757' }}
                      >
                        🎨
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{pixel.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              ({pixel.x}, {pixel.y}) • {pixel.region}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">€{pixel.price}</div>
                            {pixel.isPromoted && (
                              <Badge className="bg-yellow-500 text-xs">Promovido</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-500">{pixel.views}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-500">{pixel.likes}</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-500">{pixel.comments}</div>
                            <div className="text-xs text-muted-foreground">Comentários</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-500">{pixel.followers}</div>
                            <div className="text-xs text-muted-foreground">Seguidores</div>
                          </div>
                        </div>
                        
                        {pixel.offers.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Ofertas Recebidas ({pixel.offers.length})</h4>
                            <div className="space-y-2">
                              {pixel.offers.map(offer => (
                                <div key={offer.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <div>
                                    <div className="font-medium text-sm">{offer.buyer}</div>
                                    <div className="text-xs text-muted-foreground">
                                      €{offer.amount} • {new Date(offer.timestamp).toLocaleDateString('pt-PT')}
                                    </div>
                                    {offer.message && (
                                      <div className="text-xs text-muted-foreground italic">
                                        "{offer.message}"
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAcceptOffer(pixel.id, offer.id)}
                                      className="text-xs h-8"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Aceitar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRejectOffer(pixel.id, offer.id)}
                                      className="text-xs h-8"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Rejeitar
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button 
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            size="sm" 
                            className="flex-1"
                            onClick={() => handlePromotePixel(pixel.id)}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {pixel.isPromoted ? 'Despromover' : 'Promover (50€)'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Pixel */}
        <Dialog open={!!selectedPixel} onOpenChange={() => setSelectedPixel(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            {selectedPixel && (
              <>
                <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                  <DialogTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {selectedPixel.title}
                    </span>
                    <Badge className={getRarityColor(selectedPixel.rarity)}>
                      {selectedPixel.rarity}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[70vh]">
                  <div className="p-6 space-y-6">
                    {/* Imagem e Info Básica */}
                    <div className="flex gap-6">
                      <div 
                        className="w-32 h-32 rounded-lg border-2 border-primary/30 flex items-center justify-center text-4xl font-bold shadow-lg"
                        style={{ backgroundColor: selectedPixel.color }}
                      >
                        🎨
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold">{selectedPixel.title}</h2>
                          <p className="text-muted-foreground">
                            Coordenadas: ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{selectedPixel.views}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{selectedPixel.likes}</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{selectedPixel.comments}</div>
                            <div className="text-xs text-muted-foreground">Comentários</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">{selectedPixel.followers}</div>
                            <div className="text-xs text-muted-foreground">Seguidores</div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{selectedPixel.description}</p>
                      </div>
                    </div>

                    {/* Preço e Ações */}
                    <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="text-3xl font-bold text-primary">
                              €{selectedPixel.isAuction ? selectedPixel.currentBid : selectedPixel.price}
                            </div>
                            {selectedPixel.specialCreditsPrice && (
                              <div className="text-sm text-accent">
                                ou {selectedPixel.specialCreditsPrice} créditos especiais
                              </div>
                            <div className="flex-1 min-w-0 w-full">
                            {selectedPixel.isAuction && (
                              <div className="text-sm text-red-500 font-medium">
                                {selectedPixel.bidCount} lances • Termina em {selectedPixel.auctionEndTime ? formatTimeLeft(selectedPixel.auctionEndTime) : ''}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            className={selectedPixel.isLiked ? 'text-red-500 border-red-500/50' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${selectedPixel.isLiked ? 'fill-current' : ''}`} />
                            {selectedPixel.isLiked ? 'Curtido' : 'Curtir'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleFollow(selectedPixel.id)}
                            className={selectedPixel.isFollowing ? 'text-blue-500 border-blue-500/50' : ''}
                          >
                            <Bell className={`h-4 w-4 mr-2 ${selectedPixel.isFollowing ? 'fill-current' : ''}`} />
                            {selectedPixel.isFollowing ? 'A Seguir' : 'Seguir'}
                          </Button>
                          
                          <Button
                      <div className="flex flex-col gap-3">
                            onClick={() => handleViewOnMap(selectedPixel)}
                          >
                          className="w-full h-12"
                            Ver no Mapa
                          </Button>
                          
                          {selectedPixel.gpsCoords && (
                            <Button
                              variant="outline"
                              onClick={() => handleViewOnGoogleMaps(selectedPixel)}
                          className="w-full h-12"
                              <Globe className="h-4 w-4 mr-2" />
                              Google Maps
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {selectedPixel.isAuction ? (
                            <Button
                              onClick={() => setShowBidModal(true)}
                              className="flex-1 bg-red-500 hover:bg-red-600"
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-3">
                              Fazer Lance
                            </Button>
                          className="w-full h-12"
                            <>
                              <Button
                                onClick={() => setShowPurchaseModal(true)}
                                className="flex-1"
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Comprar Agora
                              </Button>
                              <Button
                            className="w-full h-12"
                                onClick={() => setShowOfferModal(true)}
                                className="flex-1"
                              >
                                <Target className="h-4 w-4 mr-2" />
                                Fazer Oferta
                                        <div className="flex gap-2 w-full sm:w-auto">
                            </>
                          )}
                                            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAcceptOffer(pixel.id, offer.id);
                                            }}
                      <div className="flex flex-col gap-3">
                    </Card>

                          className="w-full h-12"
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Vendedor</CardTitle>
                                            className="flex-1 sm:flex-none"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRejectOffer(pixel.id, offer.id);
                                            }}
                          className="w-full h-12"
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={selectedPixel.seller.avatar} />
                            <AvatarFallback>{selectedPixel.seller.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                          className="w-full h-12"
                              <span className="font-semibold">{selectedPixel.seller.name}</span>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              {selectedPixel.seller.isPremium && (
                                <Crown className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Nível {selectedPixel.seller.level}</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                {selectedPixel.seller.rating}
                              </span>
                              <span>{selectedPixel.seller.totalSales} vendas</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Características */}
                        <div className="flex flex-col gap-3">
                      <Card>
                        <CardHeader>
                              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500"
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedPixel.features.map(feature => (
                              <Badge key={feature} variant="outline">
                                {feature}
                              </Badge>
                              className="w-full h-12 bg-gradient-to-r from-primary to-accent"
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Tags */}
                    {selectedPixel.tags.length > 0 && (
                      <Card>
                        <CardHeader>
                            className="w-full h-12"
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedPixel.tags.map(tag => (
                              <Badge key={tag} variant="secondary">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Histórico de Preços */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Histórico de Preços</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPixel.priceHistory.map((entry, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{new Date(entry.date).toLocaleDateString('pt-PT')}</span>
                              <span className="font-medium">€{entry.price}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Compra */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="max-w-md">
            {selectedPixel && (
              <>
                <DialogHeader>
                  <DialogTitle>Confirmar Compra</DialogTitle>
                </DialogHeader>
                
                <div className="p-4 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{selectedPixel.title}</h3>
                    <p className="text-muted-foreground">
                      ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                    </p>
                  </div>
                  
                  <Card className="bg-muted/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Preço do Pixel:</span>
                          <span className="font-bold">€{selectedPixel.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxa de Transação:</span>
                          <span>€{(selectedPixel.price * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                          <span>Total:</span>
                          <span>€{(selectedPixel.price * 1.02).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <span className={credits >= selectedPixel.price ? 'text-green-500' : 'text-red-500'}>
                      €{credits}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handlePurchase} className="flex-1">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Confirmar Compra
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Lance */}
        <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
          <DialogContent className="max-w-md">
            {selectedPixel && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Gavel className="h-5 w-5 mr-2 text-red-500" />
                    Fazer Lance
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{selectedPixel.title}</h3>
                    <p className="text-muted-foreground">
                      Lance atual: €{selectedPixel.currentBid}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Seu Lance (mínimo: €{(selectedPixel.currentBid || selectedPixel.price) + 10})</Label>
                    <Input
                      type="number"
                      placeholder="Inserir valor do lance"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={(selectedPixel.currentBid || selectedPixel.price) + 10}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Seus Créditos:</span>
                    <span className="font-medium">€{credits}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowBidModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleBid} className="flex-1 bg-red-500 hover:bg-red-600">
                      <Gavel className="h-4 w-4 mr-2" />
                      Confirmar Lance
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Oferta */}
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="max-w-md">
            {selectedPixel && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Fazer Oferta
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{selectedPixel.title}</h3>
                    <p className="text-muted-foreground">
                      Preço pedido: €{selectedPixel.price}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Valor da Oferta</Label>
                    <Input
                      type="number"
                      placeholder="Inserir valor da oferta"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      max={selectedPixel.price - 1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mensagem (opcional)</Label>
                    <Textarea
                      placeholder="Adicione uma mensagem ao vendedor..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Seus Créditos:</span>
                    <span className="font-medium">€{credits}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowOfferModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleOffer} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Oferta
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}