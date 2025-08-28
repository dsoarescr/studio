'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';
import {
  Paintbrush, Eraser, Palette, Move, ZoomIn,
  ZoomOut, RotateCcw, Download, Share2, Eye,
  Layers, Settings, Wand2, Sparkles, History,
  Undo, Redo, Copy, Scissors, Grid, Lock,
  Maximize2, Minimize2, Plus, Minus
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  shortcut: string;
  isPremium?: boolean;
}

interface Filter {
  id: string;
  name: string;
  description: string;
  preview?: string;
  intensity: number;
}

const tools: Tool[] = [
  {
    id: 'brush',
    name: 'Pincel',
    icon: <Paintbrush className="h-5 w-5" />,
    description: 'Pinte pixels individualmente',
    shortcut: 'B'
  },
  {
    id: 'eraser',
    name: 'Borracha',
    icon: <Eraser className="h-5 w-5" />,
    description: 'Apague pixels',
    shortcut: 'E'
  },
  {
    id: 'eyedropper',
    name: 'Conta-gotas',
    icon: <Eye className="h-5 w-5" />,
    description: 'Selecione uma cor existente',
    shortcut: 'I'
  },
  {
    id: 'move',
    name: 'Mover',
    icon: <Move className="h-5 w-5" />,
    description: 'Mova a área selecionada',
    shortcut: 'M'
  },
  {
    id: 'magic-wand',
    name: 'Varinha Mágica',
    icon: <Wand2 className="h-5 w-5" />,
    description: 'Selecione áreas por cor',
    shortcut: 'W',
    isPremium: true
  }
];

const filters: Filter[] = [
  {
    id: 'pixelate',
    name: 'Pixelizar',
    description: 'Aumente o efeito de pixelização',
    intensity: 50
  },
  {
    id: 'smooth',
    name: 'Suavizar',
    description: 'Suavize as bordas dos pixels',
    intensity: 30
  },
  {
    id: 'contrast',
    name: 'Contraste',
    description: 'Ajuste o contraste entre pixels',
    intensity: 40
  }
];

export function EnhancedPixelInteractions() {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(1);
  const [opacity, setOpacity] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterIntensities, setFilterIntensities] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleToolSelect = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool?.isPremium) {
      toast({
        title: "Recurso Premium",
        description: "Esta ferramenta está disponível apenas para usuários premium.",
        variant: "destructive"
      });
      return;
    }
    setSelectedTool(toolId);
  };

  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleFilterIntensityChange = (filterId: string, value: number) => {
    setFilterIntensities(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-6 w-6 text-primary" />
          Ferramentas de Pixel Art
        </CardTitle>
        <CardDescription>
          Crie e edite pixel art com ferramentas avançadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tools" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tools">
              <Settings className="h-4 w-4 mr-2" />
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="filters">
              <Layers className="h-4 w-4 mr-2" />
              Filtros
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-4">
            {/* Tool Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'default' : 'outline'}
                  className={`h-auto py-4 flex flex-col items-center gap-2 ${
                    tool.isPremium ? 'opacity-50' : ''
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                >
                  {tool.icon}
                  <span className="text-sm">{tool.name}</span>
                  {tool.isPremium && (
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {tool.shortcut}
                  </span>
                </Button>
              ))}
            </div>

            {/* Tool Settings */}
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Tamanho do Pincel</span>
                    <span className="font-mono">{brushSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Slider
                      value={[brushSize]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([value]) => setBrushSize(value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBrushSize(Math.min(10, brushSize + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Opacidade</span>
                    <span className="font-mono">{opacity}%</span>
                  </div>
                  <Slider
                    value={[opacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setOpacity(value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    <Undo className="h-4 w-4 mr-2" />
                    Desfazer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Redo className="h-4 w-4 mr-2" />
                    Refazer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            {filters.map((filter) => (
              <Card key={filter.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{filter.name}</CardTitle>
                      <CardDescription>{filter.description}</CardDescription>
                    </div>
                    <Switch
                      checked={activeFilters.includes(filter.id)}
                      onCheckedChange={() => handleFilterToggle(filter.id)}
                    />
                  </div>
                </CardHeader>
                {activeFilters.includes(filter.id) && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Intensidade</span>
                        <span className="font-mono">
                          {filterIntensities[filter.id] || filter.intensity}%
                        </span>
                      </div>
                      <Slider
                        value={[filterIntensities[filter.id] || filter.intensity]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([value]) =>
                          handleFilterIntensityChange(filter.id, value)
                        }
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Mostrar Grade</h4>
                    <p className="text-sm text-muted-foreground">
                      Exibe uma grade para auxiliar no posicionamento
                    </p>
                  </div>
                  <Switch
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Alinhar à Grade</h4>
                    <p className="text-sm text-muted-foreground">
                      Força o alinhamento dos pixels à grade
                    </p>
                  </div>
                  <Switch
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações Avançadas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
        <Button variant="default" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          Aplicar Efeitos
        </Button>
      </CardFooter>
    </Card>
  );
}
