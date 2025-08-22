'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Lucide imports removed
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
// import { generatePixelDescription } from '@/ai/flows/generate-pixel-description';
import { cn } from '@/lib/utils';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'creation' | 'analysis' | 'optimization' | 'social';
  premium: boolean;
}

interface PixelAIProps {
  children: React.ReactNode;
  pixelData?: {
    x: number;
    y: number;
    region: string;
  };
}

const aiFeatures: AIFeature[] = [
  {
    id: 'auto-color',
    name: 'Paleta Inteligente',
    description: 'IA sugere cores baseadas na localização e contexto',
    icon: <Palette className="h-6 w-6" />,
    category: 'creation',
    premium: false
  },
  {
    id: 'style-transfer',
    name: 'Transferência de Estilo',
    description: 'Aplique estilos artísticos famosos aos seus pixels',
    icon: <Wand2 className="h-6 w-6" />,
    category: 'creation',
    premium: true
  },
  {
    id: 'market-analysis',
    name: 'Análise de Mercado',
    description: 'Previsões de preço e tendências de valorização',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'analysis',
    premium: true
  },
  {
    id: 'auto-description',
    name: 'Descrição Automática',
    description: 'Gere descrições envolventes para seus pixels',
    icon: <MessageSquare className="h-6 w-6" />,
    category: 'social',
    premium: false
  },
  {
    id: 'investment-advisor',
    name: 'Consultor de Investimento',
    description: 'Recomendações personalizadas de compra',
    icon: <Target className="h-6 w-6" />,
    category: 'optimization',
    premium: true
  },
  {
    id: 'trend-predictor',
    name: 'Preditor de Tendências',
    description: 'Identifique pixels que vão valorizar',
    icon: <Rocket className="h-6 w-6" />,
    category: 'analysis',
    premium: true
  }
];

