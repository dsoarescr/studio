'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Shield, Lock, Key, AlertTriangle } from 'lucide-react';

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Painel de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Pontuação de Segurança</h3>
              <p className="text-sm text-muted-foreground">Sua conta está bem protegida</p>
            </div>
            <Badge className="bg-green-500">85/100</Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span className="text-sm">Password Forte</span>
              </div>
              <Badge className="bg-green-500">✓</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Autenticação de Dois Fatores</span>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Verificação de Email</span>
              </div>
              <Button variant="outline" size="sm">Verificar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}