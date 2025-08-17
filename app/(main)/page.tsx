
'use client';

import React from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';

export default function HomePage() {
  return (
    <div className="relative h-full w-full flex">
      <MapSidebar />
      <div className="flex-1 h-full">
        <PixelGrid />
      </div>
    </div>
  );
}
