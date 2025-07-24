
// src/components/pixel-grid/PixelGrid.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ZoomIn, ZoomOut, Expand, Search, Sparkles, Info, User, CalendarDays,
  History as HistoryIcon, DollarSign, ShoppingCart, Edit3, Palette as PaletteIconLucide, FileText, Upload, Save,
  Image as ImageIcon, XCircle, TagsIcon, Link as LinkIconLucide, Pencil,
  Eraser, PaintBucket, Trash2, Heart, Flag, BadgePercent, Star, MapPin as MapPinIconLucide, ScrollText, Gem, Globe, AlertTriangle,
  Map as MapIcon, Crown, Crosshair, Filter, Layers, Grid3X3, MousePointer, Move, RotateCcw, 
  Maximize2, Minimize2, Target, Compass, Navigation, Bookmark, Share2, Download, Upload as UploadIcon,
  Settings, HelpCircle, Zap, Activity, TrendingUp, BarChart3, PieChart, Users, Clock, Calendar
} from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import PortugalMapSvg, { type MapData } from './PortugalMapSvg';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generatePixelDescription, type GeneratePixelDescriptionInput } from '@/ai/flows/generate-pixel-description';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { EnhancedTooltip, PixelTooltip } from '@/components/ui/enhanced-tooltip';
import { LoadingOverlay, MapLoadingState } from '@/components/ui/loading-states';
import { useAppStore, usePixelStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDescriptionElement,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle as CardTitleElement, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '../ui/separator';
import { mapPixelToApproxGps, cn } from '@/lib/utils';
import EnhancedPixelPurchaseModal from './EnhancedPixelPurchaseModal';

// New imports for enhanced features
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore, useSettingsStore } from '@/lib/store';


// Configuration constants
const SVG_VIEWBOX_WIDTH = 12969;
const SVG_VIEWBOX_HEIGHT = 26674;
const LOGICAL_GRID_COLS_CONFIG = 1273;
const RENDERED_PIXEL_SIZE_CONFIG = 1;

// Pixel pricing constants
const PIXEL_BASE_PRICE = 1; // Base price in euros
const PIXEL_RARITY_MULTIPLIERS = {
  'Comum': 1,
  'Incomum': 2.5,
  'Raro': 5,
  'Épico': 10,
  'Lendário': 25,
  'Marco Histórico': 50
};

// Special credits pricing
const SPECIAL_CREDITS_CONVERSION = {
  'Comum': 10,
  'Incomum': 25,
  'Raro': 50,
  'Épico': 100,
  'Lendário': 250,
  'Marco Histórico': 500
};

// Derived constants
const canvasDrawWidth = LOGICAL_GRID_COLS_CONFIG * RENDERED_PIXEL_SIZE_CONFIG;
const canvasDrawHeight = Math.floor(canvasDrawWidth * (SVG_VIEWBOX_HEIGHT / SVG_VIEWBOX_WIDTH));
const logicalGridRows = Math.floor(canvasDrawHeight / RENDERED_PIXEL_SIZE_CONFIG);
const totalLogicalPixels = LOGICAL_GRID_COLS_CONFIG * logicalGridRows;

// New filter and view modes
type ViewMode = 'normal' | 'heatmap' | 'ownership' | 'rarity' | 'activity';
type FilterType = 'all' | 'available' | 'owned' | 'premium' | 'recent';

const PLACEHOLDER_IMAGE_DATA_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const USER_BOUGHT_PIXEL_COLOR = 'hsl(var(--primary))';

const MOCK_CURRENT_USER_ID = 'currentUserPixelMaster';

interface SoldPixel {
  x: number;
  y: number;
  color: string;
  ownerId?: string;
  title?: string;
  pixelImageUrl?: string;
}

interface SelectedPixelDetails {
  x: number;
  y: number;
  owner?: string;
  price: number;
  acquisitionDate?: string;
  lastModifiedDate?: string;
  color?: string;
  history: Array<{ owner: string; date: string; price?: number }>;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  manualDescription?: string;
  pixelImageUrl?: string;
  dataAiHint?: string;
  title?: string;
  tags?: string[];
  linkUrl?: string;
  isForSaleByOwner?: boolean;
  salePrice?: number;
  isFavorited?: boolean;
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  loreSnippet?: string;
  gpsCoords?: { lat: number; lon: number; } | null;
  views: number;
  likes: number;
  region: string;
  isProtected: boolean;
  features?: string[];
  description?: string;
  specialCreditsPrice?: number;
  lastActivity?: Date;
  popularity?: number;
  isHotspot?: boolean;
}

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 50;
const ZOOM_SENSITIVITY_FACTOR = 1.1;
const HEADER_HEIGHT_PX = 64;
const BOTTOM_NAV_HEIGHT_PX = 64;

const mockRarities: SelectedPixelDetails['rarity'][] = ['Comum', 'Raro', 'Épico', 'Lendário', 'Marco Histórico'];
const mockLoreSnippets: string[] = [
  "Dizem que este pixel brilha sob a lua cheia.",
  "Um antigo mapa sugere um tesouro escondido perto daqui.",
  "Sente-se uma energia estranha emanando deste local.",
];


