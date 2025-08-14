'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/lib/store";
import { Bell, ShoppingCart, Trophy, MessageSquare, BellRing, Volume2 } from "lucide-react";

export default function NotificationsSettingsPage() {
  const { 
    notifications, 
    toggleNotifications, 
    soundEffects, 
    toggleSoundEffects 
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificações</CardTitle>
          <CardDescription>Controle como e quando recebe notificações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Notificações</Label>
              <p className="text-sm text-muted-foreground">Ativar/desativar todas as notificações</p>
            </div>
            <Switch checked={notifications} onCheckedChange={toggleNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Sons de Notificação</Label>
              <p className="text-sm text-muted-foreground">Reproduzir sons ao receber notificações</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Switch checked={soundEffects} onCheckedChange={toggleSoundEffects} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificação</CardTitle>
          <CardDescription>Escolha quais notificações deseja receber.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-base">Compras e Vendas</Label>
                <p className="text-sm text-muted-foreground">Notificações de transações no marketplace</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <Label className="text-base">Conquistas</Label>
                <p className="text-sm text-muted-foreground">Notificações de conquistas desbloqueadas</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base">Comentários e Menções</Label>
                <p className="text-sm text-muted-foreground">Notificações de interações sociais</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-red-500" />
              <div>
                <Label className="text-base">Eventos e Anúncios</Label>
                <p className="text-sm text-muted-foreground">Notificações sobre eventos e novidades</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
