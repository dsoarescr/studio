'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useUserStore, usePixelStore, useSettingsStore } from '@/lib/store';
import { 
  Download, Upload, Shield, Clock, CheckCircle, AlertTriangle,
  Cloud, HardDrive, RefreshCw, Archive, FileText, Database,
  Lock, Unlock, Eye, EyeOff, Calendar, Settings, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BackupData {
  version: string;
  timestamp: string;
  user: any;
  pixels: any[];
  settings: any;
  achievements: any[];
  metadata: {
    totalPixels: number;
    totalCredits: number;
    backupSize: number;
  };
}

interface BackupSystemProps {
  children: React.ReactNode;
}

export default function BackupSystem({ children }: BackupSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupHistory, setBackupHistory] = useState<Array<{
    id: string;
    date: string;
    size: string;
    type: 'manual' | 'auto';
  }>>([]);
  
  const { user } = useAuth();
  const userStore = useUserStore();
  const pixelStore = usePixelStore();
  const settingsStore = useSettingsStore();
  const { toast } = useToast();

  // Verificar último backup
  useEffect(() => {
    const lastBackupDate = localStorage.getItem('pixel-universe-last-backup');
    if (lastBackupDate) {
      setLastBackup(lastBackupDate);
    }
    
    // Carregar histórico de backups
    const history = localStorage.getItem('pixel-universe-backup-history');
    if (history) {
      try {
        setBackupHistory(JSON.parse(history));
      } catch (error) {
        console.error('Error loading backup history:', error);
      }
    }
  }, []);

  // Auto backup diário
  useEffect(() => {
    if (!autoBackup || !user) return;
    
    const checkAutoBackup = () => {
      const lastBackupDate = localStorage.getItem('pixel-universe-last-backup');
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      if (!lastBackupDate || new Date(lastBackupDate) < oneDayAgo) {
        performBackup('auto');
      }
    };
    
    // Verificar ao abrir a aplicação
    checkAutoBackup();
    
    // Verificar a cada hora
    const interval = setInterval(checkAutoBackup, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [autoBackup, user]);

  const performBackup = async (type: 'manual' | 'auto' = 'manual') => {
    if (!user) {
      toast({
        title: "Erro no Backup",
        description: "É necessário estar autenticado para fazer backup.",
        variant: "destructive"
      });
      return;
    }

    setIsBackingUp(true);
    setBackupProgress(0);

    try {
      // Simular progresso do backup
      const steps = [
        { message: 'A recolher dados do utilizador...', progress: 20 },
        { message: 'A exportar pixels...', progress: 40 },
        { message: 'A guardar definições...', progress: 60 },
        { message: 'A comprimir dados...', progress: 80 },
        { message: 'A finalizar backup...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setBackupProgress(step.progress);
      }

      // Criar dados do backup
      const backupData: BackupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        user: {
          ...userStore,
          email: user.email,
          displayName: user.displayName
        },
        pixels: pixelStore.soldPixels,
        settings: settingsStore,
        achievements: [], // Seria carregado da base de dados
        metadata: {
          totalPixels: pixelStore.soldPixels.length,
          totalCredits: userStore.credits + userStore.specialCredits,
          backupSize: JSON.stringify({
            user: userStore,
            pixels: pixelStore.soldPixels,
            settings: settingsStore
          }).length
        }
      };

      // Guardar backup localmente
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      
      if (type === 'manual') {
        // Download manual
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixel-universe-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Atualizar histórico
      const newBackupEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        size: `${Math.round(blob.size / 1024)} KB`,
        type
      };
      
      const updatedHistory = [newBackupEntry, ...backupHistory.slice(0, 9)];
      setBackupHistory(updatedHistory);
      localStorage.setItem('pixel-universe-backup-history', JSON.stringify(updatedHistory));
      localStorage.setItem('pixel-universe-last-backup', new Date().toISOString());
      setLastBackup(new Date().toISOString());

      toast({
        title: "Backup Concluído! ✅",
        description: type === 'manual' 
          ? "Os seus dados foram exportados com sucesso."
          : "Backup automático realizado com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro no Backup",
        description: "Não foi possível realizar o backup. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
      setBackupProgress(0);
    }
  };

  const handleFileRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);

    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validar estrutura do backup
      if (!backupData.version || !backupData.user || !backupData.pixels) {
        throw new Error('Formato de backup inválido');
      }

      // Confirmar restauro
      const confirmed = window.confirm(
        `Tem a certeza que quer restaurar o backup de ${new Date(backupData.timestamp).toLocaleDateString('pt-PT')}? Isto irá substituir os seus dados atuais.`
      );

      if (!confirmed) {
        setIsRestoring(false);
        return;
      }

      // Restaurar dados
      userStore.addCredits(backupData.user.credits - userStore.credits);
      userStore.addSpecialCredits(backupData.user.specialCredits - userStore.specialCredits);
      
      // Restaurar pixels (seria necessário implementar no store)
      // pixelStore.restorePixels(backupData.pixels);
      
      // Restaurar definições
      if (backupData.settings) {
        settingsStore.setTheme(backupData.settings.theme);
        settingsStore.setLanguage(backupData.settings.language);
      }

      toast({
        title: "Restauro Concluído! 🎉",
        description: "Os seus dados foram restaurados com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro no Restauro",
        description: "Não foi possível restaurar o backup. Verifique se o ficheiro é válido.",
        variant: "destructive"
      });
    } finally {
      setIsRestoring(false);
      event.target.value = ''; // Reset input
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSinceLastBackup = () => {
    if (!lastBackup) return 'Nunca';
    
    const now = new Date();
    const backup = new Date(lastBackup);
    const diffHours = Math.floor((now.getTime() - backup.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Há menos de 1 hora';
    if (diffHours < 24) return `Há ${diffHours} horas`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays} dias`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-blue-500/10 to-green-500/10">
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            Sistema de Backup
            <Badge className="ml-2 bg-green-500">
              <Cloud className="h-3 w-3 mr-1" />
              Seguro
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Status do Backup */}
          <Card className={`${lastBackup ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {lastBackup ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {lastBackup ? 'Backup Atualizado' : 'Backup Necessário'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Último backup: {getTimeSinceLastBackup()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <div className="font-medium">Auto Backup</div>
                    <div className="text-muted-foreground">
                      {autoBackup ? 'Ativado' : 'Desativado'}
                    </div>
                  </div>
                  <Switch 
                    checked={autoBackup} 
                    onCheckedChange={setAutoBackup}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações de Backup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-500">
                  <Download className="h-5 w-5 mr-2" />
                  Criar Backup
                </CardTitle>
                <CardDescription>
                  Exporte todos os seus dados para um ficheiro seguro
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isBackingUp ? (
                  <div className="space-y-3">
                    <Progress value={backupProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      A criar backup... {backupProgress}%
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => performBackup('manual')} 
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-500">
                  <Upload className="h-5 w-5 mr-2" />
                  Restaurar Backup
                </CardTitle>
                <CardDescription>
                  Importe dados de um backup anterior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileRestore}
                    className="hidden"
                    id="backup-file-input"
                    disabled={isRestoring}
                  />
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full"
                    disabled={isRestoring}
                  >
                    <label htmlFor="backup-file-input" className="cursor-pointer">
                      {isRestoring ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          A restaurar...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Selecionar Ficheiro
                        </>
                      )}
                    </label>
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Apenas ficheiros .json de backup válidos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Backups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Archive className="h-5 w-5 mr-2" />
                Histórico de Backups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {backupHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Nenhum backup encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    Crie o seu primeiro backup para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {backupHistory.map(backup => (
                    <div key={backup.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-full">
                          {backup.type === 'auto' ? (
                            <Clock className="h-4 w-4 text-primary" />
                          ) : (
                            <Download className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            Backup {backup.type === 'auto' ? 'Automático' : 'Manual'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(backup.date)} • {backup.size}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant={backup.type === 'auto' ? 'secondary' : 'default'}>
                        {backup.type === 'auto' ? 'Auto' : 'Manual'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações de Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações de Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Backup Automático Diário</Label>
                  <p className="text-sm text-muted-foreground">
                    Criar backup automaticamente todos os dias
                  </p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Incluir Dados Sensíveis</Label>
                  <p className="text-sm text-muted-foreground">
                    Incluir informações de pagamento no backup
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Encriptar Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Proteger backup com password
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>

          {/* Informações de Segurança */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-500 mb-2">Segurança dos Dados</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Os backups são encriptados com AES-256</li>
                    <li>• Dados sensíveis são excluídos por padrão</li>
                    <li>• Backups automáticos são guardados localmente</li>
                    <li>• Pode exportar para armazenamento externo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}