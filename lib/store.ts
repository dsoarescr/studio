'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  credits: number;
  specialCredits: number;
  level: number;
  xp: number;
  xpMax: number;
  pixels: number;
  achievements: number;
  isPremium: boolean;
  isVerified: boolean;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  addSpecialCredits: (amount: number) => void;
  addXp: (amount: number) => void;
  addPixel: () => void;
  unlockAchievement: () => void;
}

interface SettingsStore {
  theme: 'light' | 'dark' | 'system';
  animations: boolean;
  notifications: boolean;
  soundEffects: boolean;
  highQualityRendering: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleAnimations: () => void;
  toggleNotifications: () => void;
  toggleSoundEffects: () => void;
  toggleHighQualityRendering: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      credits: 2500,
      specialCredits: 150,
      level: 12,
      xp: 2450,
      xpMax: 3000,
      pixels: 8,
      achievements: 15,
      isPremium: true,
      isVerified: true,
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      removeCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
      addSpecialCredits: (amount) => set((state) => ({ specialCredits: state.specialCredits + amount })),
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        if (newXp >= state.xpMax) {
          return {
            xp: newXp - state.xpMax,
            level: state.level + 1,
            xpMax: state.xpMax + 500
          };
        }
        return { xp: newXp };
      }),
      addPixel: () => set((state) => ({ pixels: state.pixels + 1 })),
      unlockAchievement: () => set((state) => ({ achievements: state.achievements + 1 })),
    }),
    {
      name: 'user-store',
    }
  )
);

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      animations: true,
      notifications: true,
      soundEffects: true,
      highQualityRendering: true,
      setTheme: (theme) => set({ theme }),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
      toggleHighQualityRendering: () => set((state) => ({ highQualityRendering: !state.highQualityRendering })),
    }),
    {
      name: 'settings-store',
    }
  )
);