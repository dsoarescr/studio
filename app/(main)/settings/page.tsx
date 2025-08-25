'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Moon, Sun, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettingsStore, useUserStore } from "@/lib/store";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useSettingsStore();
  const { credits } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('appearance');

  const handleSaveSettings = () => {
    toast({
      title: "Definições Guardadas",
      description: "As suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 mb-16 space-y-6 max-w-6xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <Settings className="h-8 w-8 mr-3" />
                  Definições
                </CardTitle>
                <p className="text-muted-foreground mt-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-4">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
                  <TabsTrigger 
                    value="appearance" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    Aparência
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    Conta
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
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
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          theme === 'light' ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setTheme('light')}
                      >
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <Sun className="h-8 w-8 mb-2 text-orange-400" />
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
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <Moon className="h-8 w-8 mb-2 text-blue-400" />
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
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <Monitor className="h-8 w-8 mb-2 text-purple-400" />
                          <h4 className="font-medium">Sistema</h4>
                          <p className="text-xs text-muted-foreground">Segue o tema do sistema</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações da Conta</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <input
                          id="email"
                          type="email"
                          defaultValue="user@example.com"
                          className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="username">Nome de Utilizador</Label>
                          <input
                            id="username"
                            defaultValue="PixelMaster"
                            className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
                          />
                        </div>
                        <div>
                          <Label htmlFor="displayName">Nome de Exibição</Label>
                          <input
                            id="displayName"
                            defaultValue="Pixel Master"
                            className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
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
