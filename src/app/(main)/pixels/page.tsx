'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  Palette, Grid, List, Search, Filter, Plus, Star, Crown, 
  Eye, Heart, Share2, Edit, MapPin, Calendar, TrendingUp,
  Gem, Sparkles, Award, Target, Zap, Users, Globe, Camera,
  Video, Music, Image as ImageIcon, Bookmark, MoreHorizontal
} from "lucide-react";
import { useUserStore } from '@/lib/store';

interface UserPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  identity: {
    name: string;
    description: string;
    avatar?: string;
    theme: string;
    tags: string[];
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  media: {
    type: 'image' | 'video' | 'animation';
    url: string;
    thumbnail?: string;
  };
  rarity: string;
  value: {
    purchased: number;
    current: number;
    change: number;
  };
  createdAt: string;
  lastModified: string;
  isPublic: boolean;
  isFeatured: boolean;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}

interface PixelCollection {
  id: string;
  name: string;
  description: string;
  pixels: string[];
  coverImage: string;
  isPublic: boolean;
  createdAt: string;
}

const mockUserPixels: UserPixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    identity: {
      name: 'Meu Cantinho em Lisboa',
      description: 'Um pedacinho especial da capital onde guardo minhas memórias digitais',
      avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
      theme: 'sunset',
      tags: ['lisboa', 'memórias', 'especial', 'capital']
    },
    stats: {
      views: 1234,
      likes: 89,
      shares: 23,
      comments: 45
    },
    media: {
      type: 'animation',
      url: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Anim'
    },
    rarity: 'Épico',
    value: {
      purchased: 150,
      current: 280,
      change: 86.7
    },
    createdAt: '2024-03-10',
    lastModified: '2024-03-15',
    isPublic: true,
    isFeatured: true,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/meucantoLX' }
    ]
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    identity: {
      name: 'Arte do Douro',
      description: 'Inspirado nas cores do vinho do Porto e na magia do rio',
      theme: 'ocean',
      tags: ['porto', 'douro', 'vinho', 'arte']
    },
    stats: {
      views: 567,
      likes: 34,
      shares: 12,
      comments: 18
    },
    media: {
      type: 'image',
      url: 'https://placehold.co/300x300/7DF9FF/000000?text=Porto+Art'
    },
    rarity: 'Raro',
    value: {
      purchased: 89,
      current: 120,
      change: 34.8
    },
    createdAt: '2024-03-12',
    lastModified: '2024-03-14',
    isPublic: true,
    isFeatured: false,
    socialLinks: []
  }
];

const mockCollections: PixelCollection[] = [
  {
    id: '1',
    name: 'Cidades Portuguesas',
    description: 'Minha coleção de pixels das principais cidades de Portugal',
    pixels: ['1', '2'],
    coverImage: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Cidades',
    isPublic: true,
    createdAt: '2024-03-10'
  }
];

