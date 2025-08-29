'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Palette,
  Star,
  Eye,
  Heart,
  MessageSquare,
  Crown,
  Gem,
  Sparkles,
  TrendingUp,
  Siren as Fire,
  Zap,
  Award,
  Clock,
  Filter,
  Search,
  Grid3X3,
  List,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Brush,
  RefreshCw,
  Globe,
  MapPin,
  Megaphone,
  Bookmark,
  Share2,
  ShoppingCart,
  Users,
  Rocket,
  CheckCircle,
  Target,
  Hash,
  BarChart3,
} from 'lucide-react';

interface PixelArtwork {
  id: string;
  title: string;
  description: string;
  coordinates: { x: number; y: number };
  region: string;
  color: string;
  imageUrl: string;
  thumbnailUrl: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    level: number;
    verified: boolean;
    premium: boolean;
    followers: number;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    downloads: number;
  };
  engagement: {
    rating: number;
    totalRatings: number;
    engagementRate: number;
    viralScore: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    category: string;
    tags: string[];
    rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
    featured: boolean;
    trending: boolean;
    sponsored: boolean;
    nsfw: boolean;
    price?: number;
    forSale: boolean;
  };
  promotion?: {
    type: 'featured' | 'trending' | 'spotlight' | 'premium';
    expiresAt: string;
    cost: number;
    boost: number;
  };
  interactions: {
    isLiked: boolean;
    isBookmarked: boolean;
    isFollowing: boolean;
    hasCommented: boolean;
    hasShared: boolean;
  };
}

interface PromotionPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  cost: number;
  specialCost?: number;
  benefits: string[];
  boost: {
    views: number;
    engagement: number;
    visibility: number;
  };
  color: string;
  popular?: boolean;
}

const promotionPlans: PromotionPlan[] = [
  {
    id: 'featured',
    name: 'Destaque',
    description: 'Apareça na secção de destaques por 24 horas',
    icon: <Star className="h-6 w-6" />,
    duration: '24 horas',
    cost: 100,
    specialCost: 20,
    benefits: [
      'Aparece na secção &quot;Em Destaque&quot;',
      '+200% visualizações',
      'Badge dourado de destaque',
      'Prioridade nos resultados de pesquisa',
    ],
    boost: { views: 200, engagement: 150, visibility: 300 },
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'trending',
    name: 'Tendência',
    description: 'Apareça na secção de tendências por 48 horas',
    icon: <TrendingUp className="h-6 w-6" />,
    duration: '48 horas',
    cost: 200,
    specialCost: 35,
    benefits: [
      'Aparece na secção &quot;Tendências&quot;',
      '+300% visualizações',
      'Badge de tendência animado',
      'Notificação para seguidores',
    ],
    boost: { views: 300, engagement: 200, visibility: 400 },
    color: 'from-green-500 to-emerald-500',
    popular: true,
  },
  {
    id: 'spotlight',
    name: 'Holofote',
    description: 'Destaque premium na página principal por 72 horas',
    icon: <Zap className="h-6 w-6" />,
    duration: '72 horas',
    cost: 500,
    specialCost: 75,
    benefits: [
      'Banner na página principal',
      '+500% visualizações',
      'Badge premium animado',
      'Push notification para todos',
      'Artigo no blog oficial',
    ],
    boost: { views: 500, engagement: 300, visibility: 600 },
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'premium',
    name: 'Premium VIP',
    description: 'Máxima visibilidade por 7 dias',
    icon: <Crown className="h-6 w-6" />,
    duration: '7 dias',
    cost: 1000,
    specialCost: 150,
    benefits: [
      'Topo da galeria por 7 dias',
      '+1000% visualizações',
      'Badge VIP exclusivo',
      'Entrevista no podcast oficial',
      'Colaboração com influencers',
      'Análise detalhada de performance',
    ],
    boost: { views: 1000, engagement: 500, visibility: 1000 },
    color: 'from-amber-500 to-orange-500',
  },
];

