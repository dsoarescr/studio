
'use client';

import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  LogIn,
  LogOut,
  ShoppingCart,
  Palette,
  Eye,
  Trophy,
  Package,
  PackageOpen,
  Users2,
  Grid3X3,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
// import { VirtualizedList } from '@/components/ui/virtualized-list';
// import { useTranslation } from 'react-i18next';

// Types and data from ActivityFeedPanel
type ActivityItem = {
  id: string;
  type: 'login' | 'logout' | 'purchase' | 'color_change' | 'view' | 'custom' | 'achievement';
  user: { name: string; avatarUrl?: string; dataAiHint?: string };
  timestamp: Date;
  details?: string;
  region?: string;
};

// Use static dates to avoid hydration mismatch
const getInitialActivities = (): ActivityItem[] => {
  if (typeof window === 'undefined') {
    // Return static dates for SSR
    return [
      { id: '1', type: 'login', user: { name: 'PixelAdventurer', dataAiHint: "avatar user" }, timestamp: new Date('2024-01-01T12:00:00Z') },
      { id: '2', type: 'purchase', user: { name: 'ArtCollector7', dataAiHint: "avatar user" }, timestamp: new Date('2024-01-01T11:48:00Z'), details: 'Pixel (12,34) em Lisboa', region: 'Lisboa' },
      { id: '3', type: 'color_change', user: { name: 'ColorMaster', dataAiHint: "avatar user" }, timestamp: new Date('2024-01-01T11:35:00Z'), details: 'Pixel (5,8) para #FF0000', region: 'Porto' },
      { id: '4', type: 'achievement', user: { name: 'PixelAdventurer', dataAiHint: "avatar user" }, timestamp: new Date('2024-01-01T11:20:00Z'), details: 'Conquista: Primeiro Pixel!' },
    ];
  }
  // Use dynamic dates for client
  const now = Date.now();
  return [
    { id: '1', type: 'login', user: { name: 'PixelAdventurer', dataAiHint: "avatar user" }, timestamp: new Date(now - 1000 * 60 * 5) },
    { id: '2', type: 'purchase', user: { name: 'ArtCollector7', dataAiHint: "avatar user" }, timestamp: new Date(now - 1000 * 60 * 12), details: 'Pixel (12,34) em Lisboa', region: 'Lisboa' },
    { id: '3', type: 'color_change', user: { name: 'ColorMaster', dataAiHint: "avatar user" }, timestamp: new Date(now - 1000 * 60 * 25), details: 'Pixel (5,8) para #FF0000', region: 'Porto' },
    { id: '4', type: 'achievement', user: { name: 'PixelAdventurer', dataAiHint: "avatar user" }, timestamp: new Date(now - 1000 * 60 * 40), details: 'Conquista: Primeiro Pixel!' },
  ];
};

const activityIcons = {
  login: <LogIn className="h-3.5 w-3.5 text-green-400" />,
  logout: <LogOut className="h-3.5 w-3.5 text-red-400" />,
  purchase: <ShoppingCart className="h-3.5 w-3.5 text-primary" />,
  color_change: <Palette className="h-3.5 w-3.5 text-accent" />,
  view: <Eye className="h-3.5 w-3.5 text-blue-400" />,
  custom: <Activity className="h-3.5 w-3.5 text-purple-400" />,
  achievement: <Trophy className="h-3.5 w-3.5 text-yellow-400" />
};

const activityLabels = {
  login: 'Iniciou sessão',
  logout: 'Terminou sessão',
  purchase: 'Comprou um pixel',
  color_change: 'Editou uma cor',
  view: 'Visualizou uma área',
  custom: 'Evento na comunidade',
  achievement: 'Desbloqueou uma conquista'
};


// Types and data from StatisticsPanel
type StatItem = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tooltip?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
};

const initialStats: StatItem[] = [
  { label: 'Utilizadores Online', value: 137, icon: <Users2 className="h-4 w-4 text-green-400" />, trend: 'neutral', tooltip: "Utilizadores atualmente na plataforma." },
  { label: 'Pixels Comprados', value: 12543, icon: <Package className="h-4 w-4 text-primary" />, trend: 'up', trendValue: '+5%', tooltip: "Total de pixels que já foram adquiridos." },
  { label: 'Pixels Livres', value: 8745723, icon: <PackageOpen className="h-4 w-4 text-accent" />, trend: 'down', trendValue: '-0.2%', tooltip: "Total de pixels ainda disponíveis para compra."},
];


// Helper Components
const FormattedTimestamp: React.FC<{ timestamp: Date }> = ({ timestamp }) => {
  const [timeString, setTimeString] = useState<string>('--:--');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setTimeString(timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [timestamp]);

  return <p className="text-xs text-muted-foreground/80 font-code">{isClient ? timeString : '--:--'}</p>;
};

const FormattedStatValue: React.FC<{ value: number | string }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState<string | number>('--');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setDisplayValue(typeof value === 'number' ? value.toLocaleString('pt-PT') : value);
    }
  }, [value]);
  
  return <span className="font-mono text-sm font-semibold">{isClient ? displayValue : '--'}</span>;
};

export default function MapSidebar() {
  const [activities, setActivities] = useState<ActivityItem[]>(getInitialActivities());
  // const { t } = useTranslation();
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [playHoverSound, setPlayHoverSound] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update activities with real dates on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivities(getInitialActivities());
    }
  }, []);

  useEffect(() => {
    const activityInterval = setInterval(() => {
      const randomActivityTypes: ActivityItem['type'][] = ['login', 'purchase', 'color_change', 'view', 'achievement'];
      const newActivity: ActivityItem = {
        id: String(Date.now()),
        type: randomActivityTypes[Math.floor(Math.random() * randomActivityTypes.length)],
        user: { name: `User${Math.floor(Math.random() * 1000)}`, dataAiHint: "avatar user" },
        timestamp: new Date(),
        details: Math.random() > 0.3 ? `Detalhe aleatório ${Math.floor(Math.random() * 100)}` : undefined,
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    }, 8000);

    const statsInterval = setInterval(() => {
      setStats(prevStats => prevStats.map(stat => {
        if (typeof stat.value !== 'number') return stat;
        
        let change = 0;
        if (stat.label === 'Utilizadores Online') {
           change = Math.floor(Math.random() * 11) - 5; 
        } else if (stat.label === 'Pixels Livres') {
            change = (Math.floor(Math.random() * 100) - 40) * -1;
        } else {
            change = Math.floor(Math.random() * 10);
        }
        
        const newValue = stat.label === 'Utilizadores Online' 
          ? Math.max(50, stat.value + change) 
          : stat.value + change;
        
        return { ...stat, value: newValue };
      }));
    }, 7000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(statsInterval);
    };
  }, []);
  
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <Sidebar collapsible="icon" className="animate-slide-in-up">
      <SoundEffect src={SOUND_EFFECTS.HOVER} play={playHoverSound} onEnd={() => setPlayHoverSound(false)} volume={0.15} rate={1.5} />
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <SidebarTrigger className="button-hover-lift" />
          <div className="relative group-data-[collapsible=icon]:hidden">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
        </div>
        <p className="font-headline text-lg group-data-[collapsible=icon]:hidden text-gradient-gold">
          Painel de Controlo
        </p>
      </SidebarHeader>
      <SidebarContent className="animate-fade-in animation-delay-200">
        
      </SidebarContent>
    </Sidebar>
  );
}
