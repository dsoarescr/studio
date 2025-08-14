import { 
  Edit3, Users, Eye, Map, Compass, Puzzle, Activity, 
  ShieldCheck, Sparkles, Crown, Star, Trophy, Award,
  Palette, MapPin, Globe, Heart, MessageSquare, Target
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
  icon: React.ReactNode;
  category: AchievementCategory;
  rarity: AchievementRarity;
  tiers: AchievementTier[];
}

export const achievementsData: Achievement[] = [
  {
    id: 'first_pixel',
    name: 'Primeiro Pixel',
    overallDescription: 'Compre seu primeiro pixel no mapa',
    icon: <Edit3 className="h-6 w-6" />,
    category: 'pixel',
    rarity: 'common',
    tiers: [
      {
        level: 1,
        description: 'Comprar 1 pixel',
        requirement: 'Compre qualquer pixel no mapa',
        xpReward: 50,
        creditsReward: 25,
        isUnlocked: true
      }
    ]
  },
  {
    id: 'pixel_collector',
    name: 'Colecionador de Pixels',
    overallDescription: 'Colecione múltiplos pixels',
    icon: <Puzzle className="h-6 w-6" />,
    category: 'collection',
    rarity: 'uncommon',
    tiers: [
      {
        level: 1,
        description: 'Possuir 5 pixels',
        requirement: 'Tenha 5 pixels na sua coleção',
        xpReward: 100,
        creditsReward: 50,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Possuir 25 pixels',
        requirement: 'Tenha 25 pixels na sua coleção',
        xpReward: 250,
        creditsReward: 125,
        isUnlocked: false
      },
      {
        level: 3,
        description: 'Possuir 100 pixels',
        requirement: 'Tenha 100 pixels na sua coleção',
        xpReward: 500,
        creditsReward: 250,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'community_star',
    name: 'Estrela da Comunidade',
    overallDescription: 'Torne-se popular na comunidade',
    icon: <Users className="h-6 w-6" />,
    category: 'community',
    rarity: 'rare',
    tiers: [
      {
        level: 1,
        description: 'Receber 100 curtidas',
        requirement: 'Seus posts receberam 100 curtidas',
        xpReward: 200,
        creditsReward: 100,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Receber 500 curtidas',
        requirement: 'Seus posts receberam 500 curtidas',
        xpReward: 500,
        creditsReward: 250,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'explorer',
    name: 'Explorador',
    overallDescription: 'Explore diferentes regiões do mapa',
    icon: <Compass className="h-6 w-6" />,
    category: 'exploration',
    rarity: 'uncommon',
    tiers: [
      {
        level: 1,
        description: 'Visitar 3 regiões',
        requirement: 'Visite 3 regiões diferentes',
        xpReward: 75,
        creditsReward: 40,
        isUnlocked: true
      },
      {
        level: 2,
        description: 'Visitar todas as regiões',
        requirement: 'Visite todas as regiões de Portugal',
        xpReward: 300,
        creditsReward: 150,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'social_butterfly',
    name: 'Borboleta Social',
    overallDescription: 'Seja ativo nas redes sociais',
    icon: <Activity className="h-6 w-6" />,
    category: 'social',
    rarity: 'rare',
    tiers: [
      {
        level: 1,
        description: 'Fazer 10 comentários',
        requirement: 'Comente em 10 posts diferentes',
        xpReward: 150,
        creditsReward: 75,
        isUnlocked: false
      },
      {
        level: 2,
        description: 'Fazer 50 comentários',
        requirement: 'Comente em 50 posts diferentes',
        xpReward: 400,
        creditsReward: 200,
        isUnlocked: false
      }
    ]
  }
];