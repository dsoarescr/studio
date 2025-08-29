// src/app/(main)/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PixelGrid = dynamic(() => import('@/components/pixel-grid/PixelGrid'), {
  ssr: false,
  loading: () => <div className="p-6 text-sm text-muted-foreground">A carregar mapa…</div>,
});

export default function HomePage() {
  return (
    <div className="relative h-full w-full p-6">
      <PixelGrid />
    </div>
  );
}
