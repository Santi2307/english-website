import { useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js';
import { api, ApiError } from '@/lib/api';
import { toPayload, clearDraft, type Billing } from '@/lib/checkoutForm';
import { paymentErrorMessage, stripeErrorCode } from '@/lib/paymentErrors';
import { track } from '@/lib/analytics';
import { CK } from '@/data/checkout';
import type { Locale } from './useLocale';
import type { CreateOrderResponse } from '@/lib/types';

/**
 * Máquina de estados del pago. Un solo `phase` en vez de varios booleanos que
 * podrían contradecirse (isLoading + isError a la vez).
 *
 *   idle → validating → creating → confirming → succeeded
 *                 ↘ idle (con aviso)      ↘ failed → idle
 *
 * "confirming" incluye la verificación del banco (3D Secure): Stripe.js la
 * muestra en su propia ventana y la promesa sigue esperando hasta que termina.
 */
export type Phase = 'idle' | 'validating' | 'creating' | 'confirming' | 'succeeded' | 'failed';
type Notice = { tone: 'error' | 'info'; text: string } | null;
type State = { phase: Phase; notice: Notice };
type Action = { type: 'start' } | { type: 'creating' } | { type: 'confirming' } | { type: 'succeeded' } | { type: 'stop'; notice: Notice } | { type: 'fail'; text: string } | { type: 'clear' };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'start': return { phase: 'validating', notice: null };
    case 'creating': return { phase: 'creating', notice: null };
    case 'confirming': return { ...s, phase: 'confirming' };
    case 'succeeded': return { phase: 'succeeded', notice: null };
    case 'stop': return { phase: 'idle', notice: a.notice };
    case 'fail': return { phase: 'failed', notice: { tone: 'error', text: a.text } };
    case 'clear': return { ...s, notice: null };
  }
}

type Ctx = {
  locale: Locale;
  userId: string;
  accountEmail: string;
  courseId: string;
  courseSlug: string;
  couponCode: string | undefined;
  /** El total es 0 (cupón del 100%): no hay pago que confirmar */
  free: boolean;
  onCouponRejected: () => void;
};

export function useCheckout(ctx: Ctx) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, { phase: 'idle', notice: null });
  const inFlight = useRef(false); // doble clic / doble envío: una sola operación a la vez
  const t = ctx.locale;

  const createOrder = (billing: Billing) =>
    api<CreateOrderResponse>('/orders', { method: 'POST', body: { courseId: ctx.courseId, couponCode: ctx.couponCode, billing: toPayload(billing) } });

  /** Errores al crear la orden → acción concreta o mensaje humano. */
  const onCreateError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 409) {
      navigate(`/aprender/${ctx.courseSlug}`, { replace: true });
      return;
    }
    if (err instanceof ApiError && err.status === 400 && ctx.couponCode && !err.details?.billing) {
      // El cupón expiró o se agotó mientras el usuario llenaba el formulario
      ctx.onCouponRejected();
      dispatch({ type: 'stop', notice: { tone: 'info', text: CK.promo.expired[t] } });
      return;
    }
    if (err instanceof ApiError && err.status === 503) return dispatch({ type: 'fail', text: CK.pay.unavailable[t] });
    if (err instanceof ApiError && err.status >= 400 && err.status < 500) return dispatch({ type: 'fail', text: err.message });
    dispatch({ type: 'fail', text: paymentErrorMessage(err instanceof ApiError && err.status === 0 ? 'network' : 'server', t) });
  };

  const finish = (orderId: string) => {
    dispatch({ type: 'succeeded' });
    clearDraft(ctx.userId);
    // El resultado lo confirma el servidor (webhook o consulta a Stripe), nunca esta página
    navigate(`/pago/resultado?order=${orderId}`);
  };

  /** Crea la orden en el servidor y confirma el pago con Stripe (tarjeta o billetera). */
  const run = async (billing: Billing) => {
    dispatch({ type: 'creating' });
    let res: CreateOrderResponse;
    try {
      res = await createOrder(billing);
    } catch (err) {
      onCreateError(err);
      return;
    }
    if (res.free) return finish(res.orderId);
    if (res.status === 'succeeded') return finish(res.orderId); // ya estaba pagada (otra pestaña)
    if (!stripe || !elements) return dispatch({ type: 'fail', text: CK.pay.loadFailed[t] });

    dispatch({ type: 'confirming' });
    track.paymentAttempted();
    const name = `${billing.firstName} ${billing.lastName}`.trim();
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: res.clientSecret,
      confirmParams: {
        return_url: res.returnUrl,
        // El email es siempre el de la cuenta: la compra no puede quedar a nombre de otra persona
        payment_method_data: {
          billing_details: {
            name,
            email: ctx.accountEmail,
            address: {
              line1: billing.address1, line2: billing.address2 || '', city: billing.city,
              state: billing.region || '', postal_code: billing.postalCode || '', country: billing.country,
            },
          },
        },
      },
      // Solo redirige si el medio lo exige; 3D Secure se resuelve aquí mismo
      redirect: 'if_required',
    });
    if (error) {
      const code = stripeErrorCode(error);
      track.checkoutFailed(code);
      // validation_error: el propio campo de tarjeta ya muestra qué corregir
      if (error.type === 'validation_error') return dispatch({ type: 'stop', notice: null });
      return dispatch({ type: 'fail', text: paymentErrorMessage(code, t) });
    }
    finish(res.orderId);
  };

  /** Botón "Pagar": valida el formulario y los campos de tarjeta antes de crear nada. */
  const payWithCard = async (billing: Billing, validateForm: () => boolean) => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      dispatch({ type: 'start' });
      if (!validateForm()) return dispatch({ type: 'stop', notice: { tone: 'error', text: CK.err.fixAbove[t] } });
      if (!ctx.free) {
        if (!elements) return dispatch({ type: 'fail', text: CK.pay.loadFailed[t] });
        const { error } = await elements.submit();
        if (error) return dispatch({ type: 'stop', notice: null }); // el Payment Element muestra el error en su campo
      }
      await run(billing);
    } finally {
      inFlight.current = false;
    }
  };

  /**
   * Apple Pay / Google Pay / Link: la billetera ya entrega nombre y dirección de
   * facturación, así que no exigimos el formulario. El email sigue siendo el de la cuenta.
   */
  const payWithExpress = async (event: StripeExpressCheckoutElementConfirmEvent, fallback: Billing) => {
    if (inFlight.current || !elements) return;
    inFlight.current = true;
    try {
      dispatch({ type: 'start' });
      const { error } = await elements.submit();
      if (error) {
        event.paymentFailed({ reason: 'fail' });
        return dispatch({ type: 'stop', notice: null });
      }
      const d = event.billingDetails;
      const [first, ...rest] = (d?.name ?? '').trim().split(/\s+/);
      const a = d?.address;
      const billing: Billing = a?.line1 && a.city && a.country
        ? {
            firstName: first || fallback.firstName, lastName: rest.join(' ') || fallback.lastName,
            country: a.country, region: a.state ?? '', city: a.city, address1: a.line1, address2: a.line2 ?? '', postalCode: a.postal_code ?? '',
          }
        : fallback;
      await run(billing);
    } finally {
      inFlight.current = false;
    }
  };

  return { phase: state.phase, notice: state.notice, payWithCard, payWithExpress, clearNotice: () => dispatch({ type: 'clear' }) };
}
