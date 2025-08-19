'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { User, Edit3, Settings, Share2, Crown, Star, Trophy, MapPin, Heart, Eye, MessageSquare, Calendar, Clock, Coins, Gift, Zap, Target, Award, Gem, Sparkles, Users, UserPlus, UserMinus, BookImage, Palette, Camera, Link as LinkIcon, Globe, Mail, Phone, Instagram, Twitter, Github, Facebook, Youtube, Twitch, Plus, Minus, Check, X, Copy, Download, Upload, Bookmark, BarChart3, TrendingUp, Activity, Flame, Shield, Lock, Bell, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Filter, Search, SortAsc, Grid, List, Image as ImageIcon, Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, Save, Trash2, ExternalLink, Info, AlertTriangle, CheckCircle, RefreshCw, PieChart, LineChart, Calendar as CalendarIcon, Map, Compass, Navigation, Layers, Brush, PaintBucket, Eraser, Type, Shapes, MousePointer, Hand, ZoomIn, ZoomOut, Move, MoreHorizontal, ThumbsUp, ThumbsDown, Flag, Import as Report, Blocks as Block, Route as Mute, Archive } from "lucide-react";
import { cn } from '@/lib/utils';
import { formatDate, timeAgo } from '@/lib/utils';
import Image from 'next/image';

// Types
interface UserPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  color: string;
  title: string;
  description: string;
  price: number;
  views: number;
  likes: number;
  comments: number;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
  lastModified: string;
  tags: string[];
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  imageUrl: string;
}

interface UserAlbum {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  pixelCount: number;
  views: number;
  likes: number;
  isPublic: boolean;
  createdAt: string;
  tags: string[];
  collaborators?: string[];
}

interface UserFriend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends: number;
  pixelsOwned: number;
  isVerified: boolean;
  isPremium: boolean;
  status: 'friend' | 'following' | 'follower' | 'pending' | 'blocked';
}

interface RecentActivity {
  id: string;
  type: 'pixel_purchase' | 'pixel_edit' | 'achievement' | 'album_create' | 'social_interaction' | 'level_up';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
  icon: React.ReactNode;
  color: string;
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  unlockedAt: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  creditsReward: number;
  category: string;
}

// Mock Data
const mockPixels: UserPixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    color: '#D4A757',
    title: 'Pixel Dourado de Lisboa',
    description: 'Minha primeira obra-prima no coração da capital',
    price: 150,
    views: 1234,
    likes: 89,
    comments: 23,
    isPublic: true,
    isFavorite: true,
    createdAt: '2024-03-15T10:30:00Z',
    lastModified: '2024-03-16T14:20:00Z',
    tags: ['lisboa', 'dourado', 'capital'],
    rarity: 'Épico',
    imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa'
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    color: '#7DF9FF',
    title: 'Arte Azul do Porto',
    description: 'Inspirado nas águas do Douro',
    price: 120,
    views: 567,
    likes: 45,
    comments: 12,
    isPublic: true,
    isFavorite: false,
    createdAt: '2024-03-10T09:15:00Z',
    lastModified: '2024-03-10T09:15:00Z',
    tags: ['porto', 'azul', 'douro'],
    rarity: 'Raro',
    imageUrl: 'https://placehold.co/200x200/7DF9FF/000000?text=Porto'
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    color: '#9C27B0',
    title: 'Pixel Universitário',
    description: 'Homenagem à cidade dos estudantes',
    price: 80,
    views: 234,
    likes: 18,
    comments: 5,
    isPublic: false,
    isFavorite: true,
    createdAt: '2024-03-05T16:45:00Z',
    lastModified: '2024-03-05T16:45:00Z',
    tags: ['coimbra', 'universidade', 'estudantes'],
    rarity: 'Incomum',
    imageUrl: 'https://placehold.co/200x200/9C27B0/FFFFFF?text=Coimbra'
  }
];

