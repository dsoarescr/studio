'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Target,
  Calendar,
  BarChart3,
  Star,
  MapPin,
  Play,
  Clock,
  Square,
  Coins,
  Zap,
  Gift,
  Crown,
  Medal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Lucide imports removed
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special' | 'regional';
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  prizes: Prize[];
  requirements: string[];
  category: string;
  region?: string;
  theme: string;
}

interface Prize {
  position: number;
  credits: number;
  xp: number;
  specialRewards: string[];
}

interface Participant {
  id: string;
  user: string;
  avatar: string;
  score: number;
  rank: number;
  region: string;
  isVerified: boolean;
  isPremium: boolean;
  joinedAt: string;
}

const tournaments: Tournament[] = [
  {
    id: 'weekly-art-1',
    name: 'Concurso Semanal de Arte',
    description: 'Crie a melhor obra de arte pixel da semana',
    type: 'weekly',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-22T00:00:00Z',
    participants: 156,
    maxParticipants: 200,
    entryFee: 50,
    prizes: [
      { position: 1, credits: 1000, xp: 500, specialRewards: ['Badge de Arte', 'Pixel Dourado'] },
      { position: 2, credits: 500, xp: 250, specialRewards: ['Badge de Arte'] },
      { position: 3, credits: 250, xp: 125, specialRewards: ['Badge de Arte'] },
    ],
    requirements: ['Nível 5+', 'Pixel art original'],
    category: 'art',
    theme: 'Natureza',
  },
  {
    id: 'monthly-collection-1',
    name: 'Torneio Mensal de Coleção',
    description: 'Quem consegue colecionar mais pixels únicos?',
    type: 'monthly',
    status: 'upcoming',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-29T00:00:00Z',
    participants: 89,
    maxParticipants: 500,
    entryFee: 100,
    prizes: [
      {
        position: 1,
        credits: 5000,
        xp: 2000,
        specialRewards: ['Título de Colecionador', 'Pixel Lendário'],
      },
      { position: 2, credits: 2500, xp: 1000, specialRewards: ['Título de Colecionador'] },
      { position: 3, credits: 1000, xp: 500, specialRewards: ['Badge de Coleção'] },
    ],
    requirements: ['Nível 10+', 'Mínimo 50 pixels'],
    category: 'collection',
    theme: 'Diversidade',
  },
  {
    id: 'regional-lisboa-1',
    name: 'Copa Regional de Lisboa',
    description: 'Competição exclusiva para utilizadores de Lisboa',
    type: 'regional',
    status: 'upcoming',
    startDate: '2024-01-25T00:00:00Z',
    endDate: '2024-02-25T00:00:00Z',
    participants: 45,
    maxParticipants: 100,
    entryFee: 75,
    prizes: [
      {
        position: 1,
        credits: 3000,
        xp: 1500,
        specialRewards: ['Título Regional', 'Pixel de Lisboa'],
      },
      { position: 2, credits: 1500, xp: 750, specialRewards: ['Badge Regional'] },
      { position: 3, credits: 750, xp: 375, specialRewards: ['Badge Regional'] },
    ],
    requirements: ['Região: Lisboa', 'Nível 8+'],
    category: 'regional',
    region: 'Lisboa',
    theme: 'Lisboa',
  },
  {
    id: 'special-winter-1',
    name: 'Festival de Inverno',
    description: 'Evento especial com tema de inverno',
    type: 'special',
    status: 'upcoming',
    startDate: '2024-01-30T00:00:00Z',
    endDate: '2024-02-15T00:00:00Z',
    participants: 234,
    maxParticipants: 1000,
    entryFee: 25,
    prizes: [
      {
        position: 1,
        credits: 2000,
        xp: 1000,
        specialRewards: ['Título de Inverno', 'Pixel de Gelo'],
      },
      { position: 2, credits: 1000, xp: 500, specialRewards: ['Badge de Inverno'] },
      { position: 3, credits: 500, xp: 250, specialRewards: ['Badge de Inverno'] },
    ],
    requirements: ['Todos os níveis'],
    category: 'special',
    theme: 'Inverno',
  },
];