const mockPixels: PixelArtwork[] = [
  {
    id: '1',
    title: 'Pôr do Sol em Lisboa',
    description:
      'Uma obra-prima capturando o icônico pôr do sol sobre o Tejo, com cores vibrantes que representam a alma de Lisboa.',
    coordinates: { x: 245, y: 156 },
    region: 'Lisboa',
    color: '#FF6B47',
    imageUrl: 'https://placehold.co/400x400.png',
    thumbnailUrl: 'https://placehold.co/200x200.png',
    author: {
      id: 'user1',
      name: 'PixelMaster',
      username: 'pixelmaster_pt',
      avatar: 'https://placehold.co/40x40.png',
      level: 25,
      verified: true,
      premium: true,
      followers: 1234,
    },
    stats: {
      views: 15420,
      likes: 892,
      comments: 156,
      shares: 89,
      bookmarks: 234,
      downloads: 67,
    },
    engagement: {
      rating: 4.8,
      totalRatings: 156,
      engagementRate: 12.5,
      viralScore: 89,
    },
    metadata: {
      createdAt: '2024-03-15T10:30:00Z',
      updatedAt: '2024-03-15T14:20:00Z',
      category: 'Paisagem',
      tags: ['lisboa', 'pôr-do-sol', 'tejo', 'urbano'],
      rarity: 'Épico',
      featured: true,
      trending: true,
      sponsored: false,
      nsfw: false,
      price: 250,
      forSale: true,
    },
    promotion: {
      type: 'trending',
      expiresAt: '2024-03-17T10:30:00Z',
      cost: 200,
      boost: 300,
    },
    interactions: {
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
      hasCommented: false,
      hasShared: false,
    },
  },
  {
    id: '2',
    title: 'Arte Urbana do Porto',
    description:
      'Graffiti digital inspirado nas ruas históricas do Porto, misturando tradição e modernidade.',
    coordinates: { x: 123, y: 89 },
    region: 'Porto',
    color: '#7DF9FF',
    imageUrl: 'https://placehold.co/400x400.png',
    thumbnailUrl: 'https://placehold.co/200x200.png',
    author: {
      id: 'user2',
      name: 'UrbanArtist',
      username: 'urban_artist',
      avatar: 'https://placehold.co/40x40.png',
      level: 18,
      verified: false,
      premium: false,
      followers: 567,
    },
    stats: {
      views: 8930,
      likes: 445,
      comments: 78,
      shares: 34,
      bookmarks: 123,
      downloads: 29,
    },
    engagement: {
      rating: 4.6,
      totalRatings: 89,
      engagementRate: 8.7,
      viralScore: 67,
    },
    metadata: {
      createdAt: '2024-03-14T15:45:00Z',
      updatedAt: '2024-03-14T16:20:00Z',
      category: 'Arte Urbana',
      tags: ['porto', 'graffiti', 'urbano', 'street-art'],
      rarity: 'Raro',
      featured: false,
      trending: false,
      sponsored: true,
      nsfw: false,
      forSale: false,
    },
    interactions: {
      isLiked: true,
      isBookmarked: false,
      isFollowing: true,
      hasCommented: true,
      hasShared: false,
    },
  },
  {
    id: '3',
    title: 'Natureza de Coimbra',
    description: 'Pixel art minimalista representando a serenidade dos jardins de Coimbra.',
    coordinates: { x: 300, y: 200 },
    region: 'Coimbra',
    color: '#4CAF50',
    imageUrl: 'https://placehold.co/400x400.png',
    thumbnailUrl: 'https://placehold.co/200x200.png',
    author: {
      id: 'user3',
      name: 'NatureLover',
      username: 'nature_pt',
      avatar: 'https://placehold.co/40x40.png',
      level: 12,
      verified: true,
      premium: false,
      followers: 890,
    },
    stats: {
      views: 12340,
      likes: 678,
      comments: 234,
      shares: 156,
      bookmarks: 345,
      downloads: 89,
    },
    engagement: {
      rating: 4.9,
      totalRatings: 234,
      engagementRate: 15.2,
      viralScore: 92,
    },
    metadata: {
      createdAt: '2024-03-13T09:20:00Z',
      updatedAt: '2024-03-13T11:45:00Z',
      category: 'Natureza',
      tags: ['coimbra', 'natureza', 'jardins', 'minimalista'],
      rarity: 'Lendário',
      featured: true,
      trending: false,
      sponsored: false,
      nsfw: false,
      forSale: true,
      price: 500,
    },
    interactions: {
      isLiked: false,
      isBookmarked: true,
      isFollowing: false,
      hasCommented: false,
      hasShared: true,
    },
  },
];

const categories = [
  { id: 'all', name: 'Todos', icon: <Palette className="h-4 w-4" />, count: 1247 },
  { id: 'paisagem', name: 'Paisagem', icon: <Globe className="h-4 w-4" />, count: 234 },
  { id: 'urbano', name: 'Urbano', icon: <MapPin className="h-4 w-4" />, count: 189 },
  { id: 'natureza', name: 'Natureza', icon: <Lightbulb className="h-4 w-4" />, count: 156 },
  { id: 'arte', name: 'Arte', icon: <Brush className="h-4 w-4" />, count: 298 },
  { id: 'histórico', name: 'Histórico', icon: <Award className="h-4 w-4" />, count: 123 },
  { id: 'abstrato', name: 'Abstrato', icon: <Sparkles className="h-4 w-4" />, count: 87 },
];

const sortOptions = [
  { id: 'trending', name: 'Tendências', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'popular', name: 'Mais Populares', icon: <Fire className="h-4 w-4" /> },
  { id: 'recent', name: 'Mais Recentes', icon: <Clock className="h-4 w-4" /> },
  { id: 'views', name: 'Mais Vistos', icon: <Eye className="h-4 w-4" /> },
  { id: 'likes', name: 'Mais Curtidos', icon: <Heart className="h-4 w-4" /> },
  { id: 'comments', name: 'Mais Comentados', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'rating', name: 'Melhor Avaliados', icon: <Star className="h-4 w-4" /> },
  { id: 'price_high', name: 'Preço: Alto → Baixo', icon: <ArrowDown className="h-4 w-4" /> },
  { id: 'price_low', name: 'Preço: Baixo → Alto', icon: <ArrowUp className="h-4 w-4" /> },
];

