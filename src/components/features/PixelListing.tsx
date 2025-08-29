'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingCart,
  Gavel,
  Image as ImageIcon,
  Calendar,
  Clock,
  Tag,
  MapPin,
  Info,
  AlertTriangle,
  CheckCircle,
  Camera,
  Upload,
  Sparkles,
  Settings,
  Eye,
} from 'lucide-react';

interface PixelListingProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PixelListing({ onSubmit, onCancel }: PixelListingProps) {
  const [listingType, setListingType] = useState<'sale' | 'auction'>('sale');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [minimumBid, setMinimumBid] = useState(0);
  const [duration, setDuration] = useState(7);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPromoted, setIsPromoted] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [allowOffers, setAllowOffers] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [condition, setCondition] = useState('new');
  const [certificateType, setCertificateType] = useState('standard');
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast({
        title: 'Limite de Imagens',
        description: 'Você pode enviar no máximo 5 imagens',
        variant: 'destructive',
      });
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    setImages(files);
    setPreviewUrls(urls);
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title || !description || !price) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const formData = {
      type: listingType,
      title,
      description,
      price,
      minimumBid: listingType === 'auction' ? minimumBid : undefined,
      duration: listingType === 'auction' ? duration : undefined,
      location,
      coordinates,
      selectedRegion,
      tags,
      images,
      isPromoted,
      isHighlighted,
      allowOffers,
      visibility,
      condition,
      certificateType,
    };

    onSubmit(formData);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Listar Pixel</CardTitle>
          <CardDescription>Crie um anúncio atraente para seu pixel</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tipo de Listagem */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={listingType === 'sale' ? 'default' : 'outline'}
              onClick={() => setListingType('sale')}
              className="h-24"
            >
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-2 h-8 w-8" />
                <span className="block font-medium">Venda Direta</span>
                <span className="text-sm text-muted-foreground">Vender por um preço fixo</span>
              </div>
            </Button>
            <Button
              variant={listingType === 'auction' ? 'default' : 'outline'}
              onClick={() => setListingType('auction')}
              className="h-24"
            >
              <div className="text-center">
                <Gavel className="mx-auto mb-2 h-8 w-8" />
                <span className="block font-medium">Leilão</span>
                <span className="text-sm text-muted-foreground">
                  Deixe o mercado definir o preço
                </span>
              </div>
            </Button>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Pixel Premium com Vista para o Rio"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva seu pixel em detalhes..."
                rows={4}
              />
            </div>

            {listingType === 'sale' ? (
              <div>
                <Label htmlFor="price">Preço (em créditos)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  min={0}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minimumBid">Lance Inicial</Label>
                  <Input
                    id="minimumBid"
                    type="number"
                    value={minimumBid}
                    onChange={e => setMinimumBid(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label>Duração do Leilão</Label>
                  <Select value={duration.toString()} onValueChange={v => setDuration(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="10">10 dias</SelectItem>
                      <SelectItem value="14">14 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Localização do Pixel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Coordenadas X</Label>
                  <Input
                    type="number"
                    value={coordinates.x}
                    onChange={e => setCoordinates({ ...coordinates, x: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Coordenadas Y</Label>
                  <Input
                    type="number"
                    value={coordinates.y}
                    onChange={e => setCoordinates({ ...coordinates, y: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Região</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="porto">Porto</SelectItem>
                    <SelectItem value="lisboa">Lisboa</SelectItem>
                    <SelectItem value="coimbra">Coimbra</SelectItem>
                    <SelectItem value="braga">Braga</SelectItem>
                    <SelectItem value="faro">Faro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Localização Específica</Label>
                <Input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ex: Centro Histórico, Próximo à Praça..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Imagens</CardTitle>
              <CardDescription>Adicione até 5 imagens do seu pixel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                          setImages(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {previewUrls.length < 5 && (
                    <Button
                      variant="outline"
                      className="flex aspect-square flex-col items-center justify-center"
                      asChild
                    >
                      <label>
                        <Camera className="mb-2 h-8 w-8" />
                        <span className="text-sm">Adicionar</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Formatos aceitos: JPG, PNG • Tamanho máximo: 5MB por imagem
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
              <CardDescription>
                Adicione palavras-chave para ajudar na descoberta do seu pixel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Nova tag..."
                    onKeyPress={e => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag}>Adicionar</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Visibilidade</Label>
                    <p className="text-sm text-muted-foreground">
                      Defina quem pode ver seu anúncio
                    </p>
                  </div>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="followers">Apenas Seguidores</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Condição</Label>
                    <p className="text-sm text-muted-foreground">Estado do pixel</p>
                  </div>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Novo</SelectItem>
                      <SelectItem value="mint">Mint</SelectItem>
                      <SelectItem value="used">Usado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Certificado</Label>
                    <p className="text-sm text-muted-foreground">Tipo de certificação</p>
                  </div>
                  <Select value={certificateType} onValueChange={setCertificateType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Padrão</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="exclusive">Exclusivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir Ofertas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber propostas de compradores
                    </p>
                  </div>
                  <Switch checked={allowOffers} onCheckedChange={setAllowOffers} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Destacar Anúncio</Label>
                    <p className="text-sm text-muted-foreground">Aparecer no topo das buscas</p>
                  </div>
                  <Switch checked={isHighlighted} onCheckedChange={setIsHighlighted} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Promover Anúncio</Label>
                    <p className="text-sm text-muted-foreground">Divulgação em canais premium</p>
                  </div>
                  <Switch checked={isPromoted} onCheckedChange={setIsPromoted} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prévia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prévia do Anúncio</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar Anúncio
              </Button>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Salvar Rascunho</Button>
            <Button onClick={handleSubmit}>Publicar Anúncio</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modal de Prévia */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prévia do Anúncio</DialogTitle>
            <DialogDescription>
              Veja como seu anúncio aparecerá para outros usuários
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Prévia do Anúncio */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {previewUrls.length > 0 && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={previewUrls[0]}
                        alt="Imagem principal"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Preço</p>
                      <p className="text-2xl font-bold">
                        €{listingType === 'auction' ? minimumBid : price}
                      </p>
                    </div>
                    {listingType === 'auction' && (
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-4 w-4" />
                        {duration} dias
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {isPromoted && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Promovido
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
