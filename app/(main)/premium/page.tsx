'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PremiumSubscription = dynamic(() => import('@/components/features/PremiumSubscription'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center">Carregando...</div>
  ),
});

export default function PremiumPage() {
  return <PremiumSubscription />;
}
