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
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { SocialInteractions } from '@/components/ui/social-interactions';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Heart, MessageSquare, Share2, Plus, Camera, Video, Mic,
  MapPin, Palette, Star, Crown, Gift, Zap, Eye, Send, Smile,
  Image as ImageIcon, Music, Bookmark, MoreHorizontal, Filter,
  TrendingUp, Clock, Globe, UserPlus, Search, Hash, Award,
  Sparkles, Target, Flame, Calendar, Bell, Settings, Edit3,
  Play, Pause, Volume2, VolumeX, Maximize, X, ChevronLeft,
  ChevronRight, Download, Upload, Copy, Link as LinkIcon,
  Flag, Shield, ThumbsUp, ThumbsDown, Laugh, Angry, Sad,
  Wow, Love, Coffee, Pizza, Rocket, Rainbow, Sun, Moon
} from "lucide-react";
import { cn } from '@/lib/utils';

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    badges: string[];
    isOnline: boolean;
  };
  content: {
    text?: string;
    pixels?: Array<{
      x: number;
      y: number;
      region: string;
      imageUrl: string;
      title: string;
      rarity: string;
    }>;
    images?: string[];
    video?: string;
    poll?: {
      question: string;
      options: Array<{ text: string; votes: number }>;
      totalVotes: number;
      userVoted?: number;
    };
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  reactions: Record<string, number>;
  userReaction?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  timestamp: string;
  tags: string[];
  location?: string;
  isPromoted: boolean;
  isPinned: boolean;
  comments: CommunityComment[];
}

interface CommunityComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  content: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  replies?: CommunityComment[];
}

interface PixelStory {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  pixel: {
    x: number;
    y: number;
    region: string;
    imageUrl: string;
  };
  content: {
    type: 'image' | 'video' | 'timelapse';
    url: string;
    duration?: number;
  };
  timestamp: string;
  views: number;
  isViewed: boolean;
}

