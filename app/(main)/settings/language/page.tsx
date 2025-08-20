'use client';

 import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Globe, Save, RefreshCw } from "lucide-react";

export default function LanguageSettingsPage() {
  const [language, setLanguage] = useState('pt-PT');
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');
  const [timeFormat, setTimeFormat] = useState('HH:mm');
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Definições de Idioma Guardadas",
      description: "As suas preferências de idioma foram atualizadas.",
    });
  };

  const handleResetDefaults = () => {
    setLanguage('pt-PT');
    setDateFormat('dd/MM/yyyy');
    setTimeFormat('HH:mm');
    toast({
      title: "Definições Restauradas",
      description: "As definições de idioma foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Globe className="h-6 w-6 mr-3 text-primary" />
            Idioma e Região
          </CardTitle>
          <CardDescription>
            Escolha o idioma e os formatos de data e hora
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma da Interface</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                  <SelectItem value="fr-FR">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-format">Formato de Data</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-format">Formato de Hora</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="time-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HH:mm">24 horas (ex: 14:30)</SelectItem>
                    <SelectItem value="hh:mm a">12 horas (ex: 2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button variant="outline" onClick={handleResetDefaults}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}