'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Flag,
  Settings,
  RefreshCw,
  Filter,
  MessageSquare,
  Image as ImageIcon,
  Users,
  AlertOctagon,
  Clock,
  BarChart2,
  FileText,
  Save,
  Download,
  Share2,
} from 'lucide-react';

interface ModeratedContent {
  id: string;
  type: 'pixel' | 'comment' | 'profile' | 'message';
  content: string;
  status: 'approved' | 'rejected' | 'pending' | 'flagged';
  confidence: number;
  flags: string[];
  timestamp: string;
  reporter?: string;
  moderationDetails?: {
    reason: string;
    action: string;
    moderator?: string;
  };
}

interface ModerationType {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sensitivity: number;
  autoAction: 'flag' | 'remove' | 'notify';
}

const moderationTypes: ModerationType[] = [
  {
    id: 'inappropriate',
    name: 'Conteúdo Inapropriado',
    description: 'Detecta conteúdo impróprio ou ofensivo',
    enabled: true,
    sensitivity: 80,
    autoAction: 'remove',
  },
  {
    id: 'spam',
    name: 'Spam e Propaganda',
    description: 'Identifica spam e propaganda não autorizada',
    enabled: true,
    sensitivity: 90,
    autoAction: 'remove',
  },
  {
    id: 'copyright',
    name: 'Violação de Direitos Autorais',
    description: 'Detecta uso não autorizado de conteúdo protegido',
    enabled: true,
    sensitivity: 85,
    autoAction: 'flag',
  },
  {
    id: 'quality',
    name: 'Controle de Qualidade',
    description: 'Avalia a qualidade geral do conteúdo',
    enabled: true,
    sensitivity: 70,
    autoAction: 'notify',
  },
];

const mockContent: ModeratedContent[] = [
  {
    id: '1',
    type: 'pixel',
    content: 'Pixel Art Suspeita',
    status: 'flagged',
    confidence: 85,
    flags: ['inappropriate', 'copyright'],
    timestamp: '2024-03-20T14:30:00Z',
    reporter: 'Sistema',
    moderationDetails: {
      reason: 'Possível violação de direitos autorais',
      action: 'Aguardando revisão manual',
    },
  },
  {
    id: '2',
    type: 'comment',
    content: 'Comentário Spam',
    status: 'rejected',
    confidence: 95,
    flags: ['spam'],
    timestamp: '2024-03-20T13:45:00Z',
    moderationDetails: {
      reason: 'Spam detectado',
      action: 'Removido automaticamente',
    },
  },
];

export function ContentModeration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [moderationSettings, setModerationSettings] = useState(moderationTypes);
  const { toast } = useToast();

  const handleSettingsChange = (id: string, field: keyof ModerationType, value: any) => {
    setModerationSettings(prev =>
      prev.map(setting => (setting.id === id ? { ...setting, [field]: value } : setting))
    );

    toast({
      title: 'Configurações Atualizadas',
      description: 'As configurações de moderação foram atualizadas.',
    });
  };

  const handleAction = (contentId: string, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? 'Conteúdo Aprovado' : 'Conteúdo Rejeitado',
      description: 'A ação foi registrada e aplicada.',
    });
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                Moderação de Conteúdo
              </CardTitle>
              <CardDescription>Sistema automático de moderação com IA</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">
                <Eye className="mr-2 h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="queue">
                <Clock className="mr-2 h-4 w-4" />
                Fila
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart2 className="mr-2 h-4 w-4" />
                Relatórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Status Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 p-2">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-sm text-muted-foreground">Conteúdo Aprovado</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 p-2">
                        <XCircle className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="text-2xl font-bold">56</div>
                      <p className="text-sm text-muted-foreground">Conteúdo Rejeitado</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 p-2">
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold">23</div>
                      <p className="text-sm text-muted-foreground">Aguardando Revisão</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 p-2">
                        <Flag className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-sm text-muted-foreground">Denúncias Recebidas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockContent.map(content => (
                    <Card key={content.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'rounded-full p-2',
                                content.status === 'approved'
                                  ? 'bg-green-500/10'
                                  : content.status === 'rejected'
                                    ? 'bg-red-500/10'
                                    : 'bg-yellow-500/10'
                              )}
                            >
                              {content.status === 'approved' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : content.status === 'rejected' ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{content.content}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(content.timestamp).toLocaleDateString('pt-PT')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{content.confidence}% confiança</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(content.id, 'approve')}
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(content.id, 'reject')}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Moderação</CardTitle>
                  <CardDescription>
                    Ajuste as configurações do sistema de moderação automática
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {moderationSettings.map(setting => (
                    <Card key={setting.id}>
                      <CardContent className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{setting.name}</h3>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                          <Switch
                            checked={setting.enabled}
                            onCheckedChange={checked =>
                              handleSettingsChange(setting.id, 'enabled', checked)
                            }
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="mb-2 flex justify-between text-sm">
                              <span>Sensibilidade</span>
                              <span>{setting.sensitivity}%</span>
                            </div>
                            <Slider
                              value={[setting.sensitivity]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(vals: number[]) =>
                                handleSettingsChange(setting.id, 'sensitivity', vals[0])
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Ação Automática:</span>
                            <Select
                              value={setting.autoAction}
                              onValueChange={value =>
                                handleSettingsChange(setting.id, 'autoAction', value)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="flag">Sinalizar</SelectItem>
                                <SelectItem value="remove">Remover</SelectItem>
                                <SelectItem value="notify">Notificar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios de Moderação</CardTitle>
                  <CardDescription>Análise detalhada das ações de moderação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Gráfico de Ações */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex h-[300px] items-center justify-center">
                          <BarChart2 className="h-16 w-16 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">98%</div>
                            <p className="text-sm text-muted-foreground">Precisão da IA</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold">1.2s</div>
                            <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">5,678</div>
                            <p className="text-sm text-muted-foreground">Total de Moderações</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configurações Avançadas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
