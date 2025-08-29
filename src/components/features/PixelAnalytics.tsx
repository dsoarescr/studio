'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Eye,
  Heart,
  Share2,
  Clock,
  Calendar,
  MapPin,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

interface PixelAnalyticsProps {
  pixelId: string;
}

export function PixelAnalytics({ pixelId }: PixelAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Dados mockados
  const priceHistory = [
    { date: '2024-01', price: 1000 },
    { date: '2024-02', price: 1200 },
    { date: '2024-03', price: 1500 },
    { date: '2024-04', price: 1400 },
    { date: '2024-05', price: 1800 },
  ];

  const viewsData = [
    { date: '2024-01', views: 150 },
    { date: '2024-02', views: 280 },
    { date: '2024-03', views: 420 },
    { date: '2024-04', views: 380 },
    { date: '2024-05', views: 550 },
  ];

  const interestByRegion = [
    { name: 'Porto', value: 40 },
    { name: 'Lisboa', value: 30 },
    { name: 'Braga', value: 15 },
    { name: 'Coimbra', value: 10 },
    { name: 'Faro', value: 5 },
  ];

  const marketMetrics = {
    currentPrice: 1800,
    marketAverage: 1500,
    priceChange: 20,
    popularity: 85,
    demand: 92,
    liquidity: 78,
    rarity: 95,
    volatility: 'Baixa',
    trend: 'up',
    predictedValue: {
      min: 2000,
      max: 2500,
      confidence: 85,
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Activity className="h-6 w-6 text-primary" />
                Análise de Mercado
              </CardTitle>
              <CardDescription>Análise detalhada e métricas de desempenho</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
                <SelectItem value="1y">1 ano</SelectItem>
                <SelectItem value="all">Todo período</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="price">Preço</TabsTrigger>
              <TabsTrigger value="engagement">Engajamento</TabsTrigger>
              <TabsTrigger value="predictions">Previsões</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">€{marketMetrics.currentPrice}</div>
                      <p className="text-sm text-muted-foreground">Preço Atual</p>
                      <Badge
                        className={marketMetrics.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {marketMetrics.trend === 'up' ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {marketMetrics.priceChange}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{marketMetrics.popularity}%</div>
                      <p className="text-sm text-muted-foreground">Popularidade</p>
                      <Badge variant="secondary">Alta Demanda</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{marketMetrics.rarity}%</div>
                      <p className="text-sm text-muted-foreground">Raridade</p>
                      <Badge variant="secondary">Muito Raro</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Activity className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{marketMetrics.volatility}</div>
                      <p className="text-sm text-muted-foreground">Volatilidade</p>
                      <Badge variant="secondary">Estável</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de Preço */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Preço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceHistory}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas de Mercado */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Mercado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Demanda</span>
                        <span className="font-medium">{marketMetrics.demand}%</span>
                      </div>
                      <Progress value={marketMetrics.demand} />
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Liquidez</span>
                        <span className="font-medium">{marketMetrics.liquidity}%</span>
                      </div>
                      <Progress value={marketMetrics.liquidity} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição Regional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={interestByRegion}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {interestByRegion.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="price" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Preço</CardTitle>
                  <CardDescription>Comparação com o mercado e tendências</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Preço Atual</p>
                      <p className="text-2xl font-bold">€{marketMetrics.currentPrice}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Média do Mercado</p>
                      <p className="text-2xl font-bold">€{marketMetrics.marketAverage}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Variação</p>
                      <p className="text-2xl font-bold text-green-500">+20%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 font-medium">Fatores de Influência</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-muted-foreground">Localização</span>
                          <span className="font-medium">Muito Valorizada</span>
                        </div>
                        <Progress value={90} />
                      </div>
                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-muted-foreground">Raridade</span>
                          <span className="font-medium">Alta</span>
                        </div>
                        <Progress value={85} />
                      </div>
                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-muted-foreground">Demanda</span>
                          <span className="font-medium">Crescente</span>
                        </div>
                        <Progress value={75} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Engajamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Eye className="mx-auto mb-2 h-6 w-6 text-primary" />
                          <div className="text-xl font-bold">1,245</div>
                          <p className="text-sm text-muted-foreground">Visualizações</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Heart className="mx-auto mb-2 h-6 w-6 text-primary" />
                          <div className="text-xl font-bold">89</div>
                          <p className="text-sm text-muted-foreground">Favoritos</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Share2 className="mx-auto mb-2 h-6 w-6 text-primary" />
                          <div className="text-xl font-bold">34</div>
                          <p className="text-sm text-muted-foreground">Compartilhamentos</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Previsões de Mercado</CardTitle>
                  <CardDescription>
                    Análise preditiva baseada em dados históricos e tendências
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-primary/5 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Valor Previsto</h4>
                        <p className="text-sm text-muted-foreground">Próximos 30 dias</p>
                      </div>
                      <Badge variant="secondary">
                        {marketMetrics.predictedValue.confidence}% Confiança
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        €{marketMetrics.predictedValue.min} - €{marketMetrics.predictedValue.max}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Faixa de preço estimada</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fatores Positivos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Alta Demanda</p>
                              <p className="text-sm text-muted-foreground">
                                Interesse crescente na região
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Localização Premium</p>
                              <p className="text-sm text-muted-foreground">Área em valorização</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fatores de Risco</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
                            <div>
                              <p className="font-medium">Volatilidade do Mercado</p>
                              <p className="text-sm text-muted-foreground">
                                Possíveis flutuações de preço
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
                            <div>
                              <p className="font-medium">Concorrência</p>
                              <p className="text-sm text-muted-foreground">
                                Novos pixels na região
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recomendações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Momento Ideal para Investimento</p>
                            <p className="text-sm text-muted-foreground">
                              O preço atual está abaixo da média projetada, indicando boa
                              oportunidade de compra.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Estratégia Sugerida</p>
                            <p className="text-sm text-muted-foreground">
                              Considere uma estratégia de longo prazo, com potencial de valorização
                              nos próximos 6-12 meses.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
