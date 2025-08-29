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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Trophy,
  ThumbsUp,
  MessageCircle,
  Send,
  Plus,
  Filter,
  Settings,
  Bell,
  UserPlus,
  Hash,
  Palette,
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  type: 'text' | 'pixel_art' | 'achievement';
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  tags: string[];
  isLiked: boolean;
  isSaved: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'contest' | 'collaboration' | 'workshop' | 'challenge';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  rewards?: {
    xp: number;
    credits: number;
    special?: string;
  };
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'João Silva',
      avatar: '/avatars/user1.jpg',
      level: 15,
    },
    content: 'Acabei de criar esta pixel art incrível da cidade do Porto!',
    type: 'pixel_art',
    image: '/pixel-art/porto.png',
    likes: 42,
    comments: 12,
    timestamp: '2024-03-20T14:30:00Z',
    location: 'Porto, Portugal',
    tags: ['pixelart', 'porto', 'portugal'],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Maria Santos',
      avatar: '/avatars/user2.jpg',
      level: 23,
    },
    content: 'Desbloqueei a conquista Mestre dos Pixels! 🏆',
    type: 'achievement',
    likes: 28,
    comments: 5,
    timestamp: '2024-03-20T13:15:00Z',
    tags: ['conquista', 'pixels'],
    isLiked: true,
    isSaved: true,
  },
];

const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Festival de Pixel Art',
    description:
      'Participe do maior festival de pixel art de Portugal! Crie, compartilhe e vote nas melhores obras.',
    type: 'contest',
    startDate: '2024-04-01T10:00:00Z',
    endDate: '2024-04-07T22:00:00Z',
    participants: 45,
    maxParticipants: 100,
    rewards: {
      xp: 1000,
      credits: 500,
      special: 'Badge Exclusiva do Festival',
    },
  },
  {
    id: 'event2',
    title: 'Workshop de Técnicas Avançadas',
    description: 'Aprenda técnicas avançadas de pixel art com artistas profissionais.',
    type: 'workshop',
    startDate: '2024-03-25T15:00:00Z',
    endDate: '2024-03-25T17:00:00Z',
    participants: 18,
    maxParticipants: 30,
    rewards: {
      xp: 300,
      credits: 150,
    },
  },
];

export function SocialHub() {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: 'Conteúdo Vazio',
        description: 'Por favor, adicione algum conteúdo à sua publicação.',
        variant: 'destructive',
      });
      return;
    }

    // Aqui você adicionaria a lógica para criar o post
    toast({
      title: 'Post Criado!',
      description: 'Sua publicação foi compartilhada com sucesso.',
    });
    setNewPostContent('');
  };

  const handleLike = (postId: string) => {
    // Aqui você adicionaria a lógica para dar like
    toast({
      title: 'Like!',
      description: 'Você curtiu esta publicação.',
    });
  };

  const handleJoinEvent = (eventId: string) => {
    // Aqui você adicionaria a lógica para participar do evento
    toast({
      title: 'Inscrito!',
      description: 'Você se inscreveu no evento com sucesso.',
    });
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Central Social
          </CardTitle>
          <CardDescription>
            Conecte-se com outros artistas, compartilhe suas criações e participe de eventos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-4">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Descobrir
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Amigos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              {/* Create Post */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/avatars/user.jpg" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea
                        placeholder="Compartilhe suas criações..."
                        value={newPostContent}
                        onChange={e => setNewPostContent(e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Imagem
                          </Button>
                          <Button variant="outline" size="sm">
                            <MapPin className="mr-2 h-4 w-4" />
                            Local
                          </Button>
                        </div>
                        <Button onClick={handleCreatePost}>
                          <Send className="mr-2 h-4 w-4" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts */}
              {mockPosts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Nível {post.author.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <time>{new Date(post.timestamp).toLocaleDateString('pt-PT')}</time>
                            {post.location && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {post.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{post.content}</p>
                    {post.image && (
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <img
                          src={post.image}
                          alt="Post image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={post.isLiked ? 'text-primary' : ''}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {post.comments}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartilhar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={post.isSaved ? 'text-primary' : ''}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              {mockEvents.map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {event.title}
                          <Badge variant="outline" className="text-xs">
                            {event.type === 'contest'
                              ? 'Concurso'
                              : event.type === 'workshop'
                                ? 'Workshop'
                                : event.type === 'collaboration'
                                  ? 'Colaboração'
                                  : 'Desafio'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {event.participants}/{event.maxParticipants} participantes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('pt-PT')} -
                          {new Date(event.endDate).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                      {event.rewards && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span>
                            {event.rewards.xp} XP + {event.rewards.credits} Créditos
                            {event.rewards.special && ` + ${event.rewards.special}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={event.participants >= event.maxParticipants}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {event.participants >= event.maxParticipants
                        ? 'Evento Lotado'
                        : 'Participar do Evento'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="discover" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="cursor-pointer transition-colors hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Artistas em Destaque
                    </CardTitle>
                    <CardDescription>
                      Descubra os artistas mais talentosos da comunidade
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="cursor-pointer transition-colors hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Competições Ativas
                    </CardTitle>
                    <CardDescription>Participe das competições em andamento</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="friends" className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <Users className="mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Encontre Amigos</h3>
                <p className="text-muted-foreground">
                  Conecte-se com outros artistas e expanda sua rede
                </p>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Procurar Amigos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
