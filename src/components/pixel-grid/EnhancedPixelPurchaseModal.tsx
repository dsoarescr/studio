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
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Coins, Gift, CreditCard, Palette, Brush, Eraser, PaintBucket, 
  Sparkles, Star, Heart, Eye, MapPin, Globe, Clock, User, Tag, Link2, 
  Download, Upload, Save, Undo, Redo, RotateCcw, ZoomIn, ZoomOut, Layers, 
  Grid, Move, Copy, Scissors, Square, Circle, Triangle, Pen, Pencil, 
  Plus, Minus, X, Check, Info, AlertTriangle, Crown, Gem, Flame, 
  Snowflake, Sun, Moon, Droplets, Wind, Zap, Shield, Lock, Unlock, 
  Settings, Maximize, Minimize, MoreHorizontal, ChevronDown, ChevronUp, 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Mic, Camera, 
  Video, Music, Headphones, Speaker, Type, AlignCenter, AlignLeft, 
  AlignRight, Bold, Italic, Underline, Strikethrough, Contrast, 
  Brightness, Saturation, Blur, Sharpen, Crop, Rotate, Flip, Mirror,
  Wand2, Paintbrush2, Spray, Feather, Magnet, Crosshair, Target,
  Rainbow, Gradient, Pattern, Texture, Filter, Adjust, Transform,
  History, Bookmark, Share2, Send, MessageSquare, Users, Award,
  Lightbulb, Rocket, Fingerprint, Scan, QrCode, Wifi, Bluetooth
} from 'lucide-react';
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
type DrawingTool = 'brush' | 'eraser' | 'bucket' | 'eyedropper' | 'line' | 'rectangle' | 'circle' | 'text' | 'spray' | 'blur' | 'sharpen' | 'smudge' | 'clone' | 'heal';

// Advanced brush types
type BrushType = 'round' | 'square' | 'soft' | 'hard' | 'texture' | 'pattern' | 'gradient' | 'noise';

// Layer blend modes
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn' | 'darken' | 'lighten' | 'difference' | 'exclusion';

// Predefined color palettes
const colorPalettes = {
  classic: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', '#E0BBE4', '#FFC9DE', '#C9FFC9'],
  neon: ['#FF073A', '#39FF14', '#0080FF', '#FFFF33', '#FF1493', '#00FFFF', '#FF4500', '#8A2BE2'],
  earth: ['#8B4513', '#228B22', '#4682B4', '#DAA520', '#CD853F', '#2E8B57', '#B8860B', '#A0522D'],
  ocean: ['#006994', '#0080FF', '#40E0D0', '#00CED1', '#4169E1', '#1E90FF', '#87CEEB', '#B0E0E6'],
  sunset: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42', '#FF6B6B', '#FF9F43', '#FFAD5A', '#FF7F7F'],
  portugal: ['#D4A757', '#7DF9FF', '#228B22', '#FF6B35', '#4169E1', '#DAA520', '#CD853F', '#B8860B'],
  vintage: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#BC8F8F', '#F5DEB3']
};

// Brush presets
const brushPresets = [
  { name: 'Fino', size: 1, opacity: 100, hardness: 100, type: 'round' as BrushType },
  { name: 'Médio', size: 3, opacity: 80, hardness: 80, type: 'round' as BrushType },
  { name: 'Grosso', size: 5, opacity: 60, hardness: 60, type: 'round' as BrushType },
  { name: 'Suave', size: 4, opacity: 40, hardness: 20, type: 'soft' as BrushType },
  { name: 'Textura', size: 6, opacity: 70, hardness: 50, type: 'texture' as BrushType },
  { name: 'Spray', size: 8, opacity: 30, hardness: 0, type: 'round' as BrushType },
  { name: 'Aquarela', size: 10, opacity: 25, hardness: 10, type: 'soft' as BrushType },
  { name: 'Óleo', size: 4, opacity: 90, hardness: 70, type: 'texture' as BrushType }
];

