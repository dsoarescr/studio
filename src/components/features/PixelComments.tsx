'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Flag,
  Star,
  ThumbsUp,
  Reply,
  Edit,
  Trash2,
  Image as ImageIcon,
  Smile,
} from 'lucide-react';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
    isVerified: boolean;
  };
  content: string;
  rating: number;
  images?: string[];
  timestamp: Date;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
  isEdited: boolean;
}

interface PixelCommentsProps {
  pixelId: string;
  currentUserId?: string;
}

export function PixelComments({ pixelId, currentUserId }: PixelCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Maria Oliveira',
        avatar: '/avatars/user1.jpg',
        reputation: 850,
        isVerified: true,
      },
      content:
        'Localização incrível! A vista para o rio é espetacular e o pixel tem um potencial enorme de valorização.',
      rating: 5,
      images: ['/comments/image1.jpg'],
      timestamp: new Date('2024-03-15T10:30:00'),
      likes: 24,
      replies: [
        {
          id: '1.1',
          user: {
            id: 'user2',
            name: 'João Santos',
            avatar: '/avatars/user2.jpg',
            reputation: 420,
            isVerified: false,
          },
          content:
            'Concordo totalmente! Já vi vários pixels nesta região e este é realmente especial.',
          rating: 0,
          timestamp: new Date('2024-03-15T11:15:00'),
          likes: 8,
          replies: [],
          isLiked: false,
          isEdited: false,
        },
      ],
      isLiked: true,
      isEdited: false,
    },
    {
      id: '2',
      user: {
        id: 'user3',
        name: 'Pedro Costa',
        avatar: '/avatars/user3.jpg',
        reputation: 1200,
        isVerified: true,
      },
      content:
        'Excelente investimento! Comprei um pixel próximo há 6 meses e a valorização foi surpreendente.',
      rating: 4,
      timestamp: new Date('2024-03-14T15:45:00'),
      likes: 16,
      replies: [],
      isLiked: false,
      isEdited: true,
    },
  ]);

  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { toast } = useToast();

  const handleLike = (commentId: string) => {
    setComments(prevComments => {
      const updateComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComment(comment.replies),
            };
          }
          return comment;
        });
      };
      return updateComment(prevComments);
    });
  };

  const handleReply = (commentId: string) => {
    if (!currentUserId) {
      toast({
        title: 'Autenticação Necessária',
        description: 'Faça login para responder aos comentários',
        variant: 'destructive',
      });
      return;
    }
    setShowReplyForm(commentId);
  };

  const submitReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      user: {
        id: currentUserId || 'anonymous',
        name: 'Usuário Atual',
        avatar: '/avatars/default.jpg',
        reputation: 0,
        isVerified: false,
      },
      content: replyContent,
      rating: 0,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      isLiked: false,
      isEdited: false,
    };

    setComments(prevComments => {
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReply(comment.replies),
            };
          }
          return comment;
        });
      };
      return addReply(prevComments);
    });

    setReplyContent('');
    setShowReplyForm(null);
    toast({
      title: 'Resposta Enviada',
      description: 'Sua resposta foi publicada com sucesso!',
    });
  };

  const submitNewComment = () => {
    if (!currentUserId) {
      toast({
        title: 'Autenticação Necessária',
        description: 'Faça login para comentar',
        variant: 'destructive',
      });
      return;
    }

    if (!newCommentContent.trim() || newCommentRating === 0) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Preencha o comentário e a avaliação',
        variant: 'destructive',
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        id: currentUserId,
        name: 'Usuário Atual',
        avatar: '/avatars/default.jpg',
        reputation: 0,
        isVerified: false,
      },
      content: newCommentContent,
      rating: newCommentRating,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      isLiked: false,
      isEdited: false,
      images: selectedImages.map(file => URL.createObjectURL(file)),
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentContent('');
    setNewCommentRating(0);
    setSelectedImages([]);
    setShowCommentForm(false);
    toast({
      title: 'Comentário Publicado',
      description: 'Seu comentário foi publicado com sucesso!',
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 3) {
      toast({
        title: 'Limite de Imagens',
        description: 'Você pode enviar no máximo 3 imagens',
        variant: 'destructive',
      });
      return;
    }
    setSelectedImages(files);
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? 'ml-8 border-l pl-4' : ''}`}
    >
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.user.name}</span>
                    {comment.user.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Verificado
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {comment.user.reputation} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.timestamp.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {comment.isEdited && ' (editado)'}
                  </p>
                </div>

                {comment.rating > 0 && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < comment.rating
                            ? 'fill-current text-yellow-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-2">{comment.content}</p>

              {comment.images && comment.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {comment.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(comment.id)}
                  className={comment.isLiked ? 'text-primary' : ''}
                >
                  <Heart className={`mr-1 h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                  {comment.likes}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleReply(comment.id)}>
                  <Reply className="mr-1 h-4 w-4" />
                  Responder
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      Denunciar
                    </DropdownMenuItem>
                    {comment.user.id === currentUserId && (
                      <>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {showReplyForm === comment.id && (
                <div className="mt-4">
                  <Textarea
                    placeholder="Escreva sua resposta..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowReplyForm(null)}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={() => submitReply(comment.id)}>
                      Responder
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {comment.replies.map(reply => renderComment(reply, depth + 1))}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          {comments.length} Comentário{comments.length !== 1 ? 's' : ''}
        </h3>
        <Button onClick={() => setShowCommentForm(true)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Adicionar Comentário
        </Button>
      </div>

      <Dialog open={showCommentForm} onOpenChange={setShowCommentForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Comentário</DialogTitle>
            <DialogDescription>
              Compartilhe sua experiência e avaliação sobre este pixel
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Sua Avaliação</label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewCommentRating(i + 1)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < newCommentRating
                          ? 'fill-current text-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Seu Comentário</label>
              <Textarea
                placeholder="Compartilhe sua experiência..."
                value={newCommentContent}
                onChange={e => setNewCommentContent(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Adicionar Imagens (opcional)</label>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="w-full" asChild>
                  <label>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Escolher Imagens
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </Button>
              </div>
              {selectedImages.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedImages.length} imagem(ns) selecionada(s)
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCommentForm(false)}>
                Cancelar
              </Button>
              <Button onClick={submitNewComment}>Publicar Comentário</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">{comments.map(comment => renderComment(comment))}</div>
    </div>
  );
}
