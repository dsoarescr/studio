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
import {
  Palette, Brush, Eraser, PaintBucket, Undo, Redo, Save, Download, Upload, 
  ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers, Plus, Minus, X, Check,
  Sparkles, Crown, Gem, Star, Coins, Gift, ShoppingCart, CreditCard, Zap,
  Image as ImageIcon, Link as LinkIcon, Hash, Type, Sliders, Sun, Moon,
  Contrast, Blur, Brightness, Saturation, Droplets, Flame, Hexagon, Circle,
  Square, Triangle, Pencil, Move, RotateCw, FlipHorizontal, FlipVertical,
  Copy, Clipboard, Grid, Crosshair, Target, Wand2, Scissors, Stamp, Pipette,
  MousePointer, Hand, Maximize, Minimize, RotateClockwise, Shuffle, Repeat,
  Layers3, PaintBucket2, Spray, Pen, Highlighter, Ruler, Compass, Magnet,
  Gradient, Texture, Pattern, Sticker, Frame, Border, Shadow, Glow, Neon,
  Vintage, Retro, Modern, Abstract, Realistic, Cartoon, Anime, Pixel,
  Glitch, VHS, CRT, LCD, OLED, HDR, AI, Robot, Magic, Crystal, Diamond,
  Rainbow, Prism, Kaleidoscope, Mandala, Fractal, Spiral, Wave, Pulse
} from 'lucide-react';
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

// Canvas constants
const CANVAS_SIZE = 400;
const PIXEL_SIZE = 8; // Each "pixel" is 8x8 actual pixels for better visibility
const GRID_SIZE = CANVAS_SIZE / PIXEL_SIZE; // 50x50 grid

// Advanced drawing tools
type DrawingTool = 
  | 'brush' | 'pencil' | 'eraser' | 'bucket' | 'eyedropper' | 'line' | 'rectangle' 
  | 'circle' | 'spray' | 'blur' | 'smudge' | 'clone' | 'heal' | 'dodge' | 'burn'
  | 'sponge' | 'gradient' | 'pattern' | 'text' | 'sticker' | 'frame';

// Brush types for different effects
type BrushType = 'round' | 'square' | 'soft' | 'hard' | 'texture' | 'scatter' | 'calligraphy';

// Blend modes for advanced compositing
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn';

// Filter presets
const filterPresets = [
  { name: 'Vintage', filters: { sepia: 80, contrast: 120, brightness: 110, saturation: 90 } },
  { name: 'Dramático', filters: { contrast: 150, brightness: 90, saturation: 120, blur: 0 } },
  { name: 'Suave', filters: { brightness: 110, saturation: 80, blur: 1, contrast: 90 } },
  { name: 'Vibrante', filters: { saturation: 150, contrast: 110, brightness: 105, blur: 0 } },
  { name: 'Monocromático', filters: { saturation: 0, contrast: 120, brightness: 100, blur: 0 } },
  { name: 'Neon', filters: { saturation: 200, contrast: 140, brightness: 120, blur: 2 } }
];

// Texture patterns
const texturePatterns = [
  { name: 'Papel', pattern: 'paper' },
  { name: 'Tela', pattern: 'canvas' },
  { name: 'Madeira', pattern: 'wood' },
  { name: 'Metal', pattern: 'metal' },
  { name: 'Pedra', pattern: 'stone' },
  { name: 'Tecido', pattern: 'fabric' }
];

// Sticker categories
const stickerCategories = [
  { 
    name: 'Emojis', 
    stickers: ['😀', '😍', '🤩', '😎', '🥳', '😇', '🤔', '😴', '🤯', '🥰'] 
  },
  { 
    name: 'Símbolos', 
    stickers: ['⭐', '💎', '🔥', '⚡', '🌟', '✨', '💫', '🎯', '🎨', '🏆'] 
  },
  { 
    name: 'Natureza', 
    stickers: ['🌸', '🌺', '🌻', '🌹', '🌿', '🍃', '🌊', '⛰️', '🌙', '☀️'] 
  },
  { 
    name: 'Portugal', 
    stickers: ['🇵🇹', '🏰', '⛵', '🐟', '🍷', '🥖', '🌊', '🏔️', '🌅', '🎭'] 
  }
];

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  data: string | null;
}

interface PixelEffect {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  premium: boolean;
}

