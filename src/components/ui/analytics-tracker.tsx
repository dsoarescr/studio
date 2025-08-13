'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadSettings();
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private loadSettings(): void {
    const consent = localStorage.getItem('pixel-universe-analytics-consent');
    this.isEnabled = consent === 'true';
  }

  setConsent(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('pixel-universe-analytics-consent', enabled.toString());
    
    if (!enabled) {
      this.clearEvents();
    }
  }

  track(name: string, properties?: Record<string, any>, userId?: string): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
      userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.sendEvent(event);

    // Keep only last 100 events in memory
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // In production, this would send to your analytics service
      console.log('[Analytics]', event.name, event.properties);
      
      // Store locally for now
      const stored = JSON.parse(localStorage.getItem('pixel-universe-analytics') || '[]');
      stored.push(event);
      
      // Keep only last 1000 events
      if (stored.length > 1000) {
        stored.splice(0, stored.length - 1000);
      }
      
      localStorage.setItem('pixel-universe-analytics', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('pixel-universe-analytics');
  }

  // Predefined tracking methods
  trackPageView(path: string, userId?: string): void {
    this.track('page_view', { path }, userId);
  }

  trackPixelPurchase(pixelId: string, price: number, userId?: string): void {
    this.track('pixel_purchase', { pixelId, price }, userId);
  }

  trackAchievementUnlock(achievementId: string, userId?: string): void {
    this.track('achievement_unlock', { achievementId }, userId);
  }

  trackUserAction(action: string, properties?: Record<string, any>, userId?: string): void {
    this.track('user_action', { action, ...properties }, userId);
  }

  trackError(error: string, context?: string, userId?: string): void {
    this.track('error', { error, context }, userId);
  }

  trackPerformance(metric: string, value: number, userId?: string): void {
    this.track('performance', { metric, value }, userId);
  }

  // Get analytics summary
  getAnalyticsSummary(): {
    totalEvents: number;
    sessionDuration: number;
    topEvents: Array<{ name: string; count: number }>;
    userEngagement: number;
  } {
    const now = Date.now();
    const sessionStart = Math.min(...this.events.map(e => e.timestamp));
    const sessionDuration = now - sessionStart;

    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.name] = (acc[event.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const userEngagement = this.events.length / Math.max(1, sessionDuration / (1000 * 60)); // Events per minute

    return {
      totalEvents: this.events.length,
      sessionDuration,
      topEvents,
      userEngagement,
    };
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { level, credits, pixels } = useUserStore();

  useEffect(() => {
    const analytics = AnalyticsManager.getInstance();
    analytics.trackPageView(pathname, user?.uid);
  }, [pathname, user?.uid]);

  // Track user state changes
  useEffect(() => {
    const analytics = AnalyticsManager.getInstance();
    analytics.track('user_state_update', {
      level,
      credits,
      pixels,
      isPremium: credits > 10000, // Simple premium detection
    }, user?.uid);
  }, [level, credits, pixels, user?.uid]);

  return null; // This component doesn't render anything
}

// Hook for using analytics in components
export function useAnalytics() {
  const analytics = AnalyticsManager.getInstance();
  const { user } = useAuth();

  const track = (name: string, properties?: Record<string, any>) => {
    analytics.track(name, properties, user?.uid);
  };

  const trackPixelPurchase = (pixelId: string, price: number) => {
    analytics.trackPixelPurchase(pixelId, price, user?.uid);
  };

  const trackAchievementUnlock = (achievementId: string) => {
    analytics.trackAchievementUnlock(achievementId, user?.uid);
  };

  const trackUserAction = (action: string, properties?: Record<string, any>) => {
    analytics.trackUserAction(action, properties, user?.uid);
  };

  const trackError = (error: string, context?: string) => {
    analytics.trackError(error, context, user?.uid);
  };

  const trackPerformance = (metric: string, value: number) => {
    analytics.trackPerformance(metric, value, user?.uid);
  };

  return {
    track,
    trackPixelPurchase,
    trackAchievementUnlock,
    trackUserAction,
    trackError,
    trackPerformance,
    getAnalyticsSummary: () => analytics.getAnalyticsSummary(),
    setConsent: (enabled: boolean) => analytics.setConsent(enabled),
  };
}

export { AnalyticsManager };