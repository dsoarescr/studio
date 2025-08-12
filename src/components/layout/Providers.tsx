'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { StripeProvider } from '@/components/payment/StripePaymentProvider';
import { Toaster } from "@/components/ui/toaster";
import { OfflineIndicator } from '@/components/ui/offline-indicator';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StripeProvider>
        {children}
        <OfflineIndicator />
        <Toaster />
      </StripeProvider>
    </AuthProvider>
  );
}
