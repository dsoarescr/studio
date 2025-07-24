'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { SoundEffect, SOUND_EFFECTS } from "@/components/ui/sound-effect";
import { Confetti } from "@/components/ui/confetti";
import { motion } from "framer-motion";
import {
  User, Edit3, Camera, MapPin, Calendar, Award, Coins, Gift, 
  Trophy, Star, Crown, Gem, Heart, Eye, MessageSquare, Share2,
  Settings, Bell, Shield, Palette, Users, Globe, Link2, Save,
  Upload, Download, RefreshCw, Plus, Minus, X, Check, Info,
  BarChart3, PieChart, LineChart, TrendingUp, Activity, Clock,
  Bookmark, Tag, Image as ImageIcon, Video, Music, FileText,
  Zap, Target, Flame, Sparkles, Rocket, Lightning, Megaphone
} from "lucide-react";

interface UserStats {
  totalPixels: number;
  totalSpent: number;
  totalEarned: number;
  favoriteColor: string;
  mostActiveRegion: string;
  joinDate: string;
  lastActive: string;
  achievements: number;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  rank: number;
}

interface PixelActivity {
  id: string;
  type: 'purchase' | 'sale' | 'edit' | 'like' | 'comment';
  description: string;
  timestamp: string;
  value?: number;
  coordinates?: { x: number; y: number };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  xpReward: number;
  creditsReward: number;
}

const mockUserStats: UserStats = {
  totalPixels: 42,
  totalSpent: 1250,
  totalEarned: 890,
  favoriteColor: '#D4A757',
  mostActiveRegion: 'Lisboa',
  joinDate: '2024-01-15',
  lastActive: '2024-03-15T14:30:00Z',
  achievements: 8,
  level: 12,
  xp: 2450,
  xpMax: 3000,
  streak: 15,
  rank: 156
};

const mockRecentActivity: PixelActivity[] = [
  {
    id: '1',
    type: 'purchase',
    description: 'Comprou pixel em Lisboa',
    timestamp: '2024-03-15T10:30:00Z',
    value: 150,
    coordinates: { x: 245, y: 156 }
  },
  {
    id: '2',
    type: 'edit',
    description: 'Editou cor do pixel no Porto',
    timestamp: '2024-03-14T16:20:00Z',
    coordinates: { x: 123, y: 89 }
  },
  {
    id: '3',
    type: 'sale',
    description: 'Vendeu pixel em Coimbra',
    timestamp: '2024-03-13T09:15:00Z',
    value: 200,
    coordinates: { x: 178, y: 234 }
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Primeiro Pixel',
    description: 'Comprou seu primeiro pixel',
    icon: <MapPin className="h-6 w-6" />,
    rarity: 'common',
    unlockedAt: '2024-01-15T12:00:00Z',
    xpReward: 50,
    creditsReward: 10
  },
  {
    id: '2',
    name: 'Mestre das Cores',
    description: 'Usou 20 cores diferentes',
    icon: <Palette className="h-6 w-6" />,
    rarity: 'rare',
    unlockedAt: '2024-02-20T15:30:00Z',
    xpReward: 150,
    creditsReward: 50
  },
  {
    id: '3',
    name: 'Colecionador',
    description: 'Possui 25 pixels',
    icon: <Trophy className="h-6 w-6" />,
    rarity: 'epic',
    unlockedAt: '2024-03-10T11:45:00Z',
    xpReward: 300,
    creditsReward: 100
  }
];

