'use client';

import React, { useState, useEffect } from 'react';
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUserStore, useSettingsStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, Send, Play, Pause, X, 
  ChevronLeft, ChevronRight, Eye, ThumbsUp, UserPlus, Settings,
  Calendar, Clock, Trophy, Star, Crown, Gem, MapPin, Palette,
  BookOpen, Video, Image as ImageIcon, Paperclip, Smile, Gift,
  Bell, Search, Filter, MoreHorizontal, Edit, Trash2, Flag,
  Volume2, VolumeX, Camera, Mic, Phone, VideoIcon, Info,
  Compass, Target, Award, Zap, Activity, TrendingUp, Globe, Link,
  Download, Upload, Copy, ExternalLink, Plus, Minus, Check,
  AlertTriangle, HelpCircle, FileText, Lightbulb, Rocket, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  attachments?: Array<{
    type: 'image' | 'pixel';
    url: string;
    title?: string;
    coordinates?: { x: number; y: number };
  }>;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
    pixels: number;
    followers: number;
    bio: string;
    albums: Array<{
      id: string;
      name: string;
      coverUrl: string;
      pixelCount: number;
    }>;
    achievements: Array<{
      id: string;
      name: string;
      icon: string;
      rarity: string;
    }>;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  type: 'text' | 'pixel' | 'image';
  attachments?: Array<{
    type: 'image' | 'pixel';
    url: string;
    title?: string;
    coordinates?: { x: number; y: number };
  }>;
  showComments: boolean;
}

interface Story {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  type: 'image' | 'video' | 'text';
  timestamp: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  avatar: string;
  isJoined: boolean;
  recentActivity: string;
  moderators: Array<{
    name: string;
    avatar: string;
    role: string;
  }>;
  rules: string[];
  posts: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    likes: number;
  }>;
  membersList: Array<{
    name: string;
    avatar: string;
    level: number;
    joinDate: string;
  }>;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  type: 'private' | 'group';
  messages: ChatMessage[];
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
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  isParticipating: boolean;
  organizer: {
    name: string;
    avatar: string;
  };
  rules: string[];
  posts: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    likes: number;
  }>;
  participantsList: Array<{
    name: string;
    avatar: string;
    level: number;
    joinDate: string;
  }>;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  author: string;
  rating: number;
  tags: string[];
  steps: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
  tips: string[];
  relatedTutorials: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'emoji';
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
  replyTo?: string;
}

