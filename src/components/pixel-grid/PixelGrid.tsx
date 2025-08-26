
// src/components/pixel-grid/PixelGrid.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import PortugalMapSvg, { type MapData } from './PortugalMapSvg';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
import DetailedPixelModal from './DetailedPixelModal';
import PixelAR from './PixelAR';
import PixelStories from './PixelStories';
import PixelLiveStream from './PixelLiveStream';
import PixelCollaborativeEditor from './PixelCollaborativeEditor';
import PixelAuction from './PixelAuction';
import PixelGameification from './PixelGameification';
import PixelSocialFeatures from './PixelSocialFeatures';
import SwipeGestures from '../mobile/SwipeGestures';
import MobileOptimizations from '../mobile/MobileOptimizations';
import { useHapticFeedback } from '../mobile/HapticFeedback';
import {
    Brain, Crosshair, Crown, Grid3X3, Map as MapIcon, MapPin, Palette, Search, Sparkles, Star,
    Trophy, Users,
  } from 'lucide-react';

// Performance optimization constants
const VIRTUALIZATION_THRESHOLD = 10000;
const LAZY_LOADING_DISTANCE = 100;
const CACHE_SIZE = 1000;
const RENDER_BATCH_SIZE = 100;
const DEBOUNCE_DELAY = 16; // ~60fps

// Configuration constants
const SVG_VIEWBOX_WIDTH = 12969;
const SVG_VIEWBOX_HEIGHT = 26674;
const LOGICAL_GRID_COLS_CONFIG = 640;
const RENDERED_PIXEL_SIZE_CONFIG = 1;
const DESIRED_POPULATION = 10411834;

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

// Types
interface ZoomBookmark {
  id: string;
  name: string;
  x: number;
  y: number;
  zoom: number;
  timestamp: Date;
}

interface SelectedPixelDetails {
  id?: number;
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

type VisualizationMode = 'default' | 'density' | 'value' | 'ownership' | 'activity';

const mockLoreSnippets: string[] = [
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
  
  // New navigation and visualization states
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('default');
  const [showGrid, setShowGrid] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showDensityHeatmap, setShowDensityHeatmap] = useState(false);
  const [zoomBookmarks, setZoomBookmarks] = useState<ZoomBookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [densityData, setDensityData] = useState<Map<string, number>>(new Map());
  const [valueData, setValueData] = useState<Map<string, number>>(new Map());
  
  const [showPixelInfoModal, setShowPixelInfoModal] = useState(false);
  const [showPixelEditModal, setShowPixelEditModal] = useState(false);
  const [showDetailedPixelModal, setShowDetailedPixelModal] = useState(false);
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
  
  // Mask limiting pixels to Portugal landmass
  const [maskBitmap, setMaskBitmap] = useState<Uint8Array | null>(null);
  const [maskDimensions, setMaskDimensions] = useState<{ cols: number; rows: number } | null>(null);
  const maskWorkerRef = useRef<Worker | null>(null);
  const [maskRowCounts, setMaskRowCounts] = useState<Uint32Array | null>(null);
  const [idPermutation, setIdPermutation] = useState<{ n: number; a: number; b: number; aInv: number } | null>(null);
  
