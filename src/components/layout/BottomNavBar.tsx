
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import MapSidebar from './MapSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Home, Grid3X3, Users, Trophy, Bell, User, Settings, Plus, Search, Camera, Sparkles, Crown, Star, Zap, Heart, Coins, BarChart3, TrendingUp, Activity, Menu, X, ChevronUp, ChevronDown, ChevronRight, MessageSquare, Globe, Target, Video, Mic, Share2, Gamepad2, Palette, Brush, Layers, Compass, Award, Gift, Shield, Lock, Unlock, Eye, EyeOff, Volume2, VolumeX, Phone, PhoneOff, Send, Smile, Image, FileText, Link, Copy, Check, HelpCircle, BookOpen, Bot, Lightbulb, Wand2, RotateCcw, ZoomIn, ZoomOut, Download, Upload, Shuffle, Leaf, Cat, Edit, Trash2, Save, File, Folder, FolderOpen, Minus, Move, Crop, Filter, Type, Square, Circle, Triangle, Hexagon, Octagon, Diamond, Flame, Droplets, CloudRain, CloudSnow, CloudLightning, Sunrise, Sunset, Wind, Thermometer, Gauge, Map, Navigation, Navigation2, Flag, Medal, GraduationCap, Book, Library, School, University, Building, Building2, House, Store, ShoppingBag, ShoppingCart, CreditCard, Wallet, DollarSign, Euro, PoundSterling, Bitcoin, TrendingDown, BarChart, BarChart2, PieChart, LineChart, AreaChart, ScatterChart, Kanban, Timer, Hourglass, CalendarDays, CalendarCheck, CalendarX, CalendarPlus, CalendarMinus, CalendarRange, CalendarSearch, CalendarHeart, CalendarClock, CalendarOff, Clock, Calendar, MapPin, ChevronLeft, Maximize2, Minimize2, SortAsc, SortDesc, AlertCircle, LogIn, UserPlus, UserMinus, UserCheck, UserX, UserCog, UserSearch, Grid, List, Columns, Rows, ExternalLink, ThumbsUp, ThumbsDown, MessageCircle, Mail, Info, AlertTriangle, CheckCircle, XCircle, ShieldCheck, ShieldAlert, Wifi, WifiOff, Battery, BatteryCharging, Volume1, MicOff, Headphones, Gamepad, Mouse, Keyboard, Laptop, Server, Database, Cloud, CloudOff, Sun, Moon, Monitor, Smartphone, Tablet,
} from 'lucide-react';

interface BottomNavBarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
  notifications?: number;
  achievements?: number;
  credits?: number;
  xp?: number;
  level?: number;
}

