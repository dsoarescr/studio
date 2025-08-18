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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, Eye, Send, Plus, Star, Crown, 
  Trophy, Gift, Coins, Zap, Calendar, Clock, MapPin, Palette, 
  Camera, Image as ImageIcon, Video, Music, Bookmark, Flag, 
  ThumbsUp, UserPlus, Settings, Bell, Search, Filter, 
  TrendingUp, Flame, Target, Award, Gem, Sparkles, 
  Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight,
  MoreHorizontal, Edit, Trash2, Copy, ExternalLink, Download,
  Upload, Paperclip, Smile, Hash, AtSign, Link as LinkIcon,
  Globe, Phone, Mail, Instagram, Twitter, Facebook, Youtube,
  BookOpen, GraduationCap, Lightbulb, HelpCircle, FileText,
  CheckCircle, AlertTriangle, Info, Compass, Navigation,
  Layers, Brush, Eraser, PaintBucket, Type, Grid, Maximize,
  Minimize, RotateCcw, RotateCw, FlipHorizontal, FlipVertical,
  Save, Undo, Redo, ZoomIn, ZoomOut, Move, Hand, Crosshair
} from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Types
interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  dataAiHint?: string;
  level: number;
  isVerified: boolean;
  isPremium: boolean;
  followers: number;
  following: number;
  pixelsOwned: number;
  achievements: number;
  bio: string;
  joinDate: string;
  isFollowing: boolean;
  isOnline: boolean;
  lastSeen?: string;
  publicAlbums: Array<{
    id: string;
    name: string;
    pixelCount: number;
    coverImage: string;
  }>;
  publicPixels: Array<{
    x: number;
    y: number;
    region: string;
    color: string;
    title: string;
    imageUrl?: string;
  }>;
  topAchievements: Array<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    handle: string;
  }>;
}

interface Post {
  id: string;
  author: User;
  content: string;
  type: 'text' | 'pixel' | 'image' | 'video';
  attachments?: Array<{
    type: 'image' | 'pixel' | 'video';
    url: string;
    title?: string;
    coordinates?: { x: number; y: number };
    region?: string;
  }>;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  location?: string;
  showComments: boolean;
}

interface Comment {
  id: string;
  author: User;
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
  replies?: Comment[];
}

interface Story {
  id: string;
  author: User;
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
  category: string;
  avatar: string;
  banner?: string;
  members: number;
  isJoined: boolean;
  isPrivate: boolean;
  recentActivity: string;
  rules: string[];
  moderators: User[];
  tags: string[];
  createdDate: string;
  stats: {
    postsToday: number;
    activeMembers: number;
    totalPosts: number;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize: string;
  requirements: string[];
  organizer: User;
  status: 'upcoming' | 'active' | 'ended';
  isParticipating: boolean;
  banner: string;
  rules: string[];
  prizes: Array<{
    position: string;
    reward: string;
    credits: number;
  }>;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  instructor: User;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: string;
  thumbnail: string;
  steps: Array<{
    title: string;
    description: string;
    duration: string;
  }>;
  tags: string[];
  rating: number;
  views: number;
  isBookmarked: boolean;
  completionRate: number;
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
  participants?: User[];
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    type: 'text' | 'image' | 'emoji' | 'pixel';
    timestamp: string;
    attachments?: Array<{
      type: 'image' | 'pixel';
      url: string;
      title?: string;
    }>;
  }>;
}

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'PixelMaster',
    username: 'pixelmaster_pt',
    avatar: 'https://placehold.co/80x80.png',
    dataAiHint: 'user avatar',
    level: 25,
    isVerified: true,
    isPremium: true,
    followers: 1234,
    following: 567,
    pixelsOwned: 89,
    achievements: 15,
    bio: 'Artista digital especializado em paisagens portuguesas. Criador de mais de 100 obras únicas no Pixel Universe.',
    joinDate: '2023-06-15',
    isFollowing: false,
    isOnline: true,
    publicAlbums: [
      { id: '1', name: 'Paisagens de Portugal', pixelCount: 25, coverImage: 'https://placehold.co/100x100.png' },
      { id: '2', name: 'Arte Urbana', pixelCount: 18, coverImage: 'https://placehold.co/100x100.png' }
    ],
    publicPixels: [
      { x: 245, y: 156, region: 'Lisboa', color: '#D4A757', title: 'Tejo Dourado', imageUrl: 'https://placehold.co/50x50.png' },
      { x: 300, y: 200, region: 'Porto', color: '#7DF9FF', title: 'Douro Azul', imageUrl: 'https://placehold.co/50x50.png' }
    ],
    topAchievements: [
      { id: '1', name: 'Mestre das Cores', icon: '🎨', rarity: 'Épico' },
      { id: '2', name: 'Colecionador', icon: '💎', rarity: 'Raro' }
    ],
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/pixelmaster', handle: '@pixelmaster' },
      { platform: 'Twitter', url: 'https://twitter.com/pixelmaster', handle: '@pixelmaster_pt' }
    ]
  },
  {
    id: '2',
    name: 'ColorQueen',
    username: 'colorqueen',
    avatar: 'https://placehold.co/80x80.png',
    dataAiHint: 'user avatar',
    level: 18,
    isVerified: false,
    isPremium: true,
    followers: 890,
    following: 234,
    pixelsOwned: 67,
    achievements: 12,
    bio: 'Especialista em teoria das cores e harmonia visual. Adoro criar paletas únicas!',
    joinDate: '2023-08-20',
    isFollowing: true,
    isOnline: false,
    lastSeen: '2h atrás',
    publicAlbums: [
      { id: '3', name: 'Paletas Harmoniosas', pixelCount: 30, coverImage: 'https://placehold.co/100x100.png' }
    ],
    publicPixels: [
      { x: 400, y: 300, region: 'Coimbra', color: '#FF6B6B', title: 'Vermelho Paixão' }
    ],
    topAchievements: [
      { id: '3', name: 'Rainha das Cores', icon: '👑', rarity: 'Lendário' }
    ],
    socialLinks: []
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Acabei de criar esta obra-prima em Lisboa! O que acham? 🎨✨',
    type: 'pixel',
    attachments: [
      {
        type: 'pixel',
        url: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Lisboa+Art',
        title: 'Tejo Dourado',
        coordinates: { x: 245, y: 156 },
        region: 'Lisboa'
      }
    ],
    timestamp: '2h atrás',
    likes: 89,
    comments: [
      {
        id: 'c1',
        author: mockUsers[1],
        content: 'Incrível! Adoro as cores que escolheste 😍',
        timestamp: '1h atrás',
        likes: 12,
        isLiked: false
      }
    ],
    shares: 23,
    isLiked: false,
    isSaved: false,
    tags: ['arte', 'lisboa', 'masterpiece'],
    location: 'Lisboa, Portugal',
    showComments: false
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Novo recorde pessoal! 50 pixels numa semana! 🚀 Qual foi o vosso melhor recorde?',
    type: 'text',
    timestamp: '4h atrás',
    likes: 156,
    comments: [
      {
        id: 'c2',
        author: mockUsers[0],
        content: 'Parabéns! O meu melhor foi 35 pixels em 5 dias 💪',
        timestamp: '3h atrás',
        likes: 8,
        isLiked: true,
        attachments: [
          {
            type: 'pixel',
            url: 'https://placehold.co/50x50.png',
            title: 'Meu Pixel Favorito',
            coordinates: { x: 100, y: 200 }
          }
        ]
      }
    ],
    shares: 45,
    isLiked: true,
    isSaved: true,
    tags: ['recorde', 'coleção', 'motivação'],
    showComments: false
  }
];

