import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Tag, X } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/ui/Seo';
import { PageLoader, Spinner } from '@/components/ui/Spinner';
import { CourseCover } from '@/components/ui/CourseCover';
import { api, ApiError } from '@/lib/api';
import { loadWompiWidget, openWompiCheckout } from '@/lib/wompi';
import { track } from '@/lib/analytics';
import { formatCOP } from '@/lib/format';
import type { CreateOrderResponse } from '@/lib/types';
import NotFound from './NotFound';

type CouponPreview = { code: string; subtotalCOP: number; discountCOP: number; totalCOP: number };

export default function Checkout() {
  const { slug = '' } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(slug);
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);

  useEffect(() => {
    // Precarga el widget mientras el usuario revisa el resumen
    loadWompiWidget().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (course?.isEnrolled) navigate(`/aprender/${course.slug}`, { replace: true });
    else if (course) track.beginCheckout({ id: course.id, name: course.title, price: course.priceCOP });
  }, [course, navigate]);

  const applyCoupon = useMutation({
    mutationFn: () => api<CouponPreview>('/coupons/validate', { method: 'POST', body: { courseId: course!.id, code } }),
    onSuccess: setCoupon,
  });

  const pay = useMutation({
    mutationFn: (couponCode?: string) => api<CreateOrderResponse>('/orders', { method: 'POST', body: { courseId: course!.id, couponCode } }),
    onSuccess: async (res) => {
      if (res.free) {
        navigate(`/pago/resultado?order=${res.orderId}`);
        return;
      }
      await openWompiCheckout(res.checkout, { email: user!.email, fullName: user!.name }, (result) => {
        // El widget se cerró: el estado real se consulta al backend en la página de resultado
        const tx = result.transaction?.id;
        navigate(`/pago/resultado?order=${res.orderId}${tx ? `&tx=${encodeURIComponent(tx)}` : ''}`);
      });
    },
  });

  // Si el usuario escribió un cupón pero no presionó "Aplicar", se valida antes de pagar
  const onPay = async () => {
    let couponCode = coupon?.code;
    if (!couponCode && code.trim()) {
      try {
        couponCode = (await applyCoupon.mutateAsync()).code;
      } catch {
        return; // el error del cupón ya se muestra bajo el campo
      }
    }
    pay.mutate(couponCode);
  };

  if (isLoading) return <PageLoader />;
  if (!course) return <NotFound />;

  const subtotal = course.priceCOP;
  const discount = coupon?.discountCOP ?? 0;
  const total = subtotal - discount;
  const payError = pay.error instanceof ApiError ? pay.error.message : pay.error ? t('checkout.widgetError') : null;

  return (
    <div className="container-page max-w-5xl py-10">
      <Seo title={`${t('checkout.title')} · ${course.title}`} noindex />
      <h1 className="text-3xl font-semibold">{t('checkout.title')}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <section className="card flex gap-4 self-start p-5">
          <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl">
            <CourseCover title={course.title} level={course.level} goal={course.goal} color={course.coverColor} image={course.coverImage} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-brand-600">{t(`goals.${course.goal}`)} · {course.level}</p>
            <h2 className="text-lg font-bold">{course.title}</h2>
            <p className="text-sm text-slate-600">{course.instructorName}</p>
            <Link to={`/cursos/${course.slug}`} className="mt-1 inline-block text-sm text-brand-700 hover:underline">← {t('common.back')}</Link>
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 p-6" aria-labelledby="summary">
          <h2 id="summary" className="text-lg font-bold">{t('checkout.summary')}</h2>

          {coupon ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span className="flex items-center gap-2"><Tag size={16} aria-hidden />{t('checkout.couponApplied', { code: coupon.code })}</span>
              <button onClick={() => { setCoupon(null); setCode(''); }} aria-label={t('checkout.remove')}><X size={16} aria-hidden /></button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim()) applyCoupon.mutate();
              }}
            >
              <label htmlFor="coupon" className="label">{t('checkout.coupon')}</label>
              <div className="flex gap-2">
                <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input uppercase" autoComplete="off" maxLength={40} />
                <button type="submit" disabled={applyCoupon.isPending || !code.trim()} className="btn-ghost shrink-0">{t('checkout.apply')}</button>
              </div>
              {applyCoupon.error && <p className="mt-1 text-sm text-rose-600" role="alert">{(applyCoupon.error as Error).message}</p>}
            </form>
          )}

          <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-600">{t('checkout.subtotal')}</dt><dd>{formatCOP(subtotal)}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700"><dt>{t('checkout.discount')}</dt><dd>−{formatCOP(discount)}</dd></div>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-semibold">
              <dt>{t('checkout.total')}</dt><dd>{formatCOP(total)} <span className="text-xs font-medium text-slate-500">COP</span></dd>
            </div>
          </dl>

          {payError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{payError}</p>}

          <button onClick={onPay} disabled={pay.isPending || applyCoupon.isPending} className="btn-primary btn-lg w-full">
            {pay.isPending ? <Spinner className="h-5 w-5" /> : <Lock size={18} aria-hidden />}
            {total === 0 ? t('checkout.payFree') : t('checkout.pay', { amount: formatCOP(total) })}
          </button>

          <div className="space-y-2 text-center text-xs text-slate-500">
            <p>{t('checkout.methods')}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {['Visa', 'Mastercard', 'PSE', 'Nequi', 'Bancolombia'].map((m) => (
                <span key={m} className="rounded border border-slate-200 px-2 py-0.5 font-semibold text-slate-600">{m}</span>
              ))}
            </div>
            <p className="flex items-center justify-center gap-1"><ShieldCheck size={14} className="text-emerald-600" aria-hidden />{t('checkout.secure')}</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
