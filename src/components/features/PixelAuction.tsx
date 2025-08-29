'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Gavel,
  Clock,
  TrendingUp,
  Users,
  Bell,
  Eye,
  History,
  AlertTriangle,
  CheckCircle,
  Timer,
  ArrowUp,
  ArrowDown,
  ChartBar,
  Sparkles,
} from 'lucide-react';

interface Bid {
  id: string;
  bidder: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
    isVerified: boolean;
  };
  amount: number;
  timestamp: Date;
  isAutoBid: boolean;
  maxAutoBid?: number;
}

interface AuctionStats {
  totalBids: number;
  uniqueBidders: number;
  averageBidIncrease: number;
  timeRemaining: number;
  views: number;
  watchers: number;
  startPrice: number;
  currentPrice: number;
  estimatedValue: number;
}

interface PixelAuctionProps {
  pixelId: string;
  currentUserId?: string;
}

export function PixelAuction({ pixelId, currentUserId }: PixelAuctionProps) {
  const [bids, setBids] = useState<Bid[]>([
    {
      id: '1',
      bidder: {
        id: 'user1',
        name: 'Carlos Silva',
        avatar: '/avatars/user1.jpg',
        reputation: 950,
        isVerified: true,
      },
      amount: 1500,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isAutoBid: false,
    },
    {
      id: '2',
      bidder: {
        id: 'user2',
        name: 'Ana Santos',
        avatar: '/avatars/user2.jpg',
        reputation: 720,
        isVerified: false,
      },
      amount: 1400,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isAutoBid: true,
      maxAutoBid: 1600,
    },
  ]);

  const [stats, setStats] = useState<AuctionStats>({
    totalBids: 8,
    uniqueBidders: 4,
    averageBidIncrease: 100,
    timeRemaining: 172800, // 48 horas em segundos
    views: 245,
    watchers: 18,
    startPrice: 1000,
    currentPrice: 1500,
    estimatedValue: 2000,
  });

  const [newBidAmount, setNewBidAmount] = useState(stats.currentPrice + 100);
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [maxAutoBidAmount, setMaxAutoBidAmount] = useState(0);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Atualizar tempo restante
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular notificações em tempo real
  useEffect(() => {
    const notifications = [
      'Novo lance recebido!',
      'O preço está subindo rapidamente!',
      'Apenas 1 hora restante!',
      'Você foi superado por outro lance!',
    ];

    const interval = setInterval(() => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      if (isWatching) {
        toast({
          title: 'Atualização do Leilão',
          description: randomNotification,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isWatching, toast]);

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleBid = () => {
    if (!currentUserId) {
      toast({
        title: 'Autenticação Necessária',
        description: 'Faça login para participar do leilão',
        variant: 'destructive',
      });
      return;
    }

    if (newBidAmount <= stats.currentPrice) {
      toast({
        title: 'Lance Inválido',
        description: 'O lance deve ser maior que o lance atual',
        variant: 'destructive',
      });
      return;
    }

    const newBid: Bid = {
      id: Date.now().toString(),
      bidder: {
        id: currentUserId,
        name: 'Usuário Atual',
        avatar: '/avatars/default.jpg',
        reputation: 0,
        isVerified: false,
      },
      amount: newBidAmount,
      timestamp: new Date(),
      isAutoBid: isAutoBidEnabled,
      maxAutoBid: isAutoBidEnabled ? maxAutoBidAmount : undefined,
    };

    setBids([newBid, ...bids]);
    setStats(prev => ({
      ...prev,
      currentPrice: newBidAmount,
      totalBids: prev.totalBids + 1,
    }));

    toast({
      title: 'Lance Registrado!',
      description: `Seu lance de €${newBidAmount} foi registrado com sucesso!`,
    });
  };

  const toggleWatch = () => {
    setIsWatching(!isWatching);
    toast({
      title: isWatching ? 'Removido dos Favoritos' : 'Adicionado aos Favoritos',
      description: isWatching
        ? 'Você não receberá mais notificações deste leilão'
        : 'Você receberá notificações sobre este leilão',
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Leilão */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-6 w-6 text-primary" />
                Leilão em Andamento
              </CardTitle>
              <CardDescription>
                Lance inicial: €{stats.startPrice} • Valor estimado: €{stats.estimatedValue}
              </CardDescription>
            </div>
            <Button variant={isWatching ? 'default' : 'outline'} onClick={toggleWatch}>
              <Bell className="mr-2 h-4 w-4" />
              {isWatching ? 'Seguindo' : 'Seguir Leilão'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer e Estatísticas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">
                    {formatTimeRemaining(stats.timeRemaining)}
                  </div>
                  <p className="text-sm text-muted-foreground">Tempo Restante</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">{stats.uniqueBidders}</div>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Eye className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">{stats.views}</div>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lance Atual */}
          <div className="rounded-lg bg-primary/10 p-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">Lance Atual</p>
            <div className="mb-2 text-4xl font-bold text-primary">€{stats.currentPrice}</div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary">
                {stats.totalBids} lance{stats.totalBids !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">+€{stats.averageBidIncrease} média/lance</Badge>
            </div>
          </div>

          {/* Formulário de Lance */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Seu Lance</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={newBidAmount}
                      onChange={e => setNewBidAmount(Number(e.target.value))}
                      min={stats.currentPrice + 1}
                      step={10}
                    />
                    <Button onClick={handleBid}>
                      <Gavel className="mr-2 h-4 w-4" />
                      Dar Lance
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lance mínimo: €{stats.currentPrice + 1}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoBid"
                    checked={isAutoBidEnabled}
                    onChange={e => setIsAutoBidEnabled(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="autoBid" className="text-sm">
                    Ativar Lance Automático
                  </label>
                </div>

                {isAutoBidEnabled && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Lance Máximo Automático
                    </label>
                    <Input
                      type="number"
                      value={maxAutoBidAmount}
                      onChange={e => setMaxAutoBidAmount(Number(e.target.value))}
                      min={newBidAmount}
                      step={10}
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      O sistema dará lances automaticamente até este valor
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Histórico e Análises */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="overview">
                <History className="mr-2 h-4 w-4" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <ChartBar className="mr-2 h-4 w-4" />
                Análise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                {bids.map(bid => (
                  <Card key={bid.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={bid.bidder.avatar} />
                          <AvatarFallback>{bid.bidder.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{bid.bidder.name}</span>
                            {bid.bidder.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {bid.bidder.reputation} pts
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {bid.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">€{bid.amount}</p>
                          {bid.isAutoBid && (
                            <Badge variant="secondary" className="text-xs">
                              <Timer className="mr-1 h-3 w-3" />
                              Auto
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Tendência de Preço</span>
                        <Badge className="bg-green-500">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          Em Alta
                        </Badge>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Competitividade</span>
                        <Badge className="bg-orange-500">
                          <Sparkles className="mr-1 h-3 w-3" />
                          Alta
                        </Badge>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Estatísticas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Média de Tempo entre Lances
                          </p>
                          <p className="font-medium">15 minutos</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Probabilidade de Venda</p>
                          <p className="font-medium">95%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Previsto Final</p>
                          <p className="font-medium">€1,800 - €2,200</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interesse do Mercado</p>
                          <p className="font-medium">Muito Alto</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dicas para Licitantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Momento Crítico</p>
                        <p className="text-sm text-muted-foreground">
                          O leilão está na fase final. Os preços tendem a subir rapidamente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Oportunidade de Investimento</p>
                        <p className="text-sm text-muted-foreground">
                          O preço atual está abaixo da média do mercado para pixels similares.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
