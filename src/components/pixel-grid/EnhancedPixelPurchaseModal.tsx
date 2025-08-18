'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
import { useUserStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { motion, AnimatePresence } from 'framer-motion';
import { Brush, Eraser, PaintBucket, Pipette, Move, Circle, Square, Triangle, Type, Upload, Undo, Redo, Layers, Settings, Palette, Sparkles, Crown, Gift, Coins, ShoppingCart, Wand2, Filter, RotateCcw, Contrast, Eye, EyeOff, Grid3X3, Shuffle, Save, Download, Share2, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Zap, Star, Heart, Smile, Sun, Moon, Droplets, Flame, Snowflake, Leaf, Music, Camera, Mic, Headphones, Radio, X, Plus, Minus, MoreHorizontal, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, AlertTriangle, Info, HelpCircle, Maximize2, Minimize2, RotateCw, FlipHorizontal, FlipVertical, Copy, Scissors, Clipboard, Trash2, RefreshCw, ZoomIn, ZoomOut, Target, Crosshair, Paintbrush2, PenTool, Highlighter, Stamp, Sticker, Hash, AtSign, Percent, DollarSign, Euro, KeyRound as Pound, Pen as Yen, Bitcoin, Gem, Diamond, Hexagon, Octagon, Pentagon, MapPin, Globe, Compass, Navigation, Anchor, Plane, Car, Train, Ship, Home, Building, Castle, Church, Mountain, Trees as Tree, Flower, Bug, Fish, Bird, Cat, Dog, Rabbit, Bean as Bear, Option as Lion, ChartGantt as Elephant, Scale as Whale, Rocket, Satellite, Atom, Dna, Microscope, Telescope, Beaker, Pill, Syringe, Thermometer, Stethoscope, Bandage, Shield, Sword, Bot as Bow, Axe, Hammer, Wrench, HardDrive as Screwdriver, Drill, Save as Saw, Key, Lock, Unlock, Leaf as Safe, Vault, Trash as Treasure, Crown as CrownIcon, Medal, Trophy, Award, Ribbon, Flag, Bell, AlarmPlus as Alarm, Clock, Calendar, Watch, Timer, Watch as Stopwatch, Hourglass, Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Rainbow, Umbrella, Glasses, Cat as Hat, Shirt, Trees as Dress, Shovel as Shoe, Ban as Bag, BellRing as Ring, Slack as Necklace, Watch as WatchIcon, Headphones as Earphones, Smartphone, Laptop, LampDesk as Desktop, Tablet, Keyboard, Mouse, Printer, Scan as Scanner, Webcam, Gamepad2, Joystick, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Spade, Club, Diamond as DiamondIcon, Heart as HeartIcon, Pizza, Coffee, Wine, Beer, Cake, Cookie, Apple, Banana, Cherry, Grape, Tangent as Orange, Cherry as Strawberry, GlassWaterIcon as Watermelon, Carrot, Popcorn as Corn, Heading as Bread, UserCheck as Cheese, Egg, Fish as FishIcon, Wheat as Meat, Milk, Bone as Honey, Salad as Salt, CaseUpper as Pepper, PhilippinePeso as Chili, Slice as Garlic, Option as Onion, Rotate3D as Potato, Atom as Tomato, LetterText as Lettuce } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface CanvasState {
  imageData: ImageData | null;
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    opacity: number;
    imageData: ImageData | null;
  }>;
  activeLayerIndex: number;
}

interface AnimationFrame {
  id: string;
  name: string;
  imageData: ImageData;
  duration: number;
}

