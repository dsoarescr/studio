'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore, usePixelStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { User, Edit3, Camera, MapPin, Calendar, Clock, Star, Crown, Gem, Trophy, Award, Coins, Gift, Eye, Heart, MessageSquare, Share2, Settings, Bell, Lock, Globe, Mail, Phone, Link as LinkIcon, Plus, Minus, X, Check, Save, RefreshCw, Download, Upload, Palette, Brush, Sparkles, Zap, Target, Activity, BarChart3, TrendingUp, Users, BookImage, Image as ImageIcon, Video, Music, Headphones, Gamepad2, Coffee, Plane, Car, Home, Briefcase, GraduationCap, Heart as HeartIcon, Smile, Frown, ThumbsUp, MessageCircle, Send, Copy, ExternalLink, Trash2, Archive, Bookmark, Flag, Shield, AlertTriangle, Info, ChevronRight, ChevronDown, ChevronUp, MoreHorizontal, Filter, Search, SortAsc, Grid, List, Calendar as CalendarIcon, Clock as ClockIcon, Flame, CloudLightning as Lightning, Snowflake, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  createdAt: string;
  tags: string[];
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
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
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: string;
  unlockedAt: string;
  xpReward: number;
  creditsReward: number;
}

const mockUserPixels: UserPixel[] = [
  {
    id: '1',
    x: 579,
    y: 358,
    region: 'Lisboa',
    color: '#D4A757',
    title: 'Torre de Belém Digital',
    description: 'Representação pixel art da icónica Torre de Belém',
    price: 150,
    views: 1234,
    likes: 89,
    comments: 23,
    isPublic: true,
    createdAt: '2024-03-15',
    tags: ['lisboa', 'monumento', 'história'],
    rarity: 'Épico'
  },
  {
    id: '2',
    x: 640,
    y: 260,
    region: 'Porto',
    color: '#7DF9FF',
    title: 'Ponte Dom Luís I',
    description: 'Vista artística da famosa ponte do Porto',
    price: 120,
    views: 856,
    likes: 67,
    comments: 15,
    isPublic: true,
    createdAt: '2024-03-10',
    tags: ['porto', 'ponte', 'arquitetura'],
    rarity: 'Raro'
  },
  {
    id: '3',
    x: 706,
    y: 962,
    region: 'Algarve',
    color: '#FF6B6B',
    title: 'Pôr do Sol Algarvio',
    description: 'Cores quentes do pôr do sol no Algarve',
    price: 95,
    views: 567,
    likes: 45,
    comments: 8,
    isPublic: false,
    createdAt: '2024-03-08',
    tags: ['algarve', 'pôr-do-sol', 'natureza'],
    rarity: 'Incomum'
  }
];

const mockUserAlbums: UserAlbum[] = [
  {
    id: '1',
    name: 'Monumentos de Portugal',
    description: 'Coleção dos principais monumentos portugueses em pixel art',
    coverUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Monumentos',
    pixelCount: 12,
    views: 2340,
    likes: 156,
    isPublic: true,
    createdAt: '2024-03-01',
    tags: ['monumentos', 'história', 'portugal']
  },
  {
    id: '2',
    name: 'Paisagens Naturais',
    description: 'A beleza natural de Portugal capturada em pixels',
    coverUrl: 'https://placehold.co/200x200/4CAF50/FFFFFF?text=Natureza',
    pixelCount: 8,
    views: 1890,
    likes: 134,
    isPublic: true,
    createdAt: '2024-02-20',
    tags: ['natureza', 'paisagem', 'verde']
  }
];