interface TrendingTopic {
  tag: string;
  posts: number;
  growth: string;
  category: string;
}

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  host: string;
  participants: number;
  startTime: string;
  type: 'contest' | 'tutorial' | 'showcase' | 'auction';
  isLive: boolean;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'PixelArtist Pro',
      username: '@pixelartist',
      avatar: 'https://placehold.co/60x60.png',
      verified: true,
      level: 25,
      badges: ['legendary', 'verified', 'premium'],
      isOnline: true
    },
    content: {
      text: 'Acabei de completar minha obra-prima em Lisboa! 🎨✨ Levei 3 semanas para criar esta identidade digital única. O que acham?',
      pixels: [
        {
          x: 245,
          y: 156,
          region: 'Lisboa',
          imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Art',
          title: 'Portal do Tempo Lisboa',
          rarity: 'Lendário'
        }
      ],
      images: ['https://placehold.co/400x300/D4A757/FFFFFF?text=Processo+Criativo']
    },
    stats: { likes: 234, comments: 45, shares: 67, views: 1890 },
    reactions: { like: 150, love: 45, wow: 25, laugh: 8, sad: 2, angry: 1 },
    userReaction: 'love',
    isLiked: true,
    isBookmarked: false,
    timestamp: '2h',
    tags: ['arte', 'lisboa', 'masterpiece', 'lendário'],
    location: 'Lisboa, Portugal',
    isPromoted: false,
    isPinned: false,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'ColorMaster',
          avatar: 'https://placehold.co/40x40.png',
          verified: false,
          level: 18
        },
        content: 'Incrível! Como conseguiste essa combinação de cores? 🤩',
        likes: 12,
        timestamp: '1h',
        isLiked: false
      },
      {
        id: 'c2',
        author: {
          name: 'PixelCollector',
          avatar: 'https://placehold.co/40x40.png',
          verified: true,
          level: 22
        },
        content: 'Obra de arte! Quanto custou esse pixel? Estou interessado em investir na zona.',
        likes: 8,
        timestamp: '45m',
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'InvestorGuru',
      username: '@investorguru',
      avatar: 'https://placehold.co/60x60.png',
      verified: true,
      level: 30,
      badges: ['premium', 'investor'],
      isOnline: false
    },
    content: {
      text: '📈 ANÁLISE DE MERCADO: Pixels na região do Porto estão valorizando 23% este mês! Quem mais está investindo por lá?',
      poll: {
        question: 'Qual região tem mais potencial de valorização?',
        options: [
          { text: 'Porto', votes: 45 },
          { text: 'Lisboa', votes: 67 },
          { text: 'Coimbra', votes: 23 },
          { text: 'Algarve', votes: 34 }
        ],
        totalVotes: 169,
        userVoted: 1
      }
    },
    stats: { likes: 156, comments: 28, shares: 89, views: 2340 },
    reactions: { like: 89, wow: 34, love: 23, laugh: 5, sad: 3, angry: 2 },
    isLiked: false,
    isBookmarked: true,
    timestamp: '4h',
    tags: ['investimento', 'porto', 'análise', 'mercado'],
    isPromoted: true,
    isPinned: false,
    comments: []
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'NewPixeler',
      username: '@newpixeler',
      avatar: 'https://placehold.co/60x60.png',
      verified: false,
      level: 3,
      badges: ['newbie'],
      isOnline: true
    },
    content: {
      text: 'Olá pessoal! 👋 Sou novo aqui e acabei de comprar meu primeiro pixel! Alguma dica para iniciantes?',
      pixels: [
        {
          x: 100,
          y: 200,
          region: 'Braga',
          imageUrl: 'https://placehold.co/200x200/4CAF50/FFFFFF?text=Primeiro+Pixel',
          title: 'Meu Primeiro Pixel',
          rarity: 'Comum'
        }
      ]
    },
    stats: { likes: 89, comments: 34, shares: 12, views: 456 },
    reactions: { like: 67, love: 15, wow: 4, laugh: 2, sad: 0, angry: 1 },
    isLiked: true,
    isBookmarked: false,
    timestamp: '6h',
    tags: ['iniciante', 'primeiro-pixel', 'braga', 'ajuda'],
    isPromoted: false,
    isPinned: false,
    comments: []
  }
];

const mockStories: PixelStory[] = [
  {
    id: '1',
    author: {
      name: 'PixelArtist Pro',
      avatar: 'https://placehold.co/50x50.png',
      verified: true
    },
    pixel: {
      x: 245,
      y: 156,
      region: 'Lisboa',
      imageUrl: 'https://placehold.co/200x300/D4A757/FFFFFF?text=Story+1'
    },
    content: {
      type: 'timelapse',
      url: 'https://placehold.co/200x300/D4A757/FFFFFF?text=Timelapse',
      duration: 15
    },
    timestamp: '2h',
    views: 1234,
    isViewed: false
  },
  {
    id: '2',
    author: {
      name: 'ColorMaster',
      avatar: 'https://placehold.co/50x50.png',
      verified: false
    },
    pixel: {
      x: 123,
      y: 89,
      region: 'Porto',
      imageUrl: 'https://placehold.co/200x300/7DF9FF/000000?text=Story+2'
    },
    content: {
      type: 'image',
      url: 'https://placehold.co/200x300/7DF9FF/000000?text=Arte+Porto'
    },
    timestamp: '4h',
    views: 567,
    isViewed: true
  }
];

const mockTrending: TrendingTopic[] = [
  { tag: '#LisboaArt', posts: 234, growth: '+45%', category: 'Arte' },
  { tag: '#PixelInvestment', posts: 156, growth: '+32%', category: 'Investimento' },
  { tag: '#PortugalPixels', posts: 189, growth: '+28%', category: 'Geral' },
  { tag: '#NewbieHelp', posts: 98, growth: '+67%', category: 'Ajuda' },
  { tag: '#CollabArt', posts: 76, growth: '+89%', category: 'Colaboração' }
];

