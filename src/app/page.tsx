
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
import { useToast } from '@/hooks/use-toast';
import { UserProfileHeader } from '@/components/layout/UserProfileHeader';
import { BottomNavBar } from '@/components/layout/BottomNavBar';

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleActionSelect = (action: any) => {
    if (action) {
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
    
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader />
      <main className="flex-1 flex overflow-hidden pt-[var(--header-height)] pb-[var(--bottom-nav-height)]">
        <SidebarProvider>
          <div className="relative h-full w-full flex">
            <MapSidebar />
            <div className="flex-1 h-full relative">
              <PixelGrid />
              
              {/* Welcome overlay for non-authenticated users */}
              {!user && (
                <div className="absolute bottom-24 right-6 z-30 max-w-sm">
                  <div className="bg-card/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-primary/30 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-2 text-primary">Bem-vindo ao Pixel Universe!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore o mapa livremente. Para comprar pixels e desbloquear todas as funcionalidades, crie uma conta ou inicie sessão.
                    </p>
                    <div className="flex gap-2">
                      <AuthModal defaultTab="login">
                        <Button variant="outline" size="sm" className="flex-1">
                          <LogIn className="h-4 w-4 mr-2" />
                          Entrar
                        </Button>
                      </AuthModal>
                      <AuthModal defaultTab="register">
                        <Button size="sm" className="flex-1">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Registar
                        </Button>
                      </AuthModal>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <PerformanceMonitor />
          </div>
        </SidebarProvider>
      </main>
      <BottomNavBar />
    </div>
  );
}
