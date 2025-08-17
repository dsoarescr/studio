'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettingsStore } from '@/lib/store';
import { Monitor, Zap, Eye, EyeOff } from 'lucide-react';

interface PerformanceStats {
  fps: number;
  memory: number;
  renderTime: number;
}

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    memory: 0,
    renderTime: 0,
  });
  const { performanceMode, togglePerformanceMode } = useSettingsStore();

  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      // Mock performance stats - in a real app, you'd measure actual performance
      setStats({
        fps: Math.floor(Math.random() * 10) + 55, // 55-65 FPS
        memory: Math.floor(Math.random() * 50) + 100, // 100-150 MB
        renderTime: Math.random() * 5 + 10, // 10-15ms
      });
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsVisible(true)}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-64 bg-background/90 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold flex items-center">
            <Monitor className="h-4 w-4 mr-2" />
            Performance
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>FPS:</span>
            <Badge variant={stats.fps > 50 ? 'default' : 'destructive'}>
              {stats.fps}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="font-mono">{stats.memory}MB</span>
          </div>
          <div className="flex justify-between">
            <span>Render:</span>
            <span className="font-mono">{stats.renderTime.toFixed(1)}ms</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={togglePerformanceMode}
        >
          <Zap className="h-3 w-3 mr-1" />
          {performanceMode ? 'Disable' : 'Enable'} Performance Mode
        </Button>
      </CardContent>
    </Card>
  );
}