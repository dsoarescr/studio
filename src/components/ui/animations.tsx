'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

interface SlideProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

interface ScaleProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  scale?: number;
}

interface RotateProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  degrees?: number;
}

export function FadeIn({
  children,
  className,
  duration = 300,
  delay = 0,
  direction,
  distance = 20,
}: FadeInProps) {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn('', className)}
      initial={{
        opacity: 0,
        ...getDirectionOffset(),
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export function Slide({
  children,
  className,
  duration = 300,
  delay = 0,
  direction = 'right',
  distance = 100,
}: SlideProps) {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { x: -distance };
    }
  };

  return (
    <motion.div
      className={cn('', className)}
      initial={getDirectionOffset()}
      animate={{
        x: 0,
        y: 0,
      }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export function Scale({ children, className, duration = 300, delay = 0, scale = 0.8 }: ScaleProps) {
  return (
    <motion.div
      className={cn('', className)}
      initial={{
        scale: scale,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export function Rotate({
  children,
  className,
  duration = 300,
  delay = 0,
  degrees = 180,
}: RotateProps) {
  return (
    <motion.div
      className={cn('', className)}
      initial={{
        rotate: degrees,
        opacity: 0,
      }}
      animate={{
        rotate: 0,
        opacity: 1,
      }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  initialDelay = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={cn('', className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            delayChildren: initialDelay / 1000,
            staggerChildren: staggerDelay / 1000,
          },
        },
      }}
    >
      {React.Children.map(children, child => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={cn('', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function ListItem({ children, className, index = 0 }: ListItemProps) {
  return (
    <motion.div
      className={cn('', className)}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AnimatedButton({ children, className, onClick, disabled }: AnimatedButtonProps) {
  return (
    <motion.button
      className={cn('', className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.button>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({ children, className, onClick }: AnimatedCardProps) {
  return (
    <motion.div
      className={cn('', className)}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export const Animations = {
  FadeIn,
  Slide,
  Scale,
  Rotate,
  StaggerContainer,
  PageTransition,
  ListItem,
  AnimatedButton,
  AnimatedCard,
};

export default Animations;
