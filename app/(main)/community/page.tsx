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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Heart, Share2, Send, Camera, Image as ImageIcon, MapPin, Trophy, Star, Crown, Gift, Coins, Zap, Eye, ThumbsUp, Plus, Search, Filter, TrendingUp, Clock, Calendar, Globe, UserPlus, Settings, Bell, Bookmark, Flag, MoreHorizontal, Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight, Smile, Paperclip, Hash, AtSign, Mic, Video, Phone, Edit3, Trash2, Reply, Forward, Download, Upload, Palette, Target, Award, Flame, CloudLightning as Lightning, Sparkles, Compass, Activity, BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Types
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    level: number;
    isPremium: boolean;
  };
  content: string;
  type: 'text' | 'pixel' | 'achievement' | 'image';
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  pixel?: {
    x: number;
    y: number;
    region: string;
    color: string;
    price?: number;
    imageUrl?: string;
  };
  achievement?: {
    name: string;
    description: string;
    rarity: string;
    xp: number;
    credits: number;
  };
  imageUrl?: string;
  tags: string[];
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

interface Story {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    type: 'image' | 'video' | 'text';
    url?: string;
    text?: string;
    duration: number;
  };
  timestamp: Date;
  views: number;
  isViewed: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  region: string;
  members: number;
  avatar: string;
  isJoined: boolean;
  lastActivity: string;
  category: 'regional' | 'interest' | 'skill';
  isPrivate: boolean;
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
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'pixel' | 'system';
  isRead: boolean;
}

// Mock Data
const mockStories: Story[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'PixelArtist',
      avatar: 'https://placehold.co/60x60.png',
      verified: true
    },
    content: {
      type: 'image',
      url: 'https://placehold.co/400x600/D4A757/FFFFFF?text=Pixel+Story',
      duration: 5
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    views: 234,
    isViewed: false
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'ColorMaster',
      avatar: 'https://placehold.co/60x60.png',
      verified: false
    },
    content: {
      type: 'text',
      text: 'Acabei de comprar meu 100º pixel! 🎉',
      duration: 8
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    views: 156,
    isViewed: true
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'PixelMaster',
      username: '@pixelmaster',
      avatar: 'https://placehold.co/50x50.png',
      verified: true,
      level: 15,
      isPremium: true
    },
    content: 'Acabei de criar esta obra-prima em Lisboa! O que acham? 🎨✨',
    type: 'pixel',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 89,
    comments: [],
    shares: 12,
    isLiked: false,
    isBookmarked: false,
    pixel: {
      x: 245,
      y: 156,
      region: 'Lisboa',
      color: '#D4A757',
      price: 150,
      imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Art'
    },
    tags: ['arte', 'lisboa', 'masterpiece']
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'AchievementHunter',
      username: '@achiever',
      avatar: 'https://placehold.co/50x50.png',
      verified: false,
      level: 12,
      isPremium: false
    },
    content: 'Nova conquista desbloqueada! 🏆',
    type: 'achievement',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 156,
    comments: [],
    shares: 28,
    isLiked: true,
    isBookmarked: false,
    achievement: {
      name: 'Mestre das Cores',
      description: 'Use 30 cores diferentes',
      rarity: 'Épico',
      xp: 500,
      credits: 200
    },
    tags: ['conquista', 'cores']
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Artistas de Lisboa',
    description: 'Comunidade de criadores da capital',
    region: 'Lisboa',
    members: 234,
    avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
    isJoined: true,
    lastActivity: 'Nova obra partilhada há 2h',
    category: 'regional',
    isPrivate: false
  },
  {
    id: '2',
    name: 'Colecionadores Premium',
    description: 'Investidores e colecionadores sérios',
    region: 'Nacional',
    members: 89,
    avatar: 'https://placehold.co/60x60/7DF9FF/000000?text=💎',
    isJoined: false,
    lastActivity: 'Discussão sobre tendências',
    category: 'interest',
    isPrivate: true
  },
  {
    id: '3',
    name: 'Porto Pixels',
    description: 'Artistas e colecionadores do Porto',
    region: 'Porto',
    members: 167,
    avatar: 'https://placehold.co/60x60/9C27B0/FFFFFF?text=PO',
    isJoined: false,
    lastActivity: 'Tutorial publicado há 1h',
    category: 'regional',
    isPrivate: false
  }
];

