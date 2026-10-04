import { useTranslation } from 'react-i18next';

export type Locale = 'es' | 'en';

/** Idioma activo reducido a 'es' | 'en' para los textos que viven en /data. */
export function useLocale(): Locale {
  const { i18n } = useTranslation();
  return i18n.language?.startsWith('en') ? 'en' : 'es';
}
