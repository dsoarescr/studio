'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, Send, Plus, Camera, MapPin, 
  Trophy, Star, Crown, Gem, Zap, Eye, ThumbsUp, MessageCircle,
  UserPlus, Settings, Search, Filter, Bookmark, Flag, MoreHorizontal,
  Image as ImageIcon, Video, Mic, Smile, Gift, Coins, Award, Phone, ArrowLeft,
  Globe, Clock, TrendingUp, Flame, Target, Sparkles, Edit3, Bell,
  Play, Pause, Volume2, X, ChevronRight, Info, CheckCircle,
  Compass, ShoppingCart, VolumeX, Check,
  ArrowUp, ArrowDown, Reply, Forward, Download, Upload, Link2,
  PinIcon, Lock, Unlock, AlertTriangle,
  Megaphone, Radio, Headphones, Music, Gamepad2, Coffee, Palette
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';

// Types
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    level: number;
    verified: boolean;
    isPremium: boolean;
    region: string;
  };
  content: {
    text?: string;
    images?: string[];
    pixel?: {
      x: number;
      y: number;
      region: string;
      color: string;
      price?: number;
    };
    achievement?: {
      name: string;
      icon: string;
      rarity: string;
    };
  };
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  type: 'text' | 'pixel' | 'achievement' | 'purchase' | 'story';
  visibility: 'public' | 'friends' | 'group';
  groupId?: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  region: string;
  avatar: string;
  memberCount: number;
  isJoined: boolean;
  isPrivate: boolean;
  recentActivity: string;
  category: 'regional' | 'interest' | 'trading' | 'art';
  tags: string[];
}

interface ChatConversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }>;
  lastMessage: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
}

interface Story {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: {
    type: 'image' | 'video' | 'pixel';
    url: string;
    duration?: number;
  };
  timestamp: Date;
  isViewed: boolean;
}

// Mock Data
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'PixelArtist',
      username: '@pixelartist',
      avatar: 'https://placehold.co/40x40.png',
      level: 15,
      verified: true,
      isPremium: true,
      region: 'Lisboa'
    },
    content: {
      text: 'Acabei de criar esta obra-prima no coração de Lisboa! 🎨✨ O que acham da combinação de cores?',
      images: ['https://placehold.co/400x300/D4A757/FFFFFF?text=Arte+Lisboa'],
      pixel: {
        x: 245,
        y: 156,
        region: 'Lisboa',
        color: '#D4A757',
        price: 150
      }
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 89,
    comments: 23,
    shares: 12,
    isLiked: false,
    isBookmarked: false,
    tags: ['arte', 'lisboa', 'masterpiece'],
    type: 'pixel',
    visibility: 'public'
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'ColorMaster',
      username: '@colormaster',
      avatar: 'https://placehold.co/40x40.png',
      level: 12,
      verified: false,
      isPremium: false,
      region: 'Porto'
    },
    content: {
      text: 'Novo recorde pessoal! 🚀 Consegui comprar 50 pixels numa semana! A estratégia de investimento está a funcionar 💪',
      achievement: {
        name: 'Colecionador Semanal',
        icon: '🏆',
        rarity: 'Épico'
      }
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 156,
    comments: 45,
    shares: 28,
    isLiked: true,
    isBookmarked: true,
    tags: ['conquista', 'recorde', 'investimento'],
    type: 'achievement',
    visibility: 'public'
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'PortoPixelPro',
      username: '@portopixelpro',
      avatar: 'https://placehold.co/40x40.png',
      level: 20,
      verified: true,
      isPremium: true,
      region: 'Porto'
    },
    content: {
      text: 'Alguém quer colaborar num projeto de pixel art gigante? Estou a planear algo épico para a zona da Ribeira! 🎯',
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 67,
    comments: 34,
    shares: 15,
    isLiked: false,
    isBookmarked: false,
    tags: ['colaboração', 'porto', 'projeto'],
    type: 'text',
    visibility: 'public'
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Artistas de Lisboa',
    description: 'Comunidade de criadores da capital portuguesa',
    region: 'Lisboa',
    avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
    memberCount: 234,
    isJoined: true,
    isPrivate: false,
    recentActivity: 'Nova obra partilhada há 2h',
    category: 'regional',
    tags: ['arte', 'lisboa', 'criatividade']
  },
  {
    id: '2',
    name: 'Investidores do Norte',
    description: 'Estratégias de investimento em pixels do Norte',
    region: 'Porto',
    avatar: 'https://placehold.co/60x60/7DF9FF/000000?text=💎',
    memberCount: 89,
    isJoined: false,
    isPrivate: false,
    recentActivity: 'Discussão sobre tendências há 1h',
    category: 'trading',
    tags: ['investimento', 'porto', 'estratégia']
  },
  {
    id: '3',
    name: 'Pixel Art Iniciantes',
    description: 'Espaço para quem está a começar no pixel art',
    region: 'Nacional',
    avatar: 'https://placehold.co/60x60/9C27B0/FFFFFF?text=🎨',
    memberCount: 567,
    isJoined: false,
    isPrivate: false,
    recentActivity: 'Tutorial publicado há 30min',
    category: 'art',
    tags: ['iniciantes', 'tutorial', 'aprendizagem']
  },
  {
    id: '4',
    name: 'Colecionadores Premium',
    description: 'Grupo exclusivo para colecionadores sérios',
    region: 'Nacional',
    avatar: 'https://placehold.co/60x60/FFD700/000000?text=👑',
    memberCount: 45,
    isJoined: false,
    isPrivate: true,
    recentActivity: 'Leilão privado há 3h',
    category: 'trading',
    tags: ['premium', 'coleção', 'exclusivo']
  }
];

