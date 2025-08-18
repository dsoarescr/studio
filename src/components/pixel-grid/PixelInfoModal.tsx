'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import {
  MapPin, Eye, Heart, MessageSquare, Share2, User, Calendar, Clock, Star, Crown, 
  Gem, Sparkles, Edit3, ShoppingCart, Copy, ExternalLink, Flag, Bookmark, 
  Download, Upload, Camera, Palette, Zap, Gift, Globe, Navigation, Compass, 
  Target, Award, Trophy, Coins, Info, ChevronRight, ChevronLeft, X, Send, 
  ThumbsUp, UserPlus, Settings, BarChart3, TrendingUp, Activity, Hash, 
  Link as LinkIcon, Image as ImageIcon, Plus, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, timeAgo } from '@/lib/utils';

interface PixelComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: PixelComment[];
}

interface PixelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onPurchase: () => void;
  pixelData: {
    x: number;
    y: number;
    owner?: string;
    price: number;
    region: string;
    views: number;
    likes: number;
    isLiked?: boolean;
    rarity: string;
    color?: string;
    title?: string;
    description?: string;
    tags?: string[];
    linkUrl?: string;
    isOwnedByCurrentUser?: boolean;
    isForSaleBySystem?: boolean;
    acquisitionDate?: string;
    lastModifiedDate?: string;
    gpsCoords?: { lat: number; lon: number } | null;
    isProtected?: boolean;
    features?: string[];
    specialCreditsPrice?: number;
  } | null;
}

const mockComments: PixelComment[] = [
  {
    id: '1',
    author: {
      name: 'PixelArtist',
      avatar: 'https://placehold.co/40x40.png',
      level: 15,
      verified: true
    },
    content: 'Que pixel incrível! A localização é perfeita para arte urbana.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          name: 'ColorMaster',
          avatar: 'https://placehold.co/40x40.png',
          level: 8,
          verified: false
        },
        content: 'Concordo! Já estou a planear uma obra aqui.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 3,
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'InvestorPro',
      avatar: 'https://placehold.co/40x40.png',
      level: 22,
      verified: true
    },
    content: 'Excelente investimento! Esta zona vai valorizar muito.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8,
    isLiked: true
  }
];

const mockPixelHistory = [
  {
    action: 'Criado',
    user: 'Sistema',
    date: '2024-01-15',
    price: 1
  },
  {
    action: 'Primeira visualização',
    user: 'PixelExplorer',
    date: '2024-01-16',
    price: null
  },
  {
    action: 'Primeiro like',
    user: 'ArtLover',
    date: '2024-01-17',
    price: null
  }
];

