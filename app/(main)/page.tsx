
// src/app/(main)/page.tsx
'use client';

import React from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="relative w-full h-full flex">
        <MapSidebar />
        <div className="flex-1 h-full">
          <PixelGrid />
        </div>
      </div>
    </SidebarProvider>
  );
}
