import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/lib/store';

interface SoundEffectProps {
  src: string;
  play: boolean;
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
  rate?: number;
}

export function SoundEffect({ 
  src, 
  play, 
  volume = 0.5, 
  loop = false, 
  onEnd,
  rate = 1.0
}: SoundEffectProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { soundEffects } = useSettingsStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.preload = 'auto';

      // Add error handling for missing audio files
      audioRef.current.addEventListener('error', (e) => {
        console.warn(`Audio file not found or cannot be loaded: ${src}`);
      });
    }

    // Update properties on every render where they might change
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;
    if ('playbackRate' in audioRef.current) {
        audioRef.current.playbackRate = rate;
    }

    const currentAudio = audioRef.current; // Capture for cleanup

    if (onEnd) {
      currentAudio.addEventListener('ended', onEnd);
    } 

    return () => {
      if (onEnd) {
        currentAudio.removeEventListener('ended', onEnd);
      }
    };
  }, [src, volume, loop, onEnd, rate]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (play && soundEffects) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play(); 

      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Silently handle audio play errors (common in browsers with autoplay restrictions)
          console.warn('Audio play prevented by browser policy or missing file:', src);
        });
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [play, soundEffects]);

  return null;
}

// Predefined sound effects
export const SOUND_EFFECTS = {
  PURCHASE: '/sounds/purchase.mp3',
  ACHIEVEMENT: '/sounds/achievement.mp3',
  NOTIFICATION: '/sounds/notification.mp3',
  CLICK: '/sounds/click.mp3', 
  ERROR: '/sounds/error.mp3',
  SUCCESS: '/sounds/success.mp3', 
  HOVER: '/sounds/click.mp3',
  DRAW: '/sounds/click.mp3',
  ERASE: '/sounds/error.mp3',
  COMPLETE: '/sounds/achievement.mp3',
};