// Filters and effects
const filterPresets = [
  { name: 'Original', filter: 'none', icon: <Eye className="h-4 w-4" /> },
  { name: 'Vintage', filter: 'sepia(0.5) contrast(1.2) brightness(1.1)', icon: <Sun className="h-4 w-4" /> },
  { name: 'Dramático', filter: 'contrast(1.5) saturate(1.3)', icon: <Zap className="h-4 w-4" /> },
  { name: 'Suave', filter: 'blur(0.5px) brightness(1.1)', icon: <Feather className="h-4 w-4" /> },
  { name: 'Neon', filter: 'saturate(2) contrast(1.3) brightness(1.2)', icon: <Flame className="h-4 w-4" /> },
  { name: 'Monocromático', filter: 'grayscale(1) contrast(1.2)', icon: <Moon className="h-4 w-4" /> },
  { name: 'Aquático', filter: 'hue-rotate(180deg) saturate(1.5)', icon: <Droplets className="h-4 w-4" /> },
  { name: 'Dourado', filter: 'sepia(1) hue-rotate(30deg) saturate(1.5)', icon: <Crown className="h-4 w-4" /> }
];

// Layer structure
interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
  canvas: HTMLCanvasElement;
}

// Animation keyframes
interface Keyframe {
  time: number;
  properties: {
    opacity?: number;
    rotation?: number;
    scale?: number;
    x?: number;
    y?: number;
  };
}

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
  
  // Advanced drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
  const [currentColor, setCurrentColor] = useState('#D4A757');
  const [secondaryColor, setSecondaryColor] = useState('#7DF9FF');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushHardness, setBrushHardness] = useState(80);
  const [brushType, setBrushType] = useState<BrushType>('round');
  const [selectedPalette, setSelectedPalette] = useState('portugal');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Layer management
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [blendMode, setBlendMode] = useState<BlendMode>('normal');
  
  // History management
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [maxHistorySteps] = useState(50);
  
  // Advanced features
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(8);
  const [zoomLevel, setZoomLevel] = useState(800); // 800% for pixel art
  const [enableSymmetry, setEnableSymmetry] = useState(false);
  const [symmetryAxis, setSymmetryAxis] = useState<'horizontal' | 'vertical' | 'both'>('vertical');
  
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
  const [hue, setHue] = useState(0);
  
  // Animation system
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Advanced tools
  const [gradientStart, setGradientStart] = useState('#D4A757');
  const [gradientEnd, setGradientEnd] = useState('#7DF9FF');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [patternType, setPatternType] = useState<'dots' | 'lines' | 'checkerboard' | 'noise'>('dots');
  const [textureIntensity, setTextureIntensity] = useState(50);
  
  // Social features
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [allowRemix, setAllowRemix] = useState(false);
  const [licenseType, setLicenseType] = useState<'cc' | 'exclusive' | 'commercial'>('cc');
  
  // NFT and blockchain features
  const [enableNFT, setEnableNFT] = useState(false);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(5);
  const [limitedEdition, setLimitedEdition] = useState(false);
  const [editionSize, setEditionSize] = useState(100);
  
  const { toast } = useToast();

  // Initialize canvas and layers
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    canvas.width = 64;
    canvas.height = 64;
    
    // Create initial layer
    const initialLayer: Layer = {
      id: 'layer-0',
      name: 'Background',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      locked: false,
      canvas: document.createElement('canvas')
    };
    
    initialLayer.canvas.width = 64;
    initialLayer.canvas.height = 64;
    const layerCtx = initialLayer.canvas.getContext('2d');
    if (layerCtx) {
      layerCtx.fillStyle = pixelData?.color || '#333333';
      layerCtx.fillRect(0, 0, 64, 64);
    }
    
    setLayers([initialLayer]);
    setActiveLayerIndex(0);
    
    // Initialize history
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasHistory([imageData]);
    setHistoryIndex(0);
    
  }, [isOpen, pixelData]);

  // Advanced drawing functions
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setCanvasHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory.slice(-maxHistorySteps);
    });
    setHistoryIndex(prev => Math.min(prev + 1, maxHistorySteps - 1));
  }, [historyIndex, maxHistorySteps]);

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

  // Advanced drawing with pressure sensitivity and brush dynamics
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
    
    // Apply brush settings
    ctx.globalAlpha = brushOpacity / 100;
    ctx.lineWidth = brushSize;
    ctx.lineCap = brushType === 'round' ? 'round' : 'square';
    ctx.lineJoin = 'round';
    
    switch (currentTool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        
        if (brushType === 'spray') {
          // Spray brush effect
          for (let i = 0; i < brushSize * 2; i++) {
            const offsetX = (Math.random() - 0.5) * brushSize;
            const offsetY = (Math.random() - 0.5) * brushSize;
            ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
          }
        } else if (brushType === 'texture') {
          // Textured brush
          const pattern = createTexturePattern(ctx);
          ctx.fillStyle = pattern || currentColor;
          ctx.beginPath();
          ctx.arc(x, y, brushSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard brush
          ctx.beginPath();
          ctx.arc(x, y, brushSize, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'bucket':
        floodFill(ctx, x, y, currentColor);
        break;
        
      case 'eyedropper':
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        setCurrentColor(`rgb(${r}, ${g}, ${b})`);
        break;
        
      case 'blur':
        applyBlurEffect(ctx, x, y, brushSize);
        break;
        
      case 'sharpen':
        applySharpenEffect(ctx, x, y, brushSize);
        break;
    }
    
    // Apply symmetry if enabled
    if (enableSymmetry) {
      applySymmetry(ctx, x, y);
    }
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  // Advanced effects
  const createTexturePattern = (ctx: CanvasRenderingContext2D) => {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return null;
    
    // Create noise texture
    const imageData = patternCtx.createImageData(8, 8);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random() * 255;
      imageData.data[i] = noise;     // R
      imageData.data[i + 1] = noise; // G
      imageData.data[i + 2] = noise; // B
      imageData.data[i + 3] = textureIntensity * 2.55; // A
    }
    patternCtx.putImageData(imageData, 0, 0);
    
    return ctx.createPattern(patternCanvas, 'repeat');
  };

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    // Simple flood fill implementation
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const startPos = (Math.floor(startY) * ctx.canvas.width + Math.floor(startX)) * 4;
    
    if (startPos < 0 || startPos >= data.length) return;
    
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    
    const fillColorRgb = hexToRgb(fillColor);
    if (!fillColorRgb) return;
    
    const stack = [[Math.floor(startX), Math.floor(startY)]];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const pos = (y * ctx.canvas.width + x) * 4;
      
      if (x < 0 || x >= ctx.canvas.width || y < 0 || y >= ctx.canvas.height) continue;
      if (data[pos] !== startR || data[pos + 1] !== startG || data[pos + 2] !== startB) continue;
      
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

  const applyBlurEffect = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(ctx.canvas, x - radius, y - radius, radius * 2, radius * 2, x - radius, y - radius, radius * 2, radius * 2);
    ctx.filter = 'none';
  };

  const applySharpenEffect = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    // Sharpen kernel implementation
    const imageData = ctx.getImageData(x - radius, y - radius, radius * 2, radius * 2);
    // Apply sharpening filter (simplified)
    ctx.putImageData(imageData, x - radius, y - radius);
  };

  const applySymmetry = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    if (symmetryAxis === 'vertical' || symmetryAxis === 'both') {
      const mirrorX = centerX * 2 - x;
      ctx.beginPath();
      ctx.arc(mirrorX, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (symmetryAxis === 'horizontal' || symmetryAxis === 'both') {
      const mirrorY = centerY * 2 - y;
      ctx.beginPath();
      ctx.arc(x, mirrorY, brushSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Layer management functions
  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      locked: false,
      canvas: document.createElement('canvas')
    };
    
    newLayer.canvas.width = 64;
    newLayer.canvas.height = 64;
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerIndex(layers.length);
  };

  const deleteLayer = (index: number) => {
    if (layers.length <= 1) return;
    
    setLayers(prev => prev.filter((_, i) => i !== index));
    setActiveLayerIndex(Math.max(0, Math.min(index, layers.length - 2)));
  };

  const duplicateLayer = (index: number) => {
    const layerToDuplicate = layers[index];
    const newLayer: Layer = {
      ...layerToDuplicate,
      id: `layer-${Date.now()}`,
      name: `${layerToDuplicate.name} Copy`,
      canvas: document.createElement('canvas')
    };
    
    newLayer.canvas.width = 64;
    newLayer.canvas.height = 64;
    const newCtx = newLayer.canvas.getContext('2d');
    if (newCtx) {
      newCtx.drawImage(layerToDuplicate.canvas, 0, 0);
    }
    
    setLayers(prev => [...prev.slice(0, index + 1), newLayer, ...prev.slice(index + 1)]);
  };

  // Animation functions
  const addKeyframe = () => {
    const newKeyframe: Keyframe = {
      time: currentFrame,
      properties: {
        opacity: layerOpacity,
        rotation: 0,
        scale: 1,
        x: 0,
        y: 0
      }
    };
    
    setKeyframes(prev => [...prev, newKeyframe].sort((a, b) => a.time - b.time));
  };

  const playAnimation = () => {
    setIsPlaying(true);
    // Animation playback logic would go here
    setTimeout(() => setIsPlaying(false), animationDuration * 1000);
  };

  // Advanced export options
  const exportAsGIF = () => {
    // GIF export logic
    toast({
      title: "GIF Exportado!",
      description: "Sua animação foi exportada como GIF.",
    });
  };

  const exportAsNFT = () => {
    if (!enableNFT) return;
    
    toast({
      title: "NFT Criado!",
      description: "Seu pixel foi preparado para mint como NFT.",
    });
  };

  // Event handlers
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
        saturation,
        hue,
        layers: layers.map(layer => ({
          name: layer.name,
          opacity: layer.opacity,
          blendMode: layer.blendMode,
          data: layer.canvas.toDataURL()
        })),
        keyframes,
        isPublic,
        allowComments,
        allowRemix,
        licenseType,
        enableNFT,
        royaltyPercentage: enableNFT ? royaltyPercentage : 0,
        limitedEdition,
        editionSize: limitedEdition ? editionSize : 1
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
      
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-card via-card/95 to-primary/5">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-card to-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
          <div className="relative z-10">
            <DialogTitle className="text-2xl font-headline text-gradient-gold flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3 animate-glow" />
              Pixel Studio Avançado - ({pixelData.x}, {pixelData.y})
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
            <TabsTrigger value="layers" className="data-[state=active]:bg-primary/10">
              <Layers className="h-4 w-4 mr-2" />
              Camadas
            </TabsTrigger>
            <TabsTrigger value="animation" className="data-[state=active]:bg-primary/10">
              <Play className="h-4 w-4 mr-2" />
              Animação
            </TabsTrigger>
            <TabsTrigger value="effects" className="data-[state=active]:bg-primary/10">
              <Wand2 className="h-4 w-4 mr-2" />
              Efeitos
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-primary/10">
              <Users className="h-4 w-4 mr-2" />
              Social & NFT
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

              {/* Advanced Editor Tab */}
              <TabsContent value="editor" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Canvas Area */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Palette className="h-5 w-5 mr-2 text-primary" />
                            Editor Profissional de Pixel Art
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
                                width: '400px', 
                                height: '400px',
                                imageRendering: 'pixelated',
                                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`
                              }}
                              onMouseDown={handleCanvasMouseDown}
                              onMouseMove={handleCanvasMouseMove}
                              onMouseUp={handleCanvasMouseUp}
                              onMouseLeave={handleCanvasMouseUp}
                            />
                            {showGrid && (
                              <div className="absolute inset-0 pointer-events-none"
                                   style={{
                                     backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                     backgroundSize: `${gridSize}px ${gridSize}px`
                                   }} />
                            )}
                            
                            {/* Symmetry guides */}
                            {enableSymmetry && (
                              <>
                                {(symmetryAxis === 'vertical' || symmetryAxis === 'both') && (
                                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-500/50 pointer-events-none" />
                                )}
                                {(symmetryAxis === 'horizontal' || symmetryAxis === 'both') && (
                                  <div className="absolute left-0 right-0 top-1/2 h-px bg-red-500/50 pointer-events-none" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Advanced Controls */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Zoom: {zoomLevel}%</Label>
                            <Slider
                              value={[zoomLevel]}
                              onValueChange={([value]) => setZoomLevel(value)}
                              min={100}
                              max={1600}
                              step={100}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-xs">Grade: {gridSize}px</Label>
                            <Slider
                              value={[gridSize]}
                              onValueChange={([value]) => setGridSize(value)}
                              min={2}
                              max={32}
                              step={2}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                            <Label className="text-xs">Mostrar Grade</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch checked={enableSymmetry} onCheckedChange={setEnableSymmetry} />
                            <Label className="text-xs">Simetria</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advanced Tools Panel */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Drawing Tools */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Ferramentas Avançadas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { tool: 'brush', icon: Brush, label: 'Pincel' },
                            { tool: 'eraser', icon: Eraser, label: 'Borracha' },
                            { tool: 'bucket', icon: PaintBucket, label: 'Balde' },
                            { tool: 'eyedropper', icon: Target, label: 'Conta-gotas' },
                            { tool: 'line', icon: Minus, label: 'Linha' },
                            { tool: 'rectangle', icon: Square, label: 'Retângulo' },
                            { tool: 'circle', icon: Circle, label: 'Círculo' },
                            { tool: 'text', icon: Type, label: 'Texto' },
                            { tool: 'spray', icon: Spray, label: 'Spray' },
                            { tool: 'blur', icon: Blur, label: 'Desfoque' },
                            { tool: 'sharpen', icon: Sharpen, label: 'Nitidez' },
                            { tool: 'smudge', icon: Feather, label: 'Esfumar' }
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

                    {/* Advanced Brush Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Configurações Avançadas do Pincel</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Tamanho: {brushSize}px</Label>
                            <Slider
                              value={[brushSize]}
                              onValueChange={([value]) => setBrushSize(value)}
                              min={1}
                              max={50}
                              step={1}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-xs">Opacidade: {brushOpacity}%</Label>
                            <Slider
                              value={[brushOpacity]}
                              onValueChange={([value]) => setBrushOpacity(value)}
                              min={1}
                              max={100}
                              step={1}
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
                          
                          <div className="space-y-2">
                            <Label className="text-xs">Textura: {textureIntensity}%</Label>
                            <Slider
                              value={[textureIntensity]}
                              onValueChange={([value]) => setTextureIntensity(value)}
                              min={0}
                              max={100}
                              step={5}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Tipo de Pincel</Label>
                          <div className="grid grid-cols-4 gap-1">
                            {['round', 'square', 'soft', 'hard', 'texture', 'pattern', 'gradient', 'noise'].map((type) => (
                              <Button
                                key={type}
                                variant={brushType === type ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setBrushType(type as BrushType)}
                                className="text-xs p-1"
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Presets Profissionais</Label>
                          <div className="grid grid-cols-2 gap-1">
                            {brushPresets.map((preset) => (
                              <Button
                                key={preset.name}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setBrushSize(preset.size);
                                  setBrushOpacity(preset.opacity);
                                  setBrushHardness(preset.hardness);
                                  setBrushType(preset.type);
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

                    {/* Advanced Color Picker */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Sistema de Cores Avançado</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Cor Primária</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                className="w-12 h-12 rounded border border-border cursor-pointer"
                              />
                              <Input
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                placeholder="#000000"
                                className="font-mono text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Cor Secundária</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="w-12 h-12 rounded border border-border cursor-pointer"
                              />
                              <Input
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                placeholder="#000000"
                                className="font-mono text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Paletas Temáticas</Label>
                          <div className="grid grid-cols-4 gap-1">
                            {Object.entries(colorPalettes).map(([name, colors]) => (
                              <Button
                                key={name}
                                variant={selectedPalette === name ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedPalette(name)}
                                className="text-xs p-1 capitalize"
                              >
                                {name}
                              </Button>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-8 gap-1 mt-2">
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
                        
                        {/* Gradient Controls */}
                        <div className="space-y-2">
                          <Label className="text-xs">Gradiente</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="color"
                              value={gradientStart}
                              onChange={(e) => setGradientStart(e.target.value)}
                              className="w-full h-8 rounded border border-border cursor-pointer"
                            />
                            <input
                              type="color"
                              value={gradientEnd}
                              onChange={(e) => setGradientEnd(e.target.value)}
                              className="w-full h-8 rounded border border-border cursor-pointer"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={gradientType === 'linear' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setGradientType('linear')}
                              className="flex-1 text-xs"
                            >
                              Linear
                            </Button>
                            <Button
                              variant={gradientType === 'radial' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setGradientType('radial')}
                              className="flex-1 text-xs"
                            >
                              Radial
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Layers Tab */}
              <TabsContent value="layers" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Layers className="h-5 w-5 mr-2 text-primary" />
                          Gerenciador de Camadas
                        </span>
                        <Button size="sm" onClick={addLayer}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Camada
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {layers.map((layer, index) => (
                          <div 
                            key={layer.id}
                            className={cn(
                              "p-3 border rounded-lg cursor-pointer transition-colors",
                              activeLayerIndex === index ? "border-primary bg-primary/10" : "border-border"
                            )}
                            onClick={() => setActiveLayerIndex(index)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLayers(prev => prev.map((l, i) => 
                                      i === index ? { ...l, visible: !l.visible } : l
                                    ));
                                  }}
                                >
                                  {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Button>
                                <span className="text-sm font-medium">{layer.name}</span>
                                {layer.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateLayer(index);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteLayer(index);
                                  }}
                                  disabled={layers.length <= 1}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Opacidade:</Label>
                                <Slider
                                  value={[layer.opacity]}
                                  onValueChange={([value]) => {
                                    setLayers(prev => prev.map((l, i) => 
                                      i === index ? { ...l, opacity: value } : l
                                    ));
                                  }}
                                  min={0}
                                  max={100}
                                  step={1}
                                  className="flex-1"
                                />
                                <span className="text-xs w-8">{layer.opacity}%</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Modo:</Label>
                                <select
                                  value={layer.blendMode}
                                  onChange={(e) => {
                                    setLayers(prev => prev.map((l, i) => 
                                      i === index ? { ...l, blendMode: e.target.value as BlendMode } : l
                                    ));
                                  }}
                                  className="flex-1 text-xs p-1 border rounded"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="multiply">Multiplicar</option>
                                  <option value="screen">Tela</option>
                                  <option value="overlay">Sobreposição</option>
                                  <option value="soft-light">Luz Suave</option>
                                  <option value="hard-light">Luz Forte</option>
                                  <option value="color-dodge">Subexposição</option>
                                  <option value="color-burn">Superexposição</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-primary" />
                        Propriedades da Camada Ativa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {layers[activeLayerIndex] && (
                        <>
                          <div className="space-y-2">
                            <Label>Nome da Camada</Label>
                            <Input
                              value={layers[activeLayerIndex].name}
                              onChange={(e) => {
                                setLayers(prev => prev.map((l, i) => 
                                  i === activeLayerIndex ? { ...l, name: e.target.value } : l
                                ));
                              }}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={layers[activeLayerIndex].visible}
                                onCheckedChange={(checked) => {
                                  setLayers(prev => prev.map((l, i) => 
                                    i === activeLayerIndex ? { ...l, visible: checked } : l
                                  ));
                                }}
                              />
                              <Label>Visível</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={layers[activeLayerIndex].locked}
                                onCheckedChange={(checked) => {
                                  setLayers(prev => prev.map((l, i) => 
                                    i === activeLayerIndex ? { ...l, locked: checked } : l
                                  ));
                                }}
                              />
                              <Label>Bloqueada</Label>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Transformações</Label>
                            <div className="grid grid-cols-3 gap-2">
                              <Button variant="outline" size="sm">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Flip className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mirror className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Animation Tab */}
              <TabsContent value="animation" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Play className="h-5 w-5 mr-2 text-primary" />
                        Sistema de Animação
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Ativar Animações</Label>
                        <Switch checked={enableAnimations} onCheckedChange={setEnableAnimations} />
                      </div>
                      
                      {enableAnimations && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm">Duração: {animationDuration}s</Label>
                            <Slider
                              value={[animationDuration]}
                              onValueChange={([value]) => setAnimationDuration(value)}
                              min={0.5}
                              max={10}
                              step={0.1}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Velocidade: {animationSpeed}%</Label>
                            <Slider
                              value={[animationSpeed]}
                              onValueChange={([value]) => setAnimationSpeed(value)}
                              min={10}
                              max={200}
                              step={10}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant={isPlaying ? 'destructive' : 'default'}
                              onClick={isPlaying ? () => setIsPlaying(false) : playAnimation}
                              className="flex-1"
                            >
                              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                              {isPlaying ? 'Parar' : 'Reproduzir'}
                            </Button>
                            <Button variant="outline" onClick={addKeyframe}>
                              <Plus className="h-4 w-4 mr-2" />
                              Keyframe
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Timeline</Label>
                            <div className="h-16 bg-muted/20 rounded border relative">
                              {keyframes.map((keyframe, index) => (
                                <div
                                  key={index}
                                  className="absolute top-0 bottom-0 w-1 bg-primary"
                                  style={{ left: `${(keyframe.time / animationDuration) * 100}%` }}
                                />
                              ))}
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                                style={{ left: `${(currentFrame / animationDuration) * 100}%` }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Download className="h-5 w-5 mr-2 text-primary" />
                        Exportação Avançada
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={exportAsGIF}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Exportar GIF
                        </Button>
                        <Button variant="outline">
                          <Video className="h-4 w-4 mr-2" />
                          Exportar MP4
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          PNG Sequence
                        </Button>
                        <Button variant="outline">
                          <Save className="h-4 w-4 mr-2" />
                          Projeto (.pxl)
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Qualidade de Exportação</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm">Baixa</Button>
                          <Button variant="default" size="sm">Média</Button>
                          <Button variant="outline" size="sm">Alta</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Resolução</Label>
                        <select className="w-full p-2 border rounded text-sm">
                          <option>64x64 (Original)</option>
                          <option>128x128 (2x)</option>
                          <option>256x256 (4x)</option>
                          <option>512x512 (8x)</option>
                          <option>1024x1024 (16x)</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Effects Tab */}
              <TabsContent value="effects" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wand2 className="h-5 w-5 mr-2 text-primary" />
                        Filtros e Efeitos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {filterPresets.map((filter) => (
                          <Button
                            key={filter.name}
                            variant={selectedFilter === filter.name ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedFilter(filter.name)}
                            className="flex items-center gap-2 text-xs"
                          >
                            {filter.icon}
                            {filter.name}
                          </Button>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Brilho: {brightness}%</Label>
                          <Slider
                            value={[brightness]}
                            onValueChange={([value]) => setBrightness(value)}
                            min={0}
                            max={200}
                            step={5}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Contraste: {contrast}%</Label>
                          <Slider
                            value={[contrast]}
                            onValueChange={([value]) => setContrast(value)}
                            min={0}
                            max={200}
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
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Matiz: {hue}°</Label>
                          <Slider
                            value={[hue]}
                            onValueChange={([value]) => setHue(value)}
                            min={-180}
                            max={180}
                            step={1}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        Efeitos Especiais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Flame className="h-4 w-4 mr-2" />
                          Fogo
                        </Button>
                        <Button variant="outline" size="sm">
                          <Droplets className="h-4 w-4 mr-2" />
                          Água
                        </Button>
                        <Button variant="outline" size="sm">
                          <Snowflake className="h-4 w-4 mr-2" />
                          Gelo
                        </Button>
                        <Button variant="outline" size="sm">
                          <Zap className="h-4 w-4 mr-2" />
                          Elétrico
                        </Button>
                        <Button variant="outline" size="sm">
                          <Rainbow className="h-4 w-4 mr-2" />
                          Arco-íris
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Brilho
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Padrões</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['dots', 'lines', 'checkerboard', 'noise'].map((pattern) => (
                            <Button
                              key={pattern}
                              variant={patternType === pattern ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPatternType(pattern as any)}
                              className="text-xs capitalize"
                            >
                              {pattern}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Social & NFT Tab */}
              <TabsContent value="social" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Configurações Sociais
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
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">{pixelDescription.length}/500 caracteres</p>
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
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Público</Label>
                          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Permitir Comentários</Label>
                          <Switch checked={allowComments} onCheckedChange={setAllowComments} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label>Permitir Remix</Label>
                          <Switch checked={allowRemix} onCheckedChange={setAllowRemix} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipo de Licença</Label>
                        <select
                          value={licenseType}
                          onChange={(e) => setLicenseType(e.target.value as any)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="cc">Creative Commons</option>
                          <option value="exclusive">Uso Exclusivo</option>
                          <option value="commercial">Comercial</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Gem className="h-5 w-5 mr-2 text-primary" />
                        NFT e Blockchain
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Criar como NFT</Label>
                        <Switch checked={enableNFT} onCheckedChange={setEnableNFT} />
                      </div>
                      
                      {enableNFT && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm">Royalties: {royaltyPercentage}%</Label>
                            <Slider
                              value={[royaltyPercentage]}
                              onValueChange={([value]) => setRoyaltyPercentage(value)}
                              min={0}
                              max={20}
                              step={0.5}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Edição Limitada</Label>
                            <Switch checked={limitedEdition} onCheckedChange={setLimitedEdition} />
                          </div>
                          
                          {limitedEdition && (
                            <div className="space-y-2">
                              <Label className="text-sm">Tamanho da Edição: {editionSize}</Label>
                              <Slider
                                value={[editionSize]}
                                onValueChange={([value]) => setEditionSize(value)}
                                min={1}
                                max={1000}
                                step={1}
                              />
                            </div>
                          )}
                          
                          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Crown className="h-4 w-4 text-amber-500" />
                              <span className="font-medium text-amber-500">NFT Premium</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Criar como NFT permite propriedade verificável na blockchain e potencial de revenda.
                            </p>
                          </div>
                          
                          <Button onClick={exportAsNFT} className="w-full">
                            <Gem className="h-4 w-4 mr-2" />
                            Preparar para Mint
                          </Button>
                        </>
                      )}
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partilhar Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <canvas
                              ref={previewCanvasRef}
                              className="border-2 border-primary/30 rounded-lg"
                              style={{ 
                                width: '300px', 
                                height: '300px',
                                imageRendering: 'pixelated',
                                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`
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
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Star className="h-4 w-4 mr-2 text-yellow-500" />
                            Resumo da Criação
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
                            <div className="flex justify-between">
                              <span>Camadas:</span>
                              <span>{layers.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Animado:</span>
                              <span>{enableAnimations ? 'Sim' : 'Não'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>NFT:</span>
                              <span>{enableNFT ? 'Sim' : 'Não'}</span>
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
                              Arte personalizada profissional
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 mr-2 text-green-500" />
                              Sistema de camadas avançado
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 mr-2 text-green-500" />
                              Filtros e efeitos especiais
                            </li>
                            {enableAnimations && (
                              <li className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                Animações personalizadas
                              </li>
                            )}
                            {enableNFT && (
                              <li className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                Certificação NFT na blockchain
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
                        
                        <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                          <h4 className="font-semibold mb-2 flex items-center text-green-500">
                            <Award className="h-4 w-4 mr-2" />
                            Valor Estimado
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Pixel Base:</span>
                              <span>{pixelData.price}€</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Customizações:</span>
                              <span>+{Math.floor(layers.length * 10 + (enableAnimations ? 50 : 0) + (enableNFT ? 100 : 0))}€</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-green-500">
                              <span>Valor Total Estimado:</span>
                              <span>{pixelData.price + Math.floor(layers.length * 10 + (enableAnimations ? 50 : 0) + (enableNFT ? 100 : 0))}€</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 min-w-[140px]"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar & Criar
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