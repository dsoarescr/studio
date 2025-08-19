'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart, MapPin, Eye, Heart, MessageSquare, Users, Star, Crown, 
  Gavel, Clock, TrendingUp, Filter, Search, Grid3X3, List, Coins, 
  Gift, Zap, Target, Award, Gem, Sparkles, Share2, ExternalLink,
  Calendar, Timer, Flame, CheckCircle, X, Send, ThumbsUp, Globe,
  BarChart3, PieChart, LineChart, DollarSign, Package, Truck,
  AlertTriangle, Info, Settings, Edit, Trash2, Plus, Minus,
  RefreshCw, Download, Upload, Camera, Palette, Bookmark,
  Navigation, Compass, Map as MapIcon, Phone, Mail, Link as LinkIcon,
  Check, Megaphone
} from "lucide-react";
import { cn } from '@/lib/utils';

interface MarketplacePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  price: number;
  specialCreditsPrice?: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    level: number;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  color: string;
  title: string;
  description: string;
  tags: string[];
  features: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    followers: number;
  };
  isAuction: boolean;
  auctionData?: {
    currentBid: number;
    timeLeft: number;
    bidCount: number;
    highestBidder?: string;
  };
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  gpsCoords?: { lat: number; lon: number };
  isFollowing?: boolean;
  isLiked?: boolean;
  offers?: Array<{
    id: string;
    buyer: string;
    amount: number;
    message?: string;
    timestamp: string;
  }>;
  views?: number;
  likes?: number;
  comments?: number;
  followers?: number;
}

const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    price: 450,
    specialCreditsPrice: 90,
    seller: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.8,
      level: 25
    },
    rarity: 'Lendário',
    color: '#D4A757',
    title: 'Vista Tejo Premium',
    description: 'Pixel exclusivo com vista privilegiada para o Rio Tejo no coração histórico de Lisboa.',
    tags: ['lisboa', 'tejo', 'histórico', 'premium'],
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade', 'Zona Turística'],
    stats: {
      views: 1234,
      likes: 89,
      comments: 23,
      followers: 45
    },
    isAuction: true,
    auctionData: {
      currentBid: 450,
      timeLeft: 3600,
      bidCount: 12,
      highestBidder: 'ArtInvestor'
    },
    priceHistory: [
      { date: '2024-01-15', price: 300 },
      { date: '2024-02-01', price: 380 },
      { date: '2024-03-01', price: 450 }
    ],
    gpsCoords: { lat: 38.7223, lon: -9.1393 },
    isFollowing: false,
    isLiked: false,
    offers: [
      {
        id: '1',
        buyer: 'PixelCollector',
        amount: 420,
        message: 'Interessado neste pixel para a minha coleção de Lisboa!',
        timestamp: '2024-03-15T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    price: 280,
    seller: {
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      rating: 4.2,
      level: 18
    },
    rarity: 'Épico',
    color: '#7DF9FF',
    title: 'Ribeira Artística',
    description: 'Pixel na zona ribeirinha do Porto, perfeito para arte urbana.',
    tags: ['porto', 'ribeira', 'arte', 'unesco'],
    features: ['Zona Ribeirinha', 'Património UNESCO', 'Vida Noturna'],
    stats: {
      views: 567,
      likes: 34,
      comments: 12,
      followers: 23
    },
    isAuction: false,
    priceHistory: [
      { date: '2024-02-01', price: 200 },
      { date: '2024-03-01', price: 280 }
    ],
    gpsCoords: { lat: 41.1579, lon: -8.6291 },
    isFollowing: true,
    isLiked: true
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    price: 180,
    seller: {
      name: 'StudentArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      rating: 4.0,
      level: 12
    },
    rarity: 'Raro',
    color: '#9C27B0',
    title: 'Universidade Histórica',
    description: 'Pixel próximo da histórica Universidade de Coimbra.',
    tags: ['coimbra', 'universidade', 'estudantes', 'cultura'],
    features: ['Zona Universitária', 'Património Mundial', 'Vida Estudantil'],
    stats: {
      views: 345,
      likes: 28,
      comments: 8,
      followers: 15
    },
    isAuction: false,
    priceHistory: [
      { date: '2024-01-01', price: 120 },
      { date: '2024-02-15', price: 150 },
      { date: '2024-03-01', price: 180 }
    ],
    gpsCoords: { lat: 40.2033, lon: -8.4103 },
    isFollowing: false,
    isLiked: false
  }
];

