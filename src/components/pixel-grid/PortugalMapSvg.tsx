'use client';

import React, { useEffect, useRef } from 'react';

export interface MapData {
  svgElement: SVGElement;
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
      // Create a simplified SVG map of Portugal for demo purposes
      const svgElement = svgRef.current;
      
      // Mock path data for Portuguese districts
      const pathStrings = [
        // Simplified paths for demonstration - in real app would be actual SVG paths
        "M100,100 L200,100 L200,200 L100,200 Z", // Lisboa
        "M50,50 L150,50 L150,150 L50,150 Z",     // Porto
        "M150,150 L250,150 L250,250 L150,250 Z", // Coimbra
        "M200,200 L300,200 L300,300 L200,300 Z", // Faro
        "M75,75 L175,75 L175,175 L75,175 Z",     // Braga
      ];

      // Mock district mapping
      const districtMapping: Record<string, string> = {
        "579,358": "Lisboa",
        "640,260": "Porto", 
        "706,962": "Faro",
        "300,200": "Coimbra",
        "400,150": "Braga",
      };

      const mapData: MapData = {
        svgElement,
        pathStrings,
        districtMapping
      };

      onMapDataLoaded(mapData);
    }
  }, [onMapDataLoaded]);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 12969 26674"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'none' }}
    >
      {/* Simplified Portugal outline for demo */}
      <path
        d="M2000,2000 L10000,2000 L10000,24000 L2000,24000 Z"
        fill="currentColor"
        stroke="none"
      />
      
      {/* District boundaries */}
      <g id="districts">
        <path id="lisboa" d="M4000,8000 L6000,8000 L6000,10000 L4000,10000 Z" />
        <path id="porto" d="M3000,4000 L5000,4000 L5000,6000 L3000,6000 Z" />
        <path id="coimbra" d="M3500,6000 L5500,6000 L5500,8000 L3500,8000 Z" />
        <path id="faro" d="M4000,20000 L7000,20000 L7000,22000 L4000,22000 Z" />
        <path id="braga" d="M2500,3000 L4500,3000 L4500,5000 L2500,5000 Z" />
      </g>
    </svg>
  );
}