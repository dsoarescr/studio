
// src/components/pixel-grid/PixelGrid.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, Expand, Search, Sparkles, Info, User, CalendarDays,
  History as HistoryIcon, DollarSign, ShoppingCart, Edit3, Palette as PaletteIconLucide, FileText, Upload, Save,
  Image as ImageIcon, XCircle, TagsIcon, Link as LinkIconLucide, Pencil,
  Eraser, PaintBucket, Trash2, Heart, Flag, BadgePercent, Star, MapPin as MapPinIconLucide, ScrollText, Gem, Globe, AlertTriangle,
  Map as MapIcon, Crown, Crosshair, Camera, Play, Radio, Brain, Trophy, Gavel, Users
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
import PixelInfoModal from './PixelInfoModal';
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
import { Search, Eye, Grid3X3, Bookmark, LucideMapPin as MapPinIconLucide, ZoomIn, ZoomOut, Expand, Sparkles, Brain, Crosshair, Crown } from 'lucide-react'ERED_PIXEL_SIZE_CONFIG = 1;
import { Search, Eye, Grid3X3, Bookmark, LucideMapPin as MapPinIconLucide, ZoomIn, ZoomOut, Expand, Sparkles, Brain, Crosshair, Crown, Plus, X, BarChart3, Activity, User, Clock, Star, Coins } from 'lucide-react';

// Navigation and visualization constants
const ZOOM_BOOKMARKS_KEY = 'pixel-universe-zoom-bookmarks';
const LANDMARK_COORDINATES = {
  'Torre de Belém': { x: 579, y: 1358, zoom: 25 },
  'Ponte 25 de Abril': { x: 575, y: 1365, zoom: 20 },
  'Mosteiro dos Jerónimos': { x: 578, y: 1360, zoom: 25 },
  'Castelo de São Jorge': { x: 580, y: 1355, zoom: 30 },
  'Torre dos Clérigos': { x: 640, y: 1260, zoom: 25 },
  'Universidade de Coimbra': { x: 650, y: 1180, zoom: 20 },
  'Palácio da Pena': { x: 585, y: 1370, zoom: 25 },
  'Cabo da Roca': { x: 570, y: 1375, zoom: 30 }
};

const POSTAL_CODE_COORDINATES = {
  '1000': { x: 580, y: 1355, region: 'Lisboa Centro' },
  '1100': { x: 582, y: 1358, region: 'Lisboa Avenidas' },
  '4000': { x: 640, y: 1260, region: 'Porto Centro' },
  '4100': { x: 642, y: 1262, region: 'Porto Cedofeita' },
  '3000': { x: 650, y: 1180, region: 'Coimbra Centro' },
  '8000': { x: 706, y: 1562, region: 'Faro Centro' }
};

// Visualization modes
type VisualizationMode = 'normal' | 'thermal' | 'value' | 'ownership' | 'temporal' | 'rarity';

const VISUALIZATION_MODES = {
  normal: { name: 'Normal', icon: <Eye className="h-4 w-4" />, description: 'Vista padrão do mapa' },
  thermal: { name: 'Térmico', icon: <Activity className="h-4 w-4" />, description: 'Densidade de pixels por cor' },
  value: { name: 'Valor', icon: <Coins className="h-4 w-4" />, description: 'Preços por gradiente' },
  ownership: { name: 'Propriedade', icon: <User className="h-4 w-4" />, description: 'Cores por proprietário' },
  temporal: { name: 'Temporal', icon: <Clock className="h-4 w-4" />, description: 'Idade dos pixels' },
  rarity: { name: 'Raridade', icon: <Star className="h-4 w-4" />, description: 'Pixels por raridade' }
};

// Bookmarks system
interface ZoomBookmark {
  id: string;
  name: string;
  position: { x: number; y: number };
  zoom: number;
  timestamp: Date;
}

