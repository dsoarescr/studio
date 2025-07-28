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
import { SoundEffect, SOUND_EFFECTS } from "@/components/ui/sound-effect";
import { motion } from "framer-motion";
import {
  ShoppingCart, Search, Filter, SortAsc, MapPin, Star, Heart, Eye,
  TrendingUp, TrendingDown, Clock, User, Coins, Gift, Gem, Crown,
  Palette, Image as ImageIcon, Video, Music, Sparkles, Flame, Zap,
  Target, Award, Shield, Globe, Calendar, BarChart3, PieChart,
  ArrowUpRight, ArrowDownLeft, Plus, Minus, X, Check, Info,
  ExternalLink, Share2, Bookmark, Tag, Download, Upload, RefreshCw
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  type: 'pixel' | 'collection' | 'tool' | 'theme' | 'animation';
  title: string;
  description: string;
  price: number;
  specialPrice?: number;
  originalPrice?: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
  };
  coordinates?: { x: number; y: number };
  region?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  views: number;
  likes: number;
  sales: number;
  createdAt: string;
  featured: boolean;
  onSale: boolean;
  discount?: number;
  thumbnail: string;
  category: string;
}

const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    type: 'pixel',
    title: 'Pixel Premium em Lisboa Centro',
    description: 'Pixel localizado no coração de Lisboa, área histórica com alta visibilidade.',
    price: 250,
    specialPrice: 50,
    originalPrice: 300,
    seller: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.9
    },
    coordinates: { x: 245, y: 156 },
    region: 'Lisboa',
    rarity: 'epic',
    tags: ['centro', 'histórico', 'premium'],
    views: 1234,
    likes: 89,
    sales: 12,
    createdAt: '2024-03-10T10:00:00Z',
    featured: true,
    onSale: true,
    discount: 17,
    thumbnail: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Lisboa+Centro',
    category: 'Pixels Premium'
  },
  {
    id: '2',
    type: 'collection',
    title: 'Coleção Paisagens de Portugal',
    description: 'Uma coleção única de 25 pixels representando as mais belas paisagens portuguesas.',
    price: 1500,
    specialPrice: 300,
    seller: {
      name: 'ArtistaNatural',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      rating: 4.7
    },
    rarity: 'legendary',
    tags: ['paisagem', 'portugal', 'natureza', 'coleção'],
    views: 2156,
    likes: 156,
    sales: 3,
    createdAt: '2024-03-08T14:30:00Z',
    featured: true,
    onSale: false,
    thumbnail: 'https://placehold.co/300x200/7DF9FF/000000?text=Paisagens+PT',
    category: 'Coleções'
  },
  {
    id: '3',
    type: 'tool',
    title: 'Pincel Mágico Pro',
    description: 'Ferramenta avançada de edição com efeitos especiais e filtros únicos.',
    price: 99,
    specialPrice: 20,
    seller: {
      name: 'DevTools',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.8
    },
    rarity: 'rare',
    tags: ['ferramenta', 'edição', 'pro', 'efeitos'],
    views: 876,
    likes: 67,
    sales: 45,
    createdAt: '2024-03-12T09:15:00Z',
    featured: false,
    onSale: true,
    discount: 20,
    thumbnail: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Pincel+Pro',
    category: 'Ferramentas'
  },
  {
    id: '4',
    type: 'theme',
    title: 'Tema Neon Cyberpunk',
    description: 'Tema futurista com cores neon e efeitos cyberpunk para sua interface.',
    price: 49,
    seller: {
      name: 'ThemeDesigner',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      rating: 4.6
    },
    rarity: 'uncommon',
    tags: ['tema', 'neon', 'cyberpunk', 'futurista'],
    views: 543,
    likes: 34,
    sales: 23,
    createdAt: '2024-03-11T16:45:00Z',
    featured: false,
    onSale: false,
    thumbnail: 'https://placehold.co/300x200/FF0080/FFFFFF?text=Neon+Theme',
    category: 'Temas'
  },
  {
    id: '5',
    type: 'animation',
    title: 'Pack de Animações Épicas',
    description: 'Conjunto de 10 animações profissionais para dar vida aos seus pixels.',
    price: 199,
    specialPrice: 40,
    seller: {
      name: 'AnimationStudio',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      rating: 4.9
    },
    rarity: 'epic',
    tags: ['animação', 'pack', 'profissional', 'efeitos'],
    views: 1876,
    likes: 123,
    sales: 18,
    createdAt: '2024-03-09T11:20:00Z',
    featured: true,
    onSale: true,
    discount: 25,
    thumbnail: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Animações',
    category: 'Animações'
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: <ShoppingCart className="h-4 w-4" /> },
  { id: 'pixels', name: 'Pixels Premium', icon: <MapPin className="h-4 w-4" /> },
  { id: 'collections', name: 'Coleções', icon: <Gem className="h-4 w-4" /> },
  { id: 'tools', name: 'Ferramentas', icon: <Palette className="h-4 w-4" /> },
  { id: 'themes', name: 'Temas', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'animations', name: 'Animações', icon: <Video className="h-4 w-4" /> }
];

