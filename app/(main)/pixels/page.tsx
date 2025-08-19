'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserStore, usePixelStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, Eye, Heart, MessageSquare, Share2, Star, Crown, Gem, Sparkles, Trophy, Award, Target, Zap, Gift, Coins, Calendar, Clock, TrendingUp, BarChart3, Users, MapPin, Palette, Bookmark, Download, Upload, Settings, Edit, Trash2, Plus, Minus, Check, X, Info, AlertTriangle, House as Museum, Megaphone, Flame, CloudLightning as Lightning, Rocket, Shield, Globe, Camera, Play, Pause, Volume2, VolumeX, RotateCcw, Maximize, ExternalLink, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreHorizontal, Tag, Hash, Link as LinkIcon, Image as ImageIcon, Video, Music, PaintBucket, Brush, Eraser, Move, ZoomIn, ZoomOut, Grid3X3, Layers, Contrast, Copyright as Brightness, IterationCw as Saturation, Bluetooth as Blur, Focus, Crop, Copy, Cast as Paste, Save, FileText, Folder, Archive, Database, Server, Wifi, WifiOff, Signal, Battery, Smartphone, Monitor, Tablet, Headphones, Speaker, Mic, MicOff, Camera as CameraIcon, Video as VideoIcon, RefreshCw } from "lucide-react";
import { cn } from '@/lib/utils';

// Types
interface SoldPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    followers: number;
  };
  title: string;
  description: string;
  color: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  price: number;
  purchaseDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  rating: number;
  tags: string[];
  category: string;
  isPromoted: boolean;
  promotionType?: 'destaque' | 'tendencia' | 'holofote' | 'vip';
  promotionExpiry?: string;
  viralScore: number;
  engagementRate: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  imageUrl?: string;
  features?: string[];
}

interface PromotionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  specialCreditsPrice: number;
  duration: string;
  benefits: string[];
  badge: string;
  color: string;
  icon: React.ReactNode;
  boost: string;
  position: string;
}

interface FeaturedSpot {
  id: string;
  name: string;
  description: string;
  price: number;
  specialCreditsPrice: number;
  duration: string;
  position: 'hero' | 'sidebar' | 'grid-top' | 'category-top';
  maxPixels: number;
  currentPixels: number;
  benefits: string[];
  isAvailable: boolean;
}

// Mock data for sold pixels (museum collection)
const mockSoldPixels: SoldPixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    owner: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25,
      followers: 1234
    },
    title: 'Torre de Belém Digital',
    description: 'Representação pixel art do icónico monumento lisboeta',
    color: '#D4A757',
    rarity: 'Lendário',
    price: 850,
    purchaseDate: '2024-03-10',
    views: 15420,
    likes: 892,
    comments: 156,
    shares: 89,
    rating: 4.9,
    tags: ['lisboa', 'monumento', 'histórico', 'arte'],
    category: 'Monumentos',
    isPromoted: true,
    promotionType: 'vip',
    promotionExpiry: '2024-04-10',
    viralScore: 950,
    engagementRate: 8.7,
    isLiked: false,
    isBookmarked: false,
    imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Torre+Belém',
    features: ['Vista Rio', 'Património UNESCO', 'Zona Turística']
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    owner: {
      name: 'ArtisticSoul',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18,
      followers: 567
    },
    title: 'Ponte Dom Luís I',
    description: 'Arte pixel da famosa ponte do Porto',
    color: '#7DF9FF',
    rarity: 'Épico',
    price: 420,
    purchaseDate: '2024-03-12',
    views: 8930,
    likes: 445,
    comments: 78,
    shares: 34,
    rating: 4.6,
    tags: ['porto', 'ponte', 'arquitetura', 'rio'],
    category: 'Arquitetura',
    isPromoted: true,
    promotionType: 'holofote',
    promotionExpiry: '2024-04-01',
    viralScore: 720,
    engagementRate: 6.2,
    isLiked: true,
    isBookmarked: false,
    imageUrl: 'https://placehold.co/300x300/7DF9FF/000000?text=Ponte+Porto'
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    owner: {
      name: 'HistoryLover',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 22,
      followers: 890
    },
    title: 'Universidade de Coimbra',
    description: 'Uma das universidades mais antigas da Europa em pixel art',
    color: '#9C27B0',
    rarity: 'Raro',
    price: 320,
    purchaseDate: '2024-03-08',
    views: 6780,
    likes: 234,
    comments: 45,
    shares: 23,
    rating: 4.4,
    tags: ['coimbra', 'universidade', 'educação', 'história'],
    category: 'Educação',
    isPromoted: false,
    viralScore: 580,
    engagementRate: 4.8,
    isLiked: false,
    isBookmarked: true,
    imageUrl: 'https://placehold.co/300x300/9C27B0/FFFFFF?text=UC+Coimbra'
  },
  {
    id: '4',
    x: 400,
    y: 350,
    region: 'Braga',
    owner: {
      name: 'NorthernArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 12,
      followers: 234
    },
    title: 'Santuário do Bom Jesus',
    description: 'Escadório barroco em arte digital',
    color: '#4CAF50',
    rarity: 'Raro',
    price: 280,
    purchaseDate: '2024-03-14',
    views: 4560,
    likes: 178,
    comments: 32,
    shares: 15,
    rating: 4.2,
    tags: ['braga', 'religioso', 'barroco', 'escadas'],
    category: 'Religioso',
    isPromoted: true,
    promotionType: 'tendencia',
    promotionExpiry: '2024-03-25',
    viralScore: 420,
    engagementRate: 5.1,
    isLiked: false,
    isBookmarked: false,
    imageUrl: 'https://placehold.co/300x300/4CAF50/FFFFFF?text=Bom+Jesus'
  },
  {
    id: '5',
    x: 500,
    y: 450,
    region: 'Faro',
    owner: {
      name: 'SouthernVibes',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 16,
      followers: 445
    },
    title: 'Praia da Marinha',
    description: 'Uma das praias mais belas do mundo em pixel art',
    color: '#00BCD4',
    rarity: 'Épico',
    price: 380,
    purchaseDate: '2024-03-11',
    views: 7890,
    likes: 567,
    comments: 89,
    shares: 45,
    rating: 4.8,
    tags: ['faro', 'praia', 'natureza', 'turismo'],
    category: 'Natureza',
    isPromoted: true,
    promotionType: 'destaque',
    promotionExpiry: '2024-03-28',
    viralScore: 680,
    engagementRate: 7.8,
    isLiked: true,
    isBookmarked: true,
    imageUrl: 'https://placehold.co/300x300/00BCD4/FFFFFF?text=Praia+Marinha'
  }
];

