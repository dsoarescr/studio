'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, MessageSquare, Heart, Share2, Send, Camera, Video, Mic,
  Image as ImageIcon, MapPin, Calendar, Clock, Star, Crown, Gem,
  Sparkles, Award, Trophy, Target, Zap, Activity, Bell, Settings,
  Search, Filter, Plus, MoreHorizontal, ThumbsUp, ThumbsDown,
  Bookmark, Flag, Eye, Play, Pause, Volume2, VolumeX, Phone,
  UserPlus, UserMinus, Edit, Trash2, Copy, ExternalLink, Globe,
  Palette, Brush, Music, Gift, Coins, Flame, TrendingUp, Hash,
  AtSign, Smile, Paperclip, Download, Upload, RefreshCw, X,
  Check, ArrowRight, ChevronDown, ChevronUp, MoreVertical,
  MessageCircle, Repeat, Quote, AlertTriangle, Info, CheckCircle
} from "lucide-react";

interface SocialPost {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    followers: number;
    isFollowing: boolean;
  };
  content: string;
  media?: {
    type: 'image' | 'video' | 'pixel' | 'collection';
    url: string;
    thumbnail?: string;
    metadata?: any;
  }[];
  pixel?: {
    x: number;
    y: number;
    region: string;
    imageUrl: string;
    price?: number;
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isShared: boolean;
  tags: string[];
  mentions: string[];
  location?: string;
  mood?: string;
  privacy: 'public' | 'followers' | 'private';
  isPinned: boolean;
  isPromoted: boolean;
  engagement: {
    rate: number;
    reach: number;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'regional';
  members: number;
  avatar: string;
  isJoined: boolean;
  lastMessage: {
    user: string;
    content: string;
    timestamp: string;
  };
  unreadCount: number;
  isActive: boolean;
}

interface LiveStream {
  id: string;
  streamer: {
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  title: string;
  viewers: number;
  thumbnail: string;
  category: string;
  isLive: boolean;
  duration: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'contest' | 'workshop' | 'meetup' | 'auction';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize?: string;
  location?: string;
  isOnline: boolean;
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  isJoined: boolean;
  status: 'upcoming' | 'live' | 'ended';
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'PixelArtist',
      username: '@pixelartist',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 15,
      followers: 1234,
      isFollowing: false
    },
    content: 'Acabei de criar esta obra-prima em Lisboa! 🎨✨ Levei 3 horas mas valeu cada minuto. O que acham da combinação de cores? #PixelArt #Lisboa #Arte',
    media: [{
      type: 'pixel',
      url: 'https://placehold.co/400x400/D4A757/FFFFFF?text=Lisboa+Art',
      metadata: { x: 245, y: 156, region: 'Lisboa' }
    }],
    pixel: {
      x: 245,
      y: 156,
      region: 'Lisboa',
      imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa',
      price: 150
    },
    likes: 89,
    comments: 23,
    shares: 12,
    views: 456,
    timestamp: '2h',
    isLiked: false,
    isBookmarked: true,
    isShared: false,
    tags: ['PixelArt', 'Lisboa', 'Arte'],
    mentions: [],
    location: 'Lisboa, Portugal',
    mood: '🎨',
    privacy: 'public',
    isPinned: false,
    isPromoted: false,
    engagement: {
      rate: 18.5,
      reach: 2340
    }
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'ColorMaster',
      username: '@colormaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 12,
      followers: 567,
      isFollowing: true
    },
    content: 'Novo recorde pessoal! 🚀 Consegui 50 pixels numa semana! Obrigado a todos que compraram e apoiaram. Próxima meta: 100 pixels! 💪 #Milestone #PixelUniverse',
    likes: 156,
    comments: 45,
    shares: 28,
    views: 890,
    timestamp: '4h',
    isLiked: true,
    isBookmarked: false,
    isShared: true,
    tags: ['Milestone', 'PixelUniverse'],
    mentions: [],
    mood: '🚀',
    privacy: 'public',
    isPinned: true,
    isPromoted: false,
    engagement: {
      rate: 22.1,
      reach: 1890
    }
  }
];

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Geral',
    description: 'Conversa geral da comunidade',
    type: 'public',
    members: 1247,
    avatar: 'https://placehold.co/40x40/D4A757/FFFFFF?text=G',
    isJoined: true,
    lastMessage: {
      user: 'PixelMaster',
      content: 'Alguém sabe quando sai a próxima atualização?',
      timestamp: '2m'
    },
    unreadCount: 3,
    isActive: true
  },
  {
    id: '2',
    name: 'Trading & Investimento',
    description: 'Discussões sobre compra e venda',
    type: 'public',
    members: 456,
    avatar: 'https://placehold.co/40x40/7DF9FF/000000?text=T',
    isJoined: true,
    lastMessage: {
      user: 'InvestorPro',
      content: 'Pixels de Lisboa estão em alta! 📈',
      timestamp: '5m'
    },
    unreadCount: 0,
    isActive: true
  },
  {
    id: '3',
    name: 'Arte & Criatividade',
    description: 'Partilha de técnicas e inspiração',
    type: 'public',
    members: 789,
    avatar: 'https://placehold.co/40x40/9C27B0/FFFFFF?text=A',
    isJoined: false,
    lastMessage: {
      user: 'ArtGuru',
      content: 'Tutorial de sombreamento disponível!',
      timestamp: '1h'
    },
    unreadCount: 0,
    isActive: false
  }
];

