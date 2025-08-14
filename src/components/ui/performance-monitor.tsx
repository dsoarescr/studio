'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, Zap } from 'lucide-react';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(45);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 10) + 55);
      setMemory(Math.floor(Math.random() * 20) + 40);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsVisible(true)}
          className="w-8 h-8 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full flex items-center justify-center hover:bg-card transition-colors"
        >
          <Activity className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Performance</span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                <span className="text-xs">FPS</span>
              </div>
              <Badge variant={fps > 50 ? 'default' : 'destructive'} className="text-xs">
                {fps}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-blue-500" />
                <span className="text-xs">Mem</span>
              </div>
              <Badge variant={memory < 60 ? 'default' : 'destructive'} className="text-xs">
                {memory}MB
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}