const sortOptions = [
  { id: 'featured', name: 'Em Destaque', icon: <Star className="h-4 w-4" /> },
  { id: 'price_low', name: 'Menor Preço', icon: <TrendingDown className="h-4 w-4" /> },
  { id: 'price_high', name: 'Maior Preço', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'newest', name: 'Mais Recentes', icon: <Clock className="h-4 w-4" /> },
  { id: 'popular', name: 'Mais Populares', icon: <Heart className="h-4 w-4" /> }
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { credits, specialCredits, addCredits, removeCredits } = useUserStore();

  const filteredItems = mockMarketplaceItems
    .filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'pixels' && item.type === 'pixel') ||
        (selectedCategory === 'collections' && item.type === 'collection') ||
        (selectedCategory === 'tools' && item.type === 'tool') ||
        (selectedCategory === 'themes' && item.type === 'theme') ||
        (selectedCategory === 'animations' && item.type === 'animation');
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

  const handleLike = (itemId: string) => {
    setLikedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToCart = (itemId: string) => {
    setCartItems(prev => [...prev, itemId]);
    toast({
      title: "Adicionado ao Carrinho",
      description: "Item adicionado com sucesso ao seu carrinho.",
    });
  };

  const handlePurchase = (item: MarketplaceItem) => {
    const price = item.specialPrice || item.price;
    
    if (credits < price) {
      toast({
        title: "Créditos Insuficientes",
        description: "Você não tem créditos suficientes para esta compra.",
        variant: "destructive"
      });
      return;
    }

    removeCredits(price);
    toast({
      title: "Compra Realizada!",
      description: `Você comprou "${item.title}" por ${price} créditos.`,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-500/50';
      case 'uncommon': return 'text-green-500 border-green-500/50';
      case 'rare': return 'text-blue-500 border-blue-500/50';
      case 'epic': return 'text-purple-500 border-purple-500/50';
      case 'legendary': return 'text-amber-500 border-amber-500/50';
      default: return 'text-gray-500 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pixel': return <MapPin className="h-4 w-4" />;
      case 'collection': return <Gem className="h-4 w-4" />;
      case 'tool': return <Palette className="h-4 w-4" />;
      case 'theme': return <Sparkles className="h-4 w-4" />;
      case 'animation': return <Video className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl mb-16">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <ShoppingCart className="h-8 w-8 mr-3 animate-glow" />
                  Marketplace
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Descubra pixels únicos, ferramentas profissionais e coleções exclusivas
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Seus Créditos</p>
                  <p className="text-xl font-bold text-primary">{credits.toLocaleString('pt-PT')}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Especiais</p>
                  <p className="text-xl font-bold text-accent">{specialCredits.toLocaleString('pt-PT')}</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar pixels, coleções, ferramentas..."
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
                  </Button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.icon}
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Items */}
        {selectedCategory === 'all' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Star className="h-5 w-5 mr-2" />
                Itens em Destaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.filter(item => item.featured).slice(0, 3).map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      {item.onSale && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          -{item.discount}%
                        </Badge>
                      )}
                      <Badge className={cn(
                        "absolute top-2 right-2",
                        getRarityColor(item.rarity)
                      )}>
                        {item.rarity}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(item.type)}
                        <h3 className="font-semibold truncate">{item.title}</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.seller.avatar} />
                            <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{item.seller.name}</span>
                          {item.seller.verified && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {item.specialPrice || item.price}
                            </span>
                            <Coins className="h-4 w-4 text-primary" />
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLike(item.id)}
                            className={cn(
                              "h-8 w-8",
                              likedItems.includes(item.id) && "text-red-500"
                            )}
                          >
                            <Heart className={cn(
                              "h-4 w-4",
                              likedItems.includes(item.id) && "fill-current"
                            )} />
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handlePurchase(item)}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                          >
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  
                  {item.onSale && (
                    <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                      -{item.discount}% OFF
                    </Badge>
                  )}
                  
                  <Badge className={cn(
                    "absolute top-2 right-2 border",
                    getRarityColor(item.rarity)
                  )}>
                    {item.rarity}
                  </Badge>
                  
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {getTypeIcon(item.type)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {item.coordinates && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      ({item.coordinates.x}, {item.coordinates.y}) - {item.region}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={item.seller.avatar} />
                        <AvatarFallback className="text-xs">{item.seller.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{item.seller.name}</span>
                      {item.seller.verified && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {item.likes}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {item.specialPrice || item.price}
                        </span>
                        <Coins className="h-4 w-4 text-primary" />
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleLike(item.id)}
                        className={cn(
                          "h-8 w-8",
                          likedItems.includes(item.id) && "text-red-500"
                        )}
                      >
                        <Heart className={cn(
                          "h-4 w-4",
                          likedItems.includes(item.id) && "fill-current"
                        )} />
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => handlePurchase(item)}
                        className="text-xs px-3"
                      >
                        Comprar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="text-center p-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum item encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou pesquisar por outros termos.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}