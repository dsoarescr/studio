'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Users, TrendingUp, Activity, Zap, Eye, 
  Wifi, WifiOff, Battery, Signal, Clock, Globe,
  Compass, Target, Navigation, Crosshair
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapStats {
  activeUsers: number;
  pixelsSold: number;
  totalValue: number;
  onlineStatus: boolean;
  lastUpdate: string;
}

interface MobileMapOverlayProps {
  stats: MapStats;
  currentZoom: number;
  currentPosition: { x: number; y: number };
  selectedPixel?: { x: number; y: number } | null;
  className?: string;
}

export default function MobileMapOverlay({
  stats,
  currentZoom,
  currentPosition,
  selectedPixel,
  className
}: MobileMapOverlayProps) {
  const [showStats, setShowStats] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [networkType, setNetworkType] = useState<string>('4g');

  useEffect(() => {
    // Monitor battery level
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(battery.level);
          
          const updateLevel = () => setBatteryLevel(battery.level);
          battery.addEventListener('levelchange', updateLevel);
          
          return () => battery.removeEventListener('levelchange', updateLevel);
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    // Monitor network type
    const updateNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkType(connection.effectiveType || '4g');
      }
    };

    updateBattery();
    updateNetwork();
  }, []);

  const getBatteryColor = () => {
    if (!batteryLevel) return 'text-gray-500';
    if (batteryLevel > 0.5) return 'text-green-500';
    if (batteryLevel > 0.2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getNetworkIcon = () => {
    switch (networkType) {
      case 'slow-2g':
      case '2g':
        return <Signal className="h-3 w-3 text-red-500" />;
      case '3g':
        return <Signal className="h-3 w-3 text-yellow-500" />;
      case '4g':
        return <Signal className="h-3 w-3 text-green-500" />;
      default:
        return <Wifi className="h-3 w-3 text-green-500" />;
    }
  };

  return (
    <div className={cn("fixed top-16 left-0 right-0 z-30 pointer-events-none", className)}>
      {/* Top Stats Bar */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="mx-2 pointer-events-auto"
          >
            <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-lg">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${stats.onlineStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <Users className="h-3 w-3 text-green-500" />
                      <span className="font-bold">{stats.activeUsers}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="font-bold">{stats.pixelsSold}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-accent" />
                      <span className="font-bold">€{stats.totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStats(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device Status */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {/* Network Status */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-1.5 shadow-md">
          <div className="flex items-center gap-1">
            {getNetworkIcon()}
            <span className="text-xs font-medium">{networkType.toUpperCase()}</span>
          </div>
        </div>

        {/* Battery Status */}
        {batteryLevel !== null && (
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-1.5 shadow-md">
            <div className="flex items-center gap-1">
              <Battery className={`h-3 w-3 ${getBatteryColor()}`} />
              <span className="text-xs font-medium">
                {Math.round(batteryLevel * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-2 left-2">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="text-center">
            <div className="text-sm font-bold text-primary">
              {currentZoom.toFixed(1)}x
            </div>
            <div className="text-xs text-muted-foreground">Zoom</div>
          </div>
        </div>
      </div>

      {/* Selected Pixel Indicator */}
      {selectedPixel && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-primary/90 text-primary-foreground rounded-full px-3 py-1 shadow-lg"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Crosshair className="h-3 w-3" />
              <span>({selectedPixel.x}, {selectedPixel.y})</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Collapsed Stats Toggle */}
      {!showStats && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(true)}
            className="bg-card/90 backdrop-blur-sm border-primary/30 h-8 px-3"
          >
            <Activity className="h-3 w-3 mr-1" />
            <span className="text-xs">Stats</span>
          </Button>
        </div>
      )}
    </div>
  );
}