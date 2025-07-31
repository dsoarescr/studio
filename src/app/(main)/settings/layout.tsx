
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/store";
import { useAuth } from '@/lib/auth-context';
import { 
  Settings, Paintbrush, Eye, Bell, User, Shield, Zap, Globe, HelpCircle, Coins, Gift, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils';
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
  const { logOut } = useAuth();
  const { credits, specialCredits } = useUserStore();

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: "Sessão Terminada",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Erro ao Sair",
        description: "Ocorreu um problema ao terminar a sessão.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              {sidebarNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link href={item.href} key={item.href} passHref>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        <item.icon className={cn("h-4 w-4 mr-3", item.color)} />
                        <span>{item.label}</span>
                      </Button>
                  </Link>
                )
              })}
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
  );
}
