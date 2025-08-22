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

// Performance optimization constants
const VIRTUALIZATION_THRESHOLD = 10000;
const LAZY_LOADING_DISTANCE = 100;
const CACHE_SIZE = 1000;
const RENDER_BATCH_SIZE = 100;
const DEBOUNCE_DELAY = 16; // ~60fps

// Configuration constants
const SVG_VIEWBOX_WIDTH = 12969;
const SVG_VIEWBOX_HEIGHT = 26674;
const LOGICAL_GRID_COLS_CONFIG = 1273;
const RENDERED_PIXEL_SIZE_CONFIG = 1;

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
  x: number;
  y: number;
  owner?: string;
  price: number;
  region: string;
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Marco Histórico';
  color?: string;
  title?: string;
  description?: string;
  isOwnedByCurrentUser?: boolean;
  isForSaleBySystem?: boolean;
  specialCreditsPrice?: number;
  history: Array<{ owner: string; date: string; price?: number }>;
  views?: number;
  likes?: number;
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
  const { credits, addCredits, addXp, addPixel } = useUserStore();
  
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unsoldColor, setUnsoldColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');

  const [loadedPixelImages, setLoadedPixelImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const containerSizeRef = useRef({ width: 0, height: 0 });
  const { vibrate } = useHapticFeedback();

  // Enhanced loading state with better UX
  const [loadingProgress, setLoadingProgress] = useState(0);

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
        description: `Adquiriu o pixel (${pixelData.x}, ${pixelData.y}) com sucesso!`,
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
  const handlePixelClick = useCallback((x: number, y: number) => {
    const existingPixel = soldPixels.find(p => p.x === x && p.y === y);
    
    if (existingPixel) {
      // Show pixel info
      setSelectedPixelDetails({
        x,
        y,
        owner: existingPixel.owner,
        price: existingPixel.price,
        region: 'Portugal',
        rarity: 'Comum',
        color: existingPixel.color,
        title: existingPixel.title,
        description: existingPixel.description,
        isOwnedByCurrentUser: existingPixel.owner === user?.uid,
        history: [
          { owner: existingPixel.owner, date: existingPixel.timestamp.toISOString(), price: existingPixel.price }
        ],
        views: Math.floor(Math.random() * 100) + 1,
        likes: Math.floor(Math.random() * 50),
      });
      setShowPixelInfoModal(true);
    } else {
      // Show purchase modal
      const mockPixelData: SelectedPixelDetails = {
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
      };
      
      setSelectedPixelDetails(mockPixelData);
      setShowPixelEditModal(true);
    }
    
    vibrate([30]);
  }, [soldPixels, user?.uid, vibrate]);

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
      >
        {/* SVG Map */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
                   <PortugalMapSvg onMapDataLoaded={() => {}} />
        </div>

        {/* Canvas overlays */}
        <canvas
          ref={pixelCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        />
        <canvas
          ref={outlineCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
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

      {/* Search */}
      <div className="absolute top-4 right-4">
        <Input
          placeholder="Procurar localização..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchQuery);
            }
          }}
          className="w-64"
        />
      </div>

      {/* Modals */}
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



