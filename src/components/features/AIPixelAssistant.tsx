// src/components/features/AIPixelAssistant.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Sparkles, Wand2, Palette, TrendingUp, Target, 
  Lightbulb, Zap, Star, Crown, Gem, Eye, Heart, MessageSquare,
  Camera, Image as ImageIcon, Video, Music, Download, Upload,
  RefreshCw, Play, Pause, Settings, Info, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface AIAssistantProps {
  children: React.ReactNode;
}

const aiFeatures = [
  {
    id: 'style-transfer',
    name: 'Transferência de Estilo',
    description: 'Aplique estilos artísticos famosos aos seus pixels',
    icon: <Wand2 className="h-6 w-6" />,
    category: 'Criação',
    premium: true,
    examples: ['Van Gogh', 'Picasso', 'Monet', 'Arte Digital']
  },
  {
    id: 'color-harmony',
    name: 'Harmonia de Cores',
    description: 'IA sugere paletas perfeitas baseadas na teoria das cores',
    icon: <Palette className="h-6 w-6" />,
    category: 'Cores',
    premium: false,
    examples: ['Complementares', 'Análogas', 'Triádicas', 'Monocromáticas']
  },
  {
    id: 'trend-analysis',
    name: 'Análise de Tendências',
    description: 'Descubra que tipos de pixels estão em alta',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'Mercado',
    premium: true,
    examples: ['Cores Populares', 'Estilos Trending', 'Regiões Valorizadas']
  },
  {
    id: 'auto-enhance',
    name: 'Melhoria Automática',
    description: 'IA melhora automaticamente seus pixels',
    icon: <Sparkles className="h-6 w-6" />,
    category: 'Edição',
    premium: false,
    examples: ['Nitidez', 'Contraste', 'Saturação', 'Iluminação']
  },
  {
    id: 'composition',
    name: 'Análise de Composição',
    description: 'Sugestões para melhorar a composição visual',
    icon: <Eye className="h-6 w-6" />,
    category: 'Composição',
    premium: true,
    examples: ['Regra dos Terços', 'Pontos Focais', 'Equilíbrio', 'Movimento']
  },
  {
    id: 'description-gen',
    name: 'Gerador de Descrições',
    description: 'Crie descrições envolventes para seus pixels',
    icon: <MessageSquare className="h-6 w-6" />,
    category: 'Marketing',
    premium: false,
    examples: ['Storytelling', 'SEO Otimizado', 'Emocional', 'Técnico']
  }
];

