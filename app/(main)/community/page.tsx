

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, MessageSquare, Share2, Send, Users, MapPin, Calendar, 
  Clock, Star, Crown, Gift, Zap, Eye, ThumbsUp, UserPlus, 
  Play, Pause, X, ChevronLeft, ChevronRight, Camera, Image as ImageIcon,
  Palette, Trophy, Target, Flame, TrendingUp, BookOpen, Video,
  Music, Mic, Settings, Filter, Search, Plus, MoreHorizontal,
  Bookmark, Flag, Volume2, VolumeX, Compass, Globe, Award,
  Sparkles, Coins, Bell, Phone, MessageCircle, User, Edit,
  Copy, ExternalLink, Info, CheckCircle, AlertTriangle, Lock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/store";
import { AuthModal } from "@/components/auth/AuthModal";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
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
    followers: number;
    following: number;
    bio: string;
    joinDate: string;
    pixelsOwned: number;
    achievements: number;
  };
  content: string;
  type: 'text' | 'pixel' | 'image' | 'achievement';
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  pixel?: {
    x: number;
    y: number;
    region: string;
    imageUrl: string;
    price?: number;
  };
  imageUrl?: string;
  achievement?: {
    name: string;
    description: string;
    rarity: string;
    icon: string;
  };
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Story {
  id: string;
  author: {
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
  timestamp: string;
  views: number;
  isViewed: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  category: 'Regional' | 'Interesse' | 'Habilidade';
  members: number;
  avatar: string;
  isJoined: boolean;
  isPrivate: boolean;
  recentActivity: string;
  rules: string[];
  moderators: string[];
  createdAt: string;
}

interface ChatConversation {
  id: string;
  type: 'private' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  participants?: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'pixel';
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize: string;
  requirements: string[];
  rules: string[];
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Extremo';
  isParticipating: boolean;
  organizer: string;
  imageUrl: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  author: string;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  rating: number;
  views: number;
  tags: string[];
  steps: string[];
  videoUrl: string;
  isSaved: boolean;
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
      verified: true,
      level: 15,
      followers: 1234,
      following: 567,
      bio: 'Artista digital especializado em paisagens portuguesas 🎨',
      joinDate: '2023-05-15',
      pixelsOwned: 89,
      achievements: 12
    },
    content: 'Acabei de criar esta obra-prima em Lisboa! O que acham? 🎨✨ #LisboaArt #PixelArt',
    type: 'pixel',
    timestamp: '2h',
    likes: 89,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'ColorMaster',
          avatar: 'https://placehold.co/30x30.png',
          verified: false,
          level: 12
        },
        content: 'Incrível! Que técnica usaste para as sombras?',
        timestamp: '1h',
        likes: 5,
        isLiked: false
      },
      {
        id: 'c2',
        author: {
          name: 'ArtLover',
          avatar: 'https://placehold.co/30x30.png',
          verified: true,
          level: 8
        },
        content: 'Fantástico trabalho! 👏',
        timestamp: '45m',
        likes: 3,
        isLiked: true
      }
    ],
    shares: 23,
    isLiked: false,
    isSaved: false,
    tags: ['LisboaArt', 'PixelArt'],
    pixel: {
      x: 245,
      y: 156,
      region: 'Lisboa',
      imageUrl: 'https://placehold.co/300x300.png',
      price: 150
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
      following: 234,
      bio: 'Especialista em teoria das cores e paletas harmoniosas 🌈',
      joinDate: '2023-08-20',
      pixelsOwned: 45,
      achievements: 8
    },
    content: 'Novo recorde pessoal! 50 pixels numa semana! 🚀 #Milestone #PixelCollection',
    type: 'achievement',
    timestamp: '4h',
    likes: 156,
    comments: [],
    shares: 28,
    isLiked: true,
    isSaved: false,
    tags: ['Milestone', 'PixelCollection'],
    achievement: {
      name: 'Colecionador Semanal',
      description: 'Comprou 50 pixels numa semana',
      rarity: 'Épico',
      icon: '🏆'
    }
  }
];

