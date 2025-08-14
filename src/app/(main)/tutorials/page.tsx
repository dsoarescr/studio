'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, BookOpen, Video, Star, Clock, Users, Search, Filter,
  Palette, Target, Zap, Crown, Award, Heart, Eye, Download,
  Share2, Bookmark, ChevronRight, Lightbulb, Rocket, Gem
} from "lucide-react";
import { motion } from "framer-motion";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert';
  category: string;
  thumbnail: string;
  views: number;
  likes: number;
  rating: number;
  isBookmarked: boolean;
  isPremium: boolean;
  tags: string[];
  lessons: number;
  completionRate: number;
}

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Primeiros Passos no Pixel Art',
    description: 'Aprenda os fundamentos básicos da arte pixel, desde a escolha de cores até técnicas de sombreamento.',
    instructor: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25
    },
    duration: '45 min',
    difficulty: 'Iniciante',
    category: 'Básico',
    thumbnail: 'https://placehold.co/300x200/D4A757/FFFFFF?text=Pixel+Básico',
    views: 15420,
    likes: 1234,
    rating: 4.9,
    isBookmarked: false,
    isPremium: false,
    tags: ['básico', 'cores', 'sombreamento'],
    lessons: 8,
    completionRate: 0
  },
  {
    id: '2',
    title: 'Técnicas Avançadas de Animação',
    description: 'Domine a arte da animação pixel com técnicas profissionais de timing e movimento.',
    instructor: {
      name: 'AnimationPro',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 30
    },
    duration: '2h 15min',
    difficulty: 'Avançado',
    category: 'Animação',
    thumbnail: 'https://placehold.co/300x200/7DF9FF/000000?text=Animação',
    views: 8930,
    likes: 892,
    rating: 4.8,
    isBookmarked: true,
    isPremium: true,
    tags: ['animação', 'timing', 'movimento'],
    lessons: 12,
    completionRate: 65
  },
  {
    id: '3',
    title: 'Estratégias de Investimento em Pixels',
    description: 'Como identificar pixels valiosos e construir um portfólio lucrativo no Pixel Universe.',
    instructor: {
      name: 'InvestorGuru',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 28
    },
    duration: '1h 30min',
    difficulty: 'Intermediário',
    category: 'Investimento',
    thumbnail: 'https://placehold.co/300x200/9C27B0/FFFFFF?text=Investimento',
    views: 12340,
    likes: 1567,
    rating: 4.7,
    isBookmarked: false,
    isPremium: true,
    tags: ['investimento', 'estratégia', 'lucro'],
    lessons: 10,
    completionRate: 0
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: BookOpen, count: 24 },
  { id: 'básico', name: 'Básico', icon: Lightbulb, count: 8 },
  { id: 'animação', name: 'Animação', icon: Play, count: 6 },
  { id: 'investimento', name: 'Investimento', icon: Target, count: 4 },
  { id: 'avançado', name: 'Avançado', icon: Rocket, count: 6 }
];

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState(mockTutorials);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const { toast } = useToast();

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = !searchQuery || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tutorial.category.toLowerCase() === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleBookmark = (tutorialId: string) => {
    setTutorials(prev => prev.map(tutorial => 
      tutorial.id === tutorialId 
        ? { ...tutorial, isBookmarked: !tutorial.isBookmarked }
        : tutorial
    ));
    
    const tutorial = tutorials.find(t => t.id === tutorialId);
    toast({
      title: tutorial?.isBookmarked ? "Removido dos Favoritos" : "Adicionado aos Favoritos",
      description: tutorial?.title,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-500 bg-green-500/10';
      case 'Intermediário': return 'text-yellow-500 bg-yellow-500/10';
      case 'Avançado': return 'text-orange-500 bg-orange-500/10';
      case 'Expert': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
              <BookOpen className="h-8 w-8 mr-3" />
              Academia de Pixel Art
            </CardTitle>
            <CardDescription>
              Aprenda com os melhores artistas e torne-se um mestre do Pixel Universe
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Filtros e Pesquisa */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar tutoriais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">Todas as Dificuldades</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Expert">Expert</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="popular">Mais Populares</option>
                  <option value="newest">Mais Recentes</option>
                  <option value="rating">Melhor Avaliados</option>
                  <option value="duration">Duração</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tutorials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="instructors">Instrutores</TabsTrigger>
            <TabsTrigger value="progress">Meu Progresso</TabsTrigger>
          </TabsList>

          {/* Lista de Tutoriais */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                        {tutorial.isPremium && (
                          <Badge className="bg-amber-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 hover:bg-background"
                          onClick={() => handleBookmark(tutorial.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${tutorial.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {tutorial.duration}
                      </div>
                      
                      {tutorial.completionRate > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${tutorial.completionRate}%` }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src={tutorial.instructor.avatar} 
                          alt={tutorial.instructor.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">{tutorial.instructor.name}</span>
                        {tutorial.instructor.verified && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <h3 className="font-semibold mb-2 line-clamp-2">{tutorial.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {tutorial.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {tutorial.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {tutorial.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            {tutorial.rating}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tutorial.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {tutorial.lessons} lições
                        </span>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          {tutorial.completionRate > 0 ? 'Continuar' : 'Começar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Categorias */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-muted-foreground">{category.count} tutoriais</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Instrutores */}
          <TabsContent value="instructors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'PixelMaster', avatar: 'https://placehold.co/80x80.png', tutorials: 12, students: 5420, rating: 4.9 },
                { name: 'AnimationPro', avatar: 'https://placehold.co/80x80.png', tutorials: 8, students: 3210, rating: 4.8 },
                { name: 'InvestorGuru', avatar: 'https://placehold.co/80x80.png', tutorials: 6, students: 2890, rating: 4.7 }
              ].map((instructor, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <img 
                      src={instructor.avatar} 
                      alt={instructor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"
                    />
                    <h3 className="font-semibold text-lg mb-2">{instructor.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{instructor.tutorials} tutoriais</p>
                      <p>{instructor.students.toLocaleString()} estudantes</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span>{instructor.rating}</span>
                      </div>
                    </div>
                    <Button className="mt-4 w-full">
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Meu Progresso */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Aprendizagem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Tutoriais Concluídos</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-accent">45h</div>
                      <div className="text-sm text-muted-foreground">Tempo de Estudo</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso Geral</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conquistas de Aprendizagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Primeiro Tutorial', icon: '🎯', unlocked: true },
                      { name: 'Estudante Dedicado', icon: '📚', unlocked: true },
                      { name: 'Mestre das Cores', icon: '🎨', unlocked: false },
                      { name: 'Expert em Animação', icon: '🎬', unlocked: false }
                    ].map((achievement, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                        achievement.unlocked ? 'bg-green-500/10' : 'bg-muted/20'
                      }`}>
                        <span className="text-2xl">{achievement.icon}</span>
                        <span className={achievement.unlocked ? 'text-green-500' : 'text-muted-foreground'}>
                          {achievement.name}
                        </span>
                        {achievement.unlocked && (
                          <Badge className="ml-auto bg-green-500">Desbloqueado</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
