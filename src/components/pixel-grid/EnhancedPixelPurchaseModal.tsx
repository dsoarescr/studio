
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
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Brush, Eraser, PaintBucket, Pipette, Square, Circle, Triangle,
  Type, Image, Palette, Sparkles, Wand2, Layers, Copy, RotateCcw,
  Download, Share2, Heart, Star, Zap, Crown, Shield, Lock, Unlock,
  Eye, EyeOff, Settings, Trash2, Plus, Minus, Move, Crop, Filter, Smile,
  X, Undo, Redo, ZoomIn, ZoomOut, ShoppingCart, Upload, Shuffle, Leaf,
  Cat, Gift, Hash, ExternalLink, Navigation, ThumbsUp, MessageSquare, User, UserPlus, Activity, Calendar, Clock, Users, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo } from '@/lib/utils';


interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  color?: string;
  title?: string;
  description?: string;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  specialCreditsPrice?: number;
  history: Array<{ owner: string; date: string; price?: number }>;
  views: number;
  likes: number;
  isProtected?: boolean;
}

interface EnhancedPixelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: SelectedPixelDetails | null;
  userCredits: number;

  onPurchase: (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: Record<string, unknown>) => Promise<boolean>;
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

interface StickerElement {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  isSelected: boolean;
}

interface ShapeElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart' | 'diamond' | 'cross';
  x: number;
  y: number;
  size: number;
  color: string;
  isSelected: boolean;
  rotation: number;
}

// Novas interfaces para funcionalidades avançadas
interface PaymentOption {
  id: string;
  name: string;
  currency: string;
  symbol: string;
  rate: number;
  installments?: number[];
  icon: React.ReactNode;
}



interface AuctionBid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

interface CrowdfundingContribution {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  timestamp: Date;
  message?: string;
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

// Dados mock para funcionalidades avançadas
const paymentOptions: PaymentOption[] = [
  { id: 'eur', name: 'Euro', currency: 'EUR', symbol: '€', rate: 1, installments: [1, 3, 6, 12], icon: <span>€</span> },
  { id: 'usd', name: 'Dólar', currency: 'USD', symbol: '$', rate: 1.1, installments: [1, 3, 6, 12], icon: <span>$</span> },
  { id: 'btc', name: 'Bitcoin', currency: 'BTC', symbol: '₿', rate: 0.000025, icon: <span>₿</span> },
  { id: 'eth', name: 'Ethereum', currency: 'ETH', symbol: 'Ξ', rate: 0.0004, icon: <span>Ξ</span> },
];



const mockAuctionBids: AuctionBid[] = [
  { id: '1', userId: 'user1', userName: 'PixelInvestor', amount: 25, currency: 'EUR', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', userId: 'user2', userName: 'ArtCollector', amount: 30, currency: 'EUR', timestamp: new Date(Date.now() - 1800000) },
  { id: '3', userId: 'user3', userName: 'DigitalArtist', amount: 35, currency: 'EUR', timestamp: new Date(Date.now() - 900000) },
];

const mockCrowdfundingContributions: CrowdfundingContribution[] = [
  { id: '1', userId: 'user1', userName: 'Supporter1', amount: 5, currency: 'EUR', timestamp: new Date(Date.now() - 7200000), message: 'Apoio este projeto!' },
  { id: '2', userId: 'user2', userName: 'Supporter2', amount: 10, currency: 'EUR', timestamp: new Date(Date.now() - 3600000), message: 'Excelente ideia!' },
  { id: '3', userId: 'user3', userName: 'Supporter3', amount: 15, currency: 'EUR', timestamp: new Date(Date.now() - 1800000), message: 'Vamos fazer acontecer!' },
];

const mockComments = [
  { id: '1', author: 'PixelArtist', content: 'Excelente trabalho!', timestamp: new Date(Date.now()) },
  { id: '2', author: 'ArtCollector', content: 'Muito criativo!', timestamp: new Date(Date.now()) },
  { id: '3', author: 'DigitalCreator', content: 'Adorei as cores!', timestamp: new Date(Date.now()) },
];

export default function EnhancedPixelPurchaseModal({
  isOpen,
  onClose,
  pixelData,
  userCredits,

  onPurchase
}: EnhancedPixelPurchaseModalProps) {
  // Estados principais
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(100);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Estados do canvas e camadas
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [canvasZoom, setCanvasZoom] = useState(100);
  
  // Estados de personalização
  const [pixelTitle, setPixelTitle] = useState('');
  const [pixelDescription, setPixelDescription] = useState('');
  const [pixelLink, setPixelLink] = useState('');


  
  // Estados de animação
  const [isAnimated, setIsAnimated] = useState(false);

  
  // Estados de interface
  const [activeTab, setActiveTab] = useState('draw');
  const [showGrid, setShowGrid] = useState(true);

  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Estados para funcionalidades avançadas
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('eur');
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showAuction, setShowAuction] = useState(false);
  const [auctionBids, setAuctionBids] = useState<AuctionBid[]>([]);
  const [showCrowdfunding, setShowCrowdfunding] = useState(false);
  const [crowdfundingContributions, setCrowdfundingContributions] = useState<CrowdfundingContribution[]>([]);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [reservationDuration, setReservationDuration] = useState(24); // horas
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showBusinessFeatures, setShowBusinessFeatures] = useState(false);
  const [showSocialFeatures, setShowSocialFeatures] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  
  // Estados de cores
  const [colorHistory, setColorHistory] = useState<string[]>(['#D4A757', '#7DF9FF', '#FF6B6B', '#4CAF50']);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [recordingFrames, setRecordingFrames] = useState<AnimationFrame[]>([]);
  const [gridSize, setGridSize] = useState(8);
  const [selectedPalette, setSelectedPalette] = useState('portugal');
  
     // Estados para stickers móveis
   const [stickers, setStickers] = useState<StickerElement[]>([]);
   const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
   const [isDraggingSticker, setIsDraggingSticker] = useState(false);
   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

