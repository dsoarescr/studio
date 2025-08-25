'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { cn, formatDate, timeAgo } from '@/lib/utils';
import {
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  User,
  Crown,
  Star,
  Calendar,
  ShoppingCart,
  Edit,
  Share2,
  Bookmark,
  Award,
  Lock,
  Unlock,
  History,
  Target,
  Palette,
  Sparkles,
  Trophy,
  X,
  Coins,
  Globe,
  Clock,
  Brain
} from 'lucide-react';

interface PixelComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
    isOwner?: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface PixelHistory {
  action: string;
  user: string;
  date: string;
  price?: number;
  details?: string;
}

interface PixelOwner {
  id: string;
  name: string;
  avatar: string;
  level: number;
  verified: boolean;
  joinDate: string;
  totalPixels: number;
  totalValue: number;
  badges: string[];
}

interface DetailedPixelData {
  x: number;
  y: number;
  owner?: PixelOwner;
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
  comments?: PixelComment[];
  history?: PixelHistory[];
  rating?: number;
  totalRatings?: number;
  userRating?: number;
}

interface DetailedPixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onEdit?: () => void;
  pixelData: DetailedPixelData | null;
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
    isLiked: false
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

const mockHistory: PixelHistory[] = [
  {
    action: 'Criado',
    user: 'Sistema',
    date: '2024-01-15',
    price: 1,
    details: 'Pixel criado pelo sistema'
  },
  {
    action: 'Vendido',
    user: 'PixelInvestor',
    date: '2024-01-20',
    price: 5,
    details: 'Vendido por 5 créditos'
  }
];