// Ferramentas organizadas por categoria
const toolCategories = {
  basic: {
    name: 'Básico',
    icon: <Brush className="h-4 w-4" />,
    tools: [
      { id: 'brush', name: 'Pincel', icon: <Brush className="h-5 w-5" />, premium: false },
      { id: 'eraser', name: 'Borracha', icon: <Eraser className="h-5 w-5" />, premium: false },
      { id: 'bucket', name: 'Balde', icon: <PaintBucket className="h-5 w-5" />, premium: false },
      { id: 'eyedropper', name: 'Conta-gotas', icon: <Pipette className="h-5 w-5" />, premium: false },
    ]
  },
  shapes: {
    name: 'Formas',
    icon: <Square className="h-4 w-4" />,
    tools: [
      { id: 'line', name: 'Linha', icon: <Minus className="h-5 w-5" />, premium: false },
      { id: 'rectangle', name: 'Retângulo', icon: <Square className="h-5 w-5" />, premium: false },
      { id: 'circle', name: 'Círculo', icon: <Circle className="h-5 w-5" />, premium: false },
      { id: 'triangle', name: 'Triângulo', icon: <Triangle className="h-5 w-5" />, premium: true },
      { id: 'star', name: 'Estrela', icon: <Star className="h-5 w-5" />, premium: true },
      { id: 'heart', name: 'Coração', icon: <Heart className="h-5 w-5" />, premium: true },
    ]
  },
  advanced: {
    name: 'Avançado',
    icon: <Wand2 className="h-4 w-4" />,
    tools: [
      { id: 'blur', name: 'Desfoque', icon: <Eye className="h-5 w-5" />, premium: true },
      { id: 'sharpen', name: 'Nitidez', icon: <Zap className="h-5 w-5" />, premium: true },
      { id: 'smudge', name: 'Borrar', icon: <Move className="h-5 w-5" />, premium: true },
      { id: 'clone', name: 'Clonar', icon: <Copy className="h-5 w-5" />, premium: true },
    ]
  },
  text: {
    name: 'Texto',
    icon: <Type className="h-4 w-4" />,
    tools: [
      { id: 'text', name: 'Texto', icon: <Type className="h-5 w-5" />, premium: false },
      { id: 'emoji', name: 'Emoji', icon: <Smile className="h-5 w-5" />, premium: false },
    ]
  }
};

// Paletas de cores temáticas
const colorPalettes = {
  portugal: {
    name: 'Portugal',
    colors: ['#D4A757', '#7DF9FF', '#228B22', '#DC143C', '#FFD700', '#4169E1', '#8B4513', '#2F4F4F']
  },
  cyberpunk: {
    name: 'Cyberpunk',
    colors: ['#FF0080', '#00FFFF', '#8000FF', '#FF8000', '#80FF00', '#0080FF', '#FF0040', '#40FF80']
  },
  vintage: {
    name: 'Vintage',
    colors: ['#8B4513', '#DEB887', '#F4A460', '#CD853F', '#D2691E', '#A0522D', '#BC8F8F', '#F5DEB3']
  },
  ocean: {
    name: 'Oceano',
    colors: ['#006994', '#0099CC', '#66CCFF', '#99E6FF', '#CCF2FF', '#E6F9FF', '#B3E0FF', '#80D4FF']
  },
  sunset: {
    name: 'Pôr do Sol',
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42', '#FF6B6B', '#FF8E53', '#FFA726', '#FFB74D']
  },
  forest: {
    name: 'Floresta',
    colors: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F', '#00FA9A', '#7CFC00', '#ADFF2F']
  },
  neon: {
    name: 'Neon',
    colors: ['#FF073A', '#39FF14', '#FF073A', '#FFFF33', '#FF6600', '#9D00FF', '#00FFFF', '#FF1493']
  },
  pastel: {
    name: 'Pastel',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E1BAFF', '#FFBAE1', '#C9FFBA']
  }
};