// Mock Data
const mockStories: Story[] = [
  {
    id: '1',
    author: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png'
    },
    content: 'https://placehold.co/400x600/D4A757/FFFFFF?text=Story+1',
    type: 'image',
    timestamp: '2h'
  },
  {
    id: '2',
    author: {
      name: 'ArtLover',
      avatar: 'https://placehold.co/40x40.png'
    },
    content: 'Trabalhando num novo projeto incrível! 🎨',
    type: 'text',
    timestamp: '4h'
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'PixelArtist',
      avatar: 'https://placehold.co/40x40.png',
      level: 15,
      verified: true,
      pixels: 234,
      followers: 1567,
      bio: 'Artista digital especializado em paisagens portuguesas. Criador de mais de 200 pixels únicos.',
      albums: [
        { id: '1', name: 'Paisagens de Portugal', coverUrl: 'https://placehold.co/100x100/D4A757/FFFFFF?text=Paisagens', pixelCount: 45 },
        { id: '2', name: 'Arte Urbana', coverUrl: 'https://placehold.co/100x100/7DF9FF/000000?text=Urbano', pixelCount: 23 }
      ],
      achievements: [
        { id: '1', name: 'Mestre das Cores', icon: '🎨', rarity: 'Épico' },
        { id: '2', name: 'Explorador', icon: '🗺️', rarity: 'Raro' },
        { id: '3', name: 'Artista Verificado', icon: '⭐', rarity: 'Lendário' }
      ]
    },
    content: 'Acabei de terminar esta obra-prima em Lisboa! O que acham? 🎨✨',
    timestamp: '2h',
    likes: 89,
    comments: [
      {
        id: '1',
        author: 'ColorMaster',
        avatar: 'https://placehold.co/30x30.png',
        content: 'Incrível! Que técnica usaste para conseguir esse efeito?',
        timestamp: '1h',
        likes: 12,
        isLiked: false,
        attachments: []
      }
    ],
    shares: 23,
    isLiked: false,
    type: 'pixel',
    attachments: [
      {
        type: 'pixel',
        url: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa+Art',
        title: 'Pixel Artístico Lisboa',
        coordinates: { x: 245, y: 156 }
      }
    ],
    showComments: false
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Artistas de Lisboa',
    description: 'Comunidade de criadores da capital portuguesa',
    category: 'Regional',
    members: 234,
    avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
    isJoined: true,
    recentActivity: 'Nova obra partilhada há 2h',
    moderators: [
      { name: 'AdminLisboa', avatar: 'https://placehold.co/40x40.png', role: 'Administrador' },
      { name: 'ModeradorArte', avatar: 'https://placehold.co/40x40.png', role: 'Moderador' }
    ],
    rules: [
      'Respeite todos os membros da comunidade',
      'Partilhe apenas conteúdo relacionado com Lisboa',
      'Não faça spam ou publicidade excessiva',
      'Use linguagem apropriada',
      'Ajude outros membros quando possível'
    ],
    posts: [
      { id: '1', author: 'PixelArtist', content: 'Nova obra no Rossio!', timestamp: '2h', likes: 45 },
      { id: '2', author: 'LisboaFan', content: 'Alguém quer colaborar num projeto?', timestamp: '4h', likes: 23 }
    ],
    membersList: [
      { name: 'PixelArtist', avatar: 'https://placehold.co/40x40.png', level: 15, joinDate: '2024-01-15' },
      { name: 'LisboaFan', avatar: 'https://placehold.co/40x40.png', level: 12, joinDate: '2024-02-20' },
      { name: 'ColorMaster', avatar: 'https://placehold.co/40x40.png', level: 18, joinDate: '2024-01-08' }
    ]
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Concurso de Arte Natalícia',
    description: 'Crie a melhor arte pixel com tema natalício e ganhe prémios incríveis!',
    startDate: '2024-12-01',
    endDate: '2024-12-25',
    participants: 156,
    maxParticipants: 500,
    prize: '2000 créditos especiais + Badge exclusivo',
    requirements: ['Nível 5 ou superior', 'Pelo menos 10 pixels'],
    category: 'Concurso',
    difficulty: 'Médio',
    isParticipating: false,
    organizer: {
      name: 'EquipaPixelUniverse',
      avatar: 'https://placehold.co/40x40.png'
    },
    rules: [
      'Tema deve ser relacionado com o Natal',
      'Apenas pixels criados durante o evento são válidos',
      'Máximo 5 submissões por participante',
      'Conteúdo deve ser original',
      'Votação da comunidade + júri especializado'
    ],
    posts: [
      { id: '1', author: 'PixelArtist', content: 'Já comecei a minha submissão! 🎄', timestamp: '1h', likes: 34 },
      { id: '2', author: 'ChristmasLover', content: 'Alguém quer formar equipa?', timestamp: '3h', likes: 18 }
    ],
    participantsList: [
      { name: 'PixelArtist', avatar: 'https://placehold.co/40x40.png', level: 15, joinDate: '2024-12-01' },
      { name: 'ChristmasLover', avatar: 'https://placehold.co/40x40.png', level: 12, joinDate: '2024-12-02' }
    ]
  }
];

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Como Comprar o Seu Primeiro Pixel',
    description: 'Guia completo para iniciantes sobre como comprar pixels no Pixel Universe',
    content: 'Bem-vindo ao Pixel Universe! Este guia vai ensinar-lhe tudo sobre como comprar o seu primeiro pixel.',
    category: 'Básico',
    difficulty: 'Iniciante',
    duration: '5 min',
    author: 'EquipaPixelUniverse',
    rating: 4.9,
    tags: ['básico', 'compra', 'iniciante'],
    steps: [
      {
        title: 'Passo 1: Navegar pelo Mapa',
        content: 'Use os controlos de zoom (+/-) para navegar pelo mapa de Portugal. Pode arrastar para mover a vista e usar a roda do rato para fazer zoom.',
        image: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Navegação'
      },
      {
        title: 'Passo 2: Selecionar um Pixel',
        content: 'Clique num pixel dourado (disponível) para ver os detalhes. Pixels já vendidos aparecem com cores diferentes.',
        image: 'https://placehold.co/300x200/7DF9FF/000000?text=Seleção'
      },
      {
        title: 'Passo 3: Verificar Informações',
        content: 'No modal que abre, pode ver o preço, localização, e outras informações do pixel. Certifique-se que tem créditos suficientes.',
        image: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Informações'
      },
      {
        title: 'Passo 4: Personalizar',
        content: 'Escolha uma cor personalizada, adicione um título e descrição. Pode também fazer upload de uma imagem.',
        image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Personalizar'
      },
      {
        title: 'Passo 5: Confirmar Compra',
        content: 'Revise todos os detalhes e clique em "Comprar Pixel". O pagamento será processado e o pixel será seu!',
        image: 'https://placehold.co/300x200/FF9800/FFFFFF?text=Comprar'
      }
    ],
    tips: [
      'Pixels em zonas históricas tendem a valorizar mais',
      'Verifique sempre o preço antes de comprar',
      'Pode revender pixels no marketplace',
      'Pixels personalizados são mais atrativos'
    ],
    relatedTutorials: ['2', '3']
  },
  {
    id: '2',
    title: 'Sistema de Créditos e Moedas',
    description: 'Entenda como funcionam os créditos normais e especiais',
    content: 'O Pixel Universe usa dois tipos de moeda: créditos normais e créditos especiais.',
    category: 'Básico',
    difficulty: 'Iniciante',
    duration: '3 min',
    author: 'EquipaPixelUniverse',
    rating: 4.8,
    tags: ['créditos', 'moeda', 'economia'],
    steps: [
      {
        title: 'Créditos Normais',
        content: 'São a moeda principal do jogo. Use para comprar pixels, ferramentas e itens básicos. Ganha através de atividades, vendas e conquistas.'
      },
      {
        title: 'Créditos Especiais',
        content: 'Moeda premium para itens exclusivos, pixels raros e funcionalidades avançadas. Obtém através de subscrições, eventos especiais e conquistas épicas.'
      },
      {
        title: 'Como Ganhar Créditos',
        content: 'Participe na comunidade, complete conquistas, venda pixels, participe em eventos e mantenha login diário para bónus.'
      }
    ],
    tips: [
      'Faça login diário para bónus de créditos',
      'Participe em eventos para ganhar créditos especiais',
      'Venda pixels no marketplace para lucrar',
      'Complete conquistas para recompensas'
    ],
    relatedTutorials: ['1', '3']
  },
  {
    id: '3',
    title: 'Conquistas e Sistema de Níveis',
    description: 'Como desbloquear conquistas e subir de nível',
    content: 'O sistema de conquistas recompensa as suas atividades no Pixel Universe.',
    category: 'Gamificação',
    difficulty: 'Intermediário',
    duration: '7 min',
    author: 'EquipaPixelUniverse',
    rating: 4.7,
    tags: ['conquistas', 'xp', 'níveis'],
    steps: [
      {
        title: 'Como Funcionam as Conquistas',
        content: 'Conquistas são desbloqueadas automaticamente quando completa certas ações. Cada conquista dá XP e créditos.'
      },
      {
        title: 'Sistema de Níveis',
        content: 'Ganhe XP através de atividades para subir de nível. Níveis mais altos desbloqueiam funcionalidades especiais.'
      },
      {
        title: 'Tipos de Conquistas',
        content: 'Existem conquistas de Pixel, Comunidade, Exploração, Coleção, Moderação e Sociais. Cada categoria tem recompensas únicas.'
      }
    ],
    tips: [
      'Verifique regularmente a página de conquistas',
      'Algumas conquistas têm múltiplos níveis',
      'Conquistas raras dão mais XP',
      'Participe na comunidade para conquistas sociais'
    ],
    relatedTutorials: ['1', '4']
  },
  {
    id: '4',
    title: 'Funcionalidades Premium',
    description: 'Descubra todas as vantagens da subscrição Premium',
    content: 'A subscrição Premium desbloqueia funcionalidades exclusivas e ferramentas avançadas.',
    category: 'Premium',
    difficulty: 'Intermediário',
    duration: '6 min',
    author: 'EquipaPixelUniverse',
    rating: 4.9,
    tags: ['premium', 'subscrição', 'funcionalidades'],
    steps: [
      {
        title: 'Editor Avançado',
        content: 'Acesso a ferramentas profissionais de pixel art com camadas, filtros e efeitos especiais.'
      },
      {
        title: 'Colaboração em Tempo Real',
        content: 'Trabalhe em projetos com outros artistas simultaneamente, com chat integrado e cursores em tempo real.'
      },
      {
        title: 'Analytics Detalhados',
        content: 'Veja estatísticas avançadas dos seus pixels: visualizações, engagement, tendências de preço.'
      },
      {
        title: 'Suporte Prioritário',
        content: 'Atendimento VIP 24/7 com especialistas em pixel art e consultoria personalizada.'
      }
    ],
    tips: [
      'Premium inclui 100 créditos especiais mensais',
      'Desconto de 15% em todas as compras',
      'Acesso antecipado a novas funcionalidades',
      'Backup automático de todas as criações'
    ],
    relatedTutorials: ['1', '2']
  }
];

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'PixelMaster',
    avatar: 'https://placehold.co/40x40.png',
    lastMessage: 'Viste a minha nova criação?',
    timestamp: '5m',
    unread: 2,
    isOnline: true,
    type: 'private',
    messages: [
      { id: '1', sender: 'PixelMaster', content: 'Olá! Como estás?', timestamp: '10:30', type: 'text' },
      { id: '2', sender: 'Você', content: 'Tudo bem! E tu?', timestamp: '10:32', type: 'text' },
      { id: '3', sender: 'PixelMaster', content: 'Viste a minha nova criação?', timestamp: '10:35', type: 'text' }
    ]
  }
];

