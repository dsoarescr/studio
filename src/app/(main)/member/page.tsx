'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { motion } from "framer-motion";
import { 
  User, MapPin, Trophy, Coins, Gift, Star, Crown, Eye, Heart, 
  Share2, Edit, Settings, Calendar, TrendingUp, Award, Gem,
  Palette, Users, Globe, Camera, Video, Music, Link as LinkIcon,
  Instagram, Twitter, Youtube, Github, Linkedin, Facebook
} from "lucide-react";

interface UserProfile {
  personalInfo: {
    displayName: string;
    username: string;
    bio: string;
    location: string;
    joinDate: string;
    avatar: string;
  };
  stats: {
    level: number;
    xp: number;
    xpMax: number;
    pixels: number;
    followers: number;
    following: number;
    totalViews: number;
    totalLikes: number;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    rarity: string;
    unlockedAt: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: React.ReactNode;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    icon: React.ReactNode;
  }>;
}

export default function MemberPage() {
  const { user } = useAuth();
  const { 
    credits, 
    specialCredits, 
    level, 
    xp, 
    xpMax, 
    pixels, 
    achievements,
    isPremium,
    isVerified
  } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    personalInfo: {
      displayName: user?.displayName || 'PixelMaster',
      username: '@pixelmaster',
      bio: 'Criador de identidades digitais únicas no Pixel Universe 🎨✨',
      location: 'Lisboa, Portugal',
      joinDate: '2024-01-15',
      avatar: user?.photoURL || 'https://placehold.co/120x120.png'
    },
    stats: {
      level,
      xp,
      xpMax,
      pixels,
      followers: 1234,
      following: 567,
      totalViews: 15420,
      totalLikes: 2340
    },
    achievements: [
      {
        id: '1',
        name: 'Primeiro Pixel',
        description: 'Comprou seu primeiro pixel',
        icon: <MapPin className="h-4 w-4" />,
        rarity: 'Comum',
        unlockedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Colecionador',
        description: 'Possui 10 pixels únicos',
        icon: <Gem className="h-4 w-4" />,
        rarity: 'Raro',
        unlockedAt: '2024-02-01'
      },
      {
        id: '3',
        name: 'Influenciador',
        description: 'Alcançou 1000 seguidores',
        icon: <Users className="h-4 w-4" />,
        rarity: 'Épico',
        unlockedAt: '2024-02-15'
      }
    ],
    socialLinks: [
      {
        platform: 'Instagram',
        url: 'https://instagram.com/pixelmaster',
        icon: <Instagram className="h-4 w-4" />
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/pixelmaster',
        icon: <Twitter className="h-4 w-4" />
      }
    ],
    recentActivity: [
      {
        type: 'pixel_purchase',
        description: 'Comprou pixel em Lisboa (245, 156)',
        timestamp: '2h atrás',
        icon: <ShoppingCart className="h-4 w-4" />
      },
      {
        type: 'achievement',
        description: 'Desbloqueou "Mestre das Cores"',
        timestamp: '1d atrás',
        icon: <Trophy className="h-4 w-4" />
      },
      {
        type: 'social',
        description: 'Ganhou 50 novos seguidores',
        timestamp: '2d atrás',
        icon: <Users className="h-4 w-4" />
      }
    ]
  });

  const xpPercentage = (profile.stats.xp / profile.stats.xpMax) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 max-w-6xl space-y-6">
        {/* Profile Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardContent className="p-8 relative">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar e Info Básica */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl">
                    <AvatarImage src={profile.personalInfo.avatar} />
                    <AvatarFallback className="text-4xl font-headline">
                      {profile.personalInfo.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isPremium && (
                    <Crown className="absolute -top-2 -right-2 h-8 w-8 text-amber-500" />
                  )}
                  {isVerified && (
                    <Star className="absolute -bottom-2 -right-2 h-6 w-6 text-blue-500 fill-current bg-background rounded-full p-1" />
                  )}
                </div>
                
                <div className="text-center lg:text-left mt-4">
                  <h1 className="text-3xl font-headline font-bold text-gradient-gold">
                    {profile.personalInfo.displayName}
                  </h1>
                  <p className="text-muted-foreground font-code">{profile.personalInfo.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="text-sm">{profile.personalInfo.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{profile.stats.pixels}</div>
                    <div className="text-sm text-muted-foreground">Pixels</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{profile.stats.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Seguidores</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{profile.stats.following}</div>
                    <div className="text-sm text-muted-foreground">Seguindo</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{profile.stats.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Visualizações</div>
                  </div>
                </div>
                
                {/* XP Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nível {profile.stats.level}</span>
                    <span className="text-sm text-muted-foreground font-code">
                      {profile.stats.xp.toLocaleString()} / {profile.stats.xpMax.toLocaleString()} XP
                    </span>
                  </div>
                  <Progress value={xpPercentage} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {profile.stats.xpMax - profile.stats.xp} XP para o próximo nível
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mt-6">
              <p className="text-lg leading-relaxed">{profile.personalInfo.bio}</p>
            </div>
            
            {/* Social Links */}
            {profile.socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {profile.socialLinks.map((link, index) => (
                  <Button key={index} variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.icon}
                      <span className="ml-2">{link.platform}</span>
                    </a>
                  </Button>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Partilhar Perfil
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <User className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="pixels">
              <Palette className="h-4 w-4 mr-2" />
              Pixels ({profile.stats.pixels})
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="h-4 w-4 mr-2" />
              Conquistas ({achievements})
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Calendar className="h-4 w-4 mr-2" />
              Atividade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recursos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-primary" />
                    Recursos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-primary" />
                      <span>Créditos</span>
                    </div>
                    <span className="font-bold text-primary">{credits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-accent" />
                      <span>Especiais</span>
                    </div>
                    <span className="font-bold text-accent">{specialCredits.toLocaleString()}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Comprar Mais Créditos
                  </Button>
                </CardContent>
              </Card>
              
              {/* Conquistas Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Conquistas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
                      <div className="p-2 bg-yellow-500/20 rounded">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground">{achievement.unlockedAt}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Todas as Conquistas
                  </Button>
                </CardContent>
              </Card>
              
              {/* Atividade Recente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-500" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="p-1 bg-muted/20 rounded">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p>{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pixels" className="space-y-6">
            <div className="text-center py-8">
              <Palette className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Seus Pixels Aparecerão Aqui</h3>
              <p className="text-muted-foreground mb-6">
                Compre pixels no mapa para criar suas identidades digitais únicas
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <MapPin className="h-4 w-4 mr-2" />
                Explorar Mapa
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.achievements.map(achievement => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Desbloqueado em {achievement.unlockedAt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Linha do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="p-2 bg-primary/20 rounded-full">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}