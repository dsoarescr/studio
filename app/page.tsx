
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(main)');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">A redirecionar...</h1>
        <p className="text-muted-foreground">A ser redirecionado para a página principal.</p>
      </div>
    </div>
  );
}
