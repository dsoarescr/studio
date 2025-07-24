'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, MapPin, Calendar, Star, Coins, User,
  Palette, Trophy, Crown, Gem, Sparkles, Target, Zap, Activity,
  SlidersHorizontal, ChevronDown, Check, Plus, Minus
} from 'lucide-react';

interface SearchFilter {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'select' | 'multiselect';
  options?: Array<{ value: string; label: string; count?: number }>;
  min?: number;
  max?: number;
  value?: any;
  icon?: React.ReactNode;
}

interface AdvancedSearchProps {
  placeholder?: string;
  filters?: SearchFilter[];
  onSearch?: (query: string, filters: Record<string, any>) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  suggestions?: string[];
  recentSearches?: string[];
  className?: string;
  showAdvancedFilters?: boolean;
}

const defaultFilters: SearchFilter[] = [
  {
    id: 'region',
    label: 'Região',
    type: 'multiselect',
    icon: <MapPin className="h-4 w-4" />,
    options: [
      { value: 'lisboa', label: 'Lisboa', count: 234 },
      { value: 'porto', label: 'Porto', count: 189 },
      { value: 'coimbra', label: 'Coimbra', count: 156 },
      { value: 'braga', label: 'Braga', count: 98 },
      { value: 'faro', label: 'Faro', count: 87 }
    ]
  },
  {
    id: 'price',
    label: 'Preço (€)',
    type: 'range',
    icon: <Coins className="h-4 w-4" />,
    min: 0,
    max: 1000,
    value: [0, 1000]
  },
  {
    id: 'rarity',
    label: 'Raridade',
    type: 'multiselect',
    icon: <Star className="h-4 w-4" />,
    options: [
      { value: 'common', label: 'Comum', count: 456 },
      { value: 'uncommon', label: 'Incomum', count: 234 },
      { value: 'rare', label: 'Raro', count: 123 },
      { value: 'epic', label: 'Épico', count: 67 },
      { value: 'legendary', label: 'Lendário', count: 23 }
    ]
  },
  {
    id: 'type',
    label: 'Tipo',
    type: 'multiselect',
    icon: <Palette className="h-4 w-4" />,
    options: [
      { value: 'pixel', label: 'Pixel', count: 789 },
      { value: 'collection', label: 'Coleção', count: 156 },
      { value: 'tool', label: 'Ferramenta', count: 89 },
      { value: 'theme', label: 'Tema', count: 45 }
    ]
  },
  {
    id: 'date',
    label: 'Data de Criação',
    type: 'select',
    icon: <Calendar className="h-4 w-4" />,
    options: [
      { value: 'today', label: 'Hoje' },
      { value: 'week', label: 'Esta Semana' },
      { value: 'month', label: 'Este Mês' },
      { value: 'year', label: 'Este Ano' },
      { value: 'all', label: 'Todos os Tempos' }
    ]
  }
];

