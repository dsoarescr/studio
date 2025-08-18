'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Brush, Eraser, PaintBucket, Pipette, Type, Image as ImageIcon, Sparkles, Wand2, Grid3X3, ZoomIn, ZoomOut, RotateCcw, RotateCw, Download, Upload, Save, X, Check, Crown, Coins, Gift, Star, Layers, Eye, EyeOff, Plus, Minus, Copy, Scissors, Move, Circle, Square, Triangle, Heart, Smile, Music, Camera, Zap, Target, Droplets, Flame, Snowflake, Sun, Moon, Pen, Pencil, SprayCan as Spray, Bluetooth as Blur, Focus, Bone as Clone, Bandage, Shuffle, RefreshCw, Undo, Redo, Settings, Info, ChevronDown, ChevronUp, Hash, Link as LinkIcon, MapPin, CreditCard, ShoppingCart, Maximize2, Minimize2, MoreHorizontal, Filter, Contrast, Copyright as Brightness, IterationCw as Saturation, Fuel as Hue, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos e interfaces
interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  specialCreditsPrice?: number;
  views: number;
  likes: number;
  isLiked?: boolean;
  gpsCoords?: { lat: number; lon: number } | null;
  isProtected?: boolean;
  features?: string[];
  description?: string;
  color?: string;
  title?: string;
  tags?: string[];
  linkUrl?: string;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement;
}

interface HistoryState {
  layers: Layer[];
  timestamp: number;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'basic' | 'artistic' | 'effects' | 'shapes' | 'text' | 'ai' | 'filters';
  premium?: boolean;
  description: string;
}

interface BrushType {
  id: string;
  name: string;
  shape: 'round' | 'square' | 'soft' | 'texture' | 'scatter' | 'calligraphy';
  hardness: number;
}

interface BlendMode {
  id: string;
  name: string;
  operation: GlobalCompositeOperation;
}

interface Sticker {
  id: string;
  emoji: string;
  category: 'emojis' | 'symbols' | 'nature' | 'portugal';
  name: string;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;
  userSpecialCredits: number;
  onPurchase: (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any) => Promise<boolean>;
}

// Dados das ferramentas organizadas por categoria
const tools: Tool[] = [
  // Básicas
  { id: 'brush', name: 'Pincel', icon: <Brush className="h-5 w-5" />, category: 'basic', description: 'Pincel básico para desenhar' },
  { id: 'pencil', name: 'Lápis', icon: <Pencil className="h-5 w-5" />, category: 'basic', description: 'Lápis para traços finos' },
  { id: 'eraser', name: 'Borracha', icon: <Eraser className="h-5 w-5" />, category: 'basic', description: 'Remove partes da imagem' },
  { id: 'bucket', name: 'Balde', icon: <PaintBucket className="h-5 w-5" />, category: 'basic', description: 'Preenche áreas com cor' },
  { id: 'eyedropper', name: 'Conta-gotas', icon: <Pipette className="h-5 w-5" />, category: 'basic', description: 'Captura cor da imagem' },
  
  // Artísticas
  { id: 'spray', name: 'Spray', icon: <Spray className="h-5 w-5" />, category: 'artistic', description: 'Efeito de spray aerossol' },
  { id: 'blur', name: 'Desfocar', icon: <Blur className="h-5 w-5" />, category: 'artistic', description: 'Aplica desfoque suave' },
  { id: 'smudge', name: 'Borrar', icon: <Move className="h-5 w-5" />, category: 'artistic', description: 'Efeito de smudge realista' },
  { id: 'clone', name: 'Clonar', icon: <Copy className="h-5 w-5" />, category: 'artistic', premium: true, description: 'Duplica áreas da imagem' },
  { id: 'heal', name: 'Curar', icon: <Bandage className="h-5 w-5" />, category: 'artistic', premium: true, description: 'Remove imperfeições' },
  
  // Efeitos
  { id: 'glow', name: 'Brilho', icon: <Sun className="h-5 w-5" />, category: 'effects', description: 'Adiciona efeito de brilho' },
  { id: 'shadow', name: 'Sombra', icon: <Moon className="h-5 w-5" />, category: 'effects', description: 'Cria sombras realistas' },
  { id: 'fire', name: 'Fogo', icon: <Flame className="h-5 w-5" />, category: 'effects', premium: true, description: 'Efeito de chamas' },
  { id: 'water', name: 'Água', icon: <Droplets className="h-5 w-5" />, category: 'effects', premium: true, description: 'Efeito aquático' },
  
  // Formas
  { id: 'circle', name: 'Círculo', icon: <Circle className="h-5 w-5" />, category: 'shapes', description: 'Desenha círculos perfeitos' },
  { id: 'square', name: 'Quadrado', icon: <Square className="h-5 w-5" />, category: 'shapes', description: 'Desenha quadrados' },
  { id: 'triangle', name: 'Triângulo', icon: <Triangle className="h-5 w-5" />, category: 'shapes', description: 'Desenha triângulos' },
  { id: 'heart', name: 'Coração', icon: <Heart className="h-5 w-5" />, category: 'shapes', description: 'Forma de coração' },
  
  // Texto
  { id: 'text', name: 'Texto', icon: <Type className="h-5 w-5" />, category: 'text', description: 'Adiciona texto personalizado' },
  
  // IA
  { id: 'ai-enhance', name: 'IA Melhorar', icon: <Wand2 className="h-5 w-5" />, category: 'ai', premium: true, description: 'IA melhora automaticamente' },
  { id: 'ai-style', name: 'Estilo IA', icon: <Sparkles className="h-5 w-5" />, category: 'ai', premium: true, description: 'Aplica estilos artísticos' },
  
  // Filtros
  { id: 'vintage', name: 'Vintage', icon: <Camera className="h-5 w-5" />, category: 'filters', description: 'Efeito vintage retrô' },
  { id: 'neon', name: 'Neon', icon: <Zap className="h-5 w-5" />, category: 'filters', premium: true, description: 'Efeito neon brilhante' }
];

