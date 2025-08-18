
// src/components/pixel-grid/PixelGrid.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';


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

// Animation and interaction constants
const PIXEL_HOVER_SCALE = 1.2;
const PIXEL_PULSE_DURATION = 2000;
const ACTIVITY_ANIMATION_DURATION = 500;
const RARE_PIXEL_GLOW_INTENSITY = 0.8;

// Pixel activity types
type PixelActivity = 'purchase' | 'edit' | 'view' | 'like' | 'comment';

interface PixelActivityEvent {
  id: string;
  x: number;
  y: number;
  type: PixelActivity;
  timestamp: number;
  user: string;
  color?: string;
}

interface AnimatedPixel {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  glowIntensity: number;
  lastActivity: number;
  activityType?: PixelActivity;
  isHovered: boolean;
  isPulsing: boolean;
  isNew: boolean;
}

interface SoldPixel {
  x: number;
  y: number;
  color: string;
  ownerId?: string;
  title?: string;
  pixelImageUrl?: string;
  rarity?: 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  lastActivity?: number;
  views?: number;
  likes?: number;
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
  const { addXp, addCredits } = useUserStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });
  const { vibrate } = useHapticFeedback();
  
  // New state for living grid
  const [animatedPixels, setAnimatedPixels] = useState<Map<string, AnimatedPixel>>(new Map());
  const [recentActivity, setRecentActivity] = useState<PixelActivityEvent[]>([]);
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);
  const [showActivityRipples, setShowActivityRipples] = useState(true);
  const [showPixelPulse, setShowPixelPulse] = useState(true);
  const [showRarityGlow, setShowRarityGlow] = useState(true);
  const [playHoverSound, setPlayHoverSound] = useState(false);
  const [playActivitySound, setPlayActivitySound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);
  
  // Enhanced loading state with better UX
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate real-time pixel activity
  useEffect(() => {
    const activityInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 3 seconds
        const activities: PixelActivity[] = ['purchase', 'edit', 'view', 'like', 'comment'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const newActivity: PixelActivityEvent = {
          id: Date.now().toString(),
          x: Math.floor(Math.random() * LOGICAL_GRID_COLS_CONFIG),
          y: Math.floor(Math.random() * logicalGridRows),
          type: activity,
          timestamp: Date.now(),
          user: `User${Math.floor(Math.random() * 1000)}`,
          color: activity === 'edit' ? `hsl(${Math.random() * 360}, 70%, 60%)` : undefined
        };
        
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)]);
        
        // Create animated pixel for this activity
        const pixelKey = `${newActivity.x}-${newActivity.y}`;
        setAnimatedPixels(prev => {
          const newMap = new Map(prev);
          newMap.set(pixelKey, {
            x: newActivity.x,
            y: newActivity.y,
            scale: activity === 'purchase' ? 1.5 : 1.2,
            opacity: 1,
            rotation: 0,
            glowIntensity: activity === 'purchase' ? 1 : 0.6,
            lastActivity: Date.now(),
            activityType: activity,
            isHovered: false,
            isPulsing: true,
            isNew: true
          });
          return newMap;
        });
        
        // Play activity sound
        if (activity === 'purchase') {
          setPlayActivitySound(true);
          setShowConfetti(true);
        }
      }
    }, 3000);
    
    return () => clearInterval(activityInterval);
  }, []);
  
  // Animation loop for living pixels
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;
      
      setCurrentTime(currentTime);
      
      // Update animated pixels
      setAnimatedPixels(prev => {
        const newMap = new Map();
        
        prev.forEach((pixel, key) => {
          const age = currentTime - pixel.lastActivity;
          
          // Remove old animations after 5 seconds
          if (age > 5000) return;
          
          // Calculate animation values
          const progress = Math.min(age / 2000, 1); // 2 second animation
          const pulseValue = Math.sin((currentTime / 1000) * Math.PI) * 0.5 + 0.5;
          
          const updatedPixel: AnimatedPixel = {
            ...pixel,
            scale: pixel.isHovered ? PIXEL_HOVER_SCALE : 1 + (1 - progress) * 0.3,
            opacity: Math.max(0.3, 1 - progress * 0.7),
            rotation: pixel.activityType === 'edit' ? (progress * 360) % 360 : 0,
            glowIntensity: pixel.isHovered ? 1 : (1 - progress) * pixel.glowIntensity,
            isPulsing: age < 3000,
            isNew: age < 1000
          };
          
          newMap.set(key, updatedPixel);
        });
        
        return newMap;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Generate rare pixels with special effects
  const rarePixels = useMemo(() => {
    const rares: Array<{ x: number; y: number; rarity: string; color: string }> = [];
    
    // Add some rare pixels for demonstration
    for (let i = 0; i < 20; i++) {
      rares.push({
        x: Math.floor(Math.random() * LOGICAL_GRID_COLS_CONFIG),
        y: Math.floor(Math.random() * logicalGridRows),
        rarity: ['Raro', 'Épico', 'Lendário'][Math.floor(Math.random() * 3)],
        color: `hsl(${Math.random() * 360}, 80%, 60%)`
      });
    }
    
    return rares;
  }, []);
  
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

    // 1. Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw base map with living effects
    for (let row = 0; row < logicalGridRows; row++) {
        for (let col = 0; col < LOGICAL_GRID_COLS_CONFIG; col++) {
            if (pixelBitmap[row * LOGICAL_GRID_COLS_CONFIG + col] === 1) {
                const pixelKey = `${col}-${row}`;
                const animatedPixel = animatedPixels.get(pixelKey);
                const rarePixel = rarePixels.find(r => r.x === col && r.y === row);
                
                ctx.save();
                
                // Apply transformations for animated pixels
                if (animatedPixel) {
                  const centerX = col * RENDERED_PIXEL_SIZE_CONFIG + RENDERED_PIXEL_SIZE_CONFIG / 2;
                  const centerY = row * RENDERED_PIXEL_SIZE_CONFIG + RENDERED_PIXEL_SIZE_CONFIG / 2;
                  
                  ctx.translate(centerX, centerY);
                  ctx.scale(animatedPixel.scale, animatedPixel.scale);
                  ctx.rotate((animatedPixel.rotation * Math.PI) / 180);
                  ctx.globalAlpha = animatedPixel.opacity;
                  
                  // Add glow effect for active pixels
                  if (animatedPixel.glowIntensity > 0) {
                    ctx.shadowColor = getActivityColor(animatedPixel.activityType);
                    ctx.shadowBlur = 10 * animatedPixel.glowIntensity;
                  }
                  
                  ctx.fillStyle = getActivityColor(animatedPixel.activityType) || unsoldColor;
                  ctx.fillRect(-RENDERED_PIXEL_SIZE_CONFIG / 2, -RENDERED_PIXEL_SIZE_CONFIG / 2, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
                } else if (rarePixel && showRarityGlow) {
                  // Rare pixel glow effect
                  const pulseValue = Math.sin((currentTime / 1000) * Math.PI) * 0.5 + 0.5;
                  ctx.shadowColor = rarePixel.color;
                  ctx.shadowBlur = 5 + pulseValue * 10;
                  ctx.fillStyle = rarePixel.color;
                  ctx.fillRect(
                      col * RENDERED_PIXEL_SIZE_CONFIG,
                      row * RENDERED_PIXEL_SIZE_CONFIG,
                      RENDERED_PIXEL_SIZE_CONFIG,
                      RENDERED_PIXEL_SIZE_CONFIG
                  );
                } else {
                  // Regular unsold pixel with subtle pulse
                  if (showPixelPulse) {
                    const pulseValue = Math.sin((currentTime / 3000 + col * 0.1 + row * 0.1) * Math.PI) * 0.1 + 0.9;
                    ctx.globalAlpha = pulseValue;
                  }
                  
                  ctx.fillStyle = unsoldColor;
                  ctx.fillRect(
                      col * RENDERED_PIXEL_SIZE_CONFIG,
                      row * RENDERED_PIXEL_SIZE_CONFIG,
                      RENDERED_PIXEL_SIZE_CONFIG,
                      RENDERED_PIXEL_SIZE_CONFIG
                  );
                }
                
                ctx.restore();
            }
        }
    }

    // 3. Draw sold pixels with enhanced effects
    soldPixels.forEach(pixel => {
      const renderX = pixel.x * RENDERED_PIXEL_SIZE_CONFIG;
      const renderY = pixel.y * RENDERED_PIXEL_SIZE_CONFIG;
      const pixelKey = `${pixel.x}-${pixel.y}`;
      const animatedPixel = animatedPixels.get(pixelKey);
      
      ctx.save();
      
      // Apply hover effects
      if (hoveredPixel && hoveredPixel.x === pixel.x && hoveredPixel.y === pixel.y) {
        const centerX = renderX + RENDERED_PIXEL_SIZE_CONFIG / 2;
        const centerY = renderY + RENDERED_PIXEL_SIZE_CONFIG / 2;
        
        ctx.translate(centerX, centerY);
        ctx.scale(PIXEL_HOVER_SCALE, PIXEL_HOVER_SCALE);
        ctx.shadowColor = pixel.color;
        ctx.shadowBlur = 15;
        ctx.translate(-centerX, -centerY);
      }
      
      // Apply activity animations
      if (animatedPixel) {
        const centerX = renderX + RENDERED_PIXEL_SIZE_CONFIG / 2;
        const centerY = renderY + RENDERED_PIXEL_SIZE_CONFIG / 2;
        
        ctx.translate(centerX, centerY);
        ctx.scale(animatedPixel.scale, animatedPixel.scale);
        ctx.rotate((animatedPixel.rotation * Math.PI) / 180);
        ctx.globalAlpha = animatedPixel.opacity;
        ctx.translate(-centerX, -centerY);
        
        if (animatedPixel.glowIntensity > 0) {
          ctx.shadowColor = pixel.color;
          ctx.shadowBlur = 20 * animatedPixel.glowIntensity;
        }
      }
      
      // Draw pixel with image or color
      if (pixel.pixelImageUrl) {
        const img = loadedPixelImages.get(pixel.pixelImageUrl);
        if (img && img.complete) {
            ctx.drawImage(img, renderX, renderY, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
        } else {
            ctx.fillStyle = pixel.color;
            ctx.fillRect(renderX, renderY, RENDERED_PIXEL_SIZE_CONFIG, RENDERED_PIXEL_SIZE_CONFIG);
        }
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
      
      // Add rarity indicators for sold pixels
      if (pixel.rarity && pixel.rarity !== 'Comum') {
        const rarityColor = getRarityColor(pixel.rarity);
        ctx.strokeStyle = rarityColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(renderX - 1, renderY - 1, RENDERED_PIXEL_SIZE_CONFIG + 2, RENDERED_PIXEL_SIZE_CONFIG + 2);
      }
      
      ctx.restore();
    });

    // 4. Draw activity ripples
    if (showActivityRipples) {
      recentActivity.forEach(activity => {
        const age = currentTime - activity.timestamp;
        if (age < 2000) { // Show ripples for 2 seconds
          const progress = age / 2000;
          const rippleRadius = progress * 50;
          const rippleOpacity = (1 - progress) * 0.5;
          
          ctx.save();
          ctx.globalAlpha = rippleOpacity;
          ctx.strokeStyle = getActivityColor(activity.type);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            activity.x * RENDERED_PIXEL_SIZE_CONFIG + RENDERED_PIXEL_SIZE_CONFIG / 2,
            activity.y * RENDERED_PIXEL_SIZE_CONFIG + RENDERED_PIXEL_SIZE_CONFIG / 2,
            rippleRadius,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          ctx.restore();
        }
      });
    }

  }, [pixelBitmap, soldPixels, unsoldColor, logicalGridRows, loadedPixelImages, animatedPixels, rarePixels, hoveredPixel, showRarityGlow, showPixelPulse, showActivityRipples, recentActivity, currentTime]);
  
  // Helper function to get activity colors
  const getActivityColor = (activityType?: PixelActivity): string => {
    switch (activityType) {
      case 'purchase': return '#10B981'; // Green
      case 'edit': return '#8B5CF6'; // Purple
      case 'view': return '#3B82F6'; // Blue
      case 'like': return '#EF4444'; // Red
      case 'comment': return '#F59E0B'; // Orange
      default: return '#D4A757'; // Primary
    }
  };
  
  // Helper function to get rarity colors
  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'Raro': return '#3B82F6'; // Blue
      case 'Épico': return '#8B5CF6'; // Purple
      case 'Lendário': return '#F59E0B'; // Gold
      case 'Marco Histórico': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
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
        // Add click activity
        const clickActivity: PixelActivityEvent = {
          id: Date.now().toString(),
          x: logicalCol,
          y: logicalRow,
          type: 'view',
          timestamp: Date.now(),
          user: 'Você'
        };
        
        setRecentActivity(prev => [clickActivity, ...prev.slice(0, 19)]);
        
        // Create click animation
        const pixelKey = `${logicalCol}-${logicalRow}`;
        setAnimatedPixels(prev => {
          const newMap = new Map(prev);
          newMap.set(pixelKey, {
            x: logicalCol,
            y: logicalRow,
            scale: 1.3,
            opacity: 1,
            rotation: 0,
            glowIntensity: 0.8,
            lastActivity: Date.now(),
            activityType: 'view',
            isHovered: false,
            isPulsing: true,
            isNew: true
          });
          return newMap;
        });
        
        setPlayHoverSound(true);
        
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
  
  // Enhanced mouse move handler for hover effects
  const handleMouseMoveCanvas = (event: React.MouseEvent) => {
    if (!containerRef.current || !pixelBitmap) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseXInContainer = event.clientX - rect.left;
    const mouseYInContainer = event.clientY - rect.top;

    const xOnContent = (mouseXInContainer - position.x) / zoom;
    const yOnContent = (mouseYInContainer - position.y) / zoom;

    const logicalCol = Math.floor(xOnContent / RENDERED_PIXEL_SIZE_CONFIG);
    const logicalRow = Math.floor(yOnContent / RENDERED_PIXEL_SIZE_CONFIG);

    if (logicalCol >= 0 && logicalCol < LOGICAL_GRID_COLS_CONFIG && logicalRow >= 0 && logicalRow < logicalGridRows) {
      const bitmapIdx = logicalRow * LOGICAL_GRID_COLS_CONFIG + logicalCol;
      
      if (pixelBitmap[bitmapIdx] === 1) {
        const newHovered = { x: logicalCol, y: logicalRow };
        
        // Only update if different pixel
        if (!hoveredPixel || hoveredPixel.x !== newHovered.x || hoveredPixel.y !== newHovered.y) {
          setHoveredPixel(newHovered);
          
          // Create hover animation
          const pixelKey = `${logicalCol}-${logicalRow}`;
          setAnimatedPixels(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(pixelKey);
            
            newMap.set(pixelKey, {
              x: logicalCol,
              y: logicalRow,
              scale: PIXEL_HOVER_SCALE,
              opacity: 1,
              rotation: existing?.rotation || 0,
              glowIntensity: 0.6,
              lastActivity: Date.now(),
              activityType: 'view',
              isHovered: true,
              isPulsing: false,
              isNew: false
            });
            return newMap;
          });
          
          // Subtle haptic feedback on hover
          vibrate('light');
          setPlayHoverSound(true);
        }
      } else {
        setHoveredPixel(null);
      }
    } else {
      setHoveredPixel(null);
    }
    
    // Continue with drag logic if dragging
    if (isDragging) {
      handleMouseMove(event);
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

    // Create purchase activity with celebration
    const purchaseActivity: PixelActivityEvent = {
      id: Date.now().toString(),
      x: pixelData.x,
      y: pixelData.y,
      type: 'purchase',
      timestamp: Date.now(),
      user: 'Você',
      color: customizations.color || USER_BOUGHT_PIXEL_COLOR
    };
    
    setRecentActivity(prev => [purchaseActivity, ...prev.slice(0, 19)]);
    setShowConfetti(true);
    setPlayActivitySound(true);
    
    // Add XP and credits for purchase
    addXp(50);
    addCredits(10);
    
    const newSoldPixel: SoldPixel = {
      x: pixelData.x,
      y: pixelData.y,
      color: customizations.color || USER_BOUGHT_PIXEL_COLOR,
      ownerId: MOCK_CURRENT_USER_ID,
      title: customizations.title || `Meu Pixel (${pixelData.x},${pixelData.y})`,
      pixelImageUrl: customizations.image, 
      rarity: customizations.rarity || 'Comum',
      lastActivity: Date.now(),
      views: 1,
      likes: 0
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
      <SoundEffect src={SOUND_EFFECTS.HOVER} play={playHoverSound} onEnd={() => setPlayHoverSound(false)} volume={0.1} />
      <SoundEffect src={SOUND_EFFECTS.PURCHASE} play={playActivitySound} onEnd={() => setPlayActivitySound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} particleCount={150} />
      
      <div className="flex flex-col h-full w-full overflow-hidden relative animate-fade-in">
        {/* Enhanced loading overlay */}
        <LoadingOverlay 
          isLoading={isLoadingMap} 
          text={progressMessage}
          progress={loadingProgress}
        >
          <div />
        </LoadingOverlay>
        
        {/* Living Grid Activity Feed */}
        <AnimatePresence>
          {recentActivity.slice(0, 3).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -300, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute top-20 right-4 z-30 pointer-events-none"
              style={{ top: `${80 + index * 60}px` }}
            >
              <div className="bg-card/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-primary/30 max-w-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: getActivityColor(activity.type) }} />
                  <span className="text-sm font-medium">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.type === 'purchase' ? 'comprou' : 
                     activity.type === 'edit' ? 'editou' :
                     activity.type === 'view' ? 'visualizou' :
                     activity.type === 'like' ? 'curtiu' : 'comentou'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pixel ({activity.x}, {activity.y})
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-card/80 backdrop-blur-sm p-2 rounded-lg shadow-lg pointer-events-auto animate-slide-in-up animation-delay-200">
          <EnhancedTooltip
            title="Controles do Mapa"
            description="Use estes controles para navegar pelo mapa vivo"
            stats={[
              { label: 'Zoom', value: `${zoom.toFixed(2)}x`, icon: <ZoomIn className="h-4 w-4" /> },
              { label: 'Pixels', value: activePixelsInMap.toLocaleString(), icon: <MapPinIconLucide className="h-4 w-4" /> },
              { label: 'Atividade', value: recentActivity.length.toString(), icon: <Activity className="h-4 w-4" /> }
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      pointerEvents="auto" 
                      variant={showActivityRipples ? "default" : "outline"} 
                      size="icon" 
                      onClick={() => setShowActivityRipples(!showActivityRipples)}
                      aria-label="Toggle Activity"
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Atividade em Tempo Real</p></TooltipContent>
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
            {hoveredPixel && (
              <div className="flex items-center justify-between border-t border-primary/20 pt-1">
                <span className="text-muted-foreground">Hover:</span>
                <span className="text-accent font-bold">({hoveredPixel.x}, {hoveredPixel.y})</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-primary/20 pt-1">
              <span className="text-muted-foreground">Pixels Ativos:</span>
              <span className="text-green-500 font-bold">{activePixelsInMap.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-t border-primary/20 pt-1">
              <span className="text-muted-foreground">Atividade:</span>
              <span className="text-blue-500 font-bold">{recentActivity.length}</span>
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
          
          {/* Living Grid Controls */}
          <div className="mt-2 p-2 bg-background/90 rounded-md border border-accent/20 space-y-2">
            <div className="text-xs font-semibold text-accent flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Efeitos Vivos
            </div>
            
            <div className="space-y-1">
              <Button
                variant={showActivityRipples ? "default" : "outline"}
                size="sm"
                onClick={() => setShowActivityRipples(!showActivityRipples)}
                className="w-full text-xs h-7"
              >
                <Activity className="h-3 w-3 mr-1" />
                Ondas
              </Button>
              
              <Button
                variant={showPixelPulse ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPixelPulse(!showPixelPulse)}
                className="w-full text-xs h-7"
              >
                <Radio className="h-3 w-3 mr-1" />
                Pulso
              </Button>
              
              <Button
                variant={showRarityGlow ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRarityGlow(!showRarityGlow)}
                className="w-full text-xs h-7"
              >
                <Crown className="h-3 w-3 mr-1" />
                Brilho
              </Button>
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
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
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

        {/* Enhanced Mobile Action Menu */}
        <div className="absolute bottom-6 right-6 z-20 animate-scale-in animation-delay-500 flex flex-col gap-3" style={{ pointerEvents: 'auto' }}>
          {/* Quick Activity Toggle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              size="icon" 
              variant={showActivityRipples ? "default" : "outline"}
              onClick={() => {
                setShowActivityRipples(!showActivityRipples);
                vibrate('medium');
                toast({
                  title: showActivityRipples ? "Atividade Desativada" : "Atividade Ativada",
                  description: showActivityRipples ? "Ondas de atividade ocultadas" : "Veja a atividade em tempo real!",
                });
              }}
              className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Activity className="h-6 w-6" />
            </Button>
          </motion.div>
          
          {/* IA Assistant */}
          <PixelAI pixelData={selectedPixelDetails ? { x: selectedPixelDetails.x, y: selectedPixelDetails.y, region: selectedPixelDetails.region } : undefined}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Brain className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelAI>
          
          {/* Social Features */}
          <PixelSocialFeatures>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <Users className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelSocialFeatures>
          
          {/* Gamification */}
          <PixelGameification>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Trophy className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelGameification>
          
          {/* Auction */}
          <PixelAuction>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Gavel className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelAuction>
          
          {/* Collaborative Editor */}
          <PixelCollaborativeEditor pixelData={selectedPixelDetails ? { x: selectedPixelDetails.x, y: selectedPixelDetails.y, owner: selectedPixelDetails.owner || 'Sistema' } : undefined}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                <Edit3 className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelCollaborativeEditor>
          
          {/* AR Button */}
          <PixelAR>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Camera className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelAR>
          
          {/* Stories Button */}
          <PixelStories>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Play className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelStories>
          
          {/* Live Stream Button */}
          <PixelLiveStream>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                <Radio className="h-6 w-6" />
              </Button>
            </motion.div>
          </PixelLiveStream>
          
          {/* Main Action Button */}
          <EnhancedTooltip
            title="Ações Rápidas"
            description="Acesso rápido às funcionalidades do universo vivo"
            actions={[
              { 
                label: 'Explorar', 
                onClick: () => {}, 
                icon: <Search className="h-4 w-4" /> 
              },
              { 
                label: 'Efeitos Vivos', 
                onClick: () => {
                  setShowActivityRipples(!showActivityRipples);
                  setShowPixelPulse(!showPixelPulse);
                  setShowRarityGlow(!showRarityGlow);
                }, 
                icon: <Sparkles className="h-4 w-4" /> 
              }
            ]}
            interactive={true}
          >
            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button style={{ pointerEvents: 'auto' }} size="icon" className="rounded-full w-14 h-14 shadow-lg button-gradient-gold button-3d-effect hover:button-gold-glow active:scale-95 animate-pulse-slow">
                     <Star className="h-7 w-7 animate-glow" />
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-primary/30 shadow-xl" data-dialog-content style={{ pointerEvents: 'auto' }}>
                <DialogHeader className="dialog-header-gold-accent rounded-t-lg">
                  <DialogTitle className="font-headline text-shadow-gold-sm">Universo Vivo - Ações Rápidas</DialogTitle>
                  <DialogDescriptionElement className="text-muted-foreground animate-fade-in animation-delay-200">
                    Explore e interaja com o mapa de pixels vivo em tempo real.
                  </DialogDescriptionElement>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline"><Search className="mr-2 h-4 w-4" />Explorar Pixel por Coordenadas</Button>
                  <Button 
                    style={{ pointerEvents: 'auto' }} 
                    variant="outline" 
                    className="button-3d-effect-outline"
                    onClick={() => {
                      setShowActivityRipples(!showActivityRipples);
                      setShowPixelPulse(!showPixelPulse);
                      setShowRarityGlow(!showRarityGlow);
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {showActivityRipples ? 'Desativar' : 'Ativar'} Efeitos Vivos
                  </Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline"><Activity className="mr-2 h-4 w-4" />Feed de Atividade ({recentActivity.length})</Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" onClick={handleGoToMyLocation} className="button-3d-effect-outline"><MapPinIconLucide className="mr-2 h-4 w-4" />Ir para Minha Localização</Button>
                  <Button style={{ pointerEvents: 'auto' }} variant="outline" className="button-3d-effect-outline">
                    <Brain className="mr-2 h-4 w-4" />
                    Assistente IA
                  </Button>
                  <Button 
                    style={{ pointerEvents: 'auto' }} 
                    variant="outline" 
                    className="button-3d-effect-outline"
                    onClick={() => {
                      // Simulate finding rare pixels
                      const rarePixel = rarePixels[Math.floor(Math.random() * rarePixels.length)];
                      if (rarePixel) {
                        setHighlightedPixel({ x: rarePixel.x, y: rarePixel.y });
                        
                        // Center on rare pixel
                        const targetZoom = 10;
                        const containerWidth = containerRef.current?.offsetWidth || 0;
                        const effectiveContainerHeight = window.innerHeight - HEADER_HEIGHT_PX - BOTTOM_NAV_HEIGHT_PX;
                        
                        const targetX = -rarePixel.x * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + containerWidth / 2;
                        const targetY = -rarePixel.y * RENDERED_PIXEL_SIZE_CONFIG * targetZoom + effectiveContainerHeight / 2;
                        
                        setPosition({ x: targetX, y: targetY });
                        setZoom(targetZoom);
                        
                        toast({
                          title: "🌟 Pixel Raro Encontrado!",
                          description: `Pixel ${rarePixel.rarity} em (${rarePixel.x}, ${rarePixel.y})`,
                        });
                      }
                    }}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Encontrar Pixel Raro
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
        
        {/* Floating Activity Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-20 z-20 pointer-events-none"
        >
          <div className="bg-card/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-primary/30 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-primary">{recentActivity.length} atividades</span>
          </div>
        </motion.div>
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
