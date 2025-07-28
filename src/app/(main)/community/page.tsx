'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from "@/components/ui/sound-effect";
import { motion } from "framer-motion";
import {
  Users, MessageSquare, Heart, Share2, Eye, Clock, Star, Crown,
  Plus, Send, Image as ImageIcon, Video, Link2, Bookmark, Flag,
  ThumbsUp, ThumbsDown, Reply, Edit3, Trash2, MoreHorizontal,
  Palette, MapPin, Globe, Calendar, Award, Gem, Sparkles, Flame,
  Target, Zap, Activity, TrendingUp, Filter, Search, SortAsc,
  UserPlus, Settings, Bell, Shield, Info, ExternalLink, Download
} from "lucide-react";

interface CommunityPost {
  id: string;
  type: 'text' | 'image' | 'pixel' | 'collection' | 'event';
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    badges: string[];
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  pixelData?: {
    coordinates: { x: number; y: number };
    region: string;
    color: string;
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  isPinned: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'contest' | 'collaboration' | 'workshop' | 'exhibition';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize?: string;
  organizer: {
    name: string;
    avatar: string;
  };
  status: 'upcoming' | 'active' | 'ended';
  featured: boolean;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'pixel',
    author: {
      name: 'PixelArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 15,
      badges: ['premium', 'artist']
    },
    content: 'Acabei de criar este pixel incrível em Lisboa! O que acham da combinação de cores? 🎨',
    pixelData: {
      coordinates: { x: 245, y: 156 },
      region: 'Lisboa',
      color: '#D4A757'
    },
    likes: 89,
    comments: 23,
    shares: 12,
    views: 456,
    createdAt: '2024-03-15T10:30:00Z',
    tags: ['pixel-art', 'lisboa', 'cores'],
    isLiked: false,
    isBookmarked: false,
    isPinned: false
  },
  {
    id: '2',
    type: 'collection',
    author: {
      name: 'CollectorMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 22,
      badges: ['collector']
    },
    content: 'Minha nova coleção "Paisagens de Portugal" está quase completa! Faltam apenas 3 pixels para terminar o projeto. Alguém tem pixels na região do Alentejo para trocar?',
    media: {
      type: 'image',
      url: 'https://placehold.co/600x400/7DF9FF/000000?text=Paisagens+Portugal'
    },
    likes: 156,
    comments: 45,
    shares: 28,
    views: 1234,
    createdAt: '2024-03-14T16:20:00Z',
    tags: ['coleção', 'paisagens', 'portugal', 'troca'],
    isLiked: true,
    isBookmarked: true,
    isPinned: true
  },
  {
    id: '3',
    type: 'event',
    author: {
      name: 'EventOrganizer',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 30,
      badges: ['moderator', 'premium']
    },
    content: '🎉 CONCURSO DE PIXEL ART! Tema: "Tradições Portuguesas". Prémio: 1000 créditos especiais + badge exclusivo. Participem até 31 de Março!',
    likes: 234,
    comments: 67,
    shares: 89,
    views: 2345,
    createdAt: '2024-03-13T09:15:00Z',
    tags: ['concurso', 'pixel-art', 'tradições', 'prémio'],
    isLiked: false,
    isBookmarked: true,
    isPinned: true
  }
];

