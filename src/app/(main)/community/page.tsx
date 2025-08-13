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
  UserPlus, Bell, Settings, Grid, List, Map as MapIcon
} from "lucide-react";
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';

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
      type: 'image' | 'video' | 'pixel';
      url: string;
      thumbnail?: string;
    };
    pixel?: {
      x: number;
      y: number;
      region: string;
      name: string;
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
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'PixelMaster',
      username: '@pixelmaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25,
      location: 'Lisboa'
    },
    content: {
      text: 'Acabei de criar esta obra-prima no coração de Lisboa! 🎨✨ Cada pixel conta uma história única da nossa capital. O que acham?',
      media: {
        type: 'pixel',
        url: 'https://placehold.co/400x400/D4A757/FFFFFF?text=Lisboa+Art'
      },
      pixel: {
        x: 245,
        y: 156,
        region: 'Lisboa',
        name: 'Coração de Lisboa'
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
    tags: ['lisboa', 'arte', 'história'],
    location: {
      region: 'Lisboa',
      coordinates: { x: 245, y: 156 }
    }
  },
  {
    id: '2',
    author: {
      name: 'PortoCreative',
      username: '@portocreative',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18,
      location: 'Porto'
    },
    content: {
      text: 'Novo projeto colaborativo no Porto! Quem quer juntar-se? 🤝',
      media: {
        type: 'image',
        url: 'https://placehold.co/400x300/7DF9FF/000000?text=Porto+Collab'
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
    tags: ['porto', 'colaboração', 'projeto'],
    location: {
      region: 'Porto',
      coordinates: { x: 123, y: 89 }
    }
  },
  {
    id: '3',
    author: {
      name: 'CoimbraStudent',
      username: '@coimbrastudent',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 8,
      location: 'Coimbra'
    },
    content: {
      text: 'Primeira semana no Pixel Universe! Já comprei 5 pixels em Coimbra 🎓📚',
      media: {
        type: 'video',
        url: 'https://placehold.co/400x300/9C27B0/FFFFFF?text=Coimbra+Journey',
        thumbnail: 'https://placehold.co/400x300/9C27B0/FFFFFF?text=Video+Thumb'
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
    tags: ['coimbra', 'iniciante', 'universidade']
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
    lastActive: '5m'
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
    lastActive: '1h'
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [nearbyUsers, setNearbyUsers] = useState(mockNearbyUsers);
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [playLikeSound, setPlayLikeSound] = useState(false);
  
  const { user } = useAuth();
  const { addXp } = useUserStore();
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
  };

  const handleComment = (postId: string) => {
    toast({
      title: "Comentário",
      description: "Funcionalidade de comentários em desenvolvimento",
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
      toast({
        title: "Partilhado!",
        description: "Link copiado para a área de transferência",
      });
    }
  };

  const handleFollow = (userId: string) => {
    setNearbyUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ));
    
    const user = nearbyUsers.find(u => u.id === userId);
    toast({
      title: user?.isFollowing ? "Deixou de Seguir" : "Seguindo!",
      description: `${user?.name}`,
    });
  };

  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post: CommunityPost = {
      id: Date.now().toString(),
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
      tags: newPost.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || []
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    addXp(10);
    
    toast({
      title: "Post Criado! 📱",
      description: "Sua publicação foi partilhada com a comunidade",
    });
  };

  const filteredPosts = posts.filter(post => {
    switch (selectedFilter) {
      case 'nearby':
        return post.location && nearbyUsers.some(u => u.region === post.location?.region);
      case 'following':
        return nearbyUsers.some(u => u.name === post.author.name && u.isFollowing);
      case 'trending':
        return post.stats.likes > 100;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.NOTIFICATION} play={playLikeSound} onEnd={() => setPlayLikeSound(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-6xl space-y-6">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
                  <Users className="h-8 w-8 mr-3" />
                  Comunidade Pixel
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Conecte-se com outros criadores, partilhe suas obras e descubra pixels incríveis
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === 'feed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('feed')}
                >
                  <List className="h-4 w-4 mr-2" />
                  Feed
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Utilizadores Próximos */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Próximos de Si
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">{user.name}</span>
                        {user.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.region} • {user.pixels} pixels</p>
                    </div>
                    <Button
                      variant={user.isFollowing ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                      className="text-xs"
                    >
                      {user.isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { tag: '#LisboaArt', posts: '234 posts' },
                  { tag: '#PixelCollab', posts: '156 posts' },
                  { tag: '#PortugalPixels', posts: '89 posts' },
                  { tag: '#NewbieTips', posts: '67 posts' }
                ].map((trend, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/20 rounded cursor-pointer">
                    <span className="font-medium text-primary">{trend.tag}</span>
                    <span className="text-xs text-muted-foreground">{trend.posts}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Criar Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL || 'https://placehold.co/40x40.png'} />
                    <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Partilhe algo incrível com a comunidade... Use #tags para categorizar!"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Foto
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Pixel
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Vídeo
                        </Button>
                      </div>
                      <Button 
                        onClick={createPost} 
                        disabled={!newPost.trim()}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Todos', icon: Globe },
                    { id: 'nearby', label: 'Próximos', icon: MapPin },
                    { id: 'following', label: 'Seguindo', icon: Users },
                    { id: 'trending', label: 'Trending', icon: TrendingUp }
                  ].map(filter => (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.id)}
                      className="flex items-center gap-2"
                    >
                      <filter.icon className="h-4 w-4" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-6'}>
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Header do Post */}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
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
                                  Nv.{post.author.level}
                                </Badge>
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
                          
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Conteúdo do Post */}
                        {post.content.text && (
                          <p className="mb-3 leading-relaxed">{post.content.text}</p>
                        )}

                        {/* Media */}
                        {post.content.media && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            {post.content.media.type === 'video' ? (
                              <div className="relative">
                                <img 
                                  src={post.content.media.thumbnail || post.content.media.url} 
                                  alt="Post media"
                                  className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Button size="icon" className="rounded-full bg-white/90 text-black hover:bg-white">
                                    <Video className="h-6 w-6" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <img 
                                src={post.content.media.url} 
                                alt="Post media"
                                className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                        )}

                        {/* Pixel Info */}
                        {post.content.pixel && (
                          <Card className="mb-3 bg-primary/5 border-primary/20">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary rounded border-2 border-primary/30" />
                                <div>
                                  <h4 className="font-medium">{post.content.pixel.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    ({post.content.pixel.x}, {post.content.pixel.y}) • {post.content.pixel.region}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="ml-auto">
                                  Ver Pixel
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Estatísticas e Ações */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{post.stats.views.toLocaleString()} visualizações</span>
                            <span>{post.stats.likes} curtidas</span>
                            <span>{post.stats.comments} comentários</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={`${post.isLiked ? 'text-red-500' : ''} hover:scale-110 transition-transform`}
                            >
                              <Heart className={`h-5 w-5 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                              {post.stats.likes}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComment(post.id)}
                            >
                              <MessageSquare className="h-5 w-5 mr-2" />
                              {post.stats.comments}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post)}
                            >
                              <Share2 className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}