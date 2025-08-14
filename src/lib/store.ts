import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  credits: number;
  specialCredits: number;
  level: number;
  xp: number;
  xpMax: number;
  pixels: number;
  achievements: number;
  isPremium: boolean;
  addCredits: (amount: number) => void;
  addSpecialCredits: (amount: number) => void;
  addXp: (amount: number) => void;
  unlockAchievement: () => void;
}

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  animations: boolean;
  notifications: boolean;
  soundEffects: boolean;
  highQualityRendering: boolean;
  performanceMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleAnimations: () => void;
  toggleNotifications: () => void;
  toggleSoundEffects: () => void;
  toggleHighQualityRendering: () => void;
  togglePerformanceMode: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      credits: 1000,
      specialCredits: 50,
      level: 5,
      xp: 1250,
      xpMax: 2000,
      pixels: 12,
      achievements: 3,
      isPremium: false,
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      addSpecialCredits: (amount) => set((state) => ({ specialCredits: state.specialCredits + amount })),
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        if (newXp >= state.xpMax) {
          return {
            xp: newXp - state.xpMax,
            level: state.level + 1,
            xpMax: state.xpMax + 500,
          };
        }
        return { xp: newXp };
      }),
      unlockAchievement: () => set((state) => ({ achievements: state.achievements + 1 })),
    }),
    {
      name: 'user-storage',
    }
  )
);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      animations: true,
      notifications: true,
      soundEffects: true,
      highQualityRendering: true,
      performanceMode: false,
      setTheme: (theme) => set({ theme }),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
      toggleHighQualityRendering: () => set((state) => ({ highQualityRendering: !state.highQualityRendering })),
      togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode })),
    }),
    {
      name: 'settings-storage',
    }
  )
);