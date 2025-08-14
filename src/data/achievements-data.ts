import { 
  Edit3, Users, Compass, Puzzle, Activity, ShieldCheck, 
  Sparkles, Trophy, Star, Crown, Gem, Heart, MapPin,
  Palette, Target, Zap, Award, Gift, Medal
} from "lucide-react";

export type AchievementCategory = 'pixel' | 'community' | 'exploration' | 'collection' | 'social' | 'moderation' | 'special';
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
    overallDescription: 'Compre o seu primeiro pixel no mapa',
    category: 'pixel',
    rarity: 'common',
    icon: <MapPin className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Comprar 1 pixel',
        requirement: 'Compre qualquer pixel no mapa',
        xpReward: 50,
        creditsReward: 10,
        isUnlocked: true
      }
    ]
  },
  {
    id: 'pixel_collector',
    name: 'Colecionador de Pixels',
    overallDescription: 'Acumule uma coleção impressionante de pixels',
    category: 'collection',
    rarity: 'uncommon',
    icon: <Puzzle className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Possuir 5 pixels',
        requirement: 'Tenha 5 pixels na sua coleção',
        xpReward: 100,
        creditsReward: 25,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Possuir 25 pixels',
        requirement: 'Tenha 25 pixels na sua coleção',
        xpReward: 250,
        creditsReward: 50,
        isUnlocked: false
      },
      {
        level: 3,
        description: 'Possuir 100 pixels',
        requirement: 'Tenha 100 pixels na sua coleção',
        xpReward: 500,
        creditsReward: 100,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'color_master',
    name: 'Mestre das Cores',
    overallDescription: 'Demonstre maestria na utilização de cores',
    category: 'pixel',
    rarity: 'rare',
    icon: <Palette className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Usar 10 cores diferentes',
        requirement: 'Use 10 cores diferentes nos seus pixels',
        xpReward: 150,
        creditsReward: 30,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Usar 50 cores diferentes',
        requirement: 'Use 50 cores diferentes nos seus pixels',
        xpReward: 300,
        creditsReward: 75,
        isUnlocked: true
      },
      {
        level: 3,
        description: 'Usar 100 cores diferentes',
        requirement: 'Use 100 cores diferentes nos seus pixels',
        xpReward: 600,
        creditsReward: 150,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'community_star',
    name: 'Estrela da Comunidade',
    overallDescription: 'Torne-se uma figura respeitada na comunidade',
    category: 'social',
    rarity: 'epic',
    icon: <Star className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Receber 100 likes',
        requirement: 'Receba 100 likes nos seus pixels',
        xpReward: 200,
        creditsReward: 50,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Receber 500 likes',
        requirement: 'Receba 500 likes nos seus pixels',
        xpReward: 500,
        creditsReward: 125,
        isUnlocked: false
      },
      {
        level: 3,
        description: 'Receber 1000 likes',
        requirement: 'Receba 1000 likes nos seus pixels',
        xpReward: 1000,
        creditsReward: 250,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'explorer',
    name: 'Explorador',
    overallDescription: 'Explore todas as regiões de Portugal',
    category: 'exploration',
    rarity: 'uncommon',
    icon: <Compass className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Visitar 3 regiões',
        requirement: 'Visite 3 regiões diferentes',
        xpReward: 100,
        creditsReward: 20,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Visitar 7 regiões',
        requirement: 'Visite todas as 7 regiões de Portugal',
        xpReward: 300,
        creditsReward: 75,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'legend',
    name: 'Lenda do Pixel Universe',
    overallDescription: 'Alcance o status lendário no Pixel Universe',
    category: 'special',
    rarity: 'legendary',
    icon: <Crown className="h-6 w-6" />,
    tiers: [
      {
        level: 1,
        description: 'Atingir nível 50',
        requirement: 'Alcance o nível 50',
        xpReward: 2000,
        creditsReward: 500,
        isUnlocked: false
      },
      {
        level: 2,
        description: 'Possuir 1000 pixels',
        requirement: 'Tenha 1000 pixels na sua coleção',
        xpReward: 5000,
        creditsReward: 1000,
        isUnlocked: false
      }
    ]
  }
];