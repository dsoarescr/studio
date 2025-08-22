'use client';

import React, { useState, useMemo } from 'react';
import { DollarSign, MapPin, Activity, Eye, Heart, RefreshCw, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';

interface AnalyticsData {
  overview: {
    totalPixels: number;
    totalValue: number;
    totalViews: number;
    totalLikes: number;
    averagePrice: number;
    growthRate: number;
  };
  performance: {
    daily: { date: string; value: number }[];
    weekly: { week: string; value: number }[];
    monthly: { month: string; value: number }[];
  };
  regions: {
    name: string;
    pixels: number;
    value: number;
    growth: number;
  }[];
  rarities: {
    rarity: string;
    count: number;
    value: number;
    percentage: number;
  }[];
  topPixels: {
    id: string;
    title: string;
    x: number;
    y: number;
    price: number;
    views: number;
    likes: number;
    region: string;
    rarity: string;
  }[];
  insights: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    value: string;
    change: number;
  }[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('value');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { credits, specialCredits, pixels, level } = useUserStore();

  // Mock analytics data
  const analyticsData: AnalyticsData = useMemo(() => ({
    overview: {
      totalPixels: 42,
      totalValue: 12500,
      totalViews: 15420,
      totalLikes: 892,
      averagePrice: 298,
      growthRate: 15.4,
    },
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT'),
        value: Math.floor(Math.random() * 1000) + 500,
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        week: `Semana ${i + 1}`,
        value: Math.floor(Math.random() * 5000) + 2000,
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT', { month: 'short' }),
        value: Math.floor(Math.random() * 20000) + 10000,
      })),
    },
    regions: [
      { name: 'Lisboa', pixels: 18, value: 6500, growth: 12.5 },
      { name: 'Porto', pixels: 12, value: 4200, growth: 8.3 },
      { name: 'Coimbra', pixels: 8, value: 2800, growth: 15.7 },
      { name: 'Faro', pixels: 4, value: 1000, growth: -2.1 },
    ],
    rarities: [
      { rarity: 'Comum', count: 15, value: 1500, percentage: 35.7 },
      { rarity: 'Incomum', count: 12, value: 3000, percentage: 28.6 },
      { rarity: 'Raro', count: 8, value: 4000, percentage: 19.0 },
      { rarity: 'Épico', count: 5, value: 5000, percentage: 11.9 },
      { rarity: 'Lendário', count: 2, value: 10000, percentage: 4.8 },
    ],
    topPixels: [
      {
        id: '1',
        title: 'Torre de Belém',
        x: 580,
        y: 1355,
        price: 2500,
        views: 1247,
        likes: 89,
        region: 'Lisboa',
        rarity: 'Lendário',
      },
      {
        id: '2',
        title: 'Ponte 25 de Abril',
        x: 575,
        y: 1365,
        price: 1800,
        views: 892,
        likes: 67,
        region: 'Lisboa',
        rarity: 'Épico',
      },
      {
        id: '3',
        title: 'Universidade de Coimbra',
        x: 650,
        y: 1180,
        price: 1200,
        views: 756,
        likes: 45,
        region: 'Coimbra',
        rarity: 'Raro',
      },
    ],
    insights: [
      {
        type: 'positive',
        title: 'Crescimento de Valor',
        description: 'Seus pixels aumentaram 15.4% em valor este mês',
        value: '+€1,850',
        change: 15.4,
      },
      {
        type: 'positive',
        title: 'Engajamento Alto',
        description: 'Aumento de 23% nas visualizações dos seus pixels',
        value: '+2,847',
        change: 23,
      },
      {
        type: 'neutral',
        title: 'Diversificação Regional',
        description: 'Você possui pixels em 4 regiões diferentes',
        value: '4 regiões',
        change: 0,
      },
      {
        type: 'negative',
        title: 'Pixel em Faro',
        description: 'Pixel em Faro perdeu 2.1% do valor',
        value: '-€21',
        change: -2.1,
      },
    ],
  }), []);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'value': return <DollarSign className="h-4 w-4" />;
      case 'views': return <Eye className="h-4 w-4" />;
      case 'likes': return <Heart className="h-4 w-4" />;
      case 'pixels': return <MapPin className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'value': return 'Valor Total';
      case 'views': return 'Visualizações';
      case 'likes': return 'Likes';
      case 'pixels': return 'Pixels';
      default: return 'Métrica';
    }
  };

  const getMetricValue = (metric: string) => {
    switch (metric) {
      case 'value': return `€${analyticsData.overview.totalValue.toLocaleString()}`;
      case 'views': return analyticsData.overview.totalViews.toLocaleString();
      case 'likes': return analyticsData.overview.totalLikes.toLocaleString();
      case 'pixels': return analyticsData.overview.totalPixels.toString();
      default: return '0';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
          <p className="text-muted-foreground">
            Análise detalhada do seu portfólio de pixels
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{analyticsData.overview.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{analyticsData.overview.growthRate}%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pixels</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalPixels}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3</span> este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+23%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="value">Valor</SelectItem>
                    <SelectItem value="views">Visualizações</SelectItem>
                    <SelectItem value="likes">Likes</SelectItem>
                    <SelectItem value="pixels">Pixels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.performance.daily.slice(-7).map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{
                        height: `${(day.value / Math.max(...analyticsData.performance.daily.map(d => d.value))) * 200}px`,
                      }}
                    />
                    <span className="text-xs text-muted-foreground mt-2">
                      {day.date.split('/')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  {getChangeIcon(insight.change)}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    <p className={`text-sm font-semibold ${getChangeColor(insight.change)}`}>
                      {insight.value}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="regions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="regions">Regiões</TabsTrigger>
          <TabsTrigger value="rarities">Raridades</TabsTrigger>
          <TabsTrigger value="top-pixels">Top Pixels</TabsTrigger>
        </TabsList>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.regions.map((region, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{region.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{region.pixels}</div>
                  <p className="text-sm text-muted-foreground">
                    €{region.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {getChangeIcon(region.growth)}
                    <span className={`text-xs ${getChangeColor(region.growth)}`}>
                      {region.growth > 0 ? '+' : ''}{region.growth}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rarities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {analyticsData.rarities.map((rarity, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{rarity.rarity}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rarity.count}</div>
                  <p className="text-sm text-muted-foreground">
                    €{rarity.value.toLocaleString()}
                  </p>
                  <Progress value={rarity.percentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {rarity.percentage}% do total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top-pixels" className="space-y-4">
          <div className="space-y-4">
            {analyticsData.topPixels.map((pixel, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{pixel.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          ({pixel.x}, {pixel.y}) • {pixel.region}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{pixel.rarity}</Badge>
                          <span className="text-sm text-muted-foreground">
                            €{pixel.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {pixel.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {pixel.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

