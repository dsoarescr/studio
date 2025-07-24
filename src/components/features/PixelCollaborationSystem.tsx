'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, UserMinus, Crown, Star, MessageSquare, Send,
  Calendar, Clock, MapPin, Palette, Edit3, Save, Share2, Download,
  Eye, Heart, Award, Trophy, Target, Zap, Activity, Settings,
  Bell, Shield, Lock, Unlock, Check, X, Plus, Minus, MoreHorizontal
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  lastActive: Date;
  contributions: number;
  joinedAt: Date;
}

interface CollaborationProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: Collaborator[];
  pixels: Array<{ x: number; y: number; color: string; editedBy: string; editedAt: Date }>;
  isPublic: boolean;
  createdAt: Date;
  deadline?: Date;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  targetPixels: number;
}

interface PixelCollaborationSystemProps {
  children: React.ReactNode;
}

export default function PixelCollaborationSystem({ children }: PixelCollaborationSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CollaborationProject | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();

  // Mock data
  useEffect(() => {
    const mockProjects: CollaborationProject[] = [
      {
        id: '1',
        name: 'Paisagens de Portugal',
        description: 'Projeto colaborativo para criar paisagens icónicas de Portugal',
        owner: 'PixelMaster',
        collaborators: [
          {
            id: '1',
            name: 'PixelMaster',
            avatar: 'https://placehold.co/40x40.png',
            role: 'owner',
            isOnline: true,
            lastActive: new Date(),
            contributions: 45,
            joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            name: 'ArtistaPT',
            avatar: 'https://placehold.co/40x40.png',
            role: 'editor',
            isOnline: false,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
            contributions: 23,
            joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            name: 'ColorMaster',
            avatar: 'https://placehold.co/40x40.png',
            role: 'viewer',
            isOnline: true,
            lastActive: new Date(Date.now() - 30 * 60 * 1000),
            contributions: 12,
            joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        ],
        pixels: [],
        isPublic: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: 65,
        targetPixels: 100
      }
    ];
    
    setProjects(mockProjects);
  }, []);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Nome Obrigatório",
        description: "Por favor, insira um nome para o projeto.",
        variant: "destructive"
      });
      return;
    }

    const newProject: CollaborationProject = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription,
      owner: 'Você',
      collaborators: [{
        id: 'current-user',
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        role: 'owner',
        isOnline: true,
        lastActive: new Date(),
        contributions: 0,
        joinedAt: new Date()
      }],
      pixels: [],
      isPublic: false,
      createdAt: new Date(),
      status: 'active',
      progress: 0,
      targetPixels: 50
    };

    setProjects(prev => [newProject, ...prev]);
    setNewProjectName('');
    setNewProjectDescription('');
    setShowConfetti(true);
    setPlaySuccessSound(true);
    
    addCredits(100);
    addXp(50);
    
    toast({
      title: "Projeto Criado!",
      description: "Seu projeto colaborativo foi criado com sucesso. +100 créditos!",
    });
  };

  const handleInviteCollaborator = (projectId: string) => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Obrigatório",
        description: "Por favor, insira um email para convidar.",
        variant: "destructive"
      });
      return;
    }

    // Mock invitation
    toast({
      title: "Convite Enviado",
      description: `Convite enviado para ${inviteEmail}. Eles receberão um email com instruções.`,
    });
    
    setInviteEmail('');
    addXp(10);
  };

  const handleJoinProject = (projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const newCollaborator: Collaborator = {
          id: 'new-user',
          name: 'Novo Colaborador',
          avatar: 'https://placehold.co/40x40.png',
          role: 'viewer',
          isOnline: true,
          lastActive: new Date(),
          contributions: 0,
          joinedAt: new Date()
        };
        
        return {
          ...project,
          collaborators: [...project.collaborators, newCollaborator]
        };
      }
      return project;
    }));
    
    addCredits(25);
    addXp(20);
    
    toast({
      title: "Projeto Juntado!",
      description: "Você se juntou ao projeto com sucesso. +25 créditos!",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-500 bg-yellow-500/10';
      case 'editor': return 'text-blue-500 bg-blue-500/10';
      case 'viewer': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'completed': return 'text-blue-500 bg-blue-500/10';
      case 'paused': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-card to-primary/5">
          <DialogTitle className="text-2xl font-headline text-primary flex items-center">
            <Users className="h-6 w-6 mr-3" />
            Sistema de Colaboração
          </DialogTitle>
          <DialogDescription>
            Trabalhe em projetos de pixel art com outros artistas em tempo real
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-6 pt-4 bg-transparent justify-start border-b rounded-none gap-2">
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary/10">
              <Trophy className="h-4 w-4 mr-2" />
              Meus Projetos
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-primary/10">
              <Eye className="h-4 w-4 mr-2" />
              Descobrir
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-primary/10">
              <Plus className="h-4 w-4 mr-2" />
              Criar Projeto
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-6">
              {/* My Projects Tab */}
              <TabsContent value="projects" className="mt-0 space-y-4">
                {projects.length === 0 ? (
                  <Card className="text-center p-8">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum Projeto</h3>
                    <p className="text-muted-foreground mb-4">
                      Você ainda não tem projetos colaborativos. Crie o seu primeiro projeto!
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Projeto
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <CardDescription className="mt-1">{project.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              {project.isPublic && (
                                <Badge variant="outline">Público</Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{project.progress}% ({project.pixels.length}/{project.targetPixels})</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          {/* Collaborators */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Colaboradores ({project.collaborators.length})</span>
                              <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Convidar
                              </Button>
                            </div>
                            
                            <div className="flex -space-x-2">
                              {project.collaborators.slice(0, 5).map((collaborator) => (
                                <div key={collaborator.id} className="relative">
                                  <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarImage src={collaborator.avatar} />
                                    <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                                  </Avatar>
                                  {collaborator.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                  )}
                                </div>
                              ))}
                              {project.collaborators.length > 5 && (
                                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                  +{project.collaborators.length - 5}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Deadline */}
                          {project.deadline && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Prazo: {project.deadline.toLocaleDateString('pt-PT')}</span>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Partilhar
                            </Button>
                            <Button size="sm">
                              <Palette className="h-4 w-4 mr-2" />
                              Colaborar
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Discover Tab */}
              <TabsContent value="discover" className="mt-0 space-y-4">
                <div className="flex gap-4 mb-6">
                  <Input placeholder="Pesquisar projetos..." className="flex-1" />
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Pesquisar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mock public projects */}
                  {[
                    {
                      name: 'Monumentos Históricos',
                      description: 'Recriação de monumentos portugueses em pixel art',
                      collaborators: 8,
                      progress: 45,
                      isJoined: false
                    },
                    {
                      name: 'Fauna Portuguesa',
                      description: 'Projeto dedicado aos animais nativos de Portugal',
                      collaborators: 12,
                      progress: 78,
                      isJoined: true
                    },
                    {
                      name: 'Tradições Populares',
                      description: 'Celebração das tradições portuguesas',
                      collaborators: 6,
                      progress: 23,
                      isJoined: false
                    }
                  ].map((project, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>{project.collaborators} colaboradores</span>
                          <span>{project.progress}% completo</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </CardContent>
                      
                      <CardFooter>
                        {project.isJoined ? (
                          <Button variant="outline" className="w-full" disabled>
                            <Check className="h-4 w-4 mr-2" />
                            Já Participa
                          </Button>
                        ) : (
                          <Button 
                            className="w-full"
                            onClick={() => handleJoinProject(index.toString())}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Juntar-se
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Create Project Tab */}
              <TabsContent value="create" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Plus className="h-5 w-5 mr-2 text-primary" />
                      Criar Novo Projeto
                    </CardTitle>
                    <CardDescription>
                      Inicie um projeto colaborativo e convide outros artistas
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Nome do Projeto</Label>
                      <Input
                        id="project-name"
                        placeholder="Ex: Paisagens de Portugal"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Descrição</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Descreva o objetivo e tema do seu projeto..."
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Meta de Pixels</Label>
                        <Input type="number" placeholder="50" defaultValue="50" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Prazo (Opcional)</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="public-project" />
                      <Label htmlFor="public-project">Tornar projeto público</Label>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button onClick={handleCreateProject} className="w-full">
                      <Trophy className="h-4 w-4 mr-2" />
                      Criar Projeto
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        {/* Collaboration Details Modal */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>{selectedProject.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Invite Section */}
                <div className="space-y-2">
                  <Label>Convidar Colaborador</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="email@exemplo.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button onClick={() => handleInviteCollaborator(selectedProject.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      Convidar
                    </Button>
                  </div>
                </div>
                
                {/* Collaborators List */}
                <div className="space-y-2">
                  <Label>Colaboradores Atuais</Label>
                  <div className="space-y-2">
                    {selectedProject.collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={collaborator.avatar} />
                              <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                            </Avatar>
                            {collaborator.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          
                          <div>
                            <div className="font-medium">{collaborator.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {collaborator.contributions} contribuições
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleColor(collaborator.role)}>
                            {collaborator.role}
                          </Badge>
                          
                          {collaborator.role !== 'owner' && (
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}