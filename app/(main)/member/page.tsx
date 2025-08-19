'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Trophy, Coins, Gift, Star, Crown, Sparkles, 
  Calendar, Clock, Eye, Heart, MessageSquare, Share2, Settings,
  UserPlus, Send, Copy, ExternalLink, Edit3, Palette, Zap,
  Award, Gem, Target, Users, Bell, Shield, Globe, Camera,
  Link as LinkIcon, Plus, Check, X, ChevronRight, Info,
  Navigation, ThumbsUp, Reply, Flag, Bookmark
} from "lucide-react";
import { cn } from '@/lib/utils';

// Interfaces
interface UserPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  color: string;
  title: string;
  description: string;
  acquisitionDate: string;
  value: number;
  views: number;
  likes: number;
  comments: number;
  rarity: string;
  features: string[];
  gpsCoords: { lat: number; lon: number };
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  unlockedAt: string;
  xpReward: number;
  creditsReward: number;
  category: string;
}

interface SocialConnection {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  isFollowing: boolean;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends: number;
  pixelsOwned: number;
}

interface PixelComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Array<{
    id: string;
    author: { name: string; avatar: string; };
    content: string;
    timestamp: string;
  }>;
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isRead: boolean;
  }>;
}

// Mock Data
const mockPixels: UserPixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    color: '#D4A757',
    title: 'Pixel Dourado de Lisboa',
    description: 'Meu primeiro pixel premium no coração da capital',
    acquisitionDate: '2024-03-15',
    value: 150,
    views: 1234,
    likes: 89,
    comments: 23,
    rarity: 'Épico',
    features: ['Centro Histórico', 'Alta Visibilidade', 'Zona Premium'],
    gpsCoords: { lat: 38.7223, lon: -9.1393 }
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    color: '#7DF9FF',
    title: 'Arte Azul do Porto',
    description: 'Pixel artístico na zona ribeirinha',
    acquisitionDate: '2024-03-10',
    value: 120,
    views: 567,
    likes: 45,
    comments: 12,
    rarity: 'Raro',
    features: ['Zona Ribeirinha', 'Património UNESCO'],
    gpsCoords: { lat: 41.1579, lon: -8.6291 }
  }
];

const mockAchievements: UserAchievement[] = [
  {
    id: 'first_pixel',
    name: 'Primeiro Pixel',
    description: 'Comprou o seu primeiro pixel no Pixel Universe',
    icon: '🎯',
    rarity: 'Comum',
    unlockedAt: '2024-03-15',
    xpReward: 50,
    creditsReward: 25,
    category: 'Iniciante'
  },
  {
    id: 'color_master',
    name: 'Mestre das Cores',
    description: 'Usou 10 cores diferentes nos seus pixels',
    icon: '🎨',
    rarity: 'Raro',
    unlockedAt: '2024-03-20',
    xpReward: 150,
    creditsReward: 75,
    category: 'Criatividade'
  }
];

const mockSocialConnections: SocialConnection[] = [
  {
    id: '1',
    name: 'PixelArtist',
    username: 'pixelartist123',
    avatar: 'https://placehold.co/40x40.png',
    level: 15,
    isFollowing: false,
    isOnline: true,
    lastSeen: 'Online',
    mutualFriends: 3,
    pixelsOwned: 67
  },
  {
    id: '2',
    name: 'ColorMaster',
    username: 'colormaster',
    avatar: 'https://placehold.co/40x40.png',
    level: 12,
    isFollowing: true,
    isOnline: false,
    lastSeen: '2h atrás',
    mutualFriends: 1,
    pixelsOwned: 34
  }
];

const mockComments: PixelComment[] = [
  {
    id: '1',
    author: {
      name: 'PixelFan',
      avatar: 'https://placehold.co/40x40.png',
      level: 8,
      verified: true
    },
    content: 'Que pixel incrível! A localização é perfeita.',
    timestamp: '2h atrás',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: { name: 'Você', avatar: 'https://placehold.co/40x40.png' },
        content: 'Obrigado! Foi uma boa escolha.',
        timestamp: '1h atrás'
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'ArtLover',
      avatar: 'https://placehold.co/40x40.png',
      level: 20,
      verified: false
    },
    content: 'Excelente investimento! Esta zona vai valorizar.',
    timestamp: '5h atrás',
    likes: 8,
    isLiked: true,
    replies: []
  }
];

