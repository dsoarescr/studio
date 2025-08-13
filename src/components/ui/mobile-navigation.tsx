'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, ShoppingCart, Palette, User, BarChart3, 
  Trophy, Settings, Plus, Crown, Star, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  color?: string;
}

interface MobileNavigationProps {
  items: NavItem[];
  showLabels?: boolean;
  showPremiumButton?: boolean;
  className?: string;
}

export function MobileNavigation({
  items,
  showLabels = true,
  showPremiumButton = true,
  className
}: MobileNavigationProps) {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll
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

  // Update active index based on pathname
  useEffect(() => {
    const index = items.findIndex(item => 
      pathname === item.href || (pathname !== '/' && item.href !== '/' && pathname.startsWith(item.href))
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname, items]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 safe-bottom",
            className
          )}
        >
          <Card className="rounded-t-2xl border-t border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-2">
              <div className="flex items-center justify-around relative">
                {/* Background indicator */}
                <motion.div
                  className="absolute bg-primary/20 rounded-xl"
                  layoutId="activeBackground"
                  initial={false}
                  animate={{
                    x: `${(activeIndex / items.length) * 100}%`,
                    width: `${100 / items.length}%`
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  style={{
                    height: '100%',
                    left: 0,
                    top: 0
                  }}
                />

                {items.map((item, index) => {
                  const isActive = index === activeIndex;
                  
                  return (
                    <Link href={item.href} key={item.href} className="relative z-10">
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] touch-target"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{
                              scale: isActive ? 1.1 : 1,
                              color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {React.cloneElement(item.icon as React.ReactElement, {
                              className: 'h-6 w-6'
                            })}
                          </motion.div>
                          
                          {item.badge && item.badge > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 flex items-center justify-center">
                              {item.badge > 99 ? '99+' : item.badge}
                            </Badge>
                          )}
                          
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                              initial={false}
                            />
                          )}
                        </div>
                        
                        {showLabels && (
                          <motion.span
                            animate={{
                              fontSize: isActive ? '0.75rem' : '0.625rem',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                            }}
                            className="mt-1 text-center leading-tight"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Premium Button */}
                {showPremiumButton && (
                  <Link href="/premium" className="relative z-10">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center justify-center p-2"
                    >
                      <Button
                        size="sm"
                        className="rounded-full w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                      >
                        <Crown className="h-5 w-5" />
                      </Button>
                      
                      {showLabels && (
                        <span className="text-xs mt-1 text-amber-500 font-medium">
                          Premium
                        </span>
                      )}
                    </motion.div>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for mobile navigation state
export function useMobileNavigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  const showNavigation = () => setIsVisible(true);
  const hideNavigation = () => setIsVisible(false);
  const toggleNavigation = () => setIsVisible(!isVisible);
  
  return {
    isVisible,
    activeTab,
    setActiveTab,
    showNavigation,
    hideNavigation,
    toggleNavigation
  };
}