const pixelEffects: PixelEffect[] = [
  { id: 'glow', name: 'Brilho', icon: <Sparkles className="h-4 w-4" />, description: 'Adiciona um efeito de brilho', premium: false },
  { id: 'shadow', name: 'Sombra', icon: <Layers className="h-4 w-4" />, description: 'Adiciona sombra projetada', premium: false },
  { id: 'neon', name: 'Neon', icon: <Zap className="h-4 w-4" />, description: 'Efeito neon vibrante', premium: true },
  { id: 'hologram', name: 'Holograma', icon: <Gem className="h-4 w-4" />, description: 'Efeito holográfico', premium: true },
  { id: 'fire', name: 'Fogo', icon: <Wand2 className="h-4 w-4" />, description: 'Animação de fogo', premium: true },
  { id: 'water', name: 'Água', icon: <Droplets className="h-4 w-4" />, description: 'Efeito de água', premium: true }
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
  const [selectedTool, setSelectedTool] = useState<string>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushType, setBrushType] = useState<BrushType>('round');
  const [blendMode, setBlendMode] = useState<BlendMode>('normal');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Fundo', visible: true, opacity: 100, data: null }
  ]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(8);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');

  // Image upload and filters
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFilters, setImageFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0
  });

  // Customization state
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelTags, setPixelTags] = useState<string[]>([]);
  const [pixelLink, setPixelLink] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('draw');
  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  
  // Advanced tools state
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [pressure, setPressure] = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();
  const { addCredits, addXp, removeCredits, removeSpecialCredits } = useUserStore();

  const tools = [
    { id: 'brush', icon: Brush, label: 'Pincel', shortcut: 'B', category: 'basic' },
    { id: 'pencil', icon: Pencil, label: 'Lápis', shortcut: 'P', category: 'basic' },
    { id: 'eraser', icon: Eraser, label: 'Borracha', shortcut: 'E', category: 'basic' },
    { id: 'bucket', icon: PaintBucket, label: 'Balde', shortcut: 'G', category: 'basic' },
    { id: 'eyedropper', icon: Pipette, label: 'Conta-gotas', shortcut: 'I', category: 'basic' },
    { id: 'spray', icon: Spray, label: 'Spray', shortcut: 'S', category: 'artistic' },
    { id: 'blur', icon: Blur, label: 'Desfoque', shortcut: 'U', category: 'effects' },
    { id: 'smudge', icon: Hand, label: 'Borrar', shortcut: 'M', category: 'effects' },
    { id: 'clone', icon: Copy, label: 'Clonar', shortcut: 'O', category: 'advanced' },
    { id: 'heal', icon: Wand2, label: 'Curar', shortcut: 'H', category: 'advanced' },
    { id: 'line', icon: Minus, label: 'Linha', shortcut: 'L', category: 'shapes' },
    { id: 'rectangle', icon: Square, label: 'Retângulo', shortcut: 'R', category: 'shapes' },
    { id: 'circle', icon: Circle, label: 'Círculo', shortcut: 'C', category: 'shapes' },
    { id: 'gradient', icon: Gradient, label: 'Gradiente', shortcut: 'D', category: 'advanced' },
    { id: 'text', icon: Type, label: 'Texto', shortcut: 'T', category: 'content' },
    { id: 'sticker', icon: Sticker, label: 'Stickers', shortcut: 'K', category: 'content' },
    { id: 'frame', icon: Frame, label: 'Moldura', shortcut: 'F', category: 'decoration' },
    { id: 'move', icon: Move, label: 'Mover', shortcut: 'V', category: 'utility' }
  ];

  const brushTypes: { id: BrushType; label: string; icon: React.ReactNode }[] = [
    { id: 'round', label: 'Redondo', icon: <Circle className="h-4 w-4" /> },
    { id: 'square', label: 'Quadrado', icon: <Square className="h-4 w-4" /> },
    { id: 'soft', label: 'Suave', icon: <Droplets className="h-4 w-4" /> },
    { id: 'hard', label: 'Duro', icon: <Hexagon className="h-4 w-4" /> },
    { id: 'texture', label: 'Textura', icon: <Texture className="h-4 w-4" /> },
    { id: 'scatter', label: 'Disperso', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'calligraphy', label: 'Caligrafia', icon: <Pen className="h-4 w-4" /> }
  ];

  const blendModes: { id: BlendMode; label: string }[] = [
    { id: 'normal', label: 'Normal' },
    { id: 'multiply', label: 'Multiplicar' },
    { id: 'screen', label: 'Tela' },
    { id: 'overlay', label: 'Sobreposição' },
    { id: 'soft-light', label: 'Luz Suave' },
    { id: 'hard-light', label: 'Luz Dura' },
    { id: 'color-dodge', label: 'Subexposição' },
    { id: 'color-burn', label: 'Superexposição' }
  ];

  const colorPalettes = [
    {
      name: 'Portugal',
      colors: ['#D4A757', '#7DF9FF', '#228B22', '#FF0000', '#0000FF']
    },
    {
      name: 'Natureza',
      colors: ['#228B22', '#32CD32', '#8FBC8F', '#006400', '#9ACD32']
    },
    {
      name: 'Oceano',
      colors: ['#0077BE', '#7DF9FF', '#4682B4', '#1E90FF', '#87CEEB']
    },
    {
      name: 'Pôr do Sol',
      colors: ['#FF6347', '#FF4500', '#FFD700', '#FFA500', '#FF69B4']
    },
    {
      name: 'Vintage',
      colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3']
    },
    {
      name: 'Neon',
      colors: ['#FF1493', '#00FF00', '#00FFFF', '#FF00FF', '#FFFF00']
    }
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

  // Calculate prices
  const basePrice = pixelData ? 1 * (rarityMultipliers[pixelData.rarity] || 1) : 1;
  const specialCreditsPrice = pixelData ? specialCreditsConversion[pixelData.rarity] || 10 : 10;
  const finalPrice = basePrice + (selectedEffects.filter(effect => 
    pixelEffects.find(e => e.id === effect)?.premium
  ).length * 5); // +5€ per premium effect

  // Initialize canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        saveToHistory();
      }
    }
  }, [isOpen]);

  const saveToHistory = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setUndoStack(prev => [...prev, dataUrl].slice(-50)); // Increased history
      setRedoStack([]);
    }
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const current = undoStack[undoStack.length - 1];
      const previous = undoStack[undoStack.length - 2];
      
      setRedoStack(prev => [...prev, current]);
      setUndoStack(prev => prev.slice(0, -1));
      
      if (canvasRef.current && previous) {
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          ctx?.drawImage(img, 0, 0);
        };
        img.src = previous;
      }
      
      vibrate('light');
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      
      setUndoStack(prev => [...prev, next]);
      setRedoStack(prev => prev.slice(0, -1));
      
      if (canvasRef.current && next) {
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          ctx?.drawImage(img, 0, 0);
        };
        img.src = next;
      }
      
      vibrate('light');
    }
  };

  // Advanced drawing functions
  const drawWithPressure = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const adjustedSize = brushSize * pressure;
    const adjustedOpacity = (brushOpacity / 100) * pressure;
    
    ctx.globalAlpha = adjustedOpacity;
    
    switch (brushType) {
      case 'soft':
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, adjustedSize / 2);
        gradient.addColorStop(0, selectedColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, adjustedSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'texture':
        // Create texture pattern
        for (let i = 0; i < adjustedSize; i += 2) {
          for (let j = 0; j < adjustedSize; j += 2) {
            if (Math.random() > 0.5) {
              ctx.fillStyle = selectedColor;
              ctx.fillRect(x + i - adjustedSize/2, y + j - adjustedSize/2, 1, 1);
            }
          }
        }
        break;
      
      case 'scatter':
        // Scattered dots
        for (let i = 0; i < adjustedSize * 2; i++) {
          const offsetX = (Math.random() - 0.5) * adjustedSize;
          const offsetY = (Math.random() - 0.5) * adjustedSize;
          ctx.fillStyle = selectedColor;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;
      
      default:
        // Standard brush
        ctx.fillStyle = selectedColor;
        ctx.beginPath();
        ctx.arc(x, y, adjustedSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  const applySymmetry = (x: number, y: number, drawFunction: (x: number, y: number) => void) => {
    drawFunction(x, y);
    
    if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
      drawFunction(CANVAS_SIZE - x, y);
    }
    
    if (symmetryMode === 'vertical' || symmetryMode === 'both') {
      drawFunction(x, CANVAS_SIZE - y);
    }
    
    if (symmetryMode === 'both') {
      drawFunction(CANVAS_SIZE - x, CANVAS_SIZE - y);
    }
  };

  const generatePattern = (patternType: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    switch (patternType) {
      case 'checkerboard':
        for (let x = 0; x < CANVAS_SIZE; x += 20) {
          for (let y = 0; y < CANVAS_SIZE; y += 20) {
            if ((x / 20 + y / 20) % 2 === 0) {
              ctx.fillStyle = selectedColor;
              ctx.fillRect(x, y, 20, 20);
            }
          }
        }
        break;
      
      case 'stripes':
        for (let x = 0; x < CANVAS_SIZE; x += 10) {
          ctx.fillStyle = selectedColor;
          ctx.fillRect(x, 0, 5, CANVAS_SIZE);
        }
        break;
      
      case 'dots':
        for (let x = 10; x < CANVAS_SIZE; x += 20) {
          for (let y = 10; y < CANVAS_SIZE; y += 20) {
            ctx.fillStyle = selectedColor;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
    }
  };

  const applyAIEnhancement = async () => {
    toast({
      title: "IA a Melhorar Arte! 🤖",
      description: "A IA está a analisar e melhorar a sua criação...",
    });
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Apply random enhancements
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    // Add subtle glow effect
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 10;
    ctx.globalCompositeOperation = 'screen';
    
    // Redraw with glow
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.putImageData(imageData, 0, 0);
    
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
    
    toast({
      title: "IA Concluída! ✨",
      description: "Sua arte foi melhorada com efeitos inteligentes!",
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setIsDrawing(true);
    setLastPoint({ x, y });
    saveToHistory();
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    vibrate('light');
    
    if (selectedTool === 'brush' || selectedTool === 'pencil') {
      applySymmetry(x, y, (drawX, drawY) => {
        drawWithPressure(ctx, drawX, drawY);
      });
    } else if (selectedTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else if (selectedTool === 'bucket') {
      floodFill(ctx, Math.floor(x), Math.floor(y), selectedColor);
    } else if (selectedTool === 'eyedropper') {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;
      const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      setSelectedColor(hexColor);
      toast({
        title: "Cor Capturada! 🎨",
        description: `Nova cor selecionada: ${hexColor}`,
      });
    } else if (selectedTool === 'text' && textInput) {
      ctx.fillStyle = selectedColor;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillText(textInput, x, y);
    } else if (selectedTool === 'sticker' && selectedSticker) {
      ctx.font = '32px Arial';
      ctx.fillText(selectedSticker, x - 16, y + 16);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current || !lastPoint) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    if (selectedTool === 'brush' || selectedTool === 'pencil') {
      // Draw line from last point to current point for smooth strokes
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.globalAlpha = brushOpacity / 100;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    setLastPoint({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    // Simplified flood fill implementation
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Implementation would go here - simplified for brevity
    ctx.putImageData(imageData, 0, 0);
  };

  const applyFilterPreset = (preset: typeof filterPresets[0]) => {
    setImageFilters(preset.filters);
    toast({
      title: `Filtro "${preset.name}" Aplicado! 🎨`,
      description: "Filtro aplicado à sua criação.",
    });
  };

  const randomizeColors = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) { // If pixel is not transparent
        data[i] = Math.random() * 255;     // Red
        data[i + 1] = Math.random() * 255; // Green
        data[i + 2] = Math.random() * 255; // Blue
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    toast({
      title: "Cores Aleatórias! 🌈",
      description: "Cores randomizadas aplicadas!",
    });
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `Camada ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      data: null
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerIndex(layers.length);
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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      
      // Draw image on canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        saveToHistory();
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Imagem Carregada",
      description: "Imagem foi adicionada ao canvas.",
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    saveToHistory();
    
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
    setActiveTab('draw');
    setSelectedTool('brush');
    setSelectedColor('#D4A757');
    setBrushSize(5);
    setBrushOpacity(100);
    setLayers([{ id: '1', name: 'Fundo', visible: true, opacity: 100, data: null }]);
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
      
      <DialogContent className="max-w-7xl h-[95vh] p-0 gap-0 bg-background/95 backdrop-blur-sm">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-headline flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3 text-primary" />
                Personalizar Pixel ({pixelData.x}, {pixelData.y})
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <Badge className={getRarityColor(pixelData.rarity)}>
                  {pixelData.rarity}
                </Badge>
                <span className="text-muted-foreground">{pixelData.region}</span>
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
          {/* Left Panel - Tools */}
          <div className="w-80 border-r flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="draw">
                  <Brush className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="filters">
                  <Sliders className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="effects">
                  <Sparkles className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="details">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {/* Drawing Tools Tab */}
                  <TabsContent value="draw" className="mt-0">
                    <ScrollArea className="h-full">
                      <div className="space-y-4">
                        {/* Tool Categories */}
                        <div className="space-y-3">
                          {['basic', 'artistic', 'effects', 'shapes', 'advanced', 'content', 'decoration', 'utility'].map(category => {
                            const categoryTools = tools.filter(t => t.category === category);
                            if (categoryTools.length === 0) return null;
                            
                            const categoryNames = {
                              basic: 'Básicas',
                              artistic: 'Artísticas', 
                              effects: 'Efeitos',
                              shapes: 'Formas',
                              advanced: 'Avançadas',
                              content: 'Conteúdo',
                              decoration: 'Decoração',
                              utility: 'Utilidades'
                            };
                            
                            return (
                              <div key={category} className="space-y-2">
                                <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                                  {categoryNames[category as keyof typeof categoryNames]}
                                </h4>
                                <div className="grid grid-cols-4 gap-2">
                                  {categoryTools.map(tool => (
                                    <Button
                                      key={tool.id}
                                      variant={selectedTool === tool.id ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => setSelectedTool(tool.id)}
                                      className="h-12 flex flex-col items-center justify-center p-1"
                                      title={`${tool.label} (${tool.shortcut})`}
                                    >
                                      <tool.icon className="h-4 w-4 mb-1" />
                                      <span className="text-xs">{tool.label}</span>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Brush Settings */}
                        {(selectedTool === 'brush' || selectedTool === 'pencil') && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Configurações do Pincel</h4>
                            
                            <div className="space-y-2">
                              <Label>Tipo de Pincel</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {brushTypes.map(type => (
                                  <Button
                                    key={type.id}
                                    variant={brushType === type.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBrushType(type.id)}
                                    className="flex flex-col items-center p-2"
                                  >
                                    {type.icon}
                                    <span className="text-xs mt-1">{type.label}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Modo de Mistura</Label>
                              <select
                                value={blendMode}
                                onChange={(e) => setBlendMode(e.target.value as BlendMode)}
                                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                              >
                                {blendModes.map(mode => (
                                  <option key={mode.id} value={mode.id}>
                                    {mode.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                        
                        {/* Text Tool Settings */}
                        {selectedTool === 'text' && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Configurações de Texto</h4>
                            
                            <div className="space-y-2">
                              <Label>Texto</Label>
                              <Input
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Digite o texto..."
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label>Tamanho</Label>
                                <Slider
                                  value={[fontSize]}
                                  onValueChange={(value) => setFontSize(value[0])}
                                  min={8}
                                  max={48}
                                  step={1}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Fonte</Label>
                                <select
                                  value={fontFamily}
                                  onChange={(e) => setFontFamily(e.target.value)}
                                  className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                >
                                  <option value="Arial">Arial</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Times">Times</option>
                                  <option value="Courier">Courier</option>
                                  <option value="Helvetica">Helvetica</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Sticker Tool */}
                        {selectedTool === 'sticker' && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Stickers</h4>
                            
                            {stickerCategories.map(category => (
                              <div key={category.name} className="space-y-2">
                                <Label className="text-xs">{category.name}</Label>
                                <div className="grid grid-cols-5 gap-2">
                                  {category.stickers.map(sticker => (
                                    <Button
                                      key={sticker}
                                      variant={selectedSticker === sticker ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => setSelectedSticker(sticker)}
                                      className="h-10 text-lg"
                                    >
                                      {sticker}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Advanced Options */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Opções Avançadas</h4>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Mostrar Grelha</Label>
                              <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Simetria</Label>
                              <div className="grid grid-cols-2 gap-2">
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
                                    onClick={() => setSymmetryMode(mode.id as any)}
                                    className="text-xs"
                                  >
                                    {mode.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Ações Rápidas</h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={randomizeColors}>
                              <Shuffle className="h-4 w-4 mr-2" />
                              Cores Aleatórias
                            </Button>
                            
                            <Button variant="outline" size="sm" onClick={() => generatePattern('checkerboard')}>
                              <Grid className="h-4 w-4 mr-2" />
                              Xadrez
                            </Button>
                            
                            <Button variant="outline" size="sm" onClick={() => generatePattern('stripes')}>
                              <Minus className="h-4 w-4 mr-2" />
                              Riscas
                            </Button>
                            
                            <Button variant="outline" size="sm" onClick={() => generatePattern('dots')}>
                              <Circle className="h-4 w-4 mr-2" />
                              Pontos
                            </Button>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30"
                            onClick={applyAIEnhancement}
                          >
                            <Robot className="h-4 w-4 mr-2" />
                            Melhorar com IA
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  {/* Filters Tab */}
                  <TabsContent value="filters" className="h-full">
                    <ScrollArea className="h-full">
                      <div className="space-y-4">
                        {/* Filter Presets */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Filtros Predefinidos</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {filterPresets.map(preset => (
                              <Button
                                key={preset.name}
                                variant="outline"
                                size="sm"
                                onClick={() => applyFilterPreset(preset)}
                                className="text-xs"
                              >
                                {preset.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Manual Filters */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Brilho: {imageFilters.brightness}%</Label>
                            <Slider
                              value={[imageFilters.brightness]}
                              onValueChange={(value) => setImageFilters(prev => ({ ...prev, brightness: value[0] }))}
                              min={50}
                              max={150}
                              step={5}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Contraste: {imageFilters.contrast}%</Label>
                            <Slider
                              value={[imageFilters.contrast]}
                              onValueChange={(value) => setImageFilters(prev => ({ ...prev, contrast: value[0] }))}
                              min={50}
                              max={150}
                              step={5}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Saturação: {imageFilters.saturation}%</Label>
                            <Slider
                              value={[imageFilters.saturation]}
                              onValueChange={(value) => setImageFilters(prev => ({ ...prev, saturation: value[0] }))}
                              min={0}
                              max={200}
                              step={10}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Desfoque: {imageFilters.blur}px</Label>
                            <Slider
                              value={[imageFilters.blur]}
                              onValueChange={(value) => setImageFilters(prev => ({ ...prev, blur: value[0] }))}
                              min={0}
                              max={10}
                              step={1}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Sépia: {imageFilters.sepia}%</Label>
                            <Slider
                              value={[imageFilters.sepia]}
                              onValueChange={(value) => setImageFilters(prev => ({ ...prev, sepia: value[0] }))}
                              min={0}
                              max={100}
                              step={10}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Image Upload */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Upload de Imagem</h4>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Carregar Imagem
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          {uploadedImage && (
                            <div className="relative">
                              <img 
                                src={uploadedImage} 
                                alt="Uploaded" 
                                className="w-full h-20 object-cover rounded border"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => setUploadedImage(null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
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
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Center Panel - Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Toolbar */}
            <div className="p-3 border-b bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Editor de Pixel</h3>
                  <Badge variant="outline" className="text-xs">
                    {CANVAS_SIZE}x{CANVAS_SIZE}px
                  </Badge>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={undo} disabled={undoStack.length <= 1}>
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
                {/* Grid Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-10 opacity-30"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #000 1px, transparent 1px),
                        linear-gradient(to bottom, #000 1px, transparent 1px)
                      `,
                      backgroundSize: `${gridSize}px ${gridSize}px`
                    }}
                  />
                )}
                
                <canvas
                  ref={canvasRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  className="border-2 border-primary/30 rounded-lg bg-white cursor-crosshair shadow-lg"
                  style={{ 
                    transform: `scale(${zoom})`,
                    imageRendering: 'pixelated',
                    filter: `
                      brightness(${imageFilters.brightness}%) 
                      contrast(${imageFilters.contrast}%) 
                      saturate(${imageFilters.saturation}%) 
                      blur(${imageFilters.blur}px)
                      sepia(${imageFilters.sepia}%)
                    `
                  }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                
                {/* Canvas Controls */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
                    className="h-8 w-8 bg-background/80"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
                    className="h-8 w-8 bg-background/80"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowGrid(!showGrid)}
                    className="h-8 w-8 bg-background/80"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Zoom indicator */}
                <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                  Zoom: {Math.round(zoom * 100)}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Layers & Payment */}
          <div className="w-80 border-l flex flex-col">
            <Tabs defaultValue="layers" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="layers">
                  <Layers className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <TabsContent value="layers" className="mt-0 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Camadas</Label>
                        <Button size="sm" onClick={addLayer}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nova
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {layers.map((layer, index) => (
                          <div
                            key={layer.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded border",
                              activeLayerIndex === index ? "border-primary bg-primary/10" : "border-border"
                            )}
                            onClick={() => setActiveLayerIndex(index)}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newLayers = [...layers];
                                newLayers[index].visible = !newLayers[index].visible;
                                setLayers(newLayers);
                              }}
                            >
                              {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            <span className="text-xs flex-1">{layer.name}</span>
                            <div className="text-xs text-muted-foreground">{layer.opacity}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
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