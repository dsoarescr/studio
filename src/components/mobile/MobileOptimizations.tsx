'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, Wifi, Battery, Signal, Zap, Settings, 
  Download, Upload, Gauge, Eye, EyeOff, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/store';

interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export default function MobileOptimizations({ children }: MobileOptimizationsProps) {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [dataUsage, setDataUsage] = useState({ sent: 0, received: 0 });
  
  const { 
    performanceMode, 
    togglePerformanceMode, 
    highQualityRendering,
    toggleHighQualityRendering,
    animations,
    toggleAnimations
  } = useSettingsStore();
  
  const { toast } = useToast();

  // Monitorar informações da rede
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 100,
          saveData: connection.saveData || false
        });
      }
    };

    updateNetworkInfo();
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  // Monitorar bateria
  useEffect(() => {
    const updateBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          
          const updateBattery = () => {
            setBatteryInfo({
              level: battery.level,
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime
            });
          };
          
          updateBattery();
          
          battery.addEventListener('chargingchange', updateBattery);
          battery.addEventListener('levelchange', updateBattery);
          
          return () => {
            battery.removeEventListener('chargingchange', updateBattery);
            battery.removeEventListener('levelchange', updateBattery);
          };
        } catch (error) {
          console.log('Battery API not supported');
        }
      }
    };

    updateBatteryInfo();
  }, []);

  // Ativar modo de baixo consumo automaticamente
  useEffect(() => {
    const shouldActivateLowPower = 
      (batteryInfo && batteryInfo.level < 0.2 && !batteryInfo.charging) ||
      (networkInfo && (networkInfo.effectiveType === '2g' || networkInfo.effectiveType === 'slow-2g')) ||
      (networkInfo && networkInfo.saveData);

    if (shouldActivateLowPower && !isLowPowerMode) {
      setIsLowPowerMode(true);
      setShowOptimizations(true);
      
      toast({
        title: "Modo de Baixo Consumo Ativado",
        description: "Otimizações aplicadas para poupar bateria e dados.",
      });
    }
  }, [batteryInfo, networkInfo, isLowPowerMode]);

  // Simular uso de dados
  useEffect(() => {
    const interval = setInterval(() => {
      setDataUsage(prev => ({
        sent: prev.sent + Math.random() * 10,
        received: prev.received + Math.random() * 50
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getNetworkIcon = () => {
    if (!networkInfo) return <Wifi className="h-4 w-4" />;
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return <Signal className="h-4 w-4 text-red-500" />;
      case '3g':
        return <Signal className="h-4 w-4 text-yellow-500" />;
      case '4g':
        return <Signal className="h-4 w-4 text-green-500" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const getBatteryColor = () => {
    if (!batteryInfo) return 'text-gray-500';
    
    if (batteryInfo.level > 0.5) return 'text-green-500';
    if (batteryInfo.level > 0.2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const applyOptimizations = () => {
    if (!performanceMode) togglePerformanceMode();
    if (highQualityRendering) toggleHighQualityRendering();
    if (animations) toggleAnimations();
    
    toast({
      title: "Otimizações Aplicadas",
      description: "Configurações ajustadas para melhor performance mobile.",
    });
    
    setShowOptimizations(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="relative">
      {children}
      
      {/* Indicador de status mobile */}
      <div className="fixed top-16 right-4 z-40 flex flex-col gap-2">
        {/* Status da rede */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border"
        >
          <div className="flex items-center gap-2">
            {getNetworkIcon()}
            <span className="text-xs font-medium">
              {networkInfo?.effectiveType?.toUpperCase() || 'WiFi'}
            </span>
            {networkInfo?.saveData && (
              <Badge variant="outline" className="text-xs">
                Economia
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Status da bateria */}
        {batteryInfo && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border"
          >
            <div className="flex items-center gap-2">
              <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
              <span className="text-xs font-medium">
                {Math.round(batteryInfo.level * 100)}%
              </span>
              {batteryInfo.charging && (
                <Zap className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          </motion.div>
        )}

        {/* Uso de dados */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border"
        >
          <div className="text-xs">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3 text-green-500" />
              <span>{formatBytes(dataUsage.received * 1024)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Upload className="h-3 w-3 text-blue-500" />
              <span>{formatBytes(dataUsage.sent * 1024)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de otimizações */}
      <AnimatePresence>
        {showOptimizations && (
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
            >
              <Card className="max-w-md w-full">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Otimizar para Mobile</h3>
                    <p className="text-muted-foreground">
                      Detetámos condições que podem afetar a performance. Quer aplicar otimizações?
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {batteryInfo && batteryInfo.level < 0.2 && (
                      <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                        <Battery className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-red-500">Bateria Baixa</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(batteryInfo.level * 100)}% restante
                          </p>
                        </div>
                      </div>
                    )}

                    {networkInfo && networkInfo.effectiveType === '2g' && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                        <Signal className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-yellow-500">Conexão Lenta</p>
                          <p className="text-sm text-muted-foreground">
                            Rede {networkInfo.effectiveType.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}

                    {networkInfo?.saveData && (
                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                        <Download className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-blue-500">Economia de Dados</p>
                          <p className="text-sm text-muted-foreground">
                            Modo ativo no dispositivo
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Otimizações Sugeridas:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        Ativar modo de performance
                      </li>
                      <li className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-primary" />
                        Reduzir qualidade visual
                      </li>
                      <li className="flex items-center gap-2">
                        <VolumeX className="h-4 w-4 text-primary" />
                        Desativar animações
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowOptimizations(false)}
                    >
                      Agora Não
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={applyOptimizations}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Otimizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de otimizações manuais */}
      {(batteryInfo?.level && batteryInfo.level < 0.5) || 
       (networkInfo?.effectiveType && ['2g', 'slow-2g'].includes(networkInfo.effectiveType)) ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOptimizations(true)}
          className="fixed bottom-24 right-4 z-40 bg-card/90 backdrop-blur-sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Otimizar
        </Button>
      ) : null}
    </div>
  );
}

// Hook para otimizações automáticas
export function useMobileOptimizations() {
  const [isOptimized, setIsOptimized] = useState(false);
  const { performanceMode, togglePerformanceMode } = useSettingsStore();

  useEffect(() => {
    // Verificar se é dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Verificar recursos do dispositivo
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (isMobile && (hasLowMemory || hasSlowCPU) && !performanceMode) {
      setIsOptimized(true);
      togglePerformanceMode();
    }
  }, [performanceMode, togglePerformanceMode]);

  return { isOptimized };
}