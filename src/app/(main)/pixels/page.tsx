'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Palette, Grid3X3, Image as ImageIcon, Video, Star, Heart, Eye,
  MapPin, Calendar, User, Share2, Download, Upload, Edit3, Trash2,
  Plus, Filter, Search, SortAsc, Bookmark, Tag, Link2, Crown,
  Gem, Sparkles, Award, Trophy, Target, Zap, Activity, Clock,
  BarChart3, PieChart, LineChart, TrendingUp, Globe, Settings,
  FolderPlus, Copy, ExternalLink, Info, AlertTriangle, Check
} from "lucide-react";

interface PixelArtwork {
  id: string;
  title: string;
  description: string;
  coordinates: { x: number; y: number };
  region: string;
  color: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  isPublic: boolean;
  tags: string[];
  collection?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price?: number;
  forSale: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  pixelCount: number;
  totalViews: number;
  totalLikes: number;
  createdAt: string;
  isPublic: boolean;
  theme: string;
  progress: number;
  targetPixels: number;
}

const mockPixels: PixelArtwork[] = [
  {
    id: '1',
    title: 'Torre de Belém Pixel',
    description: 'Representação pixelizada da icónica Torre de Belém',
    coordinates: { x: 245, y: 156 },
    region: 'Lisboa',
    color: '#D4A757',
    imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Torre+Belém',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-12T14:30:00Z',
    views: 456,
    likes: 89,
    isPublic: true,
    tags: ['histórico', 'lisboa', 'monumento'],
    collection: 'Monumentos de Portugal',
    rarity: 'epic',
    price: 250,
    forSale: false
  },
  {
    id: '2',
    title: 'Ponte Dom Luís I',
    description: 'Vista artística da famosa ponte do Porto',
    coordinates: { x: 123, y: 89 },
    region: 'Porto',
    color: '#7DF9FF',
    imageUrl: 'https://placehold.co/200x200/7DF9FF/000000?text=Ponte+Porto',
    createdAt: '2024-03-08T16:20:00Z',
    updatedAt: '2024-03-08T16:20:00Z',
    views: 234,
    likes: 67,
    isPublic: true,
    tags: ['ponte', 'porto', 'arquitetura'],
    collection: 'Monumentos de Portugal',
    rarity: 'rare',
    forSale: true,
    price: 180
  },
  {
    id: '3',
    title: 'Praia do Algarve',
    description: 'Cores vibrantes de uma praia algarvia',
    coordinates: { x: 178, y: 234 },
    region: 'Algarve',
    color: '#FFD700',
    imageUrl: 'https://placehold.co/200x200/FFD700/000000?text=Praia+Algarve',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
    views: 567,
    likes: 123,
    isPublic: true,
    tags: ['praia', 'algarve', 'natureza'],
    collection: 'Paisagens Naturais',
    rarity: 'uncommon',
    forSale: false
  }
];

const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Monumentos de Portugal',
    description: 'Coleção dedicada aos monumentos mais icónicos do país',
    coverImage: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Monumentos',
    pixelCount: 12,
    totalViews: 2340,
    totalLikes: 456,
    createdAt: '2024-02-15T10:00:00Z',
    isPublic: true,
    theme: 'Histórico',
    progress: 60,
    targetPixels: 20
  },
  {
    id: '2',
    name: 'Paisagens Naturais',
    description: 'A beleza natural de Portugal em pixels',
    coverImage: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Natureza',
    pixelCount: 8,
    totalViews: 1890,
    totalLikes: 234,
    createdAt: '2024-02-20T14:30:00Z',
    isPublic: true,
    theme: 'Natureza',
    progress: 40,
    targetPixels: 20
  },
  {
    id: '3',
    name: 'Tradições Portuguesas',
    description: 'Pixels que celebram as tradições do nosso país',
    coverImage: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Tradições',
    pixelCount: 5,
    totalViews: 987,
    totalLikes: 156,
    createdAt: '2024-03-01T11:45:00Z',
    isPublic: false,
    theme: 'Cultural',
    progress: 25,
    targetPixels: 20
  }
];

