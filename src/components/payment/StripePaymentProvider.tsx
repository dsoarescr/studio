'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.warn("Stripe public key not found, payment features will be disabled.");
    return <>{children}</>;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
}
