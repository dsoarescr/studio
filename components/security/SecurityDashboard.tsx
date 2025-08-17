'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, Lock, Key, Smartphone, AlertTriangle, 
  CheckCircle, Eye, EyeOff, Laptop, Globe, 
  Clock, MapPin, RefreshCw, X
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'suspicious' | 'device_new';
  description: string;
  timestamp: string;
  location: string;
  device: string;
  status: 'success' | 'warning' | 'error';
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    description: 'Login bem-sucedido',
    timestamp: '2024-03-15 14:30',
    location: 'Lisboa, Portugal',
    device: 'Chrome - Windows',
    status: 'success'
  },
  {
    id: '2',
    type: 'device_new',
    description: 'Novo dispositivo detectado',
    timestamp: '2024-03-14 09:15',
    location: 'Porto, Portugal',
    device: 'Safari - iPhone',
    status: 'warning'
  },
  {
    id: '3',
    type: 'password_change',
    description: 'Password alterada',
    timestamp: '2024-03-10 16:45',
    location: 'Lisboa, Portugal',
    device: 'Chrome - Windows',
    status: 'success'
  }
];

const mockActiveSessions: ActiveSession[] = [
  {
    id: '1',
    device: 'Windows PC',
    browser: 'Chrome 122',
    location: 'Lisboa, Portugal',
    lastActive: 'Agora',
    current: true
  },
  {
    id: '2',
    device: 'iPhone 15',
    browser: 'Safari',
    location: 'Porto, Portugal',
    lastActive: '2 horas atrás',
    current: false
  }
];

export default function SecurityDashboard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { toast } = useToast();

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords não coincidem",
        description: "A nova password e confirmação devem ser iguais.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password fraca",
        description: "A password deve ter pelo menos 8 caracteres.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Password alterada",
      description: "A sua password foi alterada com sucesso.",
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleTerminateSession = (sessionId: string) => {
    toast({
      title: "Sessão terminada",
      description: "A sessão foi terminada com sucesso.",
    });
  };

  const getEventIcon = (type: string, status: string) => {
    switch (type) {
      case 'login':
        return status === 'success' ? 
          <CheckCircle className="h-4 w-4 text-green-500" /> : 
          <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'password_change':
        return <Key className="h-4 w-4 text-blue-500" />;
      case 'device_new':
        return <Smartphone className="h-4 w-4 text-yellow-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Shield className="h-6 w-6 mr-3 text-primary" />
            Segurança da Conta
          </CardTitle>
          <CardDescription>
            Gerencie as definições de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-green-500">Conta Segura</h3>
                <p className="text-xs text-muted-foreground">Sem atividade suspeita</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <Lock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-500">Password Forte</h3>
                <p className="text-xs text-muted-foreground">Última alteração: 5 dias</p>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-4 text-center">
                <Key className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-yellow-500">2FA Desativado</h3>
                <p className="text-xs text-muted-foreground">Recomendamos ativar</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Password</CardTitle>
          <CardDescription>
            Mantenha a sua conta segura com uma password forte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password Atual</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Password</Label>
            <Input
              id="new-password"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Password</Label>
            <Input
              id="confirm-password"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <Button onClick={handlePasswordChange}>
            <Key className="h-4 w-4 mr-2" />
            Alterar Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ativar 2FA</h3>
              <p className="text-sm text-muted-foreground">
                Use uma app de autenticação para gerar códigos
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          
          {!twoFactorEnabled && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-500">Recomendação de Segurança</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ative a autenticação de dois fatores para proteger melhor a sua conta.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>
            Gerencie os dispositivos com acesso à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockActiveSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {session.device.includes('iPhone') ? 
                    <Smartphone className="h-5 w-5" /> : 
                    <Laptop className="h-5 w-5" />
                  }
                </div>
                <div>
                  <h4 className="font-medium">{session.device}</h4>
                  <p className="text-sm text-muted-foreground">{session.browser}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.current ? (
                  <Badge className="bg-green-500">Atual</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Terminar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade de Segurança</CardTitle>
          <CardDescription>
            Histórico recente de eventos de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSecurityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-1 rounded-full bg-muted">
                  {getEventIcon(event.type, event.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.description}</h4>
                    <span className={`text-xs ${getStatusColor(event.status)}`}>
                      {event.status === 'success' ? 'Sucesso' : 
                       event.status === 'warning' ? 'Aviso' : 'Erro'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>{event.timestamp}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {event.device}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações de Segurança</CardTitle>
          <CardDescription>
            Configure como quer ser notificado sobre atividade suspeita
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notificações por Email</h3>
              <p className="text-sm text-muted-foreground">
                Receber alertas de segurança por email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}