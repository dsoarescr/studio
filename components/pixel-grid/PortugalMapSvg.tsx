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
      // Simple mock Portugal outline
      const pathStrings = [
        "M100,100 L200,100 L200,300 L100,300 Z", // Mock path for demonstration
      ];

      const mapData: MapData = {
        svgElement: svgRef.current,
        pathStrings,
        districtMapping: {
          "100,100": "Lisboa",
          "150,150": "Porto",
          "120,200": "Coimbra"
        }
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
      {/* Simplified Portugal outline for demonstration */}
      <path
        d="M2000,2000 L8000,2000 L8000,20000 L2000,20000 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="50"
      />
    </svg>
  );
}