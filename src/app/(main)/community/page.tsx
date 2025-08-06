'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Users, MessageSquare, Heart, Share2, Send, Camera, MapPin,
  Trophy, Star, Crown, Gift, Zap, Target, Award, Calendar,
  TrendingUp, Eye, ThumbsUp, UserPlus, Bookmark, Flag
} from "lucide-react";

interface CommunityPost {
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

const mockPosts: CommunityPost[] = [
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

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
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

  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post: CommunityPost = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 space-y-6 max-w-4xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center">
              <Users className="h-8 w-8 mr-3" />
              Comunidade Pixel Universe
            </CardTitle>
            <CardDescription>
              Conecte-se com outros criadores e partilhe suas obras-primas
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Top Criadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Partilhe algo com a comunidade..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mb-3"
                      rows={3}
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
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Tendências da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { tag: '#LisboaArt', posts: '234 posts', growth: '+23%' },
                    { tag: '#PixelInvestment', posts: '156 posts', growth: '+18%' },
                    { tag: '#PortugalPixels', posts: '89 posts', growth: '+15%' }
                  ].map((trend, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <div>
                        <span className="font-medium text-primary">{trend.tag}</span>
                        <p className="text-sm text-muted-foreground">{trend.posts}</p>
                      </div>
                      <Badge className="bg-green-500">{trend.growth}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                  Eventos da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Concurso de Arte Natalícia',
                      date: '25 Dezembro',
                      participants: 234,
                      prize: '2000 créditos especiais'
                    },
                    {
                      name: 'Maratona de Ano Novo',
                      date: '31 Dezembro',
                      participants: 156,
                      prize: 'Pixel lendário exclusivo'
                    }
                  ].map((event, index) => (
                    <Card key={index} className="bg-background/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                            <p className="text-xs text-muted-foreground">{event.participants} participantes</p>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Top Criadores da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'PixelMaster', score: 15420, avatar: 'https://placehold.co/40x40.png' },
                    { rank: 2, name: 'ArtGenius', score: 14890, avatar: 'https://placehold.co/40x40.png' },
                    { rank: 3, name: 'ColorWizard', score: 13560, avatar: 'https://placehold.co/40x40.png' }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        {user.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                        <span className="font-bold text-lg">#{user.rank}</span>
                      </div>
                      
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.score.toLocaleString()} pontos
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Seguir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}