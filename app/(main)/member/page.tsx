'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore, usePixelStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Edit3, Camera, MapPin, Trophy, Star, Crown, Gem, Sparkles, 
  Calendar, Clock, Eye, Heart, MessageSquare, Share2, Settings, 
  Coins, Gift, Zap, Target, Award, Palette, Users, Globe, Link as LinkIcon,
  Download, Upload, Save, RefreshCw, Plus, Minus, X, Check, 
  BarChart3, TrendingUp, Activity, Flame, Shield, Lock, Unlock,
  BookImage, FolderPlus, Image as ImageIcon, Video, Music, Headphones,
  Instagram, Twitter, Github, Linkedin, Facebook, Youtube, Twitch,
  Mail, Phone, MapPinIcon, Home, Briefcase, GraduationCap, Coffee,
  Gamepad2, Brush, Code, Mountain, Waves, Sun, Moon, Snowflake,
  ChevronRight, ChevronLeft, MoreHorizontal, Filter, Search, SortAsc,
  Bell, BellOff, Volume2, VolumeX, Smartphone, Monitor, Tablet,
  Wifi, Signal, Battery, Bluetooth, Usb, HardDrive, Cpu, MemoryStick
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { achievementsData } from '@/data/achievements-data';

interface UserStats {
  totalPixels: number;
  totalSpent: number;
  totalEarned: number;
  averagePixelValue: number;
  mostExpensivePixel: number;
  favoriteRegion: string;
  favoriteColor: string;
  creationStreak: number;
  lastActive: string;
  joinDate: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  rankPosition: number;
  rankChange: number;
}

interface PixelArt {
  id: string;
  title: string;
  description: string;
  coordinates: { x: number; y: number };
  region: string;
  color: string;
  imageUrl: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  isPublic: boolean;
  tags: string[];
  rarity: string;
  price: number;
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  pixelCount: number;
  isPublic: boolean;
  createdAt: string;
  views: number;
  likes: number;
  tags: string[];
}

interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
  verified: boolean;
}

interface Activity {
  id: string;
  type: 'purchase' | 'edit' | 'achievement' | 'social' | 'system';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
  metadata?: any;
}

const mockUserStats: UserStats = {
  totalPixels: 42,
  totalSpent: 1250,
  totalEarned: 890,
  averagePixelValue: 29.76,
  mostExpensivePixel: 150,
  favoriteRegion: 'Lisboa',
  favoriteColor: '#D4A757',
  creationStreak: 15,
  lastActive: '2 minutos atrás',
  joinDate: '2024-01-15',
  totalViews: 12450,
  totalLikes: 2340,
  totalComments: 456,
  totalShares: 123,
  rankPosition: 47,
  rankChange: 3
};

const mockPixelArts: PixelArt[] = [
  {
    id: '1',
    title: 'Pôr do Sol em Lisboa',
    description: 'Uma vista deslumbrante do Tejo ao entardecer',
    coordinates: { x: 245, y: 156 },
    region: 'Lisboa',
    color: '#FF6B47',
    imageUrl: 'https://placehold.co/200x200/FF6B47/FFFFFF?text=Lisboa+Sunset',
    createdAt: '2024-03-15',
    views: 1234,
    likes: 89,
    comments: 23,
    isPublic: true,
    tags: ['lisboa', 'pôr-do-sol', 'tejo'],
    rarity: 'Épico',
    price: 150
  },
  {
    id: '2',
    title: 'Arte Urbana do Porto',
    description: 'Inspirado na street art da Rua Miguel Bombarda',
    coordinates: { x: 123, y: 89 },
    region: 'Porto',
    color: '#7DF9FF',
    imageUrl: 'https://placehold.co/200x200/7DF9FF/000000?text=Porto+Street',
    createdAt: '2024-03-10',
    views: 567,
    likes: 45,
    comments: 12,
    isPublic: true,
    tags: ['porto', 'street-art', 'urbano'],
    rarity: 'Raro',
    price: 75
  }
];

