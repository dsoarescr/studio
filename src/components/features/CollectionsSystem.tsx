'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import {
  FolderPlus,
  Star,
  Users,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  Plus,
  Search,
  Grid,
  List,
  BookOpen,
  Palette,
  Crown,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  category: 'personal' | 'public' | 'premium';
  theme: 'nature' | 'urban' | 'historical' | 'artistic' | 'gaming' | 'business' | 'other';
  tags: string[];
  pixelCount: number;
  totalValue: number;
  averagePrice: number;
  followers: number;
  isPublic: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  pixels: PixelInCollection[];
  stats: {
    rarityDistribution: Record<string, number>;
    regionDistribution: Record<string, number>;
    priceRange: Record<string, number>;
    growthRate: number;
    popularity: number;
  };
}

interface PixelInCollection {
  id: string;
  x: number;
  y: number;
  price: number;
  rarity: string;
  region: string;
  title?: string;
  description?: string;
  color?: string;
  addedAt: Date;
  position: {
    row: number;
    col: number;
  };
}

interface CollectionTemplate {
  id: string;
  name: string;
  description: string;
  theme: string;
  layout: 'grid' | 'mosaic' | 'timeline' | 'map';
  pixelPositions: Array<{ x: number; y: number; row: number; col: number }>;
  preview: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedCost: number;
  popularity: number;
}

const collectionTemplates: CollectionTemplate[] = [
  {
    id: 'portugal-flag',
    name: 'Bandeira de Portugal',
    description: 'Recria a bandeira portuguesa com pixels',
    theme: 'historical',
    layout: 'grid',
    pixelPositions: [
      { x: 100, y: 100, row: 10, col: 10 },
      { x: 101, y: 100, row: 10, col: 11 },
      // ... mais posições
    ],
    preview: '/templates/portugal-flag.png',
    tags: ['portugal', 'bandeira', 'história'],
    difficulty: 'medium',
    estimatedCost: 5000,
    popularity: 95,
  },
  {
    id: 'lisbon-skyline',
    name: 'Horizonte de Lisboa',
    description: 'Vista panorâmica da cidade de Lisboa',
    theme: 'urban',
    layout: 'mosaic',
    pixelPositions: [],
    preview: '/templates/lisbon-skyline.png',
    tags: ['lisboa', 'cidade', 'arquitetura'],
    difficulty: 'hard',
    estimatedCost: 15000,
    popularity: 88,
  },
];

const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Paisagens de Portugal',
    description: 'As mais belas paisagens do nosso país',
    category: 'public',
    theme: 'nature',
    tags: ['portugal', 'paisagem', 'natureza'],
    pixelCount: 45,
    totalValue: 12500,
    averagePrice: 278,
    followers: 234,
    isPublic: true,
    isPremium: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    owner: {
      id: 'user1',
      name: 'PixelMasterPT',
      avatar: 'https://placehold.co/40x40.png',
    },
    pixels: [],
    stats: {
      rarityDistribution: { Comum: 20, Raro: 15, Épico: 8, Lendário: 2 },
      regionDistribution: { Lisboa: 15, Porto: 12, Algarve: 8, Madeira: 10 },
      priceRange: { '0-100': 10, '100-500': 20, '500-1000': 12, '1000+': 3 },
      growthRate: 15.5,
      popularity: 85,
    },
  },
];

