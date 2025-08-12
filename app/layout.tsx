
// app/layout.tsx
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import Providers from '@/components/layout/Providers';
import UserProfileHeader from '@/components/layout/UserProfileHeader';
import BottomNavBar from '@/components/layout/BottomNavBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#D4A757" />
      </head>
      <body className="font-body antialiased h-full">
        <Providers>
          <div className="flex flex-col h-full">
            <UserProfileHeader /> 
            <main className="flex-1 overflow-y-auto pt-[var(--header-height)] pb-[var(--bottom-nav-height)]">
                {children}
            </main>
            <BottomNavBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
