
'use client';

import React, { createContext, useContext, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface StripeContextType {
  isLoading: boolean;
  createPaymentIntent: (amount: number, currency: string, metadata?: Record<string, string>) => Promise<{ clientSecret: string }>;
  createSubscription: (priceId: string) => Promise<{ subscriptionId: string; clientSecret: string } | null>;
  confirmPayment: (paymentIntentId: string, paymentMethodId: string) => Promise<boolean>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripePayment = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripePayment must be used within a StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: React.ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createPaymentIntent = async (amount: number, currency: string = 'eur', metadata?: Record<string, string>) => {
    if (!user) {
      throw new Error('User must be logged in to create a payment intent');
    }
    
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key is not configured');
    }
    
    const token = await user.getIdToken();

    setIsLoading(true);
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata: {
            ...metadata,
            userId: user.uid,
            userEmail: user.email || '',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao processar o pagamento.';
      toast({
        title: 'Erro no Pagamento',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (priceId: string) => {
    if (!user) {
      throw new Error('User must be logged in to create a subscription');
    }
    
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key is not configured');
    }
    
    const token = await user.getIdToken();
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          priceId,
          metadata: {
            userId: user.uid,
            userEmail: user.email || '',
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao criar a subscrição.';
      toast({
        title: 'Erro na Subscrição',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string, paymentMethodId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be logged in to confirm payment');
    }
    
    const token = await user.getIdToken();
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm payment');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Pagamento Confirmado',
          description: 'O seu pagamento foi processado com sucesso!',
        });
        return true;
      } else {
        throw new Error(data.error || 'Payment confirmation failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao confirmar o pagamento.';
      toast({
        title: 'Erro na Confirmação',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be logged in to cancel subscription');
    }
    
    const token = await user.getIdToken();
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Subscrição Cancelada',
          description: 'A sua subscrição foi cancelada com sucesso.',
        });
        return true;
      } else {
        throw new Error(data.error || 'Subscription cancellation failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao cancelar a subscrição.';
      toast({
        title: 'Erro no Cancelamento',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const options: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <StripeContext.Provider
      value={{
        isLoading,
        createPaymentIntent,
        createSubscription,
        confirmPayment,
        cancelSubscription,
      }}
    >
      <Elements stripe={stripePromise} options={options}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
}

interface StripePaymentElementsProps {
  clientSecret: string;
  children: React.ReactNode;
}

export function StripePaymentElements({ clientSecret, children }: StripePaymentElementsProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#D4A757',
        colorBackground: '#1c1c1c',
        colorText: '#ffffff',
        colorDanger: '#ff4444',
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

