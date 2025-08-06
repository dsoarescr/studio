
// src/components/pixel-grid/PixelGrid.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ZoomIn, ZoomOut, Expand, Search, Sparkles, Info, User, CalendarDays,
  History as HistoryIcon, DollarSign, ShoppingCart, Edit3, Palette as PaletteIconLucide, FileText, Upload, Save,
  Image as ImageIcon, XCircle, TagsIcon, Link as LinkIconLucide, Pencil,
  Eraser, PaintBucket, Trash2, Heart, Flag, BadgePercent, Star, MapPin as MapPinIconLucide, ScrollText, Gem, Globe, AlertTriangle,
  Map as MapIcon, Crown, Crosshair, Camera, Play, Radio, Brain, Trophy, Gavel, Users, Layers, Grid, Filter, Target, Zap, Eye, MousePointer
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
import PixelAR from './PixelAR';
import PixelStories from './PixelStories';
import PixelLiveStream from './PixelLiveStream';
import PixelCollaborativeEditor from './PixelCollaborativeEditor';
import PixelAuction from './PixelAuction';
import PixelGameification from './PixelGameification';
import PixelAI from './PixelAI';
import PixelSocialFeatures from './PixelSocialFeatures';
import SwipeGestures from '../mobile/SwipeGestures';
import MobileOptimizations from '../mobile/MobileOptimizations';
import { useHapticFeedback } from '../mobile/HapticFeedback';


// Configuration constants
const SVG_VIEWBOX_WIDTH = 12969;
const SVG_VIEWBOX_HEIGHT = 26674;
const LOGICAL_GRID_COLS_CONFIG = 1273;
const RENDERED_PIXEL_SIZE_CONFIG = 1;

// Enhanced visual constants
const PIXEL_HOVER_SCALE = 1.2;
const PIXEL_ANIMATION_DURATION = 200;
const GRID_LINE_OPACITY = 0.1;
const HIGHLIGHT_GLOW_SIZE = 3;

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

const PLACEHOLDER_IMAGE_DATA_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const USER_BOUGHT_PIXEL_COLOR = 'hsl(var(--primary))';

const MOCK_CURRENT_USER_ID = 'currentUserPixelMaster';

// Enhanced pixel states
type PixelState = 'available' | 'owned' | 'highlighted' | 'selected' | 'hovered' | 'animated';

interface PixelVisualEffect {
  x: number;
  y: number;
  type: 'purchase' | 'edit' | 'hover' | 'select';
  timestamp: number;
  duration: number;
}

interface SoldPixel {
  x: number;
  y: number;
  color: string;
  ownerId?: string;
  title?: string;
  pixelImageUrl?: string;
  lastModified?: number;
  purchaseAnimation?: boolean;
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
}

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 50;
const ZOOM_SENSITIVITY_FACTOR = 1.1;
const HEADER_HEIGHT_PX = 64;
const BOTTOM_NAV_HEIGHT_PX = 64;

// Enhanced interaction constants
const DOUBLE_CLICK_THRESHOLD = 300;
const LONG_PRESS_THRESHOLD = 800;
const HOVER_DELAY = 500;

const mockRarities: SelectedPixelDetails['rarity'][] = ['Comum', 'Raro', 'Épico', 'Lendário', 'Marco Histórico'];
const mockLoreSnippets: string[] = [
  "Dizem que este pixel brilha sob a lua cheia.",
  "Um antigo mapa sugere um tesouro escondido perto daqui.",
  "Sente-se uma energia estranha emanando deste local.",
];

// Enhanced visual effects
const PIXEL_EFFECTS = {
  PURCHASE: 'animate-scale-in',
  EDIT: 'animate-pulse',
  HOVER: 'animate-glow',
  SELECT: 'animate-bounce-slow'
};

