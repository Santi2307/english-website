import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { api, qs } from '@/lib/api';
import { track } from '@/lib/analytics';
import { formatCOP } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { whatsappUrl } from '@/components/layout/WhatsAppButton';
import type { OrderStatusResponse } from '@/lib/types';

const MAX_POLL_MS = 90_000;

/**
 * Nunca confiamos en el estado que venga en la URL. Solo usamos:
 * - order: id de NUESTRA orden (el backend verifica que pertenezca al usuario)
 * - id / tx: id de transacción de Wompi, que el backend verifica contra la API de Wompi
 */
export default function PaymentResult() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const orderId = params.get('order');
  const tx = params.get('id') ?? params.get('tx') ?? undefined;
  const qc = useQueryClient();
  const [startedAt] = useState(() => Date.now());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api<OrderStatusResponse>(`/orders/${orderId}${qs({ tx })}`),
    enabled: !!orderId,
    refetchInterval: (q) => (q.state.data?.status === 'PENDING' && Date.now() - startedAt < MAX_POLL_MS ? 3000 : false),
  });

  useEffect(() => {
    if (data?.status === 'APPROVED') {
      track.purchase(data.id, { id: data.course.id, name: data.course.title, price: data.amountInCents / 100 });
      qc.invalidateQueries({ queryKey: ['course', data.course.slug] });
      qc.invalidateQueries({ queryKey: ['my-courses'] });
    }
  }, [data, qc]);

  if (!orderId || isError) {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center text-center">
        <p className="text-lg">{t('result.notFound')}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center text-center" aria-live="polite">
        <div>
          <Spinner className="h-12 w-12" />
          <p className="mt-4 text-lg font-semibold">{t('result.checking')}</p>
          <p className="text-sm text-slate-500">{t('result.checkingHint')}</p>
        </div>
      </div>
    );
  }

  const s = data.status;
  const ok = s === 'APPROVED';
  const pending = s === 'PENDING';
  const Icon = ok ? CheckCircle2 : pending ? Clock : XCircle;
  const color = ok ? 'text-emerald-500' : pending ? 'text-amber-500' : 'text-rose-500';
  const textKey = s === 'VOIDED' ? 'result.DECLINEDText' : `result.${s}Text`;

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-10">
      <Seo title={`${t(`result.${s}`)} · English Academy`} noindex />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card w-full max-w-lg p-8 text-center" aria-live="polite">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}>
          <Icon size={72} className={`mx-auto ${color}`} aria-hidden />
        </motion.div>
        <h1 className="mt-4 text-2xl font-extrabold">{t(`result.${s}`)}</h1>
        <p className="mt-2 text-slate-600">{t(textKey)}</p>
        {pending && <Spinner className="mx-auto mt-4" />}

        <dl className="mt-6 space-y-1 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between"><dt className="text-slate-500">{data.course.title}</dt><dd className="font-semibold">{formatCOP(data.amountInCents / 100)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">{t('result.reference')}</dt><dd className="font-mono text-xs">{data.reference}</dd></div>
          {data.paymentMethod && <div className="flex justify-between"><dt className="text-slate-500">Método</dt><dd>{data.paymentMethod}</dd></div>}
        </dl>

        <div className="mt-6 flex flex-col gap-2">
          {ok && <Link to={`/aprender/${data.course.slug}`} className="btn-primary py-4">{t('result.start')} →</Link>}
          {!ok && !pending && (
            <>
              <Link to={`/checkout/${data.course.slug}`} className="btn-primary">{t('result.tryAgain')}</Link>
              <a href={whatsappUrl(`Hola, tuve un problema con el pago ${data.reference}`)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                WhatsApp
              </a>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
