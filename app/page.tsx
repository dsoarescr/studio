
'use client';
import React from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';

export default function HomePage() {
  return (
    <div className="flex-1 h-full relative flex">
      <MapSidebar />
      <div className="flex-1 h-full relative">
        <PixelGrid />
      </div>
      <PerformanceMonitor />
    </div>
  );
}
