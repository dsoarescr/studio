'use client';

import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Image as ImageIcon,
  Target,
  Users,
  MapPin,
  Tag,
  DollarSign,
  Settings,
  Eye,
  Upload,
  Sparkles,
} from 'lucide-react';

interface CreateCampaignProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CreateCampaign({ onSubmit, onCancel }: CreateCampaignProps) {
  const [campaignType, setCampaignType] = useState<'banner' | 'featured' | 'spotlight'>('banner');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targeting, setTargeting] = useState({
    regions: [] as string[],
    interests: [] as string[],
    minPrice: 0,
    maxPrice: 0,
  });
  const [creatives, setCreatives] = useState<File[]>([]);
  const [isAutomated, setIsAutomated] = useState(false);
  const [bidStrategy, setBidStrategy] = useState('auto');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title || !description || !budget || !startDate || !endDate) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const formData = {
      type: campaignType,
      title,
      description,
      budget,
      startDate,
      endDate,
      targeting,
      creatives,
      isAutomated,
      bidStrategy,
    };

    onSubmit(formData);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Nova Campanha</CardTitle>
          <CardDescription>Configure sua campanha publicitária</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tipo de Campanha */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={campaignType === 'banner' ? 'default' : 'outline'}
              onClick={() => setCampaignType('banner')}
              className="h-24"
            >
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                <span className="block font-medium">Banner</span>
                <span className="text-sm text-muted-foreground">Anúncio em destaque</span>
              </div>
            </Button>

            <Button
              variant={campaignType === 'featured' ? 'default' : 'outline'}
              onClick={() => setCampaignType('featured')}
              className="h-24"
            >
              <div className="text-center">
                <Sparkles className="mx-auto mb-2 h-8 w-8" />
                <span className="block font-medium">Destaque</span>
                <span className="text-sm text-muted-foreground">Pixel em destaque</span>
              </div>
            </Button>

            <Button
              variant={campaignType === 'spotlight' ? 'default' : 'outline'}
              onClick={() => setCampaignType('spotlight')}
              className="h-24"
            >
              <div className="text-center">
                <Target className="mx-auto mb-2 h-8 w-8" />
                <span className="block font-medium">Spotlight</span>
                <span className="text-sm text-muted-foreground">Máxima visibilidade</span>
              </div>
            </Button>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Campanha</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Pixels Premium Porto"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva sua campanha..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="budget">Orçamento Total (em créditos)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Segmentação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Segmentação</CardTitle>
              <CardDescription>Defina o público-alvo da sua campanha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Regiões</Label>
                <Select
                  value={targeting.regions.join(',')}
                  onValueChange={value =>
                    setTargeting({
                      ...targeting,
                      regions: value.split(',').filter(Boolean),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as regiões" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="porto">Porto</SelectItem>
                    <SelectItem value="lisboa">Lisboa</SelectItem>
                    <SelectItem value="braga">Braga</SelectItem>
                    <SelectItem value="coimbra">Coimbra</SelectItem>
                    <SelectItem value="faro">Faro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Interesses</Label>
                <Select
                  value={targeting.interests.join(',')}
                  onValueChange={value =>
                    setTargeting({
                      ...targeting,
                      interests: value.split(',').filter(Boolean),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os interesses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investimentos">Investimentos</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="turismo">Turismo</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="arte">Arte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço Mínimo</Label>
                  <Input
                    type="number"
                    value={targeting.minPrice}
                    onChange={e =>
                      setTargeting({
                        ...targeting,
                        minPrice: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label>Preço Máximo</Label>
                  <Input
                    type="number"
                    value={targeting.maxPrice}
                    onChange={e =>
                      setTargeting({
                        ...targeting,
                        maxPrice: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Criativos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Criativos</CardTitle>
              <CardDescription>Adicione as imagens da sua campanha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex h-32 flex-col items-center justify-center"
                  asChild
                >
                  <label>
                    <Upload className="mb-2 h-8 w-8" />
                    <span className="text-sm">Adicionar Imagem</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        setCreatives([...creatives, ...files]);
                      }}
                    />
                  </label>
                </Button>

                {creatives.map((file, index) => (
                  <div key={index} className="relative h-32">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Criativo ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        setCreatives(creatives.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Otimização Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que o sistema otimize sua campanha automaticamente
                  </p>
                </div>
                <Switch checked={isAutomated} onCheckedChange={setIsAutomated} />
              </div>

              <div>
                <Label>Estratégia de Lance</Label>
                <Select value={bidStrategy} onValueChange={setBidStrategy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automático</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="enhanced">Otimizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Salvar Rascunho</Button>
            <Button onClick={handleSubmit}>Criar Campanha</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
