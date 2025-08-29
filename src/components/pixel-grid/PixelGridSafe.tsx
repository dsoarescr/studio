'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PortugalMapSvg, { type MapData } from './PortugalMapSvg';

export default function PixelGridSafe() {
  const [isClient, setIsClient] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setIsClient(true), []);

  const handleMapDataLoaded = useCallback((data: MapData) => {
    setMapData(data);
  }, []);

  useEffect(() => {
    const canvas = pixelCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !mapData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      // manter transparente; o SVG exibirá o mapa
      ctx.restore();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [mapData]);

  if (!isClient) return null;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* canvas por baixo (transparente) */}
      <canvas ref={pixelCanvasRef} className="pointer-events-none absolute inset-0" />
      {/* SVG por cima para ficar visível */}
      <PortugalMapSvg onMapDataLoaded={handleMapDataLoaded} />
    </div>
  );
}