export default function PixelGrid() {
  const [isClient, setIsClient] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [defaultView, setDefaultView] = useState<{ zoom: number; position: { x: number; y: number } } | null>(null);

  const didDragRef = useRef(false);
  const dragThreshold = 5;

  const [highlightedPixel, setHighlightedPixel] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);
  const [animatingPixels, setAnimatingPixels] = useState<Set<string>>(new Set());
  const [visualEffects, setVisualEffects] = useState<PixelVisualEffect[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [pixelFilter, setPixelFilter] = useState<'all' | 'owned' | 'available' | 'recent'>('all');
  const [lastClickTime, setLastClickTime] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedPixelDetails, setSelectedPixelDetails] = useState<SelectedPixelDetails | null>(null);
  
  const [showPixelModal, setShowPixelModal] = useState(false);
  const { user } = useAuth();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const effectsCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const [mapData, setMapData] = useState<MapData | null>(null);
  const [pixelBitmap, setPixelBitmap] = useState<Uint8Array | null>(null);
  const [activePixelsInMap, setActivePixelsInMap] = useState(0);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [progressMessage, setProgressMessage] = useState("Aguardando cliente...");
  
  const { isOnline } = useAppStore();
  const { soldPixels, addSoldPixel } = usePixelStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });
  const { vibrate } = useHapticFeedback();

  // Enhanced pixel management
  const pixelStates = useMemo(() => {
    const states = new Map<string, PixelState>();
    
    soldPixels.forEach(pixel => {
      const key = `${pixel.x},${pixel.y}`;
      states.set(key, 'owned');
    });
    
    if (highlightedPixel) {
      const key = `${highlightedPixel.x},${highlightedPixel.y}`;
      states.set(key, 'highlighted');
    }
    
    if (hoveredPixel) {
      const key = `${hoveredPixel.x},${hoveredPixel.y}`;
      if (!states.has(key)) {
        states.set(key, 'hovered');
      }
    }
    
    return states;
  }, [soldPixels, highlightedPixel, hoveredPixel]);

  // Filter pixels based on current filter
  const filteredPixels = useMemo(() => {
    switch (pixelFilter) {
      case 'owned':
        return soldPixels;
      case 'available':
        return []; // Would be calculated from pixelBitmap
      case 'recent':
        return soldPixels.filter(p => p.lastModified && Date.now() - p.lastModified < 24 * 60 * 60 * 1000);
      default:
        return soldPixels;
    }
  }, [soldPixels, pixelFilter]);

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);
  
  // Enhanced loading state with better UX
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Add visual effect
  const addVisualEffect = useCallback((x: number, y: number, type: PixelVisualEffect['type']) => {
    const effect: PixelVisualEffect = {
      x,
      y,
      type,
      timestamp: Date.now(),
      duration: type === 'purchase' ? 2000 : type === 'edit' ? 1000 : 500
    };
    
    setVisualEffects(prev => [...prev, effect]);
    
    // Auto-remove effect after duration
    setTimeout(() => {
      setVisualEffects(prev => prev.filter(e => e.timestamp !== effect.timestamp));
    }, effect.duration);
  }, []);
  
  // Enhanced animation for pixel purchase
  const animatePixelPurchase = useCallback((x: number, y: number) => {
    const key = `${x},${y}`;
    setAnimatingPixels(prev => new Set(prev).add(key));
    addVisualEffect(x, y, 'purchase');
    
    setTimeout(() => {
      setAnimatingPixels(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 2000);
  }, [addVisualEffect]);
  
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

  // Enhanced pixel rendering with visual effects
  useEffect(() => {
    if (!pixelBitmap || !unsoldColor || !pixelCanvasRef.current || !effectsCanvasRef.current) return;
    
    const canvas = pixelCanvasRef.current;
    const effectsCanvas = effectsCanvasRef.current;
    
    if (canvas.width !== canvasDrawWidth || canvas.height !== canvasDrawHeight) {
        canvas.width = canvasDrawWidth;
        canvas.height = canvasDrawHeight;
    }
    if (effectsCanvas.width !== canvasDrawWidth || effectsCanvas.height !== canvasDrawHeight) {
        effectsCanvas.width = canvasDrawWidth;
        effectsCanvas.height = canvasDrawHeight;
    }
    
    const ctx = canvas.getContext('2d');
    const effectsCtx = effectsCanvas.getContext('2d');
    if (!ctx || !effectsCtx) return;
    
    ctx.imageSmoothingEnabled = false;
    effectsCtx.imageSmoothingEnabled = false;

    // 1. Clear and draw the base map (unsold pixels)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
    
    // Draw base unsold pixels with enhanced visuals
    ctx.fillStyle = unsoldColor;
    for (let row = 0; row < logicalGridRows; row++) {
        for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
            if (pixelBitmap[row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
                const pixelKey = `${col},${row}`;
                const state = pixelStates.get(pixelKey);
                
                // Enhanced rendering based on state
                if (state === 'hovered') {
                  ctx.save();
                  ctx.shadowColor = unsoldColor;
                  ctx.shadowBlur = 5;
                  ctx.fillStyle = unsoldColor;
                  ctx.fillRect(
                      col * RENDERED_PIXEL_SIZE_CONFIG - 1,
                      row * RENDERED_PIXEL_SIZE_CONFIG - 1,
                      RENDERED_PIXEL_SIZE_CONFIG + 2,
                      RENDERED_PIXEL_SIZE_CONFIG + 2
                  );
                  ctx.restore();
                } else {
                  ctx.fillRect(
                      col * RENDERED_PIXEL_SIZE_CONFIG,
                      row * RENDERED_PIXEL_SIZE_CONFIG,
                      RENDERED_PIXEL_SIZE_CONFIG,
                      RENDERED_PIXEL_SIZE_CONFIG
                  );
                }
            }
        }
    }

    // 2. Draw sold pixels with enhanced effects
    soldPixels.forEach(pixel => {
      const renderX = pixel.x * RENDERED_PIXEL_SIZE_CONFIG;
      const renderY = pixel.y * RENDERED_PIXEL_SIZE_CONFIG;
      const pixelKey = `${pixel.x},${pixel.y}`;
      const isAnimating = animatingPixels.has(pixelKey);
      const state = pixelStates.get(pixelKey);
      
      ctx.save();
      
      // Add glow effect for owned pixels
      if (pixel.ownerId === MOCK_CURRENT_USER_ID) {
        ctx.shadowColor = pixel.color;
        ctx.shadowBlur = 3;
      }
      
      // Scale effect for animations
      if (isAnimating || state === 'hovered') {
        const scale = isAnimating ? 1.3 : 1.1;
        const offset = (scale - 1) * RENDERED_PIXEL_SIZE_CONFIG / 2;
        ctx.translate(renderX + RENDERED_PIXEL_SIZE_CONFIG / 2, renderY + RENDERED_PIXEL_SIZE_CONFIG / 2);
        ctx.scale(scale, scale);
        ctx.translate(-RENDERED_PIXEL_SIZE_CONFIG / 2, -RENDERED_PIXEL_SIZE_CONFIG / 2);
        
        if (pixel.pixelImageUrl) {
          const img = loadedPixelImages.get(pixel.pixelImageUrl);
          if (img && img.complete) {
              ctx.drawImage(img, 0, 0, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
          } else {
              ctx.fillStyle = pixel.color;
              ctx.fillRect(0, 0, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
          }
        } else {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(0, 0, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
        }
      } else {
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
      }
      
      ctx.restore();
    });
    
    // 3. Draw visual effects
    visualEffects.forEach(effect => {
      const age = Date.now() - effect.timestamp;
      const progress = Math.min(age / effect.duration, 1);
      const alpha = 1 - progress;
      
      effectsCtx.save();
      effectsCtx.globalAlpha = alpha;
      
      const renderX = effect.x * RENDERED_PIXEL_SIZE_CONFIG;
      const renderY = effect.y * RENDERED_PIXEL_SIZE_CONFIG;
      
      switch (effect.type) {
        case 'purchase':
          // Expanding circle effect
          const radius = progress * 20;
          effectsCtx.strokeStyle = '#FFD700';
          effectsCtx.lineWidth = 2;
          effectsCtx.beginPath();
          effectsCtx.arc(
            renderX + RENDERED_PIXEL_SIZE_CONFIG / 2,
            renderY + RENDERED_PIXEL_SIZE_CONFIG / 2,
            radius,
            0,
            2 * Math.PI
          );
          effectsCtx.stroke();
          break;
          
        case 'edit':
          // Pulsing border effect
          const pulseSize = Math.sin(progress * Math.PI * 4) * 2;
          effectsCtx.strokeStyle = '#7DF9FF';
          effectsCtx.lineWidth = 1;
          effectsCtx.strokeRect(
            renderX - pulseSize,
            renderY - pulseSize,
            RENDERED_PIXEL_SIZE_CONFIG + pulseSize * 2,
            RENDERED_PIXEL_SIZE_CONFIG + pulseSize * 2
          );
          break;
          
        case 'hover':
          // Subtle glow effect
          effectsCtx.fillStyle = `rgba(212, 167, 87, ${alpha * 0.3})`;
          effectsCtx.fillRect(
            renderX - 1,
            renderY - 1,
            RENDERED_PIXEL_SIZE_CONFIG + 2,
            RENDERED_PIXEL_SIZE_CONFIG + 2
          );
          break;
      }
      
      effectsCtx.restore();
    });

  }, [pixelBitmap, soldPixels, unsoldColor, logicalGridRows, loadedPixelImages, pixelStates, animatingPixels, visualEffects]);
  
  // Enhanced grid rendering
  useEffect(() => {
    if (!showGrid || !gridCanvasRef.current || !pixelBitmap) return;
    
    const canvas = gridCanvasRef.current;
    if (canvas.width !== canvasDrawWidth || canvas.height !== canvasDrawHeight) {
        canvas.width = canvasDrawWidth;
        canvas.height = canvasDrawHeight;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = `rgba(125, 249, 255, ${GRID_LINE_OPACITY})`;
    ctx.lineWidth = 0.5;
    
    // Draw grid lines only where pixels exist
    for (let row = 0; row <= logicalGridRows; row++) {
      ctx.beginPath();
      ctx.moveTo(0, row * RENDERED_PIXEL_SIZE_CONFIG);
      ctx.lineTo(canvasDrawWidth, row * RENDERED_PIXEL_SIZE_CONFIG);
      ctx.stroke();
    }
    
    for (let col = 0; col <= LOGICAL_GRID_COLS_CONFIG; col++) {
      ctx.beginPath();
      ctx.moveTo(col * RENDERED_PIXEL_SIZE_CONFIG, 0);
      ctx.lineTo(col * RENDERED_PIXEL_SIZE_CONFIG, canvasDrawHeight);
      ctx.stroke();
    }
  }, [showGrid, pixelBitmap, logicalGridRows]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        containerSizeRef.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
        
        // Update all overlay canvases
        [outlineCanvasRef.current, effectsCanvasRef.current, gridCanvasRef.current].forEach(canvas => {
          if (canvas) {
            canvas.width = entry.contentRect.width;
            canvas.height = entry.contentRect.height;
          }
        });
      }
    });
  
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Enhanced outline rendering with better visual feedback
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
    ctx.lineWidth = Math.max(0.3, 0.5 / (zoom * logicalToSvgScale));
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
  
    // Enhanced highlighted pixel border with glow
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(zoom, zoom);
    
    if (highlightedPixel) {
        // Main highlight border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = Math.max(1, (2 / zoom) * RENDERED_PIXEL_SIZE_CONFIG);
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = HIGHLIGHT_GLOW_SIZE;
        ctx.strokeRect(
            highlightedPixel.x * RENDERED_PIXEL_SIZE_CONFIG - 1,
            highlightedPixel.y * RENDERED_PIXEL_SIZE_CONFIG - 1,
            RENDERED_PIXEL_SIZE_CONFIG + 2,
            RENDERED_PIXEL_SIZE_CONFIG + 2
        );
        
        // Animated outer glow
        const time = Date.now() * 0.003;
        const glowAlpha = (Math.sin(time) + 1) * 0.3;
        ctx.strokeStyle = `rgba(255, 215, 0, ${glowAlpha})`;
        ctx.lineWidth = Math.max(2, (4 / zoom) * RENDERED_PIXEL_SIZE_CONFIG);
        ctx.strokeRect(
            highlightedPixel.x * RENDERED_PIXEL_SIZE_CONFIG - 2,
            highlightedPixel.y * RENDERED_PIXEL_SIZE_CONFIG - 2,
            RENDERED_PIXEL_SIZE_CONFIG + 4,
            RENDERED_PIXEL_SIZE_CONFIG + 4
        );
    }
    
    // Draw hovered pixel with subtle effect
    if (hoveredPixel && (!highlightedPixel || hoveredPixel.x !== highlightedPixel.x || hoveredPixel.y !== highlightedPixel.y)) {
        ctx.strokeStyle = 'rgba(125, 249, 255, 0.8)';
        ctx.lineWidth = Math.max(1, (1.5 / zoom) * RENDERED_PIXEL_SIZE_CONFIG);
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(
            hoveredPixel.x * RENDERED_PIXEL_SIZE_CONFIG,
            hoveredPixel.y * RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG,
            RENDERED_PIXEL_SIZE_CONFIG
        );
        ctx.setLineDash([]);
    }
    
    ctx.restore();

  }, [mapData, zoom, position, strokeColor, highlightedPixel, hoveredPixel, pixelStates]);
  

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

  // Enhanced mouse interaction with hover detection
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) {
      // Handle hover detection when not dragging
      if (!isDragging && pixelBitmap && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseXInContainer = e.clientX - rect.left;
        const mouseYInContainer = e.clientY - rect.top;

        const xOnContent = (mouseXInContainer - position.x) / zoom;
        const yOnContent = (mouseYInContainer - position.y) / zoom;

        const logicalCol = Math.floor(xOnContent / RENDERED_PIXEL_SIZE_CONFIG);
        const logicalRow = Math.floor(yOnContent / RENDERED_PIXEL_SIZE_CONFIG);

        if (logicalCol >= 0 && logicalCol < LOGICAL_GRID_COLS_CONFIG && logicalRow >= 0 && logicalRow < logicalGridRows) {
          const bitmapIdx = logicalRow * LOGICAL_GRID_COLS_CONFIG + logicalCol;
          if (pixelBitmap[bitmapIdx] === 1) {
            const newHovered = { x: logicalCol, y: logicalRow };
            if (!hoveredPixel || hoveredPixel.x !== newHovered.x || hoveredPixel.y !== newHovered.y) {
              setHoveredPixel(newHovered);
              addVisualEffect(logicalCol, logicalRow, 'hover');
            }
          } else {
            setHoveredPixel(null);
          }
        } else {
          setHoveredPixel(null);
        }
      }
      return;
    }
    
    // Original dragging logic
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

  const handleMouseDown = (e: React.MouseEvent) => {
    clearAutoResetTimeout();
    const targetElement = e.target as HTMLElement;
     if (targetElement.closest('button, [data-dialog-content], [data-tooltip-content], [data-popover-content], label, a, [role="menuitem"], [role="tab"], input, textarea')) {
        return;
    }
    
    // Enhanced interaction detection
    const currentTime = Date.now();
    const isDoubleClick = currentTime - lastClickTime < DOUBLE_CLICK_THRESHOLD;
    setLastClickTime(currentTime);
    
    if (isDoubleClick) {
      // Handle double click for quick actions
      handleQuickAction(e);
      return;
    }
    
    // Start long press detection
    const timer = setTimeout(() => {
      handleLongPress(e);
    }, LONG_PRESS_THRESHOLD);
    setLongPressTimer(timer);
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    didDragRef.current = false;
  };

  // Enhanced quick action handler
  const handleQuickAction = (e: React.MouseEvent) => {
    if (!pixelBitmap || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickXInContainer = e.clientX - rect.left;
    const clickYInContainer = e.clientY - rect.top;

    const xOnContent = (clickXInContainer - position.x) / zoom;
    const yOnContent = (clickYInContainer - position.y) / zoom;

    const logicalCol = Math.floor(xOnContent / RENDERED_PIXEL_SIZE_CONFIG);
    const logicalRow = Math.floor(yOnContent / RENDERED_PIXEL_SIZE_CONFIG);

    if (logicalCol >= 0 && logicalCol < LOGICAL_GRID_COLS_CONFIG && logicalRow >= 0 && logicalRow < logicalGridRows) {
      const bitmapIdx = logicalRow * LOGICAL_GRID_COLS_CONFIG + logicalCol;
      if (pixelBitmap[bitmapIdx] === 1) {
        // Quick purchase for available pixels
        const existingSoldPixel = soldPixels.find(p => p.x === logicalCol && p.y === logicalRow);
        if (!existingSoldPixel) {
          toast({
            title: "Compra Rápida",
            description: `Duplo clique para comprar pixel (${logicalCol}, ${logicalRow}) rapidamente!`,
          });
        }
      }
    }
  };
  
  // Long press handler for advanced options
  const handleLongPress = (e: React.MouseEvent) => {
    vibrate('medium');
    toast({
      title: "Menu Avançado",
      description: "Pressão longa detectada - abrindo opções avançadas...",
    });
  };
  
  // Enhanced canvas click with better feedback
  const handleCanvasClick = (event: React.MouseEvent) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    clearAutoResetTimeout();

    // Feedback háptico ao clicar
    vibrate('selection');

    if (!isOnline) {
      toast({ title: "Sem Conexão", description: "Você está offline.", variant: "destructive" });
      return;
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
        addVisualEffect(logicalCol, logicalRow, 'select');

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
        setHoveredPixel(null);
        setSelectedPixelDetails(null);
      }
    } else { 
      setHighlightedPixel(null);
      setHoveredPixel(null);
      setSelectedPixelDetails(null);
    }
  };

  const handleMouseUpOrLeave = (event: React.MouseEvent) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (isDragging) {
      if (!didDragRef.current) {
        handleCanvasClick(event);
      }
      setIsDragging(false);
    }
    
    // Clear hover when mouse leaves
    if (event.type === 'mouseleave') {
      setHoveredPixel(null);
    }
  };
  
  // Enhanced purchase handler with animations
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
      lastModified: Date.now(),
      purchaseAnimation: true
    };
    
    addSoldPixel(newSoldPixel);
    animatePixelPurchase(pixelData.x, pixelData.y);

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
    addVisualEffect(myLocationPixel.x, myLocationPixel.y, 'select');

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
  
  // Enhanced filter handler
  const handleFilterChange = (newFilter: typeof pixelFilter) => {
    setPixelFilter(newFilter);
    toast({
      title: "Filtro Aplicado",
      description: `Mostrando pixels: ${newFilter === 'all' ? 'todos' : newFilter === 'owned' ? 'possuídos' : newFilter === 'available' ? 'disponíveis' : 'recentes'}`,
    });
  };
  
  // Enhanced grid toggle
  const toggleGrid = () => {
    setShowGrid(!showGrid);
    toast({
      title: showGrid ? "Grelha Oculta" : "Grelha Visível",
      description: showGrid ? "Linhas da grelha foram ocultadas" : "Linhas da grelha estão agora visíveis",
    });
  };

  return (

    <MobileOptimizations>
      <div className="flex flex-col h-full w-full overflow-hidden relative animate-fade-in">
        {/* Enhanced loading overlay */}
        <LoadingOverlay 
          isLoading={isLoadingMap} 
          text={progressMessage}
          progress={loadingProgress}
        >
          <div />
        </LoadingOverlay>
        
        {/* Enhanced control panels */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 pointer-events-auto animate-slide-in-up animation-delay-200">
          {/* Pixel Filter Controls */}
          <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-lg">
            <CardContent className="p-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Filtros</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'all', label: 'Todos', icon: <Eye className="h-3 w-3" /> },
                    { key: 'owned', label: 'Meus', icon: <Crown className="h-3 w-3" /> },
                    { key: 'available', label: 'Livres', icon: <Target className="h-3 w-3" /> },
                    { key: 'recent', label: 'Novos', icon: <Zap className="h-3 w-3" /> }
                  ].map(filter => (
                    <Button
                      key={filter.key}
                      variant={pixelFilter === filter.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange(filter.key as typeof pixelFilter)}
                      className="text-xs h-8 px-2"
                    >
                      {filter.icon}
                      <span className="ml-1">{filter.label}</span>
                    </Button>
                  ))}
                </div>
                
                {/* Grid toggle */}
                <Button
                  variant={showGrid ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleGrid}
                  className="text-xs h-8"
                >
                  <Grid className="h-3 w-3 mr-1" />
                  Grelha
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced zoom controls */}
          <EnhancedTooltip
            title="Controles do Mapa"
            description="Use estes controles para navegar pelo mapa"
            stats={[
              { label: 'Zoom', value: `${zoom.toFixed(2)}x`, icon: <ZoomIn className="h-4 w-4" /> },
              { label: 'Pixels', value: activePixelsInMap.toLocaleString(), icon: <MapPinIconLucide className="h-4 w-4" /> },
              { label: 'Possuídos', value: soldPixels.length.toString(), icon: <Crown className="h-4 w-4" /> }
            ]}
          >
            <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardContent className="p-3 space-y-2">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      style={{ pointerEvents: 'auto' }} 
                      variant="outline" 
                      size="icon" 
                      onClick={handleZoomIn} 
                      aria-label="Zoom In"
                      className="hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Aproximar</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      style={{ pointerEvents: 'auto' }} 
                      variant="outline" 
                      size="icon" 
                      onClick={handleZoomOut} 
                      aria-label="Zoom Out"
                      className="hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Afastar</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      style={{ pointerEvents: 'auto' }} 
                      variant="outline" 
                      size="icon" 
                      onClick={handleResetView} 
                      aria-label="Reset View"
                      className="hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                    >
                      <Expand className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Resetar Vista</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </CardContent>
            </Card>
          </EnhancedTooltip>
        </div>
        
        {/* Enhanced pixel info overlay */}
        {hoveredPixel && zoom > 5 && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-sm border-primary/30 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Pixel ({hoveredPixel.x}, {hoveredPixel.y})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {soldPixels.find(p => p.x === hoveredPixel.x && p.y === hoveredPixel.y) 
                    ? 'Pixel possuído' 
                    : 'Disponível para compra'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <EnhancedPixelPurchaseModal
          isOpen={showPixelModal}
          onClose={() => setShowPixelModal(false)}
          pixelData={selectedPixelDetails}
          userCredits={12500} // Mocked value, ideally from user store
          userSpecialCredits={120} // Mocked value
          onPurchase={handlePurchase}
        />

        <SwipeGestures
          onSwipeLeft={() => {
            vibrate('light');
            toast({ title: "❤️ Pixel Curtido!", description: "Adicionado aos seus favoritos." });
          }}
          onSwipeRight={() => {
            vibrate('light');
            toast({ title: "🔖 Pixel Salvo!", description: "Guardado para visualização posterior." });
          }}
          onSwipeUp={() => {
            vibrate('medium');
            if (navigator.share) {
              navigator.share({
                title: 'Pixel Universe',
                text: 'Confira este mapa incrível de pixels!',
                url: window.location.href
              });
            }
          }}
          onSwipeDown={() => {
            vibrate('medium');
            if (selectedPixelDetails) {
              setShowPixelModal(true);
            }
          }}
          className="flex-grow w-full h-full p-4 md:p-8 flex items-center justify-center"
        >
          {/* Enhanced container with better visual feedback */}
          <div
              ref={containerRef}
              className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative rounded-xl shadow-2xl border border-primary/20 bg-gradient-to-br from-background/50 to-primary/5"
              onMouseDown={handleMouseDown} 
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
          >
              {/* Enhanced canvas layers */}
              <div
              style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  width: `${canvasDrawWidth}px`,
                  height: `${canvasDrawHeight}px`,
                  transformOrigin: 'top left',
                  position: 'relative', 
              }}
              >
              {/* Base pixel canvas */}
              <canvas
                  ref={pixelCanvasRef}
                  className="absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-300" 
                  style={{ imageRendering: 'pixelated' }} 
              />
              
              {/* Grid overlay canvas */}
              <canvas
                  ref={gridCanvasRef}
                  className={`absolute top-0 left-0 w-full h-full z-15 pointer-events-none transition-opacity duration-300 ${showGrid ? 'opacity-100' : 'opacity-0'}`}
                  style={{ imageRendering: 'pixelated' }}
              />
              
              {/* Effects overlay canvas */}
              <canvas
                  ref={effectsCanvasRef}
                  className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
                  style={{ imageRendering: 'pixelated' }}
              />
              
              {(!mapData && isClient) && <PortugalMapSvg onMapDataLoaded={handleMapDataLoaded} className="invisible absolute" />}
              </div>
              
              {/* Enhanced outline canvas */}
              <canvas
                  ref={outlineCanvasRef}
                  className="absolute top-0 left-0 w-full h-full z-25 pointer-events-none"
                  style={{ imageRendering: 'auto' }}
              />
              
              {/* Interactive overlay for better UX */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Zoom level indicator */}
                <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-code">{zoom.toFixed(1)}x</span>
                  </div>
                </div>
                
                {/* Pixel count indicator */}
                <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4 text-accent" />
                    <span className="font-code">{soldPixels.length}/{activePixelsInMap}</span>
                  </div>
                </div>
              </div>
          </div>
        </SwipeGestures>
        
        {/* Enhanced Mobile Action Menu */}
        <div className="absolute bottom-6 right-6 z-20 animate-scale-in animation-delay-500 flex flex-col gap-3" style={{ pointerEvents: 'auto' }}>
          {/* IA Assistant */}
          <PixelAI pixelData={selectedPixelDetails ? { x: selectedPixelDetails.x, y: selectedPixelDetails.y, region: selectedPixelDetails.region } : undefined}>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-110 transition-all duration-200">
              <Brain className="h-6 w-6" />
            </Button>
          </PixelAI>
          
          {/* Social Features */}
          <PixelSocialFeatures>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:scale-110 transition-all duration-200">
              <Users className="h-6 w-6" />
            </Button>
          </PixelSocialFeatures>
          
          {/* Gamification */}
          <PixelGameification>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-110 transition-all duration-200">
              <Trophy className="h-6 w-6" />
            </Button>
          </PixelGameification>
          
          {/* Auction */}
          <PixelAuction>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-110 transition-all duration-200">
              <Gavel className="h-6 w-6" />
            </Button>
          </PixelAuction>
          
          {/* Collaborative Editor */}
          <PixelCollaborativeEditor pixelData={selectedPixelDetails ? { x: selectedPixelDetails.x, y: selectedPixelDetails.y, owner: selectedPixelDetails.owner || 'Sistema' } : undefined}>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:scale-110 transition-all duration-200">
              <Users className="h-6 w-6" />
            </Button>
          </PixelCollaborativeEditor>
          
          {/* AR Button */}
          <PixelAR>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-110 transition-all duration-200">
              <Camera className="h-6 w-6" />
            </Button>
          </PixelAR>
          
          {/* Stories Button */}
          <PixelStories>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-110 transition-all duration-200">
              <Play className="h-6 w-6" />
            </Button>
          </PixelStories>
          
          {/* Live Stream Button */}
          <PixelLiveStream>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-110 transition-all duration-200">
              <Radio className="h-6 w-6" />
            </Button>
          </PixelLiveStream>
          
          {/* Main Action Button */}
          <EnhancedTooltip
            title="Ações Rápidas"
            description="Acesso rápido às funcionalidades principais"
            actions={[
              { 
                label: 'Explorar', 
                onClick: () => {}, 
                icon: <Search className="h-4 w-4" /> 
              },
              { 
                label: 'Filtros', 
                onClick: () => {}, 
                icon: <PaletteIconLucide className="h-4 w-4" /> 
              }
            ]}
            interactive={true}
          >
            <Dialog>
              <DialogTrigger asChild>
                 <Button 
                   style={{ pointerEvents: 'auto' }} 
                   size="icon" 
                   className="rounded-full w-14 h-14 shadow-lg button-gradient-gold button-3d-effect hover:button-gold-glow active:scale-95 hover:scale-110 transition-all duration-300"
                 >
                    <Star className="h-7 w-7" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-primary/30 shadow-xl" data-dialog-content style={{ pointerEvents: 'auto' }}>
                <DialogHeader className="dialog-header-gold-accent rounded-t-lg">
                  <DialogTitle className="font-headline text-shadow-gold-sm">Ações Rápidas do Universo</DialogTitle>
                  <DialogDescriptionElement className="text-muted-foreground animate-fade-in animation-delay-200">
                    Explore, filtre e interaja com o mapa de pixels.
                  </DialogDescriptionElement>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline"><Search className="mr-2 h-4 w-4" />Explorar Pixel por Coordenadas</Button>
                  <Button 
                    style={{ pointerEvents: 'auto' }} 
                    variant="outline" 
                    className="button-3d-effect-outline"
                    onClick={toggleGrid}
                  >
                    <Grid className="mr-2 h-4 w-4" />
                    {showGrid ? 'Ocultar' : 'Mostrar'} Grelha
                  </Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline"><Sparkles className="mr-2 h-4 w-4" />Ver Eventos Atuais</Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={handleGoToMyLocation} className="button-3d-effect-outline"><MapPinIconLucide className="mr-2 h-4 w-4" />Ir para Minha Localização</Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline">
                    <Brain className="mr-2 h-4 w-4" />
                    Assistente IA
                  </Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline">
                    <Crosshair className="mr-2 h-4 w-4" />
                    Modo Precisão
                  </Button>
                  <Separator />
                  <Link href="/premium" className="w-full">
                    <Button style={{ pointerEvents: 'auto' }} variant="default" className="w-full button-gradient-gold button-3d-effect">
                      <Crown className="mr-2 h-4 w-4" />Tornar-se Premium
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
    </MobileOptimizations>
  );
}

// Enhanced cursor styles for different tools
const getCursorStyle = (tool: string) => {
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
    default:
      return 'cursor-default';
  }
};

    