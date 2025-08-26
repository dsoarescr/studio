'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from "framer-motion";
import {
  ShoppingCart, Gavel, Eye, Heart, MessageSquare, Star, Crown, Gem, 
  MapPin, TrendingUp, Search, Gift, Users, Globe,
  BarChart3, X, Sparkles, Timer, Check, Edit, DollarSign, Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MarketplacePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  price: number;
  specialCreditsPrice?: number;
  owner: string;
  ownerAvatar?: string;
  title: string;
  description: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  color: string;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  tags: string[];
  features: string[];
  isAuction: boolean;
  auctionEndTime?: Date;
  currentBid?: number;
  bidCount?: number;
  buyNowPrice?: number;
  imageUrl: string;
  gpsCoords?: { lat: number; lon: number };
  linkUrl?: string;
  isPromoted?: boolean;
  lastPriceChange?: string;
  priceHistory?: Array<{ price: number; date: string }>;
  offers?: Array<{
    id: string;
    buyer: string;
    buyerAvatar: string;
    amount: number;
    message?: string;
    timestamp: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

interface UserPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  price: number;
  title: string;
  description: string;
  rarity: string;
  color: string;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  isForSale: boolean;
  offers: Array<{
    id: string;
    buyer: string;
    buyerAvatar: string;
    amount: number;
    message?: string;
    timestamp: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    price: 450,
    specialCreditsPrice: 90,
    owner: 'PixelCollector',
    ownerAvatar: 'https://placehold.co/40x40.png',
    title: 'Vista Tejo Premium',
    description: 'Pixel exclusivo com vista privilegiada para o Rio Tejo no coração histórico de Lisboa.',
    rarity: 'Lendário',
    color: '#D4A757',
    views: 2340,
    likes: 456,
    comments: 89,
    followers: 234,
    tags: ['lisboa', 'tejo', 'histórico', 'premium'],
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade', 'Zona Turística'],
    isAuction: true,
    auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    currentBid: 420,
    bidCount: 23,
    buyNowPrice: 600,
    imageUrl: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Lisboa+Premium',
    gpsCoords: { lat: 38.7223, lon: -9.1393 },
    isPromoted: true,
    lastPriceChange: '2 dias atrás',
    priceHistory: [
      { price: 300, date: '2024-01-01' },
      { price: 380, date: '2024-01-15' },
      { price: 450, date: '2024-02-01' }
    ]
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    price: 280,
    specialCreditsPrice: 56,
    owner: 'PortoArtist',
    ownerAvatar: 'https://placehold.co/40x40.png',
    title: 'Ribeira Artística',
    description: 'Pixel na zona ribeirinha do Porto, perfeito para arte urbana e expressão criativa.',
    rarity: 'Épico',
    color: '#7DF9FF',
    views: 1890,
    likes: 234,
    comments: 67,
    followers: 156,
    tags: ['porto', 'ribeira', 'arte', 'unesco'],
    features: ['Zona Ribeirinha', 'Património UNESCO', 'Vida Noturna'],
    isAuction: false,
    imageUrl: 'https://placehold.co/300x200/7DF9FF/000000?text=Porto+Art',
    gpsCoords: { lat: 41.1579, lon: -8.6291 },
    lastPriceChange: '1 semana atrás'
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    price: 180,
    owner: 'StudentCollector',
    ownerAvatar: 'https://placehold.co/40x40.png',
    title: 'Universidade Histórica',
    description: 'Pixel próximo da histórica Universidade de Coimbra, ideal para estudantes e académicos.',
    rarity: 'Raro',
    color: '#9C27B0',
    views: 1234,
    likes: 189,
    comments: 45,
    followers: 98,
    tags: ['coimbra', 'universidade', 'história', 'académico'],
    features: ['Universidade', 'Centro Histórico', 'Biblioteca Joanina'],
    isAuction: false,
    imageUrl: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Coimbra+Uni',
    gpsCoords: { lat: 40.2033, lon: -8.4103 },
    lastPriceChange: '3 dias atrás'
  },
  {
    id: '4',
    x: 400,
    y: 300,
    region: 'Braga',
    price: 120,
    owner: 'NorthernExplorer',
    ownerAvatar: 'https://placehold.co/40x40.png',
    title: 'Santuário Místico',
    description: 'Pixel com vista para o Santuário do Bom Jesus, um dos locais mais emblemáticos do Norte.',
    rarity: 'Incomum',
    color: '#4CAF50',
    views: 890,
    likes: 123,
    comments: 34,
    followers: 67,
    tags: ['braga', 'santuário', 'religioso', 'norte'],
    features: ['Santuário', 'Vista Panorâmica', 'Escadório'],
    isAuction: false,
    imageUrl: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Braga+Santuário',
    gpsCoords: { lat: 41.5518, lon: -8.4229 },
    lastPriceChange: '5 dias atrás'
  },
  {
    id: '5',
    x: 500,
    y: 400,
    region: 'Faro',
    price: 200,
    owner: 'BeachLover',
    ownerAvatar: 'https://placehold.co/40x40.png',
    title: 'Praia Dourada',
    description: 'Pixel na costa algarvia com acesso direto às praias mais belas de Portugal.',
    rarity: 'Raro',
    color: '#FFD700',
    views: 1567,
    likes: 267,
    comments: 78,
    followers: 134,
    tags: ['faro', 'praia', 'algarve', 'costa'],
    features: ['Praia', 'Costa Algarvia', 'Turismo'],
    isAuction: true,
    auctionEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    currentBid: 180,
    bidCount: 12,
    buyNowPrice: 250,
    imageUrl: 'https://placehold.co/300x200/FFD700/000000?text=Faro+Beach',
    gpsCoords: { lat: 37.0194, lon: -7.9322 },
    lastPriceChange: '1 dia atrás'
  }
];

const mockUserPixels: UserPixel[] = [
  {
    id: 'user1',
    x: 100,
    y: 50,
    region: 'Lisboa',
    price: 350,
    title: 'Meu Pixel Lisboa',
    description: 'Pixel personalizado na capital',
    rarity: 'Épico',
    color: '#D4A757',
    views: 1234,
    likes: 89,
    comments: 23,
    followers: 45,
    isForSale: true,
    offers: [
      {
        id: 'offer1',
        buyer: 'PixelBuyer123',
        buyerAvatar: 'https://placehold.co/40x40.png',
        amount: 320,
        message: 'Adorei este pixel! Aceita esta oferta?',
        timestamp: '2h atrás',
        status: 'pending'
      },
      {
        id: 'offer2',
        buyer: 'ArtCollector',
        buyerAvatar: 'https://placehold.co/40x40.png',
        amount: 300,
        timestamp: '1d atrás',
        status: 'pending'
      }
    ]
  },
  {
    id: 'user2',
    x: 200,
    y: 150,
    region: 'Porto',
    price: 250,
    title: 'Arte Porto',
    description: 'Pixel artístico no Porto',
    rarity: 'Raro',
    color: '#7DF9FF',
    views: 890,
    likes: 67,
    comments: 12,
    followers: 34,
    isForSale: true,
    offers: []
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<MarketplacePixel[]>(mockMarketplacePixels);
  const [userPixels, setUserPixels] = useState<UserPixel[]>(mockUserPixels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price' | 'views' | 'likes' | 'recent'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [followedPixels, setFollowedPixels] = useState<string[]>([]);
  const [bookmarkedPixels, setBookmarkedPixels] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  
  const { toast } = useToast();
  const { credits, specialCredits, isPremium, addCredits, removeCredits, addXp, addPixel } = useUserStore();

  // Filter and sort pixels
  const filteredPixels = pixels
    .filter(pixel => {
      const matchesSearch = !searchQuery || 
        pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRegion = selectedRegion === 'all' || pixel.region === selectedRegion;
      const matchesRarity = selectedRarity === 'all' || pixel.rarity === selectedRarity;
      const matchesPrice = pixel.price >= priceRange[0] && pixel.price <= priceRange[1];
      
      return matchesSearch && matchesRegion && matchesRarity && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'recent':
        default:
          return Math.random() - 0.5;
      }
    });

  const handlePixelClick = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
  };

  const handleBuyPixel = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowPurchaseModal(true);
  };

  const handleBidOnPixel = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowBidModal(true);
  };

  const handleMakeOffer = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowOfferModal(true);
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
    addXp(50);
    addPixel();
    setShowConfetti(true);
    setPlaySound(true);
    
    toast({
      title: "Pixel Comprado! 🎉",
      description: `Adquiriu &quot;${selectedPixel.title}&quot; por €${selectedPixel.price}. Recebeu 50 XP!`,
    });
    
    setShowPurchaseModal(false);
    setSelectedPixel(null);
  };

  const confirmBid = () => {
    if (!selectedPixel || !bidAmount) return;
    
    const bid = parseFloat(bidAmount);
    const minBid = (selectedPixel.currentBid || selectedPixel.price) + 10;
    
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

    setPlaySound(true);
    addXp(25);
    
    toast({
      title: "Lance Colocado! 🎯",
      description: `Lance de €${bid} registado com sucesso. Recebeu 25 XP!`,
    });
    
    setShowBidModal(false);
    setBidAmount('');
    setSelectedPixel(null);
  };

  const submitOffer = () => {
    if (!selectedPixel || !offerAmount) return;
    
    const offer = parseFloat(offerAmount);
    
    if (offer >= selectedPixel.price) {
      toast({
        title: "Oferta Muito Alta",
        description: "A oferta deve ser inferior ao preço de venda. Use 'Comprar' para pagar o preço total.",
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

    setPlaySound(true);
    addXp(15);
    
    toast({
      title: "Oferta Enviada! 💌",
      description: `Oferta de €${offer} enviada para ${selectedPixel.owner}. Recebeu 15 XP!`,
    });
    
    setShowOfferModal(false);
    setOfferAmount('');
    setOfferMessage('');
    setSelectedPixel(null);
  };

  const handleFollowPixel = (pixelId: string) => {
    const isFollowing = followedPixels.includes(pixelId);
    
    if (isFollowing) {
      setFollowedPixels(prev => prev.filter(id => id !== pixelId));
      toast({
        title: "Deixou de Seguir",
        description: "Não receberá mais notificações sobre este pixel.",
      });
    } else {
      setFollowedPixels(prev => [...prev, pixelId]);
      addXp(10);
      addCredits(5);
      setPlaySound(true);
      
      toast({
        title: "A Seguir Pixel! 👁️",
        description: "Receberá notificações sobre mudanças de preço. Recebeu 10 XP + 5 créditos!",
      });
    }
  };

  const handleAcceptOffer = (pixelId: string, offerId: string) => {
    const pixel = userPixels.find(p => p.id === pixelId);
    const offer = pixel?.offers.find(o => o.id === offerId);
    
    if (!pixel || !offer) return;
    
    const commission = isPremium ? 0.05 : 0.07;
    const finalAmount = Math.floor(offer.amount * (1 - commission));
    
    setUserPixels(prev => prev.map(p => 
      p.id === pixelId 
        ? { 
            ...p, 
            offers: p.offers.map(o => 
              o.id === offerId ? { ...o, status: 'accepted' as const } : o
            )
          }
        : p
    ));
    
    addCredits(finalAmount);
    addXp(100);
    setShowConfetti(true);
    setPlaySound(true);
    
    toast({
      title: "Oferta Aceite! 💰",
      description: `Vendeu &quot;${pixel.title}&quot; por €${offer.amount}. Recebeu €${finalAmount} (após comissão de ${Math.round(commission * 100)}%). +100 XP!`,
    });
  };

  const handleRejectOffer = (pixelId: string, offerId: string) => {
    const pixel = userPixels.find(p => p.id === pixelId);
    const offer = pixel?.offers.find(o => o.id === offerId);
    
    if (!pixel || !offer) return;
    
    setUserPixels(prev => prev.map(p => 
      p.id === pixelId 
        ? { 
            ...p, 
            offers: p.offers.map(o => 
              o.id === offerId ? { ...o, status: 'rejected' as const } : o
            )
          }
        : p
    ));
    
    toast({
      title: "Oferta Rejeitada",
      description: `Rejeitou a oferta de €${offer.amount} de ${offer.buyer}.`,
    });
  };

  const handlePromotePixel = (pixelId: string) => {
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
    setPlaySound(true);
    
    toast({
      title: "Pixel Promovido! 📢",
      description: "Seu pixel aparecerá em destaque por 24h. Recebeu 25 XP!",
    });
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

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'A terminar';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-3 px-2 sm:py-6 sm:px-4 space-y-4 sm:space-y-6 max-w-7xl mb-16">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-headline text-2xl sm:text-3xl text-gradient-gold flex items-center">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
              Marketplace de Pixels
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              Descubra, compre e venda pixels únicos no mapa de Portugal
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="browse" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-12">
            <TabsTrigger value="browse" className="text-xs sm:text-sm">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Explorar
            </TabsTrigger>
            <TabsTrigger value="auctions" className="text-xs sm:text-sm">
              <Gavel className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Leilões
            </TabsTrigger>
            <TabsTrigger value="my-sales" className="text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Minhas Vendas
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar pixels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="px-2 py-1 sm:px-3 sm:py-2 border border-input bg-background rounded-md text-xs sm:text-sm h-8 sm:h-10"
                    >
                      <option value="all">Todas as Regiões</option>
                      <option value="Lisboa">Lisboa</option>
                      <option value="Porto">Porto</option>
                      <option value="Coimbra">Coimbra</option>
                      <option value="Braga">Braga</option>
                      <option value="Faro">Faro</option>
                    </select>
                    
                    <select
                      value={selectedRarity}
                      onChange={(e) => setSelectedRarity(e.target.value)}
                      className="px-2 py-1 sm:px-3 sm:py-2 border border-input bg-background rounded-md text-xs sm:text-sm h-8 sm:h-10"
                    >
                      <option value="all">Todas as Raridades</option>
                      <option value="Comum">Comum</option>
                      <option value="Incomum">Incomum</option>
                      <option value="Raro">Raro</option>
                      <option value="Épico">Épico</option>
                      <option value="Lendário">Lendário</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-2 py-1 sm:px-3 sm:py-2 border border-input bg-background rounded-md text-xs sm:text-sm h-8 sm:h-10"
                    >
                      <option value="recent">Mais Recentes</option>
                      <option value="price">Preço</option>
                      <option value="views">Mais Vistos</option>
                      <option value="likes">Mais Curtidos</option>
                    </select>
                    
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      {viewMode === 'grid' ? 'Grade' : 'Lista'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pixels Grid */}
            <div className={cn(
              "grid gap-3 sm:gap-6",
              viewMode === 'grid' 
                ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {filteredPixels.map((pixel) => (
                <Card 
                  key={pixel.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <div className="relative">
                    <img 
                      src={pixel.imageUrl} 
                      alt={pixel.title}
                      className="w-full h-32 sm:h-48 object-cover"
                    />
                    
                    {/* Raridade - Canto Superior Esquerdo */}
                    <Badge className={cn("absolute top-2 left-2 text-xs", getRarityColor(pixel.rarity))}>
                      {pixel.rarity}
                    </Badge>
                    
                    {/* Leilão - Canto Superior Direito */}
                    {pixel.isAuction && pixel.auctionEndTime && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        {formatTimeLeft(pixel.auctionEndTime)}
                      </Badge>
                    )}
                    
                    {pixel.isPromoted && (
                      <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-primary to-accent text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Promovido
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{pixel.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {pixel.id ? `#${pixel.id}` : `(${pixel.x}, ${pixel.y})`} • {pixel.region}
                        </p>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {pixel.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.views > 1000 ? `${Math.floor(pixel.views/1000)}K` : pixel.views}
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
                          <span className="text-lg sm:text-xl font-bold text-primary">
                            €{pixel.price}
                          </span>
                          {pixel.specialCreditsPrice && (
                            <span className="text-xs sm:text-sm text-accent">
                              {pixel.specialCreditsPrice} especiais
                            </span>
                          )}
                        </div>
                        
                        {pixel.isAuction ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="min-h-[36px] text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBidOnPixel(pixel);
                              }}
                            >
                              <Gavel className="h-3 w-3 mr-1" />
                              Licitar
                            </Button>
                            {pixel.buyNowPrice && (
                              <Button 
                                size="sm"
                                className="min-h-[36px] text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyPixel(pixel);
                                }}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                €{pixel.buyNowPrice}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm"
                              className="min-h-[36px] text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyPixel(pixel);
                              }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Comprar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="min-h-[36px] text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMakeOffer(pixel);
                              }}
                            >
                              <Gift className="h-3 w-3 mr-1" />
                              Oferta
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Auctions Tab */}
          <TabsContent value="auctions" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPixels.filter(p => p.isAuction).map((pixel) => (
                <Card key={pixel.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src={pixel.imageUrl} 
                      alt={pixel.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    <Badge className={cn("absolute top-2 left-2", getRarityColor(pixel.rarity))}>
                      {pixel.rarity}
                    </Badge>
                    
                    {pixel.auctionEndTime && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                        {formatTimeLeft(pixel.auctionEndTime)}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{pixel.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pixel.id ? `#${pixel.id}` : `(${pixel.x}, ${pixel.y})`} • {pixel.region}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lance Atual:</span>
                        <span className="text-xl font-bold text-primary">
                          €{pixel.currentBid || pixel.price}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{pixel.bidCount || 0} lances</span>
                        <span>{pixel.views} visualizações</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBidOnPixel(pixel);
                          }}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Licitar
                        </Button>
                        {pixel.buyNowPrice && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyPixel(pixel);
                            }}
                          >
                            Comprar €{pixel.buyNowPrice}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Sales Tab */}
          <TabsContent value="my-sales" className="space-y-4 sm:space-y-6">
            {/* Sales Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="text-center p-3 sm:p-4">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-green-500">€1,247</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Vendido</div>
              </Card>
              
              <Card className="text-center p-3 sm:p-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-primary">{userPixels.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">À Venda</div>
              </Card>
              
              <Card className="text-center p-3 sm:p-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-blue-500">4.8</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
              </Card>
              
              <Card className="text-center p-3 sm:p-4">
                <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-accent">
                  {userPixels.reduce((total, pixel) => total + pixel.offers.filter(o => o.status === 'pending').length, 0)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Ofertas</div>
              </Card>
            </div>

            {/* User Pixels */}
            <div className="space-y-4">
              {userPixels.map((pixel) => (
                <Card key={pixel.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div 
                        className="w-full sm:w-24 h-24 rounded-lg flex items-center justify-center text-2xl font-bold"
                        style={{ backgroundColor: pixel.color }}
                      >
                        🎨
                      </div>
                      
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{pixel.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              ({pixel.x}, {pixel.y}) • {pixel.region}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRarityColor(pixel.rarity)}>
                              {pixel.rarity}
                            </Badge>
                            <span className="text-lg sm:text-xl font-bold text-primary">€{pixel.price}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                          <div>
                            <div className="text-sm sm:text-base font-bold">{pixel.views}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold">{pixel.likes}</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold">{pixel.comments}</div>
                            <div className="text-xs text-muted-foreground">Comentários</div>
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold">{pixel.followers}</div>
                            <div className="text-xs text-muted-foreground">Seguidores</div>
                          </div>
                        </div>
                        
                        {pixel.offers.filter(o => o.status === 'pending').length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Ofertas Pendentes:</h4>
                            {pixel.offers.filter(o => o.status === 'pending').map((offer) => (
                              <div key={offer.id} className="p-2 sm:p-3 bg-muted/30 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                      <AvatarImage src={offer.buyerAvatar} />
                                      <AvatarFallback className="text-xs">{offer.buyer[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-xs sm:text-sm">{offer.buyer}</div>
                                      <div className="text-xs text-muted-foreground">{offer.timestamp}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary text-sm sm:text-base">€{offer.amount}</span>
                                    <div className="flex gap-1 sm:gap-2">
                                      <Button 
                                        size="sm" 
                                        className="h-6 sm:h-8 px-2 sm:px-3 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAcceptOffer(pixel.id, offer.id);
                                        }}
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-6 sm:h-8 px-2 sm:px-3 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRejectOffer(pixel.id, offer.id);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                
                                {offer.message && (
                                  <p className="text-xs text-muted-foreground mt-2 italic">
                                    &quot;{offer.message}&quot;
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 min-h-[36px] text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromotePixel(pixel.id);
                            }}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Promover (50)
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="min-h-[36px] text-xs"
                          >
                            <Edit className="h-3 w-3" />
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
      </div>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              {selectedPixel && `Pixel &quot;${selectedPixel.title}&quot; em ${selectedPixel.region}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPixel && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Preço do Pixel:</span>
                  <span className="font-bold">€{selectedPixel.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seus Créditos:</span>
                  <span className={credits >= selectedPixel.price ? 'text-green-500' : 'text-red-500'}>
                    €{credits}
                  </span>
                </div>
                {credits < selectedPixel.price && (
                  <div className="flex justify-between text-red-500">
                    <span>Faltam:</span>
                    <span>€{selectedPixel.price - credits}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmPurchase}
                  disabled={credits < selectedPixel.price}
                  className="flex-1"
                >
                  Confirmar Compra
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
            <DialogTitle>Fazer Lance</DialogTitle>
            <DialogDescription>
              {selectedPixel && `Leilão: &quot;${selectedPixel.title}&quot;`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPixel && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Lance Atual:</span>
                  <span className="font-bold">€{selectedPixel.currentBid || selectedPixel.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lance Mínimo:</span>
                  <span className="text-primary">€{(selectedPixel.currentBid || selectedPixel.price) + 10}</span>
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
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowBidModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={confirmBid} className="flex-1">
                  Confirmar Lance
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Offer Modal */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fazer Oferta</DialogTitle>
            <DialogDescription>
              {selectedPixel && `Pixel "${selectedPixel.title}" por ${selectedPixel.owner}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPixel && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Preço Atual:</span>
                  <span className="font-bold">€{selectedPixel.price}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-amount">Sua Oferta (€)</Label>
                <Input
                  id="offer-amount"
                  type="number"
                  placeholder={`Máximo: ${selectedPixel.price - 1}`}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  max={selectedPixel.price - 1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer-message">Mensagem (opcional)</Label>
                <Textarea
                  id="offer-message"
                  placeholder="Adicione uma mensagem para o vendedor..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowOfferModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={submitOffer} className="flex-1">
                  Enviar Oferta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pixel Details Modal */}
      <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              {selectedPixel?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedPixel?.id ? `#${selectedPixel?.id}` : `(${selectedPixel?.x}, ${selectedPixel?.y})`} • {selectedPixel?.region}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPixel && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <img 
                  src={selectedPixel.imageUrl} 
                  alt={selectedPixel.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="font-bold">{selectedPixel.views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div>
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <div className="font-bold">{selectedPixel.likes}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div>
                    <MessageSquare className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="font-bold">{selectedPixel.comments}</div>
                    <div className="text-xs text-muted-foreground">Comentários</div>
                  </div>
                  <div>
                    <Users className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <div className="font-bold">{selectedPixel.followers}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Descrição</h4>
                  <p className="text-sm text-muted-foreground">{selectedPixel.description}</p>
                </div>
                
                {selectedPixel.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Características</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPixel.features.map(feature => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleFollowPixel(selectedPixel.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {followedPixels.includes(selectedPixel.id) ? 'A Seguir' : 'Seguir'}
                  </Button>
                  
                  {selectedPixel.gpsCoords && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${selectedPixel.gpsCoords!.lat},${selectedPixel.gpsCoords!.lon}&z=18&t=k`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Ver no Mapa
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}