export default function PixelGrid() {
  const [isClient, setIsClient] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [defaultView, setDefaultView] = useState<{ zoom: number; position: { x: number; y: number } } | null>(null);
  
  // New state for enhanced features
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showGrid, setShowGrid] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | 'measure'>('pan');
  const [measurementPoints, setMeasurementPoints] = useState<Array<{x: number, y: number}>>([]);
  const [bookmarkedPixels, setBookmarkedPixels] = useState<Array<{x: number, y: number, name: string}>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [playHoverSound, setPlayHoverSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Array<{x: number, y: number, timestamp: Date}>>([]);
  
  // Enhanced performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    renderTime: 0,
    pixelsRendered: 0,
    memoryUsage: 0
  });

  const didDragRef = useRef(false);
  const dragThreshold = 5;

  const [highlightedPixel, setHighlightedPixel] = useState<{ x: number; y: number } | null>(null);
  const [selectedPixelDetails, setSelectedPixelDetails] = useState<SelectedPixelDetails | null>(null);
  
  const [showPixelModal, setShowPixelModal] = useState(false);
  const { user } = useAuth();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const [mapData, setMapData] = useState<MapData | null>(null);
  const [pixelBitmap, setPixelBitmap] = useState<Uint8Array | null>(null);
  const [activePixelsInMap, setActivePixelsInMap] = useState(0);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [progressMessage, setProgressMessage] = useState("Aguardando cliente...");
  
  const { isOnline, updateLastSync } = useAppStore();
  const { soldPixels, addSoldPixel } = usePixelStore();
  const { addCredits, addXp } = useUserStore();
  const { animations, soundEffects, highQualityRendering } = useSettingsStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const performanceMonitorRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);
  
  // Enhanced loading state with better UX
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Memoized filtered pixels based on current filter
  const filteredPixels = useMemo(() => {
    switch (activeFilter) {
      case 'available':
        return soldPixels.filter(p => !p.ownerId);
      case 'owned':
        return soldPixels.filter(p => p.ownerId === MOCK_CURRENT_USER_ID);
      case 'premium':
        return soldPixels.filter(p => p.title?.includes('Premium') || Math.random() > 0.7);
      case 'recent':
        return soldPixels.filter(p => Math.random() > 0.8); // Mock recent activity
      default:
        return soldPixels;
    }
  }, [soldPixels, activeFilter]);
  
  // Performance monitoring
  useEffect(() => {
    if (!highQualityRendering) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measurePerformance = () => {
      frameCount++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (now - lastTime));
        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          pixelsRendered: filteredPixels.length
        }));
        frameCount = 0;
        lastTime = now;
      }
      
      if (performanceMonitorRef.current) {
        requestAnimationFrame(measurePerformance);
      }
    };
    
    performanceMonitorRef.current = setTimeout(() => {
      requestAnimationFrame(measurePerformance);
    }, 100);
    
    return () => {
      if (performanceMonitorRef.current) {
        clearTimeout(performanceMonitorRef.current);
        performanceMonitorRef.current = null;
      }
    };
  }, [highQualityRendering, filteredPixels.length]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const autoSaveInterval = setInterval(() => {
      // Simulate auto-save
      setLastSaved(new Date());
      updateLastSync();
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [autoSaveEnabled, updateLastSync]);
  
  // Enhanced rendering with view modes
  // Enhanced navigation functions
  const handleGoToPixel = useCallback((x: number, y: number) => {
    if (!containerRef.current || !pixelBitmap) return;
    
    const targetZoom = 15;
    const containerWidth = containerRef.current.offsetWidth;
    const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;
    
    const targetX = -x * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + containerWidth / 2;
    const targetY = -y * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + effectiveContainerHeight / 2;
    
    setPosition({ x: targetX, y: targetY });
    setZoom(targetZoom);
    setHighlightedPixel({ x, y });
    
    // Add to recent activity
    setRecentActivity(prev => [
      { x, y, timestamp: new Date() },
      ...prev.slice(0, 9)
    ]);
    
    if (soundEffects) {
      setPlayHoverSound(true);
    }
  }, [pixelBitmap, soundEffects]);
  
  const handleBookmarkPixel = useCallback((x: number, y: number, name?: string) => {
    const bookmarkName = name || `Pixel (${x}, ${y})`;
    setBookmarkedPixels(prev => [
      ...prev.filter(b => !(b.x === x && b.y === y)),
      { x, y, name: bookmarkName }
    ]);
    
    addXp(5);
    toast({
      title: "Pixel Marcado",
      description: `${bookmarkName} foi adicionado aos seus marcadores.`,
    });
  }, [addXp, toast]);
  
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);
  
  const handleExportView = useCallback(() => {
    if (!pixelCanvasRef.current) return;
    
    const canvas = pixelCanvasRef.current;
    const link = document.createElement('a');
    link.download = `pixel-universe-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    addCredits(10);
    toast({
      title: "Vista Exportada",
      description: "A imagem foi exportada com sucesso. +10 créditos!",
    });
  }, [addCredits, toast]);
  
  const handleShareView = useCallback(() => {
    const shareData = {
      title: 'Pixel Universe - Mapa Interativo',
      text: `Confira esta vista incrível do mapa de Portugal!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link Copiado",
        description: "O link foi copiado para a área de transferência.",
      });
    }
    
    addXp(5);
  }, [addXp, toast]);
  
  // Enhanced measurement tool
  const handleMeasurementClick = useCallback((x: number, y: number) => {
    if (selectedTool !== 'measure') return;
    
    setMeasurementPoints(prev => {
      const newPoints = [...prev, { x, y }];
      
      if (newPoints.length === 2) {
        const distance = Math.sqrt(
          Math.pow(newPoints[1].x - newPoints[0].x, 2) + 
          Math.pow(newPoints[1].y - newPoints[0].y, 2)
        );
        
        toast({
          title: "Medição Concluída",
          description: `Distância: ${distance.toFixed(2)} pixels`,
        });
        
        return []; // Reset after measurement
      }
      
      return newPoints;
    });
  }, [selectedTool, toast]);
  // Search functionality
  useEffect(() => {
    if (debouncedSearchQuery) {
      // Simulate search results
      const searchResults = soldPixels.filter(pixel => 
        pixel.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        `${pixel.x},${pixel.y}`.includes(debouncedSearchQuery)
      );
      
      if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        handleGoToPixel(firstResult.x, firstResult.y);
      }
    }
  }, [debouncedSearchQuery, soldPixels]);
  useEffect(() => {
    setIsClient(true);
     if (typeof window !== 'undefined') {
      const computedStyle = getComputedStyle(document.documentElement);
      const primaryColor = `hsl(${computedStyle.getPropertyValue('--primary').trim()})`;
      const accentColor = `hsl(${computedStyle.getPropertyValue('--accent').trim()})`;
      
      setUnsoldColor(primaryColor);
      setStrokeColor(accentColor);
    }
  }, []);

  const handleMapDataLoaded = useCallback((data: MapData) => {
    setMapData(data);
  }, []);

  useEffect(() => {
    if (!isClient || !mapData || !mapData.svgElement) return;
  
    setProgressMessage("A renderizar mapa interativo...");
    setIsLoadingMap(true);
    setLoadingProgress(20);
    
    const { svgElement } = mapData;
    
    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    // Create a Blob and a URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvasDrawWidth;
    offscreenCanvas.height = canvasDrawHeight;
    const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        setIsLoadingMap(false);
        URL.revokeObjectURL(url);
        return;
    }
    
    const img = new Image();
    img.onload = () => {
        // Draw the SVG image onto the canvas
        ctx.drawImage(img, 0, 0, canvasDrawWidth, canvasDrawHeight);
        setLoadingProgress(60);
        URL.revokeObjectURL(url); // Clean up the blob URL

        try {
          setProgressMessage("A gerar grelha interativa...");
          setLoadingProgress(80);
          
          const imageData = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
          const data = imageData.data;
          const newBitmap = new Uint8Array(LOGICAL_GRID_COLS_CONFIG * logicalGridRows);
          let activePixels = 0;
      
          for (let row = 0; row < logicalGridRows; row++) {
            for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
              const canvasX = Math.floor((col + 0.5) * RENDERED_PIXEL_SIZE_CONFIG);
              const canvasY = Math.floor((row + 0.5) * RENDERED_PIXEL_SIZE_CONFIG);
              const index = (canvasY * offscreenCanvas.width + canvasX) * 4;
              
              if (data[index + 3] > 0) { // Check alpha channel
                newBitmap[row * LOGICAL_GRID_COLS_CONFIG + col] = 1;
                activePixels++;
              }
            }
          }
          setPixelBitmap(newBitmap);
          setActivePixelsInMap(activePixels);
          setLoadingProgress(100);
        } catch(e) {
          console.error("Error generating pixel bitmap:", e);
          toast({ title: "Erro na Grelha", description: "Não foi possível gerar a grelha interativa.", variant: "destructive" });
        } finally {
          setIsLoadingMap(false);
          setProgressMessage("");
        }
    };
    img.onerror = () => {
        console.error("Failed to load SVG as image.");
        toast({ title: "Erro no Mapa", description: "Não foi possível carregar o SVG melhorado.", variant: "destructive" });
        setIsLoadingMap(false);
        URL.revokeObjectURL(url);
    };
    img.src = url;
  
  }, [isClient, mapData, toast]);

  useEffect(() => {
    const urlsToLoad = soldPixels
      .map(p => p.pixelImageUrl)
      .filter((url): url is string => !!url && !loadedPixelImages.has(url));
  
    if (urlsToLoad.length > 0) {
      urlsToLoad.forEach(url => {
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          setLoadedPixelImages(prev => new Map(prev).set(url, img));
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${url}`);
        };
      });
    }
  }, [soldPixels, loadedPixelImages]);


  useEffect(() => {
    if (!pixelBitmap || !unsoldColor || !pixelCanvasRef.current) return;
    const canvas = pixelCanvasRef.current;
    if (canvas.width !== canvasDrawWidth || canvas.height !== canvasDrawHeight) {
        canvas.width = canvasDrawWidth;
        canvas.height = canvasDrawHeight;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render based on view mode
    switch (viewMode) {
      case 'heatmap':
        renderHeatmapView(ctx);
        break;
      case 'ownership':
        renderOwnershipView(ctx);
        break;
      case 'rarity':
        renderRarityView(ctx);
        break;
      case 'activity':
        renderActivityView(ctx);
        break;
      default:
        renderNormalView(ctx);
    }
    
    // Draw grid overlay if enabled
    if (showGrid && zoom > 5) {
      drawGridOverlay(ctx);
    }
    
    // Draw coordinates if enabled
    if (showCoordinates && zoom > 10) {
      drawCoordinates(ctx);
    }

  }, [pixelBitmap, filteredPixels, unsoldColor, logicalGridRows, loadedPixelImages, viewMode, showGrid, showCoordinates, zoom]);
  
  // Render functions for different view modes
  const renderNormalView = (ctx: CanvasRenderingContext2D) => {
    // Draw base map (unsold pixels)
    ctx.fillStyle = unsoldColor;
    for (let row = 0; row < logicalGridRows; row++) {
      for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
        if (pixelBitmap![row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
          ctx.fillRect(
            col * RENDERED_PIXEL_SIZE_CONFIG,
            row * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
          );
        }
      }
    }
    
    // Draw sold pixels
    filteredPixels.forEach(pixel => {
      const renderX = pixel.x * RENDERED_PIXEL_SIZE_CONFIG;
      const renderY = pixel.y * RENDERED_PIXEL_SIZE_CONFIG;
      
      if (pixel.pixelImageUrl) {
        const img = loadedPixelImages.get(pixel.pixelImageUrl);
        if (img && img.complete) {
          ctx.drawImage(img, renderX, renderY, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
        } else {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(renderX, renderY, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
        }
      } else {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(renderX, renderY, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
      }
    });
  };
  
  const renderHeatmapView = (ctx: CanvasRenderingContext2D) => {
    // Create heatmap based on pixel activity
    for (let row = 0; row < logicalGridRows; row++) {
      for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
        if (pixelBitmap![row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
          const activity = Math.random(); // Mock activity level
          const intensity = Math.floor(activity * 255);
          ctx.fillStyle = `rgba(255, ${255 - intensity}, 0, 0.7)`;
          ctx.fillRect(
            col * RENDERED_PIXEL_SIZE_CONFIG,
            row * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
          );
        }
      }
    }
  };
  
  const renderOwnershipView = (ctx: CanvasRenderingContext2D) => {
    // Color pixels based on ownership
    const ownerColors = new Map<string, string>();
    let colorIndex = 0;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    
    for (let row = 0; row < logicalGridRows; row++) {
      for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
        if (pixelBitmap![row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
          const pixel = soldPixels.find(p => p.x === col && p.y === row);
          
          if (pixel?.ownerId) {
            if (!ownerColors.has(pixel.ownerId)) {
              ownerColors.set(pixel.ownerId, colors[colorIndex % colors.length]);
              colorIndex++;
            }
            ctx.fillStyle = ownerColors.get(pixel.ownerId)!;
          } else {
            ctx.fillStyle = '#333333';
          }
          
          ctx.fillRect(
            col * RENDERED_PIXEL_SIZE_CONFIG,
            row * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
          );
        }
      }
    }
  };
  
  const renderRarityView = (ctx: CanvasRenderingContext2D) => {
    // Color pixels based on rarity
    const rarityColors = {
      'Comum': '#6B7280',
      'Incomum': '#10B981',
      'Raro': '#3B82F6',
      'Épico': '#8B5CF6',
      'Lendário': '#F59E0B',
      'Marco Histórico': '#EF4444'
    };
    
    for (let row = 0; row < logicalGridRows; row++) {
      for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
        if (pixelBitmap![row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
          // Mock rarity assignment
          const rarities = Object.keys(rarityColors);
          const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
          ctx.fillStyle = rarityColors[randomRarity as keyof typeof rarityColors];
          
          ctx.fillRect(
            col * RENDERED_PIXEL_SIZE_CONFIG,
            row * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
          );
        }
      }
    }
  };
  
  const renderActivityView = (ctx: CanvasRenderingContext2D) => {
    // Show recent activity with pulsing effect
    const now = Date.now();
    
    for (let row = 0; row < logicalGridRows; row++) {
      for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
        if (pixelBitmap![row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
          const recentActivity = Math.random() > 0.95; // Mock recent activity
          
          if (recentActivity) {
            const pulse = Math.sin(now * 0.005) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + pulse * 0.7})`;
          } else {
            ctx.fillStyle = unsoldColor;
          }
          
          ctx.fillRect(
            col * RENDERED_PIXEL_SIZE_CONFIG,
            row * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
          );
        }
      }
    }
  };
  
  const drawGridOverlay = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let col = 0; col <= LOGICAL_GRID_COLS_CONFIG; col += 10) {
      ctx.beginPath();
      ctx.moveTo(col * RENDERED_PIXEL_SIZE_CONFIG, 0);
      ctx.lineTo(col * RENDERED_PIXEL_SIZE_CONFIG, canvasDrawHeight);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let row = 0; row <= logicalGridRows; row += 10) {
      ctx.beginPath();
      ctx.moveTo(0, row * RENDERED_PIXEL_SIZE_CONFIG);
      ctx.lineTo(canvasDrawWidth, row * RENDERED_PIXEL_SIZE_CONFIG);
      ctx.stroke();
    }
  };
  
  const drawCoordinates = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    
    for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col += 50) {
      for (let row = 0; row < logicalGridRows; row += 50) {
        if (pixelBitmap![row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
          ctx.fillText(
            `${col},${row}`,
            col * RENDERED_PIXEL_SIZE_CONFIG + RENDERED_PIXEL_SIZE_CONFIG / 2,
            row * RENDERED_PIXEL_SIZE_CONFIG + RENDERED_PIXEL_SIZE_CONFIG / 2
          );
        }
      }
    }
  };

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        containerSizeRef.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
        const outlineCanvas = outlineCanvasRef.current;
        if (outlineCanvas) {
          outlineCanvas.width = entry.contentRect.width;
          outlineCanvas.height = entry.contentRect.height;
        }
      }
    });
  
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!mapData || !strokeColor || !outlineCanvasRef.current || containerSizeRef.current.width === 0) return;
    const canvas = outlineCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const logicalToSvgScale = canvasDrawWidth / SVG_VIEWBOX_WIDTH;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw district outlines
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(zoom * logicalToSvgScale, zoom * logicalToSvgScale);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.5 / (zoom * logicalToSvgScale);
    ctx.imageSmoothingEnabled = true;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  
    mapData.pathStrings.forEach(pathString => {
        try {
            const path = new Path2D(pathString);
            ctx.stroke(path);
        } catch(e) {
        }
    });
    ctx.restore();
  
    // Draw highlighted pixel border
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(zoom, zoom);
    if (highlightedPixel) {
        ctx.strokeStyle = 'hsl(var(--foreground))';
        ctx.lineWidth = (0.5 / zoom) * RENDERED_PIXEL_SIZE_CONFIG;
        ctx.strokeRect(
            highlightedPixel.x * RENDERED_PIXEL_SIZE_CONFIG,
            highlightedPixel.y * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
        );
    }
    ctx.restore();

  }, [mapData, zoom, position, strokeColor, highlightedPixel]);
  

  useEffect(() => { 
    if (isClient && containerRef.current && mapData?.pathStrings && !defaultView && canvasDrawWidth > 0 && canvasDrawHeight > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;
      
      if (containerWidth > 0 && effectiveContainerHeight > 0) {
        const fitZoomX = containerWidth / canvasDrawWidth;
        const fitZoomY = effectiveContainerHeight / canvasDrawHeight;
        const zoomToFit = Math.min(fitZoomX, fitZoomY);
        
        const calculatedZoom = Math.max(MIN_ZOOM, zoomToFit * 0.95); 
        const canvasContentWidth = canvasDrawWidth * calculatedZoom;
        const canvasContentHeight = canvasDrawHeight * calculatedZoom;
        
        const calculatedPosition = {
          x: (containerWidth - canvasContentWidth) / 2,
          y: (effectiveContainerHeight - canvasContentHeight) / 2,
        };
        
        setDefaultView({ zoom: calculatedZoom, position: calculatedPosition });
        setZoom(calculatedZoom);
        setPosition(calculatedPosition);
      }
    }
  }, [isClient, mapData, defaultView, canvasDrawWidth, canvasDrawHeight]);


 const handleResetView = useCallback(() => {
    clearAutoResetTimeout();
    if (defaultView) {
      setZoom(defaultView.zoom);
      setPosition(defaultView.position);
    } else if (isClient && containerRef.current && mapData?.pathStrings && canvasDrawWidth > 0 && canvasDrawHeight > 0) { 
        const containerWidth = containerRef.current.offsetWidth;
        const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;
        if (containerWidth > 0 && effectiveContainerHeight > 0) {
            const fitZoomX = containerWidth / canvasDrawWidth;
            const fitZoomY = effectiveContainerHeight / canvasDrawHeight;
            const zoomToFit = Math.min(fitZoomX, fitZoomY);
            const fallbackZoom = Math.max(MIN_ZOOM, zoomToFit * 0.95);

            const canvasContentWidth = canvasDrawWidth * fallbackZoom;
            const canvasContentHeight = canvasDrawHeight * fallbackZoom;
            const fallbackPosition = {
                x: (containerWidth - canvasContentWidth) / 2,
                y: (effectiveContainerHeight - canvasContentHeight) / 2,
            };
            setZoom(fallbackZoom);
            setPosition(fallbackPosition);
            setDefaultView({ zoom: fallbackZoom, position: fallbackPosition }); 
        }
    }
  }, [defaultView, mapData, clearAutoResetTimeout, canvasDrawWidth, canvasDrawHeight, isClient]); 

  const handleZoomIn = () => { clearAutoResetTimeout(); setZoom((prevZoom) => Math.min(prevZoom * 1.2, MAX_ZOOM)); };
  const handleZoomOut = () => { clearAutoResetTimeout(); setZoom((prevZoom) => Math.max(prevZoom / 1.2, MIN_ZOOM)); };


  const handleMouseDown = (e: React.MouseEvent) => {
    clearAutoResetTimeout();
    const targetElement = e.target as HTMLElement;
     if (targetElement.closest('button, [data-dialog-content], [data-tooltip-content], [data-popover-content], label, a, [role="menuitem"], [role="tab"], input, textarea')) {
        return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    didDragRef.current = false;
  };


  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const currentX = e.clientX - dragStart.x;
    const currentY = e.clientY - dragStart.y;

    if (!didDragRef.current) {
        const dx = Math.abs(currentX - position.x);
        const dy = Math.abs(currentY - position.y);
        if (dx > dragThreshold || dy > dragThreshold) {
            didDragRef.current = true;
        }
    }
    setPosition({ x: currentX, y: currentY });
  };
  
  const handleCanvasClick = (event: React.MouseEvent) => {
    clearAutoResetTimeout();

    if (!isOnline) {
      toast({ title: "Sem Conexão", description: "Você está offline.", variant: "destructive" });
    }

    if (isLoadingMap || !pixelBitmap || !containerRef.current) {
      toast({ title: "Mapa a Carregar", description: "A grelha está a ser processada.", variant: "default" });
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const clickXInContainer = event.clientX - rect.left;
    const clickYInContainer = event.clientY - rect.top;

    const xOnContent = (clickXInContainer - position.x) / zoom;
    const yOnContent = (clickYInContainer - position.y) / zoom;

    const logicalCol = Math.floor(xOnContent / RENDERED_PIXEL_SIZE_CONFIG);
    const logicalRow = Math.floor(yOnContent / RENDERED_PIXEL_SIZE_CONFIG);

    if (logicalCol >= 0 && logicalCol < LOGICAL_GRID_COLS_CONFIG && logicalRow >= 0 && logicalRow < logicalGridRows) {
      const bitmapIdx = logicalRow * LOGICAL_GRID_COLS_CONFIG + logicalCol;
      const existingSoldPixel = soldPixels.find(p => p.x === logicalCol && p.y === logicalRow);
      
      if (pixelBitmap[bitmapIdx] === 1) {
        setHighlightedPixel({ x: logicalCol, y: logicalRow });

        let mockDetails: SelectedPixelDetails;
        const randomRarity = mockRarities[Math.floor(Math.random() * mockRarities.length)];
        const randomLore = mockLoreSnippets[Math.floor(Math.random() * mockLoreSnippets.length)];
        const approxGps = mapPixelToApproxGps(logicalCol, logicalRow, LOGICAL_GRID_COLS_CONFIG, logicalGridRows);
        const region = mapData?.districtMapping?.[`${logicalCol},${logicalRow}`] || "Desconhecida";
        const basePrice = PIXEL_BASE_PRICE * (PIXEL_RARITY_MULTIPLIERS[randomRarity] || 1);
        const specialCreditsPrice = SPECIAL_CREDITS_CONVERSION[randomRarity] || 10;

        if (existingSoldPixel) {
             mockDetails = {
                x: logicalCol, y: logicalRow, owner: existingSoldPixel.ownerId || MOCK_CURRENT_USER_ID,
                acquisitionDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toLocaleDateString('pt-PT'),
                lastModifiedDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toLocaleDateString('pt-PT'),
                color: existingSoldPixel.color,
                history: [{ owner: existingSoldPixel.ownerId || MOCK_CURRENT_USER_ID, date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toLocaleDateString('pt-PT'), price: Math.floor(Math.random() * 40) + 5 }],
                isOwnedByCurrentUser: (existingSoldPixel.ownerId || MOCK_CURRENT_USER_ID) === MOCK_CURRENT_USER_ID,
                isForSaleBySystem: false, manualDescription: 'Este é o meu pixel especial!',
                pixelImageUrl: existingSoldPixel.pixelImageUrl, dataAiHint: 'pixel image',
                title: existingSoldPixel.title || `Pixel de ${existingSoldPixel.ownerId || MOCK_CURRENT_USER_ID}`,
                tags: ['meu', 'favorito'], linkUrl: Math.random() > 0.5 ? 'https://dourado.com' : undefined,
                isForSaleByOwner: Math.random() > 0.5, salePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : undefined,
                isFavorited: Math.random() > 0.5, rarity: randomRarity, loreSnippet: randomLore,
                gpsCoords: approxGps, price: 0, views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 200), region, isProtected: Math.random() > 0.8, specialCreditsPrice: specialCreditsPrice,
            };
        } else { 
             mockDetails = {
                x: logicalCol, y: logicalRow, owner: 'Disponível (Sistema)', price: basePrice,
                color: unsoldColor, isOwnedByCurrentUser: false, isForSaleBySystem: true,
                history: [], isFavorited: Math.random() > 0.8, rarity: randomRarity, loreSnippet: randomLore,
                gpsCoords: approxGps, views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 200), region, isProtected: false, specialCreditsPrice: specialCreditsPrice,
            };
        }
        setSelectedPixelDetails(mockDetails);
        setShowPixelModal(true);
      } else { 
        setHighlightedPixel(null);
        setSelectedPixelDetails(null);
      }
    } else { 
      setHighlightedPixel(null);
      setSelectedPixelDetails(null);
    }
  };

  const handleMouseUpOrLeave = (event: React.MouseEvent) => {
    if (isDragging) {
      if (!didDragRef.current) {
        handleCanvasClick(event);
        
        // Handle measurement tool
        if (selectedTool === 'measure') {
          const rect = containerRef.current!.getBoundingClientRect();
          const clickXInContainer = event.clientX - rect.left;
          const clickYInContainer = event.clientY - rect.top;
          const xOnContent = (clickXInContainer - position.x) / zoom;
          const yOnContent = (clickYInContainer - position.y) / zoom;
          const logicalCol = Math.floor(xOnContent / RENDERED_PIXEL_SIZE_CONFIG);
          const logicalRow = Math.floor(yOnContent / RENDERED_PIXEL_SIZE_CONFIG);
          handleMeasurementClick(logicalCol, logicalRow);
        }
      }
      setIsDragging(false);
    }
  };
  
  const handlePurchase = async (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any): Promise<boolean> => {
    if (!user) {
        toast({
            title: "Autenticação Necessária",
            description: "Por favor, inicie sessão ou crie uma conta para comprar pixels.",
            variant: "destructive"
        });
        return false;
    }

    await new Promise(resolve => setTimeout(resolve, 500)); 

    const price = pixelData.salePrice || pixelData.price;
    if (price > 10000) { 
        return false;
    }

    const newSoldPixel: SoldPixel = {
      x: pixelData.x,
      y: pixelData.y,
      color: customizations.color || USER_BOUGHT_PIXEL_COLOR,
      ownerId: MOCK_CURRENT_USER_ID,
      title: customizations.title || `Meu Pixel (${pixelData.x},${pixelData.y})`,
      pixelImageUrl: customizations.image, 
    };
    
    addSoldPixel(newSoldPixel);

    setSelectedPixelDetails({
      ...pixelData,
      owner: MOCK_CURRENT_USER_ID,
      isOwnedByCurrentUser: true,
      isForSaleBySystem: false,
      isForSaleByOwner: false,
      price: 0,
      salePrice: undefined,
      acquisitionDate: new Date().toLocaleDateString('pt-PT'),
      lastModifiedDate: new Date().toLocaleDateString('pt-PT'),
      color: newSoldPixel.color,
      title: newSoldPixel.title,
      pixelImageUrl: newSoldPixel.pixelImageUrl,
    });
    
    return true; // Indicate success
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleExportView();
            break;
          case 'f':
            e.preventDefault();
            handleToggleFullscreen();
            break;
          case 'g':
            e.preventDefault();
            setShowGrid(!showGrid);
            break;
          case 'r':
            e.preventDefault();
            handleResetView();
            break;
        }
      } else {
        switch (e.key) {
          case 'Escape':
            setSelectedTool('pan');
            setMeasurementPoints([]);
            break;
          case '1':
            setViewMode('normal');
            break;
          case '2':
            setViewMode('heatmap');
            break;
          case '3':
            setViewMode('ownership');
            break;
          case '4':
            setViewMode('rarity');
            break;
          case '5':
            setViewMode('activity');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showGrid, handleExportView, handleToggleFullscreen, handleResetView]);

  const handleWheelZoom = useCallback((event: WheelEvent) => {
    clearAutoResetTimeout();
    if (!containerRef.current) return;
    event.preventDefault();

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseXInContainer = event.clientX - containerRect.left;
    const mouseYInContainer = event.clientY - containerRect.top;

    let newZoom;
    if (event.deltaY < 0) { 
      newZoom = Math.min(zoom * ZOOM_SENSITIVITY_FACTOR, MAX_ZOOM);
    } else { 
      newZoom = Math.max(zoom / ZOOM_SENSITIVITY_FACTOR, MIN_ZOOM);
    }

    if (newZoom === zoom) return; 

    const currentCanvasX = (mouseXInContainer - position.x) / zoom;
    const currentCanvasY = (mouseYInContainer - position.y) / zoom;

    const newPosX = mouseXInContainer - currentCanvasX * newZoom;
    const newPosY = mouseYInContainer - currentCanvasY * newZoom;

    setZoom(newZoom);
    setPosition({ x: newPosX, y: newPosY });

  }, [zoom, position, clearAutoResetTimeout]); 

  useEffect(() => { 
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('wheel', handleWheelZoom, { passive: false });
      return () => {
        currentContainer.removeEventListener('wheel', handleWheelZoom);
      };
    }
  }, [handleWheelZoom]); 


 useEffect(() => { 
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
    }
    if (!defaultView || showPixelModal || isDragging) { 
      return;
    } 

    const isDefaultZoom = Math.abs(zoom - defaultView.zoom) < 0.001;
    const isDefaultPosition =
      defaultView.position &&
      Math.abs(position.x - defaultView.position.x) < 0.5 &&
      Math.abs(position.y - defaultView.position.y) < 0.5;

    if (!isDefaultZoom || !isDefaultPosition) {
      autoResetTimeoutRef.current = setTimeout(() => {
        handleResetView();
      }, 15000); 
    }

    return () => {
      if (autoResetTimeoutRef.current) {
        clearTimeout(autoResetTimeoutRef.current);
      }
    };
  }, [zoom, position, handleResetView, defaultView, showPixelModal, isDragging]);
  
  const showProgressIndicator = isLoadingMap || (progressMessage !== "");

  const handleGoToMyLocation = () => {
    if (!containerRef.current || !pixelBitmap) return;

    // Simulate finding a location in Lisbon
    const myLocationPixel = { x: 579, y: 1358 };

    // Check if the pixel is valid and on the map
    const bitmapIdx = myLocationPixel.y * LOGICAL_GRID_COLS_CONFIG + myLocationPixel.x;
    if (pixelBitmap[bitmapIdx] !== 1) {
        toast({ title: "Localização não encontrada", description: "Não foi possível encontrar um pixel ativo na sua localização simulada."});
        return;
    }

    setHighlightedPixel(myLocationPixel);

    const targetZoom = 15;
    const containerWidth = containerRef.current.offsetWidth;
    const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;

    const targetX = -myLocationPixel.x * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + containerWidth / 2;
    const targetY = -myLocationPixel.y * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + effectiveContainerHeight / 2;
    
    setPosition({ x: targetX, y: targetY });
    setZoom(targetZoom);
    toast({ title: "Localização Encontrada!", description: "Centrado no pixel mais próximo da sua localização." });
  };
  
  const handleViewOnRealMap = () => {
    if (selectedPixelDetails?.gpsCoords) {
      const { lat, lon } = selectedPixelDetails.gpsCoords;
      const url = `https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`; // z=18 for high zoom, t=k for satellite
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast({ title: "Coordenadas não disponíveis", description: "Não foi possível determinar a localização GPS para este pixel." });
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative animate-fade-in">
      {/* Sound Effects */}
      <SoundEffect src={SOUND_EFFECTS.HOVER} play={playHoverSound} onEnd={() => setPlayHoverSound(false)} volume={0.2} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      {/* Enhanced loading overlay */}
      <LoadingOverlay 
        isLoading={isLoadingMap} 
        text={progressMessage}
        progress={loadingProgress}
      >
        <div />
      </LoadingOverlay>
      
      {/* Enhanced Control Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-20 space-y-3 pointer-events-auto"
      >
        {/* Main Controls */}
        <Card className="bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border-primary/20">
          <div className="space-y-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ampliar (Ctrl + +)</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reduzir (Ctrl + -)</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleResetView} className="h-8 w-8">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Resetar Vista (Ctrl + R)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* View Mode Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Modo de Vista</Label>
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="heatmap">Mapa de Calor</SelectItem>
                  <SelectItem value="ownership">Propriedade</SelectItem>
                  <SelectItem value="rarity">Raridade</SelectItem>
                  <SelectItem value="activity">Atividade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filter Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Filtro</Label>
              <Select value={activeFilter} onValueChange={(value: FilterType) => setActiveFilter(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="available">Disponíveis</SelectItem>
                  <SelectItem value="owned">Meus</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="recent">Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tool Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Ferramenta</Label>
              <div className="grid grid-cols-3 gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTool === 'pan' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setSelectedTool('pan')}
                        className="h-8 w-8"
                      >
                        <Move className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Navegar</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTool === 'select' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setSelectedTool('select')}
                        className="h-8 w-8"
                      >
                        <MousePointer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Selecionar</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTool === 'measure' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setSelectedTool('measure')}
                        className="h-8 w-8"
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Medir Distância</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Toggle Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Grelha</Label>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Coordenadas</Label>
                <Switch checked={showCoordinates} onCheckedChange={setShowCoordinates} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Minimapa</Label>
                <Switch checked={showMinimap} onCheckedChange={setShowMinimap} />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
        {/* Advanced Controls (Collapsible) */}
        <AnimatePresence>
          {showAdvancedControls && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border-primary/20">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-primary">Controlos Avançados</h3>
                  
                  {/* Search */}
                  <div className="space-y-2">
                    <Label className="text-xs">Pesquisar Pixel</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="x,y ou nome..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-7 text-xs"
                      />
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="space-y-1">
                    <Label className="text-xs">Performance</Label>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>FPS:</span>
                        <span className={performanceMetrics.fps < 30 ? 'text-red-500' : 'text-green-500'}>
                          {performanceMetrics.fps}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pixels:</span>
                        <span>{performanceMetrics.pixelsRendered.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Advanced Controls Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedControls(!showAdvancedControls)}
          className="w-full h-8 text-xs"
        >
          <Settings className="h-3 w-3 mr-2" />
          {showAdvancedControls ? 'Ocultar' : 'Mostrar'} Avançados
        </Button>
      </motion.div>
      
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-card/80 backdrop-blur-sm p-2 rounded-lg shadow-lg pointer-events-auto animate-slide-in-up animation-delay-200">
        <EnhancedTooltip
          title="Controles do Mapa"
          description="Use estes controles para navegar pelo mapa"
          stats={[
            { label: 'Zoom', value: `${zoom.toFixed(2)}x`, icon: <ZoomIn className="h-4 w-4" /> },
            { label: 'Pixels', value: activePixelsInMap.toLocaleString(), icon: <MapPinIconLucide className="h-4 w-4" /> }
          ]}
        >
          <div className="space-y-2">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button pointerEvents="auto" variant="outline" size="icon" onClick={handleZoomIn} aria-label="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Ampliar</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button pointerEvents="auto" variant="outline" size="icon" onClick={handleZoomOut} aria-label="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Reduzir</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button pointerEvents="auto" variant="outline" size="icon" onClick={handleResetView} aria-label="Reset View">
                    <Expand className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Resetar Vista</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </EnhancedTooltip>
        
        {/* Enhanced info panel */}
        <div className="mt-2 p-3 bg-background/90 rounded-md text-xs font-code border border-primary/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Zoom:</span>
            <span className="text-primary font-bold">{zoom.toFixed(2)}x</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Posição:</span>
            <span className="text-accent">({Math.round(position.x)}, {Math.round(position.y)})</span>
          </div>
          {highlightedPixel && (
            <div className="flex items-center justify-between border-t border-primary/20 pt-1">
              <span className="text-muted-foreground">Pixel:</span>
              <span className="text-primary font-bold">({highlightedPixel.x}, {highlightedPixel.y})</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-primary/20 pt-1">
            <span className="text-muted-foreground">Pixels Ativos:</span>
            <span className="text-green-500 font-bold">{activePixelsInMap.toLocaleString()}</span>
          </div>
          
          {/* Online status indicator */}
          <div className="flex items-center justify-between border-t border-primary/20 pt-1">
            <span className="text-muted-foreground">Status:</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Remove old progress indicator since we now use LoadingOverlay */}
      {/* {showProgressIndicator && (...)} */}
      
      <EnhancedPixelPurchaseModal
        isOpen={showPixelModal}
        onClose={() => setShowPixelModal(false)}
        pixelData={selectedPixelDetails}
        userCredits={12500} // Mocked value, ideally from user store
        userSpecialCredits={120} // Mocked value
        onPurchase={handlePurchase}
      />

      <div className="flex-grow w-full h-full p-4 md:p-8 flex items-center justify-center">
        <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative rounded-xl shadow-2xl border border-primary/20"
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{ cursor: selectedTool === 'measure' ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
        >
            <div
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                width: `${canvasDrawWidth}px`,
                height: `${canvasDrawHeight}px`,
                transformOrigin: 'top left',
                position: 'relative', 
            }}
            >
            <canvas
                ref={pixelCanvasRef}
                className="absolute top-0 left-0 w-full h-full z-10" 
                style={{ imageRendering: 'pixelated' }} 
            />
            {(!mapData && isClient) && <PortugalMapSvg onMapDataLoaded={handleMapDataLoaded} className="invisible absolute" />}
            </div>
            <canvas
                ref={outlineCanvasRef}
                className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
                style={{ imageRendering: 'auto' }}
            />
        </div>
      </div>
      
      {/* Zoom Controls */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-20 space-y-3 pointer-events-auto"
      >
        {/* Quick Actions */}
        <Card className="bg-card/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border-primary/20">
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleToggleFullscreen} className="h-8 w-8">
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ecrã Completo (Ctrl + F)</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExportView} className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exportar Vista (Ctrl + S)</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShareView} className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Partilhar Vista</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
        
        {/* Bookmarks Panel */}
        {bookmarkedPixels.length > 0 && (
          <Card className="bg-card/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border-primary/20 max-w-48">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-primary flex items-center">
                <Bookmark className="h-3 w-3 mr-1" />
                Marcadores
              </h3>
              <ScrollArea className="max-h-32">
                <div className="space-y-1">
                  {bookmarkedPixels.slice(0, 5).map((bookmark, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGoToPixel(bookmark.x, bookmark.y)}
                      className="w-full justify-start h-6 text-xs p-1"
                    >
                      <MapPinIconLucide className="h-3 w-3 mr-1" />
                      {bookmark.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        )}
        
        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card className="bg-card/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border-primary/20 max-w-48">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-accent flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Atividade Recente
              </h3>
              <div className="space-y-1">
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGoToPixel(activity.x, activity.y)}
                    className="w-full justify-start h-6 text-xs p-1"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    ({activity.x}, {activity.y})
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </motion.div>
      
      {/* Minimap */}
      {showMinimap && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-24 right-4 z-20 pointer-events-auto"
        >
          <Card className="bg-card/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border-primary/20">
            <div className="w-32 h-24 bg-muted/50 rounded border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div 
                className="absolute bg-primary/60 border border-primary"
                style={{
                  left: `${Math.max(0, Math.min(100, (position.x / canvasDrawWidth) * 100))}%`,
                  top: `${Math.max(0, Math.min(100, (position.y / canvasDrawHeight) * 100))}%`,
                  width: `${Math.min(20, (containerSizeRef.current.width / canvasDrawWidth) * 100)}%`,
                  height: `${Math.min(20, (containerSizeRef.current.height / canvasDrawHeight) * 100)}%`
                }}
              />
              <div className="absolute bottom-1 left-1 text-xs text-primary font-bold">
                {zoom.toFixed(1)}x
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto"
      >
        <Card className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-primary/20">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <MapPinIconLucide className="h-3 w-3 text-primary" />
              <span>{activePixelsInMap.toLocaleString()} pixels</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-accent" />
              <span>{performanceMetrics.fps} FPS</span>
            </div>
            
            {lastSaved && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Guardado {lastSaved.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>
      
      {/* Measurement overlay */}
      {measurementPoints.length > 0 && (
        <div className="absolute inset-0 z-15 pointer-events-none">
          {measurementPoints.map((point, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-red-500 rounded-full border-2 border-white"
              style={{
                left: position.x + point.x * RENDERED_PIXEL_SIZE_CONFIG * zoom,
                top: position.y + point.y * RENDERED_PIXEL_SIZE_CONFIG * zoom,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}
      
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button style={{ pointerEvents: 'auto' }} variant="outline" size="icon" onClick={handleZoomIn} aria-label="Zoom In">
                <ZoomIn className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Aproximar</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button style={{ pointerEvents: 'auto' }} variant="outline" size="icon" onClick={handleZoomOut} aria-label="Zoom Out">
                <ZoomOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Afastar</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button style={{ pointerEvents: 'auto' }} variant="outline" size="icon" onClick={handleResetView} aria-label="Reset View">
                <Expand className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Resetar Vista</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Enhanced Floating Action Button with better tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        className="absolute bottom-6 right-6 z-20 pointer-events-auto"
      >
        <EnhancedTooltip
          title="Menu de Ações"
          description="Acesso rápido a todas as funcionalidades do mapa"
          actions={[
            { 
              label: 'Ir para Lisboa', 
              onClick: () => handleGoToPixel(579, 358), 
              icon: <Navigation className="h-4 w-4" /> 
            },
            { 
              label: 'Marcar Pixel', 
              onClick: () => highlightedPixel && handleBookmarkPixel(highlightedPixel.x, highlightedPixel.y), 
              icon: <Bookmark className="h-4 w-4" /> 
            },
            {
              label: 'Ajuda',
              onClick: () => {},
              icon: <HelpCircle className="h-4 w-4" />
            }
          ]}
          interactive={true}
        >
          <Dialog>
            <DialogTrigger asChild>
               <Button 
                 style={{ pointerEvents: 'auto' }} 
                 size="icon" 
                 className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-background"
               >
                  <Sparkles className="h-7 w-7 animate-pulse" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-sm border-primary/30 shadow-xl" data-dialog-content style={{ pointerEvents: 'auto' }}>
              <DialogHeader className="dialog-header-gold-accent rounded-t-lg">
                <DialogTitle className="font-headline text-shadow-gold-sm flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Centro de Comando do Universo
                </DialogTitle>
                <DialogDescriptionElement className="text-muted-foreground animate-fade-in animation-delay-200">
                  Acesso completo a todas as funcionalidades avançadas do mapa.
                </DialogDescriptionElement>
              </DialogHeader>
              
              <Tabs defaultValue="navigation" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="navigation">Navegação</TabsTrigger>
                  <TabsTrigger value="tools">Ferramentas</TabsTrigger>
                  <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="navigation" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={() => handleGoToPixel(579, 358)} className="button-3d-effect-outline">
                      <Navigation className="mr-2 h-4 w-4" />Lisboa
                    </Button>
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={() => handleGoToPixel(640, 260)} className="button-3d-effect-outline">
                      <Navigation className="mr-2 h-4 w-4" />Porto
                    </Button>
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={() => handleGoToPixel(706, 962)} className="button-3d-effect-outline">
                      <Navigation className="mr-2 h-4 w-4" />Faro
                    </Button>
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={handleGoToMyLocation} className="button-3d-effect-outline">
                      <Compass className="mr-2 h-4 w-4" />Minha Localização
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="tools" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={handleExportView} className="button-3d-effect-outline">
                      <Download className="mr-2 h-4 w-4" />Exportar
                    </Button>
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={handleShareView} className="button-3d-effect-outline">
                      <Share2 className="mr-2 h-4 w-4" />Partilhar
                    </Button>
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={() => setSelectedTool('measure')} className="button-3d-effect-outline">
                      <Target className="mr-2 h-4 w-4" />Medir
                    </Button>
                    <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={() => setShowGrid(!showGrid)} className="button-3d-effect-outline">
                      <Grid3X3 className="mr-2 h-4 w-4" />Grelha
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="stats" className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">{zoom.toFixed(1)}x</div>
                      <div className="text-xs text-muted-foreground">Zoom</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-accent">{performanceMetrics.fps}</div>
                      <div className="text-xs text-muted-foreground">FPS</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-green-500">{activePixelsInMap.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Pixels Ativos</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-purple-500">{filteredPixels.length}</div>
                      <div className="text-xs text-muted-foreground">Filtrados</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="dialog-footer-gold-accent rounded-b-lg">
                <div className="w-full">
                  <Separator className="mb-3" />
                  <Link href="/premium" className="w-full">
                    <Button style={{ pointerEvents: 'auto' }} variant="default" className="w-full button-gradient-gold button-3d-effect">
                      <Crown className="mr-2 h-4 w-4" />Tornar-se Premium
                    </Button>
                  </Link>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </EnhancedTooltip>
      </motion.div>
      
      {/* Keyboard Shortcuts Help */}
      <AnimatePresence>
        {selectedTool === 'measure' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <Card className="bg-card/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border-primary/30">
              <div className="text-center space-y-2">
                <Target className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold text-primary">Ferramenta de Medição</h3>
                <p className="text-sm text-muted-foreground">
                  Clique em dois pixels para medir a distância entre eles
                </p>
                <Badge variant="outline" className="text-xs">
                  Pressione ESC para cancelar
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
                  </Button>
                </Link>
              </div>
              <DialogFooter className="dialog-footer-gold-accent rounded-b-lg">
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </EnhancedTooltip>
      </div>
    </div>
  );
}

// Enhanced cursor styles for different tools
export const getCursorStyle = (tool: string) => {
  switch (tool) {
    case 'brush':
      return 'cursor-crosshair';
    case 'eraser':
      return 'cursor-not-allowed';
    case 'bucket':
      return 'cursor-pointer';
    case 'eyedropper':
      return 'cursor-copy';
    case 'move':
      return 'cursor-move';
    case 'zoom':
      return 'cursor-zoom-in';
    case 'measure':
      return 'cursor-crosshair';
    case 'select':
      return 'cursor-pointer';
    default:
      return 'cursor-default';
  }
};