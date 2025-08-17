import React from 'react';
import { 
  Edit3, Users, Eye, Map, Compass, Puzzle, Activity, 
  CheckCheck, ShieldCheck, Star, Crown, Award, Trophy,
  Target, Flame, Zap, Heart, ThumbsUp, MessageSquare,
  Palette, MapPin, Globe, Rocket, Settings, Bell
} from "lucide-react";

export type AchievementCategory = 'pixel' | 'community' | 'exploration' | 'collection' | 'social' | 'moderation';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementTier {
  level: number;
  description: string;
  requirement: string;
  xpReward: number;
  creditsReward: number;
  isUnlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  overallDescription: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: React.ReactNode;
  tiers: AchievementTier[];
}

export const achievementsData: Achievement[] = [
  {
    id: 'first_pixel',
    name: 'Primeiro Pixel',
    overallDescription: 'Compre o seu primeiro pixel no mapa de Portugal.',
    category: 'pixel',
    rarity: 'common',
    icon: <Edit3 className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Compre 1 pixel',
        requirement: 'Comprar o primeiro pixel',
        xpReward: 50,
        creditsReward: 25,
        isUnlocked: true
      }
    ]
  },
  {
    id: 'pixel_collector',
    name: 'Colecionador de Pixels',
    overallDescription: 'Acumule uma coleção impressionante de pixels.',
    category: 'pixel',
    rarity: 'uncommon',
    icon: <Puzzle className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Possua 10 pixels',
        requirement: 'Comprar 10 pixels',
        xpReward: 100,
        creditsReward: 50,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Possua 50 pixels',
        requirement: 'Comprar 50 pixels',
        xpReward: 250,
        creditsReward: 125,
        isUnlocked: false
      },
      {
        level: 3,
        description: 'Possua 100 pixels',
        requirement: 'Comprar 100 pixels',
        xpReward: 500,
        creditsReward: 250,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'color_master',
    name: 'Mestre das Cores',
    overallDescription: 'Demonstre maestria na arte de combinar cores.',
    category: 'pixel',
    rarity: 'rare',
    icon: <Palette className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Use 10 cores diferentes',
        requirement: 'Usar 10 cores únicas',
        xpReward: 150,
        creditsReward: 75,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Use 25 cores diferentes',
        requirement: 'Usar 25 cores únicas',
        xpReward: 300,
        creditsReward: 150,
        isUnlocked: true
      },
      {
        level: 3,
        description: 'Use 50 cores diferentes',
        requirement: 'Usar 50 cores únicas',
        xpReward: 600,
        creditsReward: 300,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'community_star',
    name: 'Estrela da Comunidade',
    overallDescription: 'Torne-se uma figura respeitada na comunidade.',
    category: 'community',
    rarity: 'epic',
    icon: <Star className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Receba 100 gostos',
        requirement: 'Acumular 100 gostos',
        xpReward: 200,
        creditsReward: 100,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Receba 500 gostos',
        requirement: 'Acumular 500 gostos',
        xpReward: 500,
        creditsReward: 250,
        isUnlocked: false
      },
      {
        level: 3,
        description: 'Receba 1000 gostos',
        requirement: 'Acumular 1000 gostos',
        xpReward: 1000,
        creditsReward: 500,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'explorer',
    name: 'Explorador',
    overallDescription: 'Explore todas as regiões de Portugal.',
    category: 'exploration',
    rarity: 'uncommon',
    icon: <Compass className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Visite 3 regiões diferentes',
        requirement: 'Explorar 3 regiões',
        xpReward: 100,
        creditsReward: 50,
        isUnlocked: false
      },
      {
        level: 2,
        description: 'Visite todas as 7 regiões',
        requirement: 'Explorar todas as regiões',
        xpReward: 300,
        creditsReward: 150,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'social_butterfly',
    name: 'Borboleta Social',
    overallDescription: 'Interaja ativamente com outros utilizadores.',
    category: 'social',
    rarity: 'common',
    icon: <Users className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Faça 10 comentários',
        requirement: 'Comentar 10 vezes',
        xpReward: 75,
        creditsReward: 35,
        isUnlocked: false
      },
      {
        level: 2,
        description: 'Faça 50 comentários',
        requirement: 'Comentar 50 vezes',
        xpReward: 200,
        creditsReward: 100,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'time_virtuoso',
    name: 'Virtuoso do Tempo',
    overallDescription: 'Demonstre dedicação consistente ao longo do tempo.',
    category: 'collection',
    rarity: 'rare',
    icon: <Zap className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Login por 7 dias consecutivos',
        requirement: 'Sequência de 7 dias',
        xpReward: 150,
        creditsReward: 75,
        isUnlocked: false
      },
      {
        level: 2,
        description: 'Login por 30 dias consecutivos',
        requirement: 'Sequência de 30 dias',
        xpReward: 500,
        creditsReward: 250,
        isUnlocked: false
      },
      {
        level: 3,
        description: 'Login por 100 dias consecutivos',
        requirement: 'Sequência de 100 dias',
        xpReward: 1500,
        creditsReward: 750,
        isUnlocked: true
      }
    ]
  },
  {
    id: 'pixel_legend',
    name: 'Lenda dos Pixels',
    overallDescription: 'Alcance o status lendário no Pixel Universe.',
    category: 'pixel',
    rarity: 'legendary',
    icon: <Crown className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Possua 1000 pixels',
        requirement: 'Comprar 1000 pixels',
        xpReward: 2000,
        creditsReward: 1000,
        isUnlocked: false
      },
      {
        level: 2,
        description: 'Possua 5000 pixels',
        requirement: 'Comprar 5000 pixels',
        xpReward: 5000,
        creditsReward: 2500,
        isUnlocked: false
      }
    ]
  }
];