export default function PixelsPage() {
  const [pixels, setPixels] = useState(mockUserPixels);
  const [collections, setCollections] = useState(mockCollections);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const { toast } = useToast();

  const handleEdit = (pixelId: string) => {
    toast({
      title: "Editor Aberto",
      description: "Abrindo editor de identidade digital...",
    });
  };

  const handleShare = (pixel: UserPixel) => {
    if (navigator.share) {
      navigator.share({
        title: pixel.identity.name,
        text: pixel.identity.description,
        url: `${window.location.origin}/pixel/${pixel.x}/${pixel.y}`
      });
    } else {
      toast({
        title: "Link Copiado",
        description: "Link do pixel copiado para a área de transferência",
      });
    }
  };

  const togglePublic = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, isPublic: !pixel.isPublic }
        : pixel
    ));
    
    const pixel = pixels.find(p => p.id === pixelId);
    toast({
      title: pixel?.isPublic ? "Pixel Privado" : "Pixel Público",
      description: pixel?.isPublic ? "Pixel removido da galeria pública" : "Pixel adicionado à galeria pública",
    });
  };

  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.identity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.identity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.identity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    switch (selectedFilter) {
      case 'public': return pixel.isPublic;
      case 'private': return !pixel.isPublic;
      case 'featured': return pixel.isFeatured;
      case 'valuable': return pixel.value.change > 50;
      default: return matchesSearch;
    }
  });

  const totalValue = pixels.reduce((sum, pixel) => sum + pixel.value.current, 0);
  const totalGain = pixels.reduce((sum, pixel) => sum + (pixel.value.current - pixel.value.purchased), 0);
  const avgGain = pixels.length > 0 ? (totalGain / pixels.reduce((sum, pixel) => sum + pixel.value.purchased, 0)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
        {/* Header com Estatísticas */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
                  <Palette className="h-8 w-8 mr-3" />
                  Minha Galeria Digital
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Gerencie suas identidades digitais e acompanhe o valor do seu portfólio
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">€{totalValue}</div>
                  <div className="text-xs text-muted-foreground">Valor Total</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">+€{totalGain}</div>
                  <div className="text-xs text-muted-foreground">Ganho</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">+{avgGain.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Controles */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar suas identidades digitais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  Lista
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { id: 'all', label: 'Todos', icon: Globe },
                { id: 'public', label: 'Públicos', icon: Eye },
                { id: 'private', label: 'Privados', icon: Users },
                { id: 'featured', label: 'Em Destaque', icon: Star },
                { id: 'valuable', label: 'Valorizados', icon: TrendingUp }
              ].map(filter => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <filter.icon className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pixels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pixels">
              <Palette className="h-4 w-4 mr-2" />
              Meus Pixels ({pixels.length})
            </TabsTrigger>
            <TabsTrigger value="collections">
              <Gem className="h-4 w-4 mr-2" />
              Coleções ({collections.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pixels" className="space-y-6">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredPixels.map((pixel, index) => (
                <motion.div
                  key={pixel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <div className="relative">
                      <img 
                        src={pixel.media.url} 
                        alt={pixel.identity.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className="bg-primary/90">
                          ({pixel.x}, {pixel.y})
                        </Badge>
                        {pixel.isFeatured && (
                          <Badge className="bg-amber-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                        {pixel.value.change > 50 && (
                          <Badge className="bg-green-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{pixel.value.change.toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(pixel.id)}
                          className="h-8 w-8 bg-background/80 hover:bg-background"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(pixel)}
                          className="h-8 w-8 bg-background/80 hover:bg-background"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {pixel.region}
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h3 className="font-bold text-lg mb-1">{pixel.identity.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {pixel.identity.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.stats.likes}
                          </span>
                        </div>
                        <Badge variant="outline">{pixel.rarity}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pixel.identity.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold text-primary">€{pixel.value.current}</div>
                          <div className="text-xs text-muted-foreground">
                            Comprado por €{pixel.value.purchased}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(pixel.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant={pixel.isPublic ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => togglePublic(pixel.id)}
                          >
                            {pixel.isPublic ? <Eye className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Botão para Adicionar Novo Pixel */}
            <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Comprar Novo Pixel</h3>
                <p className="text-muted-foreground mb-4">
                  Explore o mapa e encontre o pixel perfeito para sua próxima identidade digital
                </p>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explorar Mapa
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <img 
                        src={collection.coverImage} 
                        alt={collection.name}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-background/90">
                        {collection.pixels.length} pixels
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2">{collection.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {collection.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Criado em {collection.createdAt}
                        </span>
                        <Badge variant={collection.isPublic ? 'default' : 'secondary'}>
                          {collection.isPublic ? 'Público' : 'Privado'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {/* Criar Nova Coleção */}
              <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Nova Coleção</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize seus pixels em coleções temáticas
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {pixels.reduce((sum, p) => sum + p.stats.views, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Visualizações</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {pixels.reduce((sum, p) => sum + p.stats.likes, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Curtidas</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">+{avgGain.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Valorização Média</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {pixels.filter(p => p.isFeatured).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Em Destaque</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}