// Stickers organizados por categoria
const stickerCategories = {
  faces: {
    name: 'Faces',
    icon: <Smile className="h-4 w-4" />,
    stickers: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰']
  },
  nature: {
    name: 'Natureza',
    icon: <Leaf className="h-4 w-4" />,
    stickers: ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌾', '🌻', '🌺', '🌸', '🌼', '🌷', '🥀', '🌹', '🏵️']
  },
  animals: {
    name: 'Animais',
    icon: <Cat className="h-4 w-4" />,
    stickers: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔']
  },
  portugal: {
    name: 'Portugal',
    icon: <Crown className="h-4 w-4" />,
    stickers: ['🇵🇹', '🏰', '⚓', '🚢', '🐟', '🍷', '🥖', '🧀', '🌊', '🏔️', '🌅', '🎭', '🎨', '🎪', '🎡', '🎢']
  },
  symbols: {
    name: 'Símbolos',
    icon: <Star className="h-4 w-4" />,
    stickers: ['⭐', '✨', '💫', '🌟', '💥', '💢', '💯', '🔥', '❄️', '⚡', '🌈', '☀️', '🌙', '⭐', '🎯', '🎪']
  },
  objects: {
    name: 'Objetos',
    icon: <Gift className="h-4 w-4" />,
    stickers: ['🎁', '🎈', '🎉', '🎊', '🎀', '🎗️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '👑', '💎', '💍', '📱']
  }
};

// Efeitos especiais
const specialEffects = [
  { id: 'glow', name: 'Brilho', icon: <Sparkles className="h-4 w-4" />, premium: true },
  { id: 'shadow', name: 'Sombra', icon: <Circle className="h-4 w-4" />, premium: true },
  { id: 'neon', name: 'Neon', icon: <Zap className="h-4 w-4" />, premium: true },
  { id: 'hologram', name: 'Holograma', icon: <Eye className="h-4 w-4" />, premium: true },
  { id: 'glitch', name: 'Glitch', icon: <Shuffle className="h-4 w-4" />, premium: true },
  { id: 'vintage', name: 'Vintage', icon: <RotateCcw className="h-4 w-4" />, premium: true },
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
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [selectedPalette, setSelectedPalette] = useState('portugal');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Estados do canvas e camadas
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [layers, setLayers] = useState([
    { id: '1', name: 'Camada 1', visible: true, opacity: 100 }
  ]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [canvasZoom, setCanvasZoom] = useState(100);
  
  // Estados de personalização
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelLink, setPixelLink] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Estados de animação
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFrames, setRecordingFrames] = useState<string[]>([]);
  
  // Estados de interface
  const [activeTab, setActiveTab] = useState('draw');
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Estados de cores
  const [colorHistory, setColorHistory] = useState<string[]>(['#D4A757', '#7DF9FF', '#FF6B6B', '#4CAF50']);
  const [customColors, setCustomColors] = useState<string[]>([]);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const { addCredits, addXp, removeCredits, removeSpecialCredits } = useUserStore();
  const { vibrate } = useHapticFeedback();
  
  // Estados de som e confetti
  const [playDrawSound, setPlayDrawSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Inicialização do canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Canvas de 64x64 pixels para arte detalhada
        canvas.width = 64;
        canvas.height = 64;
        
        // Fundo transparente
        ctx.clearRect(0, 0, 64, 64);
        
        // Salvar estado inicial
        const initialState = ctx.getImageData(0, 0, 64, 64);
        setCanvasHistory([initialState]);
        setHistoryIndex(0);
      }
    }
  }, [isOpen]);

  // Função de desenho principal
  const draw = useCallback((x: number, y: number, isStart: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = Math.floor(x * scaleX);
    const canvasY = Math.floor(y * scaleY);

    ctx.globalAlpha = brushOpacity / 100;
    ctx.fillStyle = selectedColor;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (selectedTool) {
      case 'brush':
        if (isStart || !lastPoint) {
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, brushSize / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(canvasX, canvasY);
          ctx.stroke();
        }
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, brushSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        break;
        
      case 'bucket':
        floodFill(ctx, canvasX, canvasY, selectedColor);
        break;
        
      case 'eyedropper':
        const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        const data = imageData.data;
        const pickedColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        setSelectedColor(pickedColor);
        addToColorHistory(pickedColor);
        break;
        
      case 'circle':
        if (isStart) {
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, brushSize * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      case 'rectangle':
        if (isStart) {
          const size = brushSize * 3;
          ctx.strokeRect(canvasX - size/2, canvasY - size/2, size, size);
        }
        break;
    }

    // Aplicar simetria
    if (symmetryMode !== 'none') {
      applySymmetry(ctx, canvasX, canvasY);
    }

    setLastPoint({ x: canvasX, y: canvasY });
    
    // Feedback háptico
    vibrate('light');
    
    // Som de desenho
    if (Math.random() > 0.8) {
      setPlayDrawSound(true);
    }
  }, [selectedTool, selectedColor, brushSize, brushOpacity, lastPoint, symmetryMode, vibrate]);

  // Função de flood fill (balde de tinta)
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];
    
    // Converter cor para RGB
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.fillStyle = fillColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const fillData = tempCtx.getImageData(0, 0, 1, 1).data;
    
    const fillR = fillData[0];
    const fillG = fillData[1];
    const fillB = fillData[2];
    const fillA = 255;
    
    if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) {
      return; // Mesma cor
    }
    
    const stack = [[startX, startY]];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const pos = (y * width + x) * 4;
      
      if (data[pos] === startR && data[pos + 1] === startG && 
          data[pos + 2] === startB && data[pos + 3] === startA) {
        
        data[pos] = fillR;
        data[pos + 1] = fillG;
        data[pos + 2] = fillB;
        data[pos + 3] = fillA;
        
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Aplicar simetria
  const applySymmetry = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
      const mirrorX = centerX * 2 - x;
      ctx.beginPath();
      ctx.arc(mirrorX, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (symmetryMode === 'vertical' || symmetryMode === 'both') {
      const mirrorY = centerY * 2 - y;
      ctx.beginPath();
      ctx.arc(x, mirrorY, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (symmetryMode === 'both') {
      const mirrorX = centerX * 2 - x;
      const mirrorY = centerY * 2 - y;
      ctx.beginPath();
      ctx.arc(mirrorX, mirrorY, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Adicionar cor ao histórico
  const addToColorHistory = (color: string) => {
    setColorHistory(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 8);
    });
  };

  // Salvar estado no histórico
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setCanvasHistory(newHistory);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex - 1;
      ctx.putImageData(canvasHistory[newIndex], 0, 0);
      setHistoryIndex(newIndex);
      
      vibrate('light');
      toast({
        title: "↶ Undo",
        description: "Ação desfeita com sucesso.",
      });
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex + 1;
      ctx.putImageData(canvasHistory[newIndex], 0, 0);
      setHistoryIndex(newIndex);
      
      vibrate('light');
      toast({
        title: "↷ Redo",
        description: "Ação refeita com sucesso.",
      });
    }
  };

  // Aplicar efeito especial
  const applyEffect = async (effectId: string) => {
    setIsProcessing(true);
    setProcessingMessage(`Aplicando efeito ${effectId}...`);
    
    vibrate('medium');
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    // Aplicar efeito baseado no ID
    switch (effectId) {
      case 'glow':
        ctx.shadowColor = selectedColor;
        ctx.shadowBlur = 10;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = selectedColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';
        break;
        
      case 'vintage':
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2); // Mais vermelho
          data[i + 1] = Math.min(255, data[i + 1] * 0.9); // Menos verde
          data[i + 2] = Math.min(255, data[i + 2] * 0.7); // Menos azul
        }
        ctx.putImageData(imageData, 0, 0);
        break;
        
      case 'neon':
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        break;
    }
    
    setIsProcessing(false);
    setProcessingMessage('');
    
    addXp(25);
    addCredits(10);
    
    toast({
      title: "✨ Efeito Aplicado!",
      description: `Efeito ${effectId} aplicado com sucesso. +25 XP!`,
    });
  };

  // Aplicar filtro
  const applyFilter = async (filterName: string) => {
    setIsProcessing(true);
    setProcessingMessage(`Aplicando filtro ${filterName}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    // Aplicar filtro CSS
    switch (filterName) {
      case 'vintage':
        canvas.style.filter = 'sepia(0.8) contrast(1.2) brightness(0.9)';
        break;
      case 'cyberpunk':
        canvas.style.filter = 'hue-rotate(180deg) saturate(2) contrast(1.5)';
        break;
      case 'dreamy':
        canvas.style.filter = 'blur(0.5px) brightness(1.2) saturate(1.3)';
        break;
      default:
        canvas.style.filter = 'none';
    }
    
    setIsProcessing(false);
    setProcessingMessage('');
    
    toast({
      title: "🎨 Filtro Aplicado!",
      description: `Filtro ${filterName} aplicado com sucesso.`,
    });
  };

  // Adicionar sticker
  const addSticker = (sticker: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    // Desenhar emoji/sticker no centro
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(sticker, canvas.width / 2, canvas.height / 2);
    
    vibrate('medium');
    
    toast({
      title: "🎭 Sticker Adicionado!",
      description: `${sticker} adicionado ao seu pixel.`,
    });
  };

  // Upload de imagem
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
      const result = e.target?.result as string;
      setUploadedImage(result);
      
      // Aplicar ao canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        saveToHistory();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        toast({
          title: "📸 Imagem Carregada!",
          description: "Imagem aplicada como base do pixel.",
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Limpar canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    vibrate('medium');
    
    toast({
      title: "🗑️ Canvas Limpo",
      description: "Canvas foi limpo com sucesso.",
    });
  };

  // Gerar cores aleatórias
  const generateRandomColors = () => {
    const newColors = Array.from({ length: 8 }, () => 
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
    setCustomColors(newColors);
    
    vibrate('light');
    
    toast({
      title: "🎲 Cores Aleatórias",
      description: "Nova paleta gerada com sucesso!",
    });
  };

  // Aplicar IA
  const applyAI = async (type: string) => {
    setIsProcessing(true);
    setProcessingMessage(`IA processando ${type}...`);
    
    vibrate('heavy');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    saveToHistory();
    
    // Simular melhoramento IA
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) { // Se não for transparente
        data[i] = Math.min(255, data[i] * 1.1); // Melhorar vermelho
        data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Melhorar verde
        data[i + 2] = Math.min(255, data[i + 2] * 1.15); // Melhorar azul
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    setIsProcessing(false);
    setProcessingMessage('');
    
    addXp(50);
    addCredits(25);
    setShowConfetti(true);
    
    toast({
      title: "🤖 IA Concluída!",
      description: `${type} aplicado com sucesso. +50 XP!`,
    });
  };

  // Calcular preço total
  const calculateTotalPrice = () => {
    if (!pixelData) return 0;
    
    let total = pixelData.price;
    
    // Adicionar custo de efeitos premium
    selectedEffects.forEach(effect => {
      const effectData = specialEffects.find(e => e.id === effect);
      if (effectData?.premium) {
        total += 5;
      }
    });
    
    // Adicionar custo de animação
    if (isAnimated) {
      total += 10;
    }
    
    return total;
  };

  // Finalizar compra
  const handlePurchase = async () => {
    if (!pixelData) return;
    
    const totalPrice = calculateTotalPrice();
    
    if (userCredits < totalPrice) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${totalPrice - userCredits} créditos adicionais.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage('Processando compra...');
    
    // Capturar canvas como imagem
    const canvas = canvasRef.current;
    let canvasDataUrl = '';
    if (canvas) {
      canvasDataUrl = canvas.toDataURL('image/png');
    }
    
    const customizations = {
      title: pixelTitle || `Pixel Único (${pixelData.x}, ${pixelData.y})`,
      description: pixelDescription,
      link: pixelLink,
      color: selectedColor,
      effects: selectedEffects,
      image: canvasDataUrl,
      isAnimated,
      animationFrames: recordingFrames
    };
    
    try {
      const success = await onPurchase(pixelData, 'credits', customizations);
      
      if (success) {
        removeCredits(totalPrice);
        addXp(100);
        setShowConfetti(true);
        
        toast({
          title: "🎉 Pixel Comprado!",
          description: `Pixel (${pixelData.x}, ${pixelData.y}) é agora seu! +100 XP!`,
        });
        
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro na Compra",
        description: "Não foi possível completar a compra.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  // Event handlers para desenho
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    draw(x, y, true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    draw(x, y, false);
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveToHistory();
    }
  };

  if (!pixelData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.CLICK} play={playDrawSound} onEnd={() => setPlayDrawSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="w-[95vw] h-[92vh] max-w-none max-h-none m-0 p-0 rounded-2xl border-2 border-primary/30 bg-background/98 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header Mobile */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Pixel ({pixelData.x}, {pixelData.y})
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{pixelData.region}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">
                €{calculateTotalPrice()}
              </Badge>
              <Button
                onClick={handlePurchase}
                disabled={isProcessing || userCredits < calculateTotalPrice()}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>A processar...</span>
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Barra de Ferramentas Superior */}
          <div className="flex items-center justify-between p-2 border-b bg-card/50">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTool === 'brush' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSelectedTool('brush')}
                className="h-10 w-10"
              >
                <Brush className="h-5 w-5" />
              </Button>
              <Button
                variant={selectedTool === 'eraser' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSelectedTool('eraser')}
                className="h-10 w-10"
              >
                <Eraser className="h-5 w-5" />
              </Button>
              <Button
                variant={selectedTool === 'bucket' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSelectedTool('bucket')}
                className="h-10 w-10"
              >
                <PaintBucket className="h-5 w-5" />
              </Button>
              <Button
                variant={selectedTool === 'eyedropper' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setSelectedTool('eyedropper')}
                className="h-10 w-10"
              >
                <Pipette className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="h-10 w-10"
              >
                <Undo className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRedo}
                disabled={historyIndex >= canvasHistory.length - 1}
                className="h-10 w-10"
              >
                <Redo className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={clearCanvas}
                className="h-10 w-10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Canvas Principal */}
          <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-primary/50 rounded-lg shadow-2xl bg-white cursor-crosshair touch-none"
                style={{
                  width: '280px',
                  height: '280px',
                  imageRendering: 'pixelated',
                  transform: `scale(${canvasZoom / 100})`,
                  transformOrigin: 'center'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
              
              {/* Overlay de grelha */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none border-2 border-primary/50 rounded-lg"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(212, 167, 87, 0.3) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(212, 167, 87, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: `${280/gridSize}px ${280/gridSize}px`,
                    transform: `scale(${canvasZoom / 100})`,
                    transformOrigin: 'center'
                  }}
                />
              )}
              
              {/* Indicador de simetria */}
              {symmetryMode !== 'none' && (
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/50 rounded-lg">
                  {(symmetryMode === 'horizontal' || symmetryMode === 'both') && (
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent/60 transform -translate-y-0.5" />
                  )}
                  {(symmetryMode === 'vertical' || symmetryMode === 'both') && (
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/60 transform -translate-x-0.5" />
                  )}
                </div>
              )}
              
              {/* Controles de zoom */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCanvasZoom(Math.max(50, canvasZoom - 25))}
                  className="h-8 w-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-mono min-w-[60px] text-center">
                  {canvasZoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCanvasZoom(Math.min(500, canvasZoom + 25))}
                  className="h-8 w-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Controles de Pincel */}
          <div className="p-4 border-t bg-card/50">
            <div className="space-y-4">
              {/* Cor Selecionada */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full border-4 border-primary shadow-lg"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex-1">
                  <Label className="text-sm font-medium">Cor Ativa</Label>
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      addToColorHistory(e.target.value);
                    }}
                    className="w-full h-8 p-0 border-0 bg-transparent"
                  />
                </div>
              </div>
              
              {/* Tamanho e Opacidade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tamanho: {brushSize}px</Label>
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
                  <Label className="text-sm font-medium">Opacidade: {brushOpacity}%</Label>
                  <Slider
                    value={[brushOpacity]}
                    onValueChange={(value) => setBrushOpacity(value[0])}
                    min={10}
                    max={100}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de Ferramentas */}
          <div className="border-t">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12 bg-card/50">
                <TabsTrigger value="colors" className="flex flex-col gap-1 h-full">
                  <Palette className="h-4 w-4" />
                  <span className="text-xs">Cores</span>
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex flex-col gap-1 h-full">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs">Efeitos</span>
                </TabsTrigger>
                <TabsTrigger value="stickers" className="flex flex-col gap-1 h-full">
                  <Smile className="h-4 w-4" />
                  <span className="text-xs">Stickers</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex flex-col gap-1 h-full">
                  <Wand2 className="h-4 w-4" />
                  <span className="text-xs">IA</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col gap-1 h-full">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Config</span>
                </TabsTrigger>
              </TabsList>

              {/* Paletas de Cores */}
              <TabsContent value="colors" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {/* Histórico de Cores */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Cores Recentes</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {colorHistory.map((color, index) => (
                        <button
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setSelectedColor(color);
                            vibrate('light');
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Paletas Temáticas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Paletas Temáticas</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateRandomColors}
                        className="h-8"
                      >
                        <Shuffle className="h-4 w-4 mr-1" />
                        Aleatório
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(colorPalettes).map(([key, palette]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{palette.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPalette(key)}
                              className="h-6 text-xs"
                            >
                              Usar
                            </Button>
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                            {palette.colors.map((color, index) => (
                              <button
                                key={index}
                                className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setSelectedColor(color);
                                  addToColorHistory(color);
                                  vibrate('light');
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Efeitos Especiais */}
              <TabsContent value="effects" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Efeitos Especiais</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {specialEffects.map((effect) => (
                        <Button
                          key={effect.id}
                          variant="outline"
                          onClick={() => applyEffect(effect.id)}
                          disabled={isProcessing}
                          className="h-16 flex flex-col gap-1 relative"
                        >
                          {effect.icon}
                          <span className="text-xs">{effect.name}</span>
                          {effect.premium && (
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-amber-500">
                              <Crown className="h-3 w-3" />
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Filtros Rápidos */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Filtros Rápidos</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Vintage', 'Cyberpunk', 'Dreamy', 'Dramatic', 'Soft', 'Vibrant'].map((filter) => (
                        <Button
                          key={filter}
                          variant="outline"
                          size="sm"
                          onClick={() => applyFilter(filter.toLowerCase())}
                          disabled={isProcessing}
                          className="h-12 text-xs"
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Stickers */}
              <TabsContent value="stickers" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {Object.entries(stickerCategories).map(([key, category]) => (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-2">
                        {category.icon}
                        <Label className="text-sm font-medium">{category.name}</Label>
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {category.stickers.map((sticker, index) => (
                          <button
                            key={index}
                            className="w-8 h-8 text-lg hover:scale-125 transition-transform bg-muted/30 rounded border hover:border-primary"
                            onClick={() => {
                              addSticker(sticker);
                              vibrate('light');
                            }}
                          >
                            {sticker}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* IA */}
              <TabsContent value="ai" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Ferramentas IA</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'enhance', name: 'Melhorar', icon: <Sparkles className="h-4 w-4" /> },
                        { id: 'style', name: 'Estilo', icon: <Wand2 className="h-4 w-4" /> },
                        { id: 'colors', name: 'Cores', icon: <Palette className="h-4 w-4" /> },
                        { id: 'details', name: 'Detalhes', icon: <Eye className="h-4 w-4" /> },
                      ].map((ai) => (
                        <Button
                          key={ai.id}
                          variant="outline"
                          onClick={() => applyAI(ai.name)}
                          disabled={isProcessing}
                          className="h-16 flex flex-col gap-1"
                        >
                          {ai.icon}
                          <span className="text-xs">{ai.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Upload de Imagem */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Upload de Imagem</Label>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-12"
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
                </div>
              </TabsContent>

              {/* Configurações */}
              <TabsContent value="settings" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {/* Personalização */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Título do Pixel</Label>
                      <Input
                        placeholder="Nome da sua obra..."
                        value={pixelTitle}
                        onChange={(e) => setPixelTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Descrição</Label>
                      <Textarea
                        placeholder="Conte a história do seu pixel..."
                        value={pixelDescription}
                        onChange={(e) => setPixelDescription(e.target.value)}
                        rows={2}
                        className="mt-1 resize-none"
                      />
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
                  
                  <Separator />
                  
                  {/* Opções Avançadas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Mostrar Grelha</Label>
                      <Switch
                        checked={showGrid}
                        onCheckedChange={setShowGrid}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Animação</Label>
                      <Switch
                        checked={isAnimated}
                        onCheckedChange={setIsAnimated}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Simetria</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {[
                          { id: 'none', name: 'Nenhuma', icon: <X className="h-4 w-4" /> },
                          { id: 'horizontal', name: 'Horizontal', icon: <Minus className="h-4 w-4" /> },
                          { id: 'vertical', name: 'Vertical', icon: <div className="w-0.5 h-4 bg-current" /> },
                          { id: 'both', name: 'Ambas', icon: <Plus className="h-4 w-4" /> },
                        ].map((mode) => (
                          <Button
                            key={mode.id}
                            variant={symmetryMode === mode.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSymmetryMode(mode.id as any)}
                            className="h-10 flex flex-col gap-1"
                          >
                            {mode.icon}
                            <span className="text-xs">{mode.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Resumo de Compra */}
          <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Preço Base</span>
                <span className="font-mono">€{pixelData.price}</span>
              </div>
              
              {selectedEffects.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efeitos Premium</span>
                  <span className="font-mono">€{selectedEffects.length * 5}</span>
                </div>
              )}
              
              {isAnimated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Animação</span>
                  <span className="font-mono">€10</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">€{calculateTotalPrice()}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Seus Créditos</span>
                <span className={userCredits >= calculateTotalPrice() ? 'text-green-500' : 'text-red-500'}>
                  €{userCredits}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay de Processamento */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="p-6 max-w-sm mx-4">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="font-semibold mb-2">A Processar...</h3>
                    <p className="text-sm text-muted-foreground">{processingMessage}</p>
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