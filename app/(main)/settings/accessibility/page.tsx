'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Eye,
  Type,
  Contrast,
  Volume2,
  Hand,
  Keyboard,
  MousePointer,
  Accessibility,
  Save,
  RefreshCw,
  Glasses,
  Ear,
  Brain,
  Heart,
} from 'lucide-react';

export default function AccessibilitySettingsPage() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [audioDescription, setAudioDescription] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: 'Definições Guardadas',
      description: 'As suas definições de acessibilidade foram atualizadas.',
    });
  };

  const handleResetDefaults = () => {
    setFontSize(100);
    setHighContrast(false);
    setReduceMotion(false);
    setScreenReader(false);
    setAudioDescription(false);
    toast({
      title: 'Definições Restauradas',
      description: 'As definições de acessibilidade foram restauradas para os valores padrão.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Accessibility className="mr-3 h-6 w-6 text-primary" />
            Acessibilidade
          </CardTitle>
          <CardDescription>
            Ajuste as configurações para uma melhor experiência de utilização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Visual Settings */}
          <div className="space-y-6">
            <h3 className="flex items-center text-lg font-semibold">
              <Eye className="mr-2 h-5 w-5" />
              Visual
            </h3>
            <div className="space-y-4 pl-7">
              <div className="space-y-2">
                <Label>Tamanho da Fonte</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[fontSize]}
                    onValueChange={value => setFontSize(value[0])}
                    min={75}
                    max={150}
                    step={5}
                  />
                  <span className="w-12 text-right font-mono text-sm">{fontSize}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Modo de Alto Contraste</Label>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Reduzir Movimento</Label>
                <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-6">
            <h3 className="flex items-center text-lg font-semibold">
              <Volume2 className="mr-2 h-5 w-5" />
              Áudio
            </h3>
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <Label>Ativar Descrições de Áudio</Label>
                <Switch checked={audioDescription} onCheckedChange={setAudioDescription} />
              </div>
              <div className="space-y-2">
                <Label>Volume dos Efeitos Sonoros</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </div>
          </div>

          {/* Interaction Settings */}
          <div className="space-y-6">
            <h3 className="flex items-center text-lg font-semibold">
              <Hand className="mr-2 h-5 w-5" />
              Interação
            </h3>
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <Label>Suporte para Leitor de Ecrã</Label>
                <Switch checked={screenReader} onCheckedChange={setScreenReader} />
              </div>
              <div className="space-y-2">
                <Label>Preferência de Navegação</Label>
                <Select defaultValue="mouse">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mouse">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4" />
                        <span>Rato</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="keyboard">
                      <div className="flex items-center gap-2">
                        <Keyboard className="h-4 w-4" />
                        <span>Teclado</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-6">
            <Button variant="outline" onClick={handleResetDefaults}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restaurar
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