const mockStories: Story[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: {
      type: 'image',
      url: 'https://placehold.co/400x600/D4A757/FFFFFF?text=Story+1',
      duration: 5
    },
    timestamp: '1h atrás',
    views: 234,
    isViewed: false
  },
  {
    id: '2',
    author: mockUsers[1],
    content: {
      type: 'text',
      text: 'Trabalhando numa nova coleção! 🎨',
      duration: 3
    },
    timestamp: '3h atrás',
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
    avatar: 'https://placehold.co/80x80/D4A757/FFFFFF?text=LX',
    banner: 'https://placehold.co/400x200/D4A757/FFFFFF?text=Lisboa+Artists',
    members: 234,
    isJoined: true,
    isPrivate: false,
    recentActivity: 'Nova obra partilhada há 2h',
    rules: [
      'Respeitar todos os membros',
      'Apenas arte relacionada com Lisboa',
      'Não spam ou autopromoção excessiva',
      'Partilhar conhecimento e ajudar iniciantes'
    ],
    moderators: [mockUsers[0]],
    tags: ['lisboa', 'arte', 'comunidade', 'portugal'],
    createdDate: '2023-05-10',
    stats: {
      postsToday: 12,
      activeMembers: 89,
      totalPosts: 1456
    }
  },
  {
    id: '2',
    name: 'Colecionadores Premium',
    description: 'Investidores e colecionadores sérios de pixels raros',
    category: 'Investimento',
    avatar: 'https://placehold.co/80x80/7DF9FF/000000?text=💎',
    banner: 'https://placehold.co/400x200/7DF9FF/000000?text=Premium+Collectors',
    members: 89,
    isJoined: false,
    isPrivate: true,
    recentActivity: 'Discussão sobre tendências de mercado',
    rules: [
      'Apenas membros verificados',
      'Discussões sérias sobre investimento',
      'Partilhar análises de mercado',
      'Respeitar estratégias dos outros'
    ],
    moderators: [mockUsers[1]],
    tags: ['investimento', 'premium', 'coleção', 'mercado'],
    createdDate: '2023-07-22',
    stats: {
      postsToday: 5,
      activeMembers: 34,
      totalPosts: 567
    }
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Concurso de Arte Natalícia',
    description: 'Crie a melhor arte natalícia usando pixels portugueses e ganhe prémios incríveis!',
    category: 'Concurso',
    startDate: '2024-12-01',
    endDate: '2024-12-25',
    participants: 156,
    maxParticipants: 500,
    prize: '2000 créditos especiais + Pixel Lendário',
    requirements: ['Mínimo nível 5', 'Pelo menos 3 pixels', 'Tema natalício'],
    organizer: mockUsers[0],
    status: 'active',
    isParticipating: false,
    banner: 'https://placehold.co/600x300/D4A757/FFFFFF?text=Concurso+Natal',
    rules: [
      'Tema deve ser relacionado com o Natal',
      'Usar apenas pixels em território português',
      'Máximo 3 submissões por participante',
      'Obras originais apenas'
    ],
    prizes: [
      { position: '1º Lugar', reward: 'Pixel Lendário + 2000 créditos especiais', credits: 2000 },
      { position: '2º Lugar', reward: 'Pixel Épico + 1000 créditos especiais', credits: 1000 },
      { position: '3º Lugar', reward: 'Pixel Raro + 500 créditos especiais', credits: 500 }
    ]
  },
  {
    id: '2',
    title: 'Maratona de Ano Novo',
    description: 'Compre 10 pixels em 24 horas e ganhe recompensas exclusivas!',
    category: 'Desafio',
    startDate: '2024-12-31',
    endDate: '2025-01-01',
    participants: 89,
    prize: '500 créditos especiais + Badge exclusivo',
    requirements: ['Conta verificada', 'Mínimo 100 créditos'],
    organizer: mockUsers[1],
    status: 'upcoming',
    isParticipating: true,
    banner: 'https://placehold.co/600x300/7DF9FF/000000?text=Maratona+2025',
    rules: [
      'Comprar exatamente 10 pixels',
      'Período de 24 horas',
      'Pixels devem ser diferentes',
      'Sem transferências entre contas'
    ],
    prizes: [
      { position: 'Todos os participantes', reward: 'Badge Maratonista + 500 créditos', credits: 500 }
    ]
  }
];

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Primeiros Passos no Pixel Universe',
    description: 'Aprenda o básico: como navegar, comprar pixels e personalizar seu perfil.',
    instructor: mockUsers[0],
    duration: '15 min',
    difficulty: 'Iniciante',
    category: 'Básico',
    thumbnail: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Tutorial+Básico',
    steps: [
      { title: 'Criar Conta', description: 'Como registar-se e configurar perfil', duration: '3 min' },
      { title: 'Navegar no Mapa', description: 'Zoom, pan e explorar regiões', duration: '4 min' },
      { title: 'Comprar Primeiro Pixel', description: 'Processo completo de compra', duration: '5 min' },
      { title: 'Personalizar Pixel', description: 'Cores, títulos e descrições', duration: '3 min' }
    ],
    tags: ['iniciante', 'básico', 'tutorial'],
    rating: 4.8,
    views: 2341,
    isBookmarked: false,
    completionRate: 0
  },
  {
    id: '2',
    title: 'Técnicas Avançadas de Pixel Art',
    description: 'Domine técnicas profissionais: sombreamento, dithering e composição.',
    instructor: mockUsers[1],
    duration: '45 min',
    difficulty: 'Avançado',
    category: 'Arte',
    thumbnail: 'https://placehold.co/300x200/7DF9FF/000000?text=Pixel+Art+Pro',
    steps: [
      { title: 'Teoria das Cores', description: 'Paletas e harmonia cromática', duration: '10 min' },
      { title: 'Técnicas de Sombreamento', description: 'Luz, sombra e volume', duration: '12 min' },
      { title: 'Dithering Avançado', description: 'Texturas e gradientes', duration: '15 min' },
      { title: 'Composição Visual', description: 'Regras e princípios', duration: '8 min' }
    ],
    tags: ['avançado', 'arte', 'técnicas'],
    rating: 4.9,
    views: 1876,
    isBookmarked: true,
    completionRate: 65
  },
  {
    id: '3',
    title: 'Estratégias de Investimento em Pixels',
    description: 'Como identificar pixels valiosos e construir um portfólio lucrativo.',
    instructor: mockUsers[0],
    duration: '30 min',
    difficulty: 'Intermediário',
    category: 'Investimento',
    thumbnail: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Investimento',
    steps: [
      { title: 'Análise de Mercado', description: 'Como avaliar tendências', duration: '8 min' },
      { title: 'Identificar Oportunidades', description: 'Pixels subvalorizados', duration: '10 min' },
      { title: 'Gestão de Risco', description: 'Diversificação de portfólio', duration: '7 min' },
      { title: 'Timing de Compra/Venda', description: 'Quando comprar e vender', duration: '5 min' }
    ],
    tags: ['investimento', 'estratégia', 'mercado'],
    rating: 4.7,
    views: 1543,
    isBookmarked: false,
    completionRate: 0
  },
  {
    id: '4',
    title: 'Colaboração e Projetos em Equipe',
    description: 'Organize projetos colaborativos e gerencie equipes de artistas.',
    instructor: mockUsers[1],
    duration: '25 min',
    difficulty: 'Intermediário',
    category: 'Colaboração',
    thumbnail: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Colaboração',
    steps: [
      { title: 'Formar Equipes', description: 'Como encontrar e convidar colaboradores', duration: '6 min' },
      { title: 'Ferramentas de Colaboração', description: 'Editor em tempo real e chat', duration: '8 min' },
      { title: 'Gestão de Projetos', description: 'Organizar tarefas e prazos', duration: '7 min' },
      { title: 'Resolução de Conflitos', description: 'Mediar disputas criativas', duration: '4 min' }
    ],
    tags: ['colaboração', 'equipe', 'projetos'],
    rating: 4.6,
    views: 987,
    isBookmarked: false,
    completionRate: 0
  },
  {
    id: '5',
    title: 'Configurações Avançadas da Interface',
    description: 'Personalize completamente sua experiência no Pixel Universe.',
    instructor: mockUsers[0],
    duration: '20 min',
    difficulty: 'Iniciante',
    category: 'Interface',
    thumbnail: 'https://placehold.co/300x200/FF9800/FFFFFF?text=Interface',
    steps: [
      { title: 'Temas e Cores', description: 'Personalizar aparência', duration: '5 min' },
      { title: 'Atalhos de Teclado', description: 'Navegação rápida', duration: '4 min' },
      { title: 'Notificações', description: 'Configurar alertas', duration: '6 min' },
      { title: 'Performance', description: 'Otimizar para seu dispositivo', duration: '5 min' }
    ],
    tags: ['interface', 'configuração', 'personalização'],
    rating: 4.5,
    views: 1234,
    isBookmarked: false,
    completionRate: 0
  },
  {
    id: '6',
    title: 'Sistema de Conquistas e Recompensas',
    description: 'Maximize suas recompensas e desbloqueie todas as conquistas.',
    instructor: mockUsers[1],
    duration: '35 min',
    difficulty: 'Intermediário',
    category: 'Gamificação',
    thumbnail: 'https://placehold.co/300x200/E91E63/FFFFFF?text=Conquistas',
    steps: [
      { title: 'Tipos de Conquistas', description: 'Categorias e raridades', duration: '8 min' },
      { title: 'Estratégias de XP', description: 'Como ganhar XP rapidamente', duration: '10 min' },
      { title: 'Créditos Especiais', description: 'Como obter e usar', duration: '9 min' },
      { title: 'Rankings', description: 'Subir nas classificações', duration: '8 min' }
    ],
    tags: ['conquistas', 'xp', 'recompensas'],
    rating: 4.8,
    views: 1678,
    isBookmarked: true,
    completionRate: 0
  }
];

