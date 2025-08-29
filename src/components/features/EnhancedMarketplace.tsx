'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingCart,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Gift,
  Coins,
  Search,
  Filter,
  SortAsc,
  Zap,
  Crown,
  Diamond,
  Tag,
  Megaphone,
  // Auction icon does not exist in lucide-react; remove or replace
  Bookmark,
  Share2,
  Eye,
  DollarSign,
  BarChart,
  Plus,
  MapPin,
  Heart,
  Check,
  MousePointer,
} from 'lucide-react';

interface PixelListing {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
  };
  location: {
    x: number;
    y: number;
    region: string;
  };
  stats: {
    views: number;
    likes: number;
    saves: number;
  };
  features: {
    isFeatured: boolean;
    isPromoted: boolean;
    hasAuction: boolean;
    endTime?: string;
  };
  tags: string[];
  createdAt: string;
}

interface AdvertisingSlot {
  id: string;
  type: 'banner' | 'sidebar' | 'featured';
  title: string;
  description: string;
  pricePerDay: number;
  currentBid?: number;
  impressions: number;
  clicks: number;
  available: boolean;
}

const mockListings: PixelListing[] = [
  {
    id: '1',
    title: 'Pixel Premium no Centro do Porto',
    description: 'Localização privilegiada com vista para o Douro',
    price: 1000,
    seller: {
      id: 'seller1',
      name: 'João Silva',
      rating: 4.8,
      verified: true,
    },
    location: {
      x: 150,
      y: 200,
      region: 'Porto',
    },
    stats: {
      views: 245,
      likes: 42,
      saves: 15,
    },
    features: {
      isFeatured: true,
      isPromoted: true,
      hasAuction: false,
    },
    tags: ['vista-rio', 'centro-historico', 'premium'],
    createdAt: '2024-03-20T14:30:00Z',
  },
];

const advertisingSlots: AdvertisingSlot[] = [
  {
    id: 'ad1',
    type: 'banner',
    title: 'Banner Principal',
    description: 'Banner em destaque no topo do marketplace',
    pricePerDay: 100,
    currentBid: 120,
    impressions: 1500,
    clicks: 75,
    available: true,
  },
  {
    id: 'ad2',
    type: 'featured',
    title: 'Pixel em Destaque',
    description: 'Seu pixel aparece na seção de destaques',
    pricePerDay: 50,
    impressions: 800,
    clicks: 40,
    available: true,
  },
];

interface EnhancedMarketplaceProps {
  onPixelClick?: (pixelId: string) => void;
}

