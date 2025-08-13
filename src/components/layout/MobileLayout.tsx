'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import UserProfileHeader from './UserProfileHeader';
import BottomNavBar from './BottomNavBar';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, ShoppingCart, Palette, User, BarChart3, 
  Trophy, Settings, Crown, Users, Award, Zap
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    const handleResize = () => {
      checkOrientation();
      
      // Detect virtual keyboard on mobile
      if (isMobile) {
        const heightDiff = window.screen.height - window.innerHeight;
        setIsKeyboardVisible(heightDiff > 150);
      }
    };

    checkMobile();
    checkOrientation();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [isMobile]);

  // Show orientation change notification for map page
  useEffect(() => {
    if (isMobile && pathname === '/') {
      toast({
        title: orientation === 'landscape' ? "🔄 Modo Paisagem" : "📱 Modo Retrato",
        description: orientation === 'landscape' 
          ? "Perfeito para explorar o mapa de pixels!" 
          : "Ideal para navegar e interagir",
        duration: 2000
      });
    }
  }, [orientation, isMobile, toast, pathname]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-background via-background/98 to-primary/5">
      {/* Mobile Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 z-50"
      >
        <UserProfileHeader />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pt-14 pb-20">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>

        {/* Orientation Helper for Map */}
        {orientation === 'landscape' && pathname === '/' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium shadow-lg"
            >
              🗺️ Modo paisagem ativo - Perfeito para explorar pixels!
            </motion.div>
          </div>
        )}

        {/* Tutorial Hints */}
        {pathname === '/' && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-black/70 backdrop-blur-sm text-white rounded-xl px-4 py-3 text-center max-w-xs"
            >
              <Zap className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Toque para comprar pixels únicos!</p>
              <p className="text-xs text-white/80 mt-1">Deslize para ações rápidas</p>
            </motion.div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {!isKeyboardVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="flex-shrink-0 z-50"
          >
            <BottomNavBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Spacer */}
      {isKeyboardVisible && (
        <div className="h-4 bg-background" />
      )}
    </div>
  );
}