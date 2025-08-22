'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lucide imports removed
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  content: string;
  pixel?: {
    x: number;
    y: number;
    region: string;
    imageUrl: string;
  };
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  tags: string[];
}

interface PixelClub {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  avatar: string;
  isJoined: boolean;
  recentActivity: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  prize: string;
  endDate: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  progress?: number;
}

interface PixelSocialFeaturesProps {
  children: React.ReactNode;
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    author: {
      name: 'PixelArtist',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 15
    },
    content: 'Acabei de criar esta obra-prima em Lisboa! O que acham? 🎨✨',
    pixel: {
      x: 245,
      y: 156,
      region: 'Lisboa',
      imageUrl: 'https://placehold.co/200x200/D4A757/FFFFFF?text=Arte+Lisboa'
    },
    likes: 89,
    comments: 23,
    shares: 12,
    timestamp: '2h',
    isLiked: false,
    tags: ['arte', 'lisboa', 'masterpiece']
  },
  {
    id: '2',
    author: {
      name: 'ColorMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 12
    },
    content: 'Novo recorde pessoal! 50 pixels numa semana! 🚀',
    likes: 156,
    comments: 45,
    shares: 28,
    timestamp: '4h',
    isLiked: true,
    tags: ['recorde', 'coleção']
  }
];

const mockClubs: PixelClub[] = [
  {
    id: '1',
    name: 'Artistas de Lisboa',
    description: 'Comunidade de criadores da capital',
    members: 234,
    category: 'Regional',
    avatar: 'https://placehold.co/60x60/D4A757/FFFFFF?text=LX',
    isJoined: true,
    recentActivity: 'Nova obra partilhada há 2h'
  },
  {
    id: '2',
    name: 'Colecionadores Premium',
    description: 'Investidores e colecionadores sérios',
    members: 89,
    category: 'Investimento',
    avatar: 'https://placehold.co/60x60/7DF9FF/000000?text=💎',
    isJoined: false,
    recentActivity: 'Discussão sobre tendências'
  },
  {
    id: '3',
    name: 'Pixel Art Iniciantes',
    description: 'Espaço para quem está começando',
    members: 567,
    category: 'Educação',
    avatar: 'https://placehold.co/60x60/9C27B0/FFFFFF?text=🎨',
    isJoined: false,
    recentActivity: 'Tutorial publicado há 1h'
  }
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Desafio das Cores de Portugal',
    description: 'Crie arte usando apenas as cores da bandeira portuguesa',
    participants: 156,
    prize: '1000 créditos + badge exclusivo',
    endDate: '2024-12-31',
    difficulty: 'Médio',
    progress: 65
  },
  {
    id: '2',
    title: 'Maratona de Pixels',
    description: 'Compre 10 pixels em 24 horas',
    participants: 89,
    prize: '500 créditos especiais',
    endDate: '2024-12-25',
    difficulty: 'Difícil'
  }
];