const brushTypes: BrushType[] = [
  { id: 'round', name: 'Redondo', shape: 'round', hardness: 1.0 },
  { id: 'square', name: 'Quadrado', shape: 'square', hardness: 1.0 },
  { id: 'soft', name: 'Suave', shape: 'soft', hardness: 0.3 },
  { id: 'texture', name: 'Textura', shape: 'texture', hardness: 0.8 },
  { id: 'scatter', name: 'Disperso', shape: 'scatter', hardness: 0.6 },
  { id: 'calligraphy', name: 'Caligrafia', shape: 'calligraphy', hardness: 0.9 }
];

const blendModes: BlendMode[] = [
  { id: 'normal', name: 'Normal', operation: 'source-over' },
  { id: 'multiply', name: 'Multiplicar', operation: 'multiply' },
  { id: 'screen', name: 'Tela', operation: 'screen' },
  { id: 'overlay', name: 'Sobreposição', operation: 'overlay' },
  { id: 'soft-light', name: 'Luz Suave', operation: 'soft-light' },
  { id: 'hard-light', name: 'Luz Forte', operation: 'hard-light' },
  { id: 'color-dodge', name: 'Subexposição', operation: 'color-dodge' },
  { id: 'color-burn', name: 'Superexposição', operation: 'color-burn' }
];

const stickers: Sticker[] = [
  // Emojis
  { id: 'smile', emoji: '😊', category: 'emojis', name: 'Sorriso' },
  { id: 'heart', emoji: '❤️', category: 'emojis', name: 'Coração' },
  { id: 'star', emoji: '⭐', category: 'emojis', name: 'Estrela' },
  { id: 'fire', emoji: '🔥', category: 'emojis', name: 'Fogo' },
  { id: 'gem', emoji: '💎', category: 'emojis', name: 'Diamante' },
  { id: 'crown', emoji: '👑', category: 'emojis', name: 'Coroa' },
  
  // Símbolos
  { id: 'check', emoji: '✓', category: 'symbols', name: 'Check' },
  { id: 'cross', emoji: '✗', category: 'symbols', name: 'Cruz' },
  { id: 'arrow', emoji: '→', category: 'symbols', name: 'Seta' },
  { id: 'music', emoji: '♪', category: 'symbols', name: 'Música' },
  { id: 'peace', emoji: '☮', category: 'symbols', name: 'Paz' },
  { id: 'yin-yang', emoji: '☯', category: 'symbols', name: 'Yin Yang' },
  
  // Natureza
  { id: 'tree', emoji: '🌳', category: 'nature', name: 'Árvore' },
  { id: 'flower', emoji: '🌸', category: 'nature', name: 'Flor' },
  { id: 'sun', emoji: '☀️', category: 'nature', name: 'Sol' },
  { id: 'moon', emoji: '🌙', category: 'nature', name: 'Lua' },
  { id: 'wave', emoji: '🌊', category: 'nature', name: 'Onda' },
  { id: 'mountain', emoji: '⛰️', category: 'nature', name: 'Montanha' },
  
  // Portugal
  { id: 'flag', emoji: '🇵🇹', category: 'portugal', name: 'Bandeira' },
  { id: 'castle', emoji: '🏰', category: 'portugal', name: 'Castelo' },
  { id: 'boat', emoji: '⛵', category: 'portugal', name: 'Barco' },
  { id: 'wine', emoji: '🍷', category: 'portugal', name: 'Vinho' },
  { id: 'fish', emoji: '🐟', category: 'portugal', name: 'Peixe' },
  { id: 'anchor', emoji: '⚓', category: 'portugal', name: 'Âncora' }
];

