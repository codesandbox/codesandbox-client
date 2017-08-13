import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// List of i18next namespaces
export const nsList = [
  'common',
  'editor',
  'header',
  'patron',
  'profile',
  'terms',
];
export const languageList = [
  { code: 'en', text: 'English' },
  { code: 'zh', text: '中文' },
];

i18n.use(XHR).use(LanguageDetector).init({
  fallbackLng: {
    default: ['en'],
  },
  debug: process.env.NODE_ENV !== 'production',
  load: 'languageOnly',
  ns: ['common', 'editor'],
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
