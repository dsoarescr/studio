'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Gavel, Clock, TrendingUp, Users, Star, Crown, Zap, 
  DollarSign, Eye, Heart, Share2, AlertTriangle, CheckCircle,
  Timer, Flame, Target, Award, Gem
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuctionPixel {
  id: string;
  x: number;
  y: number;
  region: string;
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  timeLeft: number; // em segundos
  bidCount: number;
  watchers: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  highestBidder?: {
    name: string;
    avatar: string;
  };
  description: string;
  imageUrl: string;
  features: string[];
}

interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

interface PixelAuctionProps {
  children: React.ReactNode;
}

const mockAuctions: AuctionPixel[] = [
  {
    id: '1',
    x: 245,
    y: 156,
    region: 'Lisboa',
    rarity: 'Lendário',
    currentBid: 450,
    startingBid: 100,
    buyNowPrice: 800,
    timeLeft: 3600, // 1 hora
    bidCount: 23,
    watchers: 156,
    seller: {
      name: 'PixelCollector',
      avatar: 'https://placehold.co/40x40.png',
      verified: true
    },
    highestBidder: {
      name: 'ArtInvestor',
      avatar: 'https://placehold.co/40x40.png'
    },
    description: 'Pixel raro no coração histórico de Lisboa com vista para o Tejo',
    imageUrl: 'https://placehold.co/300x300/D4A757/FFFFFF?text=Lisboa+Premium',
    features: ['Vista para o Rio', 'Centro Histórico', 'Alta Visibilidade']
  },
  {
    id: '2',
    x: 123,
    y: 89,
    region: 'Porto',
    rarity: 'Épico',
    currentBid: 280,
    startingBid: 50,
    timeLeft: 1800, // 30 minutos
    bidCount: 15,
    watchers: 89,
    seller: {
      name: 'PortoArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: false
    },
    description: 'Pixel artístico na zona ribeirinha do Porto',
    imageUrl: 'https://placehold.co/300x300/7DF9FF/000000?text=Porto+Art',
    features: ['Zona Ribeirinha', 'Património UNESCO']
  }
];

const mockBids: Bid[] = [
  {
    id: '1',
    bidder: 'ArtInvestor',
    amount: 450,
    timestamp: '14:23',
    isWinning: true
  },
  {
    id: '2',
    bidder: 'PixelHunter',
    amount: 420,
    timestamp: '14:20',
    isWinning: false
  },
  {
    id: '3',
    bidder: 'CollectorPro',
    amount: 380,
    timestamp: '14:15',
    isWinning: false
  }
];

