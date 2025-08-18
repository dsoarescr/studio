'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from 'framer-motion';
import { ShoppingCart, Palette, Brush, Eraser, PaintBucket, Undo, Redo, Save, X, Zap, Sparkles, Crown, Star, Gift, Coins, Eye, Heart, Share2, Download, Upload, Settings, Grid3X3, Layers, Type, Image as ImageIcon, Wand2, Target, Droplets, Bluetooth as Blur, Copy, RotateCcw, Smile, MapPin, Flag, TreePine, Gem, Plus, Minus, Check, AlertTriangle, Info, Camera, Mic, Video, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PixelData {
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
  pixelData: PixelData | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: PixelData, paymentMethod: string, customizations: any) => Promise<boolean>;
}

interface CanvasState {
  imageData: ImageData | null;
  history: ImageData[];
  historyIndex: number;
}

const tools = [
  { id: 'brush', icon: Brush, label: 'Pincel', category: 'basic' },
  { id: 'pencil', icon: Brush, label: 'Lápis', category: 'basic' },
  { id: 'eraser', icon: Eraser, label: 'Borracha', category: 'basic' },
  { id: 'bucket', icon: PaintBucket, label: 'Balde', category: 'basic' },
  { id: 'eyedropper', icon: Eye, label: 'Conta-gotas', category: 'basic' },
  { id: 'spray', icon: Droplets, label: 'Spray', category: 'artistic' },
  { id: 'blur', icon: Blur, label: 'Desfoque', category: 'artistic' },
  { id: 'smudge', icon: Wand2, label: 'Borrar', category: 'artistic' },
];

const colorPalettes = {
  portugal: {
    name: 'Portugal',
    colors: ['#D4A757', '#228B22', '#FF0000', '#0000FF', '#FFFFFF', '#000000', '#8B4513', '#FFD700']
  },
  nature: {
    name: 'Natureza',
    colors: ['#228B22', '#32CD32', '#8FBC8F', '#006400', '#9ACD32', '#7CFC00', '#ADFF2F', '#98FB98']
  },
  ocean: {
    name: 'Oceano',
    colors: ['#0000FF', '#4169E1', '#1E90FF', '#00BFFF', '#87CEEB', '#87CEFA', '#B0E0E6', '#E0F6FF']
  },
  sunset: {
    name: 'Pôr do Sol',
    colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00', '#FF69B4', '#FF1493']
  }
};

