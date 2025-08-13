'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from 'use-debounce';
import { 
  Search, Filter, SortAsc, MapPin, User, Trophy, Hash, 
  Clock, TrendingUp, Star, Eye, Heart, MessageSquare,
  Bookmark, Share2, X, ArrowRight, Sparkles, Target,
  Globe, Calendar, Award, Gem, Crown, Zap, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'pixel' | 'user' | 'achievement' | 'album' | 'hashtag' | 'region';
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  metadata?: Record<string, any>;
  relevance: number;
  trending?: boolean;
  verified?: boolean;
}

interface SearchFilters {
  type: string;
  region: string;
  rarity: string;
  priceRange: [number, number];
  dateRange: string;
  verified: boolean;
  premium: boolean;
}

interface AdvancedSearchProps {
  children: React.ReactNode;
  onResultSelect?: (result: SearchResult) => void;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'pixel',
    title: 'Pixel Premium Lisboa',
    subtitle: '(245, 156) • Lisboa',
    description: 'Pixel raro no centro histórico com vista para o Tejo',
    avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
    metadata: {
      price: 450,
      rarity: 'Lendário',
      owner: 'PixelMaster',
      views: 1234,
      likes: 89
    },
    relevance: 95,
    trending: true
  },
  {
    id: '2',
    type: 'user',
    title: 'PixelArtist123',
    subtitle: 'Pedro Silva • Nível 25',
    description: 'Artista digital especializado em paisagens portuguesas',
    avatar: 'https://placehold.co/60x60.png',
    metadata: {
      level: 25,
      pixels: 156,
      followers: 1234,
      achievements: 45
    },
    relevance: 88,
    verified: true
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Mestre das Cores',
    subtitle: 'Conquista Rara',
    description: 'Use 30 cores diferentes nos seus pixels',
    metadata: {
      rarity: 'Rara',
      xpReward: 500,
      creditsReward: 200,
      unlockedBy: 234
    },
    relevance: 82
  },
  {
    id: '4',
    type: 'hashtag',
    title: '#paisagem',
    subtitle: '1.2K pixels',
    description: 'Tag popular para paisagens naturais portuguesas',
    metadata: {
      pixelCount: 1200,
      trending: true,
      growth: '+23%'
    },
    relevance: 75,
    trending: true
  }
];

const searchFilters = [
  { type: 'all', label: 'Tudo', icon: Search },
  { type: 'pixel', label: 'Pixels', icon: MapPin },
  { type: 'user', label: 'Utilizadores', icon: User },
  { type: 'achievement', label: 'Conquistas', icon: Trophy },
  { type: 'hashtag', label: 'Tags', icon: Hash },
  { type: 'region', label: 'Regiões', icon: Globe }
];

const trendingSearches = [
  'pixels lisboa premium',
  'arte digital portugal',
  'investimento pixels',
  '#pixel-art',
  'conquistas raras',
  'marketplace leilões'
];

const recentSearches = [
  'PixelMaster123',
  'lisboa centro',
  'pixels baratos',
  '#natureza'
];