export const CollectionsSystem: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredCollections = collections.filter(collection => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || collection.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'value':
        return b.totalValue - a.totalValue;
      case 'pixels':
        return b.pixelCount - a.pixelCount;
      case 'popularity':
        return b.stats.popularity - a.stats.popularity;
      case 'recent':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const handleCreateCollection = useCallback(
    (data: Partial<Collection>) => {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: data.name || 'Nova Coleção',
        description: data.description || '',
        category: data.category || 'personal',
        theme: data.theme || 'other',
        tags: data.tags || [],
        pixelCount: 0,
        totalValue: 0,
        averagePrice: 0,
        followers: 0,
        isPublic: false,
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: {
          id: user?.uid || 'anonymous',
          name: user?.displayName || 'Utilizador',
          avatar: user?.photoURL || 'https://placehold.co/40x40.png',
        },
        pixels: [],
        stats: {
          rarityDistribution: {},
          regionDistribution: {},
          priceRange: {},
          growthRate: 0,
          popularity: 0,
        },
      };

      setCollections(prev => [newCollection, ...prev]);
      setIsCreating(false);
      toast({
        title: 'Coleção criada!',
        description: `A coleção "${newCollection.name}" foi criada com sucesso.`,
      });
    },
    [user, toast]
  );

  const handleAddPixelToCollection = useCallback(
    (collectionId: string, pixel: PixelInCollection) => {
      setCollections(prev =>
        prev.map(collection => {
          if (collection.id === collectionId) {
            const updatedPixels = [...collection.pixels, pixel];
            const totalValue = updatedPixels.reduce((sum, p) => sum + p.price, 0);
            const averagePrice = totalValue / updatedPixels.length;

            return {
              ...collection,
              pixels: updatedPixels,
              pixelCount: updatedPixels.length,
              totalValue,
              averagePrice,
              updatedAt: new Date(),
            };
          }
          return collection;
        })
      );
    },
    []
  );

  const handleRemovePixelFromCollection = useCallback((collectionId: string, pixelId: string) => {
    setCollections(prev =>
      prev.map(collection => {
        if (collection.id === collectionId) {
          const updatedPixels = collection.pixels.filter(p => p.id !== pixelId);
          const totalValue = updatedPixels.reduce((sum, p) => sum + p.price, 0);
          const averagePrice = updatedPixels.length > 0 ? totalValue / updatedPixels.length : 0;

          return {
            ...collection,
            pixels: updatedPixels,
            pixelCount: updatedPixels.length,
            totalValue,
            averagePrice,
            updatedAt: new Date(),
          };
        }
        return collection;
      })
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coleções</h1>
          <p className="text-muted-foreground">Organize e partilhe os seus pixels</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                Nova Coleção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Coleção</DialogTitle>
              </DialogHeader>
              <CreateCollectionForm onSubmit={handleCreateCollection} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Pesquisar coleções..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="personal">Pessoais</SelectItem>
            <SelectItem value="public">Públicas</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="value">Valor</SelectItem>
            <SelectItem value="pixels">Pixels</SelectItem>
            <SelectItem value="popularity">Popularidade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Collections Grid/List */}
      <div
        className={cn(
          'grid gap-4',
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        )}
      >
        <AnimatePresence>
          {sortedCollections.map(collection => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CollectionCard
                collection={collection}
                onSelect={setSelectedCollection}
                onAddPixel={handleAddPixelToCollection}
                onRemovePixel={handleRemovePixelFromCollection}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Collection Details Modal */}
      {selectedCollection && (
        <CollectionDetailsModal
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
          onUpdate={updatedCollection => {
            setCollections(prev =>
              prev.map(c => (c.id === updatedCollection.id ? updatedCollection : c))
            );
            setSelectedCollection(updatedCollection);
          }}
        />
      )}

      {/* Templates Section */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Templates de Coleções</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collectionTemplates.map(template => (
            <CollectionTemplateCard
              key={template.id}
              template={template}
              onUse={template => {
                // Implementar criação de coleção a partir do template
                console.log('Using template:', template);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const CreateCollectionForm: React.FC<{ onSubmit: (data: Partial<Collection>) => void }> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal' as const,
    theme: 'other' as const,
    tags: '',
    isPublic: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nome</label>
        <Input
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nome da coleção"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Descrição</label>
        <Textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva a sua coleção"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={formData.category}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Pessoal</SelectItem>
              <SelectItem value="public">Pública</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Tema</label>
          <Select
            value={formData.theme}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, theme: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nature">Natureza</SelectItem>
              <SelectItem value="urban">Urbano</SelectItem>
              <SelectItem value="historical">Histórico</SelectItem>
              <SelectItem value="artistic">Artístico</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="business">Negócios</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
        <Input
          value={formData.tags}
          onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="portugal, paisagem, natureza"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
          className="rounded"
        />
        <label htmlFor="isPublic" className="text-sm">
          Tornar pública
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Criar Coleção</Button>
      </div>
    </form>
  );
};

const CollectionCard: React.FC<{
  collection: Collection;
  onSelect: (collection: Collection) => void;
  onAddPixel: (collectionId: string, pixel: PixelInCollection) => void;
  onRemovePixel: (collectionId: string, pixelId: string) => void;
  viewMode: 'grid' | 'list';
}> = ({ collection, onSelect, onAddPixel, onRemovePixel, viewMode }) => {
  return (
    <Card
      className={cn('cursor-pointer transition-all hover:shadow-lg', viewMode === 'list' && 'flex')}
      onClick={() => onSelect(collection)}
    >
      <CardHeader className={cn(viewMode === 'list' && 'flex-1')}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {collection.name}
              {collection.isPremium && <Crown className="h-4 w-4 text-amber-500" />}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant={collection.category === 'premium' ? 'default' : 'secondary'}>
              {collection.category}
            </Badge>
            {collection.isPublic && <Eye className="h-4 w-4 text-blue-500" />}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{collection.pixelCount} pixels</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{collection.followers} seguidores</span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{collection.stats.popularity}%</span>
          </div>
        </div>
      </CardHeader>

      {viewMode === 'list' && (
        <CardContent className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-lg font-bold">{collection.totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Valor total</div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">{collection.averagePrice.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Preço médio</div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const CollectionDetailsModal: React.FC<{
  collection: Collection;
  onClose: () => void;
  onUpdate: (collection: Collection) => void;
}> = ({ collection, onClose, onUpdate }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {collection.name}
            {collection.isPremium && <Crown className="h-5 w-5 text-amber-500" />}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pixels">Pixels</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Definições</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{collection.pixelCount}</div>
                  <div className="text-sm text-muted-foreground">Total de Pixels</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{collection.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{collection.followers}</div>
                  <div className="text-sm text-muted-foreground">Seguidores</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Raridade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(collection.stats.rarityDistribution).map(([rarity, count]) => (
                    <div key={rarity} className="flex items-center justify-between">
                      <span className="text-sm">{rarity}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / collection.pixelCount) * 100} className="w-20" />
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pixels">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
              {collection.pixels.map(pixel => (
                <div
                  key={pixel.id}
                  className="flex aspect-square items-center justify-center rounded-lg bg-muted text-xs"
                  style={{ backgroundColor: pixel.color || '#ccc' }}
                >
                  {pixel.x},{pixel.y}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +{collection.stats.growthRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Taxa de crescimento mensal</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Editar Coleção
              </Button>

              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Partilhar
              </Button>

              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>

              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Coleção
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const CollectionTemplateCard: React.FC<{
  template: CollectionTemplate;
  onUse: (template: CollectionTemplate) => void;
}> = ({ template, onUse }) => {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {template.name}
          <Badge
            variant={
              template.difficulty === 'hard'
                ? 'destructive'
                : template.difficulty === 'medium'
                  ? 'default'
                  : 'secondary'
            }
          >
            {template.difficulty}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-muted">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">{template.estimatedCost.toLocaleString()}</div>
            <div className="text-muted-foreground">Custo estimado</div>
          </div>

          <div className="text-sm">
            <div className="font-medium">{template.popularity}%</div>
            <div className="text-muted-foreground">Popularidade</div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {template.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button onClick={() => onUse(template)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Usar Template
        </Button>
      </CardContent>
    </Card>
  );
};
