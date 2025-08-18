'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Brush, Eraser, PaintBucket, Palette, Undo, Redo, Download, Upload,
  Sparkles, Crown, Coins, Gift, ShoppingCart, X, Check, Zap, Star,
  Circle, Square, Triangle, Heart, Smile, Sun, Moon, Flower, Leaf,
  Camera, Play, Pause, RotateCcw, Grid3X3, Eye, EyeOff, Layers,
  Settings, Info, Wand2, RefreshCw, Save, Share2, Volume2, VolumeX,
  Maximize2, Minimize2, MoreHorizontal, ChevronLeft, ChevronRight,
  Plus, Minus, RotateCw, FlipHorizontal, FlipVertical, Copy, Trash2
} from 'lucide-react';

interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: string;
  color?: string;
  title?: string;
  description?: string;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  specialCreditsPrice?: number;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any) => Promise<boolean>;
}

interface DrawingState {
  tool: 'brush' | 'eraser' | 'bucket' | 'eyedropper';
  color: string;
  brushSize: number;
  opacity: number;
  isDrawing: boolean;
  lastPoint: { x: number; y: number } | null;
}

const CANVAS_SIZE = 300;
const PIXEL_SIZE = 10;
const GRID_SIZE = CANVAS_SIZE / PIXEL_SIZE;

