'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserStore, usePixelStore } from '@/lib/store';
import { 
  ZoomIn, ZoomOut, RotateCcw, MapPin, Crosshair, 
  Loader2, Eye, EyeOff, Grid3X3, Maximize2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PixelGridProps {
  className?: string;
}

interface Pixel {
  x: number;
  y: number;
  color: string;
  owner?: string;
  price?: number;
}

const GRID_WIDTH = 1000;
const GRID_HEIGHT = 800;
const INITIAL_ZOOM = 1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

export default function PixelGrid({ className }: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();
  const { soldPixels, addSoldPixel } = usePixelStore();

  // Simulate loading Portugal map
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Mapa Carregado",
        description: "O mapa de Portugal foi carregado com sucesso!",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Draw the grid and pixels
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply zoom and pan
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw Portugal outline (simplified)
    ctx.strokeStyle = '#D4A757';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Simplified Portugal shape
    ctx.moveTo(100, 100);
    ctx.lineTo(300, 120);
    ctx.lineTo(350, 200);
    ctx.lineTo(380, 350);
    ctx.lineTo(320, 500);
    ctx.lineTo(250, 600);
    ctx.lineTo(150, 580);
    ctx.lineTo(80, 400);
    ctx.lineTo(90, 200);
    ctx.closePath();
    ctx.stroke();

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = 'rgba(212, 167, 87, 0.2)';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x <= GRID_WIDTH; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GRID_HEIGHT);
        ctx.stroke();
      }
      
      for (let y = 0; y <= GRID_HEIGHT; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GRID_WIDTH, y);
        ctx.stroke();
      }
    }

    // Draw sold pixels
    soldPixels.forEach(pixel => {
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x * 10, pixel.y * 10, 10, 10);
    });

    // Draw selected pixel highlight
    if (selectedPixel) {
      ctx.strokeStyle = '#7DF9FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(selectedPixel.x * 10 - 1, selectedPixel.y * 10 - 1, 12, 12);
    }

    // Restore context
    ctx.restore();
  }, [zoom, pan, showGrid, soldPixels, selectedPixel]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left - pan.x * zoom) / (10 * zoom));
    const y = Math.floor((event.clientY - rect.top - pan.y * zoom) / (10 * zoom));

    if (x >= 0 && x < GRID_WIDTH / 10 && y >= 0 && y < GRID_HEIGHT / 10) {
      const pixel: Pixel = { x, y, color: '#D4A757', price: 10 };
      setSelectedPixel(pixel);
      
      toast({
        title: "Pixel Selecionado",
        description: `Coordenadas: (${x}, ${y})`,
      });
    }
  }, [pan, zoom, toast]);

  // Handle mouse events for panning
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;

    setPan(prev => ({
      x: prev.x + deltaX / zoom,
      y: prev.y + deltaY / zoom
    }));

    setLastMousePos({ x: event.clientX, y: event.clientY });
  }, [isDragging, lastMousePos, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, MIN_ZOOM));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(INITIAL_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  // Purchase pixel
  const handlePurchasePixel = useCallback(() => {
    if (!selectedPixel) return;

    addSoldPixel({
      ...selectedPixel,
      owner: 'current-user',
      timestamp: Date.now()
    });

    addCredits(-selectedPixel.price || 10);
    addXp(25);

    toast({
      title: "Pixel Comprado!",
      description: `Pixel (${selectedPixel.x}, ${selectedPixel.y}) adquirido com sucesso!`,
    });

    setSelectedPixel(null);
  }, [selectedPixel, addSoldPixel, addCredits, addXp, toast]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawCanvas]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-background to-primary/5">
        <Card className="p-8 text-center">
          <CardContent className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h3 className="text-xl font-semibold">A renderizar mapa de Portugal</h3>
            <p className="text-muted-foreground">Carregando pixels e regiões...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-gradient-to-br from-background to-primary/5 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-background/80 backdrop-blur-sm"
          aria-label="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-background/80 backdrop-blur-sm"
          aria-label="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetView}
          className="bg-background/80 backdrop-blur-sm"
          aria-label="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowGrid(!showGrid)}
          className="bg-background/80 backdrop-blur-sm"
          aria-label="Toggle Grid"
        >
          {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Crosshair className="h-4 w-4 text-primary" />
                <span>Zoom: {zoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Pan: ({pan.x.toFixed(0)}, {pan.y.toFixed(0)})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Pixel Info */}
      {selectedPixel && (
        <div className="absolute top-4 left-4 z-10">
          <Card className="bg-background/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Pixel Selecionado</h3>
              <div className="space-y-2 text-sm">
                <p>Coordenadas: ({selectedPixel.x}, {selectedPixel.y})</p>
                <p>Preço: {selectedPixel.price || 10} créditos</p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={handlePurchasePixel}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Comprar Pixel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedPixel(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}