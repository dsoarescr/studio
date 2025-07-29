'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from "@/components/ui/sound-effect";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, MessageSquare, Heart, Share2, Eye, Clock, Star, Crown,
  Plus, Send, Image as ImageIcon, Video, Link2, Bookmark, Flag,
  ThumbsUp, ThumbsDown, Reply, Edit3, Trash2, MoreHorizontal,
  Palette, MapPin, Globe, Calendar, Award, Gem, Sparkles, Flame,
  Target, Zap, Activity, TrendingUp, Filter, Search, SortAsc,
  UserPlus, Settings, Bell, Shield, Info, ExternalLink, Download,
  Camera, Mic, Smile, Paperclip, Gift, Coins, Music, Play, Pause,
  Volume2, VolumeX, Maximize, Minimize, RotateCcw, Copy, Save,
  Hash, AtSign, Phone, Mail, MessageCircle, Headphones, Radio,
  Tv, Monitor, Smartphone, Tablet, Laptop, Watch, Gamepad2,
  Joystick, Keyboard, Mouse, Printer, Scanner, Webcam, Microphone
} from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface CommunityPost {
  id: string;
  type: 'text' | 'image' | 'video' | 'pixel' | 'collection' | 'event' | 'poll' | 'story' | 'live';
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    badges: string[];
    isOnline: boolean;
    lastSeen?: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'gif';
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  pixelData?: {
    coordinates: { x: number; y: number };
    region: string;
    color: string;
    price?: number;
  };
  poll?: {
    question: string;
    options: Array<{ text: string; votes: number }>;
    totalVotes: number;
    endsAt: string;
    hasVoted: boolean;
    userVote?: number;
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
  isSponsored: boolean;
  location?: string;
  mood?: string;
  mentions: string[];
  hashtags: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'contest' | 'collaboration' | 'workshop' | 'exhibition' | 'auction' | 'meetup' | 'livestream';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize?: string;
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  status: 'upcoming' | 'active' | 'ended';
  featured: boolean;
  location?: string;
  isVirtual: boolean;
  requirements?: string[];
  tags: string[];
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner?: string;
  members: number;
  posts: number;
  category: string;
  isPrivate: boolean;
  isJoined: boolean;
  recentActivity: string;
  moderators: Array<{
    name: string;
    avatar: string;
  }>;
  rules: string[];
  tags: string[];
}

interface DirectMessage {
  id: string;
  sender: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'pixel' | 'voice' | 'video';
  media?: {
    url: string;
    type: string;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: number;
  isActive: boolean;
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: string;
  };
  category: 'general' | 'trading' | 'art' | 'help' | 'regional';
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
      badges: ['premium', 'artist', 'verified'],
      isOnline: true
    },
    content: 'Acabei de criar este pixel incrível em Lisboa! O que acham da combinação de cores? 🎨✨ #PixelArt #Lisboa #Arte',
    pixelData: {
      coordinates: { x: 245, y: 156 },
      region: 'Lisboa',
      color: '#D4A757',
      price: 150
    },
    likes: 189,
    comments: 43,
    shares: 22,
    views: 1256,
    createdAt: '2024-03-15T10:30:00Z',
    tags: ['pixel-art', 'lisboa', 'cores', 'arte'],
    isLiked: false,
    isBookmarked: false,
    isPinned: false,
    isSponsored: false,
    mood: '🎨',
    mentions: [],
    hashtags: ['PixelArt', 'Lisboa', 'Arte']
  },
  {
    id: '2',
    type: 'poll',
    author: {
      name: 'CommunityManager',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25,
      badges: ['moderator', 'premium'],
      isOnline: true
    },
    content: 'Qual deve ser o próximo evento da comunidade? Votem! 🗳️',
    poll: {
      question: 'Próximo evento da comunidade?',
      options: [
        { text: 'Concurso de Pixel Art', votes: 156 },
        { text: 'Workshop de Técnicas', votes: 89 },
        { text: 'Leilão de Pixels Raros', votes: 234 },
        { text: 'Meetup Presencial', votes: 67 }
      ],
      totalVotes: 546,
      endsAt: '2024-03-20T23:59:59Z',
      hasVoted: false
    },
    likes: 89,
    comments: 156,
    shares: 45,
    views: 2341,
    createdAt: '2024-03-14T16:20:00Z',
    tags: ['poll', 'community', 'events'],
    isLiked: true,
    isBookmarked: true,
    isPinned: true,
    isSponsored: false,
    mentions: [],
    hashtags: []
  },
  {
    id: '3',
    type: 'story',
    author: {
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18,
      badges: ['collector', 'premium'],
      isOnline: false,
      lastSeen: '2h ago'
    },
    content: 'A minha jornada de 0 a 1000 pixels! 🚀 Thread com dicas e estratégias que aprendi pelo caminho...',
    media: {
      type: 'image',
      url: 'https://placehold.co/600x400/7DF9FF/000000?text=Pixel+Journey',
      thumbnail: 'https://placehold.co/150x100/7DF9FF/000000?text=Journey'
    },
    likes: 567,
    comments: 123,
    shares: 89,
    views: 3456,
    createdAt: '2024-03-13T09:15:00Z',
    tags: ['story', 'tips', 'collection', 'journey'],
    isLiked: false,
    isBookmarked: true,
    isPinned: false,
    isSponsored: false,
    location: 'Porto, Portugal',
    mentions: ['@PixelMaster', '@ArtGuru'],
    hashtags: ['PixelJourney', 'Tips']
  },
  {
    id: '4',
    type: 'live',
    author: {
      name: 'LiveStreamer',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 22,
      badges: ['streamer', 'premium'],
      isOnline: true
    },
    content: '🔴 AO VIVO: Criando pixel art em tempo real! Venham participar e dar sugestões!',
    media: {
      type: 'video',
      url: 'https://placehold.co/600x400/FF6B6B/FFFFFF?text=LIVE+STREAM',
      thumbnail: 'https://placehold.co/150x100/FF6B6B/FFFFFF?text=LIVE'
    },
    likes: 234,
    comments: 567,
    shares: 78,
    views: 1890,
    createdAt: '2024-03-15T14:00:00Z',
    tags: ['live', 'streaming', 'pixel-art', 'interactive'],
    isLiked: true,
    isBookmarked: false,
    isPinned: false,
    isSponsored: false,
    mentions: [],
    hashtags: ['LiveArt', 'PixelStream']
  }
];

