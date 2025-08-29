'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Lock,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  LogOut,
  RefreshCw,
  Laptop,
  Globe,
  Clock,
  Info,
  Settings,
  User,
  Mail,
  CreditCard,
  FileText,
  Key,
  Bell,
  Wifi,
  Battery,
  Signal,
  Download,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
} from 'lucide-react';

export default function SecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(65);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [isRecoveryEmailSet, setIsRecoveryEmailSet] = useState(false);
  const [isActivityAlertsEnabled, setIsActivityAlertsEnabled] = useState(true);
  const [isLocationTrackingEnabled, setIsLocationTrackingEnabled] = useState(false);
  const [isDataEncryptionEnabled, setIsDataEncryptionEnabled] = useState(true);

  const { toast } = useToast();

  const activeSessions = [
    {
      device: 'Chrome - Windows',
      location: 'Lisboa, Portugal',
      ip: '192.168.1.xxx',
      lastActive: 'Agora',
      isCurrent: true,
    },
    {
      device: 'Safari - iPhone',
      location: 'Porto, Portugal',
      ip: '192.168.2.xxx',
      lastActive: '2 horas atrás',
      isCurrent: false,
    },
  ];

  const recentActivity = [
    {
      action: 'Login bem-sucedido',
      device: 'Chrome - Windows',
      location: 'Lisboa, Portugal',
      time: 'Agora',
      status: 'success',
    },
    {
      action: 'Alteração de password',
      device: 'Chrome - Windows',
      location: 'Lisboa, Portugal',
      time: '2 dias atrás',
      status: 'success',
    },
    {
      action: 'Tentativa de login falhada',
      device: 'Desconhecido',
      location: 'Madrid, Espanha',
      time: '5 dias atrás',
      status: 'warning',
    },
  ];

  const handleToggle2FA = (enabled: boolean) => {
    if (enabled) {
      // Don't actually enable here, the TwoFactorAuth component will handle it
      return;
    }

    setIs2FAEnabled(false);
    setSecurityScore(Math.max(30, securityScore - 30));
    toast({
      title: 'Autenticação de Dois Fatores Desativada',
      description: 'A sua conta está agora menos segura.',
      variant: 'destructive',
    });
  };

  const handleToggleActivityAlerts = (enabled: boolean) => {
    setIsActivityAlertsEnabled(enabled);
    setSecurityScore(Math.min(100, Math.max(0, securityScore + (enabled ? 5 : -5))));
    toast({
      title: enabled ? 'Alertas de Atividade Ativados' : 'Alertas de Atividade Desativados',
      description: enabled
        ? 'Receberá notificações sobre atividades suspeitas.'
        : 'Não receberá notificações sobre atividades suspeitas.',
    });
  };

  const handleToggleLocationTracking = (enabled: boolean) => {
    setIsLocationTrackingEnabled(enabled);
    toast({
      title: enabled ? 'Rastreio de Localização Ativado' : 'Rastreio de Localização Desativado',
      description: enabled
        ? 'A sua localização será verificada para detetar acessos suspeitos.'
        : 'A sua localização não será verificada para detetar acessos suspeitos.',
    });
  };

  const handleToggleDataEncryption = (enabled: boolean) => {
    setIsDataEncryptionEnabled(enabled);
    setSecurityScore(Math.min(100, Math.max(0, securityScore + (enabled ? 10 : -10))));
    toast({
      title: enabled ? 'Encriptação de Dados Ativada' : 'Encriptação de Dados Desativada',
      description: enabled
        ? 'Os seus dados serão encriptados para maior segurança.'
        : 'Os seus dados não serão encriptados.',
    });
  };

  const handleTerminateSession = (index: number) => {
    toast({
      title: 'Sessão Terminada',
      description: `A sessão em ${activeSessions[index].device} foi terminada com sucesso.`,
    });
  };

  const handleTerminateAllSessions = () => {
    toast({
      title: 'Todas as Sessões Terminadas',
      description: 'Todas as outras sessões foram terminadas com sucesso.',
    });
  };

  const handleDownloadData = () => {
    toast({
      title: 'Exportação de Dados Iniciada',
      description: 'Receberá um email quando os seus dados estiverem prontos para download.',
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Pedido de Eliminação Recebido',
      description: 'Receberá um email com instruções para confirmar a eliminação da sua conta.',
      variant: 'destructive',
    });
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 shadow-2xl">
        <div
          className="animate-shimmer absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          style={{ backgroundSize: '200% 200%' }}
        />
        <CardHeader className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-gradient-gold flex items-center font-headline text-3xl">
                <Shield className="animate-glow mr-3 h-8 w-8" />
                Centro de Segurança
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                Proteja a sua conta e os seus dados no Pixel Universe
              </CardDescription>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-background/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-medium">Pontuação de Segurança</h3>
                <Badge
                  variant={
                    securityScore >= 80
                      ? 'default'
                      : securityScore >= 50
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {securityScore}/100
                </Badge>
              </div>
              <Progress
                value={securityScore}
                className="h-2.5 w-full"
                style={
                  {
                    '--progress-background':
                      securityScore >= 80
                        ? 'hsl(var(--primary))'
                        : securityScore >= 50
                          ? 'hsl(var(--warning))'
                          : 'hsl(var(--destructive))',
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Security Features */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Funcionalidades de Segurança
            </CardTitle>
            <CardDescription>
              Configure as funcionalidades de segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Autenticação de Dois Fatores (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch checked={is2FAEnabled} onCheckedChange={handleToggle2FA} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Alertas de Atividade Suspeita</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre logins de novos dispositivos ou localizações
                  </p>
                </div>
                <Switch
                  checked={isActivityAlertsEnabled}
                  onCheckedChange={handleToggleActivityAlerts}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Verificação de Localização</Label>
                  <p className="text-sm text-muted-foreground">
                    Verificar a localização para detetar acessos suspeitos
                  </p>
                </div>
                <Switch
                  checked={isLocationTrackingEnabled}
                  onCheckedChange={handleToggleLocationTracking}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Encriptação de Dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Encriptar os seus dados para maior segurança
                  </p>
                </div>
                <Switch
                  checked={isDataEncryptionEnabled}
                  onCheckedChange={handleToggleDataEncryption}
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-4">
              <h3 className="mb-2 flex items-center font-medium">
                <Info className="mr-2 h-4 w-4 text-primary" />
                Recomendações de Segurança
              </h3>
              <ul className="space-y-2 text-sm">
                {!is2FAEnabled && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>Ative a autenticação de dois fatores para maior segurança</span>
                  </li>
                )}
                {!isPasswordStrong && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>A sua password não é suficientemente forte. Considere alterá-la.</span>
                  </li>
                )}
                {!isRecoveryEmailSet && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>
                      Configure um email de recuperação para recuperar a sua conta em caso de perda
                      de acesso.
                    </span>
                  </li>
                )}
                {is2FAEnabled && isPasswordStrong && isRecoveryEmailSet && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>
                      A sua conta está bem protegida. Continue a verificar regularmente a atividade
                      da conta.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Laptop className="mr-2 h-5 w-5 text-primary" />
              Sessões Ativas
            </CardTitle>
            <CardDescription>Dispositivos atualmente conectados à sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSessions.map((session, index) => (
              <div key={index} className="rounded-lg bg-muted/20 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    {session.device.includes('Windows') ? (
                      <Laptop className="mr-2 h-4 w-4 text-blue-500" />
                    ) : (
                      <Smartphone className="mr-2 h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{session.device}</span>
                  </div>
                  {session.isCurrent ? (
                    <Badge className="bg-green-500">Atual</Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600"
                      onClick={() => handleTerminateSession(index)}
                    >
                      Terminar
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Globe className="mr-1 h-3 w-3" />
                    <span>{session.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{session.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={handleTerminateAllSessions}
            >
              <LogOut className="mr-2 h-3 w-3" />
              Terminar Todas as Outras Sessões
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Histórico recente de atividade da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="rounded-lg bg-muted/20 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      {activity.status === 'success' ? (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : activity.status === 'warning' ? (
                        <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                      ) : (
                        <Info className="mr-2 h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-medium">{activity.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      {activity.device.includes('Windows') ? (
                        <Laptop className="mr-1 h-3 w-3" />
                      ) : activity.device.includes('iPhone') ? (
                        <Smartphone className="mr-1 h-3 w-3" />
                      ) : (
                        <Globe className="mr-1 h-3 w-3" />
                      )}
                      <span>{activity.device}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="mr-1 h-3 w-3" />
                      <span>{activity.location}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full">
                Ver Histórico Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Privacidade & Dados
            </CardTitle>
            <CardDescription>Gerencie os seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={handleDownloadData}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados Pessoais
              </Button>

              <Button variant="outline" className="w-full justify-start text-sm">
                <Settings className="mr-2 h-4 w-4" />
                Preferências de Privacidade
              </Button>

              <Button variant="outline" className="w-full justify-start text-sm">
                <HelpCircle className="mr-2 h-4 w-4" />
                Política de Privacidade
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-destructive">Zona de Perigo</h3>
              <Button
                variant="destructive"
                className="w-full justify-start text-sm"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two Factor Authentication - Simplified */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Autenticação de Dois Fatores
            </CardTitle>
            <CardDescription>
              Proteja a sua conta com uma camada adicional de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 rounded-lg bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Segurança Reforçada</h3>
                  <p className="text-sm text-muted-foreground">
                    Mesmo que alguém descubra a sua password, não conseguirá aceder à sua conta sem
                    o código de autenticação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Código no Seu Telemóvel</h3>
                  <p className="text-sm text-muted-foreground">
                    Use uma aplicação de autenticação como Google Authenticator, Microsoft
                    Authenticator ou Authy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Chaves de Recuperação</h3>
                  <p className="text-sm text-muted-foreground">
                    Receberá chaves de recuperação para aceder à sua conta caso perca o seu
                    dispositivo.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setIs2FAEnabled(true);
                setSecurityScore(Math.min(100, securityScore + 30));
                toast({
                  title: 'Autenticação de Dois Fatores Ativada',
                  description: 'A sua conta está agora mais segura com 2FA.',
                });
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Configurar 2FA
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
