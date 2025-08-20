'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  BarChart4, TrendingUp, Users, MessageSquare, Heart, Share2,
  Eye, Target, PieChart, Activity, Clock, Calendar, Zap,
  Award, Star, Flame, ThumbsUp, Network, Globe, UserPlus, User
} from "lucide-react";
import { cn } from '@/lib/utils';

interface CommunityStats {
  totalMembers: number;
  activeToday: number;
  postsToday: number;
  engagementRate: number;
  topContributors: TopContributor[];
  growthData: GrowthData[];
  engagementMetrics: EngagementMetric[];
}

interface TopContributor {
  id: string;
  name: string;
  avatar: string;
  contributions: number;
  type: 'posts' | 'comments' | 'likes' | 'shares';
  growth: number;
}

interface GrowthData {
  period: string;
  members: number;
  posts: number;
  engagement: number;
}

interface EngagementMetric {
  name: string;
  value: number;
  change: number;
  icon: any;
  color: string;
}

interface PersonalAnalytics {
  postsCreated: number;
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  followersGained: number;
  engagementRate: number;
  topPost: {
    title: string;
    likes: number;
    comments: number;
  };
  activeHours: number[];
  topTopics: string[];
}

const mockCommunityStats: CommunityStats = {
  totalMembers: 15420,
  activeToday: 2340,
  postsToday: 156,
  engagementRate: 78.5,
  topContributors: [
    {
      id: '1',
      name: 'Ana Silva',
      avatar: '/avatars/ana.jpg',
      contributions: 45,
      type: 'posts',
      growth: 12
    },
    {
      id: '2',
      name: 'Carlos Santos',
      avatar: '/avatars/carlos.jpg',
      contributions: 234,
      type: 'comments',
      growth: 8
    },
    {
      id: '3',
      name: 'Maria Costa',
      avatar: '/avatars/maria.jpg',
      contributions: 567,
      type: 'likes',
      growth: -3
    }
  ],
  growthData: [
    { period: 'Jan', members: 12000, posts: 1200, engagement: 65 },
    { period: 'Fev', members: 13200, posts: 1450, engagement: 70 },
    { period: 'Mar', members: 14800, posts: 1680, engagement: 75 },
    { period: 'Abr', members: 15420, posts: 1890, engagement: 78.5 }
  ],
  engagementMetrics: [
    { name: 'Posts', value: 1890, change: 12.5, icon: MessageSquare, color: 'text-blue-500' },
    { name: 'Likes', value: 23400, change: 18.2, icon: Heart, color: 'text-red-500' },
    { name: 'Comentários', value: 8760, change: 15.7, icon: MessageSquare, color: 'text-green-500' },
    { name: 'Compartilhamentos', value: 3420, change: 22.1, icon: Share2, color: 'text-purple-500' }
  ]
};

const mockPersonalAnalytics: PersonalAnalytics = {
  postsCreated: 23,
  likesReceived: 567,
  commentsReceived: 89,
  sharesReceived: 34,
  followersGained: 45,
  engagementRate: 85.2,
  topPost: {
    title: 'Minha primeira pixel art de Lisboa',
    likes: 156,
    comments: 23
  },
  activeHours: [0, 2, 5, 12, 18, 25, 30, 45, 38, 28, 15, 8, 12, 20, 35, 40, 45, 38, 25, 15, 8, 5, 2, 1],
  topTopics: ['Pixel Art', 'Lisboa', 'Tutorial', 'Colaboração', 'Marketplace']
};

