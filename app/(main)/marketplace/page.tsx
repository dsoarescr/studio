'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Search, Filter, Star, Heart, Eye, MapPin, Coins, Gift, 
  Crown, Gem, Sparkles, TrendingUp, Clock, Users, MessageSquare, Share2,
  Gavel, Timer, Target, Award, Zap, Bell, BellOff, Send, ExternalLink,
  Grid3X3, List, SortAsc, Calendar, User, Navigation, Globe, Flame,
  ThumbsUp, Bookmark, AlertTriangle, CheckCircle, Info, X, Plus,
  ArrowRight, ChevronDown, ChevronUp, RefreshCw, Download, Upload
} from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    id: string;
    name: string;
    avatar: string;
    isPremium: boolean;
    rating: number;
    totalSales: number;
    level: number;
    verified: boolean;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  color: string;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  isLiked: boolean;
  isFollowing: boolean;
  isFeatured: boolean;
  isHot: boolean;
  isNew: boolean;
  listedDate: string;
  lastPriceChange?: {
    oldPrice: number;
    newPrice: number;
    date: string;
  };
  features: string[];
  tags: string[];
  gpsCoords?: { lat: number; lon: number };
  priceHistory: Array<{ price: number; date: string }>;
  auction?: {
    isAuction: boolean;
    currentBid: number;
    bidCount: number;
    timeLeft: number; // em segundos
    minBidIncrement: number;
  };
}

interface BidOffer {
  id: string;
  pixelId: string;
  bidder: {
    name: string;
    avatar: string;
    level: number;
  };
  amount: number;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

const mockPixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    title: 'Vista Premium do Tejo',
    description: 'Pixel exclusivo com vista panorâmica para o Rio Tejo no coração de Lisboa.',
    price: 450,
    specialCreditsPrice: 180,
    seller: {
      id: 'seller1',
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      isPremium: true,
      rating: 4.8,
      totalSales: 156,
      level: 25,
      verified: true
    },
    rarity: 'Lendário',
    color: '#D4A757',
    views: 2340,
    likes: 189,
    comments: 45,
    followers: 67,
    isLiked: false,
    isFollowing: false,
    isFeatured: true,
    isHot: true,
    isNew: false,
    listedDate: '2024-03-10',
    lastPriceChange: {
      oldPrice: 500,
      newPrice: 450,
      date: '2024-03-15'
    },
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade', 'Zona Turística'],
    tags: ['lisboa', 'tejo', 'premium', 'vista'],
    gpsCoords: { lat: 38.7223, lon: -9.1393 },
    priceHistory: [
      { price: 400, date: '2024-03-01' },
      { price: 500, date: '2024-03-10' },
      { price: 450, date: '2024-03-15' }
    ],
    auction: {
      isAuction: true,
      currentBid: 420,
      bidCount: 12,
      timeLeft: 3600,
      minBidIncrement: 10
    }
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    title: 'Arte Ribeirinha',
    description: 'Pixel artístico na zona histórica da Ribeira do Porto.',
    price: 280,
    seller: {
      id: 'seller2',
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      isPremium: false,
      rating: 4.2,
      totalSales: 89,
      level: 18,
      verified: false
    },
    rarity: 'Épico',
    color: '#7DF9FF',
    views: 1560,
    likes: 134,
    comments: 28,
    followers: 45,
    isLiked: true,
    isFollowing: true,
    isFeatured: false,
    isHot: false,
    isNew: true,
    listedDate: '2024-03-16',
    features: ['Património UNESCO', 'Zona Ribeirinha', 'Arte Urbana'],
    tags: ['porto', 'ribeira', 'arte', 'unesco'],
    gpsCoords: { lat: 41.1579, lon: -8.6291 },
    priceHistory: [
      { price: 250, date: '2024-03-16' },
      { price: 280, date: '2024-03-16' }
    ]
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    title: 'Universidade Histórica',
    description: 'Pixel na zona da Universidade de Coimbra, património mundial.',
    price: 320,
    specialCreditsPrice: 120,
    seller: {
      id: 'seller3',
      name: 'StudentCollector',
      avatar: 'https://placehold.co/40x40.png',
      isPremium: true,
      rating: 4.5,
      totalSales: 67,
      level: 15,
      verified: true
    },
    rarity: 'Raro',
    color: '#9C27B0',
    views: 890,
    likes: 78,
    comments: 19,
    followers: 23,
    isLiked: false,
    isFollowing: false,
    isFeatured: false,
    isHot: true,
    isNew: false,
    listedDate: '2024-03-12',
    features: ['Património Mundial', 'Zona Universitária', 'História'],
    tags: ['coimbra', 'universidade', 'historia', 'patrimonio'],
    gpsCoords: { lat: 40.2033, lon: -8.4103 },
    priceHistory: [
      { price: 300, date: '2024-03-12' },
      { price: 320, date: '2024-03-14' }
    ]
  }
];