export default function PixelSocialFeatures({ children }: PixelSocialFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [clubs, setClubs] = useState(mockClubs);
  const [challenges] = useState(mockChallenges);
  const [newPost, setNewPost] = useState('');
  const [selectedTab, setSelectedTab] = useState('feed');
  
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleJoinClub = (clubId: string) => {
    setClubs(prev => prev.map(club => 
      club.id === clubId 
        ? { 
            ...club, 
            isJoined: !club.isJoined,
            members: club.isJoined ? club.members - 1 : club.members + 1
          }
        : club
    ));
    
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      toast({
        title: club.isJoined ? "Saiu do Clube" : "Juntou-se ao Clube!",
        description: `${club.name} - ${club.isJoined ? 'Deixou de seguir' : 'Agora é membro'}`,
      });
    }
  };

  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post: SocialPost = {
      id: Date.now().toString(),
      author: {
        name: 'Você',
        avatar: 'https://placehold.co/40x40.png',
        verified: true,
        level: 15
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'agora',
      isLiked: false,
      tags: []
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    
    toast({
      title: "Post Criado!",
      description: "Sua publicação foi partilhada com a comunidade.",
    });
  };

  const joinChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      toast({
        title: "Desafio Aceite! 🎯",
        description: `Juntou-se ao "${challenge.title}"`,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-500 bg-green-500/10';
      case 'Médio': return 'text-yellow-500 bg-yellow-500/10';
      case 'Difícil': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-pink-500/10 to-purple-500/10">
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-pink-500" />
            Hub Social de Pixels
            <Badge className="ml-2 bg-gradient-to-r from-pink-500 to-purple-500">
              <Heart className="h-3 w-3 mr-1" />
              Comunidade
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          <TabsList className="px-4 pt-4 bg-transparent justify-start border-b rounded-none">
            <TabsTrigger value="feed">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="clubs">
              <Users className="h-4 w-4 mr-2" />
              Clubes
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Target className="h-4 w-4 mr-2" />
              Desafios
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            {/* Feed Social */}
            <TabsContent value="feed" className="h-full">
              <div className="flex">
                <div className="flex-1 p-4">
                  {/* Criar Post */}
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src="https://placehold.co/40x40.png" />
                          <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input
                            placeholder="Partilhe algo com a comunidade..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="mb-3"
                          />
                          <div className="flex justify-between">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Camera className="h-4 w-4 mr-2" />
                                Foto
                              </Button>
                              <Button variant="outline" size="sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                Pixel
                              </Button>
                            </div>
                            <Button onClick={createPost} disabled={!newPost.trim()}>
                              <Send className="h-4 w-4 mr-2" />
                              Publicar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Posts */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {posts.map(post => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Avatar>
                                  <AvatarImage src={post.author.avatar} />
                                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{post.author.name}</span>
                                    {post.author.verified && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      Nível {post.author.level}
                                    </Badge>
                                  </div>
                                  <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                                </div>
                              </div>
                              
                              <p className="mb-3">{post.content}</p>
                              
                              {post.pixel && (
                                <Card className="mb-3 bg-muted/20">
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                      <img 
                                        src={post.pixel.imageUrl} 
                                        alt="Pixel"
                                        className="w-16 h-16 rounded border"
                                      />
                                      <div>
                                        <h4 className="font-medium">
                                          Pixel ({post.pixel.x}, {post.pixel.y})
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {post.pixel.region}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                              
                              {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {post.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLike(post.id)}
                                    className={post.isLiked ? 'text-red-500' : ''}
                                  >
                                    <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                                    {post.likes}
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    {post.comments}
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {post.shares}
                                  </Button>
                                </div>
                                
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Sidebar - Trending */}
                <div className="w-80 border-l p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm">
                        <Flame className="h-4 w-4 mr-2 text-orange-500" />
                        Trending
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { tag: '#LisboaArt', posts: '234 posts' },
                        { tag: '#PixelInvestment', posts: '156 posts' },
                        { tag: '#PortugalPixels', posts: '89 posts' }
                      ].map((trend, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium text-primary">{trend.tag}</span>
                          <span className="text-sm text-muted-foreground">{trend.posts}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Clubes */}
            <TabsContent value="clubs" className="h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map(club => (
                  <Card key={club.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={club.avatar} 
                          alt={club.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{club.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {club.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {club.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-3 text-sm">
                        <span>{club.members} membros</span>
                        <span className="text-muted-foreground">{club.recentActivity}</span>
                      </div>
                      
                      <Button 
                        onClick={() => handleJoinClub(club.id)}
                        variant={club.isJoined ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {club.isJoined ? (
                          <>
                            <Users className="h-4 w-4 mr-2" />
                            Membro
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Juntar-se
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Desafios */}
            <TabsContent value="challenges" className="h-full p-4">
              <div className="space-y-4">
                {challenges.map(challenge => (
                  <Card key={challenge.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-full">
                            <Target className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Termina em</div>
                          <div className="font-medium">{challenge.endDate}</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {challenge.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {challenge.participants} participantes
                          </span>
                          <span className="flex items-center gap-1">
                            <Gift className="h-4 w-4 text-yellow-500" />
                            {challenge.prize}
                          </span>
                        </div>
                        
                        <Button onClick={() => joinChallenge(challenge.id)}>
                          <Trophy className="h-4 w-4 mr-2" />
                          Participar
                        </Button>
                      </div>
                      
                      {challenge.progress && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Seu Progresso</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Eventos */}
            <TabsContent value="events" className="h-full p-4">
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Próximos Eventos</h3>
                      <p className="text-muted-foreground mb-4">
                        Participe em eventos exclusivos da comunidade
                      </p>
                      
                      <div className="space-y-3">
                        {[
                          {
                            name: 'Concurso de Arte Natalícia',
                            date: '25 Dezembro',
                            prize: '2000 créditos especiais'
                          },
                          {
                            name: 'Maratona de Ano Novo',
                            date: '31 Dezembro',
                            prize: 'Pixel lendário exclusivo'
                          }
                        ].map((event, index) => (
                          <Card key={index} className="bg-background/50">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{event.name}</h4>
                                  <p className="text-sm text-muted-foreground">{event.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-primary">{event.prize}</p>
                                  <Button size="sm" className="mt-1">Participar</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
