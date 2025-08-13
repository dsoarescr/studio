'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import UserProfileHeader from './UserProfileHeader';
import BottomNavBar from './BottomNavBar';
import { MobileNavigation } from '@/components/ui/mobile-navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, ShoppingCart, Palette, User, BarChart3, 
  Trophy, Settings, Crown, Users, Award
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const mobileNavItems = [
  { href: "/", label: "Início", icon: <Home />, color: "text-blue-500" },
  { href: "/marketplace", label: "Market", icon: <ShoppingCart />, color: "text-green-500" },
  { href: "/pixels", label: "Galeria", icon: <Palette />, badge: 3, color: "text-purple-500" },
  { href: "/member", label: "Perfil", icon: <User />, color: "text-orange-500" },
  { href: "/achievements", label: "Conquistas", icon: <Trophy />, badge: 2, color: "text-yellow-500" }
];

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

  // Show orientation change notification
  useEffect(() => {
    if (isMobile) {
      toast({
        title: orientation === 'landscape' ? "Modo Paisagem" : "Modo Retrato",
        description: orientation === 'landscape' 
          ? "Melhor experiência para visualizar o mapa" 
          : "Melhor experiência para navegação",
        duration: 2000
      });
    }
  }, [orientation, isMobile, toast]);

  if (!isMobile) {
    // Desktop layout
    return (
      <div className="flex flex-col h-full">
        <UserProfileHeader />
        <main className="flex-1 overflow-y-auto pt-14 pb-[var(--bottom-nav-height)]">
          {children}
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mobile Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0"
      >
        <UserProfileHeader />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
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

        {/* Orientation Helper */}
        {orientation === 'landscape' && pathname === '/' && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/90 text-primary-foreground rounded-full px-3 py-1 text-xs font-medium"
            >
              Modo paisagem ativo - Melhor para explorar o mapa
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
            className="flex-shrink-0"
          >
            <MobileNavigation
              items={mobileNavItems}
              showLabels={orientation === 'portrait'}
              showPremiumButton={true}
            />
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