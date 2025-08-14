'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, Type, Contrast, Volume2, Hand, Keyboard, 
  MousePointer, Accessibility, Save, RefreshCw, 
  Glasses, Ear, Brain, Heart
} from "lucide-react";

export default function AccessibilityPage() {
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [lineHeight, setLineHeight] = useState(150);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [focusIndicator, setFocusIndicator] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState('none');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Acessibilidade Guardada",
      description: "As suas preferências de acessibilidade foram guardadas.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-green-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
              <Accessibility className="h-8 w-8 mr-3" />
              Acessibilidade
            </CardTitle>
            <CardDescription>
              Torne a aplicação mais acessível e fácil de usar
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Visão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Acessibilidade Visual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tamanho do Texto: {fontSize}%</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={75}
                  max={200}
                  step={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Altura da Linha: {lineHeight}%</Label>
                <Slider
                  value={[lineHeight]}
                  onValueChange={(value) => setLineHeight(value[0])}
                  min={100}
                  max={250}
                  step={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Espaçamento entre Letras: {letterSpacing}px</Label>
                <Slider
                  value={[letterSpacing]}
                  onValueChange={(value) => setLetterSpacing(value[0])}
                  min={-2}
                  max={5}
                  step={0.5}
                />
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <p style={{ 
                fontSize: `${fontSize}%`, 
                lineHeight: `${lineHeight}%`,
                letterSpacing: `${letterSpacing}px`
              }}>
                Exemplo de texto com as configurações aplicadas. Este parágrafo demonstra como o texto aparecerá com as suas definições.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contraste e Cores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Contrast className="h-5 w-5 mr-2" />
              Contraste e Cores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Alto Contraste</Label>
                <p className="text-sm text-muted-foreground">Aumenta o contraste para melhor visibilidade</p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            
            <div className="space-y-2">
              <Label>Modo para Daltonismo</Label>
              <Select value={colorBlindMode} onValueChange={setColorBlindMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Vermelho-Verde)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Verde-Vermelho)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Azul-Amarelo)</SelectItem>
                  <SelectItem value="monochrome">Monocromático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Contraste Geral: {contrast}%</Label>
              <Slider
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
                min={50}
                max={200}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Movimento e Animações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Hand className="h-5 w-5 mr-2" />
              Movimento e Interação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Reduzir Movimento</Label>
                <p className="text-sm text-muted-foreground">Reduz animações que podem causar desconforto</p>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Navegação por Teclado</Label>
                <p className="text-sm text-muted-foreground">Permite navegar usando apenas o teclado</p>
              </div>
              <Switch checked={keyboardNav} onCheckedChange={setKeyboardNav} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Indicador de Foco</Label>
                <p className="text-sm text-muted-foreground">Destaca o elemento atualmente selecionado</p>
              </div>
              <Switch checked={focusIndicator} onCheckedChange={setFocusIndicator} />
            </div>
          </CardContent>
        </Card>

        {/* Tecnologias Assistivas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Glasses className="h-5 w-5 mr-2" />
              Tecnologias Assistivas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Suporte a Leitores de Ecrã</Label>
                <p className="text-sm text-muted-foreground">Otimiza para NVDA, JAWS e VoiceOver</p>
              </div>
              <Switch checked={screenReader} onCheckedChange={setScreenReader} />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Atalhos de Teclado
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Tab - Navegar para frente</div>
                <div>Shift+Tab - Navegar para trás</div>
                <div>Enter - Ativar elemento</div>
                <div>Esc - Fechar modal</div>
                <div>Ctrl+/ - Mostrar ajuda</div>
                <div>Ctrl+K - Pesquisar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-between">
          <Button variant="outline">
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