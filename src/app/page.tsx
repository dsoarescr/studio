
// src/app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import PixelGrid from '@/components/pixel-grid/PixelGrid';
import MapSidebar from '@/components/layout/MapSidebar';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn, UserPlus, Sparkles, Crown, Zap, Target, TrendingUp, Users, MapPin, Trophy, Gift, Bell, MessageSquare, Share2, Eye, Heart, Star, Flame, Rocket, Globe, Calendar, Clock, Award, Gem, Shield, Camera, Video, Music, Palette, Brush, Wand2, Brain, Settings, HelpCircle, Search, Filter, Download, Upload, RefreshCw, Play, Pause, Volume2, Mic, Phone, Mail, Link as LinkIcon, ExternalLink, Info, AlertTriangle, CheckCircle, XCircle, Plus, Minus, X, Check, ArrowRight, ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, MoreVertical, Menu, Home, ShoppingCart, BarChart3, User, Coins, CreditCard, Lock, Unlock, Bookmark, Tag, Flag, Archive, Trash2, Edit, Copy, Scissors, FileText, Image as ImageIcon, Folder, FolderOpen, Save, Printer, Maximize, Minimize, RotateCcw, RotateCw, ZoomIn, ZoomOut, Move, Crosshair, Layers, Grid, Ruler, Pipette, PaintBucket, Eraser, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Code, Terminal, Database, Server, Cloud, Wifi, WifiOff, Battery, BatteryLow, Signal, Bluetooth, Usb, Headphones, Speaker, VolumeX, Volume1, Brightness, BrightnessDown, BrightnessUp, Sun, Moon, CloudRain, CloudSnow, Thermometer, Wind, Compass, Navigation, Map as MapIconLucide, Route, Car, Bike, Walk, Plane, Train, Bus, Truck, Ship, Anchor, Tent, TreePine, Mountain, Waves, Sunrise, Sunset, Rainbow, Snowflake, Droplets, Leaf, Flower, Bug, Fish, Bird, Cat, Dog, Rabbit, Bear, Lion, Elephant, Turtle, Butterfly, Bee, Spider, Ant, Snail, Worm, Mushroom, Cactus, Seedling, Sprout, Cherry, Apple, Banana, Grape, Orange, Lemon, Strawberry, Watermelon, Pineapple, Coconut, Avocado, Carrot, Corn, Tomato, Potato, Onion, Garlic, Pepper, Chili, Cucumber, Broccoli, Lettuce, Spinach, Kale, Cabbage, Cauliflower, Radish, Turnip, Beet, Pumpkin, Squash, Eggplant, Zucchini, Artichoke, Asparagus, Celery, Leek, Scallion, Ginger, Turmeric, Cinnamon, Nutmeg, Clove, Cardamom, Saffron, Vanilla, Chocolate, Coffee, Tea, Wine, Beer, Cocktail, Juice, Soda, Water, Milk, Honey, Sugar, Salt, Flour, Rice, Bread, Cheese, Butter, Egg, Meat, Fish as FishIcon, Chicken, Beef, Pork, Lamb, Shrimp, Crab, Lobster, Oyster, Clam, Mussel, Squid, Octopus, Jellyfish, Starfish, Seahorse, Whale, Dolphin, Shark, Stingray, Penguin, Flamingo, Peacock, Owl, Eagle, Hawk, Falcon, Parrot, Canary, Robin, Sparrow, Crow, Raven, Pigeon, Duck, Goose, Swan, Pelican, Heron, Crane, Stork, Ostrich, Emu, Kiwi, Turkey, Rooster, Hen, Chick, Pig, Cow, Horse, Sheep, Goat, Donkey, Mule, Zebra, Giraffe, Hippo, Rhino, Camel, Llama, Alpaca, Kangaroo, Koala, Panda, Sloth, Monkey, Gorilla, Orangutan, Chimpanzee, Lemur, Meerkat, Otter, Seal, Walrus, PolarBear, Grizzly, BlackBear, Wolf, Fox, Coyote, Jackal, Hyena, Leopard, Cheetah, Jaguar, Puma, Lynx, Bobcat, Ocelot, Serval, Caracal, Tiger, Panther, Snow, Leopard as LeopardIcon, Cougar, Wildcat, Housecat, Kitten, Puppy, Hamster, GuineaPig, Ferret, Chinchilla, Hedgehog, Squirrel, Chipmunk, Beaver, Porcupine, Skunk, Raccoon, Opossum, Armadillo, Anteater, Pangolin, Aardvark, Wombat, Quokka, Capybara, Nutria, Muskrat, Vole, Shrew, Mole, Bat, FlyingSquirrel, Glider, Possum, Bandicoot, Wallaby, Tasmanian, Devil, Echidna, Platypus, Kookaburra, Cockatoo, Lorikeet, Budgie, Finch, Goldfinch, Cardinal, BlueBird, RedBird, YellowBird, GreenBird, BlackBird, WhiteBird, BrownBird, GrayBird, PinkBird, PurpleBird, OrangeBird, TealBird, IndigoBird, VioletBird, MagentaBird, CyanBird, LimeGreen, ForestGreen, OliveGreen, DarkGreen, SeaGreen, SpringGreen, LawnGreen, Chartreuse, YellowGreen, Khaki, Gold, Goldenrod, DarkGoldenrod, Orange as OrangeIcon, DarkOrange, OrangeRed, Red, DarkRed, Crimson, FireBrick, IndianRed, LightCoral, Salmon, DarkSalmon, LightSalmon, Pink, LightPink, HotPink, DeepPink, MediumVioletRed, PaleVioletRed, Coral, Tomato as TomatoIcon, RedOrange, DodgerBlue, RoyalBlue, Blue, MediumBlue, DarkBlue, Navy, MidnightBlue, CornflowerBlue, SteelBlue, LightSteelBlue, LightBlue, SkyBlue, LightSkyBlue, DeepSkyBlue, Turquoise, LightTurquoise, MediumTurquoise, DarkTurquoise, Aqua, Cyan, LightCyan, PaleTurquoise, Aquamarine, MediumAquamarine, MediumSeaGreen, LightSeaGreen, DarkSeaGreen, Teal, DarkCyan, Purple, Indigo, DarkMagenta, DarkViolet, DarkSlateBlue, BlueViolet, MediumPurple, MediumSlateBlue, SlateBlue, DarkOrchid, Violet, Plum, Thistle, Lavender, MediumOrchid, MediumVioletRed as MediumVioletRedIcon, Orchid, Magenta, Fuchsia, DarkMagenta as DarkMagentaIcon, Purple as PurpleIcon, Indigo as IndigoIcon, SlateBlue as SlateBlueIcon, DarkSlateBlue as DarkSlateBlueIcon, MediumSlateBlue as MediumSlateBlueIcon, MediumPurple as MediumPurpleIcon, BlueViolet as BlueVioletIcon, DarkViolet as DarkVioletIcon, DarkOrchid as DarkOrchidIcon, MediumOrchid as MediumOrchidIcon, Thistle as ThistleIcon, Plum as PlumIcon, Violet as VioletIcon, Orchid as OrchidIcon, Magenta as MagentaIcon, Fuchsia as FuchsiaIcon, DeepPink as DeepPinkIcon, HotPink as HotPinkIcon, LightPink as LightPinkIcon, Pink as PinkIcon, MistyRose, LavenderBlush, Linen, AntiqueWhite, PapayaWhip, BlanchedAlmond, Bisque, PeachPuff, NavajoWhite, Moccasin, Cornsilk, Ivory, LemonChiffon, Seashell, Honeydew, MintCream, Azure, AliceBlue, GhostWhite, WhiteSmoke, Gainsboro, FloralWhite, OldLace, Linen as LinenIcon, AntiqueWhite as AntiqueWhiteIcon, PapayaWhip as PapayaWhipIcon, BlanchedAlmond as BlanchedAlmondIcon, Bisque as BisqueIcon, PeachPuff as PeachPuffIcon, NavajoWhite as NavajoWhiteIcon, Moccasin as MoccasinIcon, Cornsilk as CornsilkIcon, Ivory as IvoryIcon, LemonChiffon as LemonChiffonIcon, Seashell as SeashellIcon, Honeydew as HoneydewIcon, MintCream as MintCreamIcon, Azure as AzureIcon, AliceBlue as AliceBlueIcon, GhostWhite as GhostWhiteIcon, WhiteSmoke as WhiteSmokeIcon, Gainsboro as GainsboroIcon, FloralWhite as FloralWhiteIcon, OldLace as OldLaceIcon, Snow as SnowIcon, White, Black, DarkSlateGray, DimGray, SlateGray, Gray, LightSlateGray, LightGray, Silver } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/store';
import { Confetti } from '@/components/ui/confetti';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addCredits, addXp } = useUserStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playWelcomeSound, setPlayWelcomeSound] = useState(false);
  const [quickActions, setQuickActions] = useState([
    { id: 'explore', label: 'Explorar Mapa', icon: <MapPin className="h-4 w-4" />, action: () => {} },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingCart className="h-4 w-4" />, action: () => router.push('/marketplace') },
    { id: 'community', label: 'Comunidade', icon: <Users className="h-4 w-4" />, action: () => router.push('/community') },
    { id: 'achievements', label: 'Conquistas', icon: <Trophy className="h-4 w-4" />, action: () => router.push('/achievements') }
  ]);
  const [dailyStats, setDailyStats] = useState({
    activeUsers: 1247,
    pixelsSold: 156,
    newArtworks: 89,
    totalValue: 45230
  });

  const [featuredPixels, setFeaturedPixels] = useState([
    { id: 1, x: 245, y: 156, region: 'Lisboa', price: 150, rarity: 'Épico', image: 'https://placehold.co/100x100/D4A757/FFFFFF?text=LX' },
    { id: 2, x: 123, y: 89, region: 'Porto', price: 120, rarity: 'Raro', image: 'https://placehold.co/100x100/7DF9FF/000000?text=PO' },
    { id: 3, x: 300, y: 200, region: 'Coimbra', price: 90, rarity: 'Incomum', image: 'https://placehold.co/100x100/9C27B0/FFFFFF?text=CB' }
  ]);

  const [liveEvents, setLiveEvents] = useState([
    { id: 1, title: 'Concurso de Arte Natalícia', participants: 234, prize: '2000€', endTime: '2h 30m' },
    { id: 2, title: 'Leilão de Pixels Raros', participants: 89, prize: 'Pixel Lendário', endTime: '45m' },
    { id: 3, title: 'Workshop: Técnicas Avançadas', participants: 156, prize: 'Certificado', endTime: '1h 15m' }
  ]);

  // Welcome animation for new users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('pixel-universe-welcome-seen');
    if (!hasSeenWelcome && !user) {
      setShowWelcome(true);
      setShowConfetti(true);
      setPlayWelcomeSound(true);
      localStorage.setItem('pixel-universe-welcome-seen', 'true');
    }
  }, [user]);

  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        pixelsSold: prev.pixelsSold + Math.floor(Math.random() * 3),
        newArtworks: prev.newArtworks + Math.floor(Math.random() * 2),
        totalValue: prev.totalValue + Math.floor(Math.random() * 100)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    addCredits(100);
    addXp(50);
  };

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      action.action();
      toast({
        title: "Ação Executada",
        description: `${action.label} selecionado`,
      });
    }
  };

  const handleJoinEvent = (eventId: number) => {
    toast({ title: "Evento Registado!", description: "Você foi registado no evento com sucesso." });
  };

  return (
    <>
      <SoundEffect src={SOUND_EFFECTS.SUCCESS} play={playWelcomeSound} onEnd={() => setPlayWelcomeSound(false)} />
      <Confetti active={showConfetti} duration={5000} onComplete={() => setShowConfetti(false)} />
      
      <SidebarProvider>
        <div className="relative h-[calc(100vh-var(--header-height)-var(--bottom-nav-height))] w-full flex">
          <MapSidebar />
          <div className="flex-1 h-full relative">
            {/* Main Pixel Grid */}
            <PixelGrid />
            
            {/* Live Stats Overlay */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
              <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl">
                <CardContent className="p-3">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="font-bold">{dailyStats.activeUsers}</span>
                      <span className="text-muted-foreground">online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-bold">{dailyStats.pixelsSold}</span>
                      <span className="text-muted-foreground">vendidos hoje</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span className="font-bold">€{dailyStats.totalValue.toLocaleString()}</span>
                      <span className="text-muted-foreground">volume</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions Floating Panel */}
            <div className="absolute top-20 right-4 z-30">
              <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl">
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-3 text-primary">Ações Rápidas</h3>
                  <div className="space-y-2">
                    {quickActions.map(action => (
                      <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleQuickAction(action.id)}
                      >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Pixels Panel */}
            <div className="absolute bottom-4 left-4 z-30">
              <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl w-80">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-primary">Pixels em Destaque</h3>
                    <Link href="/marketplace">
                      <Button variant="ghost" size="sm">
                        Ver Todos
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {featuredPixels.map(pixel => (
                      <div key={pixel.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                        <img src={pixel.image} alt={`Pixel ${pixel.x},${pixel.y}`} className="w-12 h-12 rounded border" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">({pixel.x}, {pixel.y})</span>
                            <Badge variant="outline" className="text-xs">{pixel.rarity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{pixel.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">€{pixel.price}</p>
                          <Button size="sm" className="text-xs">Comprar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Events Panel */}
            <div className="absolute bottom-4 right-4 z-30">
              <Card className="bg-card/90 backdrop-blur-xl border-red-500/30 shadow-2xl w-80">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <h3 className="font-semibold text-red-500">Eventos ao Vivo</h3>
                  </div>
                  <div className="space-y-3">
                    {liveEvents.map(event => (
                      <div key={event.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                        <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                          <span>{event.participants} participantes</span>
                          <span>Termina em {event.endTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary">Prémio: {event.prize}</span>
                          <Button size="sm" onClick={() => handleJoinEvent(event.id)}>Participar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Welcome Modal for New Users */}
            <AnimatePresence>
              {showWelcome && !user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="max-w-2xl w-full"
                  >
                    <Card className="bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 shadow-2xl">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-10 w-10 text-white" />
                          </div>
                          <h1 className="text-3xl font-headline font-bold text-gradient-gold mb-4">
                            Bem-vindo ao Pixel Universe! 🎨
                          </h1>
                          <p className="text-lg text-muted-foreground mb-6">
                            O primeiro mapa colaborativo de Portugal onde cada pixel conta uma história única.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Explore</h3>
                            <p className="text-sm text-muted-foreground">Descubra pixels únicos por todo Portugal</p>
                          </div>
                          <div className="p-4 bg-accent/10 rounded-lg">
                            <Crown className="h-8 w-8 text-accent mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Crie</h3>
                            <p className="text-sm text-muted-foreground">Transforme pixels em obras de arte</p>
                          </div>
                          <div className="p-4 bg-green-500/10 rounded-lg">
                            <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Ganhe</h3>
                            <p className="text-sm text-muted-foreground">Monetize sua criatividade</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <AuthModal defaultTab="register">
                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                              <UserPlus className="h-5 w-5 mr-2" />
                              Começar Gratuitamente
                            </Button>
                          </AuthModal>
                          <AuthModal defaultTab="login">
                            <Button variant="outline" size="lg">
                              <LogIn className="h-5 w-5 mr-2" />
                              Já Tenho Conta
                            </Button>
                          </AuthModal>
                          <Button variant="ghost" size="lg" onClick={handleWelcomeComplete}>
                            Explorar Sem Conta
                          </Button>
                        </div>
                        
                        <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
                          <Gift className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-green-500 font-medium">
                            🎁 Bónus de Boas-vindas: 100 Créditos + 50 XP ao registar-se!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <PerformanceMonitor />
        </div>
      </SidebarProvider>
    </>
  );
}
