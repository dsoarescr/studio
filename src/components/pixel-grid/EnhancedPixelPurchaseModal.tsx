
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Coins, Gift, CreditCard, Palette, Brush, Eraser, PaintBucket, Sparkles, Star, Heart, Eye, MapPin, Globe, Clock, User, Tag, Link2, Download, Upload, Save, Undo, Redo, RotateCcw, ZoomIn, ZoomOut, Layers, Grid, Move, Copy, Scissors, Square, Circle, Triangle, Pen, Pencil, SprayCan as Spray, Bluetooth as Blur, Contrast, Copyright as Brightness, IterationCw as Saturation, Image as ImageIcon, Type, AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Strikethrough, Plus, Minus, X, Check, Info, AlertTriangle, Crown, Gem, Flame, CloudLightning as Lightning, Snowflake, Sun, Moon, Droplets, Wind, Zap, Shield, Lock, Unlock, Settings, Maximize, Minimize, MoreHorizontal, ChevronDown, ChevronUp, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Mic, Camera, Video, Music, Headphones, Speaker } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PixelData {
  x: number;
  y: number;
  owner?: string;
  price: number;
  specialCreditsPrice?: number;
  rarity: string;
  region: string;
  color?: string;
  title?: string;
  description?: string;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  views: number;
  likes: number;
  gpsCoords?: { lat: number; lon: number } | null;
  features?: string[];
  loreSnippet?: string;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: PixelData | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: PixelData, paymentMethod: string, customizations: any) => Promise<boolean>;
}

// Drawing tools
type DrawingTool = 'brush' | 'eraser' | 'bucket' | 'eyedropper' | 'line' | 'rectangle' | 'circle' | 'text';

// Predefined color palettes
const colorPalettes = {
  classic: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', '#E0BBE4', '#FFC9DE', '#C9FFC9'],
  neon: ['#FF073A', '#39FF14', '#0080FF', '#FFFF33', '#FF1493', '#00FFFF', '#FF4500', '#8A2BE2'],
  earth: ['#8B4513', '#228B22', '#4682B4', '#DAA520', '#CD853F', '#2E8B57', '#B8860B', '#A0522D'],
  ocean: ['#006994', '#0080FF', '#40E0D0', '#00CED1', '#4169E1', '#1E90FF', '#87CEEB', '#B0E0E6'],
  sunset: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42', '#FF6B6B', '#FF9F43', '#FFAD5A', '#FF7F7F']
};

// Brush presets
const brushPresets = [
  { name: 'Fino', size: 1, opacity: 100, hardness: 100 },
  { name: 'Médio', size: 3, opacity: 80, hardness: 80 },
  { name: 'Grosso', size: 5, opacity: 60, hardness: 60 },
  { name: 'Suave', size: 4, opacity: 40, hardness: 20 },
  { name: 'Textura', size: 6, opacity: 70, hardness: 50 },
];

