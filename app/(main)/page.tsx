// src/app/(main)/page.tsx
'use client';

import React from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';

export default function HomePage() {
  return (
    <div className="relative w-full h-full">
      <PixelGrid />
    </div>
  );
}
