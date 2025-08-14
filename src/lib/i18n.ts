import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      welcome: 'Bem-vindo ao Pixel Universe',
      explore: 'Explorar',
      // Add more translations as needed
    }
  },
  en: {
    translation: {
      welcome: 'Welcome to Pixel Universe',
      explore: 'Explore',
      // Add more translations as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;