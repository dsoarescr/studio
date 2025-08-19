'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Calendar, Globe, Edit3, Save, X, Crown, Star, 
  Coins, Gift, Trophy, Award, Eye, Heart, MessageSquare, Share2,
  Users, UserPlus, Send, Copy, Link as LinkIcon, Twitter, Instagram, 
  Github, Mail, Settings, Bell, Shield, Palette, Zap, Target,
  Flame, Clock, TrendingUp, BarChart3, PieChart, Activity, Sparkles,
  Gem, CheckCircle, Lock, Unlock, Search, Filter, SortAsc, Grid3X3,
  List, Plus, Minus, ExternalLink, Download, Upload, Camera, Mic,
  Video, Phone, MessageCircle, UserCheck, UserX, Bookmark, Flag,
  ThumbsUp, ThumbsDown, MoreHorizontal, RefreshCw, AlertTriangle,
  Info, HelpCircle, Lightbulb, Rocket, ShoppingCart, CreditCard
} from "lucide-react";
import { cn } from '@/lib/utils';
import { achievementsData } from '@/data/achievements-data';

// Mock data
const mockPixels = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    color: '#D4A757',
    title: 'Pixel Dourado de Lisboa',
    description: 'Um pixel especial no coração da capital',
    views: 1234,
    likes: 89,
    comments: 23,
    price: 150,
    isPublic: true,
    isFavorite: false,
    tags: ['lisboa', 'premium', 'centro'],
    createdAt: '2024-03-15',
    imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa'
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    color: '#7DF9FF',
    title: 'Arte Azul do Porto',
    description: 'Inspirado no Rio Douro',
    views: 567,
    likes: 45,
    comments: 12,
    price: 89,
    isPublic: false,
    isFavorite: true,
    tags: ['porto', 'rio', 'azul'],
    createdAt: '2024-03-10',
    imageUrl: 'https://placehold.co/200x200/7DF9FF/000000?text=Porto'
  }
];

const mockSocialConnections = [
  {
    id: '1',
    name: 'PixelArtist',
    username: 'pixelartist123',
    avatar: 'https://placehold.co/40x40.png',
    level: 15,
    isOnline: true,
    isFollowing: true,
    isFriend: true,
    mutualFriends: 5,
    joinDate: '2024-01-15',
    pixelCount: 234,
    lastActive: '2 min atrás'
  },
  {
    id: '2',
    name: 'ColorMaster',
    username: 'colormaster',
    avatar: 'https://placehold.co/40x40.png',
    level: 12,
    isOnline: false,
    isFollowing: false,
    isFriend: false,
    mutualFriends: 2,
    joinDate: '2024-02-01',
    pixelCount: 156,
    lastActive: '1h atrás'
  }
];

