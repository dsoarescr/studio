'use client';

import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export function Confetti({ active, duration = 3000, onComplete }: ConfettiProps) {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (active) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  if (!isActive || windowDimensions.width === 0) {
    return null;
  }

  return (
    <ReactConfetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  );
}