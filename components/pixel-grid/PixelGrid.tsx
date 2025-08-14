'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react';

export default function PixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    const gridSize = 20 * zoom;
    const offsetX = pan.x % gridSize;
    const offsetY = pan.y % gridSize;

    for (let x = offsetX; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = offsetY; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw some sample pixels
    ctx.fillStyle = '#D4A757';
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() * canvas.width / gridSize | 0) * gridSize + offsetX;
      const y = (Math.random() * canvas.height / gridSize | 0) * gridSize + offsetY;
      ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
    }
  }, [zoom, pan]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full bg-background">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Info */}
      <div className="absolute top-4 left-4">
        <Card className="p-3 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Zoom: {zoom.toFixed(1)}x</span>
          </div>
        </Card>
      </div>
    </div>
  );
}