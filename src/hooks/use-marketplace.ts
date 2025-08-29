import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HistoryEvent, Comment, Rating, AnalyticsData } from '@/lib/types/marketplace';
import { MarketplaceService } from '@/lib/services/marketplaceService';

const marketplaceService = new MarketplaceService();

export function useMarketplace(pixelId: string) {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [historyData, commentsData, ratingsData, analyticsData] = await Promise.all([
          marketplaceService.getPixelHistory(pixelId),
          marketplaceService.getPixelComments(pixelId),
          marketplaceService.getPixelRatings(pixelId),
          marketplaceService.getPixelAnalytics(pixelId),
        ]);

        setHistory(historyData);
        setComments(commentsData);
        setRatings(ratingsData);
        setAnalytics(analyticsData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do pixel');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do pixel',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pixelId, toast]);

  // Gerenciar comentários
  const addComment = useCallback(
    async (content: string, rating: number, images?: string[], userId?: string) => {
      if (!userId) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para comentar',
          variant: 'destructive',
        });
        return;
      }

      try {
        const newComment = await marketplaceService.addComment({
          pixelId,
          userId,
          content,
          rating,
          timestamp: new Date(),
          images,
          isVerifiedPurchase: false, // TODO: Verificar se o usuário comprou o pixel
        });

        setComments(prev => [newComment, ...prev]);

        // Registrar evento no histórico
        await marketplaceService.addHistoryEvent({
          pixelId,
          type: 'comment',
          userId,
          timestamp: new Date(),
          data: {
            comment: content,
            rating,
          },
        });

        toast({
          title: 'Sucesso',
          description: 'Comentário adicionado com sucesso',
        });
      } catch (err) {
        toast({
          title: 'Erro',
          description: 'Não foi possível adicionar o comentário',
          variant: 'destructive',
        });
      }
    },
    [pixelId, toast]
  );

  // Gerenciar avaliações
  const addRating = useCallback(
    async (score: number, review?: string, userId?: string) => {
      if (!userId) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para avaliar',
          variant: 'destructive',
        });
        return;
      }

      try {
        const newRating = await marketplaceService.addRating({
          pixelId,
          userId,
          score,
          review,
          timestamp: new Date(),
          isVerifiedPurchase: false, // TODO: Verificar se o usuário comprou o pixel
        });

        setRatings(prev => [newRating, ...prev]);
        toast({
          title: 'Sucesso',
          description: 'Avaliação adicionada com sucesso',
        });
      } catch (err) {
        toast({
          title: 'Erro',
          description: 'Não foi possível adicionar a avaliação',
          variant: 'destructive',
        });
      }
    },
    [pixelId, toast]
  );

  // Gerenciar histórico
  const trackEvent = useCallback(
    async (type: HistoryEvent['type'], userId: string, data: HistoryEvent['data']) => {
      try {
        const newEvent = await marketplaceService.addHistoryEvent({
          pixelId,
          type,
          userId,
          timestamp: new Date(),
          data,
        });

        setHistory(prev => [newEvent, ...prev]);
      } catch (err) {
        console.error('Erro ao registrar evento:', err);
      }
    },
    [pixelId]
  );

  // Gerenciar analytics
  const trackView = useCallback(
    async (userId?: string) => {
      try {
        await marketplaceService.trackPixelView(pixelId, userId);
        if (analytics) {
          setAnalytics({
            ...analytics,
            views: {
              ...analytics.views,
              total: analytics.views.total + 1,
              unique: userId ? analytics.views.unique + 1 : analytics.views.unique,
            },
          });
        }
      } catch (err) {
        console.error('Erro ao registrar visualização:', err);
      }
    },
    [pixelId, analytics]
  );

  const trackEngagement = useCallback(
    async (type: 'favorite' | 'comment' | 'share', userId?: string) => {
      try {
        await marketplaceService.trackEngagement(pixelId, type, userId);
        if (analytics) {
          setAnalytics({
            ...analytics,
            engagement: {
              ...analytics.engagement,
              [type === 'comment' ? 'comments' : type === 'favorite' ? 'favorites' : 'shares']:
                analytics.engagement[
                  type === 'comment' ? 'comments' : type === 'favorite' ? 'favorites' : 'shares'
                ] + 1,
            },
          });
        }
      } catch (err) {
        console.error('Erro ao registrar engajamento:', err);
      }
    },
    [pixelId, analytics]
  );

  return {
    history,
    comments,
    ratings,
    analytics,
    isLoading,
    error,
    actions: {
      addComment,
      addRating,
      trackEvent,
      trackView,
      trackEngagement,
    },
  };
}
