export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  reputation: number;
  isVerified: boolean;
  joinDate: Date;
  totalSales: number;
  totalPurchases: number;
}

export interface HistoryEvent {
  id: string;
  pixelId: string;
  type: 'sale' | 'auction_bid' | 'price_change' | 'view' | 'favorite' | 'comment';
  userId: string;
  timestamp: Date;
  data: {
    price?: number;
    oldPrice?: number;
    bidAmount?: number;
    comment?: string;
    rating?: number;
  };
}

export interface Comment {
  id: string;
  pixelId: string;
  userId: string;
  content: string;
  rating: number;
  timestamp: Date;
  images?: string[];
  likes: number;
  replies: Comment[];
  isVerifiedPurchase: boolean;
}

export interface Rating {
  id: string;
  pixelId: string;
  userId: string;
  score: number;
  timestamp: Date;
  review?: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  reportCount: number;
}

export interface AnalyticsData {
  views: {
    total: number;
    daily: { date: string; count: number }[];
    unique: number;
  };
  engagement: {
    favorites: number;
    comments: number;
    shares: number;
  };
  price: {
    history: { date: string; price: number }[];
    average: number;
    min: number;
    max: number;
  };
  market: {
    demand: number;
    supply: number;
    competition: number;
    trend: 'up' | 'down' | 'stable';
  };
}
