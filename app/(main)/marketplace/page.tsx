'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store";
import { useAuth } from '@/lib/auth-context';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Search, Filter, Grid3X3, List, Star, Heart, Eye, 
  MessageSquare, Users, MapPin, Clock, TrendingUp, Flame, Crown, 
  Gem, Sparkles, Zap, Target, Award, Coins, Gift, Share2, 
  ExternalLink, Navigation, Gavel, Timer, ChevronUp, ChevronDown,
  ThumbsUp, UserPlus, Send, Check, X, AlertTriangle, Info,
  BarChart3, TrendingDown, Calendar, Globe, Bookmark, Settings,
  Plus, Minus, RefreshCw, Download, Upload, Copy, Link as LinkIcon,
  DollarSign, Percent, Activity, Bell, BellRing, Volume2, VolumeX
} from "lucide-react";
import { cn } from '@/lib/utils';
import { formatDate, timeAgo } from '@/lib/utils';

// Types
interface MarketplacePixel {
  id: string;
  x: number;
  y: number;
  region: string;
  title: string;
  description: string;
  price: number;
  specialCreditsPrice?: number;
  seller: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
    isPremium: boolean;
    rating: number;
    totalSales: number;
  };
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  color: string;
  imageUrl: string;
  tags: string[];
  features: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    followers: number;
  };
  isLiked: boolean;
  isFollowing: boolean;
  isFeatured: boolean;
  isHot: boolean;
  isNew: boolean;
  isAuction: boolean;
  auctionData?: {
    currentBid: number;
    timeLeft: number; // em segundos
    bidCount: number;
    highestBidder?: string;
  };
  listedDate: string;
  lastPriceChange?: string;
  priceHistory: Array<{ price: number; date: string }>;
  gpsCoords?: { lat: number; lon: number };
  offers: Array<{
    id: string;
    buyer: string;
    amount: number;
    message?: string;
    timestamp: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

interface UserPixelSale {
  id: string;
  x: number;
  y: number;
  region: string;
  title: string;
  price: number;
  listedDate: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    followers: number;
  };
  offers: Array<{
    id: string;
    buyer: string;
    amount: number;
    message?: string;
    timestamp: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  isPromoted: boolean;
  promotionExpiry?: string;
}

// Mock Data
const mockMarketplacePixels: MarketplacePixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    title: 'Vista Premium do Tejo',
    description: 'Pixel exclusivo com vista panorâmica para o Rio Tejo no coração de Lisboa.',
    price: 450,
    specialCreditsPrice: 180,
    seller: {
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      level: 25,
      verified: true,
      isPremium: true,
      rating: 4.9,
      totalSales: 156
    },
    rarity: 'Lendário',
    color: '#D4A757',
    imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Premium',
    tags: ['vista', 'rio', 'premium', 'lisboa'],
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade', 'Zona Turística'],
    stats: { views: 2340, likes: 456, comments: 89, followers: 234 },
    isLiked: false,
    isFollowing: false,
    isFeatured: true,
    isHot: true,
    isNew: false,
    isAuction: true,
    auctionData: {
      currentBid: 420,
      timeLeft: 3600,
      bidCount: 23,
      highestBidder: 'ArtInvestor'
    },
    listedDate: '2024-03-10',
    lastPriceChange: '2024-03-12',
    priceHistory: [
      { price: 400, date: '2024-03-10' },
      { price: 430, date: '2024-03-11' },
      { price: 450, date: '2024-03-12' }
    ],
    gpsCoords: { lat: 38.7223, lon: -9.1393 },
    offers: [
      {
        id: 'o1',
        buyer: 'PixelHunter',
        amount: 400,
        message: 'Interessado neste pixel para minha coleção!',
        timestamp: '2024-03-15T10:30:00Z',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    title: 'Arte Ribeirinha',
    description: 'Pixel artístico na zona histórica da Ribeira do Porto.',
    price: 280,
    seller: {
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      level: 18,
      verified: false,
      isPremium: false,
      rating: 4.6,
      totalSales: 89
    },
    rarity: 'Épico',
    color: '#7DF9FF',
    imageUrl: 'https://placehold.co/300x300/7DF9FF/000000?text=Porto+Art',
    tags: ['arte', 'ribeira', 'porto', 'unesco'],
    features: ['Património UNESCO', 'Zona Ribeirinha', 'Arte Local'],
    stats: { views: 1890, likes: 234, comments: 45, followers: 123 },
    isLiked: true,
    isFollowing: false,
    isFeatured: false,
    isHot: false,
    isNew: true,
    isAuction: false,
    listedDate: '2024-03-14',
    priceHistory: [{ price: 280, date: '2024-03-14' }],
    gpsCoords: { lat: 41.1579, lon: -8.6291 },
    offers: []
  },
  {
    id: '3',
    x: 300,
    y: 200,
    region: 'Coimbra',
    title: 'Universidade Histórica',
    description: 'Pixel na zona universitária histórica de Coimbra.',
    price: 320,
    specialCreditsPrice: 120,
    seller: {
      name: 'StudentArtist',
      avatar: 'https://placehold.co/40x40.png',
      level: 12,
      verified: true,
      isPremium: true,
      rating: 4.7,
      totalSales: 45
    },
    rarity: 'Raro',
    color: '#9C27B0',
    imageUrl: 'https://placehold.co/300x300/9C27B0/FFFFFF?text=Coimbra+Uni',
    tags: ['universidade', 'história', 'coimbra', 'educação'],
    features: ['Zona Universitária', 'Património Histórico', 'Centro Cultural'],
    stats: { views: 1560, likes: 189, comments: 34, followers: 89 },
    isLiked: false,
    isFollowing: true,
    isFeatured: false,
    isHot: true,
    isNew: false,
    isAuction: false,
    listedDate: '2024-03-12',
    priceHistory: [
      { price: 300, date: '2024-03-12' },
      { price: 320, date: '2024-03-14' }
    ],
    gpsCoords: { lat: 40.2033, lon: -8.4103 },
    offers: [
      {
        id: 'o2',
        buyer: 'CoimbraFan',
        amount: 300,
        timestamp: '2024-03-15T14:20:00Z',
        status: 'pending'
      }
    ]
  }
];

const mockUserSales: UserPixelSale[] = [
  {
    id: 'us1',
    x: 400,
    y: 300,
    region: 'Braga',
    title: 'Pixel Histórico de Braga',
    price: 180,
    listedDate: '2024-03-13',
    stats: { views: 890, likes: 67, comments: 23, followers: 45 },
    offers: [
      {
        id: 'o3',
        buyer: 'BragaCollector',
        amount: 160,
        message: 'Ofereço 160€ por este pixel. É para minha coleção pessoal.',
        timestamp: '2024-03-15T09:15:00Z',
        status: 'pending'
      },
      {
        id: 'o4',
        buyer: 'PixelInvestor',
        amount: 170,
        timestamp: '2024-03-15T11:30:00Z',
        status: 'pending'
      }
    ],
    isPromoted: false
  },
  {
    id: 'us2',
    x: 500,
    y: 400,
    region: 'Faro',
    title: 'Praia Dourada do Algarve',
    price: 220,
    listedDate: '2024-03-11',
    stats: { views: 1234, likes: 98, comments: 34, followers: 67 },
    offers: [],
    isPromoted: true,
    promotionExpiry: '2024-03-20'
  }
];

export default function MarketplacePage() {
  const [pixels, setPixels] = useState<MarketplacePixel[]>(mockMarketplacePixels);
  const [userSales, setUserSales] = useState<UserPixelSale[]>(mockUserSales);
  const [selectedPixel, setSelectedPixel] = useState<MarketplacePixel | null>(null);
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Forms
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'special'>('credits');
  
  // States
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    credits, 
    specialCredits, 
    addCredits, 
    removeCredits, 
    addSpecialCredits, 
    removeSpecialCredits, 
    addXp, 
    addPixel 
  } = useUserStore();

  // Filter pixels
  const filteredPixels = pixels.filter(pixel => {
    const matchesSearch = !searchQuery || 
      pixel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pixel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pixel.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'all' || pixel.region === selectedRegion;
    const matchesRarity = selectedRarity === 'all' || pixel.rarity === selectedRarity;
    const matchesPrice = pixel.price >= priceRange[0] && pixel.price <= priceRange[1];
    const matchesFeatured = !showFeaturedOnly || pixel.isFeatured;
    
    return matchesSearch && matchesRegion && matchesRarity && matchesPrice && matchesFeatured;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.stats.views - a.stats.views;
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'popularity':
        return (b.stats.likes + b.stats.views) - (a.stats.likes + a.stats.views);
      case 'newest':
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      case 'views':
        return b.stats.views - a.stats.views;
      default:
        return 0;
    }
  });

  // Get pixels user is following
  const followingPixels = pixels.filter(pixel => pixel.isFollowing);
  
  // Get pixels user liked
  const likedPixels = pixels.filter(pixel => pixel.isLiked);
  
  // Get auction pixels
  const auctionPixels = pixels.filter(pixel => pixel.isAuction);

  // Timer for auctions
  useEffect(() => {
    const interval = setInterval(() => {
      setPixels(prev => prev.map(pixel => {
        if (pixel.isAuction && pixel.auctionData) {
          return {
            ...pixel,
            auctionData: {
              ...pixel.auctionData,
              timeLeft: Math.max(0, pixel.auctionData.timeLeft - 1)
            }
          };
        }
        return pixel;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'Incomum': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Raro': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Épico': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Lendário': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handlePixelClick = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setIsPixelModalOpen(true);
    
    // Increment views
    setPixels(prev => prev.map(p => 
      p.id === pixel.id 
        ? { ...p, stats: { ...p.stats, views: p.stats.views + 1 } }
        : p
    ));
  };

  const handleBuyPixel = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setIsBuyModalOpen(true);
  };

  const handleBidPixel = (pixel: MarketplacePixel) => {
    setSelectedPixel(pixel);
    setIsBidModalOpen(true);
  };

  const handleLikePixel = (pixelId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir pixels.",
        variant: "destructive"
      });
      return;
    }

    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isLiked: !pixel.isLiked,
            stats: { 
              ...pixel.stats, 
              likes: pixel.isLiked ? pixel.stats.likes - 1 : pixel.stats.likes + 1 
            }
          }
        : pixel
    ));

    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel && !pixel.isLiked) {
      addXp(5);
      addCredits(2);
      setPlaySuccessSound(true);
      
      toast({
        title: "❤️ Pixel Curtido!",
        description: "Recebeu 5 XP + 2 créditos!",
      });
    }
  };

  const handleFollowPixel = (pixelId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para seguir pixels.",
        variant: "destructive"
      });
      return;
    }

    setPixels(prev => prev.map(pixel => 
      pixel.id === pixelId 
        ? { 
            ...pixel, 
            isFollowing: !pixel.isFollowing,
            stats: { 
              ...pixel.stats, 
              followers: pixel.isFollowing ? pixel.stats.followers - 1 : pixel.stats.followers + 1 
            }
          }
        : pixel
    ));

    const pixel = pixels.find(p => p.id === pixelId);
    if (pixel && !pixel.isFollowing) {
      addXp(10);
      addCredits(5);
      setPlaySuccessSound(true);
      
      toast({
        title: "🔔 A Seguir Pixel!",
        description: "Receberá notificações sobre este pixel. +10 XP +5 créditos!",
      });
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedPixel) return;
    
    const totalCost = selectedPixel.price;
    const isSpecialPayment = paymentMethod === 'special' && selectedPixel.specialCreditsPrice;
    const cost = isSpecialPayment ? selectedPixel.specialCreditsPrice! : totalCost;
    const hasEnoughCredits = isSpecialPayment ? specialCredits >= cost : credits >= cost;
    
    if (!hasEnoughCredits) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${cost} ${isSpecialPayment ? 'créditos especiais' : 'créditos'}.`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      // Deduct credits
      if (isSpecialPayment) {
        removeSpecialCredits(cost);
      } else {
        removeCredits(cost);
      }
      
      // Add pixel to user collection
      addPixel();
      addXp(100);
      
      // Calculate seller earnings (after commission)
      const commission = selectedPixel.seller.isPremium ? 0.05 : 0.07;
      const sellerEarnings = Math.floor(totalCost * (1 - commission));
      
      // Remove pixel from marketplace
      setPixels(prev => prev.filter(p => p.id !== selectedPixel.id));
      
      setShowConfetti(true);
      setPlaySuccessSound(true);
      setIsProcessing(false);
      setIsBuyModalOpen(false);
      setIsPixelModalOpen(false);
      
      toast({
        title: "🎉 Pixel Comprado!",
        description: `Pixel (${selectedPixel.x}, ${selectedPixel.y}) é agora seu! +100 XP`,
      });
    }, 2000);
  };

  const handleConfirmBid = () => {
    if (!selectedPixel || !selectedPixel.auctionData) return;
    
    const bidValue = parseFloat(bidAmount);
    const minBid = selectedPixel.auctionData.currentBid + 10;
    
    if (bidValue < minBid) {
      toast({
        title: "Lance Inválido",
        description: `O lance mínimo é €${minBid}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (credits < bidValue) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${bidValue} créditos para este lance.`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      // Update auction data
      setPixels(prev => prev.map(pixel => 
        pixel.id === selectedPixel.id && pixel.auctionData
          ? {
              ...pixel,
              auctionData: {
                ...pixel.auctionData,
                currentBid: bidValue,
                bidCount: pixel.auctionData.bidCount + 1,
                highestBidder: 'Você'
              }
            }
          : pixel
      ));
      
      addXp(50);
      setPlaySuccessSound(true);
      setIsProcessing(false);
      setIsBidModalOpen(false);
      setBidAmount('');
      
      toast({
        title: "🔨 Lance Colocado!",
        description: `Seu lance de €${bidValue} foi registado! +50 XP`,
      });
    }, 1500);
  };

  const handleSendOffer = () => {
    if (!selectedPixel) return;
    
    const offerValue = parseFloat(offerAmount);
    
    if (offerValue >= selectedPixel.price) {
      toast({
        title: "Oferta Inválida",
        description: "A oferta deve ser inferior ao preço de venda.",
        variant: "destructive"
      });
      return;
    }
    
    if (credits < offerValue) {
      toast({
        title: "Créditos Insuficientes",
        description: `Precisa de ${offerValue} créditos para esta oferta.`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const newOffer = {
        id: Date.now().toString(),
        buyer: 'Você',
        amount: offerValue,
        message: offerMessage,
        timestamp: new Date().toISOString(),
        status: 'pending' as const
      };
      
      setPixels(prev => prev.map(pixel => 
        pixel.id === selectedPixel.id 
          ? { ...pixel, offers: [...pixel.offers, newOffer] }
          : pixel
      ));
      
      addXp(25);
      setPlaySuccessSound(true);
      setIsProcessing(false);
      setIsOfferModalOpen(false);
      setOfferAmount('');
      setOfferMessage('');
      
      toast({
        title: "💌 Oferta Enviada!",
        description: `Oferta de €${offerValue} enviada ao vendedor! +25 XP`,
      });
    }, 1500);
  };

  const handleAcceptOffer = (saleId: string, offerId: string) => {
    setUserSales(prev => prev.map(sale => {
      if (sale.id === saleId) {
        const updatedOffers = sale.offers.map(offer => 
          offer.id === offerId 
            ? { ...offer, status: 'accepted' as const }
            : offer.status === 'pending' 
              ? { ...offer, status: 'rejected' as const }
              : offer
        );
        return { ...sale, offers: updatedOffers };
      }
      return sale;
    }));

    const sale = userSales.find(s => s.id === saleId);
    const offer = sale?.offers.find(o => o.id === offerId);
    
    if (offer) {
      const commission = 0.05; // Assuming user is premium for demo
      const earnings = Math.floor(offer.amount * (1 - commission));
      
      addCredits(earnings);
      addXp(150);
      setShowConfetti(true);
      setPlaySuccessSound(true);
      
      toast({
        title: "✅ Oferta Aceite!",
        description: `Vendeu por €${offer.amount}! Recebeu €${earnings} (após comissão). +150 XP`,
      });
    }
  };

  const handleRejectOffer = (saleId: string, offerId: string) => {
    setUserSales(prev => prev.map(sale => {
      if (sale.id === saleId) {
        const updatedOffers = sale.offers.map(offer => 
          offer.id === offerId 
            ? { ...offer, status: 'rejected' as const }
            : offer
        );
        return { ...sale, offers: updatedOffers };
      }
      return sale;
    }));

    toast({
      title: "❌ Oferta Rejeitada",
      description: "A oferta foi rejeitada.",
    });
  };

  const handlePromotePixel = (saleId: string) => {
    if (specialCredits < 50) {
      toast({
        title: "Créditos Especiais Insuficientes",
        description: "Precisa de 50 créditos especiais para promover um pixel.",
        variant: "destructive"
      });
      return;
    }

    removeSpecialCredits(50);
    
    setUserSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? { 
            ...sale, 
            isPromoted: true,
            promotionExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        : sale
    ));

    toast({
      title: "🚀 Pixel Promovido!",
      description: "Seu pixel será destacado por 7 dias.",
    });
  };

  const handleViewOnMap = (pixel: MarketplacePixel) => {
    // Open new tab with pixel coordinates
    const mapUrl = `/?pixel=${pixel.x},${pixel.y}&zoom=5`;
    window.open(mapUrl, '_blank');
    
    toast({
      title: "🗺️ Abrindo Mapa",
      description: `Navegando para pixel (${pixel.x}, ${pixel.y})`,
    });
  };

  const handleViewOnGoogleMaps = (pixel: MarketplacePixel) => {
    if (pixel.gpsCoords) {
      const { lat, lon } = pixel.gpsCoords;
      const url = `https://www.google.com/maps?q=${lat},${lon}&z=18&t=k`;
      window.open(url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "🌍 Abrindo Google Maps",
        description: "Visualizando localização real do pixel.",
      });
    }
  };

  const regions = ['all', 'Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro', 'Setúbal'];
  const rarities = ['all', 'Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playSuccessSound} onEnd={() => setPlaySuccessSound(false)} />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <ShoppingCart className="h-8 w-8 mr-3 animate-glow" />
                  Marketplace de Pixels
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Compre e venda pixels únicos com outros utilizadores da comunidade
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{filteredPixels.length}</p>
                  <p className="text-xs text-muted-foreground">Pixels Disponíveis</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{auctionPixels.length}</p>
                  <p className="text-xs text-muted-foreground">Em Leilão</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar pixels por título, região, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Região</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Regiões</SelectItem>
                      {regions.slice(1).map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Raridade</Label>
                  <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Raridades</SelectItem>
                      {rarities.slice(1).map(rarity => (
                        <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ordenar Por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Em Destaque</SelectItem>
                      <SelectItem value="price_low">Preço: Menor</SelectItem>
                      <SelectItem value="price_high">Preço: Maior</SelectItem>
                      <SelectItem value="popularity">Popularidade</SelectItem>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                      <SelectItem value="views">Mais Vistos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Visualização</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="flex-1"
                    >
                      <List className="h-4 w-4 mr-2" />
                      Lista
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="flex-1"
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Grelha
                    </Button>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Faixa de Preço: €{priceRange[0]} - €{priceRange[1]}</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured-only" 
                    checked={showFeaturedOnly}
                    onCheckedChange={setShowFeaturedOnly}
                  />
                  <Label htmlFor="featured-only" className="text-sm">Apenas em Destaque</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-12 bg-card/50 backdrop-blur-sm shadow-md">
            <TabsTrigger value="marketplace" className="font-headline">
              <ShoppingCart className="h-4 w-4 mr-2"/>
              Marketplace ({filteredPixels.length})
            </TabsTrigger>
            <TabsTrigger value="following" className="font-headline">
              <Bell className="h-4 w-4 mr-2"/>
              A Seguir ({followingPixels.length})
            </TabsTrigger>
            <TabsTrigger value="liked" className="font-headline">
              <Heart className="h-4 w-4 mr-2"/>
              Curtidos ({likedPixels.length})
            </TabsTrigger>
            <TabsTrigger value="auctions" className="font-headline">
              <Gavel className="h-4 w-4 mr-2"/>
              Leilões ({auctionPixels.length})
            </TabsTrigger>
            <TabsTrigger value="my-sales" className="font-headline">
              <BarChart3 className="h-4 w-4 mr-2"/>
              Minhas Vendas ({userSales.length})
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {filteredPixels.length === 0 ? (
              <Card className="text-center p-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum Pixel Encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou pesquisar por outros termos.
                </p>
              </Card>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              )}>
                {filteredPixels.map((pixel) => (
                  <Card 
                    key={pixel.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                    onClick={() => handlePixelClick(pixel)}
                  >
                    <div className="relative">
                      <img 
                        src={pixel.imageUrl} 
                        alt={pixel.title}
                        className={cn(
                          "w-full object-cover",
                          viewMode === 'grid' ? "h-48" : "h-64"
                        )}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {pixel.isFeatured && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse">
                            <Star className="h-3 w-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                        {pixel.isHot && (
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500">
                            <Flame className="h-3 w-3 mr-1" />
                            Em Alta
                          </Badge>
                        )}
                        {pixel.isNew && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Novo
                          </Badge>
                        )}
                        {pixel.isAuction && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse">
                            <Gavel className="h-3 w-3 mr-1" />
                            Leilão
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge className={getRarityColor(pixel.rarity)}>
                          {pixel.rarity}
                        </Badge>
                      </div>

                      {/* Auction Timer */}
                      {pixel.isAuction && pixel.auctionData && (
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-mono">
                          <Timer className="h-3 w-3 inline mr-1" />
                          {formatTimeLeft(pixel.auctionData.timeLeft)}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      {/* Title and Location */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{pixel.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>({pixel.x}, {pixel.y}) • {pixel.region}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pixel.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="space-y-1">
                          <Eye className="h-4 w-4 text-blue-500 mx-auto" />
                          <p className="text-sm font-bold">{pixel.stats.views.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div className="space-y-1">
                          <Heart className="h-4 w-4 text-red-500 mx-auto" />
                          <p className="text-sm font-bold">{pixel.stats.likes}</p>
                          <p className="text-xs text-muted-foreground">Likes</p>
                        </div>
                        <div className="space-y-1">
                          <MessageSquare className="h-4 w-4 text-green-500 mx-auto" />
                          <p className="text-sm font-bold">{pixel.stats.comments}</p>
                          <p className="text-xs text-muted-foreground">Comentários</p>
                        </div>
                        <div className="space-y-1">
                          <Users className="h-4 w-4 text-purple-500 mx-auto" />
                          <p className="text-sm font-bold">{pixel.stats.followers}</p>
                          <p className="text-xs text-muted-foreground">Seguidores</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="space-y-3">
                        {pixel.isAuction && pixel.auctionData ? (
                          <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm text-muted-foreground">Lance Atual:</span>
                              <span className="text-2xl font-bold text-primary">€{pixel.auctionData.currentBid}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {pixel.auctionData.bidCount} lances • Termina em {formatTimeLeft(pixel.auctionData.timeLeft)}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-primary">€{pixel.price}</div>
                            {pixel.specialCreditsPrice && (
                              <div className="text-lg text-accent">
                                ou {pixel.specialCreditsPrice} créditos especiais
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={pixel.seller.avatar} />
                          <AvatarFallback>{pixel.seller.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pixel.seller.name}</span>
                            {pixel.seller.verified && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            {pixel.seller.isPremium && (
                              <Crown className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Nível {pixel.seller.level}</span>
                            <span>•</span>
                            <span>{pixel.seller.rating}⭐</span>
                            <span>•</span>
                            <span>{pixel.seller.totalSales} vendas</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {pixel.isAuction && pixel.auctionData ? (
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleBidPixel(pixel); }}
                            className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-lg font-semibold"
                          >
                            <Gavel className="h-5 w-5 mr-2" />
                            Licitar (mín. €{pixel.auctionData.currentBid + 10})
                          </Button>
                        ) : (
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleBuyPixel(pixel); }}
                            className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg font-semibold"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Comprar por €{pixel.price}
                          </Button>
                        )}
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleLikePixel(pixel.id); }}
                            className={cn(
                              "min-h-[44px]",
                              pixel.isLiked && "bg-red-500/10 border-red-500/50 text-red-500"
                            )}
                          >
                            <Heart className={`h-4 w-4 ${pixel.isLiked ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleFollowPixel(pixel.id); }}
                            className={cn(
                              "min-h-[44px]",
                              pixel.isFollowing && "bg-blue-500/10 border-blue-500/50 text-blue-500"
                            )}
                          >
                            <Bell className={`h-4 w-4 ${pixel.isFollowing ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedPixel(pixel);
                              setIsOfferModalOpen(true);
                            }}
                            className="min-h-[44px]"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Tags */}
                      {pixel.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {pixel.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {pixel.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pixel.tags.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="space-y-6">
            {followingPixels.length === 0 ? (
              <Card className="text-center p-12">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum Pixel Seguido</h3>
                <p className="text-muted-foreground">
                  Comece a seguir pixels para receber notificações sobre mudanças de preço.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followingPixels.map((pixel) => (
                  <Card key={pixel.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePixelClick(pixel)}>
                    <div className="relative">
                      <img src={pixel.imageUrl} alt={pixel.title} className="w-full h-48 object-cover" />
                      <Badge className="absolute top-2 left-2 bg-blue-500">
                        <Bell className="h-3 w-3 mr-1" />
                        A Seguir
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{pixel.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">€{pixel.price}</span>
                        <Badge variant="outline">({pixel.x}, {pixel.y})</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Liked Tab */}
          <TabsContent value="liked" className="space-y-6">
            {likedPixels.length === 0 ? (
              <Card className="text-center p-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum Pixel Curtido</h3>
                <p className="text-muted-foreground">
                  Comece a curtir pixels que considera interessantes.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedPixels.map((pixel) => (
                  <Card key={pixel.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePixelClick(pixel)}>
                    <div className="relative">
                      <img src={pixel.imageUrl} alt={pixel.title} className="w-full h-48 object-cover" />
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Curtido
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{pixel.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">€{pixel.price}</span>
                        <Badge variant="outline">({pixel.x}, {pixel.y})</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Auctions Tab */}
          <TabsContent value="auctions" className="space-y-6">
            {auctionPixels.length === 0 ? (
              <Card className="text-center p-12">
                <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum Leilão Ativo</h3>
                <p className="text-muted-foreground">
                  Não há leilões ativos no momento. Volte mais tarde!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctionPixels.map((pixel) => (
                  <Card key={pixel.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePixelClick(pixel)}>
                    <div className="relative">
                      <img src={pixel.imageUrl} alt={pixel.title} className="w-full h-48 object-cover" />
                      <Badge className="absolute top-2 left-2 bg-purple-500 animate-pulse">
                        <Gavel className="h-3 w-3 mr-1" />
                        Leilão
                      </Badge>
                      {pixel.auctionData && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                          {formatTimeLeft(pixel.auctionData.timeLeft)}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{pixel.title}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Lance Atual:</span>
                          <span className="text-lg font-bold text-primary">
                            €{pixel.auctionData?.currentBid}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>{pixel.auctionData?.bidCount} lances</span>
                          <Badge variant="outline">({pixel.x}, {pixel.y})</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Sales Tab */}
          <TabsContent value="my-sales" className="space-y-6">
            {/* Sales Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-500">€1,247</p>
                <p className="text-sm text-muted-foreground">Total Vendido</p>
              </Card>
              <Card className="text-center p-6">
                <Percent className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">€89</p>
                <p className="text-sm text-muted-foreground">Comissões Pagas</p>
              </Card>
              <Card className="text-center p-6">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-500">4.8</p>
                <p className="text-sm text-muted-foreground">Rating Médio</p>
              </Card>
              <Card className="text-center p-6">
                <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-500">{userSales.length}</p>
                <p className="text-sm text-muted-foreground">Pixels à Venda</p>
              </Card>
            </div>

            {/* User Sales List */}
            <div className="space-y-6">
              {userSales.map((sale) => (
                <Card key={sale.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Pixel Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{sale.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>({sale.x}, {sale.y}) • {sale.region}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">€{sale.price}</span>
                          {sale.isPromoted && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                              <Rocket className="h-3 w-3 mr-1" />
                              Promovido
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Listado em {formatDate(new Date(sale.listedDate), 'dd/MM/yyyy')}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Atividade do Pixel</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                            <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <p className="font-bold">{sale.stats.views}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div className="text-center p-3 bg-red-500/10 rounded-lg">
                            <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                            <p className="font-bold">{sale.stats.likes}</p>
                            <p className="text-xs text-muted-foreground">Likes</p>
                          </div>
                          <div className="text-center p-3 bg-green-500/10 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-green-500 mx-auto mb-1" />
                            <p className="font-bold">{sale.stats.comments}</p>
                            <p className="text-xs text-muted-foreground">Comentários</p>
                          </div>
                          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                            <Users className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                            <p className="font-bold">{sale.stats.followers}</p>
                            <p className="text-xs text-muted-foreground">Seguidores</p>
                          </div>
                        </div>
                        
                        {!sale.isPromoted && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handlePromotePixel(sale.id)}
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                            Promover (50 créditos especiais)
                          </Button>
                        )}
                      </div>

                      {/* Offers Management */}
                      <div className="space-y-4">
                        <h4 className="font-medium">
                          Ofertas Recebidas ({sale.offers.filter(o => o.status === 'pending').length})
                        </h4>
                        
                        {sale.offers.length === 0 ? (
                          <div className="text-center p-6 bg-muted/20 rounded-lg">
                            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Nenhuma oferta recebida</p>
                          </div>
                        ) : (
                          <ScrollArea className="h-64">
                            <div className="space-y-3">
                              {sale.offers.map((offer) => (
                                <Card key={offer.id} className={cn(
                                  "p-4",
                                  offer.status === 'accepted' && "bg-green-500/10 border-green-500/30",
                                  offer.status === 'rejected' && "bg-red-500/10 border-red-500/30"
                                )}>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{offer.buyer}</p>
                                        <p className="text-lg font-bold text-primary">€{offer.amount}</p>
                                      </div>
                                      <Badge variant={
                                        offer.status === 'pending' ? 'secondary' :
                                        offer.status === 'accepted' ? 'default' : 'destructive'
                                      }>
                                        {offer.status === 'pending' ? 'Pendente' :
                                         offer.status === 'accepted' ? 'Aceite' : 'Rejeitada'}
                                      </Badge>
                                    </div>
                                    
                                    {offer.message && (
                                      <p className="text-sm text-muted-foreground italic">
                                        "{offer.message}"
                                      </p>
                                    )}
                                    
                                    <div className="text-xs text-muted-foreground">
                                      {timeAgo(new Date(offer.timestamp))}
                                    </div>
                                    
                                    {offer.status === 'pending' && (
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          className="flex-1 bg-green-600 hover:bg-green-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAcceptOffer(sale.id, offer.id);
                                          }}
                                        >
                                          <Check className="h-4 w-4 mr-2" />
                                          Aceitar
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="destructive" 
                                          className="flex-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRejectOffer(sale.id, offer.id);
                                          }}
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          Rejeitar
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pixel Details Modal */}
      <Dialog open={isPixelModalOpen} onOpenChange={setIsPixelModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
          {selectedPixel && (
            <>
              <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                <DialogTitle className="text-2xl font-headline flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-primary" />
                  {selectedPixel.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Pixel ({selectedPixel.x}, {selectedPixel.y}) em {selectedPixel.region}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image and Basic Info */}
                    <div className="space-y-6">
                      <div className="relative">
                        <img 
                          src={selectedPixel.imageUrl} 
                          alt={selectedPixel.title}
                          className="w-full h-80 object-cover rounded-lg shadow-lg"
                        />
                        
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {selectedPixel.isFeatured && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                              <Star className="h-3 w-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                          <Badge className={getRarityColor(selectedPixel.rarity)}>
                            {selectedPixel.rarity}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-3">Descrição</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {selectedPixel.description}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Features */}
                      {selectedPixel.features.length > 0 && (
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="font-semibold mb-3">Características</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedPixel.features.map(feature => (
                                <div key={feature} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Right Column - Stats and Actions */}
                    <div className="space-y-6">
                      {/* Price and Auction Info */}
                      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <CardContent className="p-6 text-center">
                          {selectedPixel.isAuction && selectedPixel.auctionData ? (
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Lance Atual</p>
                                <p className="text-4xl font-bold text-primary">€{selectedPixel.auctionData.currentBid}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="text-lg font-bold">{selectedPixel.auctionData.bidCount}</p>
                                  <p className="text-xs text-muted-foreground">Lances</p>
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-red-500">
                                    {formatTimeLeft(selectedPixel.auctionData.timeLeft)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Tempo Restante</p>
                                </div>
                              </div>
                              
                              {selectedPixel.auctionData.highestBidder && (
                                <p className="text-sm text-muted-foreground">
                                  Lance mais alto: {selectedPixel.auctionData.highestBidder}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Preço</p>
                                <p className="text-4xl font-bold text-primary">€{selectedPixel.price}</p>
                              </div>
                              
                              {selectedPixel.specialCreditsPrice && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">ou</p>
                                  <p className="text-xl font-bold text-accent">
                                    {selectedPixel.specialCreditsPrice} créditos especiais
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Stats */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-4">Estatísticas</h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="text-center space-y-2">
                              <Eye className="h-6 w-6 text-blue-500 mx-auto" />
                              <p className="text-xl font-bold">{selectedPixel.stats.views.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Visualizações</p>
                            </div>
                            <div className="text-center space-y-2">
                              <Heart className="h-6 w-6 text-red-500 mx-auto" />
                              <p className="text-xl font-bold">{selectedPixel.stats.likes}</p>
                              <p className="text-sm text-muted-foreground">Curtidas</p>
                            </div>
                            <div className="text-center space-y-2">
                              <MessageSquare className="h-6 w-6 text-green-500 mx-auto" />
                              <p className="text-xl font-bold">{selectedPixel.stats.comments}</p>
                              <p className="text-sm text-muted-foreground">Comentários</p>
                            </div>
                            <div className="text-center space-y-2">
                              <Users className="h-6 w-6 text-purple-500 mx-auto" />
                              <p className="text-xl font-bold">{selectedPixel.stats.followers}</p>
                              <p className="text-sm text-muted-foreground">Seguidores</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Seller Info */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-4">Vendedor</h3>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={selectedPixel.seller.avatar} />
                              <AvatarFallback>{selectedPixel.seller.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{selectedPixel.seller.name}</span>
                                {selectedPixel.seller.verified && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                {selectedPixel.seller.isPremium && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Nível {selectedPixel.seller.level} • {selectedPixel.seller.rating}⭐ • {selectedPixel.seller.totalSales} vendas
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="space-y-4">
                        {selectedPixel.isAuction && selectedPixel.auctionData ? (
                          <Button 
                            onClick={() => setIsBidModalOpen(true)}
                            className="w-full h-14 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-lg font-semibold"
                          >
                            <Gavel className="h-5 w-5 mr-2" />
                            Licitar (mín. €{selectedPixel.auctionData.currentBid + 10})
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setIsBuyModalOpen(true)}
                            className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg font-semibold"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Comprar por €{selectedPixel.price}
                          </Button>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => handleLikePixel(selectedPixel.id)}
                            className={cn(
                              "h-12",
                              selectedPixel.isLiked && "bg-red-500/10 border-red-500/50 text-red-500"
                            )}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${selectedPixel.isLiked ? 'fill-current' : ''}`} />
                            {selectedPixel.isLiked ? 'Curtido' : 'Curtir'}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => handleFollowPixel(selectedPixel.id)}
                            className={cn(
                              "h-12",
                              selectedPixel.isFollowing && "bg-blue-500/10 border-blue-500/50 text-blue-500"
                            )}
                          >
                            <Bell className={`h-4 w-4 mr-2 ${selectedPixel.isFollowing ? 'fill-current' : ''}`} />
                            {selectedPixel.isFollowing ? 'A Seguir' : 'Seguir'}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsOfferModalOpen(true)}
                            className="h-12"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Fazer Oferta
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => handleViewOnMap(selectedPixel)}
                            className="h-12"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Ver no Mapa
                          </Button>
                        </div>
                        
                        {selectedPixel.gpsCoords && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleViewOnGoogleMaps(selectedPixel)}
                            className="w-full h-12"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            Ver no Google Maps
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedPixel.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPixel.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price History */}
                  {selectedPixel.priceHistory.length > 1 && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Histórico de Preços</h3>
                        <div className="space-y-2">
                          {selectedPixel.priceHistory.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(new Date(entry.date), 'dd/MM/yyyy')}
                              </span>
                              <span className="font-medium">€{entry.price}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Buy Modal */}
      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="max-w-md">
          {selectedPixel && (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Compra</DialogTitle>
                <DialogDescription>
                  Pixel ({selectedPixel.x}, {selectedPixel.y}) em {selectedPixel.region}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="text-center">
                  <img 
                    src={selectedPixel.imageUrl} 
                    alt={selectedPixel.title}
                    className="w-32 h-32 mx-auto rounded-lg shadow-md mb-4"
                  />
                  <h3 className="font-semibold text-lg">{selectedPixel.title}</h3>
                </div>

                {/* Payment Method */}
                {selectedPixel.specialCreditsPrice && (
                  <div className="space-y-3">
                    <Label>Método de Pagamento</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={paymentMethod === 'credits' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('credits')}
                        className="h-12"
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        €{selectedPixel.price}
                      </Button>
                      <Button
                        variant={paymentMethod === 'special' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('special')}
                        className="h-12"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        {selectedPixel.specialCreditsPrice} Especiais
                      </Button>
                    </div>
                  </div>
                )}

                {/* Purchase Summary */}
                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-semibold">Resumo da Compra</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Preço do Pixel:</span>
                        <span className="font-medium">
                          {paymentMethod === 'special' && selectedPixel.specialCreditsPrice
                            ? `${selectedPixel.specialCreditsPrice} créditos especiais`
                            : `€${selectedPixel.price}`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comissão da Plataforma:</span>
                        <span className="text-sm text-muted-foreground">Incluída</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-primary">
                          {paymentMethod === 'special' && selectedPixel.specialCreditsPrice
                            ? `${selectedPixel.specialCreditsPrice} créditos especiais`
                            : `€${selectedPixel.price}`
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Balance Check */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Seu Saldo:</span>
                    <span className={cn(
                      "font-medium",
                      (paymentMethod === 'special' ? specialCredits >= (selectedPixel.specialCreditsPrice || 0) : credits >= selectedPixel.price)
                        ? "text-green-500" : "text-red-500"
                    )}>
                      {paymentMethod === 'special' 
                        ? `${specialCredits} créditos especiais`
                        : `€${credits}`
                      }
                    </span>
                  </div>
                  
                  {(paymentMethod === 'special' ? specialCredits < (selectedPixel.specialCreditsPrice || 0) : credits < selectedPixel.price) && (
                    <div className="bg-red-500/10 p-3 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">Saldo insuficiente</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsBuyModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleConfirmPurchase}
                    disabled={isProcessing || (paymentMethod === 'special' ? specialCredits < (selectedPixel.specialCreditsPrice || 0) : credits < selectedPixel.price)}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Confirmar Compra
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bid Modal */}
      <Dialog open={isBidModalOpen} onOpenChange={setIsBidModalOpen}>
        <DialogContent className="max-w-md">
          {selectedPixel && selectedPixel.auctionData && (
            <>
              <DialogHeader>
                <DialogTitle>Fazer Lance</DialogTitle>
                <DialogDescription>
                  Pixel ({selectedPixel.x}, {selectedPixel.y}) em {selectedPixel.region}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="text-center">
                  <img 
                    src={selectedPixel.imageUrl} 
                    alt={selectedPixel.title}
                    className="w-32 h-32 mx-auto rounded-lg shadow-md mb-4"
                  />
                  <h3 className="font-semibold text-lg">{selectedPixel.title}</h3>
                </div>

                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-primary">€{selectedPixel.auctionData.currentBid}</p>
                        <p className="text-xs text-muted-foreground">Lance Atual</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-red-500">
                          {formatTimeLeft(selectedPixel.auctionData.timeLeft)}
                        </p>
                        <p className="text-xs text-muted-foreground">Tempo Restante</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Label>Seu Lance (mínimo: €{selectedPixel.auctionData.currentBid + 10})</Label>
                  <Input
                    type="number"
                    placeholder={`Mínimo: €${selectedPixel.auctionData.currentBid + 10}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={selectedPixel.auctionData.currentBid + 10}
                    className="h-12 text-lg text-center"
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span>Seu Saldo:</span>
                  <span className={cn(
                    "font-medium",
                    credits >= parseFloat(bidAmount || '0') ? "text-green-500" : "text-red-500"
                  )}>
                    €{credits}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsBidModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleConfirmBid}
                    disabled={isProcessing || !bidAmount || parseFloat(bidAmount) < selectedPixel.auctionData.currentBid + 10}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Gavel className="h-4 w-4 mr-2" />
                        Confirmar Lance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Offer Modal */}
      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent className="max-w-md">
          {selectedPixel && (
            <>
              <DialogHeader>
                <DialogTitle>Fazer Oferta</DialogTitle>
                <DialogDescription>
                  Envie uma oferta personalizada para o vendedor
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="text-center">
                  <img 
                    src={selectedPixel.imageUrl} 
                    alt={selectedPixel.title}
                    className="w-32 h-32 mx-auto rounded-lg shadow-md mb-4"
                  />
                  <h3 className="font-semibold text-lg">{selectedPixel.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Preço atual: €{selectedPixel.price}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Valor da Oferta (deve ser inferior ao preço)</Label>
                  <Input
                    type="number"
                    placeholder={`Máximo: €${selectedPixel.price - 1}`}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    max={selectedPixel.price - 1}
                    className="h-12 text-lg text-center"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Mensagem (opcional)</Label>
                  <Textarea
                    placeholder="Adicione uma mensagem personalizada para o vendedor..."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span>Seu Saldo:</span>
                  <span className={cn(
                    "font-medium",
                    credits >= parseFloat(offerAmount || '0') ? "text-green-500" : "text-red-500"
                  )}>
                    €{credits}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsOfferModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSendOffer}
                    disabled={isProcessing || !offerAmount || parseFloat(offerAmount) >= selectedPixel.price}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Oferta
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}