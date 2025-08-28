'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParticleProps {
  color?: string;
  duration?: number;
  spread?: number;
  count?: number;
}

interface ShimmerProps {
  className?: string;
  duration?: number;
  delay?: number;
}

interface PulseProps {
  className?: string;
  duration?: number;
  scale?: number;
}

interface FloatingEffectProps {
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function Particles({
  color = 'currentColor',
  duration = 1000,
  spread = 50,
  count = 20
}: ParticleProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 1,
              scale: 0,
              x: 0,
              y: 0
            }}
            animate={{
              opacity: 0,
              scale: 1,
              x: (Math.random() - 0.5) * spread,
              y: (Math.random() - 0.5) * spread
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut'
            }}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Shimmer({
  className,
  duration = 2000,
  delay = 0
}: ShimmerProps) {
  return (
    <motion.div
      className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
        className
      )}
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
}

export function Pulse({
  className,
  duration = 2000,
  scale = 1.05
}: PulseProps) {
  return (
    <motion.div
      className={cn("absolute inset-0", className)}
      animate={{
        scale: [1, scale, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

export function FloatingEffect({
  className,
  amplitude = 10,
  duration = 3000
}: FloatingEffectProps) {
  return (
    <motion.div
      className={cn("", className)}
      animate={{
        y: [-amplitude, amplitude]
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    />
  );
}

interface GlowEffectProps {
  className?: string;
  color?: string;
  intensity?: number;
  duration?: number;
}

export function GlowEffect({
  className,
  color = 'primary',
  intensity = 20,
  duration = 2000
}: GlowEffectProps) {
  return (
    <motion.div
      className={cn(
        `absolute inset-0 rounded-full bg-${color}`,
        className
      )}
      animate={{
        boxShadow: [
          `0 0 ${intensity}px ${intensity/2}px var(--${color})`,
          `0 0 ${intensity*1.5}px ${intensity}px var(--${color})`,
          `0 0 ${intensity}px ${intensity/2}px var(--${color})`
        ]
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

interface PopEffectProps {
  className?: string;
  scale?: number;
  duration?: number;
}

export function PopEffect({
  className,
  scale = 1.1,
  duration = 200
}: PopEffectProps) {
  return (
    <motion.div
      className={cn("", className)}
      whileHover={{
        scale: scale,
        transition: {
          duration: duration / 1000,
          ease: 'easeOut'
        }
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.1,
          ease: 'easeOut'
        }
      }}
    />
  );
}

interface WaveEffectProps {
  className?: string;
  amplitude?: number;
  frequency?: number;
  duration?: number;
}

export function WaveEffect({
  className,
  amplitude = 20,
  frequency = 4,
  duration = 2000
}: WaveEffectProps) {
  return (
    <motion.div
      className={cn("", className)}
      animate={{
        y: Array.from({ length: frequency + 1 }).map((_, i) =>
          i % 2 === 0 ? amplitude : -amplitude
        )
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

interface SparkleEffectProps {
  className?: string;
  color?: string;
  size?: number;
  count?: number;
  duration?: number;
}

export function SparkleEffect({
  className,
  color = 'currentColor',
  size = 4,
  count = 3,
  duration = 1500
}: SparkleEffectProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            left: `${(100 / count) * (i + 0.5)}%`,
            top: '50%'
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: [-20, 0, 20]
          }}
          transition={{
            duration: duration / 1000,
            delay: (i * duration) / (count * 3000),
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

interface RippleEffectProps {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
}

export function RippleEffect({
  className,
  color = 'currentColor',
  size = 100,
  duration = 1000
}: RippleEffectProps) {
  return (
    <motion.div
      className={cn("absolute rounded-full pointer-events-none", className)}
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        scale: [0, 1],
        opacity: [1, 0]
      }}
      transition={{
        duration: duration / 1000,
        ease: 'easeOut'
      }}
    />
  );
}

interface BouncingEffectProps {
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function BouncingEffect({
  className,
  amplitude = 20,
  duration = 1000
}: BouncingEffectProps) {
  return (
    <motion.div
      className={cn("", className)}
      animate={{
        y: [0, -amplitude, 0],
        scaleY: [1, 0.9, 1],
        scaleX: [1, 1.1, 1]
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

interface RotatingEffectProps {
  className?: string;
  degrees?: number;
  duration?: number;
}

export function RotatingEffect({
  className,
  degrees = 360,
  duration = 3000
}: RotatingEffectProps) {
  return (
    <motion.div
      className={cn("", className)}
      animate={{
        rotate: degrees
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
}

export const VisualEffects = {
  Particles,
  Shimmer,
  Pulse,
  FloatingEffect,
  GlowEffect,
  PopEffect,
  WaveEffect,
  SparkleEffect,
  RippleEffect,
  BouncingEffect,
  RotatingEffect
};

export default VisualEffects;
