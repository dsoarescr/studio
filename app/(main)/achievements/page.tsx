'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserStore, useSettingsStore } from '@/lib/store';
import {
  Lock,
  Award,
  Edit3,
  Users,
  Eye,
  Compass,
  Puzzle,
  Activity,
  CheckCheck,
  ShieldCheck,
  SortAsc,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  Megaphone,
  Trophy,
  CheckCircle2,
  Gift,
  PieChart,
  Download,
  BarChart3,
  Medal,
  Search,
  Share2,
  Sparkles,
  Coins,
  Zap,
  Palette,
  Map,
  BookImage,
  MessageSquare,
  Rocket,
  Hourglass,
  Shield,
  Crown,
  Target,
  Lightbulb,
} from 'lucide-react';
import {
  achievementsData,
  type Achievement,
  type AchievementCategory,
  type AchievementRarity,
} from '@/data/achievements-data';
import { useToast } from '@/hooks/use-toast';
import { AchievementNotification } from '@/components/features/AchievementNotification';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion } from 'framer-motion';

type FilterValue = AchievementCategory | 'all' | 'completed' | 'locked';
type SortValue = 'name' | 'rarity' | 'progress' | 'recent';

const filterCategories: {
  label: string;
  value: FilterValue;
  icon: React.ReactNode;
  color: string;
}[] = [
  { label: 'Todas', value: 'all', icon: <Eye className="h-4 w-4" />, color: 'text-foreground' },
  {
    label: 'Completas',
    value: 'completed',
    icon: <CheckCheck className="h-4 w-4" />,
    color: 'text-green-500',
  },
  {
    label: 'Bloqueadas',
    value: 'locked',
    icon: <Lock className="h-4 w-4" />,
    color: 'text-muted-foreground',
  },
  { label: 'Píxeis', value: 'pixel', icon: <Edit3 className="h-4 w-4" />, color: 'text-primary' },
  {
    label: 'Comunidade',
    value: 'community',
    icon: <Users className="h-4 w-4" />,
    color: 'text-blue-500',
  },
  {
    label: 'Exploração',
    value: 'exploration',
    icon: <Compass className="h-4 w-4" />,
    color: 'text-green-500',
  },
  {
    label: 'Coleção',
    value: 'collection',
    icon: <Puzzle className="h-4 w-4" />,
    color: 'text-purple-500',
  },
  {
    label: 'Social',
    value: 'social',
    icon: <Activity className="h-4 w-4" />,
    color: 'text-orange-500',
  },
  {
    label: 'Moderação',
    value: 'moderation',
    icon: <ShieldCheck className="h-4 w-4" />,
    color: 'text-red-500',
  },
];

const sortOptions: { label: string; value: SortValue; icon: React.ReactNode }[] = [
  { label: 'Nome', value: 'name', icon: <SortAsc className="h-4 w-4" /> },
  { label: 'Raridade', value: 'rarity', icon: <Star className="h-4 w-4" /> },
  { label: 'Progresso', value: 'progress', icon: <TrendingUp className="h-4 w-4" /> },
  { label: 'Recentes', value: 'recent', icon: <Clock className="h-4 w-4" /> },
];

const rarityStyles: Record<
  AchievementRarity,
  {
    borderClass: string;
    badgeClass: string;
    textClass: string;
    label: string;
    bgClass: string;
    glowClass: string;
  }
> = {
  common: {
    borderClass: 'border-slate-400/60 hover:border-slate-400',
    badgeClass: 'bg-slate-600 text-slate-200 border-slate-500',
    textClass: 'text-slate-400',
    label: 'Comum',
    bgClass: 'bg-slate-500/10',
    glowClass: 'hover:shadow-slate-400/20',
  },
  uncommon: {
    borderClass: 'border-green-500/60 hover:border-green-500',
    badgeClass: 'bg-green-700 text-green-200 border-green-600',
    textClass: 'text-green-400',
    label: 'Incomum',
    bgClass: 'bg-green-500/10',
    glowClass: 'hover:shadow-green-400/20',
  },
  rare: {
    borderClass: 'border-blue-500/60 hover:border-blue-500',
    badgeClass: 'bg-blue-700 text-blue-200 border-blue-600',
    textClass: 'text-blue-400',
    label: 'Rara',
    bgClass: 'bg-blue-500/10',
    glowClass: 'hover:shadow-blue-400/20',
  },
  epic: {
    borderClass: 'border-purple-500/60 hover:border-purple-500',
    badgeClass: 'bg-purple-700 text-purple-200 border-purple-600',
    textClass: 'text-purple-400',
    label: 'Épica',
    bgClass: 'bg-purple-500/10',
    glowClass: 'hover:shadow-purple-400/20',
  },
  legendary: {
    borderClass: 'border-amber-400/60 hover:border-amber-400',
    badgeClass: 'bg-amber-600 text-amber-100 border-amber-500',
    textClass: 'text-amber-300',
    label: 'Lendária',
    bgClass: 'bg-amber-500/10',
    glowClass: 'hover:shadow-amber-400/30',
  },
};

