'use client';

import React, { createContext, useContext } from 'react';

interface StripeContextType {
  // Mock Stripe context
  isLoading: boolean;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StripeContext.Provider value={{ isLoading: false }}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within StripeProvider');
  }
  return context;
}