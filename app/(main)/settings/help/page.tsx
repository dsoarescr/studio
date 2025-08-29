'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <HelpCircle className="mr-3 h-6 w-6 text-primary" />
            Ajuda e Suporte
          </CardTitle>
          <CardDescription>
            Encontre respostas para as suas dúvidas e contacte o nosso suporte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <FileText className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Documentação</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Explore os nossos guias e tutoriais completos.
                </p>
                <Button variant="outline" className="w-full">
                  Abrir Documentação
                </Button>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Contactar Suporte</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  A nossa equipa está pronta para ajudar.
                </p>
                <Button variant="outline" className="w-full">
                  Enviar Mensagem
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Sobre o Pixel Universe</h3>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Image src="/logo.png" alt="Pixel Universe" width={80} height={80} />
              <div>
                <p className="text-muted-foreground">Versão: 1.0.0</p>
                <p className="text-muted-foreground">
                  © 2025 Pixel Universe. Todos os direitos reservados.
                </p>
                <div className="mt-2">
                  <Button variant="link" className="h-auto p-0">
                    Termos de Serviço
                  </Button>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <Button variant="link" className="h-auto p-0">
                    Política de Privacidade
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
