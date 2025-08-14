'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function PixelGrid() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background to-primary/5 flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">🗺️</span>
          </div>
          <h2 className="text-2xl font-headline font-bold mb-4 text-gradient-gold">
            Mapa de Portugal
          </h2>
          <p className="text-muted-foreground mb-6">
            O mapa interativo de pixels está a ser carregado...
          </p>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            A carregar dados do mapa...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}