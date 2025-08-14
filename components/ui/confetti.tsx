'use client';

import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export function Confetti({ active, duration = 3000, onComplete }: ConfettiProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (active && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  if (!active) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={200}
      colors={['#D4A757', '#7DF9FF', '#FFD700', '#FF6B6B', '#4ECDC4']}
    />
  );
}