const stickers = {
  emojis: ['😀', '😍', '🤩', '😎', '🥳', '😇'],
  symbols: ['⭐', '❤️', '🔥', '💎', '👑', '🏆'],
  nature: ['🌳', '🌸', '🌊', '⛰️', '🌅', '🌙'],
  portugal: ['🇵🇹', '🏰', '⚓', '🍷', '🐟', '🌊']
};

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [symmetryMode, setSymmetryMode] = useState('none');
  const [canvasState, setCanvasState] = useState<CanvasState>({
    imageData: null,
    history: [],
    historyIndex: -1
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('portugal');
  const [activeTab, setActiveTab] = useState('basic');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save initial state
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setCanvasState({
          imageData,
          history: [imageData],
          historyIndex: 0
        });
      }
    }
  }, [isOpen]);

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setCanvasState(prev => {
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(imageData);
        return {
          imageData,
          history: newHistory.slice(-50), // Keep last 50 states
          historyIndex: Math.min(newHistory.length - 1, 49)
        };
      });
    }
  };

  const handleUndo = () => {
    if (canvasState.historyIndex > 0) {
      const newIndex = canvasState.historyIndex - 1;
      const imageData = canvasState.history[newIndex];
      
      if (canvasRef.current && imageData) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.putImageData(imageData, 0, 0);
          setCanvasState(prev => ({ ...prev, historyIndex: newIndex }));
        }
      }
    }
  };

  const handleRedo = () => {
    if (canvasState.historyIndex < canvasState.history.length - 1) {
      const newIndex = canvasState.historyIndex + 1;
      const imageData = canvasState.history[newIndex];
      
      if (canvasRef.current && imageData) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.putImageData(imageData, 0, 0);
          setCanvasState(prev => ({ ...prev, historyIndex: newIndex }));
        }
      }
    }
  };

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    if (selectedTool === 'brush' || selectedTool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = selectedColor;
      ctx.globalAlpha = opacity / 100;
      
      const size = selectedTool === 'pencil' ? Math.max(1, brushSize / 2) : brushSize;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      
    } else if (selectedTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      
    } else if (selectedTool === 'bucket') {
      // Simple flood fill simulation
      ctx.fillStyle = selectedColor;
      ctx.globalAlpha = opacity / 100;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
    } else if (selectedTool === 'eyedropper') {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;
      const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      setSelectedColor(hexColor);
      
      toast({
        title: "Cor Capturada! 🎨",
        description: `Nova cor selecionada: ${hexColor}`,
      });
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleCanvasInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      handleCanvasInteraction(e);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    handleCanvasInteraction(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing) {
      handleCanvasInteraction(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const applyAIEnhancement = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Simulate AI enhancement
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply a simple enhancement filter
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.1);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);
      saveToHistory();
      
      toast({
        title: "IA Aplicada! 🤖",
        description: "Pixel melhorado automaticamente!",
      });
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  };

  const handlePurchase = async () => {
    if (!pixelData) return;
    
    setIsProcessing(true);
    
    try {
      const customizations = {
        color: selectedColor,
        title: customTitle || `Pixel (${pixelData.x}, ${pixelData.y})`,
        description: customDescription,
        canvas: canvasRef.current?.toDataURL()
      };
      
      const success = await onPurchase(pixelData, 'credits', customizations);
      
      if (success) {
        setShowConfetti(true);
        setPlaySound(true);
        
        toast({
          title: "Pixel Comprado! 🎉",
          description: "Sua obra de arte foi criada com sucesso!",
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

  const totalPrice = pixelData.price;
  const canAfford = userCredits >= totalPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-4xl h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              Editor de Pixel ({pixelData.x}, {pixelData.y})
              <Badge className="ml-2">{pixelData.rarity}</Badge>
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col p-4">
            {/* Toolbar */}
            <div className="mb-4 p-3 bg-muted/20 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-3">
                {tools.map(tool => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className="h-12 px-4"
                  >
                    <tool.icon className="h-5 w-5 mr-2" />
                    {tool.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleUndo}>
                  <Undo className="h-4 w-4 mr-2" />
                  Desfazer
                </Button>
                <Button variant="outline" size="sm" onClick={handleRedo}>
                  <Redo className="h-4 w-4 mr-2" />
                  Refazer
                </Button>
                <Button variant="outline" size="sm" onClick={clearCanvas}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button variant="outline" size="sm" onClick={applyAIEnhancement}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  IA Melhorar
                </Button>
              </div>
            </div>
            
            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="border-2 border-primary/30 rounded-lg bg-white cursor-crosshair touch-none"
                  style={{ imageRendering: 'pixelated' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #000 1px, transparent 1px),
                        linear-gradient(to bottom, #000 1px, transparent 1px)
                      `,
                      backgroundSize: `${gridSize}px ${gridSize}px`
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="colors">Cores</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[400px] lg:h-[calc(100vh-200px)]">
                <div className="p-4">
                  <TabsContent value="basic" className="space-y-4 mt-0">
                    {/* Brush Settings */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Configurações do Pincel</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm">Tamanho: {brushSize}px</Label>
                          <Slider
                            value={[brushSize]}
                            onValueChange={(value) => setBrushSize(value[0])}
                            min={1}
                            max={20}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm">Opacidade: {opacity}%</Label>
                          <Slider
                            value={[opacity]}
                            onValueChange={(value) => setOpacity(value[0])}
                            min={10}
                            max={100}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Grid Settings */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Grelha</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Mostrar Grelha</Label>
                          <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                        </div>
                        
                        {showGrid && (
                          <div>
                            <Label className="text-sm">Tamanho: {gridSize}px</Label>
                            <Slider
                              value={[gridSize]}
                              onValueChange={(value) => setGridSize(value[0])}
                              min={5}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="colors" className="space-y-4 mt-0">
                    {/* Color Picker */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Cor Atual</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg border-2 border-border"
                            style={{ backgroundColor: selectedColor }}
                          />
                          <Input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-20 h-12"
                          />
                          <Input
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            placeholder="#FFFFFF"
                            className="font-mono text-sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Color Palettes */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Paletas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(colorPalettes).map(([key, palette]) => (
                            <Button
                              key={key}
                              variant={selectedPalette === key ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedPalette(key)}
                              className="h-10"
                            >
                              {palette.name}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {colorPalettes[selectedPalette as keyof typeof colorPalettes].colors.map((color, index) => (
                            <button
                              key={index}
                              className="w-full h-10 rounded border-2 border-border hover:border-primary transition-colors"
                              style={{ backgroundColor: color }}
                              onClick={() => setSelectedColor(color)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4 mt-0">
                    {/* Pixel Details */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Detalhes do Pixel</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            placeholder={`Pixel (${pixelData.x}, ${pixelData.y})`}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={customDescription}
                            onChange={(e) => setCustomDescription(e.target.value)}
                            placeholder="Descreva sua obra de arte..."
                            rows={3}
                            className="mt-1 resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Stickers */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Stickers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-6 gap-2">
                          {Object.entries(stickers).map(([category, items]) => 
                            items.map((sticker, index) => (
                              <Button
                                key={`${category}-${index}`}
                                variant="outline"
                                size="sm"
                                className="h-10 text-lg"
                                onClick={() => {
                                  toast({
                                    title: "Sticker Adicionado! ✨",
                                    description: `${sticker} adicionado ao pixel`,
                                  });
                                }}
                              >
                                {sticker}
                              </Button>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gradient-to-r from-card to-primary/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">€{totalPrice}</div>
                <div className="text-xs text-muted-foreground">Preço Total</div>
              </div>
              
              {pixelData.specialCreditsPrice && (
                <div className="text-center">
                  <div className="text-lg font-medium text-accent">
                    {pixelData.specialCreditsPrice} especiais
                  </div>
                  <div className="text-xs text-muted-foreground">Alternativa</div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
              
              <Button
                onClick={handlePurchase}
                disabled={!canAfford || isProcessing}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-12 px-8"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Comprar e Criar
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {!canAfford && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">
                  Créditos insuficientes. Precisa de mais {totalPrice - userCredits} créditos.
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}