const promotionPlans: PromotionPlan[] = [
  {
    id: 'destaque',
    name: 'Destaque',
    description: 'Apareça nas primeiras posições da galeria',
    price: 100,
    specialCreditsPrice: 25,
    duration: '7 dias',
    benefits: ['+200% visualizações', 'Badge "Em Destaque"', 'Posição prioritária'],
    badge: 'DESTAQUE',
    color: 'from-blue-500 to-cyan-500',
    icon: <Star className="h-5 w-5" />,
    boost: '+200%',
    position: 'Top 20'
  },
  {
    id: 'tendencia',
    name: 'Tendência',
    description: 'Apareça na secção "Trending" da galeria',
    price: 200,
    specialCreditsPrice: 40,
    duration: '14 dias',
    benefits: ['+400% visualizações', 'Badge "Trending"', 'Secção especial', 'Notificação aos seguidores'],
    badge: 'TRENDING',
    color: 'from-orange-500 to-red-500',
    icon: <TrendingUp className="h-5 w-5" />,
    boost: '+400%',
    position: 'Trending Section'
  },
  {
    id: 'holofote',
    name: 'Holofote',
    description: 'Destaque premium com animações especiais',
    price: 500,
    specialCreditsPrice: 80,
    duration: '30 dias',
    benefits: ['+600% visualizações', 'Animações especiais', 'Badge dourado', 'Push notification'],
    badge: 'HOLOFOTE',
    color: 'from-purple-500 to-pink-500',
    icon: <Sparkles className="h-5 w-5" />,
    boost: '+600%',
    position: 'Hero Section'
  },
  {
    id: 'vip',
    name: 'VIP Premium',
    description: 'Máximo destaque com todas as funcionalidades',
    price: 1000,
    specialCreditsPrice: 150,
    duration: '60 dias',
    benefits: ['+1000% visualizações', 'Posição fixa no topo', 'Análise detalhada', 'Suporte dedicado'],
    badge: 'VIP',
    color: 'from-amber-500 to-yellow-500',
    icon: <Crown className="h-5 w-5" />,
    boost: '+1000%',
    position: 'Fixed Top'
  }
];

const featuredSpots: FeaturedSpot[] = [
  {
    id: 'hero-banner',
    name: 'Banner Principal',
    description: 'Posição de máximo destaque no topo da galeria',
    price: 2000,
    specialCreditsPrice: 300,
    duration: '30 dias',
    position: 'hero',
    maxPixels: 1,
    currentPixels: 0,
    benefits: ['Visibilidade máxima', 'Primeiro elemento visto', 'Animações especiais'],
    isAvailable: true
  },
  {
    id: 'sidebar-featured',
    name: 'Sidebar Premium',
    description: 'Destaque lateral permanente',
    price: 800,
    specialCreditsPrice: 120,
    duration: '14 dias',
    position: 'sidebar',
    maxPixels: 3,
    currentPixels: 1,
    benefits: ['Sempre visível', 'Não afetado por scroll', 'Badge especial'],
    isAvailable: true
  },
  {
    id: 'category-top',
    name: 'Topo de Categoria',
    description: 'Primeiro pixel em cada categoria',
    price: 300,
    specialCreditsPrice: 50,
    duration: '7 dias',
    position: 'category-top',
    maxPixels: 10,
    currentPixels: 6,
    benefits: ['Primeiro em categoria', 'Badge de categoria', 'Maior engagement'],
    isAvailable: true
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: Museum, count: 1247 },
  { id: 'monumentos', name: 'Monumentos', icon: Trophy, count: 234 },
  { id: 'natureza', name: 'Natureza', icon: Sparkles, count: 189 },
  { id: 'arquitetura', name: 'Arquitetura', icon: Grid3X3, count: 156 },
  { id: 'arte', name: 'Arte', icon: Palette, count: 298 },
  { id: 'história', name: 'História', icon: Award, count: 167 },
  { id: 'cultura', name: 'Cultura', icon: Users, count: 203 }
];

