'use client';

import React, { useState, useCallback } from 'react';
import BottomNavBar from '@/components/layout/BottomNavBar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  return (
    <div className="via-background/98 flex h-screen flex-col bg-gradient-to-br from-background to-primary/5 transition-colors duration-300">
      <UserProfileHeader />
      <main className="flex-1 overflow-y-auto pb-[var(--bottom-nav-height)] pt-14">{children}</main>
      <BottomNavBar onNavigate={handleNavigate} activeSection={activeSection} />
    </div>
  );
}