export default function PixelsPage() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedPixels, setLikedPixels] = useState<string[]>([]);
  const [selectedPixels, setSelectedPixels] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [pixelTemplates, setPixelTemplates] = useState([
    { id: 1, name: 'Paisagem Portuguesa', preview: '🏞️', difficulty: 'Médio' },
    { id: 2, name: 'Arte Abstrata', preview: '🎨', difficulty: 'Avançado' },
    { id: 3, name: 'Pixel Minimalista', preview: '⬜', difficulty: 'Fácil' }
  ]);
  const [collaborativeProjects, setCollaborativeProjects] = useState([
    { id: 1, name: 'Mural de Lisboa', participants: 12, progress: 65 },
    { id: 2, name: 'Bandeira Pixel', participants: 8, progress: 40 }
  ]);
  
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();

  const handleLike = (pixelId: string) => {
    setLikedPixels(prev => 
      prev.includes(pixelId) 
        ? prev.filter(id => id !== pixelId)
        : [...prev, pixelId]
    );
    
    if (!likedPixels.includes(pixelId)) {
      addXp(5);
    }
  };

  const handleShare = (pixel: PixelArtwork) => {
    navigator.clipboard.writeText(`Confira este pixel incrível: ${pixel.title} em (${pixel.coordinates.x}, ${pixel.coordinates.y})`);
    toast({
      title: "Link Copiado",
      description: "Link do pixel foi copiado para a área de transferência.",
    });
  };

  const handleSell = (pixelId: string) => {
    addCredits(50);
    toast({
      title: "Pixel Colocado à Venda",
      description: "Seu pixel foi listado no marketplace. Você ganhou 50 créditos de bônus!",
    });
  };

  const handleCreateCollection = () => {
    addXp(100);
    toast({
      title: "Coleção Criada",
      description: "Nova coleção criada com sucesso! Você ganhou 100 XP.",
    });
  };

  const filteredPixels = mockPixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'public' && pixel.isPublic) ||
      (selectedFilter === 'private' && !pixel.isPublic) ||
      (selectedFilter === 'for-sale' && pixel.forSale) ||
      (selectedFilter === 'liked' && likedPixels.includes(pixel.id));
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-liked':
        return b.likes - a.likes;
      case 'most-viewed':
        return b.views - a.views;
      default:
        return 0;
    }
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
                  <Palette className="h-8 w-8 mr-3 animate-glow" />
                  Minha Galeria
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Gerencie seus pixels, crie coleções e partilhe suas obras-primas
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Total de Pixels</p>
                  <p className="text-xl font-bold text-primary">{mockPixels.length}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Coleções</p>
                  <p className="text-xl font-bold text-accent">{mockCollections.length}</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="gallery" className="font-headline">
              <Grid3X3 className="h-4 w-4 mr-2"/>
              Galeria
            </TabsTrigger>
            <TabsTrigger value="create" className="font-headline">
              <Plus className="h-4 w-4 mr-2"/>
              Criar
            </TabsTrigger>
            <TabsTrigger value="collections" className="font-headline">
              <FolderPlus className="h-4 w-4 mr-2"/>
              Coleções
            </TabsTrigger>
            <TabsTrigger value="collaborate" className="font-headline">
              <Users className="h-4 w-4 mr-2"/>
              Colaborar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-headline">
              <BarChart3 className="h-4 w-4 mr-2"/>
              Análises
            </TabsTrigger>
            <TabsTrigger value="ai" className="font-headline">
              <Sparkles className="h-4 w-4 mr-2"/>
              IA Assistant
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            {/* Controls */}
            <Card className="bg-gradient-to-r from-card to-primary/5">
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
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      IA Sugestões
                    </Button>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="all">Todos</option>
                      <option value="public">Públicos</option>
                      <option value="private">Privados</option>
                      <option value="for-sale">À Venda</option>
                      <option value="liked">Curtidos</option>
                      <option value="trending">Em Tendência</option>
                      <option value="collaborative">Colaborativos</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="newest">Mais Recentes</option>
                      <option value="oldest">Mais Antigos</option>
                      <option value="most-liked">Mais Curtidos</option>
                      <option value="most-viewed">Mais Vistos</option>
                      <option value="most-valuable">Mais Valiosos</option>
                      <option value="trending">Tendência</option>
                    </select>
                    
                    <Button
                      variant="outline"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                      {viewMode === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {selectedPixels.length > 0 && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedPixels.length} pixel(s) selecionado(s)
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Adicionar à Coleção
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Colaborar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Partilhar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        IA Melhorar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pixels Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPixels.map((pixel, index) => (
                  <motion.div
                    key={pixel.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="relative">
                        <img 
                          src={pixel.imageUrl} 
                          alt={pixel.title}
                          className="w-full h-48 object-cover"
                        />
                        
                        <div className="absolute top-2 left-2 flex gap-2">
                          <Badge className={getRarityColor(pixel.rarity)}>
                            {pixel.rarity}
                          </Badge>
                          {pixel.forSale && (
                            <Badge className="bg-green-500">
                              À Venda
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 hover:bg-background"
                            onClick={() => handleLike(pixel.id)}
                          >
                            <Heart className={`h-4 w-4 ${likedPixels.includes(pixel.id) ? 'text-red-500 fill-current' : ''}`} />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 hover:bg-background"
                            onClick={() => handleShare(pixel)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="absolute bottom-2 left-2">
                          <div 
                            className="w-6 h-6 rounded border-2 border-white shadow-lg"
                            style={{ backgroundColor: pixel.color }}
                          />
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 truncate">{pixel.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {pixel.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <MapPin className="h-3 w-3" />
                          <span>({pixel.coordinates.x}, {pixel.coordinates.y}) - {pixel.region}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
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
                          
                          {pixel.forSale && pixel.price && (
                            <span className="font-bold text-primary">{pixel.price}€</span>
                          )}
                        </div>
                        
                        {pixel.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {pixel.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit3 className="h-4 w-4 mr-2" />
                          <Link href="/pixels">Editar</Link>
                        </Button>
                        {!pixel.forSale ? (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleSell(pixel.id)}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            Vender
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="flex-1">
                            <X className="h-4 w-4 mr-2" />
                            Remover Venda
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {filteredPixels.map((pixel, index) => (
                      <div key={pixel.id} className={`p-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors`}>
                        <div className="flex items-center gap-4">
                          <img 
                            src={pixel.imageUrl} 
                            alt={pixel.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{pixel.title}</h3>
                              <Badge className={getRarityColor(pixel.rarity)} variant="outline">
                                {pixel.rarity}
                              </Badge>
                              {pixel.forSale && (
                                <Badge className="bg-green-500">À Venda</Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">{pixel.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                ({pixel.coordinates.x}, {pixel.coordinates.y}) - {pixel.region}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(pixel.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {pixel.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {pixel.likes}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {pixel.forSale && pixel.price && (
                              <span className="font-bold text-primary">{pixel.price}€</span>
                            )}
                            
                            <Button variant="ghost" size="icon">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleShare(pixel)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Minhas Coleções</h2>
              <Button onClick={handleCreateCollection}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Coleção
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCollections.map((collection) => (
                <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={collection.isPublic ? 'default' : 'secondary'}>
                        {collection.isPublic ? 'Público' : 'Privado'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{collection.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span className="font-medium">{collection.pixelCount}/{collection.targetPixels}</span>
                      </div>
                      <Progress value={collection.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {collection.totalViews}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {collection.totalLikes}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {collection.theme}
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Estatísticas Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{mockPixels.length}</p>
                      <p className="text-sm text-muted-foreground">Total de Pixels</p>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <p className="text-2xl font-bold text-accent">{mockCollections.length}</p>
                      <p className="text-sm text-muted-foreground">Coleções</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-500">
                        {mockPixels.reduce((sum, pixel) => sum + pixel.views, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total de Visualizações</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-red-500">
                        {mockPixels.reduce((sum, pixel) => sum + pixel.likes, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total de Likes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <PieChart className="h-5 w-5 mr-2" />
                    Distribuição por Região
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Lisboa', 'Porto', 'Algarve'].map((region) => {
                      const count = mockPixels.filter(p => p.region === region).length;
                      const percentage = (count / mockPixels.length) * 100;
                      
                      return (
                        <div key={region} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{region}</span>
                            <span className="font-medium">{count} pixels ({percentage.toFixed(0)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <LineChart className="h-5 w-5 mr-2" />
                  Performance dos Pixels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPixels.slice(0, 5).map((pixel) => (
                    <div key={pixel.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <img 
                        src={pixel.imageUrl} 
                        alt={pixel.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{pixel.title}</h4>
                        <p className="text-sm text-muted-foreground">{pixel.region}</p>
                      </div>
                      
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-primary">{pixel.views}</p>
                          <p className="text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-red-500">{pixel.likes}</p>
                          <p className="text-muted-foreground">Likes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Trophy className="h-5 w-5 mr-2" />
                    Pixels à Venda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPixels.filter(p => p.forSale).map((pixel) => (
                      <div key={pixel.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                        <img 
                          src={pixel.imageUrl} 
                          alt={pixel.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{pixel.title}</h4>
                          <p className="text-sm text-muted-foreground">{pixel.region}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-primary">{pixel.price}€</p>
                          <p className="text-xs text-muted-foreground">{pixel.views} views</p>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {mockPixels.filter(p => p.forSale).length === 0 && (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum pixel à venda</p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Colocar Pixel à Venda
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Estatísticas de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-500">€1,250</p>
                      <p className="text-sm text-muted-foreground">Total Ganho</p>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-blue-500">15</p>
                      <p className="text-sm text-muted-foreground">Pixels Vendidos</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Preço Médio</span>
                      <span className="font-medium">€83</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pixel Mais Caro</span>
                      <span className="font-medium">€250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Taxa de Conversão</span>
                      <span className="font-medium">12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}