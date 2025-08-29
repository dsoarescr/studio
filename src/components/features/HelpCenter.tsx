'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileText,
  BookOpen,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Plus,
  Filter,
  X,
  Book,
  Play,
  Mail,
  Phone,
  Send,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  tags: string[];
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: string;
  thumbnail: string;
  views: number;
  rating: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdate: string;
  agent?: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Como compro o meu primeiro pixel?',
    answer:
      'Para comprar um pixel, navegue pelo mapa, clique em um pixel disponível (cor dourada) e selecione "Comprar". Você pode pagar com créditos ou cartão de crédito.',
    category: 'Básico',
    helpful: 156,
    tags: ['compra', 'pixel', 'iniciante'],
  },
  {
    id: '2',
    question: 'O que são créditos especiais?',
    answer:
      'Créditos especiais são uma moeda premium que permite comprar pixels exclusivos, ferramentas avançadas e itens únicos. Você pode obtê-los através de conquistas ou comprando pacotes.',
    category: 'Créditos',
    helpful: 89,
    tags: ['créditos', 'premium', 'moeda'],
  },
  {
    id: '3',
    question: 'Como funciona o sistema de conquistas?',
    answer:
      'As conquistas são desbloqueadas automaticamente quando você atinge certos marcos, como comprar pixels, usar cores diferentes ou participar da comunidade. Cada conquista dá XP e créditos.',
    category: 'Conquistas',
    helpful: 134,
    tags: ['conquistas', 'xp', 'recompensas'],
  },
  {
    id: '4',
    question: 'Posso vender meus pixels?',
    answer:
      'Sim! Você pode colocar seus pixels à venda no marketplace. Defina um preço e outros usuários poderão comprá-los. Você recebe os créditos automaticamente.',
    category: 'Marketplace',
    helpful: 78,
    tags: ['venda', 'marketplace', 'pixels'],
  },
  {
    id: '5',
    question: 'Como funciona a colaboração em tempo real?',
    answer:
      'No modo Premium, você pode convidar outros usuários para colaborar em projetos. Todos podem editar simultaneamente e ver as mudanças em tempo real.',
    category: 'Premium',
    helpful: 92,
    tags: ['colaboração', 'premium', 'tempo-real'],
  },
];

const guidesData: GuideItem[] = [
  {
    id: '1',
    title: 'Primeiros Passos no Pixel Universe',
    description: 'Aprenda o básico: como navegar, comprar pixels e personalizar seu perfil.',
    duration: '5 min',
    difficulty: 'Iniciante',
    category: 'Básico',
    thumbnail: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Guia+Básico',
    views: 2341,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Técnicas Avançadas de Pixel Art',
    description: 'Domine técnicas profissionais de sombreamento, dithering e animação.',
    duration: '15 min',
    difficulty: 'Avançado',
    category: 'Arte',
    thumbnail: 'https://placehold.co/300x200/7DF9FF/000000?text=Pixel+Art',
    views: 1876,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Estratégias de Investimento em Pixels',
    description: 'Como identificar pixels valiosos e construir um portfólio lucrativo.',
    duration: '12 min',
    difficulty: 'Intermediário',
    category: 'Investimento',
    thumbnail: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Investimento',
    views: 1543,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Colaboração e Projetos em Equipe',
    description: 'Organize projetos colaborativos e gerencie equipes de artistas.',
    duration: '8 min',
    difficulty: 'Intermediário',
    category: 'Colaboração',
    thumbnail: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Colaboração',
    views: 987,
    rating: 4.6,
  },
];

const supportTickets: SupportTicket[] = [
  {
    id: 'TK-001',
    subject: 'Problema com compra de pixel',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-03-15T10:30:00Z',
    lastUpdate: '2024-03-15T14:20:00Z',
    agent: 'Ana Silva',
  },
  {
    id: 'TK-002',
    subject: 'Dúvida sobre créditos especiais',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-14T09:15:00Z',
    lastUpdate: '2024-03-14T16:45:00Z',
    agent: 'João Santos',
  },
];

interface HelpCenterProps {
  children: React.ReactNode;
}

