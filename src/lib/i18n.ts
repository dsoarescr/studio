// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de tradução
const resources = {
  'pt-PT': {
    translation: {
      // Navegação
      nav: {
        home: 'Início',
        marketplace: 'Marketplace',
        gallery: 'Galeria',
        profile: 'Perfil',
        ranking: 'Ranking',
        community: 'Comunidade',
        settings: 'Definições',
        achievements: 'Conquistas',
        premium: 'Premium',
        help: 'Ajuda'
      },
      
      // Mapa
      map: {
        loading: 'A carregar mapa...',
        zoom_in: 'Ampliar',
        zoom_out: 'Reduzir',
        reset_view: 'Resetar vista',
        coordinates: 'Coordenadas',
        region: 'Região',
        pixel_available: 'Pixel disponível',
        pixel_owned: 'Pixel possuído'
      },
      
      // Pixels
      pixels: {
        purchase: 'Comprar',
        price: 'Preço',
        owner: 'Proprietário',
        rarity: 'Raridade',
        views: 'Visualizações',
        likes: 'Curtidas',
        description: 'Descrição',
        tags: 'Tags',
        created_at: 'Criado em',
        updated_at: 'Atualizado em'
      },
      
      // Utilizador
      user: {
        level: 'Nível',
        xp: 'Experiência',
        credits: 'Créditos',
        special_credits: 'Créditos Especiais',
        pixels_owned: 'Pixels Possuídos',
        achievements: 'Conquistas',
        profile: 'Perfil',
        settings: 'Definições',
        logout: 'Terminar Sessão'
      },
      
      // Autenticação
      auth: {
        login: 'Iniciar Sessão',
        register: 'Registar',
        logout: 'Terminar Sessão',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirmar Password',
        username: 'Nome de Utilizador',
        forgot_password: 'Esqueceu a password?',
        reset_password: 'Redefinir Password',
        login_success: 'Login bem-sucedido',
        register_success: 'Registo bem-sucedido',
        logout_success: 'Sessão terminada'
      },
      
      // Conquistas
      achievements: {
        title: 'Conquistas',
        unlocked: 'Desbloqueadas',
        locked: 'Bloqueadas',
        progress: 'Progresso',
        reward: 'Recompensa',
        claim: 'Reclamar',
        claimed: 'Reclamado',
        xp_reward: 'XP',
        credits_reward: 'Créditos'
      },
      
      // Marketplace
      marketplace: {
        title: 'Marketplace',
        buy_now: 'Comprar Agora',
        place_bid: 'Licitar',
        auction_ends: 'Leilão termina em',
        highest_bid: 'Lance mais alto',
        seller: 'Vendedor',
        category: 'Categoria',
        filter: 'Filtrar',
        sort: 'Ordenar'
      },
      
      // Comunidade
      community: {
        title: 'Comunidade',
        post: 'Publicar',
        comment: 'Comentar',
        like: 'Curtir',
        share: 'Partilhar',
        follow: 'Seguir',
        unfollow: 'Deixar de seguir',
        followers: 'Seguidores',
        following: 'Seguindo'
      },
      
      // Notificações
      notifications: {
        title: 'Notificações',
        new: 'nova',
        all: 'Todas',
        unread: 'Não lidas',
        important: 'Importantes',
        mark_all_read: 'Marcar todas como lidas',
        empty: {
          all: 'Não tem notificações',
          unread: 'Não tem notificações não lidas',
          important: 'Não tem notificações importantes'
        }
      },
      
      // Estatísticas
      stats: {
        title: 'Estatísticas',
        realtime: 'Tempo real',
        users_online: 'Utilizadores online',
        pixels_sold: 'Pixels vendidos',
        pixels_available: 'Pixels disponíveis',
        total_value: 'Valor total',
        growth: 'Crescimento'
      },
      
      // Atividade
      activity: {
        global: 'Atividade Global',
        recent: 'Atividade Recente',
        login: 'iniciou sessão',
        logout: 'terminou sessão',
        purchase: 'comprou um pixel',
        color_change: 'alterou cor',
        achievement: 'desbloqueou conquista'
      },
      
      // Formulários
      forms: {
        save: 'Guardar',
        cancel: 'Cancelar',
        submit: 'Enviar',
        reset: 'Resetar',
        clear: 'Limpar',
        edit: 'Editar',
        delete: 'Eliminar',
        confirm: 'Confirmar',
        back: 'Voltar',
        next: 'Seguinte',
        finish: 'Concluir'
      },
      
      // Mensagens
      messages: {
        success: 'Operação realizada com sucesso',
        error: 'Ocorreu um erro',
        loading: 'A carregar...',
        saving: 'A guardar...',
        processing: 'A processar...',
        confirm_delete: 'Tem a certeza que quer eliminar?',
        unsaved_changes: 'Tem alterações não guardadas'
      },
      
      // Premium
      premium: {
        title: 'Premium',
        upgrade: 'Fazer Upgrade',
        features: 'Funcionalidades',
        pricing: 'Preços',
        subscribe: 'Subscrever',
        cancel: 'Cancelar Subscrição',
        benefits: 'Benefícios',
        exclusive: 'Exclusivo'
      }
    }
  },
  
  'en-US': {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        marketplace: 'Marketplace',
        gallery: 'Gallery',
        profile: 'Profile',
        ranking: 'Ranking',
        community: 'Community',
        settings: 'Settings',
        achievements: 'Achievements',
        premium: 'Premium',
        help: 'Help'
      },
      
      // Map
      map: {
        loading: 'Loading map...',
        zoom_in: 'Zoom In',
        zoom_out: 'Zoom Out',
        reset_view: 'Reset View',
        coordinates: 'Coordinates',
        region: 'Region',
        pixel_available: 'Available pixel',
        pixel_owned: 'Owned pixel'
      },
      
      // Pixels
      pixels: {
        purchase: 'Purchase',
        price: 'Price',
        owner: 'Owner',
        rarity: 'Rarity',
        views: 'Views',
        likes: 'Likes',
        description: 'Description',
        tags: 'Tags',
        created_at: 'Created at',
        updated_at: 'Updated at'
      },
      
      // User
      user: {
        level: 'Level',
        xp: 'Experience',
        credits: 'Credits',
        special_credits: 'Special Credits',
        pixels_owned: 'Pixels Owned',
        achievements: 'Achievements',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout'
      },
      
      // Authentication
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        username: 'Username',
        forgot_password: 'Forgot password?',
        reset_password: 'Reset Password',
        login_success: 'Login successful',
        register_success: 'Registration successful',
        logout_success: 'Logged out successfully'
      },
      
      // Achievements
      achievements: {
        title: 'Achievements',
        unlocked: 'Unlocked',
        locked: 'Locked',
        progress: 'Progress',
        reward: 'Reward',
        claim: 'Claim',
        claimed: 'Claimed',
        xp_reward: 'XP',
        credits_reward: 'Credits'
      },
      
      // Marketplace
      marketplace: {
        title: 'Marketplace',
        buy_now: 'Buy Now',
        place_bid: 'Place Bid',
        auction_ends: 'Auction ends in',
        highest_bid: 'Highest bid',
        seller: 'Seller',
        category: 'Category',
        filter: 'Filter',
        sort: 'Sort'
      },
      
      // Community
      community: {
        title: 'Community',
        post: 'Post',
        comment: 'Comment',
        like: 'Like',
        share: 'Share',
        follow: 'Follow',
        unfollow: 'Unfollow',
        followers: 'Followers',
        following: 'Following'
      },
      
      // Notifications
      notifications: {
        title: 'Notifications',
        new: 'new',
        all: 'All',
        unread: 'Unread',
        important: 'Important',
        mark_all_read: 'Mark all as read',
        empty: {
          all: 'No notifications',
          unread: 'No unread notifications',
          important: 'No important notifications'
        }
      },
      
      // Statistics
      stats: {
        title: 'Statistics',
        realtime: 'Real-time',
        users_online: 'Users online',
        pixels_sold: 'Pixels sold',
        pixels_available: 'Pixels available',
        total_value: 'Total value',
        growth: 'Growth'
      },
      
      // Activity
      activity: {
        global: 'Global Activity',
        recent: 'Recent Activity',
        login: 'logged in',
        logout: 'logged out',
        purchase: 'purchased a pixel',
        color_change: 'changed color',
        achievement: 'unlocked achievement'
      },
      
      // Forms
      forms: {
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        reset: 'Reset',
        clear: 'Clear',
        edit: 'Edit',
        delete: 'Delete',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        finish: 'Finish'
      },
      
      // Messages
      messages: {
        success: 'Operation completed successfully',
        error: 'An error occurred',
        loading: 'Loading...',
        saving: 'Saving...',
        processing: 'Processing...',
        confirm_delete: 'Are you sure you want to delete?',
        unsaved_changes: 'You have unsaved changes'
      },
      
      // Premium
      premium: {
        title: 'Premium',
        upgrade: 'Upgrade',
        features: 'Features',
        pricing: 'Pricing',
        subscribe: 'Subscribe',
        cancel: 'Cancel Subscription',
        benefits: 'Benefits',
        exclusive: 'Exclusive'
      }
    }
  },
  
  'es-ES': {
    translation: {
      // Navegación
      nav: {
        home: 'Inicio',
        marketplace: 'Mercado',
        gallery: 'Galería',
        profile: 'Perfil',
        ranking: 'Clasificación',
        community: 'Comunidad',
        settings: 'Configuración',
        achievements: 'Logros',
        premium: 'Premium',
        help: 'Ayuda'
      },
      
      // Mapa
      map: {
        loading: 'Cargando mapa...',
        zoom_in: 'Acercar',
        zoom_out: 'Alejar',
        reset_view: 'Restablecer vista',
        coordinates: 'Coordenadas',
        region: 'Región',
        pixel_available: 'Pixel disponible',
        pixel_owned: 'Pixel poseído'
      },
      
      // Resto das traduções em espanhol...
      // (Implementação completa seria muito extensa para este exemplo)
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-PT', // idioma padrão
    fallbackLng: 'pt-PT',
    
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
    
    // Configurações avançadas
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pixel-universe-locale',
    },
    
    // Namespace para organização
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Debug apenas em desenvolvimento
    debug: process.env.NODE_ENV === 'development',
    
    // Configurações de carregamento
    load: 'languageOnly',
    preload: ['pt-PT'],
    
    // Configurações de pluralização
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Configurações de interpolação
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'EUR'
          }).format(value);
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }
        return value;
      }
    },
    
    // Configurações de reatividade
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    }
  });

