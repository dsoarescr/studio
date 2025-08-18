'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { Palette, Brush, Eraser, PaintBucket, Undo, Redo, Save, Download, Upload, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers, Plus, Minus, X, Check, Sparkles, Crown, Gem, Star, Coins, Gift, ShoppingCart, CreditCard, Zap, Image as ImageIcon, Link as LinkIcon, Hash, Type, Sliders, Sun, Moon, Contrast, Bluetooth as Blur, Copyright as Brightness, IterationCw as Saturation, Droplets, Flame, Hexagon, Circle, Square, Triangle, Pencil, Move, RotateCw, FlipHorizontal, FlipVertical, Copy, Clipboard, Grid, Crosshair, Target, Wand2, Scissors, Stamp, Pipette, MousePointer, Hand, Maximize, Minimize, RotateCw as RotateClockwise, Shuffle, Repeat, Layers3, PaintBucket as PaintBucket2, SprayCan as Spray, Pen, Highlighter, Ruler, Compass, Magnet, BadgeCent as Gradient, Text as Texture, Battery as Pattern, Sticker, Frame, Sword as Border, Share as Shadow, Globe as Glow, VideoIcon as Neon, Mountain as Vintage, Droplet as Retro, Code as Modern, Tractor as Abstract, Italic as Realistic, Car as Cartoon, Timer as Anime, Pi as Pixel, Twitch as Glitch, AArrowDown as VHS, AArrowDown as CRT, AArrowDown as LCD, AArrowDown as OLED, AArrowDown as HDR, BookAIcon as AI, Notebook as Robot, Magnet as Magic, Italic as Crystal, Diamond, Rainbow, Printer as Prism, Telescope as Kaleidoscope, Panda as Mandala, Contact as Fractal, Hospital as Spiral, Waves as Wave, HeartPulse as Pulse } from 'lucide-react'  specialCreditsPrice?: number;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  views: number;
  likes: number;
  description?: string;
  features?: string[];
  gpsCoords?: { lat: number; lon: number } | null;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any) => Promise<boolean>;
}

interface DrawingTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  cursor: string;
  size?: number;
  opacity?: number;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement;
}

interface PixelEffect {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  premium: boolean;
}

const drawingTools: DrawingTool[] = [
  { id: 'brush', name: 'Pincel', icon: <Brush className="h-4 w-4" />, cursor: 'crosshair', size: 5 },
  { id: 'eraser', name: 'Borracha', icon: <Eraser className="h-4 w-4" />, cursor: 'grab', size: 10 },
  { id: 'bucket', name: 'Balde', icon: <PaintBucket className="h-4 w-4" />, cursor: 'pointer' },
  { id: 'eyedropper', name: 'Conta-gotas', icon: <Pipette className="h-4 w-4" />, cursor: 'copy' },
  { id: 'text', name: 'Texto', icon: <Type className="h-4 w-4" />, cursor: 'text' },
  { id: 'line', name: 'Linha', icon: <Minus className="h-4 w-4" />, cursor: 'crosshair' },
  { id: 'rectangle', name: 'Retângulo', icon: <Square className="h-4 w-4" />, cursor: 'crosshair' },
  { id: 'circle', name: 'Círculo', icon: <Circle className="h-4 w-4" />, cursor: 'crosshair' },
  { id: 'move', name: 'Mover', icon: <Move className="h-4 w-4" />, cursor: 'move' }
];

const pixelEffects: PixelEffect[] = [
  { id: 'glow', name: 'Brilho', icon: <Sparkles className="h-4 w-4" />, description: 'Adiciona um efeito de brilho', premium: false },
  { id: 'shadow', name: 'Sombra', icon: <Layers className="h-4 w-4" />, description: 'Adiciona sombra projetada', premium: false },
  { id: 'neon', name: 'Neon', icon: <Zap className="h-4 w-4" />, description: 'Efeito neon vibrante', premium: true },
  { id: 'hologram', name: 'Holograma', icon: <Gem className="h-4 w-4" />, description: 'Efeito holográfico', premium: true },
  { id: 'fire', name: 'Fogo', icon: <Wand2 className="h-4 w-4" />, description: 'Animação de fogo', premium: true },
  { id: 'water', name: 'Água', icon: <Filter className="h-4 w-4" />, description: 'Efeito de água', premium: true }
];

