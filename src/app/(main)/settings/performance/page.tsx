'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/lib/store";
import { Volume2 } from 'lucide-react';

export default function PerformanceSettingsPage() {
  const { 
    highQualityRendering, 
    toggleHighQualityRendering, 
    soundEffects, 
    toggleSoundEffects 
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Desempenho</CardTitle>
          <CardDescription>Ajuste as configurações para otimizar a performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Renderização de Alta Qualidade</Label>
              <p className="text-sm text-muted-foreground">Melhor qualidade visual (requer mais recursos)</p>
            </div>
            <Switch checked={highQualityRendering} onCheckedChange={toggleHighQualityRendering} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Efeitos Sonoros</Label>
              <p className="text-sm text-muted-foreground">Reproduzir sons na interface</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Switch checked={soundEffects} onCheckedChange={toggleSoundEffects} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Carregar Imagens em Baixa Resolução</Label>
              <p className="text-sm text-muted-foreground">Reduzir qualidade das imagens para melhor desempenho</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cache e Armazenamento</CardTitle>
          <CardDescription>Gerencie o armazenamento local da aplicação.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Cache de Dados</h4>
                  <p className="text-sm text-muted-foreground">24.5 MB em uso</p>
                </div>
                <Button variant="outline" size="sm">Limpar</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Dados Offline</h4>
                  <p className="text-sm text-muted-foreground">12.8 MB em uso</p>
                </div>
                <Button variant="outline" size="sm">Limpar</Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
