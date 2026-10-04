import type { WompiCheckout } from './types';

type WidgetResult = { transaction?: { id: string; status: string } };
type WidgetCtor = new (config: Record<string, unknown>) => { open: (cb: (r: WidgetResult) => void) => void };

const WIDGET_SRC = 'https://checkout.wompi.co/widget.js';
let loader: Promise<WidgetCtor> | null = null;

/** Carga el widget oficial de Wompi una sola vez (el mismo script sirve para sandbox y producción). */
export function loadWompiWidget(): Promise<WidgetCtor> {
  return (loader ??= new Promise((resolve, reject) => {
    const existing = (window as unknown as { WidgetCheckout?: WidgetCtor }).WidgetCheckout;
    if (existing) return resolve(existing);
    const s = document.createElement('script');
    s.src = WIDGET_SRC;
    s.async = true;
    s.onload = () => {
      const ctor = (window as unknown as { WidgetCheckout?: WidgetCtor }).WidgetCheckout;
      if (ctor) resolve(ctor);
      else reject(new Error('WidgetCheckout no disponible'));
    };
    s.onerror = () => {
      loader = null;
      reject(new Error('No se pudo cargar Wompi'));
    };
    document.body.appendChild(s);
  }));
}

/**
 * Abre el checkout de Wompi. Todos los datos (monto, referencia, firma) vienen
 * del backend; el cliente no calcula ni modifica nada.
 */
export async function openWompiCheckout(
  c: WompiCheckout,
  customer: { email: string; fullName: string },
  onClose: (r: WidgetResult) => void,
) {
  const WidgetCheckout = await loadWompiWidget();
  const checkout = new WidgetCheckout({
    currency: c.currency,
    amountInCents: c.amountInCents,
    reference: c.reference,
    publicKey: c.publicKey,
    signature: { integrity: c.signature },
    redirectUrl: c.redirectUrl,
    customerData: { email: customer.email, fullName: customer.fullName },
  });
  checkout.open(onClose);
}
