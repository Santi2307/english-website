import { describe, expect, it } from 'vitest';
import Stripe from 'stripe';
import { billingSchema, createOrderSchema } from '../../schemas/order.schema.js';
import { describePayment, lastErrorCode, verifyWebhook } from '../stripe.service.js';

const base = { firstName: 'Ana', lastName: 'Gómez', country: 'CO', region: 'Cundinamarca', city: 'Bogotá', address1: 'Calle 93 # 11-26' };

describe('facturación internacional', () => {
  it('acepta una dirección colombiana sin código postal', () => {
    expect(billingSchema.safeParse(base).success).toBe(true);
  });

  it('exige ZIP válido en Estados Unidos y código postal en Canadá y Reino Unido', () => {
    expect(billingSchema.safeParse({ ...base, country: 'US' }).success).toBe(false);
    expect(billingSchema.safeParse({ ...base, country: 'US', postalCode: '94103' }).success).toBe(true);
    expect(billingSchema.safeParse({ ...base, country: 'CA', postalCode: 'M5V 2T6' }).success).toBe(true);
    expect(billingSchema.safeParse({ ...base, country: 'CA', postalCode: '12345' }).success).toBe(false);
    expect(billingSchema.safeParse({ ...base, country: 'GB', region: undefined, postalCode: 'SW1A 1AA' }).success).toBe(true);
  });

  it('la región es obligatoria solo donde forma parte de la dirección', () => {
    expect(billingSchema.safeParse({ ...base, country: 'US', region: '', postalCode: '94103' }).success).toBe(false);
    expect(billingSchema.safeParse({ ...base, country: 'DE', region: '', postalCode: '10115' }).success).toBe(true);
  });

  it('nunca acepta datos de tarjeta, montos ni moneda desde el cliente', () => {
    const parsed = createOrderSchema.parse({
      courseId: 'c1', amount: 100, currency: 'USD', billing: { ...base, cardNumber: '4242424242424242', cvc: '123' },
    });
    const json = JSON.stringify(parsed);
    expect(json).not.toContain('4242');
    expect(json).not.toContain('amount');
    expect(json).not.toContain('USD');
  });
});

describe('Stripe: medio de pago y errores', () => {
  const pi = (charge: object | null, extra: object = {}) => ({ id: 'pi_1', latest_charge: charge, ...extra }) as unknown as Stripe.PaymentIntent;

  it('tarjeta: solo marca y últimos 4', () => {
    const d = describePayment(pi({ receipt_url: 'https://pay.stripe.com/r/1', payment_method_details: { type: 'card', card: { brand: 'visa', last4: '4242' } } }));
    expect(d).toEqual({ method: 'CARD', detail: 'VISA •••• 4242', receiptUrl: 'https://pay.stripe.com/r/1' });
  });

  it('Apple Pay se muestra como billetera sobre la tarjeta', () => {
    const d = describePayment(pi({ payment_method_details: { type: 'card', card: { brand: 'mastercard', last4: '4444', wallet: { type: 'apple_pay' } } } }));
    expect(d.detail).toBe('MASTERCARD •••• 4444 · Apple Pay');
  });

  it('expone solo el código del error, nunca el mensaje técnico', () => {
    expect(lastErrorCode(pi(null, { last_payment_error: { type: 'card_error', code: 'card_declined', decline_code: 'insufficient_funds', message: 'Your card has insufficient funds.' } }))).toBe('insufficient_funds');
    expect(lastErrorCode(pi(null))).toBeNull();
  });
});

describe('webhook de Stripe', () => {
  const secret = 'whsec_test_secret';
  const payload = JSON.stringify({ id: 'evt_1', object: 'event', type: 'payment_intent.succeeded', data: { object: { id: 'pi_1' } } });

  it('acepta un evento firmado con el secreto correcto', () => {
    const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
    expect(verifyWebhook(payload, header, secret).id).toBe('evt_1');
  });

  it('rechaza firmas inválidas, ausentes o de otro secreto', () => {
    const other = Stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_otro' });
    expect(() => verifyWebhook(payload, other, secret)).toThrow();
    expect(() => verifyWebhook(payload, undefined, secret)).toThrow();
    const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
    expect(() => verifyWebhook(payload.replace('pi_1', 'pi_2'), header, secret)).toThrow();
  });
});
