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
import { Palette, Brush, Eraser, PaintBucket, Pipette, Type, Upload, Download, Save, X, Undo, Redo, RotateCcw, Grid3X3, Sparkles, Wand2, Shuffle, Star, Crown, Gem, Coins, Gift, ShoppingCart, CreditCard, Eye, EyeOff, Layers, Circle, Square, Triangle, Heart, Smile, Sun, Leaf, Flag, Music, Camera, Image as ImageIcon, Zap, Target, Award, Settings, Maximize2, Minimize2, Copy, Share2, Info, HelpCircle, Move, RotateCw, FlipHorizontal, FlipVertical, Filter, Sliders, Minus, Plus, Scissors, Crosshair, Droplets, Feather, Stamp, Aperture, Contrast, Copyright as Brightness, IterationCw as Saturation, Fuel as Hue, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Repeat, Clock, Timer, Gauge, Paintbrush2, PenTool, Highlighter, BookMarked as Marker, LayoutIcon as Crayon, Pencil, Pen, Rainbow, Waves, Flame, Snowflake, Flower, TreePine, Mountain, Building, Car, Plane, Ship, Anchor, Compass, Map, Globe2, Smartphone, Tablet, Monitor, Headphones, Gamepad2, Joystick, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Spade, Club, Diamond, Hash } from 'lucide-react';
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
  color: string;
}

interface BrushPreset {
  id: string;
  name: string;
  size: number;
  opacity: number;
  hardness: number;
  spacing: number;
  preview: string;
  color: string;
}

interface ArtStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: string[];
  effects: string[];
  premium: boolean;
}

interface AnimationFrame {
  id: string;
  name: string;
  imageData: ImageData | null;
  duration: number;
}

const advancedTools: Tool[] = [
  // Ferramentas Básicas
  { id: 'brush', name: 'Pincel', icon: <Brush className="h-5 w-5" />, category: 'basic', description: 'Pincel básico para desenhar', color: 'text-blue-500' },
  { id: 'pencil', name: 'Lápis', icon: <Pencil className="h-5 w-5" />, category: 'basic', description: 'Lápis para traços precisos', color: 'text-gray-500' },
  { id: 'pen', name: 'Caneta', icon: <Pen className="h-5 w-5" />, category: 'basic', description: 'Caneta para linhas definidas', color: 'text-black' },
  { id: 'marker', name: 'Marcador', icon: <Marker className="h-5 w-5" />, category: 'basic', description: 'Marcador para áreas grandes', color: 'text-green-500' },
  { id: 'highlighter', name: 'Marca-texto', icon: <Highlighter className="h-5 w-5" />, category: 'basic', description: 'Destaque com transparência', color: 'text-yellow-500' },
  { id: 'eraser', name: 'Borracha', icon: <Eraser className="h-5 w-5" />, category: 'basic', description: 'Remove pixels', color: 'text-red-500' },
  
  // Ferramentas Artísticas
  { id: 'spray', name: 'Spray', icon: <Droplets className="h-5 w-5" />, category: 'artistic', description: 'Efeito de spray aerossol', color: 'text-cyan-500' },
  { id: 'smudge', name: 'Borrar', icon: <Waves className="h-5 w-5" />, category: 'artistic', description: 'Borra e mistura cores', color: 'text-purple-500' },
  { id: 'blur', name: 'Desfoque', icon: <Aperture className="h-5 w-5" />, category: 'artistic', premium: true, description: 'Aplica desfoque suave', color: 'text-indigo-500' },
  { id: 'sharpen', name: 'Nitidez', icon: <Contrast className="h-5 w-5" />, category: 'artistic', premium: true, description: 'Aumenta nitidez', color: 'text-orange-500' },
  { id: 'clone', name: 'Clonar', icon: <Copy className="h-5 w-5" />, category: 'artistic', premium: true, description: 'Clona áreas da imagem', color: 'text-teal-500' },
  { id: 'heal', name: 'Curar', icon: <Heart className="h-5 w-5" />, category: 'artistic', premium: true, description: 'Remove imperfeições', color: 'text-pink-500' },
  
  // Formas Geométricas
  { id: 'line', name: 'Linha', icon: <Minus className="h-5 w-5" />, category: 'shapes', description: 'Desenha linhas retas', color: 'text-gray-600' },
  { id: 'rectangle', name: 'Retângulo', icon: <Square className="h-5 w-5" />, category: 'shapes', description: 'Desenha retângulos', color: 'text-blue-600' },
  { id: 'circle', name: 'Círculo', icon: <Circle className="h-5 w-5" />, category: 'shapes', description: 'Desenha círculos perfeitos', color: 'text-green-600' },
  { id: 'triangle', name: 'Triângulo', icon: <Triangle className="h-5 w-5" />, category: 'shapes', description: 'Desenha triângulos', color: 'text-yellow-600' },
  { id: 'star', name: 'Estrela', icon: <Star className="h-5 w-5" />, category: 'shapes', description: 'Desenha estrelas', color: 'text-amber-500' },
  { id: 'heart', name: 'Coração', icon: <Heart className="h-5 w-5" />, category: 'shapes', description: 'Desenha corações', color: 'text-red-500' },
  
  // Efeitos Especiais
  { id: 'glow', name: 'Brilho', icon: <Sparkles className="h-5 w-5" />, category: 'effects', premium: true, description: 'Adiciona efeito de brilho', color: 'text-yellow-400' },
  { id: 'shadow', name: 'Sombra', icon: <Circle className="h-5 w-5" />, category: 'effects', premium: true, description: 'Adiciona sombras realistas', color: 'text-gray-700' },
  { id: 'emboss', name: 'Relevo', icon: <Layers className="h-5 w-5" />, category: 'effects', premium: true, description: 'Efeito 3D de relevo', color: 'text-stone-500' },
  { id: 'neon', name: 'Neon', icon: <Zap className="h-5 w-5" />, category: 'effects', premium: true, description: 'Efeito neon brilhante', color: 'text-cyan-400' },
  { id: 'fire', name: 'Fogo', icon: <Flame className="h-5 w-5" />, category: 'effects', premium: true, description: 'Efeito de chamas', color: 'text-red-600' },
  { id: 'ice', name: 'Gelo', icon: <Snowflake className="h-5 w-5" />, category: 'effects', premium: true, description: 'Efeito gelado', color: 'text-blue-300' },
  
  // Ferramentas de Preenchimento
  { id: 'bucket', name: 'Balde', icon: <PaintBucket className="h-5 w-5" />, category: 'fill', description: 'Preenche áreas conectadas', color: 'text-blue-500' },
  { id: 'gradient', name: 'Gradiente', icon: <Rainbow className="h-5 w-5" />, category: 'fill', description: 'Cria gradientes suaves', color: 'text-purple-500' },
  { id: 'pattern', name: 'Padrão', icon: <Grid3X3 className="h-5 w-5" />, category: 'fill', description: 'Aplica padrões repetitivos', color: 'text-green-500' },
  { id: 'texture', name: 'Textura', icon: <Feather className="h-5 w-5" />, category: 'fill', premium: true, description: 'Adiciona texturas realistas', color: 'text-brown-500' },
  
  // Ferramentas de Seleção
  { id: 'select', name: 'Seleção', icon: <Crosshair className="h-5 w-5" />, category: 'selection', description: 'Seleciona áreas', color: 'text-gray-500' },
  { id: 'lasso', name: 'Laço', icon: <PenTool className="h-5 w-5" />, category: 'selection', description: 'Seleção livre', color: 'text-purple-500' },
  { id: 'magic', name: 'Varinha', icon: <Wand2 className="h-5 w-5" />, category: 'selection', premium: true, description: 'Seleção inteligente', color: 'text-violet-500' },
  
  // Ferramentas Utilitárias
  { id: 'eyedropper', name: 'Conta-gotas', icon: <Pipette className="h-5 w-5" />, category: 'utility', description: 'Captura cores', color: 'text-indigo-500' },
  { id: 'zoom', name: 'Zoom', icon: <Maximize2 className="h-5 w-5" />, category: 'utility', description: 'Amplia para detalhes', color: 'text-gray-600' },
  { id: 'hand', name: 'Mover', icon: <Move className="h-5 w-5" />, category: 'utility', description: 'Move a visualização', color: 'text-blue-400' },
  { id: 'measure', name: 'Medir', icon: <Gauge className="h-5 w-5" />, category: 'utility', description: 'Mede distâncias', color: 'text-green-400' },
];

