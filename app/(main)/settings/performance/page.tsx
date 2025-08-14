'use client';

 import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { useSettingsStore } from "../../../lib/store";
import { Volume2, Zap, Eye, Download, Upload } from 'lucide-react';

export default function PerformanceSettingsPage() {
  const { 
    performanceMode, 
    togglePerformanceMode, 
    highQualityRendering, 
    toggleHighQualityRendering,
    soundEffects,
    toggleSoundEffects
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Zap className="h-6 w-6 mr-3 text-primary" />
            Desempenho
          </CardTitle>
          <CardDescription>
            Otimize a performance da aplicação para o seu dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Modo de Desempenho</Label>
                <p className="text-sm text-muted-foreground">
                  Reduz a qualidade visual para uma experiência mais fluida
                </p>
              </div>
              <Switch checked={performanceMode} onCheckedChange={togglePerformanceMode} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Renderização de Alta Qualidade</Label>
                <p className="text-sm text-muted-foreground">
                  Melhor qualidade visual (requer mais recursos)
                </p>
              </div>
              <Switch checked={highQualityRendering} onCheckedChange={toggleHighQualityRendering} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Efeitos Sonoros</Label>
                <p className="text-sm text-muted-foreground">
                  Reproduzir sons na interface
                </p>
              </div>
              <Switch checked={soundEffects} onCheckedChange={toggleSoundEffects} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Carregar Imagens em Baixa Resolução</Label>
                <p className="text-sm text-muted-foreground">
                  Reduz a qualidade das imagens para melhor desempenho
                </p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cache e Armazenamento</h3>
            <Card className="bg-muted/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Cache de Dados</h4>
                  <p className="text-sm text-muted-foreground">24.5 MB em uso</p>
                </div>
                <Button variant="outline" size="sm">Limpar</Button>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Dados Offline</h4>
                  <p className="text-sm text-muted-foreground">12.8 MB em uso</p>
                </div>
                <Button variant="outline" size="sm">Limpar</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
