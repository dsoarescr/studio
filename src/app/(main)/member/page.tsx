'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import {
  User, MapPin, Trophy, Coins, Gift, Star, Crown, Gem,
  Edit3, Settings, Share2, Calendar, Clock, Eye, Heart,
  Award, Target, Zap, Palette, Users, BarChart3
} from "lucide-react";

export default function MemberPage() {
  const { user } = useAuth();
  const { 
    credits, 
    specialCredits, 
    level, 
    xp, 
    xpMax, 
    pixels, 
    achievements, 
    isPremium,
    streak,
    totalSpent,
    totalEarned
  } = useUserStore();

  const [activeTab, setActiveTab] = useState('overview');
  const xpPercentage = (xp / xpMax) * 100;

  const stats = [
    { label: 'Pixels Possuídos', value: pixels, icon: <MapPin className="h-5 w-5" />, color: 'text-primary' },
    { label: 'Conquistas', value: achievements, icon: <Trophy className="h-5 w-5" />, color: 'text-yellow-500' },
    { label: 'Créditos', value: credits, icon: <Coins className="h-5 w-5" />, color: 'text-green-500' },
    { label: 'Especiais', value: specialCredits, icon: <Gift className="h-5 w-5" />, color: 'text-purple-500' }
  ];

  const recentActivity = [
    { action: 'Comprou pixel em Lisboa', time: '2h atrás', type: 'purchase' },
    { action: 'Desbloqueou "Mestre das Cores"', time: '1d atrás', type: 'achievement' },
    { action: 'Editou pixel no Porto', time: '2d atrás', type: 'edit' },
    { action: 'Juntou-se à comunidade', time: '1 semana atrás', type: 'social' }
  ];

  const myPixels = [
    { x: 245, y: 156, region: 'Lisboa', color: '#D4A757', value: 150 },
    { x: 123, y: 89, region: 'Porto', color: '#7DF9FF', value: 120 },
    { x: 300, y: 200, region: 'Coimbra', color: '#9C27B0', value: 90 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-6xl">
        {/* Profile Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                  <AvatarImage 
                    src={user?.photoURL || 'https://placehold.co/128x128.png'} 
                    alt={user?.displayName || 'User'} 
                  />
                  <AvatarFallback className="text-4xl font-headline">
                    {user?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isPremium && (
                  <Crown className="absolute -top-2 -right-2 h-8 w-8 text-amber-500" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-headline font-bold text-gradient-gold mb-2">
                  {user?.displayName || 'Pixel Master'}
                </h1>
                <p className="text-muted-foreground mb-4">
                  Explorador de pixels desde {new Date().getFullYear()}
                </p>
                
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Nível {level}
                  </Badge>
                  {isPremium && (
                    <Badge className="bg-amber-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline">
                    Sequência: {streak} dias
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso XP</span>
                    <span className="font-code">{xp}/{xpMax}</span>
                  </div>
                  <Progress value={xpPercentage} className="h-3" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partilhar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className={`mx-auto mb-2 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pixels">Meus Pixels</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Resumo Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">€{totalEarned}</div>
                      <div className="text-sm text-muted-foreground">Total Ganho</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-red-500">€{totalSpent}</div>
                      <div className="text-sm text-muted-foreground">Total Gasto</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      €{totalEarned - totalSpent}
                    </div>
                    <div className="text-sm text-muted-foreground">Lucro Líquido</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pixels" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPixels.map((pixel, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">
                        Pixel ({pixel.x}, {pixel.y})
                      </h3>
                      <Badge variant="outline">{pixel.region}</Badge>
                    </div>
                    
                    <div 
                      className="w-full h-24 rounded border mb-3"
                      style={{ backgroundColor: pixel.color }}
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Valor estimado: €{pixel.value}
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Primeiro Pixel', description: 'Comprou o primeiro pixel', unlocked: true },
                { name: 'Colecionador', description: 'Possui 10 pixels', unlocked: true },
                { name: 'Mestre das Cores', description: 'Usou 20 cores diferentes', unlocked: false },
                { name: 'Explorador', description: 'Visitou 5 regiões', unlocked: false }
              ].map((achievement, index) => (
                <Card key={index} className={achievement.unlocked ? 'bg-green-500/5 border-green-500/30' : 'opacity-60'}>
                  <CardContent className="p-4 text-center">
                    <Trophy className={`h-8 w-8 mx-auto mb-2 ${achievement.unlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    <h3 className="font-semibold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && (
                      <Badge className="mt-2 bg-green-500">Desbloqueado</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Taxa de Sucesso</span>
                    <span className="font-bold text-green-500">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pixels por Dia</span>
                    <span className="font-bold">2.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI Médio</span>
                    <span className="font-bold text-primary">+15%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Regional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { region: 'Lisboa', count: 15, percentage: 45 },
                    { region: 'Porto', count: 12, percentage: 36 },
                    { region: 'Coimbra', count: 6, percentage: 19 }
                  ].map((region) => (
                    <div key={region.region} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{region.region}</span>
                        <span>{region.count} pixels</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}