'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp, ChartLine, BarChart2, PieChart,
  Calendar, Clock, Filter, Download, Share2,
  Settings, RefreshCw, Zap, Target, Users,
  Eye, Heart, Star, ArrowUp, ArrowDown,
  Palette, MapPin, Tag, Search
} from 'lucide-react';

interface Trend {
  id: string;
  category: string;
  name: string;
  description: string;
  growth: number;
  confidence: number;
  timeframe: string;
  stats: {
    volume: number;
    engagement: number;
    reach: number;
  };
  tags: string[];
  relatedTrends: string[];
  prediction: {
    direction: 'up' | 'down' | 'stable';
    probability: number;
    duration: string;
  };
}

const mockTrends: Trend[] = [
  {
    id: '1',
    category: 'Style',
    name: 'Pixel Art Cyberpunk',
    description: 'Estilo futurista com elementos neon',
    growth: 156,
    confidence: 92,
    timeframe: '7d',
    stats: {
      volume: 1200,
      engagement: 85,
      reach: 25000
    },
    tags: ['cyberpunk', 'neon', 'futuristic'],
    relatedTrends: ['Vaporwave', 'Retro Gaming'],
    prediction: {
      direction: 'up',
      probability: 85,
      duration: '2 weeks'
    }
  },
  {
    id: '2',
    category: 'Theme',
    name: 'Pixel Landscapes',
    description: 'Paisagens naturais em pixel art',
    growth: 78,
    confidence: 88,
    timeframe: '30d',
    stats: {
      volume: 850,
      engagement: 92,
      reach: 18000
    },
    tags: ['nature', 'landscape', 'scenic'],
    relatedTrends: ['Minimal Pixels', 'Environmental Art'],
    prediction: {
      direction: 'up',
      probability: 75,
      duration: '1 month'
    }
  }
];

export function TrendAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Análise Atualizada",
      description: "As tendências foram atualizadas com os dados mais recentes.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Relatório Exportado",
      description: "O relatório de tendências foi exportado com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Análise de Tendências
              </CardTitle>
              <CardDescription>
                Análise avançada de tendências com IA
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24 horas</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">
                <ChartLine className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="predictions">
                <Target className="h-4 w-4 mr-2" />
                Previsões
              </TabsTrigger>
              <TabsTrigger value="categories">
                <PieChart className="h-4 w-4 mr-2" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Zap className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="p-2 rounded-full bg-green-500/10 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">+245%</div>
                      <p className="text-sm text-muted-foreground">
                        Crescimento Médio
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="p-2 rounded-full bg-blue-500/10 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">12.5k</div>
                      <p className="text-sm text-muted-foreground">
                        Alcance Total
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="p-2 rounded-full bg-purple-500/10 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold">89%</div>
                      <p className="text-sm text-muted-foreground">
                        Taxa de Engajamento
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="p-2 rounded-full bg-amber-500/10 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <Star className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="text-2xl font-bold">4.8</div>
                      <p className="text-sm text-muted-foreground">
                        Pontuação de Relevância
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Tendências */}
              <div className="space-y-4">
                {mockTrends.map((trend) => (
                  <Card key={trend.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {trend.name}
                            </h3>
                            <Badge variant="secondary">
                              {trend.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {trend.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {trend.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                "bg-gradient-to-r",
                                trend.growth > 100
                                  ? "from-green-500 to-emerald-500"
                                  : "from-blue-500 to-cyan-500"
                              )}
                            >
                              +{trend.growth}%
                            </Badge>
                            <Badge variant="outline">
                              {trend.confidence}% confiança
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Volume</span>
                            <span className="font-mono">
                              {trend.stats.volume}
                            </span>
                          </div>
                          <Progress value={trend.stats.volume / 20} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Engajamento</span>
                            <span className="font-mono">
                              {trend.stats.engagement}%
                            </span>
                          </div>
                          <Progress value={trend.stats.engagement} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Alcance</span>
                            <span className="font-mono">
                              {trend.stats.reach}
                            </span>
                          </div>
                          <Progress value={trend.stats.reach / 500} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Previsão: {trend.prediction.duration}
                          </Badge>
                          {trend.prediction.direction === 'up' ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : trend.prediction.direction === 'down' ? (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm">
                            {trend.prediction.probability}% probabilidade
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Previsões de Tendências</CardTitle>
                  <CardDescription>
                    Análise preditiva baseada em IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-500/10">
                              <ArrowUp className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                Tendências em Ascensão
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Previsão para próximos 30 dias
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Pixel Art Minimalista</span>
                              <Badge variant="outline">+45%</Badge>
                            </div>
                            <Progress value={45} />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-red-500/10">
                              <ArrowDown className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                Tendências em Declínio
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Monitoramento atual
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Pixel Art 3D</span>
                              <Badge variant="outline">-15%</Badge>
                            </div>
                            <Progress value={15} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crescimento por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Paisagens', 'Personagens', 'Abstrato', 'Gaming'].map((category) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{category}</span>
                            <span>+{Math.floor(Math.random() * 100)}%</span>
                          </div>
                          <Progress value={Math.random() * 100} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Insights Automáticos</CardTitle>
                  <CardDescription>
                    Descobertas relevantes identificadas pela IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              Oportunidade de Crescimento
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Pixel art com temas naturais está mostrando forte potencial de crescimento nos próximos meses.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">+156% crescimento</Badge>
                              <Badge variant="outline">92% confiança</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-blue-500/10">
                            <Target className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              Padrão Identificado
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Usuários que criam pixel art em estilo cyberpunk têm 3x mais engajamento.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">300% mais engajamento</Badge>
                              <Badge variant="outline">88% confiança</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurar Análise
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
