'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Heart, MessageSquare, Share2, Send, Camera, Video, Smile,
  MapPin, Calendar, Clock, Star, Crown, Gem, Eye, ThumbsUp, Bookmark,
  Plus, Search, Filter, TrendingUp, Globe, Hash, UserPlus, Settings,
  MoreHorizontal, Play, Pause, Volume2, VolumeX, Zap, Award, Gift,
  Image as ImageIcon, Music, Palette, Target, Flame, Sparkles, Bell,
  Edit, Trash2, Flag, Copy, ExternalLink, Download, Upload, Link2
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    followers: number;
  };
  content: {
    text?: string;
    images?: string[];
    video?: string;
    pixel?: {
      x: number;
      y: number;
      region: string;
      imageUrl: string;
    };
    poll?: {
      question: string;
      options: Array<{ text: string; votes: number }>;
      totalVotes: number;
    };
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  timestamp: string;
  location?: string;
  mood?: string;
  hashtags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
}

interface Story {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  isViewed: boolean;
  isLive?: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'PixelArtist',
      username: 'pixelartist_pt',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 15,
      followers: 1234
    },
    content: {
      text: 'Acabei de criar esta obra-prima em Lisboa! O que acham? 🎨✨ #pixelart #lisboa #arte',
      images: ['https://placehold.co/500x500/D4A757/FFFFFF?text=Arte+Lisboa'],
      pixel: {
        x: 245,
        y: 156,
        region: 'Lisboa',
        imageUrl: 'https://placehold.co/100x100/D4A757/FFFFFF?text=LX'
      }
    },
    engagement: {
      likes: 89,
      comments: 23,
      shares: 12,
      views: 456
    },
    timestamp: '2h',
    location: 'Lisboa, Portugal',
    mood: '🎨',
    hashtags: ['pixelart', 'lisboa', 'arte'],
    isLiked: false,
    isBookmarked: false,
    isFollowing: true
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'ColorMaster',
      username: 'colormaster_pro',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 12,
      followers: 567
    },
    content: {
      text: 'Novo recorde pessoal! 50 pixels numa semana! 🚀 Quem consegue bater?',
      poll: {
        question: 'Qual é o teu recorde semanal?',
        options: [
          { text: '1-10 pixels', votes: 45 },
          { text: '11-25 pixels', votes: 32 },
          { text: '26-50 pixels', votes: 18 },
          { text: '50+ pixels', votes: 12 }
        ],
        totalVotes: 107
      }
    },
    engagement: {
      likes: 156,
      comments: 45,
      shares: 28,
      views: 789
    },
    timestamp: '4h',
    mood: '🚀',
    hashtags: ['recorde', 'desafio', 'pixels'],
    isLiked: true,
    isBookmarked: true,
    isFollowing: false
  }
];

const mockStories: Story[] = [
  { id: '1', author: { name: 'Você', avatar: 'https://placehold.co/60x60.png' }, thumbnail: 'https://placehold.co/60x60/D4A757/FFFFFF?text=+', isViewed: false },
  { id: '2', author: { name: 'PixelPro', avatar: 'https://placehold.co/60x60.png' }, thumbnail: 'https://placehold.co/60x60/7DF9FF/000000?text=PP', isViewed: false, isLive: true },
  { id: '3', author: { name: 'ArtMaster', avatar: 'https://placehold.co/60x60.png' }, thumbnail: 'https://placehold.co/60x60/9C27B0/FFFFFF?text=AM', isViewed: true }
];