export function CommunityAnalytics() {
  const [communityStats] = useState<CommunityStats>(mockCommunityStats);
  const [personalAnalytics] = useState<PersonalAnalytics>(mockPersonalAnalytics);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-6 w-6 text-blue-500" />
            Analytics da Comunidade
          </CardTitle>
          <CardDescription>
            Insights detalhados sobre engajamento, crescimento e performance
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="community" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            Comunidade
          </TabsTrigger>
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Pessoal
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Zap className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Community Analytics */}
        <TabsContent value="community" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatNumber(communityStats.totalMembers)}</div>
                <div className="text-sm text-muted-foreground">Membros Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatNumber(communityStats.activeToday)}</div>
                <div className="text-sm text-muted-foreground">Ativos Hoje</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{communityStats.postsToday}</div>
                <div className="text-sm text-muted-foreground">Posts Hoje</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{communityStats.engagementRate}%</div>
                <div className="text-sm text-muted-foreground">Engajamento</div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Engajamento</CardTitle>
              <CardDescription>Performance das interações na comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {communityStats.engagementMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={metric.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={cn("h-5 w-5", metric.color)} />
                        <Badge className={cn("text-xs", getChangeColor(metric.change))}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{formatNumber(metric.value)}</div>
                      <div className="text-sm text-muted-foreground">{metric.name}</div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Contribuidores</CardTitle>
              <CardDescription>Membros mais ativos da comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityStats.topContributors.map((contributor, index) => (
                  <div key={contributor.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contributor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {contributor.contributions} {contributor.type}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn("text-xs", getChangeColor(contributor.growth))}>
                      {contributor.growth > 0 ? '+' : ''}{contributor.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Analytics */}
        <TabsContent value="personal" className="space-y-6">
          {/* Personal Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{personalAnalytics.postsCreated}</div>
                <div className="text-sm text-blue-600">Posts Criados</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">{personalAnalytics.likesReceived}</div>
                <div className="text-sm text-red-600">Likes Recebidos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <UserPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{personalAnalytics.followersGained}</div>
                <div className="text-sm text-green-600">Novos Seguidores</div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Engajamento Pessoal</CardTitle>
              <CardDescription>Sua performance de interação na comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Taxa de Engajamento</span>
                  <span className="text-2xl font-bold text-green-600">{personalAnalytics.engagementRate}%</span>
                </div>
                <Progress value={personalAnalytics.engagementRate} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  Acima da média da comunidade (+7.2%)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Post */}
          <Card>
            <CardHeader>
              <CardTitle>Seu Post Mais Popular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-lg mb-2">{personalAnalytics.topPost.title}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{personalAnalytics.topPost.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span>{personalAnalytics.topPost.comments} comentários</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Horários de Maior Atividade</CardTitle>
              <CardDescription>Quando você é mais ativo na comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-24 gap-1 mb-4">
                {personalAnalytics.activeHours.map((activity, hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "h-8 rounded-sm transition-colors",
                      activity > 30 ? "bg-green-500" :
                      activity > 20 ? "bg-yellow-500" :
                      activity > 10 ? "bg-orange-500" : "bg-gray-200"
                    )}
                    title={`${hour}:00 - ${activity} atividades`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Seus Tópicos Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {personalAnalytics.topTopics.map((topic, index) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className={cn(
                      "text-sm",
                      index === 0 && "bg-purple-100 text-purple-700 border-purple-200"
                    )}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Crescimento</CardTitle>
              <CardDescription>Evolução da comunidade ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {communityStats.growthData.map((data, index) => (
                  <div key={data.period} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div className="font-medium">{data.period}</div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{formatNumber(data.members)}</div>
                        <div className="text-muted-foreground">Membros</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{data.posts}</div>
                        <div className="text-muted-foreground">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">{data.engagement}%</div>
                        <div className="text-muted-foreground">Engajamento</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-700">Insight Positivo</h3>
                </div>
                <p className="text-sm text-green-700">
                  Sua taxa de engajamento está 15% acima da média! 
                  Continue criando conteúdo de qualidade.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-700">Melhor Horário</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Posts às 18:00 recebem 40% mais engajamento. 
                  Considere postar neste horário.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-700">Oportunidade</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Conteúdo sobre "Tutorial" tem alta demanda. 
                  Crie mais tutoriais para aumentar o alcance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Network className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-700">Networking</h3>
                </div>
                <p className="text-sm text-orange-700">
                  Você está conectado com 67% dos top contribuidores. 
                  Expanda sua rede para maior visibilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
