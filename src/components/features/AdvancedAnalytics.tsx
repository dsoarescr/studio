// src/components/features/AdvancedAnalytics.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, 
  Eye, Heart, Share2, DollarSign, Users, MapPin, Calendar,
  Target, Zap, Crown, Gem, Star, Award, Activity, Clock,
  Download, Filter, RefreshCw, Settings, Info, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsData {
  views: { total: number; change: number; trend: 'up' | 'down' };
  likes: { total: number; change: number; trend: 'up' | 'down' };
  shares: { total: number; change: number; trend: 'up' | 'down' };
  revenue: { total: number; change: number; trend: 'up' | 'down' };
  engagement: { rate: number; change: number; trend: 'up' | 'down' };
}

interface RegionalData {
  region: string;
  pixels: number;
  revenue: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
}

interface TimeSeriesData {
  date: string;
  views: number;
  likes: number;
  revenue: number;
}

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    views: { total: 12450, change: 15.3, trend: 'up' },
    likes: { total: 2340, change: 8.7, trend: 'up' },
    shares: { total: 456, change: -2.1, trend: 'down' },
    revenue: { total: 1250, change: 23.5, trend: 'up' },
    engagement: { rate: 18.7, change: 5.2, trend: 'up' }
  });

  const [regionalData] = useState<RegionalData[]>([
    { region: 'Lisboa', pixels: 45, revenue: 890, growth: 23.5, trend: 'up' },
    { region: 'Porto', pixels: 32, revenue: 650, growth: 15.2, trend: 'up' },
    { region: 'Coimbra', pixels: 18, revenue: 320, growth: -5.3, trend: 'down' },
    { region: 'Braga', pixels: 12, revenue: 240, growth: 8.9, trend: 'up' },
    { region: 'Faro', pixels: 8, revenue: 180, growth: 12.1, trend: 'up' }
  ]);

  const [timeSeriesData] = useState<TimeSeriesData[]>([
    { date: '2024-01-01', views: 1200, likes: 180, revenue: 45 },
    { date: '2024-01-02', views: 1350, likes: 210, revenue: 67 },
    { date: '2024-01-03', views: 1180, likes: 195, revenue: 52 },
    { date: '2024-01-04', views: 1420, likes: 230, revenue: 78 },
    { date: '2024-01-05', views: 1580, likes: 275, revenue: 89 }
  ]);

  const [predictions] = useState({
    nextWeekViews: 15600,
    nextWeekRevenue: 1450,
    growthForecast: 18.5,
    riskLevel: 'low'
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-gradient-gold">
            Analytics Avançados
          </h1>
          <p className="text-muted-foreground">
            Insights detalhados sobre o desempenho dos seus pixels
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
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
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <Badge variant="outline" className={getTrendColor(analyticsData.views.trend)}>
                {analyticsData.views.trend === 'up' ? '+' : ''}{analyticsData.views.change}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.views.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Visualizações</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <Badge variant="outline" className={getTrendColor(analyticsData.likes.trend)}>
                {analyticsData.likes.trend === 'up' ? '+' : ''}{analyticsData.likes.change}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.likes.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Curtidas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Share2 className="h-5 w-5 text-green-500" />
              <Badge variant="outline" className={getTrendColor(analyticsData.shares.trend)}>
                {analyticsData.shares.trend === 'up' ? '+' : ''}{analyticsData.shares.change}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.shares.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Partilhas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <Badge variant="outline" className={getTrendColor(analyticsData.revenue.trend)}>
                {analyticsData.revenue.trend === 'up' ? '+' : ''}{analyticsData.revenue.change}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">€{analyticsData.revenue.total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Receita</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-purple-500" />
              <Badge variant="outline" className={getTrendColor(analyticsData.engagement.trend)}>
                {analyticsData.engagement.trend === 'up' ? '+' : ''}{analyticsData.engagement.change}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.engagement.rate}%</div>
            <p className="text-sm text-muted-foreground">Engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audiência</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Performance ao Longo do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de Performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Distribuição Regional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionalData.map(region => (
                    <div key={region.region} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{region.region}</span>
                          {getTrendIcon(region.trend)}
                        </div>
                        <div className="text-right">
                          <span className="font-bold">€{region.revenue}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({region.pixels} pixels)
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={(region.revenue / 1000) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Pixels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Pixels com Melhor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Pixel Lisboa Centro', views: 2340, likes: 456, revenue: 234, trend: 'up' },
                  { name: 'Arte Porto Ribeira', views: 1890, likes: 378, revenue: 189, trend: 'up' },
                  { name: 'Coimbra Histórica', views: 1560, likes: 234, revenue: 156, trend: 'down' },
                  { name: 'Braga Tradicional', views: 1230, likes: 189, revenue: 123, trend: 'up' }
                ].map((pixel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded" />
                      <div>
                        <h4 className="font-medium">{pixel.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            €{pixel.revenue}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getTrendIcon(pixel.trend as any)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-500">
                  <Zap className="h-5 w-5 mr-2" />
                  Previsões IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {predictions.nextWeekViews.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Visualizações Previstas</p>
                    <p className="text-xs text-blue-500">Próxima semana</p>
                  </div>
                  
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      €{predictions.nextWeekRevenue}
                    </div>
                    <p className="text-sm text-muted-foreground">Receita Prevista</p>
                    <p className="text-xs text-green-500">Próxima semana</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Crescimento Previsto</span>
                    <span className="font-bold text-green-500">+{predictions.growthForecast}%</span>
                  </div>
                  <Progress value={predictions.growthForecast} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-500 font-medium">
                    Risco Baixo - Tendência Positiva
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Recomendações IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    type: 'Oportunidade',
                    message: 'Pixels em Óbidos estão 23% subvalorizados',
                    action: 'Investir Agora',
                    priority: 'high'
                  },
                  {
                    type: 'Tendência',
                    message: 'Arte colaborativa cresceu 45% esta semana',
                    action: 'Criar Projeto',
                    priority: 'medium'
                  },
                  {
                    type: 'Otimização',
                    message: 'Melhor horário para publicar: 19h-21h',
                    action: 'Agendar Posts',
                    priority: 'low'
                  }
                ].map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-500/10' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                    'border-blue-500 bg-blue-500/10'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{rec.type}</h4>
                        <p className="text-sm text-muted-foreground">{rec.message}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}