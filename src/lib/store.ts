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
  notifications: number;
  isPremium: boolean;
  isVerified: boolean;
  streak: number;
  lastLoginDate: string | null;
  totalSpent: number;
  totalEarned: number;
  favoriteColor: string;
  joinDate: string;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  addSpecialCredits: (amount: number) => void;
  removeSpecialCredits: (amount: number) => void;
  addXp: (amount: number) => void;
  addPixel: () => void;
  removePixel: () => void;
  unlockAchievement: () => void;
  addNotification: () => void;
  clearNotifications: () => void;
  updateStreak: () => void;
  addSpent: (amount: number) => void;
  addEarned: (amount: number) => void;
  setFavoriteColor: (color: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      credits: 12500,
      specialCredits: 120,
      level: 8,
      xp: 2450,
      xpMax: 3000,
      pixels: 42,
      achievements: 5,
      notifications: 3,
      isPremium: true,
      isVerified: true,
      streak: 15,
      lastLoginDate: new Date().toISOString().split('T')[0],
      totalSpent: 1250,
      totalEarned: 890,
      favoriteColor: '#D4A757',
      joinDate: '2024-01-15',
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      removeCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
      addSpecialCredits: (amount) => set((state) => ({ specialCredits: state.specialCredits + amount })),
      removeSpecialCredits: (amount) => set((state) => ({ specialCredits: Math.max(0, state.specialCredits - amount) })),
      removeSpecialCredits: (amount) => set((state) => ({ specialCredits: Math.max(0, state.specialCredits - amount) })),
      addXp: (amount) => {
        set((state) => {
          let newXp = state.xp + amount;
          let newLevel = state.level;
          let newXpMax = state.xpMax;
          
          // Level up logic
          while (newXp >= newXpMax) {
            newXp -= newXpMax;
            newLevel++;
            newXpMax = Math.floor(newXpMax * 1.2); // 20% increase per level
          }
          
          return {
            xp: newXp,
            level: newLevel,
            xpMax: newXpMax
          };
        });
      },
      addPixel: () => set((state) => ({ pixels: state.pixels + 1 })),
      removePixel: () => set((state) => ({ pixels: Math.max(0, state.pixels - 1) })),
      unlockAchievement: () => set((state) => ({ achievements: state.achievements + 1 })),
      addNotification: () => set((state) => ({ notifications: state.notifications + 1 })),
      clearNotifications: () => set({ notifications: 0 }),
      updateStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = state.lastLoginDate;
        
        if (!lastLogin) {
          return { streak: 1, lastLoginDate: today };
        }
        
        const lastLoginDate = new Date(lastLogin);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastLoginDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          return { streak: state.streak + 1, lastLoginDate: today };
        } else if (diffDays > 1) {
          // Streak broken
          return { streak: 1, lastLoginDate: today };
        }
        
        // Same day, no change
        return state;
      }),
      addSpent: (amount) => set((state) => ({ totalSpent: state.totalSpent + amount })),
      addEarned: (amount) => set((state) => ({ totalEarned: state.totalEarned + amount })),
      setFavoriteColor: (color) => set({ favoriteColor: color }),
    }),
    {
      name: 'pixel-universe-user-storage',
    }
  )
);

interface PixelState {
  soldPixels: Array<{
    x: number;
    y: number;
    color: string;
    ownerId?: string;
    title?: string;
    pixelImageUrl?: string;
  }>;
  addSoldPixel: (pixel: { x: number; y: number; color: string; ownerId?: string; title?: string; pixelImageUrl?: string }) => void;
  updatePixelColor: (x: number, y: number, color: string) => void;
  loadSoldPixels: () => Array<{
    x: number;
    y: number;
    color: string;
    ownerId?: string;
    title?: string;
    pixelImageUrl?: string;
  }>;
  removeSoldPixel: (x: number, y: number) => void;
}

export const usePixelStore = create<PixelState>()(
  persist(
    (set, get) => ({
      soldPixels: [
        { x: 579, y: 358, color: 'hsl(var(--accent))', title: 'Pixel especial LIS', ownerId: 'user123' },
        { x: 640, y: 260, color: 'magenta', title: 'Pixel especial POR', ownerId: 'currentUserPixelMaster', pixelImageUrl: 'https://placehold.co/1x1.png' },
        { x: 706, y: 962, color: 'cyan', title: 'Pixel especial FAR', ownerId: 'user456' },
      ],
      addSoldPixel: (pixel) => set((state) => ({ 
        soldPixels: [...state.soldPixels, pixel] 
      })),
      updatePixelColor: (x, y, color) => set((state) => ({
        soldPixels: state.soldPixels.map(pixel => 
          pixel.x === x && pixel.y === y 
            ? { ...pixel, color } 
            : pixel
        )
      })),
      loadSoldPixels: () => {
        return get().soldPixels;
      },
      removeSoldPixel: (x, y) => set((state) => ({
        soldPixels: state.soldPixels.filter(pixel => !(pixel.x === x && pixel.y === y))
      })),
    }),
    {
      name: 'pixel-universe-pixel-storage',
    }
  )
);

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  language: 'pt-PT' | 'en-US' | 'es-ES';
  performanceMode: boolean;
  animations: boolean;
  notifications: boolean;
  soundEffects: boolean;
  highQualityRendering: boolean;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setLanguage: (language: 'pt-PT' | 'en-US' | 'es-ES') => void;
  togglePerformanceMode: () => void;
  toggleAnimations: () => void;
  toggleNotifications: () => void;
  toggleSoundEffects: () => void;
  toggleHighQualityRendering: () => void;
  autoSave: boolean;
  reducedMotion: boolean;
  fontSize: number;
  contrast: number;
  toggleAutoSave: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: number) => void;
  setContrast: (contrast: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'pt-PT',
      performanceMode: false,
      animations: true,
      notifications: true,
      soundEffects: true,
      highQualityRendering: true,
      autoSave: true,
      reducedMotion: false,
      fontSize: 100,
      contrast: 100,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      togglePerformanceMode: () => set((state) => {
        const newMode = !state.performanceMode;
        // If enabling performance mode, also disable some visual effects
        if (newMode) {
          return { 
            performanceMode: true, 
            animations: false, 
            highQualityRendering: false 
          };
        }
        return { performanceMode: false };
      }),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
      toggleHighQualityRendering: () => set((state) => ({ highQualityRendering: !state.highQualityRendering })),
      toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      setFontSize: (size) => set({ fontSize: size }),
      setContrast: (contrast) => set({ contrast }),
    }),
    {
      name: 'pixel-universe-settings-storage',
    }
  )
);

interface AppState {
  isOnline: boolean;
  lastSync: string | null;
  pendingActions: Array<{
    id: string;
    type: string;
    data: any;
    timestamp: string;
  }>;
  setOnlineStatus: (status: boolean) => void;
  updateLastSync: () => void;
  addPendingAction: (action: { type: string; data: any }) => void;
  clearPendingActions: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      lastSync: null,
      pendingActions: [],
      setOnlineStatus: (status) => set({ isOnline: status }),
      updateLastSync: () => set({ lastSync: new Date().toISOString() }),
      addPendingAction: (action) => set((state) => ({
        pendingActions: [...state.pendingActions, {
          id: Date.now().toString(),
          ...action,
          timestamp: new Date().toISOString()
        }]
      })),
      clearPendingActions: () => set({ pendingActions: [] }),
    }),
    {
      name: 'pixel-universe-app-storage',
    }
  )
);