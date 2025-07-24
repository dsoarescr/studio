
'use client';

import React from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { SidebarProvider } from '@/components/ui/sidebar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';
import BottomNavBar from '@/components/layout/BottomNavBar';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader />
      <main className="flex-1 flex overflow-hidden pt-14 pb-[var(--bottom-nav-height)]">
        <SidebarProvider>
          <div className="relative h-full w-full flex">
            <MapSidebar />
            <div className="flex-1 h-full relative">
              <PixelGrid />
            </div>
            <PerformanceMonitor />
          </div>
        </SidebarProvider>
      </main>
      <BottomNavBar />
    </div>
  );
}
