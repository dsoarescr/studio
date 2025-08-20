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
          <CardTitle className="text-2xl">Gerir Conta</CardTitle>
          <CardDescription>
            Veja e edite as informações da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Utilizador</Label>
              <Input id="username" defaultValue="PixelMaster" disabled />
            </div>
            <Button>Atualizar Informações</Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold">Subscrição</h3>
            <Card className="mt-4 bg-primary/10 border-primary/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Crown className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h4 className="font-semibold">Plano Premium</h4>
                    <p className="text-sm text-muted-foreground">Válido até 15/12/2025</p>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">Ativo</Badge>
              </CardContent>
            </Card>
            <Button variant="outline" className="mt-4">
              <CreditCard className="h-4 w-4 mr-2" />
              Gerir Subscrição
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Conta</CardTitle>
          <CardDescription>
            Exporte, importe ou elimine os seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Meus Dados
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importar Dados
            </Button>
          </div>

          <Separator />
          
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h3 className="font-semibold flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Zona de Perigo
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              A eliminação da sua conta é uma ação permanente e não pode ser revertida.
            </p>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}