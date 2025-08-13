'use client';

// Service Worker registration and management
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
  }

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              this.showUpdateNotification();
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const result = await this.registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  async update(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('Service Worker update check completed');
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  async skipWaiting(): Promise<void> {
    if (!this.registration?.waiting) return;

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  private showUpdateNotification(): void {
    // This would integrate with your toast system
    if (typeof window !== 'undefined' && 'toast' in window) {
      (window as any).toast({
        title: 'Atualização Disponível',
        description: 'Uma nova versão do Pixel Universe está disponível.',
        action: {
          label: 'Atualizar',
          onClick: () => {
            this.skipWaiting();
            window.location.reload();
          }
        },
        duration: 10000,
      });
    }
  }

  // Cache pixel data for offline use
  async cachePixelData(pixels: any[]): Promise<void> {
    if (!this.registration) return;

    this.registration.active?.postMessage({
      type: 'CACHE_PIXEL_DATA',
      pixels
    });
  }

  // Check if app is running in standalone mode (PWA)
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Get cache usage information
  async getCacheUsage(): Promise<{ used: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      } catch (error) {
        console.error('Failed to get cache usage:', error);
      }
    }
    return null;
  }

  // Clear all caches
  async clearCaches(): Promise<boolean> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('pixel-universe-'))
          .map(name => caches.delete(name))
      );
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear caches:', error);
      return false;
    }
  }
}

// Initialize service worker
export async function initializeServiceWorker(): Promise<ServiceWorkerManager> {
  const swManager = ServiceWorkerManager.getInstance();
  
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    await swManager.register();
  }
  
  return swManager;
}

// Hook for using service worker in components
export function useServiceWorker() {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [cacheUsage, setCacheUsage] = React.useState<{ used: number; quota: number } | null>(null);

  React.useEffect(() => {
    const swManager = ServiceWorkerManager.getInstance();
    setIsSupported('serviceWorker' in navigator);
    
    if (swManager) {
      swManager.register().then(setIsRegistered);
      swManager.getCacheUsage().then(setCacheUsage);
    }
  }, []);

  const clearCache = async () => {
    const swManager = ServiceWorkerManager.getInstance();
    return await swManager.clearCaches();
  };

  const updateApp = async () => {
    const swManager = ServiceWorkerManager.getInstance();
    await swManager.skipWaiting();
    window.location.reload();
  };

  return {
    isSupported,
    isRegistered,
    cacheUsage,
    clearCache,
    updateApp,
  };
}