const mockLiveEvents: LiveEvent[] = [
  {
    id: '1',
    title: 'Concurso de Arte Natalícia',
    description: 'Crie a melhor arte de Natal e ganhe 1000 créditos especiais!',
    host: 'PixelUniverse Team',
    participants: 156,
    startTime: '20:00',
    type: 'contest',
    isLive: true
  },
  {
    id: '2',
    title: 'Tutorial: Técnicas Avançadas',
    description: 'Aprenda técnicas profissionais com PixelMaster',
    host: 'PixelMaster',
    participants: 89,
    startTime: '21:30',
    type: 'tutorial',
    isLive: false
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [stories, setStories] = useState(mockStories);
  const [newPostText, setNewPostText] = useState('');
  const [selectedStory, setSelectedStory] = useState<PixelStory | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [filter, setFilter] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postType, setPostType] = useState<'text' | 'pixel' | 'poll' | 'image'>('text');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playInteractionSound, setPlayInteractionSound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const { addCredits, addXp } = useUserStore();
  const { toast } = useToast();

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular novos posts ocasionalmente
      if (Math.random() > 0.9) {
        const newPost: CommunityPost = {
          id: Date.now().toString(),
          author: {
            id: 'random_user',
            name: `User${Math.floor(Math.random() * 1000)}`,
            username: `@user${Math.floor(Math.random() * 1000)}`,
            avatar: 'https://placehold.co/60x60.png',
            verified: Math.random() > 0.8,
            level: Math.floor(Math.random() * 20) + 1,
            badges: [],
            isOnline: Math.random() > 0.5
          },
          content: {
            text: [
              'Novo pixel adquirido! 🎉',
              'Alguém quer colaborar num projeto?',
              'Que cores ficam melhor para paisagens?',
              'Acabei de desbloquear uma conquista rara!'
            ][Math.floor(Math.random() * 4)]
          },
          stats: {
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 20),
            shares: Math.floor(Math.random() * 10),
            views: Math.floor(Math.random() * 500)
          },
          reactions: {},
          isLiked: false,
          isBookmarked: false,
          timestamp: 'agora',
          tags: [],
          isPromoted: false,
          isPinned: false,
          comments: []
        };
        
        setPosts(prev => [newPost, ...prev.slice(0, 19)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      toast({
        title: "Post Vazio",
        description: "Escreva algo para partilhar com a comunidade!",
        variant: "destructive"
      });
      return;
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: {
        id: 'current_user',
        name: user?.displayName || 'Você',
        username: '@você',
        avatar: user?.photoURL || 'https://placehold.co/60x60.png',
        verified: true,
        level: 15,
        badges: ['premium'],
        isOnline: true
      },
      content: {
        text: newPostText
      },
      stats: { likes: 0, comments: 0, shares: 0, views: 1 },
      reactions: {},
      isLiked: false,
      isBookmarked: false,
      timestamp: 'agora',
      tags: newPostText.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [],
      isPromoted: false,
      isPinned: false,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setShowCreatePost(false);
    
    // Recompensar utilizador
    addCredits(10);
    addXp(5);
    setPlayInteractionSound(true);
    
    toast({
      title: "Post Publicado! 📝",
      description: "Sua publicação foi partilhada com a comunidade. +10 créditos!",
    });
  };

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
    setPlayInteractionSound(true);
  };

  const handleComment = (postId: string, comment: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            stats: { ...post.stats, comments: post.stats.comments + 1 }
          }
        : post
    ));
    
    addCredits(5);
    addXp(2);
    setPlayInteractionSound(true);
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            stats: { ...post.stats, shares: post.stats.shares + 1 }
          }
        : post
    ));
    
    addCredits(15);
    addXp(8);
    setPlayInteractionSound(true);
    
    toast({
      title: "Post Partilhado! 📤",
      description: "Obrigado por partilhar! +15 créditos ganhos.",
    });
  };

  const handleReaction = (postId: string, reaction: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            userReaction: post.userReaction === reaction ? undefined : reaction,
            reactions: {
              ...post.reactions,
              [reaction]: (post.reactions[reaction] || 0) + (post.userReaction === reaction ? -1 : 1)
            }
          }
        : post
    ));
    setPlayInteractionSound(true);
  };

  const handleFollow = (userId: string) => {
    setPlayInteractionSound(true);
    toast({
      title: "Utilizador Seguido! 👥",
      description: "Agora receberá notificações das suas publicações.",
    });
  };

  const handleVotePoll = (postId: string, optionIndex: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && post.content.poll) {
        const updatedOptions = post.content.poll.options.map((option, index) => 
          index === optionIndex 
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        
        return {
          ...post,
          content: {
            ...post.content,
            poll: {
              ...post.content.poll,
              options: updatedOptions,
              totalVotes: post.content.poll.totalVotes + 1,
              userVoted: optionIndex
            }
          }
        };
      }
      return post;
    }));
    
    setPlayInteractionSound(true);
    toast({
      title: "Voto Registado! 🗳️",
      description: "Obrigado por participar na sondagem!",
    });
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'following') return post.author.verified; // Mock filter
    if (filter === 'trending') return post.stats.likes > 100;
    if (filter === 'recent') return true;
    return true;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'legendary': return 'bg-amber-500';
      case 'verified': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'investor': return 'bg-green-500';
      case 'newbie': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 border-gray-500/50';
      case 'Raro': return 'text-blue-500 border-blue-500/50';
      case 'Épico': return 'text-purple-500 border-purple-500/50';
      case 'Lendário': return 'text-amber-500 border-amber-500/50';
      default: return 'text-gray-500 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playInteractionSound} onEnd={() => setPlayInteractionSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
                  <Users className="h-8 w-8 mr-3" />
                  Comunidade Pixel Universe
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Conecte-se, partilhe e colabore com artistas de pixels de todo o mundo
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 animate-pulse">
                  <Users className="h-3 w-3 mr-1" />
                  1,247 online
                </Badge>
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Post
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Esquerda */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Play className="h-5 w-5 mr-2 text-purple-500" />
                  Pixel Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Adicionar Story */}
                  <div className="flex-shrink-0 text-center cursor-pointer group">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center group-hover:border-primary transition-colors">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-xs mt-1">Adicionar</p>
                  </div>
                  
                  {stories.map(story => (
                    <div 
                      key={story.id} 
                      className="flex-shrink-0 text-center cursor-pointer group"
                      onClick={() => setSelectedStory(story)}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 p-0.5 group-hover:scale-110 transition-transform",
                        story.isViewed ? "border-gray-400" : "border-gradient-to-r from-primary to-accent"
                      )}>
                        <img 
                          src={story.pixel.imageUrl} 
                          alt={story.author.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <p className="text-xs mt-1 truncate w-16">{story.author.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTrending.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-muted/20 p-2 rounded cursor-pointer transition-colors">
                      <div>
                        <p className="font-medium text-primary">{topic.tag}</p>
                        <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {topic.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-500" />
                  Eventos Ao Vivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLiveEvents.map(event => (
                    <div key={event.id} className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${event.isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex justify-between text-xs">
                        <span>{event.participants} participantes</span>
                        <span>{event.startTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Criar Post */}
            <AnimatePresence>
              {showCreatePost && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="border-primary/30 bg-gradient-to-r from-card to-primary/5">
                    <CardContent className="p-4">
                      <div className="flex gap-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.photoURL || 'https://placehold.co/60x60.png'} />
                          <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="O que está a acontecer no seu universo de pixels? Use #tags para categorizar!"
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
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
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Sondagem
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Vídeo
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleCreatePost} disabled={!newPostText.trim()}>
                            <Send className="h-4 w-4 mr-2" />
                            Publicar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Create Button */}
            {!showCreatePost && (
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 bg-gradient-to-r from-card to-primary/5"
                onClick={() => setShowCreatePost(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.photoURL || 'https://placehold.co/60x60.png'} />
                      <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 p-3 bg-muted/30 rounded-full text-muted-foreground hover:bg-muted/50 transition-colors">
                      O que está a acontecer no seu universo de pixels?
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-primary">
                        <Camera className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-accent">
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'Todos', icon: Globe },
                { id: 'following', label: 'Seguindo', icon: Heart },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'recent', label: 'Recentes', icon: Clock }
              ].map(filterOption => (
                <Button
                  key={filterOption.id}
                  variant={filter === filterOption.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterOption.id)}
                  className="flex-shrink-0"
                >
                  <filterOption.icon className="h-4 w-4 mr-2" />
                  {filterOption.label}
                </Button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {/* Post Header */}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-border">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                              </Avatar>
                              {post.author.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{post.author.name}</span>
                                <span className="text-sm text-muted-foreground">{post.author.username}</span>
                                {post.author.verified && (
                                  <Star className="h-4 w-4 text-blue-500 fill-current" />
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  Nível {post.author.level}
                                </Badge>
                                {post.author.badges.map(badge => (
                                  <Badge key={badge} className={cn("text-xs", getBadgeColor(badge))}>
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{post.timestamp}</span>
                                {post.location && (
                                  <>
                                    <span>•</span>
                                    <MapPin className="h-3 w-3" />
                                    <span>{post.location}</span>
                                  </>
                                )}
                                {post.isPromoted && (
                                  <Badge variant="outline" className="text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Promovido
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleFollow(post.author.id)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Seguir
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="space-y-4">
                          {post.content.text && (
                            <p className="text-foreground leading-relaxed">
                              {post.content.text}
                            </p>
                          )}

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Pixels Partilhados */}
                          {post.content.pixels && post.content.pixels.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {post.content.pixels.map((pixel, idx) => (
                                <Card key={idx} className="bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                      <img 
                                        src={pixel.imageUrl} 
                                        alt={pixel.title}
                                        className="w-16 h-16 rounded border object-cover"
                                      />
                                      <div className="flex-1">
                                        <h4 className="font-medium text-sm">{pixel.title}</h4>
                                        <p className="text-xs text-muted-foreground">
                                          ({pixel.x}, {pixel.y}) • {pixel.region}
                                        </p>
                                        <Badge variant="outline" className={cn("text-xs mt-1", getRarityColor(pixel.rarity))}>
                                          {pixel.rarity}
                                        </Badge>
                                      </div>
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* Imagens */}
                          {post.content.images && post.content.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                              {post.content.images.map((image, idx) => (
                                <img 
                                  key={idx}
                                  src={image} 
                                  alt="Post image"
                                  className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                                />
                              ))}
                            </div>
                          )}

                          {/* Sondagem */}
                          {post.content.poll && (
                            <Card className="bg-blue-500/10 border-blue-500/30">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-3">{post.content.poll.question}</h4>
                                <div className="space-y-2">
                                  {post.content.poll.options.map((option, idx) => {
                                    const percentage = post.content.poll!.totalVotes > 0 
                                      ? (option.votes / post.content.poll!.totalVotes) * 100 
                                      : 0;
                                    const isUserChoice = post.content.poll!.userVoted === idx;
                                    
                                    return (
                                      <div 
                                        key={idx}
                                        className={cn(
                                          "relative p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                                          isUserChoice ? "border-primary bg-primary/10" : "border-border bg-muted/20"
                                        )}
                                        onClick={() => !post.content.poll!.userVoted && handleVotePoll(post.id, idx)}
                                      >
                                        <div className="flex justify-between items-center relative z-10">
                                          <span className="font-medium">{option.text}</span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">{option.votes}</span>
                                            <span className="text-sm text-muted-foreground">({percentage.toFixed(0)}%)</span>
                                          </div>
                                        </div>
                                        <div 
                                          className="absolute inset-0 bg-primary/20 rounded-lg transition-all"
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {post.content.poll.totalVotes} votos totais
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>

                        {/* Post Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-4">
                            <span>{post.stats.views.toLocaleString()} visualizações</span>
                            <span>{post.stats.likes} curtidas</span>
                            <span>{post.stats.comments} comentários</span>
                          </div>
                          <span>{post.stats.shares} partilhas</span>
                        </div>

                        {/* Social Interactions */}
                        <SocialInteractions
                          postId={post.id}
                          initialLikes={post.stats.likes}
                          initialComments={post.stats.comments}
                          initialShares={post.stats.shares}
                          isLiked={post.isLiked}
                          onLike={() => handleLike(post.id)}
                          onComment={(comment) => handleComment(post.id, comment)}
                          onShare={() => handleShare(post.id)}
                          onReaction={(reaction) => handleReaction(post.id, reaction)}
                          className="mt-4 pt-3 border-t border-border/50"
                        />

                        {/* Comentários */}
                        {post.comments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border/50 space-y-3">
                            {post.comments.slice(0, 2).map(comment => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted/20 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                    {comment.author.verified && (
                                      <Star className="h-3 w-3 text-blue-500 fill-current" />
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      {comment.author.level}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      <Heart className={cn("h-3 w-3 mr-1", comment.isLiked && "fill-current text-red-500")} />
                                      {comment.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      Responder
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {post.comments.length > 2 && (
                              <Button variant="ghost" size="sm" className="w-full">
                                Ver todos os {post.comments.length} comentários
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-1 space-y-4">
            {/* Utilizadores Sugeridos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-green-500" />
                  Sugestões para Seguir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'PixelMaster', username: '@pixelmaster', avatar: 'https://placehold.co/40x40.png', verified: true, mutual: 5 },
                    { name: 'ArtCollector', username: '@artcollector', avatar: 'https://placehold.co/40x40.png', verified: false, mutual: 12 },
                    { name: 'ColorWizard', username: '@colorwizard', avatar: 'https://placehold.co/40x40.png', verified: true, mutual: 3 }
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={suggestion.avatar} />
                          <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{suggestion.name}</span>
                            {suggestion.verified && (
                              <Star className="h-3 w-3 text-blue-500 fill-current" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.mutual} amigos em comum
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Seguir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: 'PixelArtist', action: 'curtiu seu pixel', time: '5m', icon: <Heart className="h-4 w-4 text-red-500" /> },
                    { user: 'ColorMaster', action: 'comentou seu post', time: '12m', icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
                    { user: 'ArtCollector', action: 'começou a seguir você', time: '1h', icon: <UserPlus className="h-4 w-4 text-green-500" /> },
                    { user: 'PixelPro', action: 'partilhou seu pixel', time: '2h', icon: <Share2 className="h-4 w-4 text-purple-500" /> }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/20 rounded transition-colors cursor-pointer">
                      <div className="p-1 bg-muted/30 rounded-full">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time} atrás</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas da Comunidade */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Stats da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Posts hoje:</span>
                    <span className="font-bold text-primary">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Utilizadores ativos:</span>
                    <span className="font-bold text-green-500">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pixels partilhados:</span>
                    <span className="font-bold text-accent">567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Interações:</span>
                    <span className="font-bold text-purple-500">8,901</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story Viewer Modal */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="relative w-full max-w-md h-full">
              <img 
                src={selectedStory.content.url} 
                alt="Story"
                className="w-full h-full object-cover"
              />
              
              {/* Story Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={selectedStory.author.avatar} />
                    <AvatarFallback>{selectedStory.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{selectedStory.author.name}</span>
                    <p className="text-sm text-white/80">{selectedStory.timestamp}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedStory(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Story Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm">{selectedStory.views.toLocaleString()} visualizações</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}