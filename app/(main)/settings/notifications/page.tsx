'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/lib/store';
import { Bell, ShoppingCart, Trophy, MessageSquare, BellRing, Volume2 } from 'lucide-react';

export default function NotificationSettingsPage() {
  const { notifications, toggleNotifications, soundEffects, toggleSoundEffects } =
    useSettingsStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Bell className="mr-3 h-6 w-6 text-primary" />
            Notificações
          </CardTitle>
          <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Notificações Gerais</Label>
              <Switch checked={notifications} onCheckedChange={toggleNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-base">Sons de Notificação</Label>
              <Switch checked={soundEffects} onCheckedChange={toggleSoundEffects} />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Notificações por Email</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Resumos Semanais</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Notícias e Atualizações</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Ofertas e Promoções</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Notificações Push</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                  <Label>Compras e Vendas</Label>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <Label>Conquistas</Label>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <Label>Comentários e Menções</Label>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-red-500" />
                  <Label>Eventos Especiais</Label>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t pt-6">
            <Button>Guardar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
