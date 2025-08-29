'use client';

import React, { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Share2,
  Heart,
  UserPlus,
  Bell,
  MessageCircle,
  Star,
  CheckCircle,
  TrendingUp,
  Award,
  Users,
  Link,
  Copy,
  Twitter,
  Mail,
  Globe,
  Settings,
  ChevronRight,
  BarChart,
  Clock,
  Bookmark,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  isVerified: boolean;
  followers: number;
  following: number;
  totalSales: number;
  joinDate: Date;
  bio: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    date: Date;
  }[];
}

interface SocialFeaturesProps {
  userId: string;
  pixelId?: string;
  currentUserId?: string;
}

export function SocialFeatures({ userId, pixelId, currentUserId }: SocialFeaturesProps) {
  const [user, setUser] = useState<User>({
    id: userId,
    name: 'João Silva',
    avatar: '/avatars/user1.jpg',
    reputation: 950,
    isVerified: true,
    followers: 245,
    following: 182,
    totalSales: 56,
    joinDate: new Date('2023-01-15'),
    bio: 'Colecionador e vendedor de pixels premium em Portugal. Especializado em localizações históricas.',
    socialLinks: {
      website: 'https://joaosilva.com',
      twitter: '@joaosilva',
      instagram: '@joaosilva.pixels',
    },
    achievements: [
      {
        id: '1',
        title: 'Vendedor Premium',
        description: 'Mais de 50 vendas bem-sucedidas',
        icon: <Award className="h-6 w-6 text-yellow-500" />,
        date: new Date('2023-06-15'),
      },
      {
        id: '2',
        title: 'Influenciador',
        description: 'Mais de 200 seguidores',
        icon: <Users className="h-6 w-6 text-blue-500" />,
        date: new Date('2023-08-20'),
      },
      {
        id: '3',
        title: 'Pixel Raro',
        description: 'Vendeu um pixel por mais de 5000 créditos',
        icon: <Star className="h-6 w-6 text-purple-500" />,
        date: new Date('2023-12-01'),
      },
    ],
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    newListings: true,
    priceChanges: true,
    messages: true,
    promotions: false,
  });
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  const handleFollow = () => {
    if (!currentUserId) {
      toast({
        title: 'Autenticação Necessária',
        description: 'Faça login para seguir outros usuários',
        variant: 'destructive',
      });
      return;
    }

    setIsFollowing(!isFollowing);
    setUser(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));

    toast({
      title: isFollowing ? 'Deixou de Seguir' : 'Seguindo',
      description: isFollowing
        ? `Você deixou de seguir ${user.name}`
        : `Você está seguindo ${user.name}`,
    });
  };

  const handleShare = async (platform?: string) => {
    const url = `https://pixelmarket.com/pixel/${pixelId}`;
    const title = 'Confira este pixel incrível!';

    if (platform) {
      let shareUrl = '';
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
          break;
      }
      window.open(shareUrl, '_blank');
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Link Copiado',
          description: 'O link foi copiado para a área de transferência',
        });
      } catch (err) {
        toast({
          title: 'Erro',
          description: 'Não foi possível copiar o link',
          variant: 'destructive',
        });
      }
    }

    if (platform) {
      setShowShareDialog(false);
    }
  };

  const toggleFavorite = () => {
    if (!currentUserId) {
      toast({
        title: 'Autenticação Necessária',
        description: 'Faça login para adicionar aos favoritos',
        variant: 'destructive',
      });
      return;
    }

    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removido dos Favoritos' : 'Adicionado aos Favoritos',
      description: isFavorite
        ? 'O pixel foi removido dos seus favoritos'
        : 'O pixel foi adicionado aos seus favoritos',
    });
  };

  return (
    <div className="space-y-6">
      {/* Perfil do Usuário */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{user.name}</CardTitle>
                  {user.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <CardDescription>Membro desde {user.joinDate.toLocaleDateString()}</CardDescription>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary">{user.reputation} pontos</Badge>
                  <Badge variant="outline">{user.totalSales} vendas</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={isFollowing ? 'default' : 'outline'} onClick={handleFollow}>
                {isFollowing ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Seguindo
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Seguir
                  </>
                )}
              </Button>
              <Button variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Mensagem
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Sobre</h4>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Redes Sociais</h4>
                <div className="space-y-2">
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <Twitter className="h-4 w-4" />
                      {user.socialLinks.twitter}
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${user.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <Share2 className="h-4 w-4" />
                      {user.socialLinks.instagram}
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{user.followers}</p>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.following}</p>
                  <p className="text-sm text-muted-foreground">Seguindo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.totalSales}</p>
                  <p className="text-sm text-muted-foreground">Vendas</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              {user.achievements.map(achievement => (
                <Card key={achievement.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Conquistado em {achievement.date.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Desempenho de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-primary/20">
                        <div className="h-full bg-primary" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Satisfação dos Compradores
                        </span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-primary/20">
                        <div className="h-full bg-primary" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Tempo Médio de Resposta
                        </span>
                        <span className="font-medium">2h</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-primary/20">
                        <div className="h-full bg-primary" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">€15,750</div>
                      <p className="text-sm text-muted-foreground">Volume Total de Vendas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">98%</div>
                      <p className="text-sm text-muted-foreground">Entregas no Prazo</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notificações</CardTitle>
                  <CardDescription>Gerencie suas preferências de notificação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {key === 'newListings' && 'Novas Listagens'}
                            {key === 'priceChanges' && 'Alterações de Preço'}
                            {key === 'messages' && 'Mensagens'}
                            {key === 'promotions' && 'Promoções'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {key === 'newListings' && 'Receba alertas de novos pixels'}
                            {key === 'priceChanges' && 'Seja notificado sobre mudanças de preço'}
                            {key === 'messages' && 'Notificações de mensagens diretas'}
                            {key === 'promotions' && 'Receba ofertas especiais'}
                          </p>
                        </div>
                        <Button
                          variant={value ? 'default' : 'outline'}
                          onClick={() =>
                            setNotificationSettings(prev => ({
                              ...prev,
                              [key as keyof typeof prev]: !prev[key as keyof typeof prev],
                            }))
                          }
                        >
                          {value ? 'Ativado' : 'Desativado'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ações Sociais */}
      {pixelId && (
        <div className="flex gap-2">
          <Button
            variant={isFavorite ? 'default' : 'outline'}
            onClick={toggleFavorite}
            className="flex-1"
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </Button>

          <Button variant="outline" onClick={() => setShowShareDialog(true)} className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      )}

      {/* Modal de Compartilhamento */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Pixel</DialogTitle>
            <DialogDescription>Escolha como deseja compartilhar este pixel</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24" onClick={() => handleShare('twitter')}>
              <div className="text-center">
                <Twitter className="mx-auto mb-2 h-8 w-8" />
                <span>Twitter</span>
              </div>
            </Button>

            <Button variant="outline" className="h-24" onClick={() => handleShare('facebook')}>
              <div className="text-center">
                <Share2 className="mx-auto mb-2 h-8 w-8" />
                <span>Facebook</span>
              </div>
            </Button>

            <Button variant="outline" className="h-24" onClick={() => handleShare('whatsapp')}>
              <div className="text-center">
                {/* WhatsApp icon não existe em lucide-react; mostrar genérico */}
                <Share2 className="mx-auto mb-2 h-8 w-8" />
                <span>WhatsApp</span>
              </div>
            </Button>

            <Button variant="outline" className="h-24" onClick={() => handleShare('email')}>
              <div className="text-center">
                <Mail className="mx-auto mb-2 h-8 w-8" />
                <span>Email</span>
              </div>
            </Button>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={() => handleShare()}>
              <Link className="mr-2 h-4 w-4" />
              Copiar Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
