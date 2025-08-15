
'use client';

import BottomNavBar from '@/components/layout/BottomNavBar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5 transition-colors duration-300">
      <UserProfileHeader /> 
      <main className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
}