const mockConversations: ChatConversation[] = [
  {
    id: '1',
    participants: [
      {
        id: 'user1',
        name: 'PixelArtist',
        avatar: 'https://placehold.co/40x40.png',
        isOnline: true
      }
    ],
    lastMessage: {
      content: 'Olá! Vi o teu pixel em Lisboa, está incrível!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      senderId: 'user1'
    },
    unreadCount: 2,
    isGroup: false
  },
  {
    id: '2',
    participants: [
      {
        id: 'user2',
        name: 'ColorMaster',
        avatar: 'https://placehold.co/40x40.png',
        isOnline: false
      },
      {
        id: 'user3',
        name: 'PixelPro',
        avatar: 'https://placehold.co/40x40.png',
        isOnline: true
      }
    ],
    lastMessage: {
      content: 'Vamos colaborar num projeto?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: 'user2'
    },
    unreadCount: 0,
    isGroup: true,
    groupName: 'Projeto Lisboa'
  }
];

const trendingTopics = [
  { tag: '#LisboaArt', posts: 234, growth: '+15%' },
  { tag: '#PixelInvestment', posts: 156, growth: '+8%' },
  { tag: '#PortugalPixels', posts: 89, growth: '+23%' },
  { tag: '#NewYear2025', posts: 67, growth: '+45%' },
  { tag: '#CollabArt', posts: 45, growth: '+12%' }
];

