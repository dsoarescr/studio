
import BottomNavBar from '@/components/layout/BottomNavBar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <UserProfileHeader /> 
      <main className="flex-1 overflow-y-auto pt-14 pb-[var(--bottom-nav-height)]">
          {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