const brushPresets: BrushPreset[] = [
  { id: 'fine', name: 'Fino', size: 2, opacity: 100, hardness: 100, spacing: 1, preview: '●', color: 'text-gray-600' },
  { id: 'medium', name: 'Médio', size: 8, opacity: 100, hardness: 80, spacing: 2, preview: '●', color: 'text-blue-500' },
  { id: 'thick', name: 'Grosso', size: 16, opacity: 100, hardness: 60, spacing: 3, preview: '●', color: 'text-green-500' },
  { id: 'soft', name: 'Suave', size: 12, opacity: 60, hardness: 20, spacing: 2, preview: '◉', color: 'text-purple-500' },
  { id: 'textured', name: 'Textura', size: 10, opacity: 80, hardness: 40, spacing: 4, preview: '▣', color: 'text-orange-500' },
  { id: 'scatter', name: 'Disperso', size: 6, opacity: 70, hardness: 30, spacing: 8, preview: '⋯', color: 'text-cyan-500' },
  { id: 'calligraphy', name: 'Caligrafia', size: 4, opacity: 100, hardness: 90, spacing: 1, preview: '✒', color: 'text-red-500' },
  { id: 'watercolor', name: 'Aquarela', size: 20, opacity: 40, hardness: 10, spacing: 5, preview: '◯', color: 'text-blue-300' },
];

const artStyles: ArtStyle[] = [
  {
    id: 'pixel_classic',
    name: 'Pixel Clássico',
    description: 'Estilo retro dos videojogos dos anos 80',
    preview: '🎮',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    effects: ['pixelate', 'contrast'],
    premium: false
  },
  {
    id: 'neon_cyber',
    name: 'Neon Cyber',
    description: 'Estilo cyberpunk com cores vibrantes',
    preview: '🌈',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#8000FF'],
    effects: ['glow', 'neon', 'contrast'],
    premium: true
  },
  {
    id: 'watercolor',
    name: 'Aquarela',
    description: 'Efeito de pintura em aquarela',
    preview: '🎨',
    colors: ['#FFB6C1', '#87CEEB', '#98FB98', '#F0E68C', '#DDA0DD'],
    effects: ['blur', 'transparency', 'blend'],
    premium: true
  },
  {
    id: 'oil_painting',
    name: 'Pintura a Óleo',
    description: 'Textura rica de pintura a óleo',
    preview: '🖼️',
    colors: ['#8B4513', '#CD853F', '#D2691E', '#A0522D', '#F4A460'],
    effects: ['texture', 'impasto', 'blend'],
    premium: true
  },
  {
    id: 'minimalist',
    name: 'Minimalista',
    description: 'Design limpo e simples',
    preview: '⚪',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E'],
    effects: ['clean', 'geometric'],
    premium: false
  },
  {
    id: 'portuguese',
    name: 'Português',
    description: 'Cores e padrões tradicionais portugueses',
    preview: '🇵🇹',
    colors: ['#D4A757', '#7DF9FF', '#228B22', '#FF6347', '#4169E1'],
    effects: ['traditional', 'azulejo'],
    premium: false
  }
];

