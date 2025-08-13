// src/components/pixel-grid/PortugalMapSvg.tsx
'use client';

import React, { useEffect, useRef } from 'react';

export interface MapData {
  svgElement: SVGSVGElement;
  pathStrings: string[];
  districtMapping?: Record<string, string>;
}

interface PortugalMapSvgProps {
  onMapDataLoaded: (data: MapData) => void;
  className?: string;
}

export default function PortugalMapSvg({ onMapDataLoaded, className }: PortugalMapSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Create a simplified map of Portugal for demo
      const pathStrings = [
        // Simplified outline of Portugal
        "M 2000 5000 L 8000 5000 L 8000 20000 L 2000 20000 Z",
        "M 3000 6000 L 7000 6000 L 7000 18000 L 3000 18000 Z"
      ];

      // Mock district mapping
      const districtMapping: Record<string, string> = {};
      
      // Generate some mock mappings for demonstration
      for (let i = 0; i < 1000; i++) {
        const x = Math.floor(Math.random() * 1273);
        const y = Math.floor(Math.random() * 2000);
        const districts = ['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro', 'Setúbal'];
        districtMapping[`${x},${y}`] = districts[Math.floor(Math.random() * districts.length)];
      }

      const mapData: MapData = {
        svgElement: svgRef.current,
        pathStrings,
        districtMapping
      };

      onMapDataLoaded(mapData);
    }
  }, [onMapDataLoaded]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 12969 26674"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Simplified Portugal outline */}
      <path
        d="M 2000 5000 L 8000 5000 L 8000 20000 L 2000 20000 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M 3000 6000 L 7000 6000 L 7000 18000 L 3000 18000 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}