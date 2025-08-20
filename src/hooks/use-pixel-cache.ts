import { useState, useRef, useCallback, useMemo } from 'react';

interface PixelData {
  x: number;
  y: number;
  color: string;
  ownerId?: string;
  title?: string;
  pixelImageUrl?: string;
  lastUpdated: number;
}

interface CacheEntry {
  data: PixelData;
  accessCount: number;
  lastAccessed: number;
}

export const usePixelCache = (maxSize: number = CACHE_SIZE) => {
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);

  const getCacheKey = useCallback((x: number, y: number) => `${x},${y}`, []);

  const get = useCallback((x: number, y: number): PixelData | null => {
    const key = getCacheKey(x, y);
    const entry = cache.current.get(key);
    
    if (entry) {
      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      setHitCount(prev => prev + 1);
      return entry.data;
    }
    
    setMissCount(prev => prev + 1);
    return null;
  }, [getCacheKey]);

  const set = useCallback((x: number, y: number, data: Omit<PixelData, 'lastUpdated'>) => {
    const key = getCacheKey(x, y);
    
    // If cache is full, remove least recently used entry
    if (cache.current.size >= maxSize) {
      let oldestKey = '';
      let oldestTime = Date.now();
      
      for (const [k, entry] of cache.current.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestKey = k;
        }
      }
      
      if (oldestKey) {
        cache.current.delete(oldestKey);
      }
    }
    
    cache.current.set(key, {
      data: { ...data, lastUpdated: Date.now() },
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }, [getCacheKey, maxSize]);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const getStats = useMemo(() => ({
    size: cache.current.size,
    hitCount,
    missCount,
    hitRate: hitCount + missCount > 0 ? hitCount / (hitCount + missCount) : 0
  }), [hitCount, missCount]);

  return {
    get,
    set,
    clear,
    stats: getStats
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const [renderTime, setRenderTime] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  const measureRender = useCallback((renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    setRenderTime(end - start);
  }, []);

  const updateFPS = useCallback(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  }, []);

  return {
    fps,
    renderTime,
    measureRender,
    updateFPS
  };
};

// Virtualization hook for large datasets
export const useVirtualization = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      style: {
        position: 'absolute' as const,
        top: (visibleRange.start + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, visibleRange, itemHeight]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    setScrollTop
  };
};
