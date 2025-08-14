'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, Download, Upload, AlertTriangle, Trash2 } from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Gerencie as informações da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value="pixelmaster@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Utilizador</Label>
            <Input id="username" value="PixelMasterPT" disabled />
            <p className="text-xs text-muted-foreground">O nome de utilizador não pode ser alterado.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscrição</CardTitle>
          <CardDescription>Gerencie o seu plano de subscrição.</CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold flex items-center">
                    <Crown className="h-5 w-5 text-amber-500 mr-2" />
                    Plano Premium
                  </h4>
                  <p className="text-sm text-muted-foreground">Ativo até 15/12/2025</p>
                </div>
                <Badge className="bg-amber-500">Ativo</Badge>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gerir Subscrição
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Conta</CardTitle>
          <CardDescription>Exporte, importe ou elimine os dados da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Importar Dados
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-destructive">Zona de Perigo</h3>
            <Button variant="destructive" className="w-full justify-start text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Eliminar Conta Permanentemente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
