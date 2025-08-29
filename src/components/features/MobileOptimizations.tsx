'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useToast } from '@/hooks/use-toast';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Grid,
  List,
  MapPin,
  Settings,
  User,
  Bell,
  Heart,
  Bookmark,
  Share2,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
} from 'lucide-react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export function MobileOptimizations({ children }: MobileOptimizationsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { toast } = useToast();

  // Resetar estado quando mudar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
      setIsFilterOpen(false);
      setZoomLevel(1);
      setTranslateX(0);
      setTranslateY(0);
    }
  }, [isMobile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      setStartX(distance);
    } else {
      // Pan
      setIsDragging(true);
      setStartX(e.touches[0].clientX - translateX);
      setStartY(e.touches[0].clientY - translateY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const scale = distance / startX;
      setZoomLevel(Math.min(Math.max(0.5, scale), 3));
    } else if (isDragging) {
      // Pan
      setTranslateX(e.touches[0].clientX - startX);
      setTranslateY(e.touches[0].clientY - startY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDoubleTap = () => {
    setZoomLevel(zoomLevel === 1 ? 2 : 1);
  };

  const resetView = () => {
    setZoomLevel(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  return (
    <div className="relative">
      {isMobile && (
        <>
          {/* Barra Superior */}
          <div className="fixed left-0 right-0 top-0 z-50 border-b bg-background">
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(true)}>
                  <Filter className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? (
                    <Grid className="h-5 w-5" />
                  ) : (
                    <List className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Menu Lateral */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] py-4">
                <div className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-5 w-5" />
                    Perfil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="mr-2 h-5 w-5" />
                    Notificações
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="mr-2 h-5 w-5" />
                    Favoritos
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="mr-2 h-5 w-5" />
                    Salvos
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="mr-2 h-5 w-5" />
                    Explorar Regiões
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-5 w-5" />
                    Configurações
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Filtros */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>Refine sua busca</SheetDescription>
              </SheetHeader>
              {/* Implementar filtros aqui */}
            </SheetContent>
          </Sheet>

          {/* Controles de Zoom e Pan */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.5, 0.5))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Barra de Navegação Inferior */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
            <div className="flex justify-around p-4">
              <Button variant="ghost" className="flex-col">
                <Grid className="mb-1 h-5 w-5" />
                <span className="text-xs">Explorar</span>
              </Button>
              <Button variant="ghost" className="flex-col">
                <Heart className="mb-1 h-5 w-5" />
                <span className="text-xs">Favoritos</span>
              </Button>
              <Button variant="ghost" className="flex-col">
                <Share2 className="mb-1 h-5 w-5" />
                <span className="text-xs">Compartilhar</span>
              </Button>
              <Button variant="ghost" className="flex-col">
                <User className="mb-1 h-5 w-5" />
                <span className="text-xs">Perfil</span>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Conteúdo Principal */}
      <motion.div
        className={`${isMobile ? 'pb-20 pt-16' : ''}`}
        style={{
          scale: zoomLevel,
          x: translateX,
          y: translateY,
          touchAction: isDragging ? 'none' : 'auto',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
      >
        {children}
      </motion.div>

      {/* Gestos e Interações */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40 bg-black/10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
