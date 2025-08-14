'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Crown, Star, Zap, Shield, Gift } from 'lucide-react';

export default function PremiumSubscription() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <Card className="shadow-2xl bg-gradient-to-br from-card via-card/95 to-amber-500/10 border-amber-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-gradient-gold flex items-center justify-center">
            <Crown className="h-8 w-8 mr-3" />
            Pixel Universe Premium
          </CardTitle>
          <p className="text-muted-foreground">
            Desbloqueie funcionalidades exclusivas e acelere sua jornada
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: 'Básico',
            price: '€4.99',
            period: '/mês',
            features: ['100 créditos mensais', 'Suporte básico', 'Sem anúncios'],
            color: 'from-blue-500 to-cyan-500'
          },
          {
            name: 'Premium',
            price: '€9.99',
            period: '/mês',
            features: ['500 créditos mensais', 'Pixels exclusivos', 'Suporte prioritário', 'Badge Premium'],
            color: 'from-primary to-accent',
            popular: true
          },
          {
            name: 'Ultimate',
            price: '€19.99',
            period: '/mês',
            features: ['1000 créditos mensais', 'Acesso beta', 'Consultoria 1:1', 'NFTs exclusivos'],
            color: 'from-purple-500 to-pink-500'
          }
        ].map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'border-primary scale-105' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                Mais Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {plan.price}<span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                Escolher Plano
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}