const mockParticipants: Participant[] = [
  {
    id: '1',
    user: 'PixelGod',
    avatar: 'https://placehold.co/40x40.png',
    score: 1250,
    rank: 1,
    region: 'Lisboa',
    isVerified: true,
    isPremium: true,
    joinedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    user: 'ArtMaster',
    avatar: 'https://placehold.co/40x40.png',
    score: 1180,
    rank: 2,
    region: 'Porto',
    isVerified: true,
    isPremium: true,
    joinedAt: '2024-01-15T11:15:00Z',
  },
  {
    id: '3',
    user: 'ColorQueen',
    avatar: 'https://placehold.co/40x40.png',
    score: 1120,
    rank: 3,
    region: 'Coimbra',
    isVerified: false,
    isPremium: true,
    joinedAt: '2024-01-15T12:00:00Z',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-500 bg-green-500/10';
    case 'upcoming':
      return 'text-blue-500 bg-blue-500/10';
    case 'completed':
      return 'text-gray-500 bg-gray-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Play className="h-4 w-4" />;
    case 'upcoming':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <Square className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'weekly':
      return 'text-purple-500 bg-purple-500/10';
    case 'monthly':
      return 'text-blue-500 bg-blue-500/10';
    case 'special':
      return 'text-orange-500 bg-orange-500/10';
    case 'regional':
      return 'text-green-500 bg-green-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export const TournamentSystem: React.FC = () => {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    'all' | 'weekly' | 'monthly' | 'special' | 'regional'
  >('all');
  const [userParticipations, setUserParticipations] = useState<string[]>(['weekly-art-1']);

  const filteredTournaments = tournaments.filter(
    tournament => selectedType === 'all' || tournament.type === selectedType
  );

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Terminado';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handleJoinTournament = (tournamentId: string) => {
    if (!userParticipations.includes(tournamentId)) {
      setUserParticipations([...userParticipations, tournamentId]);
    }
  };

  const handleLeaveTournament = (tournamentId: string) => {
    setUserParticipations(userParticipations.filter(id => id !== tournamentId));
  };

  return (
    <div className="space-y-6">
      {/* Tournament Overview */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Trophy className="mr-2 h-5 w-5" />
            Sistema de Torneios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-card/50 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{tournaments.length}</div>
              <div className="text-sm text-muted-foreground">Torneios</div>
            </div>
            <div className="rounded-lg bg-card/50 p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {tournaments.filter(t => t.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Ativos</div>
            </div>
            <div className="rounded-lg bg-card/50 p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{userParticipations.length}</div>
              <div className="text-sm text-muted-foreground">Participações</div>
            </div>
            <div className="rounded-lg bg-card/50 p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">3</div>
              <div className="text-sm text-muted-foreground">Vitórias</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Target className="mr-2 h-5 w-5" />
            Tipos de Torneios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={value => setSelectedType(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden md:inline">Todos</span>
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Semanais</span>
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Mensais</span>
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden md:inline">Especiais</span>
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden md:inline">Regionais</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedType} className="mt-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredTournaments.map((tournament, index) => (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <h3 className="text-xl font-semibold">{tournament.name}</h3>
                                <Badge className={getStatusColor(tournament.status)}>
                                  {getStatusIcon(tournament.status)}
                                  <span className="ml-1">{tournament.status}</span>
                                </Badge>
                                <Badge className={getTypeColor(tournament.type)}>
                                  {tournament.type}
                                </Badge>
                              </div>
                              <p className="mb-3 text-muted-foreground">{tournament.description}</p>

                              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Participantes</p>
                                  <p className="font-semibold">
                                    {tournament.participants}/{tournament.maxParticipants}
                                  </p>
                                  <Progress
                                    value={
                                      (tournament.participants / tournament.maxParticipants) * 100
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Taxa de Entrada</p>
                                  <p className="font-semibold">{tournament.entryFee} créditos</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Tempo Restante</p>
                                  <p className="font-semibold">
                                    {getTimeRemaining(tournament.endDate)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Tema</p>
                                  <p className="font-semibold">{tournament.theme}</p>
                                </div>
                              </div>
                            </div>

                            <div className="ml-4">
                              {userParticipations.includes(tournament.id) ? (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleLeaveTournament(tournament.id)}
                                >
                                  Sair
                                </Button>
                              ) : (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleJoinTournament(tournament.id)}
                                  disabled={
                                    tournament.status !== 'upcoming' &&
                                    tournament.status !== 'active'
                                  }
                                >
                                  Participar
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Prizes */}
                          <div className="mb-4">
                            <h4 className="mb-2 font-medium">Prémios:</h4>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              {tournament.prizes.map((prize, idx) => (
                                <div key={idx} className="rounded-lg bg-muted/50 p-3">
                                  <div className="mb-2 flex items-center gap-2">
                                    {idx === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                                    {idx === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                                    {idx === 2 && <Medal className="h-4 w-4 text-orange-400" />}
                                    <span className="font-semibold">{prize.position}º Lugar</span>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Coins className="h-3 w-3 text-yellow-500" />
                                      <span>{prize.credits} créditos</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Zap className="h-3 w-3 text-blue-500" />
                                      <span>{prize.xp} XP</span>
                                    </div>
                                    {prize.specialRewards.map((reward, rewardIdx) => (
                                      <div key={rewardIdx} className="flex items-center gap-1">
                                        <Gift className="h-3 w-3 text-purple-500" />
                                        <span>{reward}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h4 className="mb-2 font-medium">Requisitos:</h4>
                            <div className="flex flex-wrap gap-2">
                              {tournament.requirements.map((req, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Active Tournament Leaderboard */}
      {tournaments.filter(t => t.status === 'active').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <BarChart3 className="mr-2 h-5 w-5" />
              Classificação Ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockParticipants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {participant.rank === 1 && (
                              <Crown className="h-5 w-5 animate-pulse text-yellow-400" />
                            )}
                            {participant.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                            {participant.rank === 3 && (
                              <Medal className="h-5 w-5 text-orange-400" />
                            )}
                            <span className="text-lg font-bold">#{participant.rank}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={participant.avatar} alt={participant.user} />
                              <AvatarFallback>
                                {participant.user.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{participant.user}</span>
                                {participant.isVerified && (
                                  <Badge variant="outline" className="p-1">
                                    <Star className="h-3 w-3" />
                                  </Badge>
                                )}
                                {participant.isPremium && (
                                  <Crown className="h-4 w-4 text-amber-400" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{participant.region}</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{participant.score}</div>
                          <p className="text-sm text-muted-foreground">pontos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
