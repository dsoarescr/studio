'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, ZoomOut, Expand, Move, Hand, Crosshair, 
  Target, Compass, MapPin, Search, Filter, Palette,
  Settings, Info, Eye, Grid, Layers, Ruler
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MobilePixelControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleGrid?: () => void;
  onToggleLayers?: () => void;
  selectedTool?: string;
  onToolChange?: (tool: string) => void;
  className?: string;
}

const tools = [
  { id: 'move', icon: Hand, label: 'Mover', color: 'text-blue-500' },
  { id: 'select', icon: Crosshair, label: 'Selecionar', color: 'text-primary' },
  { id: 'measure', icon: Ruler, label: 'Medir', color: 'text-green-500' },
  { id: 'search', icon: Search, label: 'Pesquisar', color: 'text-purple-500' }
];

export default function MobilePixelControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleGrid,
  onToggleLayers,
  selectedTool = 'move',
  onToolChange,
  className
}: MobilePixelControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showZoomLevel, setShowZoomLevel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showZoomLevel) {
      const timer = setTimeout(() => setShowZoomLevel(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showZoomLevel]);

  const handleZoomIn = () => {
    onZoomIn();
    setShowZoomLevel(true);
  };

  const handleZoomOut = () => {
    onZoomOut();
    setShowZoomLevel(true);
  };

  const handleToolChange = (toolId: string) => {
    onToolChange?.(toolId);
    toast({
      title: "Ferramenta Alterada",
      description: `${tools.find(t => t.id === toolId)?.label} selecionada`,
    });
  };

  return (
    <div className={cn("fixed bottom-24 left-4 z-30", className)}>
      {/* Zoom Level Indicator */}
      <AnimatePresence>
        {showZoomLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-2"
          >
            <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
              <CardContent className="p-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {zoom.toFixed(1)}x
                  </div>
                  <div className="text-xs text-muted-foreground">Zoom</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Controls */}
      <Card className="bg-card/90 backdrop-blur-sm border-primary/30 shadow-2xl">
        <CardContent className="p-3">
          {/* Zoom Controls */}
          <div className="flex flex-col gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="w-full touch-target"
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              Aproximar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="w-full touch-target"
            >
              <ZoomOut className="h-4 w-4 mr-2" />
              Afastar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onResetView}
              className="w-full touch-target"
            >
              <Expand className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </div>

          {/* Tool Selector */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground text-center">
              Ferramentas
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              {tools.map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolChange(tool.id)}
                  className="flex flex-col items-center p-2 h-auto touch-target"
                >
                  <tool.icon className={`h-4 w-4 mb-1 ${selectedTool === tool.id ? '' : tool.color}`} />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Controls */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-xs"
            >
              <Settings className="h-3 w-3 mr-2" />
              {isExpanded ? 'Menos Opções' : 'Mais Opções'}
            </Button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {onToggleGrid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleGrid}
                      className="w-full text-xs"
                    >
                      <Grid className="h-3 w-3 mr-2" />
                      Grelha
                    </Button>
                  )}
                  
                  {onToggleLayers && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleLayers}
                      className="w-full text-xs"
                    >
                      <Layers className="h-3 w-3 mr-2" />
                      Camadas
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}