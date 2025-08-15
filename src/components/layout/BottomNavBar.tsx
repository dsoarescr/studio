
'use client';

import React, { useState } from 'react';
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

  const xpPercentage = (xp / xpMax) * 100;

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playClickSound} onEnd={() => setPlayClickSound(false)} />
      
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-transparent pointer-events-none z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full w-full pointer-events-auto"
        >
          <Card className="professional-footer h-full w-full rounded-t-2xl overflow-hidden border-t border-primary/20 bg-background/95 backdrop-blur-xl shadow-lg shadow-primary/5">
            <CardContent className="h-full p-2 sm:p-3 flex items-center justify-around">
              {navLinks.map((link) => {
                const isActive = (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link href={link.href} key={link.href}>
                    <motion.div
                      onMouseEnter={() => setHoveredItem(link.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => setPlayClickSound(true)}
                      className="relative flex flex-col items-center justify-center p-1 rounded-lg w-16 h-16 text-muted-foreground hover:text-primary transition-all duration-300"
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
                        <link.icon className={`h-6 w-6 transition-transform duration-300 ${isActive ? 'text-primary' : ''}`} />
                        {isActive && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                          </span>
                        )}
                      </div>
                      <span className={`text-xs mt-1 transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : ''}`}>
                        {link.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Botão Premium no Centro */}
              <div className="hidden lg:block">
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
                      className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-primary/50"
                    >
                      <Crown className="h-7 w-7" />
                    </Button>
                  </Link>
                </EnhancedTooltip>
              </div>

              {/* Login/User Menu */}
              <div className="lg:hidden">
                {user ? (
                  <UserMenu />
                ) : (
                  <AuthModal>
                    <div className="flex flex-col items-center justify-center p-1 rounded-lg w-16 h-16 text-muted-foreground hover:text-primary transition-all duration-300">
                      <UserPlus className="h-6 w-6" />
                      <span className="text-xs mt-1">Entrar</span>
                    </div>
                  </AuthModal>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </nav>
    </>
  );
}
