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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ShoppingCart, Palette, Brush, Eraser, PaintBucket, Circle, Square, 
  Triangle, Star, Heart, Diamond, Hexagon, Plus, Minus, Eye, EyeOff,
  Layers, Undo, Redo, RotateCcw, ZoomIn, ZoomOut, Grid3X3, Move,
  Wand2, Sparkles, Upload, Download, Play, Pause, Video, Camera,
  Settings, X, Crown, Gem, Zap, Gift, Coins, TreePine, Sun, Moon,
  Cloud, Droplets, Wind, Rainbow, Smile, Cat, Feather, Flag, Gamepad2,
  Laptop, MessageSquare, Type, Filter, Copy, Edit3, Trash2, Shuffle,
  Activity, ArrowUp, ArrowLeft, Hand, Pen, PenTool, Pipette, Paintbrush,
  Flame
} from 'lucide-react';

interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: string;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  specialCreditsPrice?: number;
  color?: string;
  title?: string;
  description?: string;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any) => Promise<boolean>;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement;
}

interface TimelapseFrame {
  timestamp: number;
  imageData: ImageData;
}

const CANVAS_SIZE = 256;
const PIXEL_SIZE = 8;
const GRID_SIZE = CANVAS_SIZE / PIXEL_SIZE;

// Ferramentas organizadas por categoria
const toolCategories = {
  basic: [
    { id: 'brush', icon: Brush, label: 'Pincel', size: 'sm' },
    { id: 'eraser', icon: Eraser, label: 'Borracha', size: 'sm' },
    { id: 'bucket', icon: PaintBucket, label: 'Balde', size: 'sm' },
    { id: 'eyedropper', icon: Pipette, label: 'Conta-gotas', size: 'sm' }
  ],
  shapes: [
    { id: 'circle', icon: Circle, label: 'Círculo', size: 'sm' },
    { id: 'square', icon: Square, label: 'Quadrado', size: 'sm' },
    { id: 'triangle', icon: Triangle, label: 'Triângulo', size: 'sm' },
    { id: 'diamond', icon: Diamond, label: 'Diamante', size: 'sm' }
  ],
  advanced: [
    { id: 'pen', icon: Pen, label: 'Caneta', size: 'sm' },
    { id: 'pencil', icon: PenTool, label: 'Lápis', size: 'sm' },
    { id: 'marker', icon: Paintbrush, label: 'Marcador', size: 'sm' },
    { id: 'spray', icon: Wind, label: 'Spray', size: 'sm' }
  ]
};

// Paletas de cores temáticas
const colorPalettes = {
  classic: ['#D4A757', '#7DF9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  neon: ['#FF073A', '#39FF14', '#00FFFF', '#FF1493', '#FFFF00', '#FF4500', '#9400D3', '#00FF7F'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E1BAFF', '#FFBAE1', '#C9BAFF'],
  earth: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3'],
  ocean: ['#006994', '#0085C3', '#009FDF', '#00B9F1', '#66D9EF', '#87CEEB', '#4682B4', '#5F9EA0'],
  fire: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F'],
  portugal: ['#006600', '#FF0000', '#FFD700', '#0066CC', '#FFFFFF', '#000000', '#8B4513', '#228B22']
};

// Stickers organizados
const stickerCategories = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩'],
  hands: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌱', '🌳', '🌲', '🌴', '🌵', '🌾', '🌊', '⭐', '🌟'],
  portugal: ['🇵🇹', '🏰', '⚽', '🐟', '🍷', '🥖', '🌊', '🏖️', '🌅', '🚢', '⛵', '🎣', '🦆', '🐚', '🌺', '🍇'],
  gaming: ['🎮', '🕹️', '🎯', '🎲', '🃏', '🎰', '🎪', '🎨', '🖌️', '🖍️', '✏️', '📝', '📱', '💻', '⌨️', '🖱️']
};