const mockAlbums = [
  {
    id: '1',
    name: 'Paisagens de Portugal',
    description: 'Coleção das mais belas paisagens portuguesas',
    coverUrl: 'https://placehold.co/100x100/D4A757/FFFFFF?text=PT',
    pixelCount: 45,
    views: 2340,
    likes: 189,
    isPublic: true,
    collaborators: ['PixelArtist', 'ColorMaster'],
    createdAt: '2024-03-01'
  },
  {
    id: '2',
    name: 'Arte Urbana',
    description: 'Pixels inspirados na vida urbana',
    coverUrl: 'https://placehold.co/100x100/7DF9FF/000000?text=City',
    pixelCount: 23,
    views: 890,
    likes: 67,
    isPublic: false,
    collaborators: [],
    createdAt: '2024-03-10'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'pixel_purchase',
    description: 'Comprou pixel em Lisboa (245, 156)',
    timestamp: '2 horas atrás',
    metadata: { pixelId: '1', region: 'Lisboa', price: 150 }
  },
  {
    id: '2',
    type: 'achievement',
    description: 'Desbloqueou "Mestre das Cores" - Nível 2',
    timestamp: '1 dia atrás',
    metadata: { achievementId: 'color_master', level: 2 }
  },
  {
    id: '3',
    type: 'album_created',
    description: 'Criou álbum "Arte Urbana"',
    timestamp: '3 dias atrás',
    metadata: { albumId: '2', albumName: 'Arte Urbana' }
  },
  {
    id: '4',
    type: 'social_follow',
    description: 'Começou a seguir PixelArtist',
    timestamp: '5 dias atrás',
    metadata: { userId: '1', userName: 'PixelArtist' }
  },
  {
    id: '5',
    type: 'level_up',
    description: 'Subiu para o nível 8',
    timestamp: '1 semana atrás',
    metadata: { newLevel: 8, xpGained: 500 }
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
    addSpecialCredits, 
    addXp,
    updateStreak
  } = useUserStore();
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // States
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [hapticTrigger, setHapticTrigger] = useState(false);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [streak, setStreak] = useState(7);
  const [selectedPixel, setSelectedPixel] = useState<any>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [pixelFilter, setPixelFilter] = useState('all');
  const [pixelSearch, setPixelSearch] = useState('');
  const [pixelSort, setPixelSort] = useState('recent');
  const [pixelViewMode, setPixelViewMode] = useState<'grid' | 'list'>('grid');
  const [socialTab, setSocialTab] = useState('friends');
  const [following, setFollowing] = useState<any[]>([]);
  
  // Profile edit states
  const [editName, setEditName] = useState('PixelMasterPT');
  const [editBio, setEditBio] = useState('Artista digital apaixonado por pixel art e pela cultura portuguesa. Criando arte pixel a pixel! 🎨🇵🇹');
  const [editLocation, setEditLocation] = useState('Lisboa, Portugal');
  const [editWebsite, setEditWebsite] = useState('');
  const [editTwitter, setEditTwitter] = useState('@pixelmasterpt');
  const [editInstagram, setEditInstagram] = useState('pixelmasterpt');
  const [editGithub, setEditGithub] = useState('');
  const [editDiscord, setEditDiscord] = useState('PixelMaster#1234');
  
  // Privacy settings
  const [showEmail, setShowEmail] = useState(false);
  const [showPixels, setShowPixels] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  const xpPercentage = (xp / xpMax) * 100;
  const nextLevelXp = xpMax - xp;

  // Função para reclamar bónus diário
  const handleClaimDailyBonus = () => {
    if (dailyBonusClaimed) {
      toast({
        title: "Bónus Já Reclamado",
        description: "Volte amanhã para reclamar o próximo bónus diário!",
        variant: "destructive"
      });
      return;
    }

    const bonusCredits = streak * 10;
    const bonusXp = streak * 5;
    
    setDailyBonusClaimed(true);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    setHapticTrigger(true);
    
    addCredits(bonusCredits);
    addXp(bonusXp);
    updateStreak();
    
    toast({
      title: "🎁 Bónus Diário Reclamado!",
      description: `Recebeu ${bonusCredits} créditos + ${bonusXp} XP! Sequência: ${streak} dias`,
    });
  };

  const handleInviteFriend = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Obrigatório",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    // Generate unique invite link
    const inviteCode = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/invite/${inviteCode}`;
    setInviteLink(link);
    
    // Copy to clipboard
    navigator.clipboard.writeText(link);
    
    // Reward user for inviting
    addCredits(25);
    addXp(15);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    toast({
      title: "Convite Enviado! 📧",
      description: `Link copiado! Receberá 100 créditos quando ${inviteEmail} se registar.`,
    });
    
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleFollowUser = (user: any) => {
    // Add to following list if not already following
    if (!following.some(f => f.id === user.id)) {
      setFollowing(prev => [...prev, user]);
      
      // Reward for social interaction
      addCredits(5);
      addXp(10);
      setPlaySuccessSound(true);
      
      toast({
        title: "A Seguir Utilizador! 👥",
        description: `Agora segue ${user.name}. Recebeu 5 créditos + 10 XP!`,
      });
    } else {
      // Unfollow
      setFollowing(prev => prev.filter(f => f.id !== user.id));
      
      toast({
        title: "Deixou de Seguir",
        description: `Deixou de seguir ${user.name}.`,
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Mensagem Vazia",
        description: "Por favor, escreva uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    // Reward for social interaction
    addCredits(3);
    addXp(5);
    setPlaySuccessSound(true);
    
    toast({
      title: "Mensagem Enviada! 💬",
      description: `Mensagem enviada para ${selectedUser?.name}. Recebeu 3 créditos + 5 XP!`,
    });
    
    setMessageText('');
    setShowMessageModal(false);
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setShowUserProfileModal(true);
    
    // Small reward for viewing profiles
    addXp(2);
    
    toast({
      title: "Perfil Visualizado",
      description: `A ver perfil de ${user.name}. +2 XP!`,
    });
  };

  // Função para clicar em pixel
  const handlePixelClick = (pixel: any) => {
    setSelectedPixel(pixel);
    setHapticTrigger(true);
  };

  // Função para clicar em conquista
  const handleAchievementClick = (achievement: any) => {
    setSelectedAchievement(achievement);
    setHapticTrigger(true);
  };

  // Função para seguir utilizador
  const handleFollowUserOld = (userId: string, userName: string) => {
    setHapticTrigger(true);
    setPlaySuccessSound(true);
    
    addCredits(10);
    addXp(8);
    
    toast({
      title: "👥 A Seguir Utilizador!",
      description: `Agora segue ${userName}. Recebeu 10 créditos + 8 XP!`,
    });
  };

  // Função para enviar mensagem
  const handleSendMessageOld = (userId: string, userName: string) => {
    setHapticTrigger(true);
    
    toast({
      title: "💬 Mensagem Enviada!",
      description: `Mensagem enviada para ${userName}.`,
    });
  };

  // Função para ver perfil
  const handleViewProfileOld = (userId: string, userName: string) => {
    setHapticTrigger(true);
    
    toast({
      title: "👤 Visualizando Perfil",
      description: `Abrindo perfil de ${userName}...`,
    });
  };

  // Função para guardar perfil
  const handleSaveProfile = () => {
    setShowConfetti(true);
    setPlaySuccessSound(true);
    setHapticTrigger(true);
    
    addXp(20);
    
    toast({
      title: "✅ Perfil Atualizado!",
      description: "As suas informações foram guardadas com sucesso. Recebeu 20 XP!",
    });
    
    setIsEditingProfile(false);
  };

  // Filtrar pixels
  const filteredPixels = mockPixels.filter(pixel => {
    const matchesFilter = pixelFilter === 'all' || 
      (pixelFilter === 'public' && pixel.isPublic) ||
      (pixelFilter === 'private' && !pixel.isPublic) ||
      (pixelFilter === 'favorites' && pixel.isFavorite);
    
    const matchesSearch = !pixelSearch || 
      pixel.title.toLowerCase().includes(pixelSearch.toLowerCase()) ||
      pixel.description.toLowerCase().includes(pixelSearch.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(pixelSearch.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Ordenar pixels
  const sortedPixels = [...filteredPixels].sort((a, b) => {
    switch (pixelSort) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'price':
        return b.price - a.price;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Filtrar conexões sociais
  const filteredConnections = mockSocialConnections.filter(connection => {
    switch (socialTab) {
      case 'friends':
        return connection.isFriend;
      case 'followers':
        return connection.isFollowing;
      case 'following':
        return !connection.isFriend && connection.isFollowing;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      <HapticFeedback pattern="light" trigger={hapticTrigger} onComplete={() => setHapticTrigger(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-md space-y-6">
        {/* Header de Perfil */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardContent className="relative p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary shadow-2xl mx-auto">
                <AvatarImage 
                  src={user?.photoURL || 'https://placehold.co/96x96.png'} 
                  alt={user?.displayName || 'User'} 
                />
                <AvatarFallback className="text-3xl font-headline">
                  {user?.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-background animate-pulse" />
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {level}
                </Badge>
              </div>
              
              <div className="absolute -top-2 -left-2 flex flex-col gap-1">
                <Badge className="bg-amber-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
                <Badge className="bg-blue-500 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              </div>
            </div>
            
            <h1 className="text-2xl font-headline font-bold text-gradient-gold mb-2">
              {user?.displayName || 'PixelMasterPT'}
            </h1>
            <p className="text-muted-foreground font-code text-sm mb-2">
              @{user?.displayName?.toLowerCase() || 'pixelmasterpt'}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
              <MapPin className="h-3 w-3" />
              <span>Lisboa, Portugal</span>
              <span>•</span>
              <Calendar className="h-3 w-3" />
              <span>Membro desde Jan 2024</span>
            </div>
            
            <Card className="bg-background/50 p-3 text-center rounded-lg shadow-inner mb-4">
              <p className="text-sm text-foreground italic">
                "Artista digital apaixonado por pixel art e pela cultura portuguesa. Criando arte pixel a pixel! 🎨🇵🇹"
              </p>
            </Card>
            
            <Button 
              onClick={() => setIsEditingProfile(true)}
              variant="outline" 
              size="sm"
              className="min-h-[44px] px-6"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Navegação Principal */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md rounded-lg border border-primary/20 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 h-12 bg-transparent">
              <TabsTrigger value="overview" className="font-headline text-xs">
                <User className="h-4 w-4 mr-1" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="pixels" className="font-headline text-xs">
                <Palette className="h-4 w-4 mr-1" />
                Pixels
              </TabsTrigger>
              <TabsTrigger value="social" className="font-headline text-xs">
                <Users className="h-4 w-4 mr-1" />
                Social
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="space-y-6 pb-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard de Métricas */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/10 border-primary/30 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">{credits.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Créditos</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-accent/10 border-accent/30 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Gift className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-accent">{specialCredits.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Especiais</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-500/10 border-green-500/30 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Palette className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-500">{pixels}</p>
                    <p className="text-xs text-muted-foreground">Pixels</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-500/10 border-yellow-500/30 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-500">{achievements}</p>
                    <p className="text-xs text-muted-foreground">Conquistas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bónus Diário */}
              <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-500/20 rounded-full">
                        <Gift className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Bónus Diário</h3>
                        <p className="text-sm text-muted-foreground">
                          Sequência: {streak} dias consecutivos
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-500 mb-2">
                        +{streak * 10} créditos
                      </div>
                      <Button 
                        onClick={handleClaimDailyBonus}
                        disabled={dailyBonusClaimed}
                        className="min-h-[44px] px-6"
                      >
                        {dailyBonusClaimed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reclamado
                          </>
                        ) : (
                          <>
                            <Gift className="h-4 w-4 mr-2" />
                            Reclamar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progresso XP */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Progresso de Nível</span>
                      <Badge variant="secondary">Nível {level}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>XP Atual</span>
                        <span className="font-code">{xp.toLocaleString()} / {xpMax.toLocaleString()}</span>
                      </div>
                      <div className="relative">
                        <Progress value={xpPercentage} className="h-3" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-shimmer" 
                             style={{ backgroundSize: '200% 100%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Faltam {nextLevelXp.toLocaleString()} XP para o nível {level + 1}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conquistas em Destaque */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Conquistas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {achievementsData.slice(0, 6).map(achievement => (
                      <Card 
                        key={achievement.id}
                        className="cursor-pointer hover:shadow-md transition-shadow bg-muted/20 min-h-[44px]"
                        onClick={() => handleAchievementClick(achievement)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-yellow-500 mb-2">
                            {React.cloneElement(achievement.icon as React.ReactElement, { className: "h-6 w-6 mx-auto" })}
                          </div>
                          <p className="text-xs font-medium line-clamp-2">{achievement.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 min-h-[44px]"
                    onClick={() => setActiveTab('achievements')}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Ver Todas as Conquistas
                  </Button>
                </CardContent>
              </Card>

              {/* Álbuns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-500" />
                    Álbuns de Pixels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAlbums.map(album => (
                      <Card key={album.id} className="bg-muted/20 hover:bg-muted/30 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={album.coverUrl} 
                              alt={album.name}
                              className="w-12 h-12 rounded border"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{album.name}</h4>
                              <p className="text-xs text-muted-foreground">{album.pixelCount} pixels</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={album.isPublic ? 'default' : 'secondary'} className="text-xs">
                                  {album.isPublic ? 'Público' : 'Privado'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {album.views} views
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 min-h-[44px]">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Álbum
                  </Button>
                </CardContent>
              </Card>

              {/* Atividade Recente */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {mockRecentActivity.map(activity => (
                        <div key={activity.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                          <div className="p-2 bg-blue-500/20 rounded-full">
                            {activity.type === 'pixel_purchase' && <ShoppingCart className="h-4 w-4 text-blue-500" />}
                            {activity.type === 'achievement' && <Trophy className="h-4 w-4 text-yellow-500" />}
                            {activity.type === 'album_created' && <Palette className="h-4 w-4 text-purple-500" />}
                            {activity.type === 'social_follow' && <UserPlus className="h-4 w-4 text-green-500" />}
                            {activity.type === 'level_up' && <Zap className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'pixels' && (
            <div className="space-y-6">
              {/* Filtros e Busca */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pixels..."
                      value={pixelSearch}
                      onChange={(e) => setPixelSearch(e.target.value)}
                      className="pl-10 min-h-[44px]"
                    />
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                      { key: 'all', label: 'Todos', count: mockPixels.length },
                      { key: 'public', label: 'Públicos', count: mockPixels.filter(p => p.isPublic).length },
                      { key: 'private', label: 'Privados', count: mockPixels.filter(p => !p.isPublic).length },
                      { key: 'favorites', label: 'Favoritos', count: mockPixels.filter(p => p.isFavorite).length }
                    ].map(filter => (
                      <Button
                        key={filter.key}
                        variant={pixelFilter === filter.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPixelFilter(filter.key)}
                        className="flex-shrink-0 min-h-[32px]"
                      >
                        {filter.label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {filter.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant={pixelSort === 'recent' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPixelSort('recent')}
                        className="min-h-[32px]"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Recentes
                      </Button>
                      <Button
                        variant={pixelSort === 'popular' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPixelSort('popular')}
                        className="min-h-[32px]"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Populares
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant={pixelViewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPixelViewMode('grid')}
                        className="min-h-[32px] px-3"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={pixelViewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPixelViewMode('list')}
                        className="min-h-[32px] px-3"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Galeria de Pixels */}
              <ScrollArea className="h-[60vh]">
                <div className={cn(
                  "space-y-4 pb-4",
                  pixelViewMode === 'grid' && "grid grid-cols-2 gap-4 space-y-0"
                )}>
                  {sortedPixels.map(pixel => (
                    <Card 
                      key={pixel.id}
                      className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 min-h-[44px]"
                      onClick={() => handlePixelClick(pixel)}
                    >
                      <CardContent className="p-3">
                        {pixelViewMode === 'grid' ? (
                          <div className="space-y-2">
                            <div 
                              className="w-full h-20 rounded border-2 border-primary/30 flex items-center justify-center text-2xl"
                              style={{ backgroundColor: pixel.color }}
                            >
                              🎨
                            </div>
                            <h4 className="font-semibold text-sm line-clamp-1">{pixel.title}</h4>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">({pixel.x}, {pixel.y})</span>
                              <span className="font-bold text-primary">€{pixel.price}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded border-2 border-primary/30 flex items-center justify-center"
                              style={{ backgroundColor: pixel.color }}
                            >
                              🎨
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{pixel.title}</h4>
                              <p className="text-xs text-muted-foreground">({pixel.x}, {pixel.y}) • {pixel.region}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{pixel.views} views</span>
                                <span className="text-xs text-muted-foreground">{pixel.likes} likes</span>
                                <span className="font-bold text-primary text-sm">€{pixel.price}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* Estatísticas Sociais */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-xl font-bold">156</p>
                    <p className="text-xs text-muted-foreground">Amigos</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <UserPlus className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-xl font-bold">1.2K</p>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-xl font-bold">890</p>
                    <p className="text-xs text-muted-foreground">A Seguir</p>
                  </CardContent>
                </Card>
              </div>

              {/* Botão de Convidar */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardContent className="p-4 text-center">
                  <UserPlus className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Convide Amigos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Convide amigos e ganhe 25 créditos por cada novo membro!
                  </p>
                  <Button 
                    onClick={() => setShowInviteModal(true)}
                    className="w-full min-h-[44px]"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convidar Amigos
                  </Button>
                </CardContent>
              </Card>

              {/* Navegação Social */}
              <Card>
                <CardHeader>
                  <div className="flex gap-2">
                    {[
                      { key: 'friends', label: 'Amigos', icon: Users },
                      { key: 'followers', label: 'Seguidores', icon: UserPlus },
                      { key: 'following', label: 'A Seguir', icon: Heart }
                    ].map(tab => (
                      <Button
                        key={tab.key}
                        variant={socialTab === tab.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSocialTab(tab.key)}
                        className="flex-1 min-h-[32px]"
                      >
                        <tab.icon className="h-3 w-3 mr-1" />
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {filteredConnections.map(connection => (
                        <Card key={connection.id} className="bg-muted/20">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={connection.avatar} />
                                  <AvatarFallback>{connection.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                  "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                                  connection.isOnline ? "bg-green-500" : "bg-gray-500"
                                )} />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{connection.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    Nível {connection.level}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">@{connection.username}</p>
                                <p className="text-xs text-muted-foreground">{connection.pixelCount} pixels</p>
                              </div>
                              
                              <div className="flex flex-col gap-1">
                                <Button 
                                  size="sm" 
                                  className="min-h-[32px] px-3"
                                  onClick={() => handleFollowUser(connection)}
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  {following.some(f => f.id === connection.id) ? 'A Seguir' : 'Seguir'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="min-h-[32px] px-3"
                                  onClick={() => {
                                    setSelectedUser(connection);
                                    setShowMessageModal(true);
                                  }}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Mensagem
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="min-h-[32px] px-3"
                                  onClick={() => handleViewProfile(connection)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Modal de Detalhes do Pixel */}
        <Dialog open={!!selectedPixel} onOpenChange={() => setSelectedPixel(null)}>
          <DialogContent className="max-w-md">
            {selectedPixel && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    {selectedPixel.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div 
                    className="w-full h-32 rounded-lg border-2 border-primary/30 flex items-center justify-center text-6xl"
                    style={{ backgroundColor: selectedPixel.color }}
                  >
                    🎨
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{selectedPixel.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Coordenadas:</span>
                      <span className="font-code">({selectedPixel.x}, {selectedPixel.y})</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Região:</span>
                      <span>{selectedPixel.region}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Preço:</span>
                      <span className="font-bold text-primary">€{selectedPixel.price}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{selectedPixel.views}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div>
                      <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{selectedPixel.likes}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div>
                      <MessageSquare className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{selectedPixel.comments}</p>
                      <p className="text-xs text-muted-foreground">Comentários</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 min-h-[44px]">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" className="flex-1 min-h-[44px]">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Detalhes da Conquista */}
        <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
          <DialogContent className="max-w-md">
            {selectedAchievement && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    {selectedAchievement.name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="p-4 bg-yellow-500/20 rounded-full w-fit mx-auto mb-4">
                      {React.cloneElement(selectedAchievement.icon as React.ReactElement, { 
                        className: "h-12 w-12 text-yellow-500" 
                      })}
                    </div>
                    <p className="text-muted-foreground">{selectedAchievement.overallDescription}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Níveis da Conquista:</h4>
                    {selectedAchievement.tiers.map((tier: any, index: number) => (
                      <Card key={index} className={tier.isUnlocked ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/20'}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-sm">Nível {tier.level}</h5>
                              <p className="text-xs text-muted-foreground">{tier.description}</p>
                            </div>
                            <div className="text-right">
                              {tier.isUnlocked ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between text-xs mt-2">
                            <span className="text-primary">+{tier.xpReward} XP</span>
                            <span className="text-accent">+{tier.creditsReward} créditos</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button className="w-full min-h-[44px]">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar Conquista
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Convite */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-primary" />
                Convidar Amigos
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Recompensas por Convite</h3>
                <div className="space-y-1 text-sm">
                  <p>• <strong>25 créditos</strong> por enviar convite</p>
                  <p>• <strong>100 créditos</strong> quando o amigo se registar</p>
                  <p>• <strong>50 XP</strong> por cada amigo ativo</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email do Amigo</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="amigo@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              
              {inviteLink && (
                <div className="space-y-2">
                  <Label>Link de Convite Gerado</Label>
                  <div className="flex gap-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLink);
                        toast({
                          title: "Link Copiado",
                          description: "Link de convite copiado!",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleInviteFriend}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Mensagem */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Enviar Mensagem
                {selectedUser && (
                  <span className="ml-2 text-base font-normal">para {selectedUser.name}</span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">Nível {selectedUser.level}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message-text">Mensagem</Label>
                <Textarea
                  id="message-text"
                  placeholder="Escreva a sua mensagem..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Perfil Público */}
        <Dialog open={showUserProfileModal} onOpenChange={setShowUserProfileModal}>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Perfil Público
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-4">
                  {/* Header do Utilizador */}
                  <div className="text-center space-y-3">
                    <Avatar className="h-20 w-20 mx-auto border-4 border-primary">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                        {selectedUser.verified && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{selectedUser.name.toLowerCase()}</p>
                      <Badge variant="secondary" className="mt-2">
                        Nível {selectedUser.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats do Utilizador */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-primary">{selectedUser.pixelCount}</p>
                      <p className="text-xs text-muted-foreground">Pixels</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-blue-500">{selectedUser.followers || 0}</p>
                      <p className="text-xs text-muted-foreground">Seguidores</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-green-500">{selectedUser.following || 0}</p>
                      <p className="text-xs text-muted-foreground">A Seguir</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground italic">
                        "{selectedUser.bio || 'Este utilizador ainda não tem uma bio.'}"
                      </p>
                    </CardContent>
                  </Card>

                  {/* Ações */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleFollowUser(selectedUser)}
                      className="w-full min-h-[44px]"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {following.some(f => f.id === selectedUser.id) ? 'A Seguir' : 'Seguir'}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowUserProfileModal(false);
                          setShowMessageModal(true);
                        }}
                        className="min-h-[44px]"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mensagem
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/user/${selectedUser.name}`);
                          toast({
                            title: "Link Copiado",
                            description: "Link do perfil copiado!",
                          });
                        }}
                        className="min-h-[44px]"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Partilhar
                      </Button>
                    </div>
                  </div>

                  {/* Atividade Recente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        {[
                          { action: 'Comprou pixel em Lisboa', time: '2h atrás' },
                          { action: 'Desbloqueou conquista "Artista"', time: '1d atrás' },
                          { action: 'Criou álbum "Paisagens"', time: '3d atrás' }
                        ].map((activity, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{activity.action}</span>
                            <span className="text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição de Perfil */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent className="w-[95vw] h-[92vh] max-w-none p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="flex items-center">
                <Edit3 className="h-5 w-5 mr-2" />
                Editar Perfil
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Nome de Exibição</Label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="min-h-[44px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-bio">Biografia</Label>
                      <Textarea
                        id="edit-bio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-location">Localização</Label>
                      <Input
                        id="edit-location"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="min-h-[44px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-website">Website</Label>
                      <Input
                        id="edit-website"
                        value={editWebsite}
                        onChange={(e) => setEditWebsite(e.target.value)}
                        placeholder="https://seusite.com"
                        className="min-h-[44px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Redes Sociais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Redes Sociais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="edit-twitter">Twitter</Label>
                      <Input
                        id="edit-twitter"
                        value={editTwitter}
                        onChange={(e) => setEditTwitter(e.target.value)}
                        placeholder="@seutwitter"
                        className="min-h-[44px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-instagram">Instagram</Label>
                      <Input
                        id="edit-instagram"
                        value={editInstagram}
                        onChange={(e) => setEditInstagram(e.target.value)}
                        placeholder="seuinstagram"
                        className="min-h-[44px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-github">GitHub</Label>
                      <Input
                        id="edit-github"
                        value={editGithub}
                        onChange={(e) => setEditGithub(e.target.value)}
                        placeholder="seugithub"
                        className="min-h-[44px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-discord">Discord</Label>
                      <Input
                        id="edit-discord"
                        value={editDiscord}
                        onChange={(e) => setEditDiscord(e.target.value)}
                        placeholder="SeuNome#1234"
                        className="min-h-[44px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configurações de Privacidade */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Privacidade</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Mostrar Email Público</Label>
                      <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Mostrar Pixels</Label>
                      <Switch checked={showPixels} onCheckedChange={setShowPixels} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Mostrar Conquistas</Label>
                      <Switch checked={showAchievements} onCheckedChange={setShowAchievements} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Mostrar Atividade</Label>
                      <Switch checked={showActivity} onCheckedChange={setShowActivity} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Mostrar Estatísticas</Label>
                      <Switch checked={showStats} onCheckedChange={setShowStats} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Permitir Mensagens</Label>
                      <Switch checked={allowMessages} onCheckedChange={setAllowMessages} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 min-h-[44px]"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="flex-1 min-h-[44px]"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}