'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import {
  User,
  Settings,
  Trophy,
  Star,
  Crown,
  Palette,
  Calendar,
  MapPin,
  Users,
  Heart,
  Image as ImageIcon,
  Edit3,
  Camera,
  Upload,
  Link,
  Share2,
  Shield,
  Clock,
  Zap,
  Award,
  Gift,
  Sparkles,
  BookOpen,
  MessageSquare,
  Bell,
  Flag,
  Bookmark,
  Grid,
  BarChart3,
} from 'lucide-react';

interface UserStats {
  totalPixels: number;
  totalLikes: number;
  followers: number;
  following: number;
  achievements: number;
  createdAt: string;
  lastActive: string;
  reputation: number;
}

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  icon: React.ReactNode;
  unlockedAt?: string;
}

interface UserGalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  createdAt: string;
}

const mockUserStats: UserStats = {
  totalPixels: 1234,
  totalLikes: 567,
  followers: 89,
  following: 45,
  achievements: 23,
  createdAt: '2024-01-01',
  lastActive: '2024-03-20T14:30:00Z',
  reputation: 780,
};

const mockBadges: UserBadge[] = [
  {
    id: 'early_adopter',
    name: 'Pioneiro',
    description: 'Um dos primeiros a se juntar à plataforma',
    icon: <Star className="h-4 w-4" />,
    rarity: 'rare',
    unlockedAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 'pixel_master',
    name: 'Mestre dos Pixels',
    description: 'Criou mais de 1000 pixels',
    icon: <Crown className="h-4 w-4" />,
    rarity: 'epic',
    unlockedAt: '2024-02-15T16:30:00Z',
  },
];

export function EnhancedUserProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: 'Perfil Atualizado',
      description: 'Suas alterações foram salvas com sucesso!',
    });
    setIsEditing(false);
  };

  const handleFollowUser = () => {
    toast({
      title: 'Seguindo',
      description: 'Você começou a seguir este usuário.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="group relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {isEditing ? (
                    <Input defaultValue="João Silva" className="text-2xl font-bold" />
                  ) : (
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                      João Silva
                      <Badge variant="secondary">Nível 25</Badge>
                    </h2>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {isEditing ? (
                      <Input defaultValue="Porto, Portugal" className="w-40" />
                    ) : (
                      <span>Porto, Portugal</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile}>Salvar</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Button>
                      <Button variant="outline" onClick={handleFollowUser}>
                        <Users className="mr-2 h-4 w-4" />
                        Seguir
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  defaultValue="Artista pixel art apaixonado por criar paisagens e monumentos portugueses em pixels."
                  className="mt-2"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground">
                  Artista pixel art apaixonado por criar paisagens e monumentos portugueses em
                  pixels.
                </p>
              )}

              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{mockUserStats.followers}</span>
                  <span className="text-muted-foreground">seguidores</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{mockUserStats.totalLikes}</span>
                  <span className="text-muted-foreground">likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{mockUserStats.achievements}</span>
                  <span className="text-muted-foreground">conquistas</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <User className="mr-2 h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <Grid className="mr-2 h-4 w-4" />
                Galeria
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="mr-2 h-4 w-4" />
                Conquistas
              </TabsTrigger>
              <TabsTrigger value="badges">
                <Award className="mr-2 h-4 w-4" />
                Badges
              </TabsTrigger>
              <TabsTrigger value="stats">
                <BarChart3 className="mr-2 h-4 w-4" />
                Estatísticas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Conquista Desbloqueada</p>
                          <p className="text-sm text-muted-foreground">
                            Desbloqueou "Mestre dos Pixels"
                          </p>
                          <time className="text-xs text-muted-foreground">Há 2 horas</time>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Palette className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Nova Criação</p>
                          <p className="text-sm text-muted-foreground">
                            Criou uma nova pixel art: "Porto ao Pôr do Sol"
                          </p>
                          <time className="text-xs text-muted-foreground">Há 5 horas</time>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Palette className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{mockUserStats.totalPixels}</div>
                      <p className="text-sm text-muted-foreground">Total de Pixels</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Star className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{mockUserStats.reputation}</div>
                      <p className="text-sm text-muted-foreground">Reputação</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{mockUserStats.followers}</div>
                      <p className="text-sm text-muted-foreground">Seguidores</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Trophy className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">{mockUserStats.achievements}</div>
                      <p className="text-sm text-muted-foreground">Conquistas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Gallery Items */}
                <Card className="group cursor-pointer transition-colors hover:border-primary/50">
                  <CardContent className="relative aspect-square overflow-hidden p-0">
                    <img
                      src="/pixel-art/porto.png"
                      alt="Porto Pixel Art"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="text-white">
                        <h3 className="font-semibold">Porto ao Pôr do Sol</h3>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>42</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="pt-4">
              <div className="space-y-4">
                {mockBadges.map(badge => (
                  <Card key={badge.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">{badge.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{badge.name}</CardTitle>
                          <CardDescription>{badge.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-auto capitalize">
                          {badge.rarity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-PT')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="badges" className="pt-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {mockBadges.map(badge => (
                  <Card
                    key={badge.id}
                    className="text-center transition-colors hover:border-primary/50"
                  >
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4">
                        {badge.icon}
                      </div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{badge.description}</p>
                      <Badge variant="secondary" className="mt-4 capitalize">
                        {badge.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="pt-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Nível de Atividade</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Taxa de Engajamento</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Conquistas Completadas</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Histórico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Membro desde</span>
                          <span className="font-mono">
                            {new Date(mockUserStats.createdAt).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Última atividade</span>
                          <span className="font-mono">
                            {new Date(mockUserStats.lastActive).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conquistas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Total de conquistas</span>
                          <span className="font-mono">{mockUserStats.achievements}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Reputação total</span>
                          <span className="font-mono">{mockUserStats.reputation}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
