'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  HelpCircle, Search, MessageSquare, Book, Video, 
  Phone, Mail, Send, Star, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HelpCenterProps {
  children: React.ReactNode;
}

const faqData = [
  {
    question: "Como compro um pixel?",
    answer: "Para comprar um pixel, clique em qualquer área disponível no mapa (destacada em dourado). Será apresentado um modal com os detalhes do pixel e opções de compra."
  },
  {
    question: "Posso vender os meus pixels?",
    answer: "Sim! Pixels que possui podem ser colocados à venda no marketplace. Vá ao seu perfil, selecione o pixel e escolha 'Colocar à Venda'."
  },
  {
    question: "Como funcionam os créditos especiais?",
    answer: "Créditos especiais são uma moeda premium que pode usar para comprar pixels raros, cores exclusivas e itens especiais no marketplace."
  }
];

export default function HelpCenter({ children }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const handleSubmitTicket = () => {
    toast({
      title: "Ticket Enviado",
      description: "A nossa equipa de suporte entrará em contacto em breve.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Centro de Ajuda
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Categories */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2">
              {['all', 'pixels', 'payments', 'account', 'technical'].map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' && 'Todas as Categorias'}
                  {category === 'pixels' && 'Pixels e Mapa'}
                  {category === 'payments' && 'Pagamentos'}
                  {category === 'account' && 'Conta'}
                  {category === 'technical' && 'Técnico'}
                </Button>
              ))}
            </div>
          </div>
          
          {/* FAQ Content */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-96">
              <Accordion type="single" collapsible className="space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Não encontrou o que procurava?</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleSubmitTicket}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contactar Suporte
                </Button>
                <Button variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Ver Tutoriais
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}