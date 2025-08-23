'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from 'framer-motion';
import { Send, MessageSquare, ClipboardList, MapIcon, Bug, Lightbulb, Zap, HelpCircle, Heart, Upload, Paperclip, Trash2, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
type FeedbackCategory = 'bug' | 'feature' | 'improvement' | 'question' | 'praise' | 'other';
type FeedbackStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
type SatisfactionLevel = 1 | 2 | 3 | 4 | 5;

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  createdAt: Date;
  updatedAt: Date;
  votes: number;
  hasVoted: boolean;
  comments: FeedbackComment[];
  attachments?: string[];
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    dataAiHint?: string;
    role: string;
  };
  assignee?: {
    name: string;
    avatar?: string;
    dataAiHint?: string;
    role: string;
  };
}

interface FeedbackComment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    avatar?: string;
    dataAiHint?: string;
    isStaff?: boolean;
  };
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'checkbox';
  options?: string[];
  required: boolean;
}

// Mock Data
const mockFeedbackItems: FeedbackItem[] = [
  {
    id: '1',
    title: 'Melhorar a performance do mapa em dispositivos móveis',
    description: 'O mapa fica lento em smartphones mais antigos. Seria bom ter uma opção de "modo de baixa performance" para dispositivos com menos recursos.',
    category: 'improvement',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    votes: 42,
    hasVoted: true,
    tags: ['performance', 'mobile', 'mapa'],
    comments: [
      {
        id: 'c1',
        content: 'Estamos trabalhando nisso! Já implementamos algumas otimizações e estamos testando um novo modo de renderização para dispositivos de baixo desempenho.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        author: {
          name: 'DevTeam',
          avatar: 'https://placehold.co/40x40.png',
          dataAiHint: 'staff avatar',
          isStaff: true
        }
      },
      {
        id: 'c2',
        content: 'Ótimo! Mal posso esperar para ver as melhorias. Meu smartphone é um pouco antigo e realmente fica lento ao navegar pelo mapa.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        author: {
          name: 'PixelFan123',
          avatar: 'https://placehold.co/40x40.png',
          dataAiHint: 'user avatar'
        }
      }
    ],
    author: {
      name: 'MobileUser',
      avatar: 'https://placehold.co/40x40.png',
      dataAiHint: 'user avatar',
      role: 'Utilizador'
    },
    assignee: {
      name: 'DevTeam',
      avatar: 'https://placehold.co/40x40.png',
      dataAiHint: 'staff avatar',
      role: 'Desenvolvedor'
    }
  },
  // ... more mock data
];

const surveyQuestions: SurveyQuestion[] = [
  // ... survey questions
];


// Helper Components








interface FeedbackSystemProps {
    children: React.ReactNode;
}

