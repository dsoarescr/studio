'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Wand2,
  Sparkles,
  Palette,
  Image as ImageIcon,
  MessageSquare,
  Lightbulb,
  Zap,
  Brain,
  // Magic icon doesn't exist; using Sparkles instead
  Brush,
  Layout,
  Eye,
  Layers,
  Settings,
  Save,
  Share2,
  Download,
  RefreshCw,
  Trash2,
  Plus,
} from 'lucide-react';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
}

interface StylePreset {
  id: string;
  name: string;
  description: string;
  preview?: string;
  parameters: {
    style: string;
    complexity: number;
    colorPalette: string[];
  };
}

const aiFeatures: AIFeature[] = [
  {
    id: 'pixel_generation',
    name: 'Geração de Pixel Art',
    description: 'Gere pixel art a partir de descrições textuais',
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    id: 'style_transfer',
    name: 'Transferência de Estilo',
    description: 'Aplique estilos artísticos aos seus pixels',
    icon: <Palette className="h-5 w-5" />,
    premium: true,
  },
  {
    id: 'enhancement',
    name: 'Aprimoramento de Arte',
    description: 'Melhore automaticamente suas criações',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: 'suggestions',
    name: 'Sugestões Criativas',
    description: 'Receba ideias e inspirações personalizadas',
    icon: <Lightbulb className="h-5 w-5" />,
  },
];

const stylePresets: StylePreset[] = [
  {
    id: 'retro_gaming',
    name: 'Retrô Gaming',
    description: 'Estilo clássico de jogos 8-bit',
    parameters: {
      style: 'pixel_art_8bit',
      complexity: 70,
      colorPalette: ['#ff0000', '#00ff00', '#0000ff'],
    },
  },
  {
    id: 'minimalist',
    name: 'Minimalista',
    description: 'Design limpo e simplificado',
    parameters: {
      style: 'minimal_pixel',
      complexity: 30,
      colorPalette: ['#000000', '#ffffff', '#cccccc'],
    },
  },
  {
    id: 'fantasy',
    name: 'Fantasia',
    description: 'Estilo mágico e fantástico',
    parameters: {
      style: 'fantasy_pixel',
      complexity: 85,
      colorPalette: ['#8a2be2', '#ff69b4', '#00ffff'],
    },
  },
];

export function AICreativeAssistant() {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [complexity, setComplexity] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: 'Prompt Necessário',
        description: 'Por favor, descreva o que você quer criar.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    // Simulação de geração
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'Arte Gerada',
        description: 'Sua pixel art foi gerada com sucesso!',
      });
    }, 3000);
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    const style = stylePresets.find(s => s.id === styleId);
    if (style) {
      setComplexity(style.parameters.complexity);
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="h-6 w-6 text-primary" />
                Assistente Criativo IA
              </CardTitle>
              <CardDescription>Use IA para aprimorar suas criações de pixel art</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="generate">
                <Wand2 className="mr-2 h-4 w-4" />
                Gerar
              </TabsTrigger>
              <TabsTrigger value="enhance">
                <Sparkles className="mr-2 h-4 w-4" />
                Aprimorar
              </TabsTrigger>
              <TabsTrigger value="style">
                <Palette className="mr-2 h-4 w-4" />
                Estilos
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                <Lightbulb className="mr-2 h-4 w-4" />
                Sugestões
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descreva sua ideia</label>
                    <Textarea
                      placeholder="Ex: Um castelo medieval em pixel art com tons de roxo e azul..."
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Complexidade</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[complexity]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([value]) => setComplexity(value)}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-mono">{complexity}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estilos Predefinidos</label>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {stylePresets.map(style => (
                        <Button
                          key={style.id}
                          variant={selectedStyle === style.id ? 'default' : 'outline'}
                          className="flex h-auto flex-col items-center gap-2 py-4"
                          onClick={() => handleStyleSelect(style.id)}
                        >
                          <span>{style.name}</span>
                          <span className="text-xs text-muted-foreground">{style.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Gerar Pixel Art
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Área de Resultado */}
              <Card className="relative aspect-square">
                <CardContent className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Sua arte gerada aparecerá aqui</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enhance" className="space-y-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Melhorias Automáticas</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Otimização de Cores</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Suavização de Bordas</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Correção de Proporções</span>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ajustes Avançados</label>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Contraste</span>
                            <span>75%</span>
                          </div>
                          <Slider defaultValue={[75]} max={100} step={1} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Nitidez</span>
                            <span>60%</span>
                          </div>
                          <Slider defaultValue={[60]} max={100} step={1} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Aprimorar Arte
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {stylePresets.map(style => (
                  <Card key={style.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{style.name}</CardTitle>
                      <CardDescription>{style.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="aspect-square rounded-lg bg-muted" />
                        <div className="flex gap-2">
                          {style.parameters.colorPalette.map((color, index) => (
                            <div
                              key={index}
                              className="h-6 w-6 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Aplicar Estilo</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sugestões Criativas</CardTitle>
                  <CardDescription>Ideias personalizadas baseadas no seu estilo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Lightbulb className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Paisagem Urbana</h4>
                            <p className="text-sm text-muted-foreground">
                              Crie uma cidade cyberpunk com neons e arranha-céus
                            </p>
                            <Button variant="link" className="mt-2 h-auto p-0">
                              Usar Sugestão
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Personagem Fantástico</h4>
                            <p className="text-sm text-muted-foreground">
                              Desenhe um mago com elementos mágicos coloridos
                            </p>
                            <Button variant="link" className="mt-2 h-auto p-0">
                              Usar Sugestão
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