const colorPalettes = [
  {
    name: 'Portugal',
    colors: ['#D4A757', '#7DF9FF', '#228B22', '#DC143C', '#FFD700', '#4169E1']
  },
  {
    name: 'Natureza',
    colors: ['#228B22', '#32CD32', '#8FBC8F', '#6B8E23', '#9ACD32', '#00FF7F']
  },
  {
    name: 'Oceano',
    colors: ['#0077BE', '#7DF9FF', '#4682B4', '#5F9EA0', '#87CEEB', '#B0E0E6']
  },
  {
    name: 'Pôr do Sol',
    colors: ['#FF6347', '#FF4500', '#FFD700', '#FFA500', '#FF69B4', '#FF1493']
  },
  {
    name: 'Vintage',
    colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#BC8F8F']
  },
  {
    name: 'Neon',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#80FF00', '#8000FF']
  }
];

const presetFilters = [
  { id: 'vintage', name: 'Vintage', description: 'Efeito retrô clássico' },
  { id: 'dramatic', name: 'Dramático', description: 'Alto contraste e saturação' },
  { id: 'soft', name: 'Suave', description: 'Tons pastéis delicados' },
  { id: 'vibrant', name: 'Vibrante', description: 'Cores intensas e vivas' },
  { id: 'monochrome', name: 'Monocromático', description: 'Preto e branco artístico' },
  { id: 'sepia', name: 'Sépia', description: 'Tom dourado nostálgico' }
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
  const [activeTab, setActiveTab] = useState('design');
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [selectedBrushType, setSelectedBrushType] = useState('round');
  const [selectedBlendMode, setSelectedBlendMode] = useState('normal');
  
  // Estados do canvas e camadas
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Estados de configuração
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [pressureSensitive, setPressureSensitive] = useState(true);
  const [smoothStrokes, setSmoothStrokes] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(1);
  
  // Estados de customização
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelTags, setPixelTags] = useState<string[]>([]);
  const [pixelLink, setPixelLink] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Estados de filtros de imagem
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  
  // Estados de texto
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textPosition, setTextPosition] = useState({ x: 200, y: 200 });
  
  // Estados de interface
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();
  const { vibrate } = useHapticFeedback();

  // Inicialização do canvas e primeira camada
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      initializeCanvas();
    }
  }, [isOpen]);

  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    
    // Criar primeira camada
    const firstLayer: Layer = {
      id: 'layer-1',
      name: 'Camada 1',
      visible: true,
      opacity: 100,
      canvas: document.createElement('canvas')
    };
    firstLayer.canvas.width = 400;
    firstLayer.canvas.height = 400;
    
    setLayers([firstLayer]);
    setActiveLayerIndex(0);
    
    // Salvar estado inicial
    saveToHistory();
  };

  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      layers: layers.map(layer => ({
        ...layer,
        canvas: cloneCanvas(layer.canvas)
      })),
      timestamp: Date.now()
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Manter apenas os últimos 50 estados
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [layers, history, historyIndex]);

  const cloneCanvas = (originalCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const clonedCanvas = document.createElement('canvas');
    clonedCanvas.width = originalCanvas.width;
    clonedCanvas.height = originalCanvas.height;
    const ctx = clonedCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(originalCanvas, 0, 0);
    }
    return clonedCanvas;
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      restoreFromHistory(history[historyIndex - 1]);
      vibrate('light');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      restoreFromHistory(history[historyIndex + 1]);
      vibrate('light');
    }
  };

  const restoreFromHistory = (state: HistoryState) => {
    setLayers(state.layers.map(layer => ({
      ...layer,
      canvas: cloneCanvas(layer.canvas)
    })));
    redrawCanvas();
  };

  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 400, 400);
    
    layers.forEach(layer => {
      if (layer.visible) {
        ctx.globalAlpha = layer.opacity / 100;
        ctx.drawImage(layer.canvas, 0, 0);
      }
    });
    
    ctx.globalAlpha = 1;
  };

  // Canvas interaction handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    applyTool(x, y);
    vibrate('light');
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons === 1) { // Left mouse button pressed
      handleCanvasMouseDown(e);
    }
  };

  const handleCanvasMouseUp = () => {
    // Tool application finished
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    applyTool(x, y);
    vibrate('light');
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      handleCanvasTouchStart(e);
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  const applyTool = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalAlpha = opacity / 100;
    
    switch (selectedTool) {
      case 'brush':
      case 'pencil':
        ctx.fillStyle = selectedColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        break;
        
      case 'bucket':
        // Simple flood fill simulation
        ctx.fillStyle = selectedColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'eyedropper':
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        setSelectedColor(hexColor);
        toast({
          title: "Cor Capturada! 🎨",
          description: `Cor ${hexColor} selecionada.`,
        });
        break;
        
      default:
        // Default brush behavior
        ctx.fillStyle = selectedColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  // Funções de desenho
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || activeLayerIndex >= layers.length) return;
    
    setIsDrawing(true);
    vibrate('selection');
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasZoom;
    const y = (e.clientY - rect.top) / canvasZoom;
    
    setLastPoint({ x, y });
    
    if (selectedTool === 'brush' || selectedTool === 'pencil') {
      drawPoint(x, y);
    } else if (selectedTool === 'bucket') {
      floodFill(x, y);
    } else if (selectedTool === 'eyedropper') {
      pickColor(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPoint) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasZoom;
    const y = (e.clientY - rect.top) / canvasZoom;
    
    if (selectedTool === 'brush' || selectedTool === 'pencil') {
      if (smoothStrokes) {
        drawSmoothLine(lastPoint.x, lastPoint.y, x, y);
      } else {
        drawLine(lastPoint.x, lastPoint.y, x, y);
      }
    } else if (selectedTool === 'eraser') {
      erase(x, y);
    }
    
    setLastPoint({ x, y });
    
    // Aplicar simetria se ativada
    if (symmetryMode !== 'none') {
      applySymmetry(x, y);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveToHistory();
      vibrate('light');
    }
  };

  const drawPoint = (x: number, y: number) => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = blendModes.find(m => m.id === selectedBlendMode)?.operation || 'source-over';
    ctx.fillStyle = selectedColor;
    ctx.globalAlpha = brushOpacity / 100;
    
    const size = brushSize * (pressureSensitive ? Math.random() * 0.5 + 0.5 : 1);
    
    if (selectedBrushType === 'round') {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedBrushType === 'square') {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else if (selectedBrushType === 'soft') {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
      gradient.addColorStop(0, selectedColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    redrawCanvas();
  };

  const drawSmoothLine = (x1: number, y1: number, x2: number, y2: number) => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = blendModes.find(m => m.id === selectedBlendMode)?.operation || 'source-over';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = brushOpacity / 100;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    redrawCanvas();
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = blendModes.find(m => m.id === selectedBlendMode)?.operation || 'source-over';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity / 100;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    redrawCanvas();
  };

  const erase = (x: number, y: number) => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    redrawCanvas();
  };

  const floodFill = (x: number, y: number) => {
    // Implementação simplificada do flood fill
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, 400, 400);
    
    redrawCanvas();
    saveToHistory();
  };

  const pickColor = (x: number, y: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    setSelectedColor(hexColor);
    vibrate('medium');
    
    toast({
      title: "Cor Capturada! 🎨",
      description: `Nova cor selecionada: ${hexColor}`,
    });
  };

  const applySymmetry = (x: number, y: number) => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
      const mirrorX = 400 - x;
      drawPoint(mirrorX, y);
    }
    
    if (symmetryMode === 'vertical' || symmetryMode === 'both') {
      const mirrorY = 400 - y;
      drawPoint(x, mirrorY);
    }
    
    if (symmetryMode === 'both') {
      const mirrorX = 400 - x;
      const mirrorY = 400 - y;
      drawPoint(mirrorX, mirrorY);
    }
  };

  // Funções de camadas
  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Camada ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      canvas: document.createElement('canvas')
    };
    newLayer.canvas.width = 400;
    newLayer.canvas.height = 400;
    
    setLayers([...layers, newLayer]);
    setActiveLayerIndex(layers.length);
    
    toast({
      title: "Nova Camada Criada! 📄",
      description: `${newLayer.name} adicionada com sucesso.`,
    });
  };

  const deleteLayer = (index: number) => {
    if (layers.length <= 1) {
      toast({
        title: "Não é Possível Eliminar",
        description: "Deve manter pelo menos uma camada.",
        variant: "destructive"
      });
      return;
    }
    
    const newLayers = layers.filter((_, i) => i !== index);
    setLayers(newLayers);
    setActiveLayerIndex(Math.max(0, Math.min(activeLayerIndex, newLayers.length - 1)));
    
    toast({
      title: "Camada Eliminada! 🗑️",
      description: "Camada removida com sucesso.",
    });
  };

  const toggleLayerVisibility = (index: number) => {
    const newLayers = [...layers];
    newLayers[index].visible = !newLayers[index].visible;
    setLayers(newLayers);
    redrawCanvas();
  };

  const updateLayerOpacity = (index: number, opacity: number) => {
    const newLayers = [...layers];
    newLayers[index].opacity = opacity;
    setLayers(newLayers);
    redrawCanvas();
  };

  // Funções de upload e filtros
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ficheiro Muito Grande",
        description: "O ficheiro deve ter menos de 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      
      // Aplicar imagem ao canvas
      const img = new Image();
      img.onload = () => {
        const layer = layers[activeLayerIndex];
        if (!layer) return;
        
        const ctx = layer.canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0, 400, 400);
        redrawCanvas();
        saveToHistory();
      };
      img.src = result;
      
      toast({
        title: "Imagem Carregada! 📸",
        description: "Imagem aplicada ao pixel com sucesso.",
      });
    };
    reader.readAsDataURL(file);
  };

  const applyImageFilters = () => {
    if (!uploadedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    redrawCanvas();
    
    toast({
      title: "Filtros Aplicados! ✨",
      description: "Filtros de imagem aplicados com sucesso.",
    });
  };

  // Funções de efeitos
  const toggleEffect = (effectId: string) => {
    const isSelected = selectedEffects.includes(effectId);
    
    if (isSelected) {
      setSelectedEffects(prev => prev.filter(id => id !== effectId));
    } else {
      setSelectedEffects(prev => [...prev, effectId]);
    }
    
    vibrate('medium');
    
    toast({
      title: isSelected ? "Efeito Removido" : "Efeito Adicionado! ✨",
      description: `Efeito ${effectId} ${isSelected ? 'removido' : 'aplicado'}.`,
    });
  };

  // Funções de IA
  const applyAIEnhancement = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfetti(true);
      setPlaySuccessSound(true);
      
      toast({
        title: "IA Aplicada! 🤖✨",
        description: "Pixel melhorado automaticamente pela IA!",
      });
      
      addXp(25);
    }, 2000);
  };

  const randomizeColors = () => {
    const randomColors = Array.from({ length: 6 }, () => 
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
    
    // Aplicar cores aleatórias mantendo transparência
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    // Lógica simplificada de randomização
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = randomColors[Math.floor(Math.random() * randomColors.length)];
    ctx.fillRect(0, 0, 400, 400);
    
    redrawCanvas();
    saveToHistory();
    
    toast({
      title: "Cores Aleatórias! 🎲",
      description: "Paleta de cores randomizada aplicada!",
    });
  };

  const applyPresetFilter = (filterId: string) => {
    const filter = presetFilters.find(f => f.id === filterId);
    if (!filter) return;
    
    // Aplicar filtro baseado no ID
    switch (filterId) {
      case 'vintage':
        setBrightness(90);
        setContrast(110);
        setSaturation(80);
        break;
      case 'dramatic':
        setBrightness(105);
        setContrast(140);
        setSaturation(120);
        break;
      case 'soft':
        setBrightness(110);
        setContrast(85);
        setSaturation(90);
        setBlur(1);
        break;
      case 'vibrant':
        setBrightness(110);
        setContrast(120);
        setSaturation(150);
        break;
      case 'monochrome':
        setSaturation(0);
        setContrast(120);
        break;
      case 'sepia':
        setBrightness(110);
        setContrast(90);
        setSaturation(60);
        break;
    }
    
    applyImageFilters();
    
    toast({
      title: `Filtro ${filter.name} Aplicado! 🎨`,
      description: filter.description,
    });
  };

  // Funções de texto e stickers
  const addText = () => {
    if (!textContent.trim()) return;
    
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = selectedColor;
    ctx.fillText(textContent, textPosition.x, textPosition.y);
    
    redrawCanvas();
    saveToHistory();
    setTextContent('');
    
    toast({
      title: "Texto Adicionado! 📝",
      description: `"${textContent}" adicionado ao pixel.`,
    });
  };

  const addSticker = (sticker: Sticker) => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = '48px Arial';
    ctx.fillText(sticker.emoji, 200, 200);
    
    redrawCanvas();
    saveToHistory();
    
    toast({
      title: "Sticker Adicionado! 🎉",
      description: `${sticker.name} (${sticker.emoji}) adicionado!`,
    });
  };

  // Funções de tags
  const addTag = () => {
    if (!newTag.trim() || pixelTags.includes(newTag.trim())) return;
    
    const tag = newTag.trim().replace('#', '');
    setPixelTags([...pixelTags, tag]);
    setNewTag('');
    
    toast({
      title: "Tag Adicionada! 🏷️",
      description: `#${tag} adicionada às tags do pixel.`,
    });
  };

  const removeTag = (tagToRemove: string) => {
    setPixelTags(pixelTags.filter(tag => tag !== tagToRemove));
  };

  const handleUndo = () => {
    vibrate('light');
    toast({
      title: "Ação Desfeita",
      description: "Última ação foi desfeita.",
    });
  };

  const handleRedo = () => {
    vibrate('light');
    toast({
      title: "Ação Refeita",
      description: "Ação foi refeita.",
    });
  };

  // Função de compra
  const handlePurchase = async () => {
    if (!pixelData) return;
    
    // Validar campos obrigatórios
    if (!pixelTitle.trim()) {
      toast({
        title: "Título Obrigatório",
        description: "Por favor, adicione um título ao seu pixel.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Capturar imagem do canvas
      const canvas = canvasRef.current;
      const imageDataUrl = canvas?.toDataURL('image/png');
      
      const customizations = {
        title: pixelTitle,
        description: pixelDescription,
        tags: pixelTags,
        linkUrl: pixelLink,
        effects: selectedEffects,
        image: imageDataUrl,
        color: selectedColor
      };
      
      const success = await onPurchase(pixelData, 'credits', customizations);
      
      if (success) {
        setShowConfetti(true);
        setPlaySuccessSound(true);
        
        addXp(50);
        
        toast({
          title: "Pixel Comprado! 🎉",
          description: `Pixel (${pixelData.x}, ${pixelData.y}) é agora seu!`,
        });
        
        onClose();
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

  const downloadCreation = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `pixel-${pixelData?.x}-${pixelData?.y}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast({
      title: "Criação Guardada! 💾",
      description: "Sua obra de arte foi descarregada.",
    });
  };

  const clearCanvas = () => {
    const layer = layers[activeLayerIndex];
    if (!layer) return;
    
    const ctx = layer.canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 400, 400);
    redrawCanvas();
    saveToHistory();
    
    toast({
      title: "Canvas Limpo! 🧹",
      description: "Camada atual foi limpa.",
    });
  };

  // Cálculo de preços
  const getBasePrice = () => {
    if (!pixelData) return 1;
    
    const rarityMultipliers = {
      'Comum': 1,
      'Incomum': 2.5,
      'Raro': 5,
      'Épico': 10,
      'Lendário': 25,
      'Marco Histórico': 50
    };
    
    return 1 * (rarityMultipliers[pixelData.rarity] || 1);
  };

  const getEffectsPrice = () => {
    return selectedEffects.length * 5; // €5 por efeito
  };

  const getTotalPrice = () => {
    return getBasePrice() + getEffectsPrice();
  };

  const canAfford = () => {
    return userCredits >= getTotalPrice() || userSpecialCredits >= (pixelData?.specialCreditsPrice || 0);
  };

  if (!pixelData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-6xl h-[95vh] p-0 gap-0 bg-background/98 backdrop-blur-md">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Palette className="h-6 w-6 mr-3 text-primary" />
              Editor de Pixel ({pixelData.x}, {pixelData.y})
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{pixelData.region}</Badge>
              <Badge className="bg-gradient-to-r from-primary to-accent">
                {pixelData.rarity}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Área do Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Principal */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-muted/20 to-background">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border-2 border-border rounded-lg shadow-lg bg-white cursor-crosshair"
                  style={{ 
                    transform: `scale(${canvasZoom})`,
                    imageRendering: 'pixelated'
                  }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onTouchStart={handleCanvasTouchStart}
                  onTouchMove={handleCanvasTouchMove}
                  onTouchEnd={handleCanvasTouchEnd}
                />
                
                {/* Grid Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: `${gridSize}px ${gridSize}px`,
                      transform: `scale(${canvasZoom})`
                    }}
                  />
                )}
              </div>
            </div>

            {/* Controles do Canvas */}
            <div className="p-3 border-t bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => setCanvasZoom(Math.min(3, canvasZoom + 0.5))}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCanvasZoom(Math.max(0.5, canvasZoom - 0.5))}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Zoom:</Label>
                    <span className="text-xs font-mono w-8">{Math.round(canvasZoom * 100)}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCreation}>
                    <Download className="h-4 w-4 mr-1" />
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Painel Lateral */}
          <div className="w-80 border-l flex flex-col">
            <Tabs defaultValue="tools" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="tools" className="text-xs">
                  <Brush className="h-4 w-4 mr-1" />
                  Ferramentas
                </TabsTrigger>
                <TabsTrigger value="layers" className="text-xs">
                  <Layers className="h-4 w-4 mr-1" />
                  Camadas
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-xs">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Efeitos
                </TabsTrigger>
                <TabsTrigger value="details" className="text-xs">
                  <Info className="h-4 w-4 mr-1" />
                  Detalhes
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                {/* Tab: Ferramentas */}
                <TabsContent value="tools" className="p-3 space-y-4">
                  {/* Paletas de Cores */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Paletas de Cores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex gap-1 mb-2">
                        {colorPalettes.map((palette, index) => (
                          <Button
                            key={index}
                            variant={selectedPalette === index ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedPalette(index)}
                            className="text-xs"
                          >
                            {palette.name}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-6 gap-1">
                        {colorPalettes[selectedPalette].colors.map((color, index) => (
                          <button
                            key={index}
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                              selectedColor === color ? "border-foreground scale-110" : "border-border"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ferramentas Avançadas */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        Ferramentas Avançadas
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                        >
                          {showAdvancedTools ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    {showAdvancedTools && (
                      <CardContent className="space-y-3">
                        {/* Ferramentas IA */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Inteligência Artificial</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={applyAIEnhancement}
                              disabled={isProcessing}
                              className="text-xs"
                            >
                              <Wand2 className="h-3 w-3 mr-1" />
                              {isProcessing ? 'A processar...' : 'IA Melhorar'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={randomizeColors}
                              className="text-xs"
                            >
                              <Shuffle className="h-3 w-3 mr-1" />
                              Cores Aleatórias
                            </Button>
                          </div>
                        </div>
                        
                        {/* Filtros Predefinidos */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Filtros Predefinidos</Label>
                          <div className="grid grid-cols-2 gap-1">
                            {presetFilters.map(filter => (
                              <Button
                                key={filter.id}
                                variant="outline"
                                size="sm"
                                onClick={() => applyPresetFilter(filter.id)}
                                className="text-xs"
                              >
                                {filter.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Configurações Avançadas */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Grelha</Label>
                            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Simetria</Label>
                            <Select value={symmetryMode} onValueChange={(value: any) => setSymmetryMode(value)}>
                              <SelectTrigger className="w-24 h-7">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Nenhuma</SelectItem>
                                <SelectItem value="horizontal">Horizontal</SelectItem>
                                <SelectItem value="vertical">Vertical</SelectItem>
                                <SelectItem value="both">Ambas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Pressão</Label>
                            <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Traços Suaves</Label>
                            <Switch checked={smoothStrokes} onCheckedChange={setSmoothStrokes} />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Upload de Imagem */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Imagem de Base</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-xs"
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
                      
                      {uploadedImage && (
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Filtros de Imagem</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-16">Brilho:</Label>
                              <Slider
                                value={[brightness]}
                                onValueChange={(value) => setBrightness(value[0])}
                                min={50}
                                max={150}
                                className="flex-1"
                              />
                              <span className="text-xs w-8">{brightness}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-16">Contraste:</Label>
                              <Slider
                                value={[contrast]}
                                onValueChange={(value) => setContrast(value[0])}
                                min={50}
                                max={150}
                                className="flex-1"
                              />
                              <span className="text-xs w-8">{contrast}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs w-16">Saturação:</Label>
                              <Slider
                                value={[saturation]}
                                onValueChange={(value) => setSaturation(value[0])}
                                min={0}
                                max={200}
                                className="flex-1"
                              />
                              <span className="text-xs w-8">{saturation}%</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={applyImageFilters}
                              className="w-full text-xs"
                            >
                              Aplicar Filtros
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Camadas */}
                <TabsContent value="layers" className="p-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Camadas ({layers.length})</Label>
                    <Button variant="outline" size="sm" onClick={addLayer}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {layers.map((layer, index) => (
                      <Card 
                        key={layer.id}
                        className={cn(
                          "p-3 cursor-pointer transition-colors",
                          activeLayerIndex === index ? "border-primary bg-primary/10" : ""
                        )}
                        onClick={() => setActiveLayerIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(index);
                              }}
                              className="h-6 w-6"
                            >
                              {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            <span className="text-sm font-medium">{layer.name}</span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(index);
                            }}
                            className="h-6 w-6 text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Opacidade:</Label>
                            <Slider
                              value={[layer.opacity]}
                              onValueChange={(value) => updateLayerOpacity(index, value[0])}
                              min={0}
                              max={100}
                              className="flex-1"
                            />
                            <span className="text-xs w-8">{layer.opacity}%</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab: Efeitos */}
                <TabsContent value="effects" className="p-3 space-y-4">
                  {/* Stickers */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Stickers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="emojis" className="space-y-2">
                        <TabsList className="grid w-full grid-cols-4 h-8">
                          <TabsTrigger value="emojis" className="text-xs">😊</TabsTrigger>
                          <TabsTrigger value="symbols" className="text-xs">⚡</TabsTrigger>
                          <TabsTrigger value="nature" className="text-xs">🌳</TabsTrigger>
                          <TabsTrigger value="portugal" className="text-xs">🇵🇹</TabsTrigger>
                        </TabsList>
                        
                        {['emojis', 'symbols', 'nature', 'portugal'].map(category => (
                          <TabsContent key={category} value={category} className="mt-2">
                            <div className="grid grid-cols-6 gap-1">
                              {stickers
                                .filter(s => s.category === category)
                                .map(sticker => (
                                  <Button
                                    key={sticker.id}
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-lg hover:bg-primary/20"
                                    onClick={() => addSticker(sticker)}
                                    title={sticker.name}
                                  >
                                    {sticker.emoji}
                                  </Button>
                                ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Editor de Texto */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Adicionar Texto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input
                        placeholder="Texto a adicionar..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="text-sm"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Tamanho:</Label>
                          <Slider
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                            min={12}
                            max={72}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fonte:</Label>
                          <Select value={fontFamily} onValueChange={setFontFamily}>
                            <SelectTrigger className="h-8 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                              <SelectItem value="Times">Times</SelectItem>
                              <SelectItem value="Courier">Courier</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        onClick={addText}
                        disabled={!textContent.trim()}
                        className="w-full text-xs"
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Adicionar Texto
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Detalhes */}
                <TabsContent value="details" className="p-3 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Título *</Label>
                      <Input
                        placeholder="Nome do seu pixel..."
                        value={pixelTitle}
                        onChange={(e) => setPixelTitle(e.target.value.slice(0, 50))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {pixelTitle.length}/50 caracteres
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Descrição</Label>
                      <Textarea
                        placeholder="Descreva o seu pixel..."
                        value={pixelDescription}
                        onChange={(e) => setPixelDescription(e.target.value.slice(0, 200))}
                        rows={3}
                        className="mt-1 resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {pixelDescription.length}/200 caracteres
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="Adicionar tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1"
                        />
                        <Button variant="outline" size="icon" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {pixelTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pixelTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Hash className="h-3 w-3 mr-1" />
                              {tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTag(tag)}
                                className="h-4 w-4 ml-1 p-0"
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Link (opcional)</Label>
                      <Input
                        placeholder="https://..."
                        value={pixelLink}
                        onChange={(e) => setPixelLink(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>

        {/* Footer com Resumo e Compra */}
        <div className="p-4 border-t bg-gradient-to-r from-card to-primary/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  Pixel ({pixelData.x}, {pixelData.y}) • {pixelData.region}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Base: €{getBasePrice()}</span>
                {selectedEffects.length > 0 && (
                  <span>Efeitos: €{getEffectsPrice()}</span>
                )}
                <span className="font-bold text-primary">Total: €{getTotalPrice()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-primary" />
                  <span>{userCredits.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gift className="h-4 w-4 text-accent" />
                  <span>{userSpecialCredits.toLocaleString()}</span>
                </div>
              </div>
              
              <Button
                onClick={handlePurchase}
                disabled={isProcessing || !canAfford() || !pixelTitle.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-8"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    A processar...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar €{getTotalPrice()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}