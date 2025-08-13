'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAppStore, usePixelStore } from '@/lib/store';
import { 
  WifiOff, Wifi, Download, Upload, Database, 
  RefreshCw, AlertTriangle, CheckCircle, Clock,
  HardDrive, Trash2, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineData {
  pixels: any[];
  userProfile: any;
  achievements: any[];
  lastSync: string;
  size: number;
}

export function OfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOfflinePanel, setShowOfflinePanel] = useState(false);
  
  const { pendingActions, clearPendingActions, updateLastSync } = useAppStore();
  const { soldPixels } = usePixelStore();
  const { toast } = useToast();

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingActions.length > 0) {
        syncPendingActions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflinePanel(true);
      cacheCurrentData();
    };

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data on mount
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingActions]);

  const cacheCurrentData = async () => {
    try {
      const dataToCache: OfflineData = {
        pixels: soldPixels,
        userProfile: {
          // Get current user data from store
        },
        achievements: [],
        lastSync: new Date().toISOString(),
        size: 0
      };

      const dataString = JSON.stringify(dataToCache);
      dataToCache.size = new Blob([dataString]).size;

      localStorage.setItem('pixel-universe-offline-data', dataString);
      setOfflineData(dataToCache);

      console.log('Data cached for offline use');
    } catch (error) {
      console.error('Failed to cache offline data:', error);
    }
  };

  const loadOfflineData = () => {
    try {
      const cached = localStorage.getItem('pixel-universe-offline-data');
      if (cached) {
        const data = JSON.parse(cached) as OfflineData;
        setOfflineData(data);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      for (let i = 0; i < pendingActions.length; i++) {
        const action = pendingActions[i];
        
        // Simulate API call to sync action
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSyncProgress(((i + 1) / pendingActions.length) * 100);
      }

      clearPendingActions();
      updateLastSync();
      
      toast({
        title: 'Sincronização Completa',
        description: `${pendingActions.length} ações foram sincronizadas.`,
      });
    } catch (error) {
      toast({
        title: 'Erro na Sincronização',
        description: 'Algumas ações não puderam ser sincronizadas.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const clearOfflineData = () => {
    localStorage.removeItem('pixel-universe-offline-data');
    setOfflineData(null);
    toast({
      title: 'Dados Offline Limpos',
      description: 'Todos os dados offline foram removidos.',
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4"
          >
            <Card className="bg-orange-500/90 text-white border-orange-500">
              <CardContent className="p-3 flex items-center gap-3">
                <WifiOff className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">Modo Offline</p>
                  <p className="text-sm opacity-90">
                    {pendingActions.length > 0 
                      ? `${pendingActions.length} ações pendentes`
                      : 'Funcionalidade limitada disponível'
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOfflinePanel(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sync Progress */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <Card className="w-80 bg-card/95 backdrop-blur-xl border-primary/30">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <RefreshCw className="h-8 w-8 text-primary mx-auto animate-spin" />
                </div>
                <h3 className="font-semibold mb-2">Sincronizando Dados</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enviando ações pendentes para o servidor...
                </p>
                <Progress value={syncProgress} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(syncProgress)}% concluído
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Panel */}
      <AnimatePresence>
        {showOfflinePanel && (
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
              className="w-full max-w-md"
            >
              <Card className="bg-card/95 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {isOnline ? (
                        <Wifi className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <WifiOff className="h-5 w-5 mr-2 text-orange-500" />
                      )}
                      {isOnline ? 'Online' : 'Modo Offline'}
                    </CardTitle>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowOfflinePanel(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Connection Status */}
                  <div className={`p-3 rounded-lg ${
                    isOnline ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isOnline ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      <span className="font-medium">
                        {isOnline ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isOnline 
                        ? 'Todas as funcionalidades estão disponíveis.'
                        : 'Funcionalidade limitada. Algumas ações serão sincronizadas quando voltar online.'
                      }
                    </p>
                  </div>

                  {/* Pending Actions */}
                  {pendingActions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Ações Pendentes ({pendingActions.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {pendingActions.slice(0, 5).map((action, index) => (
                          <div key={action.id} className="text-sm p-2 bg-muted/20 rounded">
                            <span className="font-medium">{action.type}</span>
                            <span className="text-muted-foreground ml-2">
                              {new Date(action.timestamp).toLocaleTimeString('pt-PT')}
                            </span>
                          </div>
                        ))}
                        {pendingActions.length > 5 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{pendingActions.length - 5} mais ações
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Offline Data Info */}
                  {offlineData && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Dados Offline
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-muted/20 rounded text-center">
                          <div className="font-bold">{offlineData.pixels.length}</div>
                          <div className="text-muted-foreground">Pixels</div>
                        </div>
                        <div className="p-2 bg-muted/20 rounded text-center">
                          <div className="font-bold">{formatBytes(offlineData.size)}</div>
                          <div className="text-muted-foreground">Tamanho</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Última sincronização: {new Date(offlineData.lastSync).toLocaleString('pt-PT')}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    {isOnline && pendingActions.length > 0 && (
                      <Button 
                        onClick={syncPendingActions}
                        disabled={isSyncing}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Sincronizar Agora
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={cacheCurrentData}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Atualizar Cache Offline
                    </Button>
                    
                    {offlineData && (
                      <Button 
                        variant="outline" 
                        onClick={clearOfflineData}
                        className="w-full text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar Dados Offline
                      </Button>
                    )}
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

// Hook for offline functionality
export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const { addPendingAction } = useAppStore();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check for offline data
    const offlineData = localStorage.getItem('pixel-universe-offline-data');
    setHasOfflineData(!!offlineData);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueAction = (type: string, data: any) => {
    if (!isOnline) {
      addPendingAction({ type, data });
      return true; // Action queued
    }
    return false; // Execute normally
  };

  const canUseFeature = (feature: string) => {
    const offlineFeatures = ['view-pixels', 'browse-gallery', 'view-profile', 'view-achievements'];
    return isOnline || offlineFeatures.includes(feature);
  };

  return {
    isOnline,
    hasOfflineData,
    queueAction,
    canUseFeature,
  };
}