export default function MemberPage() {
  const { user } = useAuth();
  const { credits, specialCredits, level, xp, xpMax, pixels, achievements, isPremium } = useUserStore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || 'PixelMaster',
    bio: 'Artista digital apaixonado por pixel art e criação colaborativa.',
    location: 'Lisboa, Portugal',
    website: 'https://meusite.com',
    favoriteColor: '#D4A757'
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const xpPercentage = (xp / xpMax) * 100;

  const handleSaveProfile = () => {
    setIsEditing(false);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    toast({
      title: "Perfil Atualizado",
      description: "Suas informações foram salvas com sucesso!",
    });
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copiado",
      description: "Link do seu perfil foi copiado para a área de transferência.",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Coins className="h-4 w-4 text-green-500" />;
      case 'sale': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'edit': return <Edit3 className="h-4 w-4 text-purple-500" />;
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-500/50';
      case 'rare': return 'text-blue-500 border-blue-500/50';
      case 'epic': return 'text-purple-500 border-purple-500/50';
      case 'legendary': return 'text-amber-500 border-amber-500/50';
      default: return 'text-gray-500 border-gray-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl mb-16">
        {/* Profile Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                    <AvatarImage 
                      src={user?.photoURL || `https://placehold.co/96x96/D4A757/FFFFFF?text=${profileData.displayName.charAt(0)}`} 
                      alt={profileData.displayName} 
                    />
                    <AvatarFallback className="text-2xl font-headline">
                      {profileData.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  </Button>
                  {isPremium && (
                    <Crown className="absolute -top-2 -left-2 h-6 w-6 text-amber-400" />
                  )}
                </div>
                
                <div className="text-center sm:text-left space-y-2">
                  {isEditing ? (
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      className="text-2xl font-headline font-bold"
                    />
                  ) : (
                    <h1 className="text-2xl font-headline font-bold text-gradient-gold">
                      {profileData.displayName}
                    </h1>
                  )}
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Badge variant="secondary" className="font-code">
                      Nível {level}
                    </Badge>
                    <Badge variant="outline" className="text-primary border-primary/50">
                      Rank #{mockUserStats.rank}
                    </Badge>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {isEditing ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          className="h-6 text-sm"
                        />
                      ) : (
                        profileData.location
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Desde {new Date(mockUserStats.joinDate).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 lg:text-right space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{pixels}</p>
                    <p className="text-xs text-muted-foreground">Pixels</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{achievements}</p>
                    <p className="text-xs text-muted-foreground">Conquistas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{mockUserStats.streak}</p>
                    <p className="text-xs text-muted-foreground">Sequência</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">{credits.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Créditos</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso XP</span>
                    <span className="font-code">{xp}/{xpMax}</span>
                  </div>
                  <Progress value={xpPercentage} className="h-2" />
                </div>
                
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button onClick={handleSaveProfile} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" onClick={handleShareProfile}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Partilhar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="mt-6 pt-6 border-t border-primary/20">
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Conte-nos sobre você..."
                  className="resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground italic">"{profileData.bio}"</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="overview" className="font-headline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="pixels" className="font-headline">
              <MapPin className="h-4 w-4 mr-2" />
              Meus Pixels
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-headline">
              <Trophy className="h-4 w-4 mr-2" />
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="activity" className="font-headline">
              <Activity className="h-4 w-4 mr-2" />
              Atividade
            </TabsTrigger>
            <TabsTrigger value="stats" className="font-headline">
              <PieChart className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Resumo da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{mockUserStats.totalPixels}</p>
                      <p className="text-sm text-muted-foreground">Total de Pixels</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{mockUserStats.totalEarned}€</p>
                      <p className="text-sm text-muted-foreground">Total Ganho</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <Coins className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{mockUserStats.totalSpent}€</p>
                      <p className="text-sm text-muted-foreground">Total Gasto</p>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                      <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{mockUserStats.achievements}</p>
                      <p className="text-sm text-muted-foreground">Conquistas</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cor Favorita</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-border"
                          style={{ backgroundColor: mockUserStats.favoriteColor }}
                        />
                        <span className="font-code text-sm">{mockUserStats.favoriteColor}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Região Mais Ativa</span>
                      <span className="font-medium">{mockUserStats.mostActiveRegion}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Última Atividade</span>
                      <span className="font-medium">{formatDate(mockUserStats.lastActive)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Trophy className="h-5 w-5 mr-2" />
                    Conquistas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                        <div className={cn("p-2 rounded-full", getRarityColor(achievement.rarity))}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pixels Tab */}
          <TabsContent value="pixels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-primary">
                    <MapPin className="h-5 w-5 mr-2" />
                    Meus Pixels ({mockUserStats.totalPixels})
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Galeria de pixels em desenvolvimento
                  </p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Comprar Primeiro Pixel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Trophy className="h-5 w-5 mr-2" />
                  Minhas Conquistas ({mockAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockAchievements.map((achievement) => (
                    <Card key={achievement.id} className={cn(
                      "border-2 transition-all hover:shadow-lg",
                      getRarityColor(achievement.rarity)
                    )}>
                      <CardContent className="p-4 text-center">
                        <div className="mb-3">
                          {achievement.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="flex justify-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            +{achievement.xpReward} XP
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{achievement.creditsReward} Créditos
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(achievement.unlockedAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Activity className="h-5 w-5 mr-2" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                      <div className="p-2 bg-background rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(activity.timestamp)}</span>
                          {activity.coordinates && (
                            <span className="font-code">
                              ({activity.coordinates.x}, {activity.coordinates.y})
                            </span>
                          )}
                          {activity.value && (
                            <span className="text-primary font-medium">
                              {activity.value}€
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <PieChart className="h-5 w-5 mr-2" />
                    Estatísticas Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">
                      +{(mockUserStats.totalEarned - mockUserStats.totalSpent).toFixed(0)}€
                    </p>
                    <p className="text-sm text-muted-foreground">Lucro Total</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Ganho</span>
                      <span className="text-green-500 font-medium">+{mockUserStats.totalEarned}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Gasto</span>
                      <span className="text-red-500 font-medium">-{mockUserStats.totalSpent}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI</span>
                      <span className="text-primary font-medium">
                        {((mockUserStats.totalEarned / mockUserStats.totalSpent - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Estatísticas de Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{mockUserStats.totalPixels}</p>
                      <p className="text-sm text-muted-foreground">Pixels Possuídos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">{mockUserStats.streak}</p>
                      <p className="text-sm text-muted-foreground">Dias Consecutivos</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Rank Global</span>
                      <span className="font-medium">#{mockUserStats.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Região Favorita</span>
                      <span className="font-medium">{mockUserStats.mostActiveRegion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo no Pixel Universe</span>
                      <span className="font-medium">
                        {Math.floor((Date.now() - new Date(mockUserStats.joinDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}