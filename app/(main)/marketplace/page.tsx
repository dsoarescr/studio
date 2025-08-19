'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, MapPin, Eye, Heart, Star, Crown, Gem, Sparkles, 
  TrendingUp, TrendingDown, Filter, Search, SortAsc, Grid3X3,
  List, Coins, Gift, Award, Clock, Calendar, Users, Share2,
  MessageSquare, ThumbsUp, Bookmark, ExternalLink, Info, 
  AlertTriangle, CheckCircle, X, Plus, Minus, RefreshCw,
  Target, Zap, Flame, Trophy, Shield, Globe, Navigation,
  Camera, Upload, Download, Settings, Bell, User, CreditCard,
  Package, Tag, Percent, DollarSign, Euro, TrendingDown as Decrease
} from "lucide-react";
import { cn } from '@/lib/utils';

// Types
interface MarketplacePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  color: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    premium: boolean;
    level: number;
    rating: number;
    totalSales: number;
  };
  stats: {
    views: number;
    likes: number;
    watchers: number;
    comments: number;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  features: string[];
  tags: string[];
  listedDate: string;
  lastPriceChange?: string;
  priceHistory: Array<{ price: number; date: string }>;
  isFeatured: boolean;
  isHot: boolean;
  isNew: boolean;
  acquisitionDate: string;
  imageUrl: string;
  gpsCoords?: { lat: number; lon: number };
}

interface SellPixelData {
  pixelId: string;
  x: number;
  y: number;
  region: string;
  color: string;
  currentTitle?: string;
  currentDescription?: string;
}

// Mock Data
const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    color: '#D4A757',
    title: 'Vista Premium do Tejo',
    description: 'Pixel exclusivo com vista privilegiada para o Rio Tejo no coração de Lisboa. Localização histórica com grande potencial de valorização.',
    price: 450,
    originalPrice: 300,
    seller: {
      id: 'seller1',
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      premium: true,
      level: 25,
      rating: 4.9,
      totalSales: 156
    },
    stats: {
      views: 1234,
      likes: 89,
      watchers: 23,
      comments: 45
    },
    rarity: 'Lendário',
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade', 'Zona Turística'],
    tags: ['lisboa', 'tejo', 'premium', 'histórico'],
    listedDate: '2024-03-15',
    lastPriceChange: '2024-03-14',
    priceHistory: [
      { price: 300, date: '2024-03-10' },
      { price: 380, date: '2024-03-12' },
      { price: 450, date: '2024-03-14' }
    ],
    isFeatured: true,
    isHot: true,
    isNew: false,
    acquisitionDate: '2024-01-15',
    imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa+Premium',
    gpsCoords: { lat: 38.7223, lon: -9.1393 }
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    color: '#7DF9FF',
    title: 'Arte Ribeirinha',
    description: 'Pixel artístico na zona ribeirinha do Porto, perfeito para colecionadores de arte digital.',
    price: 280,
    originalPrice: 280,
    seller: {
      id: 'seller2',
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      premium: false,
      level: 18,
      rating: 4.6,
      totalSales: 89
    },
    stats: {
      views: 567,
      likes: 34,
      watchers: 12,
      comments: 18
    },
    rarity: 'Épico',
    features: ['Zona Ribeirinha', 'Património UNESCO', 'Arte Local'],
    tags: ['porto', 'ribeira', 'arte', 'unesco'],
    listedDate: '2024-03-16',
    priceHistory: [{ price: 280, date: '2024-03-16' }],
    isFeatured: false,
    isHot: false,
    isNew: true,
    acquisitionDate: '2024-02-20',
    imageUrl: 'https://placehold.co/200x200/7DF9FF/000000?text=Porto+Art',
    gpsCoords: { lat: 41.1579, lon: -8.6291 }
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    color: '#9C27B0',
    title: 'Universidade Histórica',
    description: 'Pixel na zona universitária de Coimbra, ideal para investidores em educação e cultura.',
    price: 180,
    originalPrice: 200,
    seller: {
      id: 'seller3',
      name: 'CoimbraInvestor',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      premium: true,
      level: 22,
      rating: 4.8,
      totalSales: 234
    },
    stats: {
      views: 890,
      likes: 67,
      watchers: 18,
      comments: 29
    },
    rarity: 'Raro',
    features: ['Zona Universitária', 'Património Mundial', 'Centro Cultural'],
    tags: ['coimbra', 'universidade', 'cultura', 'educação'],
    listedDate: '2024-03-14',
    lastPriceChange: '2024-03-15',
    priceHistory: [
      { price: 200, date: '2024-03-14' },
      { price: 180, date: '2024-03-15' }
    ],
    isFeatured: false,
    isHot: false,
    isNew: false,
    acquisitionDate: '2024-01-28',
    imageUrl: 'https://placehold.co/200x200/9C27B0/FFFFFF?text=Coimbra+Uni'
  }
];

