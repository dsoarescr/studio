import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

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
  // Actions
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
  // Firebase sync
  syncWithFirebase: (userId: string) => Promise<void>;
  loadFromFirebase: (userId: string) => Promise<void>;
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
      isPremium: true,
      isVerified: true,
      streak: 15,
      lastLoginDate: new Date().toISOString().split('T')[0],
      totalSpent: 1250,
      totalEarned: 890,
      favoriteColor: '#D4A757',
      joinDate: '2024-01-15',
      
      addCredits: (amount) => {
        set((state) => ({ credits: state.credits + amount }));
        // Sync with Firebase if user is logged in
        const syncToFirebase = async () => {
          try {
            // This would be called from a component that has access to user ID
            // For now, we'll just update local state
          } catch (error) {
            console.error('Failed to sync credits to Firebase:', error);
          }
        };
      },
      
      removeCredits: (amount) => {
        set((state) => ({ credits: Math.max(0, state.credits - amount) }));
      },
      
      addSpecialCredits: (amount) => {
        set((state) => ({ specialCredits: state.specialCredits + amount }));
      },
      
      removeSpecialCredits: (amount) => {
        set((state) => ({ specialCredits: Math.max(0, state.specialCredits - amount) }));
      },
      
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
            
            // Add bonus credits for leveling up
            const bonusCredits = newLevel * 10;
            setTimeout(() => {
              get().addCredits(bonusCredits);
            }, 0);
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
        } else if (diffDays === 0) {
          // Same day, no change
          return state;
        } else {
          // Streak broken
          return { streak: 1, lastLoginDate: today };
        }
      }),
      
      addSpent: (amount) => set((state) => ({ totalSpent: state.totalSpent + amount })),
      addEarned: (amount) => set((state) => ({ totalEarned: state.totalEarned + amount })),
      setFavoriteColor: (color) => set({ favoriteColor: color }),
      
      syncWithFirebase: async (userId: string) => {
        try {
          if (!db) {
            console.warn('Firebase not available for sync');
            return;
          }
          
          const state = get();
          const userRef = doc(db, 'users', userId);
          
          await updateDoc(userRef, {
            credits: state.credits,
            specialCredits: state.specialCredits,
            level: state.level,
            xp: state.xp,
            xpMax: state.xpMax,
            pixels: state.pixels,
            achievements: state.achievements,
            isPremium: state.isPremium,
            totalSpent: state.totalSpent,
            totalEarned: state.totalEarned,
            favoriteColor: state.favoriteColor,
            streak: state.streak,
            lastLoginDate: state.lastLoginDate,
          });
        } catch (error) {
          console.error('Failed to sync with Firebase:', error);
        }
      },
      
      loadFromFirebase: async (userId: string) => {
        try {
          if (!db) {
            console.warn('Firebase not available for loading');
            return;
          }
          
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            set({
              credits: userData.credits || 500,
              specialCredits: userData.specialCredits || 50,
              level: userData.level || 1,
              xp: userData.xp || 0,
              xpMax: userData.xpMax || 1000,
              pixels: userData.pixels || 0,
              achievements: userData.achievements || 0,
              isPremium: userData.isPremium || false,
              isVerified: userData.isVerified || false,
              totalSpent: userData.totalSpent || 0,
              totalEarned: userData.totalEarned || 0,
              favoriteColor: userData.favoriteColor || '#D4A757',
              streak: userData.streak || 0,
              lastLoginDate: userData.lastLoginDate || null,
              joinDate: userData.createdAt ? new Date(userData.createdAt.toDate()).toISOString().split('T')[0] : '2024-01-15',
            });
          }
        } catch (error) {
          console.error('Failed to load from Firebase:', error);
        }
      },
    }),
    {
      name: 'pixel-universe-user-store',
      partialize: (state) => ({
        credits: state.credits,
        specialCredits: state.specialCredits,
        level: state.level,
        xp: state.xp,
        xpMax: state.xpMax,
        pixels: state.pixels,
        achievements: state.achievements,
        isPremium: state.isPremium,
        isVerified: state.isVerified,
        streak: state.streak,
        lastLoginDate: state.lastLoginDate,
        totalSpent: state.totalSpent,
        totalEarned: state.totalEarned,
        favoriteColor: state.favoriteColor,
        joinDate: state.joinDate,
      }),
    }
  )
);

// Pixel store for managing pixel data
interface PixelState {
  soldPixels: Array<{
    id?: number; // ID contínuo dentro da máscara (opcional enquanto migramos)
    x: number;
    y: number;
    owner: string;
    price: number;
    color: string;
    title?: string;
    description?: string;
    timestamp: Date;
  }>;
  addSoldPixel: (pixel: Omit<PixelState['soldPixels'][0], 'timestamp'>) => void;
  removeSoldPixel: (x: number, y: number) => void;
  getPixelAt: (x: number, y: number) => PixelState['soldPixels'][0] | undefined;
  getPixelById: (id: number) => PixelState['soldPixels'][0] | undefined;
  clearPixels: () => void;
}

export const usePixelStore = create<PixelState>()(
  persist(
    (set, get) => ({
      soldPixels: [],
      
      addSoldPixel: (pixel) => {
        set((state) => ({
          soldPixels: [
            ...state.soldPixels.filter(p => !(p.x === pixel.x && p.y === pixel.y)),
            { ...pixel, timestamp: new Date() }
          ]
        }));
      },
      
      removeSoldPixel: (x, y) => {
        set((state) => ({
          soldPixels: state.soldPixels.filter(p => !(p.x === x && p.y === y))
        }));
      },
      
      getPixelAt: (x, y) => {
        return get().soldPixels.find(p => p.x === x && p.y === y);
      },
      
      getPixelById: (id) => {
        return get().soldPixels.find(p => p.id === id);
      },
      
      clearPixels: () => {
        set({ soldPixels: [] });
      },
    }),
    {
      name: 'pixel-universe-pixel-store',
    }
  )
);

// App store for global app state
interface AppState {
  isOnline: boolean;
  isDarkMode: boolean;
  performanceMode: boolean;
  highQualityRendering: boolean;
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  language: string;
  setIsOnline: (online: boolean) => void;
  toggleDarkMode: () => void;
  togglePerformanceMode: () => void;
  toggleHighQualityRendering: () => void;
  toggleAnimations: () => void;
  toggleSoundEffects: () => void;
  toggleNotifications: () => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: true,
      isDarkMode: false,
      performanceMode: false,
      highQualityRendering: true,
      animations: true,
      soundEffects: true,
      notifications: true,
      language: 'pt-PT',
      
      setIsOnline: (online) => set({ isOnline: online }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode })),
      toggleHighQualityRendering: () => set((state) => ({ highQualityRendering: !state.highQualityRendering })),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'pixel-universe-app-store',
    }
  )
);

// Settings store for user preferences
interface SettingsState {
  performanceMode: boolean;
  highQualityRendering: boolean;
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
  togglePerformanceMode: () => void;
  toggleHighQualityRendering: () => void;
  toggleAnimations: () => void;
  toggleSoundEffects: () => void;
  toggleNotifications: () => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      performanceMode: false,
      highQualityRendering: true,
      animations: true,
      soundEffects: true,
      notifications: true,
      language: 'pt-PT',
      theme: 'system',
      
      togglePerformanceMode: () => set((state) => ({ performanceMode: !state.performanceMode })),
      toggleHighQualityRendering: () => set((state) => ({ highQualityRendering: !state.highQualityRendering })),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme: theme }),
    }),
    {
      name: 'pixel-universe-settings-store',
    }
  )
);