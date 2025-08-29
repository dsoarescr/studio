'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X, Loader2 } from 'lucide-react';

interface FeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
  message: string;
  description?: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onClose?: () => void;
}

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

interface ProgressIndicatorProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  pulse?: boolean;
}

const feedbackIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
  loading: Loader2,
};

const feedbackColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  loading: 'bg-primary',
};

export function Feedback({
  type,
  message,
  description,
  duration = 3000,
  position = 'bottom',
  onClose,
}: FeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = feedbackIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          className={cn(
            'fixed z-50 flex items-center rounded-lg p-4 shadow-lg',
            position === 'top' ? 'top-4' : 'bottom-4',
            'left-1/2 -translate-x-1/2 transform',
            feedbackColors[type],
            'text-white'
          )}
        >
          <Icon className="mr-2 h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">{message}</p>
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="ml-4 hover:opacity-80"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LoadingIndicator({ size = 'md', className, message }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Loader2 className={cn('text-primary', sizeClasses[size])} />
      </motion.div>
      {message && <span className="text-muted-foreground">{message}</span>}
    </div>
  );
}

export function ProgressIndicator({
  progress,
  className,
  showPercentage = true,
  size = 'md',
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1 flex justify-between">
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        )}
      </div>
      <div className={cn('w-full overflow-hidden rounded-full bg-muted', sizeClasses[size])}>
        <motion.div
          className="bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

export function StatusBadge({ status, className, pulse = true }: StatusBadgeProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn('h-3 w-3 rounded-full', statusColors[status])} />
      {pulse && (
        <motion.div
          className={cn('absolute inset-0 rounded-full', statusColors[status])}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

interface InteractionFeedbackProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  feedback?: 'ripple' | 'scale' | 'both';
}

export function InteractionFeedback({
  children,
  className,
  onClick,
  feedback = 'both',
}: InteractionFeedbackProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (feedback === 'ripple' || feedback === 'both') {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id));
      }, 1000);
    }

    onClick?.();
  };

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
      whileHover={feedback === 'scale' || feedback === 'both' ? { scale: 1.02 } : undefined}
      whileTap={feedback === 'scale' || feedback === 'both' ? { scale: 0.98 } : undefined}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{
              x: ripple.x,
              y: ripple.y,
              scale: 0,
              opacity: 0.5,
            }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

interface SuccessAnimationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

export function SuccessAnimation({ className, size = 'md', onComplete }: SuccessAnimationProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <motion.div
      className={cn('text-green-500', className)}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 10,
      }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle className={sizeClasses[size]} />
      </motion.div>
    </motion.div>
  );
}

export const FeedbackSystem = {
  Feedback,
  LoadingIndicator,
  ProgressIndicator,
  StatusBadge,
  InteractionFeedback,
  SuccessAnimation,
};

export default FeedbackSystem;
