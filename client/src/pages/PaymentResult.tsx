import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { track } from '@/lib/analytics';
import { formatMoney } from '@/lib/format';
import { clearDraft } from '@/lib/checkoutForm';
import { EASE, T } from '@/lib/motion';
import { CK, fill } from '@/data/checkout';
import { paymentErrorMessage } from '@/lib/paymentErrors';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/ui/Seo';
import { PageLoader, Spinner } from '@/components/ui/Spinner';
import { whatsappUrl } from '@/components/layout/WhatsAppButton';
import type { OrderStatusResponse } from '@/lib/types';

const MAX_POLL_MS = 90_000;

/** Check que se dibuja una vez: celebración discreta, sin confeti. */
function SuccessMark() {
  return (
    <svg viewBox="0 0 48 48" width={48} height={48} fill="none" aria-hidden>
      <motion.circle cx="24" cy="24" r="22" className="stroke-emerald-600" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE.out }} />
      <motion.path d="M15 24.5l6 6 12-13" className="stroke-emerald-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: EASE.out, delay: 0.45 }} />
    </svg>
  );
}

function Row({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className={mono ? 'break-all text-right font-mono text-xs text-slate-900' : 'text-right text-sm font-medium text-slate-900'}>{children}</dd>
    </div>
  );
}

/**
 * Nunca confiamos en el estado que venga en la URL (Stripe agrega redirect_status,
 * pero se ignora). Solo usamos `order`, el id de NUESTRA orden: el backend verifica
 * que sea del usuario y consulta el PaymentIntent directamente a Stripe.
 */
export default function PaymentResult() {
  const locale = useLocale();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const orderId = params.get('order');
  const qc = useQueryClient();
  const [startedAt] = useState(() => Date.now());
  const r = CK.result;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api<OrderStatusResponse>(`/orders/${orderId}`),
    enabled: !!orderId,
    refetchInterval: (q) => (q.state.data?.status === 'PENDING' && !q.state.data.attemptError && Date.now() - startedAt < MAX_POLL_MS ? 3000 : false),
  });

  useEffect(() => {
    if (data?.status !== 'APPROVED') return;
    track.purchase(data.id, { id: data.course.id, name: data.course.title, price: data.amountInCents / 100 });
    qc.invalidateQueries({ queryKey: ['me'] });
    if (user) clearDraft(user.id);
    // El acceso aparece de inmediato en el curso, el dashboard y el historial, sin recargar
    qc.invalidateQueries({ queryKey: ['course', data.course.slug] });
    qc.invalidateQueries({ queryKey: ['my-courses'] });
    qc.invalidateQueries({ queryKey: ['orders'] });
  }, [data, qc, user]);

  if (!orderId || isError) {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-lg text-slate-900">{r.notFound[locale]}</p>
          <Link to="/mi-cuenta" className="btn-secondary mt-6">{r.dashboard[locale]}</Link>
        </div>
      </div>
    );
  }
  if (isLoading || !data) return <PageLoader />;

  const s = data.status;
  const ok = s === 'APPROVED';
  const pending = s === 'PENDING';
  const stillChecking = pending && Date.now() - startedAt < 20_000;
  const amount = formatMoney(data.amountInCents / 100, data.currency);
  const method = data.paymentDetail;
  // Un intento fallido (tarjeta rechazada tras redirigir al banco) deja la orden pendiente y reintentable
  const failedAttempt = pending && !!data.attemptError;

  const title = ok
    ? r.okTitle[locale]
    : failedAttempt ? r.failTitle[locale]
    : pending ? (stillChecking ? r.checking[locale] : r.pendingTitle[locale])
    : s === 'VOIDED' ? r.voidTitle[locale] : r.failTitle[locale];
  const text = ok
    ? fill(r.okText[locale], { course: data.course.title })
    : failedAttempt ? paymentErrorMessage(data.attemptError, locale)
    : pending
      ? stillChecking ? r.checkingSub[locale] : fill(r.pendingText[locale], { email: data.receiptEmail })
      : s === 'VOIDED' ? r.voidText[locale] : paymentErrorMessage(null, locale);

  return (
    <div className="container-page max-w-xl py-12 sm:py-20">
      <Seo title={`${title} · English Academy`} noindex />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={T.scroll} aria-live="polite">
        <div className="h-12">
          {ok ? <SuccessMark /> : pending && !failedAttempt ? <Spinner className="h-10 text-slate-900" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-2xl font-semibold text-rose-700" aria-hidden>!</span>}
        </div>
        {ok && <p className="eyebrow mt-8 text-emerald-700">{r.okEyebrow[locale]}</p>}
        <h1 className={`${ok ? 'mt-3' : 'mt-8'} text-[2.2rem] font-semibold leading-tight tracking-[-0.035em] text-slate-900 sm:text-5xl`}>{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{text}</p>

        <dl className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          <Row label={r.course[locale]}>{data.course.title}</Row>
          <Row label={r.amount[locale]}><span className="font-mono">{amount}</span></Row>
          {method && <Row label={r.method[locale]}>{method}</Row>}
          <Row label={r.order[locale]} mono>{data.reference}</Row>
          {ok && <Row label={r.receipt[locale]}>{data.receiptEmail}</Row>}
          {ok && data.receiptUrl && (
            <Row label={r.viewReceipt[locale]}>
              <a href={data.receiptUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">{r.viewReceipt[locale]}</a>
            </Row>
          )}
        </dl>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {ok && (
            <>
              <Link to={`/aprender/${data.course.slug}`} className="btn-primary btn-lg">{r.start[locale]} <ArrowRight size={17} aria-hidden /></Link>
              <Link to="/mi-cuenta" className="btn-secondary btn-lg">{r.dashboard[locale]}</Link>
            </>
          )}
          {!ok && (!pending || failedAttempt) && (
            <>
              <Link to={`/checkout/${data.course.slug}`} className="btn-primary btn-lg">{r.tryAgain[locale]}</Link>
              <a href={whatsappUrl(`${locale === 'en' ? 'Hi, I had a problem with payment' : 'Hola, tuve un problema con el pago'} ${data.reference}`)} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">{r.help[locale]}</a>
            </>
          )}
          {pending && !failedAttempt && !stillChecking && <Link to="/mi-cuenta" className="btn-secondary btn-lg">{r.dashboard[locale]}</Link>}
        </div>
      </motion.div>
    </div>
  );
}
