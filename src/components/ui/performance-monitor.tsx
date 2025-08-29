'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { isLowPerformanceDevice } from '@/lib/utils';

interface PerformanceMonitorProps {
  onOptimize?: () => void;
}

export function PerformanceMonitor({ onOptimize }: PerformanceMonitorProps) {
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;

    const checkPerformance = () => {
      // Check if device is low performance
      setIsLowPerformance(isLowPerformanceDevice());

      // Only show for low performance devices
      setIsVisible(isLowPerformanceDevice());
    };

    const measureFps = () => {
      frameCount++;
      const now = performance.now();

      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;

        // Check memory usage if available
        if ((performance as any).memory) {
          const memoryInfo = (performance as any).memory;
          const usedMemoryMB = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));
          const totalMemoryMB = Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024));
          setMemoryUsage((usedMemoryMB / totalMemoryMB) * 100);
        }

        // Show warning if FPS is consistently low
        if (fps < 30 && !isVisible) {
          setIsVisible(true);
        }
      }

      frameId = requestAnimationFrame(measureFps);
    };

    if (typeof window !== 'undefined') {
      checkPerformance();
      frameId = requestAnimationFrame(measureFps);
    }

    return () => {
      if (typeof window !== 'undefined') {
        cancelAnimationFrame(frameId);
      }
    };
  }, [fps, isVisible]);

  const handleOptimize = () => {
    if (onOptimize) {
      onOptimize();
    }

    toast({
      title: 'Modo de Desempenho Ativado',
      description: 'Otimizações aplicadas para melhorar a performance.',
    });

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-20 right-4 z-40 w-64 animate-pulse border-yellow-500/50 bg-card/90 shadow-lg backdrop-blur-sm">
      <CardContent className="space-y-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fps < 30 ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            ) : (
              <Activity className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium">Performance</span>
          </div>
          <span className="font-code text-xs">{fps} FPS</span>
        </div>

        <Progress value={(fps / 60) * 100} className="h-1.5" />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Dispositivo {isLowPerformance ? 'de baixo desempenho' : 'normal'}</span>
        </div>

        <Button
          size="sm"
          className="h-8 w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-xs"
          onClick={handleOptimize}
        >
          <Zap className="mr-1 h-3 w-3" />
          Otimizar Desempenho
        </Button>
      </CardContent>
    </Card>
  );
}