export default function CommunityPage() {
  const { user } = useAuth();
  const { addCredits, addXp, addNotification } = useUserStore();
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  
  // Post creation
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'pixel' | 'image'>('text');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  // Stories
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isViewingStories, setIsViewingStories] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(true);
  
  // Comments
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  
  // Chat
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  
  // Effects and sounds
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'following' | 'trending'>('all');

  // Story timer
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll for chat
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Story viewing logic
  useEffect(() => {
    if (isViewingStories && isStoryPlaying) {
      const currentStory = stories[currentStoryIndex];
      if (!currentStory) return;

      storyTimerRef.current = setInterval(() => {
        setStoryProgress(prev => {
          const newProgress = prev + (100 / (currentStory.content.duration * 10));
          if (newProgress >= 100) {
            nextStory();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      if (storyTimerRef.current) {
        clearInterval(storyTimerRef.current);
      }
    }

    return () => {
      if (storyTimerRef.current) {
        clearInterval(storyTimerRef.current);
      }
    };
  }, [isViewingStories, isStoryPlaying, currentStoryIndex]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new likes
      if (Math.random() > 0.7) {
        setPosts(prev => prev.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3)
        })));
      }
      
      // Simulate new messages
      if (Math.random() > 0.8 && conversations.length > 0) {
        setPlayNotificationSound(true);
        addNotification();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Functions
  const createPost = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para criar publicações.",
        variant: "destructive"
      });
      return;
    }

    if (!newPostContent.trim()) {
      toast({
        title: "Conteúdo Vazio",
        description: "Escreva algo antes de publicar.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingPost(true);

    // Simulate API call
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        author: {
          id: 'currentUser',
          name: user.displayName || 'Utilizador',
          username: `@${(user.displayName || 'user').toLowerCase()}`,
          avatar: user.photoURL || 'https://placehold.co/50x50.png',
          verified: true,
          level: 15,
          isPremium: true
        },
        content: newPostContent,
        type: newPostType,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        tags: extractHashtags(newPostContent)
      };

      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setIsCreatingPost(false);
      setPlaySuccessSound(true);
      setShowConfetti(true);

      // Reward user
      addCredits(10);
      addXp(25);

      toast({
        title: "Publicação Criada! 🎉",
        description: "Recebeu 10 créditos + 25 XP por partilhar conteúdo.",
      });
    }, 1000);
  };

  const likePost = (postId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir publicações.",
        variant: "destructive"
      });
      return;
    }

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;
        
        if (newIsLiked) {
          addXp(5);
          setPlayNotificationSound(true);
        }
        
        return {
          ...post,
          isLiked: newIsLiked,
          likes: Math.max(0, newLikes)
        };
      }
      return post;
    }));
  };

  const bookmarkPost = (postId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para guardar publicações.",
        variant: "destructive"
      });
      return;
    }

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsBookmarked = !post.isBookmarked;
        
        toast({
          title: newIsBookmarked ? "Publicação Guardada" : "Publicação Removida",
          description: newIsBookmarked ? "Adicionada aos seus favoritos." : "Removida dos favoritos.",
        });
        
        return { ...post, isBookmarked: newIsBookmarked };
      }
      return post;
    }));
  };

  const sharePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (navigator.share) {
      navigator.share({
        title: `Publicação de ${post.author.name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "Link da publicação copiado para a área de transferência.",
      });
    }

    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    ));

    addXp(10);
  };

  const addComment = (postId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para comentar.",
        variant: "destructive"
      });
      return;
    }

    if (!newCommentContent.trim()) {
      toast({
        title: "Comentário Vazio",
        description: "Escreva algo antes de comentar.",
        variant: "destructive"
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'currentUser',
        name: user.displayName || 'Utilizador',
        avatar: user.photoURL || 'https://placehold.co/40x40.png',
        verified: true,
        level: 15
      },
      content: newCommentContent,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setNewCommentContent('');
    addCredits(5);
    addXp(10);
    setPlaySuccessSound(true);

    toast({
      title: "Comentário Adicionado! 💬",
      description: "Recebeu 5 créditos + 10 XP por comentar.",
    });
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const joinGroup = (groupId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para se juntar a grupos.",
        variant: "destructive"
      });
      return;
    }

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newIsJoined = !group.isJoined;
        const newMembers = newIsJoined ? group.members + 1 : group.members - 1;
        
        toast({
          title: newIsJoined ? "Juntou-se ao Grupo! 👥" : "Saiu do Grupo",
          description: `${group.name} - ${newIsJoined ? 'Agora é membro' : 'Deixou de ser membro'}`,
        });
        
        if (newIsJoined) {
          addXp(20);
          setPlaySuccessSound(true);
        }
        
        return {
          ...group,
          isJoined: newIsJoined,
          members: Math.max(0, newMembers)
        };
      }
      return group;
    }));
  };

  const viewStory = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    setIsViewingStories(true);
    setStoryProgress(0);
    setIsStoryPlaying(true);
    
    // Mark story as viewed
    setStories(prev => prev.map((story, index) => 
      index === storyIndex ? { ...story, isViewed: true, views: story.views + 1 } : story
    ));
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setStoryProgress(0);
    } else {
      setIsViewingStories(false);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setStoryProgress(0);
    }
  };

  const toggleStoryPlayback = () => {
    setIsStoryPlaying(!isStoryPlaying);
  };

  const openChat = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'user1',
        content: 'Olá! Vi o teu pixel em Lisboa, está incrível!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: 'currentUser',
        content: 'Obrigado! Demorei muito tempo a escolher as cores certas.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        type: 'text',
        isRead: true
      }
    ];
    
    setChatMessages(mockMessages);
  };

  const sendChatMessage = () => {
    if (!newChatMessage.trim() || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      content: newChatMessage,
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };

    setChatMessages(prev => [...prev, newMessage]);
    setNewChatMessage('');
    
    // Update conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          lastMessage: {
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderId: newMessage.senderId
          }
        };
      }
      return conv;
    }));

    addXp(5);
  };

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#\w+/g);
    return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
  };

  const formatTimeAgo = (date: Date): string => {
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

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  const renderStoryContent = (story: Story) => {
    switch (story.content.type) {
      case 'image':
        return (
          <img 
            src={story.content.url} 
            alt="Story"
            className="w-full h-full object-cover"
          />
        );
      case 'text':
        return (
          <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-primary/20 to-accent/20">
            <p className="text-white text-xl font-medium text-center leading-relaxed">
              {story.content.text}
            </p>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full bg-muted">
            <Play className="h-16 w-16 text-muted-foreground" />
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 pb-4 px-6">
            <Users className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Junte-se à Comunidade</h2>
            <p className="text-muted-foreground mb-6">
              Faça login para partilhar pixels, descobrir artistas e participar em conversas.
            </p>
            <div className="flex flex-col gap-3">
              <AuthModal defaultTab="login">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Iniciar Sessão
                </Button>
              </AuthModal>
              <AuthModal defaultTab="register">
                <Button variant="outline" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
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
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <SoundEffect src={SOUND_EFFECTS.NOTIFICATION} play={playNotificationSound} onEnd={() => setPlayNotificationSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-4xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-2xl sm:text-3xl text-gradient-gold flex items-center">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 mr-3 animate-glow" />
                  Comunidade Pixel
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Conecte-se, partilhe e descubra com outros criadores de pixels
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2" />
                  {Math.floor(Math.random() * 500) + 200} online
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stories */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Stories</h3>
              <Badge variant="outline" className="text-xs">
                {stories.filter(s => !s.isViewed).length} novas
              </Badge>
            </div>
            
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-2">
                {/* Add Story Button */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs text-center">Adicionar</span>
                </div>
                
                {/* Stories */}
                {stories.map((story, index) => (
                  <div 
                    key={story.id} 
                    className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
                    onClick={() => viewStory(index)}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-full p-0.5 transition-transform hover:scale-105",
                      story.isViewed ? "bg-muted" : "bg-gradient-to-tr from-primary to-accent"
                    )}>
                      <Avatar className="w-full h-full border-2 border-background">
                        <AvatarImage src={story.author.avatar} />
                        <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs text-center max-w-[64px] truncate">
                      {story.author.name}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:flex bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="feed" className="text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Feed</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-xs sm:text-sm">
                <Users className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Grupos</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-xs sm:text-sm">
                <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="flex-shrink-0">
                    <AvatarImage src={user.photoURL || 'https://placehold.co/40x40.png'} />
                    <AvatarFallback>{(user.displayName || 'U')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="O que está a acontecer no seu universo de pixels?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[80px] resize-none"
                      maxLength={500}
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant={newPostType === 'text' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPostType('text')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Texto
                        </Button>
                        <Button
                          variant={newPostType === 'pixel' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPostType('pixel')}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Pixel
                        </Button>
                        <Button
                          variant={newPostType === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPostType('image')}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Imagem
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className="text-xs text-muted-foreground self-center">
                          {newPostContent.length}/500
                        </span>
                        <Button 
                          onClick={createPost}
                          disabled={!newPostContent.trim() || isCreatingPost}
                          className="px-6"
                        >
                          {isCreatingPost ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              A publicar...
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
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.author.name}</span>
                                {post.author.verified && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                {post.author.isPremium && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {post.author.level}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{post.author.username}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(post.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => bookmarkPost(post.id)}>
                                <Bookmark className="h-4 w-4 mr-2" />
                                {post.isBookmarked ? 'Remover dos Favoritos' : 'Guardar'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => sharePost(post.id)}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Partilhar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2" />
                                Reportar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Post Content */}
                        <div className="mb-3">
                          <p className="text-foreground leading-relaxed">{post.content}</p>
                          
                          {/* Pixel Display */}
                          {post.type === 'pixel' && post.pixel && (
                            <Card className="mt-3 bg-muted/20 border-primary/20">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-16 h-16 rounded border-2 border-primary/30 flex-shrink-0"
                                    style={{ backgroundColor: post.pixel.color }}
                                  >
                                    {post.pixel.imageUrl && (
                                      <img 
                                        src={post.pixel.imageUrl} 
                                        alt="Pixel"
                                        className="w-full h-full object-cover rounded"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold">
                                      Pixel ({post.pixel.x}, {post.pixel.y})
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {post.pixel.region}
                                    </p>
                                    {post.pixel.price && (
                                      <Badge variant="outline" className="mt-1">
                                        €{post.pixel.price}
                                      </Badge>
                                    )}
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Achievement Display */}
                          {post.type === 'achievement' && post.achievement && (
                            <Card className="mt-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-yellow-500/20 rounded-full">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-yellow-500">
                                      {post.achievement.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {post.achievement.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className="bg-yellow-500 text-black text-xs">
                                        {post.achievement.rarity}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        +{post.achievement.xp} XP • +{post.achievement.credits} créditos
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Image Display */}
                          {post.type === 'image' && post.imageUrl && (
                            <div className="mt-3">
                              <img 
                                src={post.imageUrl} 
                                alt="Post"
                                className="w-full rounded-lg border border-border"
                              />
                            </div>
                          )}

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => likePost(post.id)}
                              className={cn(
                                "gap-2 transition-colors",
                                post.isLiked && "text-red-500"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                              <span className="text-sm">{post.likes}</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleComments(post.id)}
                              className="gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm">{post.comments.length}</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sharePost(post.id)}
                              className="gap-2"
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="text-sm">{post.shares}</span>
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => bookmarkPost(post.id)}
                            className={cn(
                              "transition-colors",
                              post.isBookmarked && "text-blue-500"
                            )}
                          >
                            <Bookmark className={cn("h-4 w-4", post.isBookmarked && "fill-current")} />
                          </Button>
                        </div>

                        {/* Comments Section */}
                        <AnimatePresence>
                          {showComments[post.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border/50"
                            >
                              {/* Existing Comments */}
                              {post.comments.length > 0 && (
                                <div className="space-y-3 mb-4">
                                  {post.comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                      <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={comment.author.avatar} />
                                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 bg-muted/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm">{comment.author.name}</span>
                                          {comment.author.verified && (
                                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                          )}
                                          <Badge variant="outline" className="text-xs">
                                            {comment.author.level}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">
                                            {formatTimeAgo(comment.timestamp)}
                                          </span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                                            <Heart className="h-3 w-3 mr-1" />
                                            {comment.likes}
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                                            <Reply className="h-3 w-3 mr-1" />
                                            Responder
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Add Comment */}
                              <div className="flex gap-3">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage src={user.photoURL || 'https://placehold.co/40x40.png'} />
                                  <AvatarFallback>{(user.displayName || 'U')[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                  <Input
                                    placeholder="Escrever comentário..."
                                    value={newCommentContent}
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        addComment(post.id);
                                      }
                                    }}
                                    className="flex-1"
                                  />
                                  <Button 
                                    size="icon"
                                    onClick={() => addComment(post.id)}
                                    disabled={!newCommentContent.trim()}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(group => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        className="w-12 h-12 rounded-full border-2 border-primary/30"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{group.name}</h3>
                          {group.isPrivate && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Privado
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {group.category === 'regional' ? 'Regional' : 
                           group.category === 'interest' ? 'Interesse' : 'Habilidade'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members} membros
                      </span>
                      <span className="text-muted-foreground">{group.region}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {group.lastActivity}
                    </p>
                    
                    <Button 
                      onClick={() => joinGroup(group.id)}
                      variant={group.isJoined ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {group.isJoined ? (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Membro
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Juntar-se
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            {!selectedConversation ? (
              <div className="space-y-4">
                {/* New Chat Button */}
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Nova Conversa",
                    description: "Funcionalidade em desenvolvimento.",
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conversa
                </Button>
                
                {/* Conversations List */}
                <div className="space-y-2">
                  {conversations.map(conv => (
                    <Card 
                      key={conv.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openChat(conv.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {conv.isGroup ? (
                              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                              </div>
                            ) : (
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={conv.participants[0]?.avatar} />
                                <AvatarFallback>{conv.participants[0]?.name[0]}</AvatarFallback>
                              </Avatar>
                            )}
                            {!conv.isGroup && conv.participants[0]?.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold truncate">
                                {conv.isGroup ? conv.groupName : conv.participants[0]?.name}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(conv.lastMessage.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.content}
                            </p>
                          </div>
                          
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat View */
              <Card className="h-[60vh] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Avatar>
                      <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.participants[0]?.avatar} />
                      <AvatarFallback>
                        {conversations.find(c => c.id === selectedConversation)?.participants[0]?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.participants[0]?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {conversations.find(c => c.id === selectedConversation)?.participants[0]?.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
                  <div className="space-y-3">
                    {chatMessages.map(message => (
                      <div 
                        key={message.id}
                        className={cn(
                          "flex",
                          message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className={cn(
                          "max-w-[70%] p-3 rounded-lg",
                          message.senderId === 'currentUser' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        )}>
                          <p className="text-sm">{message.content}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.senderId === 'currentUser' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          )}>
                            {formatTimeAgo(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Escrever mensagem..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendChatMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon"
                      onClick={sendChatMessage}
                      disabled={!newChatMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Tópicos em Alta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                      <div>
                        <h4 className="font-semibold text-primary">{topic.tag}</h4>
                        <p className="text-sm text-muted-foreground">{topic.posts} publicações</p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        {topic.growth}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Featured Creators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Criadores em Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'PixelLegend', followers: '2.3K', avatar: 'https://placehold.co/40x40.png', verified: true },
                    { name: 'ArtMaster', followers: '1.8K', avatar: 'https://placehold.co/40x40.png', verified: true },
                    { name: 'ColorGuru', followers: '1.2K', avatar: 'https://placehold.co/40x40.png', verified: false }
                  ].map((creator, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{creator.name}</span>
                            {creator.verified && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{creator.followers} seguidores</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Seguir
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Live Events */}
            <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-red-500" />
                  Eventos ao Vivo
                  <Badge className="ml-2 bg-red-500 animate-pulse">
                    AO VIVO
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: 'Concurso de Arte Natalícia',
                    participants: 156,
                    prize: '1000 créditos especiais',
                    timeLeft: '2h 34m'
                  },
                  {
                    title: 'Stream: Criando Pixel Art',
                    participants: 89,
                    prize: 'Aprendizagem',
                    timeLeft: '45m'
                  }
                ].map((event, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.participants} participantes • {event.timeLeft} restantes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{event.prize}</p>
                          <Button size="sm" className="mt-1">
                            <Play className="h-4 w-4 mr-2" />
                            Participar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stories Viewer Modal */}
        <Dialog open={isViewingStories} onOpenChange={setIsViewingStories}>
          <DialogContent className="max-w-md h-[90vh] p-0 bg-black border-none">
            <div className="relative h-full overflow-hidden">
              {/* Progress bars */}
              <div className="absolute top-2 left-2 right-2 z-50 flex gap-1">
                {stories.map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-100"
                      style={{ 
                        width: index < currentStoryIndex ? '100%' : 
                               index === currentStoryIndex ? `${storyProgress}%` : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="absolute top-6 left-4 right-4 z-40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={stories[currentStoryIndex]?.author.avatar} />
                    <AvatarFallback>{stories[currentStoryIndex]?.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{stories[currentStoryIndex]?.author.name}</span>
                      {stories[currentStoryIndex]?.author.verified && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <span className="text-white/80 text-sm">
                      {stories[currentStoryIndex] && formatTimeAgo(stories[currentStoryIndex].timestamp)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleStoryPlayback}
                    className="text-white hover:bg-white/20"
                  >
                    {isStoryPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsViewingStories(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Story Content */}
              <div className="h-full">
                <AnimatePresence mode="wait">
                  {stories[currentStoryIndex] && (
                    <motion.div
                      key={currentStoryIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {renderStoryContent(stories[currentStoryIndex])}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation areas */}
              <div className="absolute inset-0 flex">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={previousStory}
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={toggleStoryPlayback}
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={nextStory}
                />
              </div>

              {/* Story stats */}
              <div className="absolute bottom-4 right-4 z-40 text-right text-white/80 text-xs">
                <p>{stories[currentStoryIndex]?.views} visualizações</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}