
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { 
  Settings, Moon, Sun, Monitor, Volume2, Bell, Eye, 
  Paintbrush, Zap, Shield, Key, LogOut, Download, Upload, 
  RefreshCw, Smartphone, Laptop, Globe, Sparkles, 
  Palette, Save, Check, AlertTriangle, Lock, User, 
  Mail, CreditCard, HelpCircle, FileText, MessageSquare,
  Gift, Coins, ShoppingCart, Trophy, Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettingsStore, useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { toast } = useToast();
  const { 
    theme, 
    animations, 
    notifications, 
    soundEffects, 
    highQualityRendering,
    setTheme,
    toggleAnimations,
    toggleNotifications,
    toggleSoundEffects,
    toggleHighQualityRendering
  } = useSettingsStore();
  
  const { credits, specialCredits } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [fontSize, setFontSize] = useState(100);
  const [language, setLanguage] = useState('pt-PT');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [playTestSound, setPlayTestSound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSaveSound, setPlaySaveSound] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowConfetti(true);
      setPlaySaveSound(true);
      toast({
        title: "Definições Guardadas",
        description: "As suas preferências foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  const handleResetSettings = () => {
    setPlayTestSound(true);
    // Reset to defaults
    setTheme('dark');
    setFontSize(100);
    setLanguage('pt-PT');
    
    toast({
      title: "Definições Restauradas",
      description: "As definições foram restauradas para os valores padrão.",
    });
  };

  const handleExportSettings = () => {
    setPlayTestSound(true);
    const settings = {
      theme,
      animations,
      notifications,
      soundEffects,
      highQualityRendering,
      fontSize,
      language
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pixel-universe-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Definições Exportadas",
      description: "As suas definições foram exportadas com sucesso.",
    });
  };

  const handleChangePassword = () => {
    setPlaySaveSound(true);
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As novas passwords não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A nova password deve ter pelo menos 8 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Alterada",
      description: "A sua password foi alterada com sucesso.",
    });
    
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect 
        src={SOUND_EFFECTS.SUCCESS} 
        play={playSaveSound} 
        onEnd={() => setPlaySaveSound(false)} 
      />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      <SoundEffect 
        src={SOUND_EFFECTS.CLICK} 
        play={playTestSound} 
        onEnd={() => setPlayTestSound(false)} 
      />
      
      <div className="container mx-auto py-6 px-4 mb-16 space-y-6 max-w-6xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <Settings className="h-8 w-8 mr-3 animate-glow" />
                  Definições
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Personalize a sua experiência no Pixel Universe
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleResetSettings}
                  className="bg-background/50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      A guardar...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
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
                orientation="vertical" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
                  <TabsTrigger 
                    value="appearance" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <Paintbrush className="h-4 w-4 mr-3 text-blue-500" />
                    Aparência
                  </TabsTrigger>
                  <TabsTrigger 
                    value="accessibility" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <Eye className="h-4 w-4 mr-3 text-green-500" />
                    Acessibilidade
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <Bell className="h-4 w-4 mr-3 text-red-500" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Conta
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <Shield className="h-4 w-4 mr-3 text-purple-500" />
                    Segurança
                  </TabsTrigger>
                  <TabsTrigger 
                    value="performance" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <Zap className="h-4 w-4 mr-3 text-yellow-500" />
                    Desempenho
                  </TabsTrigger>
                  <TabsTrigger 
                    value="language" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <Globe className="h-4 w-4 mr-3 text-cyan-500" />
                    Idioma
                  </TabsTrigger>
                  <TabsTrigger 
                    value="help" 
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                  >
                    <HelpCircle className="h-4 w-4 mr-3 text-orange-500" />
                    Ajuda
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Créditos</span>
                  </div>
                  <span className="font-medium text-primary">{credits.toLocaleString('pt-PT')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2 text-accent" />
                    <span className="text-sm">Especiais</span>
                  </div>
                  <span className="font-medium text-accent">{specialCredits.toLocaleString('pt-PT')}</span>
                </div>
                
                <Button variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Terminar Sessão
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <ScrollArea className="h-[70vh]">
                <Tabs value={activeTab}>
                  <TabsContent value="appearance" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Tema</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            theme === 'light' && "border-primary bg-primary/5"
                          )}
                          onClick={() => setTheme('light')}
                        >
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Sun className="h-8 w-8 mb-2 text-orange-400" />
                            <h4 className="font-medium">Claro</h4>
                            <p className="text-xs text-muted-foreground">Tema luminoso</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            theme === 'dark' && "border-primary bg-primary/5"
                          )}
                          onClick={() => setTheme('dark')}
                        >
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Moon className="h-8 w-8 mb-2 text-blue-400" />
                            <h4 className="font-medium">Escuro</h4>
                            <p className="text-xs text-muted-foreground">Tema noturno</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            theme === 'system' && "border-primary bg-primary/5"
                          )}
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
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Cores</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card className="p-4 cursor-pointer hover:shadow-md border-primary/50">
                            <div className="h-12 rounded-md bg-gradient-to-r from-[#D4A757] to-[#7DF9FF] mb-2"></div>
                            <p className="text-sm font-medium">Padrão</p>
                            <p className="text-xs text-muted-foreground">Dourado & Azul</p>
                          </Card>
                          
                          <Card className="p-4 cursor-pointer hover:shadow-md">
                            <div className="h-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 mb-2"></div>
                            <p className="text-sm font-medium">Neon</p>
                            <p className="text-xs text-muted-foreground">Roxo & Rosa</p>
                          </Card>
                          
                          <Card className="p-4 cursor-pointer hover:shadow-md">
                            <div className="h-12 rounded-md bg-gradient-to-r from-green-500 to-blue-500 mb-2"></div>
                            <p className="text-sm font-medium">Natureza</p>
                            <p className="text-xs text-muted-foreground">Verde & Azul</p>
                          </Card>
                          
                          <Card className="p-4 cursor-pointer hover:shadow-md">
                            <div className="h-12 rounded-md bg-gradient-to-r from-red-500 to-orange-500 mb-2"></div>
                            <p className="text-sm font-medium">Fogo</p>
                            <p className="text-xs text-muted-foreground">Vermelho & Laranja</p>
                          </Card>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button variant="outline" className="flex-1">
                            <Palette className="h-4 w-4 mr-2" />
                            Personalizar Cores
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Temas Premium
                            <Badge className="ml-2 bg-amber-500">PRO</Badge>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Efeitos Visuais</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Animações</Label>
                            <p className="text-sm text-muted-foreground">Ativar animações na interface</p>
                          </div>
                          <Switch checked={animations} onCheckedChange={toggleAnimations} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Efeitos de Partículas</Label>
                            <p className="text-sm text-muted-foreground">Mostrar efeitos de partículas</p>
                          </div>
                          <Switch checked={animations} onCheckedChange={toggleAnimations} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Efeitos de Brilho</Label>
                            <p className="text-sm text-muted-foreground">Mostrar efeitos de brilho</p>
                          </div>
                          <Switch checked={animations} onCheckedChange={toggleAnimations} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  {/* Other tabs content would go here */}
                </Tabs>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Definições
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
