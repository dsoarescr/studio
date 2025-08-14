'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Activity, Cpu, Zap } from 'lucide-react';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 10) + 55);
      setMemory(Math.floor(Math.random() * 20) + 40);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-40">
      <Card className="p-3 bg-card/80 backdrop-blur-sm">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3" />
            <span>FPS: {fps}</span>
            <Badge variant={fps > 50 ? 'default' : 'destructive'} className="text-xs">
              {fps > 50 ? 'Bom' : 'Baixo'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-3 w-3" />
            <span>Mem: {memory}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}