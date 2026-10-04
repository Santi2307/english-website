/**
 * Google Analytics 4 + Meta Pixel. Se cargan después de la primera interacción
 * o a los 3 s para no afectar el LCP. Los eventos se encolan mientras tanto.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
let loaded = false;

function loadScript(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export function initAnalytics() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;

  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  }

  if (PIXEL_ID) {
    // Stub oficial de Meta: encola llamadas hasta que fbevents.js cargue
    type FbqStub = ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      push: unknown;
      loaded: boolean;
      version: string;
    };
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as FbqStub;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
  }
}

export function scheduleAnalytics() {
  const start = () => {
    initAnalytics();
    ['pointerdown', 'keydown', 'scroll'].forEach((e) => window.removeEventListener(e, start));
  };
  ['pointerdown', 'keydown', 'scroll'].forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
  setTimeout(start, 3000);
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href });
  window.fbq?.('track', 'PageView');
}

type Item = { id: string; name: string; price: number };

export const track = {
  levelTestStarted: () => window.gtag?.('event', 'level_test_start'),
  levelTestCompleted: (level: string) => {
    window.gtag?.('event', 'generate_lead', { method: 'level_test', level });
    window.fbq?.('track', 'Lead', { content_name: `Test de nivel ${level}` });
  },
  demoLessonInteracted: (exercise: string) => window.gtag?.('event', 'demo_lesson_interaction', { exercise }),
  phraseSpoken: (accuracy: number) => window.gtag?.('event', 'phrase_of_day_spoken', { accuracy }),
  planCalculated: (from: string, to: string, minutes: number) => window.gtag?.('event', 'plan_calculated', { from, to, minutes }),
  viewItem: (i: Item) => {
    window.gtag?.('event', 'view_item', { currency: 'COP', value: i.price, items: [{ item_id: i.id, item_name: i.name, price: i.price }] });
    window.fbq?.('track', 'ViewContent', { content_ids: [i.id], content_name: i.name, content_type: 'product', value: i.price, currency: 'COP' });
  },
  beginCheckout: (i: Item) => {
    window.gtag?.('event', 'begin_checkout', { currency: 'COP', value: i.price, items: [{ item_id: i.id, item_name: i.name, price: i.price }] });
    window.fbq?.('track', 'InitiateCheckout', { content_ids: [i.id], value: i.price, currency: 'COP' });
  },
  purchase: (orderId: string, i: Item) => {
    // Evita contar dos veces la misma compra si el usuario recarga la página
    const key = `ea_purchase_${orderId}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch { /* storage bloqueado */ }
    window.gtag?.('event', 'purchase', { transaction_id: orderId, currency: 'COP', value: i.price, items: [{ item_id: i.id, item_name: i.name, price: i.price }] });
    window.fbq?.('track', 'Purchase', { content_ids: [i.id], value: i.price, currency: 'COP' }, { eventID: orderId });
  },
  whatsappClick: (source: string) => {
    window.gtag?.('event', 'contact', { method: 'whatsapp', source });
    window.fbq?.('track', 'Contact');
  },
};
