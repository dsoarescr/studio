'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Lucide imports removed
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RankingEntry {
  id: string;
  rank: number;
  user: string;
  avatar: string;
  score: number;
  level: number;
  region: string;
  streak: number;
  change: number;
  badges: string[];
  isVerified: boolean;
  isPremium: boolean;
  category: string;
  season: string;
}

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  theme: string;
  rewards: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const seasons: Season[] = [
  {
    id: 'season-1',
    name: 'Temporada Inverno 2024',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    isActive: true,
    theme: 'Inverno',
    rewards: ['Badge de Gelo', '5000 Créditos', 'Pixel Especial']
  },
  {
    id: 'season-2',
    name: 'Temporada Primavera 2024',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    isActive: false,
    theme: 'Primavera',
    rewards: ['Badge de Flores', '7500 Créditos', 'Pixel Raro']
  }
];

const categories: Category[] = [
  {
    id: 'overall',
    name: 'Geral',
    description: 'Ranking geral baseado em todos os critérios',
    icon: <Trophy className="h-5 w-5" />,
    color: 'text-yellow-500'
  },
  {
    id: 'pixels',
    name: 'Colecionador',
    description: 'Ranking baseado no número de pixels',
    icon: <MapPin className="h-5 w-5" />,
    color: 'text-blue-500'
  },
  {
    id: 'art',
    name: 'Artista',
    description: 'Ranking baseado na qualidade artística',
    icon: <Star className="h-5 w-5" />,
    color: 'text-purple-500'
  },
  {
    id: 'investment',
    name: 'Investidor',
    description: 'Ranking baseado no valor dos pixels',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-green-500'
  },
  {
    id: 'streak',
    name: 'Consistência',
    description: 'Ranking baseado na sequência de dias ativos',
    icon: <Flame className="h-5 w-5" />,
    color: 'text-orange-500'
  }
];

const mockRankingData: RankingEntry[] = [
  {
    id: '1',
    rank: 1,
    user: "PixelGod",
    avatar: "https://placehold.co/40x40.png",
    score: 125000,
    level: 25,
    region: "Lisboa",
    streak: 89,
    change: 2,
    badges: ["legendary", "verified"],
    isVerified: true,
    isPremium: true,
    category: "overall",
    season: "season-1"
  },
  {
    id: '2',
    rank: 2,
    user: "ArtMaster",
    avatar: "https://placehold.co/40x40.png",
    score: 110000,
    level: 23,
    region: "Porto",
    streak: 67,
    change: 0,
    badges: ["epic", "premium"],
    isVerified: true,
    isPremium: true,
    category: "overall",
    season: "season-1"
  },
  {
    id: '3',
    rank: 3,
    user: "ColorQueen",
    avatar: "https://placehold.co/40x40.png",
    score: 95000,
    level: 21,
    region: "Coimbra",
    streak: 45,
    change: -1,
    badges: ["rare"],
    isVerified: false,
    isPremium: true,
    category: "overall",
    season: "season-1"
  }
];

export const DynamicRankingSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [selectedSeason, setSelectedSeason] = useState('season-1');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const filteredData = mockRankingData.filter(
    entry => entry.category === selectedCategory && entry.season === selectedSeason
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400 animate-pulse" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-400" />;
      default: return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Season Selector */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Calendar className="h-5 w-5 mr-2" />
            Temporadas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasons.map(season => (
              <motion.div
                key={season.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    selectedSeason === season.id 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedSeason(season.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{season.name}</h3>
                      {season.isActive && (
                        <Badge variant="default" className="bg-green-500">
                          Ativa
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {season.startDate} - {season.endDate}
                    </p>
                    <div className="space-y-1">
                      {season.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span>{reward}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Target className="h-5 w-5 mr-2" />
            Categorias de Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <span className={category.color}>{category.icon}</span>
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  
                  {/* Ranking List */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredData.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    {getRankIcon(entry.rank)}
                                    <span className="font-bold text-lg">#{entry.rank}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={entry.avatar} alt={entry.user} />
                                      <AvatarFallback>{entry.user.substring(0,2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">{entry.user}</span>
                                        {entry.isVerified && (
                                          <Badge variant="outline" size="sm">
                                            <Star className="h-3 w-3" />
                                          </Badge>
                                        )}
                                        {entry.isPremium && (
                                          <Crown className="h-4 w-4 text-amber-400" />
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">{entry.region}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="font-bold">{entry.score.toLocaleString('pt-PT')}</p>
                                    <p className="text-sm text-muted-foreground">pontos</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm">{entry.streak}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    {getChangeIcon(entry.change)}
                                    <span className="text-sm">
                                      {entry.change > 0 ? `+${entry.change}` : entry.change}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