const mockUserAchievements: UserAchievement[] = [
  {
    id: '1',
    name: 'Primeiro Pixel',
    description: 'Comprou o seu primeiro pixel',
    icon: <MapPin className="h-6 w-6" />,
    rarity: 'Comum',
    unlockedAt: '2024-01-15',
    xpReward: 50,
    creditsReward: 10
  },
  {
    id: '2',
    name: 'Artista Emergente',
    description: 'Criou 10 pixels únicos',
    icon: <Palette className="h-6 w-6" />,
    rarity: 'Incomum',
    unlockedAt: '2024-02-01',
    xpReward: 100,
    creditsReward: 25
  },
  {
    id: '3',
    name: 'Explorador de Lisboa',
    description: 'Possui 5 pixels em Lisboa',
    icon: <Crown className="h-6 w-6" />,
    rarity: 'Raro',
    unlockedAt: '2024-03-01',
    xpReward: 200,
    creditsReward: 50
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
    addCredits,
    addXp,
    addPixel
  } = useUserStore();
  
  const { soldPixels } = usePixelStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'price'>('recent');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Profile data
  const [profileData, setProfileData] = useState({
    displayName: 'PixelMasterPT',
    bio: 'Artista digital apaixonado por pixel art e pela cultura portuguesa. Criando arte única no Pixel Universe! 🎨🇵🇹',
    location: 'Lisboa, Portugal',
    website: 'https://pixelmaster.pt',
    twitter: '@pixelmaster_pt',
    instagram: '@pixelmaster.pt',
    isPublic: true,
    showEmail: false,
    showStats: true,
    allowComments: true,
    allowMessages: true
  });

  // Filtered data
  const [userPixels, setUserPixels] = useState<UserPixel[]>(mockUserPixels);
  const [userAlbums, setUserAlbums] = useState<UserAlbum[]>(mockUserAlbums);
  const [userAchievements] = useState<UserAchievement[]>(mockUserAchievements);

  // Statistics
  const totalViews = userPixels.reduce((sum, pixel) => sum + pixel.views, 0);
  const totalLikes = userPixels.reduce((sum, pixel) => sum + pixel.likes, 0);
  const totalComments = userPixels.reduce((sum, pixel) => sum + pixel.comments, 0);
  const averagePrice = userPixels.length > 0 ? userPixels.reduce((sum, pixel) => sum + pixel.price, 0) / userPixels.length : 0;
  const mostExpensivePixel = userPixels.reduce((max, pixel) => pixel.price > max.price ? pixel : max, userPixels[0] || { price: 0 });
  const xpPercentage = xpMax > 0 ? (xp / xpMax) * 100 : 0;

  // Filter pixels
  const filteredPixels = userPixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = filterTag === 'all' || pixel.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.views) - (a.likes + a.views);
      case 'price':
        return b.price - a.price;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Get unique tags
  const allTags = Array.from(new Set(userPixels.flatMap(pixel => pixel.tags)));

  // Handlers
  const handleSaveProfile = () => {
    vibrate('success');
    setPlaySound(true);
    setShowConfetti(true);
    addXp(25);
    addCredits(10);
    
    toast({
      title: "✅ Perfil Atualizado!",
      description: "As suas alterações foram guardadas. +25 XP, +10 créditos!",
    });
    
    setIsEditing(false);
  };

  const handleClaimDailyBonus = () => {
    vibrate('success');
    setPlaySound(true);
    setShowConfetti(true);
    
    const bonusCredits = level * 10;
    const bonusXp = level * 5;
    
    addCredits(bonusCredits);
    addXp(bonusXp);
    
    toast({
      title: "🎁 Bónus Diário Reclamado!",
      description: `+${bonusCredits} créditos, +${bonusXp} XP (Nível ${level})`,
    });
  };

  const handleShareProfile = async () => {
    vibrate('light');
    
    const shareData = {
      title: `Perfil de ${profileData.displayName} - Pixel Universe`,
      text: `Confira o perfil incrível de ${profileData.displayName} no Pixel Universe!`,
      url: `${window.location.origin}/member/${profileData.displayName.toLowerCase()}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addXp(15);
        addCredits(5);
        toast({
          title: "📤 Perfil Partilhado!",
          description: "Recebeu 15 XP + 5 créditos!",
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "🔗 Link Copiado!",
        description: "Link do perfil copiado para a área de transferência.",
      });
    }
  };

  const handleLikePixel = (pixelId: string) => {
    vibrate('light');
    setUserPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, likes: pixel.likes + 1 }
        : pixel
    ));
    
    toast({
      title: "❤️ Pixel Curtido!",
      description: "Adicionado aos seus favoritos.",
    });
  };

  const handleDeletePixel = (pixelId: string) => {
    vibrate('warning');
    setUserPixels(prev => prev.filter(pixel => pixel.id !== pixelId));
    
    toast({
      title: "🗑️ Pixel Eliminado",
      description: "O pixel foi removido da sua coleção.",
      variant: "destructive"
    });
  };

  const handleTogglePixelVisibility = (pixelId: string) => {
    vibrate('medium');
    setUserPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { ...pixel, isPublic: !pixel.isPublic }
        : pixel
    ));
    
    const pixel = userPixels.find(p => p.id === pixelId);
    toast({
      title: pixel?.isPublic ? "🔒 Pixel Privado" : "🌍 Pixel Público",
      description: pixel?.isPublic ? "Agora apenas você pode ver este pixel." : "Agora todos podem ver este pixel.",
    });
  };

  const handleCreateAlbum = () => {
    vibrate('success');
    setPlaySound(true);
    
    const newAlbum: UserAlbum = {
      id: Date.now().toString(),
      name: 'Novo Álbum',
      description: 'Descrição do álbum...',
      coverUrl: 'https://placehold.co/200x200/9C27B0/FFFFFF?text=Novo',
      pixelCount: 0,
      views: 0,
      likes: 0,
      isPublic: true,
      createdAt: new Date().toISOString().split('T')[0],
      tags: []
    };
    
    setUserAlbums(prev => [newAlbum, ...prev]);
    addXp(50);
    addCredits(20);
    
    toast({
      title: "📚 Álbum Criado!",
      description: "Novo álbum adicionado. +50 XP, +20 créditos!",
    });
  };

  const handleDeleteAlbum = (albumId: string) => {
    vibrate('warning');
    setUserAlbums(prev => prev.filter(album => album.id !== albumId));
    
    toast({
      title: "🗑️ Álbum Eliminado",
      description: "O álbum foi removido da sua coleção.",
      variant: "destructive"
    });
  };

  const handleViewAlbum = (albumId: string) => {
    vibrate('light');
    toast({
      title: "📚 Visualizar Álbum",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const handleLikeAlbum = (albumId: string) => {
    vibrate('light');
    setUserAlbums(prev => prev.map(album => 
      album.id === albumId 
        ? { ...album, likes: album.likes + 1 }
        : album
    ));
    
    toast({
      title: "❤️ Álbum Curtido!",
      description: "Adicionado aos seus favoritos.",
    });
  };

  const handleToggleAlbumVisibility = (albumId: string) => {
    vibrate('medium');
    setUserAlbums(prev => prev.map(album => 
      album.id === albumId 
        ? { ...album, isPublic: !album.isPublic }
        : album
    ));
    
    const album = userAlbums.find(a => a.id === albumId);
    toast({
      title: album?.isPublic ? "🔒 Álbum Privado" : "🌍 Álbum Público",
      description: album?.isPublic ? "Agora apenas você pode ver este álbum." : "Agora todos podem ver este álbum.",
    });
  };

  const handleShareAlbum = (album: UserAlbum) => {
    vibrate('light');
    navigator.clipboard.writeText(`${window.location.origin}/album/${album.id}`);
    toast({
      title: "🔗 Link Copiado!",
      description: "Link do álbum copiado.",
    });
  };

  const handleClaimAchievement = (achievementId: string) => {
    vibrate('success');
    setPlaySound(true);
    setShowConfetti(true);
    
    const achievement = userAchievements.find(a => a.id === achievementId);
    if (achievement) {
      addXp(achievement.xpReward);
      addCredits(achievement.creditsReward);
      
      toast({
        title: "🏆 Recompensa Reclamada!",
        description: `${achievement.name}: +${achievement.xpReward} XP, +${achievement.creditsReward} créditos!`,
      });
    }
  };

  const handleExportData = () => {
    vibrate('medium');
    
    const exportData = {
      profile: profileData,
      pixels: userPixels,
      albums: userAlbums,
      achievements: userAchievements,
      stats: { totalViews, totalLikes, totalComments, averagePrice }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-universe-profile-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addXp(30);
    addCredits(15);
    
    toast({
      title: "📥 Dados Exportados!",
      description: "Perfil exportado com sucesso. +30 XP, +15 créditos!",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-20">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto px-3 py-4 space-y-4 max-w-md">
        {/* Profile Header - Mobile Optimized */}
        <Card className="shadow-xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          
          <CardContent className="relative p-4 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary shadow-lg mx-auto">
                <AvatarImage 
                  src={user?.photoURL || 'https://placehold.co/96x96.png'} 
                  alt={profileData.displayName} 
                />
                <AvatarFallback className="text-2xl font-headline">
                  {profileData.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-primary"
                onClick={() => {
                  vibrate('light');
                  toast({
                    title: "📷 Alterar Avatar",
                    description: "Funcionalidade em desenvolvimento.",
                  });
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
              
              {/* Status Badges */}
              <div className="absolute -top-2 -left-2 flex flex-col gap-1">
                <Badge className="bg-amber-500 text-xs px-2 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
                <Badge className="bg-blue-500 text-xs px-2 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-headline font-bold text-gradient-gold">
                {profileData.displayName}
              </h1>
              <p className="text-sm text-muted-foreground">@{profileData.displayName.toLowerCase()}</p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{profileData.location}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>Membro desde Jan 2024</span>
              </div>
              
              <Badge variant="secondary" className="font-code">
                Nível {level}
              </Badge>
            </div>

            {/* XP Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progresso XP</span>
                <span className="font-code">{xp.toLocaleString()}/{xpMax.toLocaleString()}</span>
              </div>
              <Progress value={xpPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {xpMax - xp > 0 ? `${(xpMax - xp).toLocaleString()} XP para o próximo nível` : 'Nível máximo!'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleShareProfile}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partilhar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center hover:shadow-lg transition-shadow">
            <Coins className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold">{credits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Créditos</p>
          </Card>
          
          <Card className="p-3 text-center hover:shadow-lg transition-shadow">
            <Gift className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-lg font-bold">{specialCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Especiais</p>
          </Card>
        </div>

        {/* Daily Bonus */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-full">
                  <Gift className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Bónus Diário</h3>
                  <p className="text-sm text-muted-foreground">
                    +{level * 10} créditos, +{level * 5} XP
                  </p>
                </div>
              </div>
              <Button onClick={handleClaimDailyBonus}>
                Reclamar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Edit3 className="h-5 w-5 mr-2" />
                    Editar Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nome de Exibição</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Seu nome público"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte-nos sobre você..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Cidade, País"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://seusite.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={profileData.instagram}
                        onChange={(e) => setProfileData(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Privacidade</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isPublic">Perfil Público</Label>
                        <Switch
                          id="isPublic"
                          checked={profileData.isPublic}
                          onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, isPublic: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showStats">Mostrar Estatísticas</Label>
                        <Switch
                          id="showStats"
                          checked={profileData.showStats}
                          onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, showStats: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowComments">Permitir Comentários</Label>
                        <Switch
                          id="allowComments"
                          checked={profileData.allowComments}
                          onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, allowComments: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleSaveProfile}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bio Card */}
        {!isEditing && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground italic text-center leading-relaxed">
                "{profileData.bio}"
              </p>
              
              {/* Social Links */}
              {(profileData.website || profileData.twitter || profileData.instagram) && (
                <div className="flex justify-center gap-2 mt-4">
                  {profileData.website && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(profileData.website, '_blank')}
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                  {profileData.twitter && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(`https://twitter.com/${profileData.twitter.replace('@', '')}`, '_blank')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                  {profileData.instagram && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(`https://instagram.com/${profileData.instagram.replace('@', '')}`, '_blank')}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-3 text-center">
            <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">{pixels}</p>
            <p className="text-xs text-muted-foreground">Pixels</p>
          </Card>
          
          <Card className="p-3 text-center">
            <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{achievements}</p>
            <p className="text-xs text-muted-foreground">Conquistas</p>
          </Card>
          
          <Card className="p-3 text-center">
            <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </Card>
          
          <Card className="p-3 text-center">
            <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{totalLikes}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              Visão
            </TabsTrigger>
            <TabsTrigger value="pixels" className="text-xs">
              <Palette className="h-4 w-4 mr-1" />
              Pixels
            </TabsTrigger>
            <TabsTrigger value="albums" className="text-xs">
              <BookImage className="h-4 w-4 mr-1" />
              Álbuns
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">
              <Trophy className="h-4 w-4 mr-1" />
              Prémios
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Detailed Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Estatísticas Detalhadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-xl font-bold text-primary">€{averagePrice.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Preço Médio</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-xl font-bold text-accent">€{mostExpensivePixel?.price || 0}</p>
                    <p className="text-xs text-muted-foreground">Mais Caro</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Distribuição por Região</h4>
                  {['Lisboa', 'Porto', 'Algarve'].map(region => {
                    const regionPixels = userPixels.filter(p => p.region === region).length;
                    const percentage = userPixels.length > 0 ? (regionPixels / userPixels.length) * 100 : 0;
                    
                    return (
                      <div key={region} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{region}</span>
                          <span className="font-medium">{regionPixels} pixels</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="h-16 flex flex-col gap-1"
                onClick={handleExportData}
              >
                <Download className="h-5 w-5" />
                <span className="text-xs">Exportar Dados</span>
              </Button>
              
              <Link href="/settings">
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col gap-1 w-full"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Configurações</span>
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Pixels Tab */}
          <TabsContent value="pixels" className="space-y-4">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar pixels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={filterTag === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterTag('all')}
                    className="whitespace-nowrap"
                  >
                    Todos
                  </Button>
                  {allTags.slice(0, 4).map(tag => (
                    <Button
                      key={tag}
                      variant={filterTag === tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterTag(tag)}
                      className="whitespace-nowrap text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="popular">Mais Populares</option>
                    <option value="price">Maior Preço</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Pixels Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
              {filteredPixels.map(pixel => (
                <Card key={pixel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div 
                      className="h-24 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: pixel.color }}
                    >
                      🎨
                    </div>
                    
                    <Badge className={`absolute top-2 left-2 text-xs ${getRarityColor(pixel.rarity)}`}>
                      {pixel.rarity}
                    </Badge>
                    
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 bg-black/50 text-white hover:bg-black/70"
                        onClick={() => handleTogglePixelVisibility(pixel.id)}
                      >
                        {pixel.isPublic ? <Eye className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 bg-black/50 text-white hover:bg-black/70"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Ações do Pixel</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/pixel/${pixel.x}-${pixel.y}`);
                                toast({
                                  title: "🔗 Link Copiado!",
                                  description: "Link do pixel copiado.",
                                });
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar Link
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleLikePixel(pixel.id)}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Adicionar aos Favoritos
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="w-full justify-start"
                              onClick={() => handleDeletePixel(pixel.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Pixel
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{pixel.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{pixel.description}</p>
                    
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-medium text-primary">€{pixel.price}</span>
                      <span className="text-muted-foreground">({pixel.x}, {pixel.y})</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {pixel.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {pixel.likes}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{formatDate(pixel.createdAt)}</span>
                    </div>
                    
                    {pixel.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pixel.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPixels.length === 0 && (
              <Card className="p-8 text-center">
                <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Nenhum pixel encontrado.' : 'Ainda não possui pixels.'}
                </p>
                <Link href="/">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Comprar Primeiro Pixel
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Meus Álbuns ({userAlbums.length})</h3>
              <Button 
                size="sm"
                onClick={handleCreateAlbum}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar
              </Button>
            </div>

            <div className="space-y-3">
              {userAlbums.map(album => (
                <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <img 
                      src={album.coverUrl} 
                      alt={album.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-1">{album.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{album.description}</p>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Ações do Álbum</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => {
                                  toast({
                                    title: "📝 Editar Álbum",
                                    description: "Funcionalidade em desenvolvimento.",
                                  });
                                }}
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Editar Álbum
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/album/${album.id}`);
                                  toast({
                                    title: "🔗 Link Copiado!",
                                    description: "Link do álbum copiado.",
                                  });
                                }}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Partilhar Álbum
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="w-full justify-start"
                                onClick={() => handleDeleteAlbum(album.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar Álbum
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-2">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {album.pixelCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {album.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {album.likes}
                          </span>
                        </div>
                        <Badge variant={album.isPublic ? 'default' : 'secondary'} className="text-xs">
                          {album.isPublic ? 'Público' : 'Privado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {userAlbums.length === 0 && (
              <Card className="p-8 text-center">
                <BookImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Ainda não criou álbuns.</p>
                <Button onClick={handleCreateAlbum}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Álbum
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold">Conquistas Desbloqueadas</h3>
              <p className="text-sm text-muted-foreground">{userAchievements.length} de 50 conquistas</p>
              <Progress value={(userAchievements.length / 50) * 100} className="mt-2" />
            </div>

            <div className="space-y-3">
              {userAchievements.map(achievement => (
                <Card key={achievement.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{achievement.name}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-primary" />
                              +{achievement.xpReward} XP
                            </span>
                            <span className="flex items-center gap-1">
                              <Coins className="h-3 w-3 text-accent" />
                              +{achievement.creditsReward}
                            </span>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleClaimAchievement(achievement.id)}
                            >
                              <Gift className="h-3 w-3 mr-1" />
                              Reclamar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                navigator.clipboard.writeText(`Desbloqueei "${achievement.name}" no Pixel Universe! 🏆`);
                                toast({
                                  title: "📋 Conquista Copiada!",
                                  description: "Texto copiado para partilhar.",
                                });
                              }}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Desbloqueada em {formatDate(achievement.unlockedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Próximas Conquistas</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue explorando para desbloquear mais conquistas!
                </p>
                <Link href="/achievements">
                  <Button>
                    <Target className="h-4 w-4 mr-2" />
                    Ver Todas as Conquistas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Navigation */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-center">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/marketplace">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Comprar Pixels</span>
                </Button>
              </Link>
              
              <Link href="/credits">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
                  <Coins className="h-5 w-5" />
                  <span className="text-xs">Comprar Créditos</span>
                </Button>
              </Link>
              
              <Link href="/premium">
                <Button className="w-full h-16 flex flex-col gap-1 bg-gradient-to-r from-amber-500 to-orange-500">
                  <Crown className="h-5 w-5" />
                  <span className="text-xs">Upgrade Premium</span>
                </Button>
              </Link>
              
              <Link href="/community">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Comunidade</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Card className="bg-muted/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Membro desde Janeiro 2024</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>ID: {user?.uid?.substring(0, 8) || 'xxxxxxxx'}</span>
              <span>•</span>
              <span>Última atividade: Agora</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}