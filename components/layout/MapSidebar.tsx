'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sidebar, SidebarContent, SidebarHeader } from '../ui/sidebar';
import { Map, Activity, BarChart3, Users, TrendingUp } from 'lucide-react';

export default function MapSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Explorador</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <p>PixelMaster comprou (245, 156)</p>
                <p className="text-muted-foreground">2 min atrás</p>
              </div>
              <div className="text-xs">
                <p>ColorWizard vendeu (123, 89)</p>
                <p className="text-muted-foreground">5 min atrás</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Pixels Vendidos:</span>
                <Badge variant="secondary">2.5K</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Utilizadores Online:</span>
                <Badge className="bg-green-500">1.2K</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}