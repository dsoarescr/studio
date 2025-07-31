
import BottomNavBar from '@/components/layout/BottomNavBar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserProfileHeader />
      <main>
        {children}
      </main>
      <BottomNavBar />
    </>
  );
}
