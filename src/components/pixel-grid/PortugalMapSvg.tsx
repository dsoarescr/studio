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
      // Create a simplified map of Portugal for demonstration
      const pathStrings = [
        // Simplified outline of Portugal
        "M 2000 5000 L 8000 5000 L 8000 20000 L 2000 20000 Z",
        "M 3000 6000 L 7000 6000 L 7000 19000 L 3000 19000 Z",
        // Add more paths for different regions
      ];

      const districtMapping: Record<string, string> = {
        // Map pixel coordinates to districts
        '579,358': 'Lisboa',
        '640,260': 'Porto',
        '706,962': 'Faro',
        // Add more mappings as needed
      };

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
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified Portugal outline */}
      <path
        d="M 2000 5000 L 8000 5000 L 8000 20000 L 2000 20000 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M 3000 6000 L 7000 6000 L 7000 19000 L 3000 19000 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}