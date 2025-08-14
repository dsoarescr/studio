'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Filter, Layers, Compass } from 'lucide-react';

export default function MapSidebar() {
  return (
    <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-border/50 p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <MapPin className="h-5 w-5 mr-2" />
            Explorador de Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Search className="h-4 w-4 mr-2" />
            Pesquisar Localização
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Layers className="h-4 w-4 mr-2" />
            Camadas
          </Button>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Regiões Populares</h3>
            <div className="space-y-1">
              {['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro'].map((region) => (
                <div key={region} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <span className="text-sm">{region}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.floor(Math.random() * 100) + 50}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}