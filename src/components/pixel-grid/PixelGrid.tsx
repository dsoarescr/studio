'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '@/lib/auth-context';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EnhancedPixelPurchaseModal } from './EnhancedPixelPurchaseModal';
import { PortugalMapSvg } from './PortugalMapSvg';
import { 
  MapPin, 
  Crown, 
  Zap, 
  Users, 
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

interface Pixel {
  id: string;
  x: number;
  y: number;
  owner: string | null;
  price: number;
  color: string;
  description?: string;
  views: number;
  likes: number;
  comments: number;
  isForSale: boolean;
  isPremium: boolean;
  lastUpdated: Date;
}

interface PixelGridProps {
  className?: string;
}

const PixelGrid: React.FC<PixelGridProps> = ({ className = '' }) => {
  const { user } = useAuthContext();
  const { pixels, userStats, addPixel, updatePixel } = useStore();
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');

  // Generate mock pixels for demonstration
  const mockPixels = useMemo(() => {
    const pixelArray: Pixel[] = [];
    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 60; y++) {
        const id = `${x}-${y}`;
        pixelArray.push({
          id,
          x,
          y,
          owner: Math.random() > 0.7 ? `user_${Math.floor(Math.random() * 1000)}` : null,
          price: Math.floor(Math.random() * 100) + 10,
          color: Math.random() > 0.7 ? `hsl(${Math.random() * 360}, 70%, 60%)` : '#f3f4f6',
          description: Math.random() > 0.8 ? 'Pixel personalizado com descrição única' : undefined,
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          isForSale: Math.random() > 0.8,
          isPremium: Math.random() > 0.9,
          lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    }
    return pixelArray;
  }, []);

  const handlePixelClick = useCallback((pixel: Pixel) => {
    setSelectedPixel(pixel);
    if (!pixel.owner && user) {
      setShowPurchaseModal(true);
    }
  }, [user]);

  const handlePixelHover = useCallback((pixelId: string | null) => {
    setHoveredPixel(pixelId);
  }, []);

  const handlePurchaseComplete = useCallback((pixel: Pixel) => {
    updatePixel(pixel.id, { ...pixel, owner: user?.uid || null });
    setShowPurchaseModal(false);
    setSelectedPixel(null);
  }, [user, updatePixel]);

  const getPixelStatus = (pixel: Pixel) => {
    if (pixel.isPremium) return 'premium';
    if (pixel.owner === user?.uid) return 'owned';
    if (pixel.owner) return 'taken';
    if (pixel.isForSale) return 'sale';
    return 'available';
  };

  const getPixelColor = (pixel: Pixel) => {
    const status = getPixelStatus(pixel);
    switch (status) {
      case 'premium': return '#ffd700';
      case 'owned': return '#10b981';
      case 'taken': return pixel.color !== '#f3f4f6' ? pixel.color : '#6b7280';
      case 'sale': return '#f59e0b';
      default: return '#f3f4f6';
    }
  };

  return (
    <TooltipProvider>
      <div className={`w-full h-full ${className}`}>
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Pixel Universe Portugal
            </h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {mockPixels.filter(p => p.owner).length} / {mockPixels.length} pixels ocupados
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Mapa
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Users className="w-4 h-4 mr-2" />
              Grelha
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Visualizações</p>
                <p className="text-xl font-bold">
                  {mockPixels.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Likes</p>
                <p className="text-xl font-bold">
                  {mockPixels.reduce((sum, p) => sum + p.likes, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-xl font-bold">
                  €{mockPixels.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="text-xl font-bold">
                  {mockPixels.filter(p => p.isPremium).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="relative">
          {viewMode === 'map' ? (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <PortugalMapSvg 
                pixels={mockPixels}
                onPixelClick={handlePixelClick}
                onPixelHover={handlePixelHover}
                hoveredPixel={hoveredPixel}
                selectedPixel={selectedPixel}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div 
                className="grid gap-1 overflow-auto max-h-[600px]"
                style={{ 
                  gridTemplateColumns: 'repeat(100, 8px)',
                  gridTemplateRows: 'repeat(60, 8px)'
                }}
              >
                {mockPixels.map((pixel) => (
                  <Tooltip key={pixel.id}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className="w-2 h-2 cursor-pointer border border-gray-200 hover:border-gray-400 transition-all"
                        style={{ backgroundColor: getPixelColor(pixel) }}
                        whileHover={{ scale: 1.5, zIndex: 10 }}
                        onClick={() => handlePixelClick(pixel)}
                        onMouseEnter={() => handlePixelHover(pixel.id)}
                        onMouseLeave={() => handlePixelHover(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-medium">Pixel ({pixel.x}, {pixel.y})</p>
                        <p>Preço: €{pixel.price}</p>
                        {pixel.owner && <p>Proprietário: {pixel.owner}</p>}
                        <p>Status: {getPixelStatus(pixel)}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 border rounded"></div>
              <span>À venda</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 border rounded"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border rounded"></div>
              <span>Meu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 border rounded"></div>
              <span>Premium</span>
            </div>
          </div>
        </div>

        {/* Pixel Info Panel */}
        <AnimatePresence>
          {selectedPixel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm z-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">
                    Pixel ({selectedPixel.x}, {selectedPixel.y})
                  </h3>
                  <p className="text-sm text-gray-600">
                    €{selectedPixel.price}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPixel(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>{selectedPixel.views} visualizações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span>{selectedPixel.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span>{selectedPixel.comments} comentários</span>
                </div>
              </div>

              {selectedPixel.description && (
                <p className="text-sm text-gray-600 mt-3">
                  {selectedPixel.description}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                {!selectedPixel.owner && user && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowPurchaseModal(true)}
                    className="flex-1"
                  >
                    Comprar
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Purchase Modal */}
        {showPurchaseModal && selectedPixel && (
          <EnhancedPixelPurchaseModal
            pixel={selectedPixel}
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default PixelGrid;