   // Estados para formas geométricas móveis
   const [shapes, setShapes] = useState<ShapeElement[]>([]);
   const [selectedShape, setSelectedShape] = useState<string | null>(null);
   const [isDraggingShape, setIsDraggingShape] = useState(false);
   const [shapeDragOffset, setShapeDragOffset] = useState({ x: 0, y: 0 });

  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const { addCredits, addXp, removeCredits } = useUserStore();
  const { vibrate } = useHapticFeedback();

  // Funções para funcionalidades avançadas
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
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        saveToHistory();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        toast({
          title: "Imagem aplicada!",
          description: "A imagem foi aplicada ao canvas com sucesso.",
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  

  const handleCouponApply = () => {
    if (couponCode === 'DESCONTO20') {
      setCouponDiscount(20);
      toast({
        title: "Cupão aplicado!",
        description: "Desconto de 20% aplicado.",
      });
    } else if (couponCode === 'PIXEL50') {
      setCouponDiscount(50);
      toast({
        title: "Cupão aplicado!",
        description: "Desconto de 50% aplicado.",
      });
    } else {
      toast({
        title: "Cupão inválido",
        description: "O código do cupão não é válido.",
        variant: "destructive"
      });
    }
  };

  const handleAuctionBid = (amount: number) => {
    const newBid: AuctionBid = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Utilizador Atual',
      amount,
      currency: 'EUR',
      timestamp: new Date(Date.now()),
    };
    setAuctionBids(prev => [newBid, ...prev]);
    toast({
      title: "Lance realizado!",
      description: `Lance de ${amount}€ registado.`,
    });
  };

  const handleCrowdfundingContribution = (amount: number, message?: string) => {
    const newContribution: CrowdfundingContribution = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Utilizador Atual',
      amount,
      currency: 'EUR',
      timestamp: new Date(Date.now()),
      message,
    };
    setCrowdfundingContributions(prev => [newContribution, ...prev]);
    toast({
      title: "Contribuição registada!",
      description: `Contribuição de ${amount}€ adicionada.`,
    });
  };

  const handleGiftPixel = (amount?: number) => {
    if (giftRecipient) {
      const giftAmount = amount || pixelData?.price || 0;
      toast({
        title: "Pixel oferecido!",
        description: `Pixel oferecido a ${giftRecipient} por €${giftAmount}.`,
      });
    }
  };

  const handleReservePixel = () => {
    toast({
      title: "Pixel reservado!",
      description: `Pixel reservado por ${reservationDuration} horas.`,
    });
  };

  const handleAnimationToggle = () => {
    setIsAnimating(!isAnimating);
    toast({
      title: isAnimating ? "Animação parada" : "Animação iniciada",
      description: isAnimating ? "A animação foi parada." : "A animação foi iniciada.",
    });
  };

  // Remover efeito selecionado
  const removeEffect = (effectId: string) => {
    setSelectedEffects(prev => prev.filter(effect => effect !== effectId));
    toast({
      title: "Efeito removido!",
      description: `Efeito ${effectId} removido da lista.`,
    });
  };

  // Limpar todos os efeitos
  const clearAllEffects = () => {
    setSelectedEffects([]);
    toast({
      title: "Efeitos limpos!",
      description: "Todos os efeitos foram removidos.",
    });
  };
  
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
        
        // Configurar contexto para melhor renderização
        ctx.imageSmoothingEnabled = false; // Desabilitar suavização para pixels nítidos
        ctx.imageSmoothingQuality = 'high';
        
        // Fundo transparente
        ctx.clearRect(0, 0, 64, 64);
        
