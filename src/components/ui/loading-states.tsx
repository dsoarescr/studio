'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  Zap,
  Target,
  Crown,
  Gem,
  Star,
  Heart,
  MapPin,
  Palette,
  Trophy,
  Award,
  Users,
  Activity,
  BarChart3,
} from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'muted';
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    muted: 'text-muted-foreground',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && <p className="animate-pulse text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

interface ProgressLoaderProps {
  progress: number;
  text?: string;
  subText?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  className?: string;
}

export function ProgressLoader({
  progress,
  text,
  subText,
  showPercentage = true,
  color = 'primary',
  className = '',
}: ProgressLoaderProps) {
  const colorClasses = {
    primary: '[&>div]:bg-primary',
    accent: '[&>div]:bg-accent',
    success: '[&>div]:bg-green-500',
    warning: '[&>div]:bg-yellow-500',
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {text && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{text}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          )}
        </div>
      )}

      <Progress value={progress} className={`h-2 ${colorClasses[color]}`} />

      {subText && <p className="text-xs text-muted-foreground">{subText}</p>}
    </div>
  );
}

interface PulsingDotsProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'muted';
  className?: string;
}

export function PulsingDots({
  count = 3,
  size = 'md',
  color = 'primary',
  className = '',
}: PulsingDotsProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colorClasses = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    muted: 'bg-muted-foreground',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  showStats?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  showAvatar = false,
  showImage = false,
  showStats = false,
  lines = 3,
  className = '',
}: SkeletonCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showImage && <Skeleton className="h-48 w-full rounded-lg" />}

        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton key={index} className={`h-3 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>

        {showStats && (
          <div className="flex gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AnimatedIconProps {
  icon: React.ReactNode;
  animation?: 'spin' | 'pulse' | 'bounce' | 'float' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export function AnimatedIcon({
  icon,
  animation = 'pulse',
  size = 'md',
  color = 'text-primary',
  className = '',
}: AnimatedIconProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const animationClasses = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    float: 'animate-float',
    glow: 'animate-glow',
  };

  return (
    <div className={`${sizeClasses[size]} ${color} ${animationClasses[animation]} ${className}`}>
      {icon}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  progress?: number;
  children: React.ReactNode;
  blur?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  text,
  progress,
  children,
  blur = true,
  className = '',
}: LoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {children}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 z-50 flex items-center justify-center bg-background/80 ${blur ? 'backdrop-blur-sm' : ''}`}
        >
          <Card className="border-primary/20 p-6 shadow-2xl">
            <CardContent className="flex flex-col items-center gap-4">
              <AnimatedIcon icon={<Sparkles />} animation="glow" size="xl" color="text-primary" />

              {text && <p className="text-center text-lg font-medium">{text}</p>}

              {progress !== undefined && (
                <ProgressLoader progress={progress} showPercentage={true} className="w-64" />
              )}

              <PulsingDots />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// Predefined loading states for common scenarios
export function MapLoadingState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-4">
      <AnimatedIcon icon={<MapPin />} animation="float" size="xl" color="text-primary" />
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Carregando Mapa</h3>
        <p className="text-sm text-muted-foreground">Preparando o universo de pixels...</p>
      </div>
      <PulsingDots />
    </div>
  );
}

export function GalleryLoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} showImage={true} showStats={true} lines={2} />
      ))}
    </div>
  );
}

export function ProfileLoadingState() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2 text-center">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CommunityLoadingState() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard key={index} showAvatar={true} showImage={Math.random() > 0.5} lines={3} />
      ))}
    </div>
  );
}