export default function AdvancedSearch({ children, onResultSelect }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    region: 'all',
    rarity: 'all',
    priceRange: [0, 1000],
    dateRange: 'all',
    verified: false,
    premium: false
  });

  const { toast } = useToast();

  // Pesquisa com debounce
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simular pesquisa na API
    setTimeout(() => {
      const filteredResults = mockSearchResults
        .filter(result => {
          const matchesQuery = 
            result.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            result.subtitle?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            result.description?.toLowerCase().includes(debouncedQuery.toLowerCase());
          
          const matchesFilter = activeFilter === 'all' || result.type === activeFilter;
          
          return matchesQuery && matchesFilter;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'relevance':
              return b.relevance - a.relevance;
            case 'trending':
              return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
            case 'recent':
              return Math.random() - 0.5; // Mock recent sorting
            default:
              return 0;
          }
        });
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);
  }, [debouncedQuery, activeFilter, sortBy]);

  const handleResultClick = (result: SearchResult) => {
    // Adicionar à pesquisas recentes
    const recent = JSON.parse(localStorage.getItem('pixel-universe-recent-searches') || '[]');
    const updated = [result.title, ...recent.filter((r: string) => r !== result.title)].slice(0, 10);
    localStorage.setItem('pixel-universe-recent-searches', JSON.stringify(updated));
    
    onResultSelect?.(result);
    setIsOpen(false);
    
    toast({
      title: "Resultado Selecionado",
      description: `Navegando para: ${result.title}`,
    });
  };

  const handleTrendingClick = (search: string) => {
    setQuery(search);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'pixel': return <MapPin className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'hashtag': return <Hash className="h-4 w-4" />;
      case 'region': return <Globe className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'pixel': return 'text-green-500';
      case 'user': return 'text-blue-500';
      case 'achievement': return 'text-yellow-500';
      case 'hashtag': return 'text-purple-500';
      case 'region': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="sr-only">Pesquisa Avançada</DialogTitle>
          
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pixels, utilizadores, conquistas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Filtros Rápidos */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {searchFilters.map(filter => (
              <Button
                key={filter.type}
                variant={activeFilter === filter.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.type)}
                className="flex-shrink-0"
              >
                <filter.icon className="h-4 w-4 mr-2" />
                {filter.label}
              </Button>
            ))}
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-input bg-background rounded-md text-sm"
            >
              <option value="relevance">Relevância</option>
              <option value="trending">Trending</option>
              <option value="recent">Recente</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!query ? (
            // Sugestões e Trending
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                  Pesquisas em Tendência
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trendingSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => handleTrendingClick(search)}
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-medium">{search}</div>
                          <div className="text-xs text-muted-foreground">
                            +{Math.floor(Math.random() * 50 + 10)}% esta semana
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Pesquisas Recentes
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleTrendingClick(search)}
                    >
                      <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{search}</span>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  Descobrir
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-medium">Pixels Raros</h4>
                      <p className="text-xs text-muted-foreground">Descubra pixels únicos</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-medium">Novos Artistas</h4>
                      <p className="text-xs text-muted-foreground">Conheça criadores</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-medium">Conquistas</h4>
                      <p className="text-xs text-muted-foreground">Explore objetivos</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            // Resultados da Pesquisa
            <div className="flex">
              <div className="flex-1 p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-muted-foreground">
                      Tente pesquisar por pixels, utilizadores, conquistas ou tags
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {results.length} resultados para "{query}"
                      </p>
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Ordenado por {sortBy}
                        </span>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Card 
                            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                            onClick={() => handleResultClick(result)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  {result.avatar ? (
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage src={result.avatar} />
                                      <AvatarFallback>
                                        {getResultIcon(result.type)}
                                      </AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <div className={`h-12 w-12 rounded-full bg-muted flex items-center justify-center ${getResultColor(result.type)}`}>
                                      {getResultIcon(result.type)}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-base leading-tight">
                                          {result.title}
                                        </h3>
                                        {result.verified && (
                                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        )}
                                        {result.trending && (
                                          <Badge variant="outline" className="text-xs">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            Trending
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      {result.subtitle && (
                                        <p className="text-sm text-muted-foreground mb-1">
                                          {result.subtitle}
                                        </p>
                                      )}
                                      
                                      {result.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                          {result.description}
                                        </p>
                                      )}
                                      
                                      {/* Metadata específica por tipo */}
                                      {result.metadata && (
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                          {result.type === 'pixel' && (
                                            <>
                                              <span>€{result.metadata.price}</span>
                                              <span>{result.metadata.views} views</span>
                                              <span>{result.metadata.likes} likes</span>
                                            </>
                                          )}
                                          {result.type === 'user' && (
                                            <>
                                              <span>Nível {result.metadata.level}</span>
                                              <span>{result.metadata.pixels} pixels</span>
                                              <span>{result.metadata.followers} seguidores</span>
                                            </>
                                          )}
                                          {result.type === 'achievement' && (
                                            <>
                                              <span>+{result.metadata.xpReward} XP</span>
                                              <span>+{result.metadata.creditsReward} créditos</span>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Badge variant="secondary" className="text-xs">
                                      {searchFilters.find(f => f.type === result.type)?.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              
              {/* Filtros Avançados (Sidebar) */}
              {showFilters && (
                <div className="w-80 border-l p-6">
                  <h3 className="font-semibold mb-4">Filtros Avançados</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Região</Label>
                      <select
                        value={filters.region}
                        onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full p-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="all">Todas as Regiões</option>
                        <option value="lisboa">Lisboa</option>
                        <option value="porto">Porto</option>
                        <option value="coimbra">Coimbra</option>
                        <option value="braga">Braga</option>
                        <option value="faro">Faro</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Raridade</Label>
                      <select
                        value={filters.rarity}
                        onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
                        className="w-full p-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="all">Todas as Raridades</option>
                        <option value="comum">Comum</option>
                        <option value="raro">Raro</option>
                        <option value="épico">Épico</option>
                        <option value="lendário">Lendário</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Preço: €{filters.priceRange[0]} - €{filters.priceRange[1]}
                      </Label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={filters.priceRange[0]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                          }))}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={filters.priceRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                          }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Apenas Verificados</Label>
                        <Switch 
                          checked={filters.verified}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Apenas Premium</Label>
                        <Switch 
                          checked={filters.premium}
                          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, premium: checked }))}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setFilters({
                        type: 'all',
                        region: 'all',
                        rarity: 'all',
                        priceRange: [0, 1000],
                        dateRange: 'all',
                        verified: false,
                        premium: false
                      })}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}