const mockUserPixels: MarketplacePixel[] = [
  {
    id: 'user1',
    x: 400,
    y: 300,
    region: 'Aveiro',
    price: 220,
    seller: {
      name: 'Você',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.9,
      level: 15
    },
    rarity: 'Raro',
    color: '#4CAF50',
    title: 'Ria de Aveiro',
    description: 'Pixel com vista para a famosa Ria de Aveiro.',
    tags: ['aveiro', 'ria', 'natureza', 'barcos'],
    features: ['Vista Aquática', 'Zona Natural', 'Turismo'],
    stats: {
      views: 456,
      likes: 32,
      comments: 15,
      followers: 28
    },
    isAuction: false,
    priceHistory: [
      { date: '2024-02-01', price: 180 },
      { date: '2024-03-01', price: 220 }
    ],
    gpsCoords: { lat: 40.6443, lon: -8.6455 },
    views: 456,
    likes: 32,
    comments: 15,
    followers: 28,
    offers: [
      {
        id: '1',
        buyer: 'NatureLover',
        amount: 200,
        message: 'Adoro a vista da Ria! Aceita esta oferta?',
        timestamp: '2024-03-15T14:20:00Z'
      },
      {
        id: '2',
        buyer: 'PixelCollector',
        amount: 210,
        timestamp: '2024-03-15T16:45:00Z'
      }
    ]
  }
];

