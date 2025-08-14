'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, MessageSquare, Share2, Send, Plus, Camera, 
  MapPin, Star, Crown, Gift, Zap, Eye, ThumbsUp, Bookmark,
  TrendingUp, Flame, Clock, Globe, UserPlus, Award, Gem,
  Target, Calendar, Activity, Coffee, Palette, Trophy,
  Video, Music, Smile, Tag, Filter, Search, MoreHorizontal, 
  Play, X, Check, Info, Sparkles, BarChart3
} from "lucide-react";
import { cn } from '@/lib/utils';

interface SocialPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    followers: number;
  };
  content: {
    text?: string;
    pixels?: Array<{
      x: number;
      y: number;
      region: string;
      imageUrl: string;
      rarity: string;
      price?: number;
    }>;
    images?: string[];
    poll?: {
      question: string;
      options: Array<{ text: string; votes: number }>;
      totalVotes: number;
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
  location?: string;
  type: 'text' | 'pixel' | 'image' | 'poll' | 'achievement' | 'story';
}

interface Story {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  thumbnail: string;
  isViewed: boolean;
  isLive?: boolean;
  isAdd?: boolean;
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    author: {
      name: 'PixelMaster',
      username: '@pixelmaster',
      avatar: 'https://placehold.co/50x50.png',
      verified: true,
      level: 25,
      followers: 1234
    },
    content: {
      text: 'Acabei de criar esta obra-prima em Lisboa! Que acham da combinação de cores? 🎨✨',
      pixels: [{
        x: 245,
        y: 156,
        region: 'Lisboa',
        imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Art',
        rarity: 'Lendário',
        price: 450
      }]
    },
    stats: { likes: 156, comments: 23, shares: 12, views: 890 },
    timestamp: '2h',
    isLiked: false,
    isBookmarked: false,
    tags: ['arte', 'lisboa', 'masterpiece'],
    type: 'pixel'
  },
  {
    id: '2',
    author: {
      name: 'ColorWizard',
      username: '@colorwizard',
      avatar: 'https://placehold.co/50x50.png',
      verified: false,
      level: 18,
      followers: 567
    },
    content: {
      text: 'Qual é a vossa cor favorita para pixels? Estou a fazer uma pesquisa para o meu próximo projeto! 🌈',
      poll: {
        question: 'Cor favorita para pixels?',
        options: [
          { text: 'Dourado Português', votes: 45 },
          { text: 'Azul Atlântico', votes: 32 },
          { text: 'Verde Lusitano', votes: 28 },
          { text: 'Vermelho Coral', votes: 15 }
        ],
        totalVotes: 120
      }
    },
    stats: { likes: 89, comments: 34, shares: 8, views: 456 },
    timestamp: '4h',
    isLiked: true,
    isBookmarked: false,
    tags: ['cores', 'pesquisa', 'arte'],
    type: 'poll'
  },
  {
    id: '3',
    author: {
      name: 'NewPixeler',
      username: '@newpixeler',
      avatar: 'https://placehold.co/50x50.png',
      verified: false,
      level: 3,
      followers: 23
    },
    content: {
      text: 'Primeiro dia no Pixel Universe! Alguém tem dicas para um iniciante? 🙋‍♂️'
    },
    stats: { likes: 67, comments: 18, shares: 5, views: 234 },
    timestamp: '6h',
    isLiked: false,
    isBookmarked: false,
    tags: ['iniciante', 'ajuda', 'dicas'],
    type: 'text'
  },
  {
    id: '4',
    author: {
      name: 'ArtCollector',
      username: '@artcollector',
      avatar: 'https://placehold.co/50x50.png',
      verified: true,
      level: 22,
      followers: 890
    },
    content: {
      text: 'Desbloqueei a conquista "Colecionador Lendário"! 🏆 Finalmente consegui reunir 100 pixels únicos!',
      images: ['https://placehold.co/400x300/FFD700/000000?text=Achievement+Unlocked']
    },
    stats: { likes: 234, comments: 45, shares: 28, views: 1200 },
    timestamp: '8h',
    isLiked: false,
    isBookmarked: true,
    tags: ['conquista', 'coleção', 'milestone'],
    type: 'achievement'
  }
];

const mockStories: Story[] = [
  {
    id: '1',
    author: { name: 'Você', avatar: 'https://placehold.co/50x50.png', verified: true },
    thumbnail: 'https://placehold.co/80x80/D4A757/FFFFFF?text=+',
    isViewed: false,
    isAdd: true
  },
  {
    id: '2',
    author: { name: 'PixelArtist', avatar: 'https://placehold.co/50x50.png', verified: true },
    thumbnail: 'https://placehold.co/80x80/7DF9FF/000000?text=PA',
    isViewed: false,
    isLive: true
  },
  {
    id: '3',
    author: { name: 'ColorMaster', avatar: 'https://placehold.co/50x50.png', verified: false },
    thumbnail: 'https://placehold.co/80x80/FF6B6B/FFFFFF?text=CM',
    isViewed: true
  }
];

