
import BottomNavBar from '@/components/layout/BottomNavBar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <UserProfileHeader /> 
      <main className="h-[calc(100%-var(--header-height)-var(--bottom-nav-height))]">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
