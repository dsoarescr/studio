'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import {
  Settings,
  Paintbrush,
  Eye,
  Bell,
  User,
  Shield,
  Zap,
  Globe,
  HelpCircle,
  Coins,
  Gift,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const settingsNav = [
  { href: '/settings', label: 'Geral', icon: Settings, exact: true },
  { href: '/settings/account', label: 'Conta', icon: User },
  { href: '/settings/security', label: 'Segurança', icon: Shield },
  { href: '/settings/appearance', label: 'Aparência', icon: Paintbrush },
  { href: '/settings/notifications', label: 'Notificações', icon: Bell },
  { href: '/settings/language', label: 'Idioma', icon: Globe },
  { href: '/settings/accessibility', label: 'Acessibilidade', icon: Eye },
  { href: '/settings/performance', label: 'Desempenho', icon: Zap },
  { href: '/settings/help', label: 'Ajuda', icon: HelpCircle },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { logOut } = useAuth();
  const { credits, specialCredits } = useUserStore();

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: 'Sessão Terminada',
        description: 'Esperamos vê-lo em breve!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível terminar a sessão.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto mb-16 max-w-6xl space-y-6 px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="flex flex-col space-y-1">
                {settingsNav.map(item => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link href={item.href} key={item.href}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">Créditos</span>
                  </div>
                  <span className="font-medium text-primary">{credits.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="mr-2 h-4 w-4 text-accent" />
                    <span className="text-sm">Especiais</span>
                  </div>
                  <span className="font-medium text-accent">{specialCredits.toLocaleString()}</span>
                </div>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Terminar Sessão
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