const mockStories: Story[] = [
  {
    id: '1',
    author: {
      name: 'PixelArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    content: {
      type: 'image',
      url: 'https://placehold.co/400x600.png',
      duration: 5
    },
    timestamp: '2h',
    views: 234,
    isViewed: false
  },
  {
    id: '2',
    author: {
      name: 'ColorMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: false
    },
    content: {
      type: 'text',
      text: 'Trabalhando num novo projeto incrível! 🎨',
      duration: 8
    },
    timestamp: '4h',
    views: 156,
    isViewed: true
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Artistas de Lisboa',
    description: 'Comunidade de criadores da capital portuguesa',
    category: 'Regional',
    members: 234,
    avatar: 'https://placehold.co/60x60.png',
    isJoined: true,
    isPrivate: false,
    recentActivity: 'Nova obra partilhada há 2h',
    rules: [
      'Respeitar todos os membros',
      'Partilhar apenas conteúdo relacionado com Lisboa',
      'Não spam ou autopromoção excessiva'
    ],
    moderators: ['AdminLisboa', 'ModeradorPT'],
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Colecionadores Premium',
    description: 'Investidores e colecionadores sérios de pixels raros',
    category: 'Interesse',
    members: 89,
    avatar: 'https://placehold.co/60x60.png',
    isJoined: false,
    isPrivate: true,
    recentActivity: 'Discussão sobre tendências de mercado',
    rules: [
      'Apenas membros premium',
      'Discussões sobre investimentos',
      'Partilhar análises de mercado'
    ],
    moderators: ['InvestorPro'],
    createdAt: '2023-03-10'
  }
];

const mockConversations: ChatConversation[] = [
  {
    id: '1',
    type: 'private',
    name: 'PixelArtist',
    avatar: 'https://placehold.co/40x40.png',
    lastMessage: 'Obrigado pelo feedback!',
    timestamp: '2h',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    type: 'group',
    name: 'Artistas de Lisboa',
    avatar: 'https://placehold.co/40x40.png',
    lastMessage: 'Alguém quer colaborar num projeto?',
    timestamp: '1d',
    unreadCount: 0,
    isOnline: false,
    participants: ['PixelArtist', 'ColorMaster', 'ArtLover']
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Concurso de Arte Natalícia',
    description: 'Crie a melhor arte natalícia usando pixels portugueses e ganhe prémios incríveis!',
    startDate: '2024-12-01',
    endDate: '2024-12-25',
    participants: 156,
    maxParticipants: 500,
    prize: '2000 créditos especiais + Pixel lendário exclusivo',
    requirements: [
      'Nível mínimo: 5',
      'Pelo menos 10 pixels owned',
      'Tema natalício obrigatório'
    ],
    rules: [
      'Apenas pixels em território português',
      'Máximo 5 submissões por participante',
      'Votação da comunidade + júri especializado'
    ],
    category: 'Concurso',
    difficulty: 'Médio',
    isParticipating: false,
    organizer: 'Equipa Pixel Universe',
    imageUrl: 'https://placehold.co/400x200.png'
  },
  {
    id: '2',
    title: 'Maratona de Ano Novo',
    description: 'Evento especial de 24 horas para celebrar o novo ano com desafios únicos!',
    startDate: '2024-12-31',
    endDate: '2025-01-01',
    participants: 89,
    prize: '5000 créditos + Título exclusivo',
    requirements: [
      'Disponibilidade de 24h',
      'Nível mínimo: 10'
    ],
    rules: [
      'Desafios a cada 2 horas',
      'Pontuação cumulativa',
      'Prémios por escalões'
    ],
    category: 'Maratona',
    difficulty: 'Extremo',
    isParticipating: true,
    organizer: 'Comunidade',
    imageUrl: 'https://placehold.co/400x200.png'
  }
];

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Primeiros Passos no Pixel Art',
    description: 'Aprenda os fundamentos básicos da arte pixel, desde a escolha de cores até técnicas de sombreamento.',
    author: 'PixelMaster',
    duration: '15 min',
    difficulty: 'Iniciante',
    rating: 4.8,
    views: 2341,
    tags: ['básico', 'cores', 'sombreamento'],
    steps: [
      'Escolher a paleta de cores',
      'Definir a resolução',
      'Técnicas de sombreamento',
      'Finalização e exportação'
    ],
    videoUrl: 'https://placehold.co/400x300.png',
    isSaved: false
  },
  {
    id: '2',
    title: 'Estratégias de Investimento',
    description: 'Como identificar pixels valiosos e construir um portfólio lucrativo.',
    author: 'InvestorPro',
    duration: '25 min',
    difficulty: 'Avançado',
    rating: 4.9,
    views: 1876,
    tags: ['investimento', 'estratégia', 'mercado'],
    steps: [
      'Análise de mercado',
      'Identificar tendências',
      'Diversificação de portfólio',
      'Gestão de risco'
    ],
    videoUrl: 'https://placehold.co/400x300.png',
    isSaved: true
  }
];