  const { isOnline } = useAppStore();
  const { soldPixels, addSoldPixel, getPixelById } = usePixelStore();
  const { credits, addCredits, addXp, addPixel } = useUserStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');
  const [resolvedUnsoldColor, setResolvedUnsoldColor] = useState<string>('#ddd');
  const [resolvedStrokeColor, setResolvedStrokeColor] = useState<string>('#bbb');
  const mapPathsRef = useRef<Path2D[] | null>(null);
  const mapPathTransformsRef = useRef<Array<{ tx: number; ty: number; sx: number; sy: number }> | null>(null);
  const lod0TilesRef = useRef<{ ready: boolean; images: HTMLImageElement[]; cols: number; rows: number; tileW: number; tileH: number } | null>(null);

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });
  const { vibrate } = useHapticFeedback();

  // Enhanced loading state with better UX
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [logicalCols, setLogicalCols] = useState<number>(LOGICAL_GRID_COLS_CONFIG);
  const [rescaleDone, setRescaleDone] = useState<boolean>(false);

  // Load saved bookmarks
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
        console.error('Error loading zoom bookmarks:', error);
      }
    }
  }, []);

  // Generate density and value data
  useEffect(() => {
    if (pixelBitmap && soldPixels.length > 0) {
      const newDensityData = new Map<string, number>();
      const newValueData = new Map<string, number>();
      
      // Calculate density in 10x10 pixel chunks
      const logicalGridRows = Math.ceil(SVG_VIEWBOX_HEIGHT / RENDERED_PIXEL_SIZE_CONFIG);
      
      for (let chunkY = 0; chunkY < logicalGridRows; chunkY += 10) {
        for (let chunkX = 0; chunkX < LOGICAL_GRID_COLS_CONFIG; chunkX += 10) {
          let pixelCount = 0;
          let totalValue = 0;
          
          for (let y = chunkY; y < Math.min(chunkY + 10, logicalGridRows); y++) {
            for (let x = chunkX; x < Math.min(chunkX + 10, LOGICAL_GRID_COLS_CONFIG); x++) {
              const soldPixel = soldPixels.find(p => p.x === x && p.y === y);
              if (soldPixel) {
                pixelCount++;
                totalValue += Math.random() * 100 + 50; // Mock value
              }
            }
          }
          
          const chunkKey = `${chunkX}-${chunkY}`;
          newDensityData.set(chunkKey, pixelCount);
          newValueData.set(chunkKey, totalValue / Math.max(pixelCount, 1));
        }
      }
      
      setDensityData(newDensityData);
      setValueData(newValueData);
    }
  }, [pixelBitmap, soldPixels]);

  const clearAutoResetTimeout = useCallback(() => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
      autoResetTimeoutRef.current = null;
    }
  }, []);

  // Initialize client-side functionality
  useEffect(() => {
    setIsClient(true);
    
    // Set default colors
    setUnsoldColor('hsl(var(--muted))');
    setStrokeColor('hsl(var(--border))');
    
    // Load map data
    const loadMapData = async () => {
      try {
        setProgressMessage("Carregando mapa...");
        setLoadingProgress(10);
        
        // Simulate map loading
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingProgress(50);
        
        setProgressMessage("Gerando grelha de pixels...");
        await new Promise(resolve => setTimeout(resolve, 300));
        setLoadingProgress(80);
        
        setProgressMessage("Finalizando...");
        await new Promise(resolve => setTimeout(resolve, 200));
        setLoadingProgress(100);
        
        setIsLoadingMap(false);
        setProgressMessage("Mapa carregado!");
      } catch (error) {
        console.error("Error loading map:", error);
        toast({
          title: "Erro ao carregar mapa",
          description: "Não foi possível carregar o mapa. Tente recarregar a página.",
          variant: "destructive",
        });
      }
    };
    
    loadMapData();
  }, [toast]);

  // Resolve CSS variables to concrete colors for canvas painting
  useEffect(() => {
    try {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const muted = cs.getPropertyValue('--muted').trim();
      const border = cs.getPropertyValue('--border').trim();
      // Mantemos os não vendidos a branco para o caso base (visual desejado)
      setResolvedUnsoldColor('#ffffff');
      if (border) setResolvedStrokeColor(`hsl(${border})`);
    } catch {}
  }, [unsoldColor, strokeColor]);

  // Preparar Path2D do mapa para preenchimento rápido em LOD baixo (com transforms)
  useEffect(() => {
    if (mapData) {
      try {
        if ((mapData as any).pathEntries && (mapData as any).pathEntries.length > 0) {
          const entries = (mapData as any).pathEntries as Array<{ d: string; transform?: { tx: number; ty: number; sx: number; sy: number } }>;
          mapPathsRef.current = entries.map(e => new Path2D(e.d));
          mapPathTransformsRef.current = entries.map(e => e.transform || { tx: 0, ty: 0, sx: 1, sy: 1 });
        } else if (mapData.pathStrings && mapData.pathStrings.length > 0) {
          mapPathsRef.current = mapData.pathStrings.map((d) => new Path2D(d));
          mapPathTransformsRef.current = mapPathsRef.current.map(() => ({ tx: 0, ty: 0, sx: 1, sy: 1 }));
        } else {
          mapPathsRef.current = null;
          mapPathTransformsRef.current = null;
        }
      } catch {
        mapPathsRef.current = null;
        mapPathTransformsRef.current = null;
      }
    }
  }, [mapData]);

  // Fallback geométrico: testa ponto dentro do mapa usando Path2D + transforms
  const isPointInsideMap = useCallback((mapX: number, mapY: number): boolean => {
    if (!mapPathsRef.current || mapPathsRef.current.length === 0) return false;
    const canvas = pixelCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return false;
    const tfs = mapPathTransformsRef.current;
    let inside = false;
    ctx.save();
    for (let i = 0; i < mapPathsRef.current.length; i++) {
      const tf = tfs?.[i] || { tx: 0, ty: 0, sx: 1, sy: 1 };
      ctx.save();
      ctx.transform(tf.sx, 0, 0, tf.sy, tf.tx, tf.ty);
      if (ctx.isPointInPath(mapPathsRef.current[i], mapX, mapY)) {
        inside = true;
        ctx.restore();
        break;
      }
      ctx.restore();
    }
    ctx.restore();
    return inside;
  }, []);

  // Helpers para permutação afim (ID aleatório mas determinístico)
  function egcd(a: number, b: number): { g: number; x: number; y: number } {
    if (b === 0) return { g: Math.abs(a), x: a < 0 ? -1 : 1, y: 0 };
    const { g, x, y } = egcd(b, a % b);
    return { g, x: y, y: x - Math.floor(a / b) * y };
  }
  function modInv(a: number, n: number): number {
    const { g, x } = egcd(a, n);
    if (g !== 1) return 1; // fallback
    const inv = ((x % n) + n) % n;
    return inv;
  }
  function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b); }

  // Carregar tiles LOD0 se existirem (manifest)
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch('/tiles/lod0/manifest.json', { cache: 'force-cache' });
        if (!res.ok) return;
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) return;

        // Inferir grelha de tiles por convenção: {cols}x{rows}-{tileW}x{tileH}-{x}-{y}.webp
        // Ex.: 8x16-512x512-3-10.webp
        const metaMatch = String(list[0]).match(/(\d+)x(\d+)-(\d+)x(\d+)-/);
        const cols = metaMatch ? parseInt(metaMatch[1], 10) : 1;
        const rows = metaMatch ? parseInt(metaMatch[2], 10) : 1;
        const tileW = metaMatch ? parseInt(metaMatch[3], 10) : 512;
        const tileH = metaMatch ? parseInt(metaMatch[4], 10) : 512;

        const images: HTMLImageElement[] = [];
        for (const rel of list) {
          const img = new Image();
          img.decoding = 'async';
          img.loading = 'eager';
          img.src = `/tiles/lod0/${rel}`;
          await img.decode().catch(() => {});
          if (aborted) return;
          images.push(img);
        }
        lod0TilesRef.current = { ready: true, images, cols, rows, tileW, tileH };
      } catch {}
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // Draw visible pixels inside mask on canvas (screen coordinates)
  useEffect(() => {
    const canvas = pixelCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !maskBitmap || !maskDimensions) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    // Base scale and letterboxing offsets from SVG viewBox -> screen at zoom=1
    const baseScale = Math.min(containerWidth / SVG_VIEWBOX_WIDTH, containerHeight / SVG_VIEWBOX_HEIGHT);
    const offsetX = (containerWidth - SVG_VIEWBOX_WIDTH * baseScale) / 2;
    const offsetY = (containerHeight - SVG_VIEWBOX_HEIGHT * baseScale) / 2;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    if (canvas.width !== Math.floor(containerWidth * dpr) || canvas.height !== Math.floor(containerHeight * dpr)) {
      canvas.width = Math.floor(containerWidth * dpr);
      canvas.height = Math.floor(containerHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    const logicalGridCols = LOGICAL_GRID_COLS_CONFIG;
    const cellSize = SVG_VIEWBOX_WIDTH / logicalGridCols;
    const logicalGridRows = Math.ceil(SVG_VIEWBOX_HEIGHT / cellSize);

    // Viewport bounds in map coords
    const mapMinX = (-position.x - offsetX) / (baseScale * zoom);
    const mapMinY = (-position.y - offsetY) / (baseScale * zoom);
    const mapMaxX = (containerWidth - position.x - offsetX) / (baseScale * zoom);
    const mapMaxY = (containerHeight - position.y - offsetY) / (baseScale * zoom);

    // Visible logical cells
    const startX = Math.max(0, Math.floor(mapMinX / cellSize));
    const endX = Math.min(logicalGridCols, Math.ceil(mapMaxX / cellSize));
    const startY = Math.max(0, Math.floor(mapMinY / cellSize));
    const endY = Math.min(logicalGridRows, Math.ceil(mapMaxY / cellSize));

    // Fast lookup for sold pixels
    const soldColorByKey = new Map<string, string>();
    for (const p of soldPixels) {
      soldColorByKey.set(`${p.x},${p.y}`, (p as any).color || '#D4A757');
    }

    const screenCellSize = cellSize * baseScale * zoom;
    const drawStroke = screenCellSize >= 8; // só em zoom alto
    ctx.lineWidth = Math.max(1, Math.floor(zoom >= 12 ? 1.0 : 0.5));

    // LOD: em zoom baixo
    if (screenCellSize < 1) {
      // Se houver LOD0 tiles, desenhá-los escalados ao viewBox
      if (lod0TilesRef.current && lod0TilesRef.current.ready) {
        const { images, cols, rows } = lod0TilesRef.current;
        // Assumimos ordem por lista, index = y*cols + x
        const drawTile = (tileImg: HTMLImageElement, tx: number, ty: number, tw: number, th: number) => {
          const sx = offsetX + position.x + (tx / cols) * SVG_VIEWBOX_WIDTH * baseScale * zoom;
          const sy = offsetY + position.y + (ty / rows) * SVG_VIEWBOX_HEIGHT * baseScale * zoom;
          const sw = (SVG_VIEWBOX_WIDTH / cols) * baseScale * zoom;
          const sh = (SVG_VIEWBOX_HEIGHT / rows) * baseScale * zoom;
          ctx.drawImage(tileImg, sx, sy, sw, sh);
        };
        for (let ty = 0; ty < rows; ty++) {
          for (let tx = 0; tx < cols; tx++) {
            const idx = ty * cols + tx;
            const img = images[idx];
            if (!img) continue;
            drawTile(img, tx, ty, 0, 0);
          }
        }
      } else if (mapPathsRef.current) {
        // Fundo branco recortado ao mapa com transforms por path (inclui ilhas)
        ctx.save();
        ctx.translate(offsetX + position.x, offsetY + position.y);
        ctx.scale(baseScale * zoom, baseScale * zoom);
        ctx.fillStyle = '#ffffff';
        const tfs = mapPathTransformsRef.current;
        for (let i = 0; i < mapPathsRef.current.length; i++) {
          const path = mapPathsRef.current[i];
          const tf = tfs?.[i] || { tx: 0, ty: 0, sx: 1, sy: 1 };
          ctx.save();
          ctx.transform(tf.sx, 0, 0, tf.sy, tf.tx, tf.ty);
          ctx.fill(path);
          ctx.restore();
        }
        ctx.restore();
      }

      // Desenhar apenas os vendidos visíveis por cima
      // Fundo branco recortado ao mapa
      for (const [key, color] of soldColorByKey) {
        const [sx, sy] = key.split(',').map((v) => parseInt(v, 10));
        if (sx < startX || sx >= endX || sy < startY || sy >= endY) continue;
        const idx = sy * maskDimensions.cols + sx;
        if (maskBitmap[idx] !== 1) continue;

        const mapX = sx * cellSize;
        const mapY = sy * cellSize;
        const screenX = offsetX + position.x + mapX * baseScale * zoom;
        const screenY = offsetY + position.y + mapY * baseScale * zoom;
        const screenW = cellSize * baseScale * zoom;
        const screenH = cellSize * baseScale * zoom;

        ctx.fillStyle = color;
        ctx.fillRect(screenX, screenY, screenW, screenH);
      }
    } else {
      // Zoom médio/alto: desenhar célula a célula
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const idx = y * maskDimensions.cols + x;
          if (maskBitmap[idx] !== 1) continue; // fora do território

          const mapX = x * cellSize;
          const mapY = y * cellSize;
          const screenX = offsetX + position.x + mapX * baseScale * zoom;
          const screenY = offsetY + position.y + mapY * baseScale * zoom;
          const screenW = cellSize * baseScale * zoom;
          const screenH = cellSize * baseScale * zoom;

          const key = `${x},${y}`;
          const isSold = soldColorByKey.has(key);
          const fill = isSold ? soldColorByKey.get(key)! : resolvedUnsoldColor;

          ctx.fillStyle = fill;
          ctx.fillRect(screenX, screenY, screenW, screenH);

          if (drawStroke) {
            ctx.strokeStyle = resolvedStrokeColor;
            ctx.strokeRect(screenX + 0.25, screenY + 0.25, screenW - 0.5, screenH - 0.5);
          }
        }
      }
    }

    ctx.restore();
  }, [maskBitmap, maskDimensions, position.x, position.y, zoom, soldPixels, resolvedUnsoldColor, resolvedStrokeColor]);

  // Stable handler to avoid re-running child effect on each render
  const handleMapDataLoaded = useCallback((data: MapData) => {
    setMapData(data);
  }, []);

  // Build mask bitmap from SVG paths (Portugal landmass)
  const generateMaskFromPaths = useCallback(async (paths: string[]) => {
    try {
      // Inicializar worker se necessário
      if (!maskWorkerRef.current) {
        maskWorkerRef.current = new Worker('/workers/mask-worker.js');
      }

      const worker = maskWorkerRef.current;
      const requestId = Math.random().toString(36).slice(2);

      const result: { bitmap?: ArrayBuffer; rowCounts?: ArrayBuffer; cols?: number; rows?: number; insideCount?: number; error?: string } = await new Promise((resolve) => {
        const onMessage = (ev: MessageEvent) => {
          const msg = ev.data || {};
          if (msg.type === 'mask-result' && msg.requestId === requestId) {
            worker.removeEventListener('message', onMessage);
            resolve(msg);
          }
        };
        worker.addEventListener('message', onMessage);
        worker.postMessage({
          type: 'mask-generate',
          requestId,
          paths,
          logicalGridCols: LOGICAL_GRID_COLS_CONFIG,
          viewWidth: SVG_VIEWBOX_WIDTH,
          viewHeight: SVG_VIEWBOX_HEIGHT,
        });
      });

      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.bitmap || !result.rowCounts || !result.cols || !result.rows || typeof result.insideCount !== 'number') {
        throw new Error('Resposta inválida do worker');
      }

      const bitmap = new Uint8Array(result.bitmap);
      const rowCounts = new Uint32Array(result.rowCounts);
      setMaskBitmap(bitmap);
      setMaskDimensions({ cols: result.cols, rows: result.rows });
      setActivePixelsInMap(result.insideCount);
      setMaskRowCounts(rowCounts);

      // Criar permutação afim para IDs aleatórios
      if (result.insideCount > 0) {
        const n = result.insideCount;
        // semente fixa (pode vir de env/config). Usamos uma constante grande.
        const seed = 2654435761 >>> 0;
        // escolher 'a' ímpar e coprimo com n
        let a = (seed | 1) % n; if (a === 0) a = 1;
        while (gcd(a, n) !== 1) { a = (a + 2) % n; if (a === 0) a = 1; }
        const b = (seed * 48271) % n;
        const aInv = modInv(a, n);
        setIdPermutation({ n, a, b, aInv });
      }
    } catch (error) {
      // Silenciar ruído do worker em ambientes sem suporte a Path2D/OffscreenCanvas
      console.debug('Mask worker unavailable, using main-thread fallback');
      // Fallback: gerar no main thread
      try {
        const logicalGridCols = LOGICAL_GRID_COLS_CONFIG;
        const cellSize = SVG_VIEWBOX_WIDTH / logicalGridCols;
        const logicalGridRows = Math.ceil(SVG_VIEWBOX_HEIGHT / cellSize);

        const offscreen = document.createElement('canvas');
        offscreen.width = logicalGridCols;
        offscreen.height = logicalGridRows;
        const ctx = offscreen.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.scale(logicalGridCols / SVG_VIEWBOX_WIDTH, logicalGridRows / SVG_VIEWBOX_HEIGHT);
        ctx.fillStyle = '#000';
        const tfs = mapPathTransformsRef.current;
        for (let i = 0; i < paths.length; i++) {
          const d = paths[i];
          try {
            ctx.save();
            const tf = tfs?.[i] || { tx: 0, ty: 0, sx: 1, sy: 1 };
            ctx.transform(tf.sx, 0, 0, tf.sy, tf.tx, tf.ty);
            const p = new Path2D(d);
            ctx.fill(p);
            ctx.restore();
          } catch {}
        }
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, logicalGridCols, logicalGridRows);
        const data = imageData.data;
        const bitmap = new Uint8Array(logicalGridCols * logicalGridRows);
        const rowCounts = new Uint32Array(logicalGridRows);
        let insideCount = 0;
        for (let y = 0; y < logicalGridRows; y++) {
          let rowInside = 0;
          const rowOffset = y * logicalGridCols;
          for (let x = 0; x < logicalGridCols; x++) {
            const i = (rowOffset + x) * 4;
            if (data[i + 3] > 0) {
              bitmap[rowOffset + x] = 1;
              rowInside++;
            }
          }
          rowCounts[y] = rowInside;
          insideCount += rowInside;
        }

        setMaskBitmap(bitmap);
        setMaskDimensions({ cols: logicalGridCols, rows: logicalGridRows });
        setActivePixelsInMap(insideCount);
        setMaskRowCounts(rowCounts);

        if (insideCount > 0) {
          const n = insideCount;
          const seed = 2654435761 >>> 0;
          let a = (seed | 1) % n; if (a === 0) a = 1;
          while (gcd(a, n) !== 1) { a = (a + 2) % n; if (a === 0) a = 1; }
          const b = (seed * 48271) % n;
          const aInv = modInv(a, n);
          setIdPermutation({ n, a, b, aInv });
        }
      } catch (e) {
        console.error('Fallback main-thread mask generation failed:', e);
      }
    }
  }, []);

  // Trigger mask generation once mapData is available
  useEffect(() => {
    if (mapData?.pathStrings && mapData.pathStrings.length > 0 && !maskBitmap) {
      generateMaskFromPaths(mapData.pathStrings);
    }
  }, [mapData, maskBitmap, generateMaskFromPaths]);

  // Limpeza do worker ao desmontar
  useEffect(() => {
    return () => {
      if (maskWorkerRef.current) {
        maskWorkerRef.current.terminate();
        maskWorkerRef.current = null;
      }
    };
  }, []);

  // Handle pixel purchase
  const handlePixelPurchase = useCallback(async (
    pixelData: SelectedPixelDetails, 
    paymentMethod: string, 
    customizations: Record<string, unknown>
  ): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Autenticação necessária",
          description: "Tem de estar autenticado para comprar pixels.",
          variant: "destructive",
        });
        return false;
      }

      if (credits < pixelData.price) {
        toast({
          title: "Créditos insuficientes",
          description: "Não tem créditos suficientes para esta compra.",
          variant: "destructive",
        });
        return false;
      }

      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add pixel to store
      addSoldPixel({
        id: pixelData.id,
        x: pixelData.x,
        y: pixelData.y,
        owner: user.uid,
        price: pixelData.price,
        color: customizations.color as string || '#D4A757',
        title: customizations.title as string || `Pixel ${pixelData.x},${pixelData.y}`,
        description: customizations.description as string || '',
      });

      // Update user state
      addCredits(-pixelData.price);
      addXp(10);
      addPixel();

      // Haptic feedback
      vibrate([50, 50, 50]);

      toast({
        title: "Pixel comprado!",
        description: `Adquiriu o pixel (${String(pixelData.x)}, ${String(pixelData.y)}) com sucesso!`,
      });

      return true;
    } catch (error) {
      console.error("Error purchasing pixel:", error);
      toast({
        title: "Erro na compra",
        description: "Ocorreu um erro ao processar a compra. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, credits, addSoldPixel, addCredits, addXp, addPixel, vibrate, toast]);

  // Handle pixel selection
  const handlePixelClick = useCallback((x: number, y: number, id?: number) => {
    const existingPixel = soldPixels.find(p => p.x === x && p.y === y);
    
    if (existingPixel) {
      // Show detailed pixel info
      const detailedPixelData = {
        id,
        x,
        y,
        owner: existingPixel.owner ? {
          id: existingPixel.owner,
          name: existingPixel.owner,
          avatar: 'https://placehold.co/40x40.png',
          level: Math.floor(Math.random() * 20) + 1,
          verified: false,
          joinDate: '2024-01-01',
          totalPixels: Math.floor(Math.random() * 100) + 1,
          totalValue: Math.floor(Math.random() * 1000) + 100,
          badges: ['Investidor', 'Colecionador']
        } : undefined,
        price: existingPixel.price,
        region: 'Portugal',
        rarity: 'Comum',
        color: existingPixel.color,
        title: existingPixel.title,
        description: existingPixel.description,
        isOwnedByCurrentUser: existingPixel.owner === user?.uid,
        history: [
          { action: 'Vendido', user: existingPixel.owner, date: existingPixel.timestamp.toISOString(), price: existingPixel.price, details: 'Pixel vendido' }
        ],
        views: Math.floor(Math.random() * 100) + 1,
        likes: Math.floor(Math.random() * 50),
        tags: ['Portugal', 'Digital'],
        gpsCoords: { lat: 38.7223, lon: -9.1393 },
        features: ['Localização Premium'],
        rating: 4.5,
        totalRatings: Math.floor(Math.random() * 50) + 10,
        userRating: 0
      };
      
      setSelectedPixelDetails(detailedPixelData as any);
      setShowDetailedPixelModal(true);
    } else {
      // Show purchase modal for unsold pixels
      const detailedPixelData = {
        id,
        x,
        y,
        price: PIXEL_BASE_PRICE,
        region: 'Portugal',
        rarity: 'Comum',
        isForSaleBySystem: true,
        specialCreditsPrice: SPECIAL_CREDITS_CONVERSION['Comum'],
        history: [],
        views: 0,
        likes: 0,
        tags: ['Portugal', 'Disponível'],
        gpsCoords: { lat: 38.7223, lon: -9.1393 },
        features: ['Localização Premium'],
        rating: 0,
        totalRatings: 0,
        userRating: 0
      };
      
      setSelectedPixelDetails(detailedPixelData as any);
      setShowDetailedPixelModal(true);
    }
    
    vibrate([30]);
  }, [soldPixels, user?.uid, vibrate, toast]);

  // Save bookmarks
  const saveBookmark = useCallback((name: string, x: number, y: number, zoom: number) => {
    const newBookmark: ZoomBookmark = {
      id: Date.now().toString(),
      name,
      x,
      y,
      zoom,
      timestamp: new Date(),
    };
    
    const updatedBookmarks = [...zoomBookmarks, newBookmark];
    setZoomBookmarks(updatedBookmarks);
    localStorage.setItem(ZOOM_BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    
    toast({
      title: "Marcador guardado",
      description: `O marcador "${name}" foi guardado com sucesso.`,
    });
  }, [zoomBookmarks, toast]);

  // Navigate to bookmark
  const navigateToBookmark = useCallback((bookmark: ZoomBookmark) => {
    setPosition({ x: bookmark.x, y: bookmark.y });
    setZoom(bookmark.zoom);
    
    toast({
      title: "Navegação",
      description: `Navegou para "${bookmark.name}".`,
    });
  }, [toast]);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Search in postal codes
    const postalCode = Object.keys(POSTAL_CODE_COORDINATES).find(code => 
      code.startsWith(query)
    );
    
    if (postalCode) {
      const coords = POSTAL_CODE_COORDINATES[postalCode as keyof typeof POSTAL_CODE_COORDINATES];
      setPosition({ x: coords.x, y: coords.y });
      setZoom(15);
      
      toast({
        title: "Localização encontrada",
        description: `Navegou para ${coords.region} (${postalCode}).`,
      });
      return;
    }
    
    // Search in landmarks
    const landmark = Object.keys(LANDMARK_COORDINATES).find(name => 
      name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (landmark) {
      const coords = LANDMARK_COORDINATES[landmark as keyof typeof LANDMARK_COORDINATES];
      setPosition({ x: coords.x, y: coords.y });
      setZoom(coords.zoom);
      
      toast({
        title: "Marco encontrado",
        description: `Navegou para ${landmark}.`,
      });
      return;
    }
    
    toast({
      title: "Nada encontrado",
      description: "Não foi encontrada nenhuma localização com esse nome.",
      variant: "destructive",
    });
  }, [toast]);

  // Performance optimization: Debounced zoom and position updates
  const debouncedSetZoom = useCallback(
    debounce((newZoom: number) => {
      setZoom(newZoom);
    }, DEBOUNCE_DELAY),
    []
  );

  const debouncedSetPosition = useCallback(
    debounce((newPosition: { x: number; y: number }) => {
      setPosition(newPosition);
    }, DEBOUNCE_DELAY),
    []
  );

  // Utility function for debouncing
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (didDragRef.current) {
          didDragRef.current = false;
          return;
      }
      
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Account for base scale and letterboxing to convert screen -> map(viewBox) coordinates
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      const baseScale = Math.min(containerWidth / SVG_VIEWBOX_WIDTH, containerHeight / SVG_VIEWBOX_HEIGHT);
      const offsetX = (containerWidth - SVG_VIEWBOX_WIDTH * baseScale) / 2;
      const offsetY = (containerHeight - SVG_VIEWBOX_HEIGHT * baseScale) / 2;

      const mapX = (clickX - offsetX - position.x) / (baseScale * zoom);
      const mapY = (clickY - offsetY - position.y) / (baseScale * zoom);

      // Debug + validação geométrica antes das bounds
      const insideByPath = isPointInsideMap(mapX, mapY);
      let insideByMask: boolean | null = null;
      // Convert map coordinates to logical grid coordinates (clamped ao viewBox)
      const logicalGridCols = LOGICAL_GRID_COLS_CONFIG;
      const cellSize = SVG_VIEWBOX_WIDTH / logicalGridCols;
      const logicalGridRows = Math.ceil(SVG_VIEWBOX_HEIGHT / cellSize);
      const mapXClamped = Math.min(Math.max(mapX, 0), SVG_VIEWBOX_WIDTH - 1);
      const mapYClamped = Math.min(Math.max(mapY, 0), SVG_VIEWBOX_HEIGHT - 1);
      const logicalX = Math.floor(mapXClamped / cellSize);
      const logicalY = Math.floor(mapYClamped / cellSize);

      if (maskBitmap && maskDimensions && logicalX >= 0 && logicalX < maskDimensions.cols && logicalY >= 0 && logicalY < maskDimensions.rows) {
        const debugIdx = logicalY * maskDimensions.cols + logicalX;
        insideByMask = maskBitmap[debugIdx] === 1;
      }
      try { console.debug('PIXEL-CLICK-DEBUG', { mapX: Math.round(mapX), mapY: Math.round(mapY), logicalX, logicalY, insideByMask, insideByPath }); } catch {}

      // Se não está dentro por máscara nem por geometria, ignorar
      if ((insideByMask === false || insideByMask === null) && !insideByPath) return;

      // Mapear para ID contínuo (se disponível)
      let pixelId: number | null = null;
      if (maskRowCounts && maskBitmap && maskDimensions && logicalX >= 0 && logicalX < maskDimensions.cols && logicalY >= 0 && logicalY < maskDimensions.rows) {
        let acc = 0;
        for (let r = 0; r < logicalY; r++) acc += maskRowCounts[r];
        const rowStart = logicalY * maskDimensions.cols;
        let inRow = 0;
        for (let x = 0; x <= logicalX; x++) {
          if (maskBitmap[rowStart + x] === 1) inRow++;
        }
        const rank = acc + inRow;
        if (idPermutation && rank > 0) {
          const { n, a, b } = idPermutation;
          const mapped = (a * ((rank - 1) % n) + b) % n;
          pixelId = mapped + 1;
        } else {
          pixelId = rank;
        }
      }

      handlePixelClick(logicalX, logicalY, pixelId ?? undefined);
  };

  if (!isClient) {
    return <div className="flex items-center justify-center h-full">A carregar...</div>;
  }

  if (isLoadingMap) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">{progressMessage}</div>
          <Progress value={loadingProgress} className="w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main map container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          didDragRef.current = false;
        }}
        onMouseMove={(e) => {
          if (isDragging) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;
            
            if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
              didDragRef.current = true;
              debouncedSetPosition({
                x: position.x - deltaX / zoom,
                y: position.y - deltaY / zoom,
              });
              setDragStart({ x: e.clientX, y: e.clientY });
            }
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseLeave={() => {
          setIsDragging(false);
        }}
        onClick={handleClick}
      >
        {/* SVG Map */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
                   <PortugalMapSvg onMapDataLoaded={handleMapDataLoaded} />
        </div>

        {/* Canvas overlays */}
        <canvas
          ref={pixelCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        <canvas
          ref={outlineCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => debouncedSetZoom(Math.min(zoom * 1.2, 50))}
        >
          +
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => debouncedSetZoom(Math.max(zoom / 1.2, 0.1))}
        >
          -
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPosition({ x: 0, y: 0 });
            setZoom(1);
          }}
        >
          Reset
        </Button>
      </div>

      {/* Modals */}
      {showDetailedPixelModal && selectedPixelDetails && (
        <DetailedPixelModal
          isOpen={showDetailedPixelModal}
          onClose={() => setShowDetailedPixelModal(false)}
          pixelData={selectedPixelDetails as any}
          onPurchase={() => {
            setShowDetailedPixelModal(false);
            setShowPixelEditModal(true);
          }}
          onEdit={() => {
            setShowDetailedPixelModal(false);
            setShowPixelEditModal(true);
          }}
        />
      )}

      {showPixelEditModal && selectedPixelDetails && (
        <EnhancedPixelPurchaseModal
          isOpen={showPixelEditModal}
          onClose={() => setShowPixelEditModal(false)}
          pixelData={selectedPixelDetails}
          userCredits={credits}
          onPurchase={handlePixelPurchase}
        />
      )}

      {showPixelInfoModal && selectedPixelDetails && (
        <PixelInfoModal
          isOpen={showPixelInfoModal}
          onClose={() => setShowPixelInfoModal(false)}
          pixelData={selectedPixelDetails}
          onEdit={() => {
            setShowPixelInfoModal(false);
            setShowPixelEditModal(true);
          }}
          onPurchase={() => {
            setShowPixelInfoModal(false);
            setShowPixelEditModal(true);
          }}
        />
      )}

             {/* Mobile optimizations */}
       <div className="absolute bottom-4 left-4">
         <Button
           variant="secondary"
           size="sm"
           onClick={() => setShowSearch(!showSearch)}
         >
           {showSearch ? 'Ocultar' : 'Procurar'}
         </Button>
       </div>
    </div>
  );
}