// Search functionality
interface SearchResult {
  type: 'landmark' | 'postal' | 'region' | 'coordinates';
  name: string;
  coordinates: { x: number; y: number };
  zoom?: number;
  description?: string;
}

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
  
  // New navigation and visualization states
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [zoomBookmarks, setZoomBookmarks] = useState<ZoomBookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [currentGPS, setCurrentGPS] = useState<{ lat: number; lon: number } | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [pixelDensityOverlay, setPixelDensityOverlay] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [animateTransitions, setAnimateTransitions] = useState(true);

  const didDragRef = useRef(false);
  const dragThreshold = 5;

  const [highlightedPixel, setHighlightedPixel] = useState<{ x: number; y: number } | null>(null);
  const [selectedPixelDetails, setSelectedPixelDetails] = useState<SelectedPixelDetails | null>(null);
  
  const [showPixelInfoModal, setShowPixelInfoModal] = useState(false);
  const [showPixelEditModal, setShowPixelEditModal] = useState(false);
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
  
  const { isOnline } = useAppStore();
  const { soldPixels, addSoldPixel } = usePixelStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });
  const { vibrate } = useHapticFeedback();

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);
  
  // Enhanced loading state with better UX
  const [loadingProgress, setLoadingProgress] = useState(0);
  
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

    // 1. Clear and draw the base map (unsold pixels)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < logicalGridRows; row++) {
        for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
            if (pixelBitmap[row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
                // Apply visualization mode coloring
                const pixelData = soldPixels.find(p => p.x === col && p.y === row);
                ctx.fillStyle = getVisualizationColor(pixelData, visualizationMode);
                
                ctx.fillRect(
                    col * RENDERED_PIXEL_SIZE_CONFIG,
                    row * RENDERED_PIXEL_SIZE_CONFIG,
                    RENDERED_PIXEL_SIZE_CONFIG,
                    RENDERED_PIXEL_SIZE_CONFIG
                );
            }
        }
    }

    // 2. Draw sold pixels over the base map
    if (visualizationMode === 'normal') {
      soldPixels.forEach(pixel => {
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
    }
    
    // 3. Draw grid overlay if enabled
    if (showGrid && zoom > 5) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      
      for (let col = 0; col <= LOGICAL_GRID_COLS_CONFIG; col++) {
        const x = col * RENDERED_PIXEL_SIZE_CONFIG;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasDrawHeight);
        ctx.stroke();
      }
      
      for (let row = 0; row <= logicalGridRows; row++) {
        const y = row * RENDERED_PIXEL_SIZE_CONFIG;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasDrawWidth, y);
        ctx.stroke();
      }
    }

  }, [pixelBitmap, soldPixels, unsoldColor, logicalGridRows, loadedPixelImages, visualizationMode, showGrid, zoom]);
  
  // Draw landmarks overlay
  useEffect(() => {
    if (!showLandmarks || !mapData || !strokeColor || !outlineCanvasRef.current || containerSizeRef.current.width === 0) return;
    
    const canvas = outlineCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw landmark indicators
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(zoom, zoom);
    
    Object.entries(LANDMARK_COORDINATES).forEach(([name, coords]) => {
      const x = coords.x * RENDERED_PIXEL_SIZE_CONFIG;
      const y = coords.y * RENDERED_PIXEL_SIZE_CONFIG;
      
      // Only draw if landmark is visible and zoom is appropriate
      if (zoom > 5) {
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FF8800';
        ctx.lineWidth = 2 / zoom;
        
        // Draw star shape
        ctx.beginPath();
        const size = 8 / zoom;
        for (let i = 0; i < 5; i++) {
          const angle = (i * 144 - 90) * Math.PI / 180;
          const x1 = x + Math.cos(angle) * size;
          const y1 = y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw label if zoom is high enough
        if (zoom > 15) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `${10 / zoom}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(name, x, y + 15 / zoom);
        }
      }
    });
    
    ctx.restore();
  }, [showLandmarks, mapData, strokeColor, position, zoom, outlineCanvasRef.current]);
  
  // Draw density overlay
  useEffect(() => {
    if (!pixelDensityOverlay || !pixelBitmap || !outlineCanvasRef.current) return;
    
    const canvas = outlineCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(zoom, zoom);
    
    // Calculate density in 10x10 pixel blocks
    const blockSize = 10;
    for (let blockY = 0; blockY < logicalGridRows; blockY += blockSize) {
      for (let blockX = 0; blockX < LOGICAL_GRID_COLS_CONFIG; blockX += blockSize) {
        let pixelCount = 0;
        
        for (let y = blockY; y < Math.min(blockY + blockSize, logicalGridRows); y++) {
          for (let x = blockX; x < Math.min(blockX + blockSize, LOGICAL_GRID_COLS_CONFIG); x++) {
            if (pixelBitmap[y * LOGICAL_GRID_COLS_CONFIG + x] === 1) {
              pixelCount++;
            }
          }
        }
        
        const density = pixelCount / (blockSize * blockSize);
        if (density > 0.3) {
          const alpha = density * 0.5;
          ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
          ctx.fillRect(
            blockX * RENDERED_PIXEL_SIZE_CONFIG,
            blockY * RENDERED_PIXEL_SIZE_CONFIG,
            blockSize * RENDERED_PIXEL_SIZE_CONFIG,
            blockSize * RENDERED_PIXEL_SIZE_CONFIG
          );
        }
      }
    }
    
    ctx.restore();
  }, [pixelDensityOverlay, pixelBitmap, position, zoom]);
  
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
    // New: Pulsating border for selected pixel
    if (selectedPixelDetails && selectedPixelDetails.x === highlightedPixel?.x && selectedPixelDetails.y === highlightedPixel?.y) {
      const pulseAnimation = Math.abs(Math.sin(Date.now() / 300));
      ctx.strokeStyle = `hsla(var(--foreground), ${0.5 + pulseAnimation * 0.5})`;
      ctx.lineWidth = ((0.5 + pulseAnimation * 1.5) / zoom) * RENDERED_PIXEL_SIZE_CONFIG;
      ctx.strokeRect(
        selectedPixelDetails.x * RENDERED_PIXEL_SIZE_CONFIG - ctx.lineWidth/2,
        selectedPixelDetails.y * RENDERED_PIXEL_SIZE_CONFIG - ctx.lineWidth/2,
        RENDERED_PIXEL_SIZE_CONFIG + ctx.lineWidth,
        RENDERED_PIXEL_SIZE_CONFIG + ctx.lineWidth
      );
    }
    ctx.restore();

  }, [mapData, zoom, position, strokeColor, highlightedPixel, selectedPixelDetails]);
  

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

  // New navigation functions
  const handleSearch = (query: string) => {
    const results: SearchResult[] = [];
    
    // Search landmarks
    Object.entries(LANDMARK_COORDINATES).forEach(([name, coords]) => {
      if (name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'landmark',
          name,
          coordinates: { x: coords.x, y: coords.y },
          zoom: coords.zoom,
          description: `Marco histórico em ${name}`
        });
      }
    });
    
    // Search postal codes
    Object.entries(POSTAL_CODE_COORDINATES).forEach(([code, data]) => {
      if (code.includes(query) || data.region.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'postal',
          name: `${code} - ${data.region}`,
          coordinates: { x: data.x, y: data.y },
          zoom: 20,
          description: `Código postal ${code}`
        });
      }
    });
    
    // Search coordinates (format: x,y or x y)
    const coordMatch = query.match(/(\d+)[,\s]+(\d+)/);
    if (coordMatch) {
      const x = parseInt(coordMatch[1]);
      const y = parseInt(coordMatch[2]);
      if (x >= 0 && x < LOGICAL_GRID_COLS_CONFIG && y >= 0 && y < logicalGridRows) {
        results.push({
          type: 'coordinates',
          name: `Pixel (${x}, ${y})`,
          coordinates: { x, y },
          zoom: 25,
          description: 'Coordenadas específicas'
        });
      }
    }
    
    setSearchResults(results);
  };

  const navigateToResult = (result: SearchResult) => {
    if (!containerRef.current) return;
    
    clearAutoResetTimeout();
    const targetZoom = result.zoom || 15;
    const containerWidth = containerRef.current.offsetWidth;
    const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;

    const targetX = -result.coordinates.x * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + containerWidth / 2;
    const targetY = -result.coordinates.y * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + effectiveContainerHeight / 2;
    
    if (animateTransitions) {
      // Smooth transition animation
      const startZoom = zoom;
      const startPos = { ...position };
      const duration = 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const currentZoom = startZoom + (targetZoom - startZoom) * easeProgress;
        const currentX = startPos.x + (targetX - startPos.x) * easeProgress;
        const currentY = startPos.y + (targetY - startPos.y) * easeProgress;
        
        setZoom(currentZoom);
        setPosition({ x: currentX, y: currentY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setPosition({ x: targetX, y: targetY });
      setZoom(targetZoom);
    }
    
    setShowSearch(false);
    setSearchQuery('');
    
    toast({ 
      title: "Navegação Concluída", 
      description: `Centrado em ${result.name}` 
    });
  };

  const saveZoomBookmark = () => {
    const bookmark: ZoomBookmark = {
      id: Date.now().toString(),
      name: `Bookmark ${zoomBookmarks.length + 1}`,
      position: { ...position },
      zoom,
      timestamp: new Date()
    };
    
    const newBookmarks = [bookmark, ...zoomBookmarks].slice(0, 10); // Max 10 bookmarks
    setZoomBookmarks(newBookmarks);
    localStorage.setItem(ZOOM_BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    
    toast({
      title: "Bookmark Guardado",
      description: "Localização guardada nos seus favoritos."
    });
  };

  const loadZoomBookmark = (bookmark: ZoomBookmark) => {
    clearAutoResetTimeout();
    setPosition(bookmark.position);
    setZoom(bookmark.zoom);
    setShowBookmarks(false);
    
    toast({
      title: "Bookmark Carregado",
      description: `Navegado para ${bookmark.name}`
    });
  };

  const deleteZoomBookmark = (bookmarkId: string) => {
    const newBookmarks = zoomBookmarks.filter(b => b.id !== bookmarkId);
    setZoomBookmarks(newBookmarks);
    localStorage.setItem(ZOOM_BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    
    toast({
      title: "Bookmark Eliminado",
      description: "Localização removida dos favoritos."
    });
  };

  const getVisualizationColor = (pixel: any, mode: VisualizationMode) => {
    switch (mode) {
      case 'thermal':
        // Simulate density - more red for higher density areas
        const density = Math.random();
        return density > 0.7 ? '#FF0000' : density > 0.4 ? '#FF8800' : '#00FF00';
      
      case 'value':
        // Simulate value - more expensive pixels are redder
        const value = Math.random() * 1000;
        const intensity = Math.min(value / 500, 1);
        return `rgb(${Math.floor(255 * intensity)}, ${Math.floor(255 * (1 - intensity))}, 0)`;
      
      case 'ownership':
        // Different colors for different owner types
        if (pixel?.ownerId === 'currentUserPixelMaster') return '#00FF00'; // User's pixels
        if (pixel?.ownerId && pixel.ownerId !== 'Sistema') return '#0088FF'; // Other users
        return unsoldColor; // Available pixels
      
      case 'temporal':
        // Simulate age - newer pixels are brighter
        const age = Math.random();
        const brightness = Math.floor(255 * (1 - age * 0.7));
        return `rgb(${brightness}, ${brightness}, 255)`;
      
      case 'rarity':
        // Different colors for different rarities
        const rarities = ['#808080', '#00FF00', '#0088FF', '#8800FF', '#FFD700'];
        return rarities[Math.floor(Math.random() * rarities.length)];
      
      default:
        return pixel?.color || unsoldColor;
    }
  };

  // Update GPS coordinates based on current view center
  const updateCurrentGPS = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;
    
    const centerX = (containerWidth / 2 - position.x) / zoom / RENDERED_PIXEL_SIZE_CONFIG;
    const centerY = (effectiveContainerHeight / 2 - position.y) / zoom / RENDERED_PIXEL_SIZE_CONFIG;
    
    const gps = mapPixelToApproxGps(centerX, centerY, LOGICAL_GRID_COLS_CONFIG, logicalGridRows);
    setCurrentGPS(gps);
  };

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(ZOOM_BOOKMARKS_KEY);
    if (savedBookmarks) {
      try {
        const bookmarks = JSON.parse(savedBookmarks).map((b: any) => ({
          ...b,
          timestamp: new Date(b.timestamp)
        }));
        setZoomBookmarks(bookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Update GPS coordinates when view changes
  useEffect(() => {
    updateCurrentGPS();
  }, [position, zoom]);

  // Handle double-click for smart zoom
  const handleDoubleClick = (event: React.MouseEvent) => {
    if (!containerRef.current || !pixelBitmap) return;
    
    clearAutoResetTimeout();
    const rect = containerRef.current.getBoundingClientRect();
    const clickXInContainer = event.clientX - rect.left;
    const clickYInContainer = event.clientY - rect.top;

    const xOnContent = (clickXInContainer - position.x) / zoom;
    const yOnContent = (clickYInContainer - position.y) / zoom;

    const logicalCol = Math.floor(xOnContent / RENDERED_PIXEL_SIZE_CONFIG);
    const logicalRow = Math.floor(yOnContent / RENDERED_PIXEL_SIZE_CONFIG);

    if (logicalCol >= 0 && logicalCol < LOGICAL_GRID_COLS_CONFIG && logicalRow >= 0 && logicalRow < logicalGridRows) {
      const targetZoom = zoom < 10 ? 15 : zoom < 25 ? 35 : 1; // Smart zoom levels
      const containerWidth = containerRef.current.offsetWidth;
      const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;

      const targetX = -logicalCol * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + containerWidth / 2;
      const targetY = -logicalRow * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + effectiveContainerHeight / 2;
      
      setPosition({ x: targetX, y: targetY });
      setZoom(targetZoom);
      
      vibrate('medium');
      toast({
        title: "Zoom Inteligente",
        description: `Focado no pixel (${logicalCol}, ${logicalRow})`
      });
    }
  };


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

    // Feedback háptico ao clicar
    vibrate('selection');

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
                x: logicalCol, y: logicalRow, owner: undefined, price: basePrice,
                color: unsoldColor, isOwnedByCurrentUser: false, isForSaleBySystem: true,
                history: [], isFavorited: Math.random() > 0.8, rarity: randomRarity, loreSnippet: randomLore,
                gpsCoords: approxGps, views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 200), region, isProtected: false, specialCreditsPrice: specialCreditsPrice,
            };
        }
        setSelectedPixelDetails(mockDetails);
        setShowPixelInfoModal(true);
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
    if (!defaultView || showPixelInfoModal || showPixelEditModal || isDragging) { 
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
  }, [zoom, position, handleResetView, defaultView, showPixelInfoModal, showPixelEditModal, isDragging]);
  
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
            
            {/* Visualization Mode Info */}
            <div className="flex items-center justify-between border-t border-primary/20 pt-1">
              <span className="text-muted-foreground">Modo:</span>
              <span className="text-accent font-bold">{VISUALIZATION_MODES[visualizationMode].name}</span>
            </div>
            
            {/* GPS Coordinates */}
            {showCoordinates && currentGPS && (
              <div className="border-t border-primary/20 pt-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GPS:</span>
                  <span className="text-blue-500 font-bold text-xs">
                    {currentGPS.lat.toFixed(4)}°N
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground"></span>
                  <span className="text-blue-500 font-bold text-xs">
                    {Math.abs(currentGPS.lon).toFixed(4)}°W
                  </span>
                </div>
              </div>
            )}
            
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
        
        <EnhancedPixelPurchaseModal
          isOpen={showPixelEditModal}
          onClose={() => setShowPixelEditModal(false)}
          pixelData={selectedPixelDetails}
          userCredits={12500} // Mocked value, ideally from user store
          userSpecialCredits={120} // Mocked value
          onPurchase={handlePurchase}
        />

        <PixelInfoModal
          isOpen={showPixelInfoModal}
          onClose={() => setShowPixelInfoModal(false)}
          onEdit={() => {
            setShowPixelInfoModal(false);
            setShowPixelEditModal(true);
          }}
          onPurchase={() => {
            setShowPixelInfoModal(false);
            setShowPixelEditModal(true);
          }}
          pixelData={selectedPixelDetails}
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
             setShowPixelInfoModal(true);
            }
          }}
          className="flex-grow w-full h-full p-4 md:p-8 flex items-center justify-center"
        >
          <div
              ref={containerRef}
              className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative rounded-xl shadow-2xl border border-primary/20"
              onMouseDown={handleMouseDown} 
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onDoubleClick={handleDoubleClick}
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
        </SwipeGestures>
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto animate-slide-in-up animation-delay-200">
          {/* Search */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowSearch(!showSearch)}
              className={showSearch ? 'bg-primary/20 border-primary' : ''}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {showSearch && (
              <div className="absolute top-12 right-0 w-80 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg shadow-xl p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar landmarks, códigos postais..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value) handleSearch(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-primary/10 rounded cursor-pointer transition-colors"
                        onClick={() => navigateToResult(result)}
                      >
                        <div className="font-medium text-sm">{result.name}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Experimente: "Torre de Belém", "1000", "Lisboa", "580,1355"
                </div>
              </div>
            )}
          </div>
          
          {/* Visualization Mode */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                const modes = Object.keys(VISUALIZATION_MODES) as VisualizationMode[];
                const currentIndex = modes.indexOf(visualizationMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setVisualizationMode(nextMode);
                vibrate('light');
                toast({
                  title: "Modo de Visualização",
                  description: `Mudou para: ${VISUALIZATION_MODES[nextMode].name}`
                });
              }}
              className={visualizationMode !== 'normal' ? 'bg-accent/20 border-accent' : ''}
            >
              {VISUALIZATION_MODES[visualizationMode].icon}
            </Button>
          </div>
          
          {/* Bookmarks */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={showBookmarks ? 'bg-yellow-500/20 border-yellow-500' : ''}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            
            {showBookmarks && (
              <div className="absolute top-12 right-0 w-72 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg shadow-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Localizações Guardadas</h3>
                  <Button size="sm" onClick={saveZoomBookmark}>
                    <Plus className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
                
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {zoomBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-2 hover:bg-primary/10 rounded"
                    >
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => loadZoomBookmark(bookmark)}
                      >
                        <div className="font-medium text-sm">{bookmark.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Zoom: {bookmark.zoom.toFixed(1)}x • {bookmark.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteZoomBookmark(bookmark.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {zoomBookmarks.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      Nenhuma localização guardada
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
            
            {/* Toggle Grid */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setShowGrid(!showGrid);
                    vibrate('light');
                  }}
                  className={showGrid ? 'bg-primary/20 border-primary' : ''}
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Mostrar Grelha</p></TooltipContent>
            </Tooltip>
            
            {/* Toggle Coordinates */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowCoordinates(!showCoordinates)}
                  className={showCoordinates ? 'bg-green-500/20 border-green-500' : ''}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Coordenadas GPS</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Enhanced Mobile Action Menu */}
        <div className="absolute bottom-6 right-6 z-20 animate-scale-in animation-delay-500 flex flex-col gap-3" style={{ pointerEvents: 'auto' }}>
          {/* IA Assistant */}
          <PixelAI pixelData={selectedPixelDetails ? { x: selectedPixelDetails.x, y: selectedPixelDetails.y, region: selectedPixelDetails.region } : undefined}>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Brain className="h-6 w-6" />
            </Button>
          </PixelAI>
          
          {/* Social Features */}
          <PixelSocialFeatures>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Users className="h-6 w-6" />
            </Button>
          </PixelSocialFeatures>
          
          {/* Gamification */}
          <PixelGameification>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Trophy className="h-6 w-6" />
            </Button>
          </PixelGameification>
          
          {/* Auction */}
          <PixelAuction>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Gavel className="h-6 w-6" />
            </Button>
          </PixelAuction>
          
          {/* Collaborative Editor */}
          <PixelCollaborativeEditor pixelData={selectedPixelDetails ? { x: selectedPixelDetails.x, y: selectedPixelDetails.y, owner: selectedPixelDetails.owner || 'Sistema' } : undefined}>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Users className="h-6 w-6" />
            </Button>
          </PixelCollaborativeEditor>
          
          {/* AR Button */}
          <PixelAR>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Camera className="h-6 w-6" />
            </Button>
          </PixelAR>
          
          {/* Stories Button */}
          <PixelStories>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Play className="h-6 w-6" />
            </Button>
          </PixelStories>
          
          {/* Live Stream Button */}
          <PixelLiveStream>
            <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
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
                 <Button style={{ pointerEvents: 'auto' }} size="icon" className="rounded-full w-14 h-14 shadow-lg button-gradient-gold button-3d-effect hover:button-gold-glow active:scale-95">
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
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline"><PaletteIconLucide className="mr-2 h-4 w-4" />Filtros de Visualização</Button>
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
