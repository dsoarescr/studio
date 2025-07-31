'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brush, Eye, User, Shield } from "lucide-react";
import Link from 'next/link';

const overviewCards = [
  {
    title: "Aparência",
    description: "Personalize temas, cores e efeitos visuais.",
    icon: <Brush className="h-6 w-6 text-blue-500" />,
    href: "/settings/appearance"
  },
  {
    title: "Acessibilidade",
    description: "Ajuste o tamanho do texto, contraste e outras opções.",
    icon: <Eye className="h-6 w-6 text-green-500" />,
    href: "/settings/accessibility"
  },
  {
    title: "Conta",
    description: "Gerencie seu email, nome de utilizador e subscrição.",
    icon: <User className="h-6 w-6" />,
    href: "/settings/account"
  },
  {
    title: "Segurança",
    description: "Altere sua password e configure a autenticação de dois fatores.",
    icon: <Shield className="h-6 w-6 text-purple-500" />,
    href: "/settings/security"
  },
];

export default function SettingsOverviewPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral das Definições</CardTitle>
        <CardDescription>
          Navegue pelas diferentes secções para configurar a sua experiência.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overviewCards.map((card) => (
            <Link href={card.href} key={card.title} passHref>
              <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <div className="p-2 bg-muted rounded-full">
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
                <CardContent className="p-4 pt-0">
                   <Button variant="ghost" size="sm" className="text-primary">
                    Ir para {card.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}