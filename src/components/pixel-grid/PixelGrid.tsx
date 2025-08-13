// src/components/pixel-grid/PixelGrid.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, Expand, Search, Sparkles, Info, User, CalendarDays,
  History as HistoryIcon, DollarSign, ShoppingCart, Edit3, Palette as PaletteIconLucide, FileText, Upload, Save,
  Image as ImageIcon, XCircle, TagsIcon, Link as LinkIconLucide, Pencil,
  Eraser, PaintBucket, Trash2, Heart, Flag, BadgePercent, Star, MapPin as MapPinIconLucide, ScrollText, Gem, Globe, AlertTriangle,
  Map as MapIcon, Crown, Crosshair, Camera, Play, Radio, Brain, Trophy, Gavel, Users, Plus, Target, Zap
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
import { useAppStore, usePixelStore, useUserStore } from '@/lib/store';
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
import { motion, AnimatePresence } from 'framer-motion';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { useHapticFeedback } from '../mobile/HapticFeedback';
import SwipeGestures from '../mobile/SwipeGestures';
import MobileOptimizations from '../mobile/MobileOptimizations';

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
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  const didDragRef = useRef(false);
  const dragThreshold = 5;

  const [highlightedPixel, setHighlightedPixel] = useState<{ x: number; y: number } | null>(null);
  const [selectedPixelDetails, setSelectedPixelDetails] = useState<SelectedPixelDetails | null>(null);
  
  const [showPixelModal, setShowPixelModal] = useState(false);
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [showIdentityEditor, setShowIdentityEditor] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playPurchaseSound, setPlayPurchaseSound] = useState(false);
  
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
  const { addCredits, addXp, addPixel, removeCredits } = useUserStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });
  const { vibrate } = useHapticFeedback();
  const [loadingProgress, setLoadingProgress] = useState(0);

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    setIsClient(true);
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
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

  // Enhanced pixel purchase flow
  const handlePurchaseComplete = async (pixelData: SelectedPixelDetails, paymentMethod: string, customizations: any): Promise<boolean> => {
    if (!user) {
        toast({
            title: "Autenticação Necessária",
            description: "Por favor, inicie sessão para comprar pixels.",
            variant: "destructive"
        });
        return false;
    }

    setPlayPurchaseSound(true);
    setShowConfetti(true);

    // Simulate purchase processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const price = pixelData.salePrice || pixelData.price;
    
    // Remove credits based on payment method
    if (paymentMethod === 'credits') {
      removeCredits(price);
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
    addPixel();
    addXp(100);

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
    
    toast({
      title: "Pixel Adquirido! 🎉",
      description: `Parabéns! Agora pode criar sua identidade digital única!`,
    });
    
    return true;
  };

  // Enhanced map rendering
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

  // Enhanced pixel rendering with sold pixels
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
    ctx.fillStyle = unsoldColor;
    for (let row = 0; row < logicalGridRows; row++) {
        for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
            if (pixelBitmap[row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
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

  }, [pixelBitmap, soldPixels, unsoldColor, logicalGridRows, loadedPixelImages]);

  // Enhanced click handling for pixel selection
  const handleCanvasClick = (event: React.MouseEvent) => {
    clearAutoResetTimeout();
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
        
        // Show purchase flow for available pixels
        if (!existingSoldPixel) {
          setShowPurchaseFlow(true);
          vibrate('medium');
        } else {
          setShowPixelModal(true);
          vibrate('light');
        }
      } else { 
        setHighlightedPixel(null);
        setSelectedPixelDetails(null);
      }
    } else { 
      setHighlightedPixel(null);
      setSelectedPixelDetails(null);
    }
  };

  // Touch and mouse event handlers
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

  const handleTouchStart = (e: React.TouchEvent) => {
    clearAutoResetTimeout();
    const touch = e.touches[0];
    const now = Date.now();
    setTouchStartTime(now);
    
    // Double tap detection
    if (now - lastTap < 300) {
      handleDoubleTap(touch);
      return;
    }
    setLastTap(now);
    
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    didDragRef.current = false;
    
    vibrate('light');
  };

  const handleDoubleTap = (touch: Touch) => {
    const newZoom = Math.min(zoom * 2, MAX_ZOOM);
    if (newZoom !== zoom) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = touch.clientX - rect.left;
        const centerY = touch.clientY - rect.top;
        
        const currentCanvasX = (centerX - position.x) / zoom;
        const currentCanvasY = (centerY - position.y) / zoom;
        
        const newPosX = centerX - currentCanvasX * newZoom;
        const newPosY = centerY - currentCanvasY * newZoom;
        
        setZoom(newZoom);
        setPosition({ x: newPosX, y: newPosY });
        vibrate('medium');
      }
    }
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

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const currentX = touch.clientX - dragStart.x;
    const currentY = touch.clientY - dragStart.y;

    if (!didDragRef.current) {
      const dx = Math.abs(currentX - position.x);
      const dy = Math.abs(currentY - position.y);
      if (dx > dragThreshold || dy > dragThreshold) {
        didDragRef.current = true;
      }
    }
    setPosition({ x: currentX, y: currentY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging) {
      if (!didDragRef.current && Date.now() - touchStartTime < 300) {
        const touch = e.changedTouches[0];
        const syntheticEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as React.MouseEvent;
        handleCanvasClick(syntheticEvent);
      }
      setIsDragging(false);
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

  const handleZoomIn = () => { 
    clearAutoResetTimeout(); 
    setZoom((prevZoom) => Math.min(prevZoom * 1.2, MAX_ZOOM)); 
    vibrate('light');
  };
  
  const handleZoomOut = () => { 
    clearAutoResetTimeout(); 
    setZoom((prevZoom) => Math.max(prevZoom / 1.2, MIN_ZOOM)); 
    vibrate('light');
  };

  const handleResetView = useCallback(() => {
    clearAutoResetTimeout();
    if (defaultView) {
      setZoom(defaultView.zoom);
      setPosition(defaultView.position);
      vibrate('medium');
      toast({ title: "Vista Resetada", description: "Mapa centrado na posição inicial" });
    }
  }, [defaultView, clearAutoResetTimeout, vibrate, toast]);

  // Initialize default view
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

  // Wheel zoom handling
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

  return (
    <MobileOptimizations>
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playPurchaseSound} onEnd={() => setPlayPurchaseSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="flex flex-col h-full w-full overflow-hidden relative animate-fade-in">
        {/* Enhanced loading overlay */}
        <LoadingOverlay 
          isLoading={isLoadingMap} 
          text={progressMessage}
          progress={loadingProgress}
        >
          <div />
        </LoadingOverlay>
        
        {/* Mobile-optimized floating action buttons */}
        <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-3 animate-scale-in animation-delay-500">
          {/* Quick Purchase Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 touch-target"
              onClick={() => setShowMarketplace(true)}
            >
              <ShoppingCart className="h-7 w-7" />
            </Button>
          </motion.div>
          
          {/* Identity Editor */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 touch-target"
              onClick={() => setShowIdentityEditor(true)}
            >
              <Edit3 className="h-7 w-7" />
            </Button>
          </motion.div>
          
          {/* AI Assistant */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              size="icon" 
              className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 touch-target"
              onClick={() => {
                toast({
                  title: "IA Assistente 🤖",
                  description: "Funcionalidade em desenvolvimento!",
                });
              }}
            >
              <Brain className="h-7 w-7" />
            </Button>
          </motion.div>
        </div>
        
        {/* Zoom controls - mobile optimized */}
        <div className="absolute top-20 right-4 z-20 flex flex-col gap-2 animate-slide-in-up animation-delay-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn} 
                  className="h-12 w-12 touch-target shadow-lg bg-card/90 backdrop-blur-sm"
                >
                  <ZoomIn className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Aproximar</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut} 
                  className="h-12 w-12 touch-target shadow-lg bg-card/90 backdrop-blur-sm"
                >
                  <ZoomOut className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Afastar</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleResetView} 
                  className="h-12 w-12 touch-target shadow-lg bg-card/90 backdrop-blur-sm"
                >
                  <Expand className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Resetar Vista</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main map container with enhanced touch support */}
        <SwipeGestures
          onSwipeLeft={() => {
            vibrate('light');
            toast({ title: "❤️ Pixel Curtido!", description: "Adicionado aos favoritos." });
          }}
          onSwipeRight={() => {
            vibrate('light');
            toast({ title: "🔖 Pixel Salvo!", description: "Guardado para depois." });
          }}
          onSwipeUp={() => {
            vibrate('medium');
            if (navigator.share) {
              navigator.share({
                title: 'Pixel Universe',
                text: 'Descubra pixels únicos em Portugal!',
                url: window.location.href
              });
            }
          }}
          onSwipeDown={() => {
            vibrate('medium');
            if (selectedPixelDetails?.isForSaleBySystem) {
              setShowPurchaseFlow(true);
            }
          }}
          className="flex-grow w-full h-full p-2 flex items-center justify-center"
        >
          <div
              ref={containerRef}
              className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative rounded-xl shadow-2xl border-2 border-primary/30 touch-none bg-gradient-to-br from-background/95 to-primary/5"
              onMouseDown={handleMouseDown} 
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
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
              
              {/* Pixel highlight effect */}
              {highlightedPixel && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute border-4 border-primary rounded-lg shadow-lg pointer-events-none animate-pulse"
                  style={{
                    left: position.x + highlightedPixel.x * RENDERED_PIXEL_SIZE_CONFIG * zoom,
                    top: position.y + highlightedPixel.y * RENDERED_PIXEL_SIZE_CONFIG * zoom,
                    width: RENDERED_PIXEL_SIZE_CONFIG * zoom,
                    height: RENDERED_PIXEL_SIZE_CONFIG * zoom,
                    transform: 'translate(-2px, -2px)'
                  }}
                />
              )}
          </div>
        </SwipeGestures>

        {/* Purchase Flow Modal */}
        <Dialog open={showPurchaseFlow} onOpenChange={setShowPurchaseFlow}>
          <DialogContent className="max-w-md p-0 bg-gradient-to-br from-card via-card/95 to-primary/5">
            <DialogHeader className="p-6 bg-gradient-to-r from-primary/20 to-accent/20">
              <DialogTitle className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span className="text-xl font-headline">Comprar Pixel Único</span>
                </div>
                {selectedPixelDetails && (
                  <Badge variant="outline" className="text-sm">
                    ({selectedPixelDetails.x}, {selectedPixelDetails.y}) • {selectedPixelDetails.region}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {selectedPixelDetails && (
                <>
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <MapPinIconLucide className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Pixel Único Disponível!</h3>
                      <p className="text-muted-foreground text-sm">
                        Este pixel em {selectedPixelDetails.region} pode se tornar sua identidade digital única.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                      <div className="font-bold">{selectedPixelDetails.rarity}</div>
                      <div className="text-xs text-muted-foreground">Raridade</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-1" />
                      <div className="font-bold">€{selectedPixelDetails.price}</div>
                      <div className="text-xs text-muted-foreground">Preço</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPurchaseFlow(false)} 
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={async () => {
                        const success = await handlePurchaseComplete(
                          selectedPixelDetails, 
                          'credits', 
                          { color: USER_BOUGHT_PIXEL_COLOR, title: `Meu Pixel ${selectedPixelDetails.region}` }
                        );
                        if (success) {
                          setShowPurchaseFlow(false);
                          setTimeout(() => setShowIdentityEditor(true), 500);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar €{selectedPixelDetails.price}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Identity Editor Modal */}
        <Dialog open={showIdentityEditor} onOpenChange={setShowIdentityEditor}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
              <DialogTitle className="flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-500" />
                Criar Identidade Digital
                <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalização
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pixel-name">Nome da Identidade</Label>
                  <Input
                    id="pixel-name"
                    placeholder="Ex: Meu Cantinho em Lisboa"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pixel-bio">Descrição</Label>
                  <Textarea
                    id="pixel-bio"
                    placeholder="Conte a história do seu pixel..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['🏛️ Histórico', '🎨 Artístico', '🌊 Natural', '🏙️ Urbano', '💎 Premium', '🎯 Especial'].map((theme, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-16 flex flex-col items-center justify-center text-xs"
                    >
                      <span className="text-2xl mb-1">{theme.split(' ')[0]}</span>
                      <span>{theme.split(' ')[1]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowIdentityEditor(false)} 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    setShowIdentityEditor(false);
                    toast({
                      title: "Identidade Criada! ✨",
                      description: "Seu pixel agora tem uma identidade única!",
                    });
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Criar Identidade
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Marketplace Modal */}
        <Dialog open={showMarketplace} onOpenChange={setShowMarketplace}>
          <DialogContent className="max-w-6xl h-[90vh] p-0">
            <DialogHeader className="p-6 border-b bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <DialogTitle className="flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3 text-green-500" />
                Marketplace de Pixels
                <Badge className="ml-3 bg-gradient-to-r from-green-500 to-emerald-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Identidades Únicas
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6">
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Marketplace em Desenvolvimento</h3>
                <p className="text-muted-foreground mb-6">
                  Em breve poderá comprar e vender pixels únicos com identidades digitais personalizadas!
                </p>
                <Button 
                  onClick={() => setShowMarketplace(false)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  Voltar ao Mapa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main map canvas */}
        <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative rounded-xl shadow-2xl border-2 border-primary/30 touch-none bg-gradient-to-br from-background/95 to-primary/5"
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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

        {/* Mobile tutorial overlay */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 animate-bounce-slow">
          <Card className="bg-black/60 backdrop-blur-sm border-primary/30 text-white">
            <CardContent className="p-3 text-center">
              <Zap className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Toque num pixel para comprar!</p>
              <p className="text-xs text-white/80">Deslize para ações rápidas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileOptimizations>
  );
}