// Efeitos especiais
const specialEffects = [
  { id: 'glow', name: 'Brilho', icon: Sparkles, cost: 10, description: 'Adiciona um brilho mágico' },
  { id: 'shadow', name: 'Sombra', icon: Circle, cost: 15, description: 'Cria profundidade com sombras' },
  { id: 'neon', name: 'Neon', icon: Zap, cost: 25, description: 'Efeito neon vibrante' },
  { id: 'hologram', name: 'Holograma', icon: Gem, cost: 35, description: 'Efeito holográfico futurista' },
  { id: 'fire', name: 'Fogo', icon: Flame, cost: 30, description: 'Chamas dançantes' },
  { id: 'ice', name: 'Gelo', icon: Droplets, cost: 20, description: 'Cristais de gelo' }
];

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  // Estados principais
  const [activeTab, setActiveTab] = useState('draw');
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(4);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timelapseFrames, setTimelapseFrames] = useState<TimelapseFrame[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Estados de customização
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('classic');
  const [showGrid, setShowGrid] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  
  // Estados de UI
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();

  // Inicializar canvas e primeira camada
  useEffect(() => {
    if (isOpen && canvasRef.current && layers.length === 0) {
      const canvas = canvasRef.current;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      
      // Criar primeira camada
      const firstLayer: Layer = {
        id: '1',
        name: 'Camada 1',
        visible: true,
        opacity: 100,
        canvas: document.createElement('canvas')
      };
      firstLayer.canvas.width = CANVAS_SIZE;
      firstLayer.canvas.height = CANVAS_SIZE;
      
      setLayers([firstLayer]);
      drawCanvas();
    }
  }, [isOpen]);

  // Timer de gravação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        captureFrame();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Desenhar fundo base
    ctx.fillStyle = pixelData?.color || '#F0F0F0';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Desenhar camadas
    layers.forEach(layer => {
      if (layer.visible) {
        ctx.globalAlpha = layer.opacity / 100;
        ctx.drawImage(layer.canvas, 0, 0);
      }
    });
    
    ctx.globalAlpha = 1;
    
    // Desenhar grelha se ativa
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * PIXEL_SIZE;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, CANVAS_SIZE);
        ctx.moveTo(0, pos);
        ctx.lineTo(CANVAS_SIZE, pos);
        ctx.stroke();
      }
    }
  }, [layers, showGrid, pixelData]);

  const getCanvasCoordinates = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const drawPixel = (x: number, y: number) => {
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer) return;
    
    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;
    
    const pixelX = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE;
    const pixelY = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE;
    
    if (selectedTool === 'eraser') {
      ctx.clearRect(pixelX, pixelY, PIXEL_SIZE, PIXEL_SIZE);
    } else {
      ctx.fillStyle = selectedColor;
      ctx.fillRect(pixelX, pixelY, PIXEL_SIZE, PIXEL_SIZE);
      
      // Aplicar simetria
      if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
        const mirrorX = CANVAS_SIZE - pixelX - PIXEL_SIZE;
        ctx.fillRect(mirrorX, pixelY, PIXEL_SIZE, PIXEL_SIZE);
      }
      if (symmetryMode === 'vertical' || symmetryMode === 'both') {
        const mirrorY = CANVAS_SIZE - pixelY - PIXEL_SIZE;
        ctx.fillRect(pixelX, mirrorY, PIXEL_SIZE, PIXEL_SIZE);
      }
      if (symmetryMode === 'both') {
        const mirrorX = CANVAS_SIZE - pixelX - PIXEL_SIZE;
        const mirrorY = CANVAS_SIZE - pixelY - PIXEL_SIZE;
        ctx.fillRect(mirrorX, mirrorY, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
    
    drawCanvas();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    setLastPoint(coords);
    drawPixel(coords.x, coords.y);
    vibrate('light');
    
    // Salvar estado para undo
    saveToUndoStack();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e);
    if (!coords || !lastPoint) return;
    
    // Interpolação para traços suaves
    const dx = coords.x - lastPoint.x;
    const dy = coords.y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(distance / 2));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = lastPoint.x + dx * t;
      const y = lastPoint.y + dy * t;
      drawPixel(x, y);
    }
    
    setLastPoint(coords);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const saveToUndoStack = () => {
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer) return;
    
    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setUndoStack(prev => [...prev.slice(-49), imageData]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer) return;
    
    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setRedoStack(prev => [...prev, currentState]);
    
    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setUndoStack(prev => prev.slice(0, -1));
    
    drawCanvas();
    vibrate('medium');
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer) return;
    
    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setUndoStack(prev => [...prev, currentState]);
    
    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState, 0, 0);
    setRedoStack(prev => prev.slice(0, -1));
    
    drawCanvas();
    vibrate('medium');
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `Camada ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      canvas: document.createElement('canvas')
    };
    newLayer.canvas.width = CANVAS_SIZE;
    newLayer.canvas.height = CANVAS_SIZE;
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerIndex(layers.length);
    
    vibrate('success');
    toast({
      title: "Nova Camada Criada! 🎨",
      description: `${newLayer.name} adicionada com sucesso.`,
    });
  };

  const captureFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setTimelapseFrames(prev => [...prev, {
      timestamp: Date.now(),
      imageData
    }]);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTimelapseFrames([]);
    vibrate('success');
    toast({
      title: "🎬 Gravação Iniciada!",
      description: "A capturar o seu processo criativo...",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    vibrate('success');
    toast({
      title: "🎬 Timelapse Criado!",
      description: `${timelapseFrames.length} frames capturados em ${recordingTime}s`,
    });
  };

  const applyAIEffect = async (effectType: string) => {
    setIsProcessingAI(true);
    setAiProgress(0);
    
    // Simular processamento IA
    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessingAI(false);
          
          vibrate('success');
          setShowConfetti(true);
          setPlaySound(true);
          
          toast({
            title: "🤖 IA Concluída!",
            description: `Efeito ${effectType} aplicado com sucesso!`,
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const applySticker = (sticker: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simular aplicação de sticker no centro
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(sticker, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    
    vibrate('light');
    toast({
      title: "Sticker Aplicado! ✨",
      description: `${sticker} adicionado ao seu pixel.`,
    });
  };

  const calculateTotalPrice = () => {
    let total = pixelData?.price || 0;
    
    // Custo por camadas extras
    if (layers.length > 1) {
      total += (layers.length - 1) * 10;
    }
    
    // Custo por animação
    if (timelapseFrames.length > 0) {
      total += 50;
    }
    
    return total;
  };

  const handlePurchase = async () => {
    if (!pixelData) return;
    
    const customizations = {
      title: pixelTitle,
      description: pixelDescription,
      color: selectedColor,
      layers: layers.length,
      hasAnimation: timelapseFrames.length > 0,
      canvas: canvasRef.current?.toDataURL()
    };
    
    const success = await onPurchase(pixelData, 'credits', customizations);
    
    if (success) {
      setShowConfetti(true);
      setPlaySound(true);
      vibrate('success');
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (!pixelData) return null;

  // Usar Sheet para mobile, Dialog para desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const ModalContent = () => (
    <div className="flex flex-col h-full">
      {/* Header Compacto para Mobile */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Pixel ({pixelData.x}, {pixelData.y})</h2>
            <p className="text-sm text-muted-foreground">{pixelData.region}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">€{calculateTotalPrice()}</div>
            <Badge className="text-xs">{pixelData.rarity}</Badge>
          </div>
        </div>
        
        {/* Barra de Ferramentas Superior */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={undo} disabled={undoStack.length === 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={redo} disabled={redoStack.length === 0}>
              <Redo className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant={isRecording ? "destructive" : "outline"}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <Pause className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-1 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono">{recordingTime}s</span>
              </div>
            )}
            <Button size="sm" variant="outline" onClick={() => setShowGrid(!showGrid)}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Principal - Otimizado para Mobile */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-4 flex items-center justify-center bg-muted/20">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-2 border-primary/30 rounded-lg bg-white touch-none"
              style={{ 
                width: '280px', 
                height: '280px',
                imageRendering: 'pixelated'
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onTouchStart={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              onTouchEnd={(e) => e.preventDefault()}
            />
            
            {/* Indicador de Camada Ativa */}
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Camada {activeLayerIndex + 1}
            </div>
            
            {/* Indicador de Simetria */}
            {symmetryMode !== 'none' && (
              <div className="absolute -bottom-2 -left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                Simetria: {symmetryMode}
              </div>
            )}
          </div>
        </div>

        {/* Tabs de Ferramentas - Otimizado para Mobile */}
        <div className="border-t bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50">
              <TabsTrigger value="draw" className="text-xs">
                <Brush className="h-4 w-4 mb-1" />
                Desenhar
              </TabsTrigger>
              <TabsTrigger value="colors" className="text-xs">
                <Palette className="h-4 w-4 mb-1" />
                Cores
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">
                <Sparkles className="h-4 w-4 mb-1" />
                Efeitos
              </TabsTrigger>
              <TabsTrigger value="stickers" className="text-xs">
                <Smile className="h-4 w-4 mb-1" />
                Stickers
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">
                <Layers className="h-4 w-4 mb-1" />
                Camadas
              </TabsTrigger>
            </TabsList>

            {/* Tab: Desenhar */}
            <TabsContent value="draw" className="p-4 space-y-4">
              {/* Ferramentas Básicas */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Ferramentas</Label>
                <div className="grid grid-cols-4 gap-2">
                  {toolCategories.basic.map(tool => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedTool(tool.id);
                        vibrate('light');
                      }}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <tool.icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Formas */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Formas</Label>
                <div className="grid grid-cols-4 gap-2">
                  {toolCategories.shapes.map(shape => (
                    <Button
                      key={shape.id}
                      variant={selectedTool === shape.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedTool(shape.id);
                        vibrate('light');
                      }}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <shape.icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{shape.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Controles de Pincel */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Tamanho do Pincel: {brushSize}px
                  </Label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    min={1}
                    max={16}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Simetria</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'Nenhuma' },
                      { id: 'horizontal', label: 'Horizontal' },
                      { id: 'vertical', label: 'Vertical' },
                      { id: 'both', label: 'Ambas' }
                    ].map(mode => (
                      <Button
                        key={mode.id}
                        variant={symmetryMode === mode.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSymmetryMode(mode.id as any);
                          vibrate('light');
                        }}
                        className="text-xs"
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Cores */}
            <TabsContent value="colors" className="p-4 space-y-4">
              {/* Seletor de Paleta */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Paletas Temáticas</Label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {Object.entries(colorPalettes).map(([key, colors]) => (
                    <Button
                      key={key}
                      variant={selectedPalette === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedPalette(key);
                        vibrate('light');
                      }}
                      className="text-xs capitalize"
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cores da Paleta Selecionada */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Cores</Label>
                <div className="grid grid-cols-8 gap-2">
                  {colorPalettes[selectedPalette as keyof typeof colorPalettes].map(color => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded border-2 transition-all",
                        selectedColor === color ? "border-foreground scale-110 shadow-lg" : "border-border hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSelectedColor(color);
                        vibrate('light');
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Seletor de Cor Personalizada */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Cor Personalizada</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-16 h-10 p-1 border-2"
                  />
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    placeholder="#D4A757"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Efeitos */}
            <TabsContent value="effects" className="p-4 space-y-4">
              {/* IA Generativa */}
              <div>
                <Label className="text-sm font-medium mb-2 block">🤖 IA Generativa</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'enhance', name: 'Melhorar', icon: Sparkles },
                    { id: 'style', name: 'Estilo', icon: Wand2 },
                    { id: 'details', name: 'Detalhes', icon: Eye },
                    { id: 'harmony', name: 'Harmonia', icon: Palette }
                  ].map(effect => (
                    <Button
                      key={effect.id}
                      variant="outline"
                      size="sm"
                      onClick={() => applyAIEffect(effect.name)}
                      disabled={isProcessingAI}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <effect.icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{effect.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Efeitos Especiais */}
              <div>
                <Label className="text-sm font-medium mb-2 block">✨ Efeitos Especiais</Label>
                <div className="grid grid-cols-2 gap-2">
                  {specialEffects.slice(0, 6).map(effect => (
                    <Button
                      key={effect.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (userSpecialCredits >= effect.cost) {
                          applyAIEffect(effect.name);
                        } else {
                          toast({
                            title: "Créditos Insuficientes",
                            description: `Precisa de ${effect.cost} créditos especiais.`,
                            variant: "destructive"
                          });
                        }
                      }}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <effect.icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{effect.name}</span>
                      <span className="text-xs text-accent">{effect.cost}✨</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Progresso IA */}
              {isProcessingAI && (
                <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
                      <span className="text-sm font-medium">IA Processando...</span>
                    </div>
                    <Progress value={aiProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{aiProgress}% concluído</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Stickers */}
            <TabsContent value="stickers" className="p-4">
              <ScrollArea className="h-48">
                <div className="space-y-4">
                  {Object.entries(stickerCategories).map(([category, stickers]) => (
                    <div key={category}>
                      <Label className="text-sm font-medium mb-2 block capitalize">
                        {category}
                      </Label>
                      <div className="grid grid-cols-8 gap-1">
                        {stickers.map(sticker => (
                          <button
                            key={sticker}
                            className="w-8 h-8 text-lg hover:bg-muted rounded transition-colors flex items-center justify-center"
                            onClick={() => applySticker(sticker)}
                          >
                            {sticker}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Tab: Camadas */}
            <TabsContent value="layers" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Camadas ({layers.length})</Label>
                <Button size="sm" onClick={addLayer}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </div>

              <div className="space-y-2">
                {layers.map((layer, index) => (
                  <Card 
                    key={layer.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all",
                      activeLayerIndex === index && "border-primary bg-primary/10"
                    )}
                    onClick={() => setActiveLayerIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLayers(prev => prev.map((l, i) => 
                              i === index ? { ...l, visible: !l.visible } : l
                            ));
                          }}
                        >
                          {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <span className="text-sm font-medium">{layer.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {layer.opacity}%
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Slider
                        value={[layer.opacity]}
                        onValueChange={(value) => {
                          setLayers(prev => prev.map((l, i) => 
                            i === index ? { ...l, opacity: value[0] } : l
                          ));
                          drawCanvas();
                        }}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Área de Customização - Compacta para Mobile */}
        <div className="border-t p-4 space-y-3 bg-muted/20">
          <div className="grid grid-cols-1 gap-3">
            <Input
              placeholder="Título do pixel..."
              value={pixelTitle}
              onChange={(e) => setPixelTitle(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder="Descrição (opcional)..."
              value={pixelDescription}
              onChange={(e) => setPixelDescription(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>

        {/* Botões de Ação - Fixos na Base */}
        <div className="border-t p-4 bg-background">
          <div className="space-y-3">
            {/* Resumo de Custos */}
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pixel base:</span>
                    <span>€{pixelData.price}</span>
                  </div>
                  {layers.length > 1 && (
                    <div className="flex justify-between">
                      <span>Camadas extras ({layers.length - 1}):</span>
                      <span>€{(layers.length - 1) * 10}</span>
                    </div>
                  )}
                  {timelapseFrames.length > 0 && (
                    <div className="flex justify-between">
                      <span>Timelapse ({timelapseFrames.length} frames):</span>
                      <span>€50</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-primary">
                    <span>Total:</span>
                    <span>€{calculateTotalPrice()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={onClose} className="h-12">
                Cancelar
              </Button>
              <Button 
                onClick={handlePurchase}
                className="h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={!pixelTitle.trim()}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-2xl">
            <SheetHeader className="sr-only">
              <SheetTitle>Editor de Pixel</SheetTitle>
            </SheetHeader>
            <ModalContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md h-[90vh] p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Editor de Pixel</DialogTitle>
            </DialogHeader>
            <ModalContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}