const mockUserPixels = [
  {
    id: 'user1',
    x: 400,
    y: 300,
    region: 'Braga',
    color: '#4CAF50',
    title: 'Meu Pixel em Braga',
    description: 'Pixel personalizado na bela cidade de Braga',
    acquisitionDate: '2024-02-10',
    currentValue: 120,
    originalPrice: 80
  },
  {
    id: 'user2',
    x: 500,
    y: 400,
    region: 'Faro',
    color: '#FF9800',
    title: 'Algarve Dourado',
    description: 'Pixel na costa algarvia com vista para o mar',
    acquisitionDate: '2024-03-01',
    currentValue: 200,
    originalPrice: 150
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<MarketplacePixel[]>(mockMarketplacePixels);
  const [userPixels, setUserPixels] = useState(mockUserPixels);
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  const [sellPixelData, setSellPixelData] = useState<SellPixelData | null>(null);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Sell Modal States
  const [sellPrice, setSellPrice] = useState('');
  const [sellTitle, setSellTitle] = useState('');
  const [sellDescription, setSellDescription] = useState('');
  const [sellTags, setSellTags] = useState('');
  const [isFeaturedListing, setIsFeaturedListing] = useState(false);
  
  // Purchase Modal States
  const [purchaseMethod, setPurchaseMethod] = useState<'credits' | 'special' | 'mixed'>('credits');
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  
  // Effects and Sounds
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { credits, specialCredits, addCredits, removeCredits, addSpecialCredits, removeSpecialCredits, addXp, addPixel } = useUserStore();

  // Filter pixels based on search and filters
  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRegion = selectedRegion === 'all' || pixel.region === selectedRegion;
    const matchesPrice = pixel.price >= priceRange[0] && pixel.price <= priceRange[1];
    const matchesRarity = selectedRarity === 'all' || pixel.rarity === selectedRarity;
    const matchesFeatured = !showFeaturedOnly || pixel.isFeatured;
    
    return matchesSearch && matchesRegion && matchesPrice && matchesRarity && matchesFeatured;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      case 'popular':
        return b.stats.views - a.stats.views;
      case 'featured':
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      default:
        return 0;
    }
  });

  const regions = ['all', 'Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro', 'Évora'];
  const rarities = ['all', 'Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'];

  // Handle pixel click to view details
  const handlePixelClick = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
    
    // Increment views
    setPixels(prev => prev.map(p => 
      p.id === pixel.id 
        ? { ...p, stats: { ...p.stats, views: p.stats.views + 1 } }
        : p
    ));
  };

  // Handle sell pixel
  const handleSellPixel = (pixelData: SellPixelData) => {
    setSellPixelData(pixelData);
    setSellTitle(pixelData.currentTitle || `Pixel (${pixelData.x}, ${pixelData.y})`);
    setSellDescription(pixelData.currentDescription || `Pixel exclusivo em ${pixelData.region}`);
    setShowSellModal(true);
  };

  // Submit pixel for sale
  const handleSubmitSale = () => {
    if (!sellPixelData || !sellPrice || !sellTitle.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Preencha o preço e título do pixel.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(sellPrice);
    if (price <= 0) {
      toast({
        title: "Preço Inválido",
        description: "O preço deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }

    // Calculate platform fee
    const isPremium = true; // Mock user premium status
    const platformFee = isPremium ? 0.05 : 0.07;
    const feeAmount = price * platformFee;
    const sellerReceives = price - feeAmount;

    const newMarketplacePixel: MarketplacePixel = {
      id: Date.now().toString(),
      x: sellPixelData.x,
      y: sellPixelData.y,
      region: sellPixelData.region,
      color: sellPixelData.color,
      title: sellTitle,
      description: sellDescription,
      price: price,
      originalPrice: price,
      seller: {
        id: 'currentUser',
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        verified: true,
        premium: isPremium,
        level: 15,
        rating: 4.8,
        totalSales: 12
      },
      stats: {
        views: 0,
        likes: 0,
        watchers: 0,
        comments: 0
      },
      rarity: 'Raro',
      features: [],
      tags: sellTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      listedDate: new Date().toISOString().split('T')[0],
      priceHistory: [{ price: price, date: new Date().toISOString().split('T')[0] }],
      isFeatured: isFeaturedListing,
      isHot: false,
      isNew: true,
      acquisitionDate: '2024-02-01',
      imageUrl: `https://placehold.co/200x200/${sellPixelData.color.replace('#', '')}/FFFFFF?text=${sellPixelData.region}`,
      gpsCoords: { lat: 38.7223, lon: -9.1393 }
    };

    setPixels(prev => [newMarketplacePixel, ...prev]);
    
    // Remove from user pixels
    setUserPixels(prev => prev.filter(p => p.id !== sellPixelData.pixelId));
    
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    toast({
      title: "Pixel Colocado à Venda! 🎉",
      description: `Receberá €${sellerReceives.toFixed(2)} (taxa: €${feeAmount.toFixed(2)}) quando vendido.`,
    });
    
    // Reset form
    setSellPrice('');
    setSellTitle('');
    setSellDescription('');
    setSellTags('');
    setIsFeaturedListing(false);
    setShowSellModal(false);
    setSellPixelData(null);
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!selectedPixel || !user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para comprar pixels.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPurchase(true);
    
    // Check if user has enough credits
    const price = selectedPixel.price;
    const hasEnoughCredits = credits >= price;
    const hasEnoughSpecial = specialCredits >= Math.floor(price / 2);
    const canAffordMixed = (credits + specialCredits * 2) >= price;

    if (purchaseMethod === 'credits' && !hasEnoughCredits) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${price - credits} créditos adicionais.`,
        variant: "destructive"
      });
      setIsProcessingPurchase(false);
      return;
    }

    // Simulate purchase process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Process payment based on method
    if (purchaseMethod === 'credits') {
      removeCredits(price);
    } else if (purchaseMethod === 'special') {
      removeSpecialCredits(Math.floor(price / 2));
    } else {
      // Mixed payment
      const specialUsed = Math.min(specialCredits, Math.floor(price / 2));
      const creditsUsed = price - (specialUsed * 2);
      removeSpecialCredits(specialUsed);
      removeCredits(creditsUsed);
    }

    // Calculate seller payment (minus platform fee)
    const isPremiumSeller = selectedPixel.seller.premium;
    const platformFee = isPremiumSeller ? 0.05 : 0.07;
    const sellerReceives = price * (1 - platformFee);

    // Add pixel to user collection
    addPixel();
    addXp(50);

    // Remove from marketplace
    setPixels(prev => prev.filter(p => p.id !== selectedPixel.id));
    
    setShowConfetti(true);
    setPlayPurchaseSound(true);
    
    toast({
      title: "Pixel Comprado! 🎉",
      description: `${selectedPixel.title} agora é seu! Recebeu 50 XP.`,
    });
    
    setIsProcessingPurchase(false);
    setShowPurchaseModal(false);
    setShowPixelModal(false);
  };

  // Handle like pixel
  const handleLikePixel = (pixelId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir pixels.",
        variant: "destructive"
      });
      return;
    }

    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, stats: { ...pixel.stats, likes: pixel.stats.likes + 1 } }
        : pixel
    ));
    
    addXp(5);
    addCredits(2);
    
    toast({
      title: "❤️ Pixel Curtido!",
      description: "Recebeu 5 XP + 2 créditos!",
    });
  };

  // Handle watch pixel
  const handleWatchPixel = (pixelId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para seguir pixels.",
        variant: "destructive"
      });
      return;
    }

    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, stats: { ...pixel.stats, watchers: pixel.stats.watchers + 1 } }
        : pixel
    ));
    
    toast({
      title: "👁️ A Seguir Pixel!",
      description: "Receberá notificações sobre este pixel.",
    });
  };

  // Get rarity color
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

  // Format price change
  const formatPriceChange = (current: number, original: number) => {
    const change = ((current - original) / original) * 100;
    const isPositive = change > 0;
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive,
      color: isPositive ? 'text-green-500' : 'text-red-500',
      icon: isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{filteredPixels.length}</div>
                  <div className="text-xs text-muted-foreground">Pixels à Venda</div>
                </div>
                <Button 
                  onClick={() => setShowSellModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Vender Pixel
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels por título, região, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Região</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>
                          {region === 'all' ? 'Todas as Regiões' : region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Raridade</Label>
                  <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rarities.map(rarity => (
                        <SelectItem key={rarity} value={rarity}>
                          {rarity === 'all' ? 'Todas as Raridades' : rarity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destaques</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                      <SelectItem value="popular">Mais Populares</SelectItem>
                      <SelectItem value="price_low">Preço: Menor</SelectItem>
                      <SelectItem value="price_high">Preço: Maior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Visualização</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="flex-1"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="flex-1"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Faixa de Preço</Label>
                  <span className="text-sm text-muted-foreground">
                    €{priceRange[0]} - €{priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showFeaturedOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Apenas Destaques
                </Button>
                <Button variant="outline" size="sm">
                  <Flame className="h-4 w-4 mr-2" />
                  Em Alta
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Novos
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Preço Reduzido
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Grid/List */}
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
        )}>
          <AnimatePresence>
            {filteredPixels.map((pixel, index) => (
              <motion.div
                key={pixel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden",
                    pixel.isFeatured && "border-primary/50 shadow-primary/20",
                    viewMode === 'list' && "flex"
                  )}
                  onClick={() => handlePixelClick(pixel)}
                >
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {pixel.isFeatured && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                    {pixel.isHot && (
                      <Badge className="bg-red-500 text-white">
                        <Flame className="h-3 w-3 mr-1" />
                        Em Alta
                      </Badge>
                    )}
                    {pixel.isNew && (
                      <Badge className="bg-green-500 text-white">
                        Novo
                      </Badge>
                    )}
                  </div>

                  {/* Pixel Image */}
                  <div className={cn(
                    "relative overflow-hidden",
                    viewMode === 'grid' ? "aspect-square" : "w-32 h-32 flex-shrink-0"
                  )}>
                    <div 
                      className="w-full h-full flex items-center justify-center text-4xl font-bold"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    {/* Rarity Badge */}
                    <Badge className={cn("absolute top-2 right-2", getRarityColor(pixel.rarity))}>
                      {pixel.rarity}
                    </Badge>

                    {/* Price Change Indicator */}
                    {pixel.originalPrice !== pixel.price && (
                      <div className="absolute bottom-2 right-2">
                        {(() => {
                          const change = formatPriceChange(pixel.price, pixel.originalPrice);
                          return (
                            <Badge className={cn("text-xs", change.color)}>
                              {change.icon}
                              {change.percentage}%
                            </Badge>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg line-clamp-1">{pixel.title}</CardTitle>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">€{pixel.price}</div>
                          {pixel.originalPrice !== pixel.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              €{pixel.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          ({pixel.x}, {pixel.y}) • {pixel.region}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {pixel.description}
                      </p>

                      {/* Features */}
                      {pixel.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {pixel.features.slice(0, 2).map(feature => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {pixel.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{pixel.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Seller Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={pixel.seller.avatar} />
                          <AvatarFallback>{pixel.seller.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{pixel.seller.name}</span>
                        {pixel.seller.verified && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                        {pixel.seller.premium && (
                          <Crown className="h-3 w-3 text-amber-500" />
                        )}
                        <Badge variant="outline" className="text-xs ml-auto">
                          ⭐ {pixel.seller.rating}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.stats.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {pixel.stats.watchers}
                          </span>
                        </div>
                        <span>{pixel.listedDate}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePixel(pixel.id);
                          }}
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Curtir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWatchPixel(pixel.id);
                          }}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Seguir
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPixel(pixel);
                            setShowPurchaseModal(true);
                          }}
                          className="flex-1 bg-gradient-to-r from-primary to-accent"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Comprar
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPixels.length === 0 && (
          <Card className="text-center p-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum Pixel Encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou pesquisar por outros termos.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedRegion('all');
              setSelectedRarity('all');
              setPriceRange([0, 1000]);
              setShowFeaturedOnly(false);
            }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </Card>
        )}
      </div>

      {/* Pixel Details Modal */}
      <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
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
                <DialogDescription>
                  Pixel ({selectedPixel.x}, {selectedPixel.y}) em {selectedPixel.region}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[70vh]">
                <div className="p-6 space-y-6">
                  {/* Pixel Image and Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div 
                        className="w-full aspect-square rounded-lg border-2 border-primary/30 flex items-center justify-center text-6xl shadow-lg"
                        style={{ backgroundColor: selectedPixel.color }}
                      >
                        🎨
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                          <div className="font-bold">{selectedPixel.stats.views.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                          <div className="font-bold">{selectedPixel.stats.likes}</div>
                          <div className="text-xs text-muted-foreground">Likes</div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <Users className="h-5 w-5 text-green-500 mx-auto mb-1" />
                          <div className="font-bold">{selectedPixel.stats.watchers}</div>
                          <div className="text-xs text-muted-foreground">Seguidores</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Price Info */}
                      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary mb-2">
                              €{selectedPixel.price}
                            </div>
                            {selectedPixel.originalPrice !== selectedPixel.price && (
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm text-muted-foreground line-through">
                                  €{selectedPixel.originalPrice}
                                </span>
                                {(() => {
                                  const change = formatPriceChange(selectedPixel.price, selectedPixel.originalPrice);
                                  return (
                                    <Badge className={change.color}>
                                      {change.icon}
                                      {change.percentage}%
                                    </Badge>
                                  );
                                })()}
                              </div>
                            )}
                            
                            {/* Platform Fee Info */}
                            <div className="mt-3 p-2 bg-background/50 rounded text-xs">
                              <div className="flex justify-between">
                                <span>Preço do Pixel:</span>
                                <span>€{selectedPixel.price}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Taxa da Plataforma ({selectedPixel.seller.premium ? '5%' : '7%'}):</span>
                                <span>€{(selectedPixel.price * (selectedPixel.seller.premium ? 0.05 : 0.07)).toFixed(2)}</span>
                              </div>
                              <Separator className="my-1" />
                              <div className="flex justify-between font-medium">
                                <span>Vendedor Recebe:</span>
                                <span>€{(selectedPixel.price * (1 - (selectedPixel.seller.premium ? 0.05 : 0.07))).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Seller Info */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={selectedPixel.seller.avatar} />
                              <AvatarFallback>{selectedPixel.seller.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{selectedPixel.seller.name}</span>
                                {selectedPixel.seller.verified && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                {selectedPixel.seller.premium && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Nível {selectedPixel.seller.level}</span>
                                <span>•</span>
                                <span>⭐ {selectedPixel.seller.rating}</span>
                                <span>•</span>
                                <span>{selectedPixel.seller.totalSales} vendas</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contactar
                            </Button>
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4 mr-2" />
                              Ver Perfil
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Description and Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Descrição</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedPixel.description}
                      </p>
                    </div>

                    {/* Features */}
                    {selectedPixel.features.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Características</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPixel.features.map(feature => (
                            <Badge key={feature} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedPixel.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPixel.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price History */}
                    <div>
                      <h3 className="font-semibold mb-2">Histórico de Preços</h3>
                      <div className="space-y-2">
                        {selectedPixel.priceHistory.map((entry, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{entry.date}</span>
                            <span className="font-medium">€{entry.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Listado em:</span>
                        <div className="font-medium">{selectedPixel.listedDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Adquirido em:</span>
                        <div className="font-medium">{selectedPixel.acquisitionDate}</div>
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    {selectedPixel.gpsCoords && (
                      <div>
                        <h3 className="font-semibold mb-2">Localização Real</h3>
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="text-sm">
                            <div className="font-mono">
                              {selectedPixel.gpsCoords.lat.toFixed(4)}, {selectedPixel.gpsCoords.lon.toFixed(4)}
                            </div>
                            <div className="text-muted-foreground">Coordenadas GPS</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${selectedPixel.gpsCoords!.lat},${selectedPixel.gpsCoords!.lon}&z=18`;
                              window.open(url, '_blank');
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Ver no Mapa
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/pixel/${selectedPixel.x}-${selectedPixel.y}`);
                        toast({
                          title: "Link Copiado!",
                          description: "Link do pixel copiado para a área de transferência.",
                        });
                      }}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar
                    </Button>
                    <Button
                      onClick={() => {
                        setShowPixelModal(false);
                        setShowPurchaseModal(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-primary to-accent"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar por €{selectedPixel.price}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sell Pixel Modal */}
      <Dialog open={showSellModal} onOpenChange={setShowSellModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-green-500" />
              Vender Pixel
            </DialogTitle>
            <DialogDescription>
              Coloque o seu pixel à venda no marketplace
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Select Pixel to Sell */}
            <div className="space-y-2">
              <Label>Escolher Pixel para Vender</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {userPixels.map(pixel => (
                  <Card 
                    key={pixel.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      sellPixelData?.pixelId === pixel.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => setSellPixelData({
                      pixelId: pixel.id,
                      x: pixel.x,
                      y: pixel.y,
                      region: pixel.region,
                      color: pixel.color,
                      currentTitle: pixel.title,
                      currentDescription: pixel.description
                    })}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded border flex items-center justify-center text-lg"
                          style={{ backgroundColor: pixel.color }}
                        >
                          🎨
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{pixel.title}</div>
                          <div className="text-sm text-muted-foreground">
                            ({pixel.x}, {pixel.y}) • {pixel.region}
                          </div>
                          <div className="text-xs text-green-500">
                            Valor atual: €{pixel.currentValue}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {sellPixelData && (
              <>
                <Separator />
                
                {/* Listing Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sell-title">Título da Listagem</Label>
                    <Input
                      id="sell-title"
                      value={sellTitle}
                      onChange={(e) => setSellTitle(e.target.value)}
                      placeholder="Ex: Pixel Premium em Lisboa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sell-description">Descrição</Label>
                    <Textarea
                      id="sell-description"
                      value={sellDescription}
                      onChange={(e) => setSellDescription(e.target.value)}
                      placeholder="Descreva as características especiais do seu pixel..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sell-price">Preço (€)</Label>
                    <Input
                      id="sell-price"
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {sellPrice && (
                      <div className="text-xs text-muted-foreground">
                        Taxa da plataforma: €{(parseFloat(sellPrice) * 0.07).toFixed(2)} (7%)
                        <br />
                        Receberá: €{(parseFloat(sellPrice) * 0.93).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sell-tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="sell-tags"
                      value={sellTags}
                      onChange={(e) => setSellTags(e.target.value)}
                      placeholder="Ex: premium, lisboa, vista, histórico"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Listagem em Destaque</Label>
                      <p className="text-xs text-muted-foreground">+€5 para destacar (mais visibilidade)</p>
                    </div>
                    <Switch 
                      checked={isFeaturedListing} 
                      onCheckedChange={setIsFeaturedListing} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSellModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmitSale}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Colocar à Venda
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="max-w-md">
          {selectedPixel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                  Comprar Pixel
                </DialogTitle>
                <DialogDescription>
                  {selectedPixel.title} por €{selectedPixel.price}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Pixel Preview */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-16 h-16 rounded border flex items-center justify-center text-2xl"
                        style={{ backgroundColor: selectedPixel.color }}
                      >
                        🎨
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{selectedPixel.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                        </div>
                        <Badge className={getRarityColor(selectedPixel.rarity)}>
                          {selectedPixel.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Método de Pagamento</Label>
                  
                  <div className="space-y-2">
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all",
                        purchaseMethod === 'credits' && "border-primary bg-primary/5"
                      )}
                      onClick={() => setPurchaseMethod('credits')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary" />
                            <span className="font-medium">Créditos Normais</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">€{selectedPixel.price}</div>
                            <div className="text-xs text-muted-foreground">
                              Saldo: {credits.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card 
                      className={cn(
                        "cursor-pointer transition-all",
                        purchaseMethod === 'special' && "border-accent bg-accent/5"
                      )}
                      onClick={() => setPurchaseMethod('special')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-accent" />
                            <span className="font-medium">Créditos Especiais</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{Math.floor(selectedPixel.price / 2)} especiais</div>
                            <div className="text-xs text-muted-foreground">
                              Saldo: {specialCredits.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Purchase Summary */}
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Resumo da Compra</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Preço do Pixel:</span>
                        <span>€{selectedPixel.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Método de Pagamento:</span>
                        <span>
                          {purchaseMethod === 'credits' ? 'Créditos Normais' : 
                           purchaseMethod === 'special' ? 'Créditos Especiais' : 'Misto'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>
                          {purchaseMethod === 'credits' ? `€${selectedPixel.price}` :
                           purchaseMethod === 'special' ? `${Math.floor(selectedPixel.price / 2)} especiais` :
                           'Pagamento misto'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Purchase Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handlePurchase}
                    disabled={isProcessingPurchase}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    {isProcessingPurchase ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}