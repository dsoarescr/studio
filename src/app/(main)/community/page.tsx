'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Heart, MessageSquare, Share2, Send, Camera, MapPin,
  Star, Crown, Gem, Eye, ThumbsUp, Bookmark, MoreHorizontal,
  Plus, Search, Filter, TrendingUp, Flame, Globe, Calendar,
  Award, Target, Zap, Sparkles, Music, Video, Image as ImageIcon,
  UserPlus, Bell, Settings, Grid, List, Map as MapIcon, Play,
  Pause, Volume2, VolumeX, Smile, Gift, Coins, Trophy
} from "lucide-react";
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    location?: string;
  };
  content: {
    text?: string;
    media?: {
      type: 'image' | 'video' | 'pixel' | 'story';
      url: string;
      thumbnail?: string;
    };
    pixel?: {
      x: number;
      y: number;
      region: string;
      name: string;
      identity: {
        name: string;
        theme: string;
        description: string;
      };
    };
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  location?: {
    region: string;
    coordinates: { x: number; y: number };
  };
  type: 'post' | 'story' | 'showcase' | 'sale';
}

interface CommunityUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  level: number;
  followers: number;
  following: number;
  pixels: number;
  region: string;
  isFollowing: boolean;
  isNearby: boolean;
  lastActive: string;
  pixelValue: number;
  specialization: string;
}

interface Story {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  media: {
    type: 'image' | 'video';
    url: string;
  };
  timestamp: string;
  viewed: boolean;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'showcase',
    author: {
      name: 'PixelMaster',
      username: '@pixelmaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25,
      location: 'Lisboa'
    },
    content: {
      text: 'Acabei de criar esta identidade digital incrível no coração de Lisboa! 🎨✨ Cada detalhe foi pensado para representar a alma da nossa capital. O que acham?',
      media: {
        type: 'pixel',
        url: 'https://placehold.co/400x400/D4A757/FFFFFF?text=Lisboa+Digital+Identity'
      },
      pixel: {
        x: 245,
        y: 156,
        region: 'Lisboa',
        name: 'Coração de Lisboa',
        identity: {
          name: 'Portal do Tempo',
          theme: 'Histórico Dourado',
          description: 'Uma janela para a história eterna de Lisboa'
        }
      }
    },
    stats: {
      likes: 234,
      comments: 45,
      shares: 23,
      views: 1890
    },
    timestamp: '2h',
    isLiked: false,
    isBookmarked: false,
    tags: ['lisboa', 'identidade-digital', 'história', 'arte'],
    location: {
      region: 'Lisboa',
      coordinates: { x: 245, y: 156 }
    }
  },
  {
    id: '2',
    type: 'sale',
    author: {
      name: 'PortoCreative',
      username: '@portocreative',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18,
      location: 'Porto'
    },
    content: {
      text: '🔥 VENDA ESPECIAL! Este pixel único no Porto está disponível por tempo limitado! Perfeito para quem quer uma identidade digital na Invicta! 💎',
      media: {
        type: 'pixel',
        url: 'https://placehold.co/400x300/7DF9FF/000000?text=Porto+Premium+Sale'
      },
      pixel: {
        x: 123,
        y: 89,
        region: 'Porto',
        name: 'Alma do Douro',
        identity: {
          name: 'Espírito Portuense',
          theme: 'Azul Oceânico',
          description: 'Conectado à energia do rio Douro'
        }
      }
    },
    stats: {
      likes: 156,
      comments: 67,
      shares: 34,
      views: 890
    },
    timestamp: '4h',
    isLiked: true,
    isBookmarked: true,
    tags: ['porto', 'venda', 'premium', 'douro'],
    location: {
      region: 'Porto',
      coordinates: { x: 123, y: 89 }
    }
  },
  {
    id: '3',
    type: 'story',
    author: {
      name: 'CoimbraStudent',
      username: '@coimbrastudent',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 8,
      location: 'Coimbra'
    },
    content: {
      text: 'Primeira semana no Pixel Universe! 🎓 Criei minha identidade digital em Coimbra e já estou viciado! A comunidade aqui é incrível! 📚✨',
      media: {
        type: 'story',
        url: 'https://placehold.co/400x600/9C27B0/FFFFFF?text=Coimbra+Story'
      }
    },
    stats: {
      likes: 89,
      comments: 23,
      shares: 12,
      views: 456
    },
    timestamp: '1d',
    isLiked: false,
    isBookmarked: false,
    tags: ['coimbra', 'iniciante', 'universidade', 'primeira-vez']
  }
];

