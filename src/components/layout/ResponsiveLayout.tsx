'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebarContent?: React.ReactNode;
  navigationContent?: React.ReactNode;
  showSidebar?: boolean;
}

interface BreakpointConfig {
  sidebar: boolean;
  navigation: 'top' | 'bottom' | 'sidebar';
  maxContentWidth: string;
  columns: number;
}

const breakpoints: Record<string, BreakpointConfig> = {
  mobile: {
    sidebar: false,
    navigation: 'bottom',
    maxContentWidth: '100%',
    columns: 1,
  },
  tablet: {
    sidebar: true,
    navigation: 'sidebar',
    maxContentWidth: '768px',
    columns: 2,
  },
  desktop: {
    sidebar: true,
    navigation: 'sidebar',
    maxContentWidth: '1200px',
    columns: 3,
  },
};

export function ResponsiveLayout({
  children,
  className,
  sidebarContent,
  navigationContent,
  showSidebar = true,
}: ResponsiveLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof typeof breakpoints>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobile) setCurrentBreakpoint('mobile');
    else if (isTablet) setCurrentBreakpoint('tablet');
    else setCurrentBreakpoint('desktop');
  }, [isMobile, isTablet]);

  const config = breakpoints[currentBreakpoint];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Layout Principal */}
      <div className="relative flex">
        {/* Sidebar */}
        {showSidebar && config.sidebar && (
          <motion.div
            initial={false}
            animate={{
              width: isSidebarOpen ? '240px' : '0px',
              opacity: isSidebarOpen ? 1 : 0,
            }}
            className="fixed left-0 top-0 h-screen overflow-hidden border-r border-border bg-card"
          >
            <div className="w-60 p-4">{sidebarContent}</div>
          </motion.div>
        )}

        {/* Conteúdo Principal */}
        <motion.main
          className="flex-1"
          animate={{
            marginLeft: showSidebar && config.sidebar && isSidebarOpen ? '240px' : '0px',
          }}
        >
          {/* Navegação Superior */}
          {config.navigation === 'top' && (
            <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
              {navigationContent}
            </div>
          )}

          {/* Container de Conteúdo */}
          <div className="mx-auto px-4" style={{ maxWidth: config.maxContentWidth }}>
            <div
              className={cn(
                'grid gap-4',
                config.columns === 1
                  ? 'grid-cols-1'
                  : config.columns === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              )}
            >
              {children}
            </div>
          </div>

          {/* Navegação Inferior */}
          {config.navigation === 'bottom' && (
            <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/80 backdrop-blur-sm">
              {navigationContent}
            </div>
          )}
        </motion.main>

        {/* Botão Toggle Sidebar */}
        {showSidebar && config.sidebar && (
          <button
            onClick={toggleSidebar}
            className="fixed left-4 top-4 z-20 rounded-full bg-primary p-2 text-primary-foreground shadow-lg"
          >
            <motion.div
              animate={{ rotate: isSidebarOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isSidebarOpen ? '←' : '→'}
            </motion.div>
          </button>
        )}
      </div>
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
}

export function ResponsiveGrid({
  children,
  className,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  gap = 4,
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        `grid-cols-${columns.mobile}`,
        `md:grid-cols-${columns.tablet}`,
        `lg:grid-cols-${columns.desktop}`,
        className
      )}
      style={{ gap: `${gap * 0.25}rem` }}
    >
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: number;
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = '1200px',
  padding = 4,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full', className)}
      style={{
        maxWidth,
        padding: `0 ${padding * 0.25}rem`,
      }}
    >
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile?: 'row' | 'column';
    tablet?: 'row' | 'column';
    desktop?: 'row' | 'column';
  };
  spacing?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function ResponsiveStack({
  children,
  className,
  direction = {
    mobile: 'column',
    tablet: 'row',
    desktop: 'row',
  },
  spacing = 4,
  align = 'stretch',
  justify = 'start',
}: ResponsiveStackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction.mobile === 'column' ? 'flex-col' : 'flex-row',
        `md:flex-${direction.tablet}`,
        `lg:flex-${direction.desktop}`,
        `items-${align}`,
        `justify-${justify}`,
        `gap-${spacing}`,
        className
      )}
    >
      {children}
    </div>
  );
}

export const ResponsiveComponents = {
  Layout: ResponsiveLayout,
  Grid: ResponsiveGrid,
  Container: ResponsiveContainer,
  Stack: ResponsiveStack,
};

export default ResponsiveComponents;