// Menu Categories for integrated sidebar
const menuCategories = [
  {
    id: 'collaboration',
    name: 'Sessões Colaborativas',
    icon: <Users className="h-4 w-4" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Trabalhe em tempo real com outros utilizadores',
    features: [
      {
        id: 'realtime-collab',
        name: 'Colaboração em Tempo Real',
        description: 'Edite pixels em conjunto com outros utilizadores',
        icon: <Video className="h-3 w-3" />,
        premium: false
      },
      {
        id: 'live-sessions',
        name: 'Sessões ao Vivo',
        description: 'Participe em sessões de criação colaborativa',
        icon: <Mic className="h-3 w-3" />,
        premium: true
      }
    ]
  },
  {
    id: 'ar',
    name: 'Realidade Aumentada',
    icon: <Camera className="h-4 w-4" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Explore pixels no mundo real',
    features: [
      {
        id: 'ar-experience',
        name: 'Experiência AR',
        description: 'Veja pixels sobrepostos na realidade',
        icon: <Globe className="h-3 w-3" />,
        premium: false
      },
      {
        id: 'ai-assistant',
        name: 'Assistente IA',
        description: 'IA que ajuda na criação de pixels',
        icon: <Sparkles className="h-3 w-3" />,
        premium: true
      }
    ]
  },
  {
    id: 'gamification',
    name: 'Gamificação',
    icon: <Trophy className="h-4 w-4" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    description: 'Missões, conquistas e recompensas',
    features: [
      {
        id: 'advanced-gamification',
        name: 'Sistema Avançado',
        description: 'Missões diárias e eventos especiais',
        icon: <Target className="h-3 w-3" />,
        premium: false
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Estatísticas e análises detalhadas',
    features: [
      {
        id: 'advanced-analytics',
        name: 'Analytics Avançados',
        description: 'Estatísticas em tempo real',
        icon: <TrendingUp className="h-3 w-3" />,
        premium: true
      }
    ]
  }
];

export default function BottomNavBar({
  onNavigate, activeSection, notifications = 0, achievements = 0, credits = 0, xp = 0, level = 1
}: BottomNavBarProps) {
  const { user } = useAuth();
  const { isPremium } = useUserStore();
  const { vibrate } = useHapticFeedback();
  const [playHoverSound, setPlayHoverSound] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const navItems = [
    { id: 'home', label: 'Início', icon: <Home className="h-5 w-5" />, badge: null },
    { id: 'pixels', label: 'Pixels', icon: <Grid3X3 className="h-5 w-5" />, badge: null },
    { id: 'community', label: 'Comunidade', icon: <Users className="h-5 w-5" />, badge: null },
    { id: 'achievements', label: 'Conquistas', icon: <Trophy className="h-5 w-5" />, badge: achievements > 0 ? achievements : null },
    { id: 'notifications', label: 'Notificações', icon: <Bell className="h-5 w-5" />, badge: notifications > 0 ? notifications : null }
  ];

  const quickActions = [
    { id: 'search', label: 'Pesquisar', icon: <Search className="h-4 w-4" />, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'ar', label: 'Realidade Aumentada', icon: <Camera className="h-4 w-4" />, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { id: 'collaboration', label: 'Colaboração', icon: <Users className="h-4 w-4" />, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, color: 'text-orange-500', bgColor: 'bg-orange-500/10' }
  ];

  const handleNavClick = (section: string) => {
    vibrate('light');
    setPlayHoverSound(true);
    onNavigate(section);
  };

  const handleQuickAction = (action: string) => {
    vibrate('light');
    setPlayHoverSound(true);
    // Implementar ações rápidas
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    vibrate('light');
    setPlayHoverSound(true);
  };

  const handleFeatureClick = (feature: any) => {
    vibrate('light');
    setPlayHoverSound(true);
    // Implementar funcionalidades
  };

  useEffect(() => {
    if (showSidebar) {
      setSidebarHeight(window.innerHeight * 0.7);
    } else {
      setSidebarHeight(0);
    }
  }, [showSidebar]);

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.HOVER} play={playHoverSound} onEnd={() => setPlayHoverSound(false)} volume={0.15} rate={1.5} />
      
      {/* Integrated Sidebar Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <SidebarProvider>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleSidebar}
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-t-3xl shadow-2xl"
              style={{ height: `${sidebarHeight}px` }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
                    <Grid3X3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Pixel Universe
                    </h2>
                    <p className="text-xs text-muted-foreground">Experiência Única</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="p-4 border-b border-border/50">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="stats" className="text-xs">Estatísticas</TabsTrigger>
                      <TabsTrigger value="features" className="text-xs">Funcionalidades</TabsTrigger>
                    </TabsList>
                  </div>

                  <ScrollArea className="flex-1">
                    <TabsContent value="stats" className="p-4 space-y-4 m-0">
                      <MapSidebar />
                    </TabsContent>

                    <TabsContent value="features" className="p-4 space-y-4 m-0">
                      <div className="space-y-4">
                        {menuCategories.map((category) => (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                <div className={category.color}>{category.icon}</div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{category.name}</h3>
                                <p className="text-xs text-muted-foreground">{category.description}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {category.features.map((feature) => (
                                <motion.div
                                  key={feature.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Card
                                    className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                                    onClick={() => handleFeatureClick(feature)}
                                    onMouseEnter={() => setPlayHoverSound(true)}
                                  >
                                    <CardContent className="p-3">
                                      <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                          <div className={category.color}>{feature.icon}</div>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2">
                                            <h4 className="font-medium text-sm">{feature.name}</h4>
                                            {feature.premium && (
                                              <Crown className="h-3 w-3 text-yellow-500" />
                                            )}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {feature.description}
                                          </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </motion.div>
          </SidebarProvider>
        )}
      </AnimatePresence>

      {/* User Status Bar */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className="fixed bottom-20 left-0 right-0 z-30 px-4"
      >
        <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={isPremium ? "default" : "secondary"} className="text-xs">
                    {isPremium ? (
                      <><Crown className="h-3 w-3 mr-1" />Premium</>
                    ) : (
                      <><Star className="h-3 w-3 mr-1" />Free</>
                    )}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Nível {level}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Coins className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-semibold">{credits}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-semibold">{xp} XP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Bottom Navigation */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/50"
      >
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={activeSection === item.id ? "default" : "ghost"} 
                    size="sm" 
                    className="relative flex flex-col items-center space-y-1 p-2 h-auto" 
                    onClick={() => handleNavClick(item.id)} 
                    onMouseEnter={() => setPlayHoverSound(true)}
                  >
                    <div className="relative">
                      {item.icon}
                      {item.badge && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          
          {/* Sidebar Toggle Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showSidebar ? "default" : "ghost"} 
                  size="sm" 
                  className="relative flex flex-col items-center space-y-1 p-2 h-auto" 
                  onClick={toggleSidebar} 
                  onMouseEnter={() => setPlayHoverSound(true)}
                >
                  <motion.div 
                    animate={{ rotate: showSidebar ? 180 : 0 }} 
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </motion.div>
                  <span className="text-xs">Menu</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Menu Principal</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    </>
  );
}
