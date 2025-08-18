// src/components/pixel-grid/EnhancedPixelPurchaseModal.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
import { cn } from '@/lib/utils';
import { Brush, Eraser, PaintBucket, Pipette, Move, Circle, Square, Triangle, Type, Upload, Undo, Redo, Layers, Settings, Palette, Sparkles, Wand2, RotateCcw, Filter, Contrast, Crown, Gift, Coins, ShoppingCart, Save, X, Play, Pause, Download, Share2, Eye, EyeOff, Plus, Trash2, Copy, Shuffle, ZoomIn, ZoomOut, Grid3X3, Maximize2, Minimize2, Volume2, VolumeX, Camera, Video, Music, Mic, Heart, Star, Zap, Target, Award, Gem, Flame, Snowflake, Droplets, Wind, Sun, Moon, Smile, Frown, ThumbsUp, Hand, Users, MessageSquare, Phone, Mail, Home, Car, Plane, Ship, TreePine as Tree, Flower, Mountain, Cloud, Rainbow, Coffee, Pizza, Cake, Apple, Grape, Fish, Cat, Dog, Bird, Router as Butterfly, FolderRoot as Football, ShoppingBasket as Basketball, Guitar, Piano, Gamepad2, Laptop, Smartphone, Wifi, Battery, Clock, Calendar, Map, Compass, Flag, Shield, Lock, Key, Search, Bell, Settings as SettingsIcon, HelpCircle, Info, CheckCircle, AlertTriangle, XCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight, Hexagon, Pentagon, Octagon, Diamond, Infinity, Anchor, Feather, Paintbrush, Scissors, Ruler, Pen, PenTool, Edit3, Image as ImageIcon, FileImage, Folder, FolderOpen, Archive, Package, Box, Cuboid as Cube, Cherry as Sphere, Cylinder, Cone, Pyramid, Printer as Prism, Torus, Baseline as Helix, Hospital as Spiral, Waves, HeartPulse as Pulse, Activity, TrendingUp, BarChart3, PieChart, LineChart, Radio, Tv, Monitor, Tablet, Watch, Headphones, Speaker, Microscope as Microphone, Camera as CameraIcon, Aperture, Focus, Pen as Lens, Router as Shutter, Slash as Flash, Copyright as Brightness, Contrast as ContrastIcon, IterationCw as Saturation, Fuel as Hue, Aperture as Temperature, Expand as Exposure, Highlighter as Highlights, Rows as Shadows, AlarmClock as Clarity, Vibrate as Vibrance, Earth as Warmth, Cone as Coolness } from 'lucide-react';

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
  onPurchase: (
    pixelData: SelectedPixelDetails,
    paymentMethod: string,
    customizations: any
  ) => Promise<boolean>;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement;
}

interface AnimationFrame {
  id: string;
  name: string;
  layers: Layer[];
  duration: number;
}

interface HistoryState {
  canvasData: ImageData;
  timestamp: number;
  action: string;
}

const CANVAS_SIZE = 400;
const PIXEL_SIZE = 8;
const GRID_SIZE = CANVAS_SIZE / PIXEL_SIZE;

