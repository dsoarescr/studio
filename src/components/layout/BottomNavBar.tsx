'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ShoppingCart,
  Palette,
  User,
  Users,
  Crown,
  Plus,
  Zap,
  MapPin,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';

const navLinks = [
  { 
    href: "/", 
    label: "Mapa", 
    icon: MapPin, 
    color: "text-blue-500",
    description: "Explorar pixels únicos"
  },
  { 
    href: "/marketplace", 
    label: "Market", 
    icon: ShoppingCart, 
    color: "text-green-500",
    description: "Comprar identidades digitais"
  },
  { 
    href: "/community", 
    label: "Social", 
    icon: Users, 
    color: "text-purple-500",
    description: "Rede social de pixels",
    badge: 3
  },
  { 
    href: "/member", 
    label: "Perfil", 
    icon: User, 
    color: "text-orange-500",
    description: "Seu perfil e pixels"
  },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { credits, notifications, pixels } = useUserStore();
  
  const [playClickSound, setPlayClickSound] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Update active index based on pathname
  useEffect(() => {
    const index = navLinks.findIndex(link => 
      pathname === link.href || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href))
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname]);

  // Auto-hide on scroll (optional)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playClickSound} onEnd={() => setPlayClickSound(false)} />
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
          >
            <Card className="rounded-t-2xl border-t-2 border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-around relative">
                  {/* Background indicator */}
                  <motion.div
                    className="absolute bg-primary/20 rounded-xl h-12"
                    layoutId="activeBackground"
                    initial={false}
                    animate={{
                      x: `${(activeIndex / navLinks.length) * 100}%`,
                      width: `${100 / navLinks.length}%`
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />

                  {navLinks.map((link, index) => {
                    const isActive = index === activeIndex;
                    
                    return (
                      <Link href={link.href} key={link.href} className="relative z-10">
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center justify-center p-3 rounded-xl min-w-[70px] touch-target"
                          onClick={() => setPlayClickSound(true)}
                        >
                          <div className="relative">
                            <motion.div
                              animate={{
                                scale: isActive ? 1.2 : 1,
                                color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {React.cloneElement(link.icon as React.ReactElement, {
                                className: 'h-6 w-6'
                              })}
                            </motion.div>
                            
                            {link.badge && link.badge > 0 && (
                              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 flex items-center justify-center animate-pulse">
                                {link.badge > 99 ? '99+' : link.badge}
                              </Badge>
                            )}
                            
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full"
                                initial={false}
                              />
                            )}
                          </div>
                          
                          <motion.span
                            animate={{
                              fontSize: isActive ? '0.75rem' : '0.625rem',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                            }}
                            className="mt-1 text-center leading-tight"
                          >
                            {link.label}
                          </motion.span>
                        </motion.div>
                      </Link>
                    );
                  })}

                  {/* Premium Button - Central */}
                  <div className="relative z-10">
                    <EnhancedTooltip
                      title="Pixel Universe Premium"
                      description="Desbloqueie ferramentas avançadas e pixels exclusivos"
                      stats={[
                        { label: 'Seus Créditos', value: credits.toLocaleString(), icon: <Zap className="h-4 w-4" /> },
                        { label: 'Pixels Owned', value: pixels, icon: <MapPin className="h-4 w-4" /> }
                      ]}
                      actions={[
                        { label: 'Upgrade Now', onClick: () => {}, icon: <Crown className="h-4 w-4" /> }
                      ]}
                    >
                      <Link href="/premium">
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center justify-center p-2"
                        >
                          <Button
                            size="lg"
                            className="rounded-full w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-2xl shadow-amber-500/30 touch-target"
                          >
                            <Crown className="h-7 w-7" />
                          </Button>
                          
                          <span className="text-xs mt-1 text-amber-500 font-bold">
                            Premium
                          </span>
                        </motion.div>
                      </Link>
                    </EnhancedTooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}