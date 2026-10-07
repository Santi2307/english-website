/**
 * Copy del checkout y del resultado. Internacional y neutral: términos universales
 * (Payment, Billing, Card details), sin marcas ni medios de pago locales.
 */
import type { Locale } from '@/hooks/useLocale';

type T = Record<Locale, string>;

export const CK = {
  secure: { es: 'Pago seguro', en: 'Secure checkout' } as T,
  title: { es: 'Completa tu compra', en: 'Complete your order' } as T,
  sub: { es: 'Estás a un paso de hablar más inglés.', en: "You're one step away from speaking more English." } as T,
  back: { es: 'Volver', en: 'Back' } as T,

  steps: {
    contact: { es: 'Contacto', en: 'Contact information' } as T,
    billing: { es: 'Dirección de facturación', en: 'Billing address' } as T,
    payment: { es: 'Pago', en: 'Payment' } as T,
  },

  f: {
    firstName: { es: 'Nombre', en: 'First name' } as T,
    lastName: { es: 'Apellido', en: 'Last name' } as T,
    email: { es: 'Email', en: 'Email' } as T,
    emailHint: {
      es: 'Es el email de tu cuenta: la compra queda en esta cuenta y aquí te llega el recibo.',
      en: "It's your account email: the purchase belongs to this account and your receipt goes here.",
    } as T,
    optional: { es: 'opcional', en: 'optional' } as T,
    country: { es: 'País', en: 'Country' } as T,
    countrySearch: { es: 'Buscar país', en: 'Search country' } as T,
    noCountry: { es: 'Ningún país coincide', en: 'No matching country' } as T,
    suggested: { es: 'Sugeridos', en: 'Suggested' } as T,
    all: { es: 'Todos los países', en: 'All countries' } as T,
    address1: { es: 'Dirección', en: 'Address' } as T,
    address1Ph: { es: 'Calle y número', en: 'Street and number' } as T,
    address2: { es: 'Apartamento, oficina, etc.', en: 'Apartment, suite, etc.' } as T,
    addAddress2: { es: 'Agregar apartamento u oficina', en: 'Add apartment or suite' } as T,
    city: { es: 'Ciudad', en: 'City' } as T,
    region: {
      department: { es: 'Departamento', en: 'Department' },
      state: { es: 'Estado', en: 'State' },
      province: { es: 'Provincia', en: 'Province' },
      county: { es: 'Condado', en: 'County' },
      region: { es: 'Estado / Región', en: 'State / Region' },
    } as Record<string, T>,
    postal: { es: 'Código postal', en: 'Postal code' } as T,
    zip: { es: 'Código ZIP', en: 'ZIP code' } as T,
    postcode: { es: 'Postcode', en: 'Postcode' } as T,
  },

  err: {
    firstName: { es: 'Escribe tu nombre.', en: 'Enter your first name.' } as T,
    lastName: { es: 'Escribe tu apellido.', en: 'Enter your last name.' } as T,
    address1: { es: 'Escribe tu dirección.', en: 'Enter your address.' } as T,
    city: { es: 'Escribe tu ciudad.', en: 'Enter your city.' } as T,
    region: { es: 'Completa este campo.', en: 'Fill in this field.' } as T,
    postal: { es: 'Escribe un código postal válido.', en: 'Enter a valid postal code.' } as T,
    fixAbove: { es: 'Revisa los campos marcados para continuar.', en: 'Check the highlighted fields to continue.' } as T,
  },

  pay: {
    express: { es: 'Pago rápido', en: 'Express checkout' } as T,
    orCard: { es: 'O paga con tarjeta', en: 'Or pay with card' } as T,
    card: { es: 'Datos de la tarjeta', en: 'Card details' } as T,
    stripeNote: {
      es: 'Tus datos de pago se cifran y los procesa Stripe. Nunca pasan por nuestros servidores ni los guardamos.',
      en: 'Your payment details are encrypted and processed by Stripe. They never touch our servers and we never store them.',
    } as T,
    cta: { es: 'Pagar {amount}', en: 'Pay {amount}' } as T,
    ctaFree: { es: 'Obtener acceso gratis', en: 'Get free access' } as T,
    validating: { es: 'Revisando tus datos…', en: 'Checking your details…' } as T,
    creating: { es: 'Preparando el pago…', en: 'Preparing payment…' } as T,
    processing: { es: 'Procesando el pago…', en: 'Processing payment…' } as T,
    processingSub: { es: 'No cierres esta ventana. Si tu banco pide verificar el pago, sigue sus pasos.', en: "Please don't close this window. If your bank asks you to verify the payment, follow its steps." } as T,
    succeeded: { es: 'Pago completado', en: 'Payment complete' } as T,
    unavailable: {
      es: 'Los pagos no están disponibles en este momento. Escríbenos y te ayudamos a completar tu compra.',
      en: "Payments aren't available right now. Write to us and we'll help you complete your purchase.",
    } as T,
    loadFailed: {
      es: 'No pudimos cargar el formulario de pago. Revisa tu conexión y recarga la página.',
      en: "We couldn't load the payment form. Check your connection and reload the page.",
    } as T,
    reassure: { es: 'Pago único. Sin suscripción ni cobros automáticos.', en: 'One-time payment. No subscription, no automatic charges.' } as T,
    poweredBy: { es: 'Pagos procesados de forma segura por Stripe', en: 'Payments securely processed by Stripe' } as T,
  },

  summary: {
    title: { es: 'Resumen del pedido', en: 'Order summary' } as T,
    show: { es: 'Ver resumen', en: 'Show summary' } as T,
    hide: { es: 'Ocultar resumen', en: 'Hide summary' } as T,
    billing: { es: 'Pago único · Acceso de por vida', en: 'One-time payment · Lifetime access' } as T,
    noRenewal: { es: 'No se renueva ni te volvemos a cobrar.', en: "It doesn't renew and you won't be charged again." } as T,
    includes: { es: 'Incluye', en: 'Includes' } as T,
    hours: { es: 'h de práctica', en: 'h of practice' } as T,
    lessons: { es: 'lecciones', en: 'lessons' } as T,
    subtotal: { es: 'Subtotal', en: 'Subtotal' } as T,
    discount: { es: 'Descuento', en: 'Discount' } as T,
    total: { es: 'Total hoy', en: 'Total today' } as T,
    guarantee: { es: 'Garantía de 7 días.', en: '7-day guarantee.' } as T,
    currencyNote: {
      es: 'Se cobra en {currency}. Si tu tarjeta es de otra moneda, tu banco hace la conversión.',
      en: 'Charged in {currency}. If your card uses another currency, your bank converts it.',
    } as T,
  },

  promo: {
    toggle: { es: '¿Tienes un código de descuento?', en: 'Have a promo code?' } as T,
    label: { es: 'Código de descuento', en: 'Promo code' } as T,
    apply: { es: 'Aplicar', en: 'Apply' } as T,
    applied: { es: '{code} aplicado', en: '{code} applied' } as T,
    remove: { es: 'Quitar código', en: 'Remove code' } as T,
    invalid: { es: 'Este código no es válido.', en: "This promo code isn't valid." } as T,
    expired: { es: 'Tu código de descuento ya no es válido; actualizamos el total.', en: 'Your promo code is no longer valid, so we updated the total.' } as T,
  },

  result: {
    checking: { es: 'Confirmando tu pago…', en: 'Confirming your payment…' } as T,
    checkingSub: { es: 'Lo verificamos directamente con el procesador de pagos. Toma unos segundos.', en: 'We verify it directly with the payment processor. It takes a few seconds.' } as T,
    okEyebrow: { es: 'Pago completado', en: 'Payment complete' } as T,
    okTitle: { es: 'Ya estás dentro.', en: "You're in." } as T,
    okText: { es: 'Tu acceso a {course} ya está activo.', en: 'Your access to {course} is now active.' } as T,
    start: { es: 'Empezar a hablar', en: 'Start speaking' } as T,
    dashboard: { es: 'Ir a mi cuenta', en: 'Go to dashboard' } as T,
    order: { es: 'Número de orden', en: 'Order number' } as T,
    course: { es: 'Curso', en: 'Course' } as T,
    amount: { es: 'Total', en: 'Amount' } as T,
    method: { es: 'Medio de pago', en: 'Payment method' } as T,
    receipt: { es: 'Recibo enviado a', en: 'Receipt sent to' } as T,
    viewReceipt: { es: 'Ver recibo', en: 'View receipt' } as T,
    pendingTitle: { es: 'Tu pago está en proceso.', en: 'Your payment is processing.' } as T,
    pendingText: {
      es: 'Tu banco está confirmando el pago. Te escribimos a {email} apenas se apruebe y tu acceso se activa solo.',
      en: "Your bank is confirming the payment. We'll email {email} as soon as it's approved, and your access turns on automatically.",
    } as T,
    failTitle: { es: 'No pudimos completar tu pago.', en: "We couldn't complete your payment." } as T,
    voidTitle: { es: 'Este pago fue reembolsado.', en: 'This payment was refunded.' } as T,
    voidText: { es: 'El cobro se reversó y el acceso al curso se retiró. Si crees que es un error, escríbenos.', en: 'The charge was reversed and course access was removed. If you think this is a mistake, write to us.' } as T,
    tryAgain: { es: 'Intentar de nuevo', en: 'Try again' } as T,
    help: { es: 'Contactar a soporte', en: 'Contact support' } as T,
    notFound: { es: 'No encontramos esta orden.', en: "We couldn't find this order." } as T,
  },
};

export const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
