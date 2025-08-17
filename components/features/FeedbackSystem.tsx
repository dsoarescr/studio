'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Send, Star, Bug, Lightbulb, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackSystemProps {
  children: React.ReactNode;
}

export default function FeedbackSystem({ children }: FeedbackSystemProps) {
  const [feedbackType, setFeedbackType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!feedbackType || !subject || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feedback Enviado",
      description: "Obrigado pelo seu feedback! Iremos analisá-lo em breve.",
    });

    // Reset form
    setFeedbackType('');
    setSubject('');
    setMessage('');
    setRating(0);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Enviar Feedback
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Feedback</Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Reportar Bug
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Sugerir Funcionalidade
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Feedback Geral
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Assunto</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Descreva brevemente o assunto..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva o seu feedback em detalhe..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Avaliação (opcional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star 
                    className={`h-5 w-5 ${
                      star <= rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>
          
          <Button className="w-full" onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}