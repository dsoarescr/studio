'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Star, Crown, Gem, MapPin, Eye, Heart, Filter, Search, SortAsc, Coins, Gift, Zap, Target, Award, Sparkles, Flame, CloudLightning as Lightning } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  price: number;
  originalPrice?: number;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  views: number;
  likes: number;
  description: string;
  tags: string[];
  imageUrl: string;
  isHot: boolean;
  discount?: number;
  timeLeft?: number; // para ofertas limitadas
}

interface PixelMarketplaceProps {
  children: React.ReactNode;
}

const mockMarketPixels: MarketPixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    owner: {
      name: 'PixelKing',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25
    },
    price: 299,
    originalPrice: 399,
    rarity: 'Lendário',
    views: 2340,
    likes: 456,
    description: 'Pixel premium no coração histórico de Lisboa com vista única para o Tejo',
    tags: ['lisboa', 'histórico', 'premium', 'vista-rio'],
    imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Premium',
    isHot: true,
    discount: 25,
    timeLeft: 24
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    owner: {
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18
    },
    price: 150,
    rarity: 'Épico',
    views: 1890,
    likes: 234,
    description: 'Arte urbana na Ribeira do Porto, perfeito para colecionadores',
    tags: ['porto', 'arte', 'ribeira', 'urbano'],
    imageUrl: 'https://placehold.co/300x300/7DF9FF/000000?text=Porto+Art',
    isHot: false
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    owner: {
      name: 'StudentPixel',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 12
    },
    price: 89,
    rarity: 'Raro',
    views: 567,
    likes: 89,
    description: 'Pixel universitário em Coimbra, ideal para estudantes',
    tags: ['coimbra', 'universidade', 'estudante'],
    imageUrl: 'https://placehold.co/300x300/9C27B0/FFFFFF?text=Coimbra+Uni',
    isHot: false
  }
];

export default function PixelMarketplace({ children }: PixelMarketplaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pixels, setPixels] = useState(mockMarketPixels);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hot');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const { toast } = useToast();

  const filteredPixels = pixels
    .filter(pixel => {
      const matchesSearch = !searchQuery || 
        pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pixel.region.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRarity = filterRarity === 'all' || pixel.rarity === filterRarity;
      const matchesRegion = filterRegion === 'all' || pixel.region === filterRegion;
      
      return matchesSearch && matchesRarity && matchesRegion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'popular': return b.likes - a.likes;
        case 'recent': return b.views - a.views;
        case 'hot': return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
        default: return 0;
      }
    });

  const handlePurchase = (pixel: MarketPixel) => {
    toast({
      title: "Compra Iniciada! 🛒",
      description: `Processando compra do pixel (${pixel.x}, ${pixel.y})`,
    });
  };

  const handleLike = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, likes: pixel.likes + 1 }
        : pixel
    ));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 border-gray-500/50';
      case 'Incomum': return 'text-green-500 border-green-500/50';
      case 'Raro': return 'text-blue-500 border-blue-500/50';
      case 'Épico': return 'text-purple-500 border-purple-500/50';
      case 'Lendário': return 'text-amber-500 border-amber-500/50';
      default: return 'text-gray-500 border-gray-500/50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <DialogTitle className="flex items-center">
            <ShoppingCart className="h-6 w-6 mr-3 text-green-500" />
            Marketplace de Pixels
            <Badge className="ml-3 bg-gradient-to-r from-green-500 to-emerald-500">
              <Flame className="h-3 w-3 mr-1" />
              {filteredPixels.length} Disponíveis
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 flex flex-col">
          <TabsList className="px-6 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="browse">
              <Search className="h-4 w-4 mr-2" />
              Explorar
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="premium">
              <Crown className="h-4 w-4 mr-2" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="auctions">
              <Zap className="h-4 w-4 mr-2" />
              Leilões
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="browse" className="h-full">
              <div className="flex h-full">
                {/* Filtros Sidebar */}
                <div className="w-64 border-r p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Pesquisar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Pesquisar pixels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ordenar por</Label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="hot">🔥 Em Alta</option>
                      <option value="price-low">💰 Preço: Menor</option>
                      <option value="price-high">💰 Preço: Maior</option>
                      <option value="popular">❤️ Mais Populares</option>
                      <option value="recent">🆕 Mais Recentes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Raridade</Label>
                    <select
                      value={filterRarity}
                      onChange={(e) => setFilterRarity(e.target.value)}
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

                  <div className="space-y-2">
                    <Label>Região</Label>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="all">Todas</option>
                      <option value="Lisboa">Lisboa</option>
                      <option value="Porto">Porto</option>
                      <option value="Coimbra">Coimbra</option>
                      <option value="Braga">Braga</option>
                      <option value="Faro">Faro</option>
                    </select>
                  </div>
                </div>

                {/* Grid de Pixels */}
                <div className="flex-1 p-4">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPixels.map((pixel, index) => (
                        <motion.div
                          key={pixel.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="relative">
                              <img 
                                src={pixel.imageUrl} 
                                alt={`Pixel ${pixel.x}, ${pixel.y}`}
                                className="w-full h-48 object-cover"
                              />
                              
                              <div className="absolute top-2 left-2 flex gap-2">
                                <Badge className={getRarityColor(pixel.rarity)}>
                                  {pixel.rarity}
                                </Badge>
                                {pixel.isHot && (
                                  <Badge className="bg-red-500 animate-pulse">
                                    <Flame className="h-3 w-3 mr-1" />
                                    HOT
                                  </Badge>
                                )}
                                {pixel.discount && (
                                  <Badge className="bg-green-500">
                                    -{pixel.discount}%
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="absolute top-2 right-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleLike(pixel.id)}
                                  className="h-8 w-8 bg-background/80 hover:bg-background"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {pixel.timeLeft && (
                                <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                                  {pixel.timeLeft}h restantes
                                </div>
                              )}
                            </div>
                            
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={pixel.owner.avatar} />
                                  <AvatarFallback>{pixel.owner.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">{pixel.owner.name}</span>
                                {pixel.owner.verified && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  Nv.{pixel.owner.level}
                                </Badge>
                              </div>
                              
                              <h3 className="font-semibold mb-1">
                                Pixel ({pixel.x}, {pixel.y})
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {pixel.description}
                              </p>
                              
                              <div className="flex items-center justify-between text-sm mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {pixel.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {pixel.likes}
                                  </span>
                                </div>
                                <Badge variant="outline">{pixel.region}</Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {pixel.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-2xl font-bold text-primary">
                                    €{pixel.price}
                                    {pixel.originalPrice && (
                                      <span className="text-sm text-muted-foreground line-through ml-2">
                                        €{pixel.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => handlePurchase(pixel)}
                                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Comprar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trending" className="h-full p-6">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Pixels em Alta</h3>
                <p className="text-muted-foreground">
                  Os pixels mais populares e valorizados da semana
                </p>
              </div>
            </TabsContent>

            <TabsContent value="premium" className="h-full p-6">
              <div className="text-center">
                <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Coleção Premium</h3>
                <p className="text-muted-foreground">
                  Pixels exclusivos para colecionadores VIP
                </p>
              </div>
            </TabsContent>

            <TabsContent value="auctions" className="h-full p-6">
              <div className="text-center">
                <Zap className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Leilões Ativos</h3>
                <p className="text-muted-foreground">
                  Participe em leilões de pixels raros
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}