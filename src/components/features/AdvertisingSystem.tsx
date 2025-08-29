'use client';

import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  TrendingUp,
  Users,
  Target,
  Eye,
  MousePointer,
  Clock,
  Calendar,
  DollarSign,
  Settings,
  Megaphone,
  Layout,
  Image as ImageIcon,
  Upload,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  type: 'banner' | 'featured' | 'spotlight';
  status: 'active' | 'scheduled' | 'ended' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: Date;
  endDate: Date;
  targeting: {
    regions: string[];
    interests: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  creatives: {
    id: string;
    type: 'image' | 'banner';
    url: string;
    title: string;
    description?: string;
    performance: {
      impressions: number;
      clicks: number;
      ctr: number;
    };
  }[];
}

interface AdSlot {
  id: string;
  name: string;
  type: 'banner' | 'featured' | 'spotlight';
  location: string;
  dimensions: string;
  pricePerDay: number;
  availability: number;
  performance: {
    avgImpressions: number;
    avgClicks: number;
    avgCtr: number;
  };
}

export function AdvertisingSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Pixels Premium Porto',
      type: 'banner',
      status: 'active',
      budget: 1000,
      spent: 450,
      impressions: 15000,
      clicks: 450,
      ctr: 3,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      targeting: {
        regions: ['Porto', 'Braga'],
        interests: ['Investimentos', 'História'],
        minPrice: 1000,
        maxPrice: 5000,
      },
      creatives: [
        {
          id: 'c1',
          type: 'banner',
          url: '/ads/banner1.jpg',
          title: 'Pixels Premium no Centro do Porto',
          description: 'Invista em localizações históricas',
          performance: {
            impressions: 8000,
            clicks: 240,
            ctr: 3,
          },
        },
        {
          id: 'c2',
          type: 'image',
          url: '/ads/image1.jpg',
          title: 'Vista para o Douro',
          performance: {
            impressions: 7000,
            clicks: 210,
            ctr: 3,
          },
        },
      ],
    },
  ]);

  const [adSlots, setAdSlots] = useState<AdSlot[]>([
    {
      id: 'slot1',
      name: 'Banner Principal',
      type: 'banner',
      location: 'Topo da Página',
      dimensions: '1200x300',
      pricePerDay: 100,
      availability: 85,
      performance: {
        avgImpressions: 5000,
        avgClicks: 150,
        avgCtr: 3,
      },
    },
    {
      id: 'slot2',
      name: 'Destaque Lateral',
      type: 'featured',
      location: 'Sidebar',
      dimensions: '300x600',
      pricePerDay: 75,
      availability: 60,
      performance: {
        avgImpressions: 3000,
        avgClicks: 90,
        avgCtr: 3,
      },
    },
  ]);

  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Megaphone className="h-6 w-6 text-primary" />
                Sistema de Publicidade
              </CardTitle>
              <CardDescription>Gerencie suas campanhas e alcance mais compradores</CardDescription>
            </div>
            <Button>Nova Campanha</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
              <TabsTrigger value="slots">Espaços</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">15,000</div>
                      <p className="text-sm text-muted-foreground">Impressões</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MousePointer className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">450</div>
                      <p className="text-sm text-muted-foreground">Cliques</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">3%</div>
                      <p className="text-sm text-muted-foreground">CTR Médio</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold">€450</div>
                      <p className="text-sm text-muted-foreground">Gasto Total</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campanhas Ativas */}
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map(campaign => (
                      <Card key={campaign.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{campaign.title}</h3>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge variant="secondary">{campaign.type}</Badge>
                                <Badge
                                  className={
                                    campaign.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Orçamento</p>
                              <p className="font-medium">
                                €{campaign.spent} / €{campaign.budget}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="mb-1 flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Progresso do Orçamento
                              </span>
                              <span className="text-sm">
                                {Math.round((campaign.spent / campaign.budget) * 100)}%
                              </span>
                            </div>
                            <Progress value={(campaign.spent / campaign.budget) * 100} />
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Impressões</p>
                              <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Cliques</p>
                              <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">CTR</p>
                              <p className="font-medium">{campaign.ctr}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns">{/* Implementação das campanhas */}</TabsContent>

            <TabsContent value="slots">
              <div className="space-y-4">
                {adSlots.map(slot => (
                  <Card key={slot.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{slot.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary">{slot.type}</Badge>
                            <span className="text-sm text-muted-foreground">{slot.dimensions}</span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{slot.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">€{slot.pricePerDay}</p>
                          <p className="text-sm text-muted-foreground">por dia</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Impressões Médias</p>
                          <p className="font-medium">
                            {slot.performance.avgImpressions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cliques Médios</p>
                          <p className="font-medium">
                            {slot.performance.avgClicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CTR Médio</p>
                          <p className="font-medium">{slot.performance.avgCtr}%</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm text-muted-foreground">Disponibilidade</span>
                          <span className="text-sm">{slot.availability}%</span>
                        </div>
                        <Progress value={slot.availability} />
                      </div>

                      <div className="mt-6">
                        <Button className="w-full">Reservar Espaço</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">{/* Implementação das análises */}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
