'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSettingsStore } from '@/lib/store';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Eye,
  Contrast,
  Copyright as Brightness,
  Type,
  Grid,
  Zap,
  Crown,
  Star,
  Save,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppearanceSettingsPage() {
  const { theme, setTheme, animations, toggleAnimations } = useSettingsStore();
  const [playTestSound, setPlayTestSound] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: 'Definições Guardadas',
      description: 'As suas preferências de aparência foram atualizadas.',
    });
  };

  const handleResetSettings = () => {
    setTheme('dark');
    if (!animations) toggleAnimations();
    toast({
      title: 'Definições Restauradas',
      description: 'As definições de aparência foram restauradas para os valores padrão.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Palette className="mr-3 h-6 w-6 text-primary" />
            Aparência
          </CardTitle>
          <CardDescription>
            Personalize o visual da aplicação para se adequar ao seu estilo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tema</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  theme === 'light' && 'border-2 border-primary bg-primary/10'
                )}
                onClick={() => setTheme('light')}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Sun className="mb-2 h-10 w-10" />
                  <span className="font-medium">Claro</span>
                </CardContent>
              </Card>
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  theme === 'dark' && 'border-2 border-primary bg-primary/10'
                )}
                onClick={() => setTheme('dark')}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Moon className="mb-2 h-10 w-10" />
                  <span className="font-medium">Escuro</span>
                </CardContent>
              </Card>
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  theme === 'system' && 'border-2 border-primary bg-primary/10'
                )}
                onClick={() => setTheme('system')}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Monitor className="mb-2 h-10 w-10" />
                  <span className="font-medium">Sistema</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cores</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="cursor-pointer border-primary/50 p-4 hover:shadow-md">
                  <div className="mb-2 h-12 rounded-md bg-gradient-to-r from-primary to-accent"></div>
                  <p className="text-sm font-medium">Padrão</p>
                </Card>
                <Card className="cursor-pointer p-4 hover:shadow-md">
                  <div className="mb-2 h-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <p className="text-sm font-medium">Neon</p>
                </Card>
                <Card className="cursor-pointer p-4 hover:shadow-md">
                  <div className="mb-2 h-12 rounded-md bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <p className="text-sm font-medium">Natureza</p>
                </Card>
                <Card className="cursor-pointer p-4 hover:shadow-md">
                  <div className="mb-2 h-12 rounded-md bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <p className="text-sm font-medium">Fogo</p>
                </Card>
              </div>
              <Button variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                Mais Temas Premium
                <Badge className="ml-2 bg-amber-500">PRO</Badge>
              </Button>
            </div>
          </div>

          {/* Visual Effects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Efeitos Visuais</h3>
            <div className="flex items-center justify-between">
              <Label>Animações de Interface</Label>
              <Switch checked={animations} onCheckedChange={toggleAnimations} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Efeitos de Partículas</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Efeitos de Brilho</Label>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-6">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restaurar
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
