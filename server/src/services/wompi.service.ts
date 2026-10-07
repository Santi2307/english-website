import crypto from 'node:crypto';
import { env } from '../config/env.js';

export type WompiTransaction = {
  id: string;
  reference: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
  /** Wompi solo expone datos no sensibles de la tarjeta (marca y últimos 4). */
  payment_method?: { type?: string; extra?: { brand?: string; last_four?: string; financial_institution_name?: string } };
  status_message?: string | null;
  customer_email?: string;
};

export type WompiEvent = {
  event: string;
  data: { transaction: WompiTransaction };
  environment: string;
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  sent_at: string;
};

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

/** Firma de integridad: SHA256(referencia + montoEnCentavos + moneda + secretoIntegridad). */
export function integritySignature(reference: string, amountInCents: number, currency = 'COP') {
  return sha256(`${reference}${amountInCents}${currency}${env.WOMPI_INTEGRITY_SECRET}`);
}

export function generateReference() {
  // Única, no adivinable y legible en el panel de Wompi
  return `EA-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
}

const getPath = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => (acc as Record<string, unknown> | undefined)?.[key], obj);

/**
 * Valida el checksum de un evento de Wompi:
 * SHA256(valores de signature.properties en orden + timestamp + secretoEventos).
 */
export function verifyEventChecksum(event: WompiEvent) {
  if (!env.WOMPI_EVENTS_SECRET) return false;
  if (!event?.signature?.properties || !event.signature.checksum || !event.timestamp) return false;
  const values = event.signature.properties.map((p) => String(getPath(event.data, p) ?? '')).join('');
  const expected = sha256(`${values}${event.timestamp}${env.WOMPI_EVENTS_SECRET}`);
  const received = String(event.signature.checksum).toLowerCase();
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  );
}

/** Consulta una transacción directamente a la API de Wompi (fuente de verdad). */
export async function fetchTransaction(id: string): Promise<WompiTransaction | null> {
  const res = await fetch(`${env.wompiApiUrl}/transactions/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: WompiTransaction };
  return json.data ?? null;
}

/**
 * Resumen legible del medio de pago: "VISA •••• 4242", "PSE · Bancolombia", "Nequi".
 * Usa solo los datos que Wompi ya enmascara; nunca recibimos el número completo.
 */
export function paymentDetail(tx: WompiTransaction): string | null {
  const type = tx.payment_method_type ?? tx.payment_method?.type;
  const extra = tx.payment_method?.extra;
  if (type === 'CARD' && extra?.last_four) return `${(extra.brand ?? 'Card').toUpperCase()} •••• ${extra.last_four.slice(-4)}`;
  const names: Record<string, string> = { PSE: 'PSE', NEQUI: 'Nequi', BANCOLOMBIA_TRANSFER: 'Bancolombia', BANCOLOMBIA_QR: 'Bancolombia QR', DAVIPLATA: 'Daviplata', PCOL: 'Puntos Colombia' };
  // Sin marca/últimos 4 (o un medio que no conocemos) la UI muestra la etiqueta traducida del tipo
  if (!type || !names[type]) return null;
  const base = names[type];
  return type === 'PSE' && extra?.financial_institution_name ? `${base} · ${extra.financial_institution_name}` : base;
}