// Filters and effects
const filterPresets = [
  { name: 'Original', filter: 'none' },
  { name: 'Vintage', filter: 'sepia(0.5) contrast(1.2) brightness(1.1)' },
  { name: 'Dramático', filter: 'contrast(1.5) saturate(1.3)' },
  { name: 'Suave', filter: 'blur(0.5px) brightness(1.1)' },
  { name: 'Neon', filter: 'saturate(2) contrast(1.3) brightness(1.2)' },
  { name: 'Monocromático', filter: 'grayscale(1) contrast(1.2)' },
];

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
  const [currentColor, setCurrentColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushHardness, setBrushHardness] = useState(80);
  const [selectedPalette, setSelectedPalette] = useState('classic');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Customization state
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelTags, setPixelTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [pixelLink, setPixelLink] = useState('');
  const [enableAnimations, setEnableAnimations] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [selectedFilter, setSelectedFilter] = useState('Original');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
  // Preview state
  const [previewMode, setPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const { toast } = useToast();

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(imageData);
        return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    canvas.width = 64;
    canvas.height = 64;
    
    ctx.fillStyle = pixelData?.color || '#333333';
    ctx.fillRect(0, 0, 64, 64);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasHistory([imageData]);
    setHistoryIndex(0);
    
  }, [isOpen, pixelData]);

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex - 1;
      ctx.putImageData(canvasHistory[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex + 1;
      ctx.putImageData(canvasHistory[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = pixelData?.color || '#D4A757';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    draw(e);
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    ctx.globalAlpha = brushOpacity / 100;
    
    switch (currentTool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'bucket':
        // Simple flood fill implementation
        ctx.fillStyle = currentColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
    }
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const addTag = () => {
    if (newTag.trim() && !pixelTags.includes(newTag.trim())) {
      setPixelTags([...pixelTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPixelTags(pixelTags.filter(tag => tag !== tagToRemove));
  };

  const handlePurchaseClick = async () => {
    if (!pixelData) return;
    
    setIsProcessing(true);
    
    try {
      // Get canvas data as a Data URI
      const canvas = canvasRef.current;
      const imageDataUri = canvas ? canvas.toDataURL('image/png') : null;
      
      const customizations = {
        title: pixelTitle,
        description: pixelDescription,
        tags: pixelTags,
        link: pixelLink,
        color: currentColor,
        image: imageDataUri,
        animations: enableAnimations,
        animationSpeed,
        filter: selectedFilter,
        brightness,
        contrast,
        saturation
      };
      
      const success = await onPurchase(pixelData, 'credits', customizations);
      
      if (success) {
        setShowConfetti(true);
        setPlaySuccessSound(true);
        
        toast({
          title: "Pixel Adquirido com Sucesso!",
          description: `O pixel (${pixelData.x}, ${pixelData.y}) agora é seu!`,
        });
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast({
          title: "Erro na Compra",
          description: "Não foi possível completar a compra. Verifique seus créditos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro durante a compra. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!pixelData) return null;

  const canAfford = userCredits >= pixelData.price;
  const canAffordSpecial = pixelData.specialCreditsPrice ? userSpecialCredits >= pixelData.specialCreditsPrice : false;
  const isForSale = pixelData.isForSaleBySystem;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-card via-card/95 to-primary/5">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-card to-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
          <div className="relative z-10">
            <DialogTitle className="text-2xl font-headline text-gradient-gold flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3 animate-glow" />
              Pixel Studio - ({pixelData.x}, {pixelData.y})
            </DialogTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-primary border-primary/50">
                {pixelData.rarity}
              </Badge>
              <Badge variant="outline" className="text-accent border-accent/50">
                {pixelData.region}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                {pixelData.views}
                <Heart className="h-4 w-4 ml-3 mr-1" />
                {pixelData.likes}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-6 pt-4 bg-transparent justify-start border-b rounded-none gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
              <Info className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="editor" className="data-[state=active]:bg-primary/10">
              <Palette className="h-4 w-4 mr-2" />
              Editor Avançado
            </TabsTrigger>
            <TabsTrigger value="customize" className="data-[state=active]:bg-primary/10">
              <Sparkles className="h-4 w-4 mr-2" />
              Personalizar
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-primary/10">
              <Eye className="h-4 w-4 mr-2" />
              Pré-visualização
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-primary">
                        <MapPin className="h-5 w-5 mr-2" />
                        Informações do Pixel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Coordenadas</Label>
                          <p className="font-mono text-lg font-bold">({pixelData.x}, {pixelData.y})</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Região</Label>
                          <p className="font-medium">{pixelData.region}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Raridade</Label>
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                            {pixelData.rarity}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Proprietário</Label>
                          <p className="font-medium">{pixelData.owner || 'Sistema'}</p>
                        </div>
                      </div>
                      
                      {pixelData.gpsCoords && (
                        <div className="p-3 bg-background/50 rounded-lg">
                          <Label className="text-sm text-muted-foreground">Coordenadas GPS</Label>
                          <p className="font-mono text-sm">
                            {pixelData.gpsCoords.lat.toFixed(6)}, {pixelData.gpsCoords.lon.toFixed(6)}
                          </p>
                        </div>
                      )}
                      
                      {pixelData.loreSnippet && (
                        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                          <Label className="text-sm text-accent">História Local</Label>
                          <p className="text-sm italic mt-1">{pixelData.loreSnippet}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-accent">
                        <Coins className="h-5 w-5 mr-2" />
                        Preços e Pagamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <div className="flex items-center">
                            <Coins className="h-5 w-5 text-primary mr-2" />
                            <span>Créditos Normais</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{pixelData.price}€</p>
                            <p className="text-xs text-muted-foreground">
                              Saldo: {userCredits.toLocaleString('pt-PT')}
                            </p>
                          </div>
                        </div>
                        
                        {pixelData.specialCreditsPrice && (
                          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                            <div className="flex items-center">
                              <Gift className="h-5 w-5 text-accent mr-2" />
                              <span>Créditos Especiais</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{pixelData.specialCreditsPrice}</p>
                              <p className="text-xs text-muted-foreground">
                                Saldo: {userSpecialCredits.toLocaleString('pt-PT')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {!canAfford && !canAffordSpecial && (
                        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                          <div className="flex items-center text-destructive">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Créditos Insuficientes</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Você precisa de mais créditos para comprar este pixel.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Editor Tab */}
              <TabsContent value="editor" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Canvas Area */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Palette className="h-5 w-5 mr-2 text-primary" />
                            Editor de Pixel Art
                          </span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                              <Undo className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= canvasHistory.length - 1}>
                              <Redo className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={clearCanvas}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <canvas
                              ref={canvasRef}
                              className="border-2 border-primary/30 rounded-lg cursor-crosshair"
                              style={{ 
                                width: '320px', 
                                height: '320px',
                                imageRendering: 'pixelated',
                                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                              }}
                              onMouseDown={handleCanvasMouseDown}
                              onMouseMove={handleCanvasMouseMove}
                              onMouseUp={handleCanvasMouseUp}
                              onMouseLeave={handleCanvasMouseUp}
                            />
                            {showGrid && (
                              <div className="absolute inset-0 pointer-events-none"
                                   style={{
                                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                     backgroundSize: '5px 5px'
                                   }} />
                            )}
                          </div>
                        </div>
                        
                        {/* Zoom Controls */}
                        <div className="flex items-center justify-center gap-4">
                          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-mono">{zoomLevel}%</span>
                          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(400, zoomLevel + 25))}>
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-6" />
                          <div className="flex items-center gap-2">
                            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                            <Label className="text-sm">Grade</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tools Panel */}
                  <div className="space-y-4">
                    {/* Drawing Tools */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Ferramentas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { tool: 'brush', icon: Brush, label: 'Pincel' },
                            { tool: 'eraser', icon: Eraser, label: 'Borracha' },
                            { tool: 'bucket', icon: PaintBucket, label: 'Balde' },
                            { tool: 'eyedropper', icon: Sparkles, label: 'Conta-gotas' },
                          ].map(({ tool, icon: Icon, label }) => (
                            <TooltipProvider key={tool}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={currentTool === tool ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentTool(tool as DrawingTool)}
                                    className="aspect-square p-2"
                                  >
                                    <Icon className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{label}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Brush Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Configurações do Pincel</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Tamanho: {brushSize}px</Label>
                          <Slider
                            value={[brushSize]}
                            onValueChange={([value]) => setBrushSize(value)}
                            min={1}
                            max={20}
                            step={1}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Opacidade: {brushOpacity}%</Label>
                          <Slider
                            value={[brushOpacity]}
                            onValueChange={([value]) => setBrushOpacity(value)}
                            min={10}
                            max={100}
                            step={5}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Dureza: {brushHardness}%</Label>
                          <Slider
                            value={[brushHardness]}
                            onValueChange={([value]) => setBrushHardness(value)}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Presets</Label>
                          <div className="grid grid-cols-1 gap-1">
                            {brushPresets.map((preset) => (
                              <Button
                                key={preset.name}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setBrushSize(preset.size);
                                  setBrushOpacity(preset.opacity);
                                  setBrushHardness(preset.hardness);
                                }}
                                className="justify-start text-xs"
                              >
                                {preset.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Color Picker */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Cores</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-12 h-12 rounded border border-border cursor-pointer"
                          />
                          <div className="flex-1">
                            <Input
                              value={currentColor}
                              onChange={(e) => setCurrentColor(e.target.value)}
                              placeholder="#000000"
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Paletas</Label>
                          <div className="grid grid-cols-4 gap-1">
                            {Object.entries(colorPalettes).map(([name, colors]) => (
                              <Button
                                key={name}
                                variant={selectedPalette === name ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedPalette(name)}
                                className="text-xs p-1"
                              >
                                {name}
                              </Button>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-4 gap-1 mt-2">
                            {colorPalettes[selectedPalette as keyof typeof colorPalettes].map((color, index) => (
                              <button
                                key={index}
                                className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                                style={{ backgroundColor: color }}
                                onClick={() => setCurrentColor(color)}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Customize Tab */}
              <TabsContent value="customize" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-primary">
                        <Type className="h-5 w-5 mr-2" />
                        Informações do Pixel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título do Pixel</Label>
                        <Input
                          value={pixelTitle}
                          onChange={(e) => setPixelTitle(e.target.value)}
                          placeholder="Dê um nome único ao seu pixel..."
                          maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">{pixelTitle.length}/50 caracteres</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={pixelDescription}
                          onChange={(e) => setPixelDescription(e.target.value)}
                          placeholder="Conte a história do seu pixel..."
                          rows={4}
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground">{pixelDescription.length}/200 caracteres</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Adicionar tag..."
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button onClick={addTag} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pixelTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Link Personalizado (Opcional)</Label>
                        <Input
                          value={pixelLink}
                          onChange={(e) => setPixelLink(e.target.value)}
                          placeholder="https://..."
                          type="url"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-accent">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Efeitos e Filtros
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Animações</Label>
                          <Switch checked={enableAnimations} onCheckedChange={setEnableAnimations} />
                        </div>
                        
                        {enableAnimations && (
                          <div className="space-y-2">
                            <Label className="text-sm">Velocidade da Animação: {animationSpeed}%</Label>
                            <Slider
                              value={[animationSpeed]}
                              onValueChange={([value]) => setAnimationSpeed(value)}
                              min={10}
                              max={200}
                              step={10}
                            />
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>Filtros</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {filterPresets.map((filter) => (
                              <Button
                                key={filter.name}
                                variant={selectedFilter === filter.name ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedFilter(filter.name)}
                                className="text-xs"
                              >
                                {filter.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Brilho: {brightness}%</Label>
                            <Slider
                              value={[brightness]}
                              onValueChange={([value]) => setBrightness(value)}
                              min={50}
                              max={150}
                              step={5}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Contraste: {contrast}%</Label>
                            <Slider
                              value={[contrast]}
                              onValueChange={([value]) => setContrast(value)}
                              min={50}
                              max={150}
                              step={5}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Saturação: {saturation}%</Label>
                            <Slider
                              value={[saturation]}
                              onValueChange={([value]) => setSaturation(value)}
                              min={0}
                              max={200}
                              step={5}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center text-primary">
                        <Eye className="h-5 w-5 mr-2" />
                        Pré-visualização Final
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                      >
                        {previewMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                        {previewMode ? 'Compacto' : 'Expandir'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={cn(
                      "grid gap-6",
                      previewMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
                    )}>
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <canvas
                              ref={canvasRef}
                              className="border-2 border-primary/30 rounded-lg"
                              style={{ 
                                width: previewMode ? '400px' : '200px', 
                                height: previewMode ? '400px' : '200px',
                                imageRendering: 'pixelated',
                                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                              }}
                            />
                            {enableAnimations && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-lg"
                                   style={{ 
                                     backgroundSize: '200% 100%',
                                     animationDuration: `${2000 / (animationSpeed / 100)}ms`
                                   }} />
                            )}
                          </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <h3 className="font-semibold text-lg">{pixelTitle || `Pixel (${pixelData.x}, ${pixelData.y})`}</h3>
                          {pixelDescription && (
                            <p className="text-sm text-muted-foreground">{pixelDescription}</p>
                          )}
                          {pixelTags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1">
                              {pixelTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!previewMode && (
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/20 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              Resumo da Compra
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Pixel:</span>
                                <span className="font-mono">({pixelData.x}, {pixelData.y})</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Região:</span>
                                <span>{pixelData.region}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Raridade:</span>
                                <Badge variant="outline" className="text-xs">{pixelData.rarity}</Badge>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-semibold">
                                <span>Preço:</span>
                                <span className="text-primary">{pixelData.price}€</span>
                              </div>
                              {pixelData.specialCreditsPrice && (
                                <div className="flex justify-between">
                                  <span>Ou:</span>
                                  <span className="text-accent">{pixelData.specialCreditsPrice} especiais</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center text-primary">
                              <Gem className="h-4 w-4 mr-2" />
                              Funcionalidades Incluídas
                            </h4>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                Arte personalizada
                              </li>
                              <li className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                Título e descrição únicos
                              </li>
                              <li className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                Tags personalizadas
                              </li>
                              {enableAnimations && (
                                <li className="flex items-center">
                                  <Check className="h-3 w-3 mr-2 text-green-500" />
                                  Efeitos de animação
                                </li>
                              )}
                              {pixelLink && (
                                <li className="flex items-center">
                                  <Check className="h-3 w-3 mr-2 text-green-500" />
                                  Link personalizado
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="p-6 border-t bg-gradient-to-r from-card to-primary/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Saldo: {userCredits.toLocaleString('pt-PT')} créditos
              </div>
              {pixelData.specialCreditsPrice && (
                <div className="text-sm text-muted-foreground">
                  {userSpecialCredits.toLocaleString('pt-PT')} especiais
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
              {isForSale && (
                <Button
                  onClick={handlePurchaseClick}
                  disabled={isProcessing || (!canAfford && !canAffordSpecial)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 min-w-[120px]"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar Agora
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
