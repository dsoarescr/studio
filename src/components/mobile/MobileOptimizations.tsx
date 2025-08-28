'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  pressDelay?: number;
  longPressDelay?: number;
  disabled?: boolean;
}

interface SwipeActionProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  disabled?: boolean;
}

interface PullToRefreshProps {
  children: React.ReactNode;
  className?: string;
  onRefresh: () => Promise<void>;
  pullDistance?: number;
  loadingText?: string;
}

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[];
}

export function TouchFeedback({
  children,
  className,
  onPress,
  onLongPress,
  pressDelay = 0,
  longPressDelay = 500,
  disabled = false
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    if (disabled) return;

    setIsPressed(true);

    if (onPress) {
      const timer = setTimeout(() => {
        onPress();
      }, pressDelay);
      setPressTimer(timer);
    }

    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
      setLongPressTimer(timer);
    }
  };

  const handlePressEnd = () => {
    if (disabled) return;

    setIsPressed(false);

    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <motion.div
      className={cn("touch-none", className)}
      animate={{
        scale: isPressed ? 0.95 : 1,
        opacity: isPressed ? 0.9 : 1
      }}
      transition={{ duration: 0.1 }}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
    >
      {children}
    </motion.div>
  );
}

export function SwipeAction({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  disabled = false
}: SwipeActionProps) {
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = () => {
    if (disabled) return;

    if (dragX < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (dragX > threshold && onSwipeRight) {
      onSwipeRight();
    }

    setDragX(0);
  };

  return (
    <motion.div
      className={cn("touch-none", className)}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDrag={(_, info) => setDragX(info.offset.x)}
      onDragEnd={handleDragEnd}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

export function PullToRefresh({
  children,
  className,
  onRefresh,
  pullDistance = 100,
  loadingText = 'Atualizando...'
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePull = async (_, info: any) => {
    const pull = Math.max(0, info.offset.y);
    const progress = Math.min(1, pull / pullDistance);
    setPullProgress(progress);
    setIsPulling(true);

    if (pull >= pullDistance && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const handlePullEnd = () => {
    setIsPulling(false);
    setPullProgress(0);
  };

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={handlePull}
      onDragEnd={handlePullEnd}
    >
      {/* Indicador de Pull */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary/10 overflow-hidden"
        animate={{
          height: isPulling || isRefreshing ? Math.max(pullProgress * pullDistance, isRefreshing ? 50 : 0) : 0
        }}
      >
        <motion.div
          animate={{
            rotate: isRefreshing ? 360 : pullProgress * 180
          }}
          transition={{
            duration: isRefreshing ? 1 : 0,
            repeat: isRefreshing ? Infinity : 0
          }}
        >
          {isRefreshing ? '↻' : '↓'}
        </motion.div>
        {isRefreshing && <span className="ml-2">{loadingText}</span>}
      </motion.div>

      {children}
    </motion.div>
  );
}

export function BottomSheet({
  children,
  className,
  isOpen,
  onClose,
  snapPoints = [0, 50, 100]
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);

  const handleDragEnd = (_, info: any) => {
    const velocity = info.velocity.y;
    const position = info.point.y;

    // Determinar o ponto de snap mais próximo
    const snapPoint = snapPoints.reduce((prev, curr) => {
      const prevDiff = Math.abs(position - prev);
      const currDiff = Math.abs(position - curr);
      return prevDiff < currDiff ? prev : curr;
    });

    // Se a velocidade for alta, fechar ou abrir completamente
    if (Math.abs(velocity) > 500) {
      if (velocity > 0) {
        onClose();
      } else {
        setCurrentSnap(Math.max(...snapPoints));
      }
    } else {
      setCurrentSnap(snapPoint);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50",
              className
            )}
            initial={{ y: '100%' }}
            animate={{ y: `${100 - currentSnap}%` }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Indicador de Arrasto */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-3" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface DoubleTapProps {
  children: React.ReactNode;
  className?: string;
  onDoubleTap: () => void;
  threshold?: number;
}

export function DoubleTap({
  children,
  className,
  onDoubleTap,
  threshold = 300
}: DoubleTapProps) {
  const [lastTap, setLastTap] = useState(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap < threshold) {
      onDoubleTap();
    }
    setLastTap(now);
  };

  return (
    <motion.div
      className={cn("touch-none", className)}
      onTouchStart={handleTap}
      onMouseDown={handleTap}
    >
      {children}
    </motion.div>
  );
}

export const MobileOptimizations = {
  TouchFeedback,
  SwipeAction,
  PullToRefresh,
  BottomSheet,
  DoubleTap
};

export default MobileOptimizations;