        // Salvar estado inicial
        const initialState = ctx.getImageData(0, 0, 64, 64);
        setCanvasHistory([initialState]);
        setHistoryIndex(0);
      }
    }
  }, [isOpen]);

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
  const applySymmetry = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
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
  }, [brushSize, symmetryMode]);


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
        
             case 'line':
       case 'rectangle':
       case 'circle':
       case 'triangle':
       case 'star':
       case 'heart':
       case 'diamond':
       case 'cross':
         if (isStart) {
           // Criar forma móvel em vez de desenhar diretamente
           const newShape: ShapeElement = {
             id: Date.now().toString(),
             type: selectedTool as any,
             x: canvasX,
             y: canvasY,
             size: brushSize * 2,
             color: selectedColor,
             isSelected: true,
             rotation: 0
           };
           
           setShapes(prev => prev.map(s => ({ ...s, isSelected: false })).concat(newShape));
           setSelectedShape(newShape.id);
           
           toast({
             title: "Forma criada!",
             description: `${selectedTool} adicionada. Clique e arraste para mover!`,
           });
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
  }, [selectedTool, selectedColor, brushSize, brushOpacity, lastPoint, symmetryMode, vibrate, applySymmetry]);

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
        
      case 'shadow':
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalCompositeOperation = 'source-over';
        break;
        
      case 'neon':
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        break;
        
      case 'hologram':
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        break;
        
      case 'glitch':
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 16) {
          if (Math.random() > 0.95) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
        }
        ctx.putImageData(imageData, 0, 0);
        break;
        
      case 'vintage':
        const vintageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const vintageArray = vintageData.data;
        for (let i = 0; i < vintageArray.length; i += 4) {
          vintageArray[i] = Math.min(255, vintageArray[i] * 1.2); // Mais vermelho
          vintageArray[i + 1] = Math.min(255, vintageArray[i + 1] * 0.9); // Menos verde
          vintageArray[i + 2] = Math.min(255, vintageArray[i + 2] * 0.7); // Menos azul
        }
        ctx.putImageData(vintageData, 0, 0);
        break;
    }
    
    // Adicionar efeito à lista de efeitos selecionados
    setSelectedEffects(prev => [...prev, effectId]);
    
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

  // Adicionar sticker móvel
  const addSticker = (sticker: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
         // Criar novo sticker móvel
     const newSticker: StickerElement = {
       id: Date.now().toString(),
       emoji: sticker,
       x: canvas.width / 2,
       y: canvas.height / 2,
       size: 16, // Tamanho inicial mais pequeno
       isSelected: false
     };
    
    setStickers(prev => [...prev, newSticker]);
    
    // Desselecionar outros stickers
    setSelectedSticker(newSticker.id);
    setStickers(prev => prev.map(s => ({ ...s, isSelected: s.id === newSticker.id })));
    
    vibrate('medium');
    
    toast({
      title: "🎭 Sticker Adicionado!",
      description: `${sticker} adicionado. Clique e arraste para mover!`,
    });
  };

  // Selecionar sticker
  const selectSticker = (stickerId: string) => {
    setSelectedSticker(stickerId);
    setStickers(prev => prev.map(s => ({ ...s, isSelected: s.id === stickerId })));
  };

  // Mover sticker
  const moveSticker = (stickerId: string, newX: number, newY: number) => {
    setStickers(prev => prev.map(s => 
      s.id === stickerId ? { ...s, x: newX, y: newY } : s
    ));
  };

  // Redimensionar sticker
  const resizeSticker = (stickerId: string, newSize: number) => {
    const clampedSize = Math.max(4, Math.min(48, newSize)); // Permitir tamanhos de 4px a 48px
    setStickers(prev => prev.map(s => 
      s.id === stickerId ? { ...s, size: clampedSize } : s
    ));
    
    // Feedback visual
    toast({
      title: "Tamanho alterado!",
      description: `Tamanho do sticker: ${clampedSize}px`,
    });
  };

  // Remover sticker
  const removeSticker = (stickerId: string) => {
    setStickers(prev => prev.filter(s => s.id !== stickerId));
    if (selectedSticker === stickerId) {
      setSelectedSticker(null);
    }
    toast({
      title: "🗑️ Sticker Removido!",
      description: "Sticker removido com sucesso.",
    });
  };

     // Limpar todos os stickers
   const clearAllStickers = () => {
     setStickers([]);
     setSelectedSticker(null);
     toast({
       title: "🧹 Stickers Limpos!",
       description: "Todos os stickers foram removidos.",
     });
   };

   // Funções para formas geométricas
   const selectShape = (shapeId: string) => {
     setSelectedShape(shapeId);
     setShapes(prev => prev.map(s => ({ ...s, isSelected: s.id === shapeId })));
   };

   const moveShape = (shapeId: string, newX: number, newY: number) => {
     setShapes(prev => prev.map(s => 
       s.id === shapeId ? { ...s, x: newX, y: newY } : s
     ));
   };

   const resizeShape = (shapeId: string, newSize: number) => {
     const clampedSize = Math.max(4, Math.min(48, newSize));
     setShapes(prev => prev.map(s => 
       s.id === shapeId ? { ...s, size: clampedSize } : s
     ));
     
     toast({
       title: "Tamanho alterado!",
       description: `Tamanho da forma: ${clampedSize}px`,
     });
   };

   const rotateShape = (shapeId: string, newRotation: number) => {
     setShapes(prev => prev.map(s => 
       s.id === shapeId ? { ...s, rotation: newRotation } : s
     ));
   };

   const changeShapeColor = (shapeId: string, newColor: string) => {
     setShapes(prev => prev.map(s => 
       s.id === shapeId ? { ...s, color: newColor } : s
     ));
   };

   const removeShape = (shapeId: string) => {
     setShapes(prev => prev.filter(s => s.id !== shapeId));
     if (selectedShape === shapeId) {
       setSelectedShape(null);
     }
     toast({
       title: "🗑️ Forma Removida!",
       description: "Forma removida com sucesso.",
     });
   };

   const clearAllShapes = () => {
     setShapes([]);
     setSelectedShape(null);
     toast({
       title: "🧹 Formas Limpas!",
       description: "Todas as formas foram removidas.",
     });
   };



     // Limpar canvas
   const clearCanvas = () => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     
     const ctx = canvas.getContext('2d');
     if (!ctx) return;
     
     saveToHistory();
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     
     // Limpar também os stickers e formas
     setStickers([]);
     setSelectedSticker(null);
     setShapes([]);
     setSelectedShape(null);
     
     vibrate('medium');
     
     toast({
       title: "🗑️ Canvas Limpo",
       description: "Canvas, stickers e formas foram limpos com sucesso.",
     });
   };

     // Exportar canvas com stickers e formas
   const exportCanvas = () => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     
     // Criar canvas temporário para incluir stickers e formas
     const tempCanvas = document.createElement('canvas');
     tempCanvas.width = canvas.width;
     tempCanvas.height = canvas.height;
     const tempCtx = tempCanvas.getContext('2d');
     
     if (tempCtx) {
       // Copiar conteúdo do canvas original
       tempCtx.drawImage(canvas, 0, 0);
       
       // Desenhar formas
       shapes.forEach(shape => {
         tempCtx.save();
         tempCtx.translate(shape.x, shape.y);
         tempCtx.rotate(shape.rotation * Math.PI / 180);
         tempCtx.strokeStyle = shape.color;
         tempCtx.fillStyle = shape.color;
         tempCtx.lineWidth = 2;
         
         const size = shape.size;
         
         switch (shape.type) {
           case 'line':
             tempCtx.beginPath();
             tempCtx.moveTo(-size, 0);
             tempCtx.lineTo(size, 0);
             tempCtx.stroke();
             break;
             
           case 'rectangle':
             tempCtx.strokeRect(-size/2, -size/2, size, size);
             break;
             
           case 'circle':
             tempCtx.beginPath();
             tempCtx.arc(0, 0, size/2, 0, Math.PI * 2);
             tempCtx.stroke();
             break;
             
           case 'triangle':
             tempCtx.beginPath();
             tempCtx.moveTo(0, -size/2);
             tempCtx.lineTo(-size/2, size/2);
             tempCtx.lineTo(size/2, size/2);
             tempCtx.closePath();
             tempCtx.stroke();
             break;
             
           case 'star':
             tempCtx.beginPath();
             for (let i = 0; i < 5; i++) {
               const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
               const x = size/2 * Math.cos(angle);
               const y = size/2 * Math.sin(angle);
               if (i === 0) tempCtx.moveTo(x, y);
               else tempCtx.lineTo(x, y);
             }
             tempCtx.closePath();
             tempCtx.stroke();
             break;
             
           case 'heart':
             tempCtx.beginPath();
             tempCtx.moveTo(0, size/3);
             tempCtx.bezierCurveTo(-size/2, 0, -size/2, -size/2, 0, -size/2);
             tempCtx.bezierCurveTo(size/2, -size/2, size/2, 0, 0, size/3);
             tempCtx.stroke();
             break;
             
           case 'diamond':
             tempCtx.beginPath();
             tempCtx.moveTo(0, -size/2);
             tempCtx.lineTo(size/2, 0);
             tempCtx.lineTo(0, size/2);
             tempCtx.lineTo(-size/2, 0);
             tempCtx.closePath();
             tempCtx.stroke();
             break;
             
           case 'cross':
             tempCtx.beginPath();
             tempCtx.moveTo(-size/2, 0);
             tempCtx.lineTo(size/2, 0);
             tempCtx.moveTo(0, -size/2);
             tempCtx.lineTo(0, size/2);
             tempCtx.stroke();
             break;
         }
         
         tempCtx.restore();
       });
       
       // Desenhar stickers
       stickers.forEach(sticker => {
         tempCtx.imageSmoothingEnabled = false;
         tempCtx.textBaseline = 'middle';
         tempCtx.textAlign = 'center';
         tempCtx.font = `${sticker.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", "EmojiOne Mozilla", "Twemoji Mozilla", "Segoe UI Symbol", Arial, sans-serif`;
         tempCtx.fillStyle = '#000000';
         tempCtx.fillText(sticker.emoji, sticker.x, sticker.y);
       });
     }
     
     const link = document.createElement('a');
     link.download = `pixel-${pixelData?.x}-${pixelData?.y}.png`;
     link.href = tempCanvas.toDataURL();
     link.click();
     
     vibrate('medium');
     
     toast({
       title: "📥 Canvas Exportado!",
       description: "Canvas com stickers e formas exportado com sucesso.",
     });
   };

  // Gerar cores aleatórias
  const generateRandomColors = () => {
    const newColors = Array.from({ length: 8 }, () => 
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
    
    setColorHistory(newColors);
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

    

    // Aplicar desconto de cupão
    if (couponDiscount > 0) {
      total = total * (1 - couponDiscount / 100);
    }

    // Aplicar desconto de parcelamento (se aplicável)
    if (selectedInstallments > 1) {
      total = total * 1.05; // 5% de juros para parcelamento
    }

    // Converter para moeda selecionada
    const selectedPayment = paymentOptions.find(p => p.id === selectedPaymentMethod);
    if (selectedPayment) {
      total = total * selectedPayment.rate;
    }
    
    return Math.round(total * 100) / 100; // Arredondar para 2 casas decimais
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
        animationFrames: recordingFrames,
        stickers: stickers,
        shapes: shapes
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
    } catch {
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

     // Event handlers para desenho, stickers e formas
   const handlePointerDown = (e: React.PointerEvent) => {
     e.preventDefault();
     
     const rect = canvasRef.current?.getBoundingClientRect();
     if (!rect) return;
     
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;
     
     // Verificar se clicou em uma forma
     const clickedShape = shapes.find(shape => {
       const shapeScreenX = (shape.x / 64) * rect.width;
       const shapeScreenY = (shape.y / 64) * rect.height;
       const shapeScreenSize = (shape.size / 64) * rect.width;
       
       const distanceX = Math.abs(x - shapeScreenX);
       const distanceY = Math.abs(y - shapeScreenY);
       
       return distanceX < shapeScreenSize/2 && distanceY < shapeScreenSize/2;
     });
     
     if (clickedShape) {
       // Selecionar forma
       selectShape(clickedShape.id);
       
       // Iniciar drag
       setIsDraggingShape(true);
       setShapeDragOffset({
         x: x - (clickedShape.x / 64) * rect.width,
         y: y - (clickedShape.y / 64) * rect.height
       });
       
       return;
     }
     
     // Verificar se clicou em um sticker
     const clickedSticker = stickers.find(sticker => {
       // Converter coordenadas do sticker para coordenadas da tela
       const stickerScreenX = (sticker.x / 64) * rect.width;
       const stickerScreenY = (sticker.y / 64) * rect.height;
       const stickerScreenSize = (sticker.size / 64) * rect.width;
       
       // Verificar se o clique está dentro do sticker
       const distanceX = Math.abs(x - stickerScreenX);
       const distanceY = Math.abs(y - stickerScreenY);
       
       return distanceX < stickerScreenSize/2 && distanceY < stickerScreenSize/2;
     });
     
     if (clickedSticker) {
       // Selecionar sticker
       selectSticker(clickedSticker.id);
       
       // Iniciar drag
       setIsDraggingSticker(true);
       setDragOffset({
         x: x - (clickedSticker.x / 64) * rect.width,
         y: y - (clickedSticker.y / 64) * rect.height
       });
       
       return;
     }
     
     // Se não clicou em nada, deselecionar todos
     setSelectedSticker(null);
     setStickers(prev => prev.map(s => ({ ...s, isSelected: false })));
     setSelectedShape(null);
     setShapes(prev => prev.map(s => ({ ...s, isSelected: false })));
     
     // Continuar com desenho normal
     setIsDrawing(true);
     draw(x, y, true);
   };

     const handlePointerMove = (e: React.PointerEvent) => {
     e.preventDefault();
     
     const rect = canvasRef.current?.getBoundingClientRect();
     if (!rect) return;
     
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;
     
     // Mover forma se estiver arrastando
     if (isDraggingShape && selectedShape) {
       // Converter coordenadas da tela para coordenadas do canvas (0-64)
       const newX = ((x - shapeDragOffset.x) / rect.width) * 64;
       const newY = ((y - shapeDragOffset.y) / rect.height) * 64;
       
       // Limitar ao canvas
       const clampedX = Math.max(0, Math.min(64, newX));
       const clampedY = Math.max(0, Math.min(64, newY));
       
       moveShape(selectedShape, clampedX, clampedY);
       return;
     }
     
     // Mover sticker se estiver arrastando
     if (isDraggingSticker && selectedSticker) {
       // Converter coordenadas da tela para coordenadas do canvas (0-64)
       const newX = ((x - dragOffset.x) / rect.width) * 64;
       const newY = ((y - dragOffset.y) / rect.height) * 64;
       
       // Limitar ao canvas
       const clampedX = Math.max(0, Math.min(64, newX));
       const clampedY = Math.max(0, Math.min(64, newY));
       
       moveSticker(selectedSticker, clampedX, clampedY);
       return;
     }
     
     // Continuar com desenho normal
     if (!isDrawing) return;
     draw(x, y, false);
   };

     const handlePointerUp = () => {
     // Parar de arrastar forma
     if (isDraggingShape) {
       setIsDraggingShape(false);
       setShapeDragOffset({ x: 0, y: 0 });
     }
     
     // Parar de arrastar sticker
     if (isDraggingSticker) {
       setIsDraggingSticker(false);
       setDragOffset({ x: 0, y: 0 });
     }
     
     // Parar de desenhar
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
               
                                                               {/* Overlay para stickers e formas */}
                 <div 
                   className="absolute inset-0 pointer-events-none"
                   style={{
                     transform: `scale(${canvasZoom / 100})`,
                     transformOrigin: 'center'
                   }}
                 >
                   {/* Renderizar formas */}
                   {shapes.map((shape) => (
                     <div
                       key={shape.id}
                       className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-move ${
                         shape.isSelected ? 'ring-2 ring-primary ring-offset-1' : ''
                       }`}
                       style={{
                         left: `${(shape.x / 64) * 280}px`,
                         top: `${(shape.y / 64) * 280}px`,
                         width: `${(shape.size / 64) * 280}px`,
                         height: `${(shape.size / 64) * 280}px`,
                         userSelect: 'none',
                         zIndex: shape.isSelected ? 10 : 5,
                         transform: `rotate(${shape.rotation}deg)`
                       }}
                       onPointerDown={(e) => {
                         e.stopPropagation();
                         selectShape(shape.id);
                         
                         // Iniciar drag diretamente no overlay
                         setIsDraggingShape(true);
                         const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                         if (rect) {
                           setShapeDragOffset({
                             x: e.clientX - rect.left - (shape.x / 64) * 280,
                             y: e.clientY - rect.top - (shape.y / 64) * 280
                           });
                         }
                       }}
                     >
                       <svg
                         width="100%"
                         height="100%"
                         viewBox="-50 -50 100 100"
                         style={{ color: shape.color }}
                       >
                         {shape.type === 'line' && (
                           <line x1="-40" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="4" />
                         )}
                         {shape.type === 'rectangle' && (
                           <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4" />
                         )}
                         {shape.type === 'circle' && (
                           <circle cx="0" cy="0" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
                         )}
                         {shape.type === 'triangle' && (
                           <polygon points="0,-40 -40,40 40,40" fill="none" stroke="currentColor" strokeWidth="4" />
                         )}
                         {shape.type === 'star' && (
                           <polygon
                             points="0,-40 12,-12 40,-12 20,8 32,36 0,20 -32,36 -20,8 -40,-12 -12,-12"
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="4"
                           />
                         )}
                         {shape.type === 'heart' && (
                           <path
                             d="M0,20 Q-20,0 -20,-20 Q-20,-40 0,-40 Q20,-40 20,-20 Q20,0 0,20"
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="4"
                           />
                         )}
                         {shape.type === 'diamond' && (
                           <polygon points="0,-40 40,0 0,40 -40,0" fill="none" stroke="currentColor" strokeWidth="4" />
                         )}
                         {shape.type === 'cross' && (
                           <>
                             <line x1="-40" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="4" />
                             <line x1="0" y1="-40" x2="0" y2="40" stroke="currentColor" strokeWidth="4" />
                           </>
                         )}
                       </svg>
                     </div>
                   ))}
                   
                   {/* Renderizar stickers */}
                   {stickers.map((sticker) => (
                     <div
                       key={sticker.id}
                       className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-move ${
                         sticker.isSelected ? 'ring-2 ring-primary ring-offset-1' : ''
                       }`}
                       style={{
                         left: `${(sticker.x / 64) * 280}px`,
                         top: `${(sticker.y / 64) * 280}px`,
                         fontSize: `${(sticker.size / 64) * 280}px`,
                         lineHeight: '1',
                         userSelect: 'none',
                         zIndex: sticker.isSelected ? 10 : 5
                       }}
                       onPointerDown={(e) => {
                         e.stopPropagation();
                         selectSticker(sticker.id);
                         
                         // Iniciar drag diretamente no overlay
                         setIsDraggingSticker(true);
                         const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                         if (rect) {
                           setDragOffset({
                             x: e.clientX - rect.left - (sticker.x / 64) * 280,
                             y: e.clientY - rect.top - (sticker.y / 64) * 280
                           });
                         }
                       }}
                     >
                       {sticker.emoji}
                     </div>
                   ))}
                 </div>
              
              {/* Overlay de grelha */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none border-2 border-primary/50 rounded-lg"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(212, 167, 87, 0.3) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(212, 167, 87, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: `${"280"}/${gridSize}px ${"280"}/${gridSize}px`,
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
              <TabsList className="grid w-full grid-cols-8 h-12 bg-card/50">
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
                                 <TabsTrigger value="ferramentas" className="flex flex-col gap-1 h-full">
                   <Square className="h-4 w-4" />
                   <span className="text-xs">Ferramentas</span>
                 </TabsTrigger>
                <TabsTrigger value="pagamento" className="flex flex-col gap-1 h-full">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs">Pagamento</span>
                </TabsTrigger>
                <TabsTrigger value="negocio" className="flex flex-col gap-1 h-full">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Negócio</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex flex-col gap-1 h-full">
                  <User className="h-4 w-4" />
                  <span className="text-xs">Social</span>
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
                   {/* Controles de stickers */}
                   <div className="flex items-center justify-between mb-3">
                     <Label className="text-sm font-medium">Stickers Móveis</Label>
                     <div className="flex gap-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={clearAllStickers}
                         className="h-8 text-xs"
                       >
                         <Trash2 className="h-3 w-3 mr-1" />
                         Limpar
                       </Button>
                     </div>
                   </div>
                   
                   {/* Lista de stickers ativos */}
                   {stickers.length > 0 && (
                     <div className="mb-4 p-3 border rounded-lg bg-muted/20">
                       <Label className="text-sm font-medium mb-2 block">Stickers Ativos ({stickers.length})</Label>
                       <div className="space-y-2 max-h-20 overflow-y-auto">
                         {stickers.map((sticker) => (
                           <div
                             key={sticker.id}
                             className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                               sticker.isSelected ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'
                             }`}
                             onClick={() => selectSticker(sticker.id)}
                           >
                             <div className="flex items-center gap-2">
                               <span className="text-lg">{sticker.emoji}</span>
                               <span className="text-xs text-muted-foreground">
                                 ({Math.round(sticker.x)}, {Math.round(sticker.y)})
                               </span>
                             </div>
                             <div className="flex items-center gap-1">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   resizeSticker(sticker.id, sticker.size - 2);
                                 }}
                                 className="h-6 w-6 p-0"
                               >
                                 <Minus className="h-3 w-3" />
                               </Button>
                               <span className="text-xs w-8 text-center">{sticker.size}px</span>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   resizeSticker(sticker.id, sticker.size + 2);
                                 }}
                                 className="h-6 w-6 p-0"
                               >
                                 <Plus className="h-3 w-3" />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   removeSticker(sticker.id);
                                 }}
                                 className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                               >
                                 <X className="h-3 w-3" />
                               </Button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {/* Categorias de stickers */}
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
                            onClick={() => setSymmetryMode(mode.id as 'none' | 'horizontal' | 'vertical' | 'both')}
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

                             {/* Nova Aba: Ferramentas Avançadas */}
               <TabsContent value="ferramentas" className="p-4 max-h-64 overflow-y-auto">
                 <div className="space-y-4">
                                       {/* Formas Geométricas */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Formas Geométricas</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllShapes}
                          className="h-8 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Limpar
                        </Button>
                      </div>
                      
                      {/* Lista de formas ativas */}
                      {shapes.length > 0 && (
                        <div className="mb-4 p-3 border rounded-lg bg-muted/20">
                          <Label className="text-sm font-medium mb-2 block">Formas Ativas ({shapes.length})</Label>
                          <div className="space-y-2 max-h-20 overflow-y-auto">
                            {shapes.map((shape) => (
                              <div
                                key={shape.id}
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                                  shape.isSelected ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'
                                }`}
                                onClick={() => selectShape(shape.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4" style={{ color: shape.color }}>
                                    {shape.type === 'line' && <Minus className="h-4 w-4" />}
                                    {shape.type === 'rectangle' && <Square className="h-4 w-4" />}
                                    {shape.type === 'circle' && <Circle className="h-4 w-4" />}
                                    {shape.type === 'triangle' && <Triangle className="h-4 w-4" />}
                                    {shape.type === 'star' && <Star className="h-4 w-4" />}
                                    {shape.type === 'heart' && <Heart className="h-4 w-4" />}
                                    {shape.type === 'diamond' && <div className="w-4 h-4 bg-current transform rotate-45" />}
                                    {shape.type === 'cross' && <Plus className="h-4 w-4" />}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    ({Math.round(shape.x)}, {Math.round(shape.y)})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      resizeShape(shape.id, shape.size - 2);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs w-8 text-center">{shape.size}px</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      resizeShape(shape.id, shape.size + 2);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      rotateShape(shape.id, shape.rotation + 45);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeShape(shape.id);
                                    }}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'line', name: 'Linha', icon: <Minus className="h-4 w-4" /> },
                          { id: 'rectangle', name: 'Retângulo', icon: <Square className="h-4 w-4" /> },
                          { id: 'circle', name: 'Círculo', icon: <Circle className="h-4 w-4" /> },
                          { id: 'triangle', name: 'Triângulo', icon: <Triangle className="h-4 w-4" /> },
                          { id: 'star', name: 'Estrela', icon: <Star className="h-4 w-4" /> },
                          { id: 'heart', name: 'Coração', icon: <Heart className="h-4 w-4" /> },
                          { id: 'diamond', name: 'Diamante', icon: <div className="w-4 h-4 bg-current transform rotate-45" /> },
                          { id: 'cross', name: 'Cruz', icon: <Plus className="h-4 w-4" /> }
                        ].map((shape) => (
                          <Button
                            key={shape.id}
                            variant={selectedTool === shape.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTool(shape.id)}
                            className="h-12 flex flex-col gap-1"
                          >
                            {shape.icon}
                            <span className="text-xs">{shape.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                   {/* Ferramentas de Texto */}
                   <div>
                     <Label className="text-sm font-medium mb-2 block">Texto e Símbolos</Label>
                     <div className="space-y-2">
                       <div className="flex gap-2">
                         <Button
                           variant={selectedTool === 'text' ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => setSelectedTool('text')}
                           className="flex-1"
                         >
                           <Type className="h-4 w-4 mr-1" />
                           Texto
                         </Button>
                         <Button
                           variant={selectedTool === 'emoji' ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => setSelectedTool('emoji')}
                           className="flex-1"
                         >
                           <Smile className="h-4 w-4 mr-1" />
                           Emoji
                         </Button>
                       </div>
                       <Input
                         placeholder="Digite texto ou emoji..."
                         className="text-sm"
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' && selectedTool === 'text') {
                             const canvas = canvasRef.current;
                             if (canvas) {
                               const ctx = canvas.getContext('2d');
                               if (ctx) {
                                 saveToHistory();
                                 ctx.fillStyle = selectedColor;
                                 ctx.font = '12px Arial';
                                 ctx.textAlign = 'center';
                                 ctx.fillText(e.currentTarget.value, canvas.width / 2, canvas.height / 2);
                                 e.currentTarget.value = '';
                               }
                             }
                           }
                         }}
                       />
                     </div>
                   </div>

                   {/* Upload de Imagem */}
                   <div>
                     <Label className="text-sm font-medium mb-2 block">Upload de Imagem</Label>
                     <div className="space-y-2">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleImageUpload}
                         className="hidden"
                         id="image-upload"
                       />
                       <label
                         htmlFor="image-upload"
                         className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                       >
                         <Upload className="h-6 w-6 mr-2" />
                         <span className="text-sm">Carregar Imagem</span>
                       </label>
                       {uploadedImage && (
                         <div className="text-xs text-green-600">✓ Imagem carregada</div>
                       )}
                     </div>
                   </div>

                   {/* Animação */}
                   <div>
                     <Label className="text-sm font-medium mb-2 block">Animação</Label>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="text-sm">Pixels Animados</span>
                         <Switch
                           checked={isAnimating}
                           onCheckedChange={handleAnimationToggle}
                         />
                       </div>
                       {isAnimating && (
                         <div className="text-xs text-muted-foreground">
                           Suporta GIF e vídeos curtos
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </TabsContent>

              {/* Nova Aba: Opções de Pagamento */}
              <TabsContent value="pagamento" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {/* Múltiplas Moedas */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Moeda de Pagamento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentOptions.map((option) => (
                        <Button
                          key={option.id}
                          variant={selectedPaymentMethod === option.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPaymentMethod(option.id)}
                          className="h-12 flex flex-col gap-1"
                        >
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-xs">{option.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Parcelamento */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Parcelamento</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 6, 12].map((installments) => (
                        <Button
                          key={installments}
                          variant={selectedInstallments === installments ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedInstallments(installments)}
                        >
                          {installments}x
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Cupões de Desconto */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Cupão de Desconto</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código do cupão"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleCouponApply}>
                        Aplicar
                      </Button>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="text-xs text-green-600">
                        ✓ Desconto de {couponDiscount}% aplicado
                      </div>
                    )}
                  </div>

                  {/* Subscrição */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Subscrição Premium</Label>
                    <div className="p-3 border rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pixel Premium</span>
                        <Badge variant="secondary">€9.99/mês</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Acesso a efeitos exclusivos, animações avançadas e suporte prioritário
                      </p>
                      <Button size="sm" className="w-full">
                        <Crown className="h-3 w-3 mr-1" />
                        Ativar Premium
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Nova Aba: Funcionalidades de Negócio */}
              <TabsContent value="negocio" className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {/* Leilão */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Sistema de Leilão</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ativar Leilão</span>
                        <Switch
                          checked={showAuction}
                          onCheckedChange={setShowAuction}
                        />
                      </div>
                      {showAuction && (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Lance atual: €{auctionBids.length > 0 ? Math.max(...auctionBids.map(b => b.amount)) : pixelData.price}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {[10, 25, 50].map((amount) => (
                              <Button
                                key={amount}
                                size="sm"
                                onClick={() => handleAuctionBid(amount)}
                              >
                                €{amount}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ofertas em Lote */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Ofertas em Lote</Label>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm font-medium mb-2">Comprar Múltiplos Pixels</div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {[1, 5, 10].map((count) => (
                          <Button key={count} size="sm" variant="outline">
                            {count} pixels
                          </Button>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Desconto de 10% em compras de 5+ pixels
                      </div>
                    </div>
                  </div>

                  {/* Reserva */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Reserva de Pixel</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={reservationDuration}
                          onChange={(e) => setReservationDuration(Number(e.target.value))}
                          className="w-20"
                          min="1"
                          max="168"
                        />
                        <span className="text-sm">horas</span>
                      </div>
                      <Button size="sm" onClick={handleReservePixel} className="w-full">
                        <Clock className="h-3 w-3 mr-1" />
                        Reservar Pixel
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Nova Aba: Integração Social - COMPLETAMENTE MELHORADA */}
              <TabsContent value="social" className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  {/* Seção: Presentes e Doações */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-pink-500" />
                      <Label className="text-base font-semibold">Presentes e Doações</Label>
                    </div>
                    
                    {/* Presentear Pixel */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Presentear Pixel</span>
                        <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                          <Heart className="h-3 w-3 mr-1" />
                          Amor
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nome do utilizador"
                            value={giftRecipient}
                            onChange={(e) => setGiftRecipient(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => setShowUserSearch(true)}>
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Mensagem personalizada (opcional)"
                          rows={2}
                          className="resize-none"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { amount: 5, label: 'Básico', icon: '🎁' },
                            { amount: 15, label: 'Premium', icon: '💎' },
                            { amount: 50, label: 'VIP', icon: '👑' }
                          ].map((option) => (
                            <Button
                              key={option.amount}
                              size="sm"
                              variant="outline"
                              onClick={() => handleGiftPixel(option.amount)}
                              className="flex flex-col gap-1 h-16"
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span className="text-xs">€{option.amount}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Doações para Caridade */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Doações para Caridade</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Heart className="h-3 w-3 mr-1" />
                          Solidariedade
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: 'Refugiados', icon: '🏠', color: 'bg-blue-100' },
                            { name: 'Crianças', icon: '👶', color: 'bg-pink-100' },
                            { name: 'Animais', icon: '🐾', color: 'bg-orange-100' },
                            { name: 'Ambiente', icon: '🌱', color: 'bg-green-100' }
                          ].map((cause) => (
                            <Button
                              key={cause.name}
                              size="sm"
                              variant="outline"
                              className={`h-12 flex flex-col gap-1 ${cause.color}`}
                            >
                              <span className="text-lg">{cause.icon}</span>
                              <span className="text-xs">{cause.name}</span>
                            </Button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Valor da doação"
                            type="number"
                            className="flex-1"
                          />
                          <Button size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Doar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção: Crowdfunding e Financiamento */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <Label className="text-base font-semibold">Crowdfunding e Financiamento</Label>
                    </div>
                    
                    {/* Crowdfunding Avançado */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Crowdfunding Comunitário</span>
                        <Switch
                          checked={showCrowdfunding}
                          onCheckedChange={setShowCrowdfunding}
                        />
                      </div>
                      {showCrowdfunding && (
                        <div className="space-y-4">
                          {/* Progresso do Crowdfunding */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Meta: €1000</span>
                              <span className="font-medium">
                                €{crowdfundingContributions.reduce((sum, c) => sum + c.amount, 0)}
                              </span>
                            </div>
                            <Progress 
                              value={(crowdfundingContributions.reduce((sum, c) => sum + c.amount, 0) / 1000) * 100} 
                              className="h-2"
                            />
                            <div className="text-xs text-muted-foreground">
                              {Math.round((crowdfundingContributions.reduce((sum, c) => sum + c.amount, 0) / 1000) * 100)}% da meta atingida
                            </div>
                          </div>
                          
                          {/* Contribuições Recentes */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Contribuições Recentes</span>
                            <div className="max-h-20 overflow-y-auto space-y-1">
                              {crowdfundingContributions.slice(0, 3).map((contribution) => (
                                <div key={contribution.id} className="flex items-center justify-between text-xs p-2 bg-white/50 rounded">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {contribution.userName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{contribution.userName}</span>
                                  </div>
                                  <span className="text-green-600 font-medium">€{contribution.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Botões de Contribuição */}
                          <div className="grid grid-cols-4 gap-2">
                            {[5, 10, 25, 50].map((amount) => (
                              <Button
                                key={amount}
                                size="sm"
                                onClick={() => handleCrowdfundingContribution(amount)}
                                className="h-10"
                              >
                                €{amount}
                              </Button>
                            ))}
                          </div>
                          
                          {/* Contribuição Personalizada */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Valor personalizado"
                              type="number"
                              className="flex-1"
                            />
                            <Button size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Patrocínio Empresarial */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Patrocínio Empresarial</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Business
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: 'Startup', icon: '🚀', price: '€100' },
                            { name: 'PME', icon: '🏢', price: '€500' },
                            { name: 'Corporação', icon: '🏭', price: '€2000' },
                            { name: 'Multinacional', icon: '🌍', price: '€10000' }
                          ].map((tier) => (
                            <div key={tier.name} className="p-3 border rounded-lg bg-white/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg">{tier.icon}</span>
                                <span className="text-sm font-medium">{tier.price}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">{tier.name}</div>
                              <Button size="sm" className="w-full text-xs">
                                Solicitar
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Programa de Parcerias
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Seção: Interação Social */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <Label className="text-base font-semibold">Interação Social</Label>
                    </div>
                    
                    {/* Sistema de Comentários */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Comentários e Feedback</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {mockComments.length} comentários
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Deixe um comentário sobre este pixel..."
                          rows={2}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comentar
                          </Button>
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Gostar
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Sistema de Avaliações */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Avaliação do Pixel</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className="text-yellow-400 hover:text-yellow-500 transition-colors"
                            >
                              <Star className="h-4 w-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: 'Criatividade', icon: '🎨' },
                            { name: 'Qualidade', icon: '⭐' },
                            { name: 'Originalidade', icon: '💡' },
                            { name: 'Impacto', icon: '💥' }
                          ].map((criteria) => (
                            <div key={criteria.name} className="flex items-center justify-between p-2 bg-white/50 rounded">
                              <div className="flex items-center gap-2">
                                <span>{criteria.icon}</span>
                                <span className="text-xs">{criteria.name}</span>
                              </div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    className="text-yellow-400 hover:text-yellow-500 transition-colors"
                                  >
                                    <Star className="h-3 w-3" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção: Eventos e Desafios */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <Label className="text-base font-semibold">Eventos e Desafios</Label>
                    </div>
                    
                    {/* Desafios Ativos */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Desafios Ativos</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Target className="h-3 w-3 mr-1" />
                          3 ativos
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Pixel Art Portuguesa', reward: '€500', participants: 45, icon: '🇵🇹' },
                          { name: 'Arte Digital', reward: '€300', participants: 32, icon: '🎨' },
                          { name: 'Inovação', reward: '€200', participants: 28, icon: '💡' }
                        ].map((challenge) => (
                          <div key={challenge.name} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{challenge.icon}</span>
                              <div>
                                <div className="font-medium text-sm">{challenge.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {challenge.participants} participantes
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">{challenge.reward}</div>
                              <Button size="sm" className="text-xs">
                                Participar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eventos Comunitários */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Eventos Comunitários</span>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                          <Calendar className="h-3 w-3 mr-1" />
                          Próximos
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Exposição Virtual', date: '15 Dez', time: '20:00', icon: '🖼️' },
                          { name: 'Workshop Pixel Art', date: '20 Dez', time: '15:00', icon: '🎨' },
                          { name: 'Leilão Beneficente', date: '25 Dez', time: '19:00', icon: '💰' }
                        ].map((event) => (
                          <div key={event.name} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{event.icon}</span>
                              <div>
                                <div className="font-medium text-sm">{event.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {event.date} às {event.time}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs">
                              Participar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Seção: Estatísticas Sociais */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-cyan-500" />
                      <Label className="text-base font-semibold">Estatísticas Sociais</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50">
                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-cyan-600">1,247</div>
                          <div className="text-sm text-muted-foreground">Visualizações</div>
                          <div className="text-xs text-green-600">+12% esta semana</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50">
                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-pink-600">89</div>
                          <div className="text-sm text-muted-foreground">Gostos</div>
                          <div className="text-xs text-green-600">+5 hoje</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-green-600">23</div>
                          <div className="text-sm text-muted-foreground">Comentários</div>
                          <div className="text-xs text-green-600">+3 esta semana</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50">
                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-purple-600">7</div>
                          <div className="text-sm text-muted-foreground">Partilhas</div>
                          <div className="text-xs text-green-600">+2 hoje</div>
                        </div>
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

              

              {couponDiscount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Desconto Cupão</span>
                  <span className="font-mono text-green-600">-{couponDiscount}%</span>
                </div>
              )}

              {selectedInstallments > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Parcelamento ({selectedInstallments}x)</span>
                  <span className="font-mono">+5%</span>
                </div>
              )}

              {selectedPaymentMethod !== 'eur' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Moeda: {paymentOptions.find(p => p.id === selectedPaymentMethod)?.name}</span>
                  <span className="font-mono text-xs">{paymentOptions.find(p => p.id === selectedPaymentMethod)?.symbol}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {selectedPaymentMethod !== 'eur' ? paymentOptions.find(p => p.id === selectedPaymentMethod)?.symbol : '€'}{calculateTotalPrice()}
                </span>
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

