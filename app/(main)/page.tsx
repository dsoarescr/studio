
// src/app/(main)/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
// import BottomNavBar from '@/components/layout/BottomNavBar';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { SidebarProvider } from '@/components/ui/sidebar';
// import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/components/mobile/HapticFeedback';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import {
  Menu,
  X,
  Grid3X3,
  Users,
  Camera,
  Trophy,
  Bell,
  BarChart3,
  Sparkles,
  Crown,
  Star,
  Zap,
  Shield,
  Globe,
  Target,
  Heart,
  Gift,
  Coins,
  Video,
  Mic,
  Share2,
  Settings,
  Plus,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CameraOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Send,
  Smile,
  Image,
  FileText,
  Link,
  Copy,
  Check,
  HelpCircle,
  BookOpen,
  Bot,
  Lightbulb,
  Wand2,
  Compass,
  Award,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Palette,
  Brush,
  Eraser,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  Calendar,
  MapPin,
  TrendingUp,
  Activity,
  Home,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume1,
  MicOff,
  Headphones,
  Gamepad,
  Mouse,
  Keyboard,
  Laptop,
  Server,
  Database,
  Cloud,
  CloudOff,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Mail,
  File,
  Folder,
  FolderOpen,
  Trash2,
  Edit,
  Edit3,
  Save,
  Minus,
  AlertCircle,
  LogIn,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  UserSearch,
  Grid,
  List,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Flame,
  Droplets,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sunrise,
  Sunset,
  Wind,
  Thermometer,
  Gauge,
  Map,
  Navigation,
  Navigation2,
  Flag,
  Medal,
  GraduationCap,
  Book,
  Library,
  School,
  University,
  Building,
  Building2,
  House,
  Store,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  TrendingDown,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Kanban,
  Timer,
  Hourglass,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  CalendarClock,
  CalendarOff,
} from 'lucide-react';

// Menu Categories
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

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isPremium, credits, xp, level, achievements } = useUserStore();
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [playHoverSound, setPlayHoverSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFeatureClick = (feature: any) => {
    if (feature.premium && !isPremium) {
      toast({
        title: "Funcionalidade Premium",
        description: "Esta funcionalidade está disponível apenas para utilizadores premium.",
        variant: "destructive",
      });
      return;
    }

    vibrate('light');
    setPlayHoverSound(true);
    setShowConfetti(true);
    
    toast({
      title: "Funcionalidade Ativada",
      description: `${feature.name} foi iniciada com sucesso!`,
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    vibrate('light');
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    // Implementar navegação entre seções
  };

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="relative w-full h-full bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="p-2"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
                    <Grid3X3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Pixel Universe
                    </h1>
                    <p className="text-xs text-muted-foreground">Experiência Única</p>
                  </div>
                </div>
              </div>
              
              {user && (
                <div className="flex items-center space-x-2">
                  <Badge variant={isPremium ? "default" : "secondary"} className="text-xs">
                    {isPremium ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </>
                    ) : (
                      <>
                        <Star className="h-3 w-3 mr-1" />
                        Free
                      </>
                    )}
                  </Badge>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Main Layout */}
        <div className={`relative w-full flex h-full ${isMobile ? 'pt-16 pb-20' : ''}`}>
          {/* Desktop Sidebar (only for desktop) */}
          {!isMobile && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: sidebarOpen ? 0 : -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-80 h-full bg-background/95 backdrop-blur-sm border-r border-border/50 shadow-xl"
            >
              <div className="h-full flex flex-col">
                {/* Desktop Header */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
                      <Grid3X3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        Pixel Universe
                      </h1>
                      <p className="text-sm text-muted-foreground">Experiência Única</p>
                    </div>
                  </div>

                  {user && (
                    <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{user.displayName || 'Utilizador'}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant={isPremium ? "default" : "secondary"} className="text-xs">
                                {isPremium ? (
                                  <>
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-3 w-3 mr-1" />
                                    Free
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Desktop Sidebar Content */}
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
                                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                        feature.premium && !isPremium ? 'opacity-60' : ''
                                      }`}
                                      onClick={() => handleFeatureClick(feature)}
                                      onMouseEnter={() => setPlayHoverSound(true)}
                                    >
                                      <CardContent className="p-4">
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
                                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
              </div>
            </motion.div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 h-full relative">
            <PixelGrid />
          </div>
        </div>

        {/* Enhanced Mobile Bottom Navigation with Integrated Sidebar */}
        {/* {isMobile && (
          <BottomNavBar
            onNavigate={handleNavigate}
            activeSection={activeSection}
            notifications={3}
            achievements={achievements || 0}
            credits={credits}
            xp={xp}
            level={level}
          />
        )} */}

        {/* Performance Monitor */}
        <PerformanceMonitor />

        {/* Sound Effects */}
        <SoundEffect
          src={SOUND_EFFECTS.HOVER}
          play={playHoverSound}
          onEnd={() => setPlayHoverSound(false)}
          volume={0.15}
          rate={1.5}
        />

        {/* Confetti */}
        <Confetti
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />
      </div>
    </SidebarProvider>
  );
}

