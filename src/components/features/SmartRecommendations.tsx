'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, Target, TrendingUp, Users,
  Eye, Heart, Star, Clock, MapPin,
  Palette, Zap, Crown, Diamond, Tag,
  Filter, RefreshCw, Settings
} from 'lucide-react';

interface RecommendedItem {
  id: string;
  type: 'pixel' | 'collection' | 'artist' | 'event';
  title: string;
  description: string;
  image?: string;
  price?: number;
  rating?: number;
  matchScore: number;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    saves?: number;
  };
  location?: string;
  creator?: {
    name: string;
    avatar?: string;
    rating: number;
  };
}

const mockRecommendations: RecommendedItem[] = [
  {
    id: '1',
    type: 'pixel',
    title: 'Pixel Art Futurista',
    description: 'Uma obra de arte digital com tema cyberpunk',
    price: 500,
    rating: 4.8,
    matchScore: 95,
    tags: ['cyberpunk', 'futurista', 'neon'],
    stats: {
      views: 1200,
      likes: 350,
      saves: 45
    },
    creator: {
      name: 'João Silva',
      rating: 4.9
    }
  },
  {
    id: '2',
    type: 'collection',
    title: 'Coleção Retro Gaming',
    description: 'Uma coleção inspirada em jogos clássicos',
    matchScore: 88,
    tags: ['retro', 'gaming', 'nostalgia'],
    stats: {
      views: 800,
      likes: 220
    }
  },
  {
    id: '3',
    type: 'artist',
    title: 'Maria Santos',
    description: 'Artista especializada em pixel art minimalista',
    matchScore: 92,
    tags: ['minimalista', 'profissional', 'premiado'],
    stats: {
      views: 1500,
      likes: 450
    }
  }
];

export function SmartRecommendations() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Recomendações Atualizadas",
        description: "Novas sugestões baseadas nos seus interesses.",
      });
    }, 2000);
  };

  const handleFollow = (id: string) => {
    toast({
      title: "Artista Seguido",
      description: "Você receberá atualizações sobre este artista.",
    });
  };

  const handleSave = (id: string) => {
    toast({
      title: "Item Salvo",
      description: "Item adicionado aos seus favoritos.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Recomendações Inteligentes
              </CardTitle>
              <CardDescription>
                Descobertas personalizadas baseadas nos seus interesses
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  refreshing && "animate-spin"
                )} />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="foryou">
                <Target className="h-4 w-4 mr-2" />
                Para Você
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tendências
              </TabsTrigger>
              <TabsTrigger value="similar">
                <Users className="h-4 w-4 mr-2" />
                Similares
              </TabsTrigger>
              <TabsTrigger value="discover">
                <Eye className="h-4 w-4 mr-2" />
                Descobrir
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foryou" className="space-y-4">
              {mockRecommendations.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Preview/Avatar */}
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                        {item.type === 'artist' ? (
                          <Users className="h-8 w-8 text-muted-foreground" />
                        ) : (
                          <Eye className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {item.title}
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                {item.type}
                              </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              "bg-gradient-to-r",
                              item.matchScore >= 90
                                ? "from-green-500 to-emerald-500"
                                : "from-blue-500 to-cyan-500"
                            )}
                          >
                            {item.matchScore}% match
                          </Badge>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {item.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {item.stats.likes}
                          </span>
                          {item.stats.saves && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {item.stats.saves}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          {item.type === 'artist' ? (
                            <Button
                              size="sm"
                              onClick={() => handleFollow(item.id)}
                            >
                              Seguir Artista
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleSave(item.id)}
                            >
                              Salvar Item
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendências do Momento</CardTitle>
                  <CardDescription>
                    O que está em alta na comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-red-500/10">
                              <TrendingUp className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Arte Cyberpunk</h4>
                              <p className="text-sm text-muted-foreground">
                                +200% de interesse esta semana
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-green-500/10">
                              <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Pixel Art Retro</h4>
                              <p className="text-sm text-muted-foreground">
                                +150% de interesse esta semana
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="similar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Baseado em Suas Interações</CardTitle>
                  <CardDescription>
                    Itens similares aos que você já interagiu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="aspect-square bg-muted rounded-lg mb-4" />
                          <h4 className="font-semibold">Pixel Art Similar #{i}</h4>
                          <p className="text-sm text-muted-foreground">
                            85% de similaridade
                          </p>
                          <Button className="w-full mt-4" size="sm">
                            Ver Mais
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discover" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Descubra Novo Conteúdo</CardTitle>
                  <CardDescription>
                    Explore além das suas preferências usuais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Abstrato', 'Paisagens', 'Personagens', 'Animais'].map((category) => (
                      <Card key={category}>
                        <CardContent className="p-4 text-center">
                          <div className="aspect-square bg-muted rounded-lg mb-4" />
                          <h4 className="font-semibold">{category}</h4>
                          <Button className="w-full mt-2" size="sm">
                            Explorar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Recomendações atualizadas em tempo real
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Ajustar Preferências
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