const sortOptions = [
  { id: 'viral', name: 'Mais Virais', icon: Flame },
  { id: 'views', name: 'Mais Vistos', icon: Eye },
  { id: 'likes', name: 'Mais Curtidos', icon: Heart },
  { id: 'comments', name: 'Mais Comentados', icon: MessageSquare },
  { id: 'recent', name: 'Mais Recentes', icon: Clock },
  { id: 'rating', name: 'Melhor Avaliados', icon: Star },
  { id: 'price', name: 'Maior Valor', icon: Coins },
  { id: 'rarity', name: 'Mais Raros', icon: Gem },
  { id: 'engagement', name: 'Maior Engagement', icon: TrendingUp }
];

export default function PixelsGalleryPage() {
  const [pixels, setPixels] = useState<SoldPixel[]>(mockSoldPixels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('viral');
  const [selectedPixel, setSelectedPixel] = useState<SoldPixel | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionPlan | null>(null);
  const [showManagementPanel, setShowManagementPanel] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [managementFilter, setManagementFilter] = useState<'all' | 'promoted' | 'pending' | 'expired'>('all');
  const [manageFilter, setManageFilter] = useState<'todos' | 'ativos' | 'pendentes' | 'expirados'>('todos');
  
  const { toast } = useToast();
  const { addCredits, removeCredits, removeSpecialCredits, addXp, credits, specialCredits } = useUserStore();

  // Calculate viral score for sorting
  const calculateViralScore = (pixel: SoldPixel): number => {
    const viewsWeight = pixel.views * 0.1;
    const likesWeight = pixel.likes * 2;
    const commentsWeight = pixel.comments * 5;
    const sharesWeight = pixel.shares * 10;
    const ratingWeight = pixel.rating * 50;
    const engagementWeight = pixel.engagementRate * 20;
    
    let score = viewsWeight + likesWeight + commentsWeight + sharesWeight + ratingWeight + engagementWeight;
    
    // Boost for promoted pixels
    if (pixel.isPromoted) {
      switch (pixel.promotionType) {
        case 'vip': score += 500; break;
        case 'holofote': score += 300; break;
        case 'tendencia': score += 200; break;
        case 'destaque': score += 100; break;
      }
    }
    
    return Math.round(score);
  };

  // Filter and sort pixels
  const filteredPixels = pixels
    .filter(pixel => {
      const matchesSearch = !searchQuery || 
        pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        pixel.category.toLowerCase() === selectedCategory ||
        pixel.tags.some(tag => tag.toLowerCase() === selectedCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'viral':
          return calculateViralScore(b) - calculateViralScore(a);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        case 'recent':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return b.price - a.price;
        case 'rarity':
          const rarityOrder = { 'Comum': 1, 'Incomum': 2, 'Raro': 3, 'Épico': 4, 'Lendário': 5, 'Marco Histórico': 6 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'engagement':
          return b.engagementRate - a.engagementRate;
        default:
          return 0;
      }
    });

  // Get promoted pixels for special sections
  const heroPixel = pixels.find(p => p.promotionType === 'vip');
  const trendingPixels = pixels.filter(p => p.promotionType === 'tendencia').slice(0, 5);
  const spotlightPixels = pixels.filter(p => p.promotionType === 'holofote').slice(0, 3);

  const handleLike = (pixelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setPixels(prev => prev.map(pixel => {
      if (pixel.id === pixelId) {
        const newLiked = !pixel.isLiked;
        return {
          ...pixel,
          isLiked: newLiked,
          likes: newLiked ? pixel.likes + 1 : pixel.likes - 1
        };
      }
      return pixel;
    }));
    
    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel && !pixel.isLiked) {
      addXp(5);
      addCredits(2);
      setPlaySuccessSound(true);
      
      toast({
        title: "❤️ Pixel Curtido!",
        description: `Curtiu "${pixel.title}". +5 XP, +2 créditos!`,
      });
    }
  };

  const handleBookmark = (pixelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, isBookmarked: !pixel.isBookmarked }
        : pixel
    ));
    
    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel) {
      toast({
        title: pixel.isBookmarked ? "🔖 Removido dos Favoritos" : "⭐ Adicionado aos Favoritos",
        description: `"${pixel.title}" ${pixel.isBookmarked ? 'removido dos' : 'adicionado aos'} favoritos.`,
      });
    }
  };

  const handleShare = async (pixel: SoldPixel, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: `${pixel.title} - Pixel Universe`,
      text: `Confira este pixel incrível em ${pixel.region}!`,
      url: `${window.location.origin}/pixel/${pixel.x}-${pixel.y}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addXp(8);
        addCredits(3);
        
        setPixels(prev => prev.map(p => 
          p.id === pixel.id ? { ...p, shares: p.shares + 1 } : p
        ));
        
        toast({
          title: "📤 Pixel Partilhado!",
          description: `"${pixel.title}" partilhado. +8 XP, +3 créditos!`,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "🔗 Link Copiado!",
        description: "Link do pixel copiado para a área de transferência.",
      });
    }
  };

  const handlePromotePixel = (plan: PromotionPlan) => {
    if (!selectedPixel) return;
    
    const canAffordCredits = credits >= plan.price;
    const canAffordSpecial = specialCredits >= plan.specialCreditsPrice;
    
    if (!canAffordCredits && !canAffordSpecial) {
      toast({
        title: "Saldo Insuficiente",
        description: `Precisa de ${plan.price} créditos ou ${plan.specialCreditsPrice} créditos especiais.`,
        variant: "destructive"
      });
      return;
    }
    
    // Use special credits if available, otherwise regular credits
    if (canAffordSpecial) {
      removeSpecialCredits(plan.specialCreditsPrice);
    } else {
      removeCredits(plan.price);
    }
    
    // Update pixel with promotion
    setPixels(prev => prev.map(pixel => 
      pixel.id === selectedPixel.id 
        ? {
            ...pixel,
            isPromoted: true,
            promotionType: plan.id as any,
            promotionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        : pixel
    ));
    
    setShowConfetti(true);
    setPlaySuccessSound(true);
    addXp(50);
    
    toast({
      title: "🚀 Promoção Ativada!",
      description: `"${selectedPixel.title}" promovido com ${plan.name}. +50 XP!`,
    });
    
    setShowPromotionModal(false);
    setSelectedPixel(null);
  };

  const handleRemovePromotion = (pixelId: string) => {
    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? {
            ...pixel,
            isPromoted: false,
            promotionType: undefined,
            promotionExpiry: undefined
          }
        : pixel
    ));
    
    toast({
      title: "Promoção Removida",
      description: "A promoção foi removida com sucesso.",
    });
  };

  const handlePurchaseFeaturedSpot = (spot: FeaturedSpot) => {
    if (credits < spot.price && specialCredits < spot.specialCreditsPrice) {
      toast({
        title: "Saldo Insuficiente",
        description: `Precisa de ${spot.price} créditos ou ${spot.specialCreditsPrice} créditos especiais.`,
        variant: "destructive"
      });
      return;
    }
    
    if (specialCredits >= spot.specialCreditsPrice) {
      removeSpecialCredits(spot.specialCreditsPrice);
    } else {
      removeCredits(spot.price);
    }
    
    setShowConfetti(true);
    setPlaySuccessSound(true);
    addXp(100);
    
    toast({
      title: "🎯 Spot Premium Adquirido!",
      description: `${spot.name} reservado por ${spot.duration}. +100 XP!`,
    });
  };

  const handlePixelClick = (pixel: SoldPixel) => {
    setSelectedPixel(pixel);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Marco Histórico': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getPromotionBadge = (promotionType?: string) => {
    switch (promotionType) {
      case 'vip':
        return <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 animate-pulse">VIP</Badge>;
      case 'holofote':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">HOLOFOTE</Badge>;
      case 'tendencia':
        return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">TRENDING</Badge>;
      case 'destaque':
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse">DESTAQUE</Badge>;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-3 sm:py-6 px-2 sm:px-4 space-y-4 sm:space-y-6 max-w-7xl mb-16">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div>
                <CardTitle className="font-headline text-2xl sm:text-3xl text-gradient-gold flex items-center">
                  <Museum className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 animate-glow" />
                  Museu de Pixels
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                  Galeria premium dos pixels mais impressionantes de Portugal
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowManagementPanel(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse min-h-[36px] text-xs sm:text-sm"
                >
                  <Settings className="h-5 w-5 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="font-bold">⚡ GERIR DESTAQUES ⚡</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Hero Pixel (VIP Promotion) */}
        {heroPixel && (
          <Card className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/50">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-yellow-500/10 animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                <div className="relative">
                  <img 
                    src={heroPixel.imageUrl} 
                    alt={heroPixel.title}
                    className="w-full md:w-48 h-32 sm:h-48 object-cover rounded-lg border-2 border-amber-500/50"
                  />
                  <Badge className="absolute top-2 left-2 bg-amber-500 animate-pulse">
                    <Crown className="h-3 w-3 mr-1" />
                    VIP
                  </Badge>
                </div>
                
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-500">{heroPixel.title}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">{heroPixel.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{formatNumber(heroPixel.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      <span>{formatNumber(heroPixel.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      <span>{heroPixel.rating}</span>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-500">
                      Score: {calculateViralScore(heroPixel)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button 
                      className="min-h-[36px] sm:min-h-[44px] bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                      onClick={() => setSelectedPixel(heroPixel)}
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="min-h-[36px] sm:min-h-[44px]"
                      onClick={(e) => handleShare(heroPixel, e)}
                    >
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Partilhar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="gallery" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-10 sm:h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="gallery" className="font-headline text-xs sm:text-sm">
              <Museum className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Galeria
            </TabsTrigger>
            <TabsTrigger value="trending" className="font-headline text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Trending
            </TabsTrigger>
            <TabsTrigger value="promote" className="font-headline text-xs sm:text-sm">
              <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Promover
            </TabsTrigger>
            <TabsTrigger value="manage" className="font-headline text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Gerir
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-headline text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Main Gallery */}
          <TabsContent value="gallery" className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar pixels, artistas, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 sm:pl-10 bg-background/70 focus:border-primary text-xs sm:text-sm h-8 sm:h-10"
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
                        className="min-h-[32px] text-xs px-2 sm:px-3"
                      >
                        <category.icon className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{category.name}</span>
                        <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                        <Badge variant="secondary" className="ml-1 text-xs h-4 px-1">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <span className="text-xs sm:text-sm text-muted-foreground">Ordenar:</span>
                    <div className="flex flex-wrap gap-1">
                      {sortOptions.slice(0, 5).map(option => (
                        <Button
                          key={option.id}
                          variant={sortBy === option.id ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setSortBy(option.id)}
                          className="min-h-[28px] text-xs px-2"
                        >
                          <option.icon className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">{option.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Section */}
            {trendingPixels.length > 0 && (
              <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl flex items-center text-orange-500">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-pulse" />
                    Em Tendência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {trendingPixels.map(pixel => (
                      <Card 
                        key={pixel.id} 
                        className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                        onClick={() => setSelectedPixel(pixel)}
                      >
                        <div className="relative">
                          <img 
                            src={pixel.imageUrl} 
                            alt={pixel.title}
                            className="w-full h-20 sm:h-24 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-1 right-1 bg-orange-500 text-xs">
                            TRENDING
                          </Badge>
                        </div>
                        <CardContent className="p-2 sm:p-3">
                          <h4 className="font-semibold text-xs sm:text-sm truncate">{pixel.title}</h4>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatNumber(pixel.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              {formatNumber(pixel.likes)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {filteredPixels.map((pixel, index) => (
                <motion.div
                  key={pixel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden",
                      pixel.isPromoted && "ring-2 ring-primary/50 shadow-primary/20"
                    )}
                    onClick={() => setSelectedPixel(pixel)}
                  >
                    <div className="relative group cursor-pointer" onClick={() => handlePixelClick(pixel)}>
                      <div 
                        className="aspect-square rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 overflow-hidden relative bg-gradient-to-br from-background/50 to-muted/30"
                        style={{ backgroundColor: pixel.color }}
                      >
                        {/* Badges Reorganizados */}
                        <div className="absolute top-1 left-1 z-10">
                          <Badge className={cn("text-xs px-1.5 py-0.5", getRarityColor(pixel.rarity))}>
                            {pixel.rarity}
                          </Badge>
                        </div>
                        
                        <div className="absolute top-1 right-1 z-10">
                          {pixel.isPromoted && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse text-xs px-1.5 py-0.5">
                              <Crown className="h-2.5 w-2.5 mr-0.5" />
                              {pixel.promotionType === 'vip' ? 'VIP' : 
                               pixel.promotionType === 'spotlight' ? 'HOT' :
                               pixel.promotionType === 'trending' ? 'TOP' : 'PRO'}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Ranking Badge - Canto inferior esquerdo */}
                        {index < 3 && (
                          <div className="absolute bottom-1 left-1 z-10">
                            <Badge className={cn(
                              "text-xs px-1.5 py-0.5",
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                            )}>
                              <Trophy className="h-2.5 w-2.5 mr-0.5" />
                              {index + 1}
                            </Badge>
                          </div>
                        )}
                        
                        {/* Conteúdo Central - Mais Limpo */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="text-3xl opacity-70">🎨</div>
                        </div>
                        
                        {/* Overlay com Info - Melhor Organizado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                            <h3 className="font-semibold text-xs mb-1 truncate leading-tight">{pixel.title}</h3>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-mono">({pixel.x}, {pixel.y})</span>
                              <span className="text-white/80">{pixel.region}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="flex items-center gap-0.5">
                                  <Eye className="h-2.5 w-2.5" />
                                  {formatNumber(pixel.views)}
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Heart className="h-2.5 w-2.5" />
                                  {pixel.likes}
                                </span>
                              </div>
                              <span className="font-bold text-primary">€{pixel.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info Compacta */}
                      <div className="p-3 space-y-2">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm truncate leading-tight">{pixel.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-mono">({pixel.x}, {pixel.y})</span>
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              {pixel.region}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="flex items-center gap-0.5">
                              <Eye className="h-2.5 w-2.5 text-blue-500" />
                              {formatNumber(pixel.views)}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Heart className="h-2.5 w-2.5 text-red-500" />
                              {pixel.likes}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5 text-xs">
                              <Star className="h-2.5 w-2.5 text-yellow-500 fill-current" />
                              <span>{pixel.rating}</span>
                            </div>
                            <span className="font-bold text-primary text-sm">€{pixel.price}</span>
                          </div>
                        </div>
                        
                        {/* Botões de Ação - Mais Compactos */}
                        <div className="grid grid-cols-2 gap-1.5 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(pixel.id, e);
                              setPlaySuccessSound(true);
                              toast({
                                title: pixel.isLiked ? "💔 Descurtido" : "❤️ Curtido!",
                                description: `"${pixel.title}" ${pixel.isLiked ? 'removido dos' : 'adicionado aos'} favoritos.`,
                              });
                            }}
                            className="text-xs min-h-[28px] px-2"
                          >
                            <Heart className={`h-2.5 w-2.5 mr-1 ${pixel.isLiked ? 'fill-current text-red-500' : ''}`} />
                            {pixel.isLiked ? 'Curtido' : 'Curtir'}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(pixel.id, e);
                              setPlaySuccessSound(true);
                              toast({
                                title: pixel.isBookmarked ? "🔖 Removido" : "⭐ Salvo!",
                                description: `"${pixel.title}" ${pixel.isBookmarked ? 'removido dos' : 'adicionado aos'} favoritos.`,
                              });
                            }}
                            className="text-xs min-h-[28px] px-2"
                          >
                            <Bookmark className={`h-2.5 w-2.5 mr-1 ${pixel.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                            {pixel.isBookmarked ? 'Salvo' : 'Salvar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                Carregar Mais Pixels
              </Button>
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Trending */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-500">
                      <Flame className="h-5 w-5 mr-2 animate-pulse" />
                      Pixels Mais Virais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredPixels.slice(0, 5).map((pixel, index) => (
                        <Card key={pixel.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex gap-3 sm:gap-4">
                            <div className="relative">
                              <img 
                                src={pixel.imageUrl} 
                                alt={pixel.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                              />
                              <Badge className="absolute -top-1 -left-1 bg-orange-500 text-xs">
                                #{index + 1}
                              </Badge>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div>
                                <h4 className="font-semibold text-sm sm:text-base">{pixel.title}</h4>
                                <p className="text-xs text-muted-foreground">por {pixel.owner.name}</p>
                              </div>
                              
                              <div className="flex items-center gap-3 sm:gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {formatNumber(pixel.views)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                  {formatNumber(pixel.likes)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                  {calculateViralScore(pixel)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Trending Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Stats Trending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">+234%</div>
                      <div className="text-xs text-muted-foreground">Crescimento Médio</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Categoria Mais Popular</span>
                        <span className="font-medium">Monumentos</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Região Mais Ativa</span>
                        <span className="font-medium">Lisboa</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Horário de Pico</span>
                        <span className="font-medium">19h-21h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Hash className="h-4 w-4 mr-2" />
                      Tags Populares
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['lisboa', 'arte', 'monumento', 'natureza', 'história'].map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Promote Tab */}
          <TabsContent value="promote" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Promotion Plans */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center text-primary">
                      <Megaphone className="h-5 w-5 mr-2" />
                      Planos de Promoção
                    </CardTitle>
                    <CardDescription>
                      Destaque os seus pixels e aumente a visibilidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {promotionPlans.map(plan => (
                      <Card key={plan.id} className={cn("overflow-hidden transition-all hover:shadow-lg", `bg-gradient-to-r ${plan.color}/10`)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-full", `bg-gradient-to-r ${plan.color}/20`)}>
                                {plan.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                              </div>
                            </div>
                            <Badge className={cn("animate-pulse", `bg-gradient-to-r ${plan.color}`)}>
                              {plan.badge}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Duração:</span>
                              <span className="font-medium">{plan.duration}</span>
                            </div>
                            
                            <div className="space-y-1">
                              {plan.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Check className="h-3 w-3 text-green-500" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 min-h-[36px]"
                                onClick={() => {
                                  setSelectedPromotion(plan);
                                  setShowPromotionModal(true);
                                }}
                              >
                                <Coins className="h-3 w-3 mr-1" />
                                {plan.price}€
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1 min-h-[36px]"
                                onClick={() => {
                                  setSelectedPromotion(plan);
                                  setShowPromotionModal(true);
                                }}
                              >
                                <Gift className="h-3 w-3 mr-1" />
                                {plan.specialCreditsPrice}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Featured Spots */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center text-accent">
                      <Target className="h-5 w-5 mr-2" />
                      Spots Premium
                    </CardTitle>
                    <CardDescription>
                      Posições fixas de destaque na galeria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featuredSpots.map(spot => (
                      <Card key={spot.id} className="border-accent/30">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{spot.name}</h3>
                                <p className="text-sm text-muted-foreground">{spot.description}</p>
                              </div>
                              <Badge variant={spot.isAvailable ? 'default' : 'secondary'}>
                                {spot.isAvailable ? 'Disponível' : 'Ocupado'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Ocupação:</span>
                                <span>{spot.currentPixels}/{spot.maxPixels}</span>
                              </div>
                              <Progress value={(spot.currentPixels / spot.maxPixels) * 100} className="h-2" />
                            </div>
                            
                            <div className="space-y-1">
                              {spot.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Sparkles className="h-3 w-3 text-accent" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 min-h-[36px]"
                                disabled={!spot.isAvailable}
                                onClick={() => handlePurchaseFeaturedSpot(spot)}
                              >
                                <Coins className="h-3 w-3 mr-1" />
                                {spot.price}€
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1 min-h-[36px]"
                                disabled={!spot.isAvailable}
                                onClick={() => handlePurchaseFeaturedSpot(spot)}
                              >
                                <Gift className="h-3 w-3 mr-1" />
                                {spot.specialCreditsPrice}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Gestão de Destaques Tab */}
          <TabsContent value="manage" className="space-y-6">
            <div className="space-y-6">
              {/* Header com Stats */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-xs text-muted-foreground">Pixels Promovidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">€2,450</div>
                      <div className="text-xs text-muted-foreground">Receita Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">156K</div>
                      <div className="text-xs text-muted-foreground">Views Geradas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">4.8</div>
                      <div className="text-xs text-muted-foreground">ROI Médio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filtros e Ações */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {['Todos', 'Ativos', 'Pendentes', 'Expirados'].map(status => (
                        <Button
                          key={status}
                          variant={manageFilter === status.toLowerCase() ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setManageFilter(status.toLowerCase() as any)}
                          className="text-xs"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Promoção
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Pixels Promovidos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Pixels em Destaque
                  </CardTitle>
                  <CardDescription>
                    Gerencie as promoções ativas e o desempenho dos seus pixels destacados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        id: '1',
                        pixel: { x: 245, y: 156, title: 'Torre de Belém Digital', region: 'Lisboa' },
                        promotion: { type: 'VIP Premium', price: 1000, duration: '7 dias' },
                        stats: { views: 15420, likes: 892, comments: 156, roi: 5.2 },
                        status: 'Ativo',
                        expiresIn: '3 dias',
                        color: '#D4A757'
                      },
                      {
                        id: '2',
                        pixel: { x: 123, y: 89, title: 'Ponte Dom Luís', region: 'Porto' },
                        promotion: { type: 'Holofote', price: 500, duration: '3 dias' },
                        stats: { views: 8930, likes: 445, comments: 89, roi: 3.8 },
                        status: 'Ativo',
                        expiresIn: '1 dia',
                        color: '#7DF9FF'
                      },
                      {
                        id: '3',
                        pixel: { x: 300, y: 200, title: 'Universidade de Coimbra', region: 'Coimbra' },
                        promotion: { type: 'Tendência', price: 200, duration: '2 dias' },
                        stats: { views: 4560, likes: 234, comments: 45, roi: 2.1 },
                        status: 'Pendente',
                        expiresIn: '5 dias',
                        color: '#9C27B0'
                      }
                    ].filter(item => {
                      if (manageFilter === 'todos') return true;
                      return item.status.toLowerCase() === manageFilter;
                    }).map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Pixel Preview */}
                            <div className="relative flex-shrink-0">
                              <div 
                                className="w-16 h-16 rounded-lg border-2 border-border flex items-center justify-center text-2xl"
                                style={{ backgroundColor: item.color }}
                              >
                                🎨
                              </div>
                              <Badge 
                                className={cn(
                                  "absolute -top-1 -right-1 text-xs",
                                  item.status === 'Ativo' ? 'bg-green-500' :
                                  item.status === 'Pendente' ? 'bg-yellow-500' : 'bg-gray-500'
                                )}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            
                            {/* Info Principal */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-sm truncate">{item.pixel.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  ({item.pixel.x}, {item.pixel.y})
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <span>{item.pixel.region}</span>
                                <span>•</span>
                                <span className="text-primary font-medium">{item.promotion.type}</span>
                                <span>•</span>
                                <span>Expira em {item.expiresIn}</span>
                              </div>
                              
                              {/* Stats Compactas */}
                              <div className="grid grid-cols-4 gap-3 text-xs">
                                <div className="text-center">
                                  <div className="font-bold text-blue-500">{formatNumber(item.stats.views)}</div>
                                  <div className="text-muted-foreground">Views</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-red-500">{item.stats.likes}</div>
                                  <div className="text-muted-foreground">Likes</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-green-500">{item.stats.comments}</div>
                                  <div className="text-muted-foreground">Comentários</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-purple-500">{item.stats.roi}x</div>
                                  <div className="text-muted-foreground">ROI</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Ações */}
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Analytics Detalhados",
                                    description: `ROI: ${item.stats.roi}x • Views: ${item.stats.views.toLocaleString()}`,
                                  });
                                }}
                                className="text-xs min-h-[32px]"
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Analytics
                              </Button>
                              
                              {item.status === 'Ativo' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlaySuccessSound(true);
                                    toast({
                                      title: "Promoção Pausada",
                                      description: "A promoção foi pausada temporariamente.",
                                    });
                                  }}
                                  className="text-xs min-h-[32px]"
                                >
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pausar
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlaySuccessSound(true);
                                  addCredits(Math.floor(item.promotion.price * 0.1));
                                  toast({
                                    title: "Promoção Renovada",
                                    description: `Renovada por mais ${item.promotion.duration}. Recebeu ${Math.floor(item.promotion.price * 0.1)} créditos de desconto!`,
                                  });
                                }}
                                className="text-xs min-h-[32px]"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Renovar
                              </Button>
                            </div>
                          </div>
                          
                          {/* Progress Bar da Promoção */}
                          <div className="mt-3 pt-3 border-t border-border/30">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progresso da Campanha</span>
                              <span>{Math.floor(Math.random() * 40 + 60)}% concluído</span>
                            </div>
                            <Progress value={Math.floor(Math.random() * 40 + 60)} className="h-1.5" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Museum className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{pixels.length}</div>
                  <div className="text-sm text-muted-foreground">Pixels no Museu</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(pixels.reduce((sum, p) => sum + p.views, 0))}</div>
                  <div className="text-sm text-muted-foreground">Total de Views</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(pixels.reduce((sum, p) => sum + p.likes, 0))}</div>
                  <div className="text-sm text-muted-foreground">Total de Likes</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Megaphone className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{pixels.filter(p => p.isPromoted).length}</div>
                  <div className="text-sm text-muted-foreground">Pixels Promovidos</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Performance por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.slice(1).map(category => {
                      const categoryPixels = pixels.filter(p => p.category.toLowerCase() === category.id);
                      const avgViews = categoryPixels.reduce((sum, p) => sum + p.views, 0) / categoryPixels.length || 0;
                      
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              {category.name}
                            </span>
                            <span className="font-medium">{formatNumber(avgViews)} views</span>
                          </div>
                          <Progress value={(avgViews / 20000) * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-primary" />
                    ROI das Promoções
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {promotionPlans.map(plan => {
                      const promotedPixels = pixels.filter(p => p.promotionType === plan.id);
                      const avgROI = promotedPixels.length > 0 ? 
                        (promotedPixels.reduce((sum, p) => sum + p.views, 0) / promotedPixels.length / plan.price * 100) : 0;
                      
                      return (
                        <div key={plan.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            {plan.icon}
                            <span className="font-medium">{plan.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-500">+{avgROI.toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">ROI médio</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Management Panel Modal */}
        {showManagementPanel && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Painel de Gestão de Destaques
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowManagementPanel(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <Tabs defaultValue="promoted" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="promoted">Promovidos</TabsTrigger>
                    <TabsTrigger value="spots">Spots Premium</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="promoted" className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex gap-2">
                        {['all', 'promoted', 'pending', 'expired'].map(filter => (
                          <Button
                            key={filter}
                            variant={managementFilter === filter ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setManagementFilter(filter as any)}
                            className="text-xs"
                          >
                            {filter === 'all' ? 'Todos' : 
                             filter === 'promoted' ? 'Ativos' :
                             filter === 'pending' ? 'Pendentes' : 'Expirados'}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {pixels
                          .filter(p => managementFilter === 'all' || 
                                      (managementFilter === 'promoted' && p.isPromoted))
                          .map(pixel => (
                          <Card key={pixel.id} className="p-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={pixel.imageUrl} 
                                alt={pixel.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{pixel.title}</h4>
                                  {pixel.isPromoted && getPromotionBadge(pixel.promotionType)}
                                </div>
                                <p className="text-sm text-muted-foreground">por {pixel.owner.name}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {formatNumber(pixel.views)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {formatNumber(pixel.likes)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {pixel.engagementRate}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                {pixel.isPromoted ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleRemovePromotion(pixel.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Remover
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPixel(pixel);
                                      setShowPromotionModal(true);
                                    }}
                                  >
                                    <Megaphone className="h-3 w-3 mr-1" />
                                    Promover
                                  </Button>
                                )}
                                
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="h-3 w-3 mr-1" />
                                  Stats
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="spots" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {featuredSpots.map(spot => (
                        <Card key={spot.id} className="border-accent/30">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{spot.name}</h3>
                                  <p className="text-sm text-muted-foreground">{spot.description}</p>
                                </div>
                                <Badge variant={spot.isAvailable ? 'default' : 'secondary'}>
                                  {spot.isAvailable ? 'Disponível' : 'Ocupado'}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Ocupação:</span>
                                  <span>{spot.currentPixels}/{spot.maxPixels}</span>
                                </div>
                                <Progress value={(spot.currentPixels / spot.maxPixels) * 100} className="h-2" />
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  className="flex-1 min-h-[36px]"
                                  disabled={!spot.isAvailable}
                                  onClick={() => handlePurchaseFeaturedSpot(spot)}
                                >
                                  <Coins className="h-3 w-3 mr-1" />
                                  {spot.price}€
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="flex-1 min-h-[36px]"
                                  disabled={!spot.isAvailable}
                                >
                                  <Gift className="h-3 w-3 mr-1" />
                                  {spot.specialCreditsPrice}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">€{pixels.reduce((sum, p) => sum + (p.isPromoted ? 500 : 0), 0)}</div>
                          <div className="text-sm text-muted-foreground">Receita de Promoções</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">+{((pixels.filter(p => p.isPromoted).reduce((sum, p) => sum + p.views, 0) / pixels.reduce((sum, p) => sum + p.views, 0)) * 100).toFixed(0)}%</div>
                          <div className="text-sm text-muted-foreground">Boost Médio</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{new Set(pixels.map(p => p.owner.name)).size}</div>
                          <div className="text-sm text-muted-foreground">Artistas Únicos</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Configurações da Galeria</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Auto-aprovação de Promoções</h4>
                              <p className="text-sm text-muted-foreground">Aprovar automaticamente promoções pagas</p>
                            </div>
                            <Button variant="outline" size="sm">Ativar</Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Notificações de Trending</h4>
                              <p className="text-sm text-muted-foreground">Notificar quando pixels ficam trending</p>
                            </div>
                            <Button variant="outline" size="sm">Configurar</Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Moderação de Conteúdo</h4>
                              <p className="text-sm text-muted-foreground">Configurar filtros de conteúdo</p>
                            </div>
                            <Button variant="outline" size="sm">Gerir</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Promotion Modal */}
        {showPromotionModal && selectedPromotion && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {selectedPromotion.icon}
                  <span className="ml-2">Promover Pixel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPixel && (
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold">{selectedPixel.title}</h4>
                    <p className="text-sm text-muted-foreground">por {selectedPixel.owner.name}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h3 className="font-semibold">{selectedPromotion.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPromotion.description}</p>
                  
                  <div className="space-y-2">
                    {selectedPromotion.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handlePromotePixel(selectedPromotion)}
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Pagar {selectedPromotion.price}€
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handlePromotePixel(selectedPromotion)}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {selectedPromotion.specialCreditsPrice} Especiais
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowPromotionModal(false);
                    setSelectedPromotion(null);
                  }}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}