const trendingHashtags = [
  { tag: '#pixelart', posts: 2340 },
  { tag: '#lisboa', posts: 1890 },
  { tag: '#nft', posts: 1567 },
  { tag: '#tutorial', posts: 1234 },
  { tag: '#concurso', posts: 987 }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { addXp, addCredits } = useUserStore();

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para criar posts na comunidade.",
        variant: "destructive"
      });
      return;
    }

    if (!newPost.trim()) {
      toast({
        title: "Post Vazio",
        description: "Escreva algo antes de publicar.",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current_user',
        name: user.displayName || 'Você',
        username: 'voce_user',
        avatar: user.photoURL || 'https://placehold.co/40x40.png',
        verified: true,
        level: 15,
        followers: 0
      },
      content: {
        text: newPost,
        images: selectedImages.length > 0 ? ['https://placehold.co/500x500/D4A757/FFFFFF?text=Novo+Post'] : undefined
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 1
      },
      timestamp: 'agora',
      location: selectedLocation,
      mood: selectedMood,
      hashtags: newPost.match(/#\w+/g)?.map(tag => tag.substring(1)) || [],
      isLiked: false,
      isBookmarked: false,
      isFollowing: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedMood('');
    setSelectedLocation('');
    setSelectedImages([]);
    setShowCreatePost(false);

    // Recompensar utilizador
    addXp(25);
    addCredits(10);

    toast({
      title: "Post Criado! 🎉",
      description: "Seu post foi publicado na comunidade. +25 XP, +10 créditos!",
    });
  };

  const handleLike = (postId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir posts.",
        variant: "destructive"
      });
      return;
    }

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            engagement: {
              ...post.engagement,
              likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
            }
          }
        : post
    ));

    if (!posts.find(p => p.id === postId)?.isLiked) {
      addXp(5);
    }
  };

  const handleFollow = (userId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para seguir utilizadores.",
        variant: "destructive"
      });
      return;
    }

    setPosts(prev => prev.map(post => 
      post.author.id === userId 
        ? { ...post, isFollowing: !post.isFollowing }
        : post
    ));

    toast({
      title: "Seguindo!",
      description: "Agora você segue este utilizador.",
    });
  };

  const handleShare = (postId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Pixel Universe',
        text: 'Confira este post incrível!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "Link do post copiado para a área de transferência.",
      });
    }
  };

  const moods = ['😊', '🎨', '🚀', '💎', '🔥', '✨', '🎯', '💪', '🌟', '🎉'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 max-w-6xl mb-16">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
              <Users className="h-8 w-8 mr-3 animate-glow" />
              Comunidade Pixel Universe
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Conecte-se, partilhe e descubra arte pixel incrível com a nossa comunidade global
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Esquerda */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {mockStories.map(story => (
                    <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
                      <div className={cn(
                        "relative w-16 h-16 rounded-full p-1",
                        story.isViewed ? "bg-gray-300" : "bg-gradient-to-tr from-primary to-accent",
                        story.isLive && "animate-pulse"
                      )}>
                        <img 
                          src={story.thumbnail} 
                          alt={story.author.name}
                          className="w-full h-full rounded-full object-cover bg-background"
                        />
                        {story.isLive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-red-500 text-xs px-1">AO VIVO</Badge>
                          </div>
                        )}
                        {story.id === '1' && (
                          <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                            <Plus className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs mt-1 truncate w-16">{story.author.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingHashtags.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-primary font-medium cursor-pointer hover:underline">
                      {item.tag}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.posts.toLocaleString()} posts
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sugestões de Seguir */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sugestões para Seguir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'PixelMaster', username: '@pixelmaster', avatar: 'https://placehold.co/40x40.png', verified: true },
                  { name: 'ArtisticSoul', username: '@artisticsoul', avatar: 'https://placehold.co/40x40.png', verified: false },
                  { name: 'ColorWizard', username: '@colorwizard', avatar: 'https://placehold.co/40x40.png', verified: true }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">{user.name}</p>
                          {user.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{user.username}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Seguir</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Criar Post */}
            <Card>
              <CardContent className="p-4">
                {!user ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Faça login para participar da comunidade
                    </p>
                    <AuthModal>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Fazer Login
                      </Button>
                    </AuthModal>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL || 'https://placehold.co/40x40.png'} />
                        <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="O que está a acontecer no seu mundo pixel?"
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[80px] resize-none border-none bg-muted/20 focus:bg-muted/30"
                        />
                      </div>
                    </div>

                    {/* Opções de Post */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Foto
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Vídeo
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Palette className="h-4 w-4 mr-2" />
                          Pixel
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Local
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Mood Selector */}
                        <div className="flex gap-1">
                          {moods.slice(0, 5).map(mood => (
                            <Button
                              key={mood}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "text-lg p-1 h-8 w-8",
                                selectedMood === mood && "bg-primary/20"
                              )}
                              onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                            >
                              {mood}
                            </Button>
                          ))}
                        </div>

                        <Button 
                          onClick={handleCreatePost}
                          disabled={!newPost.trim()}
                          className="bg-gradient-to-r from-primary to-accent"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Post Header */}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{post.author.name}</h3>
                                {post.author.verified && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  Nível {post.author.level}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>@{post.author.username}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
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

                          <div className="flex items-center gap-2">
                            {post.mood && <span className="text-lg">{post.mood}</span>}
                            {!post.isFollowing && post.author.id !== 'current_user' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleFollow(post.author.id)}
                              >
                                Seguir
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Post Content */}
                      <CardContent className="space-y-4">
                        {post.content.text && (
                          <p className="text-foreground leading-relaxed">
                            {post.content.text.split(' ').map((word, i) => 
                              word.startsWith('#') ? (
                                <span key={i} className="text-primary hover:underline cursor-pointer">
                                  {word}{' '}
                                </span>
                              ) : (
                                <span key={i}>{word} </span>
                              )
                            )}
                          </p>
                        )}

                        {post.content.images && (
                          <div className="grid grid-cols-1 gap-2">
                            {post.content.images.map((image, i) => (
                              <img 
                                key={i}
                                src={image} 
                                alt="Post content"
                                className="w-full rounded-lg object-cover max-h-96"
                              />
                            ))}
                          </div>
                        )}

                        {post.content.pixel && (
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={post.content.pixel.imageUrl} 
                                  alt="Pixel"
                                  className="w-16 h-16 rounded border"
                                />
                                <div>
                                  <h4 className="font-medium">
                                    Pixel ({post.content.pixel.x}, {post.content.pixel.y})
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {post.content.pixel.region}
                                  </p>
                                  <Button size="sm" variant="outline" className="mt-2">
                                    Ver Pixel
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {post.content.poll && (
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-3">{post.content.poll.question}</h4>
                              <div className="space-y-2">
                                {post.content.poll.options.map((option, i) => {
                                  const percentage = (option.votes / post.content.poll!.totalVotes) * 100;
                                  return (
                                    <div key={i} className="relative">
                                      <Button 
                                        variant="outline" 
                                        className="w-full justify-between h-auto p-3"
                                      >
                                        <span>{option.text}</span>
                                        <span className="font-bold">{percentage.toFixed(0)}%</span>
                                      </Button>
                                      <div 
                                        className="absolute inset-0 bg-primary/20 rounded-md transition-all"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {post.content.poll.totalVotes} votos
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Hashtags */}
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.hashtags.map(tag => (
                              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>

                      {/* Post Actions */}
                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={cn(
                                "gap-2",
                                post.isLiked && "text-red-500"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                              {post.engagement.likes}
                            </Button>

                            <Button variant="ghost" size="sm" className="gap-2">
                              <MessageSquare className="h-4 w-4" />
                              {post.engagement.comments}
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleShare(post.id)}
                            >
                              <Share2 className="h-4 w-4" />
                              {post.engagement.shares}
                            </Button>

                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.engagement.views}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPosts(prev => prev.map(p => 
                                p.id === post.id ? { ...p, isBookmarked: !p.isBookmarked } : p
                              ));
                            }}
                          >
                            <Bookmark className={cn(
                              "h-4 w-4",
                              post.isBookmarked && "fill-current text-yellow-500"
                            )} />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-1 space-y-4">
            {/* Eventos Ao Vivo */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-red-500" />
                  Eventos Ao Vivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Concurso de Arte', participants: 234, prize: '1000€' },
                  { name: 'Workshop Pixel Art', participants: 89, prize: 'Certificado' },
                  { name: 'Leilão Premium', participants: 156, prize: 'Pixel Raro' }
                ].map((event, index) => (
                  <div key={index} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h4 className="font-medium text-sm">{event.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {event.participants} participantes • Prémio: {event.prize}
                    </p>
                    <Button size="sm" className="w-full mt-2 bg-red-500 hover:bg-red-600">
                      Participar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Conquistas da Comunidade */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Conquistas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { user: 'PixelMaster', achievement: 'Mestre das Cores', time: '2h' },
                  { user: 'ArtisticSoul', achievement: 'Colecionador', time: '4h' },
                  { user: 'ColorWizard', achievement: 'Primeiro Pixel', time: '6h' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{item.user}</span> desbloqueou{' '}
                        <span className="text-primary">{item.achievement}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Links Úteis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Links Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/tutorials">
                  <Button variant="ghost" className="w-full justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Tutoriais
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="ghost" className="w-full justify-start">
                    <Gem className="h-4 w-4 mr-2" />
                    Marketplace
                  </Button>
                </Link>
                <Link href="/achievements">
                  <Button variant="ghost" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Conquistas
                  </Button>
                </Link>
                <Link href="/ranking">
                  <Button variant="ghost" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Rankings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}