// Simplified color palettes
const colorPalettes = {
  classic: ['#D4A757', '#7DF9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  portugal: ['#006600', '#FF0000', '#FFD700', '#0066CC', '#8B4513', '#228B22', '#FF4500', '#4169E1'],
  neon: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#80FF00', '#FF0040', '#40FF00'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E1BAFF', '#FFBAE1', '#C9FFBA'],
  earth: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3'],
  ocean: ['#006994', '#0077BE', '#4682B4', '#5F9EA0', '#87CEEB', '#B0E0E6', '#E0F6FF', '#F0F8FF']
};

// Simplified stickers
const stickerCategories = {
  faces: ['😀', '😍', '🤔', '😎', '🥳', '😴', '🤖', '👻'],
  nature: ['🌸', '🌿', '🌙', '⭐', '🌈', '🔥', '💧', '⚡'],
  symbols: ['❤️', '💎', '🎨', '🎵', '⚡', '🔥', '💫', '✨'],
  portugal: ['🇵🇹', '🏰', '🌊', '🍷', '🐟', '⚓', '🏛️', '🌅']
};

// Simplified effects
const quickEffects = [
  { id: 'glow', name: 'Brilho', icon: '✨', premium: false },
  { id: 'shadow', name: 'Sombra', icon: '🌑', premium: false },
  { id: 'neon', name: 'Neon', icon: '💡', premium: true },
  { id: 'vintage', name: 'Vintage', icon: '📷', premium: true }
];

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'brush',
    color: '#D4A757',
    brushSize: 3,
    opacity: 100,
    isDrawing: false,
    lastPoint: null
  });

  // UI state
  const [activeTab, setActiveTab] = useState('draw');
  const [selectedPalette, setSelectedPalette] = useState('classic');
  const [showGrid, setShowGrid] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Customization state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [isAnimated, setIsAnimated] = useState(false);

  // Canvas and history
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio and haptics
  const [playSound, setPlaySound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { vibrate } = useHapticFeedback();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addCredits, addXp } = useUserStore();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    
    // Initialize with base color or clear
    ctx.fillStyle = pixelData?.color || '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Save initial state
    saveToHistory();
  }, [isOpen, pixelData]);

  const saveToHistory = useCallback(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const imageData = history[newIndex];
      if (imageData && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.putImageData(imageData, 0, 0);
        setHistoryIndex(newIndex);
        vibrate('light');
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const imageData = history[newIndex];
      if (imageData && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.putImageData(imageData, 0, 0);
        setHistoryIndex(newIndex);
        vibrate('light');
      }
    }
  };

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return null;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const drawPixel = (x: number, y: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pixelX = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE;
    const pixelY = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE;

    ctx.globalAlpha = drawingState.opacity / 100;
    
    if (drawingState.tool === 'brush') {
      ctx.fillStyle = drawingState.color;
      const size = drawingState.brushSize * PIXEL_SIZE;
      ctx.fillRect(pixelX - size/2, pixelY - size/2, size, size);
    } else if (drawingState.tool === 'eraser') {
      ctx.clearRect(pixelX - PIXEL_SIZE, pixelY - PIXEL_SIZE, PIXEL_SIZE * 2, PIXEL_SIZE * 2);
    }
    
    ctx.globalAlpha = 1;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    setDrawingState(prev => ({ ...prev, isDrawing: true, lastPoint: coords }));
    drawPixel(coords.x, coords.y);
    vibrate('light');
    setPlaySound(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawingState.isDrawing) return;
    
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    drawPixel(coords.x, coords.y);
    setDrawingState(prev => ({ ...prev, lastPoint: coords }));
  };

  const handlePointerUp = () => {
    if (drawingState.isDrawing) {
      setDrawingState(prev => ({ ...prev, isDrawing: false, lastPoint: null }));
      saveToHistory();
    }
  };

  const applyEffect = (effectId: string) => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    vibrate('medium');
    
    setTimeout(() => {
      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;
      
      // Apply simple effects
      switch (effectId) {
        case 'glow':
          ctx.shadowColor = drawingState.color;
          ctx.shadowBlur = 10;
          break;
        case 'vintage':
          ctx.filter = 'sepia(0.8) contrast(1.2)';
          break;
        case 'neon':
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 15;
          break;
      }
      
      setSelectedEffects(prev => 
        prev.includes(effectId) 
          ? prev.filter(e => e !== effectId)
          : [...prev, effectId]
      );
      
      setIsProcessing(false);
      addXp(10);
      toast({
        title: "Efeito Aplicado! ✨",
        description: `Efeito ${effectId} adicionado. +10 XP!`,
      });
    }, 1000);
  };

  const addSticker = (sticker: string) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.font = '24px Arial';
    ctx.fillText(sticker, CANVAS_SIZE/2 - 12, CANVAS_SIZE/2 + 8);
    saveToHistory();
    vibrate('light');
    
    addXp(5);
    toast({
      title: "Sticker Adicionado! 🎨",
      description: "+5 XP pela criatividade!",
    });
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    saveToHistory();
    vibrate('medium');
  };

  const calculatePrice = () => {
    const basePrice = pixelData?.price || 1;
    const effectsPrice = selectedEffects.length * 5;
    const animationPrice = isAnimated ? 20 : 0;
    return basePrice + effectsPrice + animationPrice;
  };

  const handlePurchase = async () => {
    if (!pixelData || !user) {
      toast({
        title: "Erro",
        description: "Dados do pixel ou utilizador não disponíveis.",
        variant: "destructive"
      });
      return;
    }

    const totalPrice = calculatePrice();
    
    if (userCredits < totalPrice) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${totalPrice - userCredits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    vibrate('success');

    try {
      // Get canvas data
      const canvas = canvasRef.current;
      const canvasDataUrl = canvas?.toDataURL() || '';

      const customizations = {
        title: title || `Pixel (${pixelData.x}, ${pixelData.y})`,
        description,
        color: drawingState.color,
        image: canvasDataUrl,
        effects: selectedEffects,
        isAnimated
      };

      const success = await onPurchase(pixelData, 'credits', customizations);
      
      if (success) {
        setShowConfetti(true);
        setPlaySound(true);
        addXp(50);
        
        toast({
          title: "Pixel Comprado! 🎉",
          description: `Parabéns! O seu pixel único foi criado. +50 XP!`,
        });
        
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro na Compra",
        description: "Não foi possível completar a compra. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!pixelData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none border-0 bg-background">
        <div className="flex flex-col h-full">
          {/* Header - Compacto */}
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Editor de Pixel
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  ({pixelData.x}, {pixelData.y}) • {pixelData.region}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {pixelData.rarity}
                </Badge>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Toolbar - Ferramentas Principais */}
          <div className="p-3 border-b bg-card/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              {/* Ferramentas Básicas */}
              <div className="flex gap-2">
                {[
                  { tool: 'brush', icon: Brush, label: 'Pincel' },
                  { tool: 'eraser', icon: Eraser, label: 'Borracha' },
                  { tool: 'bucket', icon: PaintBucket, label: 'Balde' },
                  { tool: 'eyedropper', icon: Circle, label: 'Conta-gotas' }
                ].map(({ tool, icon: Icon, label }) => (
                  <Button
                    key={tool}
                    variant={drawingState.tool === tool ? 'default' : 'outline'}
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      setDrawingState(prev => ({ ...prev, tool: tool as any }));
                      vibrate('light');
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>

              {/* Controles */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="h-10 w-10"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="h-10 w-10"
                >
                  <Redo className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowGrid(!showGrid)}
                  className="h-10 w-10"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className={cn(
                    "border-2 border-primary/30 rounded-lg shadow-lg cursor-crosshair",
                    "touch-none select-none",
                    showGrid && "bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:10px_10px]"
                  )}
                  style={{
                    width: `${CANVAS_SIZE * (canvasZoom / 100)}px`,
                    height: `${CANVAS_SIZE * (canvasZoom / 100)}px`,
                    imageRendering: 'pixelated'
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
                
                {/* Zoom Controls */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCanvasZoom(Math.max(50, canvasZoom - 25))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm font-mono min-w-[60px] text-center">
                    {canvasZoom}%
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 25))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tools Panel */}
            <div className="border-t bg-card/80 backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 h-12 bg-transparent">
                  <TabsTrigger value="draw" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Cores</span>
                  </TabsTrigger>
                  <TabsTrigger value="effects" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Efeitos</span>
                  </TabsTrigger>
                  <TabsTrigger value="stickers" className="flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    <span className="hidden sm:inline">Stickers</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Config</span>
                  </TabsTrigger>
                </TabsList>

                <div className="p-4">
                  {/* Colors Tab */}
                  <TabsContent value="draw" className="mt-0 space-y-4">
                    {/* Current Color & Size */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-border shadow-md"
                          style={{ backgroundColor: drawingState.color }}
                        />
                        <input
                          type="color"
                          value={drawingState.color}
                          onChange={(e) => setDrawingState(prev => ({ ...prev, color: e.target.value }))}
                          className="w-8 h-8 rounded border-0 cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tamanho</span>
                          <span>{drawingState.brushSize}px</span>
                        </div>
                        <Slider
                          value={[drawingState.brushSize]}
                          onValueChange={([value]) => setDrawingState(prev => ({ ...prev, brushSize: value }))}
                          min={1}
                          max={8}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Color Palettes */}
                    <div className="space-y-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {Object.entries(colorPalettes).map(([key, colors]) => (
                          <Button
                            key={key}
                            variant={selectedPalette === key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedPalette(key)}
                            className="flex-shrink-0 capitalize"
                          >
                            {key}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-8 gap-2">
                        {colorPalettes[selectedPalette as keyof typeof colorPalettes].map((color, index) => (
                          <button
                            key={index}
                            className={cn(
                              "w-8 h-8 rounded-lg border-2 transition-all hover:scale-110",
                              drawingState.color === color ? "border-foreground scale-110" : "border-border"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setDrawingState(prev => ({ ...prev, color }));
                              vibrate('light');
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Effects Tab */}
                  <TabsContent value="effects" className="mt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {quickEffects.map((effect) => (
                        <Button
                          key={effect.id}
                          variant={selectedEffects.includes(effect.id) ? 'default' : 'outline'}
                          className="h-16 flex flex-col items-center justify-center gap-1"
                          onClick={() => applyEffect(effect.id)}
                          disabled={effect.premium && !userCredits}
                        >
                          <span className="text-2xl">{effect.icon}</span>
                          <span className="text-xs">{effect.name}</span>
                          {effect.premium && (
                            <Crown className="h-3 w-3 text-amber-500" />
                          )}
                        </Button>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" onClick={clearCanvas}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Random colors
                          const ctx = canvasRef.current?.getContext('2d');
                          if (ctx) {
                            for (let i = 0; i < 20; i++) {
                              const x = Math.random() * CANVAS_SIZE;
                              const y = Math.random() * CANVAS_SIZE;
                              const color = colorPalettes.neon[Math.floor(Math.random() * colorPalettes.neon.length)];
                              ctx.fillStyle = color;
                              ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
                            }
                            saveToHistory();
                          }
                        }}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Magia
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Mirror effect
                          const ctx = canvasRef.current?.getContext('2d');
                          if (ctx) {
                            const imageData = ctx.getImageData(0, 0, CANVAS_SIZE/2, CANVAS_SIZE);
                            ctx.save();
                            ctx.scale(-1, 1);
                            ctx.putImageData(imageData, -CANVAS_SIZE, 0);
                            ctx.restore();
                            saveToHistory();
                          }
                        }}
                      >
                        <FlipHorizontal className="h-4 w-4 mr-2" />
                        Espelho
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Stickers Tab */}
                  <TabsContent value="stickers" className="mt-0 space-y-4">
                    {Object.entries(stickerCategories).map(([category, stickers]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="text-sm font-medium capitalize">{category}</h3>
                        <div className="grid grid-cols-8 gap-2">
                          {stickers.map((sticker, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="h-10 w-10 text-lg p-0 hover:scale-110 transition-transform"
                              onClick={() => addSticker(sticker)}
                            >
                              {sticker}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="mt-0 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título do Pixel</Label>
                        <Input
                          placeholder="Nome da sua obra..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={50}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          placeholder="Conte a história do seu pixel..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          maxLength={200}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Pixel Animado</Label>
                          <p className="text-xs text-muted-foreground">+20 créditos</p>
                        </div>
                        <Switch
                          checked={isAnimated}
                          onCheckedChange={setIsAnimated}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Opacidade: {drawingState.opacity}%</Label>
                        <Slider
                          value={[drawingState.opacity]}
                          onValueChange={([value]) => setDrawingState(prev => ({ ...prev, opacity: value }))}
                          min={10}
                          max={100}
                          step={10}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Footer - Compra */}
          <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-accent/5 flex-shrink-0">
            <div className="space-y-3">
              {/* Price Summary */}
              <Card className="bg-background/50">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pixel base:</span>
                      <span>€{pixelData.price}</span>
                    </div>
                    {selectedEffects.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Efeitos ({selectedEffects.length}):</span>
                        <span>€{selectedEffects.length * 5}</span>
                      </div>
                    )}
                    {isAnimated && (
                      <div className="flex justify-between text-sm">
                        <span>Animação:</span>
                        <span>€20</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-primary">€{calculatePrice()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={isProcessing || userCredits < calculatePrice()}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg font-semibold"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    A processar...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Comprar €{calculatePrice()}
                  </>
                )}
              </Button>

              {/* Credits Info */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Seus créditos: {userCredits.toLocaleString()}</span>
                <span>Especiais: {userSpecialCredits.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <Card className="p-6 shadow-2xl">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Criando Pixel Único...</h3>
                    <p className="text-sm text-muted-foreground">A aplicar efeitos e finalizar</p>
                  </div>
                  <Progress value={75} className="w-48" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}