const mockConversations: ChatConversation[] = [
  {
    id: '1',
    participants: [
      { id: 'user1', name: 'PixelArtist', avatar: 'https://placehold.co/30x30.png', isOnline: true }
    ],
    lastMessage: {
      text: 'Obrigado pela dica sobre as cores! 🎨',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      senderId: 'user1'
    },
    unreadCount: 2,
    isGroup: false
  },
  {
    id: '2',
    participants: [
      { id: 'user2', name: 'ColorMaster', avatar: 'https://placehold.co/30x30.png', isOnline: false },
      { id: 'user3', name: 'PortoPixelPro', avatar: 'https://placehold.co/30x30.png', isOnline: true }
    ],
    lastMessage: {
      text: 'Vamos marcar para amanhã então!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: 'user3'
    },
    unreadCount: 0,
    isGroup: true,
    groupName: 'Projeto Ribeira'
  }
];

const mockStories: Story[] = [
  {
    id: '1',
    author: { id: 'user1', name: 'PixelArtist', avatar: 'https://placehold.co/40x40.png' },
    content: { type: 'pixel', url: 'https://placehold.co/300x400/D4A757/FFFFFF?text=Story+1' },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isViewed: false
  },
  {
    id: '2',
    author: { id: 'user2', name: 'ColorMaster', avatar: 'https://placehold.co/40x40.png' },
    content: { type: 'image', url: 'https://placehold.co/300x400/7DF9FF/000000?text=Story+2' },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isViewed: true
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [newPostText, setNewPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { user } = useAuth();
  const { addCredits, addXp, level, credits, specialCredits } = useUserStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simular atividade em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular novos likes aleatórios
      if (Math.random() > 0.7) {
        setPosts(prev => prev.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3)
        })));
      }
      
      // Simular novas mensagens
      if (Math.random() > 0.8) {
        setConversations(prev => prev.map(conv => ({
          ...conv,
          unreadCount: conv.unreadCount + (Math.random() > 0.5 ? 1 : 0)
        })));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para publicar na comunidade.",
        variant: "destructive"
      });
      return;
    }

    if (!newPostText.trim() && selectedImages.length === 0) {
      toast({
        title: "Conteúdo Necessário",
        description: "Adicione texto ou imagens para publicar.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingPost(true);
    
    // Simular criação de post
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: 'currentUser',
        name: user.displayName || 'Você',
        username: '@você',
        avatar: user.photoURL || 'https://placehold.co/40x40.png',
        level: level,
        verified: true,
        isPremium: true,
        region: 'Lisboa'
      },
      content: {
        text: newPostText,
        images: selectedImages.length > 0 ? ['https://placehold.co/400x300/D4A757/FFFFFF?text=Sua+Imagem'] : undefined
      },
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      tags: extractHashtags(newPostText),
      type: 'text',
      visibility: 'public'
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setSelectedImages([]);
    setIsCreatingPost(false);
    
    // Recompensar por publicar
    addCredits(10);
    addXp(25);
    setShowConfetti(true);
    setPlayNotificationSound(true);
    
    toast({
      title: "Publicação Criada! 🎉",
      description: "Recebeu 10 créditos + 25 XP por partilhar com a comunidade!",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
    
    if (!posts.find(p => p.id === postId)?.isLiked) {
      addXp(5);
      setPlayNotificationSound(true);
    }
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
    
    toast({
      title: posts.find(p => p.id === postId)?.isBookmarked ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
      description: "Post guardado na sua coleção.",
    });
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            isJoined: !group.isJoined,
            memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1
          }
        : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    if (group) {
      addXp(group.isJoined ? -10 : 15);
      toast({
        title: group.isJoined ? "Saiu do Grupo" : "Juntou-se ao Grupo! 🎉",
        description: `${group.name} - ${group.isJoined ? 'Deixou de seguir' : 'Agora é membro'}`,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4); // Máximo 4 imagens
      setSelectedImages(files);
    }
  };

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#\w+/g);
    return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'agora';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'regional': return <MapPin className="h-4 w-4" />;
      case 'trading': return <TrendingUp className="h-4 w-4" />;
      case 'art': return <Palette className="h-4 w-4" />;
      case 'interest': return <Heart className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regional': return 'text-blue-500 bg-blue-500/10';
      case 'trading': return 'text-green-500 bg-green-500/10';
      case 'art': return 'text-purple-500 bg-purple-500/10';
      case 'interest': return 'text-pink-500 bg-pink-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !selectedConversation) return;
    
    // Simular envio de mensagem
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            lastMessage: {
              text: chatMessage,
              timestamp: new Date(),
              senderId: 'currentUser'
            }
          }
        : conv
    ));
    
    setChatMessage('');
    addXp(2);
    
    toast({
      title: "Mensagem Enviada",
      description: "+2 XP por interagir com a comunidade!",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 pb-4 px-6">
            <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Junte-se à Comunidade</h3>
            <p className="text-muted-foreground mb-6">
              Conecte-se com outros criadores, partilhe os seus pixels e descubra obras incríveis!
            </p>
            <div className="flex flex-col gap-3">
              <AuthModal defaultTab="register">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </Button>
              </AuthModal>
              <AuthModal defaultTab="login">
                <Button variant="outline" className="w-full">
                  Já tenho conta
                </Button>
              </AuthModal>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.NOTIFICATION} play={playNotificationSound} onEnd={() => setPlayNotificationSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-4 px-3 mb-16 space-y-4 max-w-4xl">
        {/* Header Mobile-First */}
        <Card className="shadow-lg bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl text-gradient-gold flex items-center">
                  <Users className="h-6 w-6 mr-2 animate-glow" />
                  Comunidade
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Conecte-se, partilhe e descubra
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stories Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {/* Add Story Button */}
              <div className="flex-shrink-0 text-center">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-dashed border-primary">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>
                      <Plus className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                    <Plus className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-xs mt-1 font-medium">Sua Story</p>
              </div>
              
              {/* Stories */}
              {stories.map(story => (
                <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
                  <div className="relative">
                    <Avatar className={`h-16 w-16 border-2 ${story.isViewed ? 'border-muted' : 'border-primary'}`}>
                      <AvatarImage src={story.author.avatar} />
                      <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                    </Avatar>
                    {!story.isViewed && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs mt-1 truncate w-16">{story.author.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="feed" className="text-xs">
              <MessageSquare className="h-4 w-4 mr-1" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              <Users className="h-4 w-4 mr-1" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-xs">
              <Compass className="h-4 w-4 mr-1" />
              Descobrir
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            {/* Create Post Card */}
            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Partilhe algo incrível com a comunidade... 🎨"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      className="min-h-[80px] resize-none border-0 bg-muted/30 focus:bg-background transition-colors"
                      rows={3}
                    />
                    
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Foto
                        </Button>
                        <Button variant="ghost" size="sm" className="text-accent">
                          <MapPin className="h-4 w-4 mr-1" />
                          Pixel
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-500">
                          <Trophy className="h-4 w-4 mr-1" />
                          Conquista
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={handleCreatePost}
                        disabled={isCreatingPost || (!newPostText.trim() && selectedImages.length === 0)}
                        className="bg-gradient-to-r from-primary to-accent"
                      >
                        {isCreatingPost ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Publicando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Publicar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{post.author.name}</span>
                                {post.author.verified && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                )}
                                {post.author.isPremium && (
                                  <Crown className="h-3 w-3 text-amber-500" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  Nv.{post.author.level}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{post.author.username}</span>
                                <span>•</span>
                                <span>{post.author.region}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(post.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Post Content */}
                        <div className="space-y-3">
                          {post.content.text && (
                            <p className="text-sm leading-relaxed">{post.content.text}</p>
                          )}
                          
                          {post.content.images && (
                            <div className="grid grid-cols-1 gap-2">
                              {post.content.images.map((image, index) => (
                                <img 
                                  key={index}
                                  src={image} 
                                  alt={`Post image ${index + 1}`}
                                  className="w-full rounded-lg border border-border"
                                />
                              ))}
                            </div>
                          )}
                          
                          {post.content.pixel && (
                            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-12 h-12 rounded-lg border-2 border-primary/50"
                                    style={{ backgroundColor: post.content.pixel.color }}
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">
                                      Pixel ({post.content.pixel.x}, {post.content.pixel.y})
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      {post.content.pixel.region}
                                      {post.content.pixel.price && ` • €${post.content.pixel.price}`}
                                    </p>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          
                          {post.content.achievement && (
                            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{post.content.achievement.icon}</div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">Conquista Desbloqueada!</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {post.content.achievement.name} • {post.content.achievement.rarity}
                                    </p>
                                  </div>
                                  <Badge className="bg-yellow-500">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Novo
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikePost(post.id)}
                              className={cn(
                                "gap-2 transition-colors",
                                post.isLiked ? "text-red-500" : "text-muted-foreground"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                              <span className="text-xs">{post.likes}</span>
                            </Button>
                            
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-xs">{post.comments}</span>
                            </Button>
                            
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                              <Share2 className="h-4 w-4" />
                              <span className="text-xs">{post.shares}</span>
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmarkPost(post.id)}
                            className={cn(
                              "h-8 w-8",
                              post.isBookmarked ? "text-yellow-500" : "text-muted-foreground"
                            )}
                          >
                            <Bookmark className={cn("h-4 w-4", post.isBookmarked && "fill-current")} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            {/* Search Groups */}
            <Card>
              <CardContent className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar grupos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Create Group Button */}
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="w-full bg-gradient-to-r from-primary to-accent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Grupo
            </Button>

            {/* Groups List */}
            <div className="space-y-3">
              {groups
                .filter(group => 
                  !searchQuery || 
                  group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  group.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(group => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={group.avatar} 
                            alt={group.name}
                            className="w-12 h-12 rounded-full border-2 border-border"
                          />
                          {group.isPrivate && (
                            <Lock className="absolute -bottom-1 -right-1 h-4 w-4 bg-background rounded-full p-0.5 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{group.name}</h3>
                            <Badge className={cn("text-xs", getCategoryColor(group.category))}>
                              {getCategoryIcon(group.category)}
                              <span className="ml-1 capitalize">{group.category}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {group.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {group.memberCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {group.region}
                              </span>
                            </div>
                            
                            <Button
                              variant={group.isJoined ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleJoinGroup(group.id)}
                              className="h-7 text-xs"
                            >
                              {group.isJoined ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Membro
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Juntar
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {group.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-xs text-accent mt-1">{group.recentActivity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            {selectedConversation ? (
              /* Chat View */
              <Card className="h-[70vh] flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedConversation(null)}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {selectedConversation.isGroup ? (
                        <div className="flex -space-x-2">
                          {selectedConversation.participants.slice(0, 2).map(participant => (
                            <Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      ) : (
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedConversation.participants[0].avatar} />
                            <AvatarFallback>{selectedConversation.participants[0].name[0]}</AvatarFallback>
                          </Avatar>
                          {selectedConversation.participants[0].isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-semibold text-sm">
                          {selectedConversation.isGroup 
                            ? selectedConversation.groupName 
                            : selectedConversation.participants[0].name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.isGroup 
                            ? `${selectedConversation.participants.length} membros`
                            : selectedConversation.participants[0].isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-auto">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Mock messages */}
                    {[
                      { id: '1', text: 'Olá! Vi o teu pixel em Lisboa, está incrível! 🎨', sender: 'other', time: '14:23' },
                      { id: '2', text: 'Obrigado! Demorei 2 horas a escolher as cores certas 😅', sender: 'me', time: '14:25' },
                      { id: '3', text: 'Queres colaborar num projeto? Tenho uma ideia para a zona do Chiado', sender: 'other', time: '14:27' },
                      { id: '4', text: 'Adorava! Manda-me os detalhes 🚀', sender: 'me', time: '14:28' }
                    ].map(message => (
                      <div 
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === 'me' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[80%] p-3 rounded-2xl text-sm",
                          message.sender === 'me' 
                            ? "bg-primary text-primary-foreground rounded-br-md" 
                            : "bg-muted rounded-bl-md"
                        )}>
                          <p>{message.text}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.sender === 'me' ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
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
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Escrever mensagem..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Camera className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Smile className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={sendChatMessage}
                      disabled={!chatMessage.trim()}
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              /* Conversations List */
              <div className="space-y-3">
                {conversations.map(conversation => (
                  <Card 
                    key={conversation.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {conversation.isGroup ? (
                            <div className="flex -space-x-2">
                              {conversation.participants.slice(0, 2).map(participant => (
                                <Avatar key={participant.id} className="h-10 w-10 border-2 border-background">
                                  <AvatarImage src={participant.avatar} />
                                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          ) : (
                            <>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={conversation.participants[0].avatar} />
                                <AvatarFallback>{conversation.participants[0].name[0]}</AvatarFallback>
                              </Avatar>
                              {conversation.participants[0].isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">
                              {conversation.isGroup 
                                ? conversation.groupName 
                                : conversation.participants[0].name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 text-xs flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-4">
            {/* Trending Section */}
            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                  Trending Agora
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tag: '#LisboaArt', posts: '234 posts', trend: '+45%' },
                  { tag: '#PixelInvestment', posts: '156 posts', trend: '+23%' },
                  { tag: '#PortugalPixels', posts: '89 posts', trend: '+12%' },
                  { tag: '#CollabProject', posts: '67 posts', trend: '+8%' }
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                    <div>
                      <span className="font-medium text-primary">{trend.tag}</span>
                      <p className="text-xs text-muted-foreground">{trend.posts}</p>
                    </div>
                    <Badge className="bg-green-500 text-white text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {trend.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Featured Creators */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Criadores em Destaque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'PixelMaster', region: 'Lisboa', followers: '1.2K', avatar: 'https://placehold.co/40x40.png' },
                  { name: 'ArtCollector', region: 'Porto', followers: '890', avatar: 'https://placehold.co/40x40.png' },
                  { name: 'ColorWizard', region: 'Coimbra', followers: '567', avatar: 'https://placehold.co/40x40.png' }
                ].map((creator, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">{creator.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {creator.region} • {creator.followers} seguidores
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Seguir
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live Events */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Radio className="h-5 w-5 mr-2 text-purple-500" />
                  Eventos ao Vivo
                  <Badge className="ml-2 bg-red-500 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1" />
                    AO VIVO
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: 'Concurso de Arte Natalícia',
                    host: 'PixelUniverse',
                    participants: 156,
                    timeLeft: '2h 34m',
                    prize: '1000 créditos especiais'
                  },
                  {
                    title: 'Live Stream: Técnicas Avançadas',
                    host: 'PixelMaster',
                    participants: 89,
                    timeLeft: '45m',
                    prize: 'Conhecimento'
                  }
                ].map((event, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">por {event.host}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.timeLeft}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.participants}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            {event.prize}
                          </span>
                        </div>
                        <Button size="sm" className="h-6 text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Participar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-4 z-30">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:scale-110 transition-transform"
            onClick={() => setActiveTab('feed')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Create Group Dialog */}
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Criar Novo Grupo
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Grupo</label>
                <Input placeholder="Ex: Artistas de Braga" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea placeholder="Descreva o propósito do grupo..." rows={3} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Região</label>
                <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                  <option value="">Selecionar região...</option>
                  <option value="lisboa">Lisboa</option>
                  <option value="porto">Porto</option>
                  <option value="coimbra">Coimbra</option>
                  <option value="braga">Braga</option>
                  <option value="faro">Faro</option>
                  <option value="nacional">Nacional</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'regional', label: 'Regional', icon: <MapPin className="h-4 w-4" /> },
                    { id: 'art', label: 'Arte', icon: <Palette className="h-4 w-4" /> },
                    { id: 'trading', label: 'Trading', icon: <TrendingUp className="h-4 w-4" /> },
                    { id: 'interest', label: 'Interesse', icon: <Heart className="h-4 w-4" /> }
                  ].map(category => (
                    <Button key={category.id} variant="outline" className="justify-start h-10">
                      {category.icon}
                      <span className="ml-2">{category.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="private-group" className="rounded" />
                <label htmlFor="private-group" className="text-sm">Grupo Privado</label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setShowCreateGroup(false);
                  toast({
                    title: "Grupo Criado! 🎉",
                    description: "O seu grupo foi criado com sucesso!",
                  });
                }}
              >
                Criar Grupo
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Stats Footer */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">{posts.length}</div>
                <div className="text-xs text-muted-foreground">Posts Hoje</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">{groups.filter(g => g.isJoined).length}</div>
                <div className="text-xs text-muted-foreground">Grupos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-500">{conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}</div>
                <div className="text-xs text-muted-foreground">Mensagens</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