export function EnhancedMarketplace({ onPixelClick }: EnhancedMarketplaceProps) {
  const [activeTab, setActiveTab] = useState('browse');
  const [sortBy, setSortBy] = useState('recent');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const { toast } = useToast();

  const handlePromotePixel = (pixelId: string) => {
    toast({
      title: 'Promoção Ativada',
      description: 'Seu pixel será promovido por 7 dias!',
    });
  };

  const handleBidAdvertising = (slotId: string, amount: number) => {
    toast({
      title: 'Lance Registrado',
      description: `Seu lance de ${amount} créditos foi registrado.`,
    });
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Marketplace Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Marketplace
              </CardTitle>
              <CardDescription>Compre, venda e promova seus pixels</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Listar Pixel
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="browse">
                <Search className="mr-2 h-4 w-4" />
                Explorar
              </TabsTrigger>
              <TabsTrigger value="featured">
                <Star className="mr-2 h-4 w-4" />
                Destaques
              </TabsTrigger>
              <TabsTrigger value="auctions">
                <Megaphone className="mr-2 h-4 w-4" />
                Leilões
              </TabsTrigger>
              <TabsTrigger value="advertising">
                <Megaphone className="mr-2 h-4 w-4" />
                Publicidade
              </TabsTrigger>
            </TabsList>

            {/* Filtros */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-4">
                <Input placeholder="Pesquisar pixels..." className="flex-1" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">
                    Faixa de Preço: {priceRange[0]} - {priceRange[1]} créditos
                  </span>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={showFeaturedOnly} onCheckedChange={setShowFeaturedOnly} />
                  <span className="text-sm">Apenas Destaques</span>
                </div>
              </div>
            </div>

            <TabsContent value="browse" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockListings.map(listing => (
                  <Card
                    key={listing.id}
                    className="cursor-pointer overflow-hidden transition-colors hover:border-primary/50"
                    onClick={() => onPixelClick?.(listing.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {listing.title}
                            {listing.features.isFeatured && (
                              <Badge variant="secondary">
                                <Star className="mr-1 h-3 w-3" />
                                Destaque
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{listing.description}</CardDescription>
                        </div>
                        <Button variant="outline" size="icon">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="relative aspect-square rounded-lg bg-muted">
                        {/* Preview do Pixel */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-muted-foreground" />
                        </div>
                        {listing.features.isPromoted && (
                          <Badge className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-pink-500">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Promovido
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {listing.location.region}
                          </Badge>
                          <Badge variant="outline" className="flex items-center">
                            <Star className="mr-1 h-3 w-3" />
                            {listing.seller.rating}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Preço</p>
                          <p className="text-lg font-bold text-primary">{listing.price} créditos</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {listing.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.stats.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {listing.stats.likes}
                        </span>
                      </div>
                      <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Comprar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                <Card className="bg-gradient-to-r from-primary/10 to-accent/5">
                  <CardHeader>
                    <CardTitle>Destaque seu Pixel</CardTitle>
                    <CardDescription>
                      Aumente a visibilidade do seu pixel com nossos pacotes de destaque
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Pacote Básico */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-primary" />
                            Básico
                          </CardTitle>
                          <CardDescription>7 dias de destaque</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 text-2xl font-bold text-primary">100 créditos</div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Posição destacada
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Badge especial
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">Selecionar</Button>
                        </CardFooter>
                      </Card>

                      {/* Pacote Premium */}
                      <Card className="border-2 border-primary">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-primary" />
                            Premium
                          </CardTitle>
                          <CardDescription>30 dias de destaque</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 text-2xl font-bold text-primary">300 créditos</div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Topo da lista
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Badge animado
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Estatísticas detalhadas
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="default">
                            Selecionar
                          </Button>
                        </CardFooter>
                      </Card>

                      {/* Pacote Ultimate */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Diamond className="h-5 w-5 text-primary" />
                            Ultimate
                          </CardTitle>
                          <CardDescription>90 dias de destaque</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 text-2xl font-bold text-primary">700 créditos</div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Tudo do Premium
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Promoção nas redes
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              Suporte prioritário
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">Selecionar</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="auctions" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Leilões Ativos</CardTitle>
                    <CardDescription>Participe de leilões de pixels exclusivos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Exemplo de Leilão */}
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between">
                            <div>
                              <CardTitle>Pixel Histórico - Ribeira</CardTitle>
                              <CardDescription>
                                Localização única com vista para a ponte D. Luís
                              </CardDescription>
                            </div>
                            <Badge variant="destructive" className="animate-pulse">
                              <Clock className="mr-1 h-3 w-3" />
                              2h restantes
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Lance Atual</p>
                                <p className="text-2xl font-bold text-primary">1500 créditos</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Próximo Lance Mínimo
                                </p>
                                <p className="text-lg font-semibold">1600 créditos</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Input type="number" placeholder="Seu lance..." className="flex-1" />
                              <Button>Dar Lance</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="advertising" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Espaços Publicitários</CardTitle>
                    <CardDescription>
                      Promova seu pixel ou negócio em locais estratégicos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {advertisingSlots.map(slot => (
                        <Card key={slot.id}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              {slot.title}
                              {slot.type === 'banner' && <Badge variant="secondary">Premium</Badge>}
                            </CardTitle>
                            <CardDescription>{slot.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Preço por Dia</p>
                                <p className="text-lg font-bold text-primary">
                                  {slot.pricePerDay} créditos
                                </p>
                              </div>
                              {slot.currentBid && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Lance Atual</p>
                                  <p className="text-lg font-semibold">
                                    {slot.currentBid} créditos
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {slot.impressions} impressões
                              </span>
                              <span className="flex items-center gap-1">
                                <MousePointer className="h-3 w-3" />
                                {slot.clicks} cliques
                              </span>
                            </div>

                            <Button
                              className="w-full"
                              variant={slot.available ? 'default' : 'outline'}
                              disabled={!slot.available}
                            >
                              {slot.available ? 'Reservar Espaço' : 'Indisponível'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas de Publicidade */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas de Campanhas</CardTitle>
                    <CardDescription>
                      Acompanhe o desempenho das suas campanhas publicitárias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Eye className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <div className="text-2xl font-bold">2,500</div>
                            <p className="text-sm text-muted-foreground">Impressões Totais</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <MousePointer className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <div className="text-2xl font-bold">150</div>
                            <p className="text-sm text-muted-foreground">Cliques</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <BarChart className="mx-auto mb-2 h-8 w-8 text-primary" />
                            <div className="text-2xl font-bold">6%</div>
                            <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
