
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Bug, Lightbulb, Send } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function ReportPage() {
  const [reportType, setReportType] = useState('bug');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast({
        title: "Descrição em falta",
        description: "Por favor, descreva o problema ou sugestão.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Relatório Enviado!",
      description: "Obrigado por nos ajudar a melhorar o Pixel Universe.",
    });
    
    // Reset form
    setDescription('');
    setSteps('');
  };

  return (
    <div className="container mx-auto py-6 px-4 mb-16 space-y-6 max-w-4xl">
      <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-yellow-500/10 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3" />
            Reportar um Problema ou Sugestão
          </CardTitle>
          <CardDescription>
            O seu feedback é crucial para tornarmos o Pixel Universe cada vez melhor.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-red-500" />
                      <span>Reportar um Bug</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="suggestion">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Sugerir uma Melhoria</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <span>Outro Assunto</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o problema ou a sua sugestão em detalhe."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
              />
            </div>

            {reportType === 'bug' && (
              <div className="space-y-2">
                <Label htmlFor="steps">Passos para Reproduzir (opcional)</Label>
                <Textarea
                  id="steps"
                  placeholder="Liste os passos para que possamos reproduzir o bug. Ex: 1. Fui à página X, 2. Cliquei no botão Y..."
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="attachment">Anexar Ficheiro (opcional)</Label>
                <Input id="attachment" type="file" />
                <p className="text-xs text-muted-foreground">
                    Anexe uma captura de ecrã ou vídeo se ajudar a explicar o problema.
                </p>
            </div>
            
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Relatório
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
