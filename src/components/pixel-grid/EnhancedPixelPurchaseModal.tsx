'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { Palette, Brush, Eraser, PaintBucket, Pipette, Type, Sticker, Upload, Download, Save, X, Undo, Redo, RotateCcw, Grid3X3, Sparkles, Wand2, Shuffle, Star, Crown, Gem, Coins, Gift, ShoppingCart, CreditCard, Eye, EyeOff, Layers, Circle, Square, Triangle, Heart, Smile, Sun, Leaf, Flag, Music, Camera, Image as ImageIcon, Zap, Target, Award, Settings, Maximize2, Minimize2, Copy, Share2, Info, HelpCircle, Scissors, Move, RotateCw, FlipHorizontal, FlipVertical, Contrast, Filter, Sliders, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  specialCreditsPrice?: number;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  color?: string;
  title?: string;
  description?: string;
  tags?: string[];
  linkUrl?: string;
  views: number;
  likes: number;
  isProtected?: boolean;
  features?: string[];
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (
    pixelData: SelectedPixelDetails,
    paymentMethod: string,
    customizations: any
  ) => Promise<boolean>;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  premium?: boolean;
  description: string;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  imageData?: ImageData;
}

const tools: Tool[] = [
  // Ferramentas Básicas
  { id: 'brush', name: 'Pincel', icon: <Brush className="h-4 w-4" />, category: 'basic', description: 'Pincel básico para desenhar' },
  { id: 'pencil', name: 'Lápis', icon: <Brush className="h-4 w-4" />, category: 'basic', description: 'Lápis para traços precisos' },
  { id: 'eraser', name: 'Borracha', icon: <Eraser className="h-4 w-4" />, category: 'basic', description: 'Remove pixels' },
  { id: 'bucket', name: 'Balde', icon: <PaintBucket className="h-4 w-4" />, category: 'basic', description: 'Preenche áreas' },
  { id: 'eyedropper', name: 'Conta-gotas', icon: <Pipette className="h-4 w-4" />, category: 'basic', description: 'Captura cores' },
  
  // Ferramentas Artísticas
  { id: 'spray', name: 'Spray', icon: <Circle className="h-4 w-4" />, category: 'artistic', description: 'Efeito de spray' },
  { id: 'smudge', name: 'Borrar', icon: <Move className="h-4 w-4" />, category: 'artistic', description: 'Borra e mistura cores' },
  { id: 'blur', name: 'Desfoque', icon: <Circle className="h-4 w-4" />, category: 'artistic', premium: true, description: 'Aplica desfoque' },
  { id: 'sharpen', name: 'Nitidez', icon: <Contrast className="h-4 w-4" />, category: 'artistic', premium: true, description: 'Aumenta nitidez' },
  
  // Formas
  { id: 'line', name: 'Linha', icon: <Minus className="h-4 w-4" />, category: 'shapes', description: 'Desenha linhas retas' },
  { id: 'rectangle', name: 'Retângulo', icon: <Square className="h-4 w-4" />, category: 'shapes', description: 'Desenha retângulos' },
  { id: 'circle', name: 'Círculo', icon: <Circle className="h-4 w-4" />, category: 'shapes', description: 'Desenha círculos' },
  { id: 'triangle', name: 'Triângulo', icon: <Triangle className="h-4 w-4" />, category: 'shapes', description: 'Desenha triângulos' },
  
  // Efeitos
  { id: 'glow', name: 'Brilho', icon: <Sparkles className="h-4 w-4" />, category: 'effects', premium: true, description: 'Adiciona efeito de brilho' },
  { id: 'shadow', name: 'Sombra', icon: <Circle className="h-4 w-4" />, category: 'effects', premium: true, description: 'Adiciona sombras' },
  { id: 'emboss', name: 'Relevo', icon: <Layers className="h-4 w-4" />, category: 'effects', premium: true, description: 'Efeito de relevo 3D' },
  
  // Texto e Stickers
  { id: 'text', name: 'Texto', icon: <Type className="h-4 w-4" />, category: 'content', description: 'Adiciona texto' },
  { id: 'sticker', name: 'Stickers', icon: <Sticker className="h-4 w-4" />, category: 'content', description: 'Adiciona stickers' },
];

const brushTypes = [
  { id: 'round', name: 'Redondo', preview: '●' },
  { id: 'square', name: 'Quadrado', preview: '■' },
  { id: 'soft', name: 'Suave', preview: '◉' },
  { id: 'texture', name: 'Textura', preview: '▣' },
  { id: 'scatter', name: 'Disperso', preview: '⋯' },
  { id: 'calligraphy', name: 'Caligrafia', preview: '✒' }
];

