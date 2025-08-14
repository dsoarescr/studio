'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, HelpCircle } from "lucide-react";
import Image from 'next/image';

export default function HelpSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajuda e Suporte</CardTitle>
          <CardDescription>Encontre respostas e contacte a nossa equipa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Documentação</h4>
                  <p className="text-sm text-muted-foreground">Guias e tutoriais para o Pixel Universe</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Abrir Documentação
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="font-semibold">Contactar Suporte</h4>
                  <p className="text-sm text-muted-foreground">Obtenha ajuda da nossa equipa de suporte</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Contactar Suporte
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h4 className="font-semibold">Perguntas Frequentes</h4>
                  <p className="text-sm text-muted-foreground">Respostas para as perguntas mais comuns</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver FAQ
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
          <CardDescription>Informações sobre a aplicação.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo.png" 
                alt="Pixel Universe" 
                width={64} 
                height={64} 
              />
            </div>
            <h4 className="font-semibold text-lg">Pixel Universe</h4>
            <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
            <p className="text-xs text-muted-foreground mt-2">© 2025 Pixel Universe. Todos os direitos reservados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
