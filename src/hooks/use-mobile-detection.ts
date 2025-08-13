import { useState, useEffect } from 'react';

interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: {
    width: number;
    height: number;
  };
  deviceType: 'phone' | 'tablet' | 'desktop';
  hasTouch: boolean;
  platform: string;
}

export function useMobileDetection(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    screenSize: { width: 1920, height: 1080 },
    deviceType: 'desktop',
    hasTouch: false,
    platform: 'unknown'
  });

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /(iPad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent) || 
                      (width >= 768 && width <= 1024);
      const isDesktop = !isMobile && !isTablet;
      
      const orientation = height > width ? 'portrait' : 'landscape';
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      let deviceType: 'phone' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile && width < 768) deviceType = 'phone';
      else if (isTablet) deviceType = 'tablet';
      
      let platform = 'unknown';
      if (/iPhone|iPad|iPod/i.test(userAgent)) platform = 'ios';
      else if (/Android/i.test(userAgent)) platform = 'android';
      else if (/Windows/i.test(userAgent)) platform = 'windows';
      else if (/Mac/i.test(userAgent)) platform = 'mac';
      else if (/Linux/i.test(userAgent)) platform = 'linux';

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenSize: { width, height },
        deviceType,
        hasTouch,
        platform
      });
    };

    updateMobileInfo();
    
    window.addEventListener('resize', updateMobileInfo);
    window.addEventListener('orientationchange', updateMobileInfo);
    
    return () => {
      window.removeEventListener('resize', updateMobileInfo);
      window.removeEventListener('orientationchange', updateMobileInfo);
    };
  }, []);

  return mobileInfo;
}

// Hook for responsive breakpoints
export function useResponsiveBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 475) setBreakpoint('xs');
      else if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Hook for safe area insets (iPhone notch, etc.)
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement);
      
      setInsets({
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0')
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}