const mockNearbyUsers: CommunityUser[] = [
  {
    id: '1',
    name: 'LisboaArtist',
    username: '@lisboaartist',
    avatar: 'https://placehold.co/40x40.png',
    verified: true,
    level: 22,
    followers: 1234,
    following: 567,
    pixels: 89,
    region: 'Lisboa',
    isFollowing: false,
    isNearby: true,
    lastActive: '5m',
    pixelValue: 2340,
    specialization: 'Arte Digital'
  },
  {
    id: '2',
    name: 'PixelCollector',
    username: '@pixelcollector',
    avatar: 'https://placehold.co/40x40.png',
    verified: false,
    level: 19,
    followers: 890,
    following: 234,
    pixels: 156,
    region: 'Lisboa',
    isFollowing: true,
    isNearby: true,
    lastActive: '1h',
    pixelValue: 4560,
    specialization: 'Colecionador'
  },
  {
    id: '3',
    name: 'PortoInvestor',
    username: '@portoinvestor',
    avatar: 'https://placehold.co/40x40.png',
    verified: true,
    level: 30,
    followers: 2340,
    following: 123,
    pixels: 234,
    region: 'Porto',
    isFollowing: false,
    isNearby: false,
    lastActive: '2h',
    pixelValue: 8900,
    specialization: 'Investidor'
  }
];