export default function AIPixelAssistant({ children }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  
  const { toast } = useToast();

  const handleAIProcess = async (featureId: string) => {
    setIsProcessing(true);
    setProgress(0);
    setSelectedFeature(featureId);
    
    // Simulate AI processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Generate result based on feature
          switch (featureId) {
            case 'style-transfer':
              setResult('Estilo Van Gogh aplicado com sucesso! Seu pixel agora tem pinceladas expressivas e cores vibrantes.');
              break;
            case 'color-harmony':
              setResult('Paleta complementar sugerida: #FF6B6B (coral), #4ECDC4 (turquesa), #45B7D1 (azul céu). Harmonia perfeita garantida!');
              break;
            case 'trend-analysis':
              setResult('Tendência atual: Pixels com temas naturais estão 34% mais valorizados. Cores terrosas e verdes são populares.');
              break;
            case 'auto-enhance':
              setResult('Pixel melhorado automaticamente: +15% contraste, +10% saturação, nitidez otimizada. Qualidade profissional!');
              break;
            case 'composition':
              setResult('Sugestão: Mova o elemento principal 20% para a direita para seguir a regra dos terços. Adicione um ponto focal no canto inferior esquerdo.');
              break;
            case 'description-gen':
              setResult('Descrição gerada: "Este pixel único captura a essência vibrante de Portugal, combinando tradição e modernidade numa obra digital exclusiva que conta uma história única."');
              break;
            default:
              setResult('Processamento IA concluído com sucesso!');
          }
          
          toast({
            title: "IA Concluída! 🤖",
            description: "Resultado gerado com sucesso.",
          });
          
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleCustomPrompt = async () => {
    if (!userPrompt.trim()) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setResult(`Baseado no seu pedido "${userPrompt}", a IA sugere: Foque em elementos que criem contraste visual e harmonia cromática. Considere adicionar detalhes que contem uma história única.`);
          return 100;
        }
        return prev + 3;
      });
    }, 60);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <DialogTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-3 text-purple-500" />
            Assistente IA para Pixels
            <Badge className="ml-3 bg-gradient-to-r from-purple-500 to-blue-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="features" className="flex-1 flex flex-col">
          <TabsList className="px-6 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="features">
              <Zap className="h-4 w-4 mr-2" />
              Funcionalidades IA
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Lightbulb className="h-4 w-4 mr-2" />
              Prompt Personalizado
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Star className="h-4 w-4 mr-2" />
              Templates IA
            </TabsTrigger>
            <TabsTrigger value="history">
              <RefreshCw className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden p-6">
            {/* AI Features */}
            <TabsContent value="features" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiFeatures.map(feature => (
                  <Card 
                    key={feature.id}
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleAIProcess(feature.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{feature.name}</h3>
                            {feature.premium && (
                              <Badge className="bg-amber-500 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {feature.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Exemplos:</p>
                        <div className="flex flex-wrap gap-1">
                          {feature.examples.map(example => (
                            <Badge key={example} variant="secondary" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-3" 
                        size="sm"
                        disabled={isProcessing && selectedFeature === feature.id}
                      >
                        {isProcessing && selectedFeature === feature.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Executar IA
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Processing Status */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Brain className="h-6 w-6 text-purple-500 animate-pulse" />
                        <div>
                          <h3 className="font-semibold">IA Processando...</h3>
                          <p className="text-sm text-muted-foreground">
                            Analisando e gerando resultado personalizado
                          </p>
                        </div>
                      </div>
                      <Progress value={progress} className="mb-2" />
                      <p className="text-xs text-muted-foreground">{progress}% concluído</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* AI Result */}
              {result && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-500">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Resultado da IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed mb-4">{result}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Útil
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Partilhar
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            {/* Custom Prompt */}
            <TabsContent value="custom" className="h-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    Consulta Personalizada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Descreva o que precisa:
                    </label>
                    <Textarea
                      placeholder="Ex: Crie uma paleta de cores inspirada no pôr do sol português, ou: Como posso melhorar a composição do meu pixel para ser mais atrativo?"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estilo Preferido:</label>
                      <select 
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="">Selecionar estilo...</option>
                        <option value="realistic">Realista</option>
                        <option value="abstract">Abstrato</option>
                        <option value="minimalist">Minimalista</option>
                        <option value="vintage">Vintage</option>
                        <option value="modern">Moderno</option>
                        <option value="artistic">Artístico</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Complexidade:</label>
                      <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                        <option value="simple">Simples</option>
                        <option value="medium">Médio</option>
                        <option value="complex">Complexo</option>
                        <option value="professional">Profissional</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCustomPrompt}
                    disabled={isProcessing || !userPrompt.trim()}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        IA a processar...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Consultar IA
                      </>
                    )}
                  </Button>
                  
                  {/* Quick Prompts */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Prompts Rápidos:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "Criar paleta inspirada na natureza portuguesa",
                        "Sugerir melhorias para pixel de paisagem",
                        "Analisar tendências de cores atuais",
                        "Gerar descrição épica para pixel raro",
                        "Otimizar composição para máximo impacto",
                        "Criar variações de estilo artístico"
                      ].map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left justify-start h-auto p-3"
                          onClick={() => setUserPrompt(prompt)}
                        >
                          <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-xs">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* AI Templates */}
            <TabsContent value="templates" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Paisagem Portuguesa',
                    description: 'Template otimizado para paisagens de Portugal',
                    preview: '🏞️',
                    category: 'Natureza',
                    difficulty: 'Médio',
                    uses: 234
                  },
                  {
                    name: 'Arte Urbana',
                    description: 'Estilo street art e graffiti digital',
                    preview: '🏙️',
                    category: 'Urbano',
                    difficulty: 'Avançado',
                    uses: 156
                  },
                  {
                    name: 'Minimalista Zen',
                    description: 'Design limpo e equilibrado',
                    preview: '⚪',
                    category: 'Minimalista',
                    difficulty: 'Fácil',
                    uses: 89
                  },
                  {
                    name: 'Retro Gaming',
                    description: 'Estilo pixel art clássico dos videojogos',
                    preview: '🎮',
                    category: 'Gaming',
                    difficulty: 'Médio',
                    uses: 312
                  },
                  {
                    name: 'Arte Abstrata',
                    description: 'Formas e cores abstratas expressivas',
                    preview: '🎨',
                    category: 'Abstrato',
                    difficulty: 'Avançado',
                    uses: 78
                  },
                  {
                    name: 'Fotorrealismo',
                    description: 'Máximo realismo em pixel art',
                    preview: '📸',
                    category: 'Realista',
                    difficulty: 'Extremo',
                    uses: 45
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-4">
                      <div className="text-center mb-3">
                        <div className="text-4xl mb-2">{template.preview}</div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant={
                          template.difficulty === 'Fácil' ? 'secondary' :
                          template.difficulty === 'Médio' ? 'default' :
                          template.difficulty === 'Avançado' ? 'destructive' : 'destructive'
                        }>
                          {template.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                        <span>{template.uses} usos</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>4.{Math.floor(Math.random() * 9)}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* History */}
            <TabsContent value="history" className="h-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Histórico de IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: 'Paleta de Cores',
                        prompt: 'Cores inspiradas no pôr do sol',
                        result: 'Paleta laranja-rosa gerada',
                        time: '2h atrás',
                        rating: 5
                      },
                      {
                        type: 'Melhoria Automática',
                        prompt: 'Otimizar pixel de paisagem',
                        result: 'Contraste e saturação melhorados',
                        time: '1d atrás',
                        rating: 4
                      },
                      {
                        type: 'Análise de Tendências',
                        prompt: 'Tendências atuais do mercado',
                        result: 'Arte natural em alta (+34%)',
                        time: '3d atrás',
                        rating: 5
                      }
                    ].map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{item.type}</h4>
                            <p className="text-sm text-muted-foreground">{item.prompt}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < item.rating ? 'fill-current text-yellow-500' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-2">{item.result}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{item.time}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Repetir
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Partilhar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}