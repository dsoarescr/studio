'use client';

import React, { useState } from 'react';
import { EnhancedMarketplace } from './EnhancedMarketplace';
import { PixelDetails } from './PixelDetails';
import { PixelComments } from './PixelComments';
import { PixelAuction } from './PixelAuction';
import { SocialFeatures } from './SocialFeatures';
import { MobileOptimizations } from './MobileOptimizations';
import { PixelAnalytics } from './PixelAnalytics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export function IntegratedMarketplace() {
  const [selectedPixelId, setSelectedPixelId] = useState<string | null>(null);
  const [showPixelDetails, setShowPixelDetails] = useState(false);
  const { toast } = useToast();

  const handlePixelClick = (pixelId: string) => {
    setSelectedPixelId(pixelId);
    setShowPixelDetails(true);
  };

  const handleCloseDetails = () => {
    setShowPixelDetails(false);
    setSelectedPixelId(null);
  };

  return (
    <MobileOptimizations>
      <EnhancedMarketplace onPixelClick={handlePixelClick} />

      {/* Modal de Detalhes do Pixel */}
      <Dialog open={showPixelDetails} onOpenChange={setShowPixelDetails}>
        <DialogContent className="h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pixel</DialogTitle>
          </DialogHeader>

          {selectedPixelId && (
            <div className="space-y-6">
              {/* Detalhes do Pixel */}
              <PixelDetails pixelId={selectedPixelId} onClose={handleCloseDetails} />

              {/* Análises */}
              <PixelAnalytics pixelId={selectedPixelId} />

              {/* Sistema de Leilões (se aplicável) */}
              <PixelAuction
                pixelId={selectedPixelId}
                currentUserId="user123" // Substituir pelo ID do usuário atual
              />

              {/* Funcionalidades Sociais */}
              <SocialFeatures
                userId="seller123" // Substituir pelo ID do vendedor
                pixelId={selectedPixelId}
                currentUserId="user123" // Substituir pelo ID do usuário atual
              />

              {/* Comentários */}
              <PixelComments
                pixelId={selectedPixelId}
                currentUserId="user123" // Substituir pelo ID do usuário atual
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MobileOptimizations>
  );
}
