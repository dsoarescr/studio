
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function SupportPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem Enviada!",
      description: "A nossa equipa de suporte entrará em contacto consigo em breve.",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 mb-16 space-y-6 max-w-4xl">
      <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
            <MessageSquare className="h-8 w-8 mr-3" />
            Suporte ao Cliente
          </CardTitle>
          <CardDescription>
            Estamos aqui para ajudar! Contacte-nos através de um dos métodos abaixo.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enviar Mensagem</CardTitle>
            <CardDescription>
              A forma mais rápida de obter ajuda.
            </CardDescription>
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
                <Textarea id="message" placeholder="Descreva o seu problema ou dúvida em detalhe." required rows={5} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
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
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">Para questões menos urgentes.</p>
                  <a href="mailto:suporte@pixeluniverse.pt" className="text-primary text-sm hover:underline">
                    suporte@pixeluniverse.pt
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-sm text-muted-foreground">Disponível de Seg a Sex, 9h-18h.</p>
                  <p className="text-primary text-sm">+351 210 000 000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
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