const magicEffects = [
  { id: 'auto_enhance', name: 'Melhorar IA', icon: <Wand2 className="h-4 w-4" />, description: 'IA melhora automaticamente', color: 'text-purple-500' },
  { id: 'style_transfer', name: 'Transferir Estilo', icon: <Paintbrush2 className="h-4 w-4" />, description: 'Aplica estilo artístico', color: 'text-blue-500' },
  { id: 'color_harmony', name: 'Harmonia Cores', icon: <Rainbow className="h-4 w-4" />, description: 'Otimiza paleta de cores', color: 'text-green-500' },
  { id: 'detail_enhance', name: 'Detalhes IA', icon: <Eye className="h-4 w-4" />, description: 'Adiciona detalhes inteligentes', color: 'text-orange-500' },
  { id: 'lighting', name: 'Iluminação', icon: <Sun className="h-4 w-4" />, description: 'Melhora iluminação', color: 'text-yellow-500' },
  { id: 'depth', name: 'Profundidade', icon: <Layers className="h-4 w-4" />, description: 'Adiciona sensação 3D', color: 'text-indigo-500' }
];

const stickerCategories = {
  emojis: {
    name: 'Emojis',
    icon: <Smile className="h-4 w-4" />,
    items: ['😀', '😍', '🤩', '😎', '🥳', '😇', '🤔', '😴', '🤯', '🥰', '😋', '🤪', '🤓', '😈', '👻', '🤖']
  },
  symbols: {
    name: 'Símbolos',
    icon: <Star className="h-4 w-4" />,
    items: ['⭐', '❤️', '💎', '🔥', '⚡', '🌟', '💫', '✨', '💯', '🎯', '🏆', '👑', '💰', '🎪', '🎭', '🎨']
  },
  nature: {
    name: 'Natureza',
    icon: <Leaf className="h-4 w-4" />,
    items: ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌿', '🌳', '🌲', '🌴', '🌵', '🌾', '🍄', '🌙', '☀️', '⭐']
  },
  portugal: {
    name: 'Portugal',
    icon: <Flag className="h-4 w-4" />,
    items: ['🇵🇹', '🏰', '⛪', '🌊', '🍷', '🐟', '🚢', '🏛️', '🎭', '🎪', '🎨', '🎵', '⚽', '🏖️', '🌅', '🗿']
  },
  gaming: {
    name: 'Gaming',
    icon: <Gamepad2 className="h-4 w-4" />,
    items: ['🎮', '🕹️', '👾', '🎯', '🎲', '🃏', '♠️', '♥️', '♦️', '♣️', '🎰', '🎪', '🎭', '🎨', '🎵', '🎤']
  },
  tech: {
    name: 'Tech',
    icon: <Smartphone className="h-4 w-4" />,
    items: ['💻', '📱', '⌚', '🖥️', '⌨️', '🖱️', '💾', '💿', '📀', '🔌', '🔋', '📡', '🛰️', '🚀', '🤖', '👾']
  }
};

