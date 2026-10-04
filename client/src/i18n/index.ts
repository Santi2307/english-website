import i18n, { type BackendModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './es';

/**
 * El español va en el bundle principal (es el público objetivo); el inglés se
 * descarga como chunk aparte solo si el visitante lo usa.
 */
const lazyEnglish: BackendModule = {
  type: 'backend',
  init: () => undefined,
  read: (lng, _ns, callback) => {
    if (lng.startsWith('en')) {
      import('./en').then((m) => callback(null, m.default)).catch((e) => callback(e, null));
    } else callback(null, es);
  },
};

i18n
  .use(lazyEnglish)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es: { translation: es } },
    partialBundledLanguages: true,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'], lookupLocalStorage: 'ea_lang' },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.startsWith('en') ? 'en' : 'es-CO';
});

export default i18n;