const mockOffers = [
  {
    id: '1',
    buyer: {
      name: 'NatureLover',
      avatar: 'https://placehold.co/40x40.png'
    },
    amount: 200,
    pixelX: 400,
    pixelY: 300,
    message: 'Adoro a vista da Ria! Aceita esta oferta?',
    timestamp: '2h atrás'
  },
  {
    id: '2',
    buyer: {
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png'
    },
    amount: 210,
    pixelX: 400,
    pixelY: 300,
    timestamp: '4h atrás'
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<MarketplacePixel[]>(mockMarketplacePixels);
  const [userPixels, setUserPixels] = useState<MarketplacePixel[]>(mockUserPixels);
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('price_low');
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);

  const { credits, specialCredits, isPremium, addCredits, removeCredits, addXp, addPixel } = useUserStore();
  const { toast } = useToast();

  // Filtrar pixels
  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRegion = selectedRegion === 'all' || pixel.region === selectedRegion;
    const matchesPrice = pixel.price >= priceRange[0] && pixel.price <= priceRange[1];
    const matchesRarity = selectedRarity === 'all' || pixel.rarity === selectedRarity;
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'auctions' && pixel.isAuction) ||
      (activeTab === 'following' && pixel.isFollowing) ||
      (activeTab === 'liked' && pixel.isLiked);
    
    return matchesSearch && matchesRegion && matchesPrice && matchesRarity && matchesTab;
  });

  // Ordenar pixels
  const sortedPixels = [...filteredPixels].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'views': return b.stats.views - a.stats.views;
      case 'likes': return b.stats.likes - a.stats.likes;
      case 'recent': return new Date(b.priceHistory[b.priceHistory.length - 1]?.date || '').getTime() - 
                           new Date(a.priceHistory[a.priceHistory.length - 1]?.date || '').getTime();
      default: return 0;
    }
  });

  const handlePixelClick = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
  };

  const handleBuyPixel = (pixel: MarketplacePixel, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPixel(pixel);
    setShowPurchaseModal(true);
  };

  const handleBidOnPixel = (pixel: MarketplacePixel, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPixel(pixel);
    setShowBidModal(true);
  };

  const handleMakeOffer = (pixel: MarketplacePixel, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedPixel(pixel);
    setShowOfferModal(true);
  };

  const handleConfirmPurchase = () => {
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
      description: `Comprou "${selectedPixel.title}" por €${selectedPixel.price}. Recebeu 100 XP!`,
    });

    setShowPurchaseModal(false);
    setSelectedPixel(null);
  };

  const handleConfirmBid = () => {
    if (!selectedPixel || !bidAmount) return;

    const bid = parseFloat(bidAmount);
    const minBid = (selectedPixel.auctionData?.currentBid || selectedPixel.price) + 10;

    if (bid < minBid) {
      toast({
        title: "Lance Insuficiente",
        description: `O lance mínimo é €${minBid}.`,
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

    setPlaySuccessSound(true);
    addXp(25);

    toast({
      title: "Lance Colocado! 🎯",
      description: `Lance de €${bid} registado com sucesso. Recebeu 25 XP!`,
    });

    setBidAmount('');
    setShowBidModal(false);
    setSelectedPixel(null);
  };

  const handleSendOffer = () => {
    if (!selectedPixel || !offerAmount) return;

    const offer = parseFloat(offerAmount);

    if (offer >= selectedPixel.price) {
      toast({
        title: "Oferta Inválida",
        description: "A oferta deve ser inferior ao preço de venda.",
        variant: "destructive"
      });
      return;
    }

    setPlaySuccessSound(true);
    addXp(15);

    toast({
      title: "Oferta Enviada! 📤",
      description: `Oferta de €${offer} enviada para ${selectedPixel.seller.name}. Recebeu 15 XP!`,
    });

    setOfferAmount('');
    setOfferMessage('');
    setShowOfferModal(false);
    setSelectedPixel(null);
  };

  const handleFollowPixel = (pixel: MarketplacePixel, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    setPixels(prev => prev.map(p => 
      p.id === pixel.id 
        ? { 
            ...p, 
            isFollowing: !p.isFollowing,
            stats: { 
              ...p.stats, 
              followers: p.isFollowing ? p.stats.followers - 1 : p.stats.followers + 1 
            }
          }
        : p
    ));

    if (!pixel.isFollowing) {
      addXp(10);
      addCredits(5);
      setPlaySuccessSound(true);
    }

    toast({
      title: pixel.isFollowing ? "Deixou de Seguir" : "A Seguir Pixel! 👁️",
      description: pixel.isFollowing 
        ? "Não receberá mais notificações sobre este pixel." 
        : `Receberá notificações sobre "${pixel.title}". Recebeu 10 XP + 5 créditos!`,
    });
  };

  const handleLikePixel = (pixel: MarketplacePixel, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    setPixels(prev => prev.map(p => 
      p.id === pixel.id 
        ? { 
            ...p, 
            isLiked: !p.isLiked,
            stats: { 
              ...p.stats, 
              likes: p.isLiked ? p.stats.likes - 1 : p.stats.likes + 1 
            }
          }
        : p
    ));

    if (!pixel.isLiked) {
      addXp(5);
      addCredits(2);
      setPlaySuccessSound(true);
    }

    toast({
      title: pixel.isLiked ? "💔 Like Removido" : "❤️ Pixel Curtido!",
      description: pixel.isLiked 
        ? "Like removido do pixel." 
        : `Curtiu "${pixel.title}". Recebeu 5 XP + 2 créditos!`,
    });
  };

  const handleAcceptOffer = (pixelId: string, offerId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const pixel = userPixels.find(p => p.id === pixelId);
    const offer = pixel?.offers?.find(o => o.id === offerId);
    
    if (!pixel || !offer) return;

    const commission = isPremium ? 0.05 : 0.07;
    const finalAmount = Math.floor(offer.amount * (1 - commission));

    addCredits(finalAmount);
    addXp(150);
    setShowConfetti(true);
    setPlaySuccessSound(true);

    setUserPixels(prev => prev.map(p => 
      p.id === pixelId 
        ? { ...p, offers: p.offers?.filter(o => o.id !== offerId) }
        : p
    ));

    toast({
      title: "Oferta Aceite! 💰",
      description: `Vendeu "${pixel.title}" por €${offer.amount}. Recebeu €${finalAmount} (após comissão de ${Math.round(commission * 100)}%). +150 XP!`,
    });
  };

  const handleRejectOffer = (pixelId: string, offerId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const pixel = userPixels.find(p => p.id === pixelId);
    const offer = pixel?.offers?.find(o => o.id === offerId);
    
    if (!pixel || !offer) return;

    setUserPixels(prev => prev.map(p => 
      p.id === pixelId 
        ? { ...p, offers: p.offers?.filter(o => o.id !== offerId) }
        : p
    ));

    toast({
      title: "Oferta Rejeitada",
      description: `Rejeitou a oferta de €${offer.amount} de ${offer.buyer}.`,
    });
  };

  const handlePromotePixel = (pixelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (credits < 50) {
      toast({
        title: "Créditos Insuficientes",
        description: "Precisa de 50 créditos para promover um pixel.",
        variant: "destructive"
      });
      return;
    }

    removeCredits(50);
    addXp(25);
    setPlaySuccessSound(true);

    const pixel = userPixels.find(p => p.id === pixelId);
    toast({
      title: "Pixel Promovido! 📢",
      description: `"${pixel?.title}" foi promovido por 24h. Recebeu 25 XP!`,
    });
  };

  const handleAcceptOffer = (offer: any) => {
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    const commission = isPremium ? 0.05 : 0.07;
    const finalAmount = offer.amount * (1 - commission);
    
    addCredits(Math.floor(offer.amount * 0.95));
    addXp(50);
    
    toast({
      title: "Oferta Aceite! 💰",
      description: `Vendeu pixel por €${offer.amount}. Recebeu €${Math.floor(finalAmount)} (após comissão de ${Math.round(commission * 100)}%).`,
    });
  };

  const handleRejectOffer = (offerId: string) => {
    toast({
      title: "Oferta Rejeitada",
      description: "A oferta foi rejeitada e o comprador foi notificado.",
    });
  };

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Marco Histórico': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const regions = ['all', 'Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro'];
  const rarities = ['all', 'Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Marco Histórico'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-3 px-2 sm:py-6 sm:px-4 space-y-4 sm:space-y-6 max-w-7xl mb-20">
        {/* Header - Mobile Optimized */}
        <Card className="shadow-xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-headline text-xl sm:text-3xl text-gradient-gold flex items-center">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
              Marketplace
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Compre, venda e licite pixels únicos no mapa de Portugal
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tabs - Mobile Optimized */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="all" className="font-headline text-xs sm:text-sm">
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              <span className="hidden sm:inline">Todos</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="auctions" className="font-headline text-xs sm:text-sm">
              <Gavel className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              <span className="hidden sm:inline">Leilões</span>
              <span className="sm:hidden">Leil</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="font-headline text-xs sm:text-sm">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              <span className="hidden sm:inline">A Seguir</span>
              <span className="sm:hidden">Seg</span>
            </TabsTrigger>
            <TabsTrigger value="liked" className="font-headline text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              <span className="hidden sm:inline">Curtidos</span>
              <span className="sm:hidden">Fav</span>
            </TabsTrigger>
            <TabsTrigger value="my-sales" className="font-headline text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              <span className="hidden sm:inline">Minhas Vendas</span>
              <span className="sm:hidden">Vend</span>
            </TabsTrigger>
          </TabsList>

          {/* Filtros - Mobile Optimized */}
          <Card className="p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 sm:h-10"
                />
              </div>

              {/* Filters Row - Mobile Optimized */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-2 py-1 border border-input bg-background rounded-md text-xs sm:text-sm min-h-[36px]"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region === 'all' ? 'Todas as Regiões' : region}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-2 py-1 border border-input bg-background rounded-md text-xs sm:text-sm min-h-[36px]"
                >
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>
                      {rarity === 'all' ? 'Todas as Raridades' : rarity}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 border border-input bg-background rounded-md text-xs sm:text-sm min-h-[36px]"
                >
                  <option value="price_low">Preço: Menor</option>
                  <option value="price_high">Preço: Maior</option>
                  <option value="views">Mais Vistos</option>
                  <option value="likes">Mais Curtidos</option>
                  <option value="recent">Mais Recentes</option>
                </select>

                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="min-h-[36px] px-2 sm:px-3"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="min-h-[36px] px-2 sm:px-3"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Content Tabs */}
          <TabsContent value="all" className="space-y-4">
            <div className={cn(
              "grid gap-3 sm:gap-6",
              viewMode === 'grid' 
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                : "grid-cols-1"
            )}>
              {sortedPixels.map((pixel) => (
                <Card 
                  key={pixel.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <div className="relative">
                    <div 
                      className="w-full h-24 sm:h-32 flex items-center justify-center text-2xl sm:text-4xl font-bold"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className={cn("absolute top-1 left-1 text-xs", getRarityColor(pixel.rarity))}>
                      {pixel.rarity}
                    </Badge>
                    
                    {pixel.isAuction && (
                      <Badge className="absolute top-1 right-1 bg-red-500 animate-pulse text-xs">
                        <Gavel className="h-2 w-2 mr-1" />
                        Leilão
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-2 sm:p-4">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getRarityColor(pixel.rarity)} variant="outline" className="text-xs px-1.5 py-0.5">
                            {pixel.rarity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">({pixel.x}, {pixel.y})</span>
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{pixel.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{pixel.region}</p>
                      
                      {viewMode === 'list' && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{pixel.description}</p>
                      )}
                      
                      {/* Stats - Mobile Optimized */}
                      <div className="flex items-center gap-2 sm:gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {pixel.stats.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className={`h-3 w-3 ${pixel.isLiked ? 'fill-current text-red-500' : ''}`} />
                          {pixel.stats.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {pixel.stats.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {pixel.stats.followers}
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg sm:text-xl font-bold text-primary">
                            €{pixel.price}
                          </div>
                          {pixel.specialCreditsPrice && (
                            <div className="text-xs text-accent">
                              ou {pixel.specialCreditsPrice} especiais
                            </div>
                          )}
                        </div>
                        
                        {pixel.isAuction && pixel.auctionData && (
                          <div className="text-right">
                            <div className="text-xs text-red-500 font-medium">
                              {formatTimeLeft(pixel.auctionData.timeLeft)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pixel.auctionData.bidCount} lances
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons - Mobile Optimized */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {pixel.isAuction ? (
                          <Button 
                            size="sm" 
                            className="h-8 text-xs bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
                            className="h-8 text-xs bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyPixel(pixel);
                            }}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Comprar
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={(e) => handleMakeOffer(pixel, e)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Oferta
                        </Button>
                      </div>
                      
                      {/* Social Actions - Mobile Optimized */}
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            "min-h-[36px] text-xs",
                            pixel.isLiked && "text-red-500"
                          )}
                          onClick={(e) => handleLikePixel(pixel, e)}
                        >
                          <Heart className={`h-3 w-3 mr-1 ${pixel.isLiked ? 'fill-current' : ''}`} />
                          {pixel.isLiked ? 'Curtido' : 'Curtir'}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            "min-h-[36px] text-xs",
                            pixel.isFollowing && "text-blue-500"
                          )}
                          onClick={(e) => handleFollowPixel(pixel, e)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {pixel.isFollowing ? 'A Seguir' : 'Seguir'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Outras tabs permanecem iguais mas com otimizações mobile */}
          <TabsContent value="auctions" className="space-y-4">
            <div className={cn(
              "grid gap-3 sm:gap-6",
              viewMode === 'grid' 
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {sortedPixels.filter(p => p.isAuction).map((pixel) => (
                <Card 
                  key={pixel.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-red-500/30"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <div className="relative">
                    <div 
                      className="w-full h-24 sm:h-32 flex items-center justify-center text-2xl sm:text-4xl font-bold"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className="absolute top-1 left-1 bg-red-500 animate-pulse text-xs">
                      <Timer className="h-2 w-2 mr-1" />
                      {pixel.auctionData && formatTimeLeft(pixel.auctionData.timeLeft)}
                    </Badge>
                    
                    <Badge className={cn("absolute top-1 right-1 text-xs", getRarityColor(pixel.rarity))}>
                      {pixel.rarity}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-2 sm:p-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{pixel.title}</h3>
                        <p className="text-xs text-muted-foreground">({pixel.x}, {pixel.y}) • {pixel.region}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-red-500">
                            €{pixel.auctionData?.currentBid || pixel.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pixel.auctionData?.bidCount || 0} lances
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-red-500 font-medium">
                            {pixel.auctionData && formatTimeLeft(pixel.auctionData.timeLeft)}
                          </div>
                          <div className="text-xs text-muted-foreground">restantes</div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full min-h-[36px] text-xs bg-red-600 hover:bg-red-700"
                        onClick={(e) => handleBidOnPixel(pixel, e)}
                      >
                        <Gavel className="h-3 w-3 mr-1" />
                        Licitar (min. €{(pixel.auctionData?.currentBid || pixel.price) + 10})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            <div className={cn(
              "grid gap-3 sm:gap-6",
              viewMode === 'grid' 
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {sortedPixels.filter(p => p.isFollowing).map((pixel) => (
                <Card 
                  key={pixel.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-blue-500/30"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <div className="relative">
                    <div 
                      className="w-full h-24 sm:h-32 flex items-center justify-center text-2xl sm:text-4xl font-bold"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className="absolute top-1 left-1 bg-blue-500 text-xs">
                      <Eye className="h-2 w-2 mr-1" />
                      A Seguir
                    </Badge>
                  </div>
                  
                  <CardContent className="p-2 sm:p-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{pixel.title}</h3>
                        <p className="text-xs text-muted-foreground">({pixel.x}, {pixel.y}) • {pixel.region}</p>
                      </div>
                      
                      <div className="text-lg font-bold text-primary">€{pixel.price}</div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        <Button 
                          size="sm" 
                          className="min-h-[36px] text-xs"
                          onClick={(e) => handleBuyPixel(pixel, e)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Comprar
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="min-h-[36px] text-xs text-blue-500"
                          onClick={(e) => handleFollowPixel(pixel, e)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Seguindo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-4">
            <div className={cn(
              "grid gap-3 sm:gap-6",
              viewMode === 'grid' 
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {sortedPixels.filter(p => p.isLiked).map((pixel) => (
                <Card 
                  key={pixel.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-red-500/30"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <div className="relative">
                    <div 
                      className="w-full h-24 sm:h-32 flex items-center justify-center text-2xl sm:text-4xl font-bold"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className="absolute top-1 left-1 bg-red-500 text-xs">
                      <Heart className="h-2 w-2 mr-1 fill-current" />
                      Curtido
                    </Badge>
                  </div>
                  
                  <CardContent className="p-2 sm:p-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{pixel.title}</h3>
                        <p className="text-xs text-muted-foreground">({pixel.x}, {pixel.y}) • {pixel.region}</p>
                      </div>
                      
                      <div className="text-lg font-bold text-primary">€{pixel.price}</div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        <Button 
                          size="sm" 
                          className="min-h-[36px] text-xs"
                          onClick={(e) => handleBuyPixel(pixel, e)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Comprar
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="min-h-[36px] text-xs text-red-500"
                          onClick={(e) => handleLikePixel(pixel, e)}
                        >
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Curtido
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Minhas Vendas Tab */}
          <TabsContent value="my-sales" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stats de Vendas */}
              <Card className="lg:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Dashboard de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-green-500">€2,450</div>
                      <div className="text-xs text-muted-foreground">Total Vendido</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-blue-500">12</div>
                      <div className="text-xs text-muted-foreground">Pixels à Venda</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-purple-500">4.8</div>
                      <div className="text-xs text-muted-foreground">Rating Vendedor</div>
                    </div>
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-orange-500">€123</div>
                      <div className="text-xs text-muted-foreground">Comissões Pagas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pixels à Venda */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Meus Pixels à Venda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {mockUserPixels.map(pixel => (
                        <Card key={pixel.id} className="p-3 bg-muted/20">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge className={getRarityColor(pixel.rarity)} variant="outline" className="text-xs">
                                    {pixel.rarity}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">({pixel.x}, {pixel.y})</span>
                                </div>
                                <h4 className="font-medium text-sm">{pixel.title}</h4>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">€{pixel.price}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 text-xs text-center">
                              <div>
                                <div className="font-bold text-blue-500">{pixel.views}</div>
                                <div className="text-muted-foreground">Views</div>
                              </div>
                              <div>
                                <div className="font-bold text-red-500">{pixel.likes}</div>
                                <div className="text-muted-foreground">Likes</div>
                              </div>
                              <div>
                                <div className="font-bold text-green-500">{pixel.comments}</div>
                                <div className="text-muted-foreground">Coment</div>
                              </div>
                              <div>
                                <div className="font-bold text-purple-500">{pixel.followers}</div>
                                <div className="text-muted-foreground">Seguid</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" size="sm" className="h-8 text-xs">
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 text-xs">
                                <Megaphone className="h-3 w-3 mr-1" />
                                Promover
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Ofertas Recebidas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Gift className="h-4 w-4 mr-2 text-accent" />
                    Ofertas Recebidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {mockOffers.map(offer => (
                        <Card key={offer.id} className="p-3 bg-muted/20">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={offer.buyer.avatar} />
                                  <AvatarFallback className="text-xs">{offer.buyer.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{offer.buyer.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary">€{offer.amount}</div>
                                <div className="text-xs text-muted-foreground">{offer.timestamp}</div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              Pixel ({offer.pixelX}, {offer.pixelY})
                            </div>
                            
                            {offer.message && (
                              <p className="text-xs text-muted-foreground italic">"{offer.message}"</p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                size="sm" 
                                className="h-8 text-xs bg-green-600 hover:bg-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptOffer(offer);
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Aceitar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectOffer(offer.id);
                                }}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Rejeitar
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Minhas Vendas - Mobile Optimized */}
          <TabsContent value="my-sales" className="space-y-4">
            {/* Dashboard de Vendas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="text-center p-3 sm:p-4">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-green-500">€1,247</div>
                <div className="text-xs text-muted-foreground">Total Vendido</div>
              </Card>
              
              <Card className="text-center p-3 sm:p-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">À Venda</div>
              </Card>
              
              <Card className="text-center p-3 sm:p-4">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-blue-500">2,456</div>
                <div className="text-xs text-muted-foreground">Views Totais</div>
              </Card>
              
              <Card className="text-center p-3 sm:p-4">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-yellow-500">4.8</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </Card>
            </div>

            {/* Pixels à Venda */}
            <div className="space-y-3 sm:space-y-4">
              {userPixels.map((pixel) => (
                <Card key={pixel.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-lg sm:text-2xl font-bold flex-shrink-0"
                        style={{ backgroundColor: pixel.color }}
                      >
                        🎨
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{pixel.title}</h3>
                          <p className="text-xs text-muted-foreground">({pixel.x}, {pixel.y}) • {pixel.region}</p>
                        </div>
                        
                        {/* Stats Grid - Mobile Optimized */}
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <Eye className="h-3 w-3 mx-auto mb-1" />
                            <div className="font-medium">{pixel.stats.views}</div>
                            <div className="text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <Heart className="h-3 w-3 mx-auto mb-1 text-red-500" />
                            <div className="font-medium">{pixel.stats.likes}</div>
                            <div className="text-muted-foreground">Likes</div>
                          </div>
                          <div className="text-center">
                            <MessageSquare className="h-3 w-3 mx-auto mb-1 text-blue-500" />
                            <div className="font-medium">{pixel.stats.comments}</div>
                            <div className="text-muted-foreground">Coment.</div>
                          </div>
                          <div className="text-center">
                            <Users className="h-3 w-3 mx-auto mb-1 text-green-500" />
                            <div className="font-medium">{pixel.stats.followers}</div>
                            <div className="text-muted-foreground">Seguid.</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg sm:text-xl font-bold text-primary">€{pixel.price}</div>
                          <div className="flex gap-1 sm:gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="min-h-[32px] text-xs px-2"
                              onClick={(e) => handlePromotePixel(pixel.id, e)}
                            >
                              <Sparkles className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="min-h-[32px] text-xs px-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ofertas - Mobile Optimized */}
                    {pixel.offers && pixel.offers.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <h4 className="font-medium text-sm flex items-center">
                          <Send className="h-3 w-3 mr-1" />
                          Ofertas ({pixel.offers.length})
                        </h4>
                        
                        {pixel.offers.map((offer) => (
                          <div key={offer.id} className="p-2 sm:p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                  <AvatarImage src="https://placehold.co/40x40.png" />
                                  <AvatarFallback className="text-xs">{offer.buyer[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-xs sm:text-sm">{offer.buyer}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(offer.timestamp).toLocaleDateString('pt-PT')}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary text-sm sm:text-base">€{offer.amount}</div>
                              </div>
                            </div>
                            
                            {offer.message && (
                              <p className="text-xs text-muted-foreground mb-2 italic">
                                "{offer.message}"
                              </p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-1 sm:gap-2">
                              <Button 
                                size="sm" 
                                className="min-h-[32px] text-xs bg-green-600 hover:bg-green-700"
                                onClick={(e) => handleAcceptOffer(pixel.id, offer.id, e)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Aceitar
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="min-h-[32px] text-xs text-red-500 hover:bg-red-50"
                                onClick={(e) => handleRejectOffer(pixel.id, offer.id, e)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Rejeitar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Pixel - Mobile Optimized */}
        <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
          <DialogContent className="max-w-sm sm:max-w-md h-[90vh] p-0 gap-0">
            <DialogHeader className="p-4 sm:p-6 border-b bg-gradient-to-br from-primary/5 to-accent/5">
              <DialogTitle className="flex items-center text-lg sm:text-2xl font-headline">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                {selectedPixel?.title}
              </DialogTitle>
              
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  ({selectedPixel?.x}, {selectedPixel?.y}) • {selectedPixel?.region}
                </div>
                <Badge className={selectedPixel ? getRarityColor(selectedPixel.rarity) : ''}>
                  {selectedPixel?.rarity}
                </Badge>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {selectedPixel && (
                  <>
                    {/* Pixel Preview */}
                    <Card>
                      <div 
                        className="w-full h-32 sm:h-40 flex items-center justify-center text-4xl sm:text-5xl font-bold"
                        style={{ backgroundColor: selectedPixel.color }}
                      >
                        🎨
                      </div>
                      
                      <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-muted-foreground text-center">
                          {selectedPixel.description}
                        </p>
                        
                        {selectedPixel.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mt-3">
                            {selectedPixel.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Stats - Mobile Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                      <Card className="text-center p-2 sm:p-3">
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-lg font-bold">{selectedPixel.stats.views}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </Card>
                      
                      <Card className="text-center p-2 sm:p-3">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-lg font-bold">{selectedPixel.stats.likes}</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </Card>
                      
                      <Card className="text-center p-2 sm:p-3">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-lg font-bold">{selectedPixel.stats.comments}</div>
                        <div className="text-xs text-muted-foreground">Coment.</div>
                      </Card>
                      
                      <Card className="text-center p-2 sm:p-3">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-lg font-bold">{selectedPixel.stats.followers}</div>
                        <div className="text-xs text-muted-foreground">Seguid.</div>
                      </Card>
                    </div>

                    {/* Seller Info - Mobile Optimized */}
                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={selectedPixel.seller.avatar} />
                            <AvatarFallback>{selectedPixel.seller.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm sm:text-base">{selectedPixel.seller.name}</span>
                              {selectedPixel.seller.verified && (
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline">Nível {selectedPixel.seller.level}</Badge>
                              <span className="text-muted-foreground">⭐ {selectedPixel.seller.rating}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Navigation Links - Mobile Optimized */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Button 
                        variant="outline" 
                        className="min-h-[40px] text-xs sm:text-sm"
                        onClick={() => window.open(`/?x=${selectedPixel.x}&y=${selectedPixel.y}`, '_blank')}
                      >
                        <MapIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Ver no Mapa
                      </Button>
                      
                      {selectedPixel.gpsCoords && (
                        <Button 
                          variant="outline" 
                          className="min-h-[40px] text-xs sm:text-sm"
                          onClick={() => {
                            const { lat, lon } = selectedPixel.gpsCoords!;
                            window.open(`https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`, '_blank');
                          }}
                        >
                          <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Google Maps
                        </Button>
                      )}
                    </div>

                    {/* Action Buttons - Mobile Optimized */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                          €{selectedPixel.price}
                        </div>
                        {selectedPixel.specialCreditsPrice && (
                          <div className="text-sm text-accent">
                            ou {selectedPixel.specialCreditsPrice} créditos especiais
                          </div>
                        )}
                      </div>
                      
                      {selectedPixel.isAuction ? (
                        <div className="space-y-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-500">
                              Lance Atual: €{selectedPixel.auctionData?.currentBid}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedPixel.auctionData?.bidCount} lances • {selectedPixel.auctionData && formatTimeLeft(selectedPixel.auctionData.timeLeft)} restantes
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full min-h-[44px] bg-red-600 hover:bg-red-700"
                            onClick={() => setShowBidModal(true)}
                          >
                            <Gavel className="h-4 w-4 mr-2" />
                            Licitar (min. €{(selectedPixel.auctionData?.currentBid || selectedPixel.price) + 10})
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full min-h-[44px] bg-gradient-to-r from-primary to-accent"
                          onClick={() => setShowPurchaseModal(true)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar Agora
                        </Button>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="min-h-[40px] text-xs sm:text-sm"
                          onClick={() => setShowOfferModal(true)}
                        >
                          <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Fazer Oferta
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className={cn(
                            "min-h-[40px] text-xs sm:text-sm",
                            selectedPixel.isFollowing && "text-blue-500 bg-blue-50"
                          )}
                          onClick={(e) => handleFollowPixel(selectedPixel, e)}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          {selectedPixel.isFollowing ? 'A Seguir' : 'Seguir'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Modal de Compra - Mobile Optimized */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Confirmar Compra</DialogTitle>
            </DialogHeader>
            
            {selectedPixel && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-base sm:text-lg">{selectedPixel.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                  </p>
                </div>
                
                <div className="space-y-2 p-3 sm:p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Preço do Pixel:</span>
                    <span className="font-bold">€{selectedPixel.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Transação:</span>
                    <span>€0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-primary">€{selectedPixel.price}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Saldo Atual:</span>
                    <span>€{credits}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 min-h-[44px]"
                    onClick={() => setShowPurchaseModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 min-h-[44px]"
                    onClick={handleConfirmPurchase}
                    disabled={credits < selectedPixel.price}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Licitação - Mobile Optimized */}
        <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Fazer Lance</DialogTitle>
            </DialogHeader>
            
            {selectedPixel && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-base sm:text-lg">{selectedPixel.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Lance atual: €{selectedPixel.auctionData?.currentBid || selectedPixel.price}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seu Lance (€)</label>
                  <Input
                    type="number"
                    placeholder={`Mínimo: €${(selectedPixel.auctionData?.currentBid || selectedPixel.price) + 10}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={(selectedPixel.auctionData?.currentBid || selectedPixel.price) + 10}
                    className="text-center text-lg font-bold"
                  />
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 min-h-[44px]"
                    onClick={() => setShowBidModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 min-h-[44px] bg-red-600 hover:bg-red-700"
                    onClick={handleConfirmBid}
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Licitar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Oferta - Mobile Optimized */}
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Fazer Oferta</DialogTitle>
            </DialogHeader>
            
            {selectedPixel && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-base sm:text-lg">{selectedPixel.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Preço atual: €{selectedPixel.price}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Valor da Oferta (€)</label>
                    <Input
                      type="number"
                      placeholder="Valor da sua oferta"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      max={selectedPixel.price - 1}
                      className="text-center text-lg font-bold"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Mensagem (opcional)</label>
                    <Textarea
                      placeholder="Adicione uma mensagem para o vendedor..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 min-h-[44px]"
                    onClick={() => setShowOfferModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 min-h-[44px]"
                    onClick={handleSendOffer}
                    disabled={!offerAmount || parseFloat(offerAmount) >= selectedPixel.price}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}