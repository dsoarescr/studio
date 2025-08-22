'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PremiumSubscription = dynamic(() => import('@/components/features/PremiumSubscription'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-[400px]">Carregando...</div>
});

export default function PremiumPage() {
  return <PremiumSubscription />;
}