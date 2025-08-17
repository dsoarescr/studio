'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Map, MapPin, Search, Filter, TrendingUp, Users, 
  Activity, Clock, Star, Eye, Heart, MessageSquare,
  Zap, Target, Award, Crown, Coins, Gift
} from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Region {
  id: string;
  name: string;
  pixels: number;
  activeUsers: number;
  avgPrice: number;
  trend: 'up' | 'down' | 'stable';
}

interface Activity {
  id: string;
  type: 'purchase' | 'color_change' | 'login' | 'achievement';
  user: string;
  description: string;
  timestamp: string;
  region?: string;
}

const mockRegions: Region[] = [
  { id: '1', name: 'Lisboa', pixels: 1250, activeUsers: 89, avgPrice: 45.2, trend: 'up' },
  { id: '2', name: 'Porto', pixels: 980, activeUsers: 67, avgPrice: 38.7, trend: 'up' },
  { id: '3', name: 'Coimbra', pixels: 456, activeUsers: 34, avgPrice: 32.1, trend: 'stable' },
  { id: '4', name: 'Braga', pixels: 378, activeUsers: 28, avgPrice: 29.8, trend: 'down' },
  { id: '5', name: 'Faro', pixels: 234, activeUsers: 19, avgPrice: 41.3, trend: 'up' },
];

const mockActivities: Activity[] = [
  { id: '1', type: 'purchase', user: 'PixelMaster', description: 'Comprou pixel em Lisboa', timestamp: '2 min', region: 'Lisboa' },
  { id: '2', type: 'color_change', user: 'ArtLover', description: 'Mudou cor do pixel', timestamp: '5 min', region: 'Porto' },
  { id: '3', type: 'achievement', user: 'Explorer', description: 'Desbloqueou "Primeiro Pixel"', timestamp: '8 min' },
  { id: '4', type: 'login', user: 'NewUser', description: 'Entrou no Pixel Universe', timestamp: '12 min' },
];

export default function MapSidebar() {
  const [activeTab, setActiveTab] = useState<'regions' | 'activity' | 'stats'>('regions');
  const [searchQuery, setSearchQuery] = useState('');
  const { credits, specialCredits, level, pixels } = useUserStore();

  const filteredRegions = mockRegions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <div className="h-3 w-3 rounded-full bg-yellow-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Coins className="h-4 w-4 text-green-500" />;
      case 'color_change': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'login': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-80 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Map className="h-5 w-5 mr-2 text-primary" />
            Explorador
          </h2>
          <Badge variant="outline" className="text-xs">
            Nível {level}
          </Badge>
        </div>
        
        {/* User Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="p-2">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{credits.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Créditos</div>
            </div>
          </Card>
          <Card className="p-2">
            <div className="text-center">
              <div className="text-lg font-bold text-accent">{pixels}</div>
              <div className="text-xs text-muted-foreground">Pixels</div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar regiões..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <Button
          variant={activeTab === 'regions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('regions')}
          className="flex-1 rounded-none"
        >
          <MapPin className="h-4 w-4 mr-1" />
          Regiões
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('activity')}
          className="flex-1 rounded-none"
        >
          <Activity className="h-4 w-4 mr-1" />
          Atividade
        </Button>
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('stats')}
          className="flex-1 rounded-none"
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Stats
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === 'regions' && (
            <div className="space-y-3">
              {filteredRegions.map(region => (
                <Card key={region.id} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{region.name}</h3>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(region.trend)}
                      <span className="text-xs text-muted-foreground">
                        €{region.avgPrice.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {region.pixels} pixels
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {region.activeUsers} ativos
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {mockActivities.map(activity => (
                <Card key={activity.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{activity.user}</span>
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      {activity.region && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {activity.region}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <Card className="p-3">
                <h3 className="font-medium mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  Estatísticas Globais
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de Pixels:</span>
                    <span className="font-medium">10.3M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pixels Vendidos:</span>
                    <span className="font-medium text-green-500">2.5K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilizadores Ativos:</span>
                    <span className="font-medium text-blue-500">1.2K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço Médio:</span>
                    <span className="font-medium text-primary">€42.35</span>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <h3 className="font-medium mb-3 flex items-center">
                  <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                  Top Regiões
                </h3>
                <div className="space-y-2">
                  {mockRegions.slice(0, 3).map((region, index) => (
                    <div key={region.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 text-xs">
                          {index + 1}
                        </Badge>
                        <span>{region.name}</span>
                      </div>
                      <span className="font-medium">{region.pixels}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}