const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Paisagens de Portugal',
    description: 'Uma coleção das mais belas paisagens portuguesas em pixel art',
    coverImageUrl: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Paisagens+PT',
    pixelCount: 15,
    isPublic: true,
    createdAt: '2024-03-01',
    views: 2340,
    likes: 156,
    tags: ['paisagem', 'portugal', 'natureza']
  },
  {
    id: '2',
    name: 'Cidades Históricas',
    description: 'Centros históricos das principais cidades portuguesas',
    coverImageUrl: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Cidades+Históricas',
    pixelCount: 8,
    isPublic: false,
    createdAt: '2024-02-20',
    views: 890,
    likes: 67,
    tags: ['história', 'cidades', 'património']
  }
];

const mockSocialLinks: SocialLink[] = [
  {
    platform: 'Instagram',
    handle: '@pixelmaster_pt',
    url: 'https://instagram.com/pixelmaster_pt',
    icon: <Instagram className="h-4 w-4" />,
    verified: true
  },
  {
    platform: 'Twitter',
    handle: '@pixelmaster',
    url: 'https://twitter.com/pixelmaster',
    icon: <Twitter className="h-4 w-4" />,
    verified: false
  },
  {
    platform: 'GitHub',
    handle: 'pixelmaster',
    url: 'https://github.com/pixelmaster',
    icon: <Github className="h-4 w-4" />,
    verified: true
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'purchase',
    title: 'Pixel Comprado',
    description: 'Adquiriu pixel em Lisboa (245, 156) por €150',
    timestamp: '2 horas atrás',
    icon: <MapPin className="h-4 w-4" />,
    color: 'text-green-500',
    metadata: { coordinates: { x: 245, y: 156 }, price: 150 }
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Conquista Desbloqueada',
    description: 'Desbloqueou "Mestre das Cores" - Nível 2',
    timestamp: '1 dia atrás',
    icon: <Trophy className="h-4 w-4" />,
    color: 'text-yellow-500',
    metadata: { achievement: 'color_master', level: 2 }
  },
  {
    id: '3',
    type: 'social',
    title: 'Novo Seguidor',
    description: 'PixelArtist123 começou a seguir-te',
    timestamp: '2 dias atrás',
    icon: <Users className="h-4 w-4" />,
    color: 'text-blue-500',
    metadata: { follower: 'PixelArtist123' }
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
    isPremium, 
    isVerified,
    addCredits,
    addXp,
    addPixel
  } = useUserStore();
  
  const { soldPixels } = usePixelStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userStats] = useState<UserStats>(mockUserStats);
  const [pixelArts] = useState<PixelArt[]>(mockPixelArts);
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(mockSocialLinks);
  const [activities] = useState<Activity[]>(mockActivities);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    displayName: 'PixelMasterPT',
    bio: 'Artista digital apaixonado por pixel art e pela beleza de Portugal. Criando arte única pixel a pixel! 🎨🇵🇹',
    location: 'Lisboa, Portugal',
    website: 'https://pixelmaster.pt',
    birthDate: '1995-06-15',
    occupation: 'Designer Digital',
    interests: ['Pixel Art', 'Fotografia', 'Viagens', 'História']
  });
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showLocation: true,
    showStats: true,
    showActivity: true,
    allowMessages: true,
    showOnlineStatus: true
  });
  const [notificationSettings, setNotificationSettings] = useState({
    newFollowers: true,
    pixelLikes: true,
    comments: true,
    achievements: true,
    systemUpdates: false
  });

  const xpPercentage = (xp / xpMax) * 100;
  const unlockedAchievements = achievementsData.filter(ach => 
    ach.tiers.some(tier => tier.isUnlocked)
  );

  const handleSaveProfile = () => {
    setIsEditing(false);
    setShowConfetti(true);
    setPlaySound(true);
    addXp(25);
    addCredits(10);
    
    toast({
      title: "Perfil Atualizado! ✨",
      description: "As suas alterações foram guardadas. Recebeu 25 XP + 10 créditos!",
    });
  };

  const handleShareProfile = async () => {
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
          description: "Recebeu 15 XP + 5 créditos por partilhar!",
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

  const handleCreateAlbum = () => {
    const newAlbum: Album = {
      id: Date.now().toString(),
      name: 'Novo Álbum',
      description: 'Descrição do álbum...',
      coverImageUrl: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Novo+Álbum',
      pixelCount: 0,
      isPublic: true,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      tags: []
    };
    
    setAlbums(prev => [newAlbum, ...prev]);
    addXp(20);
    addCredits(8);
    
    toast({
      title: "📚 Álbum Criado!",
      description: "Novo álbum criado com sucesso. Recebeu 20 XP + 8 créditos!",
    });
  };

  const handleFollowUser = () => {
    setShowConfetti(true);
    setPlaySound(true);
    addXp(30);
    addCredits(15);
    
    toast({
      title: "👥 Novo Seguidor!",
      description: "Alguém começou a seguir-te. Recebeu 30 XP + 15 créditos!",
    });
  };

  const handleClaimDailyReward = () => {
    setShowConfetti(true);
    setPlaySound(true);
    addCredits(userStats.creationStreak * 10);
    addXp(userStats.creationStreak * 5);
    
    toast({
      title: "🎁 Recompensa Diária!",
      description: `Sequência de ${userStats.creationStreak} dias! Recebeu ${userStats.creationStreak * 10} créditos + ${userStats.creationStreak * 5} XP!`,
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <MapPin className="h-4 w-4" />;
      case 'edit': return <Edit3 className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl mb-16">
        {/* Enhanced Profile Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          
          <CardContent className="relative p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage 
                      src={user?.photoURL || 'https://placehold.co/128x128.png'} 
                      alt={profileData.displayName}
                      data-ai-hint="profile avatar"
                    />
                    <AvatarFallback className="text-4xl font-headline bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profileData.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Button 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                    onClick={() => setIsEditing(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  
                  {/* Status Indicators */}
                  <div className="absolute -top-2 -left-2 flex flex-col gap-1">
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {isVerified && (
                      <Badge className="bg-blue-500">
                        <Shield className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                    {userStats.rankPosition <= 10 && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Star className="h-3 w-3 mr-1" />
                        Top {userStats.rankPosition}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-center lg:text-left mt-4">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <h1 className="text-3xl font-headline font-bold text-gradient-gold">
                      {profileData.displayName}
                    </h1>
                    {userStats.rankChange > 0 && (
                      <Badge className="bg-green-500 animate-bounce">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{userStats.rankChange}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 justify-center lg:justify-start mt-2">
                    <Badge variant="secondary" className="font-code">
                      Nível {level}
                    </Badge>
                    <Badge variant="outline" className="font-code">
                      #{userStats.rankPosition} Global
                    </Badge>
                    {userStats.creationStreak > 0 && (
                      <Badge className="bg-orange-500">
                        <Flame className="h-3 w-3 mr-1" />
                        {userStats.creationStreak} dias
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 justify-center lg:justify-start">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{profileData.location}</span>
                    <span>•</span>
                    <Calendar className="h-4 w-4" />
                    <span>Desde {userStats.joinDate}</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center p-4 bg-primary/10 border-primary/30 hover:shadow-lg transition-shadow">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{pixels}</p>
                  <p className="text-xs text-muted-foreground">Pixels Possuídos</p>
                </Card>
                
                <Card className="text-center p-4 bg-accent/10 border-accent/30 hover:shadow-lg transition-shadow">
                  <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-accent">{achievements}</p>
                  <p className="text-xs text-muted-foreground">Conquistas</p>
                </Card>
                
                <Card className="text-center p-4 bg-green-500/10 border-green-500/30 hover:shadow-lg transition-shadow">
                  <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{userStats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Visualizações</p>
                </Card>
                
                <Card className="text-center p-4 bg-red-500/10 border-red-500/30 hover:shadow-lg transition-shadow">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">{userStats.totalLikes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Curtidas</p>
                </Card>
              </div>
            </div>
            
            {/* Bio and Actions */}
            <div className="mt-6 space-y-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-foreground italic text-center lg:text-left leading-relaxed">
                  "{profileData.bio}"
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button onClick={handleShareProfile} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar Perfil
                </Button>
                
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                
                <Button variant="outline" onClick={handleClaimDailyReward}>
                  <Gift className="h-4 w-4 mr-2" />
                  Recompensa Diária
                </Button>
                
                {socialLinks.length > 0 && (
                  <div className="flex gap-2">
                    {socialLinks.slice(0, 3).map(social => (
                      <Button 
                        key={social.platform}
                        variant="outline" 
                        size="icon"
                        asChild
                        className="hover:scale-110 transition-transform"
                      >
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                          {social.icon}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* XP Progress */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progresso para Nível {level + 1}</span>
                <span className="font-code text-primary">{xp.toLocaleString()} / {xpMax.toLocaleString()} XP</span>
              </div>
              <div className="relative">
                <Progress value={xpPercentage} className="h-4 shadow-inner" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-shimmer" 
                     style={{ backgroundSize: '200% 100%' }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                Faltam {(xpMax - xp).toLocaleString()} XP para o próximo nível
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="overview" className="font-headline">
              <User className="h-4 w-4 mr-2"/>
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="gallery" className="font-headline">
              <Palette className="h-4 w-4 mr-2"/>
              Galeria
            </TabsTrigger>
            <TabsTrigger value="albums" className="font-headline">
              <BookImage className="h-4 w-4 mr-2"/>
              Álbuns
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-headline">
              <Trophy className="h-4 w-4 mr-2"/>
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="stats" className="font-headline">
              <BarChart3 className="h-4 w-4 mr-2"/>
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-headline">
              <Settings className="h-4 w-4 mr-2"/>
              Definições
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Activity className="h-5 w-5 mr-2" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {activities.map(activity => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
                        >
                          <div className={`p-2 rounded-full bg-background/50 ${activity.color}`}>
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="card-hover-glow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-primary">
                      <Coins className="h-5 w-5 mr-2" />
                      Carteira Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <Coins className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-xl font-bold text-primary">{credits.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Créditos</p>
                      </div>
                      <div className="text-center p-3 bg-accent/10 rounded-lg">
                        <Gift className="h-6 w-6 text-accent mx-auto mb-2" />
                        <p className="text-xl font-bold text-accent">{specialCredits.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Especiais</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Gasto:</span>
                        <span className="font-bold text-red-500">€{userStats.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Ganho:</span>
                        <span className="font-bold text-green-500">€{userStats.totalEarned.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lucro Líquido:</span>
                        <span className={`font-bold ${userStats.totalEarned - userStats.totalSpent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          €{(userStats.totalEarned - userStats.totalSpent).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover-glow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-primary">
                      <Flame className="h-5 w-5 mr-2" />
                      Sequência Ativa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-orange-500 mb-2">
                      {userStats.creationStreak}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Dias consecutivos</p>
                    <Button 
                      onClick={handleClaimDailyReward}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Reclamar Bónus
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Galeria de Pixel Art</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Ordenar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pixelArts.map(art => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={art.imageUrl} 
                        alt={art.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className={getRarityColor(art.rarity)}>
                          {art.rarity}
                        </Badge>
                        {art.isPublic ? (
                          <Badge className="bg-green-500">
                            <Eye className="h-3 w-3 mr-1" />
                            Público
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Privado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="icon" className="bg-black/50 text-white hover:bg-black/70">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {art.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {art.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {art.comments}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-white border-white/50">
                            €{art.price}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{art.title}</h3>
                          <p className="text-sm text-muted-foreground">{art.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>({art.coordinates.x}, {art.coordinates.y})</span>
                            <span>•</span>
                            <span>{art.region}</span>
                          </div>
                          <span className="text-muted-foreground">{art.createdAt}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {art.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Share2 className="h-4 w-4 mr-2" />
                            Partilhar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Álbuns de Pixel Art</h2>
              <Button onClick={handleCreateAlbum} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <FolderPlus className="h-4 w-4 mr-2" />
                Criar Álbum
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map(album => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={album.coverImageUrl} 
                        alt={album.name}
                        className="w-full h-40 object-cover"
                      />
                      
                      <div className="absolute top-2 left-2">
                        <Badge className={album.isPublic ? 'bg-green-500' : 'bg-gray-500'}>
                          {album.isPublic ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Público
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Privado
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {album.pixelCount} pixels
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold">{album.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {album.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {album.likes}
                            </span>
                          </div>
                          <span className="text-muted-foreground">{album.createdAt}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {album.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Abrir
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Conquistas Desbloqueadas</h2>
              <Badge variant="outline" className="font-code">
                {achievements} / {achievementsData.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                          {React.cloneElement(achievement.icon as React.ReactElement, { 
                            className: "h-8 w-8 text-primary" 
                          })}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.overallDescription}</p>
                        </div>
                        
                        <div className="space-y-2">
                          {achievement.tiers.filter(tier => tier.isUnlocked).map(tier => (
                            <div key={tier.level} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">Nível {tier.level}</span>
                                <Badge className="bg-green-500">
                                  <Check className="h-3 w-3 mr-1" />
                                  Completo
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <span className="flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-primary" />
                                  +{tier.xpReward} XP
                                </span>
                                <span className="flex items-center gap-1">
                                  <Coins className="h-3 w-3 text-accent" />
                                  +{tier.creditsReward}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Gráfico de Performance</p>
                      <p className="text-xs text-muted-foreground mt-1">Em desenvolvimento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Stats */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Target className="h-5 w-5 mr-2" />
                    Estatísticas Detalhadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-primary">€{userStats.averagePixelValue.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Valor Médio</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-accent">€{userStats.mostExpensivePixel}</div>
                      <div className="text-xs text-muted-foreground">Mais Caro</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Região Favorita:</span>
                      <Badge variant="outline">{userStats.favoriteRegion}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cor Favorita:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border-2 border-border"
                          style={{ backgroundColor: userStats.favoriteColor }}
                        />
                        <span className="font-code text-xs">{userStats.favoriteColor}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Última Atividade:</span>
                      <span className="text-sm text-muted-foreground">{userStats.lastActive}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Engagement Social</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-500">{userStats.totalViews.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Visualizações</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-500">{userStats.totalLikes.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Curtidas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-500">{userStats.totalComments}</div>
                        <div className="text-xs text-muted-foreground">Comentários</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Regional Distribution */}
            <Card className="card-hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Globe className="h-5 w-5 mr-2" />
                  Distribuição Regional dos Seus Pixels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: 'Lisboa', count: 15, percentage: 35.7, color: 'bg-blue-500' },
                    { region: 'Porto', count: 12, percentage: 28.6, color: 'bg-green-500' },
                    { region: 'Coimbra', count: 8, percentage: 19.0, color: 'bg-purple-500' },
                    { region: 'Braga', count: 4, percentage: 9.5, color: 'bg-orange-500' },
                    { region: 'Faro', count: 3, percentage: 7.2, color: 'bg-red-500' }
                  ].map(region => (
                    <div key={region.region} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{region.region}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{region.count} pixels</span>
                          <span className="font-bold text-primary">{region.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${region.color} transition-all duration-500`}
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <User className="h-5 w-5 mr-2" />
                    Informações do Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome de Exibição</label>
                        <Input 
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea 
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Localização</label>
                        <Input 
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input 
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Nome:</span>
                        <span className="text-sm">{profileData.displayName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Localização:</span>
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Website:</span>
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {profileData.website}
                        </a>
                      </div>
                      
                      <Button onClick={() => setIsEditing(true)} className="w-full">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <Button
                        variant={value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPrivacySettings(prev => ({ ...prev, [key]: !value }))}
                      >
                        {value ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Bell className="h-5 w-5 mr-2" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <Button
                        variant={value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !value }))}
                      >
                        {value ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Redes Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map(social => (
                    <div key={social.platform} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        {social.icon}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{social.platform}</span>
                            {social.verified && (
                              <Badge className="bg-blue-500 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{social.handle}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Rede Social
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Profile Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/5 border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Pronto para Criar Mais?</h3>
                <p className="text-muted-foreground">Explore o mapa e encontre o seu próximo pixel perfeito!</p>
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explorar Mapa
                </Button>
                
                <Button variant="outline">
                  <Coins className="h-4 w-4 mr-2" />
                  Comprar Créditos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}