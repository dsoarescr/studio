'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Star, Eye, Heart, Share2, MessageSquare, Crown, Gem, 
  MapPin, Calendar, TrendingUp, Award, Sparkles, Flame,
  Users, Globe, Camera, Video, Music, Palette, Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShowcasePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    followers: number;
  };
  identity: {
    name: string;
    description: string;
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
  featured: boolean;
  trending: boolean;
  createdAt: string;
}

interface PixelShowcaseProps {
  children: React.ReactNode;
}

const mockShowcasePixels: ShowcasePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    owner: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25,
      followers: 1234
    },
    identity: {
      name: 'Coração de Lisboa',
      description: 'Uma homenagem à beleza eterna da capital portuguesa, onde cada pixel conta uma história de séculos de história e cultura.',
      theme: 'sunset',
      tags: ['lisboa', 'história', 'cultura', 'arte']
    },
    stats: {
      views: 15420,
      likes: 2340,
      shares: 456,
      comments: 189
    },
    media: {
      type: 'image',
      url: 'https://placehold.co/400x400/D4A757/FFFFFF?text=Lisboa+Art'
    },
    rarity: 'Lendário',
    featured: true,
    trending: true,
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    owner: {
      name: 'PortoCreative',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18,
      followers: 567
    },
    identity: {
      name: 'Alma do Douro',
      description: 'Inspirado nas cores do vinho do Porto e na magia do rio Douro.',
      theme: 'ocean',
      tags: ['porto', 'douro', 'vinho', 'tradição']
    },
    stats: {
      views: 8930,
      likes: 1456,
      shares: 234,
      comments: 89
    },
    media: {
      type: 'animation',
      url: 'https://placehold.co/400x400/7DF9FF/000000?text=Porto+Animation'
    },
    rarity: 'Épico',
    featured: false,
    trending: true,
    createdAt: '2024-03-14'
  }
];

export default function PixelShowcase({ children }: PixelShowcaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<ShowcasePixel | null>(null);
  const [pixels] = useState(mockShowcasePixels);
  const { toast } = useToast();

  const handleLike = (pixelId: string) => {
    toast({
      title: "❤️ Pixel Curtido!",
      description: "Adicionado aos seus favoritos",
    });
  };

  const handleShare = (pixel: ShowcasePixel) => {
    if (navigator.share) {
      navigator.share({
        title: pixel.identity.name,
        text: pixel.identity.description,
        url: window.location.href
      });
    } else {
      toast({
        title: "Link Copiado",
        description: "Link do pixel copiado para a área de transferência",
      });
    }
  };

  const handleFollow = (ownerName: string) => {
    toast({
      title: "Seguindo!",
      description: `Agora está a seguir ${ownerName}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <DialogTitle className="flex items-center">
            <Star className="h-6 w-6 mr-3 text-purple-500" />
            Showcase de Pixels
            <Badge className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Identidades Únicas
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="featured" className="flex-1 flex flex-col">
          <TabsList className="px-6 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="featured">
              <Crown className="h-4 w-4 mr-2" />
              Em Destaque
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Calendar className="h-4 w-4 mr-2" />
              Recentes
            </TabsTrigger>
            <TabsTrigger value="popular">
              <Heart className="h-4 w-4 mr-2" />
              Populares
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden p-6">
            <TabsContent value="featured" className="h-full">
              {!selectedPixel ? (
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pixels.filter(p => p.featured).map((pixel, index) => (
                      <motion.div
                        key={pixel.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card 
                          className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                          onClick={() => setSelectedPixel(pixel)}
                        >
                          <div className="relative">
                            <img 
                              src={pixel.media.url} 
                              alt={pixel.identity.name}
                              className="w-full h-64 object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            <div className="absolute bottom-4 left-4 text-white">
                              <h3 className="text-xl font-bold">{pixel.identity.name}</h3>
                              <p className="text-white/80 text-sm">
                                ({pixel.x}, {pixel.y}) • {pixel.region}
                              </p>
                            </div>
                            
                            <div className="absolute top-4 right-4 flex gap-2">
                              <Badge className="bg-amber-500">
                                <Crown className="h-3 w-3 mr-1" />
                                Destaque
                              </Badge>
                              {pixel.trending && (
                                <Badge className="bg-red-500 animate-pulse">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={pixel.owner.avatar} />
                                <AvatarFallback>{pixel.owner.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{pixel.owner.name}</span>
                                  {pixel.owner.verified && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {pixel.owner.followers.toLocaleString()} seguidores
                                </p>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleFollow(pixel.owner.name)}>
                                Seguir
                              </Button>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {pixel.identity.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {pixel.stats.views.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {pixel.stats.likes.toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleLike(pixel.id)}>
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleShare(pixel)}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                // Visualização detalhada do pixel
                <div className="h-full flex">
                  <div className="flex-1">
                    <div className="relative h-96">
                      <img 
                        src={selectedPixel.media.url} 
                        alt={selectedPixel.identity.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPixel(null)}
                        className="absolute top-4 left-4"
                      >
                        ← Voltar
                      </Button>
                    </div>
                    
                    <div className="mt-6">
                      <h2 className="text-2xl font-bold mb-2">{selectedPixel.identity.name}</h2>
                      <p className="text-muted-foreground mb-4">{selectedPixel.identity.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {selectedPixel.identity.tags.map(tag => (
                          <Badge key={tag} variant="outline">#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-80 border-l p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedPixel.owner.avatar} />
                          <AvatarFallback>{selectedPixel.owner.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{selectedPixel.owner.name}</span>
                            {selectedPixel.owner.verified && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedPixel.owner.followers.toLocaleString()} seguidores
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <div className="text-xl font-bold text-blue-500">
                            {selectedPixel.stats.views.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Visualizações</div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <div className="text-xl font-bold text-red-500">
                            {selectedPixel.stats.likes.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Curtidas</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => handleLike(selectedPixel.id)}>
                          <Heart className="h-4 w-4 mr-2" />
                          Curtir
                        </Button>
                        <Button variant="outline" onClick={() => handleShare(selectedPixel)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}