const mockAlbums: UserAlbum[] = [
  {
    id: '1',
    name: 'Paisagens de Portugal',
    description: 'Coleção das mais belas paisagens portuguesas em pixel art',
    coverUrl: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Paisagens',
    pixelCount: 15,
    views: 2340,
    likes: 156,
    isPublic: true,
    createdAt: '2024-03-01T12:00:00Z',
    tags: ['paisagem', 'portugal', 'natureza'],
    collaborators: ['ArtistaPro', 'ColorMaster']
  },
  {
    id: '2',
    name: 'Arte Urbana',
    description: 'Pixels inspirados na vida urbana portuguesa',
    coverUrl: 'https://placehold.co/300x200/FF5722/FFFFFF?text=Urbano',
    pixelCount: 8,
    views: 890,
    likes: 67,
    isPublic: true,
    createdAt: '2024-02-15T18:30:00Z',
    tags: ['urbano', 'cidade', 'street-art']
  },
  {
    id: '3',
    name: 'Coleção Privada',
    description: 'Meus pixels mais especiais e pessoais',
    coverUrl: 'https://placehold.co/300x200/673AB7/FFFFFF?text=Privado',
    pixelCount: 5,
    views: 0,
    likes: 0,
    isPublic: false,
    createdAt: '2024-01-20T10:15:00Z',
    tags: ['pessoal', 'especial', 'privado']
  }
];

const mockFriends: UserFriend[] = [
  {
    id: '1',
    name: 'PixelArtist',
    username: 'pixelartist123',
    avatar: 'https://placehold.co/40x40.png',
    level: 18,
    isOnline: true,
    lastSeen: 'Online',
    mutualFriends: 12,
    pixelsOwned: 234,
    isVerified: true,
    isPremium: true,
    status: 'friend'
  },
  {
    id: '2',
    name: 'ColorMaster',
    username: 'colormaster',
    avatar: 'https://placehold.co/40x40.png',
    level: 15,
    isOnline: false,
    lastSeen: '2h atrás',
    mutualFriends: 8,
    pixelsOwned: 156,
    isVerified: false,
    isPremium: false,
    status: 'following'
  },
  {
    id: '3',
    name: 'ArtCollector',
    username: 'artcollector',
    avatar: 'https://placehold.co/40x40.png',
    level: 22,
    isOnline: true,
    lastSeen: 'Online',
    mutualFriends: 5,
    pixelsOwned: 567,
    isVerified: true,
    isPremium: true,
    status: 'follower'
  }
];

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'pixel_purchase',
    title: 'Novo Pixel Adquirido',
    description: 'Comprou pixel em Lisboa (245, 156) por 150 créditos',
    timestamp: '2024-03-16T14:20:00Z',
    icon: <MapPin className="h-4 w-4" />,
    color: 'text-green-500',
    metadata: { x: 245, y: 156, region: 'Lisboa', price: 150 }
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Conquista Desbloqueada',
    description: 'Desbloqueou "Mestre das Cores" - Nível 2',
    timestamp: '2024-03-15T16:45:00Z',
    icon: <Trophy className="h-4 w-4" />,
    color: 'text-yellow-500',
    metadata: { achievementId: 'color_master', level: 2 }
  },
  {
    id: '3',
    type: 'album_create',
    title: 'Novo Álbum Criado',
    description: 'Criou o álbum "Paisagens de Portugal" com 15 pixels',
    timestamp: '2024-03-14T11:30:00Z',
    icon: <BookImage className="h-4 w-4" />,
    color: 'text-purple-500',
    metadata: { albumId: '1', pixelCount: 15 }
  },
  {
    id: '4',
    type: 'level_up',
    title: 'Subiu de Nível',
    description: 'Alcançou o nível 15 e recebeu 500 créditos de bónus',
    timestamp: '2024-03-12T20:15:00Z',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-blue-500',
    metadata: { newLevel: 15, bonusCredits: 500 }
  },
  {
    id: '5',
    type: 'social_interaction',
    title: 'Novo Seguidor',
    description: 'ArtCollector começou a seguir você',
    timestamp: '2024-03-11T09:20:00Z',
    icon: <UserPlus className="h-4 w-4" />,
    color: 'text-pink-500',
    metadata: { userId: '3', userName: 'ArtCollector' }
  }
];

