'use client';

import React, { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store';

export type HapticPattern =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

interface HapticFeedbackProps {
  pattern: HapticPattern;
  trigger: boolean;
  onComplete?: () => void;
}

const hapticPatterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 50,
  heavy: 100,
  success: [50, 50, 100],
  warning: [100, 50, 100, 50, 100],
  error: [200, 100, 200],
  selection: 25,
};

export function HapticFeedback({ pattern, trigger, onComplete }: HapticFeedbackProps) {
  const { soundEffects } = useSettingsStore(); // Usar a mesma configuração dos sons

  useEffect(() => {
    if (trigger && soundEffects && 'vibrate' in navigator) {
      const vibrationPattern = hapticPatterns[pattern];
      navigator.vibrate(vibrationPattern);
      onComplete?.();
    }
  }, [trigger, pattern, soundEffects, onComplete]);

  return null;
}

// Hook para feedback háptico
export function useHapticFeedback() {
  const { soundEffects } = useSettingsStore();

  const vibrate = (pattern: HapticPattern) => {
    if (soundEffects && 'vibrate' in navigator) {
      const vibrationPattern = hapticPatterns[pattern];
      navigator.vibrate(vibrationPattern);
    }
  };

  return { vibrate };
}

// Componente para botões com feedback háptico
interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hapticPattern?: HapticPattern;
  children: React.ReactNode;
}

export function HapticButton({
  hapticPattern = 'light',
  children,
  onClick,
  ...props
}: HapticButtonProps) {
  const { vibrate } = useHapticFeedback();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    vibrate(hapticPattern);
    onClick?.(e);
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}
