'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-destructive/90 backdrop-blur-sm border-destructive">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-destructive-foreground">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Sem ligação à internet</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}