export default function PixelAuction({ children }: PixelAuctionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionPixel | null>(null);
  const [auctions, setAuctions] = useState(mockAuctions);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState(mockBids);
  const [isWatching, setIsWatching] = useState(false);
  
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(prev => prev.map(auction => ({
        ...auction,
        timeLeft: Math.max(0, auction.timeLeft - 1)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'text-gray-500 border-gray-500/50';
      case 'Raro': return 'text-blue-500 border-blue-500/50';
      case 'Épico': return 'text-purple-500 border-purple-500/50';
      case 'Lendário': return 'text-amber-500 border-amber-500/50';
      default: return 'text-gray-500 border-gray-500/50';
    }
  };

  const placeBid = () => {
    const amount = parseFloat(bidAmount);
    if (!selectedAuction || !amount || amount <= selectedAuction.currentBid) {
      toast({
        title: "Lance Inválido",
        description: "O lance deve ser superior ao lance atual.",
        variant: "destructive"
      });
      return;
    }

    const newBid: Bid = {
      id: Date.now().toString(),
      bidder: 'Você',
      amount,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      isWinning: true
    };

    setBids(prev => [newBid, ...prev.map(bid => ({ ...bid, isWinning: false }))]);
    
    setAuctions(prev => prev.map(auction => 
      auction.id === selectedAuction.id 
        ? { 
            ...auction, 
            currentBid: amount, 
            bidCount: auction.bidCount + 1,
            highestBidder: { name: 'Você', avatar: 'https://placehold.co/40x40.png' }
          }
        : auction
    ));

    setSelectedAuction(prev => prev ? {
      ...prev,
      currentBid: amount,
      bidCount: prev.bidCount + 1,
      highestBidder: { name: 'Você', avatar: 'https://placehold.co/40x40.png' }
    } : null);

    setBidAmount('');
    
    toast({
      title: "Lance Colocado!",
      description: `Seu lance de €${amount} foi registado com sucesso.`,
    });
  };

  const buyNow = () => {
    if (!selectedAuction?.buyNowPrice) return;
    
    toast({
      title: "Compra Imediata!",
      description: `Pixel adquirido por €${selectedAuction.buyNowPrice}!`,
    });
    
    setIsOpen(false);
  };

  const toggleWatch = () => {
    setIsWatching(!isWatching);
    
    if (selectedAuction) {
      setAuctions(prev => prev.map(auction => 
        auction.id === selectedAuction.id 
          ? { ...auction, watchers: auction.watchers + (isWatching ? -1 : 1) }
          : auction
      ));
    }
    
    toast({
      title: isWatching ? "Deixou de Seguir" : "A Seguir Leilão",
      description: isWatching ? "Não receberá mais notificações." : "Receberá notificações sobre este leilão.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <DialogTitle className="flex items-center">
            <Gavel className="h-5 w-5 mr-2 text-orange-500" />
            Leilões de Pixels
            <Badge className="ml-2 bg-red-500 animate-pulse">
              AO VIVO
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {!selectedAuction ? (
            // Lista de leilões
            <div className="flex-1 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auctions.map(auction => (
                  <Card 
                    key={auction.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                    onClick={() => setSelectedAuction(auction)}
                  >
                    <div className="relative">
                      <img 
                        src={auction.imageUrl} 
                        alt={`Pixel ${auction.x}, ${auction.y}`}
                        className="w-full h-48 object-cover"
                      />
                      
                      <Badge className={cn("absolute top-2 left-2", getRarityColor(auction.rarity))}>
                        {auction.rarity}
                      </Badge>
                      
                      <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {formatTimeLeft(auction.timeLeft)}
                      </div>
                      
                      {auction.timeLeft < 300 && (
                        <div className="absolute inset-0 border-4 border-red-500 animate-pulse" />
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          Pixel ({auction.x}, {auction.y})
                        </h3>
                        <Badge variant="outline">
                          {auction.region}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {auction.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Lance Atual:</span>
                          <span className="text-lg font-bold text-primary">
                            €{auction.currentBid}
                          </span>
                        </div>
                        
                        {auction.buyNowPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Comprar Já:</span>
                            <span className="text-sm font-medium text-green-500">
                              €{auction.buyNowPrice}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Gavel className="h-3 w-3" />
                            {auction.bidCount} lances
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {auction.watchers} a seguir
                          </span>
                        </div>
                      </div>
                      
                      {auction.features.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {auction.features.map(feature => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Visualizador de leilão específico
            <div className="flex-1 flex">
              {/* Área principal */}
              <div className="flex-1 flex flex-col">
                <div className="relative">
                  <img 
                    src={selectedAuction.imageUrl} 
                    alt={`Pixel ${selectedAuction.x}, ${selectedAuction.y}`}
                    className="w-full h-64 object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-2xl font-bold">
                      Pixel ({selectedAuction.x}, {selectedAuction.y})
                    </h2>
                    <p className="text-white/80">{selectedAuction.region}</p>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className={getRarityColor(selectedAuction.rarity)}>
                      {selectedAuction.rarity}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAuction(null)}
                      className="bg-black/60 text-white border-white/30"
                    >
                      Voltar
                    </Button>
                  </div>
                </div>
                
                {/* Informações do leilão */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Lance atual */}
                    <Card className="text-center">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-primary mb-2">
                          €{selectedAuction.currentBid}
                        </div>
                        <p className="text-sm text-muted-foreground">Lance Atual</p>
                        {selectedAuction.highestBidder && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={selectedAuction.highestBidder.avatar} />
                              <AvatarFallback>{selectedAuction.highestBidder.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{selectedAuction.highestBidder.name}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Tempo restante */}
                    <Card className="text-center">
                      <CardContent className="p-4">
                        <div className={cn(
                          "text-3xl font-bold mb-2",
                          selectedAuction.timeLeft < 300 ? "text-red-500 animate-pulse" : "text-foreground"
                        )}>
                          {formatTimeLeft(selectedAuction.timeLeft)}
                        </div>
                        <p className="text-sm text-muted-foreground">Tempo Restante</p>
                        {selectedAuction.timeLeft < 300 && (
                          <Badge variant="destructive" className="mt-2 animate-pulse">
                            <Flame className="h-3 w-3 mr-1" />
                            Últimos Minutos!
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Estatísticas */}
                    <Card className="text-center">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-accent mb-2">
                          {selectedAuction.bidCount}
                        </div>
                        <p className="text-sm text-muted-foreground">Lances</p>
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                          <Eye className="h-3 w-3" />
                          <span>{selectedAuction.watchers} a seguir</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Ações de lance */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder={`Mínimo: €${selectedAuction.currentBid + 1}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            min={selectedAuction.currentBid + 1}
                          />
                        </div>
                        <Button onClick={placeBid} className="px-8">
                          <Gavel className="h-4 w-4 mr-2" />
                          Licitar
                        </Button>
                        
                        {selectedAuction.buyNowPrice && (
                          <Button 
                            onClick={buyNow}
                            className="px-8 bg-green-600 hover:bg-green-700"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Comprar €{selectedAuction.buyNowPrice}
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={toggleWatch}>
                            <Eye className="h-4 w-4 mr-2" />
                            {isWatching ? 'Deixar de Seguir' : 'Seguir'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Partilhar
                          </Button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Lance mínimo: €{selectedAuction.currentBid + 1}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Painel lateral - Histórico de lances */}
              <div className="w-80 border-l">
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Histórico de Lances
                  </h3>
                </div>
                
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-3">
                    {bids.map(bid => (
                      <div 
                        key={bid.id} 
                        className={cn(
                          "p-3 rounded-lg border",
                          bid.isWinning ? "bg-green-500/10 border-green-500/30" : "bg-muted/20"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{bid.bidder}</span>
                          <span className="text-sm text-muted-foreground">{bid.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">€{bid.amount}</span>
                          {bid.isWinning && (
                            <Badge className="bg-green-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Vencedor
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Informações do vendedor */}
                <div className="p-4 border-t">
                  <h4 className="font-semibold mb-3">Vendedor</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedAuction.seller.avatar} />
                      <AvatarFallback>{selectedAuction.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedAuction.seller.name}</span>
                        {selectedAuction.seller.verified && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Vendedor verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}