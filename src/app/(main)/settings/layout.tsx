'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/store";
import { 
  Settings, Paintbrush, Eye, Bell, User, Shield, Zap, Globe, HelpCircle, Coins, Gift, LogOut
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const sidebarNavItems = [
  { href: "/settings/appearance", label: "Aparência", icon: Paintbrush, color: "text-blue-500" },
  { href: "/settings/accessibility", label: "Acessibilidade", icon: Eye, color: "text-green-500" },
  { href: "/settings/notifications", label: "Notificações", icon: Bell, color: "text-red-500" },
  { href: "/settings/account", label: "Conta", icon: User, color: "" },
  { href: "/settings/security", label: "Segurança", icon: Shield, color: "text-purple-500" },
  { href: "/settings/performance", label: "Desempenho", icon: Zap, color: "text-yellow-500" },
  { href: "/settings/language", label: "Idioma", icon: Globe, color: "text-cyan-500" },
  { href: "/settings/help", label: "Ajuda", icon: HelpCircle, color: "text-orange-500" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { credits, specialCredits } = useUserStore();

  const handleLogout = () => {
    toast({
      title: "Sessão Terminada",
      description: "Você foi desconectado com sucesso.",
    });
    // Add actual logout logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto py-6 px-4 mb-16 space-y-6 max-w-6xl">
        {/* Header */}
        <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-shimmer" 
               style={{ backgroundSize: '200% 200%' }} />
          <CardHeader className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl text-gradient-gold flex items-center">
                  <Settings className="h-8 w-8 mr-3 animate-glow" />
                  Definições
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Personalize a sua experiência no Pixel Universe
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-4">
              <nav className="flex flex-col space-y-1">
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    className="w-full justify-start text-left"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4 mr-3", pathname.startsWith(item.href) ? item.color : "")} />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Créditos</span>
                  </div>
                  <span className="font-medium text-primary">{credits.toLocaleString('pt-PT')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2 text-accent" />
                    <span className="text-sm">Especiais</span>
                  </div>
                  <span className="font-medium text-accent">{specialCredits.toLocaleString('pt-PT')}</span>
                </div>
                
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Terminar Sessão
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
