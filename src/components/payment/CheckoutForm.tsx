'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements, AddressElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { Confetti } from '@/components/ui/confetti';
import {
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Lock,
  Loader2,
} from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  metadata?: Record<string, string>;
}

export default function CheckoutForm({
  amount,
  currency = 'EUR',
  description,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
        payment_method_data: {
          billing_details: {
            name: 'Pixel Universe User',
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'Ocorreu um erro ao processar o pagamento.');
      toast({
        title: 'Erro no Pagamento',
        description: error.message || 'Ocorreu um erro ao processar o pagamento.',
        variant: 'destructive',
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsPaymentSuccessful(true);
      setShowConfetti(true);
      setPlaySuccessSound(true);
      toast({
        title: 'Pagamento Bem-Sucedido',
        description: 'O seu pagamento foi processado com sucesso!',
      });
      onSuccess?.();
    } else {
      setMessage('Ocorreu um erro inesperado.');
    }

    setIsLoading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-md border-primary/30 bg-card/95 backdrop-blur-sm">
      <SoundEffect
        src={SOUND_EFFECTS.SUCCESS}
        play={playSuccessSound}
        onEnd={() => setPlaySuccessSound(false)}
      />
      <Confetti active={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />

      <CardHeader className="space-y-1 border-b border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardTitle className="flex items-center font-headline text-xl">
          <CreditCard className="mr-2 h-5 w-5 text-primary" />
          Finalizar Pagamento
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Badge variant="outline" className="font-mono">
            {(amount / 100).toFixed(2)} {currency}
          </Badge>
        </div>
      </CardHeader>

      {isPaymentSuccessful ? (
        <CardContent className="pt-6 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-xl font-semibold">Pagamento Concluído</h3>
          <p className="mb-4 text-muted-foreground">
            O seu pagamento foi processado com sucesso. Obrigado pela sua compra!
          </p>
          <Button onClick={onSuccess} className="w-full">
            Continuar
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <PaymentElement />
              <Separator />
              <AddressElement options={{ mode: 'shipping' }} />
            </div>

            {message && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{message}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Pagamento seguro processado pela Stripe</span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-primary/20 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !stripe || !elements}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A processar...
                </>
              ) : (
                <>
                  Pagar {(amount / 100).toFixed(2)} {currency}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