// Helper functions
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Fácil':
    case 'Iniciante':
      return 'bg-green-500';
    case 'Médio':
    case 'Intermediário':
      return 'bg-yellow-500';
    case 'Difícil':
    case 'Avançado':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [stories, setStories] = useState<Story[]>(mockStories);
  
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'text' | 'pixel' | 'image'>('text');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(true);
  const [storyProgress, setStoryProgress] = useState(0);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<Post['author'] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatNotifications, setChatNotifications] = useState<Record<string, number>>({});
  
  const { addCredits, addXp } = useUserStore();
  const { soundEffects } = useSettingsStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [playRewardSound, setPlayRewardSound] = useState(false);

  // Story progress effect
  useEffect(() => {
    if (selectedStory && isStoryPlaying) {
      const interval = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            // Move to next story
            if (currentStoryIndex < stories.length - 1) {
              setCurrentStoryIndex(prev => prev + 1);
              setSelectedStory(stories[currentStoryIndex + 1]);
              return 0;
            } else {
              setSelectedStory(null);
              return 0;
            }
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [selectedStory, isStoryPlaying, currentStoryIndex, stories]);

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Post Vazio",
        description: "Por favor, escreva algo antes de publicar.",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        level: 15,
        verified: true,
        pixels: 42,
        followers: 156,
        bio: 'Explorador do Pixel Universe',
        albums: [],
        achievements: []
      },
      content: newPost,
      timestamp: 'agora',
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      type: postType,
      showComments: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    
    // Recompensas
    setShowConfetti(true);
    setPlayRewardSound(true);
    addXp(25);
    addCredits(10);
    
    toast({
      title: "Post Publicado! 🎉",
      description: "Recebeu 25 XP e 10 créditos por partilhar com a comunidade.",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;
        
        if (newIsLiked) {
          addXp(5);
          addCredits(2);
          setPlayRewardSound(true);
          toast({
            title: "Post Curtido! ❤️",
            description: "Recebeu 5 XP e 2 créditos.",
          });
        }
        
        return { ...post, isLiked: newIsLiked, likes: newLikes };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, showComments: !post.showComments }
        : post
    ));
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const comment: Comment = {
          id: Date.now().toString(),
          author: 'Você',
          avatar: 'https://placehold.co/30x30.png',
          content: newComment,
          timestamp: 'agora',
          likes: 0,
          isLiked: false,
          attachments: []
        };
        
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));
    
    setNewComment('');
    setCommentingOnPost(null);
    
    // Recompensas
    addXp(8);
    addCredits(3);
    setPlayRewardSound(true);
    
    toast({
      title: "Comentário Adicionado! 💬",
      description: "Recebeu 8 XP e 3 créditos por participar na discussão.",
    });
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              const newIsLiked = !comment.isLiked;
              return {
                ...comment,
                isLiked: newIsLiked,
                likes: newIsLiked ? comment.likes + 1 : comment.likes - 1
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
    
    addXp(3);
    addCredits(1);
  };

  const handleFollowUser = (userName: string) => {
    setPlayRewardSound(true);
    addXp(10);
    addCredits(5);
    
    toast({
      title: "Utilizador Seguido! 👥",
      description: `Agora segue ${userName}. Recebeu 10 XP e 5 créditos.`,
    });
  };

  const handleOpenUserProfile = (user: Post['author']) => {
    setSelectedUser(user);
  };

  const handleOpenGroupPage = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleOpenEventPage = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleOpenTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newIsJoined = !group.isJoined;
        
        if (newIsJoined) {
          setShowConfetti(true);
          setPlayRewardSound(true);
          addXp(15);
          addCredits(8);
          toast({
            title: "Juntou-se ao Grupo! 🎉",
            description: `Bem-vindo ao ${group.name}! Recebeu 15 XP e 8 créditos.`,
          });
        } else {
          toast({
            title: "Saiu do Grupo",
            description: `Deixou o grupo ${group.name}.`,
          });
        }
        
        return {
          ...group,
          isJoined: newIsJoined,
          members: newIsJoined ? group.members + 1 : group.members - 1
        };
      }
      return group;
    }));
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const newIsParticipating = !event.isParticipating;
        
        if (newIsParticipating) {
          setShowConfetti(true);
          setPlayRewardSound(true);
          addXp(20);
          addCredits(15);
          toast({
            title: "Inscrito no Evento! 🎉",
            description: `Inscreveu-se em ${event.title}! Recebeu 20 XP e 15 créditos.`,
          });
        } else {
          toast({
            title: "Saiu do Evento",
            description: `Cancelou a inscrição em ${event.title}.`,
          });
        }
        
        return {
          ...event,
          isParticipating: newIsParticipating,
          participants: newIsParticipating ? event.participants + 1 : event.participants - 1
        };
      }
      return event;
    }));
  };

  const handleStartTutorial = (tutorialId: string) => {
    setPlayRewardSound(true);
    addXp(5);
    addCredits(2);
    
    toast({
      title: "Tutorial Iniciado! 📚",
      description: "Recebeu 5 XP e 2 créditos por começar a aprender.",
    });
  };

  const handleSendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    
    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: newMessage,
          timestamp: 'agora'
        };
      }
      return chat;
    }));
    
    setNewMessage('');
    
    toast({
      title: "Mensagem Enviada! 💬",
      description: `Mensagem enviada para ${selectedChat.name}.`,
    });
  };

  const handleAddEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSharePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
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
    
    addXp(3);
    addCredits(1);
  };

  const handleSavePost = (postId: string) => {
    toast({
      title: "Post Guardado! 🔖",
      description: "Post adicionado aos seus favoritos.",
    });
    
    addXp(2);
    addCredits(1);
  };

  // Simular atividade em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular novos likes
      if (Math.random() > 0.8) {
        setPosts(prev => prev.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3)
        })));
      }
      
      // Simular novas mensagens
      if (Math.random() > 0.9) {
        setChatNotifications(prev => ({
          ...prev,
          '1': (prev['1'] || 0) + 1
        }));
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent>
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Junte-se à Comunidade</h2>
            <p className="text-muted-foreground mb-6">
              Conecte-se com outros criadores, partilhe as suas obras e participe em eventos exclusivos.
            </p>
            <div className="space-y-3">
              <Button className="w-full">Criar Conta</Button>
              <Button variant="outline" className="w-full">Iniciar Sessão</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playRewardSound} onEnd={() => setPlayRewardSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-6 shadow-lg bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient-gold flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Comunidade Pixel
            </CardTitle>
            <CardDescription>
              Conecte-se com outros criadores, partilhe as suas obras e descubra arte incrível
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-12 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="feed" className="text-xs">
              <MessageSquare className="h-4 w-4 mb-1" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="stories" className="text-xs">
              <Camera className="h-4 w-4 mb-1" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              <Users className="h-4 w-4 mb-1" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              <Calendar className="h-4 w-4 mb-1" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-xs">
              <BookOpen className="h-4 w-4 mb-1" />
              Aprender
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="h-4 w-4 mb-1" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Você" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="O que está a criar hoje?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant={postType === 'text' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPostType('text')}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Texto
                        </Button>
                        <Button
                          variant={postType === 'pixel' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPostType('pixel')}
                        >
                          <Palette className="h-4 w-4 mr-2" />
                          Pixel
                        </Button>
                        <Button
                          variant={postType === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPostType('image')}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Imagem
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {newPost.length}/500
                        </span>
                        <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
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
            <div className="space-y-6">
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar 
                          className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => handleOpenUserProfile(post.author)}
                        >
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-semibold cursor-pointer hover:text-primary transition-colors"
                              onClick={() => handleOpenUserProfile(post.author)}
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
                          <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="leading-relaxed">{post.content}</p>
                        
                        {post.attachments && post.attachments.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            {post.attachments.map((attachment, index) => (
                              <div key={index} className="relative">
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.title || 'Anexo'}
                                  className="w-full aspect-square rounded-lg object-cover border"
                                />
                                {attachment.coordinates && (
                                  <Badge className="absolute top-2 left-2">
                                    ({attachment.coordinates.x},{attachment.coordinates.y})
                                  </Badge>
                                )}
                                {attachment.title && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                                    <p className="text-sm font-medium">{attachment.title}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={post.isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleComments(post.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {post.comments.length}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSharePost(post.id)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            {post.shares}
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSavePost(post.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Comentários */}
                      <AnimatePresence>
                        {post.showComments && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3 border-t pt-3"
                          >
                            {post.comments.map(comment => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar 
                                  className="h-8 w-8 cursor-pointer"
                                  onClick={() => handleOpenUserProfile({
                                    name: comment.author,
                                    avatar: comment.avatar,
                                    level: Math.floor(Math.random() * 20) + 1,
                                    verified: Math.random() > 0.7,
                                    pixels: Math.floor(Math.random() * 100) + 10,
                                    followers: Math.floor(Math.random() * 500) + 50,
                                    bio: 'Membro ativo da comunidade Pixel Universe',
                                    albums: [],
                                    achievements: []
                                  })}
                                >
                                  <AvatarImage src={comment.avatar} alt={comment.author} />
                                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span 
                                        className="font-medium text-sm cursor-pointer hover:text-primary"
                                        onClick={() => handleOpenUserProfile({
                                          name: comment.author,
                                          avatar: comment.avatar,
                                          level: Math.floor(Math.random() * 20) + 1,
                                          verified: Math.random() > 0.7,
                                          pixels: Math.floor(Math.random() * 100) + 10,
                                          followers: Math.floor(Math.random() * 500) + 50,
                                          bio: 'Membro ativo da comunidade Pixel Universe',
                                          albums: [],
                                          achievements: []
                                        })}
                                      >
                                        {comment.author}
                                      </span>
                                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                    
                                    {comment.attachments && comment.attachments.length > 0 && (
                                      <div className="mt-2 flex gap-2">
                                        {comment.attachments.map((attachment, idx) => (
                                          <div key={idx} className="relative">
                                            {attachment.type === 'image' ? (
                                              <img 
                                                src={attachment.url} 
                                                alt={attachment.title || 'Anexo'}
                                                className="w-16 h-16 rounded object-cover border"
                                              />
                                            ) : (
                                              <div className="w-16 h-16 bg-primary/20 rounded border flex items-center justify-center">
                                                <MapPin className="h-6 w-6 text-primary" />
                                              </div>
                                            )}
                                            {attachment.coordinates && (
                                              <Badge className="absolute -top-1 -right-1 text-xs">
                                                ({attachment.coordinates.x},{attachment.coordinates.y})
                                              </Badge>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 text-xs"
                                      onClick={() => handleLikeComment(post.id, comment.id)}
                                    >
                                      <ThumbsUp className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current text-blue-500' : ''}`} />
                                      {comment.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      Responder
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {commentingOnPost === post.id ? (
                              <div className="flex gap-3 mt-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="https://placehold.co/30x30.png" alt="Você" />
                                  <AvatarFallback>V</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <Textarea
                                    placeholder="Escreva um comentário..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[60px] resize-none"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment(post.id);
                                      }
                                    }}
                                  />
                                  <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Imagem
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Pixel
                                      </Button>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          setCommentingOnPost(null);
                                          setNewComment('');
                                        }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button 
                                        size="sm"
                                        onClick={() => handleAddComment(post.id)}
                                        disabled={!newComment.trim()}
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        Comentar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setCommentingOnPost(post.id)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Adicionar comentário...
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-4">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {stories.map(story => (
                <div 
                  key={story.id} 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedStory(story);
                    setCurrentStoryIndex(stories.findIndex(s => s.id === story.id));
                    setStoryProgress(0);
                    setIsStoryPlaying(true);
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-4 border-primary">
                      <AvatarImage src={story.author.avatar} alt={story.author.name} />
                      <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <p className="text-xs text-center mt-1 max-w-[64px] truncate">{story.author.name}</p>
                </div>
              ))}
            </div>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Partilhe a Sua História</h3>
                <p className="text-muted-foreground mb-4">
                  Crie uma story para mostrar os seus pixels e criações à comunidade.
                </p>
                <Button>
                  <Camera className="h-4 w-4 mr-2" />
                  Criar Story
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grupos Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(group => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{group.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {group.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenGroupPage(group)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span>{group.members} membros</span>
                      <span className="text-muted-foreground">{group.recentActivity}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinGroup(group.id)}
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

          {/* Eventos Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="space-y-4">
              {events.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-full">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(event.difficulty)}>
                              {event.difficulty}
                            </Badge>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEventPage(event)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Participantes:</span>
                        <span className="font-medium ml-1">{event.participants}</span>
                        {event.maxParticipants && (
                          <span className="text-muted-foreground">/{event.maxParticipants}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Termina:</span>
                        <span className="font-medium ml-1">{event.endDate}</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">Prémio</span>
                      </div>
                      <p className="text-sm">{event.prize}</p>
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinEvent(event.id)}
                      variant={event.isParticipating ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {event.isParticipating ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          A Participar
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Participar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Aprender Tab */}
          <TabsContent value="learn" className="space-y-4">
            <div className="space-y-4">
              {tutorials.map(tutorial => (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-full">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tutorial.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(tutorial.difficulty)}>
                              {tutorial.difficulty}
                            </Badge>
                            <Badge variant="outline">{tutorial.category}</Badge>
                            <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenTutorial(tutorial)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {tutorial.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{tutorial.rating}</span>
                      </div>
                      <span className="text-muted-foreground">Por {tutorial.author}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tutorial.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleStartTutorial(tutorial.id)}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Começar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
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
              {chats.map(chat => (
                <Card 
                  key={chat.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedChat(chat)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={chat.avatar} alt={chat.name} />
                          <AvatarFallback>{chat.name[0]}</AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{chat.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                            {(chat.unread > 0 || chatNotifications[chat.id]) && (
                              <Badge className="bg-red-500 text-white">
                                {chat.unread + (chatNotifications[chat.id] || 0)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal do Perfil do Utilizador */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedUser.name}
                      {selectedUser.verified && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </DialogTitle>
                    <Badge variant="secondary">Nível {selectedUser.level}</Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedUser.bio}</p>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{selectedUser.pixels}</div>
                    <div className="text-xs text-muted-foreground">Pixels</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{selectedUser.followers}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                </div>
                
                {/* Álbuns */}
                {selectedUser.albums.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Álbuns
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedUser.albums.slice(0, 4).map(album => (
                        <div key={album.id} className="text-center">
                          <img 
                            src={album.coverUrl} 
                            alt={album.name}
                            className="w-full aspect-square rounded border object-cover"
                          />
                          <p className="text-xs mt-1 truncate">{album.name}</p>
                          <p className="text-xs text-muted-foreground">{album.pixelCount} pixels</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Conquistas */}
                {selectedUser.achievements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      Conquistas Recentes
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.achievements.slice(0, 3).map(achievement => (
                        <div key={achievement.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                          <span className="text-lg">{achievement.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{achievement.name}</p>
                            <Badge variant="outline" className="text-xs">{achievement.rarity}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleFollowUser(selectedUser.name)}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedChat({
                        id: Date.now().toString(),
                        name: selectedUser.name,
                        avatar: selectedUser.avatar,
                        lastMessage: '',
                        timestamp: 'agora',
                        unread: 0,
                        isOnline: true,
                        type: 'private',
                        messages: []
                      });
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mensagem
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sheet da Página do Grupo */}
      <Sheet open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <SheetContent className="w-full max-w-2xl p-0" side="right">
          {selectedGroup && (
            <>
              <SheetHeader className="p-6 border-b bg-gradient-to-r from-card to-primary/5">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedGroup.avatar} 
                    alt={selectedGroup.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <SheetTitle className="text-xl">{selectedGroup.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedGroup.category}</Badge>
                      <span className="text-sm text-muted-foreground">{selectedGroup.members} membros</span>
                    </div>
                  </div>
                </div>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Sobre o Grupo</h3>
                    <p className="text-muted-foreground">{selectedGroup.description}</p>
                  </div>
                  
                  <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="posts">Publicações</TabsTrigger>
                      <TabsTrigger value="members">Membros</TabsTrigger>
                      <TabsTrigger value="info">Informações</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="posts" className="space-y-3 mt-4">
                      {selectedGroup.posts.map(post => (
                        <Card key={post.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{post.author}</span>
                              <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                            </div>
                            <p className="text-sm">{post.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-3 w-3 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Comentar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="members" className="space-y-3 mt-4">
                      {selectedGroup.membersList.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Nível {member.level} • Membro desde {member.joinDate}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="info" className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Moderadores</h4>
                        <div className="space-y-2">
                          {selectedGroup.moderators.map((mod, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={mod.avatar} alt={mod.name} />
                                <AvatarFallback>{mod.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{mod.name}</p>
                                <Badge variant="outline" className="text-xs">{mod.role}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Regras do Grupo</h4>
                        <div className="space-y-2">
                          {selectedGroup.rules.map((rule, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs mt-0.5">
                                {index + 1}
                              </Badge>
                              <p className="text-sm text-muted-foreground">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal da Página do Evento */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedEvent && (
            <>
              <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getDifficultyColor(selectedEvent.difficulty)}>
                        {selectedEvent.difficulty}
                      </Badge>
                      <Badge variant="outline">{selectedEvent.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedEvent.startDate} - {selectedEvent.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                  
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">Informações</TabsTrigger>
                      <TabsTrigger value="participants">Participantes</TabsTrigger>
                      <TabsTrigger value="posts">Publicações</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{selectedEvent.participants}</div>
                            <div className="text-sm text-muted-foreground">Participantes</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-accent">
                              {selectedEvent.maxParticipants ? selectedEvent.maxParticipants - selectedEvent.participants : '∞'}
                            </div>
                            <div className="text-sm text-muted-foreground">Vagas Restantes</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                          Prémios
                        </h4>
                        <Card>
                          <CardContent className="p-3">
                            <p className="text-sm">{selectedEvent.prize}</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Requisitos</h4>
                        <div className="space-y-1">
                          {selectedEvent.requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Regras</h4>
                        <div className="space-y-1">
                          {selectedEvent.rules.map((rule, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs mt-0.5">
                                {index + 1}
                              </Badge>
                              <p className="text-sm text-muted-foreground">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="participants" className="space-y-3 mt-4">
                      {selectedEvent.participantsList.map((participant, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{participant.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Nível {participant.level} • Inscrito em {participant.joinDate}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="posts" className="space-y-3 mt-4">
                      {selectedEvent.posts.map(post => (
                        <Card key={post.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{post.author}</span>
                              <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                            </div>
                            <p className="text-sm">{post.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-3 w-3 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Comentar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                      variant={selectedEvent.isParticipating ? 'outline' : 'default'}
                      className="flex-1"
                    >
                      {selectedEvent.isParticipating ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          A Participar
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Participar
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal do Tutorial */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedTutorial && (
            <>
              <DialogHeader className="p-6 border-b bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedTutorial.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
                        {selectedTutorial.difficulty}
                      </Badge>
                      <Badge variant="outline">{selectedTutorial.category}</Badge>
                      <span className="text-sm text-muted-foreground">{selectedTutorial.duration}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{selectedTutorial.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">{selectedTutorial.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Passos do Tutorial</h3>
                    <div className="space-y-4">
                      {selectedTutorial.steps.map((step, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Badge className="bg-primary text-primary-foreground">
                                {index + 1}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">{step.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{step.content}</p>
                                {step.image && (
                                  <img 
                                    src={step.image} 
                                    alt={step.title}
                                    className="w-full max-w-sm rounded border"
                                  />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      Dicas Importantes
                    </h3>
                    <div className="space-y-2">
                      {selectedTutorial.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {selectedTutorial.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => handleStartTutorial(selectedTutorial.id)}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Começar Tutorial
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal do Chat */}
      <Dialog open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
        <DialogContent className="max-w-md h-[80vh] p-0">
          {selectedChat && (
            <>
              <DialogHeader className="p-4 border-b bg-gradient-to-r from-card to-primary/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                      <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <DialogTitle>{selectedChat.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-4 h-[50vh]">
                <div className="space-y-3">
                  {selectedChat.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'Você' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'Você' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Escrever mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {showEmojiPicker && (
                  <div className="grid grid-cols-8 gap-1 p-2 bg-muted/50 rounded">
                    {['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙌', '💪', '🎨', '🎯', '⭐', '🚀'].map(emoji => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => handleAddEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Anexar
                  </Button>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Imagem
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Pixel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal das Stories */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md h-[90vh] p-0 bg-black border-none">
          {selectedStory && (
            <div className="relative h-full overflow-hidden">
              {/* Barra de progresso */}
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

              {/* Header */}
              <div className="absolute top-6 left-4 right-4 z-40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={selectedStory.author.avatar} alt={selectedStory.author.name} />
                    <AvatarFallback>{selectedStory.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-white font-medium">{selectedStory.author.name}</span>
                    <div className="text-white/80 text-sm">{selectedStory.timestamp}</div>
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

              {/* Conteúdo da Story */}
              <div className="h-full">
                {selectedStory.type === 'image' ? (
                  <img 
                    src={selectedStory.content} 
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                ) : selectedStory.type === 'video' ? (
                  <video
                    src={selectedStory.content}
                    className="w-full h-full object-cover"
                    autoPlay={isStoryPlaying}
                    muted
                    loop
                  />
                ) : (
                  <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-primary/20 to-accent/20">
                    <p className="text-white text-xl font-medium text-center leading-relaxed">
                      {selectedStory.content}
                    </p>
                  </div>
                )}
              </div>

              {/* Áreas de navegação */}
              <div className="absolute inset-0 flex">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (currentStoryIndex > 0) {
                      setCurrentStoryIndex(prev => prev - 1);
                      setSelectedStory(stories[currentStoryIndex - 1]);
                      setStoryProgress(0);
                    }
                  }}
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setIsStoryPlaying(!isStoryPlaying)}
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (currentStoryIndex < stories.length - 1) {
                      setCurrentStoryIndex(prev => prev + 1);
                      setSelectedStory(stories[currentStoryIndex + 1]);
                      setStoryProgress(0);
                    } else {
                      setSelectedStory(null);
                    }
                  }}
                />
              </div>

              {/* Controles */}
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
                    <Heart className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}