export function AdvancedSearch({
  placeholder = "Pesquisar...",
  filters = defaultFilters,
  onSearch,
  onFilterChange,
  suggestions = [],
  recentSearches = [],
  className = "",
  showAdvancedFilters = true
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery, activeFilters);
      setShowSuggestions(false);
      
      // Add to recent searches (would be handled by parent component)
      // const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    }
  };

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilter = (filterId: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange?.({});
  };

  const saveSearch = () => {
    if (query.trim()) {
      setSavedSearches(prev => [query, ...prev.filter(s => s !== query)].slice(0, 10));
    }
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && suggestion !== query
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-20"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            {showAdvancedFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-8 w-8 ${getActiveFilterCount() > 0 ? 'text-primary' : ''}`}
              >
                <Filter className="h-4 w-4" />
                {getActiveFilterCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSearch()}
              className="h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (query || recentSearches.length > 0 || savedSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-50 mt-1"
            >
              <Card className="shadow-lg border-primary/20">
                <CardContent className="p-2">
                  <ScrollArea className="max-h-64">
                    {/* Current Query */}
                    {query && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left p-2 h-auto"
                        onClick={() => handleSearch()}
                      >
                        <Search className="h-4 w-4 mr-2 text-primary" />
                        <span>Pesquisar por "<strong>{query}</strong>"</span>
                      </Button>
                    )}

                    {/* Suggestions */}
                    {filteredSuggestions.length > 0 && (
                      <>
                        {query && <Separator className="my-2" />}
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground px-2 py-1">Sugestões</p>
                          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start text-left p-2 h-auto"
                              onClick={() => {
                                setQuery(suggestion);
                                handleSearch(suggestion);
                              }}
                            >
                              <Sparkles className="h-4 w-4 mr-2 text-accent" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground px-2 py-1">Pesquisas Recentes</p>
                          {recentSearches.slice(0, 3).map((search, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start text-left p-2 h-auto"
                              onClick={() => {
                                setQuery(search);
                                handleSearch(search);
                              }}
                            >
                              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                              {search}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Saved Searches */}
                    {savedSearches.length > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground px-2 py-1">Pesquisas Salvas</p>
                          {savedSearches.slice(0, 3).map((search, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start text-left p-2 h-auto"
                              onClick={() => {
                                setQuery(search);
                                handleSearch(search);
                              }}
                            >
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              {search}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter) return null;

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.length > 1 ? `${value.length} selecionados` : value[0];
            }

            return (
              <Badge key={filterId} variant="secondary" className="gap-1">
                {filter.icon}
                {filter.label}: {displayValue}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => clearFilter(filterId)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Limpar Todos
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                    Filtros Avançados
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={saveSearch}>
                      <Star className="h-4 w-4 mr-2" />
                      Salvar Pesquisa
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filters.map((filter) => (
                    <div key={filter.id} className="space-y-3">
                      <Label className="flex items-center gap-2 font-medium">
                        {filter.icon}
                        {filter.label}
                      </Label>
                      
                      {filter.type === 'checkbox' && filter.options && (
                        <div className="space-y-2">
                          {filter.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${filter.id}-${option.value}`}
                                checked={activeFilters[filter.id]?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  const current = activeFilters[filter.id] || [];
                                  const newValue = checked
                                    ? [...current, option.value]
                                    : current.filter((v: string) => v !== option.value);
                                  handleFilterChange(filter.id, newValue);
                                }}
                              />
                              <Label 
                                htmlFor={`${filter.id}-${option.value}`}
                                className="text-sm flex-1 flex items-center justify-between"
                              >
                                {option.label}
                                {option.count && (
                                  <span className="text-muted-foreground">({option.count})</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {filter.type === 'multiselect' && filter.options && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {activeFilters[filter.id]?.length > 0
                                ? `${activeFilters[filter.id].length} selecionados`
                                : 'Selecionar...'}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2">
                            <div className="space-y-2">
                              {filter.options.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${filter.id}-${option.value}`}
                                    checked={activeFilters[filter.id]?.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                      const current = activeFilters[filter.id] || [];
                                      const newValue = checked
                                        ? [...current, option.value]
                                        : current.filter((v: string) => v !== option.value);
                                      handleFilterChange(filter.id, newValue);
                                    }}
                                  />
                                  <Label 
                                    htmlFor={`${filter.id}-${option.value}`}
                                    className="text-sm flex-1 flex items-center justify-between"
                                  >
                                    {option.label}
                                    {option.count && (
                                      <span className="text-muted-foreground">({option.count})</span>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {filter.type === 'range' && (
                        <div className="space-y-3">
                          <Slider
                            value={activeFilters[filter.id] || [filter.min || 0, filter.max || 100]}
                            onValueChange={(value) => handleFilterChange(filter.id, value)}
                            min={filter.min || 0}
                            max={filter.max || 100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{activeFilters[filter.id]?.[0] || filter.min || 0}</span>
                            <span>{activeFilters[filter.id]?.[1] || filter.max || 100}</span>
                          </div>
                        </div>
                      )}

                      {filter.type === 'select' && filter.options && (
                        <select
                          value={activeFilters[filter.id] || ''}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="">Selecionar...</option>
                          {filter.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={clearAllFilters}>
                    Limpar Filtros
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Aplicar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}