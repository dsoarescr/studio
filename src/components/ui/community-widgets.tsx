'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, Calendar, Trophy, Star, Crown, Gift, 
  Zap, Eye, Heart, MessageSquare, Share2, MapPin, Palette,
  Clock, Globe, UserPlus, Award, Gem, Target, Flame, Sparkles,
  Coffee, Pizza, Rocket, Rainbow, Sun, Moon, Music, Camera,
  Video, Mic, Headphones, Gamepad2, Brush, Scissors, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommunityStats {
  totalUsers: number;
  activeUsers: number;
  postsToday: number;
  pixelsShared: number;
  totalInteractions: number;
  growthRate: number;
}

interface TrendingCreator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  growthRate: number;
  specialty: string;
  verified: boolean;
  recentWork: string;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  prize: string;
  endDate: string;
  progress: number;
  category: string;
}

interface LiveActivity {
  id: string;
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

// Mock Data
const mockStats: CommunityStats = {
  totalUsers: 12547,
  activeUsers: 1247,
  postsToday: 234,
  pixelsShared: 567,
  totalInteractions: 8901,
  growthRate: 23.4
};

const mockTrendingCreators: TrendingCreator[] = [
  {
    id: '1',
    name: 'PixelMaster',
    avatar: 'https://placehold.co/50x50.png',
    followers: 2340,
    growthRate: 45.2,
    specialty: 'Paisagens',
    verified: true,
    recentWork: 'Sunset over Douro'
  },
  {
    id: '2',
    name: 'ColorWizard',
    avatar: 'https://placehold.co/50x50.png',
    followers: 1890,
    growthRate: 38.7,
    specialty: 'Arte Abstrata',
    verified: false,
    recentWork: 'Abstract Lisboa'
  },
  {
    id: '3',
    name: 'PortugalArt',
    avatar: 'https://placehold.co/50x50.png',
    followers: 1567,
    growthRate: 29.3,
    specialty: 'Património',
    verified: true,
    recentWork: 'Mosteiro dos Jerónimos'
  }
];

const mockChallenges: CommunityChallenge[] = [
  {
    id: '1',
    title: 'Cores de Portugal',
    description: 'Crie arte usando apenas cores da bandeira portuguesa',
    participants: 156,
    prize: '1000 créditos especiais',
    endDate: '31 Dez',
    progress: 67,
    category: 'Arte'
  },
  {
    id: '2',
    title: 'Colaboração Épica',
    description: 'Trabalhe em equipa para criar uma obra coletiva',
    participants: 89,
    prize: 'Badge exclusivo + 500 créditos',
    endDate: '15 Jan',
    progress: 34,
    category: 'Colaboração'
  }
];

const mockLiveActivity: LiveActivity[] = [
  {
    id: '1',
    user: 'PixelArtist',
    action: 'criou um pixel lendário',
    target: 'Lisboa (245, 156)',
    timestamp: '2m',
    icon: <Sparkles className="h-4 w-4" />,
    color: 'text-amber-500'
  },
  {
    id: '2',
    user: 'ColorMaster',
    action: 'ganhou o concurso',
    target: 'Arte Natalícia',
    timestamp: '5m',
    icon: <Trophy className="h-4 w-4" />,
    color: 'text-yellow-500'
  },
  {
    id: '3',
    user: 'NewPixeler',
    action: 'juntou-se à comunidade',
    timestamp: '8m',
    icon: <UserPlus className="h-4 w-4" />,
    color: 'text-green-500'
  },
  {
    id: '4',
    user: 'InvestorPro',
    action: 'comprou pixel raro',
    target: 'Porto (123, 89)',
    timestamp: '12m',
    icon: <Gem className="h-4 w-4" />,
    color: 'text-purple-500'
  }
];

// Componente: Estatísticas da Comunidade
export function CommunityStatsWidget() {
  const [stats, setStats] = useState(mockStats);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 50)
      }));
      setTimeout(() => setIsAnimating(false), 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Users className="h-5 w-5 mr-2" />
          Estatísticas da Comunidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold text-green-500 transition-all duration-500",
              isAnimating && "scale-110"
            )}>
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Online Agora</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.postsToday}
            </div>
            <div className="text-xs text-muted-foreground">Posts Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {stats.pixelsShared}
            </div>
            <div className="text-xs text-muted-foreground">Pixels Partilhados</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold text-purple-500 transition-all duration-500",
              isAnimating && "scale-110"
            )}>
              {stats.totalInteractions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Interações</div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span>Crescimento esta semana:</span>
            <Badge className="bg-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.growthRate}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Criadores em Destaque
export function TrendingCreatorsWidget() {
  const [creators, setCreators] = useState(mockTrendingCreators);
  const { toast } = useToast();

  const handleFollow = (creatorId: string) => {
    setCreators(prev => prev.map(creator => 
      creator.id === creatorId 
        ? { ...creator, followers: creator.followers + 1 }
        : creator
    ));
    
    toast({
      title: "Criador Seguido!",
      description: "Agora receberá notificações das suas criações.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-500">
          <Flame className="h-5 w-5 mr-2" />
          Criadores em Destaque
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
                    {index + 1}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{creator.name}</span>
                    {creator.verified && (
                      <Star className="h-3 w-3 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{creator.specialty}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{creator.followers.toLocaleString()} seguidores</span>
                    <Badge variant="outline" className="text-xs">
                      +{creator.growthRate}%
                    </Badge>
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => handleFollow(creator.id)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Seguir
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Desafios da Comunidade
export function CommunityChallengesWidget() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const { toast } = useToast();

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, participants: challenge.participants + 1 }
        : challenge
    ));
    
    const challenge = challenges.find(c => c.id === challengeId);
    toast({
      title: "Desafio Aceite! 🎯",
      description: `Juntou-se ao "${challenge?.title}"`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-500">
          <Target className="h-5 w-5 mr-2" />
          Desafios da Comunidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className="p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{challenge.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {challenge.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {challenge.description}
              </p>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span>Progresso da Comunidade</span>
                  <span>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">{challenge.participants} participantes</span>
                  <span className="mx-2">•</span>
                  <span className="text-primary font-medium">{challenge.prize}</span>
                </div>
                <Button size="sm" onClick={() => joinChallenge(challenge.id)}>
                  Participar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Atividade Ao Vivo
export function LiveActivityWidget() {
  const [activities, setActivities] = useState(mockLiveActivity);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        user: `User${Math.floor(Math.random() * 1000)}`,
        action: [
          'comprou um pixel',
          'criou arte nova',
          'ganhou uma conquista',
          'juntou-se a um clube',
          'partilhou um pixel'
        ][Math.floor(Math.random() * 5)],
        timestamp: 'agora',
        icon: [
          <ShoppingCart className="h-4 w-4" />,
          <Palette className="h-4 w-4" />,
          <Trophy className="h-4 w-4" />,
          <Users className="h-4 w-4" />,
          <Share2 className="h-4 w-4" />
        ][Math.floor(Math.random() * 5)],
        color: [
          'text-green-500',
          'text-purple-500',
          'text-yellow-500',
          'text-blue-500',
          'text-pink-500'
        ][Math.floor(Math.random() * 5)]
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-500">
          <Activity className="h-5 w-5 mr-2 animate-pulse" />
          Atividade Ao Vivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            <AnimatePresence>
              {activities.map(activity => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-2 hover:bg-muted/20 rounded transition-colors"
                >
                  <div className={cn("p-1 rounded-full bg-muted/30", activity.color)}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      {activity.target && (
                        <span className="text-primary"> {activity.target}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Componente: Mood Board da Comunidade
export function CommunityMoodBoard() {
  const [currentMood, setCurrentMood] = useState('creative');
  
  const moods = [
    { id: 'creative', label: 'Criativo', icon: <Palette className="h-5 w-5" />, color: 'text-purple-500', count: 234 },
    { id: 'collaborative', label: 'Colaborativo', icon: <Users className="h-5 w-5" />, color: 'text-blue-500', count: 156 },
    { id: 'competitive', label: 'Competitivo', icon: <Trophy className="h-5 w-5" />, color: 'text-yellow-500', count: 89 },
    { id: 'chill', label: 'Relaxado', icon: <Coffee className="h-5 w-5" />, color: 'text-green-500', count: 67 },
    { id: 'excited', label: 'Animado', icon: <Zap className="h-5 w-5" />, color: 'text-orange-500', count: 123 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-pink-500">
          <Heart className="h-5 w-5 mr-2" />
          Mood da Comunidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {moods.map(mood => {
            const percentage = (mood.count / moods.reduce((sum, m) => sum + m.count, 0)) * 100;
            
            return (
              <div key={mood.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={mood.color}>
                      {mood.icon}
                    </div>
                    <span className="font-medium text-sm">{mood.label}</span>
                  </div>
                  <span className="text-sm font-bold">{mood.count}</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
          <p className="text-sm font-medium text-primary">
            A comunidade está se sentindo <span className="font-bold">Criativa</span> hoje! 🎨
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Eventos da Semana
export function WeeklyEventsWidget() {
  const events = [
    {
      id: '1',
      title: 'Pixel Art Workshop',
      date: 'Seg, 18 Dez',
      time: '20:00',
      host: 'PixelMaster',
      participants: 45,
      type: 'workshop'
    },
    {
      id: '2',
      title: 'Concurso de Natal',
      date: 'Qua, 20 Dez',
      time: '19:00',
      host: 'Pixel Universe',
      participants: 156,
      type: 'contest'
    },
    {
      id: '3',
      title: 'Live Collaboration',
      date: 'Sex, 22 Dez',
      time: '21:00',
      host: 'ColorWizard',
      participants: 23,
      type: 'collaboration'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <Brush className="h-4 w-4 text-blue-500" />;
      case 'contest': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'collaboration': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-500">
          <Calendar className="h-5 w-5 mr-2" />
          Eventos desta Semana
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                {getEventIcon(event.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    por {event.host}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span>{event.date} às {event.time}</span>
                <Badge variant="outline">
                  {event.participants} inscritos
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Quick Actions
export function CommunityQuickActions() {
  const { toast } = useToast();

  const actions = [
    { 
      id: 'create-pixel', 
      label: 'Criar Pixel', 
      icon: <Palette className="h-5 w-5" />, 
      color: 'from-purple-500 to-pink-500',
      action: () => toast({ title: "Redirecionando...", description: "Abrindo editor de pixels" })
    },
    { 
      id: 'join-contest', 
      label: 'Concurso', 
      icon: <Trophy className="h-5 w-5" />, 
      color: 'from-yellow-500 to-orange-500',
      action: () => toast({ title: "Concurso!", description: "Juntando-se ao concurso ativo" })
    },
    { 
      id: 'start-collab', 
      label: 'Colaborar', 
      icon: <Users className="h-5 w-5" />, 
      color: 'from-blue-500 to-cyan-500',
      action: () => toast({ title: "Colaboração!", description: "Iniciando sessão colaborativa" })
    },
    { 
      id: 'go-live', 
      label: 'Ao Vivo', 
      icon: <Video className="h-5 w-5" />, 
      color: 'from-red-500 to-pink-500',
      action: () => toast({ title: "Live Stream!", description: "Iniciando transmissão ao vivo" })
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Zap className="h-5 w-5 mr-2" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(action => (
            <Button
              key={action.id}
              onClick={action.action}
              className={cn(
                "h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-br hover:scale-105 transition-transform",
                action.color
              )}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}