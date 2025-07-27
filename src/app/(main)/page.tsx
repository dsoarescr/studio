import PixelGrid from '@/components/pixel-grid/PixelGrid';
import { SidebarInset } from '@/components/ui/sidebar';
import MapSidebar from '@/components/layout/MapSidebar';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Grid3X3 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-xl">
        <CardContent className="p-8 text-center space-y-4">
          <div className="relative">
            <Grid3X3 className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Grid3X3 className="h-16 w-16 text-primary/50 mx-auto" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-headline text-primary text-gradient-gold">Carregando Pixel Universe</h2>
            <p className="text-sm text-muted-foreground">Preparando o mapa interativo de Portugal...</p>
            <div className="flex items-center justify-center space-x-1 mt-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground loading-dots">Carregando</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
        <div className="min-h-full">
          <MapSidebar />
          <SidebarInset>
            <Suspense fallback={<LoadingScreen />}>
              <PixelGrid />
            </Suspense>
          </SidebarInset>
        </div>
    </>
  );
}
