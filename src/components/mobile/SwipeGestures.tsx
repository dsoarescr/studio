'use client';

import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Bookmark, Heart, Share2, ShoppingCart, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Lucide imports removed

interface SwipeAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  action: () => void;
  threshold: number;
}

interface SwipeGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  upAction?: SwipeAction;
  downAction?: SwipeAction;
  disabled?: boolean;
  className?: string;
}

export default function SwipeGestures({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  leftAction,
  rightAction,
  upAction,
  downAction,
  disabled = false,
  className = '',
}: SwipeGesturesProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(
    null
  );
  const [actionTriggered, setActionTriggered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { toast } = useToast();

  // Transformações para feedback visual
  const rotateX = useTransform(y, [-100, 0, 100], [10, 0, -10]);
  const rotateY = useTransform(x, [-100, 0, 100], [-10, 0, 10]);
  const scale = useTransform([x, y], (values) => {
    const latestX = (values[0] as unknown as number) || 0;
    const latestY = (values[1] as unknown as number) || 0;
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);
    return Math.max(0.9, 1 - distance / 500);
  });

  const defaultActions: Record<string, SwipeAction> = {
    left: {
      id: 'like',
      icon: <Heart className="h-6 w-6" />,
      label: 'Curtir',
      color: 'text-red-500',
      threshold: 100,
      action: () => {
        toast({
          title: '❤️ Curtido!',
          description: 'Você curtiu este pixel.',
        });
      },
    },
    right: {
      id: 'bookmark',
      icon: <Bookmark className="h-6 w-6" />,
      label: 'Salvar',
      color: 'text-blue-500',
      threshold: 100,
      action: () => {
        toast({
          title: '🔖 Salvo!',
          description: 'Pixel adicionado aos seus favoritos.',
        });
      },
    },
    up: {
      id: 'share',
      icon: <Share2 className="h-6 w-6" />,
      label: 'Partilhar',
      color: 'text-green-500',
      threshold: 80,
      action: async () => {
        try {
          if (navigator.share) {
            await navigator.share({
              title: 'Pixel Universe',
              text: 'Confira este pixel incrível!',
              url: window.location.href,
            });
          } else {
            throw new Error('Web Share API not available.');
          }
        } catch (error) {
          console.error('Share failed:', error);
          // Fallback to clipboard
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: '📤 Partilhado!',
            description: 'Link copiado para a área de transferência.',
          });
        }
      },
    },
    down: {
      id: 'buy',
      icon: <ShoppingCart className="h-6 w-6" />,
      label: 'Comprar',
      color: 'text-primary',
      threshold: 80,
      action: () => {
        toast({
          title: '🛒 Compra Rápida',
          description: 'Abrindo opções de compra...',
        });
      },
    },
  };

  const actions = {
    left: leftAction || defaultActions.left,
    right: rightAction || defaultActions.right,
    up: upAction || defaultActions.up,
    down: downAction || defaultActions.down,
  };

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
    setActionTriggered(false);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const { offset } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    // Determinar direção principal
    if (absX > absY) {
      setSwipeDirection(offset.x > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(offset.y > 0 ? 'down' : 'up');
    }

    // Verificar se atingiu o threshold
    const currentAction = actions[swipeDirection || 'left'];
    const threshold = currentAction.threshold;

    if ((absX > threshold || absY > threshold) && !actionTriggered) {
      setActionTriggered(true);

      // Vibração háptica (se disponível)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    setIsDragging(false);
    const { offset, velocity } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    // Verificar se o gesto foi suficiente para triggerar ação
    const isSignificantSwipe =
      absX > 50 || absY > 50 || Math.abs(velocity.x) > 500 || Math.abs(velocity.y) > 500;

    if (isSignificantSwipe) {
      if (absX > absY) {
        // Swipe horizontal
        if (offset.x > 0) {
          actions.right.action();
          onSwipeRight?.();
        } else {
          actions.left.action();
          onSwipeLeft?.();
        }
      } else {
        // Swipe vertical
        if (offset.y > 0) {
          actions.down.action();
          onSwipeDown?.();
        } else {
          actions.up.action();
          onSwipeUp?.();
        }
      }
    }

    // Reset
    setSwipeDirection(null);
    setActionTriggered(false);
    x.set(0);
    y.set(0);
  };

  const renderSwipeIndicator = (direction: 'left' | 'right' | 'up' | 'down') => {
    const action = actions[direction];
    const isActive = swipeDirection === direction && actionTriggered;

    const positions = {
      left: 'left-4 top-1/2 -translate-y-1/2',
      right: 'right-4 top-1/2 -translate-y-1/2',
      up: 'top-4 left-1/2 -translate-x-1/2',
      down: 'bottom-4 left-1/2 -translate-x-1/2',
    };

    return (
      <motion.div
        key={direction}
        className={`absolute ${positions[direction]} pointer-events-none z-10`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: swipeDirection === direction ? (isActive ? 1 : 0.6) : 0,
          scale: swipeDirection === direction ? (isActive ? 1.2 : 1) : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`flex flex-col items-center gap-2 rounded-full border-2 bg-background/90 p-3 shadow-lg backdrop-blur-sm ${isActive ? 'border-primary bg-primary/20' : 'border-border'} `}
        >
          <div className={`${action.color} ${isActive ? 'animate-pulse' : ''}`}>{action.icon}</div>
          <span className="whitespace-nowrap text-xs font-medium">{action.label}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        drag={!disabled}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y,
          rotateX,
          rotateY,
          scale,
        }}
        whileTap={{ scale: 0.95 }}
        className="cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>

      {/* Indicadores de swipe */}
      {isDragging && (
        <>
          {renderSwipeIndicator('left')}
          {renderSwipeIndicator('right')}
          {renderSwipeIndicator('up')}
          {renderSwipeIndicator('down')}
        </>
      )}

      {/* Tutorial overlay (primeira vez) */}
      {!disabled && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-2 right-2 top-2">
            <div className="rounded-lg bg-black/60 p-2 text-center text-xs text-white backdrop-blur-sm">
              <Zap className="mr-1 inline h-3 w-3" />
              Deslize para ações rápidas
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook para gestos de swipe personalizados
export function useSwipeGestures(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe) onSwipeLeft?.();
      if (isRightSwipe) onSwipeRight?.();
    } else {
      // Vertical swipe
      if (isUpSwipe) onSwipeUp?.();
      if (isDownSwipe) onSwipeDown?.();
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