const colorPalettes = [
  { 
    name: 'Clássico', 
    colors: ['#D4A757', '#7DF9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'] 
  },
  { 
    name: 'Neon', 
    colors: ['#FF073A', '#39FF14', '#00FFFF', '#FF1493', '#FFFF00', '#FF4500', '#9400D3', '#00FF7F'] 
  },
  { 
    name: 'Pastel', 
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E6BAFF', '#FFBAE6', '#C9BAFF'] 
  },
  { 
    name: 'Terra', 
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3'] 
  },
  { 
    name: 'Oceano', 
    colors: ['#006994', '#0085C3', '#00A8CC', '#7FCDCD', '#87CEEB', '#4682B4', '#5F9EA0', '#B0E0E6'] 
  },
  { 
    name: 'Floresta', 
    colors: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F', '#00FA9A', '#ADFF2F', '#7CFC00'] 
  },
  { 
    name: 'Pôr do Sol', 
    colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00', '#FF69B4', '#FF1493'] 
  },
  { 
    name: 'Portugal', 
    colors: ['#FF0000', '#00FF00', '#FFD700', '#0000FF', '#800080', '#FFA500', '#008000', '#000080'] 
  },
  { 
    name: 'Cyberpunk', 
    colors: ['#FF0080', '#00FFFF', '#FFFF00', '#FF4000', '#8000FF', '#00FF40', '#FF8000', '#4000FF'] 
  },
  { 
    name: 'Vintage', 
    colors: ['#8B4513', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3', '#DDBEA9'] 
  },
  { 
    name: 'Monocromático', 
    colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#E0E0E0', '#B0B0B0'] 
  },
  { 
    name: 'Arco-íris', 
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF69B4'] 
  }
];

const animationPresets = [
  { id: 'pulse', name: 'Pulsar', description: 'Efeito pulsante', duration: 1000 },
  { id: 'glow', name: 'Brilhar', description: 'Brilho intermitente', duration: 1500 },
  { id: 'rotate', name: 'Rodar', description: 'Rotação contínua', duration: 2000 },
  { id: 'bounce', name: 'Saltar', description: 'Movimento de salto', duration: 800 },
  { id: 'fade', name: 'Desvanecer', description: 'Aparece e desaparece', duration: 2000 },
  { id: 'shake', name: 'Tremer', description: 'Movimento de tremor', duration: 500 }
];

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
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Ferramentas e configurações
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedBrushPreset, setSelectedBrushPreset] = useState('medium');
  const [brushSize, setBrushSize] = useState(8);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushHardness, setBrushHardness] = useState(80);
  const [brushSpacing, setBrushSpacing] = useState(2);
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [selectedPalette, setSelectedPalette] = useState('Clássico');
  const [blendMode, setBlendMode] = useState('normal');
  
  // Funcionalidades avançadas
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [pressureSensitive, setPressureSensitive] = useState(true);
  const [smoothing, setSmoothing] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  
  // Camadas e animação
  const [layers, setLayers] = useState([
    { id: '1', name: 'Fundo', visible: true, opacity: 100, blendMode: 'normal' }
  ]);
  const [activeLayer, setActiveLayer] = useState('1');
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([
    { id: '1', name: 'Frame 1', imageData: null, duration: 500 }
  ]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  
  // Estados da interface
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  
  // Estados de processamento
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  
  // Customizações
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelTags, setPixelTags] = useState<string[]>([]);
  const [pixelLink, setPixelLink] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Estados de compra
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'special' | 'mixed'>('credits');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const { addCredits, addXp, removeCredits, removeSpecialCredits } = useUserStore();
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();

  // Inicializar canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurar canvas para pixel art
    canvas.width = 400;
    canvas.height = 400;
    ctx.imageSmoothingEnabled = false;
    
    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Se há cor do pixel, aplicar como base
    if (pixelData?.color && pixelData.color !== '#FFFFFF') {
      ctx.fillStyle = pixelData.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Salvar estado inicial
    saveToUndoStack();
    
    // Configurar título padrão
    if (pixelData && !pixelTitle) {
      setPixelTitle(`Obra de Arte (${pixelData.x}, ${pixelData.y})`);
    }
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

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 1 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY, pressure = 1;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      pressure = (touch as any).force || 1;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
      pressure = (e as any).pressure || 1;
    }
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    // Snap to grid se ativado
    if (snapToGrid) {
      return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
        pressure
      };
    }
    
    return { x, y, pressure };
  };

  const drawPoint = (x: number, y: number, pressure: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentPreset = brushPresets.find(p => p.id === selectedBrushPreset) || brushPresets[1];
    const size = brushSize * (pressureSensitive ? pressure : 1);
    const opacity = (brushOpacity / 100) * (pressureSensitive ? pressure : 1);
    
    ctx.save();
    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : blendMode as GlobalCompositeOperation;
    ctx.globalAlpha = opacity;
    
    switch (selectedTool) {
      case 'brush':
      case 'pencil':
      case 'pen':
        ctx.fillStyle = selectedColor;
        if (currentPreset.id === 'soft') {
          // Pincel suave com gradiente
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
          gradient.addColorStop(0, selectedColor);
          gradient.addColorStop(1, selectedColor + '00');
          ctx.fillStyle = gradient;
        }
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'marker':
        ctx.fillStyle = selectedColor;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        break;
        
      case 'highlighter':
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = selectedColor;
        ctx.fillRect(x - size, y - size / 4, size * 2, size / 2);
        break;
        
      case 'spray':
        ctx.fillStyle = selectedColor;
        for (let i = 0; i < size * 3; i++) {
          const offsetX = (Math.random() - 0.5) * size * 2;
          const offsetY = (Math.random() - 0.5) * size * 2;
          const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
          if (distance <= size) {
            ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
          }
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
        drawPointDirect(ctx, mirrorX, y, size, opacity);
      }
      
      if (symmetryMode === 'vertical' || symmetryMode === 'both') {
        const mirrorY = centerY + (centerY - y);
        drawPointDirect(ctx, x, mirrorY, size, opacity);
      }
      
      if (symmetryMode === 'both') {
        const mirrorX = centerX + (centerX - x);
        const mirrorY = centerY + (centerY - y);
        drawPointDirect(ctx, mirrorX, mirrorY, size, opacity);
      }
    }
    
    ctx.restore();
  };

  const drawPointDirect = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, pressure: number = 1) => {
    if (!smoothing) {
      drawPoint(x2, y2, pressure);
      return;
    }
    
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.max(1, Math.floor(distance / brushSpacing));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      drawPoint(x, y, pressure);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
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
      drawPoint(coords.x, coords.y, coords.pressure);
    }
    
    vibrate('light');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (!isDrawing || !lastPoint) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool !== 'bucket') {
      drawLine(lastPoint.x, lastPoint.y, coords.x, coords.y, coords.pressure);
    }
    
    setLastPoint(coords);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveToUndoStack();
      vibrate('light');
      
      // Recompensar criatividade
      addXp(2);
      if (Math.random() > 0.8) {
        addCredits(1);
        toast({
          title: "Criatividade Recompensada! 🎨",
          description: "+2 XP +1 crédito pela sua arte!",
        });
      }
    }
  };

  const handleEyedropper = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const coords = getCanvasCoordinates(e);
    const imageData = ctx.getImageData(Math.floor(coords.x), Math.floor(coords.y), 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setSelectedColor(hex);
    
    vibrate('medium');
    toast({
      title: "Cor Capturada! 🎨",
      description: `Nova cor: ${hex}`,
    });
  };

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const startIndex = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];
    
    const targetColor = hexToRgb(selectedColor);
    if (!targetColor) return;
    
    // Verificar se a cor já é a mesma
    if (startR === targetColor.r && startG === targetColor.g && startB === targetColor.b) {
      return;
    }
    
    const stack = [{ x: Math.floor(startX), y: Math.floor(startY) }];
    const visited = new Set<string>();
    
    while (stack.length > 0 && visited.size < 50000) {
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
    }
    
    ctx.putImageData(imageData, 0, 0);
    saveToUndoStack();
    
    vibrate('medium');
    toast({
      title: "Área Preenchida! 🎨",
      description: `${visited.size} pixels preenchidos`,
    });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const applyBrushPreset = (presetId: string) => {
    const preset = brushPresets.find(p => p.id === presetId);
    if (!preset) return;
    
    setBrushSize(preset.size);
    setBrushOpacity(preset.opacity);
    setBrushHardness(preset.hardness);
    setBrushSpacing(preset.spacing);
    setSelectedBrushPreset(presetId);
    
    vibrate('light');
    toast({
      title: "Preset Aplicado! ✨",
      description: `Pincel ${preset.name} selecionado`,
    });
  };

  const applyArtStyle = async (styleId: string) => {
    const style = artStyles.find(s => s.id === styleId);
    if (!style) return;
    
    setIsProcessing(true);
    setProcessingStep('Aplicando estilo artístico...');
    setProcessingProgress(0);
    
    // Simular processamento IA
    for (let i = 0; i <= 100; i += 10) {
      setProcessingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Aplicar cores do estilo
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            const randomColor = style.colors[Math.floor(Math.random() * style.colors.length)];
            const rgb = hexToRgb(randomColor);
            if (rgb) {
              data[i] = rgb.r;
              data[i + 1] = rgb.g;
              data[i + 2] = rgb.b;
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        saveToUndoStack();
      }
    }
    
    setSelectedStyle(styleId);
    setIsProcessing(false);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    vibrate('success');
    toast({
      title: "Estilo Aplicado! 🎨",
      description: `Estilo ${style.name} aplicado com sucesso!`,
    });
  };

  const applyMagicEffect = async (effectId: string) => {
    setIsProcessing(true);
    setProcessingStep('Aplicando efeito mágico...');
    setProcessingProgress(0);
    
    // Simular processamento IA
    for (let i = 0; i <= 100; i += 20) {
      setProcessingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        switch (effectId) {
          case 'auto_enhance':
            // Melhorar contraste e saturação
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] * 1.2);     // R
              data[i + 1] = Math.min(255, data[i + 1] * 1.2); // G
              data[i + 2] = Math.min(255, data[i + 2] * 1.2); // B
            }
            break;
            
          case 'color_harmony':
            // Aplicar harmonia de cores
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) {
                const hue = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = Math.min(255, hue * 1.1);
                data[i + 1] = Math.min(255, hue * 0.9);
                data[i + 2] = Math.min(255, hue * 1.05);
              }
            }
            break;
            
          case 'lighting':
            // Melhorar iluminação
            for (let i = 0; i < data.length; i += 4) {
              const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
              if (brightness < 128) {
                data[i] = Math.min(255, data[i] * 1.3);
                data[i + 1] = Math.min(255, data[i + 1] * 1.3);
                data[i + 2] = Math.min(255, data[i + 2] * 1.3);
              }
            }
            break;
        }
        
        ctx.putImageData(imageData, 0, 0);
        saveToUndoStack();
      }
    }
    
    setIsProcessing(false);
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    vibrate('success');
    toast({
      title: "Efeito Mágico Aplicado! ✨",
      description: "IA melhorou a sua obra de arte!",
    });
  };

  const addSticker = (sticker: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker, canvas.width / 2, canvas.height / 2);
    
    saveToUndoStack();
    vibrate('medium');
    
    toast({
      title: "Sticker Adicionado! 🎉",
      description: `${sticker} foi adicionado ao pixel`,
    });
  };

  const addText = () => {
    const text = prompt('Digite o texto:');
    if (!text) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = selectedColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    saveToUndoStack();
    vibrate('medium');
    
    toast({
      title: "Texto Adicionado! 📝",
      description: `"${text}" foi adicionado`,
    });
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
    vibrate('light');
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
    vibrate('medium');
    
    toast({
      title: "Canvas Limpo",
      description: "Pronto para uma nova criação!",
    });
  };

  const randomizeColors = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const palette = colorPalettes.find(p => p.name === selectedPalette)?.colors || colorPalettes[0].colors;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        const randomColor = palette[Math.floor(Math.random() * palette.length)];
        const rgb = hexToRgb(randomColor);
        if (rgb) {
          data[i] = rgb.r;
          data[i + 1] = rgb.g;
          data[i + 2] = rgb.b;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    saveToUndoStack();
    
    vibrate('success');
    toast({
      title: "Cores Aleatórias! 🌈",
      description: `Paleta ${selectedPalette} aplicada`,
    });
  };

  const generatePattern = (patternType: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = selectedColor;
    
    switch (patternType) {
      case 'dots':
        for (let x = 10; x < canvas.width; x += 20) {
          for (let y = 10; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 'stripes':
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.fillRect(x, 0, 10, canvas.height);
        }
        break;
        
      case 'checkerboard':
        const squareSize = 20;
        for (let x = 0; x < canvas.width; x += squareSize) {
          for (let y = 0; y < canvas.height; y += squareSize) {
            if ((Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0) {
              ctx.fillRect(x, y, squareSize, squareSize);
            }
          }
        }
        break;
    }
    
    saveToUndoStack();
    vibrate('medium');
    
    toast({
      title: "Padrão Aplicado! 📐",
      description: `Padrão ${patternType} criado`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo Muito Grande",
        description: "Máximo 5MB permitido",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Redimensionar mantendo proporção
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        ctx.drawImage(img, x, y, width, height);
        saveToUndoStack();
        
        vibrate('success');
        toast({
          title: "Imagem Carregada! 📸",
          description: "Base para sua criação adicionada",
        });
      };
      img.src = event.target?.result as string;
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startAnimation = () => {
    if (animationFrames.length < 2) {
      toast({
        title: "Frames Insuficientes",
        description: "Adicione pelo menos 2 frames para animar",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnimating(true);
    
    let frameIndex = 0;
    const interval = setInterval(() => {
      const frame = animationFrames[frameIndex];
      if (frame.imageData && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.putImageData(frame.imageData, 0, 0);
        }
      }
      
      frameIndex = (frameIndex + 1) % animationFrames.length;
    }, animationSpeed);
    
    setTimeout(() => {
      clearInterval(interval);
      setIsAnimating(false);
    }, 5000);
  };

  const addAnimationFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newFrame: AnimationFrame = {
      id: Date.now().toString(),
      name: `Frame ${animationFrames.length + 1}`,
      imageData,
      duration: 500
    };
    
    setAnimationFrames(prev => [...prev, newFrame]);
    
    toast({
      title: "Frame Adicionado! 🎬",
      description: `Frame ${animationFrames.length + 1} capturado`,
    });
  };

  const calculateTotalPrice = () => {
    if (!pixelData) return 0;
    
    let basePrice = pixelData.price;
    let premiumEffects = 0;
    let animationCost = 0;
    let styleCost = 0;
    
    // Contar efeitos premium usados
    const premiumToolsUsed = advancedTools.filter(t => t.premium).length;
    premiumEffects = premiumToolsUsed * 3; // €3 por ferramenta premium
    
    // Custo de animação
    if (animationFrames.length > 1) {
      animationCost = (animationFrames.length - 1) * 5; // €5 por frame extra
    }
    
    // Custo de estilo premium
    if (selectedStyle) {
      const style = artStyles.find(s => s.id === selectedStyle);
      if (style?.premium) {
        styleCost = 10;
      }
    }
    
    return basePrice + premiumEffects + animationCost + styleCost;
  };

  const handlePurchase = async () => {
    if (!pixelData) return;
    
    const totalPrice = calculateTotalPrice();
    
    // Verificar saldo
    if (paymentMethod === 'credits' && userCredits < totalPrice) {
      toast({
        title: "Saldo Insuficiente 💰",
        description: `Precisa de ${totalPrice - userCredits} créditos adicionais`,
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === 'special' && pixelData.specialCreditsPrice && userSpecialCredits < pixelData.specialCreditsPrice) {
      toast({
        title: "Créditos Especiais Insuficientes 💎",
        description: `Precisa de ${pixelData.specialCreditsPrice - userSpecialCredits} créditos especiais`,
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingStep('Finalizando obra de arte...');
    setProcessingProgress(0);
    
    // Simular processamento
    for (let i = 0; i <= 100; i += 25) {
      setProcessingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    try {
      // Capturar canvas como obra final
      const canvas = canvasRef.current;
      const canvasDataUrl = canvas?.toDataURL('image/png');
      
      const customizations = {
        color: selectedColor,
        title: pixelTitle || `Obra de Arte (${pixelData.x}, ${pixelData.y})`,
        description: pixelDescription || 'Criação única no Pixel Universe',
        tags: pixelTags,
        linkUrl: pixelLink,
        image: canvasDataUrl,
        style: selectedStyle,
        isAnimated: animationFrames.length > 1,
        frameCount: animationFrames.length,
        tools_used: [selectedTool],
        premium_features: advancedTools.filter(t => t.premium).map(t => t.id)
      };
      
      const success = await onPurchase(pixelData, paymentMethod, customizations);
      
      if (success) {
        // Deduzir créditos
        if (paymentMethod === 'credits') {
          removeCredits(totalPrice);
        } else if (paymentMethod === 'special' && pixelData.specialCreditsPrice) {
          removeSpecialCredits(pixelData.specialCreditsPrice);
        }
        
        // Recompensas por criatividade
        const creativityBonus = Math.floor(totalPrice * 0.1);
        addXp(100 + creativityBonus);
        addCredits(20 + creativityBonus);
        
        setShowConfetti(true);
        setPlaySuccessSound(true);
        vibrate('success');
        
        toast({
          title: "Obra de Arte Criada! 🎨✨",
          description: `Pixel (${pixelData.x}, ${pixelData.y}) é agora uma obra única! +${100 + creativityBonus} XP +${20 + creativityBonus} créditos`,
        });
        
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Erro na Criação",
        description: "Não foi possível finalizar a obra. Tente novamente.",
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

  const currentTool = advancedTools.find(t => t.id === selectedTool);
  const currentPreset = brushPresets.find(p => p.id === selectedBrushPreset);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background/98 to-primary/5">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 via-accent/5 to-purple/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '300% 100%' }} />
          <div className="relative">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center text-2xl font-headline text-gradient-gold">
                <Palette className="h-6 w-6 mr-3 animate-glow" />
                Estúdio de Arte Digital
              </span>
              <div className="flex items-center gap-2">
                <Badge className={`${pixelData.rarity === 'Lendário' ? 'bg-amber-500 animate-pulse' : 'bg-primary'}`}>
                  <Gem className="h-3 w-3 mr-1" />
                  {pixelData.rarity}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  ({pixelData.x}, {pixelData.y})
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Transforme este pixel numa obra de arte única em {pixelData.region}! 
              Use ferramentas profissionais para criar algo verdadeiramente especial.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Área Principal do Canvas */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar Dinâmica */}
            <div className="p-3 border-b bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Ferramenta Atual */}
                  <div className="flex items-center gap-2 bg-background/80 rounded-lg p-2 border">
                    <div className={cn("p-1 rounded", currentTool?.color)}>
                      {currentTool?.icon}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">{currentTool?.name}</p>
                      <p className="text-xs text-muted-foreground">{currentTool?.description}</p>
                    </div>
                  </div>
                  
                  {/* Cor Atual */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-border shadow-inner cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: selectedColor }}
                      onClick={() => document.getElementById('color-picker')?.click()}
                    />
                    <input
                      id="color-picker"
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Tamanho do Pincel */}
                  <div className="flex items-center gap-2 bg-background/80 rounded-lg p-2 border">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[brushSize]}
                      onValueChange={(value) => setBrushSize(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      className="w-20"
                    />
                    <span className="text-sm font-mono w-8">{brushSize}</span>
                  </div>
                </div>
                
                {/* Ações Rápidas */}
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length <= 1}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowPreview(!showPreview)}
                    className={showPreview ? 'bg-primary/20' : ''}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Canvas Principal com Overlay Interativo */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-muted/5 via-transparent to-primary/5 relative">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border-4 border-primary/30 rounded-xl shadow-2xl bg-white cursor-crosshair touch-none"
                  style={{ 
                    imageRendering: 'pixelated',
                    width: '400px',
                    height: '400px',
                    transform: `scale(${canvasZoom})`,
                    filter: showPreview ? 'drop-shadow(0 0 20px rgba(212, 167, 87, 0.5))' : 'none'
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
                
                {/* Grelha Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none border-4 border-primary/30 rounded-xl"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(212, 167, 87, 0.2) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(212, 167, 87, 0.2) 1px, transparent 1px)
                      `,
                      backgroundSize: `${gridSize}px ${gridSize}px`,
                      transform: `scale(${canvasZoom})`
                    }}
                  />
                )}
                
                {/* Indicadores de Simetria */}
                {symmetryMode !== 'none' && (
                  <div className="absolute inset-0 pointer-events-none border-4 border-primary/30 rounded-xl overflow-hidden">
                    {(symmetryMode === 'horizontal' || symmetryMode === 'both') && (
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500/70 animate-pulse" />
                    )}
                    {(symmetryMode === 'vertical' || symmetryMode === 'both') && (
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/70 animate-pulse" />
                    )}
                  </div>
                )}
                
                {/* Controles de Zoom */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCanvasZoom(Math.min(3, canvasZoom + 0.2))}
                    className="w-8 h-8 p-0 bg-background/90"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCanvasZoom(Math.max(0.5, canvasZoom - 0.2))}
                    className="w-8 h-8 p-0 bg-background/90"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Indicador de Ferramenta Ativa */}
                <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1 rounded", currentTool?.color)}>
                      {currentTool?.icon}
                    </div>
                    <span className="text-xs font-medium">{currentTool?.name}</span>
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
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                  >
                    <Card className="p-6 shadow-2xl border-primary/30 bg-background/95">
                      <CardContent className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                          <Sparkles className="h-8 w-8 text-white animate-pulse" />
                        </div>
                        <h3 className="text-lg font-semibold">{processingStep}</h3>
                        <Progress value={processingProgress} className="w-64" />
                        <p className="text-sm text-muted-foreground">
                          A IA está a trabalhar na sua obra-prima...
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Painel Lateral de Ferramentas - Otimizado para Mobile */}
          <div className="w-80 border-l bg-card/30 backdrop-blur-sm flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-5 m-2 bg-background/80">
                <TabsTrigger value="tools" className="text-xs p-2">
                  <Brush className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="colors" className="text-xs p-2">
                  <Palette className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-xs p-2">
                  <Sparkles className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="content" className="text-xs p-2">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="info" className="text-xs p-2">
                  <Info className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1 p-3">
                {/* Ferramentas */}
                <TabsContent value="tools" className="mt-0 space-y-4">
                  {/* Categorias de Ferramentas */}
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {['basic', 'artistic', 'shapes', 'effects', 'fill', 'selection', 'utility'].map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs whitespace-nowrap"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Grid de Ferramentas */}
                  <div className="grid grid-cols-3 gap-2">
                    {advancedTools
                      .filter(tool => tool.category === selectedCategory)
                      .map(tool => (
                        <Button
                          key={tool.id}
                          variant={selectedTool === tool.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedTool(tool.id);
                            vibrate('light');
                          }}
                          className="flex flex-col items-center p-3 h-auto relative group"
                        >
                          <div className={cn("mb-1", tool.color)}>
                            {tool.icon}
                          </div>
                          <span className="text-xs">{tool.name}</span>
                          {tool.premium && (
                            <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                          )}
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {tool.description}
                          </div>
                        </Button>
                      ))}
                  </div>
                  
                  {/* Presets de Pincel */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Paintbrush2 className="h-4 w-4 mr-2 text-primary" />
                      Presets de Pincel
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {brushPresets.map(preset => (
                        <Button
                          key={preset.id}
                          variant={selectedBrushPreset === preset.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => applyBrushPreset(preset.id)}
                          className="flex items-center justify-start p-2 h-auto"
                        >
                          <span className={cn("text-lg mr-2", preset.color)}>{preset.preview}</span>
                          <div className="text-left">
                            <p className="text-xs font-medium">{preset.name}</p>
                            <p className="text-xs text-muted-foreground">{preset.size}px</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Configurações Avançadas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Configurações Avançadas</Label>
                      <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
                    </div>
                    
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
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
                            <Label className="text-xs">Dureza: {brushHardness}%</Label>
                            <Slider
                              value={[brushHardness]}
                              onValueChange={(value) => setBrushHardness(value[0])}
                              min={1}
                              max={100}
                              step={1}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Suavização</Label>
                            <Switch checked={smoothing} onCheckedChange={setSmoothing} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Pressão Sensível</Label>
                            <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TabsContent>
                
                {/* Cores e Paletas */}
                <TabsContent value="colors" className="mt-0 space-y-4">
                  {/* Paletas Predefinidas */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Rainbow className="h-4 w-4 mr-2 text-primary" />
                      Paletas de Cores
                    </h4>
                    <div className="space-y-2">
                      {colorPalettes.map(palette => (
                        <div key={palette.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{palette.name}</span>
                            <Button
                              variant={selectedPalette === palette.name ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedPalette(palette.name)}
                              className="text-xs"
                            >
                              Usar
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {palette.colors.map(color => (
                              <button
                                key={color}
                                className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform touch-target"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setSelectedColor(color);
                                  vibrate('light');
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Gerador de Cores */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Gerador de Cores</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
                          setSelectedColor(randomColor);
                          vibrate('light');
                        }}
                        className="text-xs"
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Aleatória
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={randomizeColors}
                        className="text-xs"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Randomizar
                      </Button>
                    </div>
                  </div>
                  
                  {/* Simetria */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Modo de Simetria</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', name: 'Nenhuma', icon: <X className="h-3 w-3" /> },
                        { id: 'horizontal', name: 'Horizontal', icon: <Minus className="h-3 w-3" /> },
                        { id: 'vertical', name: 'Vertical', icon: <Minus className="h-3 w-3 rotate-90" /> },
                        { id: 'both', name: 'Ambas', icon: <Plus className="h-3 w-3" /> }
                      ].map(sym => (
                        <Button
                          key={sym.id}
                          variant={symmetryMode === sym.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSymmetryMode(sym.id as any);
                            vibrate('light');
                          }}
                          className="text-xs flex items-center"
                        >
                          {sym.icon}
                          <span className="ml-1">{sym.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Efeitos e IA */}
                <TabsContent value="effects" className="mt-0 space-y-4">
                  {/* Estilos Artísticos */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Wand2 className="h-4 w-4 mr-2 text-purple-500" />
                      Estilos Artísticos
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {artStyles.map(style => (
                        <Button
                          key={style.id}
                          variant={selectedStyle === style.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => applyArtStyle(style.id)}
                          className="flex flex-col items-center p-3 h-auto relative"
                        >
                          <span className="text-2xl mb-1">{style.preview}</span>
                          <span className="text-xs">{style.name}</span>
                          {style.premium && (
                            <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Efeitos Mágicos IA */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-500 animate-pulse" />
                      Efeitos Mágicos IA
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {magicEffects.map(effect => (
                        <Button
                          key={effect.id}
                          variant="outline"
                          size="sm"
                          onClick={() => applyMagicEffect(effect.id)}
                          className="flex flex-col items-center p-3 h-auto group"
                        >
                          <div className={cn("mb-1 group-hover:animate-pulse", effect.color)}>
                            {effect.icon}
                          </div>
                          <span className="text-xs">{effect.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Padrões Automáticos */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Padrões Automáticos</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generatePattern('dots')}
                        className="text-xs"
                      >
                        ⚫ Pontos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generatePattern('stripes')}
                        className="text-xs"
                      >
                        ▬ Riscas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generatePattern('checkerboard')}
                        className="text-xs"
                      >
                        ▦ Xadrez
                      </Button>
                    </div>
                  </div>
                  
                  {/* Configurações de Visualização */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Visualização</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Mostrar Grelha</Label>
                        <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                      </div>
                      
                      {showGrid && (
                        <div className="space-y-1">
                          <Label className="text-xs">Tamanho: {gridSize}px</Label>
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
                        <Label className="text-xs">Ajustar à Grelha</Label>
                        <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Conteúdo e Stickers */}
                <TabsContent value="content" className="mt-0 space-y-4">
                  {/* Stickers Organizados */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Smile className="h-4 w-4 mr-2 text-yellow-500" />
                      Stickers e Emojis
                    </h4>
                    
                    {Object.entries(stickerCategories).map(([categoryKey, category]) => (
                      <div key={categoryKey} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="text-primary">{category.icon}</div>
                          <Label className="text-xs font-medium">{category.name}</Label>
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {category.items.map(sticker => (
                            <Button
                              key={sticker}
                              variant="outline"
                              size="sm"
                              onClick={() => addSticker(sticker)}
                              className="text-lg p-1 h-8 w-8 hover:scale-125 transition-transform"
                            >
                              {sticker}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Texto e Upload */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addText}
                      className="w-full justify-start"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Adicionar Texto
                    </Button>
                    
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload">
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Carregar Imagem Base
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                  
                  {/* Animação */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center">
                      <Play className="h-4 w-4 mr-2 text-green-500" />
                      Animação
                      <Badge className="ml-2 bg-purple-500 text-xs">NOVO</Badge>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addAnimationFrame}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Frame
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startAnimation}
                        disabled={animationFrames.length < 2}
                        className="text-xs"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Frames: {animationFrames.length} | Custo: +€{(animationFrames.length - 1) * 5}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Informações do Pixel */}
                <TabsContent value="info" className="mt-0 space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Detalhes da Obra</h4>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Título da Obra</Label>
                      <Input
                        value={pixelTitle}
                        onChange={(e) => setPixelTitle(e.target.value)}
                        placeholder="Nome da sua criação..."
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Descrição Artística</Label>
                      <Textarea
                        value={pixelDescription}
                        onChange={(e) => setPixelDescription(e.target.value)}
                        placeholder="Conte a história da sua obra..."
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Link do Artista (opcional)</Label>
                      <Input
                        value={pixelLink}
                        onChange={(e) => setPixelLink(e.target.value)}
                        placeholder="https://seu-portfolio.com"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Tags (separadas por vírgula)</Label>
                      <Input
                        value={pixelTags.join(', ')}
                        onChange={(e) => setPixelTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                        placeholder="arte, portugal, único..."
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Estatísticas da Criação */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Estatísticas</h4>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-muted/20 p-2 rounded">
                        <p className="text-lg font-bold text-primary">{undoStack.length}</p>
                        <p className="text-xs text-muted-foreground">Ações</p>
                      </div>
                      <div className="bg-muted/20 p-2 rounded">
                        <p className="text-lg font-bold text-accent">{animationFrames.length}</p>
                        <p className="text-xs text-muted-foreground">Frames</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
            
            {/* Painel de Compra Fixo */}
            <div className="border-t bg-background/80 backdrop-blur-sm">
              <div className="p-4 space-y-4">
                {/* Resumo de Preços */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pixel Base:</span>
                    <span className="font-bold">€{pixelData.price}</span>
                  </div>
                  
                  {animationFrames.length > 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Animação ({animationFrames.length} frames):</span>
                      <span className="font-bold text-purple-500">+€{(animationFrames.length - 1) * 5}</span>
                    </div>
                  )}
                  
                  {selectedStyle && artStyles.find(s => s.id === selectedStyle)?.premium && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estilo Premium:</span>
                      <span className="font-bold text-amber-500">+€10</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">€{totalPrice}</span>
                  </div>
                  
                  {pixelData.specialCreditsPrice && (
                    <div className="text-center text-sm text-accent">
                      ou {pixelData.specialCreditsPrice} créditos especiais
                    </div>
                  )}
                </div>
                
                {/* Método de Pagamento */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Método de Pagamento</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={paymentMethod === 'credits' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod('credits')}
                      className="flex flex-col items-center p-2 h-auto"
                    >
                      <Coins className="h-4 w-4 mb-1 text-primary" />
                      <span className="text-xs">Créditos</span>
                      <span className="text-xs font-mono">{userCredits.toLocaleString()}</span>
                    </Button>
                    
                    {pixelData.specialCreditsPrice && (
                      <Button
                        variant={paymentMethod === 'special' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('special')}
                        className="flex flex-col items-center p-2 h-auto"
                      >
                        <Gift className="h-4 w-4 mb-1 text-accent" />
                        <span className="text-xs">Especiais</span>
                        <span className="text-xs font-mono">{userSpecialCredits.toLocaleString()}</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Validação de Saldo */}
                {!canAfford && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-500 text-center flex items-center justify-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Saldo insuficiente
                    </p>
                  </div>
                )}
                
                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    disabled={!canAfford || isProcessing}
                    className="flex-1 bg-gradient-to-r from-primary via-accent to-purple-500 hover:from-primary/90 hover:via-accent/90 hover:to-purple-500/90 text-white font-semibold shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Criar Obra
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}