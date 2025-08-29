'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ShoppingCart,
  Gavel,
  Gem,
  Star,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  Check,
  MousePointer,
  MapPin,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { Label } from '@/components/ui/label';

interface MarketplaceItem {
  id: string;
  type: 'pixel' | 'collection' | 'auction';
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  pixel?: {
    x: number;
    y: number;
    color: string;
    rarity: string;
    region: string;
  };
  images: string[];
  tags: string[];
  views: number;
  likes: number;
  createdAt: Date;
  expiresAt?: Date;
  bids?: Bid[];
  status: 'active' | 'sold' | 'expired' | 'cancelled';
  condition: 'new' | 'mint' | 'used';
  shipping: {
    included: boolean;
    cost: number;
    location: string;
  };
  returns: {
    allowed: boolean;
    period: number;
  };
}

interface Bid {
  id: string;
  bidder: {
    id: string;
    name: string;
    avatar: string;
  };
  amount: number;
  timestamp: Date;
}

interface Review {
  id: string;
  reviewer: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  title: string;
  comment: string;
  timestamp: Date;
  helpful: number;
}

export const AdvancedMarketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const { credits, specialCredits } = useUserStore();
  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockItems: MarketplaceItem[] = [
      {
        id: '1',
        type: 'pixel',
        title: 'Pixel Premium em Lisboa',
        description:
          'Pixel raro localizado no centro histórico de Lisboa, próximo à Torre de Belém.',
        price: 150,
        originalPrice: 200,
        seller: {
          id: 'seller1',
          name: 'PixelMaster',
          avatar: '/api/placeholder/40/40',
          rating: 4.8,
          verified: true,
        },
        pixel: {
          x: 580,
          y: 1355,
          color: '#D4A757',
          rarity: 'Épico',
          region: 'Lisboa',
        },
        images: ['/api/placeholder/300/200'],
        tags: ['lisboa', 'histórico', 'premium'],
        views: 1247,
        likes: 89,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        status: 'active',
        condition: 'mint',
        shipping: {
          included: true,
          cost: 0,
          location: 'Portugal',
        },
        returns: {
          allowed: true,
          period: 14,
        },
      },
      {
        id: '2',
        type: 'auction',
        title: 'Leilão: Pixel Lendário no Porto',
        description: 'Pixel lendário com vista para o rio Douro. Leilão termina em 2 dias.',
        price: 500,
        seller: {
          id: 'seller2',
          name: 'PortoCollector',
          avatar: '/api/placeholder/40/40',
          rating: 4.9,
          verified: true,
        },
        pixel: {
          x: 640,
          y: 1260,
          color: '#FF6B6B',
          rarity: 'Lendário',
          region: 'Porto',
        },
        images: ['/api/placeholder/300/200'],
        tags: ['porto', 'leilão', 'lendário'],
        views: 2156,
        likes: 156,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        status: 'active',
        condition: 'new',
        bids: [
          {
            id: 'bid1',
            bidder: { id: 'bidder1', name: 'ArtLover', avatar: '/api/placeholder/32/32' },
            amount: 500,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
          {
            id: 'bid2',
            bidder: { id: 'bidder2', name: 'PixelHunter', avatar: '/api/placeholder/32/32' },
            amount: 450,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          },
        ],
        shipping: {
          included: true,
          cost: 0,
          location: 'Portugal',
        },
        returns: {
          allowed: false,
          period: 0,
        },
      },
      {
        id: '3',
        type: 'collection',
        title: 'Coleção: Pixels Históricos de Coimbra',
        description: 'Coleção completa de 10 pixels históricos da Universidade de Coimbra.',
        price: 1200,
        seller: {
          id: 'seller3',
          name: 'HistoryBuff',
          avatar: '/api/placeholder/40/40',
          rating: 4.7,
          verified: true,
        },
        images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
        tags: ['coimbra', 'universidade', 'coleção', 'histórico'],
        views: 892,
        likes: 67,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        status: 'active',
        condition: 'mint',
        shipping: {
          included: false,
          cost: 25,
          location: 'Portugal',
        },
        returns: {
          allowed: true,
          period: 30,
        },
      },
    ];

    setItems(mockItems);
    setFilteredItems(mockItems);
  }, []);

  // Filter and sort items
  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.type === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    // Rarity filter
    if (selectedRarity !== 'all' && filtered.some(item => item.pixel)) {
      filtered = filtered.filter(item => item.pixel?.rarity === selectedRarity);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.seller.rating - a.seller.rating;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, sortBy, priceRange, selectedRarity]);

  const handlePurchase = useCallback(
    (item: MarketplaceItem) => {
      if (!user) {
        toast({
          title: 'Autenticação Necessária',
          description: 'Por favor, inicie sessão para fazer compras.',
          variant: 'destructive',
        });
        return;
      }

      if (item.price > credits) {
        toast({
          title: 'Créditos Insuficientes',
          description: 'Você não tem créditos suficientes para esta compra.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Compra Realizada!',
        description: `Você comprou "${item.title}" por €${item.price}`,
      });
    },
    [user, credits, toast]
  );

  const handleBid = useCallback(
    (item: MarketplaceItem, bidAmount: number) => {
      if (!user) {
        toast({
          title: 'Autenticação Necessária',
          description: 'Por favor, inicie sessão para fazer lances.',
          variant: 'destructive',
        });
        return;
      }

      if (bidAmount <= item.price) {
        toast({
          title: 'Lance Inválido',
          description: 'O lance deve ser maior que o lance atual.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Lance Realizado!',
        description: `Seu lance de €${bidAmount} foi registrado.`,
      });
    },
    [user, toast]
  );

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return 'Expirado';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Avançado</h1>
          <p className="text-muted-foreground">Compre, venda e leiloe pixels únicos de Portugal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Créditos</p>
            <p className="font-semibold">€{credits.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Créditos Especiais</p>
            <p className="font-semibold text-primary">{specialCredits}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Procurar pixels..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="pixel">Pixels Individuais</SelectItem>
                <SelectItem value="collection">Coleções</SelectItem>
                <SelectItem value="auction">Leilões</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger>
                <SelectValue placeholder="Raridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Raridades</SelectItem>
                <SelectItem value="Comum">Comum</SelectItem>
                <SelectItem value="Incomum">Incomum</SelectItem>
                <SelectItem value="Raro">Raro</SelectItem>
                <SelectItem value="Épico">Épico</SelectItem>
                <SelectItem value="Lendário">Lendário</SelectItem>
                <SelectItem value="Marco Histórico">Marco Histórico</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="oldest">Mais Antigos</SelectItem>
                <SelectItem value="price-low">Preço: Menor</SelectItem>
                <SelectItem value="price-high">Preço: Maior</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
                <SelectItem value="rating">Melhor Avaliados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} encontrado
          {filteredItems.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Lista
          </Button>
        </div>
      </div>

      {/* Items Grid/List */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
        }
      >
        {filteredItems.map(item => (
          <MarketplaceItemCard
            key={item.id}
            item={item}
            onPurchase={handlePurchase}
            onBid={handleBid}
            getTimeRemaining={getTimeRemaining}
            viewMode={viewMode}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Nenhum item encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou procurar por algo diferente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onPurchase: (item: MarketplaceItem) => void;
  onBid: (item: MarketplaceItem, amount: number) => void;
  getTimeRemaining: (date: Date) => string;
  viewMode: 'grid' | 'list';
}

const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({
  item,
  onPurchase,
  onBid,
  getTimeRemaining,
  viewMode,
}) => {
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState(item.price + 1);

  const isAuction = item.type === 'auction';
  const isExpired = item.expiresAt && new Date() > item.expiresAt;
  const currentBid = item.bids?.[0]?.amount || item.price;

  return (
    <Card className={`transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex' : ''}`}>
      <div className={`${viewMode === 'list' ? 'flex flex-1' : ''}`}>
        {/* Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
          <img
            src={item.images[0]}
            alt={item.title}
            className={`w-full object-cover ${viewMode === 'list' ? 'h-32' : 'h-48'}`}
          />
          {item.type === 'auction' && (
            <Badge className="absolute left-2 top-2 bg-orange-500">
              <Gavel className="mr-1 h-3 w-3" />
              Leilão
            </Badge>
          )}
          {item.type === 'collection' && (
            <Badge className="absolute left-2 top-2 bg-purple-500">
              <Gem className="mr-1 h-3 w-3" />
              Coleção
            </Badge>
          )}
          {item.originalPrice && item.originalPrice > item.price && (
            <Badge className="absolute right-2 top-2 bg-green-500">
              -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 p-4 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
          <div>
            <div className="mb-2 flex items-start justify-between">
              <h3 className="line-clamp-2 font-semibold">{item.title}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="text-sm">{item.seller.rating}</span>
              </div>
            </div>

            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

            {item.pixel && (
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline">{item.pixel.rarity}</Badge>
                <Badge variant="outline">{item.pixel.region}</Badge>
                <span className="text-sm text-muted-foreground">
                  ({item.pixel.x}, {item.pixel.y})
                </span>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {item.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {item.likes}
                </div>
              </div>

              {isAuction && item.expiresAt && (
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  {getTimeRemaining(item.expiresAt)}
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="mb-3 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.seller.avatar} />
                <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{item.seller.name}</span>
              {item.seller.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-sm text-muted-foreground line-through">€{item.originalPrice}</p>
              )}
              <p className="text-xl font-bold">€{isAuction ? currentBid : item.price}</p>
              {isAuction && item.bids && item.bids.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {item.bids.length} lance{item.bids.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {isAuction && !isExpired ? (
                <Button
                  size="sm"
                  onClick={() => setShowBidModal(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Gavel className="mr-1 h-4 w-4" />
                  Fazer Lance
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onPurchase(item)}
                  disabled={item.status !== 'active'}
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Comprar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Fazer Lance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bid-amount">Valor do Lance</Label>
                <Input
                  id="bid-amount"
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(Number(e.target.value))}
                  min={currentBid + 1}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Lance mínimo: €{currentBid + 1}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onBid(item, bidAmount);
                    setShowBidModal(false);
                  }}
                  className="flex-1"
                >
                  Confirmar Lance
                </Button>
                <Button variant="outline" onClick={() => setShowBidModal(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};