export default function PixelAI({ children, pixelData }: PixelAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  
  const { toast } = useToast();

  const handleAIGeneration = async (featureId: string) => {
    setIsGenerating(true);
    setActiveFeature(featureId);
    
    try {
      // Simular diferentes tipos de geração de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (featureId) {
        case 'auto-color':
          setAiResult('Paleta sugerida: #D4A757 (dourado português), #7DF9FF (azul atlântico), #228B22 (verde lusitano)');
          break;
        case 'auto-description':
          if (pixelData) {
            // Temporarily disabled AI generation - using fallback description
            setAiResult(`Este pixel em ${pixelData.region} (${pixelData.x}, ${pixelData.y}) representa um local único com grande potencial artístico e histórico. Uma verdadeira joia digital com características especiais que refletem a beleza e cultura portuguesa.`);
          } else {
            setAiResult('Pixel único com características especiais e potencial de valorização. Um investimento digital inteligente com valor cultural agregado.');
          }
          break;
        case 'market-analysis':
          setAiResult('Análise: Tendência de alta (+15% em 30 dias). Região em crescimento. Recomendação: COMPRAR');
          break;
        case 'investment-advisor':
          setAiResult('Recomendação: Este pixel tem 78% de probabilidade de valorizar nos próximos 3 meses baseado em padrões históricos.');
          break;
        case 'trend-predictor':
          setAiResult('Tendência identificada: Pixels em zonas históricas estão a valorizar 23% mais rápido que a média.');
          break;
        default:
          setAiResult('Funcionalidade IA executada com sucesso!');
      }
      
      toast({
        title: "IA Concluída! 🤖",
        description: "Resultado gerado com sucesso.",
      });
      
    } catch (error) {
      toast({
        title: "Erro na IA",
        description: "Não foi possível processar o pedido.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomPrompt = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiResult(`Baseado no seu pedido "${userPrompt}", a IA sugere: Considere focar em pixels com características históricas e culturais únicas, que tendem a ter maior valor sentimental e comercial.`);
      
      toast({
        title: "IA Personalizada Concluída! ✨",
        description: "Resposta gerada baseada no seu pedido.",
      });
      
    } catch {
      toast({
        title: "Erro na IA",
        description: "Não foi possível processar o pedido personalizado.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'creation': return <Palette className="h-4 w-4" />;
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      case 'optimization': return <Target className="h-4 w-4" />;
      case 'social': return <Heart className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'creation': return 'text-purple-500 bg-purple-500/10';
      case 'analysis': return 'text-blue-500 bg-blue-500/10';
      case 'optimization': return 'text-green-500 bg-green-500/10';
      case 'social': return 'text-pink-500 bg-pink-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <DialogTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            Assistente IA para Pixels
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="features" className="flex-1 flex flex-col">
          <TabsList className="px-4 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="features">
              <Zap className="h-4 w-4 mr-2" />
              Funcionalidades
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Lightbulb className="h-4 w-4 mr-2" />
              IA Personalizada
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Eye className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            {/* Funcionalidades IA */}
            <TabsContent value="features" className="h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiFeatures.map(feature => (
                  <Card 
                    key={feature.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      activeFeature === feature.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleAIGeneration(feature.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("p-2 rounded-lg", getCategoryColor(feature.category))}>
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{feature.name}</h3>
                            {feature.premium && (
                              <Badge className="bg-amber-500 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {getCategoryIcon(feature.category)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {feature.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      
                      <Button 
                        className="w-full" 
                        size="sm"
                        disabled={isGenerating && activeFeature === feature.id}
                      >
                        {isGenerating && activeFeature === feature.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
              
              {/* Resultado da IA */}
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-500">
                        <Brain className="h-5 w-5 mr-2" />
                        Resultado da IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">{aiResult}</p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Útil
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Partilhar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            {/* IA Personalizada */}
            <TabsContent value="custom" className="h-full p-4">
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
                      Faça uma pergunta à IA sobre pixels:
                    </label>
                    <Textarea
                      placeholder="Ex: Que tipo de pixels devo comprar para maximizar o retorno? Ou: Como posso criar arte mais atrativa?"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCustomPrompt}
                    disabled={isGenerating || !userPrompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        IA a processar...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Consultar IA
                      </>
                    )}
                  </Button>
                  
                  {/* Sugestões de perguntas */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Perguntas Sugeridas:</h4>
                    <div className="space-y-2">
                      {[
                        "Quais pixels têm maior potencial de valorização?",
                        "Como criar uma coleção temática atrativa?",
                        "Que cores funcionam melhor para cada região?",
                        "Como otimizar meu portfólio de pixels?"
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                          onClick={() => setUserPrompt(suggestion)}
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Insights */}
            <TabsContent value="insights" className="h-full p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-500">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Tendências de Mercado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Pixels Históricos</span>
                        <span className="text-green-500 font-bold">+23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zona Costeira</span>
                        <span className="text-green-500 font-bold">+18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Centros Urbanos</span>
                        <span className="text-yellow-500 font-bold">+8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-500">
                      <Target className="h-5 w-5 mr-2" />
                      Recomendações IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-2 bg-green-500/10 rounded">
                        <strong>Oportunidade:</strong> Pixels em Óbidos estão subvalorizados
                      </div>
                      <div className="p-2 bg-yellow-500/10 rounded">
                        <strong>Atenção:</strong> Mercado de Lisboa pode estar sobreaquecido
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded">
                        <strong>Tendência:</strong> Arte colaborativa em alta
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Análise do Seu Portfólio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">85%</div>
                      <div className="text-sm text-muted-foreground">Score de Diversificação</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">€1,247</div>
                      <div className="text-sm text-muted-foreground">Valor Estimado</div>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">+12%</div>
                      <div className="text-sm text-muted-foreground">Crescimento Mensal</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-medium mb-2">Sugestão da IA:</h4>
                    <p className="text-sm text-muted-foreground">
                      Considere adicionar mais pixels da região Norte para equilibrar seu portfólio. 
                      A IA detectou uma oportunidade de crescimento de 15-20% nesta região.
                    </p>
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