const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
  'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten'
];

const presetFilters = [
  { id: 'vintage', name: 'Vintage', description: 'Efeito retro' },
  { id: 'dramatic', name: 'Dramático', description: 'Alto contraste' },
  { id: 'soft', name: 'Suave', description: 'Tons pastéis' },
  { id: 'vibrant', name: 'Vibrante', description: 'Cores intensas' },
  { id: 'monochrome', name: 'Monocromático', description: 'Preto e branco' },
  { id: 'sepia', name: 'Sépia', description: 'Tom amarelado' }
];

const stickerCategories = {
  emojis: ['😀', '😍', '🤩', '😎', '🥳', '😇', '🤔', '😴'],
  symbols: ['⭐', '❤️', '💎', '🔥', '⚡', '🌟', '💫', '✨'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌿', '🌳'],
  portugal: ['🇵🇹', '🏰', '⛪', '🌊', '🍷', '🐟', '🚢', '🏛️']
};

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  // Canvas e desenho
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Ferramentas e configurações
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushType, setBrushType] = useState('round');
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [blendMode, setBlendMode] = useState('normal');
  
  // Funcionalidades avançadas
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Fundo', visible: true, opacity: 100, blendMode: 'normal' }
  ]);
  const [activeLayer, setActiveLayer] = useState('1');
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(10);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [pressureSensitive, setPressureSensitive] = useState(true);
  
  // Estados da interface
  const [activeTab, setActiveTab] = useState('tools');
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  
  // Customizações
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelTags, setPixelTags] = useState<string[]>([]);
  const [pixelLink, setPixelLink] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Estados de compra
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'special' | 'mixed'>('credits');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { addCredits, addXp, removeCredits, removeSpecialCredits } = useUserStore();
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();

  // Inicializar canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurar canvas
    canvas.width = 400;
    canvas.height = 400;
    ctx.imageSmoothingEnabled = false;
    
    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Se há cor do pixel, aplicar
    if (pixelData?.color) {
      ctx.fillStyle = pixelData.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Salvar estado inicial
    saveToUndoStack();
  }, [isOpen, pixelData]);

  const saveToUndoStack = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-49), imageData]);
    setRedoStack([]);
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const drawPoint = (x: number, y: number, pressure: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = brushSize * (pressureSensitive ? pressure : 1);
    
    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : blendMode as GlobalCompositeOperation;
    ctx.globalAlpha = (brushOpacity / 100) * (pressureSensitive ? pressure : 1);
    
    switch (selectedTool) {
      case 'brush':
      case 'pencil':
        ctx.fillStyle = selectedColor;
        if (brushType === 'round') {
          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
        break;
        
      case 'spray':
        ctx.fillStyle = selectedColor;
        for (let i = 0; i < size * 2; i++) {
          const offsetX = (Math.random() - 0.5) * size;
          const offsetY = (Math.random() - 0.5) * size;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;
        
      case 'eraser':
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    // Aplicar simetria
    if (symmetryMode !== 'none') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
        const mirrorX = centerX + (centerX - x);
        drawPointDirect(ctx, mirrorX, y, size);
      }
      
      if (symmetryMode === 'vertical' || symmetryMode === 'both') {
        const mirrorY = centerY + (centerY - y);
        drawPointDirect(ctx, x, mirrorY, size);
      }
      
      if (symmetryMode === 'both') {
        const mirrorX = centerX + (centerX - x);
        const mirrorY = centerY + (centerY - y);
        drawPointDirect(ctx, mirrorX, mirrorY, size);
      }
    }
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawPointDirect = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    if (brushType === 'round') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, pressure: number = 1) => {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.max(1, Math.floor(distance / 2));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      drawPoint(x, y, pressure);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'eyedropper') {
      handleEyedropper(e);
      return;
    }
    
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setLastPoint(coords);
    
    if (selectedTool === 'bucket') {
      floodFill(coords.x, coords.y);
    } else {
      drawPoint(coords.x, coords.y);
    }
    
    vibrate('light');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool !== 'bucket') {
      drawLine(lastPoint.x, lastPoint.y, coords.x, coords.y);
    }
    
    setLastPoint(coords);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveToUndoStack();
      vibrate('light');
    }
  };

  const handleEyedropper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const coords = getCanvasCoordinates(e);
    const imageData = ctx.getImageData(coords.x, coords.y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setSelectedColor(hex);
    
    toast({
      title: "Cor Capturada! 🎨",
      description: `Nova cor selecionada: ${hex}`,
    });
  };

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Implementação simplificada de flood fill
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const startIndex = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];
    
    const targetColor = hexToRgb(selectedColor);
    if (!targetColor) return;
    
    const stack = [{ x: Math.floor(startX), y: Math.floor(startY) }];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        continue;
      }
      
      const index = (y * canvas.width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      if (r !== startR || g !== startG || b !== startB) {
        continue;
      }
      
      visited.add(key);
      
      data[index] = targetColor.r;
      data[index + 1] = targetColor.g;
      data[index + 2] = targetColor.b;
      data[index + 3] = 255;
      
      stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
      
      if (visited.size > 10000) break; // Prevenir travamento
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleUndo = () => {
    if (undoStack.length <= 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, currentState]);
    
    const previousState = undoStack[undoStack.length - 2];
    ctx.putImageData(previousState, 0, 0);
    
    setUndoStack(prev => prev.slice(0, -1));
    
    toast({
      title: "Ação Desfeita",
      description: "Última ação foi desfeita.",
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState, 0, 0);
    
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, -1));
    
    toast({
      title: "Ação Refeita",
      description: "Ação foi refeita.",
    });
  };

  const applyFilter = (filterId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      switch (filterId) {
        case 'vintage':
          data[i] = Math.min(255, data[i] * 1.2);     // R
          data[i + 1] = Math.min(255, data[i + 1] * 1.1); // G
          data[i + 2] = Math.min(255, data[i + 2] * 0.8); // B
          break;
        case 'dramatic':
          const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const contrast = gray > 128 ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = contrast;
          break;
        case 'vibrant':
          data[i] = Math.min(255, data[i] * 1.3);
          data[i + 1] = Math.min(255, data[i + 1] * 1.3);
          data[i + 2] = Math.min(255, data[i + 2] * 1.3);
          break;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    saveToUndoStack();
    
    toast({
      title: "Filtro Aplicado! ✨",
      description: `Filtro ${filterId} aplicado com sucesso.`,
    });
  };

  const addSticker = (sticker: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(sticker, canvas.width / 2, canvas.height / 2);
    
    saveToUndoStack();
    
    toast({
      title: "Sticker Adicionado! 🎉",
      description: `${sticker} foi adicionado ao pixel.`,
    });
  };

  const addText = () => {
    const text = prompt('Digite o texto:');
    if (!text) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = '24px Arial';
    ctx.fillStyle = selectedColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    saveToUndoStack();
    
    toast({
      title: "Texto Adicionado! 📝",
      description: `"${text}" foi adicionado ao pixel.`,
    });
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
      description: "O canvas foi limpo com sucesso.",
    });
  };

  const randomizeColors = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) { // Se não é transparente
        data[i] = Math.floor(Math.random() * 256);     // R
        data[i + 1] = Math.floor(Math.random() * 256); // G
        data[i + 2] = Math.floor(Math.random() * 256); // B
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    saveToUndoStack();
    
    toast({
      title: "Cores Aleatórias! 🌈",
      description: "Cores foram randomizadas mantendo a transparência.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Redimensionar e desenhar imagem
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveToUndoStack();
        
        toast({
          title: "Imagem Carregada! 📸",
          description: "Imagem foi adicionada ao pixel.",
        });
      };
      img.src = event.target?.result as string;
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const calculateTotalPrice = () => {
    if (!pixelData) return 0;
    
    let basePrice = pixelData.price;
    let premiumEffects = 0;
    
    // Contar efeitos premium usados
    const premiumTools = tools.filter(t => t.premium).map(t => t.id);
    premiumEffects = premiumTools.length * 5; // €5 por efeito premium
    
    return basePrice + premiumEffects;
  };

  const handlePurchase = async () => {
    if (!pixelData) return;
    
    const totalPrice = calculateTotalPrice();
    
    // Verificar saldo
    if (paymentMethod === 'credits' && userCredits < totalPrice) {
      toast({
        title: "Saldo Insuficiente",
        description: `Precisa de ${totalPrice - userCredits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === 'special' && pixelData.specialCreditsPrice && userSpecialCredits < pixelData.specialCreditsPrice) {
      toast({
        title: "Créditos Especiais Insuficientes",
        description: `Precisa de ${pixelData.specialCreditsPrice - userSpecialCredits} créditos especiais adicionais.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Capturar canvas como imagem
      const canvas = canvasRef.current;
      const canvasDataUrl = canvas?.toDataURL('image/png');
      
      const customizations = {
        color: selectedColor,
        title: pixelTitle || `Pixel Artístico (${pixelData.x}, ${pixelData.y})`,
        description: pixelDescription,
        tags: pixelTags,
        linkUrl: pixelLink,
        image: canvasDataUrl
      };
      
      const success = await onPurchase(pixelData, paymentMethod, customizations);
      
      if (success) {
        // Deduzir créditos
        if (paymentMethod === 'credits') {
          removeCredits(totalPrice);
        } else if (paymentMethod === 'special' && pixelData.specialCreditsPrice) {
          removeSpecialCredits(pixelData.specialCreditsPrice);
        }
        
        // Recompensas
        addXp(50);
        addCredits(10);
        
        setShowConfetti(true);
        setPlaySuccessSound(true);
        
        toast({
          title: "Pixel Adquirido! 🎉",
          description: `Parabéns! O pixel (${pixelData.x}, ${pixelData.y}) é agora seu! +50 XP +10 créditos`,
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

  const totalPrice = calculateTotalPrice();
  const canAfford = paymentMethod === 'credits' ? userCredits >= totalPrice : 
                   paymentMethod === 'special' ? userSpecialCredits >= (pixelData.specialCreditsPrice || 0) : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-7xl h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              Editor de Pixel Art - ({pixelData.x}, {pixelData.y})
            </span>
            <Badge className={`${pixelData.rarity === 'Lendário' ? 'bg-amber-500' : 'bg-primary'}`}>
              {pixelData.rarity}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Transforme este pixel numa obra de arte única! Região: {pixelData.region}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Área Principal do Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar Principal */}
            <div className="p-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Ferramentas Básicas */}
                  <div className="flex gap-1">
                    {tools.filter(t => t.category === 'basic').map(tool => (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTool(tool.id)}
                        className="relative"
                      >
                        {tool.icon}
                        {tool.premium && (
                          <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Paleta de Cores Rápida */}
                  <div className="flex gap-1">
                    {['#D4A757', '#7DF9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                          selectedColor === color ? "border-foreground scale-110 shadow-lg" : "border-border"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                    />
                  </div>
                  
                  {/* Controles de Pincel */}
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
                    <span className="text-xs font-mono w-8">{brushSize}</span>
                  </div>
                </div>
                
                {/* Ações */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length <= 1}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Canvas Principal */}
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/5">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-primary/30 rounded-lg shadow-2xl cursor-crosshair bg-white"
                  style={{ 
                    imageRendering: 'pixelated',
                    width: '400px',
                    height: '400px'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                
                {/* Grelha Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-lg"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: `${gridSize}px ${gridSize}px`
                    }}
                  />
                )}
                
                {/* Indicador de Simetria */}
                {symmetryMode !== 'none' && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-lg">
                    {(symmetryMode === 'horizontal' || symmetryMode === 'both') && (
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500/50" />
                    )}
                    {(symmetryMode === 'vertical' || symmetryMode === 'both') && (
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/50" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Painel Lateral de Ferramentas */}
          <div className="w-80 border-l flex flex-col bg-card/50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-4 m-2">
                <TabsTrigger value="tools" className="text-xs">
                  <Brush className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-xs">
                  <Sparkles className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="content" className="text-xs">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1 p-3">
                {/* Ferramentas */}
                <TabsContent value="tools" className="mt-0 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Ferramentas de Desenho</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {tools.filter(t => ['basic', 'artistic', 'shapes'].includes(t.category)).map(tool => (
                        <Button
                          key={tool.id}
                          variant={selectedTool === tool.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTool(tool.id)}
                          className="justify-start relative"
                        >
                          {tool.icon}
                          <span className="ml-2 text-xs">{tool.name}</span>
                          {tool.premium && (
                            <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Tipo de Pincel</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {brushTypes.map(brush => (
                        <Button
                          key={brush.id}
                          variant={brushType === brush.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setBrushType(brush.id)}
                          className="text-xs"
                        >
                          <span className="text-lg mr-1">{brush.preview}</span>
                          {brush.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Configurações</h3>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Opacidade: {brushOpacity}%</Label>
                      <Slider
                        value={[brushOpacity]}
                        onValueChange={(value) => setBrushOpacity(value[0])}
                        min={1}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Modo de Mistura</Label>
                      <select
                        value={blendMode}
                        onChange={(e) => setBlendMode(e.target.value)}
                        className="w-full px-2 py-1 border border-input bg-background rounded text-xs"
                      >
                        {blendModes.map(mode => (
                          <option key={mode} value={mode}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Efeitos e Filtros */}
                <TabsContent value="effects" className="mt-0 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Filtros Rápidos</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {presetFilters.map(filter => (
                        <Button
                          key={filter.id}
                          variant="outline"
                          size="sm"
                          onClick={() => applyFilter(filter.id)}
                          className="text-xs"
                        >
                          <Filter className="h-3 w-3 mr-1" />
                          {filter.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Efeitos Especiais</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={randomizeColors}
                        className="w-full justify-start"
                      >
                        <Shuffle className="h-4 w-4 mr-2" />
                        Cores Aleatórias
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyFilter('ai-enhance')}
                        className="w-full justify-start"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Melhorar com IA
                        <Badge className="ml-auto bg-purple-500 text-xs">IA</Badge>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Simetria</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', name: 'Nenhuma' },
                        { id: 'horizontal', name: 'Horizontal' },
                        { id: 'vertical', name: 'Vertical' },
                        { id: 'both', name: 'Ambas' }
                      ].map(sym => (
                        <Button
                          key={sym.id}
                          variant={symmetryMode === sym.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSymmetryMode(sym.id as any)}
                          className="text-xs"
                        >
                          {sym.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Conteúdo */}
                <TabsContent value="content" className="mt-0 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Texto</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addText}
                      className="w-full justify-start"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Adicionar Texto
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Stickers</h3>
                    {Object.entries(stickerCategories).map(([category, stickers]) => (
                      <div key={category} className="space-y-2">
                        <Label className="text-xs capitalize">{category}</Label>
                        <div className="grid grid-cols-4 gap-1">
                          {stickers.map(sticker => (
                            <Button
                              key={sticker}
                              variant="outline"
                              size="sm"
                              onClick={() => addSticker(sticker)}
                              className="text-lg p-1 h-8"
                            >
                              {sticker}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Upload de Imagem</h3>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Carregar Imagem
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Configurações */}
                <TabsContent value="settings" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Mostrar Grelha</Label>
                      <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    </div>
                    
                    {showGrid && (
                      <div className="space-y-2">
                        <Label className="text-xs">Tamanho da Grelha: {gridSize}px</Label>
                        <Slider
                          value={[gridSize]}
                          onValueChange={(value) => setGridSize(value[0])}
                          min={5}
                          max={50}
                          step={5}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pressão Sensível</Label>
                      <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Informações do Pixel</h3>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Título</Label>
                      <Input
                        value={pixelTitle}
                        onChange={(e) => setPixelTitle(e.target.value)}
                        placeholder="Nome da sua obra..."
                        className="text-xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Descrição</Label>
                      <Textarea
                        value={pixelDescription}
                        onChange={(e) => setPixelDescription(e.target.value)}
                        placeholder="Descreva sua criação..."
                        rows={3}
                        className="text-xs resize-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Link (opcional)</Label>
                      <Input
                        value={pixelLink}
                        onChange={(e) => setPixelLink(e.target.value)}
                        placeholder="https://..."
                        className="text-xs"
                      />
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Painel de Compra */}
          <div className="w-80 border-l bg-background/50 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg mb-2">Resumo da Compra</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pixel Base:</span>
                  <span className="font-bold">€{pixelData.price}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Raridade:</span>
                  <Badge className="bg-primary">{pixelData.rarity}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-primary">€{totalPrice}</span>
                </div>
                
                {pixelData.specialCreditsPrice && (
                  <div className="text-center text-sm text-muted-foreground">
                    ou {pixelData.specialCreditsPrice} créditos especiais
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Método de Pagamento</h4>
                
                <div className="space-y-2">
                  <Button
                    variant={paymentMethod === 'credits' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('credits')}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center">
                      <Coins className="h-4 w-4 mr-2" />
                      Créditos
                    </span>
                    <span className="font-mono">{userCredits.toLocaleString()}</span>
                  </Button>
                  
                  {pixelData.specialCreditsPrice && (
                    <Button
                      variant={paymentMethod === 'special' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod('special')}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <Gift className="h-4 w-4 mr-2" />
                        Especiais
                      </span>
                      <span className="font-mono">{userSpecialCredits.toLocaleString()}</span>
                    </Button>
                  )}
                </div>
              </div>
              
              {!canAfford && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-500 text-center">
                    Saldo insuficiente para esta compra
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={!canAfford || isProcessing}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}