export default i18n;

// Hook personalizado para tradução com tipagem
export const useTranslation = () => {
  const { t, i18n } = require('react-i18next').useTranslation();
  
  return {
    t: t as (key: string, options?: any) => string,
    i18n,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
    language: i18n.language,
    languages: i18n.languages,
  };
};

// Função para carregar traduções dinamicamente
export const loadNamespace = async (namespace: string, language: string) => {
  try {
    const translations = await import(`../locales/${language}/${namespace}.json`);
    i18n.addResourceBundle(language, namespace, translations.default, true, true);
  } catch (error) {
    console.warn(`Failed to load ${namespace} for ${language}:`, error);
  }
};

// Função para detectar idioma do browser
export const detectBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'pt-PT';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // Mapear códigos de idioma para os nossos suportados
  if (browserLang.startsWith('pt')) return 'pt-PT';
  if (browserLang.startsWith('en')) return 'en-US';
  if (browserLang.startsWith('es')) return 'es-ES';
  
  return 'pt-PT'; // fallback
};

// Função para formatar números com localização
export const formatLocalizedNumber = (
  number: number, 
  locale: string = 'pt-PT',
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat(locale, options).format(number);
};

// Função para formatar datas com localização
export const formatLocalizedDate = (
  date: Date | string,
  locale: string = 'pt-PT',
  options?: Intl.DateTimeFormatOptions
) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

// Função para formatar moeda
export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'pt-PT'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};