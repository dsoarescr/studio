'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import MobilePixelControls from '@/components/mobile/MobilePixelControls';
import MobilePixelInfo from '@/components/mobile/MobilePixelInfo';
import MobileMapOverlay from '@/components/mobile/MobileMapOverlay';
import MobileTouchGestures from '@/components/mobile/MobileTouchGestures';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, ZoomOut, Expand, MapPin, Users, TrendingUp,
  Heart, Bookmark, Share2, ShoppingCart, Crosshair,
  Navigation, Compass, Target, Eye, Activity
} from 'lucide-react';

interface MobilePixelGridProps {
  pixelBitmap: Uint8Array | null;
  soldPixels: Array<{
    x: number;
    y: number;
    color: string;
    ownerId?: string;
    title?: string;
  }>;
  onPixelSelect: (x: number, y: number) => void;
  onPixelPurchase: (x: number, y: number) => void;
  className?: string;
}

export default function MobilePixelGrid({
  pixelBitmap,
  soldPixels,
  onPixelSelect,
  onPixelPurchase,
  className
}: MobilePixelGridProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number } | null>(null);
  const [selectedTool, setSelectedTool] = useState('move');
  const [showPixelInfo, setShowPixelInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { vibrate } = useHapticFeedback();
  const { toast } = useToast();

  // Mock stats for overlay
  const mapStats = {
    activeUsers: 1247,
    pixelsSold: 156,
    totalValue: 45230,
    onlineStatus: true,
    lastUpdate: new Date().toLocaleTimeString('pt-PT')
  };

  // Mock pixel info
  const pixelInfo = selectedPixel ? {
    x: selectedPixel.x,
    y: selectedPixel.y,
    region: 'Lisboa',
    owner: 'PixelMaster',
    price: 150,
    rarity: 'Raro',
    views: 234,
    likes: 45,
    description: 'Um pixel especial no coração de Lisboa',
    lastModified: '2 dias atrás',
    isOwned: false,
    isFavorited: false
  } : null;

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 20));
    vibrate('light');
  }, [vibrate]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.1));
    vibrate('light');
  }, [vibrate]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    vibrate('medium');
    toast({
      title: "Vista Resetada",
      description: "Mapa centrado na posição inicial",
    });
  }, [vibrate, toast]);

  const handlePixelTap = useCallback((x: number, y: number) => {
    setSelectedPixel({ x, y });
    setShowPixelInfo(true);
    onPixelSelect(x, y);
    vibrate('selection');
  }, [onPixelSelect, vibrate]);

  const handlePixelPurchase = useCallback(() => {
    if (selectedPixel) {
      onPixelPurchase(selectedPixel.x, selectedPixel.y);
      setShowPixelInfo(false);
      vibrate('success');
    }
  }, [selectedPixel, onPixelPurchase, vibrate]);

  const touchGestures = [
    {
      type: 'tap' as const,
      callback: (data: any) => {
        if (selectedTool === 'select' && data) {
          handlePixelTap(data.x, data.y);
        }
      }
    },
    {
      type: 'double-tap' as const,
      callback: () => handleZoomIn()
    },
    {
      type: 'long-press' as const,
      callback: () => {
        setShowControls(!showControls);
        toast({
          title: showControls ? "Controles Ocultos" : "Controles Visíveis",
          description: "Pressione e segure novamente para alternar",
        });
      }
    },
    {
      type: 'swipe' as const,
      direction: 'left' as const,
      callback: () => {
        if (selectedPixel) {
          toast({ title: "❤️ Pixel Curtido!", description: "Adicionado aos favoritos" });
        }
      }
    },
    {
      type: 'swipe' as const,
      direction: 'right' as const,
      callback: () => {
        if (selectedPixel) {
          toast({ title: "🔖 Pixel Salvo!", description: "Guardado para depois" });
        }
      }
    },
    {
      type: 'swipe' as const,
      direction: 'up' as const,
      callback: () => {
        if (selectedPixel && navigator.share) {
          navigator.share({
            title: 'Pixel Universe',
            text: `Confira este pixel em (${selectedPixel.x}, ${selectedPixel.y})!`,
            url: window.location.href
          });
        }
      }
    },
    {
      type: 'swipe' as const,
      direction: 'down' as const,
      callback: () => {
        if (selectedPixel) {
          setShowPixelInfo(true);
        }
      }
    }
  ];

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showControls && !isDragging) {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
    
    return () => clearTimeout(timer);
  }, [showControls, isDragging]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Map Overlay */}
      <MobileMapOverlay
        stats={mapStats}
        currentZoom={zoom}
        currentPosition={position}
        selectedPixel={selectedPixel}
      />

      {/* Touch Gesture Handler */}
      <MobileTouchGestures
        gestures={touchGestures}
        className="w-full h-full"
      >
        <div
          ref={containerRef}
          className="w-full h-full bg-gradient-to-br from-background/95 to-primary/5 relative touch-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Pixel Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Selected Pixel Highlight */}
          {selectedPixel && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute border-4 border-primary rounded-lg shadow-lg pointer-events-none"
              style={{
                left: selectedPixel.x * 10,
                top: selectedPixel.y * 10,
                width: 10,
                height: 10,
                transform: 'translate(-2px, -2px)'
              }}
            />
          )}
        </div>
      </MobileTouchGestures>

      {/* Mobile Controls */}
      <AnimatePresence>
        {showControls && (
          <MobilePixelControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
          />
        )}
      </AnimatePresence>

      {/* Pixel Info Panel */}
      <MobilePixelInfo
        pixelInfo={pixelInfo}
        isVisible={showPixelInfo}
        onClose={() => setShowPixelInfo(false)}
        onPurchase={handlePixelPurchase}
        onEdit={() => {
          toast({ title: "Editor Aberto", description: "Modo de edição ativado" });
        }}
        onShare={() => {
          if (navigator.share && selectedPixel) {
            navigator.share({
              title: 'Pixel Universe',
              text: `Pixel (${selectedPixel.x}, ${selectedPixel.y})`,
              url: window.location.href
            });
          }
        }}
        onToggleFavorite={() => {
          // Handle favorite toggle
        }}
      />

      {/* Quick Action Hint */}
      {!showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
        >
          <Card className="bg-black/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-2">
              <div className="text-white text-xs text-center">
                Pressione e segure para mostrar controles
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}