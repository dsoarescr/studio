"use client";
// Reativar cabeçalho; manter BottomNavBar desativado por enquanto
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export const dynamic = 'force-dynamic';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="via-background/98 flex h-screen flex-col bg-gradient-to-br from-background to-primary/5 transition-colors duration-300">
      <UserProfileHeader />
      <main className="flex-1 overflow-y-auto pt-14">{children}</main>
    </div>
  );
}
