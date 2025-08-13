
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
  BarChart3,
  Award,
  Users,
  Compass,
  Star,
  Plus,
  Zap,
  UserPlus,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { UserMenu } from '../auth/UserMenu';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';

const navLinks = [
  { href: "/", label: "Universo", icon: Home },
  { href: "/marketplace", label: "Market", icon: ShoppingCart },
  { href: "/pixels", label: "Galeria", icon: Palette },
  { href: "/member", label: "Perfil", icon: User },
  { href: "/ranking", label: "Ranking", icon: BarChart3 },
  { href: "/community", label: "Comunidade", icon: Users },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { credits, specialCredits, level, xp, xpMax, achievements } = useUserStore();
  
  const [playClickSound, setPlayClickSound] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const xpPercentage = (xp / xpMax) * 100;

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playClickSound} onEnd={() => setPlayClickSound(false)} />
      
      <div className="fixed bottom-0 left-0 right-0 h-[var(--bottom-nav-height)] bg-transparent pointer-events-none z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full w-full pointer-events-auto"
        >
          <Card className="professional-footer h-full w-full rounded-t-xl sm:rounded-t-2xl overflow-hidden">
            <CardContent className="h-full p-1 sm:p-2 flex items-center justify-around safe-bottom">
              {navLinks.map((link) => {
                const isActive = (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link href={link.href} key={link.href}>
                    <motion.div
                      onMouseEnter={() => setHoveredItem(link.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => setPlayClickSound(true)}
                      className="relative flex flex-col items-center justify-center p-1 rounded-lg w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground hover:text-primary transition-all duration-300 touch-target"
                    >
                      <AnimatePresence>
                        {hoveredItem === link.href && (
                          <motion.div
                            layoutId="hover-background"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-primary/10 rounded-lg"
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative">
                        <link.icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${isActive ? 'text-primary' : ''}`} />
                        {isActive && (
                          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-primary"></span>
                          </span>
                        )}
                      </div>
                      <span className={`text-xs mt-0.5 sm:mt-1 transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : ''} ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                        {link.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Botão Premium no Centro */}
              <div className="hidden sm:block">
                <EnhancedTooltip
                  title="Pixel Universe Premium"
                  description="Desbloqueie ferramentas avançadas, estatísticas detalhadas e recompensas exclusivas."
                  actions={[
                    { label: 'Saber Mais', onClick: () => {}, icon: <Zap className="h-4 w-4" /> }
                  ]}
                >
                  <Link href="/premium">
                    <Button
                      size="lg"
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-primary/50 touch-target"
                    >
                      <Crown className="h-5 w-5 sm:h-7 sm:w-7" />
                    </Button>
                  </Link>
                </EnhancedTooltip>
              </div>

              {/* Login/User Menu */}
              <div className="sm:hidden">
                {user ? (
                  <UserMenu />
                ) : (
                  <AuthModal>
                    <div className="flex flex-col items-center justify-center p-1 rounded-lg w-12 h-12 text-muted-foreground hover:text-primary transition-all duration-300 touch-target">
                      <UserPlus className="h-5 w-5" />
                      <span className="text-[10px] mt-0.5">Entrar</span>
                    </div>
                  </AuthModal>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