export default function PixelInfoModal({ 
  isOpen, 
  onClose, 
  onEdit, 
  onPurchase, 
  pixelData 
}: PixelInfoModalProps) {
  const [comments, setComments] = useState<PixelComment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { addXp, addCredits } = useUserStore();
  const { vibrate } = useHapticFeedback();

  useEffect(() => {
    if (pixelData) {
      setIsLiked(pixelData.isLiked || false);
      setLikes(pixelData.likes || 0);
      setViews(pixelData.views || 0);
    }
  }, [pixelData]);

  // Simular incremento de visualizações
  useEffect(() => {
    if (isOpen && pixelData) {
      const timer = setTimeout(() => {
        setViews(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pixelData]);

  if (!pixelData) return null;

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir pixels.",
        variant: "destructive"
      });
      return;
    }

    vibrate('light');
    setPlaySound(true);
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);
    
    if (newLikedState) {
      addXp(5);
      addCredits(2);
      setShowConfetti(true);
    }
    
    toast({
      title: newLikedState ? "❤️ Pixel Curtido!" : "💔 Like Removido",
      description: newLikedState ? "Recebeu 5 XP + 2 créditos!" : "Like removido do pixel.",
    });
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para comentar.",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Comentário Vazio",
        description: "Escreva algo antes de comentar.",
        variant: "destructive"
      });
      return;
    }

    vibrate('medium');
    setPlaySound(true);

    const comment: PixelComment = {
      id: Date.now().toString(),
      author: {
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        level: 15,
        verified: true
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    
    addXp(10);
    addCredits(5);
    setShowConfetti(true);

    toast({
      title: "💬 Comentário Adicionado!",
      description: "Recebeu 10 XP + 5 créditos!",
    });
  };

  const handleShare = async () => {
    vibrate('light');
    
    const shareData = {
      title: `Pixel (${pixelData.x}, ${pixelData.y}) - Pixel Universe`,
      text: `Confira este pixel incrível em ${pixelData.region}!`,
      url: `${window.location.origin}/pixel/${pixelData.x}-${pixelData.y}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addXp(8);
        addCredits(3);
        toast({
          title: "📤 Pixel Partilhado!",
          description: "Recebeu 8 XP + 3 créditos!",
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "🔗 Link Copiado!",
        description: "Link do pixel copiado para a área de transferência.",
      });
    }
  };

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para guardar pixels.",
        variant: "destructive"
      });
      return;
    }

    vibrate('light');
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? "🔖 Removido dos Favoritos" : "⭐ Adicionado aos Favoritos",
      description: isBookmarked ? "Pixel removido dos favoritos." : "Pixel guardado nos favoritos.",
    });
  };

  const handleViewOnMap = () => {
    if (pixelData.gpsCoords) {
      const { lat, lon } = pixelData.gpsCoords;
      const url = `https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`;
      window.open(url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "🗺️ Abrindo Google Maps",
        description: "Visualizando localização real do pixel.",
      });
    }
  };

  const handleUserClick = (userName: string) => {
    const userData = {
      name: userName,
      username: userName.toLowerCase(),
      avatar: 'https://placehold.co/40x40.png',
      level: Math.floor(Math.random() * 25) + 1,
      pixels: Math.floor(Math.random() * 100) + 1,
      followers: Math.floor(Math.random() * 1000) + 10,
      following: Math.floor(Math.random() * 500) + 5,
      bio: `Artista digital apaixonado por pixel art. Explorando o ${pixelData.region} pixel a pixel!`,
      joinDate: '2024-01-15',
      verified: Math.random() > 0.5,
      premium: Math.random() > 0.7
    };
    
    setSelectedUser(userData);
    setShowUserProfile(true);
  };

  const handleFollowUser = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para seguir utilizadores.",
        variant: "destructive"
      });
      return;
    }

    vibrate('medium');
    setPlaySound(true);
    addXp(15);
    addCredits(8);
    setShowConfetti(true);

    toast({
      title: "👥 A Seguir Utilizador!",
      description: `Agora segue ${selectedUser?.name}. Recebeu 15 XP + 8 créditos!`,
    });
  };

  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para enviar mensagens.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "💬 Mensagem Enviada!",
      description: `Mensagem enviada para ${selectedUser?.name}.`,
    });
    setShowUserProfile(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Marco Histórico': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = () => {
    if (pixelData.isOwnedByCurrentUser) return 'text-green-500 bg-green-500/10';
    if (pixelData.owner && pixelData.owner !== 'Sistema' && pixelData.owner !== 'Disponível (Sistema)') return 'text-blue-500 bg-blue-500/10';
    return 'text-primary bg-primary/10';
  };

  const getStatusText = () => {
    if (pixelData.isOwnedByCurrentUser) return 'Seu Pixel';
    if (pixelData.owner && pixelData.owner !== 'Sistema' && pixelData.owner !== 'Disponível (Sistema)') return 'Pixel Privado';
    return 'Disponível';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={2000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-md h-[90vh] p-0 gap-0 bg-background/98 backdrop-blur-md border-primary/20">
        <DialogHeader className="p-6 border-b bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-2xl font-headline">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Pixel ({pixelData.x}, {pixelData.y})
            </DialogTitle>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{pixelData.region}</span>
              {pixelData.gpsCoords && (
                <>
                  <span>•</span>
                  <span className="font-mono text-xs">
                    {pixelData.gpsCoords.lat.toFixed(4)}, {pixelData.gpsCoords.lon.toFixed(4)}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRarityColor(pixelData.rarity)}>
                {pixelData.rarity}
              </Badge>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Pixel Preview - Mais Limpo */}
            <Card className="overflow-hidden shadow-lg">
              <div className="relative">
                <div 
                  className="w-full h-40 flex items-center justify-center text-5xl font-bold border-b-2 border-primary/20"
                  style={{ backgroundColor: pixelData.color || '#D4A757' }}
                >
                  🎨
                </div>
                
                {pixelData.isProtected && (
                  <Badge className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm">
                    <Flag className="h-3 w-3 mr-1" />
                    Protegido
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4 space-y-3">
                {pixelData.title && (
                  <h3 className="font-semibold text-lg text-center">{pixelData.title}</h3>
                )}
                
                {pixelData.description && (
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {pixelData.description}
                  </p>
                )}
                
                {pixelData.tags && pixelData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {pixelData.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {pixelData.linkUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(pixelData.linkUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visitar Link
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats - Mais Visual */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{views.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Visualizações</p>
              </Card>
              
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <Heart className={`h-6 w-6 mx-auto mb-2 ${isLiked ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                <p className="text-2xl font-bold">{likes.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Curtidas</p>
              </Card>
              
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <MessageSquare className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{comments.length}</p>
                <p className="text-xs text-muted-foreground">Comentários</p>
              </Card>
            </div>

            {/* Action Buttons - Mais Organizados */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleLike}
                  className={cn(
                    "transition-all duration-200",
                    isLiked && "bg-red-500/10 border-red-500/50 text-red-500"
                  )}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Curtido' : 'Curtir'}
                </Button>
                
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleBookmark}>
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                  {isBookmarked ? 'Guardado' : 'Guardar'}
                </Button>
                
                {pixelData.gpsCoords && (
                  <Button variant="outline" onClick={handleViewOnMap}>
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver Mapa
                  </Button>
                )}
              </div>
            </div>

            {/* Owner Info - Mais Limpo */}
            {pixelData.owner && pixelData.owner !== 'Sistema' && pixelData.owner !== 'Disponível (Sistema)' && !pixelData.isForSaleBySystem && (
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-4">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => handleUserClick(pixelData.owner!)}
                  >
                    <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                      <AvatarImage src="https://placehold.co/40x40.png" />
                      <AvatarFallback>{pixelData.owner![0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{pixelData.owner}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">Nível 15</Badge>
                        <span className="text-sm text-muted-foreground">Proprietário</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  {pixelData.acquisitionDate && (
                    <div className="mt-4 pt-3 border-t border-border/30 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Adquirido em {pixelData.acquisitionDate}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Comments Section - Mais Limpo */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                    Comentários ({comments.length})
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 space-y-6">
                {/* Add Comment - Melhorado */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="O que achas deste pixel? Partilha a tua opinião..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {newComment.length}/200 caracteres
                    </span>
                    <Button 
                      onClick={handleComment}
                      disabled={!newComment.trim() || newComment.length > 200}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Comentar
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Comments List - Mais Organizados */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Comentários Recentes</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowComments(!showComments)}
                    >
                      {showComments ? 'Ver Menos' : `Ver Todos (${comments.length})`}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {(showComments ? comments : comments.slice(0, 2)).map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-3"
                      >
                        <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <Avatar 
                                className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                onClick={() => handleUserClick(comment.author.name)}
                              >
                                <AvatarImage src={comment.author.avatar} />
                                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span 
                                    className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => handleUserClick(comment.author.name)}
                                  >
                                    {comment.author.name}
                                  </span>
                                  {comment.author.verified && (
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    Nível {comment.author.level}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {timeAgo(comment.timestamp)}
                                  </span>
                                </div>
                                
                                <p className="text-sm leading-relaxed mb-3">{comment.content}</p>
                                
                                <div className="flex items-center gap-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 px-3"
                                    onClick={() => {
                                      setComments(prev => prev.map(c => 
                                        c.id === comment.id 
                                          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
                                          : c
                                      ));
                                      
                                      if (!comment.isLiked) {
                                        addXp(3);
                                        addCredits(1);
                                        setPlaySound(true);
                                        toast({
                                          title: "👍 Comentário Curtido!",
                                          description: "Recebeu 3 XP + 1 crédito!",
                                        });
                                      }
                                    }}
                                  >
                                    <ThumbsUp className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current text-blue-500' : ''}`} />
                                    {comment.likes}
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm" className="h-8 px-3">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Responder
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Replies - Mais Organizadas */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-6 space-y-2 border-l-2 border-primary/20 pl-4">
                            {comment.replies.map(reply => (
                              <Card key={reply.id} className="bg-background/50">
                                <CardContent className="p-3">
                                  <div className="flex gap-2">
                                    <Avatar 
                                      className="h-6 w-6 cursor-pointer"
                                      onClick={() => handleUserClick(reply.author.name)}
                                    >
                                      <AvatarImage src={reply.author.avatar} />
                                      <AvatarFallback className="text-xs">{reply.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span 
                                          className="font-medium text-xs cursor-pointer hover:text-primary"
                                          onClick={() => handleUserClick(reply.author.name)}
                                        >
                                          {reply.author.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {timeAgo(reply.timestamp)}
                                        </span>
                                      </div>
                                      <p className="text-xs">{reply.content}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Main Action Button - Mais Destacado */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {pixelData.isOwnedByCurrentUser ? (
                    <>
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                          <Crown className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-500">Este é o Seu Pixel!</h3>
                        <p className="text-sm text-muted-foreground">
                          Pode editar, personalizar e configurar este pixel como desejar.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={onEdit}
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg font-semibold"
                        size="lg"
                      >
                        <Edit3 className="h-5 w-5 mr-2" />
                        Editar Pixel
                      </Button>
                    </>
                  ) : pixelData.owner && pixelData.owner !== 'Sistema' && pixelData.owner !== 'Disponível (Sistema)' && !pixelData.isForSaleBySystem ? (
                    <>
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                          <User className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-500">Pixel Privado</h3>
                        <p className="text-sm text-muted-foreground">
                          Este pixel pertence a {pixelData.owner}. Pode curtir, comentar e interagir.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="h-12"
                          onClick={() => handleUserClick(pixelData.owner!)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Ver Proprietário
                        </Button>
                        <Button 
                          className="h-12"
                          onClick={handleFollowUser}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Seguir
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                          <ShoppingCart className="h-8 w-8 text-primary" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <Coins className="h-6 w-6 text-primary" />
                            <span className="text-3xl font-bold text-primary">
                              €{pixelData.price}
                            </span>
                          </div>
                          
                          {pixelData.specialCreditsPrice && (
                            <div className="flex items-center justify-center gap-2">
                              <Gift className="h-5 w-5 text-accent" />
                              <span className="text-lg font-medium text-accent">
                                ou {pixelData.specialCreditsPrice} créditos especiais
                              </span>
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground">
                            Pixel disponível para compra e personalização
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={onPurchase}
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg font-semibold shadow-lg"
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Comprar e Editar
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* User Profile Sheet */}
        <Sheet open={showUserProfile} onOpenChange={setShowUserProfile}>
          <SheetContent className="w-full max-w-md p-0">
            <SheetHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
              <SheetTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Perfil de {selectedUser?.name}
              </SheetTitle>
            </SheetHeader>
            
            {selectedUser && (
              <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
                <div className="p-4 space-y-6">
                  {/* User Header */}
                  <div className="text-center space-y-4">
                    <Avatar className="h-20 w-20 mx-auto border-4 border-primary">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                        {selectedUser.verified && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        )}
                        {selectedUser.premium && (
                          <Crown className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                      <Badge variant="secondary" className="mt-2">
                        Nível {selectedUser.level}
                      </Badge>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-primary">{selectedUser.pixels}</p>
                      <p className="text-xs text-muted-foreground">Pixels</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-blue-500">{selectedUser.followers}</p>
                      <p className="text-xs text-muted-foreground">Seguidores</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-green-500">{selectedUser.following}</p>
                      <p className="text-xs text-muted-foreground">A Seguir</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground italic">
                        "{selectedUser.bio}"
                      </p>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleFollowUser}
                      className="w-full"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Seguir
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={handleSendMessage}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mensagem
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "📤 Perfil Partilhado!",
                            description: "Link do perfil copiado.",
                          });
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Partilhar
                      </Button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        {[
                          { action: 'Comprou pixel em Lisboa', time: '2h atrás' },
                          { action: 'Desbloqueou conquista "Artista"', time: '1d atrás' },
                          { action: 'Criou álbum "Paisagens"', time: '3d atrás' }
                        ].map((activity, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{activity.action}</span>
                            <span className="text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </SheetContent>
        </Sheet>
      </DialogContent>
    </Dialog>
  );
}