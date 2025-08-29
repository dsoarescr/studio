'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  LineChart,
  PieChart,
  DoughnutChart,
  AreaChart,
  ScatterChart,
} from '@/components/ui/charts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Eye,
  MousePointer,
  Clock,
  Calendar,
  Map,
  Target,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Download,
  Share2,
  Filter,
  RefreshCw,
  Settings,
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    history: number[];
  };
  users: {
    total: number;
    active: number;
    new: number;
    retention: number;
  };
  pixels: {
    total: number;
    sold: number;
    listed: number;
    averagePrice: number;
  };
  engagement: {
    views: number;
    interactions: number;
    averageTime: number;
    bounceRate: number;
  };
  demographics: {
    regions: {
      name: string;
      value: number;
    }[];
    devices: {
      name: string;
      value: number;
    }[];
  };
}

const mockData: AnalyticsData = {
  revenue: {
    total: 25000,
    change: 15,
    history: [1200, 1500, 1800, 2200, 2500, 2800, 3000],
  },
  users: {
    total: 5000,
    active: 3500,
    new: 250,
    retention: 85,
  },
  pixels: {
    total: 10000,
    sold: 7500,
    listed: 1500,
    averagePrice: 150,
  },
  engagement: {
    views: 25000,
    interactions: 12000,
    averageTime: 5.5,
    bounceRate: 25,
  },
  demographics: {
    regions: [
      { name: 'Porto', value: 35 },
      { name: 'Lisboa', value: 30 },
      { name: 'Braga', value: 15 },
      { name: 'Coimbra', value: 10 },
      { name: 'Outros', value: 10 },
    ],
    devices: [
      { name: 'Desktop', value: 60 },
      { name: 'Mobile', value: 35 },
      { name: 'Tablet', value: 5 },
    ],
  },
};

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Activity className="h-6 w-6 text-primary" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>Métricas e insights detalhados da plataforma</CardDescription>
            </div>
            <div className="flex items-center gap-4">
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
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <p className="text-2xl font-bold">{mockData.revenue.total} CR</p>
                  </div>
                  <div
                    className={cn(
                      'rounded-full p-2',
                      mockData.revenue.change > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                    )}
                  >
                    {mockData.revenue.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={mockData.revenue.change > 0 ? 'default' : 'destructive'}>
                    {mockData.revenue.change}%
                  </Badge>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                    <p className="text-2xl font-bold">{mockData.users.active}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress
                    value={(mockData.users.active / mockData.users.total) * 100}
                    className="h-2"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {((mockData.users.active / mockData.users.total) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pixels Vendidos</p>
                    <p className="text-2xl font-bold">{mockData.pixels.sold}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Preço Médio</span>
                    <span className="font-medium">{mockData.pixels.averagePrice} CR</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                    <p className="text-2xl font-bold">{mockData.users.retention}%</p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{mockData.users.new} novos usuários</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">
                <BarChart2 className="mr-2 h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="revenue">
                <DollarSign className="mr-2 h-4 w-4" />
                Receita
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Activity className="mr-2 h-4 w-4" />
                Engajamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4" />
                      Tendências de Receita
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LineChart data={mockData.revenue.history} className="h-[300px]" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-4 w-4" />
                      Distribuição Regional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart data={mockData.demographics.regions} className="h-[300px]" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Métricas de Engajamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Visualizações</span>
                        <Badge variant="outline">{mockData.engagement.views}</Badge>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Interações</span>
                        <Badge variant="outline">{mockData.engagement.interactions}</Badge>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Taxa de Rejeição</span>
                        <Badge variant="outline">{mockData.engagement.bounceRate}%</Badge>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análise Detalhada de Receita</CardTitle>
                  <CardDescription>Visualize e analise todas as fontes de receita</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <BarChart
                      data={[
                        { label: 'Vendas de Pixels', value: 15000 },
                        { label: 'Assinaturas', value: 7000 },
                        { label: 'Publicidade', value: 2000 },
                        { label: 'Recursos Premium', value: 1000 },
                      ]}
                      className="h-[400px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Demografia dos Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DoughnutChart data={mockData.demographics.devices} className="h-[300px]" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crescimento de Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AreaChart data={[100, 150, 200, 250, 300, 350, 400]} className="h-[300px]" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Engajamento</CardTitle>
                  <CardDescription>Análise detalhada do comportamento dos usuários</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Eye className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <div className="text-2xl font-bold">{mockData.engagement.views}</div>
                            <p className="text-sm text-muted-foreground">Visualizações Totais</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <MousePointer className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <div className="text-2xl font-bold">
                              {mockData.engagement.interactions}
                            </div>
                            <p className="text-sm text-muted-foreground">Interações</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <div className="text-2xl font-bold">
                              {mockData.engagement.averageTime}min
                            </div>
                            <p className="text-sm text-muted-foreground">Tempo Médio</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <ScatterChart
                      data={[
                        { x: 1, y: 10 },
                        { x: 2, y: 15 },
                        { x: 3, y: 20 },
                        { x: 4, y: 18 },
                        { x: 5, y: 25 },
                      ]}
                      className="h-[300px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configurar Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
