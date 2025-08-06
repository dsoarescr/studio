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
  Palette, Search, Filter, Grid3X3, MapPin, Eye, Heart,
  Edit3, Share2, Trash2, Star, Crown, Gem, Sparkles,
  Plus, Download, Upload, Bookmark, Tag
} from "lucide-react";

interface PixelItem {
  id: string;
  x: number;
  y: number;
  region: string;
  color: string;
  title: string;
  description: string;
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
  views: number;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  value: number;
  tags: string[];
}

const mockPixels: PixelItem[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    color: '#D4A757',
    title: 'Pixel Dourado de Lisboa',
    description: 'Meu primeiro pixel no centro histórico',
    rarity: 'Épico',
    views: 234,
    likes: 45,
    isLiked: true,
    createdAt: '2024-03-15',
    value: 150,
    tags: ['lisboa', 'dourado', 'histórico']
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    color: '#7DF9FF',
    title: 'Azul do Porto',
    description: 'Inspirado no Rio Douro',
    rarity: 'Raro',
    views: 189,
    likes: 32,
    isLiked: false,
    createdAt: '2024-03-10',
    value: 120,
    tags: ['porto', 'azul', 'rio']
  }
];

export default function PixelsPage() {
  const [pixels, setPixels] = useState(mockPixels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  const handleLike = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isLiked: !pixel.isLiked,
            likes: pixel.isLiked ? pixel.likes - 1 : pixel.likes + 1
          }
        : pixel
    ));
  };

  const handleEdit = (pixelId: string) => {
    toast({
      title: "Editor de Pixel",
      description: "Abrindo editor para personalizar o pixel...",
    });
  };

  const handleDelete = (pixelId: string) => {
    setPixels(prev => prev.filter(pixel => pixel.id !== pixelId));
    toast({
      title: "Pixel Removido",
      description: "O pixel foi removido da sua galeria.",
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

  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'liked' && pixel.isLiked) ||
      (selectedFilter === 'rare' && ['Épico', 'Lendário'].includes(pixel.rarity));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
                  <Palette className="h-8 w-8 mr-3" />
                  Minha Galeria de Pixels
                </CardTitle>
                <CardDescription>
                  Gerencie e organize sua coleção de pixels únicos
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pixel
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">Todos os Pixels</option>
                  <option value="liked">Favoritos</option>
                  <option value="rare">Raros</option>
                  <option value="recent">Recentes</option>
                </select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pixels Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredPixels.map((pixel, index) => (
            <motion.div
              key={pixel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <div 
                    className="w-full h-48 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: pixel.color }}
                  >
                    ({pixel.x}, {pixel.y})
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <Badge className={getRarityColor(pixel.rarity)}>
                      {pixel.rarity}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => handleLike(pixel.id)}
                  >
                    <Heart className={`h-4 w-4 ${pixel.isLiked ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{pixel.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {pixel.description}
                  </p>
                  
                  <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {pixel.region}
                  </div>
                  
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
                    <span className="font-bold text-primary">€{pixel.value}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pixel.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(pixel.id)}>
                      <Edit3 className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-3 w-3 mr-1" />
                      Partilhar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(pixel.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPixels.length === 0 && (
          <Card className="text-center p-8">
            <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum pixel encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Tente ajustar os filtros de pesquisa' : 'Comece comprando o seu primeiro pixel!'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Explorar Marketplace
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}