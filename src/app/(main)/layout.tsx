
import { SidebarProvider } from '@/components/ui/sidebar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import UserProfileHeader from '@/components/layout/UserProfileHeader';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5">
            <UserProfileHeader />
            <main className="flex-1 pt-14 pb-[var(--bottom-nav-height)] overflow-y-auto">
                {children}
            </main>
            <BottomNavBar />
        </div>
    </SidebarProvider>
  );
}
