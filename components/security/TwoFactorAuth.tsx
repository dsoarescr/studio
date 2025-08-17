'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Shield, Smartphone, Key, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode.react';

interface TwoFactorAuthProps {
  children: React.ReactNode;
}

export default function TwoFactorAuth({ children }: TwoFactorAuthProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { toast } = useToast();

  const secretKey = 'JBSWY3DPEHPK3PXP'; // Mock secret key
  const qrCodeUrl = `otpauth://totp/PixelUniverse:user@example.com?secret=${secretKey}&issuer=PixelUniverse`;

  const handleVerify = () => {
    if (verificationCode === '123456') { // Mock verification
      setStep('complete');
      setIsEnabled(true);
      setBackupCodes(['ABC123', 'DEF456', 'GHI789', 'JKL012']);
      toast({
        title: "2FA Ativado",
        description: "Autenticação de dois fatores configurada com sucesso.",
      });
    } else {
      toast({
        title: "Código Inválido",
        description: "Por favor, verifique o código e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDisable = () => {
    setIsEnabled(false);
    setStep('setup');
    toast({
      title: "2FA Desativado",
      description: "Autenticação de dois fatores foi desativada.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Autenticação de Dois Fatores
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {isEnabled ? (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 text-center">
                <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-green-500">2FA Ativo</h3>
                <p className="text-sm text-muted-foreground">
                  Sua conta está protegida com autenticação de dois fatores
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleDisable}
                >
                  Desativar 2FA
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {step === 'setup' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <QRCode value={qrCodeUrl} size={200} className="mx-auto" />
                    <p className="text-sm text-muted-foreground mt-4">
                      Escaneie este código QR com uma app de autenticação como Google Authenticator
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Ou insira manualmente:</Label>
                    <Input value={secretKey} readOnly className="font-mono text-center" />
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => setStep('verify')}
                  >
                    Continuar
                  </Button>
                </div>
              )}
              
              {step === 'verify' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold">Verificar Configuração</h3>
                    <p className="text-sm text-muted-foreground">
                      Insira o código de 6 dígitos da sua app de autenticação
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Código de Verificação</Label>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="text-center font-mono text-lg"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep('setup')}
                    >
                      Voltar
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleVerify}
                      disabled={verificationCode.length !== 6}
                    >
                      Verificar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}