'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Shield, Flag, Ban, Gavel, Clock, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModerationReport {
  id: string;
  reportedBy: {
    name: string;
    avatar: string;
  };
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  reason: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  moderator?: string;
}

interface ModerationAction {
  id: string;
  type: 'warning' | 'mute' | 'ban' | 'remove' | 'approve';
  target: string;
  reason: string;
  duration?: string;
  moderator: string;
  timestamp: string;
}

const mockReports: ModerationReport[] = [
  {
    id: '1',
    reportedBy: { name: 'Ana Silva', avatar: '/avatars/ana.jpg' },
    targetType: 'post',
    targetId: 'post_123',
    reason: 'Spam/Publicidade',
    description: 'Post promocional repetitivo sem valor para a comunidade',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '2',
    reportedBy: { name: 'Carlos Santos', avatar: '/avatars/carlos.jpg' },
    targetType: 'comment',
    targetId: 'comment_456',
    reason: 'Linguagem Ofensiva',
    description: 'Comentário com linguagem inapropriada e ataques pessoais',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'reviewed',
    priority: 'high',
    moderator: 'João Moderador'
  }
];

const mockActions: ModerationAction[] = [
  {
    id: '1',
    type: 'warning',
    target: 'user_789',
    reason: 'Primeira infração - linguagem inapropriada',
    moderator: 'João Moderador',
    timestamp: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    type: 'remove',
    target: 'post_234',
    reason: 'Spam comercial não autorizado',
    moderator: 'Maria Admin',
    timestamp: '2024-01-15T10:45:00Z'
  }
];

export function CommunityModeration() {
  const [reports, setReports] = useState<ModerationReport[]>(mockReports);
  const [actions, setActions] = useState<ModerationAction[]>(mockActions);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const { toast } = useToast();

  const handleResolveReport = (reportId: string, action: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'resolved' as const, moderator: 'Moderador Atual' }
        : report
    ));
    
    toast({
      title: "Relatório Resolvido",
      description: `Ação "${action}" aplicada com sucesso.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'reviewed': return 'text-blue-500';
      case 'resolved': return 'text-green-500';
      case 'dismissed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            Sistema de Moderação
          </CardTitle>
          <CardDescription>
            Mantenha a comunidade segura e acolhedora para todos
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">
            <Flag className="h-4 w-4 mr-2" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="actions">
            <Gavel className="h-4 w-4 mr-2" />
            Ações
          </TabsTrigger>
          <TabsTrigger value="stats">
            <FileText className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Shield className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Relatórios Pendentes</h3>
            <Button 
              onClick={() => setShowReportDialog(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              <Flag className="h-4 w-4 mr-2" />
              Criar Relatório
            </Button>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={report.reportedBy.avatar} />
                          <AvatarFallback>{report.reportedBy.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{report.reportedBy.name}</span>
                            <Badge variant="outline" className={cn("text-xs", getStatusColor(report.status))}>
                              {report.status}
                            </Badge>
                            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(report.priority))} />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{report.reason}</span> • {report.targetType}
                          </div>
                          <p className="text-sm">{report.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(report.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveReport(report.id, 'Aprovado')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleResolveReport(report.id, 'Removido')}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <h3 className="text-lg font-semibold">Ações Recentes</h3>
          <div className="space-y-3">
            {actions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <Gavel className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium capitalize">{action.type}</div>
                        <div className="text-sm text-muted-foreground">{action.reason}</div>
                        <div className="text-xs text-muted-foreground">
                          Por {action.moderator} • {new Date(action.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{action.target}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-500">5</div>
                <div className="text-sm text-muted-foreground">Relatórios Pendentes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-500">23</div>
                <div className="text-sm text-muted-foreground">Resolvidos Hoje</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-500">98.5%</div>
                <div className="text-sm text-muted-foreground">Taxa de Resolução</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Moderação</CardTitle>
              <CardDescription>
                Configure as regras e filtros automáticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtro de Linguagem</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ativar filtro automático</span>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Detecção de Spam</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IA anti-spam ativada</span>
                  <Badge className="bg-green-500">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Relatório</DialogTitle>
            <DialogDescription>
              Relate conteúdo inadequado para manter a comunidade segura
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo de Problema</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Spam/Publicidade</option>
                <option>Linguagem Ofensiva</option>
                <option>Assédio</option>
                <option>Conteúdo Inadequado</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea 
                placeholder="Descreva o problema em detalhes..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancelar
              </Button>
              <Button className="bg-red-500 hover:bg-red-600">
                <Flag className="h-4 w-4 mr-2" />
                Enviar Relatório
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

