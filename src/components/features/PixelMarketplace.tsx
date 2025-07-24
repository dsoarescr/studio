'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Search, Filter, Star, Heart, Eye, TrendingUp, TrendingDown,
  MapPin, Coins, Gift, Crown, Gem, Sparkles, Award, Trophy, Target,
  Calendar, Clock, User, Share2, Bookmark, Tag, Download, Upload,
  BarChart3, PieChart, LineChart, Activity, Zap, Settings, Info,
  AlertTriangle, CheckCircle, X, Plus, Minus, MoreHorizontal
} from "lucide-react";

interface MarketplaceListing {
  id: string;
  type: 'pixel' | 'collection' | 'tool' | 'template' | 'animation';
  title: string;
  description: string;
  price: number;
  specialPrice?: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    sales: number;
  };
  coordinates?: { x: number; y: number };
  region?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  views: number;
  likes: number;
  sales: number;
  createdAt: Date;
  featured: boolean;
  onSale: boolean;
  discount?: number;
  thumbnail: string;
  category: string;
  stats?: {
    avgPrice: number;
    priceHistory: Array<{ date: Date; price: number }>;
    popularity: number;
  };
}

interface PixelMarketplaceProps {
  children: React.ReactNode;
}

export default function PixelMarketplace({ children }: PixelMarketplaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRarity, setSelectedRarity] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  
  const { toast } = useToast();
  const { credits, specialCredits, addCredits, removeCredits, addXp } = useUserStore();

  // Mock marketplace data
  useEffect(() => {
    const mockListings: MarketplaceListing[] = [
      {
        id: '1',
        type: 'pixel',
        title: 'Pixel Premium Torre de Belém',
        description: 'Pixel histórico localizado na icónica Torre de Belém, Lisboa',
        price: 250,
        specialPrice: 50,
        seller: {
          id: 'seller1',
          name: 'HistoryCollector',
          avatar: 'https://placehold.co/40x40.png',
          rating: 4.9,
          verified: true,
          sales: 156
        },
        coordinates: { x: 245, y: 156 },
        region: 'Lisboa',
        rarity: 'legendary',
        tags: ['histórico', 'lisboa', 'monumento'],
        views: 2341,
        likes: 189,
        sales: 12,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        featured: true,
        onSale: true,
        discount: 20,
        thumbnail: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Torre+Belém',
        category: 'Monumentos',
        stats: {
          avgPrice: 220,
          priceHistory: [
            { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), price: 200 },
            { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), price: 230 },
            { date: new Date(), price: 250 }
          ],
          popularity: 95
        }
      },
      // Add more mock listings...
    ];
    
    setListings(mockListings);
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchQuery || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesRarity = selectedRarity.length === 0 || selectedRarity.includes(listing.rarity);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRarity;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'newest': return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular': return b.likes - a.likes;
      case 'featured':
      default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const handleLike = (listingId: string) => {
    setLikedItems(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
    
    if (!likedItems.includes(listingId)) {
      addXp(2);
    }
  };

  const handleBookmark = (listingId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
    
    toast({
      title: bookmarkedItems.includes(listingId) ? "Removido dos Marcadores" : "Adicionado aos Marcadores",
      description: "Item atualizado na sua lista de marcadores.",
    });
  };

  const handlePurchase = (listing: MarketplaceListing) => {
    const price = listing.specialPrice || listing.price;
    
    if (credits < price) {
      toast({
        title: "Créditos Insuficientes",
        description: "Você não tem créditos suficientes para esta compra.",
        variant: "destructive"
      });
      return;
    }

    removeCredits(price);
    setShowConfetti(true);
    setPlayPurchaseSound(true);
    
    // Update listing stats
    setListings(prev => prev.map(l => 
      l.id === listing.id 
        ? { ...l, sales: l.sales + 1, views: l.views + 1 }
        : l
    ));
    
    addXp(25);
    
    toast({
      title: "Compra Realizada!",
      description: `Você comprou "${listing.title}" por ${price} créditos. +25 XP!`,
    });
  };

  const handleMakeOffer = (listing: MarketplaceListing, offerAmount: number) => {
    toast({
      title: "Oferta Enviada",
      description: `Sua oferta de ${offerAmount} créditos foi enviada ao vendedor.`,
    });
    
    addXp(5);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
      case 'uncommon': return 'text-green-500 border-green-500/50 bg-green-500/10';
      case 'rare': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      case 'epic': return 'text-purple-500 border-purple-500/50 bg-purple-500/10';
      case 'legendary': return 'text-amber-500 border-amber-500/50 bg-amber-500/10';
      default: return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pixel': return <MapPin className="h-4 w-4" />;
      case 'collection': return <Gem className="h-4 w-4" />;
      case 'tool': return <Settings className="h-4 w-4" />;
      case 'template': return <Star className="h-4 w-4" />;
      case 'animation': return <Activity className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-card to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-headline text-primary flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3" />
                Marketplace Avançado
              </DialogTitle>
              <DialogDescription className="mt-2">
                Descubra, compre e venda pixels únicos, ferramentas e coleções exclusivas
              </DialogDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{credits.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Créditos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">{specialCredits.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Especiais</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[80vh]">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-r bg-muted/20 overflow-hidden"
              >
                <div className="w-64 p-4 space-y-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Filtros</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label className="text-sm">Faixa de Preço</Label>
                        <div className="space-y-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={0}
                            max={1000}
                            step={10}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{priceRange[0]}€</span>
                            <span>{priceRange[1]}€</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Rarity Filter */}
                      <div className="space-y-2">
                        <Label className="text-sm">Raridade</Label>
                        <div className="space-y-2">
                          {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => (
                            <div key={rarity} className="flex items-center space-x-2">
                              <Checkbox
                                id={rarity}
                                checked={selectedRarity.includes(rarity)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedRarity(prev => [...prev, rarity]);
                                  } else {
                                    setSelectedRarity(prev => prev.filter(r => r !== rarity));
                                  }
                                }}
                              />
                              <Label htmlFor={rarity} className="text-sm capitalize">
                                {rarity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Quick Filters */}
                      <div className="space-y-2">
                        <Label className="text-sm">Filtros Rápidos</Label>
                        <div className="space-y-1">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Star className="h-4 w-4 mr-2" />
                            Em Destaque
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Mais Populares
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Clock className="h-4 w-4 mr-2" />
                            Recém Adicionados
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Award className="h-4 w-4 mr-2" />
                            Melhor Avaliados
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Search and Controls */}
            <div className="p-4 border-b bg-muted/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar pixels, coleções, ferramentas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {(selectedRarity.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedRarity.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="featured">Em Destaque</option>
                  <option value="price_low">Menor Preço</option>
                  <option value="price_high">Maior Preço</option>
                  <option value="newest">Mais Recentes</option>
                  <option value="popular">Mais Populares</option>
                </select>
              </div>
              
              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="Pixels">Pixels</TabsTrigger>
                  <TabsTrigger value="Coleções">Coleções</TabsTrigger>
                  <TabsTrigger value="Ferramentas">Ferramentas</TabsTrigger>
                  <TabsTrigger value="Templates">Templates</TabsTrigger>
                  <TabsTrigger value="Animações">Animações</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Listings Grid */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {filteredListings.length === 0 ? (
                  <Card className="text-center p-12">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum item encontrado</h3>
                    <p className="text-muted-foreground">
                      Tente ajustar seus filtros ou pesquisar por outros termos.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredListings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                          <div className="relative">
                            <img 
                              src={listing.thumbnail} 
                              alt={listing.title}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            
                            {/* Overlay Badges */}
                            <div className="absolute top-2 left-2 flex gap-2">
                              {listing.onSale && listing.discount && (
                                <Badge className="bg-red-500 text-white animate-pulse">
                                  -{listing.discount}% OFF
                                </Badge>
                              )}
                              <Badge className={`border ${getRarityColor(listing.rarity)}`}>
                                {listing.rarity}
                              </Badge>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleLike(listing.id)}
                                className="h-8 w-8 bg-background/80 hover:bg-background"
                              >
                                <Heart className={`h-4 w-4 ${likedItems.includes(listing.id) ? 'text-red-500 fill-current' : ''}`} />
                              </Button>
                              
                              <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleBookmark(listing.id)}
                                className="h-8 w-8 bg-background/80 hover:bg-background"
                              >
                                <Bookmark className={`h-4 w-4 ${bookmarkedItems.includes(listing.id) ? 'text-primary fill-current' : ''}`} />
                              </Button>
                            </div>
                            
                            {/* Type Icon */}
                            <div className="absolute bottom-2 left-2">
                              <div className="p-1 bg-background/80 rounded">
                                {getTypeIcon(listing.type)}
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold truncate">{listing.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {listing.description}
                                </p>
                              </div>
                              
                              {/* Seller Info */}
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={listing.seller.avatar} />
                                  <AvatarFallback className="text-xs">{listing.seller.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{listing.seller.name}</span>
                                {listing.seller.verified && (
                                  <CheckCircle className="h-3 w-3 text-blue-500" />
                                )}
                                <div className="flex items-center gap-1 ml-auto">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs">{listing.seller.rating}</span>
                                </div>
                              </div>
                              
                              {/* Stats */}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {listing.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {listing.likes}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ShoppingCart className="h-3 w-3" />
                                    {listing.sales}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-primary">
                                      {listing.specialPrice || listing.price}
                                    </span>
                                    <Coins className="h-4 w-4 text-primary" />
                                  </div>
                                  {listing.specialPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {listing.price}
                                    </span>
                                  )}
                                </div>
                                
                                <Button
                                  size="sm"
                                  onClick={() => handlePurchase(listing)}
                                  disabled={credits < (listing.specialPrice || listing.price)}
                                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                >
                                  Comprar
                                </Button>
                              </div>
                              
                              {/* Tags */}
                              {listing.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {listing.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}