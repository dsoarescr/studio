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
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, Filter, Search, SortAsc, Grid3X3, List, Heart, Eye,
  MapPin, Calendar, User, Share2, Download, Upload, Star, Crown,
  Gem, Sparkles, Award, Trophy, Target, Zap, Activity, Clock,
  BarChart3, PieChart, LineChart, TrendingUp, Globe, Settings,
  Bell, MessageSquare, Users, Palette, Coins, Gift, Flame,
  Rocket, Shield, Camera, Video, Music, Bookmark, Tag, Flag,
  AlertTriangle, CheckCircle, Info, Plus, Minus, X, Check,
  ArrowRight, ArrowLeft, ChevronUp, ChevronDown, ExternalLink,
  RefreshCw, Loader2, Play, Pause, Volume2, VolumeX, Mic,
  Phone, Mail, Globe as GlobeIcon, Link as LinkIcon, Copy,
  Scissors, Edit, Trash2, Archive, FolderOpen, Save, Printer
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  type: 'pixel' | 'collection' | 'nft' | 'tool' | 'theme';
  title: string;
  description: string;
  price: number;
  specialPrice?: number;
  coordinates?: { x: number; y: number };
  region?: string;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    sales: number;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  imageUrl: string;
  views: number;
  likes: number;
  isLiked: boolean;
  isWishlisted: boolean;
  tags: string[];
  createdAt: string;
  lastSale?: number;
  priceHistory: Array<{ date: string; price: number }>;
  isAuction: boolean;
  auctionEndTime?: string;
  currentBid?: number;
  bidCount?: number;
  isHot: boolean;
  isNew: boolean;
  discount?: number;
}

