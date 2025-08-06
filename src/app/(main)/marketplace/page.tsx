'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ShoppingCart, Search, Filter, Star, MapPin, TrendingUp,
  Eye, Heart, Coins, Crown, Gem, Sparkles, Target, Award,
  Calendar, Clock, Users, Palette, Zap, Gift
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  type: 'pixel' | 'collection' | 'tool' | 'theme';
  title: string;
  description: string;
  price: number;
  specialPrice?: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
  coordinates?: { x: number; y: number };
  region?: string;
  imageUrl: string;
  views: number;
  likes: number;
  isLiked: boolean;
  tags: string[];
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    type: 'pixel',
    title: 'Pixel Premium Lisboa',
    description: 'Pixel raro no centro histórico de Lisboa com vista privilegiada',
    price: 150,
    specialPrice: 75,
    seller: {
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    rarity: 'Épico',
    coordinates: { x: 245, y: 156 },
    region: 'Lisboa',
    imageUrl: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Lisboa+Premium',
    views: 1234,
    likes: 89,
    isLiked: false,
    tags: ['lisboa', 'centro', 'premium']
  },
  {
    id: '2',
    type: 'collection',
    title: 'Coleção Paisagens do Norte',
    description: 'Conjunto de 25 pixels representando as mais belas paisagens do Norte de Portugal',
    price: 500,
    seller: {
      name: 'NorthernArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false
    },
    rarity: 'Raro',
    imageUrl: 'https://placehold.co/300x200/7DF9FF/000000?text=Norte+Collection',
    views: 567,
    likes: 45,
    isLiked: true,
    tags: ['norte', 'paisagem', 'coleção']
  }
];

export default function MarketplacePage() {
  const [items, setItems] = useState(mockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const { toast } = useToast();

  const handleLike = (itemId: string) => {
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

  const handlePurchase = (item: MarketplaceItem) => {
    toast({
      title: "Item Adicionado ao Carrinho",
      description: `${item.title} foi adicionado ao seu carrinho.`,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10';
      case 'Raro': return 'text-blue-500 bg-blue-500/10';
      case 'Épico': return 'text-purple-500 bg-purple-500/10';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pixel': return <MapPin className="h-4 w-4" />;
      case 'collection': return <Gem className="h-4 w-4" />;
      case 'tool': return <Palette className="h-4 w-4" />;
      case 'theme': return <Sparkles className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3" />
              Marketplace de Pixels
            </CardTitle>
            <CardDescription>
              Descubra, compre e venda pixels únicos e coleções exclusivas
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels, coleções..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="pixel">Pixels</option>
                  <option value="collection">Coleções</option>
                  <option value="tool">Ferramentas</option>
                  <option value="theme">Temas</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="popular">Mais Populares</option>
                  <option value="newest">Mais Recentes</option>
                  <option value="price_low">Preço: Menor</option>
                  <option value="price_high">Preço: Maior</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge className={getRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                    <Badge variant="outline" className="bg-background/80">
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className={`h-4 w-4 ${item.isLiked ? 'fill-current text-red-500' : ''}`} />
                  </Button>
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
                  
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {item.coordinates && (
                    <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      ({item.coordinates.x}, {item.coordinates.y}) • {item.region}
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
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-primary">€{item.price}</div>
                      {item.specialPrice && (
                        <div className="text-sm text-accent">{item.specialPrice} especiais</div>
                      )}
                    </div>
                    <Button onClick={() => handlePurchase(item)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}