// src/app/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// This is a temporary loading/splash screen page.
// It will redirect to the main content page after a short delay.
export default function WelcomePage() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/member'); // Redirect to the main page after a delay
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-gradient-gold mb-4">
          Pixel Universe
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A carregar o seu universo de píxeis...
        </p>
        <div className="relative w-48 h-48 mx-auto">
          {/* You can add a logo or an animation here */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 border-2 border-accent/20 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
      </div>
    </div>
  );
}
