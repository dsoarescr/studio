'use client';

import React, { useEffect } from 'react';
import { useMarketplace } from '@/hooks/use-marketplace';
import { PixelComments } from './PixelComments';
import { PixelAnalytics } from './PixelAnalytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Clock, TrendingUp, History, MessageCircle, BarChart, Star } from 'lucide-react';

interface PixelDetailsProps {
  pixelId: string;
  currentUserId?: string;
  onClose: () => void;
}

export function PixelDetails({ pixelId, currentUserId, onClose }: PixelDetailsProps) {
  const { history, comments, ratings, analytics, isLoading, error, actions } =
    useMarketplace(pixelId);

  useEffect(() => {
    actions.trackView(currentUserId);
  }, [actions, currentUserId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="mb-4 text-red-500">{error}</p>
          <Button onClick={onClose}>Fechar</Button>
        </CardContent>
      </Card>
    );
  }

  const averageRating = ratings.length
    ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Métricas Principais */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Eye className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{analytics?.views.total || 0}</div>
              <p className="text-sm text-muted-foreground">Visualizações</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{comments.length}</div>
              <p className="text-sm text-muted-foreground">Comentários</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">
                {analytics?.market.trend === 'up'
                  ? '↑'
                  : analytics?.market.trend === 'down'
                    ? '↓'
                    : '→'}
              </div>
              <p className="text-sm text-muted-foreground">Tendência</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageCircle className="mr-2 h-4 w-4" />
            Comentários
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Pixel</CardTitle>
              <CardDescription>Registro completo de eventos e transações</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {history.map(event => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {event.type === 'sale' && (
                              <TrendingUp className="h-5 w-5 text-primary" />
                            )}
                            {event.type === 'auction_bid' && (
                              <Clock className="h-5 w-5 text-primary" />
                            )}
                            {event.type === 'price_change' && (
                              <BarChart className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {event.type === 'sale' && 'Venda Realizada'}
                              {event.type === 'auction_bid' && 'Novo Lance'}
                              {event.type === 'price_change' && 'Alteração de Preço'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.type === 'price_change' &&
                                `De €${event.data.oldPrice} para €${event.data.price}`}
                              {event.type === 'auction_bid' && `Lance de €${event.data.bidAmount}`}
                              {event.type === 'sale' && `Vendido por €${event.data.price}`}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {event.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <PixelComments pixelId={pixelId} currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="analytics">
          <PixelAnalytics pixelId={pixelId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
