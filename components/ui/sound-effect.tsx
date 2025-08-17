'use client';

import React, { useEffect, useRef } from 'react';

export const SOUND_EFFECTS = {
  CLICK: '/sounds/click.mp3',
  SUCCESS: '/sounds/success.mp3',
  ERROR: '/sounds/error.mp3',
  PURCHASE: '/sounds/purchase.mp3',
  ACHIEVEMENT: '/sounds/achievement.mp3',
  NOTIFICATION: '/sounds/notification.mp3',
};

interface SoundEffectProps {
  src: string;
  play: boolean;
  volume?: number;
  onEnd?: () => void;
}

export function SoundEffect({ src, play, volume = 0.5, onEnd }: SoundEffectProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    }
  }, [play, volume]);

  return (
    <audio
      ref={audioRef}
      src={src}
      onEnded={onEnd}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}