const mockChats: ChatConversation[] = [
  {
    id: '1',
    type: 'private',
    name: 'PixelMaster',
    avatar: 'https://placehold.co/40x40.png',
    lastMessage: 'Viste a minha nova criação?',
    timestamp: '5 min',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        sender: 'PixelMaster',
        content: 'Olá! Como estás?',
        type: 'text',
        timestamp: '10:30'
      },
      {
        id: 'm2',
        sender: 'PixelMaster',
        content: 'Viste a minha nova criação?',
        type: 'text',
        timestamp: '10:32'
      }
    ]
  },
  {
    id: '2',
    type: 'group',
    name: 'Artistas de Lisboa',
    avatar: 'https://placehold.co/40x40/D4A757/FFFFFF?text=LX',
    lastMessage: 'Alguém quer colaborar num projeto?',
    timestamp: '1h',
    unreadCount: 0,
    isOnline: true,
    participants: [mockUsers[0], mockUsers[1]],
    messages: [
      {
        id: 'm3',
        sender: 'ColorQueen',
        content: 'Alguém quer colaborar num projeto?',
        type: 'text',
        timestamp: '09:45'
      }
    ]
  }
];

export default function CommunityPage() {
  const { user } = useAuth();
  const { addCredits, addXp, addSpecialCredits } = useUserStore();
  const { toast } = useToast();
  
  // State
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);
  const [chats, setChats] = useState<ChatConversation[]>(mockChats);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  // UI State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'pixel' | 'image'>('text');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isViewingStories, setIsViewingStories] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(true);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedPixelForPost, setSelectedPixelForPost] = useState<any>(null);
  const [selectedPixelForComment, setSelectedPixelForComment] = useState<any>(null);
  const [showPixelSelector, setShowPixelSelector] = useState(false);
  const [showPixelSelectorForComment, setShowPixelSelectorForComment] = useState(false);
  
  // Sound and visual effects
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Refs
  const storyProgressRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Mock user pixels for selection
  const userPixels = [
    { x: 245, y: 156, region: 'Lisboa', color: '#D4A757', title: 'Tejo Dourado', imageUrl: 'https://placehold.co/50x50.png' },
    { x: 300, y: 200, region: 'Porto', color: '#7DF9FF', title: 'Douro Azul', imageUrl: 'https://placehold.co/50x50.png' },
    { x: 400, y: 300, region: 'Coimbra', color: '#FF6B6B', title: 'Vermelho Paixão', imageUrl: 'https://placehold.co/50x50.png' }
  ];

  // Story timer effect
  useEffect(() => {
    if (isViewingStories && isStoryPlaying) {
      const currentStory = stories[currentStoryIndex];
      const duration = currentStory?.content.duration || 5;
      
      storyProgressRef.current = setInterval(() => {
        setStoryProgress(prev => {
          const newProgress = prev + (100 / (duration * 10));
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
  }, [isViewingStories, isStoryPlaying, currentStoryIndex]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  // Functions
  const createPost = () => {
    if (!newPostContent.trim() && !selectedPixelForPost) {
      toast({
        title: "Conteúdo Obrigatório",
        description: "Escreva algo ou selecione um pixel para publicar.",
        variant: "destructive"
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'Você',
        username: 'voce',
        avatar: 'https://placehold.co/80x80.png',
        dataAiHint: 'user avatar',
        level: 15,
        isVerified: true,
        isPremium: true,
        followers: 234,
        following: 156,
        pixelsOwned: 42,
        achievements: 8,
        bio: 'Utilizador ativo do Pixel Universe',
        joinDate: '2024-01-15',
        isFollowing: false,
        isOnline: true,
        publicAlbums: [],
        publicPixels: [],
        topAchievements: [],
        socialLinks: []
      },
      content: newPostContent,
      type: newPostType,
      attachments: selectedPixelForPost ? [{
        type: 'pixel' as const,
        url: selectedPixelForPost.imageUrl,
        title: selectedPixelForPost.title,
        coordinates: { x: selectedPixelForPost.x, y: selectedPixelForPost.y },
        region: selectedPixelForPost.region
      }] : undefined,
      timestamp: 'agora',
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isSaved: false,
      tags: [],
      showComments: false
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setSelectedPixelForPost(null);
    
    // Rewards
    addXp(25);
    addCredits(10);
    setPlaySuccessSound(true);
    
    toast({
      title: "Publicação Criada! 🎉",
      description: "Recebeu 25 XP e 10 créditos pela publicação.",
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
          setPlayNotificationSound(true);
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
        } else {
          toast({
            title: "Post Removido",
            description: "Removido dos seus favoritos.",
          });
        }
        
        return { ...post, isSaved: newIsSaved };
      }
      return post;
    }));
  };

  const sharePost = async (post: Post) => {
    const shareData = {
      title: `Post de ${post.author.name} - Pixel Universe`,
      text: post.content,
      url: `${window.location.origin}/community/post/${post.id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        
        // Update share count
        setPosts(prev => prev.map(p => 
          p.id === post.id ? { ...p, shares: p.shares + 1 } : p
        ));
        
        addXp(8);
        addCredits(3);
        setPlaySuccessSound(true);
        
        toast({
          title: "Post Partilhado! 📤",
          description: "Recebeu 8 XP e 3 créditos por partilhar.",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        toast({
          title: "Link Copiado! 📋",
          description: "Link do post copiado para a área de transferência.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao Partilhar",
        description: "Não foi possível partilhar o post.",
        variant: "destructive"
      });
    }
  };

  const toggleComments = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  const addComment = (postId: string) => {
    if (!newCommentContent.trim() && !selectedPixelForComment) {
      toast({
        title: "Comentário Vazio",
        description: "Escreva algo ou selecione um pixel para comentar.",
        variant: "destructive"
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'Você',
        username: 'voce',
        avatar: 'https://placehold.co/80x80.png',
        dataAiHint: 'user avatar',
        level: 15,
        isVerified: true,
        isPremium: true,
        followers: 234,
        following: 156,
        pixelsOwned: 42,
        achievements: 8,
        bio: 'Utilizador ativo',
        joinDate: '2024-01-15',
        isFollowing: false,
        isOnline: true,
        publicAlbums: [],
        publicPixels: [],
        topAchievements: [],
        socialLinks: []
      },
      content: newCommentContent,
      timestamp: 'agora',
      likes: 0,
      isLiked: false,
      attachments: selectedPixelForComment ? [{
        type: 'pixel' as const,
        url: selectedPixelForComment.imageUrl,
        title: selectedPixelForComment.title,
        coordinates: { x: selectedPixelForComment.x, y: selectedPixelForComment.y }
      }] : undefined
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
    setSelectedPixelForComment(null);
    setCommentingOnPost(null);
    
    // Rewards
    addXp(8);
    addCredits(3);
    setPlayNotificationSound(true);
    
    toast({
      title: "Comentário Adicionado! 💬",
      description: "Recebeu 8 XP e 3 créditos pelo comentário.",
    });
  };

  const followUser = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newIsFollowing = !user.isFollowing;
        const newFollowers = newIsFollowing ? user.followers + 1 : user.followers - 1;
        
        if (newIsFollowing) {
          addXp(10);
          addCredits(5);
          setPlaySuccessSound(true);
          
          toast({
            title: "A Seguir Utilizador! 👥",
            description: `Agora segue ${user.name}. Recebeu 10 XP e 5 créditos.`,
          });
        } else {
          toast({
            title: "Deixou de Seguir",
            description: `Deixou de seguir ${user.name}.`,
          });
        }
        
        return { ...user, isFollowing: newIsFollowing, followers: newFollowers };
      }
      return user;
    }));
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
            title: "Juntou-se ao Grupo! 🎉",
            description: `Bem-vindo ao ${group.name}! Recebeu 15 XP e 8 créditos.`,
          });
        } else {
          toast({
            title: "Saiu do Grupo",
            description: `Saiu do ${group.name}.`,
          });
        }
        
        return { ...group, isJoined: newIsJoined, members: newMembers };
      }
      return group;
    }));
  };

  const participateInEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const newIsParticipating = !event.isParticipating;
        const newParticipants = newIsParticipating ? event.participants + 1 : event.participants - 1;
        
        if (newIsParticipating) {
          addXp(20);
          addCredits(15);
          setPlaySuccessSound(true);
          setShowConfetti(true);
          
          toast({
            title: "Inscrito no Evento! 🎊",
            description: `Inscrito em ${event.title}! Recebeu 20 XP e 15 créditos.`,
          });
        } else {
          toast({
            title: "Saiu do Evento",
            description: `Saiu de ${event.title}.`,
          });
        }
        
        return { ...event, isParticipating: newIsParticipating, participants: newParticipants };
      }
      return event;
    }));
  };

  const startTutorial = (tutorialId: string) => {
    setTutorials(prev => prev.map(tutorial => {
      if (tutorial.id === tutorialId) {
        addXp(5);
        addCredits(2);
        setPlayNotificationSound(true);
        
        toast({
          title: "Tutorial Iniciado! 📚",
          description: `Começou "${tutorial.title}". Recebeu 5 XP e 2 créditos.`,
        });
        
        return { ...tutorial, completionRate: 10 };
      }
      return tutorial;
    }));
  };

  const bookmarkTutorial = (tutorialId: string) => {
    setTutorials(prev => prev.map(tutorial => {
      if (tutorial.id === tutorialId) {
        const newIsBookmarked = !tutorial.isBookmarked;
        
        if (newIsBookmarked) {
          toast({
            title: "Tutorial Guardado! 🔖",
            description: "Adicionado aos seus favoritos.",
          });
        } else {
          toast({
            title: "Tutorial Removido",
            description: "Removido dos seus favoritos.",
          });
        }
        
        return { ...tutorial, isBookmarked: newIsBookmarked };
      }
      return tutorial;
    }));
  };

  const shareTutorial = async (tutorial: Tutorial) => {
    const shareData = {
      title: `Tutorial: ${tutorial.title} - Pixel Universe`,
      text: tutorial.description,
      url: `${window.location.origin}/tutorials/${tutorial.id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Tutorial Partilhado! 📤",
          description: "Tutorial partilhado com sucesso.",
        });
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n\n${shareData.url}`);
        toast({
          title: "Link Copiado! 📋",
          description: "Link do tutorial copiado para a área de transferência.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao Partilhar",
        description: "Não foi possível partilhar o tutorial.",
        variant: "destructive"
      });
    }
  };

  const sendChatMessage = () => {
    if (!newChatMessage.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      content: newChatMessage,
      type: 'text' as const,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newChatMessage,
          timestamp: 'agora'
        };
      }
      return chat;
    }));

    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    setNewChatMessage('');
    setPlayNotificationSound(true);
  };

  const openUserProfile = (user: User) => {
    setSelectedUser(user);
  };

  const openPrivateChat = (user: User) => {
    const existingChat = chats.find(chat => 
      chat.type === 'private' && chat.name === user.name
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat: ChatConversation = {
        id: Date.now().toString(),
        type: 'private',
        name: user.name,
        avatar: user.avatar,
        lastMessage: '',
        timestamp: 'agora',
        unreadCount: 0,
        isOnline: user.isOnline,
        messages: []
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChat(newChat);
    }
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

  const toggleStoryPlayPause = () => {
    setIsStoryPlaying(!isStoryPlaying);
  };

  const openStories = (startIndex: number = 0) => {
    setCurrentStoryIndex(startIndex);
    setIsViewingStories(true);
    setStoryProgress(0);
    setIsStoryPlaying(true);
  };

  const selectPixelForPost = (pixel: any) => {
    setSelectedPixelForPost(pixel);
    setShowPixelSelector(false);
    toast({
      title: "Pixel Selecionado! 🎯",
      description: `${pixel.title} será anexado à publicação.`,
    });
  };

  const selectPixelForComment = (pixel: any) => {
    setSelectedPixelForComment(pixel);
    setShowPixelSelectorForComment(false);
    toast({
      title: "Pixel Selecionado! 🎯",
      description: `${pixel.title} será anexado ao comentário.`,
    });
  };

  const addEmoji = (emoji: string) => {
    if (selectedChat) {
      setNewChatMessage(prev => prev + emoji);
    } else if (commentingOnPost) {
      setNewCommentContent(prev => prev + emoji);
    } else {
      setNewPostContent(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '🥰', '😍', '🤩', '😎', '🥳', '😊', '👍', '❤️', '🔥', '✨', '🎉', '🎨', '💎', '🏆', '⭐', '🚀', '💯', '👏'];

  // Render functions
  const renderStoryViewer = () => {
    if (!isViewingStories || stories.length === 0) return null;
    
    const currentStory = stories[currentStoryIndex];
    
    return (
      <Dialog open={isViewingStories} onOpenChange={setIsViewingStories}>
        <DialogContent className="max-w-md h-[90vh] p-0 bg-black border-none">
          <div className="relative h-full overflow-hidden">
            {/* Progress bars - Fixed positioning */}
            <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
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

            {/* Header - Fixed positioning */}
            <div className="absolute top-8 left-4 right-4 z-40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={currentStory.author.avatar} data-ai-hint={currentStory.author.dataAiHint} />
                  <AvatarFallback>{currentStory.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{currentStory.author.name}</span>
                    {currentStory.author.isVerified && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <span className="text-white/80 text-sm">{currentStory.timestamp}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsViewingStories(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Story Content */}
            <div className="h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStoryIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {currentStory.content.type === 'image' && (
                    <img 
                      src={currentStory.content.url} 
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {currentStory.content.type === 'text' && (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-8">
                      <div className="text-center">
                        <p className="text-white text-xl font-medium leading-relaxed">
                          {currentStory.content.text}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {currentStory.content.type === 'video' && (
                    <video
                      src={currentStory.content.url}
                      className="w-full h-full object-cover"
                      autoPlay={isStoryPlaying}
                      muted
                      loop
                    />
                  )}
                </motion.div>
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
                onClick={toggleStoryPlayPause}
              />
              <div 
                className="flex-1 cursor-pointer"
                onClick={nextStory}
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleStoryPlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isStoryPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

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
        </DialogContent>
      </Dialog>
    );
  };

  const renderUserProfile = () => {
    if (!selectedUser) return null;

    return (
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="w-full max-w-md p-0" side="right">
          <SheetHeader className="p-6 border-b bg-gradient-to-br from-primary/10 to-accent/5">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-primary">
                <AvatarImage src={selectedUser.avatar} data-ai-hint={selectedUser.dataAiHint} />
                <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-xl">{selectedUser.name}</SheetTitle>
                  {selectedUser.isVerified && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                  {selectedUser.isPremium && <Crown className="h-5 w-5 text-amber-500" />}
                </div>
                <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                <Badge variant="secondary" className="mt-1">Nível {selectedUser.level}</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className={`w-2 h-2 rounded-full ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="text-xs text-muted-foreground">
                {selectedUser.isOnline ? 'Online' : selectedUser.lastSeen || 'Offline'}
              </span>
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Bio */}
              <div>
                <p className="text-sm text-muted-foreground italic">"{selectedUser.bio}"</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Membro desde {new Date(selectedUser.joinDate).toLocaleDateString('pt-PT')}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedUser.followers}</div>
                  <div className="text-xs text-muted-foreground">Seguidores</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{selectedUser.pixelsOwned}</div>
                  <div className="text-xs text-muted-foreground">Pixels</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{selectedUser.achievements}</div>
                  <div className="text-xs text-muted-foreground">Conquistas</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{selectedUser.following}</div>
                  <div className="text-xs text-muted-foreground">A Seguir</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => followUser(selectedUser.id)}
                  className="flex-1"
                  variant={selectedUser.isFollowing ? 'outline' : 'default'}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {selectedUser.isFollowing ? 'A Seguir' : 'Seguir'}
                </Button>
                <Button 
                  onClick={() => openPrivateChat(selectedUser)}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensagem
                </Button>
              </div>

              {/* Public Albums */}
              {selectedUser.publicAlbums.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Álbuns Públicos
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.publicAlbums.map(album => (
                      <Card key={album.id} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <img 
                            src={album.coverImage} 
                            alt={album.name}
                            className="w-12 h-12 rounded border"
                          />
                          <div>
                            <h4 className="font-medium">{album.name}</h4>
                            <p className="text-sm text-muted-foreground">{album.pixelCount} pixels</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Public Pixels */}
              {selectedUser.publicPixels.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Pixels em Destaque
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUser.publicPixels.map((pixel, index) => (
                      <Card key={index} className="p-2 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="text-center">
                          {pixel.imageUrl && (
                            <img 
                              src={pixel.imageUrl} 
                              alt={pixel.title}
                              className="w-full h-16 object-cover rounded mb-2"
                            />
                          )}
                          <h4 className="font-medium text-sm">{pixel.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            ({pixel.x}, {pixel.y}) • {pixel.region}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Achievements */}
              {selectedUser.topAchievements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Conquistas em Destaque
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.topAchievements.map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <Badge variant="outline" className="text-xs">{achievement.rarity}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {selectedUser.socialLinks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Redes Sociais
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.socialLinks.map((link, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {link.platform}: {link.handle}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  const renderChatModal = () => {
    if (!selectedChat) return null;

    return (
      <Dialog open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
        <DialogContent className="max-w-md h-[80vh] p-0">
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>{selectedChat.name}</DialogTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${selectedChat.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                  {selectedChat.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
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
                    {message.sender !== 'Você' && (
                      <p className="text-xs font-medium mb-1">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    {message.attachments && message.attachments.map((attachment, index) => (
                      <div key={index} className="mt-2">
                        {attachment.type === 'pixel' && (
                          <div className="bg-background/20 p-2 rounded">
                            <img src={attachment.url} alt={attachment.title} className="w-12 h-12 rounded" />
                            <p className="text-xs mt-1">{attachment.title}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-3 p-3 bg-muted/20 rounded-lg">
                <div className="grid grid-cols-10 gap-1">
                  {emojis.map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-lg"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              
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
        </DialogContent>
      </Dialog>
    );
  };

  const renderGroupModal = () => {
    if (!selectedGroup) return null;

    return (
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-2xl h-[80vh] p-0">
          <DialogHeader className="p-0">
            {selectedGroup.banner && (
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={selectedGroup.banner} 
                  alt={selectedGroup.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <img 
                    src={selectedGroup.avatar} 
                    alt={selectedGroup.name}
                    className="w-16 h-16 rounded-full border-4 border-white"
                  />
                  <div>
                    <DialogTitle className="text-white text-xl">{selectedGroup.name}</DialogTitle>
                    <p className="text-white/80 text-sm">{selectedGroup.members} membros</p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-muted-foreground">{selectedGroup.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedGroup.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold text-primary">{selectedGroup.stats.postsToday}</div>
                  <div className="text-xs text-muted-foreground">Posts Hoje</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold text-green-500">{selectedGroup.stats.activeMembers}</div>
                  <div className="text-xs text-muted-foreground">Ativos</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold text-purple-500">{selectedGroup.stats.totalPosts}</div>
                  <div className="text-xs text-muted-foreground">Total Posts</div>
                </div>
              </div>

              {/* Moderators */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Moderadores
                </h3>
                <div className="space-y-2">
                  {selectedGroup.moderators.map(mod => (
                    <div key={mod.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mod.avatar} data-ai-hint={mod.dataAiHint} />
                        <AvatarFallback>{mod.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{mod.name}</p>
                        <p className="text-xs text-muted-foreground">Moderador</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Regras do Grupo
                </h3>
                <div className="space-y-2">
                  {selectedGroup.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">{index + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Atividade Recente
                </h3>
                <p className="text-sm text-muted-foreground">{selectedGroup.recentActivity}</p>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t">
            <div className="flex gap-2">
              <Button 
                onClick={() => joinGroup(selectedGroup.id)}
                className="flex-1"
                variant={selectedGroup.isJoined ? 'outline' : 'default'}
              >
                <Users className="h-4 w-4 mr-2" />
                {selectedGroup.isJoined ? 'Sair do Grupo' : 'Juntar-se'}
              </Button>
              
              <Link href={`/groups/${selectedGroup.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Página
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderEventModal = () => {
    if (!selectedEvent) return null;

    return (
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl h-[80vh] p-0">
          <DialogHeader className="p-0">
            <div className="relative h-40 overflow-hidden">
              <img 
                src={selectedEvent.banner} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-4 left-4 right-4">
                <DialogTitle className="text-white text-2xl mb-2">{selectedEvent.title}</DialogTitle>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedEvent.startDate} - {selectedEvent.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedEvent.participants} participantes
                  </span>
                  <Badge className={
                    selectedEvent.status === 'active' ? 'bg-green-500' :
                    selectedEvent.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                  }>
                    {selectedEvent.status === 'active' ? 'Ativo' :
                     selectedEvent.status === 'upcoming' ? 'Em Breve' : 'Terminado'}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Organizer */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Organizador
                </h3>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Avatar>
                    <AvatarImage src={selectedEvent.organizer.avatar} data-ai-hint={selectedEvent.organizer.dataAiHint} />
                    <AvatarFallback>{selectedEvent.organizer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedEvent.organizer.name}</p>
                    <p className="text-sm text-muted-foreground">Nível {selectedEvent.organizer.level}</p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Requisitos
                </h3>
                <div className="space-y-2">
                  {selectedEvent.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Regras
                </h3>
                <div className="space-y-2">
                  {selectedEvent.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">{index + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prizes */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Prémios
                </h3>
                <div className="space-y-3">
                  {selectedEvent.prizes.map((prize, index) => (
                    <Card key={index} className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{prize.position}</h4>
                          <p className="text-sm text-muted-foreground">{prize.reward}</p>
                        </div>
                        <Badge className="bg-yellow-500">
                          <Coins className="h-3 w-3 mr-1" />
                          {prize.credits}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t">
            <div className="flex gap-2">
              <Button 
                onClick={() => participateInEvent(selectedEvent.id)}
                className="flex-1"
                variant={selectedEvent.isParticipating ? 'outline' : 'default'}
                disabled={selectedEvent.status === 'ended'}
              >
                <Trophy className="h-4 w-4 mr-2" />
                {selectedEvent.isParticipating ? 'A Participar' : 'Participar'}
              </Button>
              
              <Link href={`/events/${selectedEvent.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Página
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderTutorialModal = () => {
    if (!selectedTutorial) return null;

    return (
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-6 border-b bg-gradient-to-r from-blue-500/10 to-green-500/10">
            <div className="flex items-center gap-4">
              <img 
                src={selectedTutorial.thumbnail} 
                alt={selectedTutorial.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <DialogTitle className="text-xl mb-2">{selectedTutorial.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedTutorial.duration}
                  </span>
                  <Badge className={
                    selectedTutorial.difficulty === 'Iniciante' ? 'bg-green-500' :
                    selectedTutorial.difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {selectedTutorial.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    {selectedTutorial.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedTutorial.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Video Player Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 bg-black flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Player de Tutorial</p>
                  <p className="text-white/60">Simulação de vídeo tutorial</p>
                </div>
              </div>
              
              {/* Tutorial Info */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={selectedTutorial.instructor.avatar} data-ai-hint={selectedTutorial.instructor.dataAiHint} />
                    <AvatarFallback>{selectedTutorial.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedTutorial.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">Instrutor</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{selectedTutorial.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedTutorial.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Steps Sidebar */}
            <div className="w-80 border-l">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Passos do Tutorial</h3>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedTutorial.steps.map((step, index) => (
                    <Card key={index} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          <p className="text-xs text-primary mt-1">{step.duration}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <div className="p-6 border-t">
            <div className="flex gap-2">
              <Button 
                onClick={() => startTutorial(selectedTutorial.id)}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                {selectedTutorial.completionRate > 0 ? 'Continuar' : 'Começar'}
              </Button>
              
              <Button 
                onClick={() => bookmarkTutorial(selectedTutorial.id)}
                variant="outline"
              >
                <Bookmark className={`h-4 w-4 ${selectedTutorial.isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button 
                onClick={() => shareTutorial(selectedTutorial)}
                variant="outline"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderPixelSelector = (isForComment: boolean = false) => {
    const isOpen = isForComment ? showPixelSelectorForComment : showPixelSelector;
    const setIsOpen = isForComment ? setShowPixelSelectorForComment : setShowPixelSelector;
    const selectPixel = isForComment ? selectPixelForComment : selectPixelForPost;

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Selecionar Pixel</DialogTitle>
            <DialogDescription>
              Escolha um dos seus pixels para anexar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {userPixels.map((pixel, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => selectPixel(pixel)}
              >
                <CardContent className="p-4 text-center">
                  <img 
                    src={pixel.imageUrl} 
                    alt={pixel.title}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm">{pixel.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    ({pixel.x}, {pixel.y}) • {pixel.region}
                  </p>
                  <div 
                    className="w-4 h-4 rounded mx-auto mt-2"
                    style={{ backgroundColor: pixel.color }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline text-gradient-gold flex items-center justify-center">
              <Users className="h-8 w-8 mr-3" />
              Comunidade Pixel Universe
            </CardTitle>
            <CardDescription>
              Conecte-se com outros artistas, partilhe criações e participe em eventos exclusivos
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-bold text-2xl">1.2K+</p>
                <p className="text-sm text-muted-foreground">Artistas Ativos</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <MessageSquare className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="font-bold text-2xl">5.6K+</p>
                <p className="text-sm text-muted-foreground">Posts Diários</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <AuthModal defaultTab="register">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta e Juntar-se
                </Button>
              </AuthModal>
              
              <AuthModal defaultTab="login">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Já Tenho Conta
                </Button>
              </AuthModal>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
        <SoundEffect src={SOUND_EFFECTS.NOTIFICATION} play={playNotificationSound} onEnd={() => setPlayNotificationSound(false)} />
        <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
        
        <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl">
          {/* Header */}
          <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
                 style={{ backgroundSize: '200% 200%' }} />
            <CardHeader className="relative">
              <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                <Users className="h-8 w-8 mr-3 animate-glow" />
                Comunidade
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Conecte-se, partilhe e colabore com artistas de todo o mundo
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">1.2K</div>
              <div className="text-sm text-muted-foreground">Membros Online</div>
            </Card>
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">5.6K</div>
              <div className="text-sm text-muted-foreground">Posts Hoje</div>
            </Card>
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm text-muted-foreground">Eventos Ativos</div>
            </Card>
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-muted-foreground">Trending</div>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-12 bg-card/50 backdrop-blur-sm shadow-md">
              <TabsTrigger value="feed" className="font-headline">
                <MessageSquare className="h-4 w-4 mr-2"/>
                Feed
              </TabsTrigger>
              <TabsTrigger value="stories" className="font-headline">
                <Camera className="h-4 w-4 mr-2"/>
                Stories
              </TabsTrigger>
              <TabsTrigger value="groups" className="font-headline">
                <Users className="h-4 w-4 mr-2"/>
                Grupos
              </TabsTrigger>
              <TabsTrigger value="events" className="font-headline">
                <Calendar className="h-4 w-4 mr-2"/>
                Eventos
              </TabsTrigger>
              <TabsTrigger value="learn" className="font-headline">
                <BookOpen className="h-4 w-4 mr-2"/>
                Aprender
              </TabsTrigger>
              <TabsTrigger value="chat" className="font-headline">
                <MessageSquare className="h-4 w-4 mr-2"/>
                Chat
                {chats.reduce((total, chat) => total + chat.unreadCount, 0) > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-xs h-4 w-4 p-0 flex items-center justify-center">
                    {chats.reduce((total, chat) => total + chat.unreadCount, 0)}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Feed Tab */}
            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Create Post */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Criar Publicação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant={newPostType === 'text' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPostType('text')}
                        >
                          <Type className="h-4 w-4 mr-2" />
                          Texto
                        </Button>
                        <Button
                          variant={newPostType === 'pixel' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPostType('pixel')}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Pixel
                        </Button>
                        <Button
                          variant={newPostType === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPostType('image')}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Imagem
                        </Button>
                      </div>
                      
                      <Textarea
                        placeholder="O que está a acontecer no seu universo de pixels?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={3}
                        maxLength={500}
                      />
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{newPostContent.length}/500 caracteres</span>
                      </div>
                      
                      {selectedPixelForPost && (
                        <Card className="p-3 bg-primary/10">
                          <div className="flex items-center gap-3">
                            <img 
                              src={selectedPixelForPost.imageUrl} 
                              alt={selectedPixelForPost.title}
                              className="w-12 h-12 rounded"
                            />
                            <div>
                              <h4 className="font-medium text-sm">{selectedPixelForPost.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                ({selectedPixelForPost.x}, {selectedPixelForPost.y}) • {selectedPixelForPost.region}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedPixelForPost(null)}
                              className="ml-auto"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      )}
                      
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPixelSelector(true)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Anexar Pixel
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <Smile className="h-4 w-4 mr-2" />
                            Emoji
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={createPost}
                          disabled={!newPostContent.trim() && !selectedPixelForPost}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                      
                      {/* Emoji Picker */}
                      {showEmojiPicker && (
                        <Card className="p-3 bg-muted/20">
                          <div className="grid grid-cols-10 gap-1">
                            {emojis.map(emoji => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-lg"
                                onClick={() => addEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </Card>
                      )}
                    </CardContent>
                  </Card>

                  {/* Posts */}
                  <div className="space-y-6">
                    {posts.map(post => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar 
                              className="cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => openUserProfile(post.author)}
                            >
                              <AvatarImage src={post.author.avatar} data-ai-hint={post.author.dataAiHint} />
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
                                {post.author.isVerified && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                {post.author.isPremium && <Crown className="h-4 w-4 text-amber-500" />}
                                <Badge variant="secondary" className="text-xs">Nível {post.author.level}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-foreground leading-relaxed">{post.content}</p>
                            
                            {/* Attachments */}
                            {post.attachments && post.attachments.length > 0 && (
                              <div className="mt-4 space-y-3">
                                {post.attachments.map((attachment, index) => (
                                  <div key={index}>
                                    {attachment.type === 'pixel' && (
                                      <Card className="p-4 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                          <img 
                                            src={attachment.url} 
                                            alt={attachment.title}
                                            className="w-20 h-20 rounded border object-cover"
                                          />
                                          <div>
                                            <h4 className="font-semibold">{attachment.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                              Pixel ({attachment.coordinates?.x}, {attachment.coordinates?.y})
                                            </p>
                                            <p className="text-sm text-muted-foreground">{attachment.region}</p>
                                            <Button variant="outline" size="sm" className="mt-2">
                                              <Eye className="h-4 w-4 mr-2" />
                                              Ver no Mapa
                                            </Button>
                                          </div>
                                        </div>
                                      </Card>
                                    )}
                                    
                                    {attachment.type === 'image' && (
                                      <img 
                                        src={attachment.url} 
                                        alt="Post attachment"
                                        className="w-full max-h-96 object-cover rounded-lg"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Tags */}
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {post.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLike(post.id)}
                                className={cn(
                                  "transition-colors",
                                  post.isLiked && "text-red-500 hover:text-red-600"
                                )}
                              >
                                <Heart className={cn("h-4 w-4 mr-2", post.isLiked && "fill-current")} />
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
                                onClick={() => sharePost(post)}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                {post.shares}
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSave(post.id)}
                              className={cn(
                                "transition-colors",
                                post.isSaved && "text-yellow-500"
                              )}
                            >
                              <Bookmark className={cn("h-4 w-4", post.isSaved && "fill-current")} />
                            </Button>
                          </div>

                          {/* Comments Section */}
                          <AnimatePresence>
                            {post.showComments && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t"
                              >
                                {/* Existing Comments */}
                                <div className="space-y-3 mb-4">
                                  {post.comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                      <Avatar 
                                        className="h-8 w-8 cursor-pointer"
                                        onClick={() => openUserProfile(comment.author)}
                                      >
                                        <AvatarImage src={comment.author.avatar} data-ai-hint={comment.author.dataAiHint} />
                                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="bg-muted/30 p-3 rounded-lg">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span 
                                              className="font-medium text-sm cursor-pointer hover:text-primary"
                                              onClick={() => openUserProfile(comment.author)}
                                            >
                                              {comment.author.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                          </div>
                                          <p className="text-sm">{comment.content}</p>
                                          
                                          {/* Comment Attachments */}
                                          {comment.attachments && comment.attachments.map((attachment, index) => (
                                            <div key={index} className="mt-2">
                                              {attachment.type === 'pixel' && (
                                                <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                                                  <img 
                                                    src={attachment.url} 
                                                    alt={attachment.title}
                                                    className="w-8 h-8 rounded"
                                                  />
                                                  <div>
                                                    <p className="text-xs font-medium">{attachment.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                      ({attachment.coordinates?.x}, {attachment.coordinates?.y})
                                                    </p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mt-2">
                                          <Button variant="ghost" size="sm" className="text-xs">
                                            <Heart className="h-3 w-3 mr-1" />
                                            {comment.likes}
                                          </Button>
                                          <Button variant="ghost" size="sm" className="text-xs">
                                            Responder
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Add Comment */}
                                <div className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://placehold.co/40x40.png" />
                                    <AvatarFallback>V</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 space-y-2">
                                    <Input
                                      placeholder="Escrever comentário..."
                                      value={commentingOnPost === post.id ? newCommentContent : ''}
                                      onChange={(e) => {
                                        setNewCommentContent(e.target.value);
                                        setCommentingOnPost(post.id);
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          addComment(post.id);
                                        }
                                      }}
                                    />
                                    
                                    {selectedPixelForComment && commentingOnPost === post.id && (
                                      <Card className="p-2 bg-accent/10">
                                        <div className="flex items-center gap-2">
                                          <img 
                                            src={selectedPixelForComment.imageUrl} 
                                            alt={selectedPixelForComment.title}
                                            className="w-8 h-8 rounded"
                                          />
                                          <span className="text-sm">{selectedPixelForComment.title}</span>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedPixelForComment(null)}
                                            className="ml-auto h-6 w-6"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </Card>
                                    )}
                                    
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setCommentingOnPost(post.id);
                                          setShowPixelSelectorForComment(true);
                                        }}
                                      >
                                        <MapPin className="h-4 w-4 mr-1" />
                                        Pixel
                                      </Button>
                                      
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setCommentingOnPost(post.id);
                                          setShowEmojiPicker(true);
                                        }}
                                      >
                                        <Smile className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button
                                        size="sm"
                                        onClick={() => addComment(post.id)}
                                        disabled={!newCommentContent.trim() && !selectedPixelForComment}
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Trending Topics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                        Trending
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { tag: '#LisboaArt', posts: '234 posts', trend: '+15%' },
                        { tag: '#PixelInvestment', posts: '156 posts', trend: '+8%' },
                        { tag: '#PortugalPixels', posts: '89 posts', trend: '+23%' },
                        { tag: '#CollaborativeArt', posts: '67 posts', trend: '+45%' }
                      ].map((trend, index) => (
                        <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/20 rounded cursor-pointer">
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

                  {/* Suggested Users */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                        Sugestões para Seguir
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {users.filter(u => !u.isFollowing && u.id !== 'current-user').slice(0, 3).map(user => (
                        <div key={user.id} className="flex items-center gap-3">
                          <Avatar 
                            className="cursor-pointer"
                            onClick={() => openUserProfile(user)}
                          >
                            <AvatarImage src={user.avatar} data-ai-hint={user.dataAiHint} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p 
                              className="font-medium text-sm cursor-pointer hover:text-primary"
                              onClick={() => openUserProfile(user)}
                            >
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.followers} seguidores</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => followUser(user.id)}
                          >
                            Seguir
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Stories Tab */}
            <TabsContent value="stories" className="space-y-6">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {stories.map((story, index) => (
                  <div 
                    key={story.id} 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => openStories(index)}
                  >
                    <div className={cn(
                      "relative w-20 h-20 rounded-full p-1",
                      story.isViewed ? "bg-muted" : "bg-gradient-to-tr from-primary to-accent"
                    )}>
                      <Avatar className="w-full h-full">
                        <AvatarImage src={story.author.avatar} data-ai-hint={story.author.dataAiHint} />
                        <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xs text-center mt-2 truncate w-20">{story.author.name}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={group.avatar} 
                          alt={group.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 
                            className="font-semibold text-lg cursor-pointer hover:text-primary"
                            onClick={() => setSelectedGroup(group)}
                          >
                            {group.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">{group.category}</Badge>
                          {group.isPrivate && (
                            <Badge variant="outline" className="text-xs ml-2">Privado</Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                      
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span>{group.members} membros</span>
                        <span className="text-muted-foreground">{group.recentActivity}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => joinGroup(group.id)}
                          variant={group.isJoined ? 'outline' : 'default'}
                          className="flex-1"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          {group.isJoined ? 'Sair' : 'Juntar-se'}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedGroup(group)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={event.banner} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute top-4 right-4">
                        <Badge className={
                          event.status === 'active' ? 'bg-green-500' :
                          event.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                        }>
                          {event.status === 'active' ? 'Ativo' :
                           event.status === 'upcoming' ? 'Em Breve' : 'Terminado'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 
                          className="text-white font-bold text-xl mb-2 cursor-pointer hover:text-primary"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.startDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.participants}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{event.category}</Badge>
                        <span className="text-sm font-medium text-primary">{event.prize}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => participateInEvent(event.id)}
                          className="flex-1"
                          variant={event.isParticipating ? 'outline' : 'default'}
                          disabled={event.status === 'ended'}
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          {event.isParticipating ? 'A Participar' : 'Participar'}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Learn Tab */}
            <TabsContent value="learn" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map(tutorial => (
                  <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className={
                          tutorial.difficulty === 'Iniciante' ? 'bg-green-500' :
                          tutorial.difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 hover:bg-background"
                          onClick={() => bookmarkTutorial(tutorial.id)}
                        >
                          <Bookmark className={cn("h-4 w-4", tutorial.isBookmarked && "fill-current text-yellow-500")} />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {tutorial.duration}
                      </div>
                      
                      {tutorial.completionRate > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${tutorial.completionRate}%` }}
                          />
                        </div>
                      )}
                      
                      <div 
                        className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => setSelectedTutorial(tutorial)}
                      >
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={tutorial.instructor.avatar} data-ai-hint={tutorial.instructor.dataAiHint} />
                          <AvatarFallback>{tutorial.instructor.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{tutorial.instructor.name}</span>
                        {tutorial.instructor.isVerified && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <h3 
                        className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                        onClick={() => setSelectedTutorial(tutorial)}
                      >
                        {tutorial.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {tutorial.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {tutorial.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            {tutorial.rating}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tutorial.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {tutorial.steps.length} passos
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => startTutorial(tutorial.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {tutorial.completionRate > 0 ? 'Continuar' : 'Começar'}
                          </Button>
                          
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTutorial(tutorial)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Conversas
                      </span>
                      <Badge variant="outline">
                        {chats.reduce((total, chat) => total + chat.unreadCount, 0)} não lidas
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chats.map(chat => (
                        <div 
                          key={chat.id} 
                          className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => setSelectedChat(chat)}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={chat.avatar} />
                              <AvatarFallback>{chat.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                              chat.isOnline ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{chat.name}</p>
                              <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          </div>
                          
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Utilizadores Online
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {users.filter(u => u.isOnline).map(user => (
                        <div key={user.id} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar 
                              className="cursor-pointer"
                              onClick={() => openUserProfile(user)}
                            >
                              <AvatarImage src={user.avatar} data-ai-hint={user.dataAiHint} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          </div>
                          
                          <div className="flex-1">
                            <p 
                              className="font-medium text-sm cursor-pointer hover:text-primary"
                              onClick={() => openUserProfile(user)}
                            >
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Nível {user.level}</p>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openPrivateChat(user)}
                          >
                            <MessageSquare className="h-4 w-4" />
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

        {/* Modals */}
        {renderStoryViewer()}
        {renderUserProfile()}
        {renderChatModal()}
        {renderGroupModal()}
        {renderEventModal()}
        {renderTutorialModal()}
        {renderPixelSelector(false)}
        {renderPixelSelector(true)}
      </div>
    </RequireAuth>
  );
}