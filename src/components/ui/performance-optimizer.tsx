'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Activity, Battery, Wifi, Signal, Gauge, Eye, EyeOff,
  Volume2, VolumeX, Smartphone, AlertTriangle, CheckCircle,
  Settings, X, TrendingDown, TrendingUp, Monitor, Cpu, HardDrive
} from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  batteryLevel: number;
  networkSpeed: string;
  renderTime: number;
  loadTime: number;
  interactionDelay: number;
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: 'performance' | 'battery' | 'network' | 'accessibility';
  action: () => void;
  applied: boolean;
}

export function PerformanceOptimizer() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 45,
    batteryLevel: 85,
    networkSpeed: '4G',
    renderTime: 16,
    loadTime: 1200,
    interactionDelay: 50
  });
  
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false);
  
  const {
    performanceMode,
    togglePerformanceMode,
    highQualityRendering,
    toggleHighQualityRendering,
    animations,
    toggleAnimations,
    soundEffects,
    toggleSoundEffects
  } = useSettingsStore();
  
  const { toast } = useToast();

  // Monitor performance metrics
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (now - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
        
        // Show optimizer if performance is poor
        if (fps < 30 && !performanceMode) {
          setIsVisible(true);
          generateSuggestions();
        }
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    // Monitor memory usage
    const updateMemory = () => {
      if ((performance as any).memory) {
        const memoryInfo = (performance as any).memory;
        const usedMemoryMB = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));
        const totalMemoryMB = Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024));
        const memoryPercentage = (usedMemoryMB / totalMemoryMB) * 100;
        
        setMetrics(prev => ({ ...prev, memoryUsage: memoryPercentage }));
        
        if (memoryPercentage > 80) {
          setIsVisible(true);
          generateSuggestions();
        }
      }
    };

    // Monitor battery
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setMetrics(prev => ({ ...prev, batteryLevel: battery.level * 100 }));
          
          if (battery.level < 0.2 && !performanceMode) {
            setIsVisible(true);
            generateSuggestions();
          }
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    // Monitor network
    const updateNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setMetrics(prev => ({ 
          ...prev, 
          networkSpeed: connection.effectiveType?.toUpperCase() || '4G' 
        }));
        
        if (['2G', 'SLOW-2G'].includes(connection.effectiveType?.toUpperCase()) && !performanceMode) {
          setIsVisible(true);
          generateSuggestions();
        }
      }
    };

    animationId = requestAnimationFrame(measurePerformance);
    updateMemory();
    updateBattery();
    updateNetwork();

    const memoryInterval = setInterval(updateMemory, 5000);
    const batteryInterval = setInterval(updateBattery, 30000);
    const networkInterval = setInterval(updateNetwork, 10000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
      clearInterval(batteryInterval);
      clearInterval(networkInterval);
    };
  }, [performanceMode]);

  const generateSuggestions = useCallback(() => {
    const newSuggestions: OptimizationSuggestion[] = [];

    if (metrics.fps < 30) {
      newSuggestions.push({
        id: 'enable-performance-mode',
        title: 'Ativar Modo Performance',
        description: 'Reduz efeitos visuais para melhorar a fluidez',
        impact: 'high',
        category: 'performance',
        action: togglePerformanceMode,
        applied: performanceMode
      });
    }

    if (metrics.memoryUsage > 70) {
      newSuggestions.push({
        id: 'reduce-quality',
        title: 'Reduzir Qualidade de Renderização',
        description: 'Diminui o uso de memória',
        impact: 'medium',
        category: 'performance',
        action: toggleHighQualityRendering,
        applied: !highQualityRendering
      });
    }

    if (metrics.batteryLevel < 30) {
      newSuggestions.push({
        id: 'battery-saver',
        title: 'Modo Poupança de Bateria',
        description: 'Desativa animações e sons para poupar bateria',
        impact: 'high',
        category: 'battery',
        action: () => {
          if (animations) toggleAnimations();
          if (soundEffects) toggleSoundEffects();
        },
        applied: !animations && !soundEffects
      });
    }

    if (['2G', 'SLOW-2G'].includes(metrics.networkSpeed)) {
      newSuggestions.push({
        id: 'low-bandwidth',
        title: 'Modo Baixa Largura de Banda',
        description: 'Reduz transferência de dados',
        impact: 'medium',
        category: 'network',
        action: () => {
          if (highQualityRendering) toggleHighQualityRendering();
        },
        applied: !highQualityRendering
      });
    }

    setSuggestions(newSuggestions.filter(s => !s.applied));
  }, [metrics, performanceMode, highQualityRendering, animations, soundEffects, togglePerformanceMode, toggleHighQualityRendering, toggleAnimations, toggleSoundEffects]);

  const applyAllSuggestions = () => {
    suggestions.forEach(suggestion => {
      if (!suggestion.applied) {
        suggestion.action();
      }
    });
    
    toast({
      title: 'Otimizações Aplicadas',
      description: `${suggestions.length} otimizações foram aplicadas para melhorar a performance.`,
    });
    
    setIsVisible(false);
  };

  const applySuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion && !suggestion.applied) {
      suggestion.action();
      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, applied: true } : s
      ));
    }
  };

  const getPerformanceScore = () => {
    let score = 100;
    if (metrics.fps < 60) score -= 20;
    if (metrics.memoryUsage > 70) score -= 15;
    if (metrics.batteryLevel < 30) score -= 10;
    if (['2G', 'SLOW-2G'].includes(metrics.networkSpeed)) score -= 15;
    if (metrics.renderTime > 16) score -= 10;
    if (metrics.interactionDelay > 100) score -= 10;
    return Math.max(0, score);
  };

  const performanceScore = getPerformanceScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Auto-optimize if enabled and performance is poor
  useEffect(() => {
    if (autoOptimizeEnabled && performanceScore < 50 && suggestions.length > 0) {
      applyAllSuggestions();
    }
  }, [autoOptimizeEnabled, performanceScore, suggestions.length]);

  return (
    <>
      {/* Performance Score Indicator */}
      <div className="fixed top-20 right-4 z-40">
        <Card className="bg-card/90 backdrop-blur-sm border-primary/30 cursor-pointer" onClick={() => setIsVisible(true)}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <span className={`font-bold ${getScoreColor(performanceScore)}`}>
                {performanceScore}
              </span>
              <span className="text-xs text-muted-foreground">FPS: {metrics.fps}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Optimizer Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <Card className="bg-card/95 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-primary" />
                      Otimizador de Performance
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(performanceScore)}>
                        Score: {performanceScore}/100
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVisible(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className={`text-lg font-bold ${metrics.fps >= 30 ? 'text-green-500' : 'text-red-500'}`}>
                        {metrics.fps}
                      </div>
                      <div className="text-xs text-muted-foreground">FPS</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className={`text-lg font-bold ${metrics.memoryUsage < 70 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.round(metrics.memoryUsage)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Memória</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className={`text-lg font-bold ${metrics.batteryLevel > 30 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.round(metrics.batteryLevel)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Bateria</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {metrics.networkSpeed}
                      </div>
                      <div className="text-xs text-muted-foreground">Rede</div>
                    </div>
                  </div>

                  {/* Auto-optimize Toggle */}
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div>
                      <Label className="text-base">Otimização Automática</Label>
                      <p className="text-sm text-muted-foreground">
                        Aplica otimizações automaticamente quando a performance está baixa
                      </p>
                    </div>
                    <Switch 
                      checked={autoOptimizeEnabled} 
                      onCheckedChange={setAutoOptimizeEnabled}
                    />
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Sugestões de Otimização</h3>
                        <Button onClick={applyAllSuggestions} size="sm">
                          Aplicar Todas
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {suggestions.map(suggestion => (
                          <div 
                            key={suggestion.id}
                            className="p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                                <Badge className={getImpactColor(suggestion.impact)}>
                                  {suggestion.impact}
                                </Badge>
                              </div>
                              
                              <Button
                                size="sm"
                                onClick={() => applySuggestion(suggestion.id)}
                                disabled={suggestion.applied}
                              >
                                {suggestion.applied ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Aplicado
                                  </>
                                ) : (
                                  'Aplicar'
                                )}
                              </Button>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {suggestion.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manual Settings */}
                  <div className="space-y-4 p-3 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold">Configurações Manuais</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Modo Performance</Label>
                        <Switch 
                          checked={performanceMode} 
                          onCheckedChange={togglePerformanceMode}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Alta Qualidade</Label>
                        <Switch 
                          checked={highQualityRendering} 
                          onCheckedChange={toggleHighQualityRendering}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Animações</Label>
                        <Switch 
                          checked={animations} 
                          onCheckedChange={toggleAnimations}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Efeitos Sonoros</Label>
                        <Switch 
                          checked={soundEffects} 
                          onCheckedChange={toggleSoundEffects}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Performance Tips */}
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <h4 className="font-medium text-blue-500 mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Dicas de Performance
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Feche outras aplicações para liberar memória</li>
                      <li>• Use Wi-Fi quando possível para melhor velocidade</li>
                      <li>• Reduza o zoom para melhor fluidez no mapa</li>
                      <li>• Ative o modo performance em dispositivos mais antigos</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    batteryLevel: 100,
    networkSpeed: '4G',
    renderTime: 16,
    loadTime: 0,
    interactionDelay: 0
  });

  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Simple performance detection
    const checkPerformance = () => {
      const isLowEnd = 
        navigator.hardwareConcurrency <= 4 ||
        (navigator as any).deviceMemory < 4 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsLowPerformance(isLowEnd);
    };

    checkPerformance();
  }, []);

  const measureRenderTime = (callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    
    setMetrics(prev => ({ ...prev, renderTime: end - start }));
  };

  const measureInteractionDelay = (callback: () => void) => {
    const start = performance.now();
    requestAnimationFrame(() => {
      callback();
      const end = performance.now();
      setMetrics(prev => ({ ...prev, interactionDelay: end - start }));
    });
  };

  return {
    metrics,
    isLowPerformance,
    measureRenderTime,
    measureInteractionDelay,
  };
}