export default function FeedbackSystem({ children }: FeedbackSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('improvement');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(mockFeedbackItems);


  const [attachments, setAttachments] = useState<File[]>([]);


  const [showConfetti, setShowConfetti] = useState(false);
  const [playRewardSound, setPlayRewardSound] = useState(false);
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();



  const handleSubmitFeedback = () => {
    if (!feedbackTitle.trim() || !feedbackDescription.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o título e a descrição do feedback.",
        variant: "destructive"
      });
      return;
    }

    // Create new feedback item
    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      title: feedbackTitle,
      description: feedbackDescription,
      category: feedbackCategory,
      status: 'open',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: 1,
      hasVoted: true,
      comments: [],
      tags: feedbackDescription.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [],
      author: {
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        dataAiHint: 'user avatar',
        role: 'Utilizador'
      }
    };

    setFeedbackItems(prev => [newFeedback, ...prev]);
    setFeedbackTitle('');
    setFeedbackDescription('');
    setAttachments([]);
    
    // Show success message
    setShowConfetti(true);
    setPlayRewardSound(true);
    
    // Reward user
    addCredits(25);
    addXp(10);
    
    toast({
      title: "Feedback Enviado",
      description: "Obrigado pelo seu feedback! Recebeu 25 créditos como recompensa.",
    });
  };





  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };







  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 gap-0">
        <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playRewardSound} onEnd={() => setPlayRewardSound(false)} />
        <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
        <DialogHeader className="p-6 border-b bg-gradient-to-br from-card via-card/95 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
            <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <DialogTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                    <MessageSquare className="h-8 w-8 mr-3 animate-glow" />
                    Feedback e Sugestões
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-2">
                    Ajude-nos a melhorar o Pixel Universe partilhando as suas ideias, reportando problemas ou respondendo a pesquisas
                    </DialogDescription>
                </div>
                </div>
            </div>
            </DialogHeader>

        <div className="flex flex-col h-[calc(95vh-110px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 bg-card/50 backdrop-blur-sm shadow-md m-4">
                <TabsTrigger value="submit" className="font-headline">
                <Send className="h-4 w-4 mr-2"/>
                Enviar Feedback
                </TabsTrigger>
                <TabsTrigger value="browse" className="font-headline">
                <MessageSquare className="h-4 w-4 mr-2"/>
                Feedback da Comunidade
                </TabsTrigger>
                <TabsTrigger value="survey" className="font-headline">
                <ClipboardList className="h-4 w-4 mr-2"/>
                Pesquisas
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="font-headline">
                <MapIcon className="h-4 w-4 mr-2"/>
                Roadmap
                </TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1">
                <div className="p-4">
                {/* Submit Feedback Tab */}
                <TabsContent value="submit" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Feedback Form */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                                <Send className="h-5 w-5 mr-2 text-primary" />
                                Enviar Novo Feedback
                            </CardTitle>
                            <CardDescription>
                                Partilhe as suas ideias, reporte problemas ou sugira melhorias
                            </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="feedback-title">Título</Label>
                                <Input 
                                id="feedback-title" 
                                placeholder="Resumo do seu feedback em poucas palavras" 
                                value={feedbackTitle}
                                onChange={(e) => setFeedbackTitle(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="feedback-category">Categoria</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <Button
                                    variant={feedbackCategory === 'bug' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => setFeedbackCategory('bug')}
                                >
                                    <Bug className="h-4 w-4 mr-2 text-red-500" />
                                    Bug
                                </Button>
                                <Button
                                    variant={feedbackCategory === 'feature' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => setFeedbackCategory('feature')}
                                >
                                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                                    Nova Funcionalidade
                                </Button>
                                <Button
                                    variant={feedbackCategory === 'improvement' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => setFeedbackCategory('improvement')}
                                >
                                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                                    Melhoria
                                </Button>
                                <Button
                                    variant={feedbackCategory === 'question' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => setFeedbackCategory('question')}
                                >
                                    <HelpCircle className="h-4 w-4 mr-2 text-purple-500" />
                                    Questão
                                </Button>
                                <Button
                                    variant={feedbackCategory === 'praise' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => setFeedbackCategory('praise')}
                                >
                                    <Heart className="h-4 w-4 mr-2 text-pink-500" />
                                    Elogio
                                </Button>
                                <Button
                                    variant={feedbackCategory === 'other' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => setFeedbackCategory('other')}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                                    Outro
                                </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="feedback-description">Descrição Detalhada</Label>
                                <Textarea 
                                id="feedback-description" 
                                placeholder="Descreva em detalhe o seu feedback, incluindo passos para reproduzir bugs ou exemplos de uso para novas funcionalidades. Use #tags para categorizar (ex: #mapa #mobile)." 
                                rows={8}
                                value={feedbackDescription}
                                onChange={(e) => setFeedbackDescription(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                Dica: Use #tags no seu texto para categorizar o feedback (ex: #mapa #mobile #desempenho)
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="feedback-attachments">Anexos (opcional)</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/20 transition-colors cursor-pointer">
                                <Input
                                    id="feedback-attachments"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Label htmlFor="feedback-attachments" className="cursor-pointer">
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                    Arraste ficheiros ou clique para selecionar
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                    Suporta imagens, vídeos e documentos até 10MB
                                    </p>
                                </Label>
                                </div>
                                
                                {attachments.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    <p className="text-sm font-medium">Ficheiros Anexados:</p>
                                    <div className="space-y-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                                        <div className="flex items-center">
                                            <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                            {(file.size / 1024).toFixed(0)} KB
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAttachment(index)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="feedback-anonymous" />
                                <Label htmlFor="feedback-anonymous" className="text-sm">
                                Enviar anonimamente (não receberá créditos de recompensa)
                                </Label>
                            </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                            <Button variant="outline" onClick={() => {
                                setFeedbackTitle('');
                                setFeedbackDescription('');
                                setAttachments([]);
                            }}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Limpar
                            </Button>
                            <Button onClick={handleSubmitFeedback}>
                                <Send className="h-4 w-4 mr-2" />
                                Enviar Feedback
                            </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
                {/* Other tabs content */}
                </div>
            </ScrollArea>
            </Tabs>
        </div>
        </DialogContent>
    </Dialog>
  );
}
