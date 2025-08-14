'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageSquare, Share2, Gift, Crown, Star, Users, 
  Send, Smile, Camera, Mic, Video, MapPin, Trophy, Zap,
  ThumbsUp, ThumbsDown, Laugh, Angry, Sad, Wow, Love
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  icon: React.ReactNode;
  color: string;
  label: string;
}

interface SocialInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
  isLiked: boolean;
  onLike: () => void;
  onComment: (comment: string) => void;
  onShare: () => void;
  onReaction: (reaction: string) => void;
  showComments?: boolean;
  className?: string;
}

const reactions: Reaction[] = [
  { type: 'like', icon: <ThumbsUp className="h-4 w-4" />, color: 'text-blue-500', label: 'Gosto' },
  { type: 'love', icon: <Heart className="h-4 w-4" />, color: 'text-red-500', label: 'Adoro' },
  { type: 'laugh', icon: <Laugh className="h-4 w-4" />, color: 'text-yellow-500', label: 'Engraçado' },
  { type: 'wow', icon: <Wow className="h-4 w-4" />, color: 'text-orange-500', label: 'Uau' },
  { type: 'sad', icon: <Sad className="h-4 w-4" />, color: 'text-blue-400', label: 'Triste' },
  { type: 'angry', icon: <Angry className="h-4 w-4" />, color: 'text-red-600', label: 'Irritado' }
];

export function SocialInteractions({
  postId,
  initialLikes,
  initialComments,
  initialShares,
  isLiked,
  onLike,
  onComment,
  onShare,
  onReaction,
  showComments = false,
  className
}: SocialInteractionsProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [liked, setLiked] = useState(isLiked);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleReactionClick = (reactionType: string) => {
    setSelectedReaction(reactionType);
    setShowReactions(false);
    onReaction(reactionType);
    
    const reaction = reactions.find(r => r.type === reactionType);
    toast({
      title: `${reaction?.label} Adicionado!`,
      description: "Sua reação foi registada.",
    });
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    
    setComments(prev => prev + 1);
    onComment(commentText);
    setCommentText('');
    setShowCommentInput(false);
    
    toast({
      title: "💬 Comentário Publicado!",
      description: "Seu comentário foi adicionado ao post.",
    });
  };

  const handleShareClick = () => {
    setShares(prev => prev + 1);
    onShare();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-6">
          {/* Like with Reactions */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeClick}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
              className={cn(
                "hover:scale-110 transition-transform touch-target p-2 group",
                liked ? 'text-red-500' : ''
              )}
            >
              <Heart className={cn(
                "h-6 w-6 transition-all duration-300 group-hover:scale-125",
                liked ? 'fill-current animate-pulse' : ''
              )} />
              <span className="ml-2 font-medium">{likes}</span>
            </Button>
            
            {/* Reactions Popup */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 z-50"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  <Card className="p-2 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
                    <div className="flex gap-1">
                      {reactions.map(reaction => (
                        <Button
                          key={reaction.type}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReactionClick(reaction.type)}
                          className={cn(
                            "p-2 hover:scale-125 transition-transform",
                            reaction.color
                          )}
                        >
                          {reaction.icon}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="hover:scale-110 transition-transform touch-target p-2 group"
          >
            <MessageSquare className="h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
            <span className="ml-2 font-medium">{comments}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareClick}
            className="hover:scale-110 transition-transform touch-target p-2 group"
          >
            <Share2 className="h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
            <span className="ml-2 font-medium">{shares}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:scale-110 transition-transform touch-target p-2 group"
          >
            <Gift className="h-6 w-6 group-hover:scale-125 transition-transform duration-300 text-yellow-500" />
          </Button>
        </div>
      </div>

      {/* Comment Input */}
      <AnimatePresence>
        {showCommentInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" />
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Escreva um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Comentar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook para interações sociais
export function useSocialInteractions() {
  const [interactions, setInteractions] = useState<Record<string, {
    likes: number;
    comments: number;
    shares: number;
    userLiked: boolean;
    userBookmarked: boolean;
  }>>({});

  const updateInteraction = (postId: string, type: 'like' | 'comment' | 'share' | 'bookmark') => {
    setInteractions(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [type === 'like' ? 'likes' : type === 'comment' ? 'comments' : 'shares']: 
          (prev[postId]?.[type === 'like' ? 'likes' : type === 'comment' ? 'comments' : 'shares'] || 0) + 1,
        ...(type === 'like' && { userLiked: !prev[postId]?.userLiked }),
        ...(type === 'bookmark' && { userBookmarked: !prev[postId]?.userBookmarked })
      }
    }));
  };

  return { interactions, updateInteraction };
}

// Componente para reações rápidas
export function QuickReactions({ 
  onReaction, 
  selectedReaction 
}: { 
  onReaction: (reaction: string) => void;
  selectedReaction?: string;
}) {
  return (
    <div className="flex gap-1 p-2 bg-background/95 backdrop-blur-sm rounded-full border shadow-lg">
      {reactions.map(reaction => (
        <Button
          key={reaction.type}
          variant="ghost"
          size="sm"
          onClick={() => onReaction(reaction.type)}
          className={cn(
            "p-2 hover:scale-125 transition-transform rounded-full",
            reaction.color,
            selectedReaction === reaction.type && "bg-primary/20 scale-110"
          )}
        >
          {reaction.icon}
        </Button>
      ))}
    </div>
  );
}