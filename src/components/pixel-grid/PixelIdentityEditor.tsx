'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  User, Palette, Link as LinkIcon, Image as ImageIcon, Music, 
  Video, FileText, Save, Share2, Eye, Heart, Star, Crown,
  Sparkles, Zap, Target, Award, Camera, Upload, X, Check,
  Globe, Instagram, Twitter, Youtube, Twitch, Github, Linkedin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixelIdentity {
  name: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  theme: string;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: React.ReactNode;
  }>;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  showStats: boolean;
}

interface PixelIdentityEditorProps {
  isOpen: boolean;
  onClose: () => void;
  pixelData: any;
  onSave: (identity: PixelIdentity) => void;
}

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" />, color: 'text-pink-500' },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" />, color: 'text-blue-500' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="h-4 w-4" />, color: 'text-red-500' },
  { id: 'twitch', name: 'Twitch', icon: <Twitch className="h-4 w-4" />, color: 'text-purple-500' },
  { id: 'github', name: 'GitHub', icon: <Github className="h-4 w-4" />, color: 'text-gray-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, color: 'text-blue-600' }
];

const themes = [
  { id: 'minimal', name: 'Minimalista', preview: '#FFFFFF', description: 'Limpo e elegante' },
  { id: 'neon', name: 'Neon', preview: '#FF00FF', description: 'Vibrante e moderno' },
  { id: 'nature', name: 'Natureza', preview: '#4CAF50', description: 'Cores naturais' },
  { id: 'sunset', name: 'Pôr do Sol', preview: '#FF6B35', description: 'Tons quentes' },
  { id: 'ocean', name: 'Oceano', preview: '#0077BE', description: 'Azuis profundos' },
  { id: 'galaxy', name: 'Galáxia', preview: '#6A0DAD', description: 'Roxos cósmicos' }
];

export default function PixelIdentityEditor({ isOpen, onClose, pixelData, onSave }: PixelIdentityEditorProps) {
  const [identity, setIdentity] = useState<PixelIdentity>({
    name: '',
    bio: '',
    theme: 'minimal',
    socialLinks: [],
    tags: [],
    isPublic: true,
    allowComments: true,
    showStats: true
  });
  
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  const handleSave = () => {
    if (!identity.name.trim()) {
      toast({
        title: "Nome Obrigatório",
        description: "Por favor, dê um nome à sua identidade digital.",
        variant: "destructive"
      });
      return;
    }

    onSave(identity);
    toast({
      title: "Identidade Criada! ✨",
      description: "Sua identidade digital foi criada com sucesso!",
    });
  };

  const addTag = () => {
    if (newTag.trim() && !identity.tags.includes(newTag.trim())) {
      setIdentity(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setIdentity(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addSocialLink = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.id === platform);
    if (platformData) {
      setIdentity(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, {
          platform: platformData.name,
          url: '',
          icon: platformData.icon
        }]
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
          <DialogTitle className="flex items-center">
            <User className="h-6 w-6 mr-3 text-blue-500" />
            Criar Identidade Digital
            <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-purple-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Personalização
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-6 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="basic">
              <User className="h-4 w-4 mr-2" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="design">
              <Palette className="h-4 w-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="social">
              <Globe className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden p-6">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Identidade</Label>
                <Input
                  id="name"
                  placeholder="Ex: Meu Cantinho em Lisboa"
                  value={identity.name}
                  onChange={(e) => setIdentity(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte a história do seu pixel..."
                  value={identity.bio}
                  onChange={(e) => setIdentity(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} disabled={!newTag.trim()}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {identity.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      #{tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Tema Visual</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {themes.map(theme => (
                    <Card 
                      key={theme.id}
                      className={`cursor-pointer transition-all ${identity.theme === theme.id ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setIdentity(prev => ({ ...prev, theme: theme.id }))}
                    >
                      <CardContent className="p-3 text-center">
                        <div 
                          className="w-12 h-12 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: theme.preview }}
                        />
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                        <p className="text-xs text-muted-foreground">{theme.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Avatar do Pixel</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={identity.avatar} />
                    <AvatarFallback>
                      <Camera className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Carregar Imagem
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG até 2MB
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Redes Sociais</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {socialPlatforms.map(platform => (
                    <Button
                      key={platform.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addSocialLink(platform.id)}
                      className="justify-start"
                    >
                      <span className={platform.color}>{platform.icon}</span>
                      <span className="ml-2">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {identity.socialLinks.length > 0 && (
                <div className="space-y-3">
                  {identity.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {link.icon}
                      <Input
                        placeholder={`URL do ${link.platform}`}
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...identity.socialLinks];
                          newLinks[index].url = e.target.value;
                          setIdentity(prev => ({ ...prev, socialLinks: newLinks }));
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newLinks = identity.socialLinks.filter((_, i) => i !== index);
                          setIdentity(prev => ({ ...prev, socialLinks: newLinks }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Perfil Público</Label>
                  <input
                    type="checkbox"
                    checked={identity.isPublic}
                    onChange={(e) => setIdentity(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Permitir Comentários</Label>
                  <input
                    type="checkbox"
                    checked={identity.allowComments}
                    onChange={(e) => setIdentity(prev => ({ ...prev, allowComments: e.target.checked }))}
                    className="rounded"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-0">
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={identity.avatar} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold mb-2">{identity.name || 'Nome da Identidade'}</h3>
                  <p className="text-muted-foreground mb-4">{identity.bio || 'Biografia aparecerá aqui...'}</p>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {identity.tags.map(tag => (
                      <Badge key={tag} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">1</div>
                      <div className="text-xs text-muted-foreground">Pixels</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">0</div>
                      <div className="text-xs text-muted-foreground">Seguidores</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">0</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-6 border-t bg-muted/20">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Criar Identidade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}