const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Concurso de Pixel Art - Tradições Portuguesas',
    description: 'Crie pixels que representem as tradições mais icónicas de Portugal',
    type: 'contest',
    startDate: '2024-03-15T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    participants: 156,
    maxParticipants: 500,
    prize: '1000 créditos especiais + badge exclusivo',
    organizer: {
      name: 'Pixel Universe Team',
      avatar: 'https://placehold.co/40x40.png'
    },
    status: 'active',
    featured: true
  },
  {
    id: '2',
    title: 'Workshop: Técnicas Avançadas de Pixel Art',
    description: 'Aprenda técnicas profissionais com artistas experientes',
    type: 'workshop',
    startDate: '2024-03-20T19:00:00Z',
    endDate: '2024-03-20T21:00:00Z',
    participants: 45,
    maxParticipants: 100,
    organizer: {
      name: 'PixelMaster Pro',
      avatar: 'https://placehold.co/40x40.png'
    },
    status: 'upcoming',
    featured: false
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState<string[]>(['2']);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>(['2', '3']);
  
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    
    if (!likedPosts.includes(postId)) {
      addXp(5);
      toast({
        title: "Post Curtido!",
        description: "Você ganhou 5 XP por interagir com a comunidade.",
      });
    }
  };

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    addCredits(10);
    addXp(25);
    setNewPostContent('');
    
    toast({
      title: "Post Criado!",
      description: "Seu post foi publicado com sucesso. Você ganhou 10 créditos e 25 XP!",
    });
  };

  const handleJoinEvent = (eventId: string) => {
    addXp(50);
    toast({
      title: "Evento Confirmado!",
      description: "Você se inscreveu no evento com sucesso. Ganhou 50 XP!",
    });
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'liked' && likedPosts.includes(post.id)) ||
      (selectedFilter === 'bookmarked' && bookmarkedPosts.includes(post.id)) ||
      (selectedFilter === 'pinned' && post.isPinned);
    
    return matchesSearch && matchesFilter;
  });

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
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
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl mb-16">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <Users className="h-8 w-8 mr-3 animate-glow" />
                  Comunidade
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Conecte-se com outros artistas, partilhe criações e participe em eventos
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Membros Online</p>
                  <p className="text-xl font-bold text-green-500">1,247</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Posts Hoje</p>
                  <p className="text-xl font-bold text-primary">89</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="feed" className="font-headline">
              <Activity className="h-4 w-4 mr-2"/>
              Feed
            </TabsTrigger>
            <TabsTrigger value="events" className="font-headline">
              <Calendar className="h-4 w-4 mr-2"/>
              Eventos
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="font-headline">
              <Trophy className="h-4 w-4 mr-2"/>
              Classificação
            </TabsTrigger>
            <TabsTrigger value="groups" className="font-headline">
              <Users className="h-4 w-4 mr-2"/>
              Grupos
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Partilhe algo com a comunidade..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Imagem
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Pixel
                      </Button>
                      <Button variant="outline" size="sm">
                        <Palette className="h-4 w-4 mr-2" />
                        Coleção
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publicar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'liked', label: 'Curtidos' },
                      { id: 'bookmarked', label: 'Salvos' },
                      { id: 'pinned', label: 'Fixados' }
                    ].map(filter => (
                      <Button
                        key={filter.id}
                        variant={selectedFilter === filter.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${post.isPinned ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{post.author.name}</span>
                              {post.author.verified && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              <Badge variant="secondary" className="text-xs">
                                Nível {post.author.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                              {post.isPinned && (
                                <Badge variant="outline" className="text-xs">
                                  Fixado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-foreground">{post.content}</p>
                      
                      {post.media && (
                        <div className="rounded-lg overflow-hidden">
                          <img 
                            src={post.media.url} 
                            alt="Post media"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      
                      {post.pixelData && (
                        <Card className="bg-muted/30 p-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded border-2 border-border"
                              style={{ backgroundColor: post.pixelData.color }}
                            />
                            <div>
                              <p className="font-medium">
                                Pixel ({post.pixelData.coordinates.x}, {post.pixelData.coordinates.y})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {post.pixelData.region}
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={likedPosts.includes(post.id) ? 'text-red-500' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                            {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {post.comments}
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            {post.shares}
                          </Button>
                          
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleBookmark(post.id)}
                          className={bookmarkedPosts.includes(post.id) ? 'text-primary' : ''}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockEvents.map((event) => (
                <Card key={event.id} className={`${event.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getEventStatusColor(event.status)}>
                        {event.status === 'active' ? 'Ativo' : 
                         event.status === 'upcoming' ? 'Em Breve' : 'Terminado'}
                      </Badge>
                      {event.featured && (
                        <Badge variant="outline" className="text-primary border-primary/50">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-accent" />
                        <span>{event.participants} participantes</span>
                      </div>
                    </div>
                    
                    {event.prize && (
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          <span className="font-medium text-accent">Prémio: {event.prize}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Organizado por {event.organizer.name}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={event.status === 'ended'}
                    >
                      {event.status === 'ended' ? 'Evento Terminado' : 'Participar'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Trophy className="h-5 w-5 mr-2" />
                  Top Contribuidores da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: 'PixelMaster', posts: 156, likes: 2340, level: 25 },
                    { rank: 2, name: 'ArtistaPro', posts: 134, likes: 1890, level: 22 },
                    { rank: 3, name: 'CommunityHero', posts: 98, likes: 1456, level: 20 }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={
                          user.rank === 1 ? 'bg-yellow-500' :
                          user.rank === 2 ? 'bg-gray-400' :
                          'bg-orange-500'
                        }>
                          #{user.rank}
                        </Badge>
                        <Avatar>
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name[0]}`} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">Nível {user.level}</p>
                        </div>
                      </div>
                      
                      <div className="ml-auto flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-primary">{user.posts}</p>
                          <p className="text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-red-500">{user.likes}</p>
                          <p className="text-muted-foreground">Likes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: '1',
                  name: 'Artistas de Lisboa',
                  description: 'Grupo para artistas da região de Lisboa',
                  members: 234,
                  posts: 45,
                  avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX'
                },
                {
                  id: '2',
                  name: 'Colecionadores Premium',
                  description: 'Grupo exclusivo para colecionadores premium',
                  members: 89,
                  posts: 23,
                  avatar: 'https://placehold.co/60x60/7DF9FF/000000?text=CP'
                },
                {
                  id: '3',
                  name: 'Pixel Art Iniciantes',
                  description: 'Espaço para quem está começando no pixel art',
                  members: 567,
                  posts: 123,
                  avatar: 'https://placehold.co/60x60/9C27B0/FFFFFF?text=PI'
                }
              ].map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-4">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <h3 className="font-semibold mb-2">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                    
                    <div className="flex justify-center gap-4 text-sm mb-4">
                      <div className="text-center">
                        <p className="font-bold text-primary">{group.members}</p>
                        <p className="text-muted-foreground">Membros</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-accent">{group.posts}</p>
                        <p className="text-muted-foreground">Posts</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Juntar-se
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}