export default function MemberPage() {
  const { 
    credits, 
    specialCredits, 
    level, 
    xp, 
    xpMax, 
    pixels, 
    achievements, 
    streak,
    addCredits, 
    addXp,
    addSpecialCredits
  } = useUserStore();
  
  const { toast } = useToast();
  
  // Estados dos modais
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  
  // Estados dos dados
  const [selectedPixel, setSelectedPixel] = useState<UserPixel | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<UserAchievement | null>(null);
  const [selectedUser, setSelectedUser] = useState<SocialConnection | null>(null);
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>(mockSocialConnections);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [comments, setComments] = useState<PixelComment[]>(mockComments);
  
  // Estados do formulário
  const [inviteEmail, setInviteEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  
  // Estados das configurações
  const [showPixels, setShowPixels] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  
  // Estados de efeitos
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);

  const xpPercentage = (xp / xpMax) * 100;

  // Handlers principais
  const handleClaimDailyBonus = () => {
    if (dailyBonusClaimed) {
      toast({
        title: "Bónus Já Reclamado",
        description: "Você já reclamou o bónus diário de hoje.",
        variant: "destructive"
      });
      return;
    }

    const bonusCredits = streak * 10;
    const bonusXp = streak * 5;
    
    addCredits(bonusCredits);
    addXp(bonusXp);
    setDailyBonusClaimed(true);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    toast({
      title: "🎁 Bónus Diário Reclamado!",
      description: `Recebeu ${bonusCredits} créditos + ${bonusXp} XP (Sequência: ${streak} dias)`,
    });
  };

  const handlePixelClick = (pixel: UserPixel) => {
    setSelectedPixel(pixel);
    setShowPixelModal(true);
  };

  const handleAchievementClick = (achievement: UserAchievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  const handleCommentsClick = (pixel: UserPixel) => {
    setSelectedPixel(pixel);
    setShowCommentsModal(true);
  };

  const handleInviteFriend = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Obrigatório",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    const inviteCode = Math.random().toString(36).substring(2, 15);
    const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
    
    navigator.clipboard.writeText(inviteLink);
    addCredits(25);
    addXp(15);
    setPlaySuccessSound(true);
    
    toast({
      title: "🎉 Convite Enviado!",
      description: `Link copiado! Quando ${inviteEmail} se registar, receberá 100 créditos de bónus.`,
    });
    
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleFollowUser = (user: SocialConnection) => {
    setSocialConnections(prev => prev.map(conn => 
      conn.id === user.id 
        ? { ...conn, isFollowing: !conn.isFollowing }
        : conn
    ));
    
    addXp(10);
    addCredits(5);
    setPlaySuccessSound(true);
    
    toast({
      title: user.isFollowing ? "👋 Deixou de Seguir" : "👥 A Seguir!",
      description: user.isFollowing 
        ? `Deixou de seguir ${user.name}` 
        : `Agora segue ${user.name}. Recebeu 10 XP + 5 créditos!`,
    });
  };

  const handleSendMessage = () => {
    if (!selectedUser || !messageContent.trim()) {
      toast({
        title: "Mensagem Vazia",
        description: "Por favor, escreva uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString('pt-PT'),
      isRead: true
    };

    // Encontrar ou criar conversa
    const existingConversation = conversations.find(conv => 
      conv.participant.name === selectedUser.name
    );

    if (existingConversation) {
      setConversations(prev => prev.map(conv => 
        conv.id === existingConversation.id
          ? {
              ...conv,
              lastMessage: messageContent,
              timestamp: 'Agora',
              messages: [...conv.messages, newMessage]
            }
          : conv
      ));
    } else {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        participant: {
          name: selectedUser.name,
          avatar: selectedUser.avatar,
          isOnline: selectedUser.isOnline
        },
        lastMessage: messageContent,
        timestamp: 'Agora',
        unreadCount: 0,
        messages: [newMessage]
      };
      setConversations(prev => [newConversation, ...prev]);
    }

    addXp(15);
    addCredits(8);
    setPlaySuccessSound(true);
    
    toast({
      title: "📨 Mensagem Enviada!",
      description: `Mensagem enviada para ${selectedUser.name}. Recebeu 15 XP + 8 créditos!`,
    });
    
    setMessageContent('');
    setShowMessageModal(false);
  };

  const handleViewProfile = (user: SocialConnection) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleSharePixel = (pixel: UserPixel) => {
    const shareText = `Confira meu pixel em ${pixel.region}! Coordenadas: (${pixel.x}, ${pixel.y})`;
    
    if (navigator.share) {
      navigator.share({
        title: pixel.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "🔗 Link Copiado!",
        description: "Informações do pixel copiadas para a área de transferência.",
      });
    }
  };

  const handleViewOnMap = (pixel: UserPixel) => {
    const { lat, lon } = pixel.gpsCoords;
    const url = `https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`;
    window.open(url, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "🗺️ Abrindo Google Maps",
      description: "Visualizando localização real do pixel.",
    });
  };

  // Handlers das configurações
  const handleToggleShowPixels = (enabled: boolean) => {
    setShowPixels(enabled);
    toast({
      title: enabled ? "Pixels Visíveis" : "Pixels Ocultos",
      description: enabled 
        ? "Seus pixels agora são visíveis no perfil público." 
        : "Seus pixels foram ocultados do perfil público.",
    });
  };

  const handleToggleShowAchievements = (enabled: boolean) => {
    setShowAchievements(enabled);
    toast({
      title: enabled ? "Conquistas Visíveis" : "Conquistas Ocultas",
      description: enabled 
        ? "Suas conquistas agora são visíveis no perfil público." 
        : "Suas conquistas foram ocultadas do perfil público.",
    });
  };

  const handleToggleAllowMessages = (enabled: boolean) => {
    setAllowMessages(enabled);
    toast({
      title: enabled ? "Mensagens Permitidas" : "Mensagens Bloqueadas",
      description: enabled 
        ? "Outros utilizadores podem enviar-lhe mensagens." 
        : "Mensagens de outros utilizadores foram bloqueadas.",
    });
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setEnableNotifications(enabled);
    toast({
      title: enabled ? "Notificações Ativadas" : "Notificações Desativadas",
      description: enabled 
        ? "Receberá notificações sobre atividades do perfil." 
        : "Notificações do perfil foram desativadas.",
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleSendMessageInCenter = () => {
    if (!selectedConversation || !newMessageContent.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      content: newMessageContent,
      timestamp: new Date().toLocaleTimeString('pt-PT'),
      isRead: true
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: newMessageContent,
            timestamp: 'Agora',
            messages: [...conv.messages, newMessage]
          }
        : conv
    ));

    setNewMessageContent('');
    
    toast({
      title: "📨 Mensagem Enviada!",
      description: `Mensagem enviada para ${selectedConversation.participant.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-4xl">
        {/* Header do Perfil */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                  <AvatarImage src="https://placehold.co/96x96.png" alt="Perfil" />
                  <AvatarFallback className="text-2xl font-headline">PM</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Nível {level}
                </Badge>
              </div>
              
              <div>
                <CardTitle className="text-2xl font-headline text-gradient-gold">PixelMasterPT</CardTitle>
                <p className="text-muted-foreground">@pixelmasterpt</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">Verificado</span>
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Premium</span>
                </div>
              </div>
            </div>
            
            {/* Progresso XP */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso XP</span>
                <span className="font-code">{xp.toLocaleString()}/{xpMax.toLocaleString()}</span>
              </div>
              <Progress value={xpPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {xpMax - xp} XP para o próximo nível
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{credits.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Créditos</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Gift className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{specialCredits.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Especiais</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{pixels}</p>
              <p className="text-sm text-muted-foreground">Pixels</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{achievements}</p>
              <p className="text-sm text-muted-foreground">Conquistas</p>
            </CardContent>
          </Card>
        </div>

        {/* Bónus Diário */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Gift className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Bónus Diário</h3>
                  <p className="text-muted-foreground">
                    Sequência: {streak} dias consecutivos
                  </p>
                  <p className="text-sm text-green-500 font-medium">
                    Recompensa: {streak * 10} créditos + {streak * 5} XP
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleClaimDailyBonus}
                disabled={dailyBonusClaimed}
                className={cn(
                  "min-h-[44px] px-6 cursor-pointer",
                  dailyBonusClaimed 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                )}
                size="lg"
              >
                {dailyBonusClaimed ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Reclamado
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5 mr-2" />
                    Reclamar Bónus
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pixels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pixels">Meus Pixels</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Meus Pixels */}
          <TabsContent value="pixels" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPixels.map(pixel => (
                <Card 
                  key={pixel.id} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => handlePixelClick(pixel)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-primary/30 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: pixel.color }}
                      >
                        🎨
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{pixel.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ({pixel.x}, {pixel.y}) • {pixel.region}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {pixel.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {pixel.likes}
                          </span>
                          <span 
                            className="flex items-center gap-1 cursor-pointer hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommentsClick(pixel);
                            }}
                          >
                            <MessageSquare className="h-3 w-3" />
                            {pixel.comments}
                          </span>
                        </div>
                      </div>
                      
                      <Badge className="bg-primary text-primary-foreground">
                        €{pixel.value}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Conquistas */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAchievements.map(achievement => (
                <Card 
                  key={achievement.id} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => handleAchievementClick(achievement)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{achievement.rarity}</Badge>
                          <Badge variant="secondary">{achievement.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary">+{achievement.xpReward} XP</p>
                        <p className="text-sm text-accent">+{achievement.creditsReward}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social */}
          <TabsContent value="social" className="space-y-6">
            {/* Convites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Convidar Amigos
                  </span>
                  <Button 
                    onClick={() => setShowInviteModal(true)}
                    className="min-h-[44px]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Convidar
                  </Button>
                </CardTitle>
                <CardDescription>
                  Convide amigos e ganhe 100 créditos quando eles se registarem!
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Centro de Mensagens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Centro de Mensagens
                  </span>
                  {conversations.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMessageCenter(true)}
                      className="min-h-[44px]"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ver Todas ({conversations.length})
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              {conversations.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {conversations.slice(0, 3).map(conv => (
                      <div key={conv.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={conv.participant.avatar} />
                          <AvatarFallback>{conv.participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{conv.participant.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Conexões Sociais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Amigos e Conexões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialConnections.map(user => (
                    <div key={user.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                          user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{user.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            Nível {user.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.pixelsOwned} pixels • {user.mutualFriends} amigos mútuos
                        </p>
                        <p className="text-xs text-muted-foreground">{user.lastSeen}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant={user.isFollowing ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleFollowUser(user)}
                          className="min-h-[32px]"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {user.isFollowing ? "A Seguir" : "Seguir"}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowMessageModal(true);
                          }}
                          className="min-h-[32px]"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Mensagem
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(user)}
                          className="min-h-[32px]"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configurações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Mostrar Pixels no Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">
                      Outros utilizadores podem ver os seus pixels
                    </p>
                  </div>
                  <Switch 
                    checked={showPixels} 
                    onCheckedChange={handleToggleShowPixels}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Mostrar Conquistas no Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">
                      Outros utilizadores podem ver as suas conquistas
                    </p>
                  </div>
                  <Switch 
                    checked={showAchievements} 
                    onCheckedChange={handleToggleShowAchievements}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Permitir Mensagens</Label>
                    <p className="text-sm text-muted-foreground">
                      Outros utilizadores podem enviar-lhe mensagens
                    </p>
                  </div>
                  <Switch 
                    checked={allowMessages} 
                    onCheckedChange={handleToggleAllowMessages}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificações do Perfil</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações sobre atividades do perfil
                    </p>
                  </div>
                  <Switch 
                    checked={enableNotifications} 
                    onCheckedChange={handleToggleNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Convite */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-primary" />
                Convidar Amigo
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email do Amigo</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="amigo@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Recompensas do Convite:</h4>
                <ul className="text-sm space-y-1">
                  <li>• 25 créditos por enviar convite</li>
                  <li>• 100 créditos quando o amigo se registar</li>
                  <li>• 15 XP por cada convite enviado</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleInviteFriend}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Pixel */}
        <Dialog open={showPixelModal} onOpenChange={setShowPixelModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                {selectedPixel?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedPixel && (
              <div className="space-y-6">
                {/* Imagem do Pixel */}
                <div className="text-center">
                  <div 
                    className="w-32 h-32 mx-auto rounded-lg border-4 border-primary/30 flex items-center justify-center text-6xl shadow-lg"
                    style={{ backgroundColor: selectedPixel.color }}
                  >
                    🎨
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pixel ({selectedPixel.x}, {selectedPixel.y}) • {selectedPixel.region}
                  </p>
                </div>

                {/* Informações */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-sm text-muted-foreground">{selectedPixel.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-500">{selectedPixel.views}</p>
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-500">{selectedPixel.likes}</p>
                      <p className="text-xs text-muted-foreground">Curtidas</p>
                    </div>
                    <div 
                      className="cursor-pointer hover:bg-muted/20 rounded p-2"
                      onClick={() => handleCommentsClick(selectedPixel)}
                    >
                      <p className="text-2xl font-bold text-green-500">{selectedPixel.comments}</p>
                      <p className="text-xs text-muted-foreground">Comentários</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Características</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPixel.features.map(feature => (
                        <Badge key={feature} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Raridade</p>
                      <p className="font-semibold">{selectedPixel.rarity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor Atual</p>
                      <p className="font-semibold text-primary">€{selectedPixel.value}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data de Aquisição</p>
                      <p className="font-semibold">{selectedPixel.acquisitionDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Coordenadas GPS</p>
                      <p className="font-semibold font-mono text-xs">
                        {selectedPixel.gpsCoords.lat.toFixed(4)}, {selectedPixel.gpsCoords.lon.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSharePixel(selectedPixel)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewOnMap(selectedPixel)}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Comentários */}
        <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
          <DialogContent className="max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                Comentários do Pixel
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author.name}</span>
                          {comment.author.verified && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            Nível {comment.author.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        
                        <p className="text-sm mb-2">{comment.content}</p>
                        
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLikeComment(comment.id)}
                            className="h-8 px-3"
                          >
                            <ThumbsUp className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current text-blue-500' : ''}`} />
                            {comment.likes}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <Reply className="h-3 w-3 mr-1" />
                            Responder
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Respostas */}
                    {comment.replies.length > 0 && (
                      <div className="ml-8 space-y-2 border-l-2 border-primary/20 pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback className="text-xs">{reply.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-xs">{reply.author.name}</span>
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>
                              <p className="text-xs">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Modal de Conquista */}
        <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Detalhes da Conquista
              </DialogTitle>
            </DialogHeader>
            
            {selectedAchievement && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                  <h3 className="text-xl font-bold">{selectedAchievement.name}</h3>
                  <Badge variant="outline" className="mt-2">{selectedAchievement.rarity}</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Descrição</h4>
                    <p className="text-sm text-muted-foreground">{selectedAchievement.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <Zap className="h-6 w-6 text-primary mx-auto mb-1" />
                      <p className="font-bold text-primary">+{selectedAchievement.xpReward}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <Coins className="h-6 w-6 text-accent mx-auto mb-1" />
                      <p className="font-bold text-accent">+{selectedAchievement.creditsReward}</p>
                      <p className="text-xs text-muted-foreground">Créditos</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Desbloqueado em {selectedAchievement.unlockedAt}
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    const shareText = `Desbloqueei a conquista "${selectedAchievement.name}" no Pixel Universe! 🏆`;
                    if (navigator.share) {
                      navigator.share({ title: 'Conquista Desbloqueada', text: shareText });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      toast({
                        title: "🔗 Partilhado!",
                        description: "Conquista copiada para a área de transferência.",
                      });
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar Conquista
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Mensagem */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Enviar Mensagem
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message-content">Mensagem</Label>
                  <Textarea
                    id="message-content"
                    placeholder="Escreva sua mensagem..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowMessageModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Perfil Público */}
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Perfil Público
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto border-4 border-primary">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mt-3">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                  <Badge variant="secondary" className="mt-2">Nível {selectedUser.level}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-1" />
                    <p className="font-bold">{selectedUser.pixelsOwned}</p>
                    <p className="text-xs text-muted-foreground">Pixels</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <p className="font-bold">{selectedUser.mutualFriends}</p>
                    <p className="text-xs text-muted-foreground">Amigos Mútuos</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant={selectedUser.isFollowing ? "secondary" : "default"}
                    className="flex-1"
                    onClick={() => handleFollowUser(selectedUser)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {selectedUser.isFollowing ? "A Seguir" : "Seguir"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowProfileModal(false);
                      setShowMessageModal(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mensagem
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Centro de Mensagens */}
        <Dialog open={showMessageCenter} onOpenChange={setShowMessageCenter}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Centro de Mensagens
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex h-full">
              {/* Lista de Conversas */}
              <div className="w-1/3 border-r">
                <div className="p-3 border-b">
                  <h3 className="font-semibold">Conversas ({conversations.length})</h3>
                </div>
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {conversations.map(conv => (
                      <div 
                        key={conv.id}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                          selectedConversation?.id === conv.id && "bg-primary/10"
                        )}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conv.participant.avatar} />
                              <AvatarFallback>{conv.participant.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                              conv.participant.isOnline ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{conv.participant.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                            <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                          </div>
                          
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Área de Mensagens */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.participant.avatar} />
                          <AvatarFallback>{selectedConversation.participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedConversation.participant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedConversation.participant.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-3">
                        {selectedConversation.messages.map(msg => (
                          <div 
                            key={msg.id}
                            className={`flex ${msg.sender === 'Você' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs p-3 rounded-lg ${
                              msg.sender === 'Você' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escrever mensagem..."
                          value={newMessageContent}
                          onChange={(e) => setNewMessageContent(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessageInCenter()}
                        />
                        <Button onClick={handleSendMessageInCenter}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Selecione uma conversa para ver as mensagens</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}