// Paletas temáticas expandidas
const THEME_PALETTES = {
  classic: ['#D4A757', '#7DF9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  neon: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#80FF00', '#FF0040', '#40FF00'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E1BAFF', '#FFBAE1', '#C9FFBA'],
  earth: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3'],
  ocean: ['#006994', '#0085C3', '#00A8CC', '#00C9A7', '#7FCDCD', '#B0E0E6', '#87CEEB', '#4682B4'],
  forest: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F', '#00FA9A', '#66CDAA', '#20B2AA'],
  sunset: ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F', '#7FFF00'],
  portugal: ['#006600', '#FF0000', '#FFD700', '#0066CC', '#FFFFFF', '#000000', '#8B4513', '#4169E1'],
  cyberpunk: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#8000FF', '#00FF40', '#FF4000', '#4000FF'],
  vintage: ['#8B4513', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3', '#DDBEA9'],
  aurora: ['#00FF7F', '#7FFFD4', '#40E0D0', '#48D1CC', '#00CED1', '#5F9EA0', '#4682B4', '#6495ED'],
  fire: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F']
};

// Stickers organizados por categoria
const STICKER_CATEGORIES = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩'],
  hands: ['👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌱', '🌳', '🌲', '🌴', '🌵', '🌾', '🌽', '🍄', '🌰'],
  weather: ['☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌈', '⭐'],
  portugal: ['🇵🇹', '🏰', '⛪', '🌊', '🐟', '🍷', '🧀', '🥖', '⚽', '🎸', '🚢', '🏖️', '🌅', '🗺️', '🏛️', '🎭'],
  gaming: ['🎮', '🕹️', '🎯', '🎲', '🃏', '🎰', '🎪', '🎨', '🖌️', '🖍️', '✏️', '📝', '📊', '📈', '📉', '💻'],
  tech: ['💻', '📱', '⌚', '📷', '📹', '🎥', '📺', '📻', '🔊', '🎧', '🎤', '☎️', '📞', '📠', '💾', '💿'],
  symbols: ['⚡', '🔥', '💎', '👑', '🏆', '🥇', '🎖️', '🏅', '⭐', '🌟', '✨', '💫', '🔮', '🎭', '🎪', '🎨'],
  animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔']
};

// Ferramentas organizadas por categoria
const TOOL_CATEGORIES = {
  basic: [
    { id: 'brush', icon: Brush, label: 'Pincel', premium: false },
    { id: 'eraser', icon: Eraser, label: 'Borracha', premium: false },
    { id: 'bucket', icon: PaintBucket, label: 'Balde', premium: false },
    { id: 'pipette', icon: Pipette, label: 'Conta-gotas', premium: false }
  ],
  shapes: [
    { id: 'circle', icon: Circle, label: 'Círculo', premium: false },
    { id: 'square', icon: Square, label: 'Quadrado', premium: false },
    { id: 'triangle', icon: Triangle, label: 'Triângulo', premium: false },
    { id: 'hexagon', icon: Hexagon, label: 'Hexágono', premium: true },
    { id: 'diamond', icon: Diamond, label: 'Diamante', premium: true },
    { id: 'star', icon: Star, label: 'Estrela', premium: true }
  ],
  advanced: [
    { id: 'clone', icon: Copy, label: 'Clonar', premium: true },
    { id: 'heal', icon: Sparkles, label: 'Curar', premium: true },
    { id: 'smudge', icon: Move, label: 'Borrar', premium: true },
    { id: 'sharpen', icon: Zap, label: 'Nitidez', premium: true }
  ],
  text: [
    { id: 'text', icon: Type, label: 'Texto', premium: false },
    { id: 'sticker', icon: Smile, label: 'Stickers', premium: false }
  ]
};

// Tipos de pincel expandidos
const BRUSH_TYPES = {
  round: { name: 'Redondo', icon: Circle, sizes: [1, 2, 4, 8, 16] },
  square: { name: 'Quadrado', icon: Square, sizes: [1, 2, 4, 8, 16] },
  soft: { name: 'Suave', icon: Cloud, sizes: [2, 4, 8, 16, 32] },
  texture: { name: 'Textura', icon: Grid3X3, sizes: [4, 8, 16, 24] },
  scatter: { name: 'Disperso', icon: Sparkles, sizes: [8, 16, 24, 32] },
  calligraphy: { name: 'Caligrafia', icon: Pen, sizes: [2, 4, 6, 8] },
  watercolor: { name: 'Aquarela', icon: Droplets, sizes: [8, 16, 24, 32] },
  oil: { name: 'Óleo', icon: Paintbrush, sizes: [4, 8, 12, 16] },
  charcoal: { name: 'Carvão', icon: Edit3, sizes: [6, 12, 18, 24] },
  pastel: { name: 'Pastel', icon: Feather, sizes: [8, 16, 24, 32] },
  marker: { name: 'Marcador', icon: PenTool, sizes: [2, 4, 6, 8] },
  spray: { name: 'Spray', icon: Wind, sizes: [12, 20, 28, 36] }
};

// Efeitos especiais únicos
const SPECIAL_EFFECTS = {
  hologram: { name: 'Holograma', icon: Sparkles, cost: 10 },
  glitch: { name: 'Glitch', icon: Zap, cost: 15 },
  crystal: { name: 'Cristal', icon: Gem, cost: 20 },
  plasma: { name: 'Plasma', icon: Activity, cost: 25 },
  aurora: { name: 'Aurora', icon: Rainbow, cost: 30 },
  matrix: { name: 'Matrix', icon: Grid3X3, cost: 35 }
};

// Filtros avançados
const ADVANCED_FILTERS = {
  cyberpunk: { name: 'Cyberpunk', icon: Zap, intensity: 0.8 },
  retro: { name: 'Retro', icon: RotateCcw, intensity: 0.6 },
  dream: { name: 'Sonho', icon: Cloud, intensity: 0.7 },
  alien: { name: 'Alien', icon: Star, intensity: 0.9 },
  underwater: { name: 'Subaquático', icon: Droplets, intensity: 0.5 },
  space: { name: 'Espacial', icon: Sparkles, intensity: 0.8 },
  vintage: { name: 'Vintage', icon: Camera, intensity: 0.6 },
  neon: { name: 'Neon', icon: Zap, intensity: 1.0 },
  sepia: { name: 'Sépia', icon: Sun, intensity: 0.7 },
  noir: { name: 'Noir', icon: Moon, intensity: 0.8 },
  pop: { name: 'Pop Art', icon: Heart, intensity: 0.9 },
  comic: { name: 'Comic', icon: MessageSquare, intensity: 0.8 }
};

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,
  userSpecialCredits,
  onPurchase,
}: EnhancedPixelPurchaseModalProps) {
  // Estados principais
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(4);
  const [brushType, setBrushType] = useState('round');
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushRotation, setBrushRotation] = useState(0);
  const [brushSpacing, setBrushSpacing] = useState(25);
  const [textureIntensity, setTextureIntensity] = useState(50);
  
  // Estados de personalização
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelLink, setPixelLink] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('classic');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  // Estados de camadas e animação
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  
  // Estados de gravação e timelapse
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFrames, setRecordingFrames] = useState<string[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Estados de efeitos e filtros
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [pressureSensitive, setPressureSensitive] = useState(true);
  const [smoothStrokes, setSmoothStrokes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(8);
  const [canvasZoom, setCanvasZoom] = useState(100);
  
  // Estados de interface
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [currentSoundEffect, setCurrentSoundEffect] = useState(SOUND_EFFECTS.CLICK);
  
  // Estados de upload e imagem
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imageFilters, setImageFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });
  
  // Histórico expandido
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);
  
  // Hooks
  const { toast } = useToast();
  const { addCredits, addXp, addSpecialCredits } = useUserStore();
  const { vibrate } = useHapticFeedback();

  // Inicialização do canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = pixelData?.color || '#D4A757';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // Criar camada inicial
        if (layers.length === 0) {
          createNewLayer('Base');
        }
        
        // Salvar estado inicial
        saveToHistory('Inicialização');
      }
    }
  }, [isOpen, pixelData, layers.length]);

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

  // Funções de camadas
  const createNewLayer = (name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    
    const newLayer: Layer = {
      id: Date.now().toString(),
      name,
      visible: true,
      opacity: 100,
      canvas
    };
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerIndex(layers.length);
  };

  const deleteLayer = (index: number) => {
    if (layers.length <= 1) {
      toast({
        title: "Não é possível eliminar",
        description: "Deve manter pelo menos uma camada.",
        variant: "destructive"
      });
      return;
    }
    
    setLayers(prev => prev.filter((_, i) => i !== index));
    setActiveLayerIndex(Math.max(0, activeLayerIndex - 1));
    vibrate('light');
  };

  const toggleLayerVisibility = (index: number) => {
    setLayers(prev => prev.map((layer, i) => 
      i === index ? { ...layer, visible: !layer.visible } : layer
    ));
    vibrate('light');
  };

  const updateLayerOpacity = (index: number, opacity: number) => {
    setLayers(prev => prev.map((layer, i) => 
      i === index ? { ...layer, opacity } : layer
    ));
  };

  // Funções de histórico
  const saveToHistory = (action: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const newState: HistoryState = {
      canvasData: imageData,
      timestamp: Date.now(),
      action
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Manter apenas os últimos 50 estados
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      
      const canvas = canvasRef.current;
      if (canvas && state) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(state.canvasData, 0, 0);
          setHistoryIndex(newIndex);
          vibrate('light');
          playToolSound(SOUND_EFFECTS.CLICK);
        }
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      
      const canvas = canvasRef.current;
      if (canvas && state) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(state.canvasData, 0, 0);
          setHistoryIndex(newIndex);
          vibrate('light');
          playToolSound(SOUND_EFFECTS.CLICK);
        }
      }
    }
  };

  // Funções de desenho
  const getCanvasCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      pressure: event.pressure || 0.5
    };
  };

  const drawPixel = (x: number, y: number, pressure: number = 0.5) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const adjustedSize = pressureSensitive ? brushSize * pressure : brushSize;
    const adjustedOpacity = (brushOpacity / 100) * (pressureSensitive ? pressure : 1);
    
    ctx.globalAlpha = adjustedOpacity;
    ctx.fillStyle = selectedColor;
    
    switch (selectedTool) {
      case 'brush':
        drawBrushStroke(ctx, x, y, adjustedSize);
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        drawBrushStroke(ctx, x, y, adjustedSize);
        ctx.globalCompositeOperation = 'source-over';
        break;
      case 'bucket':
        floodFill(ctx, Math.floor(x), Math.floor(y), selectedColor);
        break;
    }
    
    ctx.globalAlpha = 1;
    
    // Aplicar simetria
    if (symmetryMode !== 'none') {
      applySymmetry(ctx, x, y, adjustedSize, adjustedOpacity);
    }
  };

  const drawBrushStroke = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    switch (brushType) {
      case 'round':
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        break;
      case 'soft':
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
        gradient.addColorStop(0, selectedColor);
        gradient.addColorStop(1, selectedColor + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'texture':
        for (let i = 0; i < size; i += 2) {
          for (let j = 0; j < size; j += 2) {
            if (Math.random() > 0.5) {
              ctx.fillRect(x - size / 2 + i, y - size / 2 + j, 1, 1);
            }
          }
        }
        break;
      case 'scatter':
        for (let i = 0; i < size * 2; i++) {
          const offsetX = (Math.random() - 0.5) * size;
          const offsetY = (Math.random() - 0.5) * size;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  const applySymmetry = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    
    ctx.globalAlpha = opacity;
    
    if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
      const mirrorX = centerX + (centerX - x);
      drawBrushStroke(ctx, mirrorX, y, size);
    }
    
    if (symmetryMode === 'vertical' || symmetryMode === 'both') {
      const mirrorY = centerY + (centerY - y);
      drawBrushStroke(ctx, x, mirrorY, size);
    }
    
    if (symmetryMode === 'both') {
      const mirrorX = centerX + (centerX - x);
      const mirrorY = centerY + (centerY - y);
      drawBrushStroke(ctx, mirrorX, mirrorY, size);
    }
  };

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const data = imageData.data;
    
    const startPos = (startY * CANVAS_SIZE + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];
    
    const fillColorRgb = hexToRgb(fillColor);
    if (!fillColorRgb) return;
    
    const stack = [[startX, startY]];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= CANVAS_SIZE || y < 0 || y >= CANVAS_SIZE) {
        continue;
      }
      
      const pos = (y * CANVAS_SIZE + x) * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const a = data[pos + 3];
      
      if (r !== startR || g !== startG || b !== startB || a !== startA) {
        continue;
      }
      
      visited.add(key);
      
      data[pos] = fillColorRgb.r;
      data[pos + 1] = fillColorRgb.g;
      data[pos + 2] = fillColorRgb.b;
      data[pos + 3] = 255;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
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

  // Event handlers do canvas
  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event);
    if (!coords) return;
    
    isDrawingRef.current = true;
    lastPointRef.current = { x: coords.x, y: coords.y };
    
    if (selectedTool === 'pipette') {
      pickColor(coords.x, coords.y);
    } else {
      drawPixel(coords.x, coords.y, coords.pressure);
    }
    
    vibrate('light');
    playToolSound(SOUND_EFFECTS.CLICK);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    
    const coords = getCanvasCoordinates(event);
    if (!coords || !lastPointRef.current) return;
    
    if (smoothStrokes && selectedTool === 'brush') {
      drawSmoothLine(lastPointRef.current, coords, coords.pressure);
    } else {
      drawPixel(coords.x, coords.y, coords.pressure);
    }
    
    lastPointRef.current = { x: coords.x, y: coords.y };
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      saveToHistory(`${selectedTool} stroke`);
      
      // Recompensar criatividade
      addXp(2);
      if (Math.random() > 0.9) {
        addCredits(1);
        toast({
          title: "Criatividade Recompensada! 🎨",
          description: "Recebeu 1 crédito por usar ferramentas avançadas!",
        });
      }
    }
  };

  const drawSmoothLine = (from: { x: number; y: number }, to: { x: number; y: number }, pressure: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    const steps = Math.max(1, Math.floor(distance / (brushSpacing / 100 * brushSize)));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      drawPixel(x, y, pressure);
    }
  };

  const pickColor = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    const [r, g, b] = imageData.data;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    setSelectedColor(hex);
    addToRecentColors(hex);
    
    toast({
      title: "Cor Capturada! 🎨",
      description: `Nova cor: ${hex}`,
    });
  };

  const addToRecentColors = (color: string) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 8);
    });
  };

  // Funções de gravação
  const captureFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    setRecordingFrames(prev => [...prev, dataUrl]);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingFrames([]);
    setRecordingTime(0);
    
    toast({
      title: "Gravação Iniciada! 🎬",
      description: "A capturar o seu processo criativo...",
    });
    
    vibrate('medium');
    playToolSound(SOUND_EFFECTS.SUCCESS);
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    toast({
      title: "Timelapse Criado! ✨",
      description: `${recordingFrames.length} frames capturados em ${recordingTime}s`,
    });
    
    setShowConfetti(true);
    addXp(50);
    addCredits(25);
    vibrate('success');
    playToolSound(SOUND_EFFECTS.ACHIEVEMENT);
  };

  // Funções de IA
  const applyAIEffect = async (effectType: string) => {
    setIsProcessing(true);
    setProcessingMessage(`Aplicando ${effectType}...`);
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Simular aplicação do efeito
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Aplicar efeito visual baseado no tipo
              switch (effectType) {
                case 'auto-enhance':
                  ctx.filter = 'contrast(1.2) saturate(1.1) brightness(1.05)';
                  ctx.drawImage(canvas, 0, 0);
                  ctx.filter = 'none';
                  break;
                case 'style-transfer':
                  // Simular transferência de estilo
                  ctx.globalCompositeOperation = 'overlay';
                  ctx.fillStyle = '#FF6B6B20';
                  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                  ctx.globalCompositeOperation = 'source-over';
                  break;
                case 'color-harmony':
                  // Aplicar harmonia de cores
                  const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                  // Processar cores para harmonia
                  ctx.putImageData(imageData, 0, 0);
                  break;
              }
              
              saveToHistory(`IA: ${effectType}`);
            }
          }
          
          toast({
            title: "IA Concluída! 🤖",
            description: `Efeito ${effectType} aplicado com sucesso!`,
          });
          
          addXp(25);
          addSpecialCredits(5);
          setShowConfetti(true);
          vibrate('success');
          playToolSound(SOUND_EFFECTS.ACHIEVEMENT);
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const generateRandomColors = () => {
    const palette = THEME_PALETTES[selectedPalette as keyof typeof THEME_PALETTES];
    const randomColor = palette[Math.floor(Math.random() * palette.length)];
    setSelectedColor(randomColor);
    addToRecentColors(randomColor);
    
    toast({
      title: "Cor Aleatória! 🎲",
      description: `Nova cor: ${randomColor}`,
    });
    
    vibrate('light');
    playToolSound(SOUND_EFFECTS.CLICK);
  };

  // Funções de filtros
  const applyFilter = (filterName: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const filter = ADVANCED_FILTERS[filterName as keyof typeof ADVANCED_FILTERS];
    if (!filter) return;
    
    setIsProcessing(true);
    setProcessingMessage(`Aplicando filtro ${filter.name}...`);
    
    setTimeout(() => {
      // Aplicar filtro baseado no tipo
      switch (filterName) {
        case 'cyberpunk':
          ctx.filter = 'hue-rotate(180deg) saturate(2) contrast(1.5)';
          break;
        case 'retro':
          ctx.filter = 'sepia(0.8) saturate(1.2) hue-rotate(15deg)';
          break;
        case 'dream':
          ctx.filter = 'blur(1px) brightness(1.1) saturate(1.3)';
          break;
        case 'neon':
          ctx.filter = 'saturate(2) contrast(1.5) brightness(1.2)';
          break;
        default:
          ctx.filter = 'none';
      }
      
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      
      saveToHistory(`Filtro: ${filter.name}`);
      setIsProcessing(false);
      
      toast({
        title: "Filtro Aplicado! ✨",
        description: `${filter.name} aplicado com sucesso!`,
      });
      
      addXp(15);
      vibrate('medium');
      playToolSound(SOUND_EFFECTS.SUCCESS);
    }, 1500);
  };

  // Funções de efeitos especiais
  const applySpecialEffect = (effectName: string) => {
    const effect = SPECIAL_EFFECTS[effectName as keyof typeof SPECIAL_EFFECTS];
    if (!effect) return;
    
    if (userSpecialCredits < effect.cost) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${effect.cost} créditos especiais para este efeito.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage(`Aplicando ${effect.name}...`);
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Aplicar efeito especial
          switch (effectName) {
            case 'hologram':
              ctx.globalCompositeOperation = 'screen';
              ctx.fillStyle = '#00FFFF40';
              ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
              ctx.globalCompositeOperation = 'source-over';
              break;
            case 'glitch':
              // Simular efeito glitch
              for (let i = 0; i < 10; i++) {
                const y = Math.random() * CANVAS_SIZE;
                const height = Math.random() * 20;
                const offset = (Math.random() - 0.5) * 20;
                const imageData = ctx.getImageData(0, y, CANVAS_SIZE, height);
                ctx.putImageData(imageData, offset, y);
              }
              break;
            case 'crystal':
              ctx.globalCompositeOperation = 'multiply';
              ctx.fillStyle = '#FFFFFF80';
              ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
              ctx.globalCompositeOperation = 'source-over';
              break;
          }
          
          saveToHistory(`Efeito: ${effect.name}`);
        }
      }
      
      setIsProcessing(false);
      addSpecialCredits(-effect.cost);
      addXp(30);
      
      toast({
        title: "Efeito Especial Aplicado! 💎",
        description: `${effect.name} custou ${effect.cost} créditos especiais`,
      });
      
      setShowConfetti(true);
      vibrate('heavy');
      playToolSound(SOUND_EFFECTS.ACHIEVEMENT);
    }, 2000);
  };

  // Funções de upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        
        // Aplicar imagem ao canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
            saveToHistory('Upload de imagem');
          }
        }
        
        toast({
          title: "Imagem Carregada! 📸",
          description: "Imagem aplicada ao canvas com sucesso!",
        });
        
        addXp(20);
        vibrate('medium');
        playToolSound(SOUND_EFFECTS.SUCCESS);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Funções de som
  const playToolSound = (sound: string) => {
    setCurrentSoundEffect(sound);
    setPlaySound(true);
  };

  // Função de compra
  const handlePurchase = async () => {
    if (!pixelData) return;
    
    const basePrice = pixelData.price;
    let totalPrice = basePrice;
    let specialCreditsUsed = 0;
    
    // Calcular custos adicionais
    if (isAnimated) {
      totalPrice += 50;
      specialCreditsUsed += 20;
    }
    
    if (layers.length > 1) {
      totalPrice += (layers.length - 1) * 10;
    }
    
    if (recordingFrames.length > 0) {
      specialCreditsUsed += 15;
    }
    
    // Verificar saldo
    if (userCredits < totalPrice) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${totalPrice} créditos para esta compra.`,
        variant: "destructive"
      });
      return;
    }
    
    if (specialCreditsUsed > 0 && userSpecialCredits < specialCreditsUsed) {
      toast({
        title: "Créditos Especiais Insuficientes",
        description: `Precisa de ${specialCreditsUsed} créditos especiais.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage('Processando compra...');
    
    try {
      const canvas = canvasRef.current;
      const artworkData = canvas?.toDataURL('image/png');
      
      const customizations = {
        title: pixelTitle,
        description: pixelDescription,
        link: pixelLink,
        color: selectedColor,
        artwork: artworkData,
        isAnimated,
        layers: layers.length,
        timelapse: recordingFrames.length > 0 ? recordingFrames : undefined
      };
      
      const success = await onPurchase(pixelData, 'credits', customizations);
      
      if (success) {
        setShowConfetti(true);
        addXp(100);
        
        toast({
          title: "Pixel Adquirido! 🎉",
          description: `Obra de arte criada e pixel comprado por €${totalPrice}!`,
        });
        
        vibrate('success');
        playToolSound(SOUND_EFFECTS.PURCHASE);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro na Compra",
        description: "Não foi possível completar a compra.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = pixelData?.color || '#D4A757';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    saveToHistory('Canvas limpo');
    
    toast({
      title: "Canvas Limpo! 🧹",
      description: "Canvas restaurado ao estado inicial.",
    });
    
    vibrate('light');
    playToolSound(SOUND_EFFECTS.CLICK);
  };

  if (!pixelData) return null;

  const totalPrice = pixelData.price + (isAnimated ? 50 : 0) + (layers.length - 1) * 10;
  const specialCreditsNeeded = (isAnimated ? 20 : 0) + (recordingFrames.length > 0 ? 15 : 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect 
        src={currentSoundEffect} 
        play={playSound} 
        onEnd={() => setPlaySound(false)} 
      />
      <Confetti 
        active={showConfetti} 
        duration={3000} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <DialogContent className="max-w-7xl h-[95vh] p-0 gap-0 bg-background/98 backdrop-blur-md">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Brush className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-headline text-gradient-gold">
                  Estúdio de Arte Digital
                </DialogTitle>
                <p className="text-muted-foreground">
                  Pixel ({pixelData.x}, {pixelData.y}) • {pixelData.region} • {pixelData.rarity}
                </p>
              </div>
            </div>
            
            {/* Barra de ferramentas superior */}
            <div className="flex items-center gap-2">
              {isRecording && (
                <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-mono">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                  <Badge className="bg-red-500 text-white text-xs">
                    {recordingFrames.length} frames
                  </Badge>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? 'bg-red-500/20 border-red-500/50' : ''}
              >
                {isRecording ? <Pause className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                {isRecording ? 'Parar' : 'Gravar'}
              </Button>
              
              <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                <Undo className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Área principal do canvas */}
          <div className="flex-1 flex flex-col">
            {/* Canvas com controles */}
            <div className="flex-1 flex items-center justify-center p-6 bg-muted/5">
              <div className="relative">
                {/* Controles de zoom */}
                <div className="absolute -top-12 right-0 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCanvasZoom(Math.max(50, canvasZoom - 25))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-mono w-12 text-center">{canvasZoom}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCanvasZoom(Math.min(500, canvasZoom + 25))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Canvas principal */}
                <div 
                  className="relative border-4 border-primary/30 rounded-lg overflow-hidden shadow-2xl"
                  style={{ 
                    width: `${CANVAS_SIZE * (canvasZoom / 100)}px`,
                    height: `${CANVAS_SIZE * (canvasZoom / 100)}px`
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className="w-full h-full cursor-crosshair"
                    style={{ imageRendering: 'pixelated' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                  />
                  
                  {/* Grelha sobreposta */}
                  {showGrid && (
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #000 1px, transparent 1px),
                          linear-gradient(to bottom, #000 1px, transparent 1px)
                        `,
                        backgroundSize: `${gridSize * (canvasZoom / 100)}px ${gridSize * (canvasZoom / 100)}px`
                      }}
                    />
                  )}
                  
                  {/* Indicador de simetria */}
                  {symmetryMode !== 'none' && (
                    <div className="absolute inset-0 pointer-events-none">
                      {(symmetryMode === 'horizontal' || symmetryMode === 'both') && (
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/50 transform -translate-y-0.5" />
                      )}
                      {(symmetryMode === 'vertical' || symmetryMode === 'both') && (
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/50 transform -translate-x-0.5" />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Preview do pincel */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
                  <div className="flex items-center gap-2 text-sm">
                    <div 
                      className="rounded-full border-2 border-primary"
                      style={{ 
                        width: `${Math.min(brushSize * 2, 24)}px`,
                        height: `${Math.min(brushSize * 2, 24)}px`,
                        backgroundColor: selectedColor 
                      }}
                    />
                    <span className="font-mono">{brushSize}px</span>
                    <span className="text-muted-foreground">{brushOpacity}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Barra de ferramentas inferior */}
            <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Ferramentas básicas */}
                  <div className="flex gap-1">
                    {TOOL_CATEGORIES.basic.map(tool => (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedTool(tool.id);
                          vibrate('light');
                          playToolSound(SOUND_EFFECTS.CLICK);
                        }}
                        className="relative"
                      >
                        <tool.icon className="h-4 w-4" />
                        {tool.premium && (
                          <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Paleta de cores rápida */}
                  <div className="flex gap-1">
                    {THEME_PALETTES[selectedPalette as keyof typeof THEME_PALETTES].slice(0, 6).map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                          selectedColor === color ? "border-foreground scale-110 shadow-lg" : "border-border"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          addToRecentColors(color);
                          vibrate('light');
                          playToolSound(SOUND_EFFECTS.CLICK);
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Informações de estado */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Camada: {activeLayerIndex + 1}/{layers.length}</span>
                  <span>Histórico: {historyIndex + 1}/{history.length}</span>
                  {isAnimated && <Badge className="bg-purple-500">Animado</Badge>}
                  {recordingFrames.length > 0 && <Badge className="bg-red-500">Timelapse</Badge>}
                </div>
              </div>
            </div>
          </div>

          {/* Painel lateral de ferramentas */}
          <div className="w-80 border-l bg-background/50 backdrop-blur-sm flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-4 m-2">
                <TabsTrigger value="editor" className="text-xs">
                  <Brush className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-xs">
                  <Sparkles className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="layers" className="text-xs">
                  <Layers className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="purchase" className="text-xs">
                  <ShoppingCart className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Tab Editor */}
                  <TabsContent value="editor" className="mt-0 space-y-6">
                    {/* Ferramentas */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Brush className="h-5 w-5 mr-2 text-primary" />
                          Ferramentas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(TOOL_CATEGORIES).map(([category, tools]) => (
                          <div key={category}>
                            <h4 className="text-sm font-medium mb-2 capitalize">{category}</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {tools.map(tool => (
                                <Button
                                  key={tool.id}
                                  variant={selectedTool === tool.id ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTool(tool.id);
                                    vibrate('light');
                                    playToolSound(SOUND_EFFECTS.CLICK);
                                  }}
                                  className="relative h-12 flex flex-col items-center justify-center"
                                >
                                  <tool.icon className="h-4 w-4 mb-1" />
                                  <span className="text-xs">{tool.label}</span>
                                  {tool.premium && (
                                    <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                                  )}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Configurações do pincel */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-primary" />
                          Pincel
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tipo de Pincel</Label>
                          <Select value={brushType} onValueChange={setBrushType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(BRUSH_TYPES).map(([key, brush]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <brush.icon className="h-4 w-4" />
                                    {brush.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Tamanho</Label>
                            <span className="text-sm font-mono">{brushSize}px</span>
                          </div>
                          <Slider
                            value={[brushSize]}
                            onValueChange={(value) => setBrushSize(value[0])}
                            min={1}
                            max={32}
                            step={1}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Opacidade</Label>
                            <span className="text-sm font-mono">{brushOpacity}%</span>
                          </div>
                          <Slider
                            value={[brushOpacity]}
                            onValueChange={(value) => setBrushOpacity(value[0])}
                            min={1}
                            max={100}
                            step={1}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Rotação</Label>
                            <span className="text-sm font-mono">{brushRotation}°</span>
                          </div>
                          <Slider
                            value={[brushRotation]}
                            onValueChange={(value) => setBrushRotation(value[0])}
                            min={0}
                            max={360}
                            step={15}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Espaçamento</Label>
                            <span className="text-sm font-mono">{brushSpacing}%</span>
                          </div>
                          <Slider
                            value={[brushSpacing]}
                            onValueChange={(value) => setBrushSpacing(value[0])}
                            min={1}
                            max={100}
                            step={5}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Intensidade de Textura</Label>
                            <span className="text-sm font-mono">{textureIntensity}%</span>
                          </div>
                          <Slider
                            value={[textureIntensity]}
                            onValueChange={(value) => setTextureIntensity(value[0])}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Pressão Sensível</Label>
                          <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Traços Suaves</Label>
                          <Switch checked={smoothStrokes} onCheckedChange={setSmoothStrokes} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Paletas de cores */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Palette className="h-5 w-5 mr-2 text-primary" />
                          Cores
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Paleta Temática</Label>
                          <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(THEME_PALETTES).map(palette => (
                                <SelectItem key={palette} value={palette}>
                                  <span className="capitalize">{palette}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Cores da paleta atual */}
                        <div className="grid grid-cols-4 gap-2">
                          {THEME_PALETTES[selectedPalette as keyof typeof THEME_PALETTES].map(color => (
                            <button
                              key={color}
                              className={cn(
                                "w-full aspect-square rounded border-2 transition-transform hover:scale-110",
                                selectedColor === color ? "border-foreground scale-110 shadow-lg" : "border-border"
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setSelectedColor(color);
                                addToRecentColors(color);
                                vibrate('light');
                                playToolSound(SOUND_EFFECTS.CLICK);
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Cores recentes */}
                        {recentColors.length > 0 && (
                          <div>
                            <Label className="text-sm">Cores Recentes</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {recentColors.map(color => (
                                <button
                                  key={color}
                                  className="w-full aspect-square rounded border border-border hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  onClick={() => {
                                    setSelectedColor(color);
                                    vibrate('light');
                                    playToolSound(SOUND_EFFECTS.CLICK);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Seletor de cor personalizada */}
                        <div className="space-y-2">
                          <Label>Cor Personalizada</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedColor}
                              onChange={(e) => {
                                setSelectedColor(e.target.value);
                                addToRecentColors(e.target.value);
                              }}
                              className="w-16 h-10 p-1 border-2"
                            />
                            <Input
                              type="text"
                              value={selectedColor}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              className="flex-1 font-mono"
                              placeholder="#FFFFFF"
                            />
                            <Button variant="outline" size="sm" onClick={generateRandomColors}>
                              <Shuffle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Configurações avançadas */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-primary" />
                          Avançado
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Modo de Simetria</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'none', label: 'Nenhuma', icon: X },
                              { value: 'horizontal', label: 'Horizontal', icon: ArrowLeft },
                              { value: 'vertical', label: 'Vertical', icon: ArrowUp },
                              { value: 'both', label: 'Ambas', icon: Plus }
                            ].map(mode => (
                              <Button
                                key={mode.value}
                                variant={symmetryMode === mode.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  setSymmetryMode(mode.value as any);
                                  vibrate('light');
                                  playToolSound(SOUND_EFFECTS.CLICK);
                                }}
                                className="flex flex-col items-center justify-center h-12"
                              >
                                <mode.icon className="h-4 w-4 mb-1" />
                                <span className="text-xs">{mode.label}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Mostrar Grelha</Label>
                          <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                        </div>
                        
                        {showGrid && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Tamanho da Grelha</Label>
                              <span className="text-sm font-mono">{gridSize}px</span>
                            </div>
                            <Slider
                              value={[gridSize]}
                              onValueChange={(value) => setGridSize(value[0])}
                              min={4}
                              max={32}
                              step={4}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Efeitos */}
                  <TabsContent value="effects" className="mt-0 space-y-6">
                    {/* IA e Automação */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Wand2 className="h-5 w-5 mr-2 text-purple-500" />
                          IA Generativa
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { id: 'auto-enhance', label: 'Auto-Melhorar', icon: Sparkles, cost: 0 },
                          { id: 'style-transfer', label: 'Transferir Estilo', icon: Wand2, cost: 10 },
                          { id: 'color-harmony', label: 'Harmonia de Cores', icon: Palette, cost: 5 },
                          { id: 'add-details', label: 'Adicionar Detalhes', icon: Plus, cost: 15 },
                          { id: 'enhance-lighting', label: 'Melhorar Iluminação', icon: Sun, cost: 8 },
                          { id: 'add-depth', label: 'Adicionar Profundidade', icon: Layers, cost: 12 }
                        ].map(effect => (
                          <Button
                            key={effect.id}
                            variant="outline"
                            className="w-full justify-start h-12"
                            onClick={() => applyAIEffect(effect.id)}
                            disabled={isProcessing}
                          >
                            <effect.icon className="h-4 w-4 mr-3" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{effect.label}</div>
                              {effect.cost > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {effect.cost} créditos especiais
                                </div>
                              )}
                            </div>
                            {effect.cost === 0 && <Badge className="bg-green-500">Grátis</Badge>}
                          </Button>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Filtros avançados */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Filter className="h-5 w-5 mr-2 text-blue-500" />
                          Filtros
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(ADVANCED_FILTERS).map(([key, filter]) => (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              onClick={() => applyFilter(key)}
                              className="flex flex-col items-center justify-center h-16"
                            >
                              <filter.icon className="h-4 w-4 mb-1" />
                              <span className="text-xs">{filter.name}</span>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Efeitos especiais */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Gem className="h-5 w-5 mr-2 text-purple-500" />
                          Efeitos Especiais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(SPECIAL_EFFECTS).map(([key, effect]) => (
                          <Button
                            key={key}
                            variant="outline"
                            className="w-full justify-start h-12"
                            onClick={() => applySpecialEffect(key)}
                            disabled={userSpecialCredits < effect.cost}
                          >
                            <effect.icon className="h-4 w-4 mr-3" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{effect.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {effect.cost} créditos especiais
                              </div>
                            </div>
                            <Crown className="h-4 w-4 text-amber-500" />
                          </Button>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Stickers */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Smile className="h-5 w-5 mr-2 text-yellow-500" />
                          Stickers
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(STICKER_CATEGORIES).map(([category, stickers]) => (
                          <div key={category}>
                            <h4 className="text-sm font-medium mb-2 capitalize flex items-center">
                              {category === 'faces' && <Smile className="h-4 w-4 mr-2" />}
                              {category === 'hands' && <Hand className="h-4 w-4 mr-2" />}
                              {category === 'hearts' && <Heart className="h-4 w-4 mr-2" />}
                              {category === 'nature' && <Tree className="h-4 w-4 mr-2" />}
                              {category === 'weather' && <Cloud className="h-4 w-4 mr-2" />}
                              {category === 'portugal' && <Flag className="h-4 w-4 mr-2" />}
                              {category === 'gaming' && <Gamepad2 className="h-4 w-4 mr-2" />}
                              {category === 'tech' && <Laptop className="h-4 w-4 mr-2" />}
                              {category === 'symbols' && <Star className="h-4 w-4 mr-2" />}
                              {category === 'animals' && <Cat className="h-4 w-4 mr-2" />}
                              {category}
                            </h4>
                            <div className="grid grid-cols-8 gap-1">
                              {stickers.map(sticker => (
                                <button
                                  key={sticker}
                                  className="aspect-square text-lg hover:scale-125 transition-transform bg-muted/20 rounded border hover:bg-muted/40"
                                  onClick={() => {
                                    // Adicionar sticker ao canvas
                                    const canvas = canvasRef.current;
                                    if (canvas) {
                                      const ctx = canvas.getContext('2d');
                                      if (ctx) {
                                        ctx.font = '24px Arial';
                                        ctx.fillText(sticker, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
                                        saveToHistory(`Sticker: ${sticker}`);
                                      }
                                    }
                                    
                                    vibrate('light');
                                    playToolSound(SOUND_EFFECTS.CLICK);
                                    
                                    toast({
                                      title: "Sticker Adicionado! 🎉",
                                      description: `${sticker} adicionado ao canvas!`,
                                    });
                                  }}
                                >
                                  {sticker}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Camadas */}
                  <TabsContent value="layers" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Layers className="h-5 w-5 mr-2 text-primary" />
                          Camadas ({layers.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          onClick={() => createNewLayer(`Camada ${layers.length + 1}`)}
                          className="w-full"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Camada
                        </Button>
                        
                        <div className="space-y-2">
                          {layers.map((layer, index) => (
                            <Card key={layer.id} className={cn(
                              "p-3 transition-all",
                              activeLayerIndex === index && "border-primary bg-primary/5"
                            )}>
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleLayerVisibility(index)}
                                >
                                  {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                                
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{layer.name}</div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span>Opacidade</span>
                                      <span>{layer.opacity}%</span>
                                    </div>
                                    <Slider
                                      value={[layer.opacity]}
                                      onValueChange={(value) => updateLayerOpacity(index, value[0])}
                                      min={0}
                                      max={100}
                                      step={5}
                                      className="h-1"
                                    />
                                  </div>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteLayer(index)}
                                  disabled={layers.length <= 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Animação */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Play className="h-5 w-5 mr-2 text-green-500" />
                          Animação
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Pixel Animado</Label>
                          <Switch 
                            checked={isAnimated} 
                            onCheckedChange={(checked) => {
                              setIsAnimated(checked);
                              if (checked) {
                                toast({
                                  title: "Animação Ativada! 🎬",
                                  description: "Seu pixel agora pode ter múltiplos frames!",
                                });
                                addXp(25);
                                vibrate('medium');
                                playToolSound(SOUND_EFFECTS.SUCCESS);
                              }
                            }}
                          />
                        </div>
                        
                        {isAnimated && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label>Velocidade</Label>
                                <span className="text-sm font-mono">{animationSpeed}ms</span>
                              </div>
                              <Slider
                                value={[animationSpeed]}
                                onValueChange={(value) => setAnimationSpeed(value[0])}
                                min={100}
                                max={2000}
                                step={100}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Plus className="h-4 w-4 mr-2" />
                                Frame
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Play className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                            
                            <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                              <div className="flex items-center gap-2 text-amber-600">
                                <Crown className="h-4 w-4" />
                                <span className="text-sm font-medium">Funcionalidade Premium</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Pixels animados custam +€50 e 20 créditos especiais
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Compra */}
                  <TabsContent value="purchase" className="mt-0 space-y-6">
                    {/* Personalização */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Edit3 className="h-5 w-5 mr-2 text-primary" />
                          Personalização
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pixel-title">Título da Obra</Label>
                          <Input
                            id="pixel-title"
                            placeholder="Ex: Pôr do Sol em Lisboa"
                            value={pixelTitle}
                            onChange={(e) => setPixelTitle(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pixel-description">Descrição</Label>
                          <Textarea
                            id="pixel-description"
                            placeholder="Conte a história por trás da sua criação..."
                            value={pixelDescription}
                            onChange={(e) => setPixelDescription(e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pixel-link">Link (opcional)</Label>
                          <Input
                            id="pixel-link"
                            placeholder="https://seu-portfolio.com"
                            value={pixelLink}
                            onChange={(e) => setPixelLink(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Upload de Imagem Base</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1"
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
                          </div>
                          
                          {uploadedImage && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Brilho</Label>
                                  <Slider
                                    value={[imageFilters.brightness]}
                                    onValueChange={(value) => setImageFilters(prev => ({ ...prev, brightness: value[0] }))}
                                    min={50}
                                    max={150}
                                    step={5}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Contraste</Label>
                                  <Slider
                                    value={[imageFilters.contrast]}
                                    onValueChange={(value) => setImageFilters(prev => ({ ...prev, contrast: value[0] }))}
                                    min={50}
                                    max={150}
                                    step={5}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Resumo da compra */}
                    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                          Resumo da Compra
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Pixel base ({pixelData.rarity})</span>
                            <span className="font-mono">€{pixelData.price}</span>
                          </div>
                          
                          {isAnimated && (
                            <div className="flex justify-between text-purple-500">
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                Animação
                              </span>
                              <span className="font-mono">€50</span>
                            </div>
                          )}
                          
                          {layers.length > 1 && (
                            <div className="flex justify-between text-blue-500">
                              <span className="flex items-center gap-1">
                                <Layers className="h-3 w-3" />
                                Camadas extras ({layers.length - 1})
                              </span>
                              <span className="font-mono">€{(layers.length - 1) * 10}</span>
                            </div>
                          )}
                          
                          {recordingFrames.length > 0 && (
                            <div className="flex justify-between text-red-500">
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                Timelapse ({recordingFrames.length} frames)
                              </span>
                              <span className="font-mono">15 especiais</span>
                            </div>
                          )}
                          
                          <Separator />
                          
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <div className="text-right">
                              <div className="text-primary">€{totalPrice}</div>
                              {specialCreditsNeeded > 0 && (
                                <div className="text-accent text-sm">
                                  + {specialCreditsNeeded} especiais
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Saldo atual */}
                        <div className="bg-background/50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Seus Créditos</span>
                            <span className="font-mono text-primary">{userCredits.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Créditos Especiais</span>
                            <span className="font-mono text-accent">{userSpecialCredits.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Botão de compra */}
                        <Button
                          onClick={handlePurchase}
                          disabled={isProcessing || userCredits < totalPrice || (specialCreditsNeeded > 0 && userSpecialCredits < specialCreditsNeeded)}
                          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg font-semibold"
                        >
                          {isProcessing ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              {processingMessage}
                            </div>
                          ) : (
                            <>
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Comprar e Criar Obra
                            </>
                          )}
                        </Button>
                        
                        {(userCredits < totalPrice || (specialCreditsNeeded > 0 && userSpecialCredits < specialCreditsNeeded)) && (
                          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                            <div className="flex items-center gap-2 text-red-500">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">Saldo Insuficiente</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Precisa de mais {totalPrice - userCredits > 0 ? `${totalPrice - userCredits} créditos` : ''}
                              {specialCreditsNeeded > userSpecialCredits ? ` e ${specialCreditsNeeded - userSpecialCredits} créditos especiais` : ''}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>

        {/* Overlay de processamento */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <Card className="p-6 shadow-2xl border-primary/30">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Wand2 className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{processingMessage}</h3>
                    <p className="text-muted-foreground">IA a trabalhar na sua obra...</p>
                  </div>
                  
                  <div className="w-64">
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {processingProgress}% concluído
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}