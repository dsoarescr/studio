'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface I18nContextType {
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  'pt-PT': {
    'welcome': 'Bem-vindo',
    'loading': 'A carregar...',
    'error': 'Erro',
    'success': 'Sucesso',
  },
  'en-US': {
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('pt-PT');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['pt-PT']] || key;
  };

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}