export default function DetailedPixelModal({ 
  isOpen, 
  onClose, 
  onPurchase, 
  onEdit, 
  pixelData 
}: DetailedPixelModalProps) {
  const [comments, setComments] = useState<PixelComment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [userRating, setUserRating] = useState(pixelData?.userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkCategory, setBookmarkCategory] = useState('investimento');
  const [bookmarkNote, setBookmarkNote] = useState('');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { addXp } = useUserStore();
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
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    if (!isLiked) {
      addXp(5);
      toast({
        title: "Pixel curtido!",
        description: "+5 XP ganhos",
      });
    }
  };

  const handleBookmark = () => {
    if (!isBookmarked) {
      setShowBookmarkModal(true);
    } else {
      setIsBookmarked(false);
      toast({
        title: "Removido dos favoritos",
        description: "Pixel removido da sua lista",
      });
    }
  };

  const handleSaveBookmark = () => {
    setIsBookmarked(true);
    setShowBookmarkModal(false);
    addXp(5);
    
    toast({
      title: "Pixel guardado!",
      description: `Adicionado à categoria "${bookmarkCategory}". +5 XP ganhos`,
    });
    
    // Reset form
    setBookmarkCategory('investimento');
    setBookmarkNote('');
  };

  const handleShare = () => {
    const shareData = {
      title: `Pixel ${pixelData.x},${pixelData.y}`,
      text: `Confere este pixel incrível em ${pixelData.region}!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback para partilha avançada
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title} - ${shareData.text} ${shareData.url}`)}`;
      window.open(shareUrl, '_blank');
      
      toast({
        title: "Partilhado no WhatsApp!",
        description: "O pixel foi partilhado com sucesso",
      });
    }
  };

  const handleShareToSocial = (platform: string) => {
    const shareData = {
      title: `Pixel ${pixelData.x},${pixelData.y}`,
      text: `Confere este pixel incrível em ${pixelData.region}!`,
      url: window.location.href
    };

    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title} - ${shareData.text} ${shareData.url}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareData.title} - ${shareData.text}`)}&url=${encodeURIComponent(shareData.url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)}`;
        break;
      default:
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência",
        });
        return;
    }

    window.open(shareUrl, '_blank');
    
    toast({
      title: `Partilhado no ${platform}!`,
      description: "O pixel foi partilhado com sucesso",
    });
  };

  const handleAddComment = async () => {
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
        title: "Comentário vazio",
        description: "Escreva algo para comentar.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingComment(true);
    
    try {
      // Simular adição de comentário
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj: PixelComment = {
        id: Date.now().toString(),
        author: {
          name: user.displayName || 'Utilizador',
          avatar: user.photoURL || 'https://placehold.co/40x40.png',
          level: Math.floor(Math.random() * 20) + 1,
          verified: false,
          isOwner: pixelData.owner?.id === user.uid
        },
        content: newComment.trim(),
        timestamp: new Date(),
        likes: 0,
        isLiked: false
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      
      vibrate('light');
      addXp(10);
      
      toast({
        title: "Comentário adicionado!",
        description: "+10 XP ganhos",
      });
    } catch (error) {
      toast({
        title: "Erro ao comentar",
        description: "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir comentários.",
        variant: "destructive"
      });
      return;
    }

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
    
    vibrate('light');
  };

  const handleRating = (rating: number) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para avaliar pixels.",
        variant: "destructive"
      });
      return;
    }

    setUserRating(rating);
    vibrate('light');
    addXp(5);
    
    toast({
      title: "Avaliação enviada!",
      description: `Avaliou com ${rating} estrelas. +5 XP ganhos`,
    });
  };

  const handleFollowOwner = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para seguir utilizadores.",
        variant: "destructive"
      });
      return;
    }

    vibrate('light');
    addXp(10);
    
    toast({
      title: "Proprietário seguido!",
      description: "Agora receberá atualizações deste utilizador. +10 XP ganhos",
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

    vibrate('light');
    
    toast({
      title: "Chat aberto!",
      description: "Pode enviar uma mensagem privada ao proprietário",
    });
  };

  const handleMakeOffer = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para fazer ofertas.",
        variant: "destructive"
      });
      return;
    }

    vibrate('light');
    
    toast({
      title: "Sistema de Ofertas",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'bg-gray-100 text-gray-800';
      case 'Incomum': return 'bg-green-100 text-green-800';
      case 'Raro': return 'bg-blue-100 text-blue-800';
      case 'Épico': return 'bg-purple-100 text-purple-800';
      case 'Lendário': return 'bg-yellow-100 text-yellow-800';
      case 'Marco Histórico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return <Star className="h-4 w-4" />;
      case 'Incomum': return <Star className="h-4 w-4" />;
      case 'Raro': return <Sparkles className="h-4 w-4" />;
      case 'Épico': return <Crown className="h-4 w-4" />;
      case 'Lendário': return <Trophy className="h-4 w-4" />;
      case 'Marco Histórico': return <Award className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
             <SoundEffect src={SOUND_EFFECTS.CLICK} play={playSound} onEnd={() => setPlaySound(false)} />
       <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
       
       {/* Modal de Bookmark Inteligente */}
       <Dialog open={showBookmarkModal} onOpenChange={setShowBookmarkModal}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle>Guardar Pixel</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div>
               <label className="text-sm font-medium">Categoria</label>
               <select
                 value={bookmarkCategory}
                 onChange={(e) => setBookmarkCategory(e.target.value)}
                 className="w-full p-2 border rounded-md mt-1"
               >
                 <option value="investimento">Investimento</option>
                 <option value="arte">Arte Digital</option>
                 <option value="colecao">Coleção</option>
                 <option value="interesse">Interesse Geral</option>
                 <option value="monitorizar">Monitorizar</option>
               </select>
             </div>
             <div>
               <label className="text-sm font-medium">Nota (opcional)</label>
               <textarea
                 value={bookmarkNote}
                 onChange={(e) => setBookmarkNote(e.target.value)}
                 placeholder="Adicione uma nota sobre este pixel..."
                 className="w-full p-2 border rounded-md mt-1 resize-none"
                 rows={3}
                 maxLength={200}
               />
             </div>
             <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={() => setShowBookmarkModal(false)}>
                 Cancelar
               </Button>
               <Button onClick={handleSaveBookmark}>
                 Guardar
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
      
      <DialogContent className="w-[95vw] h-[92vh] max-w-none max-h-none m-0 p-0 rounded-2xl border-2 border-primary/30 bg-background/98 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold">
                  {pixelData.title || `Pixel (${pixelData.x}, ${pixelData.y})`}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {pixelData.region}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("flex items-center gap-1", getRarityColor(pixelData.rarity))}>
                {getRarityIcon(pixelData.rarity)}
                {pixelData.rarity}
              </Badge>
              {pixelData.isProtected && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Protegido
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Pixel Preview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <div 
                      className="w-24 h-24 rounded-lg border-4 border-primary shadow-lg"
                      style={{ backgroundColor: pixelData.color || '#3b82f6' }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Informações Básicas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5" />
                    Informações do Pixel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Coordenadas</label>
                      <p className="text-lg font-semibold">({pixelData.x}, {pixelData.y})</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Preço</label>
                      <p className="text-lg font-semibold text-primary">
                        {pixelData.price} €
                        {pixelData.specialCreditsPrice && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({pixelData.specialCreditsPrice} créditos)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {pixelData.gpsCoords && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">GPS</label>
                      <p className="text-sm">
                        {pixelData.gpsCoords.lat.toFixed(6)}, {pixelData.gpsCoords.lon.toFixed(6)}
                      </p>
                    </div>
                  )}

                  {pixelData.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                      <p className="text-sm">{pixelData.description}</p>
                    </div>
                  )}

                  {pixelData.tags && pixelData.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {pixelData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

                             {/* Estatísticas e Avaliações */}
               <Card>
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <Globe className="h-5 w-5" />
                     Estatísticas e Avaliações
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 gap-6">
                     {/* Estatísticas */}
                     <div className="space-y-4">
                       <h4 className="font-medium text-sm">Estatísticas</h4>
                       <div className="grid grid-cols-3 gap-4 text-center">
                         <div className="space-y-2">
                           <div className="flex items-center justify-center gap-1">
                             <Eye className="h-4 w-4 text-blue-500" />
                             <span className="text-lg font-semibold">{views.toLocaleString()}</span>
                           </div>
                           <p className="text-xs text-muted-foreground">Visualizações</p>
                         </div>
                         <div className="space-y-2">
                           <div className="flex items-center justify-center gap-1">
                             <Heart className="h-4 w-4 text-red-500" />
                             <span className="text-lg font-semibold">{likes.toLocaleString()}</span>
                           </div>
                           <p className="text-xs text-muted-foreground">Gostos</p>
                         </div>
                         <div className="space-y-2">
                           <div className="flex items-center justify-center gap-1">
                             <MessageCircle className="h-4 w-4 text-green-500" />
                             <span className="text-lg font-semibold">{comments.length}</span>
                           </div>
                           <p className="text-xs text-muted-foreground">Comentários</p>
                         </div>
                       </div>
                     </div>

                     {/* Avaliações */}
                     <div className="space-y-4">
                       <h4 className="font-medium text-sm">Avaliação</h4>
                       <div className="text-center">
                         <div className="flex items-center justify-center gap-1 mb-2">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <button
                               key={star}
                               onClick={() => handleRating(star)}
                               onMouseEnter={() => setHoverRating(star)}
                               onMouseLeave={() => setHoverRating(0)}
                               className="text-2xl transition-colors"
                             >
                               <Star 
                                 className={cn(
                                   "h-6 w-6",
                                   (hoverRating >= star || userRating >= star) 
                                     ? "fill-yellow-400 text-yellow-400" 
                                     : "text-gray-300"
                                 )} 
                               />
                             </button>
                           ))}
                         </div>
                         <p className="text-sm text-muted-foreground">
                           {pixelData.rating ? (
                             <>
                               <span className="font-semibold">{pixelData.rating.toFixed(1)}</span> / 5 
                               ({pixelData.totalRatings || 0} avaliações)
                             </>
                           ) : (
                             "Seja o primeiro a avaliar!"
                           )}
                         </p>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>

              {/* Proprietário */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    {pixelData.owner ? 'Proprietário' : 'Disponível para Compra'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                                     {pixelData.owner ? (
                     <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <Avatar className="h-12 w-12">
                           <AvatarImage src={pixelData.owner.avatar} />
                           <AvatarFallback>{pixelData.owner.name[0]}</AvatarFallback>
                         </Avatar>
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h3 className="font-semibold">{pixelData.owner.name}</h3>
                             {pixelData.owner.verified && (
                               <Badge variant="secondary" className="text-xs">
                                 Verificado
                               </Badge>
                             )}
                           </div>
                           <p className="text-sm text-muted-foreground">
                             Nível {pixelData.owner.level} • {pixelData.owner.totalPixels} pixels • {pixelData.owner.totalValue}€
                           </p>
                           <div className="flex flex-wrap gap-1 mt-2">
                             {pixelData.owner.badges.map((badge, index) => (
                               <Badge key={index} variant="outline" className="text-xs">
                                 {badge}
                               </Badge>
                             ))}
                           </div>
                         </div>
                       </div>
                       
                       {/* Ações Sociais */}
                       <div className="flex items-center gap-2 pt-2 border-t">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={handleFollowOwner}
                           className="text-xs"
                         >
                           <User className="h-3 w-3 mr-1" />
                           Seguir
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={handleSendMessage}
                           className="text-xs"
                         >
                           <MessageCircle className="h-3 w-3 mr-1" />
                           Mensagem
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={handleMakeOffer}
                           className="text-xs"
                         >
                           <Coins className="h-3 w-3 mr-1" />
                           Oferta
                         </Button>
                       </div>
                     </div>
                                     ) : (
                     <div className="text-center py-4">
                       <Unlock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                       <p className="text-sm text-muted-foreground mb-4">
                         Este pixel ainda não tem proprietário. Seja o primeiro a adquiri-lo!
                       </p>
                       <Button 
                         onClick={onPurchase}
                         className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                         size="lg"
                       >
                         <ShoppingCart className="h-4 w-4 mr-2" />
                         Comprar Pixel por {pixelData.price}€
                         {pixelData.specialCreditsPrice && (
                           <span className="ml-2 text-sm opacity-90">
                             ({pixelData.specialCreditsPrice} créditos)
                           </span>
                         )}
                       </Button>
                     </div>
                   )}
                </CardContent>
              </Card>

                             {/* Informações Enriquecidas */}
               <Card>
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <Sparkles className="h-5 w-5" />
                     Análise Avançada
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   {/* Gráfico de Valorização Simulado */}
                   <div className="space-y-2">
                     <h4 className="font-medium text-sm">Histórico de Preços</h4>
                     <div className="h-20 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded-lg p-3 relative">
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-xs text-muted-foreground">
                           Gráfico de valorização (últimos 30 dias)
                         </div>
                       </div>
                       <div className="absolute bottom-2 right-2 text-xs font-medium text-green-600">
                         +15% este mês
                       </div>
                     </div>
                   </div>

                   {/* Comparação com Pixels Similares */}
                   <div className="space-y-2">
                     <h4 className="font-medium text-sm">Pixels Similares</h4>
                     <div className="grid grid-cols-2 gap-2">
                       <div className="p-2 bg-muted/30 rounded text-xs">
                         <div className="font-medium">Mesma região</div>
                         <div className="text-muted-foreground">Média: 3.50€</div>
                       </div>
                       <div className="p-2 bg-muted/30 rounded text-xs">
                         <div className="font-medium">Mesma raridade</div>
                         <div className="text-muted-foreground">Média: 2.80€</div>
                       </div>
                     </div>
                   </div>

                   {/* Previsão de Valorização */}
                   <div className="space-y-2">
                     <h4 className="font-medium text-sm">Previsão IA</h4>
                     <div className="p-3 bg-blue-50 rounded-lg">
                       <div className="flex items-center gap-2 mb-1">
                         <Brain className="h-4 w-4 text-blue-600" />
                         <span className="text-sm font-medium text-blue-800">Tendência Positiva</span>
                       </div>
                       <p className="text-xs text-blue-700">
                         Baseado na localização e atividade, este pixel pode valorizar 20-30% nos próximos 6 meses.
                       </p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               {/* Histórico Resumido */}
               <Card>
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <History className="h-5 w-5" />
                     Histórico
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-2">
                     {mockHistory.slice(0, 3).map((item, index) => (
                       <div key={index} className="flex items-center gap-2 text-sm">
                         <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                         <span className="font-medium">{item.action}</span>
                         <span className="text-muted-foreground">•</span>
                         <span className="text-muted-foreground">{item.user}</span>
                         <span className="text-muted-foreground">•</span>
                         <span className="text-muted-foreground">{formatDate(new Date(item.date))}</span>
                         {item.price && (
                           <>
                             <span className="text-muted-foreground">•</span>
                             <span className="text-primary font-medium">{item.price}€</span>
                           </>
                         )}
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>

                             {/* Comentários Melhorados */}
               <Card>
                 <CardHeader className="pb-3">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <MessageCircle className="h-5 w-5" />
                     Comentários ({comments.length})
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   {/* Adicionar Comentário */}
                   <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                     <div className="flex gap-2">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user?.photoURL || 'https://placehold.co/40x40.png'} />
                         <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                       </Avatar>
                       <div className="flex-1">
                         <textarea
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           placeholder="Adicione um comentário..."
                           className="w-full p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                           rows={2}
                           maxLength={500}
                         />
                         <div className="flex items-center justify-between mt-2">
                           <span className="text-xs text-muted-foreground">
                             {newComment.length}/500
                           </span>
                           <Button
                             onClick={handleAddComment}
                             disabled={!newComment.trim() || isAddingComment}
                             size="sm"
                             className="text-xs"
                           >
                             {isAddingComment ? 'A adicionar...' : 'Comentar'}
                           </Button>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Lista de Comentários */}
                   <div className="space-y-3">
                     {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                       <div key={comment.id} className="flex gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={comment.author.avatar} />
                           <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                         </Avatar>
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="font-medium text-sm">{comment.author.name}</span>
                             {comment.author.isOwner && (
                               <Badge variant="secondary" className="text-xs">
                                 Proprietário
                               </Badge>
                             )}
                             {comment.author.verified && (
                               <Badge variant="outline" className="text-xs">
                                 Verificado
                               </Badge>
                             )}
                             <span className="text-xs text-muted-foreground">
                               {timeAgo(comment.timestamp)}
                             </span>
                           </div>
                           <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                           <div className="flex items-center gap-4">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleLikeComment(comment.id)}
                               className={cn("text-xs", comment.isLiked && "text-red-500")}
                             >
                               <Heart className={cn("h-3 w-3 mr-1", comment.isLiked && "fill-current")} />
                               {comment.likes}
                             </Button>
                             <Button variant="ghost" size="sm" className="text-xs">
                               <MessageCircle className="h-3 w-3 mr-1" />
                               Responder
                             </Button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Ver Mais Comentários */}
                   {comments.length > 3 && (
                     <div className="mt-4 text-center">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setShowAllComments(!showAllComments)}
                       >
                         {showAllComments ? 'Ver Menos' : `Ver Todos os ${comments.length} Comentários`}
                       </Button>
                     </div>
                   )}
                 </CardContent>
               </Card>
            </div>
          </ScrollArea>

                     {/* Footer Actions Melhorado */}
           <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-accent/5">
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handleLike}
                   className={cn(isLiked && "text-red-500 border-red-500")}
                 >
                   <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                   {likes}
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleBookmark}
                   className={cn(isBookmarked && "text-blue-500 border-blue-500")}
                 >
                   <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                 </Button>
                 <Button variant="outline" size="sm" onClick={handleShare}>
                   <Share2 className="h-4 w-4" />
                 </Button>
                 <div className="relative group">
                   <Button variant="outline" size="sm">
                     <Share2 className="h-4 w-4" />
                   </Button>
                   <div className="absolute bottom-full right-0 mb-2 bg-background border rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                     <div className="flex flex-col gap-1 text-xs">
                       <button
                         onClick={() => handleShareToSocial('whatsapp')}
                         className="flex items-center gap-2 p-1 hover:bg-muted rounded"
                       >
                         <div className="w-3 h-3 bg-green-500 rounded" />
                         WhatsApp
                       </button>
                       <button
                         onClick={() => handleShareToSocial('facebook')}
                         className="flex items-center gap-2 p-1 hover:bg-muted rounded"
                       >
                         <div className="w-3 h-3 bg-blue-500 rounded" />
                         Facebook
                       </button>
                       <button
                         onClick={() => handleShareToSocial('twitter')}
                         className="flex items-center gap-2 p-1 hover:bg-muted rounded"
                       >
                         <div className="w-3 h-3 bg-blue-400 rounded" />
                         Twitter
                       </button>
                       <button
                         onClick={() => handleShareToSocial('email')}
                         className="flex items-center gap-2 p-1 hover:bg-muted rounded"
                       >
                         <div className="w-3 h-3 bg-gray-500 rounded" />
                         Email
                       </button>
                     </div>
                   </div>
                 </div>
                 <Button variant="outline" size="sm">
                   <MessageCircle className="h-4 w-4" />
                   {comments.length}
                 </Button>
               </div>
               
               <div className="flex items-center gap-2">
                 {pixelData.isOwnedByCurrentUser && onEdit && (
                   <Button variant="outline" size="sm" onClick={onEdit}>
                     <Edit className="h-4 w-4 mr-2" />
                     Editar
                   </Button>
                 )}
                 <Button variant="outline" size="sm">
                   <Globe className="h-4 w-4 mr-2" />
                   Ver no Mapa
                 </Button>
               </div>
             </div>
             
             {/* Botão de Compra Principal */}
             {(!pixelData.owner || !pixelData.isOwnedByCurrentUser) && (
               <Button 
                 onClick={onPurchase}
                 className="w-full bg-primary text-primary-foreground h-12 text-lg font-semibold hover:bg-primary/90 transition-colors"
                 size="lg"
               >
                 <ShoppingCart className="h-5 w-5 mr-2" />
                 Comprar Pixel por {pixelData.price}€
                 {pixelData.specialCreditsPrice && (
                   <span className="ml-2 text-sm opacity-90">
                     ({pixelData.specialCreditsPrice} créditos)
                   </span>
                 )}
               </Button>
             )}
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