const mockOffers: BidOffer[] = [
  {
    id: '1',
    pixelId: '1',
    bidder: {
      name: 'InvestorPro',
      avatar: 'https://placehold.co/40x40.png',
      level: 22
    },
    amount: 400,
    message: 'Interessado neste pixel para a minha coleção de Lisboa!',
    timestamp: '2024-03-16T10:30:00Z',
    status: 'pending'
  },
  {
    id: '2',
    pixelId: '2',
    bidder: {
      name: 'ArtLover',
      avatar: 'https://placehold.co/40x40.png',
      level: 16
    },
    amount: 250,
    timestamp: '2024-03-16T09:15:00Z',
    status: 'rejected'
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<MarketplacePixel[]>(mockPixels);
  const [filteredPixels, setFilteredPixels] = useState<MarketplacePixel[]>(mockPixels);
  const [offers, setOffers] = useState<BidOffer[]>(mockOffers);
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  
  // Estados de compra
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'special'>('credits');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados de feedback
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  
  const { credits, specialCredits, addCredits, removeCredits, addSpecialCredits, removeSpecialCredits, addXp, isPremium } = useUserStore();
  const { toast } = useToast();

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...pixels];

    // Pesquisa
    if (searchQuery) {
      filtered = filtered.filter(pixel => 
        pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Região
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(pixel => pixel.region === selectedRegion);
    }

    // Raridade
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(pixel => pixel.rarity === selectedRarity);
    }

    // Preço
    filtered = filtered.filter(pixel => 
      pixel.price >= priceRange[0] && pixel.price <= priceRange[1]
    );

    // Filtros especiais
    if (showFeaturedOnly) {
      filtered = filtered.filter(pixel => pixel.isFeatured);
    }
    if (showFollowedOnly) {
      filtered = filtered.filter(pixel => pixel.isFollowing);
    }
    if (showLikedOnly) {
      filtered = filtered.filter(pixel => pixel.isLiked);
    }

    // Ordenação
    filtered.sort((a, b) => {
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
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredPixels(filtered);
  }, [pixels, searchQuery, selectedRegion, selectedRarity, priceRange, sortBy, showFeaturedOnly, showFollowedOnly, showLikedOnly]);

  const handlePixelClick = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
    
    // Incrementar views
    setPixels(prev => prev.map(p => 
      p.id === pixel.id ? { ...p, views: p.views + 1 } : p
    ));
  };

  const handleLikePixel = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => {
      if (pixel.id === pixelId) {
        const newLiked = !pixel.isLiked;
        return {
          ...pixel,
          isLiked: newLiked,
          likes: newLiked ? pixel.likes + 1 : pixel.likes - 1
        };
      }
      return pixel;
    }));

    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel) {
      addXp(5);
      addCredits(2);
      
      toast({
        title: pixel.isLiked ? "💔 Like Removido" : "❤️ Pixel Curtido!",
        description: pixel.isLiked ? "Like removido do pixel." : "Recebeu 5 XP + 2 créditos!",
      });
    }
  };

  const handleFollowPixel = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => {
      if (pixel.id === pixelId) {
        const newFollowing = !pixel.isFollowing;
        return {
          ...pixel,
          isFollowing: newFollowing,
          followers: newFollowing ? pixel.followers + 1 : pixel.followers - 1
        };
      }
      return pixel;
    }));

    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel) {
      setPlayNotificationSound(true);
      addXp(10);
      addCredits(5);
      
      toast({
        title: pixel.isFollowing ? "🔕 Deixou de Seguir" : "🔔 A Seguir Pixel!",
        description: pixel.isFollowing 
          ? "Não receberá mais notificações sobre este pixel." 
          : "Receberá notificações sobre mudanças de preço e vendas. +10 XP +5 créditos!",
      });
    }
  };

  const handlePurchase = () => {
    if (!selectedPixel) return;
    
    const totalPrice = selectedPixel.price;
    const fee = selectedPixel.seller.isPremium ? totalPrice * 0.05 : totalPrice * 0.07;
    const finalPrice = totalPrice + fee;
    
    if (paymentMethod === 'credits' && credits < finalPrice) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${finalPrice} créditos. Tem apenas ${credits}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === 'special' && selectedPixel.specialCreditsPrice && specialCredits < selectedPixel.specialCreditsPrice) {
      toast({
        title: "Créditos Especiais Insuficientes",
        description: `Precisa de ${selectedPixel.specialCreditsPrice} créditos especiais.`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      if (paymentMethod === 'credits') {
        removeCredits(finalPrice);
      } else if (selectedPixel.specialCreditsPrice) {
        removeSpecialCredits(selectedPixel.specialCreditsPrice);
      }
      
      addXp(100);
      setShowConfetti(true);
      setPlayPurchaseSound(true);
      
      // Remover pixel do marketplace
      setPixels(prev => prev.filter(p => p.id !== selectedPixel.id));
      
      toast({
        title: "🎉 Pixel Comprado!",
        description: `Parabéns! Adquiriu "${selectedPixel.title}" por €${totalPrice}. +100 XP!`,
      });
      
      setShowPurchaseModal(false);
      setShowPixelModal(false);
      setIsProcessing(false);
    }, 2000);
  };

  const handleMakeOffer = () => {
    if (!selectedPixel || !offerAmount) return;
    
    const amount = parseFloat(offerAmount);
    if (amount <= 0 || amount >= selectedPixel.price) {
      toast({
        title: "Oferta Inválida",
        description: "A oferta deve ser menor que o preço atual.",
        variant: "destructive"
      });
      return;
    }

    const newOffer: BidOffer = {
      id: Date.now().toString(),
      pixelId: selectedPixel.id,
      bidder: {
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        level: 15
      },
      amount,
      message: offerMessage,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setOffers(prev => [newOffer, ...prev]);
    setOfferAmount('');
    setOfferMessage('');
    setShowOfferModal(false);
    
    toast({
      title: "💰 Oferta Enviada!",
      description: `Oferta de €${amount} enviada para ${selectedPixel.seller.name}.`,
    });
  };

  const handleBid = () => {
    if (!selectedPixel?.auction || !offerAmount) return;
    
    const bidAmount = parseFloat(offerAmount);
    const minBid = selectedPixel.auction.currentBid + selectedPixel.auction.minBidIncrement;
    
    if (bidAmount < minBid) {
      toast({
        title: "Lance Insuficiente",
        description: `O lance mínimo é €${minBid}.`,
        variant: "destructive"
      });
      return;
    }

    if (credits < bidAmount) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${bidAmount} créditos para este lance.`,
        variant: "destructive"
      });
      return;
    }

    // Atualizar leilão
    setPixels(prev => prev.map(pixel => {
      if (pixel.id === selectedPixel.id && pixel.auction) {
        return {
          ...pixel,
          auction: {
            ...pixel.auction,
            currentBid: bidAmount,
            bidCount: pixel.auction.bidCount + 1
          }
        };
      }
      return pixel;
    }));

    setOfferAmount('');
    setPlayNotificationSound(true);
    
    toast({
      title: "🔨 Lance Colocado!",
      description: `Lance de €${bidAmount} registado com sucesso!`,
    });
  };

  const handleViewOnMap = () => {
    if (selectedPixel) {
      // Navegar para a página principal com coordenadas específicas
      const mapUrl = `/?pixel=${selectedPixel.x},${selectedPixel.y}`;
      window.open(mapUrl, '_blank');
      
      toast({
        title: "🗺️ Abrindo Mapa",
        description: `Navegando para pixel (${selectedPixel.x}, ${selectedPixel.y}) no mapa.`,
      });
    }
  };

  const handleViewOnGoogleMaps = () => {
    if (selectedPixel?.gpsCoords) {
      const { lat, lon } = selectedPixel.gpsCoords;
      const url = `https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`;
      window.open(url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "🌍 Google Maps",
        description: "Abrindo localização real no Google Maps.",
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

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const calculateFee = (price: number, isPremium: boolean) => {
    return price * (isPremium ? 0.05 : 0.07);
  };

  const followedPixels = pixels.filter(p => p.isFollowing);
  const likedPixels = pixels.filter(p => p.isLiked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
      <SoundEffect src={SOUND_EFFECTS.NOTIFICATION} play={playNotificationSound} onEnd={() => setPlayNotificationSound(false)} />
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
                <Badge variant="outline" className="text-primary border-primary/50">
                  {filteredPixels.length} pixels disponíveis
                </Badge>
                <div className="flex gap-1">
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
            </div>
          </CardHeader>
        </Card>

        {/* Filtros e Pesquisa */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Barra de Pesquisa */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels por título, região, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros Rápidos */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showFeaturedOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Em Destaque
                </Button>
                <Button
                  variant={showFollowedOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFollowedOnly(!showFollowedOnly)}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  A Seguir ({followedPixels.length})
                </Button>
                <Button
                  variant={showLikedOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowLikedOnly(!showLikedOnly)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Curtidos ({likedPixels.length})
                </Button>
              </div>

              {/* Filtros Avançados */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Região</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
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
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Raridade</Label>
                  <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Raridades</SelectItem>
                      <SelectItem value="Comum">Comum</SelectItem>
                      <SelectItem value="Incomum">Incomum</SelectItem>
                      <SelectItem value="Raro">Raro</SelectItem>
                      <SelectItem value="Épico">Épico</SelectItem>
                      <SelectItem value="Lendário">Lendário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Preço: €{priceRange[0]} - €{priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={1000}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Em Destaque</SelectItem>
                      <SelectItem value="price_low">Preço: Menor</SelectItem>
                      <SelectItem value="price_high">Preço: Maior</SelectItem>
                      <SelectItem value="popularity">Popularidade</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                      <SelectItem value="views">Mais Vistos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para diferentes seções */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="marketplace" className="font-headline">
              <ShoppingCart className="h-4 w-4 mr-2"/>
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="auctions" className="font-headline">
              <Gavel className="h-4 w-4 mr-2"/>
              Leilões
            </TabsTrigger>
            <TabsTrigger value="following" className="font-headline">
              <Bell className="h-4 w-4 mr-2"/>
              A Seguir ({followedPixels.length})
            </TabsTrigger>
            <TabsTrigger value="liked" className="font-headline">
              <Heart className="h-4 w-4 mr-2"/>
              Curtidos ({likedPixels.length})
            </TabsTrigger>
            <TabsTrigger value="my-sales" className="font-headline text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-1 sm:mr-2"/>
              Minhas Vendas
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Principal */}
          <TabsContent value="marketplace" className="space-y-6">
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {filteredPixels.map((pixel) => (
                  <Card 
                    key={pixel.id} 
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border-l-4 border-l-primary/30"
                    onClick={() => handlePixelClick(pixel)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Imagem do Pixel */}
                        <div className="relative">
                          <div 
                            className="w-16 h-16 rounded-lg border-2 border-border flex items-center justify-center text-2xl font-bold shadow-md"
                            style={{ backgroundColor: pixel.color }}
                          >
                            🎨
                          </div>
                          {pixel.isFeatured && (
                            <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-xs">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>

                        {/* Informações */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">{pixel.title}</h3>
                            <Badge className={getRarityColor(pixel.rarity)}>
                              {pixel.rarity}
                            </Badge>
                            {pixel.isHot && (
                              <Badge className="bg-red-500 animate-pulse">
                                <Flame className="h-3 w-3 mr-1" />
                                Em Alta
                              </Badge>
                            )}
                            {pixel.isNew && (
                              <Badge className="bg-green-500">Novo</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {pixel.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              ({pixel.x}, {pixel.y}) • {pixel.region}
                            </span>
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
                            <span className="flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              {pixel.followers}
                            </span>
                          </div>
                        </div>

                        {/* Vendedor */}
                        <div className="text-center">
                          <Avatar className="h-10 w-10 mx-auto mb-2">
                            <AvatarImage src={pixel.seller.avatar} />
                            <AvatarFallback>{pixel.seller.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-1 justify-center">
                            <span className="text-sm font-medium">{pixel.seller.name}</span>
                            {pixel.seller.verified && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                            {pixel.seller.isPremium && (
                              <Crown className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span>{pixel.seller.rating}</span>
                          </div>
                        </div>

                        {/* Preço e Ações */}
                        <div className="text-right">
                          {pixel.auction ? (
                            <div className="space-y-2">
                              <div className="text-2xl font-bold text-red-500">
                                €{pixel.auction.currentBid}
                              </div>
                              <Badge variant="destructive" className="animate-pulse">
                                <Timer className="h-3 w-3 mr-1" />
                                {formatTimeLeft(pixel.auction.timeLeft)}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {pixel.auction.bidCount} lances
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-2xl font-bold text-primary">
                                €{pixel.price}
                              </div>
                              {pixel.specialCreditsPrice && (
                                <div className="text-sm text-accent">
                                  ou {pixel.specialCreditsPrice} especiais
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Taxa: {pixel.seller.isPremium ? '5%' : '7%'}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikePixel(pixel.id);
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
                                handleFollowPixel(pixel.id);
                              }}
                              className={pixel.isFollowing ? 'text-blue-500' : ''}
                            >
                              <Bell className={`h-4 w-4 ${pixel.isFollowing ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Vista em Grelha */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredPixels.map((pixel) => (
                  <Card 
                    key={pixel.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden"
                    onClick={() => handlePixelClick(pixel)}
                  >
                    <div className="relative">
                      <div 
                        className="w-full aspect-square flex items-center justify-center text-4xl font-bold"
                        style={{ backgroundColor: pixel.color }}
                      >
                        🎨
                      </div>
                      
                      {pixel.isFeatured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-xs">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                      
                      {pixel.auction && (
                        <Badge className="absolute top-2 right-2 bg-red-500 animate-pulse text-xs">
                          <Gavel className="h-3 w-3" />
                        </Badge>
                      )}
                      
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-white text-xs">
                          <div className="font-bold">
                            €{pixel.auction ? pixel.auction.currentBid : pixel.price}
                          </div>
                          <div className="text-xs opacity-80">
                            ({pixel.x}, {pixel.y})
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm truncate mb-1">{pixel.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{pixel.region}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.likes}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePixel(pixel.id);
                            }}
                            className={`h-6 w-6 p-0 ${pixel.isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart className={`h-3 w-3 ${pixel.isLiked ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollowPixel(pixel.id);
                            }}
                            className={`h-6 w-6 p-0 ${pixel.isFollowing ? 'text-blue-500' : ''}`}
                          >
                            <Bell className={`h-3 w-3 ${pixel.isFollowing ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leilões */}
          <TabsContent value="auctions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pixels.filter(p => p.auction).map((pixel) => (
                <Card 
                  key={pixel.id} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <div className="relative">
                    <div 
                      className="w-full h-48 flex items-center justify-center text-6xl font-bold"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className="absolute top-3 left-3 bg-red-500 animate-pulse">
                      <Gavel className="h-3 w-3 mr-1" />
                      LEILÃO
                    </Badge>
                    
                    <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {formatTimeLeft(pixel.auction!.timeLeft)}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{pixel.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{pixel.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lance Atual:</span>
                        <span className="text-xl font-bold text-red-500">
                          €{pixel.auction!.currentBid}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {pixel.auction!.bidCount} lances
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {pixel.views} views
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Minhas Vendas Tab */}
          <TabsContent value="my-sales" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-green-500">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Gestão das Suas Vendas
                  <Badge className="ml-2 bg-green-500">
                    {mockPixelsForSale.filter(p => p.seller.name === 'Você').length} ativos
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Acompanhe o desempenho dos seus pixels no marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">€1,247</div>
                    <div className="text-sm text-muted-foreground">Total Vendido</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">€89</div>
                    <div className="text-sm text-muted-foreground">Comissões Pagas</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">23</div>
                    <div className="text-sm text-muted-foreground">Pixels Vendidos</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">4.8⭐</div>
                    <div className="text-sm text-muted-foreground">Rating Vendedor</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockPixelsForSale
                    .filter(pixel => pixel.seller.name === 'Você')
                    .map(pixel => (
                      <Card key={pixel.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-16 h-16 rounded-lg border-2 border-primary/30 flex items-center justify-center text-2xl font-bold shadow-md"
                              style={{ backgroundColor: pixel.color }}
                            >
                              🎨
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{pixel.title}</h3>
                                <Badge className={getRarityColor(pixel.rarity)}>
                                  {pixel.rarity}
                                </Badge>
                                {pixel.isFeatured && (
                                  <Badge className="bg-yellow-500">
                                    <Star className="h-3 w-3 mr-1" />
                                    Destaque
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span>({pixel.coordinates.x}, {pixel.coordinates.y})</span>
                                <span>{pixel.region}</span>
                                <span>Listado há {pixel.listedDaysAgo} dias</span>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3 text-blue-500" />
                                  <span>{pixel.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                  <span>{pixel.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-green-500" />
                                  <span>{pixel.followers}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3 text-purple-500" />
                                  <span>{pixel.comments}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary mb-2">
                                €{pixel.price}
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Promover
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pixels que está a seguir */}
          <TabsContent value="following" className="space-y-6">
            {followedPixels.length === 0 ? (
              <Card className="text-center p-8">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Nenhum Pixel a Seguir</h3>
                <p className="text-muted-foreground mb-4">
                  Comece a seguir pixels para receber notificações sobre mudanças de preço e vendas.
                </p>
                <Button onClick={() => setShowFollowedOnly(false)}>
                  <Search className="h-4 w-4 mr-2" />
                  Explorar Marketplace
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedPixels.map((pixel) => (
                  <Card 
                    key={pixel.id} 
                    className="hover:shadow-lg transition-all cursor-pointer border-blue-500/30 bg-blue-500/5"
                    onClick={() => handlePixelClick(pixel)}
                  >
                    <div className="relative">
                      <div 
                        className="w-full h-32 flex items-center justify-center text-4xl font-bold"
                        style={{ backgroundColor: pixel.color }}
                      >
                        🎨
                      </div>
                      
                      <Badge className="absolute top-2 left-2 bg-blue-500">
                        <Bell className="h-3 w-3 mr-1" />
                        A Seguir
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{pixel.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">€{pixel.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowPixel(pixel.id);
                          }}
                        >
                          <BellOff className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pixels curtidos */}
          <TabsContent value="liked" className="space-y-6">
            {likedPixels.length === 0 ? (
              <Card className="text-center p-8">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Nenhum Pixel Curtido</h3>
                <p className="text-muted-foreground mb-4">
                  Comece a curtir pixels para criar a sua lista de favoritos.
                </p>
                <Button onClick={() => setShowLikedOnly(false)}>
                  <Heart className="h-4 w-4 mr-2" />
                  Explorar Marketplace
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedPixels.map((pixel) => (
                  <Card 
                    key={pixel.id} 
                    className="hover:shadow-lg transition-all cursor-pointer border-red-500/30 bg-red-500/5"
                    onClick={() => handlePixelClick(pixel)}
                  >
                    <div className="relative">
                      <div 
                        className="w-full h-32 flex items-center justify-center text-4xl font-bold"
                        style={{ backgroundColor: pixel.color }}
                      >
                        🎨
                      </div>
                      
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Curtido
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{pixel.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">€{pixel.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePixel(pixel.id);
                          }}
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Pixel */}
        <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            {selectedPixel && (
              <>
                <DialogHeader className="p-6 border-b bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-headline">
                      {selectedPixel.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getRarityColor(selectedPixel.rarity)}>
                        {selectedPixel.rarity}
                      </Badge>
                      {selectedPixel.isFeatured && (
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Listado em {new Date(selectedPixel.listedDate).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                  <div className="p-6 space-y-6">
                    {/* Imagem e Informações Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div 
                          className="w-full aspect-square rounded-lg border-4 border-primary/30 flex items-center justify-center text-8xl font-bold shadow-2xl"
                          style={{ backgroundColor: selectedPixel.color }}
                        >
                          🎨
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-muted/20 rounded">
                            <Eye className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                            <div className="text-sm font-bold">{selectedPixel.views}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <Heart className="h-4 w-4 mx-auto mb-1 text-red-500" />
                            <div className="text-sm font-bold">{selectedPixel.likes}</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <MessageSquare className="h-4 w-4 mx-auto mb-1 text-green-500" />
                            <div className="text-sm font-bold">{selectedPixel.comments}</div>
                            <div className="text-xs text-muted-foreground">Comentários</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <Bell className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                            <div className="text-sm font-bold">{selectedPixel.followers}</div>
                            <div className="text-xs text-muted-foreground">A Seguir</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Preço */}
                        {selectedPixel.auction ? (
                          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
                            <CardContent className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Gavel className="h-5 w-5 text-red-500" />
                                <span className="font-semibold text-red-500">LEILÃO ATIVO</span>
                              </div>
                              <div className="text-3xl font-bold text-red-500 mb-2">
                                €{selectedPixel.auction.currentBid}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {selectedPixel.auction.bidCount} lances
                              </div>
                              <Badge variant="destructive" className="animate-pulse">
                                <Timer className="h-3 w-3 mr-1" />
                                {formatTimeLeft(selectedPixel.auction.timeLeft)}
                              </Badge>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                            <CardContent className="p-4 text-center">
                              <div className="text-3xl font-bold text-primary mb-2">
                                €{selectedPixel.price}
                              </div>
                              {selectedPixel.specialCreditsPrice && (
                                <div className="text-lg text-accent mb-2">
                                  ou {selectedPixel.specialCreditsPrice} créditos especiais
                                </div>
                              )}
                              <div className="text-sm text-muted-foreground">
                                Taxa de marketplace: {selectedPixel.seller.isPremium ? '5%' : '7%'}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Informações do Vendedor */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-12 w-12 border-2 border-primary">
                                <AvatarImage src={selectedPixel.seller.avatar} />
                                <AvatarFallback>{selectedPixel.seller.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{selectedPixel.seller.name}</span>
                                  {selectedPixel.seller.verified && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                  {selectedPixel.seller.isPremium && (
                                    <Crown className="h-4 w-4 text-amber-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>Nível {selectedPixel.seller.level}</span>
                                  <span>•</span>
                                  <span>{selectedPixel.seller.totalSales} vendas</span>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                                    <span>{selectedPixel.seller.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Ações Sociais */}
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleLikePixel(selectedPixel.id)}
                            className={selectedPixel.isLiked ? 'text-red-500 border-red-500/50' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${selectedPixel.isLiked ? 'fill-current' : ''}`} />
                            {selectedPixel.isLiked ? 'Curtido' : 'Curtir'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleFollowPixel(selectedPixel.id)}
                            className={selectedPixel.isFollowing ? 'text-blue-500 border-blue-500/50' : ''}
                          >
                            <Bell className={`h-4 w-4 mr-2 ${selectedPixel.isFollowing ? 'fill-current' : ''}`} />
                            {selectedPixel.isFollowing ? 'A Seguir' : 'Seguir'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Descrição e Características */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Descrição</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedPixel.description}
                        </p>
                      </div>

                      {selectedPixel.features.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Características Especiais</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPixel.features.map(feature => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPixel.tags.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPixel.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Histórico de Preços */}
                      <div>
                        <h4 className="font-semibold mb-2">Histórico de Preços</h4>
                        <div className="space-y-2">
                          {selectedPixel.priceHistory.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span>{new Date(entry.date).toLocaleDateString('pt-PT')}</span>
                              <span className="font-medium">€{entry.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Links de Navegação */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={handleViewOnMap}>
                          <Navigation className="h-4 w-4 mr-2" />
                          Ver no Mapa
                        </Button>
                        
                        {selectedPixel.gpsCoords && (
                          <Button variant="outline" onClick={handleViewOnGoogleMaps}>
                            <Globe className="h-4 w-4 mr-2" />
                            Google Maps
                          </Button>
                        )}
                      </div>

                      {/* Ações de Compra */}
                      <div className="space-y-3 pt-4 border-t">
                        {selectedPixel.auction ? (
                          <div className="space-y-3">
                            <Button 
                              onClick={() => setShowOfferModal(true)}
                              className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                            >
                              <Gavel className="h-5 w-5 mr-2" />
                              Fazer Lance
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                              Lance mínimo: €{selectedPixel.auction.currentBid + selectedPixel.auction.minBidIncrement}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Button 
                              onClick={() => setShowPurchaseModal(true)}
                              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            >
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Comprar Agora
                            </Button>
                            
                            <Button 
                              variant="outline"
                              onClick={() => setShowOfferModal(true)}
                              className="w-full"
                            >
                              <Target className="h-4 w-4 mr-2" />
                              Fazer Oferta
                            </Button>
                          </div>
                        )}
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-500">{selectedPixel.followers}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Users className="h-3 w-3" />
                        Seguidores
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-purple-500">{selectedPixel.comments}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Comentários
                      </div>
                    </div>
                        
                        <Button variant="outline" className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partilhar Pixel
                        </Button>
                      </div>
                    </div>
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
                  <DialogTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                    Confirmar Compra
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Card className="bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded border-2 border-border flex items-center justify-center text-2xl"
                          style={{ backgroundColor: selectedPixel.color }}
                        >
                          🎨
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedPixel.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Label>Método de Pagamento</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={paymentMethod === 'credits' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('credits')}
                        className="h-auto p-3 flex flex-col"
                      >
                        <Coins className="h-5 w-5 mb-1" />
                        <span className="text-sm">Créditos</span>
                        <span className="text-xs text-muted-foreground">
                          Saldo: {credits}
                        </span>
                      </Button>
                      
                      {pixel.isAuction ? (
                        <Button 
                          onClick={() => handleBidOnPixel(pixel)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          <Gavel className="h-4 w-4 mr-1" />
                          Licitar
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleBuyPixel(pixel)}
                          className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Comprar
                        </Button>
                      )}
                      
                      {selectedPixel.specialCreditsPrice && (
                        <Button
                          variant={paymentMethod === 'special' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('special')}
                          className="h-auto p-3 flex flex-col"
                        >
                          <Gift className="h-5 w-5 mb-1" />
                          <span className="text-sm">Especiais</span>
                          <span className="text-xs text-muted-foreground">
                            Saldo: {specialCredits}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Resumo da Compra */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Resumo da Compra</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Preço do Pixel:</span>
                          <span>€{selectedPixel.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxa de Marketplace ({selectedPixel.seller.isPremium ? '5%' : '7%'}):</span>
                          <span>€{calculateFee(selectedPixel.price, selectedPixel.seller.isPremium).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span className="text-primary">
                            {paymentMethod === 'special' && selectedPixel.specialCreditsPrice
                              ? `${selectedPixel.specialCreditsPrice} créditos especiais`
                              : `€${(selectedPixel.price + calculateFee(selectedPixel.price, selectedPixel.seller.isPremium)).toFixed(2)}`
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handlePurchase} disabled={isProcessing} className="flex-1">
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Confirmar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Purchase Confirmation Modal */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                Confirmar Compra
              </DialogTitle>
            </DialogHeader>
            
            {selectedPixelForPurchase && (
              <div className="space-y-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-primary/30 flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: selectedPixelForPurchase.color }}
                      >
                        🎨
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedPixelForPurchase.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ({selectedPixelForPurchase.coordinates.x}, {selectedPixelForPurchase.coordinates.y}) • {selectedPixelForPurchase.region}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Preço do Pixel:</span>
                    <span className="font-bold">€{selectedPixelForPurchase.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxa de Marketplace ({selectedPixelForPurchase.seller.isPremium ? '5%' : '7%'}):</span>
                    <span>€{(selectedPixelForPurchase.price * (selectedPixelForPurchase.seller.isPremium ? 0.05 : 0.07)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Para o Vendedor:</span>
                    <span>€{(selectedPixelForPurchase.price * (selectedPixelForPurchase.seller.isPremium ? 0.95 : 0.93)).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total a Pagar:</span>
                    <span className="text-primary">€{selectedPixelForPurchase.price}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Método de Pagamento:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={paymentMethod === 'credits' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('credits')}
                      className="flex-1"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Créditos
                    </Button>
                    <Button
                      variant={paymentMethod === 'special' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('special')}
                      className="flex-1"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Especiais
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {paymentMethod === 'credits' ? (
                      <p>Saldo atual: {credits.toLocaleString()} créditos</p>
                    ) : (
                      <p>Saldo atual: {specialCredits.toLocaleString()} créditos especiais</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={confirmPurchase}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Confirmar Compra
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Bid Modal */}
        <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Gavel className="h-5 w-5 mr-2 text-orange-500" />
                Fazer Licitação
              </DialogTitle>
            </DialogHeader>
            
            {selectedPixelForBid && (
              <div className="space-y-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-primary/30 flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: selectedPixelForBid.color }}
                      >
                        🎨
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedPixelForBid.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ({selectedPixelForBid.coordinates.x}, {selectedPixelForBid.coordinates.y}) • {selectedPixelForBid.region}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Lance Atual:</span>
                    <span className="font-bold text-orange-500">€{selectedPixelForBid.currentBid || selectedPixelForBid.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lance Mínimo:</span>
                    <span className="font-bold">€{(selectedPixelForBid.currentBid || selectedPixelForBid.price) + 10}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tempo Restante:</span>
                    <span>2h 34m</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bid-amount">Seu Lance (€):</Label>
                  <Input
                    id="bid-amount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={(selectedPixelForBid.currentBid || selectedPixelForBid.price) + 10}
                    placeholder={`Mínimo: €${(selectedPixelForBid.currentBid || selectedPixelForBid.price) + 10}`}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBidModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={confirmBid}
                    disabled={isProcessing || !bidAmount || parseFloat(bidAmount) < (selectedPixelForBid.currentBid || selectedPixelForBid.price) + 10}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Gavel className="h-4 w-4 mr-2" />
                        Confirmar Lance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Modal de Oferta/Lance */}
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="max-w-md">
            {selectedPixel && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    {selectedPixel.auction ? (
                      <>
                        <Gavel className="h-5 w-5 mr-2 text-red-500" />
                        Fazer Lance
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 mr-2 text-primary" />
                        Fazer Oferta
                      </>
                    )}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Card className="bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded border-2 border-border flex items-center justify-center text-2xl"
                          style={{ backgroundColor: selectedPixel.color }}
                        >
                          🎨
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedPixel.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Preço atual: €{selectedPixel.auction ? selectedPixel.auction.currentBid : selectedPixel.price}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="offer-amount">
                        {selectedPixel.auction ? 'Valor do Lance' : 'Valor da Oferta'}
                      </Label>
                      <Input
                        id="offer-amount"
                        type="number"
                        placeholder={selectedPixel.auction 
                          ? `Mínimo: €${selectedPixel.auction.currentBid + selectedPixel.auction.minBidIncrement}`
                          : `Máximo: €${selectedPixel.price - 1}`
                        }
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        min={selectedPixel.auction ? selectedPixel.auction.currentBid + selectedPixel.auction.minBidIncrement : 1}
                        max={selectedPixel.auction ? undefined : selectedPixel.price - 1}
                      />
                    </div>

                    {!selectedPixel.auction && (
                      <div>
                        <Label htmlFor="offer-message">Mensagem (opcional)</Label>
                        <Textarea
                          id="offer-message"
                          placeholder="Adicione uma mensagem para o vendedor..."
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="bg-muted/20 p-3 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span>Seu saldo atual:</span>
                        <span className="font-medium">{credits} créditos</span>
                      </div>
                      {selectedPixel.auction && offerAmount && (
                        <div className="flex justify-between mt-1">
                          <span>Após lance:</span>
                          <span className={credits - parseFloat(offerAmount) < 0 ? 'text-red-500' : 'text-green-500'}>
                            {credits - parseFloat(offerAmount)} créditos
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowOfferModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={selectedPixel.auction ? handleBid : handleMakeOffer}
                      disabled={!offerAmount}
                      className="flex-1"
                    >
                      {selectedPixel.auction ? (
                        <>
                          <Gavel className="h-4 w-4 mr-2" />
                          Licitar
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const mapUrl = `/?pixel=${selectedPixel.coordinates.x},${selectedPixel.coordinates.y}&zoom=5`;
                        window.open(mapUrl, '_blank');
                        toast({
                          title: "🗺️ Abrindo Mapa",
                          description: `Navegando para pixel (${selectedPixel.coordinates.x}, ${selectedPixel.coordinates.y})`,
                        });
                      }}
                      className="flex-1"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver no Mapa
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Oferta
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setShowOfferModal(true)}
                      className="flex-1"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Fazer Oferta
                    </Button>
                  </div>
                </div>
                  {/* Main Action Button */}
                  <div className="pt-4 border-t border-border/50">
                    {selectedPixel.isAuction ? (
                      <Button 
                        onClick={() => handleBidOnPixel(selectedPixel)}
                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg font-semibold"
                        size="lg"
                      >
                        <Gavel className="h-5 w-5 mr-2" />
                        Licitar €{selectedPixel.currentBid ? selectedPixel.currentBid + 10 : selectedPixel.price + 10}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleBuyPixel(selectedPixel)}
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg font-semibold"
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Comprar por €{selectedPixel.price}
                      </Button>
                    )}
                  </div>
                  
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}