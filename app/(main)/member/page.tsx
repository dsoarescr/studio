
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUserStore } from "@/lib/store";
import { useAuth } from '@/lib/auth-context';
import { useToast } from "@/hooks/use-toast";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Edit3, Camera, MapPin, Trophy, Coins, Gift, Star, Crown, 
  Heart, Eye, MessageSquare, Share2, Settings, Calendar, Clock,
  Palette, Users, UserPlus, Send, Copy, ExternalLink, Zap,
  Award, Gem, Sparkles, Target, Shield, Bell, Mail, Phone,
  Link as LinkIcon, Instagram, Twitter, Github, Globe, Plus,
  Check, X, ChevronRight, Info, Flame, TrendingUp, Activity
} from "lucide-react";
import { cn } from '@/lib/utils';
import { achievementsData } from '@/data/achievements-data';

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
    streak,
    addCredits,
    addSpecialCredits,
    addXp,
    updateStreak
  } = useUserStore();
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados para modais
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estados para dados
  const [selectedPixel, setSelectedPixel] = useState<any>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  
  // Estados para efeitos
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  // Estados para perfil
  const [profileData, setProfileData] = useState({
    name: user?.displayName || 'PixelMasterPT',
    bio: 'Artista digital apaixonado por pixel art e explorador do universo português!',
    location: 'Lisboa, Portugal',
    website: 'https://pixelmaster.pt',
    twitter: '@pixelmaster',
    instagram: '@pixelmaster_art'
  });

  // Mock data para pixels do utilizador
  const userPixels = [
    {
      id: '1',
      x: 245,
      y: 156,
      region: 'Lisboa',
      color: '#D4A757',
      title: 'Pixel Dourado de Lisboa',
      description: 'Um pixel especial no coração da capital portuguesa',
      views: 1234,
      likes: 89,
      comments: 23,
      value: 150,
      rarity: 'Épico',
      acquisitionDate: '2024-03-15',
      features: ['Centro Histórico', 'Alta Visibilidade', 'Zona Premium']
    },
    {
      id: '2',
      x: 123,
      y: 89,
      region: 'Porto',
      color: '#7DF9FF',
      title: 'Arte Azul do Porto',
      description: 'Inspirado nas águas do Douro',
      views: 567,
      likes: 45,
      comments: 12,
      value: 120,
      rarity: 'Raro',
      acquisitionDate: '2024-03-10',
      features: ['Zona Ribeirinha', 'Património UNESCO']
    }
  ];

  // Mock data para amigos/conexões
  const socialConnections = [
    {
      id: '1',
      name: 'ArtistaPro',
      username: '@artistapro',
      avatar: 'https://placehold.co/40x40.png',
      level: 18,
      pixels: 67,
      followers: 234,
      following: 189,
      isFollowing: false,
      isOnline: true,
      lastSeen: 'Agora',
      bio: 'Criador de arte digital e colecionador de pixels raros'
    },
    {
      id: '2',
      name: 'PixelCollector',
      username: '@pixelcollector',
      avatar: 'https://placehold.co/40x40.png',
      level: 22,
      pixels: 156,
      followers: 567,
      following: 234,
      isFollowing: true,
      isOnline: false,
      lastSeen: '2h atrás',
      bio: 'Investidor em pixels e especialista em mercado digital'
    },
    {
      id: '3',
      name: 'ColorMaster',
      username: '@colormaster',
      avatar: 'https://placehold.co/40x40.png',
      level: 15,
      pixels: 89,
      followers: 345,
      following: 123,
      isFollowing: false,
      isOnline: true,
      lastSeen: 'Agora',
      bio: 'Mestre das cores e técnicas avançadas de pixel art'
    }
  ];

  const xpPercentage = (xp / xpMax) * 100;

  // FUNÇÃO: Reclamar Bónus Diário
  const handleClaimDailyBonus = () => {
    if (dailyBonusClaimed) {
      toast({
        title: "Bónus Já Reclamado",
        description: "Você já reclamou o bónus diário de hoje. Volte amanhã!",
        variant: "destructive"
      });
      return;
    }

    setDailyBonusClaimed(true);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    const bonusCredits = streak * 10;
    const bonusXP = streak * 5;
    
    addCredits(bonusCredits);
    addXp(bonusXP);
    updateStreak();
    
    toast({
      title: "🎁 Bónus Diário Reclamado!",
      description: `Recebeu ${bonusCredits} créditos + ${bonusXP} XP! Sequência: ${streak} dias`,
    });
  };

  // FUNÇÃO: Clique no Pixel
  const handlePixelClick = (pixel: any) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
  };

  // FUNÇÃO: Clique na Conquista
  const handleAchievementClick = (achievementId: string) => {
    const achievement = achievementsData.find(a => a.id === achievementId);
    if (achievement) {
      setSelectedAchievement(achievement);
      setShowAchievementModal(true);
    }
  };

  // FUNÇÃO: Convidar Amigo
  const handleInviteFriend = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Obrigatório",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    // Gerar link único de convite
    const inviteCode = Math.random().toString(36).substring(2, 15);
    const generatedLink = `${window.location.origin}/invite/${inviteCode}`;
    setInviteLink(generatedLink);
    
    // Simular envio de convite
    addCredits(25);
    addXp(15);
    setPlaySuccessSound(true);
    
    toast({
      title: "🎉 Convite Enviado!",
      description: `Convite enviado para ${inviteEmail}. Recebeu 25 créditos + 15 XP!`,
    });
    
    setInviteEmail('');
  };

  // FUNÇÃO: Copiar Link de Convite
  const handleCopyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast({
        title: "🔗 Link Copiado!",
        description: "Link de convite copiado para a área de transferência.",
      });
    }
  };

  // FUNÇÃO: Seguir Utilizador
  const handleFollowUser = (userId: string) => {
    const user = socialConnections.find(u => u.id === userId);
    if (!user) return;

    // Atualizar estado de seguir
    const updatedConnections = socialConnections.map(conn => 
      conn.id === userId 
        ? { ...conn, isFollowing: !conn.isFollowing, followers: conn.isFollowing ? conn.followers - 1 : conn.followers + 1 }
        : conn
    );

    addCredits(10);
    addXp(8);
    setPlaySuccessSound(true);
    
    toast({
      title: user.isFollowing ? "❌ Deixou de Seguir" : "✅ A Seguir!",
      description: user.isFollowing 
        ? `Deixou de seguir ${user.name}` 
        : `Agora segue ${user.name}. Recebeu 10 créditos + 8 XP!`,
    });
  };

  // FUNÇÃO: Enviar Mensagem
  const handleSendMessage = (userId: string) => {
    const user = socialConnections.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowMessageModal(true);
    }
  };

  // FUNÇÃO: Ver Perfil
  const handleViewProfile = (userId: string) => {
    const user = socialConnections.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowProfileModal(true);
    }
  };

  // FUNÇÃO: Enviar Mensagem (Modal)
  const handleSendMessageSubmit = () => {
    if (!messageText.trim()) {
      toast({
        title: "Mensagem Vazia",
        description: "Por favor, escreva uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    addCredits(5);
    addXp(3);
    setPlaySuccessSound(true);
    
    toast({
      title: "💬 Mensagem Enviada!",
      description: `Mensagem enviada para ${selectedUser?.name}. Recebeu 5 créditos + 3 XP!`,
    });
    
    setMessageText('');
    setShowMessageModal(false);
  };

  // FUNÇÃO: Partilhar Conquista
  const handleShareAchievement = () => {
    if (selectedAchievement) {
      const shareText = `Desbloqueei a conquista "${selectedAchievement.name}" no Pixel Universe! 🏆`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Conquista Desbloqueada!',
          text: shareText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "🔗 Conquista Partilhada!",
          description: "Texto copiado para a área de transferência.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-20">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-md">
        {/* Header do Perfil */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative text-center pt-8">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 border-4 border-primary shadow-lg mx-auto">
                <AvatarImage 
                  src={user?.photoURL || 'https://placehold.co/96x96.png'} 
                  alt={profileData.name} 
                  data-ai-hint="profile avatar"
                />
                <AvatarFallback className="text-2xl font-headline">
                  {profileData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setShowEditModal(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CardTitle className="text-2xl font-headline text-gradient-gold">
                  {profileData.name}
                </CardTitle>
                {isVerified && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                {isPremium && <Crown className="h-5 w-5 text-amber-500" />}
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="font-code">Nível {level}</Badge>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 pb-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground italic">
                &quot;{profileData.bio}&quot;
              </p>
            </div>
            
            {/* Progresso XP */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Progresso XP</span>
                <span className="font-code">{xp.toLocaleString()}/{xpMax.toLocaleString()}</span>
              </div>
              <Progress value={xpPercentage} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
              <p className="text-xs text-muted-foreground text-center">
                Faltam {(xpMax - xp).toLocaleString()} XP para o próximo nível
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="p-4 text-center">
                  <Coins className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{credits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Créditos</p>
                </CardContent>
              </Card>
              
              <Card className="bg-accent/10 border-accent/30">
                <CardContent className="p-4 text-center">
                  <Gift className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-accent">{specialCredits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Especiais</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{pixels}</p>
                  <p className="text-xs text-muted-foreground">Pixels</p>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-500">{achievements}</p>
                  <p className="text-xs text-muted-foreground">Conquistas</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Bónus Diário */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Gift className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Bónus Diário</h3>
                  <p className="text-sm text-muted-foreground">
                    Sequência: {streak} dias consecutivos
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-500">
                      +{streak * 10} créditos • +{streak * 5} XP
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleClaimDailyBonus}
                disabled={dailyBonusClaimed}
                className={cn(
                  "min-h-[44px] px-6 cursor-pointer transition-all duration-300",
                  dailyBonusClaimed 
                    ? "bg-green-500/20 text-green-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105"
                )}
              >
                {dailyBonusClaimed ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Reclamado
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5 mr-2" />
                    Reclamar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Principais */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm rounded-lg border border-primary/20 shadow-lg">
          <Tabs defaultValue="pixels" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-transparent">
              <TabsTrigger value="pixels" className="flex-1 min-h-[32px]">
                <Palette className="h-4 w-4 mr-2" />
                Pixels
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1 min-h-[32px]">
                <Trophy className="h-4 w-4 mr-2" />
                Conquistas
              </TabsTrigger>
              <TabsTrigger value="social" className="flex-1 min-h-[32px]">
                <Users className="h-4 w-4 mr-2" />
                Social
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 min-h-[32px]">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 relative z-10">
              {/* Tab: Pixels */}
              <TabsContent value="pixels" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Palette className="h-5 w-5 mr-2 text-primary" />
                        Meus Pixels ({userPixels.length})
                      </span>
                      <Badge variant="outline">Total: €{userPixels.reduce((sum, p) => sum + p.value, 0)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[60vh]">
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        {userPixels.map(pixel => (
                          <Card 
                            key={pixel.id} 
                            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20"
                            onClick={() => handlePixelClick(pixel)}
                          >
                            <CardContent className="p-4">
                              <div 
                                className="w-full h-24 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold border-2 border-primary/30"
                                style={{ backgroundColor: pixel.color }}
                              >
                                🎨
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">{pixel.title}</h4>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">({pixel.x}, {pixel.y})</span>
                                  <Badge variant="outline" className="text-xs">{pixel.rarity}</Badge>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">{pixel.region}</span>
                                  <span className="font-bold text-primary">€{pixel.value}</span>
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

              {/* Tab: Conquistas */}
              <TabsContent value="achievements" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      Conquistas Desbloqueadas ({achievements})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-3 pb-4">
                        {achievementsData.slice(0, achievements).map(achievement => (
                          <Card 
                            key={achievement.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-yellow-500/5 to-amber-500/5 border-yellow-500/30"
                            onClick={() => handleAchievementClick(achievement.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                  {React.cloneElement(achievement.icon as React.ReactElement, { 
                                    className: "h-6 w-6 text-yellow-500" 
                                  })}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm">{achievement.name}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {achievement.overallDescription}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">{achievement.category}</Badge>
                                    <Badge className="text-xs bg-yellow-500">Desbloqueada</Badge>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Social */}
              <TabsContent value="social" className="mt-0">
                <div className="space-y-4">
                  {/* Convidar Amigos */}
                  <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserPlus className="h-6 w-6 text-blue-500" />
                          <div>
                            <h3 className="font-semibold">Convidar Amigos</h3>
                            <p className="text-sm text-muted-foreground">
                              Ganhe 25 créditos por convite
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setShowInviteModal(true)}
                          className="min-h-[44px] px-6 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Convidar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lista de Conexões */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Conexões ({socialConnections.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3 pb-4">
                          {socialConnections.map(connection => (
                            <Card key={connection.id} className="bg-muted/20 hover:bg-muted/40 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-border">
                                      <AvatarImage src={connection.avatar} alt={connection.name} data-ai-hint="profile avatar" />
                                      <AvatarFallback>{connection.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                                      connection.isOnline ? "bg-green-500" : "bg-gray-500"
                                    )} />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-sm">{connection.name}</h4>
                                      <Badge variant="outline" className="text-xs">Nível {connection.level}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{connection.username}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                      <span>{connection.pixels} pixels</span>
                                      <span>{connection.followers} seguidores</span>
                                      <span>{connection.lastSeen}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    variant={connection.isFollowing ? "outline" : "default"}
                                    size="sm"
                                    onClick={() => handleFollowUser(connection.id)}
                                    className="flex-1 min-h-[32px] cursor-pointer"
                                  >
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    {connection.isFollowing ? 'A Seguir' : 'Seguir'}
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendMessage(connection.id)}
                                    className="flex-1 min-h-[32px] cursor-pointer"
                                  >
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Mensagem
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewProfile(connection.id)}
                                    className="min-h-[32px] cursor-pointer"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Configurações */}
              <TabsContent value="settings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-primary" />
                      Configurações do Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-6 pb-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Perfil Público</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Mostrar Pixels</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Mostrar Conquistas</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Permitir Mensagens</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="font-semibold">Notificações</h3>
                          <div className="flex items-center justify-between">
                            <Label>Novos Seguidores</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Mensagens</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Likes nos Pixels</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <Button 
                          onClick={() => setShowEditModal(true)}
                          className="w-full min-h-[44px]"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar Perfil Completo
                        </Button>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* MODAL: Editar Perfil */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="w-[95vw] h-[92vh] max-w-md p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center">
              <Edit3 className="h-5 w-5 mr-2 text-primary" />
              Editar Perfil
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="min-h-[44px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input 
                    id="location" 
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="min-h-[44px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    className="min-h-[44px]"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 min-h-[44px]"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    setShowEditModal(false);
                    toast({
                      title: "✅ Perfil Atualizado!",
                      description: "As suas informações foram guardadas com sucesso.",
                    });
                  }}
                  className="flex-1 min-h-[44px]"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* MODAL: Convidar Amigos */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
              Convidar Amigos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                <Label>Link de Convite</Label>
                <div className="flex gap-2">
                  <Input value={inviteLink} readOnly className="min-h-[44px]" />
                  <Button onClick={handleCopyInviteLink} className="min-h-[44px]">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-500 mb-1">Recompensas por Convite:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 25 créditos por envio de convite</li>
                <li>• 100 créditos quando o amigo se registar</li>
                <li>• 15 XP por cada convite enviado</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowInviteModal(false)}
                className="flex-1 min-h-[44px]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleInviteFriend}
                className="flex-1 min-h-[44px]"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: Detalhes do Pixel */}
      <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              Detalhes do Pixel
            </DialogTitle>
          </DialogHeader>
          {selectedPixel && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4">
                {/* Imagem do Pixel */}
                <div className="text-center">
                  <div 
                    className="w-32 h-32 mx-auto rounded-lg border-4 border-primary/30 flex items-center justify-center text-6xl font-bold shadow-lg"
                    style={{ backgroundColor: selectedPixel.color }}
                  >
                    🎨
                  </div>
                  <h3 className="text-xl font-bold mt-3">{selectedPixel.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPixel.description}</p>
                </div>
                
                {/* Informações Básicas */}
                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Coordenadas:</span>
                        <p className="font-mono font-bold">({selectedPixel.x}, {selectedPixel.y})</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Região:</span>
                        <p className="font-semibold">{selectedPixel.region}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-bold text-primary">€{selectedPixel.value}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Raridade:</span>
                        <Badge variant="outline">{selectedPixel.rarity}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="text-center p-3">
                    <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="font-bold">{selectedPixel.views}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </Card>
                  <Card className="text-center p-3">
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="font-bold">{selectedPixel.likes}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </Card>
                  <Card className="text-center p-3">
                    <MessageSquare className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="font-bold">{selectedPixel.comments}</p>
                    <p className="text-xs text-muted-foreground">Comentários</p>
                  </Card>
                </div>
                
                {/* Características */}
                {selectedPixel.features && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Características:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPixel.features.map((feature: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Ações */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedPixel.title,
                          text: `Confira este pixel incrível em ${selectedPixel.region}!`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "🔗 Link Copiado!",
                          description: "Link do pixel copiado para a área de transferência.",
                        });
                      }
                    }}
                    className="flex-1 min-h-[44px]"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar
                  </Button>
                  <Button 
                    onClick={() => {
                      const url = `https://www.google.com/maps?q=${selectedPixel.x},${selectedPixel.y}&z=18`;
                      window.open(url, '_blank');
                    }}
                    className="flex-1 min-h-[44px]"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: Detalhes da Conquista */}
      <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Detalhes da Conquista
            </DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4">
                {/* Header da Conquista */}
                <div className="text-center">
                  <div className="p-4 bg-yellow-500/20 rounded-full w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                    {React.cloneElement(selectedAchievement.icon as React.ReactElement, { 
                      className: "h-10 w-10 text-yellow-500" 
                    })}
                  </div>
                  <h3 className="text-xl font-bold">{selectedAchievement.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedAchievement.overallDescription}
                  </p>
                  <div className="flex justify-center gap-2 mt-3">
                    <Badge variant="outline">{selectedAchievement.category}</Badge>
                    <Badge className="bg-yellow-500">Desbloqueada</Badge>
                  </div>
                </div>
                
                {/* Níveis da Conquista */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Níveis de Progresso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedAchievement.tiers.map((tier: any, index: number) => (
                      <Card key={index} className={cn(
                        "p-3",
                        tier.isUnlocked ? "bg-green-500/10 border-green-500/30" : "bg-muted/20"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {tier.isUnlocked ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-semibold">Nível {tier.level}</span>
                          </div>
                          {tier.isUnlocked && (
                            <Badge className="bg-green-500 text-xs">Completo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-primary" />
                            +{tier.xpReward} XP
                          </span>
                          <span className="flex items-center gap-1">
                            <Coins className="h-3 w-3 text-accent" />
                            +{tier.creditsReward}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Ações */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleShareAchievement}
                    className="flex-1 min-h-[44px]"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar
                  </Button>
                  <Button 
                    onClick={() => setShowAchievementModal(false)}
                    className="flex-1 min-h-[44px]"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: Enviar Mensagem */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
              Enviar Mensagem
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} data-ai-hint="profile avatar" />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedUser.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Escreva a sua mensagem..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 min-h-[44px]"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSendMessageSubmit}
                  className="flex-1 min-h-[44px]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: Perfil Público */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="w-[95vw] max-w-md">
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
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto border-4 border-primary">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} data-ai-hint="profile avatar" />
                    <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mt-3">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.username}</p>
                  <Badge variant="secondary" className="mt-2">Nível {selectedUser.level}</Badge>
                </div>
                
                {/* Bio */}
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-center italic">&quot;{selectedUser.bio}&quot;</p>
                  </CardContent>
                </Card>
                
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">{selectedUser.pixels}</p>
                    <p className="text-xs text-muted-foreground">Pixels</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-500">{selectedUser.followers}</p>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-500">{selectedUser.following}</p>
                    <p className="text-xs text-muted-foreground">A Seguir</p>
                  </div>
                </div>
                
                {/* Ações */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleFollowUser(selectedUser.id)}
                    className="w-full min-h-[44px]"
                    variant={selectedUser.isFollowing ? "outline" : "default"}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {selectedUser.isFollowing ? 'A Seguir' : 'Seguir'}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowProfileModal(false);
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
                        const shareText = `Confira o perfil de ${selectedUser.name} no Pixel Universe!`;
                        if (navigator.share) {
                          navigator.share({
                            title: 'Perfil no Pixel Universe',
                            text: shareText,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(shareText);
                          toast({
                            title: "🔗 Perfil Partilhado!",
                            description: "Link copiado para a área de transferência.",
                          });
                        }
                      }}
                      className="min-h-[44px]"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
