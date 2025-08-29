'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function SupportPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Mensagem Enviada!',
      description: 'A nossa equipa de suporte entrará em contacto consigo em breve.',
    });
  };

  return (
    <div className="container mx-auto mb-16 max-w-4xl space-y-6 px-4 py-6">
      <Card className="border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-gradient-gold flex items-center font-headline text-3xl">
            <MessageSquare className="mr-3 h-8 w-8" />
            Suporte ao Cliente
          </CardTitle>
          <CardDescription>
            Estamos aqui para ajudar! Contacte-nos através de um dos métodos abaixo.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enviar Mensagem</CardTitle>
            <CardDescription>A forma mais rápida de obter ajuda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Seu email de contacto" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Assunto da sua mensagem" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva o seu problema ou dúvida em detalhe."
                  required
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outros Métodos de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">Para questões menos urgentes.</p>
                  <a
                    href="mailto:suporte@pixeluniverse.pt"
                    className="text-sm text-primary hover:underline"
                  >
                    suporte@pixeluniverse.pt
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-sm text-muted-foreground">Disponível de Seg a Sex, 9h-18h.</p>
                  <p className="text-sm text-primary">+351 210 000 000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Muitas dúvidas comuns já estão respondidas na nossa secção de tutoriais.
              </p>
              <a href="/tutorials">
                <Button variant="outline" className="w-full">
                  Ver Guias e Tutoriais
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