// Enhanced user progress data
const userProgress = {
  totalAchievements: achievementsData.length,
  unlockedAchievements: 8,
  totalXP: 2450,
  totalCredits: 850,
  completionPercentage: 35,
  recentUnlocks: [
    { id: 'color_master', unlockedAt: '2024-03-15T10:30:00Z', tier: 2 },
    { id: 'community_star', unlockedAt: '2024-03-14T15:45:00Z', tier: 1 },
    { id: 'time_virtuoso', unlockedAt: '2024-03-13T09:20:00Z', tier: 3 },
  ],
  streakDays: 12,
  nextMilestone: { target: 10, current: 8, reward: '500 XP + Badge Especial' },
};

// Exemplo de refatoração para criar um componente reutilizável para o Card de Progresso
function ProgressCard({ value, label, color }: { value: React.ReactNode; label: string; color: string }) {
  return (
    <Card className="min-w-[120px] bg-background/50 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [sortBy, setSortBy] = useState<SortValue>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { addCredits, addXp, unlockAchievement, achievements } = useUserStore();
  const { soundEffects } = useSettingsStore();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [playRewardSound, setPlayRewardSound] = useState(false);
  const [recentlyClaimedIds, setRecentlyClaimedIds] = useState<string[]>([]);

  const handleShareAchievement = (achievementName: string) => {
    toast({
      title: 'Conquista Partilhada!',
      description: `Partilhaste a conquista &quot;${achievementName}&quot; nas redes sociais.`,
    });
  };

  const showAchievementNotification = React.useCallback(
    (achievement: Achievement, tier: number) => {
      toast({
        duration: 5000,
        render: ({ onClose }) => (
          <AchievementNotification achievement={achievement} tier={tier} onClose={onClose} />
        ),
      });
    },
    [toast]
  );

  const handleClaimReward = (achievement: Achievement, tier: number) => {
    const achievementKey = `${achievement.id}-${tier}`;

    if (recentlyClaimedIds.includes(achievementKey)) {
      toast({
        title: 'Já Reclamado',
        description: 'Esta recompensa já foi reclamada.',
        variant: 'destructive',
      });
      return;
    }

    setRecentlyClaimedIds(prev => [...prev, achievementKey]);

    // Mostrar notificação animada
    showAchievementNotification(achievement, tier);

    // Recompensar o usuário
    const { xpReward, creditsReward } = achievement.tiers[tier - 1];
    addCredits(creditsReward);
    addXp(xpReward);
    unlockAchievement();
  };

  // Filter and sort achievements
  const filteredAchievements = achievementsData
    .filter(ach => {
      // Search filter
      if (
        searchQuery &&
        !ach.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ach.overallDescription.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (activeFilter === 'all') return true;
      if (activeFilter === 'completed') return ach.tiers.some(t => t.isUnlocked);
      if (activeFilter === 'locked') return !ach.tiers.some(t => t.isUnlocked);
      return ach.category === activeFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'progress':
          const aProgress = a.tiers.filter(t => t.isUnlocked).length / a.tiers.length;
          const bProgress = b.tiers.filter(t => t.isUnlocked).length / b.tiers.length;
          return bProgress - aProgress;
        case 'recent':
          // Mock recent sorting - use userProgress if available, otherwise stable
          return 0;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 transition-colors duration-300">
      <SoundEffect
        src={SOUND_EFFECTS.ACHIEVEMENT}
        play={playRewardSound}
        onEnd={() => setPlayRewardSound(false)}
      />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />

      <div className="container mx-auto mb-16 max-w-6xl space-y-6 px-4 py-6">
        {/* Enhanced Header */}
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card/95 to-primary/10 shadow-2xl">
          <div
            className="animate-shimmer absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            style={{ backgroundSize: '200% 200%' }}
          />
          <CardHeader className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-gradient-gold relative flex items-center font-headline text-3xl">
                  <Trophy className="animate-glow mr-3 h-8 w-8" />
                  Quadro de Conquistas
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  Desbloqueie conquistas épicas, ganhe XP e créditos para dominar o Pixel Universe!
                </CardDescription>
              </div>

              {/* Enhanced Progress Overview */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <ProgressCard
                  value={userProgress.unlockedAchievements}
                  label="Desbloqueadas"
                  color="text-primary"
                />
                <ProgressCard
                  value={`${userProgress.completionPercentage}%`}
                  label="Progresso"
                  color="text-accent"
                />
                <ProgressCard
                  value={userProgress.streakDays}
                  label="Sequência"
                  color="text-green-500"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid h-12 w-full grid-cols-3 bg-card/50 shadow-md backdrop-blur-sm">
            <TabsTrigger value="achievements" className="font-headline">
              <Trophy className="mr-2 h-4 w-4" />
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="progress" className="font-headline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="font-headline">
              <Medal className="mr-2 h-4 w-4" />
              Classificação
            </TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Enhanced Filters with Animation */}
            <Card className="bg-card/80 shadow-lg backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar conquistas..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-background/70 pl-10 focus:border-primary"
                    />
                  </div>

                  {/* Filter Buttons */}
                  <motion.div className="flex flex-wrap gap-2" layout>
                    {filterCategories.map(filter => (
                      <Button
                        key={filter.value}
                        variant={activeFilter === filter.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveFilter(filter.value)}
                        className={cn(
                          'font-code transition-all duration-200 hover:scale-105',
                          activeFilter === filter.value ? 'shadow-lg' : ''
                        )}
                      >
                        <span className={filter.color}>{filter.icon}</span>
                        <span className="ml-2">{filter.label}</span>
                      </Button>
                    ))}
                  </motion.div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2 border-t border-border/50 pt-2">
                    <span className="text-sm text-muted-foreground">Ordenar por:</span>
                    {sortOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setSortBy(option.value)}
                        className="font-code text-xs"
                      >
                        {option.icon}
                        <span className="ml-1">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Grid */}
            <div className="space-y-6">
              {filteredAchievements.length === 0 && (
                <Card className="animate-fade-in bg-card/50 p-8 text-center">
                  <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <CardDescription>Nenhuma conquista encontrada para este filtro.</CardDescription>
                </Card>
              )}

              {filteredAchievements.map(ach => {
                const totalTiers = ach.tiers.length;
                const unlockedTiers = ach.tiers.filter(t => t.isUnlocked).length;
                const progressPercentage = totalTiers > 0 ? (unlockedTiers / totalTiers) * 100 : 0;
                const nextTier = ach.tiers.find(t => !t.isUnlocked);
                const allTiersUnlocked = unlockedTiers === totalTiers;
                const currentRarityStyle = rarityStyles[ach.rarity];

                return (
                  <Card
                    key={ach.id}
                    className={cn(
                      `cursor-pointer border-2 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl`,
                      allTiersUnlocked
                        ? 'bg-gradient-to-br from-green-500/10 to-green-400/5'
                        : 'bg-card/70 backdrop-blur-sm',
                      currentRarityStyle.borderClass,
                      currentRarityStyle.glowClass,
                      allTiersUnlocked ? 'hover:shadow-green-400/30' : `hover:shadow-primary/20`,
                      'hover:-translate-y-1 hover:scale-[1.02]'
                    )}
                    onClick={() => setSelectedAchievement(ach)}
                  >
                    <CardHeader className="relative overflow-hidden pb-3">
                      {/* Animated background for legendary achievements */}
                      {ach.rarity === 'legendary' && (
                        <div
                          className="animate-shimmer absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20"
                          style={{ backgroundSize: '200% 100%' }}
                        />
                      )}

                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              `rounded-xl p-3 transition-all duration-300`,
                              allTiersUnlocked
                                ? 'animate-glow bg-green-400/30 text-green-400'
                                : `${currentRarityStyle.bgClass} ${currentRarityStyle.textClass}`,
                              'hover:scale-110'
                            )}
                          >
                            {React.cloneElement(ach.icon as React.ReactElement, {
                              className: `h-8 w-8 transition-transform duration-300`,
                            })}
                          </div>
                          <div>
                            <div className="mb-2 flex items-center gap-3">
                              <CardTitle
                                className={cn(
                                  `font-headline text-xl transition-colors duration-300`,
                                  allTiersUnlocked
                                    ? 'font-bold text-green-400'
                                    : currentRarityStyle.textClass
                                )}
                              >
                                {ach.name}
                              </CardTitle>
                              <Badge
                                className={cn(
                                  'border px-2 py-1 text-xs transition-all duration-300 hover:scale-105',
                                  currentRarityStyle.badgeClass
                                )}
                              >
                                {currentRarityStyle.label}
                              </Badge>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {ach.overallDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          {allTiersUnlocked && (
                            <Badge className="animate-pulse bg-gradient-to-r from-green-500 to-green-400 text-xs hover:from-green-600 hover:to-green-500">
                              <CheckCircle2 className="mr-1 h-3 w-3 animate-pulse" />
                              Completo!
                            </Badge>
                          )}
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    aria-label="Partilhar conquista"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary"
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleShareAchievement(ach.name);
                                    }}
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Partilhar conquista</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {allTiersUnlocked && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      aria-label="Reclamar recompensa"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-accent"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleClaimReward(ach, unlockedTiers);
                                      }}
                                    >
                                      <Gift className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Reclamar recompensa</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </div>

                      {totalTiers > 1 && (
                        <div className="relative z-10 mt-4">
                          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                            <span className="font-medium">Progresso</span>
                            <span className="font-code">
                              {unlockedTiers}/{totalTiers} Escalões
                            </span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className={cn(
                              `h-3 rounded-full transition-all duration-500`,
                              allTiersUnlocked
                                ? '[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500'
                                : `[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent`
                            )}
                          />
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {ach.tiers.map(tier => (
                        <div
                          key={tier.level}
                          className={cn(
                            `rounded-lg border p-4 transition-all duration-300 hover:scale-[1.02]`,
                            tier.isUnlocked
                              ? `bg-gradient-to-r from-background/80 to-background/60 ${currentRarityStyle.borderClass.replace('hover:border-', 'border-').replace('/60', '/40')} shadow-md`
                              : 'border-border bg-muted/30 hover:bg-muted/40'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {tier.isUnlocked ? (
                                <CheckCircle2 className="mr-3 h-5 w-5 animate-pulse text-green-400" />
                              ) : (
                                <Lock className="mr-3 h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <h4
                                  className={cn(
                                    `text-sm font-semibold`,
                                    tier.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                                  )}
                                >
                                  Nível {tier.level}
                                </h4>
                                <p
                                  className={cn(
                                    `mt-1 text-sm`,
                                    tier.isUnlocked ? 'text-foreground/80' : 'text-muted-foreground'
                                  )}
                                >
                                  {tier.description}
                                </p>
                              </div>
                            </div>
                            {tier.isUnlocked && (
                              <Badge
                                variant="outline"
                                className="animate-pulse border-green-400/70 text-xs text-green-400"
                              >
                                Desbloqueado
                              </Badge>
                            )}
                          </div>

                          {!tier.isUnlocked && nextTier && tier.level === nextTier.level && (
                            <Badge variant="secondary" className="mt-2 animate-pulse text-xs">
                              Próximo Objetivo
                            </Badge>
                          )}

                          <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2">
                            <div className="flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3 animate-pulse text-primary" />
                                <span className="font-code text-primary">+{tier.xpReward} XP</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Coins className="h-3 w-3 animate-pulse text-accent" />
                                <span className="font-code text-accent">+{tier.creditsReward}</span>
                              </span>
                            </div>
                            {tier.isUnlocked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs transition-transform hover:scale-105 hover:bg-primary/10"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleClaimReward(ach, tier.level);
                                }}
                              >
                                <Gift className="mr-1 h-3 w-3" />
                                Reclamar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="px-6 pb-4 pt-0">
                      {ach.rarity === 'legendary' && (
                        <Badge
                          variant="outline"
                          className="w-full justify-center border-amber-400/50 bg-amber-400/10 py-2 text-amber-400"
                        >
                          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                          Conquista Lendária - Extremamente Rara!
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Overall Progress */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <PieChart className="mr-2 h-5 w-5" />
                    Progresso Geral
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o seu progresso em todas as conquistas disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">
                      {userProgress.completionPercentage}%
                    </div>
                    <p className="text-muted-foreground">Conquistas Completas</p>
                  </div>

                  <Progress value={userProgress.completionPercentage} className="h-4" />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-500">
                        {userProgress.unlockedAchievements}
                      </p>
                      <p className="text-sm text-muted-foreground">Desbloqueadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">
                        {userProgress.totalAchievements - userProgress.unlockedAchievements}
                      </p>
                      <p className="text-sm text-muted-foreground">Restantes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Unlocks */}
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Clock className="mr-2 h-5 w-5" />
                    Desbloqueios Recentes
                  </CardTitle>
                  <CardDescription>
                    Suas conquistas mais recentes e recompensas obtidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-3">
                      {userProgress.recentUnlocks.map((unlock, index) => {
                        const achievement = achievementsData.find(a => a.id === unlock.id);
                        if (!achievement) return null;

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              {React.cloneElement(achievement.icon as React.ReactElement, {
                                className: 'h-5 w-5',
                              })}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{achievement.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Escalão {unlock.tier} •{' '}
                                {new Date(unlock.unlockedAt).toLocaleDateString('pt-PT')}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Trophy className="mr-1 h-3 w-3" />
                              Novo
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Milestone Progress */}
            <Card className="card-hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Target className="mr-2 h-5 w-5" />
                  Próximo Marco
                </CardTitle>
                <CardDescription>
                  Objetivos especiais para desbloquear recompensas exclusivas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">10 Conquistas Desbloqueadas</span>
                    <span className="text-sm text-muted-foreground">
                      {userProgress.nextMilestone.current}/{userProgress.nextMilestone.target}
                    </span>
                  </div>

                  <Progress
                    value={
                      (userProgress.nextMilestone.current / userProgress.nextMilestone.target) * 100
                    }
                    className="h-3"
                  />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recompensa:</span>
                    <span className="font-medium text-accent">
                      {userProgress.nextMilestone.reward}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="card-hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Medal className="mr-2 h-5 w-5" />
                  Classificação Global
                </CardTitle>
                <CardDescription>
                  Veja como se compara com outros exploradores de pixels!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex min-h-[200px] flex-col items-center justify-center">
                    <Trophy className="mb-4 h-16 w-16 animate-pulse text-amber-400" />
                    <p className="mb-4 text-center text-muted-foreground">
                      A classificação global estará disponível em breve.
                    </p>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Ver Classificação Completa
                    </Button>
                  </div>

                  <div className="space-y-4 border-t border-border/50 pt-4">
                    <h3 className="flex items-center text-lg font-semibold">
                      <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                      Dicas para Subir na Classificação
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-muted/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="font-medium">Seja Ativo Diariamente</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Mantenha uma sequência de logins diários para ganhar bônus de XP.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Compass className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Explore Novas Regiões</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Visite e interaja com diferentes regiões do mapa.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Participe da Comunidade</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Interaja com outros usuários e participe de eventos.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Foque nas Conquistas Raras</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Conquistas de maior raridade dão mais pontos na classificação.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievement Tips Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Dicas para Conquistadores
            </CardTitle>
            <CardDescription>
              Estratégias para desbloquear mais conquistas e maximizar suas recompensas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-card/50 p-4 shadow-inner">
                <h3 className="mb-2 flex items-center font-semibold">
                  <Compass className="mr-2 h-4 w-4 text-blue-500" />
                  Exploração Estratégica
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visite diferentes regiões do mapa diariamente e interaja com pixels variados para
                  desbloquear conquistas de exploração.
                </p>
              </div>
              <div className="rounded-lg bg-card/50 p-4 shadow-inner">
                <h3 className="mb-2 flex items-center font-semibold">
                  <Palette className="mr-2 h-4 w-4 text-purple-500" />
                  Diversidade de Cores
                </h3>
                <p className="text-sm text-muted-foreground">
                  Experimente usar uma ampla variedade de cores em seus pixels para desbloquear
                  conquistas relacionadas à criatividade.
                </p>
              </div>
              <div className="rounded-lg bg-card/50 p-4 shadow-inner">
                <h3 className="mb-2 flex items-center font-semibold">
                  <Users className="mr-2 h-4 w-4 text-green-500" />
                  Engajamento Social
                </h3>
                <p className="text-sm text-muted-foreground">
                  Participe ativamente da comunidade, comente em publicações e participe de eventos
                  para desbloquear conquistas sociais.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-primary/10 pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
              <Megaphone className="mr-2 h-4 w-4" />
              Compartilhar Minhas Conquistas
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