const mockStories: Story[] = [
  {
    id: '1',
    author: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    media: {
      type: 'video',
      url: 'https://placehold.co/300x500/D4A757/FFFFFF?text=Story+1'
    },
    timestamp: '2h',
    viewed: false
  },
  {
    id: '2',
    author: {
      name: 'PortoCreative',
      avatar: 'https://placehold.co/40x40.png',
      verified: false
    },
    media: {
      type: 'image',
      url: 'https://placehold.co/300x500/7DF9FF/000000?text=Story+2'
    },
    timestamp: '4h',
    viewed: true
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [nearbyUsers, setNearbyUsers] = useState(mockNearbyUsers);
  const [stories, setStories] = useState(mockStories);
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [playLikeSound, setPlayLikeSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  const { user } = useAuth();
  const { addXp, addCredits } = useUserStore();
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            stats: { 
              ...post.stats, 
              likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1 
            }
          }
        : post
    ));
    
    setPlayLikeSound(true);
    addXp(2);
    
    const post = posts.find(p => p.id === postId);
    if (post && !post.isLiked) {
      toast({
        title: "❤️ Post Curtido!",
        description: `Você curtiu o post de ${post.author.name}`,
      });
    }
  };

  const handleComment = (postId: string) => {
    addXp(5);
    toast({
      title: "💬 Comentário",
      description: "Sistema de comentários em desenvolvimento!",
    });
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.share) {
      navigator.share({
        title: `Post de ${post.author.name}`,
        text: post.content.text || 'Confira este pixel incrível!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "📤 Partilhado!",
        description: "Link copiado para a área de transferência",
      });
    }
    
    addXp(3);
  };

  const handleFollow = (userId: string) => {
    setNearbyUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            isFollowing: !user.isFollowing,
            followers: user.isFollowing ? user.followers - 1 : user.followers + 1
          }
        : user
    ));
    
    const targetUser = nearbyUsers.find(u => u.id === userId);
    addXp(10);
    
    toast({
      title: targetUser?.isFollowing ? "Deixou de Seguir" : "🎉 Seguindo!",
      description: `${targetUser?.name} ${targetUser?.isFollowing ? '' : '- Ganhou 10 XP!'}`,
    });
  };

  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post: CommunityPost = {
      id: Date.now().toString(),
      type: 'post',
      author: {
        name: user?.displayName || 'Você',
        username: '@você',
        avatar: user?.photoURL || 'https://placehold.co/40x40.png',
        verified: true,
        level: 15,
        location: 'Lisboa'
      },
      content: {
        text: newPost
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 1
      },
      timestamp: 'agora',
      isLiked: false,
      isBookmarked: false,
      tags: newPost.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [],
      location: {
        region: 'Lisboa',
        coordinates: { x: 245, y: 156 }
      }
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    addXp(15);
    addCredits(5);
    
    setShowConfetti(true);
    
    toast({
      title: "📱 Post Criado!",
      description: "Sua publicação foi partilhada! +15 XP, +5 créditos",
    });
  };

  const handleBuyPixelFromPost = (post: CommunityPost) => {
    if (post.content.pixel) {
      toast({
        title: "🛒 Compra Rápida",
        description: `Redirecionando para comprar pixel (${post.content.pixel.x}, ${post.content.pixel.y})`,
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    switch (selectedFilter) {
      case 'nearby':
        return post.location && nearbyUsers.some(u => u.region === post.location?.region);
      case 'following':
        return nearbyUsers.some(u => u.name === post.author.name && u.isFollowing);
      case 'trending':
        return post.stats.likes > 100;
      case 'sales':
        return post.type === 'sale';
      case 'showcases':
        return post.type === 'showcase';
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.NOTIFICATION} play={playLikeSound} onEnd={() => setPlayLikeSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-6xl space-y-6 mb-20">
        {/* Header estilo Instagram */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-headline text-gradient-gold flex items-center">
                  <Users className="h-7 w-7 mr-3" />
                  Pixel Community
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Conecte-se, partilhe e descubra identidades digitais únicas
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Story
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Stories e Utilizadores */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Play className="h-5 w-5 mr-2 text-purple-500" />
                  Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Add Story */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 border-2 border-dashed border-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs mt-1">Adicionar</span>
                  </div>
                  
                  {/* Stories */}
                  {stories.map(story => (
                    <div key={story.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                      <div className={`w-16 h-16 rounded-full p-1 ${story.viewed ? 'bg-gray-300' : 'bg-gradient-to-r from-primary to-accent'}`}>
                        <Avatar className="w-full h-full">
                          <AvatarImage src={story.author.avatar} />
                          <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs mt-1 truncate w-16 text-center">{story.author.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Utilizadores Próximos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Na Sua Região
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-primary/30">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">{user.name}</span>
                        {user.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.specialization}</p>
                      <p className="text-xs text-accent">€{user.pixelValue} em pixels</p>
                    </div>
                    <Button
                      variant={user.isFollowing ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                      className="text-xs touch-target"
                    >
                      {user.isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { tag: '#LisboaDigital', posts: '234 posts', trend: '+45%' },
                  { tag: '#PixelArt', posts: '156 posts', trend: '+23%' },
                  { tag: '#PortugalPixels', posts: '89 posts', trend: '+67%' },
                  { tag: '#IdentidadeDigital', posts: '67 posts', trend: '+89%' }
                ].map((trend, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/20 rounded cursor-pointer transition-colors">
                    <div>
                      <span className="font-medium text-primary">{trend.tag}</span>
                      <p className="text-xs text-muted-foreground">{trend.posts}</p>
                    </div>
                    <Badge className="bg-green-500 text-xs">
                      {trend.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Criar Post estilo Instagram */}
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.photoURL || 'https://placehold.co/40x40.png'} />
                    <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Partilhe sua identidade digital, mostre seus pixels ou conte sua história... Use #hashtags!"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] resize-none border-none bg-muted/20 focus:bg-muted/30 transition-colors"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="touch-target">
                          <Camera className="h-4 w-4 mr-2" />
                          Foto
                        </Button>
                        <Button variant="outline" size="sm" className="touch-target">
                          <MapPin className="h-4 w-4 mr-2" />
                          Pixel
                        </Button>
                        <Button variant="outline" size="sm" className="touch-target">
                          <Video className="h-4 w-4 mr-2" />
                          Vídeo
                        </Button>
                      </div>
                      <Button 
                        onClick={createPost} 
                        disabled={!newPost.trim()}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 touch-target"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filtros estilo Instagram */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: Globe, count: posts.length },
                    { id: 'nearby', label: 'Próximos', icon: MapPin, count: posts.filter(p => p.location).length },
                    { id: 'following', label: 'Seguindo', icon: Users, count: posts.filter(p => nearbyUsers.some(u => u.name === p.author.name && u.isFollowing)).length },
                    { id: 'trending', label: 'Trending', icon: TrendingUp, count: posts.filter(p => p.stats.likes > 100).length },
                    { id: 'sales', label: 'Vendas', icon: ShoppingCart, count: posts.filter(p => p.type === 'sale').length },
                    { id: 'showcases', label: 'Showcase', icon: Star, count: posts.filter(p => p.type === 'showcase').length }
                  ].map(filter => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.id)}
                      className="flex items-center gap-2 whitespace-nowrap touch-target"
                    >
                      <filter.icon className="h-4 w-4" />
                      {filter.label}
                      <Badge variant="secondary" className="text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed estilo Instagram */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                      {/* Header do Post */}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/30">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{post.author.name}</span>
                                {post.author.verified && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  Nv.{post.author.level}
                                </Badge>
                                {post.type === 'sale' && (
                                  <Badge className="bg-green-500 text-xs">
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    VENDA
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{post.author.username}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
                                {post.author.location && (
                                  <>
                                    <span>•</span>
                                    <MapPin className="h-3 w-3" />
                                    <span>{post.author.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon" className="touch-target">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Conteúdo do Post */}
                        {post.content.text && (
                          <div className="mb-4">
                            <p className="leading-relaxed text-base">{post.content.text}</p>
                          </div>
                        )}

                        {/* Media - estilo Instagram */}
                        {post.content.media && (
                          <div className="mb-4 rounded-xl overflow-hidden">
                            {post.content.media.type === 'video' ? (
                              <div className="relative">
                                <img 
                                  src={post.content.media.thumbnail || post.content.media.url} 
                                  alt="Post media"
                                  className="w-full h-80 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Button size="icon" className="rounded-full bg-white/90 text-black hover:bg-white w-16 h-16">
                                    <Play className="h-8 w-8" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={post.content.media.url} 
                                alt="Post media"
                                className="w-full h-80 object-cover cursor-pointer hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                        )}

                        {/* Pixel Showcase */}
                        {post.content.pixel && (
                          <Card className="mb-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary rounded-xl border-2 border-primary/30 flex items-center justify-center">
                                  <MapPin className="h-8 w-8 text-primary-foreground" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg">{post.content.pixel.identity.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    ({post.content.pixel.x}, {post.content.pixel.y}) • {post.content.pixel.region}
                                  </p>
                                  <p className="text-sm">{post.content.pixel.identity.description}</p>
                                  <Badge className="mt-1">{post.content.pixel.identity.theme}</Badge>
                                </div>
                                {post.type === 'sale' && (
                                  <Button 
                                    onClick={() => handleBuyPixelFromPost(post)}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 touch-target"
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Comprar
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Ações estilo Instagram */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post.id)}
                                className={`${post.isLiked ? 'text-red-500' : ''} hover:scale-110 transition-transform touch-target p-2`}
                              >
                                <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current' : ''}`} />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleComment(post.id)}
                                className="hover:scale-110 transition-transform touch-target p-2"
                              >
                                <MessageSquare className="h-6 w-6" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(post)}
                                className="hover:scale-110 transition-transform touch-target p-2"
                              >
                                <Share2 className="h-6 w-6" />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="touch-target p-2"
                            >
                              <Bookmark className={`h-6 w-6 ${post.isBookmarked ? 'fill-current' : ''}`} />
                            </Button>
                          </div>

                          {/* Estatísticas */}
                          <div className="space-y-1">
                            <p className="font-bold text-sm">{post.stats.likes.toLocaleString()} curtidas</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{post.stats.views.toLocaleString()} visualizações</span>
                              <span>{post.stats.comments} comentários</span>
                              <span>{post.stats.shares} partilhas</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            <Card className="text-center p-6 border-dashed border-2 border-primary/30">
              <Button variant="outline" className="w-full touch-target">
                <Plus className="h-4 w-4 mr-2" />
                Carregar Mais Posts
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}