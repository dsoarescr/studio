'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function LanguageSettingsPage() {
  const [language, setLanguage] = useState('pt-PT');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Idioma e Região</CardTitle>
          <CardDescription>Escolha o idioma e o formato de data e hora.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Idioma da Interface</h3>
            <div className="space-y-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                  <SelectItem value="fr-FR">Français</SelectItem>
                  <SelectItem value="de-DE">Deutsch</SelectItem>
                </SelectContent>
              </Select>
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm">
                    Esta definição altera o idioma da interface do utilizador. Alguns conteúdos gerados pelos utilizadores podem continuar a aparecer no idioma original.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Formato de Data e Hora</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Formato de Data</Label>
                <Select defaultValue="dd/MM/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Formato de Hora</Label>
                <Select defaultValue="HH:mm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HH:mm">24 horas (14:30)</SelectItem>
                    <SelectItem value="hh:mm a">12 horas (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