const GroupIcon = ({ isPrivate }: { isPrivate: boolean }) => {
    if (!isPrivate) return null;
    return <Lock className="h-4 w-4 text-muted-foreground" />;
};

export default function CommunityPage() {
  const { user } = useAuth();
  const { addCredits, addXp } = useUserStore();
  const { toast } = useToast();
  
  // States
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);
  
  // UI States
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'pixel' | 'image'>('text');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(true);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<Post['author'] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);
  
  // Sound and visual effects
  const [playLikeSound, setPlayLikeSound] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Refs
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const storyProgressRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Story progress timer
  useEffect(() => {
    if (selectedStory && isStoryPlaying) {
      const duration = selectedStory.content.duration * 1000;
      storyProgressRef.current = setInterval(() => {
        setStoryProgress(prev => {
          const newProgress = prev + (100 / (duration / 100));
          if (newProgress >= 100) {
            nextStory();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      if (storyProgressRef.current) {
        clearInterval(storyProgressRef.current);
      }
    }

    return () => {
      if (storyProgressRef.current) {
        clearInterval(storyProgressRef.current);
      }
    };
  }, [selectedStory, isStoryPlaying]);

  // Functions
  const createPost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Conteúdo Obrigatório",
        description: "Por favor, escreva algo para publicar.",
        variant: "destructive"
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: 'currentUser',
        name: 'Você',
        username: '@voce',
        avatar: 'https://placehold.co/40x40.png',
        verified: true,
        level: 15,
        followers: 234,
        following: 123,
        bio: 'Explorador do Pixel Universe',
        joinDate: '2023-06-01',
        pixelsOwned: 42,
        achievements: 8
      },
      content: newPostContent,
      type: newPostType,
      timestamp: 'agora',
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isSaved: false,
      tags: newPostContent.match(/#\w+/g)?.map(tag => tag.substring(1)) || []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    
    // Rewards
    addXp(25);
    addCredits(10);
    setPlaySuccessSound(true);
    
    toast({
      title: "Publicação Criada! 🎉",
      description: "Recebeu 25 XP + 10 créditos por partilhar conteúdo!",
    });
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;
        
        if (newIsLiked) {
          addXp(5);
          addCredits(2);
          setPlayLikeSound(true);
        }
        
        return { ...post, isLiked: newIsLiked, likes: newLikes };
      }
      return post;
    }));
  };

  const toggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsSaved = !post.isSaved;
        
        if (newIsSaved) {
          addXp(3);
          toast({
            title: "Post Guardado! 📌",
            description: "Adicionado aos seus favoritos. +3 XP",
          });
        }
        
        return { ...post, isSaved: newIsSaved };
      }
      return post;
    }));
  };

  const addComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Você',
        avatar: 'https://placehold.co/30x30.png',
        verified: true,
        level: 15
      },
      content: newComment,
      timestamp: 'agora',
      likes: 0,
      isLiked: false
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    }));

    setNewComment('');
    addXp(8);
    addCredits(3);
    
    toast({
      title: "Comentário Adicionado! 💬",
      description: "Recebeu 8 XP + 3 créditos por interagir!",
    });
  };

  const sharePost = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `Post de ${post.author.name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado! 🔗",
        description: "Link do post copiado para a área de transferência.",
      });
    }
    
    addXp(5);
    addCredits(2);
  };

  const openUserProfile = (author: Post['author']) => {
    setSelectedUser(author);
  };

  const followUser = (userId: string) => {
    const isFollowing = followingUsers.includes(userId);
    
    if (isFollowing) {
      setFollowingUsers(prev => prev.filter(id => id !== userId));
      toast({
        title: "Deixou de Seguir",
        description: "Não receberá mais atualizações deste utilizador.",
      });
    } else {
      setFollowingUsers(prev => [...prev, userId]);
      addXp(10);
      addCredits(5);
      setPlaySuccessSound(true);
      
      toast({
        title: "A Seguir! 👥",
        description: "Recebeu 10 XP + 5 créditos por seguir um utilizador!",
      });
    }
  };

  const openStory = (story: Story, index: number) => {
    setSelectedStory(story);
    setStoryIndex(index);
    setStoryProgress(0);
    setIsStoryPlaying(true);
  };

  const nextStory = () => {
    if (storyIndex < stories.length - 1) {
      const nextIndex = storyIndex + 1;
      setStoryIndex(nextIndex);
      setSelectedStory(stories[nextIndex]);
      setStoryProgress(0);
    } else {
      setSelectedStory(null);
      setStoryIndex(0);
      setStoryProgress(0);
    }
  };

  const previousStory = () => {
    if (storyIndex > 0) {
      const prevIndex = storyIndex - 1;
      setStoryIndex(prevIndex);
      setSelectedStory(stories[prevIndex]);
      setStoryProgress(0);
    }
  };

  const joinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newIsJoined = !group.isJoined;
        const newMembers = newIsJoined ? group.members + 1 : group.members - 1;
        
        if (newIsJoined) {
          addXp(15);
          addCredits(8);
          setPlaySuccessSound(true);
          
          toast({
            title: "Juntou-se ao Grupo! 👥",
            description: `Bem-vindo ao ${group.name}! +15 XP + 8 créditos`,
          });
        } else {
          toast({
            title: "Saiu do Grupo",
            description: `Deixou o grupo ${group.name}.`,
          });
        }
        
        return { ...group, isJoined: newIsJoined, members: newMembers };
      }
      return group;
    }));
  };

  const openChat = (conversation: ChatConversation) => {
    setSelectedChat(conversation);
    
    // Mock messages for the conversation
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        sender: conversation.name,
        content: 'Olá! Vi o teu pixel em Lisboa, está fantástico!',
        timestamp: '14:20',
        type: 'text'
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Obrigado! Demorei muito tempo a fazer.',
        timestamp: '14:22',
        type: 'text'
      },
      {
        id: '3',
        sender: conversation.name,
        content: 'Obrigado pelo feedback!',
        timestamp: '14:25',
        type: 'text'
      }
    ];
    
    setChatMessages(mockMessages);
  };

  const sendChatMessage = () => {
    if (!newChatMessage.trim() || !selectedChat) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      content: newChatMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewChatMessage('');
    
    addXp(3);
    addCredits(1);
  };

  const participateInEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const newIsParticipating = !event.isParticipating;
        const newParticipants = newIsParticipating ? event.participants + 1 : event.participants - 1;
        
        if (newIsParticipating) {
          addXp(20);
          addCredits(15);
          setShowConfetti(true);
          setPlaySuccessSound(true);
          
          toast({
            title: "Inscrito no Evento! 🎉",
            description: `Inscrito em ${event.title}! +20 XP + 15 créditos`,
          });
        } else {
          toast({
            title: "Saiu do Evento",
            description: `Cancelou a participação em ${event.title}.`,
          });
        }
        
        return { ...event, isParticipating: newIsParticipating, participants: newParticipants };
      }
      return event;
    }));
  };

  const startTutorial = (tutorialId: string) => {
    const tutorial = tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      addXp(5);
      addCredits(2);
      
      toast({
        title: "Tutorial Iniciado! 📚",
        description: `Começou "${tutorial.title}". +5 XP + 2 créditos`,
      });
    }
  };

  const saveTutorial = (tutorialId: string) => {
    setTutorials(prev => prev.map(tutorial => {
      if (tutorial.id === tutorialId) {
        const newIsSaved = !tutorial.isSaved;
        
        if (newIsSaved) {
          toast({
            title: "Tutorial Guardado! 📌",
            description: "Adicionado aos seus favoritos.",
          });
        }
        
        return { ...tutorial, isSaved: newIsSaved };
      }
      return tutorial;
    }));
  };

  const openUserActions = (author: Post['author']) => {
    setSelectedUser(author);
  };

  const sendPrivateMessage = (userId: string, userName: string) => {
    // Create or open conversation
    const existingConversation = conversations.find(c => c.name === userName);
    
    if (existingConversation) {
      openChat(existingConversation);
    } else {
      const newConversation: ChatConversation = {
        id: Date.now().toString(),
        type: 'private',
        name: userName,
        avatar: 'https://placehold.co/40x40.png',
        lastMessage: '',
        timestamp: 'agora',
        unreadCount: 0,
        isOnline: true
      };
      
      setConversations(prev => [newConversation, ...prev]);
      openChat(newConversation);
    }
    
    setSelectedUser(null);
  };

  // Simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Random likes on posts
      if (Math.random() > 0.7) {
        setPosts(prev => prev.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3)
        })));
      }
      
      // Random new messages in conversations
      if (Math.random() > 0.8 && conversations.length > 0) {
        const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
        setConversations(prev => prev.map(conv => 
          conv.id === randomConv.id 
            ? { ...conv, unreadCount: conv.unreadCount + 1 }
            : conv
        ));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversations]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 pb-4 px-6">
            <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Junte-se à Comunidade</h2>
            <p className="text-muted-foreground mb-6">
              Conecte-se com outros criadores, partilhe os seus pixels e descubra arte incrível!
            </p>
            <div className="space-y-3">
              <AuthModal defaultTab="register">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta Grátis
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
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playLikeSound} onEnd={() => setPlayLikeSound(false)} />
      <SoundEffect src={SOUND_EFFECTS.ACHIEVEMENT} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-4 px-3 space-y-4 max-w-4xl">
        {/* Header */}
        <Card className="shadow-lg bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="font-headline text-2xl text-gradient-gold flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Comunidade Pixel
            </CardTitle>
            <CardDescription>
              Conecte-se, partilhe e descubra arte incrível com outros criadores
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="feed" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="feed" className="text-xs">
              <MessageSquare className="h-4 w-4 mb-1" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              <Users className="h-4 w-4 mb-1" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageCircle className="h-4 w-4 mb-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              <Calendar className="h-4 w-4 mb-1" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-xs">
              <BookOpen className="h-4 w-4 mb-1" />
              Aprender
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            {/* Stories */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {stories.map((story, index) => (
                    <div
                      key={story.id}
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => openStory(story, index)}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-full p-0.5",
                        story.isViewed ? "bg-muted" : "bg-gradient-to-tr from-primary to-accent"
                      )}>
                        <Avatar className="w-full h-full">
                          <AvatarImage src={story.author.avatar} data-ai-hint="story avatar" />
                          <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-xs text-center mt-1 truncate w-16">
                        {story.author.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="profile avatar" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Partilhe algo com a comunidade..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[80px] resize-none"
                      maxLength={500}
                    />
                    
                    <div className="flex justify-between items-center">
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
                          <Palette className="h-4 w-4 mr-1" />
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
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {newPostContent.length}/500
                        </span>
                        <Button onClick={createPost} disabled={!newPostContent.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar 
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => openUserProfile(post.author)}
                      >
                        <AvatarImage src={post.author.avatar} data-ai-hint="profile avatar" />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span 
                            className="font-semibold cursor-pointer hover:text-primary transition-colors"
                            onClick={() => openUserProfile(post.author)}
                          >
                            {post.author.name}
                          </span>
                          {post.author.verified && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <Badge variant="secondary" className="text-xs">
                            Nível {post.author.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{post.timestamp}</span>
                          {post.type === 'pixel' && post.pixel && (
                            <>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{post.pixel.region}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openUserActions(post.author)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-3">
                      <p className="leading-relaxed">{post.content}</p>
                      
                      {post.type === 'pixel' && post.pixel && (
                        <Card className="mt-3 bg-muted/20">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={post.pixel.imageUrl} 
                                alt="Pixel"
                                data-ai-hint="pixel art"
                                className="w-20 h-20 rounded border object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  Pixel ({post.pixel.x}, {post.pixel.y})
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {post.pixel.region}
                                </p>
                                {post.pixel.price && (
                                  <Badge className="mt-1">€{post.pixel.price}</Badge>
                                )}
                              </div>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {post.type === 'achievement' && post.achievement && (
                        <Card className="mt-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{post.achievement.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-medium text-yellow-500">
                                  {post.achievement.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {post.achievement.description}
                                </p>
                                <Badge className="mt-1 bg-yellow-500">
                                  {post.achievement.rarity}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(post.id)}
                          className={cn(
                            "gap-2 transition-colors",
                            post.isLiked && "text-red-500"
                          )}
                        >
                          <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                          {post.likes}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                          className="gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {post.comments.length}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => sharePost(post)}
                          className="gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          {post.shares}
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(post.id)}
                        className={cn(
                          "transition-colors",
                          post.isSaved && "text-blue-500"
                        )}
                      >
                        <Bookmark className={cn("h-4 w-4", post.isSaved && "fill-current")} />
                      </Button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {showComments === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t space-y-3"
                        >
                          {post.comments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.author.avatar} data-ai-hint="profile avatar" />
                                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                    {comment.author.verified && (
                                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      {comment.author.level}
                                    </Badge>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {comment.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                                    Responder
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Comment */}
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="profile avatar" />
                              <AvatarFallback>V</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="Escrever comentário..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                                className="text-sm"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => addComment(post.id)}
                                disabled={!newComment.trim()}
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
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {groups.map(group => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        data-ai-hint="group logo"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-semibold cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setSelectedGroup(group)}
                          >
                            {group.name}
                          </h3>
                          <Badge variant="outline">{group.category}</Badge>
                          <GroupIcon isPrivate={group.isPrivate} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {group.members} membros
                          </span>
                          <span>{group.recentActivity}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => joinGroup(group.id)}
                        variant={group.isJoined ? 'outline' : 'default'}
                        className="min-w-[100px]"
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <div className="space-y-3">
              {conversations.map(conversation => (
                <Card 
                  key={conversation.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openChat(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} data-ai-hint="profile avatar" />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{conversation.name}</span>
                          {conversation.type === 'group' && (
                            <Badge variant="outline" className="text-xs">Grupo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white mt-1">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="space-y-4">
              {events.map(event => (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      data-ai-hint="event poster"
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-primary">
                      {event.category}
                    </Badge>
                    <Badge 
                      className={cn(
                        "absolute top-2 right-2",
                        event.difficulty === 'Fácil' && "bg-green-500",
                        event.difficulty === 'Médio' && "bg-yellow-500",
                        event.difficulty === 'Difícil' && "bg-orange-500",
                        event.difficulty === 'Extremo' && "bg-red-500"
                      )}
                    >
                      {event.difficulty}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.participants} participantes
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          participateInEvent(event.id);
                        }}
                        variant={event.isParticipating ? 'outline' : 'default'}
                        className="flex-1"
                      >
                        {event.isParticipating ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Participando
                          </>
                        ) : (
                          <>
                            <Trophy className="h-4 w-4 mr-2" />
                            Participar
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-4">
            <div className="space-y-4">
              {tutorials.map(tutorial => (
                <Card 
                  key={tutorial.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTutorial(tutorial)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={tutorial.videoUrl} 
                        alt={tutorial.title}
                        data-ai-hint="tutorial video"
                        className="w-24 h-16 rounded object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{tutorial.title}</h3>
                          <Badge 
                            variant={
                              tutorial.difficulty === 'Iniciante' ? 'secondary' :
                              tutorial.difficulty === 'Intermediário' ? 'default' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{tutorial.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tutorial.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            {tutorial.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {tutorial.views}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tutorial.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startTutorial(tutorial.id);
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Começar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveTutorial(tutorial.id);
                          }}
                        >
                          <Bookmark className={cn(
                            "h-4 w-4",
                            tutorial.isSaved && "fill-current text-blue-500"
                          )} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stories Viewer */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md h-[90vh] p-0 bg-black">
          <DialogHeader>
            <DialogTitle className="sr-only">Visualizador de Histórias</DialogTitle>
            <DialogDescription className="sr-only">A visualizar a história de um utilizador.</DialogDescription>
          </DialogHeader>
          {selectedStory && (
            <div className="relative h-full">
              {/* Progress bars */}
              <div className="absolute top-2 left-2 right-2 z-50 flex gap-1">
                {stories.map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-100"
                      style={{ 
                        width: index < storyIndex ? '100%' : 
                               index === storyIndex ? `${storyProgress}%` : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-6 left-4 right-4 z-40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={selectedStory.author.avatar} data-ai-hint="story avatar" />
                    <AvatarFallback>{selectedStory.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-white font-medium">{selectedStory.author.name}</span>
                    <p className="text-white/80 text-sm">{selectedStory.timestamp}</p>
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

              {/* Story Content */}
              <div className="h-full">
                {selectedStory.content.type === 'image' && selectedStory.content.url && (
                  <img 
                    src={selectedStory.content.url} 
                    alt="Story"
                    data-ai-hint="story content"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {selectedStory.content.type === 'text' && (
                  <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 to-accent/20">
                    <p className="text-white text-xl font-medium text-center leading-relaxed">
                      {selectedStory.content.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation areas */}
              <div className="absolute inset-0 flex">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={previousStory}
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setIsStoryPlaying(!isStoryPlaying)}
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={nextStory}
                />
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 right-4 z-40 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStoryPlaying(!isStoryPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isStoryPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Profile Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="w-full max-w-md p-0">
          {selectedUser && (
            <>
              <SheetHeader className="p-6 border-b bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-primary">
                    <AvatarImage src={selectedUser.avatar} data-ai-hint="profile avatar" />
                    <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedUser.name}</SheetTitle>
                    <p className="text-muted-foreground">{selectedUser.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">Nível {selectedUser.level}</Badge>
                      {selectedUser.verified && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">{selectedUser.bio}</p>
                
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">{selectedUser.pixelsOwned}</div>
                    <div className="text-xs text-muted-foreground">Pixels</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-accent">{selectedUser.followers}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-500">{selectedUser.achievements}</div>
                    <div className="text-xs text-muted-foreground">Conquistas</div>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => followUser(selectedUser.id)}
                    variant={followingUsers.includes(selectedUser.id) ? 'outline' : 'default'}
                    className="flex-1"
                  >
                    {followingUsers.includes(selectedUser.id) ? (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        A Seguir
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Seguir
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => sendPrivateMessage(selectedUser.id, selectedUser.name)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mensagem
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Informações</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Membro desde:</span>
                      <span>{selectedUser.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">A seguir:</span>
                      <span>{selectedUser.following}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Group Details Sheet */}
      <Sheet open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <SheetContent className="w-full max-w-md p-0">
          {selectedGroup && (
            <>
              <SheetHeader className="p-6 border-b">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedGroup.avatar} 
                    alt={selectedGroup.name}
                    data-ai-hint="group logo"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <SheetTitle>{selectedGroup.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedGroup.category}</Badge>
                      {selectedGroup.isPrivate && (
                        <Badge variant="secondary">Privado</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">{selectedGroup.description}</p>
              </SheetHeader>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{selectedGroup.members}</div>
                    <div className="text-sm text-muted-foreground">Membros</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{selectedGroup.moderators.length}</div>
                    <div className="text-sm text-muted-foreground">Moderadores</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => joinGroup(selectedGroup.id)}
                  variant={selectedGroup.isJoined ? 'outline' : 'default'}
                  className="w-full"
                >
                  {selectedGroup.isJoined ? (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Sair do Grupo
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Juntar-se ao Grupo
                    </>
                  )}
                </Button>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Atividade Recente</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm">{selectedGroup.recentActivity}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Regras do Grupo</h3>
                  <div className="space-y-2">
                    {selectedGroup.rules.map((rule, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold text-sm">{index + 1}.</span>
                        <span className="text-sm">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Chat Dialog */}
      <Dialog open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
        <DialogContent className="max-w-md h-[80vh] p-0">
          {selectedChat && (
            <>
              <DialogHeader className="p-4 border-b">
                <DialogTitle>Conversa com {selectedChat.name}</DialogTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedChat.avatar} data-ai-hint="profile avatar" />
                      <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.isOnline ? 'Online' : `Visto ${selectedChat.timestamp}`}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
                <div className="space-y-3">
                  {chatMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex",
                        message.sender === 'Você' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div className={cn(
                        "max-w-[80%] p-3 rounded-lg",
                        message.sender === 'Você' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      )}>
                        <p className="text-sm">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          message.sender === 'Você' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        )}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escrever mensagem..."
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendChatMessage} disabled={!newChatMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title}
                  data-ai-hint="event poster"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription>{selectedEvent.description}</DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{selectedEvent.participants}</div>
                      <div className="text-sm text-muted-foreground">Participantes</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-accent">{selectedEvent.prize.split(' ')[0]}</div>
                      <div className="text-sm text-muted-foreground">Prémio</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Requisitos</h3>
                    <ul className="space-y-1">
                      {selectedEvent.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Regras</h3>
                    <ul className="space-y-1">
                      {selectedEvent.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold">{index + 1}.</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">Organizado por</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.organizer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Termina em</p>
                      <p className="font-medium">{selectedEvent.endDate}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => participateInEvent(selectedEvent.id)}
                  variant={selectedEvent.isParticipating ? 'outline' : 'default'}
                  className="flex-1"
                >
                  {selectedEvent.isParticipating ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Participando
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4 mr-2" />
                      Participar
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tutorial Dialog */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          {selectedTutorial && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTutorial.title}</DialogTitle>
                <DialogDescription>{selectedTutorial.description}</DialogDescription>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-16 w-16 text-muted-foreground" />
                </div>
              </DialogHeader>
              
              <ScrollArea className="max-h-[40vh]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedTutorial.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      {selectedTutorial.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedTutorial.views}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">O que vai aprender:</h3>
                    <ul className="space-y-1">
                      {selectedTutorial.steps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedTutorial.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => startTutorial(selectedTutorial.id)}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Começar Tutorial
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => saveTutorial(selectedTutorial.id)}
                >
                  <Bookmark className={cn(
                    "h-4 w-4",
                    selectedTutorial.isSaved && "fill-current text-blue-500"
                  )} />
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
