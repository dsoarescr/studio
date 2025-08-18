'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, MessageSquare, 
  ChevronLeft, ChevronRight, X, Camera, Mic, Type, Palette,
  Download, Upload, Sparkles, Crown, Star, MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PixelStory {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  pixel: {
    x: number;
    y: number;
    region: string;
    color: string;
  };
  content: {
    type: 'image' | 'video' | 'text' | 'timelapse';
    url?: string;
    text?: string;
    duration?: number;
  };
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  music?: {
    title: string;
    artist: string;
  };
}

interface PixelStoriesProps {
  children: React.ReactNode;
  initialStories?: PixelStory[];
}

const mockStories: PixelStory[] = [
  {
    id: '1',
    author: {
      name: 'PixelArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 15
    },
    pixel: {
      x: 245,
      y: 156,
      region: 'Lisboa',
      color: '#D4A757'
    },
    content: {
      type: 'timelapse',
      url: 'https://placehold.co/400x600/D4A757/FFFFFF?text=Timelapse',
      duration: 15
    },
    timestamp: '2h',
    views: 1234,
    likes: 89,
    comments: 23,
    isLiked: false,
    music: {
      title: 'Pixel Dreams',
      artist: 'Digital Beats'
    }
  },
  {
    id: '2',
    author: {
      name: 'ColorMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 12
    },
    pixel: {
      x: 123,
      y: 89,
      region: 'Porto',
      color: '#7DF9FF'
    },
    content: {
      type: 'image',
      url: 'https://placehold.co/400x600/7DF9FF/000000?text=Pixel+Art',
      duration: 5
    },
    timestamp: '4h',
    views: 567,
    likes: 45,
    comments: 12,
    isLiked: true
  },
  {
    id: '3',
    author: {
      name: 'StoryTeller',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 20
    },
    pixel: {
      x: 300,
      y: 200,
      region: 'Coimbra',
      color: '#FF6B6B'
    },
    content: {
      type: 'text',
      text: 'Este pixel representa a minha jornada no Pixel Universe! 🎨✨',
      duration: 8
    },
    timestamp: '6h',
    views: 890,
    likes: 67,
    comments: 34,
    isLiked: false
  }
];

export default function PixelStories({ children, initialStories = mockStories }: PixelStoriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stories, setStories] = useState(initialStories);
  const [isCreating, setIsCreating] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const currentStory = stories[currentStoryIndex];
  const duration = currentStory?.content.duration || 5;

  useEffect(() => {
    if (isOpen && isPlaying && !isCreating) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (duration * 10));
          if (newProgress >= 100) {
            nextStory();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isOpen, isPlaying, currentStoryIndex, duration, isCreating]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsOpen(false);
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setStories(prev => prev.map((story, index) => 
      index === currentStoryIndex 
        ? { 
            ...story, 
            isLiked: !story.isLiked,
            likes: story.isLiked ? story.likes - 1 : story.likes + 1
          }
        : story
    ));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pixel Story de ${currentStory.author.name}`,
        text: `Confira esta história incrível do pixel (${currentStory.pixel.x}, ${currentStory.pixel.y})!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "Link da história copiado para a área de transferência.",
      });
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setIsPlaying(false);
  };

  const renderStoryContent = () => {
    if (!currentStory) return null;

    switch (currentStory.content.type) {
      case 'image':
        return (
          <img 
            src={currentStory.content.url} 
            alt="Pixel Story"
            className="w-full h-full object-cover"
          />
        );
      
      case 'video':
      case 'timelapse':
        return (
          <video
            src={currentStory.content.url}
            className="w-full h-full object-cover"
            autoPlay={isPlaying}
            muted={isMuted}
            loop
          />
        );
      
      case 'text':
        return (
          <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mx-auto mb-4"
                style={{ backgroundColor: currentStory.pixel.color }}
              />
              <p className="text-white text-xl font-medium leading-relaxed">
                {currentStory.content.text}
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                           index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-4 right-4 z-40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={currentStory.author.avatar} />
                <AvatarFallback>{currentStory.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{currentStory.author.name}</span>
                  {currentStory.author.verified && (
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  )}
                  <Badge variant="secondary" className="text-xs">
                    Nível {currentStory.author.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span>({currentStory.pixel.x}, {currentStory.pixel.y}) • {currentStory.pixel.region}</span>
                  <span>• {currentStory.timestamp}</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
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
                {renderStoryContent()}
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
              onClick={togglePlayPause}
            />
            <div 
              className="flex-1 cursor-pointer"
              onClick={nextStory}
            />
          </div>

          {/* Music info */}
          {currentStory.music && (
            <div className="absolute bottom-20 left-4 right-4 z-40">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <p className="text-sm font-medium">{currentStory.music.title}</p>
                  <p className="text-xs text-white/80">{currentStory.music.artist}</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={cn(
                  "text-white hover:bg-white/20",
                  currentStory.isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", currentStory.isLiked && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
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

          {/* Story stats */}
          <div className="absolute bottom-12 right-4 z-40 text-right text-white/80 text-xs">
            <p>{currentStory.views.toLocaleString()} visualizações</p>
            <p>{currentStory.likes} likes • {currentStory.comments} comentários</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}