const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Grande Concurso de Pixel Art - Tradições Portuguesas',
    description: 'Crie pixels que representem as tradições mais icónicas de Portugal. Prémios incríveis aguardam!',
    type: 'contest',
    startDate: '2024-03-15T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    participants: 234,
    maxParticipants: 500,
    prize: '2000 créditos especiais + badge exclusivo + pixel lendário',
    organizer: {
      name: 'Pixel Universe Team',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    status: 'active',
    featured: true,
    isVirtual: true,
    requirements: ['Mínimo nível 5', 'Tema: Tradições Portuguesas', 'Original'],
    tags: ['contest', 'art', 'portugal', 'traditions']
  },
  {
    id: '2',
    title: 'Workshop: Técnicas Avançadas de Pixel Art',
    description: 'Aprenda técnicas profissionais com artistas experientes da comunidade',
    type: 'workshop',
    startDate: '2024-03-20T19:00:00Z',
    endDate: '2024-03-20T21:00:00Z',
    participants: 67,
    maxParticipants: 100,
    organizer: {
      name: 'PixelMaster Pro',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    status: 'upcoming',
    featured: false,
    isVirtual: true,
    requirements: ['Interesse em aprender', 'Microfone recomendado'],
    tags: ['workshop', 'education', 'techniques']
  },
  {
    id: '3',
    title: 'Leilão de Pixels Históricos',
    description: 'Pixels únicos de locais históricos de Portugal em leilão especial',
    type: 'auction',
    startDate: '2024-03-25T20:00:00Z',
    endDate: '2024-03-25T22:00:00Z',
    participants: 156,
    organizer: {
      name: 'Auction House',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    status: 'upcoming',
    featured: true,
    isVirtual: true,
    requirements: ['Verificação de identidade', 'Depósito mínimo'],
    tags: ['auction', 'historical', 'rare', 'investment']
  }
];

const mockGroups: CommunityGroup[] = [
  {
    id: '1',
    name: 'Artistas de Lisboa',
    description: 'Comunidade oficial de criadores da região de Lisboa. Partilhe, aprenda e colabore!',
    avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
    banner: 'https://placehold.co/800x200/D4A757/FFFFFF?text=Lisboa+Artists',
    members: 1234,
    posts: 567,
    category: 'Regional',
    isPrivate: false,
    isJoined: true,
    recentActivity: 'Nova obra partilhada há 2h por @PixelMaster',
    moderators: [
      { name: 'ModeratorLX', avatar: 'https://placehold.co/30x30.png' },
      { name: 'ArtGuide', avatar: 'https://placehold.co/30x30.png' }
    ],
    rules: [
      'Respeite todos os membros',
      'Apenas conteúdo relacionado com Lisboa',
      'Não spam ou autopromoção excessiva',
      'Partilhe conhecimento e ajude outros'
    ],
    tags: ['lisboa', 'art', 'regional', 'community']
  },
  {
    id: '2',
    name: 'Investidores & Colecionadores VIP',
    description: 'Grupo exclusivo para investidores sérios e colecionadores premium. Análises de mercado e oportunidades.',
    avatar: 'https://placehold.co/60x60/7DF9FF/000000?text=💎',
    banner: 'https://placehold.co/800x200/7DF9FF/000000?text=VIP+Investors',
    members: 456,
    posts: 234,
    category: 'Investimento',
    isPrivate: true,
    isJoined: false,
    recentActivity: 'Análise de mercado publicada há 1h',
    moderators: [
      { name: 'InvestPro', avatar: 'https://placehold.co/30x30.png' },
      { name: 'MarketGuru', avatar: 'https://placehold.co/30x30.png' }
    ],
    rules: [
      'Apenas membros verificados',
      'Discussões sérias sobre investimento',
      'Partilha de análises fundamentadas',
      'Confidencialidade das estratégias'
    ],
    tags: ['investment', 'vip', 'market', 'analysis']
  },
  {
    id: '3',
    name: 'Pixel Art Academy - Iniciantes',
    description: 'Espaço acolhedor para quem está começando. Tutoriais, dicas e muito apoio da comunidade!',
    avatar: 'https://placehold.co/60x60/9C27B0/FFFFFF?text=🎨',
    banner: 'https://placehold.co/800x200/9C27B0/FFFFFF?text=Pixel+Academy',
    members: 2890,
    posts: 1456,
    category: 'Educação',
    isPrivate: false,
    isJoined: true,
    recentActivity: 'Tutorial sobre cores publicado há 30min',
    moderators: [
      { name: 'TeacherPixel', avatar: 'https://placehold.co/30x30.png' },
      { name: 'HelpBot', avatar: 'https://placehold.co/30x30.png' }
    ],
    rules: [
      'Ambiente respeitoso e acolhedor',
      'Perguntas são sempre bem-vindas',
      'Partilhe o seu progresso',
      'Ajude outros iniciantes'
    ],
    tags: ['education', 'beginners', 'tutorials', 'support']
  }
];

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Geral',
    description: 'Chat geral da comunidade',
    avatar: '💬',
    members: 1234,
    isActive: true,
    lastMessage: {
      content: 'Alguém viu o novo pixel lendário?',
      sender: 'PixelHunter',
      timestamp: '14:23'
    },
    category: 'general'
  },
  {
    id: '2',
    name: 'Trading Hub',
    description: 'Compra, venda e troca de pixels',
    avatar: '💰',
    members: 567,
    isActive: true,
    lastMessage: {
      content: 'Vendo pixel raro em Lisboa!',
      sender: 'Trader123',
      timestamp: '14:20'
    },
    category: 'trading'
  },
  {
    id: '3',
    name: 'Arte & Criação',
    description: 'Discussões sobre técnicas e inspiração',
    avatar: '🎨',
    members: 890,
    isActive: true,
    lastMessage: {
      content: 'Tutorial de sombreamento disponível!',
      sender: 'ArtMaster',
      timestamp: '14:15'
    },
    category: 'art'
  },
  {
    id: '4',
    name: 'Ajuda & Suporte',
    description: 'Tire suas dúvidas aqui',
    avatar: '❓',
    members: 345,
    isActive: true,
    lastMessage: {
      content: 'Como faço para animar meu pixel?',
      sender: 'Newbie',
      timestamp: '14:10'
    },
    category: 'help'
  }
];