const mockAchievements: UserAchievement[] = [
  {
    id: '1',
    name: 'Primeiro Pixel',
    description: 'Comprou o seu primeiro pixel',
    icon: <MapPin className="h-5 w-5" />,
    rarity: 'Comum',
    unlockedAt: '2024-01-15T10:00:00Z',
    progress: 1,
    maxProgress: 1,
    xpReward: 50,
    creditsReward: 10,
    category: 'Iniciante'
  },
  {
    id: '2',
    name: 'Mestre das Cores',
    description: 'Usou 30 cores diferentes',
    icon: <Palette className="h-5 w-5" />,
    rarity: 'Épico',
    unlockedAt: '2024-03-15T16:45:00Z',
    progress: 30,
    maxProgress: 30,
    xpReward: 300,
    creditsReward: 100,
    category: 'Criatividade'
  },
  {
    id: '3',
    name: 'Colecionador',
    description: 'Possui 50 pixels diferentes',
    icon: <Gem className="h-5 w-5" />,
    rarity: 'Raro',
    unlockedAt: '2024-03-10T12:30:00Z',
    progress: 42,
    maxProgress: 50,
    xpReward: 200,
    creditsReward: 75,
    category: 'Coleção'
  }
];

export default function MemberPage() {
  const { 
    credits, 
    specialCredits, 
    level, 
    xp, 
    xpMax, 
    pixels, 
    achievements, 
    streak,
    totalSpent,
    totalEarned,
    favoriteColor,
    joinDate,
    addCredits,
    addXp,
    unlockAchievement
  } = useUserStore();
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [userPixels, setUserPixels] = useState<UserPixel[]>(mockPixels);
  const [userAlbums, setUserAlbums] = useState<UserAlbum[]>(mockAlbums);
  const [userFriends, setUserFriends] = useState<UserFriend[]>(mockFriends);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(mockActivities);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(mockAchievements);
  
  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    displayName: user?.displayName || 'PixelMasterPT',
    bio: 'Artista digital apaixonado por pixel art e pela cultura portuguesa. Criando arte única no Pixel Universe! 🎨🇵🇹',
    location: 'Lisboa, Portugal',
    website: 'https://pixelmaster.pt',
    socialLinks: {
      instagram: '@pixelmaster_pt',
      twitter: '@pixelmaster',
      github: 'pixelmaster',
      youtube: 'PixelMasterPT'
    }
  });
  
  // Filters and search
  const [pixelFilter, setPixelFilter] = useState<'all' | 'public' | 'private' | 'favorites'>('all');
  const [pixelSort, setPixelSort] = useState<'recent' | 'popular' | 'price' | 'alphabetical'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showPixelCount: true,
    showAchievements: true,
    showActivity: false,
    allowMessages: true,
    showOnlineStatus: true
  });
  
  // Effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Computed values
  const xpPercentage = (xp / xpMax) * 100;
  const nextLevelXp = xpMax - xp;
  const totalPixelViews = userPixels.reduce((sum, pixel) => sum + pixel.views, 0);
  const totalPixelLikes = userPixels.reduce((sum, pixel) => sum + pixel.likes, 0);
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-20">
  const mostExpensivePixel = userPixels.reduce((max, pixel) => pixel.price > max.price ? pixel : max, userPixels[0] || { price: 0 });
  
  const friends = userFriends.filter(f => f.status === 'friend');
  const followers = userFriends.filter(f => f.status === 'follower');
  const following = userFriends.filter(f => f.status === 'following');
  
  // Filter pixels
  const filteredPixels = userPixels.filter(pixel => {
    const matchesFilter = 
      pixelFilter === 'all' || 
      (pixelFilter === 'public' && pixel.isPublic) ||
      (pixelFilter === 'private' && !pixel.isPublic) ||
      (pixelFilter === 'favorites' && pixel.isFavorite);
    
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    switch (pixelSort) {
      case 'popular':
        return (b.views + b.likes) - (a.views + a.likes);
      case 'price':
        return b.price - a.price;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });

  // Handlers
  const handleSaveProfile = () => {
    setIsLoading(true);
    vibrate('medium');
    
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      setShowConfetti(true);
      setPlaySound(true);
      
      addXp(25);
      addCredits(10);
      
      toast({
        title: "Perfil Atualizado! ✨",
        description: "Suas informações foram salvas. +25 XP, +10 créditos!",
      });
    }, 1500);
  };

  const handlePixelAction = (action: string, pixelId: string) => {
    vibrate('light');
    setPlaySound(true);
    
    switch (action) {
      case 'favorite':
        setUserPixels(prev => prev.map(p => 
          p.id === pixelId ? { ...p, isFavorite: !p.isFavorite } : p
        ));
        addXp(5);
        break;
      case 'share':
        navigator.clipboard.writeText(`${window.location.origin}/pixel/${pixelId}`);
        toast({ title: "🔗 Link Copiado!", description: "Link do pixel copiado." });
        addXp(8);
        break;
      case 'edit':
        toast({ title: "🎨 Abrindo Editor", description: "Carregando editor avançado..." });
        break;
    }
  };

  const handleFriendAction = (action: string, friendId: string) => {
    vibrate('medium');
    setPlaySound(true);
    
    const friend = userFriends.find(f => f.id === friendId);
    if (!friend) return;
    
    switch (action) {
      case 'follow':
        setUserFriends(prev => prev.map(f => 
          f.id === friendId ? { ...f, status: 'following' } : f
        ));
        addXp(15);
        addCredits(5);
        toast({ 
          title: "👥 A Seguir!", 
          description: `Agora segue ${friend.name}. +15 XP, +5 créditos!` 
        });
        break;
      case 'unfollow':
        setUserFriends(prev => prev.map(f => 
          f.id === friendId ? { ...f, status: 'follower' } : f
        ));
        toast({ title: "Deixou de Seguir", description: `Não segue mais ${friend.name}.` });
        break;
      case 'message':
        toast({ title: "💬 Mensagem", description: `Abrindo chat com ${friend.name}...` });
        break;
    }
    if (dailyBonusClaimed) {
      toast({
        title: "Bónus Já Reclamado",
        description: "Volte amanhã para reclamar o próximo bónus diário!",
        variant: "destructive"
      });
      return;
    }
    
  };

  const handleClaimDailyBonus = () => {
    vibrate('heavy');
    setShowConfetti(true);
    setPlaySound(true);
    
    const bonusCredits = streak * 10;
    const bonusXp = streak * 5;
    
    addCredits(bonusCredits);
    addXp(bonusXp);
    
    toast({
      title: "🎁 Bónus Diário Reclamado!",
      description: `+${bonusCredits} créditos, +${bonusXp} XP (Sequência: ${streak} dias)`,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'friend': return 'text-green-500';
      case 'following': return 'text-blue-500';
      case 'follower': return 'text-purple-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'friend': return 'Amigo';
      case 'following': return 'A Seguir';
      case 'follower': return 'Seguidor';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-20">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          
          <CardContent className="p-6 relative">
            {/* Avatar and Basic Info */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 border-4 border-primary shadow-2xl hover:scale-105 transition-transform duration-300">
                  <AvatarImage 
                    src={user?.photoURL || 'https://placehold.co/96x96.png'} 
                    alt={editedProfile.displayName}
                  />
                  <AvatarFallback className="text-2xl font-headline bg-gradient-to-br from-primary to-accent text-white">
                    {editedProfile.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status Indicators */}
                <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                  <Badge className="bg-green-500 text-white text-xs px-1 py-0.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                    Online
                  </Badge>
                  {level >= 10 && (
                    <Badge className="bg-purple-500 text-white text-xs px-1 py-0.5">
                      <Crown className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                
                {/* Level Badge */}
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1">
                  Nível {level}
                </Badge>
              </div>
              
              {/* Name and Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-headline font-bold text-gradient-gold">
                    {editedProfile.displayName}
                  </h1>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
                
                <p className="text-sm text-muted-foreground font-code">
                  @{editedProfile.displayName.toLowerCase().replace(/\s+/g, '')}
                </p>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {editedProfile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Desde {formatDate(new Date(joinDate), 'MMM yyyy')}
                  </span>
                </div>
              </div>
              
              {/* Bio */}
              <Card className="bg-background/50 p-3 text-center">
                <p className="text-sm text-foreground italic leading-relaxed">
                  "{editedProfile.bio}"
                </p>
              </Card>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/user/${user?.uid}`);
                    toast({ title: "🔗 Perfil Partilhado!", description: "Link copiado!" });
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XP Progress */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Progresso de Nível</span>
                <span className="text-sm text-muted-foreground font-code">
                  {xp.toLocaleString()} / {xpMax.toLocaleString()} XP
                </span>
              </div>
              
              <div className="relative">
                <Progress value={xpPercentage} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Faltam {nextLevelXp.toLocaleString()} XP</span>
                <span>{Math.round(xpPercentage)}% completo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/10 to-accent/5">
            <CardContent className="p-4 text-center">
              <Coins className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-2xl font-bold text-primary">{credits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Créditos</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-accent/10 to-purple-500/5">
            <CardContent className="p-4 text-center">
              <Gift className="h-8 w-8 text-accent mx-auto mb-2 animate-pulse" />
              <p className="text-2xl font-bold text-accent">{specialCredits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Especiais</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-500/10 to-emerald-500/5">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2 animate-pulse" />
              <p className="text-2xl font-bold text-green-500">{pixels}</p>
              <p className="text-xs text-muted-foreground">Pixels</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-yellow-500/10 to-orange-500/5">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2 animate-pulse" />
              <p className="text-2xl font-bold text-yellow-500">{achievements}</p>
              <p className="text-xs text-muted-foreground">Conquistas</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Bonus */}
        <Card className="shadow-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-full">
                  <Gift className="h-6 w-6 text-green-500 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-semibold">Bónus Diário</h3>
                  <p className="text-sm text-muted-foreground">
                    Sequência: {streak} dias 🔥
                  </p>
                </div>
              </div>
              
              <Button onClick={handleClaimDailyBonus} className="bg-green-500 hover:bg-green-600">
                <Gift className="h-4 w-4 mr-2" />
                +{streak * 10}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-card/80 backdrop-blur-sm sticky top-16 z-30 rounded-lg border border-primary/20 shadow-lg">
              <TabsTrigger value="overview" className="text-xs">
                <BarChart3 className="h-4 w-4 mr-1" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="pixels" className="text-xs">
                <Palette className="h-4 w-4 mr-1" />
                Pixels ({userPixels.length})
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Social
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 relative z-10">
            <TabsContent value="overview" className="space-y-4 p-4">
              <TabsContent value="overview" className="space-y-6 pb-8 focus:outline-none">
                <div ref={scrollRef} className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                    Estatísticas de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-blue-500">{totalPixelViews.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total de Views</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-red-500">{totalPixelLikes.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total de Likes</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-500">€{averagePixelPrice.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Preço Médio</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-purple-500">€{mostExpensivePixel?.price || 0}</p>
                      <p className="text-xs text-muted-foreground">Mais Caro</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Distribuição por Região</h4>
                    {['Lisboa', 'Porto', 'Coimbra'].map(region => {
                      const regionPixels = userPixels.filter(p => p.region === region).length;
                      const percentage = userPixels.length > 0 ? (regionPixels / userPixels.length) * 100 : 0;
                      
                      return (
                        <div key={region} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{region}</span>
                            <span className="font-mono">{regionPixels} pixels</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(new Date(activity.timestamp))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Achievements Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      Conquistas ({userAchievements.length})
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('achievements')}>
                      Ver Todas
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {userAchievements.slice(0, 6).map(achievement => (
                      <div 
                        key={achievement.id}
                        className={`p-3 rounded-lg text-center ${getRarityColor(achievement.rarity)} hover:scale-105 transition-transform cursor-pointer`}
                        onClick={() => {
                          toast({
                            title: achievement.name,
                            description: achievement.description,
                          });
                        }}
                      >
                        <div className="text-2xl mb-1">{achievement.icon}</div>
                        <p className="text-xs font-medium truncate">{achievement.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pixels Tab */}
            <TabsContent value="pixels" className="space-y-4 p-4">
              {/* Filters and Search */}
              <Card className="bg-muted/30">
                <CardContent className="p-3 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar pixels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9"
                    />
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { key: 'all', label: 'Todos', count: userPixels.length },
                      { key: 'public', label: 'Públicos', count: userPixels.filter(p => p.isPublic).length },
                      { key: 'private', label: 'Privados', count: userPixels.filter(p => !p.isPublic).length },
                      { key: 'favorites', label: 'Favoritos', count: userPixels.filter(p => p.isFavorite).length }
                    ].map(filter => (
                      <Button
                        key={filter.key}
                        variant={pixelFilter === filter.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPixelFilter(filter.key as any)}
                        className="flex-shrink-0 text-xs"
                      >
                        {filter.label}
                        <Badge variant="secondary" className="ml-1 text-xs h-4 px-1">
                          {filter.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      <Button
                        variant={pixelSort === 'recent' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPixelSort('recent')}
                        className="text-xs"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Recentes
                      </Button>
                      <Button
                        variant={pixelSort === 'popular' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPixelSort('popular')}
                        className="text-xs"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Populares
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pixels Grid/List */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                <AnimatePresence>
                  {filteredPixels.map((pixel, index) => (
                    <motion.div
                      key={pixel.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="relative">
                          <div 
                            className="aspect-square w-full flex items-center justify-center text-4xl font-bold"
                            style={{ backgroundColor: pixel.color }}
                          >
                            🎨
                          </div>
                          
                          <div className="absolute top-2 left-2 flex gap-1">
                            <Badge className={getRarityColor(pixel.rarity)}>
                              {pixel.rarity}
                            </Badge>
                            {pixel.isFavorite && (
                              <Badge className="bg-red-500">
                                <Heart className="h-3 w-3 fill-current" />
                              </Badge>
                            )}
                          </div>
                          
                          <div className="absolute top-2 right-2">
                            <Badge variant={pixel.isPublic ? 'default' : 'secondary'} className="text-xs">
                              {pixel.isPublic ? 'Público' : 'Privado'}
                            </Badge>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            €{pixel.price}
                          </div>
                        </div>
                        
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 truncate">{pixel.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {pixel.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-mono">({pixel.x}, {pixel.y})</span>
                            <span className="text-muted-foreground">{pixel.region}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {pixel.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {pixel.likes}
                              </span>
                            </div>
                            <span>{timeAgo(new Date(pixel.lastModified))}</span>
                          </div>
                          
                          <div className="flex gap-1 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePixelAction('favorite', pixel.id)}
                              className="flex-1 h-8"
                            >
                              <Heart className={`h-3 w-3 ${pixel.isFavorite ? 'fill-current text-red-500' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePixelAction('share', pixel.id)}
                              className="flex-1 h-8"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePixelAction('edit', pixel.id)}
                              className="flex-1 h-8"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredPixels.length === 0 && (
                          className="min-h-[32px] px-3"
                <Card className="p-8 text-center">
                  <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? `Nenhum pixel encontrado para "${searchQuery}"` : 'Nenhum pixel nesta categoria'}
                            className="min-h-[32px] px-3 text-xs"
                  </p>
                </Card>
              )}

              {/* Albums Section */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <BookImage className="h-5 w-5 mr-2 text-purple-500" />
                      Álbuns ({userAlbums.length})
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar
                            className="min-h-[32px] px-3 text-xs"
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userAlbums.map(album => (
                      <Card key={album.id} className="bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                            className="min-h-[32px] px-3 text-xs"
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                              <BookImage className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">{album.name}</h4>
                                <Badge variant={album.isPublic ? 'default' : 'secondary'} className="text-xs">
                                  {album.isPublic ? 'Público' : 'Privado'}
                            className="min-h-[32px] w-8 p-0"
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                                {album.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{album.pixelCount} pixels</span>
                            className="min-h-[32px] w-8 p-0"
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {album.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {album.likes}
                                </span>
                              </div>
                            </div>
                  <ScrollArea className="h-[60vh]">
                    <div className={cn(
                      "grid gap-4 pb-4",
                      pixelView === 'grid' ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                    )}>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-4 p-4">
              {/* Social Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-blue-500">{friends.length}</p>
                  <p className="text-xs text-muted-foreground">Amigos</p>
                </Card>
                
                <Card className="text-center p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                  <UserPlus className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-green-500">{followers.length}</p>
                  <p className="text-xs text-muted-foreground">Seguidores</p>
                </Card>
                
                <Card className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
                  <Heart className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-purple-500">{following.length}</p>
                  <p className="text-xs text-muted-foreground">A Seguir</p>
                </Card>
              </div>

              {/* Friends List */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-500" />
                      Conexões Sociais
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Convidar
                    </Button>
                  </div>
                                className="h-8 w-8 p-0 bg-black/60 hover:bg-black/80 text-white"
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="friends" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-9">
                      <TabsTrigger value="friends" className="text-xs">
                        Amigos ({friends.length})
                      </TabsTrigger>
                      <TabsTrigger value="followers" className="text-xs">
                        Seguidores ({followers.length})
                      </TabsTrigger>
                      <TabsTrigger value="following" className="text-xs">
                        A Seguir ({following.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="friends" className="mt-3">
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {friends.map(friend => (
                            <Card key={friend.id} className="bg-muted/20 hover:bg-muted/30 transition-colors">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="h-10 w-10 border-2 border-border">
                                      <AvatarImage src={friend.avatar} />
                                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                                      friend.isOnline ? 'bg-green-500' : 'bg-gray-500'
                                    }`} />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm truncate">{friend.name}</span>
                                      {friend.isVerified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                      {friend.isPremium && <Crown className="h-3 w-3 text-amber-500" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Badge variant="outline" className="text-xs">
                                        Nível {friend.level}
                                      </Badge>
                                      <span>{friend.pixelsOwned} pixels</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {friend.isOnline ? 'Online' : friend.lastSeen}
                                    </p>
                                  </div>
                                  
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleFriendAction('message', friend.id)}
                                      className="h-7 px-2"
                                    >
                                      <MessageSquare className="h-3 w-3" />
                                    </Button>
                    </div>
                  </ScrollArea>
                </div>
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleFriendAction('follow', friend.id)}
              <TabsContent value="social" className="space-y-6 pb-8 focus:outline-none">
                <div className="space-y-6">
                                    >
                                      <UserPlus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="followers" className="mt-3">
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {followers.map(follower => (
                            <Card key={follower.id} className="bg-muted/20">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={follower.avatar} />
                                      <AvatarFallback>{follower.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">{follower.name}</p>
                                      <p className="text-xs text-muted-foreground">Nível {follower.level}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                            className="flex-1 min-h-[32px] text-xs"
                                    onClick={() => handleFriendAction('follow', follower.id)}
                                    className="h-7 text-xs"
                                  >
                                    Seguir de Volta
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                      <ScrollArea className="h-64">
                        <div className="space-y-3 pr-2">
                    
                    <TabsContent value="following" className="mt-3">
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {following.map(followingUser => (
                            <Card key={followingUser.id} className="bg-muted/20">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={followingUser.avatar} />
                                      <AvatarFallback>{followingUser.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">{followingUser.name}</p>
                                      <p className="text-xs text-muted-foreground">Nível {followingUser.level}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFriendAction('unfollow', followingUser.id)}
                                    className="h-7 text-xs"
                                  >
                                    Deixar de Seguir
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                                  className="min-h-[32px] px-3 text-xs"
                    <LinkIcon className="h-5 w-5 mr-2 text-cyan-500" />
                    Redes Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { platform: 'Instagram', handle: editedProfile.socialLinks.instagram, icon: <Instagram className="h-4 w-4" />, color: 'text-pink-500' },
                                  className="min-h-[32px] px-3 text-xs"
                    { platform: 'Twitter', handle: editedProfile.socialLinks.twitter, icon: <Twitter className="h-4 w-4" />, color: 'text-blue-400' },
                    { platform: 'GitHub', handle: editedProfile.socialLinks.github, icon: <Github className="h-4 w-4" />, color: 'text-gray-500' },
                    { platform: 'YouTube', handle: editedProfile.socialLinks.youtube, icon: <Youtube className="h-4 w-4" />, color: 'text-red-500' }
                  ].map(social => (
                    <Button
                      key={social.platform}
                      variant="outline"
                        </div>
                      </ScrollArea>
                      onClick={() => window.open(`https://${social.platform.toLowerCase()}.com/${social.handle}`, '_blank')}
                    >
                </div>
                      <span className={social.color}>{social.icon}</span>
                      <span className="ml-3 font-semibold">{social.platform}:</span>
                      <span className="ml-2 text-muted-foreground font-code">{social.handle}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </Button>
                  ))}
                </CardContent>
          <DialogContent className="w-[95vw] h-[92vh] max-w-none max-h-none p-0 gap-0 rounded-2xl border-2 border-primary/30">
            </TabsContent>
          </Tabs>
        </Card>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  className="h-8 w-8"
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Edit3 className="h-5 w-5 mr-2" />
                    Editar Perfil
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                </CardTitle>
              </CardHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Nome de Exibição</Label>
                    <Input
                      value={editedProfile.displayName}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Seu nome público"
                    />
                  </div>
                          className="min-h-[44px]"
                  
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte sobre você..."
                      rows={3}
                      maxLength={200}
                    />
                          className="min-h-[88px] resize-none"
                    <p className="text-xs text-muted-foreground text-right">
                      {editedProfile.bio.length}/200
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <Input
                      value={editedProfile.location}
                          className="min-h-[44px]"
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Sua cidade"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={editedProfile.website}
                          className="min-h-[44px]"
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://seusite.com"
                    />
                </div>
                  </div>
                  
                  <Separator />
              <TabsContent value="pixels" className="space-y-6 pb-8 focus:outline-none">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Redes Sociais</Label>
                    {Object.entries(editedProfile.socialLinks).map(([platform, handle]) => (
                      <div key={platform} className="space-y-1">
                        <Label className="text-xs capitalize">{platform}</Label>
                        <Input
                          value={handle}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                          }))}
                          placeholder={`@seu${platform}`}
                          className="h-9"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                            className="min-h-[44px]"
                  <div className="space-y-3">
                    <Label>Configurações de Privacidade</Label>
                    {Object.entries(privacySettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm">
                          {key === 'profilePublic' && 'Perfil Público'}
                          {key === 'showPixelCount' && 'Mostrar Contagem de Pixels'}
                          {key === 'showAchievements' && 'Mostrar Conquistas'}
                          {key === 'showActivity' && 'Mostrar Atividade'}
                          {key === 'allowMessages' && 'Permitir Mensagens'}
                          {key === 'showOnlineStatus' && 'Mostrar Status Online'}
                        </Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setPrivacySettings(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                        <div key={setting.key} className="flex items-center justify-between py-2">
                </CardContent>
              </ScrollArea>
              
              <CardFooter className="flex gap-2 border-t pt-4">
                          <div className="ml-4">
                            <Switch
                  variant="outline" 
                  className="flex-1"
                              className="data-[state=checked]:bg-primary"
                  onClick={() => setIsEditing(false)}
                          </div>
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
              </div>
            </ScrollArea>
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                className="min-h-[44px] px-6"
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                className="min-h-[44px] px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      Salvar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}