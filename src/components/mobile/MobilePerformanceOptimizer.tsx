'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Battery, Wifi, Signal, Gauge, Eye, EyeOff, 
  Volume2, VolumeX, Smartphone, AlertTriangle, 
  CheckCircle, Settings, X, TrendingDown, TrendingUp
} from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  batteryLevel: number;
  networkSpeed: string;
  renderTime: number;
}

interface MobilePerformanceOptimizerProps {
  onOptimize?: (settings: any) => void;
  className?: string;
}

export default function MobilePerformanceOptimizer({
  onOptimize,
  className
}: MobilePerformanceOptimizerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 45,
    batteryLevel: 85,
    networkSpeed: '4G',
    renderTime: 16
  });
  
  const {
    performanceMode,
    togglePerformanceMode,
    highQualityRendering,
    toggleHighQualityRendering,
    animations,
    toggleAnimations,
    soundEffects,
    toggleSoundEffects
  } = useSettingsStore();
  
  const { toast } = useToast();

  // Monitor performance metrics
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (now - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
        
        // Show optimizer if performance is poor
        if (fps < 30 && !performanceMode) {
          setIsVisible(true);
        }
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    // Monitor battery
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setMetrics(prev => ({ ...prev, batteryLevel: battery.level * 100 }));
          
          // Show optimizer if battery is low
          if (battery.level < 0.2 && !performanceMode) {
            setIsVisible(true);
          }
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    // Monitor network
    const updateNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setMetrics(prev => ({ 
          ...prev, 
          networkSpeed: connection.effectiveType?.toUpperCase() || '4G' 
        }));
        
        // Show optimizer if network is slow
        if (['2G', 'SLOW-2G'].includes(connection.effectiveType?.toUpperCase()) && !performanceMode) {
          setIsVisible(true);
        }
      }
    };

    animationId = requestAnimationFrame(measurePerformance);
    updateBattery();
    updateNetwork();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [performanceMode]);

  const handleOptimize = () => {
    const optimizations = {
      performanceMode: true,
      highQualityRendering: false,
      animations: false,
      soundEffects: false
    };

    if (!performanceMode) togglePerformanceMode();
    if (highQualityRendering) toggleHighQualityRendering();
    if (animations) toggleAnimations();
    if (soundEffects) toggleSoundEffects();

    onOptimize?.(optimizations);
    
    toast({
      title: "Otimizações Aplicadas",
      description: "Performance melhorada para dispositivos móveis",
    });
    
    setIsVisible(false);
  };

  const handleCustomOptimize = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas preferências de performance foram aplicadas",
    });
    setIsVisible(false);
  };

  const getPerformanceScore = () => {
    let score = 100;
    if (metrics.fps < 60) score -= 20;
    if (metrics.memoryUsage > 70) score -= 15;
    if (metrics.batteryLevel < 30) score -= 10;
    if (['2G', 'SLOW-2G'].includes(metrics.networkSpeed)) score -= 15;
    return Math.max(0, score);
  };

  const performanceScore = getPerformanceScore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <Card className="bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-primary" />
                  Otimização Mobile
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={performanceScore >= 80 ? 'default' : performanceScore >= 60 ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {performanceScore}/100
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className={`text-lg font-bold ${metrics.fps >= 30 ? 'text-green-500' : 'text-red-500'}`}>
                    {metrics.fps}
                  </div>
                  <div className="text-xs text-muted-foreground">FPS</div>
                </div>
                
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className={`text-lg font-bold ${metrics.batteryLevel > 30 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.round(metrics.batteryLevel)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Bateria</div>
                </div>
              </div>

              {/* Quick Optimize */}
              <div className="space-y-3">
                <Button
                  onClick={handleOptimize}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Otimização Automática
                </Button>

                {/* Manual Settings */}
                <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm font-medium">Configurações Manuais</div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Modo Performance</Label>
                      <Switch 
                        checked={performanceMode} 
                        onCheckedChange={togglePerformanceMode}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Alta Qualidade</Label>
                      <Switch 
                        checked={highQualityRendering} 
                        onCheckedChange={toggleHighQualityRendering}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Animações</Label>
                      <Switch 
                        checked={animations} 
                        onCheckedChange={toggleAnimations}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Sons</Label>
                      <Switch 
                        checked={soundEffects} 
                        onCheckedChange={toggleSoundEffects}
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleCustomOptimize}
                    className="w-full"
                    size="sm"
                  >
                    Aplicar Configurações
                  </Button>
                </div>
              </div>

              {/* Performance Tips */}
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <div className="text-sm font-medium text-blue-500 mb-2">
                  💡 Dicas de Performance
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Feche outras aplicações para liberar memória</li>
                  <li>• Use Wi-Fi quando possível para melhor velocidade</li>
                  <li>• Ative o modo performance em dispositivos mais antigos</li>
                  <li>• Reduza o zoom para melhor fluidez</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}