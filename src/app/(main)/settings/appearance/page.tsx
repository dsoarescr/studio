'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSettingsStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { 
  Palette, Sun, Moon, Monitor, Sparkles, Eye, Contrast, 
  Brightness, Type, Grid, Zap, Crown, Star, Save, RefreshCw
} from "lucide-react";
import { cn } from '@/lib/utils';

export default function AppearancePage() {
  const { theme, setTheme, animations, toggleAnimations } = useSettingsStore();
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [borderRadius, setBorderRadius] = useState(8);
  const [spacing, setSpacing] = useState(16);
  const [playSound, setPlaySound] = useState(false);
  const { toast } = useToast();

  const themes = [
    { id: 'light', name: 'Claro', icon: Sun, description: 'Tema luminoso para o dia' },
    { id: 'dark', name: 'Escuro', icon: Moon, description: 'Tema escuro para a noite' },
    { id: 'system', name: 'Sistema', icon: Monitor, description: 'Segue o tema do sistema' }
  ];

  const colorSchemes = [
    { name: 'Padrão', primary: '#D4A757', secondary: '#7DF9FF', description: 'Dourado & Azul' },
    { name: 'Neon', primary: '#FF6B6B', secondary: '#4ECDC4', description: 'Vermelho & Verde' },
    { name: 'Oceano', primary: '#3498DB', secondary: '#2ECC71', description: 'Azul & Verde' },
    { name: 'Sunset', primary: '#E74C3C', secondary: '#F39C12', description: 'Vermelho & Laranja' },
    { name: 'Forest', primary: '#27AE60', secondary: '#8E44AD', description: 'Verde & Roxo' },
    { name: 'Royal', primary: '#9B59B6', secondary: '#F1C40F', description: 'Roxo & Dourado' }
  ];

  const handleSave = () => {
    setPlaySound(true);
    toast({
      title: "Aparência Guardada",
      description: "As suas preferências de aparência foram guardadas com sucesso.",
    });
  };

  const handleReset = () => {
    setTheme('dark');
    setFontSize(100);
    setContrast(100);
    setBrightness(100);
    setSaturation(100);
    setBorderRadius(8);
    setSpacing(16);
    
    toast({
      title: "Aparência Restaurada",
      description: "As definições foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSound} onEnd={() => setPlaySound(false)} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
              <Palette className="h-8 w-8 mr-3" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a aparência da aplicação ao seu gosto
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sun className="h-5 w-5 mr-2" />
              Tema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((themeOption) => (
                <Card 
                  key={themeOption.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    theme === themeOption.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setTheme(themeOption.id as any)}
                >
                  <CardContent className="p-4 text-center">
                    <themeOption.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">{themeOption.name}</h3>
                    <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Esquemas de Cores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Esquemas de Cores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorSchemes.map((scheme, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: scheme.secondary }}
                      />
                    </div>
                    <h4 className="font-medium">{scheme.name}</h4>
                    <p className="text-xs text-muted-foreground">{scheme.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tipografia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="h-5 w-5 mr-2" />
              Tipografia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tamanho da Fonte: {fontSize}%</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={75}
                  max={150}
                  step={5}
                />
              </div>
              
              <div className="p-4 border rounded-lg">
                <p style={{ fontSize: `${fontSize}%` }}>
                  Exemplo de texto com o tamanho selecionado. Este é um parágrafo de demonstração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ajustes Visuais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Ajustes Visuais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Contraste: {contrast}%</Label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    min={50}
                    max={150}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Brilho: {brightness}%</Label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    min={50}
                    max={150}
                    step={5}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Saturação: {saturation}%</Label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(value) => setSaturation(value[0])}
                    min={0}
                    max={200}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Raio das Bordas: {borderRadius}px</Label>
                  <Slider
                    value={[borderRadius]}
                    onValueChange={(value) => setBorderRadius(value[0])}
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animações e Efeitos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Animações e Efeitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Animações da Interface</Label>
                <p className="text-sm text-muted-foreground">Ativar animações suaves na interface</p>
              </div>
              <Switch checked={animations} onCheckedChange={toggleAnimations} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Efeitos de Partículas</Label>
                <p className="text-sm text-muted-foreground">Mostrar efeitos visuais especiais</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Transições Suaves</Label>
                <p className="text-sm text-muted-foreground">Transições entre páginas</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}