const mockDirectMessages: DirectMessage[] = [
  {
    id: '1',
    sender: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      isOnline: true
    },
    content: 'Oi! Vi o seu pixel em Lisboa, está incrível! Quer colaborar num projeto?',
    timestamp: '14:30',
    isRead: false,
    type: 'text'
  },
  {
    id: '2',
    sender: {
      name: 'ArtCollector',
      avatar: 'https://placehold.co/40x40.png',
      isOnline: false
    },
    content: 'Interessado em vender aquele pixel do Porto?',
    timestamp: '13:45',
    isRead: true,
    type: 'text'
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [events, setEvents] = useState(mockEvents);
  const [groups, setGroups] = useState(mockGroups);
  const [chatRooms, setChatRooms] = useState(mockChatRooms);
  const [directMessages, setDirectMessages] = useState(mockDirectMessages);
  
  // Post creation state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'image' | 'pixel' | 'poll'>('text');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [postMood, setPostMood] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postTags, setPostTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Interaction state
  const [likedPosts, setLikedPosts] = useState<string[]>(['2', '4']);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>(['2', '3']);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  
  // Chat state
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'system';
  }>>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  
  // Live features
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const [activeStreams, setActiveStreams] = useState(5);
  
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update online users
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
      
      // Simulate new messages in chat
      if (activeChatRoom && Math.random() > 0.7) {
        const newMessage = {
          id: Date.now().toString(),
          sender: `User${Math.floor(Math.random() * 1000)}`,
          content: [
            'Alguém quer trocar pixels?',
            'Que pixel incrível!',
            'Como faço isso?',
            'Vendo pixel raro!',
            'Alguém online?'
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          type: 'text' as const
        };
        setChatMessages(prev => [...prev, newMessage].slice(-50));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeChatRoom]);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: likedPosts.includes(postId) ? post.likes - 1 : post.likes + 1 }
        : post
    ));
    
    if (!likedPosts.includes(postId)) {
      addXp(5);
      toast({
        title: "Post Curtido! ❤️",
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
    
    toast({
      title: bookmarkedPosts.includes(postId) ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
      description: bookmarkedPosts.includes(postId) ? "Post removido da sua lista." : "Post salvo na sua lista de favoritos.",
    });
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      type: newPostType,
      author: {
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        verified: true,
        level: 15,
        badges: ['premium'],
        isOnline: true
      },
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      tags: postTags,
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      isSponsored: false,
      mood: postMood,
      location: postLocation,
      mentions: [],
      hashtags: postTags.filter(tag => tag.startsWith('#'))
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setPostTags([]);
    setPostMood('');
    setPostLocation('');
    
    addCredits(10);
    addXp(25);
    
    toast({
      title: "Post Criado! 🎉",
      description: "Seu post foi publicado com sucesso. Você ganhou 10 créditos e 25 XP!",
    });
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, participants: event.participants + 1 }
        : event
    ));
    
    addXp(50);
    toast({
      title: "Evento Confirmado! 🎯",
      description: "Você se inscreveu no evento com sucesso. Ganhou 50 XP!",
    });
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            isJoined: !group.isJoined,
            members: group.isJoined ? group.members - 1 : group.members + 1
          }
        : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    if (group) {
      addXp(group.isJoined ? -25 : 25);
      toast({
        title: group.isJoined ? "Saiu do Grupo" : "Juntou-se ao Grupo! 👥",
        description: `${group.name} - ${group.isJoined ? 'Deixou de seguir' : 'Agora é membro'}`,
      });
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !activeChatRoom) return;
    
    const message = {
      id: Date.now().toString(),
      sender: 'Você',
      content: newChatMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      type: 'text' as const
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewChatMessage('');
    
    addXp(2);
  };

  const addPostTag = () => {
    if (newTag.trim() && !postTags.includes(newTag.trim())) {
      setPostTags([...postTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removePostTag = (tagToRemove: string) => {
    setPostTags(postTags.filter(tag => tag !== tagToRemove));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'liked' && likedPosts.includes(post.id)) ||
      (selectedFilter === 'bookmarked' && bookmarkedPosts.includes(post.id)) ||
      (selectedFilter === 'pinned' && post.isPinned) ||
      (selectedFilter === 'following' && followedUsers.includes(post.author.name)) ||
      (selectedFilter === post.type);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'trending':
        return b.views - a.views;
      default:
        return 0;
    }
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

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'pixel': return <Palette className="h-4 w-4" />;
      case 'poll': return <BarChart3 className="h-4 w-4" />;
      case 'live': return <Radio className="h-4 w-4 text-red-500" />;
      case 'story': return <BookOpen className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
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
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <Users className="h-8 w-8 mr-3 animate-glow" />
                  Hub da Comunidade
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Conecte-se, partilhe, colabore e cresça com a maior comunidade de pixel art de Portugal
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Membros Online</p>
                  <p className="text-xl font-bold text-green-500 animate-pulse">{onlineUsers.toLocaleString()}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Streams Ativas</p>
                  <p className="text-xl font-bold text-red-500">{activeStreams}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Posts Hoje</p>
                  <p className="text-xl font-bold text-primary">234</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="feed" className="font-headline">
              <Activity className="h-4 w-4 mr-2"/>
              Feed
            </TabsTrigger>
            <TabsTrigger value="chat" className="font-headline">
              <MessageSquare className="h-4 w-4 mr-2"/>
              Chat
            </TabsTrigger>
            <TabsTrigger value="events" className="font-headline">
              <Calendar className="h-4 w-4 mr-2"/>
              Eventos
            </TabsTrigger>
            <TabsTrigger value="groups" className="font-headline">
              <Users className="h-4 w-4 mr-2"/>
              Grupos
            </TabsTrigger>
            <TabsTrigger value="discover" className="font-headline">
              <Search className="h-4 w-4 mr-2"/>
              Descobrir
            </TabsTrigger>
            <TabsTrigger value="live" className="font-headline">
              <Radio className="h-4 w-4 mr-2"/>
              Ao Vivo
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Enhanced Post Creation */}
                <Card className="bg-gradient-to-r from-card to-primary/5">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="https://placehold.co/48x48.png" />
                          <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="O que está a acontecer no seu universo de pixels? ✨"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="resize-none border-0 bg-transparent text-lg placeholder:text-muted-foreground/70"
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      {/* Post Type Selector */}
                      <div className="flex gap-2">
                        {[
                          { type: 'text', icon: MessageSquare, label: 'Texto' },
                          { type: 'image', icon: ImageIcon, label: 'Imagem' },
                          { type: 'pixel', icon: Palette, label: 'Pixel' },
                          { type: 'poll', icon: BarChart3, label: 'Enquete' }
                        ].map(({ type, icon: Icon, label }) => (
                          <Button
                            key={type}
                            variant={newPostType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewPostType(type as any)}
                            className="flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Enhanced Options */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Humor/Mood</Label>
                          <Input
                            placeholder="😊 Como se sente?"
                            value={postMood}
                            onChange={(e) => setPostMood(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Localização</Label>
                          <Input
                            placeholder="📍 Onde está?"
                            value={postLocation}
                            onChange={(e) => setPostLocation(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="#tag"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addPostTag()}
                              className="text-sm"
                            />
                            <Button size="sm" onClick={addPostTag}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags Display */}
                      {postTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {postTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removePostTag(tag)}>
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Foto/Vídeo
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mic className="h-4 w-4 mr-2" />
                            Áudio
                          </Button>
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-2" />
                            Pixel
                          </Button>
                          <Button variant="outline" size="sm">
                            <Smile className="h-4 w-4 mr-2" />
                            Emoji
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={handleCreatePost}
                          disabled={!newPostContent.trim()}
                          className="bg-gradient-to-r from-primary to-accent"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Pesquisar posts, utilizadores, tags..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        {[
                          { id: 'all', label: 'Todos', count: posts.length },
                          { id: 'text', label: 'Texto', count: posts.filter(p => p.type === 'text').length },
                          { id: 'image', label: 'Imagens', count: posts.filter(p => p.type === 'image').length },
                          { id: 'pixel', label: 'Pixels', count: posts.filter(p => p.type === 'pixel').length },
                          { id: 'live', label: 'Ao Vivo', count: posts.filter(p => p.type === 'live').length },
                          { id: 'liked', label: 'Curtidos', count: likedPosts.length },
                          { id: 'bookmarked', label: 'Salvos', count: bookmarkedPosts.length }
                        ].map(filter => (
                          <Button
                            key={filter.id}
                            variant={selectedFilter === filter.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedFilter(filter.id)}
                            className="flex items-center gap-1"
                          >
                            {filter.label}
                            {filter.count > 0 && (
                              <Badge variant="secondary" className="text-xs h-4 px-1">
                                {filter.count}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                      
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="recent">Mais Recentes</option>
                        <option value="popular">Mais Populares</option>
                        <option value="trending">Em Tendência</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Posts */}
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
                        <Card className={cn(
                          "hover:shadow-lg transition-all duration-300",
                          post.isPinned && "border-primary/50 bg-primary/5",
                          post.isSponsored && "border-accent/50 bg-accent/5"
                        )}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={post.author.avatar} />
                                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                  </Avatar>
                                  {post.author.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                                  )}
                                </div>
                                
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{post.author.name}</span>
                                    {post.author.verified && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      Nível {post.author.level}
                                    </Badge>
                                    {post.author.badges.map(badge => (
                                      <Badge key={badge} variant="outline" className="text-xs">
                                        {badge === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                                        {badge}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(post.createdAt)}
                                    {post.location && (
                                      <>
                                        <MapPin className="h-3 w-3 ml-2" />
                                        {post.location}
                                      </>
                                    )}
                                    {post.isPinned && (
                                      <Badge variant="outline" className="text-xs ml-2">
                                        📌 Fixado
                                      </Badge>
                                    )}
                                    {post.isSponsored && (
                                      <Badge variant="outline" className="text-xs ml-2">
                                        💎 Patrocinado
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {getPostTypeIcon(post.type)}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Bookmark className="h-4 w-4 mr-2" />
                                      Salvar Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Partilhar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copiar Link
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-500">
                                      <Flag className="h-4 w-4 mr-2" />
                                      Reportar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                              {post.mood && <span className="text-lg">{post.mood}</span>}
                              <p className="text-foreground leading-relaxed">{post.content}</p>
                            </div>
                            
                            {/* Media Content */}
                            {post.media && (
                              <div className="rounded-lg overflow-hidden">
                                {post.media.type === 'image' && (
                                  <img 
                                    src={post.media.url} 
                                    alt="Post media"
                                    className="w-full max-h-96 object-cover cursor-pointer hover:scale-105 transition-transform"
                                  />
                                )}
                                {post.media.type === 'video' && (
                                  <div className="relative">
                                    <img 
                                      src={post.media.thumbnail || post.media.url} 
                                      alt="Video thumbnail"
                                      className="w-full max-h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Button size="icon" className="rounded-full w-16 h-16">
                                        <Play className="h-8 w-8" />
                                      </Button>
                                    </div>
                                    {post.media.duration && (
                                      <Badge className="absolute bottom-2 right-2 bg-black/70">
                                        {post.media.duration}s
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Pixel Data */}
                            {post.pixelData && (
                              <Card className="bg-muted/30 p-4">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-12 h-12 rounded border-2 border-border"
                                    style={{ backgroundColor: post.pixelData.color }}
                                  />
                                  <div>
                                    <p className="font-medium">
                                      Pixel ({post.pixelData.coordinates.x}, {post.pixelData.coordinates.y})
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {post.pixelData.region}
                                    </p>
                                    {post.pixelData.price && (
                                      <p className="text-sm font-bold text-primary">
                                        €{post.pixelData.price}
                                      </p>
                                    )}
                                  </div>
                                  <Button size="sm" className="ml-auto">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Pixel
                                  </Button>
                                </div>
                              </Card>
                            )}
                            
                            {/* Poll */}
                            {post.poll && (
                              <Card className="bg-muted/30 p-4">
                                <h4 className="font-medium mb-3">{post.poll.question}</h4>
                                <div className="space-y-2">
                                  {post.poll.options.map((option, index) => {
                                    const percentage = post.poll!.totalVotes > 0 
                                      ? (option.votes / post.poll!.totalVotes) * 100 
                                      : 0;
                                    
                                    return (
                                      <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                          <span>{option.text}</span>
                                          <span>{option.votes} votos ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                                  <span>{post.poll.totalVotes} votos totais</span>
                                  <span>Termina em {formatDate(post.poll.endsAt)}</span>
                                </div>
                                {!post.poll.hasVoted && (
                                  <Button size="sm" className="w-full mt-2">
                                    Votar
                                  </Button>
                                )}
                              </Card>
                            )}
                            
                            {/* Tags and Hashtags */}
                            {(post.tags.length > 0 || post.hashtags.length > 0) && (
                              <div className="flex flex-wrap gap-2">
                                {post.hashtags.map(hashtag => (
                                  <Badge key={hashtag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                                    #{hashtag}
                                  </Badge>
                                ))}
                                {post.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Mentions */}
                            {post.mentions.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.mentions.map(mention => (
                                  <Badge key={mention} variant="outline" className="text-xs cursor-pointer hover:bg-accent/10">
                                    <AtSign className="h-3 w-3 mr-1" />
                                    {mention}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                          
                          <CardFooter className="pt-0">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-6">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(post.id)}
                                  className={cn(
                                    "transition-colors",
                                    likedPosts.includes(post.id) ? 'text-red-500' : 'text-muted-foreground'
                                  )}
                                >
                                  <Heart className={cn(
                                    "h-4 w-4 mr-2",
                                    likedPosts.includes(post.id) && 'fill-current'
                                  )} />
                                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                                </Button>
                                
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  {post.comments}
                                </Button>
                                
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
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
                                className={cn(
                                  "transition-colors",
                                  bookmarkedPosts.includes(post.id) ? 'text-primary' : 'text-muted-foreground'
                                )}
                              >
                                <Bookmark className={cn(
                                  "h-4 w-4",
                                  bookmarkedPosts.includes(post.id) && 'fill-current'
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
              
              {/* Enhanced Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                      Trending Agora
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { tag: '#PixelArtChallenge', posts: '1.2K posts', trend: '+45%' },
                      { tag: '#LisboaPixels', posts: '856 posts', trend: '+23%' },
                      { tag: '#NFTArt', posts: '634 posts', trend: '+67%' },
                      { tag: '#PortugalMap', posts: '423 posts', trend: '+12%' },
                      { tag: '#CommunityEvent', posts: '289 posts', trend: '+89%' }
                    ].map((trend, index) => (
                      <div key={index} className="flex justify-between items-center hover:bg-muted/20 p-2 rounded cursor-pointer">
                        <div>
                          <span className="font-medium text-primary">{trend.tag}</span>
                          <p className="text-xs text-muted-foreground">{trend.posts}</p>
                        </div>
                        <Badge variant="outline" className="text-green-500 border-green-500/50">
                          {trend.trend}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Camera className="h-4 w-4 mr-2" />
                      Partilhar Pixel
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Criar Grupo
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Organizar Evento
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Radio className="h-4 w-4 mr-2" />
                      Iniciar Live
                    </Button>
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
                      { name: 'PixelMaster', avatar: 'https://placehold.co/40x40.png', followers: '2.3K', verified: true },
                      { name: 'ArtGuru', avatar: 'https://placehold.co/40x40.png', followers: '1.8K', verified: false },
                      { name: 'ColorWizard', avatar: 'https://placehold.co/40x40.png', followers: '1.2K', verified: true }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{user.name}</span>
                              {user.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{user.followers} seguidores</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Seguir
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat Rooms List */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Salas de Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {chatRooms.map(room => (
                      <div
                        key={room.id}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-colors",
                          activeChatRoom === room.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                        )}
                        onClick={() => setActiveChatRoom(room.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{room.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{room.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {room.members}
                              </Badge>
                            </div>
                            {room.lastMessage && (
                              <p className="text-xs text-muted-foreground truncate">
                                {room.lastMessage.sender}: {room.lastMessage.content}
                              </p>
                            )}
                          </div>
                          {room.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Direct Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mensagens Diretas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {directMessages.map(dm => (
                      <div key={dm.id} className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={dm.sender.avatar} />
                              <AvatarFallback>{dm.sender.name[0]}</AvatarFallback>
                            </Avatar>
                            {dm.sender.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{dm.sender.name}</span>
                              <span className="text-xs text-muted-foreground">{dm.timestamp}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{dm.content}</p>
                          </div>
                          {!dm.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Chat Area */}
              <div className="lg:col-span-3">
                {activeChatRoom ? (
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {chatRooms.find(r => r.id === activeChatRoom)?.avatar}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {chatRooms.find(r => r.id === activeChatRoom)?.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {chatRooms.find(r => r.id === activeChatRoom)?.members} membros online
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {chatMessages.map(message => (
                          <div key={message.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{message.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{message.sender}</span>
                                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              </div>
                              <p className="text-sm mt-1">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Escrever mensagem..."
                          value={newChatMessage}
                          onChange={(e) => setNewChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendChatMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Selecione uma sala de chat</h3>
                      <p className="text-muted-foreground">
                        Escolha uma sala à esquerda para começar a conversar
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Events Tab - Enhanced */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className={cn(
                  "hover:shadow-lg transition-shadow",
                  event.featured && "border-primary/50 bg-primary/5"
                )}>
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
                    
                    {event.requirements && event.requirements.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Requisitos:</Label>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {event.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Organizado por {event.organizer.name}</span>
                      {event.organizer.verified && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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

          {/* Groups Tab - Enhanced */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {group.banner && (
                    <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20 relative">
                      <img 
                        src={group.banner} 
                        alt={group.name}
                        className="w-full h-full object-cover opacity-50"
                      />
                      {group.isPrivate && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          <Lock className="h-3 w-3 mr-1" />
                          Privado
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        className="w-16 h-16 rounded-full border-2 border-border"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {group.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {group.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members.toLocaleString()} membros
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {group.posts} posts
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Atividade Recente:</Label>
                        <p className="text-xs">{group.recentActivity}</p>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Moderadores:</Label>
                        <div className="flex -space-x-2 mt-1">
                          {group.moderators.map((mod, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={mod.avatar} />
                              <AvatarFallback className="text-xs">{mod.name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                      
                      {group.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {group.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinGroup(group.id)}
                      variant={group.isJoined ? 'outline' : 'default'}
                      className="w-full mt-4"
                    >
                      {group.isJoined ? (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Membro
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          {group.isPrivate ? 'Solicitar Entrada' : 'Juntar-se'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-purple-500" />
                    Explorar Artistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Descubra novos talentos e artistas emergentes na comunidade.
                  </p>
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Explorar
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    Pixels em Alta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Veja os pixels mais populares e valorizados da semana.
                  </p>
                  <Button className="w-full">
                    <Flame className="h-4 w-4 mr-2" />
                    Ver Trending
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-500" />
                    Desafios Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Participe em desafios da comunidade e ganhe prémios.
                  </p>
                  <Button className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Participar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: activeStreams }).map((_, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={`https://placehold.co/400x225/FF6B6B/FFFFFF?text=LIVE+STREAM+${index + 1}`}
                      alt={`Live Stream ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                      <Radio className="h-3 w-3 mr-1" />
                      AO VIVO
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-black/70">
                      {Math.floor(Math.random() * 500) + 50} espectadores
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://placehold.co/32x32.png?text=S${index + 1}`} />
                        <AvatarFallback>S{index + 1}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Streamer{index + 1}</p>
                        <p className="text-xs text-muted-foreground">Criando pixel art ao vivo</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Assistir
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Radio className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Iniciar Transmissão</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Partilhe o seu processo criativo ao vivo
                  </p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Começar Live
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}