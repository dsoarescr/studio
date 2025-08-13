'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Heart, Bookmark, Share2, ShoppingCart, Zap } from 'lucide-react';

interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch';
  direction?: 'up' | 'down' | 'left' | 'right';
  callback: (data?: any) => void;
}

interface MobileTouchGesturesProps {
  children: React.ReactNode;
  gestures: TouchGesture[];
  disabled?: boolean;
  className?: string;
}

export default function MobileTouchGestures({
  children,
  gestures,
  disabled = false,
  className = ''
}: MobileTouchGesturesProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [gestureIndicator, setGestureIndicator] = useState<string | null>(null);
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  
  const { toast } = useToast();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    const now = Date.now();
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    };
    
    setIsPressed(true);
    
    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      const longPressGesture = gestures.find(g => g.type === 'long-press');
      if (longPressGesture) {
        setGestureIndicator('long-press');
        longPressGesture.callback();
        
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }
    }, 500);
    
    // Check for double tap
    if (now - lastTapRef.current < 300) {
      const doubleTapGesture = gestures.find(g => g.type === 'double-tap');
      if (doubleTapGesture) {
        setGestureIndicator('double-tap');
        doubleTapGesture.callback();
        
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }
    
    lastTapRef.current = now;
  }, [disabled, gestures]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    
    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Detect swipe direction
    if (distance > 50) {
      let direction: 'up' | 'down' | 'left' | 'right';
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      const swipeGesture = gestures.find(g => g.type === 'swipe' && g.direction === direction);
      if (swipeGesture) {
        setGestureIndicator(`swipe-${direction}`);
      }
    }
  }, [disabled, gestures]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - touchStartRef.current.time;
    
    // Handle swipe
    if (distance > 50 && duration < 500) {
      let direction: 'up' | 'down' | 'left' | 'right';
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      const swipeGesture = gestures.find(g => g.type === 'swipe' && g.direction === direction);
      if (swipeGesture) {
        swipeGesture.callback({ direction, distance, duration });
        
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
      }
    } else if (distance < 10 && duration < 300) {
      // Handle tap
      const tapGesture = gestures.find(g => g.type === 'tap');
      if (tapGesture) {
        tapGesture.callback();
      }
    }
    
    // Clear gesture indicator
    setTimeout(() => setGestureIndicator(null), 1000);
    touchStartRef.current = null;
  }, [disabled, gestures]);

  const getGestureIcon = (gesture: string) => {
    switch (gesture) {
      case 'swipe-left':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'swipe-right':
        return <Bookmark className="h-6 w-6 text-blue-500" />;
      case 'swipe-up':
        return <Share2 className="h-6 w-6 text-green-500" />;
      case 'swipe-down':
        return <ShoppingCart className="h-6 w-6 text-primary" />;
      case 'long-press':
        return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'double-tap':
        return <Zap className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const getGestureLabel = (gesture: string) => {
    switch (gesture) {
      case 'swipe-left':
        return 'Curtir';
      case 'swipe-right':
        return 'Favoritar';
      case 'swipe-up':
        return 'Partilhar';
      case 'swipe-down':
        return 'Comprar';
      case 'long-press':
        return 'Menu';
      case 'double-tap':
        return 'Zoom';
      default:
        return '';
    }
  };

  return (
    <div 
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        animate={{
          scale: isPressed ? 0.98 : 1
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>
      
      {/* Gesture Indicator */}
      {gestureIndicator && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-full p-4 flex flex-col items-center gap-2">
            {getGestureIcon(gestureIndicator)}
            <span className="text-white text-sm font-medium">
              {getGestureLabel(gestureIndicator)}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}