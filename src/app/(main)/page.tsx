// src/app/(main)/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { LogIn, UserPlus } from 'lucide-react';
import MobileOptimizations from '@/components/mobile/MobileOptimizations';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
       <MobileOptimizations>
        <div className="relative w-full h-full bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
          <div className="relative w-full flex h-full">
            <MapSidebar />
            <div className="flex-1 h-full relative">
              <PixelGrid />
              {/* Welcome overlay for non-authenticated users */}
              {!user && (
                  <div className="absolute bottom-24 right-6 z-30 max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Card className="bg-card/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-primary/30">
                        <CardContent className="p-2 text-center">
                          <h3 className="text-lg font-semibold mb-2 text-primary">Bem-vindo ao Pixel Universe!</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Explore o mapa livremente. Para comprar pixels e desbloquear todas as funcionalidades, crie uma conta ou inicie sessão.
                          </p>
                          <div className="flex gap-2">
                            <AuthModal defaultTab="login">
                              <Button variant="outline" size="sm" className="flex-1">
                                <LogIn className="h-4 w-4 mr-2" />
                                Entrar
                              </Button>
                            </AuthModal>
                            <AuthModal defaultTab="register">
                              <Button size="sm" className="flex-1">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Registar
                              </Button>
                            </AuthModal>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </MobileOptimizations>
    </SidebarProvider>
  );
}