export default function HelpCenter({ children }: HelpCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('faq');
  const { toast } = useToast();

  const categories = ['all', 'Básico', 'Créditos', 'Conquistas', 'Marketplace', 'Premium', 'Arte'];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredGuides = guidesData.filter(guide => {
    const matchesSearch =
      !searchQuery ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleMarkHelpful = () => {
    toast({
      title: 'Obrigado!',
      description: 'Seu feedback nos ajuda a melhorar o centro de ajuda.',
    });
  };

  const handleContactSupport = () => {
    toast({
      title: 'Suporte Contactado',
      description: 'Nossa equipe entrará em contato em até 24 horas.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-orange-500';
      case 'urgent':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-6xl gap-0 p-0">
        <DialogHeader className="border-b bg-gradient-to-r from-card to-primary/5 p-6">
          <DialogTitle className="flex items-center font-headline text-2xl text-primary">
            <HelpCircle className="mr-3 h-6 w-6" />
            Centro de Ajuda
          </DialogTitle>
          <DialogDescription>
            Encontre respostas, guias e suporte para aproveitar ao máximo o Pixel Universe
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          <TabsList className="justify-start gap-2 rounded-none border-b bg-transparent px-6 pt-4">
            <TabsTrigger value="faq" className="data-[state=active]:bg-primary/10">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-primary/10">
              <Book className="mr-2 h-4 w-4" />
              Guias
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-primary/10">
              <MessageSquare className="mr-2 h-4 w-4" />
              Suporte
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary/10">
              <Mail className="mr-2 h-4 w-4" />
              Contacto
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[60vh] flex-1">
            <div className="p-6">
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar ajuda..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      {category === 'all' ? 'Todas' : category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="mt-0 space-y-4">
                {filteredFAQs.length === 0 ? (
                  <Card className="p-8 text-center">
                    <HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Nenhuma pergunta encontrada para "{searchQuery}"
                    </p>
                  </Card>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQs.map(faq => (
                      <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex w-full items-center justify-between">
                            <span className="text-left font-medium">{faq.question}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p className="text-muted-foreground">{faq.answer}</p>

                          <div className="flex items-center justify-between border-t pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Foi útil?</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkHelpful()}
                                className="h-8 px-2"
                              >
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Sim ({faq.helpful})
                              </Button>
                            </div>

                            <div className="flex gap-1">
                              {faq.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>

              {/* Guides Tab */}
              <TabsContent value="guides" className="mt-0 space-y-4">
                {filteredGuides.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Book className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Nenhum guia encontrado para "{searchQuery}"
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredGuides.map(guide => (
                      <Card
                        key={guide.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={guide.thumbnail}
                            alt={guide.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                          <Badge className="absolute right-2 top-2 bg-black/70">
                            {guide.duration}
                          </Badge>
                        </div>

                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge
                              variant={
                                guide.difficulty === 'Iniciante'
                                  ? 'secondary'
                                  : guide.difficulty === 'Intermediário'
                                    ? 'default'
                                    : 'destructive'
                              }
                            >
                              {guide.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                              {guide.rating}
                            </div>
                          </div>

                          <h3 className="mb-2 font-semibold">{guide.title}</h3>
                          <p className="mb-3 text-sm text-muted-foreground">{guide.description}</p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{guide.views.toLocaleString()} visualizações</span>
                            <span>{guide.category}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Support Tab */}
              <TabsContent value="support" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Create New Ticket */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-primary">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Criar Novo Ticket
                      </CardTitle>
                      <CardDescription>
                        Descreva seu problema e nossa equipe ajudará você
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input placeholder="Assunto do ticket..." />
                      <Textarea
                        placeholder="Descreva seu problema em detalhes..."
                        className="h-24 resize-none"
                      />
                      <Button onClick={handleContactSupport} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Ticket
                      </Button>
                    </CardContent>
                  </Card>

                  {/* My Tickets */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-primary">
                        <FileText className="mr-2 h-5 w-5" />
                        Meus Tickets
                      </CardTitle>
                      <CardDescription>
                        Acompanhe o status dos seus tickets de suporte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {supportTickets.map(ticket => (
                          <div
                            key={ticket.id}
                            className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium">{ticket.subject}</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${getStatusColor(ticket.status)}`}
                                />
                                <span className="text-xs capitalize text-muted-foreground">
                                  {ticket.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>#{ticket.id}</span>
                              <span className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </span>
                            </div>

                            {ticket.agent && (
                              <div className="mt-2 flex items-center text-xs">
                                <User className="mr-1 h-3 w-3" />
                                <span>Agente: {ticket.agent}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
                      <h3 className="mb-2 font-semibold">Email</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Para questões gerais e suporte
                      </p>
                      <Button variant="outline" className="w-full">
                        suporte@pixeluniverse.pt
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-6">
                      <MessageSquare className="mx-auto mb-4 h-12 w-12 text-green-500" />
                      <h3 className="mb-2 font-semibold">Chat ao Vivo</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Resposta imediata (Premium)
                      </p>
                      <Button variant="outline" className="w-full">
                        Iniciar Chat
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Phone className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                      <h3 className="mb-2 font-semibold">Telefone</h3>
                      <p className="mb-4 text-sm text-muted-foreground">Suporte VIP (Ultimate)</p>
                      <Button variant="outline" className="w-full">
                        +351 XXX XXX XXX
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <Clock className="mr-2 h-5 w-5" />
                      Horários de Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-semibold">Suporte Geral</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Segunda a Sexta: 9h às 18h</p>
                          <p>Sábado: 10h às 16h</p>
                          <p>Domingo: Fechado</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold">Suporte VIP (Ultimate)</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>24 horas por dia</p>
                          <p>7 dias por semana</p>
                          <p>Resposta em até 1 hora</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
