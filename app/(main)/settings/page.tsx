'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettingsStore, useUserStore } from '@/lib/store';

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useSettingsStore();
  const { credits } = useUserStore();

  const [activeTab, setActiveTab] = useState('appearance');

  const handleSaveSettings = () => {
    toast({
      title: 'Definições Guardadas',
      description: 'As suas preferências foram atualizadas com sucesso.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto mb-16 max-w-6xl space-y-6 px-4 py-6">
        {/* Header */}
        <Card className="border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 shadow-2xl">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-gradient-gold flex items-center font-headline text-3xl">
                  <Settings className="mr-3 h-8 w-8" />
                  Definições
                </CardTitle>
                <p className="mt-2 text-muted-foreground">
                  Personalize a sua experiência no Pixel Universe
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Settings Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <Card className="h-fit lg:col-span-1">
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex h-auto w-full flex-col space-y-1 bg-transparent">
                  <TabsTrigger
                    value="appearance"
                    className="h-auto w-full justify-start px-3 py-2 text-left"
                  >
                    Aparência
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="h-auto w-full justify-start px-3 py-2 text-left"
                  >
                    Conta
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-4 rounded-lg bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Créditos</p>
                <p className="font-bold text-primary">{credits.toLocaleString('pt-PT')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <Tabs value={activeTab}>
                {/* Appearance Tab */}
                <TabsContent value="appearance" className="mt-0 space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Tema</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          theme === 'light' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setTheme('light')}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                          <Sun className="mb-2 h-8 w-8 text-orange-400" />
                          <h4 className="font-medium">Claro</h4>
                          <p className="text-xs text-muted-foreground">Tema luminoso</p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          theme === 'dark' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setTheme('dark')}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                          <Moon className="mb-2 h-8 w-8 text-blue-400" />
                          <h4 className="font-medium">Escuro</h4>
                          <p className="text-xs text-muted-foreground">Tema noturno</p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          theme === 'system' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setTheme('system')}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                          <Monitor className="mb-2 h-8 w-8 text-purple-400" />
                          <h4 className="font-medium">Sistema</h4>
                          <p className="text-xs text-muted-foreground">Segue o tema do sistema</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="mt-0 space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Informações da Conta</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <input
                          id="email"
                          type="email"
                          defaultValue="user@example.com"
                          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="username">Nome de Utilizador</Label>
                          <input
                            id="username"
                            defaultValue="PixelMaster"
                            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="displayName">Nome de Exibição</Label>
                          <input
                            id="displayName"
                            defaultValue="Pixel Master"
                            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
