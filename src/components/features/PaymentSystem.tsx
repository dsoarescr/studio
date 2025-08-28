'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard, DollarSign, Gift, Clock,
  Shield, CheckCircle, AlertCircle, Lock,
  Wallet, Receipt, History, Settings,
  CreditCard as CreditCardIcon, Plus
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  type: 'payment' | 'subscription' | 'refund';
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  date: string;
  description: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
  features: string[];
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    type: 'subscription',
    amount: 1000,
    currency: 'eur',
    status: 'succeeded',
    date: '2024-03-20T14:30:00Z',
    description: 'Assinatura Premium - Mensal'
  }
];

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Básico',
    description: 'Para usuários iniciantes',
    price: {
      amount: 1000,
      currency: 'eur',
      interval: 'month'
    },
    features: [
      'Acesso a recursos básicos',
      'Suporte por email',
      '100 créditos mensais'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    description: 'Para usuários avançados',
    price: {
      amount: 2500,
      currency: 'eur',
      interval: 'month'
    },
    features: [
      'Todos os recursos básicos',
      'Suporte prioritário',
      '500 créditos mensais',
      'Recursos premium'
    ]
  }
];

export function PaymentSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const { toast } = useToast();

  const handleAddCard = () => {
    // Integração com Stripe Elements aqui
    toast({
      title: "Cartão Adicionado",
      description: "Seu cartão foi adicionado com sucesso!",
    });
    setIsAddingCard(false);
  };

  const handleMakeDefault = (methodId: string) => {
    toast({
      title: "Método Padrão Atualizado",
      description: "Seu método de pagamento padrão foi atualizado.",
    });
  };

  const handleDeleteMethod = (methodId: string) => {
    toast({
      title: "Método Removido",
      description: "Seu método de pagamento foi removido.",
    });
  };

  const handleSubscribe = (planId: string) => {
    toast({
      title: "Assinatura Iniciada",
      description: "Sua assinatura foi iniciada com sucesso!",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                Sistema de Pagamentos
              </CardTitle>
              <CardDescription>
                Gerencie seus métodos de pagamento e assinaturas
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartão
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Métodos de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPaymentMethods.map((method) => (
                <Card key={method.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {method.type === 'card' && (
                          <div className="p-2 rounded-full bg-primary/10">
                            <CreditCardIcon className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {method.brand?.toUpperCase()} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expira em {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Padrão</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMakeDefault(method.id)}
                        >
                          Tornar Padrão
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMethod(method.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {isAddingCard && (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Número do Cartão
                      </label>
                      <Input placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Data de Expiração
                        </label>
                        <Input placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Código de Segurança
                        </label>
                        <Input placeholder="CVC" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingCard(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddCard}>
                        Adicionar Cartão
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Histórico de Transações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-full",
                            transaction.status === 'succeeded' ? "bg-green-500/10" : "bg-red-500/10"
                          )}>
                            {transaction.status === 'succeeded' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString('pt-PT')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(transaction.amount / 100).toFixed(2)} €
                          </p>
                          <Badge
                            variant={transaction.status === 'succeeded' ? 'default' : 'destructive'}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Planos de Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Planos de Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className="relative overflow-hidden">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold">
                          {(plan.price.amount / 100).toFixed(2)} €
                        </span>
                        <span className="text-muted-foreground">
                          /{plan.price.interval}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        Assinar Agora
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Notificações de Pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas sobre cobranças e renovações
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Renovação Automática</p>
                  <p className="text-sm text-muted-foreground">
                    Renovar automaticamente sua assinatura
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Recibos por Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receba recibos detalhados por email
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Baixar Faturas
          </Button>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
