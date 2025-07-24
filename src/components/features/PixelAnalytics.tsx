'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, Activity, MapPin, Eye, Heart, Star, Coins, Trophy, Users, Calendar, Clock, Zap, Target, Award, Gem, Sparkles, Crown, Flame, CloudLightning as Lightning, Download, Share2, RefreshCw, Filter, Search, SortAsc, Info } from "lucide-react";
import { SimpleBarChart, DonutChart, StatCard, MetricGrid } from '@/components/ui/data-visualization';

interface PixelAnalyticsProps {
  pixelData?: {
    coordinates: { x: number; y: number };
    region: string;
    owner?: string;
    views: number;
    likes: number;
    price: number;
    rarity: string;
    lastActivity?: Date;
  };
}

export default function PixelAnalytics({ pixelData }: PixelAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock analytics data
  const analyticsData = {
    views: {
      total: pixelData?.views || 1234,
      trend: 15.3,
      history: [
        { date: '2024-03-01', views: 45 },
        { date: '2024-03-02', views: 67 },
        { date: '2024-03-03', views: 89 },
        { date: '2024-03-04', views: 123 },
        { date: '2024-03-05', views: 156 },
      ]
    },
    engagement: {
      likes: pixelData?.likes || 89,
      shares: 23,
      comments: 12,
      bookmarks: 34
    },
    demographics: {
      regions: [
        { name: 'Lisboa', percentage: 35, count: 432 },
        { name: 'Porto', percentage: 28, count: 345 },
        { name: 'Coimbra', percentage: 15, count: 185 },
        { name: 'Outros', percentage: 22, count: 272 }
      ],
      devices: [
        { name: 'Desktop', percentage: 60, count: 741 },
        { name: 'Mobile', percentage: 35, count: 432 },
        { name: 'Tablet', percentage: 5, count: 61 }
      ]
    },
    performance: {
      loadTime: 1.2,
      interactionRate: 23.5,
      bounceRate: 12.3,
      avgSessionTime: '2m 34s'
    }
  };

  const handleExportAnalytics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Análises Exportadas",
        description: "Os dados de análise foram exportados com sucesso.",
      });
    }, 1500);
  };

  const handleShareAnalytics = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Análises do Pixel Universe',
        text: `Confira as análises do pixel (${pixelData?.coordinates.x}, ${pixelData?.coordinates.y})`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "Link das análises copiado para a área de transferência.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <BarChart3 className="h-6 w-6 mr-3" />
                Análises do Pixel
              </CardTitle>
              {pixelData && (
                <CardDescription className="mt-2">
                  Dados detalhados para o pixel ({pixelData.coordinates.x}, {pixelData.coordinates.y}) em {pixelData.region}
                </CardDescription>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShareAnalytics}>
                <Share2 className="h-4 w-4 mr-2" />
                Partilhar
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAnalytics} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['24h', '7d', '30d', '1y'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Visualizações Totais"
          value={analyticsData.views.total.toLocaleString()}
          change={{ value: analyticsData.views.trend, type: 'increase', period: timeRange }}
          icon={<Eye className="h-6 w-6" />}
          color="text-blue-500"
        />
        
        <StatCard
          title="Curtidas"
          value={analyticsData.engagement.likes}
          change={{ value: 8.2, type: 'increase', period: timeRange }}
          icon={<Heart className="h-6 w-6" />}
          color="text-red-500"
        />
        
        <StatCard
          title="Taxa de Interação"
          value={`${analyticsData.performance.interactionRate}%`}
          change={{ value: 3.1, type: 'increase', period: timeRange }}
          icon={<Activity className="h-6 w-6" />}
          color="text-green-500"
        />
        
        <StatCard
          title="Valor Estimado"
          value={`€${pixelData?.price || 150}`}
          change={{ value: 12.5, type: 'increase', period: timeRange }}
          icon={<Coins className="h-6 w-6" />}
          color="text-primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <SimpleBarChart
          title="Visualizações por Dia"
          data={analyticsData.views.history.map(item => ({
            label: new Date(item.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
            value: item.views,
            icon: <Eye className="h-4 w-4" />
          }))}
          showTrends={true}
        />

        {/* Regional Distribution */}
        <DonutChart
          title="Distribuição Regional"
          data={analyticsData.demographics.regions.map(region => ({
            label: region.name,
            value: region.count,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          }))}
          centerText="Visualizações"
          centerValue={analyticsData.views.total.toLocaleString()}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Interação</TabsTrigger>
          <TabsTrigger value="demographics">Demografia</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.engagement.likes}</div>
              <div className="text-sm text-muted-foreground">Curtidas</div>
            </Card>
            
            <Card className="text-center p-4">
              <Share2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.engagement.shares}</div>
              <div className="text-sm text-muted-foreground">Partilhas</div>
            </Card>
            
            <Card className="text-center p-4">
              <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.engagement.comments}</div>
              <div className="text-sm text-muted-foreground">Comentários</div>
            </Card>
            
            <Card className="text-center p-4">
              <Bookmark className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.engagement.bookmarks}</div>
              <div className="text-sm text-muted-foreground">Marcadores</div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Por Região</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.demographics.regions.map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{region.name}</span>
                      <span className="font-medium">{region.percentage}%</span>
                    </div>
                    <Progress value={region.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Por Dispositivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.demographics.devices.map((device, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{device.name}</span>
                      <span className="font-medium">{device.percentage}%</span>
                    </div>
                    <Progress value={device.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.performance.loadTime}s</div>
              <div className="text-sm text-muted-foreground">Tempo de Carregamento</div>
            </Card>
            
            <Card className="text-center p-4">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.performance.interactionRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Interação</div>
            </Card>
            
            <Card className="text-center p-4">
              <Activity className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.performance.bounceRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Rejeição</div>
            </Card>
            
            <Card className="text-center p-4">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analyticsData.performance.avgSessionTime}</div>
              <div className="text-sm text-muted-foreground">Tempo Médio</div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Tendências de Crescimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Visualizações</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-500 font-bold">+{analyticsData.views.trend}%</div>
                    <div className="text-xs text-muted-foreground">vs período anterior</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Curtidas</span>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-500 font-bold">+8.2%</div>
                    <div className="text-xs text-muted-foreground">vs período anterior</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Popularidade</span>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-500 font-bold">+12.7%</div>
                    <div className="text-xs text-muted-foreground">vs período anterior</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights and Recommendations */}
      <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-accent">
            <Sparkles className="h-5 w-5 mr-2" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-500">Crescimento Acelerado</h4>
                <p className="text-sm text-muted-foreground">
                  Este pixel está a ganhar popularidade rapidamente. Considere aumentar o preço ou criar conteúdo relacionado.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-500">Audiência Diversificada</h4>
                <p className="text-sm text-muted-foreground">
                  O pixel atrai visitantes de várias regiões. Considere criar conteúdo multilíngue.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-500">Horário de Pico</h4>
                <p className="text-sm text-muted-foreground">
                  A maior atividade ocorre entre 18h-22h. Publique atualizações neste período.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}