const colorPalettes = [
  { name: 'Portugal', colors: ['#D4A757', '#7DF9FF', '#228B22', '#FF0000', '#0000FF'] },
  { name: 'Natureza', colors: ['#228B22', '#32CD32', '#8FBC8F', '#006400', '#9ACD32'] },
  { name: 'Oceano', colors: ['#0077BE', '#7DF9FF', '#4682B4', '#1E90FF', '#87CEEB'] },
  { name: 'Pôr do Sol', colors: ['#FF6347', '#FF4500', '#FFD700', '#FFA500', '#FF69B4'] },
  { name: 'Vintage', colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3'] },
  { name: 'Neon', colors: ['#FF1493', '#00FF00', '#00FFFF', '#FF00FF', '#FFFF00'] }
];

const rarityMultipliers = {
  'Comum': 1,
  'Incomum': 2.5,
  'Raro': 5,
  'Épico': 10,
  'Lendário': 25,
  'Marco Histórico': 50
};

const specialCreditsConversion = {
  'Comum': 10,
  'Incomum': 25,
  'Raro': 50,
  'Épico': 100,
  'Lendário': 250,
  'Marco Histórico': 500
};

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  // Drawing state
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Customization state
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelTags, setPixelTags] = useState<string[]>([]);
  const [pixelLink, setPixelLink] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState('draw');
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { addCredits, addXp, removeCredits, removeSpecialCredits } = useUserStore();
  const { vibrate } = useHapticFeedback();

  // Calculate prices
  const basePrice = pixelData ? 1 * (rarityMultipliers[pixelData.rarity] || 1) : 1;
  const specialCreditsPrice = pixelData ? specialCreditsConversion[pixelData.rarity] || 10 : 10;
  const finalPrice = basePrice + (selectedEffects.filter(effect => 
    pixelEffects.find(e => e.id === effect)?.premium
  ).length * 5); // +5€ per premium effect

  // Initialize canvas
  useEffect(() => {
    if (isOpen && canvasRef.current && layers.length === 0) {
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 400;
      
      // Create initial layer
      const initialLayer: Layer = {
        id: 'layer-1',
        name: 'Camada Base',
        visible: true,
        opacity: 100,
        canvas: document.createElement('canvas')
      };
      initialLayer.canvas.width = 400;
      initialLayer.canvas.height = 400;
      
      setLayers([initialLayer]);
      
      // Fill with white background
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToUndoStack();
      }
    }
  }, [isOpen, layers.length]);

  // Drawing functions
  const saveToUndoStack = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-19), imageData]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  }, []);

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const previousState = undoStack[undoStack.length - 1];
    
    ctx.putImageData(previousState, 0, 0);
    
    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));
    
    vibrate('light');
    toast({
      title: "Ação Desfeita",
      description: "Última ação foi desfeita.",
    });
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nextState = redoStack[redoStack.length - 1];
    
    ctx.putImageData(nextState, 0, 0);
    
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, -1));
    
    vibrate('light');
    toast({
      title: "Ação Refeita",
      description: "Ação foi refeita.",
    });
  };

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) / canvasZoom - canvasOffset.x,
      y: (clientY - rect.top) / canvasZoom - canvasOffset.y
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;
    
    setIsDrawing(true);
    setLastPoint(point);
    
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
      draw(point, point);
    }
    
    vibrate('light');
  };

  const draw = (currentPoint: { x: number; y: number }, lastPoint: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity / 100;
    
    if (selectedTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
    } else if (selectedTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const continueDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const point = getCanvasPoint(e);
    if (!point || !lastPoint) return;
    
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
      draw(point, lastPoint);
    }
    
    setLastPoint(point);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveToUndoStack();
      vibrate('medium');
    }
  };

  const floodFill = (startX: number, startY: number, newColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];
    
    const newColorRgb = hexToRgb(newColor);
    if (!newColorRgb) return;
    
    const stack = [[startX, startY]];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        continue;
      }
      
      const pos = (y * canvas.width + x) * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const a = data[pos + 3];
      
      if (r !== startR || g !== startG || b !== startB || a !== startA) {
        continue;
      }
      
      visited.add(key);
      
      data[pos] = newColorRgb.r;
      data[pos + 1] = newColorRgb.g;
      data[pos + 2] = newColorRgb.b;
      data[pos + 3] = 255;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
    saveToUndoStack();
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    if (!point) return;
    
    if (selectedTool === 'bucket') {
      floodFill(Math.floor(point.x), Math.floor(point.y), selectedColor);
      vibrate('medium');
    } else if (selectedTool === 'eyedropper') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const imageData = ctx.getImageData(Math.floor(point.x), Math.floor(point.y), 1, 1);
      const data = imageData.data;
      const hex = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1)}`;
      setSelectedColor(hex);
      
      toast({
        title: "Cor Capturada",
        description: `Cor ${hex} selecionada.`,
      });
      vibrate('light');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Ficheiro Muito Grande",
        description: "O ficheiro deve ter menos de 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      
      // Draw image on canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveToUndoStack();
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Imagem Carregada",
      description: "Imagem foi adicionada ao canvas.",
    });
  };

  const addTag = () => {
    if (currentTagInput.trim() && !pixelTags.includes(currentTagInput.trim())) {
      setPixelTags(prev => [...prev, currentTagInput.trim()]);
      setCurrentTagInput('');
      
      toast({
        title: "Tag Adicionada",
        description: `Tag "${currentTagInput.trim()}" foi adicionada.`,
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPixelTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const applyEffect = (effectId: string) => {
    const effect = pixelEffects.find(e => e.id === effectId);
    if (!effect) return;
    
    if (effect.premium && !userCredits) {
      toast({
        title: "Efeito Premium",
        description: "Este efeito requer créditos premium.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedEffects.includes(effectId)) {
      setSelectedEffects(prev => prev.filter(id => id !== effectId));
    } else {
      setSelectedEffects(prev => [...prev, effectId]);
    }
    
    toast({
      title: selectedEffects.includes(effectId) ? "Efeito Removido" : "Efeito Aplicado",
      description: `${effect.name} ${selectedEffects.includes(effectId) ? 'removido' : 'aplicado'}.`,
    });
    
    vibrate('light');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToUndoStack();
    
    toast({
      title: "Canvas Limpo",
      description: "O canvas foi limpo.",
    });
    vibrate('medium');
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `pixel-${pixelData?.x}-${pixelData?.y}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast({
      title: "Canvas Guardado",
      description: "A sua criação foi guardada.",
    });
    vibrate('success');
  };

  const handlePurchase = async () => {
    if (!pixelData) return;
    
    // Validation
    if (!pixelTitle.trim()) {
      toast({
        title: "Título Obrigatório",
        description: "Por favor, adicione um título ao seu pixel.",
        variant: "destructive"
      });
      return;
    }
    
    // Check affordability
    const canAffordCredits = userCredits >= finalPrice;
    const canAffordSpecial = userSpecialCredits >= specialCreditsPrice;
    
    if (paymentMethod === 'credits' && !canAffordCredits) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${finalPrice} créditos. Tem apenas ${userCredits}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === 'special' && !canAffordSpecial) {
      toast({
        title: "Créditos Especiais Insuficientes",
        description: `Precisa de ${specialCreditsPrice} créditos especiais. Tem apenas ${userSpecialCredits}.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get canvas data
      const canvas = canvasRef.current;
      const canvasDataUrl = canvas?.toDataURL() || null;
      
      const customizations = {
        title: pixelTitle,
        description: pixelDescription,
        tags: pixelTags,
        link: pixelLink,
        effects: selectedEffects,
        color: selectedColor,
        image: canvasDataUrl
      };
      
      const success = await onPurchase(pixelData, paymentMethod, customizations);
      
      if (success) {
        // Deduct payment
        if (paymentMethod === 'credits') {
          removeCredits(finalPrice);
        } else {
          removeSpecialCredits(specialCreditsPrice);
        }
        
        // Reward XP
        addXp(50);
        
        setShowConfetti(true);
        setPlayPurchaseSound(true);
        
        toast({
          title: "Pixel Comprado! 🎉",
          description: `Pixel (${pixelData.x}, ${pixelData.y}) é agora seu!`,
        });
        
        // Close modal after success
        setTimeout(() => {
          onClose();
          resetForm();
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

  const resetForm = () => {
    setPixelTitle('');
    setPixelDescription('');
    setPixelTags([]);
    setPixelLink('');
    setSelectedEffects([]);
    setUploadedImage(null);
    setImagePreview(null);
    setActiveTab('draw');
    setSelectedTool('brush');
    setSelectedColor('#D4A757');
    setBrushSize(5);
    setBrushOpacity(100);
    setLayers([]);
    setUndoStack([]);
    setRedoStack([]);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Marco Histórico': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (!pixelData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-6xl h-[95vh] p-0 gap-0 bg-background/95 backdrop-blur-sm">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-headline flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3 text-primary" />
                Personalizar Pixel ({pixelData.x}, {pixelData.y})
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {pixelData.region}
                <Badge className={getRarityColor(pixelData.rarity)}>
                  {pixelData.rarity}
                </Badge>
              </DialogDescription>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                €{finalPrice.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                ou {specialCreditsPrice} especiais
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-3 border-b bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Editor de Pixel</h3>
                  <Badge variant="outline" className="text-xs">
                    400x400px
                  </Badge>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={undo} disabled={undoStack.length === 0}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={redo} disabled={redoStack.length === 0}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveCanvas}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Tools */}
              <div className="flex flex-wrap gap-2 mb-3">
                {drawingTools.map(tool => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className="flex items-center gap-2"
                  >
                    {tool.icon}
                    <span className="hidden sm:inline">{tool.name}</span>
                  </Button>
                ))}
              </div>
              
              {/* Color Palette */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {colorPalettes[0].colors.map(color => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                        selectedColor === color ? "border-foreground scale-110" : "border-border"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                  
                  <input
                    ref={colorPickerRef}
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Tamanho:</Label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    min={1}
                    max={50}
                    step={1}
                    className="w-20"
                  />
                  <span className="text-xs font-mono w-8">{brushSize}px</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Opacidade:</Label>
                  <Slider
                    value={[brushOpacity]}
                    onValueChange={(value) => setBrushOpacity(value[0])}
                    min={10}
                    max={100}
                    step={10}
                    className="w-20"
                  />
                  <span className="text-xs font-mono w-8">{brushOpacity}%</span>
                </div>
              </div>
            </div>
            
            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/10">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className={cn(
                    "border-2 border-primary/30 rounded-lg shadow-lg bg-white",
                    selectedTool === 'brush' && "cursor-crosshair",
                    selectedTool === 'eraser' && "cursor-grab",
                    selectedTool === 'bucket' && "cursor-pointer",
                    selectedTool === 'eyedropper' && "cursor-copy",
                    selectedTool === 'move' && "cursor-move"
                  )}
                  style={{ 
                    imageRendering: 'pixelated',
                    transform: `scale(${canvasZoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={continueDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={continueDrawing}
                  onTouchEnd={stopDrawing}
                  onClick={handleCanvasClick}
                />
                
                {/* Canvas Controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCanvasZoom(prev => Math.min(prev * 1.2, 3))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCanvasZoom(prev => Math.max(prev / 1.2, 0.5))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCanvasZoom(1)}>
                    <Crosshair className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Customization */}
          <div className="w-80 border-l flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="draw" className="text-xs">
                  <Brush className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-xs">
                  <Sparkles className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="details" className="text-xs">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="payment" className="text-xs">
                  <CreditCard className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {/* Drawing Tab */}
                  <TabsContent value="draw" className="mt-0 space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Paletas de Cores</Label>
                      <div className="space-y-2">
                        {colorPalettes.map(palette => (
                          <div key={palette.name} className="space-y-1">
                            <span className="text-xs text-muted-foreground">{palette.name}</span>
                            <div className="flex gap-1">
                              {palette.colors.map(color => (
                                <button
                                  key={color}
                                  className={cn(
                                    "w-6 h-6 rounded border transition-transform hover:scale-110",
                                    selectedColor === color ? "border-foreground scale-110" : "border-border"
                                  )}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setSelectedColor(color)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Upload de Imagem</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Carregar Imagem
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        {imagePreview && (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                setUploadedImage(null);
                                setImagePreview(null);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Camadas</Label>
                      <div className="space-y-2">
                        {layers.map((layer, index) => (
                          <div key={layer.id} className={cn(
                            "flex items-center gap-2 p-2 rounded border",
                            activeLayerIndex === index ? "border-primary bg-primary/10" : "border-border"
                          )}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                const newLayers = [...layers];
                                newLayers[index].visible = !newLayers[index].visible;
                                setLayers(newLayers);
                              }}
                            >
                              {layer.visible ? <Eye className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-50" />}
                            </Button>
                            <span className="text-xs flex-1">{layer.name}</span>
                            <Slider
                              value={[layer.opacity]}
                              onValueChange={(value) => {
                                const newLayers = [...layers];
                                newLayers[index].opacity = value[0];
                                setLayers(newLayers);
                              }}
                              min={0}
                              max={100}
                              className="w-16"
                            />
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            const newLayer: Layer = {
                              id: `layer-${Date.now()}`,
                              name: `Camada ${layers.length + 1}`,
                              visible: true,
                              opacity: 100,
                              canvas: document.createElement('canvas')
                            };
                            newLayer.canvas.width = 400;
                            newLayer.canvas.height = 400;
                            setLayers(prev => [...prev, newLayer]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Camada
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Effects Tab */}
                  <TabsContent value="effects" className="mt-0 space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Efeitos Visuais</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {pixelEffects.map(effect => (
                          <Card
                            key={effect.id}
                            className={cn(
                              "cursor-pointer transition-all hover:shadow-md",
                              selectedEffects.includes(effect.id) ? "border-primary bg-primary/10" : "border-border"
                            )}
                            onClick={() => applyEffect(effect.id)}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="mb-2">
                                {effect.icon}
                              </div>
                              <h4 className="text-xs font-medium">{effect.name}</h4>
                              {effect.premium && (
                                <Badge className="mt-1 bg-amber-500 text-xs">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Filtros de Imagem</Label>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Brilho</Label>
                          <Slider defaultValue={[100]} min={50} max={150} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Contraste</Label>
                          <Slider defaultValue={[100]} min={50} max={150} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Saturação</Label>
                          <Slider defaultValue={[100]} min={0} max={200} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Desfoque</Label>
                          <Slider defaultValue={[0]} min={0} max={10} className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Details Tab */}
                  <TabsContent value="details" className="mt-0 space-y-4">
                    <div>
                      <Label htmlFor="pixel-title" className="text-sm font-medium">
                        Título do Pixel *
                      </Label>
                      <Input
                        id="pixel-title"
                        placeholder="Ex: Minha Obra-Prima"
                        value={pixelTitle}
                        onChange={(e) => setPixelTitle(e.target.value)}
                        maxLength={50}
                        className="mt-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {pixelTitle.length}/50 caracteres
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="pixel-description" className="text-sm font-medium">
                        Descrição
                      </Label>
                      <Textarea
                        id="pixel-description"
                        placeholder="Descreva a sua criação..."
                        value={pixelDescription}
                        onChange={(e) => setPixelDescription(e.target.value)}
                        maxLength={200}
                        rows={3}
                        className="mt-1 resize-none"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {pixelDescription.length}/200 caracteres
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="Adicionar tag..."
                          value={currentTagInput}
                          onChange={(e) => setCurrentTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1"
                        />
                        <Button size="icon" onClick={addTag} disabled={!currentTagInput.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {pixelTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pixelTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="pixel-link" className="text-sm font-medium">
                        Link Personalizado
                      </Label>
                      <Input
                        id="pixel-link"
                        placeholder="https://exemplo.com"
                        value={pixelLink}
                        onChange={(e) => setPixelLink(e.target.value)}
                        className="mt-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Link opcional para o seu pixel
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Pré-visualização</Label>
                      <Card className="bg-muted/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: selectedColor }} />
                            <div>
                              <h4 className="font-medium text-sm">{pixelTitle || 'Sem título'}</h4>
                              <p className="text-xs text-muted-foreground">
                                ({pixelData.x}, {pixelData.y}) • {pixelData.region}
                              </p>
                            </div>
                          </div>
                          {pixelDescription && (
                            <p className="text-xs text-muted-foreground mb-2">{pixelDescription}</p>
                          )}
                          {pixelTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {pixelTags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Payment Tab */}
                  <TabsContent value="payment" className="mt-0 space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Método de Pagamento</Label>
                      <div className="space-y-2">
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            paymentMethod === 'credits' ? "border-primary bg-primary/10" : "border-border"
                          )}
                          onClick={() => setPaymentMethod('credits')}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-primary" />
                                <div>
                                  <h4 className="font-medium text-sm">Créditos Normais</h4>
                                  <p className="text-xs text-muted-foreground">Saldo: {userCredits.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">€{finalPrice.toFixed(2)}</div>
                                {userCredits < finalPrice && (
                                  <Badge variant="destructive" className="text-xs">Insuficiente</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            paymentMethod === 'special' ? "border-accent bg-accent/10" : "border-border"
                          )}
                          onClick={() => setPaymentMethod('special')}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Gift className="h-5 w-5 text-accent" />
                                <div>
                                  <h4 className="font-medium text-sm">Créditos Especiais</h4>
                                  <p className="text-xs text-muted-foreground">Saldo: {userSpecialCredits.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-accent">{specialCreditsPrice}</div>
                                {userSpecialCredits < specialCreditsPrice && (
                                  <Badge variant="destructive" className="text-xs">Insuficiente</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Resumo da Compra</Label>
                      <Card className="bg-muted/20">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Pixel Base ({pixelData.rarity})</span>
                            <span>€{basePrice.toFixed(2)}</span>
                          </div>
                          {selectedEffects.filter(effect => 
                            pixelEffects.find(e => e.id === effect)?.premium
                          ).length > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Efeitos Premium ({selectedEffects.filter(effect => 
                                pixelEffects.find(e => e.id === effect)?.premium
                              ).length})</span>
                              <span>€{(selectedEffects.filter(effect => 
                                pixelEffects.find(e => e.id === effect)?.premium
                              ).length * 5).toFixed(2)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary">€{finalPrice.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-300">
                          <p className="font-medium mb-1">Benefícios da Compra:</p>
                          <ul className="space-y-1">
                            <li>• Propriedade permanente do pixel</li>
                            <li>• Edição ilimitada</li>
                            <li>• Visibilidade no mapa global</li>
                            <li>• XP e conquistas</li>
                            {pixelData.rarity !== 'Comum' && <li>• Pixel raro com valor especial</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
        
        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-gradient-to-r from-card to-primary/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Pré-visualizar
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right mr-3">
                <div className="text-sm text-muted-foreground">Total:</div>
                <div className="text-xl font-bold text-primary">
                  {paymentMethod === 'credits' ? `€${finalPrice.toFixed(2)}` : `${specialCreditsPrice} especiais`}
                </div>
              </div>
              
              <Button
                onClick={handlePurchase}
                disabled={isProcessing || !pixelTitle.trim() || 
                  (paymentMethod === 'credits' && userCredits < finalPrice) ||
                  (paymentMethod === 'special' && userSpecialCredits < specialCreditsPrice)}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 min-w-[120px]"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    A comprar...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar Pixel
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}