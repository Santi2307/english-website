import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { track } from '@/lib/analytics';

const NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '573151378651';

export function whatsappUrl(message: string) {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppButton() {
  const { t } = useTranslation();
  return (
    <motion.a
      href={whatsappUrl(t('footer.whatsappMessage'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('footer.whatsapp')}
      onClick={() => track.whatsappClick('floating')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-600/30 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" aria-hidden />
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden className="relative">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.56 4.2 1.62 6.02L4 28l7.12-1.58a12 12 0 0 0 4.92 1.06h.01C22.68 27.48 28 22.08 28 15.44 28 8.8 22.68 3 16.04 3zm0 22.3h-.01a9.96 9.96 0 0 1-5.08-1.39l-.36-.22-4.22.94.9-4.12-.24-.38a9.9 9.9 0 0 1-1.53-5.3c0-5.5 4.48-9.98 10-9.98 5.5 0 9.84 4.66 9.84 10.16 0 5.5-4.38 10.29-9.3 10.29zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
      </svg>
    </motion.a>
  );
}