const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    type: 'pixel',
    title: 'Pixel Premium Lisboa Centro',
    description: 'Localização privilegiada no coração de Lisboa com vista para o Tejo',
    price: 250,
    specialPrice: 50,
    coordinates: { x: 245, y: 156 },
    region: 'Lisboa',
    seller: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.9,
      sales: 156
    },
    rarity: 'Lendário',
    imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Premium',
    views: 1234,
    likes: 89,
    isLiked: false,
    isWishlisted: true,
    tags: ['lisboa', 'centro', 'premium', 'vista-rio'],
    createdAt: '2024-03-15',
    lastSale: 200,
    priceHistory: [
      { date: '2024-01-01', price: 150 },
      { date: '2024-02-01', price: 180 },
      { date: '2024-03-01', price: 220 }
    ],
    isAuction: false,
    isHot: true,
    isNew: false,
    discount: 15
  },
  {
    id: '2',
    type: 'pixel',
    title: 'Arte Digital Porto',
    description: 'Pixel artístico na zona histórica do Porto',
    price: 180,
    coordinates: { x: 123, y: 89 },
    region: 'Porto',
    seller: {
      name: 'ArtistaPro',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      rating: 4.5,
      sales: 89
    },
    rarity: 'Épico',
    imageUrl: 'https://placehold.co/300x300/7DF9FF/000000?text=Porto+Art',
    views: 567,
    likes: 45,
    isLiked: true,
    isWishlisted: false,
    tags: ['porto', 'arte', 'histórico'],
    createdAt: '2024-03-10',
    priceHistory: [
      { date: '2024-02-01', price: 120 },
      { date: '2024-03-01', price: 150 }
    ],
    isAuction: true,
    auctionEndTime: '2024-03-20T18:00:00Z',
    currentBid: 165,
    bidCount: 12,
    isHot: false,
    isNew: true
  },
  {
    id: '3',
    type: 'collection',
    title: 'Coleção Paisagens de Portugal',
    description: 'Conjunto exclusivo de 25 pixels representando as mais belas paisagens portuguesas',
    price: 1200,
    specialPrice: 300,
    seller: {
      name: 'CollectorPro',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.8,
      sales: 234
    },
    rarity: 'Lendário',
    imageUrl: 'https://placehold.co/300x300/4CAF50/FFFFFF?text=Paisagens+PT',
    views: 2341,
    likes: 234,
    isLiked: false,
    isWishlisted: true,
    tags: ['coleção', 'paisagens', 'portugal', 'natureza'],
    createdAt: '2024-02-20',
    priceHistory: [
      { date: '2024-02-20', price: 1000 },
      { date: '2024-03-01', price: 1100 }
    ],
    isAuction: false,
    isHot: true,
    isNew: false,
    discount: 20
  }
];

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pixel' | 'collection' | 'nft' | 'tool' | 'theme'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular' | 'trending'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(['1', '3']);
  const [cart, setCart] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  
  const { toast } = useToast();
  const { credits, specialCredits, addCredits, addXp } = useUserStore();
  const router = useRouter();

  const categories = [
    { id: 'all', label: 'Todos', count: items.length },
    { id: 'pixel', label: 'Pixels', count: items.filter(i => i.type === 'pixel').length },
    { id: 'collection', label: 'Coleções', count: items.filter(i => i.type === 'collection').length },
    { id: 'nft', label: 'NFTs', count: items.filter(i => i.type === 'nft').length },
    { id: 'tool', label: 'Ferramentas', count: items.filter(i => i.type === 'tool').length },
    { id: 'theme', label: 'Temas', count: items.filter(i => i.type === 'theme').length }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRarity;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const handleToggleWishlist = (itemId: string) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isWishlisted: !item.isWishlisted }
        : item
    ));
  };

  const handleToggleLike = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            isLiked: !item.isLiked,
            likes: item.isLiked ? item.likes - 1 : item.likes + 1
          }
        : item
    ));
  };

  const handleAddToCart = (itemId: string) => {
    setCart(prev => [...prev, itemId]);
    toast({
      title: "Adicionado ao Carrinho",
      description: "Item adicionado com sucesso!",
    });
  };

  const handlePurchase = (item: MarketplaceItem) => {
    const finalPrice = item.specialPrice || item.price;
    
    if (credits >= finalPrice || (item.specialPrice && specialCredits >= item.specialPrice)) {
      setShowConfetti(true);
      setPlayPurchaseSound(true);
      
      addXp(50);
      
      toast({
        title: "Compra Realizada! 🎉",
        description: `${item.title} adquirido com sucesso!`,
      });
      
      // Redirect to pixel details or collection
      if (item.type === 'pixel' && item.coordinates) {
        router.push(`/?pixel=${item.coordinates.x},${item.coordinates.y}`);
      } else {
        router.push('/pixels');
      }
    } else {
      toast({
        title: "Créditos Insuficientes",
        description: "Você não tem créditos suficientes para esta compra.",
        variant: "destructive"
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
      case 'Incomum': return 'text-green-500 border-green-500/50 bg-green-500/10';
      case 'Raro': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      case 'Épico': return 'text-purple-500 border-purple-500/50 bg-purple-500/10';
      case 'Lendário': return 'text-amber-500 border-amber-500/50 bg-amber-500/10';
      default: return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl mb-16">
        {/* Enhanced Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold-animated flex items-center">
                  <ShoppingCart className="h-8 w-8 mr-3 animate-glow" />
                  Marketplace Premium
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Descubra, compre e venda pixels únicos no maior marketplace de arte digital de Portugal
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Seus Créditos</p>
                  <p className="text-xl font-bold text-primary">{credits.toLocaleString()}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Especiais</p>
                  <p className="text-xl font-bold text-accent">{specialCredits.toLocaleString()}</p>
                </div>
                <Link href="/premium">
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    <Crown className="h-4 w-4 mr-2" />
                    Comprar Créditos
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels, coleções, NFTs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {showFilters && <ChevronUp className="h-4 w-4" />}
                  <Link href="/tutorials">Guia do Marketplace</Link>
                </Button>
                <HelpCenter>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Suporte ao Cliente
                  </Button>
                </HelpCenter>
                <FeedbackSystem>
                  <Button variant="outline" className="flex-1">
                    <Flag className="h-4 w-4 mr-2" />
                    Reportar Problema
                  </Button>
                </FeedbackSystem>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="oldest">Mais Antigos</option>
                  <option value="price-low">Preço: Menor</option>
                  <option value="price-high">Preço: Maior</option>
                  <option value="popular">Mais Populares</option>
                  <option value="trending">Em Tendência</option>
                </select>
                
                <div className="flex border border-input rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Categoria</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label} ({cat.count})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Raridade</label>
                      <select
                        value={selectedRarity}
                        onChange={(e) => setSelectedRarity(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="all">Todas</option>
                        <option value="Comum">Comum</option>
                        <option value="Incomum">Incomum</option>
                        <option value="Raro">Raro</option>
                        <option value="Épico">Épico</option>
                        <option value="Lendário">Lendário</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Preço: {priceRange[0]}€ - {priceRange[1]}€
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Filtros Rápidos</label>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                          <Flame className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Novo
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                          <Trophy className="h-3 w-3 mr-1" />
                          Leilão
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id as any)}
              className="flex items-center gap-2"
            >
              {category.label}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Marketplace Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge className={getRarityColor(item.rarity)}>
                        {item.rarity}
                      </Badge>
                      {item.isHot && (
                        <Badge className="bg-red-500 animate-pulse">
                          <Flame className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      {item.isNew && (
                        <Badge className="bg-green-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Novo
                        </Badge>
                      )}
                      {item.discount && (
                        <Badge className="bg-orange-500">
                          -{item.discount}%
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 hover:bg-background"
                        onClick={() => handleToggleWishlist(item.id)}
                      >
                        <Heart className={`h-4 w-4 ${item.isWishlisted ? 'text-red-500 fill-current' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 hover:bg-background"
                        onClick={() => handleToggleLike(item.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 hover:bg-background"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Auction Timer */}
                    {item.isAuction && item.auctionEndTime && (
                      <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Termina em 2h 30m
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.seller.avatar} />
                        <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{item.seller.name}</span>
                      {item.seller.verified && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {item.coordinates && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>({item.coordinates.x}, {item.coordinates.y}) - {item.region}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {item.likes}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(item.seller.rating) ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} 
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({item.seller.sales})
                        </span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {item.specialPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {item.specialPrice} <Gem className="h-4 w-4 inline" />
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {item.price}€
                            </span>
                          </div>
                        ) : item.isAuction ? (
                          <div>
                            <span className="text-lg font-bold text-primary">
                              {item.currentBid}€
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {item.bidCount} lances
                            </p>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {item.price}€
                          </span>
                        )}
                      </div>
                      
                      {item.lastSale && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Última venda</p>
                          <p className="text-sm font-medium">{item.lastSale}€</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    {item.isAuction ? (
                      <Button className="flex-1" onClick={() => handlePurchase(item)}>
                        <Trophy className="h-4 w-4 mr-2" />
                        Licitar
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleAddToCart(item.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Carrinho
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handlePurchase(item)}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Comprar
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge className={getRarityColor(item.rarity)}>
                            {item.rarity}
                          </Badge>
                          {item.isHot && (
                            <Badge className="bg-red-500">Hot</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.seller.name}
                          </span>
                          {item.coordinates && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              ({item.coordinates.x}, {item.coordinates.y})
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary mb-2">
                          {item.specialPrice ? (
                            <div className="flex items-center gap-2">
                              <span>{item.specialPrice} <Gem className="h-4 w-4 inline" /></span>
                              <span className="text-sm text-muted-foreground line-through">
                                {item.price}€
                              </span>
                            </div>
                          ) : (
                            <span>{item.price}€</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleWishlist(item.id)}
                          >
                            <Heart className={`h-4 w-4 ${item.isWishlisted ? 'text-red-500 fill-current' : ''}`} />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToCart(item.id)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handlePurchase(item)}
                          >
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="text-center p-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum item encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou pesquisar por outros termos.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRarity('all');
            }}>
              Limpar Filtros
            </Button>
          </Card>
        )}

        {/* Floating Cart */}
        {cart.length > 0 && (
          <div className="fixed bottom-20 right-4 z-50">
            <Card className="bg-card/90 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-medium">{cart.length} itens no carrinho</span>
                  <Button size="sm">
                    Ver Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}