import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User Store
interface UserState {
  credits: number;
  specialCredits: number;
  level: number;
  xp: number;
  xpMax: number;
  pixels: number;
  achievements: number;
  notifications: number;
  isPremium: boolean;
  isVerified: boolean;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  addSpecialCredits: (amount: number) => void;
  addXp: (amount: number) => void;
  addPixel: () => void;
  removePixel: () => void;
  unlockAchievement: () => void;
  addNotification: () => void;
  clearNotifications: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      credits: 12500,
      specialCredits: 120,
      level: 8,
      xp: 2450,
      xpMax: 3000,
      pixels: 42,
      achievements: 5,
      notifications: 3,
      isPremium: false,
      isVerified: false,
      
      addCredits: (amount) => set((state) => ({ 
        credits: state.credits + amount 
      })),
      
      removeCredits: (amount) => set((state) => ({ 
        credits: Math.max(0, state.credits - amount) 
      })),
      
      addSpecialCredits: (amount) => set((state) => ({ 
        specialCredits: state.specialCredits + amount 
      })),
      
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        if (newXp >= state.xpMax) {
          return {
            xp: newXp - state.xpMax,
            level: state.level + 1,
            xpMax: Math.floor(state.xpMax * 1.2)
          };
        }
        return { xp: newXp };
      }),
      
      addPixel: () => set((state) => ({ 
        pixels: state.pixels + 1 
      })),
      
      removePixel: () => set((state) => ({ 
        pixels: Math.max(0, state.pixels - 1) 
      })),
      
      unlockAchievement: () => set((state) => ({ 
        achievements: state.achievements + 1 
      })),
      
      addNotification: () => set((state) => ({ 
        notifications: state.notifications + 1 
      })),
      
      clearNotifications: () => set(() => ({ 
        notifications: 0 
      })),
    }),
    {
      name: 'user-storage',
    }
  )
);

// Settings Store
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

// Pixel Store
interface PixelData {
  x: number;
  y: number;
  color: string;
  owner: string;
  timestamp: number;
}

interface PixelState {
  soldPixels: PixelData[];
  addSoldPixel: (pixel: PixelData) => void;
  updatePixelColor: (x: number, y: number, color: string) => void;
  loadSoldPixels: () => PixelData[];
}

export const usePixelStore = create<PixelState>()(
  persist(
    (set, get) => ({
      soldPixels: [],
      
      addSoldPixel: (pixel) => set((state) => ({
        soldPixels: [...state.soldPixels, pixel]
      })),
      
      updatePixelColor: (x, y, color) => set((state) => ({
        soldPixels: state.soldPixels.map(pixel =>
          pixel.x === x && pixel.y === y
            ? { ...pixel, color, timestamp: Date.now() }
            : pixel
        )
      })),
      
      loadSoldPixels: () => get().soldPixels,
    }),
    {
      name: 'pixel-storage',
    }
  )
);