export default function PixelsGalleryPage() {
  const [pixels, setPixels] = useState<PixelArtwork[]>(mockPixels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPixel, setSelectedPixel] = useState<PixelArtwork | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionPlan | null>(null);
  const [promotionPixel, setPromotionPixel] = useState<PixelArtwork | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rarityFilter, setRarityFilter] = useState<string[]>([]);
  const [showOnlyForSale, setShowOnlyForSale] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);

  const { toast } = useToast();
  const { credits, specialCredits, addCredits, removeCredits, removeSpecialCredits, addXp } =
    useUserStore();

  // Filter and sort pixels
  const filteredPixels = useMemo(
    () =>
      pixels
        .filter(pixel => {
          // Search filter
          if (
            searchQuery &&
            !pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !pixel.author.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !pixel.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          ) {
            return false;
          }

          // Category filter
          if (
            selectedCategory !== 'all' &&
            pixel.metadata.category.toLowerCase() !== selectedCategory
          ) {
            return false;
          }

          // Price filter
          if (
            pixel.metadata.price &&
            (pixel.metadata.price < priceRange[0] || pixel.metadata.price > priceRange[1])
          ) {
            return false;
          }

          // Rarity filter
          if (rarityFilter.length > 0 && !rarityFilter.includes(pixel.metadata.rarity)) {
            return false;
          }

          // For sale filter
          if (showOnlyForSale && !pixel.metadata.forSale) {
            return false;
          }

          // Featured filter
          if (showOnlyFeatured && !pixel.metadata.featured) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'trending':
              return (
                b.engagement.viralScore +
                (b.metadata.trending ? 50 : 0) -
                (a.engagement.viralScore + (a.metadata.trending ? 50 : 0))
              );
            case 'popular':
              return b.stats.likes - a.stats.likes;
            case 'recent':
              return (
                new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
              );
            case 'views':
              return b.stats.views - a.stats.views;
            case 'likes':
              return b.stats.likes - a.stats.likes;
            case 'comments':
              return b.stats.comments - a.stats.comments;
            case 'rating':
              return b.engagement.rating - a.engagement.rating;
            case 'price_high':
              return (b.metadata.price || 0) - (a.metadata.price || 0);
            case 'price_low':
              return (a.metadata.price || 0) - (b.metadata.price || 0);
            default:
              return 0;
          }
        }),
    [
      pixels,
      searchQuery,
      selectedCategory,
      priceRange,
      rarityFilter,
      showOnlyForSale,
      showOnlyFeatured,
      sortBy,
    ]
  );

  const handleLike = useCallback(
    (pixelId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setPixels(prev =>
        prev.map(pixel => {
          if (pixel.id === pixelId) {
            const newLiked = !pixel.interactions.isLiked;
            return {
              ...pixel,
              stats: {
                ...pixel.stats,
                likes: newLiked ? pixel.stats.likes + 1 : pixel.stats.likes - 1,
              },
              interactions: {
                ...pixel.interactions,
                isLiked: newLiked,
              },
            };
          }
          return pixel;
        })
      );

      const pixel = pixels.find(p => p.id === pixelId);
      if (pixel && !pixel.interactions.isLiked) {
        addXp(5);
        addCredits(2);
        setPlaySound(true);
        toast({
          title: '❤️ Pixel Curtido!',
          description: `Curtiu "${pixel.title}". +5 XP, +2 créditos!`,
        });
      }
    },
    [pixels, addXp, addCredits, toast]
  );

  const handleBookmark = useCallback(
    (pixelId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setPixels(prev =>
        prev.map(pixel => {
          if (pixel.id === pixelId) {
            const newBookmarked = !pixel.interactions.isBookmarked;
            return {
              ...pixel,
              stats: {
                ...pixel.stats,
                bookmarks: newBookmarked ? pixel.stats.bookmarks + 1 : pixel.stats.bookmarks - 1,
              },
              interactions: {
                ...pixel.interactions,
                isBookmarked: newBookmarked,
              },
            };
          }
          return pixel;
        })
      );

      const pixel = pixels.find(p => p.id === pixelId);
      if (pixel) {
        addXp(3);
        addCredits(1);
        toast({
          title: pixel.interactions.isBookmarked
            ? '🔖 Removido dos Favoritos'
            : '⭐ Adicionado aos Favoritos',
          description: `"${pixel.title}" ${pixel.interactions.isBookmarked ? 'removido' : 'adicionado'}.`,
        });
      }
    },
    [pixels, addXp, addCredits, toast]
  );

  const handleShare = useCallback(
    async (pixel: PixelArtwork, e: React.MouseEvent) => {
      e.stopPropagation();

      const shareData = {
        title: `${pixel.title} - Pixel Universe`,
        text: `Confira esta obra incrível de ${pixel.author.name}!`,
        url: `${window.location.origin}/pixel/${pixel.coordinates.x}-${pixel.coordinates.y}`,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          setPixels(prev =>
            prev.map(p =>
              p.id === pixel.id ? { ...p, stats: { ...p.stats, shares: p.stats.shares + 1 } } : p
            )
          );
          addXp(8);
          addCredits(3);
          toast({
            title: '📤 Pixel Partilhado!',
            description: `"${pixel.title}" partilhado com sucesso. +8 XP, +3 créditos!`,
          });
        } catch (error) {
          // User cancelled
        }
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: '🔗 Link Copiado!',
          description: 'Link do pixel copiado para a área de transferência.',
        });
      }
    },
    [addXp, addCredits, toast]
  );

  const handleFollow = useCallback(
    (authorId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setPixels(prev =>
        prev.map(pixel => {
          if (pixel.author.id === authorId) {
            const newFollowing = !pixel.interactions.isFollowing;
            return {
              ...pixel,
              author: {
                ...pixel.author,
                followers: newFollowing ? pixel.author.followers + 1 : pixel.author.followers - 1,
              },
              interactions: {
                ...pixel.interactions,
                isFollowing: newFollowing,
              },
            };
          }
          return pixel;
        })
      );

      const pixel = pixels.find(p => p.author.id === authorId);
      if (pixel && !pixel.interactions.isFollowing) {
        addXp(15);
        addCredits(8);
        setPlaySound(true);
        toast({
          title: '👥 A Seguir Artista!',
          description: `Agora segue ${pixel.author.name}. +15 XP, +8 créditos!`,
        });
      }
    },
    [pixels, addXp, addCredits, toast]
  );

  const handlePromotePixel = (pixel: PixelArtwork, promotion: PromotionPlan) => {
    const canAffordCredits = credits >= promotion.cost;
    const canAffordSpecial = promotion.specialCost && specialCredits >= promotion.specialCost;

    if (!canAffordCredits && !canAffordSpecial) {
      toast({
        title: 'Saldo Insuficiente',
        description: `Precisa de ${promotion.cost} créditos ou ${promotion.specialCost} especiais.`,
        variant: 'destructive',
      });
      return;
    }

    // Use special credits if available and cheaper
    if (canAffordSpecial && promotion.specialCost && promotion.specialCost < promotion.cost / 5) {
      removeSpecialCredits(promotion.specialCost);
    } else {
      removeCredits(promotion.cost);
    }

    // Apply promotion
    setPixels(prev =>
      prev.map(p =>
        p.id === pixel.id
          ? {
              ...p,
              promotion: {
                type: promotion.id as any,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                cost: promotion.cost,
                boost: promotion.boost.views,
              },
              metadata: {
                ...p.metadata,
                featured:
                  promotion.id === 'featured' ||
                  promotion.id === 'spotlight' ||
                  promotion.id === 'premium',
                trending: promotion.id === 'trending' || promotion.id === 'premium',
              },
            }
          : p
      )
    );

    setShowConfetti(true);
    setPlaySound(true);
    addXp(50);

    toast({
      title: '🚀 Promoção Ativada!',
      description: `&quot;${pixel.title}&quot; promovido com ${promotion.name}! +50 XP!`,
    });

    setShowPromotionModal(false);
    setPromotionPixel(null);
    setSelectedPromotion(null);
  };

  const handleBuyPixel = (pixel: PixelArtwork, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!pixel.metadata.forSale || !pixel.metadata.price) {
      toast({
        title: 'Pixel Não Disponível',
        description: 'Este pixel não está à venda.',
        variant: 'destructive',
      });
      return;
    }

    if (credits < pixel.metadata.price) {
      toast({
        title: 'Saldo Insuficiente',
        description: `Precisa de ${pixel.metadata.price} créditos para comprar este pixel.`,
        variant: 'destructive',
      });
      return;
    }

    removeCredits(pixel.metadata.price);
    addXp(25);
    setShowConfetti(true);
    setPlaySound(true);

    // Update pixel ownership
    setPixels(prev =>
      prev.map(p => (p.id === pixel.id ? { ...p, metadata: { ...p.metadata, forSale: false } } : p))
    );

    toast({
      title: '🛒 Pixel Comprado!',
      description: `"${pixel.title}" agora é seu! +25 XP!`,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum':
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 15) return 'text-green-500';
    if (rate >= 10) return 'text-yellow-500';
    if (rate >= 5) return 'text-orange-500';
    return 'text-red-500';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    return 'Agora mesmo';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />

      <div className="container mx-auto mb-16 max-w-7xl space-y-4 px-2 py-3 sm:space-y-6 sm:px-4 sm:py-6">
        {/* Header */}
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 shadow-2xl">
          <div
            className="animate-shimmer absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            style={{ backgroundSize: '200% 200%' }}
          />
          <CardHeader className="relative p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-gradient-gold flex items-center font-headline text-2xl sm:text-3xl">
                  <Palette className="animate-glow mr-2 h-6 w-6 sm:mr-3 sm:h-8 sm:w-8" />
                  Galeria de Pixels
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                  Descubra, curta e colecione as melhores obras de pixel art de Portugal
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="min-h-[36px]"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="min-h-[36px]"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="min-h-[36px]"
                >
                  <Filter className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Quick Filters */}
        <Card className="bg-card/80 shadow-lg backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels, artistas, tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-background/70 pl-10 text-sm focus:border-primary sm:text-base"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="min-h-[32px] text-xs sm:min-h-[36px] sm:text-sm"
                  >
                    {category.icon}
                    <span className="ml-1 sm:ml-2">{category.name}</span>
                    <Badge variant="secondary" className="ml-1 text-xs sm:ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
                  Ordenar:
                </span>
                {sortOptions.map(option => (
                  <Button
                    key={option.id}
                    variant={sortBy === option.id ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy(option.id)}
                    className="min-h-[32px] whitespace-nowrap text-xs"
                  >
                    {option.icon}
                    <span className="ml-1">{option.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Filter className="mr-2 h-5 w-5 text-primary" />
                    Filtros Avançados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Preço (€)</Label>
                      <div className="px-3">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange[1]}
                          onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>€0</span>
                          <span>€{priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Raridade</Label>
                      <div className="space-y-2">
                        {['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'].map(rarity => (
                          <div key={rarity} className="flex items-center space-x-2">
                            <Checkbox
                              id={rarity}
                              checked={rarityFilter.includes(rarity)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  setRarityFilter(prev => [...prev, rarity]);
                                } else {
                                  setRarityFilter(prev => prev.filter(r => r !== rarity));
                                }
                              }}
                            />
                            <Label htmlFor={rarity} className="text-sm">
                              {rarity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Opções</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="for-sale"
                            checked={showOnlyForSale}
                            onCheckedChange={setShowOnlyForSale as (checked: boolean) => void}
                          />
                          <Label htmlFor="for-sale" className="text-sm">
                            Apenas à venda
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={showOnlyFeatured}
                            onCheckedChange={setShowOnlyFeatured as (checked: boolean) => void}
                          />
                          <Label htmlFor="featured" className="text-sm">
                            Apenas em destaque
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ações</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setPriceRange([0, 1000]);
                            setRarityFilter([]);
                            setShowOnlyForSale(false);
                            setShowOnlyFeatured(false);
                          }}
                          className="w-full"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Limpar Filtros
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="gallery" className="space-y-4 sm:space-y-6">
          <TabsList className="grid h-10 w-full grid-cols-3 bg-card/50 shadow-md backdrop-blur-sm sm:h-12">
            <TabsTrigger value="gallery" className="font-headline text-xs sm:text-sm">
              <Palette className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              Galeria
            </TabsTrigger>
            <TabsTrigger value="featured" className="font-headline text-xs sm:text-sm">
              <Star className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              Destaques
            </TabsTrigger>
            <TabsTrigger value="promote" className="font-headline text-xs sm:text-sm">
              <Megaphone className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              Promover
            </TabsTrigger>
          </TabsList>

          {/* Main Gallery */}
          <TabsContent value="gallery" className="space-y-4 sm:space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
              <Card className="p-2 text-center sm:p-4">
                <div className="text-lg font-bold text-primary sm:text-2xl">
                  {formatNumber(filteredPixels.length)}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">Pixels</div>
              </Card>
              <Card className="p-2 text-center sm:p-4">
                <div className="text-lg font-bold text-green-500 sm:text-2xl">
                  {formatNumber(filteredPixels.filter(p => p.metadata.forSale).length)}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">À Venda</div>
              </Card>
              <Card className="p-2 text-center sm:p-4">
                <div className="text-lg font-bold text-yellow-500 sm:text-2xl">
                  {formatNumber(filteredPixels.filter(p => p.metadata.featured).length)}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">Destaque</div>
              </Card>
              <Card className="p-2 text-center sm:p-4">
                <div className="text-lg font-bold text-purple-500 sm:text-2xl">
                  {formatNumber(filteredPixels.reduce((sum, p) => sum + p.stats.views, 0))}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">Views</div>
              </Card>
            </div>

            {/* Pixels Grid */}
            <div
              className={cn(
                'grid gap-3 sm:gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'grid-cols-1'
              )}
            >
              {filteredPixels.map((pixel, index) => (
                <motion.div
                  key={pixel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    onClick={() => setSelectedPixel(pixel)}
                  >
                    <div className="relative">
                      <img
                        src={pixel.thumbnailUrl}
                        alt={pixel.title}
                        data-ai-hint="pixel art"
                        className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
                      />

                      {/* Badges - Positioned correctly */}
                      <div className="absolute left-2 top-2">
                        <Badge className={cn('text-xs', getRarityColor(pixel.metadata.rarity))}>
                          {pixel.metadata.rarity}
                        </Badge>
                      </div>

                      <div className="absolute right-2 top-2 flex flex-col gap-1">
                        {pixel.metadata.featured && (
                          <Badge className="animate-pulse bg-yellow-500 text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Destaque
                          </Badge>
                        )}
                        {pixel.metadata.trending && (
                          <Badge className="animate-pulse bg-green-500 text-xs">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Trend
                          </Badge>
                        )}
                        {pixel.metadata.sponsored && (
                          <Badge className="bg-purple-500 text-xs">
                            <Megaphone className="mr-1 h-3 w-3" />
                            Pago
                          </Badge>
                        )}
                      </div>

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={e => handleLike(pixel.id, e)}
                            className={cn(
                              'min-h-[36px]',
                              pixel.interactions.isLiked && 'bg-red-500 text-white'
                            )}
                          >
                            <Heart
                              className={cn(
                                'h-3 w-3',
                                pixel.interactions.isLiked && 'fill-current'
                              )}
                            />
                          </Button>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={e => handleBookmark(pixel.id, e)}
                            className={cn(
                              'min-h-[36px]',
                              pixel.interactions.isBookmarked && 'bg-yellow-500 text-white'
                            )}
                          >
                            <Bookmark
                              className={cn(
                                'h-3 w-3',
                                pixel.interactions.isBookmarked && 'fill-current'
                              )}
                            />
                          </Button>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={e => handleShare(pixel, e)}
                            className="min-h-[36px]"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-2 sm:p-4">
                      {/* Title and Author - Fixed spacing */}
                      <div className="mb-3 space-y-2">
                        <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">
                          {pixel.title}
                        </h3>

                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                            <AvatarImage src={pixel.author.avatar} data-ai-hint="profile avatar" />
                            <AvatarFallback className="text-xs">
                              {pixel.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span className="truncate text-xs font-medium sm:text-sm">
                                {pixel.author.name}
                              </span>
                              {pixel.author.verified && (
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                              )}
                              {pixel.author.premium && <Crown className="h-3 w-3 text-amber-500" />}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Nível {pixel.author.level} • {formatNumber(pixel.author.followers)}{' '}
                              seguidores
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mb-3 grid grid-cols-3 gap-1 text-xs sm:gap-2">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-blue-500" />
                          <span>{formatNumber(pixel.stats.views)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{formatNumber(pixel.stats.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-green-500" />
                          <span>{formatNumber(pixel.stats.comments)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mb-3 flex flex-wrap gap-1">
                        {pixel.metadata.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        {pixel.metadata.forSale && pixel.metadata.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              €{pixel.metadata.price}
                            </span>
                            <Button
                              size="sm"
                              onClick={e => handleBuyPixel(pixel, e)}
                              className="min-h-[36px] bg-gradient-to-r from-primary to-accent"
                            >
                              <ShoppingCart className="mr-1 h-3 w-3" />
                              Comprar
                            </Button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => handleFollow(pixel.author.id, e)}
                            className={cn(
                              'min-h-[32px] text-xs',
                              pixel.interactions.isFollowing &&
                                'border-blue-500/50 bg-blue-500/10 text-blue-500'
                            )}
                          >
                            <Users className="mr-1 h-3 w-3" />
                            {pixel.interactions.isFollowing ? 'Seguindo' : 'Seguir'}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPromotionPixel(pixel);
                              setShowPromotionModal(true);
                            }}
                            className="min-h-[32px] text-xs"
                          >
                            <Rocket className="mr-1 h-3 w-3" />
                            Promover
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredPixels.length === 0 && (
              <Card className="p-8 text-center">
                <Palette className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">Nenhum pixel encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou pesquisar por outros termos.
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Featured Section */}
          <TabsContent value="featured" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
              {/* Spotlight */}
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-500">
                    <Zap className="mr-2 h-5 w-5" />
                    Pixel em Holofote
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredPixels.find(p => p.promotion?.type === 'spotlight') ? (
                    <div className="space-y-4">
                      {/* Spotlight pixel content */}
                      <div className="text-center">
                        <div className="mb-4 text-4xl">🎨</div>
                        <h3 className="mb-2 text-xl font-bold">Obra em Destaque Premium</h3>
                        <p className="text-muted-foreground">
                          Esta secção mostra o pixel com promoção &quot;Holofote&quot; ativa.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Zap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhum pixel em holofote no momento.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trending Sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-500">
                    <Fire className="mr-2 h-5 w-5" />
                    Tendências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredPixels
                      .filter(p => p.metadata.trending)
                      .slice(0, 5)
                      .map((pixel, index) => (
                        <div
                          key={pixel.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg bg-muted/20 p-2 transition-colors hover:bg-muted/40"
                        >
                          <div className="text-lg font-bold text-green-500">#{index + 1}</div>
                          <img
                            src={pixel.thumbnailUrl}
                            alt={pixel.title}
                            data-ai-hint="pixel art"
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium">{pixel.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              <span>{formatNumber(pixel.stats.views)}</span>
                              <Heart className="h-3 w-3" />
                              <span>{formatNumber(pixel.stats.likes)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {filteredPixels
                .filter(p => p.metadata.featured)
                .map((pixel, index) => (
                  <Card
                    key={pixel.id}
                    className="cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="relative">
                      <img
                        src={pixel.thumbnailUrl}
                        alt={pixel.title}
                        data-ai-hint="pixel art"
                        className="h-32 w-full object-cover sm:h-48"
                      />

                      <Badge className="absolute left-2 top-2 animate-pulse bg-yellow-500">
                        <Crown className="mr-1 h-3 w-3" />
                        VIP
                      </Badge>

                      <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                        #{index + 1}
                      </div>
                    </div>

                    <CardContent className="p-2 sm:p-4">
                      <h3 className="mb-2 line-clamp-1 text-sm font-semibold sm:text-base">
                        {pixel.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          <span>{formatNumber(pixel.stats.views)}</span>
                          <Heart className="h-3 w-3" />
                          <span>{formatNumber(pixel.stats.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>{pixel.engagement.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Promotion Center */}
          <TabsContent value="promote" className="space-y-4 sm:space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center font-headline text-xl text-primary sm:text-2xl">
                  <Rocket className="mr-3 h-6 w-6" />
                  Centro de Promoções
                </CardTitle>
                <CardDescription>
                  Destaque os seus pixels e alcance milhares de utilizadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                  {promotionPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          'relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl',
                          plan.popular &&
                            'border-primary/50 shadow-primary/20 ring-2 ring-primary/20'
                        )}
                      >
                        {plan.popular && (
                          <div className="absolute left-0 right-0 top-0 bg-gradient-to-r from-primary to-accent py-1 text-center text-xs font-medium text-primary-foreground">
                            <Sparkles className="mr-1 inline h-3 w-3" />
                            Mais Popular
                          </div>
                        )}

                        <CardHeader className={cn('text-center', plan.popular && 'pt-8')}>
                          <div
                            className={cn(
                              'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg sm:mb-4 sm:h-16 sm:w-16',
                              `bg-gradient-to-br ${plan.color}`
                            )}
                          >
                            {plan.icon}
                          </div>

                          <CardTitle className="font-headline text-lg sm:text-xl">
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                            {plan.description}
                          </CardDescription>

                          <div className="space-y-1 sm:space-y-2">
                            <div className="text-2xl font-bold text-primary sm:text-3xl">
                              {plan.cost} créditos
                            </div>
                            {plan.specialCost && (
                              <div className="text-sm text-accent">
                                ou {plan.specialCost} especiais
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Duração: {plan.duration}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3 sm:space-y-4">
                          <div className="space-y-2">
                            {plan.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                                <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500 sm:h-4 sm:w-4" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>

                          <div className="rounded-lg bg-muted/30 p-2 sm:p-3">
                            <h4 className="mb-2 text-xs font-medium sm:text-sm">Boost Esperado:</h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-bold text-blue-500">+{plan.boost.views}%</div>
                                <div className="text-muted-foreground">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-green-500">
                                  +{plan.boost.engagement}%
                                </div>
                                <div className="text-muted-foreground">Engagement</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-purple-500">
                                  +{plan.boost.visibility}%
                                </div>
                                <div className="text-muted-foreground">Visibilidade</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button
                            className="w-full"
                            onClick={() => {
                              setSelectedPromotion(plan);
                              setShowPromotionModal(true);
                            }}
                          >
                            <Rocket className="mr-2 h-4 w-4" />
                            Escolher Plano
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Promotion Analytics */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    Performance de Promoções
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Destaque', views: 15420, engagement: 12.5, roi: 340 },
                      { name: 'Tendência', views: 28930, engagement: 18.7, roi: 520 },
                      { name: 'Holofote', views: 45670, engagement: 25.3, roi: 780 },
                    ].map((promo, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{promo.name}</span>
                          <Badge variant="outline">ROI: {promo.roi}%</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Views</div>
                            <div className="font-bold text-blue-500">
                              {formatNumber(promo.views)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Engagement</div>
                            <div className="font-bold text-green-500">{promo.engagement}%</div>
                          </div>
                        </div>
                        <Progress value={promo.engagement} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Dicas de Promoção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        tip: 'Promova durante horários de pico',
                        description: '19h-22h têm 40% mais engagement',
                        icon: <Clock className="h-4 w-4 text-blue-500" />,
                      },
                      {
                        tip: 'Use tags populares',
                        description: '#lisboa #arte aumentam visibilidade',
                        icon: <Hash className="h-4 w-4 text-green-500" />,
                      },
                      {
                        tip: 'Interaja com a comunidade',
                        description: 'Responda comentários para mais engagement',
                        icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
                      },
                      {
                        tip: 'Qualidade visual',
                        description: 'Pixels de alta qualidade têm 3x mais likes',
                        icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
                      },
                    ].map((tip, index) => (
                      <div key={index} className="flex gap-3 rounded-lg bg-muted/20 p-3">
                        <div className="flex-shrink-0">{tip.icon}</div>
                        <div>
                          <h4 className="text-sm font-medium">{tip.tip}</h4>
                          <p className="text-xs text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pixel Detail Modal */}
        <Dialog open={!!selectedPixel} onOpenChange={() => setSelectedPixel(null)}>
          <DialogContent className="h-[90vh] max-w-4xl p-0">
            {selectedPixel && (
              <>
                <DialogHeader className="border-b p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="font-headline text-xl sm:text-2xl">
                        {selectedPixel.title}
                      </DialogTitle>
                      <DialogDescription className="mt-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />({selectedPixel.coordinates.x},{' '}
                        {selectedPixel.coordinates.y}) • {selectedPixel.region}
                      </DialogDescription>
                    </div>
                    <Badge className={getRarityColor(selectedPixel.metadata.rarity)}>
                      {selectedPixel.metadata.rarity}
                    </Badge>
                  </div>
                </DialogHeader>

                <ScrollArea className="flex-1">
                  <div className="space-y-6 p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Image */}
                      <div className="space-y-4">
                        <img
                          src={selectedPixel.imageUrl}
                          alt={selectedPixel.title}
                          data-ai-hint="pixel art"
                          className="w-full rounded-lg shadow-lg"
                        />

                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-500">
                              {formatNumber(selectedPixel.stats.views)}
                            </div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-500">
                              {formatNumber(selectedPixel.stats.likes)}
                            </div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-500">
                              {formatNumber(selectedPixel.stats.comments)}
                            </div>
                            <div className="text-xs text-muted-foreground">Comentários</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-500">
                              {formatNumber(selectedPixel.stats.shares)}
                            </div>
                            <div className="text-xs text-muted-foreground">Partilhas</div>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 font-semibold">Descrição</h3>
                          <p className="leading-relaxed text-muted-foreground">
                            {selectedPixel.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="mb-2 font-semibold">Artista</h3>
                          <div className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={selectedPixel.author.avatar}
                                data-ai-hint="profile avatar"
                              />
                              <AvatarFallback>{selectedPixel.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{selectedPixel.author.name}</span>
                                {selectedPixel.author.verified && (
                                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                                )}
                                {selectedPixel.author.premium && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Nível {selectedPixel.author.level} •{' '}
                                {formatNumber(selectedPixel.author.followers)} seguidores
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => handleFollow(selectedPixel.author.id, e)}
                              className={cn(
                                selectedPixel.interactions.isFollowing &&
                                  'border-blue-500/50 bg-blue-500/10 text-blue-500'
                              )}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              {selectedPixel.interactions.isFollowing ? 'Seguindo' : 'Seguir'}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-semibold">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedPixel.metadata.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-semibold">Engagement</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Rating</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                <span>
                                  {selectedPixel.engagement.rating} (
                                  {selectedPixel.engagement.totalRatings})
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Taxa de Engagement</span>
                              <span
                                className={cn(
                                  'font-bold',
                                  getEngagementColor(selectedPixel.engagement.engagementRate)
                                )}
                              >
                                {selectedPixel.engagement.engagementRate}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Score Viral</span>
                              <span className="font-bold text-purple-500">
                                {selectedPixel.engagement.viralScore}/100
                              </span>
                            </div>
                          </div>
                        </div>

                        {selectedPixel.metadata.forSale && selectedPixel.metadata.price && (
                          <div className="rounded-lg bg-primary/10 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="font-semibold">À Venda</span>
                              <span className="text-2xl font-bold text-primary">
                                €{selectedPixel.metadata.price}
                              </span>
                            </div>
                            <Button
                              className="w-full"
                              onClick={e => handleBuyPixel(selectedPixel, e)}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Comprar Agora
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Promotion Modal */}
        <Dialog open={showPromotionModal} onOpenChange={setShowPromotionModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-primary" />
                Promover Pixel
              </DialogTitle>
              <DialogDescription>
                {promotionPixel && `Promover "${promotionPixel.title}" para maior visibilidade`}
              </DialogDescription>
            </DialogHeader>

            {selectedPromotion && promotionPixel && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={promotionPixel.thumbnailUrl}
                        alt={promotionPixel.title}
                        data-ai-hint="pixel art"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{promotionPixel.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ({promotionPixel.coordinates.x}, {promotionPixel.coordinates.y}) •{' '}
                          {promotionPixel.region}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {selectedPromotion.icon}
                      <span className="ml-2">{selectedPromotion.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/20 p-3 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {selectedPromotion.cost}
                        </div>
                        <div className="text-sm text-muted-foreground">Créditos</div>
                      </div>
                      {selectedPromotion.specialCost && (
                        <div className="rounded-lg bg-muted/20 p-3 text-center">
                          <div className="text-2xl font-bold text-accent">
                            {selectedPromotion.specialCost}
                          </div>
                          <div className="text-sm text-muted-foreground">Especiais</div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Benefícios Inclusos:</h4>
                      {selectedPromotion.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowPromotionModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handlePromotePixel(promotionPixel, selectedPromotion)}
                        disabled={
                          credits < selectedPromotion.cost &&
                          (!selectedPromotion.specialCost ||
                            specialCredits < selectedPromotion.specialCost)
                        }
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        Promover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
