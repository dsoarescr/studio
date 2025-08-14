'use client';

 import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FileText, MessageSquare, HelpCircle } from "lucide-react";
import Image from 'next/image';

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <HelpCircle className="h-6 w-6 mr-3 text-primary" />
            Ajuda e Suporte
          </CardTitle>
          <CardDescription>
            Encontre respostas para as suas dúvidas e contacte o nosso suporte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Documentação</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore os nossos guias e tutoriais completos.
                </p>
                <Button variant="outline" className="w-full">
                  Abrir Documentação
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contactar Suporte</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A nossa equipa está pronta para ajudar.
                </p>
                <Button variant="outline" className="w-full">
                  Enviar Mensagem
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre o Pixel Universe</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Image 
                src="/logo.png" 
                alt="Pixel Universe"
                width={80} 
                height={80}
              />
              <div>
                <p className="text-muted-foreground">
                  Versão: 1.0.0
                </p>
                <p className="text-muted-foreground">
                  © 2025 Pixel Universe. Todos os direitos reservados.
                </p>
                <div className="mt-2">
                  <Button variant="link" className="p-0 h-auto">Termos de Serviço</Button>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <Button variant="link" className="p-0 h-auto">Política de Privacidade</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