const trendingTopics = [
  { tag: '#LisboaArt', posts: 234, growth: 45, category: 'Arte' },
  { tag: '#PixelInvestment', posts: 156, growth: 32, category: 'Investimento' },
  { tag: '#PortugalPixels', posts: 89, growth: 28, category: 'Regional' },
  { tag: '#CollabArt', posts: 67, growth: 67, category: 'Colaboração' },
  { tag: '#RarePixels', posts: 45, growth: 23, category: 'Coleção' }
];

const suggestedUsers = [
  { name: 'PixelPro', avatar: 'https://placehold.co/40x40.png', followers: 2340, specialty: 'Paisagens', verified: true },
  { name: 'ArtisticSoul', avatar: 'https://placehold.co/40x40.png', followers: 1890, specialty: 'Abstrato', verified: false },
  { name: 'PortoCreator', avatar: 'https://placehold.co/40x40.png', followers: 1567, specialty: 'Urbano', verified: true }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [newPostText, setNewPostText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playInteractionSound, setPlayInteractionSound] = useState(false);
  
  const { addCredits, addXp } = useUserStore();
  const { toast } = useToast();

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        setPosts(prev => prev.map(post => 
          post.id === randomPost.id 
            ? { 
                ...post, 
                stats: { 
                  ...post.stats, 
                  likes: post.stats.likes + Math.floor(Math.random() * 3),
                  views: post.stats.views + Math.floor(Math.random() * 10)
                }
              }
            : post
        ));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [posts]);

  const handleLike = (postId: string) => {
    setPlayInteractionSound(true);
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
    
    addCredits(5);
    addXp(2);
    
    toast({
      title: "❤️ Post Curtido!",
      description: "Recebeu 5 créditos por interagir!",
    });
  };

  const handleComment = (postId: string) => {
    setPlayInteractionSound(true);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            stats: { ...post.stats, comments: post.stats.comments + 1 }
          }
        : post
    ));
    
    addCredits(10);
    addXp(5);
    
    toast({
      title: "💬 Comentário Adicionado!",
      description: "Recebeu 10 créditos por comentar!",
    });
  };

  const handleShare = (postId: string) => {
    setPlayInteractionSound(true);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            stats: { ...post.stats, shares: post.stats.shares + 1 }
          }
        : post
    ));
    
    if (navigator.share) {
      navigator.share({
        title: 'Pixel Universe',
        text: 'Confira este post incrível!',
        url: window.location.href
      });
    }
    
    addCredits(15);
    addXp(10);
    
    toast({
      title: "📤 Post Partilhado!",
      description: "Recebeu 15 créditos por partilhar!",
    });
  };

  const createPost = () => {
    if (!newPostText.trim()) return;
    
    const newPost: SocialPost = {
      id: Date.now().toString(),
      author: {
        name: 'Você',
        username: '@voce',
        avatar: 'https://placehold.co/50x50.png',
        verified: true,
        level: 15,
        followers: 234
      },
      content: { text: newPostText },
      stats: { likes: 0, comments: 0, shares: 0, views: 1 },
      timestamp: 'agora',
      isLiked: false,
      isBookmarked: false,
      tags: newPostText.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [],
      type: 'text'
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setShowConfetti(true);
    
    addCredits(25);
    addXp(15);
    
    toast({
      title: "🎉 Post Criado!",
      description: "Recebeu 25 créditos por criar conteúdo!",
    });
  };

  const followUser = (userName: string) => {
    setPlayInteractionSound(true);
    toast({
      title: "👥 Utilizador Seguido!",
      description: `Agora segue ${userName}`,
    });
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.content.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900/95 to-red-500/20">
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playInteractionSound} onEnd={() => setPlayInteractionSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-6xl space-y-6">
        {/* HEADER COMPLETAMENTE NOVO - MUITO VISÍVEL */}
        <Card className="shadow-2xl bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-red-500/30 border-pink-500/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-red-500/20 animate-pulse" />
          <CardHeader className="relative text-center">
            <CardTitle className="text-4xl font-headline text-white animate-bounce">
              🚀 NOVA REDE SOCIAL PIXEL UNIVERSE 🚀
            </CardTitle>
            <CardDescription className="text-pink-200 text-xl animate-pulse">
              ✨ DESIGN COMPLETAMENTE ATUALIZADO - Conecte-se com artistas de pixels! ✨
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Esquerda */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stories */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-purple-300">
                  <Play className="h-5 w-5 mr-2" />
                  Stories de Pixels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {mockStories.map(story => (
                    <div key={story.id} className="flex-shrink-0 cursor-pointer" onClick={() => setActiveStory(story)}>
                      <div className="relative">
                        <img 
                          src={story.thumbnail} 
                          alt={story.author.name}
                          className={cn(
                            "w-16 h-16 rounded-full border-3 object-cover",
                            story.isAdd ? "border-dashed border-primary" : 
                            story.isViewed ? "border-muted" : "border-accent",
                            story.isLive && "animate-pulse border-red-500"
                          )}
                        />
                        {story.isAdd && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        {story.isLive && (
                          <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-xs animate-pulse">
                            AO VIVO
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-center mt-1 truncate w-16 text-white">
                        {story.author.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-orange-300">
                  <Flame className="h-5 w-5 mr-2 animate-pulse" />
                  Trending Agora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-white/10 p-2 rounded cursor-pointer transition-colors">
                      <div>
                        <div className="font-medium text-primary">{topic.tag}</div>
                        <div className="text-xs text-muted-foreground">{topic.posts} posts</div>
                      </div>
                      <Badge className="bg-green-500 text-xs animate-pulse">
                        +{topic.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sugestões de Utilizadores */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-blue-300">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Quem Seguir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-white/10 rounded transition-colors">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm text-white">{user.name}</span>
                            {user.verified && <Star className="h-3 w-3 text-blue-500 fill-current" />}
                          </div>
                          <p className="text-xs text-gray-300">{user.specialty}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => followUser(user.name)} className="bg-primary hover:bg-primary/80">
                        Seguir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Criar Post */}
            <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src="https://placehold.co/50x50.png" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="🎨 Partilhe os seus pixels incríveis com a comunidade..."
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      className="min-h-[80px] resize-none bg-background/50 border-primary/20"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-background/50 text-white border-white/20">
                          <Camera className="h-4 w-4 mr-2" />
                          Foto
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50 text-white border-white/20">
                          <MapPin className="h-4 w-4 mr-2" />
                          Pixel
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50 text-white border-white/20">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Sondagem
                        </Button>
                      </div>
                      <Button onClick={createPost} disabled={!newPostText.trim()} className="bg-gradient-to-r from-primary to-accent">
                        <Send className="h-4 w-4 mr-2" />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filtros do Feed */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar posts, utilizadores, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'following', label: 'Seguindo', icon: Users },
                      { id: 'trending', label: 'Trending', icon: TrendingUp },
                      { id: 'recent', label: 'Recentes', icon: Clock },
                      { id: 'pixels', label: 'Pixels', icon: MapPin }
                    ].map(filter => (
                      <Button
                        key={filter.id}
                        variant={selectedFilter === filter.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.id)}
                        className={selectedFilter === filter.id ? 'bg-primary' : 'bg-background/50 border-white/20'}
                      >
                        <filter.icon className="h-4 w-4 mr-2" />
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed de Posts */}
            <AnimatePresence>
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm border-primary/20">
                    <CardContent className="p-0">
                      {/* Header do Post */}
                      <div className="p-4 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{post.author.name}</span>
                                {post.author.verified && (
                                  <Star className="h-4 w-4 text-blue-500 fill-current" />
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  Nível {post.author.level}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span>{post.author.username}</span>
                                <span>•</span>
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Conteúdo do Post */}
                      <div className="px-4 pb-3">
                        {post.content.text && (
                          <p className="text-white leading-relaxed mb-3">
                            {post.content.text}
                          </p>
                        )}

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/20 text-primary border-primary/50">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pixels Partilhados */}
                      {post.content.pixels && post.content.pixels.length > 0 && (
                        <div className="px-4 pb-3">
                          <div className="grid grid-cols-1 gap-3">
                            {post.content.pixels.map((pixel, index) => (
                              <Card key={index} className="bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer border-primary/30">
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={pixel.imageUrl} 
                                      alt={`Pixel ${pixel.x}, ${pixel.y}`}
                                      className="w-16 h-16 rounded border-2 border-primary/50"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">({pixel.x}, {pixel.y})</span>
                                        <Badge className="text-xs bg-accent">{pixel.rarity}</Badge>
                                      </div>
                                      <p className="text-sm text-gray-300">{pixel.region}</p>
                                      {pixel.price && (
                                        <p className="text-sm font-bold text-primary">€{pixel.price}</p>
                                      )}
                                    </div>
                                    <Button size="sm" variant="outline" className="bg-background/20 text-white border-white/30">
                                      <Eye className="h-4 w-4 mr-2" />
                                      Ver
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sondagem */}
                      {post.content.poll && (
                        <div className="px-4 pb-3">
                          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-3 text-white">{post.content.poll.question}</h4>
                              <div className="space-y-2">
                                {post.content.poll.options.map((option, index) => {
                                  const percentage = (option.votes / post.content.poll!.totalVotes) * 100;
                                  return (
                                    <div key={index} className="space-y-1">
                                      <div className="flex justify-between text-sm text-white">
                                        <span>{option.text}</span>
                                        <span className="font-medium">{option.votes} votos</span>
                                      </div>
                                      <div className="w-full bg-muted/30 rounded-full h-2">
                                        <div 
                                          className="bg-primary h-2 rounded-full transition-all duration-500"
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-gray-300 mt-3">
                                {post.content.poll.totalVotes} votos totais
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Imagens */}
                      {post.content.images && post.content.images.length > 0 && (
                        <div className="px-4 pb-3">
                          <div className="grid grid-cols-2 gap-2">
                            {post.content.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt="Post content"
                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Estatísticas e Ações */}
                      <div className="px-4 py-3 border-t border-white/20">
                        <div className="flex items-center justify-between mb-3 text-sm text-gray-300">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.stats.views}
                            </span>
                            <span>{post.stats.likes} curtidas</span>
                            <span>{post.stats.comments} comentários</span>
                          </div>
                          <span>{post.stats.shares} partilhas</span>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={cn(
                                "hover:scale-110 transition-transform text-white hover:bg-white/20",
                                post.isLiked ? 'text-red-500' : ''
                              )}
                            >
                              <Heart className={cn("h-5 w-5 mr-2", post.isLiked && "fill-current")} />
                              Curtir
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComment(post.id)}
                              className="hover:scale-110 transition-transform text-white hover:bg-white/20"
                            >
                              <MessageSquare className="h-5 w-5 mr-2" />
                              Comentar
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post.id)}
                              className="hover:scale-110 transition-transform text-white hover:bg-white/20"
                            >
                              <Share2 className="h-5 w-5 mr-2" />
                              Partilhar
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPosts(prev => prev.map(p => 
                                p.id === post.id ? { ...p, isBookmarked: !p.isBookmarked } : p
                              ));
                              toast({
                                title: post.isBookmarked ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
                                description: "Post guardado na sua coleção",
                              });
                            }}
                            className={cn(
                              "hover:scale-110 transition-transform text-white hover:bg-white/20",
                              post.isBookmarked ? 'text-yellow-500' : ''
                            )}
                          >
                            <Bookmark className={cn("h-5 w-5", post.isBookmarked && "fill-current")} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="w-full bg-background/20 text-white border-white/30 hover:bg-background/40">
                <TrendingUp className="h-4 w-4 mr-2" />
                Carregar Mais Posts
              </Button>
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-1 space-y-4">
            {/* Estatísticas da Comunidade */}
            <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-green-300">
                  <Activity className="h-5 w-5 mr-2 animate-pulse" />
                  Comunidade Ativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-white">
                    <span className="text-sm">Online agora:</span>
                    <span className="font-bold text-green-400 animate-pulse">1,247</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-sm">Posts hoje:</span>
                    <span className="font-bold text-primary">234</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-sm">Pixels partilhados:</span>
                    <span className="font-bold text-accent">567</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-sm">Crescimento:</span>
                    <Badge className="bg-green-500 animate-pulse">+23%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eventos da Semana */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-purple-300">
                  <Calendar className="h-5 w-5 mr-2" />
                  Eventos da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Pixel Art Workshop', date: 'Hoje 20:00', participants: 45, color: 'bg-blue-500' },
                    { name: 'Concurso de Natal', date: 'Amanhã 19:00', participants: 156, color: 'bg-red-500' },
                    { name: 'Live Collaboration', date: 'Sex 21:00', participants: 23, color: 'bg-green-500' }
                  ].map((event, index) => (
                    <div key={index} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                      <h4 className="font-medium text-sm text-white">{event.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-300">{event.date}</span>
                        <Badge className={cn("text-xs", event.color)}>
                          {event.participants} inscritos
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desafios Rápidos */}
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-yellow-300">
                  <Target className="h-5 w-5 mr-2" />
                  Desafios Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'Curtir 5 posts', progress: 60, reward: '25 créditos' },
                    { title: 'Comentar 3 vezes', progress: 33, reward: '15 créditos' },
                    { title: 'Partilhar 1 pixel', progress: 0, reward: '50 créditos' }
                  ].map((challenge, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <span className="font-medium">{challenge.title}</span>
                        <span className="text-primary font-bold">{challenge.reward}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Story */}
        {activeStory && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="relative max-w-md w-full h-[80vh] bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="p-4 text-center text-white">
                <Avatar className="h-16 w-16 mx-auto mb-4 border-2 border-white">
                  <AvatarImage src={activeStory.author.avatar} />
                  <AvatarFallback>{activeStory.author.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl">{activeStory.author.name}</h3>
                <p className="text-white/80">Story em desenvolvimento...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}