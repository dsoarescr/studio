'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  effects: {
    blur: string;
    glow: string;
    shadow: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Padrão',
    description: 'Tema padrão com cores suaves e modernas',
    colors: {
      primary: '#D4A757',
      secondary: '#7DF9FF',
      accent: '#FF7F50',
      background: '#1A1A1A',
      foreground: '#FFFFFF',
      muted: '#666666',
      border: '#333333',
    },
    effects: {
      blur: '8px',
      glow: '0 0 20px',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    animations: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  {
    id: 'retro',
    name: 'Retrô',
    description: 'Visual inspirado em jogos clássicos de 8-bits',
    colors: {
      primary: '#FF4136',
      secondary: '#39CCCC',
      accent: '#FFDC00',
      background: '#111111',
      foreground: '#DDDDDD',
      muted: '#555555',
      border: '#222222',
    },
    effects: {
      blur: '0px',
      glow: '0 0 10px',
      shadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
    },
    animations: {
      duration: 100,
      easing: 'steps(4)',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Cores vibrantes com efeitos de brilho intenso',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FF3366',
      background: '#000000',
      foreground: '#FFFFFF',
      muted: '#444444',
      border: '#333333',
    },
    effects: {
      blur: '12px',
      glow: '0 0 30px',
      shadow: '0 0 20px rgba(255, 0, 255, 0.5)',
    },
    animations: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Design limpo e minimalista',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      background: '#FFFFFF',
      foreground: '#000000',
      muted: '#999999',
      border: '#EEEEEE',
    },
    effects: {
      blur: '4px',
      glow: 'none',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    animations: {
      duration: 200,
      easing: 'ease-in-out',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0],
  setTheme: () => {},
  themes: themes,
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    setCurrentTheme(theme);

    // Atualizar variáveis CSS
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    Object.entries(theme.effects).forEach(([key, value]) => {
      root.style.setProperty(`--effect-${key}`, value);
    });
    root.style.setProperty('--animation-duration', `${theme.animations.duration}ms`);
    root.style.setProperty('--animation-easing', theme.animations.easing);
  };

  useEffect(() => {
    // Carregar tema salvo ou usar padrão
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: currentTheme.animations.duration / 1000,
          ease: (currentTheme as any).animations?.easing as any,
        }}
      >
        {children}
      </motion.div>
    </ThemeContext.Provider>
  );
}

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        {themes.map(theme => (
          <motion.button
            key={theme.id}
            className={`rounded-lg border-2 p-4 transition-colors ${
              currentTheme.id === theme.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setTheme(theme.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-left">
              <h3 className="font-semibold">{theme.name}</h3>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </div>
            <div className="mt-4 flex gap-2">
              {Object.values(theme.colors)
                .slice(0, 4)
                .map((color, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