const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    streamer: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      followers: 2341
    },
    title: 'Criando Arte Pixel em Tempo Real - Lisboa',
    viewers: 156,
    thumbnail: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Live+Stream',
    category: 'Arte',
    isLive: true,
    duration: '1:23:45'
  }
];

const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Concurso de Arte Natalícia',
    description: 'Crie o melhor pixel com tema natalício e ganhe prémios incríveis!',
    type: 'contest',
    startDate: '2024-12-20',
    endDate: '2024-12-31',
    participants: 234,
    maxParticipants: 500,
    prize: '2000€ + Pixel Lendário',
    isOnline: true,
    organizer: {
      name: 'Pixel Universe',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    isJoined: false,
    status: 'upcoming'
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [chatRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [liveStreams] = useState<LiveStream[]>(mockLiveStreams);
  const [events] = useState<CommunityEvent[]>(mockEvents);
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1247);
  
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();
  const router = useRouter();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const moods = ['😊', '🎨', '🚀', '💪', '🔥', '✨', '🎉', '💡', '🌟', '❤️'];
  const locations = ['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro', 'Viseu'];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
      
      // Add random activity
      if (Math.random() > 0.8) {
        const activities = [
          'PixelMaster comprou um pixel em Lisboa',
          'ArtistaPro criou uma nova obra',
          'ColorQueen ganhou uma conquista',
          'InvestorPro vendeu um pixel raro'
        ];
        
        // Could add to activity feed here
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const post: SocialPost = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'Você',
        username: '@voce',
        avatar: 'https://placehold.co/40x40.png',
        verified: true,
        level: 15,
        followers: 234,
        isFollowing: false
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      timestamp: 'agora',
      isLiked: false,
      isBookmarked: false,
      isShared: false,
      tags: newPost.match(/#\w+/g)?.map(tag => tag.substring(1)) || [],
      mentions: newPost.match(/@\w+/g)?.map(mention => mention.substring(1)) || [],
      location: selectedLocation,
      mood: selectedMood,
      privacy: 'public',
      isPinned: false,
      isPromoted: false,
      engagement: {
        rate: 0,
        reach: 0
      }
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedMood('');
    setSelectedLocation('');
    
    addXp(10);
    addCredits(5);
    
    toast({
      title: "Post Criado! 📝",
      description: "Sua publicação foi partilhada com a comunidade. +10 XP, +5 créditos",
    });
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleFollow = (userId: string) => {
    setPosts(prev => prev.map(post => 
      post.author.id === userId 
        ? { 
            ...post, 
            author: {
              ...post.author,
              isFollowing: !post.author.isFollowing,
              followers: post.author.isFollowing ? post.author.followers - 1 : post.author.followers + 1
            }
          }
        : post
    ));
    
    toast({
      title: "Seguindo!",
      description: "Agora você segue este utilizador.",
    });
  };

  const handleJoinChatRoom = (roomId: string) => {
    setSelectedChatRoom(roomId);
    // Load chat messages for this room
    setChatMessages([
      {
        id: '1',
        user: 'PixelMaster',
        avatar: 'https://placehold.co/30x30.png',
        content: 'Olá pessoal! Como estão?',
        timestamp: '14:23',
        isOwn: false
      },
      {
        id: '2',
        user: 'ArtistaPro',
        avatar: 'https://placehold.co/30x30.png',
        content: 'Tudo bem! Acabei de terminar um pixel incrível',
        timestamp: '14:25',
        isOwn: false
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatRoom) return;
    
    const message = {
      id: Date.now().toString(),
      user: 'Você',
      avatar: 'https://placehold.co/30x30.png',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleJoinEvent = (eventId: string) => {
    toast({
      title: "Evento Registado! 🎉",
      description: "Você foi registado no evento com sucesso.",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl mb-16">
        {/* Enhanced Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold-animated flex items-center">
                  <Users className="h-8 w-8 mr-3 animate-glow" />
                  Comunidade Pixel Universe
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Conecte-se, partilhe e colabore com artistas de todo Portugal
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">{onlineUsers.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Online agora</p>
                </div>
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Post
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="feed" className="font-headline">
              <MessageSquare className="h-4 w-4 mr-2"/>
              Feed Social
            </TabsTrigger>
            <TabsTrigger value="chat" className="font-headline">
              <MessageCircle className="h-4 w-4 mr-2"/>
              Chat Rooms
            </TabsTrigger>
            <TabsTrigger value="live" className="font-headline">
              <Video className="h-4 w-4 mr-2"/>
              Lives
            </TabsTrigger>
            <TabsTrigger value="events" className="font-headline">
              <Calendar className="h-4 w-4 mr-2"/>
              Eventos
            </TabsTrigger>
            <TabsTrigger value="discover" className="font-headline">
              <Search className="h-4 w-4 mr-2"/>
              Descobrir
            </TabsTrigger>
          </TabsList>

          {/* Social Feed */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" />
                        <AvatarFallback>V</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="O que está a acontecer no seu mundo de pixels?"
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="resize-none"
                          rows={3}
                        />
                        
                        {/* Post Options */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Camera className="h-4 w-4 mr-2" />
                              Foto
                            </Button>
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              Localização
                            </Button>
                            <Button variant="outline" size="sm">
                              <Palette className="h-4 w-4 mr-2" />
                              Pixel
                            </Button>
                          </div>
                          
                          <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                            <Send className="h-4 w-4 mr-2" />
                            Publicar
                          </Button>
                        </div>
                        
                        {/* Mood and Location */}
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Humor:</span>
                            <div className="flex gap-1">
                              {moods.slice(0, 5).map(mood => (
                                <button
                                  key={mood}
                                  onClick={() => setSelectedMood(mood)}
                                  className={`text-lg hover:scale-125 transition-transform ${
                                    selectedMood === mood ? 'scale-125' : ''
                                  }`}
                                >
                                  {mood}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Local:</span>
                            <select
                              value={selectedLocation}
                              onChange={(e) => setSelectedLocation(e.target.value)}
                              className="text-sm border border-input bg-background rounded px-2 py-1"
                            >
                              <option value="">Selecionar...</option>
                              {locations.map(location => (
                                <option key={location} value={location}>{location}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-6">
                  <AnimatePresence>
                    {posts.map(post => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            {/* Post Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Link href={`/member/${post.author.id}`}>
                                  <Avatar className="cursor-pointer hover:scale-110 transition-transform">
                                    <AvatarImage src={post.author.avatar} />
                                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                  </Avatar>
                                </Link>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Link href={`/member/${post.author.id}`}>
                                      <span className="font-semibold hover:text-primary cursor-pointer">
                                        {post.author.name}
                                      </span>
                                    </Link>
                                    {post.author.verified && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      Nível {post.author.level}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{post.author.username}</span>
                                    <span>•</span>
                                    <span>{post.timestamp}</span>
                                    {post.location && (
                                      <>
                                        <span>•</span>
                                        <MapPin className="h-3 w-3" />
                                        <span>{post.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {post.mood && <span className="text-lg">{post.mood}</span>}
                                {!post.author.isFollowing && post.author.id !== 'current-user' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFollow(post.author.id)}
                                  >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Seguir
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Post Content */}
                            <div className="mb-4">
                              <p className="text-foreground leading-relaxed mb-3">
                                {post.content}
                              </p>
                              
                              {/* Tags */}
                              {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {post.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              {/* Media */}
                              {post.media && post.media.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                  {post.media.map((media, index) => (
                                    <div key={index} className="relative rounded-lg overflow-hidden">
                                      <img 
                                        src={media.url} 
                                        alt="Post media"
                                        className="w-full h-64 object-cover hover:scale-105 transition-transform cursor-pointer"
                                      />
                                      {media.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <Play className="h-12 w-12 text-white bg-black/50 rounded-full p-3" />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Pixel Showcase */}
                              {post.pixel && (
                                <Card className="bg-muted/20 mb-3">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                      <img 
                                        src={post.pixel.imageUrl} 
                                        alt="Pixel"
                                        className="w-20 h-20 rounded border"
                                      />
                                      <div className="flex-1">
                                        <h4 className="font-semibold">
                                          Pixel ({post.pixel.x}, {post.pixel.y})
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {post.pixel.region}
                                        </p>
                                        {post.pixel.price && (
                                          <p className="text-sm font-medium text-primary">
                                            €{post.pixel.price}
                                          </p>
                                        )}
                                      </div>
                                      <Button size="sm">
                                        Ver Pixel
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                            
                            {/* Engagement Stats */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-4">
                                <span>{formatNumber(post.likes)} curtidas</span>
                                <span>{formatNumber(post.comments)} comentários</span>
                                <span>{formatNumber(post.shares)} partilhas</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>{formatNumber(post.views)} visualizações</span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between border-t pt-4">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(post.id)}
                                  className={post.isLiked ? 'text-red-500' : ''}
                                >
                                  <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                                  Curtir
                                </Button>
                                
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Comentar
                                </Button>
                                
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Partilhar
                                </Button>
                              </div>
                              
                              <Button variant="ghost" size="sm">
                                <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                      Trending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { tag: '#LisboaArt', posts: '234 posts' },
                      { tag: '#PixelInvestment', posts: '156 posts' },
                      { tag: '#PortugalPixels', posts: '89 posts' },
                      { tag: '#NFTArt', posts: '67 posts' },
                      { tag: '#CommunityEvent', posts: '45 posts' }
                    ].map((trend, index) => (
                      <div key={index} className="flex justify-between hover:bg-muted/20 p-2 rounded cursor-pointer">
                        <span className="font-medium text-primary">{trend.tag}</span>
                        <span className="text-sm text-muted-foreground">{trend.posts}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Suggested Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                      Sugestões para Seguir
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'PixelGuru', username: '@pixelguru', avatar: 'https://placehold.co/40x40.png', verified: true },
                      { name: 'ArtCollector', username: '@artcollector', avatar: 'https://placehold.co/40x40.png', verified: false },
                      { name: 'DigitalArtist', username: '@digitalartist', avatar: 'https://placehold.co/40x40.png', verified: true }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{user.name}</span>
                              {user.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{user.username}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Seguir
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Live Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Activity className="h-4 w-4 mr-2 text-green-500" />
                      Atividade ao Vivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { user: 'PixelMaster', action: 'comprou um pixel em Lisboa', time: '2m' },
                      { user: 'ArtistaPro', action: 'criou uma nova obra', time: '5m' },
                      { user: 'ColorQueen', action: 'ganhou uma conquista', time: '8m' }
                    ].map((activity, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-primary">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action}</span>
                        <span className="text-xs text-muted-foreground block">{activity.time} atrás</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Chat Rooms */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Rooms List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Salas de Chat</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Sala
                  </Button>
                </div>
                
                {chatRooms.map(room => (
                  <Card 
                    key={room.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedChatRoom === room.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleJoinChatRoom(room.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={room.avatar} alt={room.name} className="w-12 h-12 rounded-full" />
                          {room.isActive && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{room.name}</h4>
                            {room.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white">
                                {room.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{room.members} membros</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {room.lastMessage.user}: {room.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                {selectedChatRoom ? (
                  <Card className="h-96 flex flex-col">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={chatRooms.find(r => r.id === selectedChatRoom)?.avatar} 
                            alt="Room" 
                            className="w-8 h-8 rounded-full" 
                          />
                          <div>
                            <h4 className="font-medium">
                              {chatRooms.find(r => r.id === selectedChatRoom)?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {chatRooms.find(r => r.id === selectedChatRoom)?.members} membros online
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
                      <div className="space-y-4">
                        {chatMessages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback>{message.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className={`max-w-xs ${message.isOwn ? 'text-right' : ''}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{message.user}</span>
                                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              </div>
                              <div className={`p-3 rounded-lg ${
                                message.isOwn 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                {message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escrever mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Selecione uma sala de chat</h3>
                      <p className="text-muted-foreground">
                        Escolha uma sala para começar a conversar com a comunidade
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Live Streams */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.map(stream => (
                <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-1" />
                      AO VIVO
                    </Badge>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {stream.viewers} espectadores
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={stream.streamer.avatar} />
                        <AvatarFallback>{stream.streamer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{stream.streamer.name}</span>
                          {stream.streamer.verified && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {stream.streamer.followers.toLocaleString()} seguidores
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{stream.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{stream.category}</Badge>
                      <span className="text-muted-foreground">{stream.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Start Your Own Stream */}
              <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Video className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Iniciar Live Stream</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Partilhe sua criação em tempo real
                  </p>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Começar Stream
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{event.organizer.name}</span>
                          {event.organizer.verified && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(event.startDate).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.participants} participantes</span>
                        {event.maxParticipants && (
                          <span className="text-muted-foreground">/ {event.maxParticipants}</span>
                        )}
                      </div>
                      {event.prize && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-500 font-medium">{event.prize}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={event.isJoined}
                    >
                      {event.isJoined ? 'Registado' : 'Participar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discover */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hash className="h-5 w-5 mr-2 text-primary" />
                    Hashtags Populares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { tag: 'PixelArt', count: 1234, trend: 'up' },
                      { tag: 'Lisboa', count: 567, trend: 'up' },
                      { tag: 'Investment', count: 234, trend: 'down' },
                      { tag: 'NFT', count: 189, trend: 'up' },
                      { tag: 'Community', count: 156, trend: 'neutral' },
                      { tag: 'Tutorial', count: 89, trend: 'up' }
                    ].map((hashtag, index) => (
                      <div key={index} className="p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-primary">#{hashtag.tag}</span>
                          {hashtag.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{hashtag.count} posts</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Artists */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Artistas em Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'PixelMaster', followers: 2341, pixels: 156, avatar: 'https://placehold.co/40x40.png', verified: true },
                      { name: 'ArtistaPro', followers: 1890, pixels: 89, avatar: 'https://placehold.co/40x40.png', verified: false },
                      { name: 'ColorQueen', followers: 1567, pixels: 234, avatar: 'https://placehold.co/40x40.png', verified: true }
                    ].map((artist, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={artist.avatar} />
                            <AvatarFallback>{artist.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{artist.name}</span>
                              {artist.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {artist.followers.toLocaleString()} seguidores • {artist.pixels} pixels
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Ver Perfil
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}