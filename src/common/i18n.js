import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(XHR).use(LanguageDetector).init({
  fallbackLng: {
    default: ['en'],
  },
  debug: process.env.NODE_ENV !== 'production',
  ns: ['common', 'sandbox'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    wait: false, // set to true if you like to wait for loaded in every translated hoc
    nsMode: 'default', // set it to fallback to let passed namespaces to translated hoc act as fallbacks
  },
});

export default i18n;
