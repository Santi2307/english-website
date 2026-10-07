import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { useMedia } from '@/hooks/useScrollStep';
import { useBillingForm } from '@/hooks/useBillingForm';
import { useCheckout } from '@/hooks/useCheckout';
import { CK } from '@/data/checkout';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/Spinner';
import { ErrorState, errorKind } from '@/components/ui/ErrorState';
import { CustomerInformation } from '@/components/checkout/CustomerInformation';
import { BillingAddress } from '@/components/checkout/BillingAddress';
import { PaymentSection } from '@/components/checkout/PaymentSection';
import { PaymentButton } from '@/components/checkout/PaymentButton';
import { CheckoutNotice } from '@/components/checkout/CheckoutNotice';
import { Step } from '@/components/checkout/Step';
import { MobileSummary, OrderSummary, type Coupon } from '@/components/checkout/OrderSummary';
import { api, ApiError } from '@/lib/api';
import { appearance, FONTS, getStripe } from '@/lib/stripe';
import { track } from '@/lib/analytics';
import { formatMoney } from '@/lib/format';
import type { CheckoutConfig, CourseDetail, User } from '@/lib/types';
import type { Billing } from '@/lib/checkoutForm';
import NotFound from './NotFound';

type CouponApi = {
  coupon: Coupon | null;
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  pending: boolean;
  error: string | null;
};

/** El formulario y el pago. Vive dentro de <Elements> para poder usar Stripe.js. */
function CheckoutForm({ course, user, config, promo, locale }: { course: CourseDetail; user: User; config: CheckoutConfig; promo: CouponApi; locale: Locale }) {
  const desktop = useMedia('(min-width: 1024px)');
  const formRef = useRef<HTMLFormElement>(null);
  const total = course.priceCOP - (promo.coupon?.discountCOP ?? 0);
  const free = total === 0;
  const form = useBillingForm({ userId: user.id, name: user.name, saved: config.savedBilling as Partial<Billing> | null, locale });
  const checkout = useCheckout({
    locale,
    userId: user.id,
    accountEmail: user.email,
    courseId: course.id,
    courseSlug: course.slug,
    couponCode: promo.coupon?.code,
    free,
    onCouponRejected: promo.onRemove,
  });
  const canPay = free || config.enabled;
  const busy = checkout.phase === 'validating' || checkout.phase === 'creating' || checkout.phase === 'confirming';
  // "Revisa los campos marcados" desaparece en cuanto ya no hay errores
  const notice = checkout.notice?.text === CK.err.fixAbove[locale] && !form.hasErrors ? null : checkout.notice;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkout.payWithCard(form.billing, () => {
      const first = form.validate();
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return !first;
    });
  };

  const summary = { course, locale, currency: config.currency, ...promo };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
      {!desktop && <MobileSummary {...summary} />}

      <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-7">
        <CustomerInformation form={form} email={user.email} locale={locale} />
        <BillingAddress form={form} locale={locale} />
        <Step n={3} title={CK.steps.payment[locale]}>
          {!canPay ? (
            <CheckoutNotice notice={{ tone: 'info', text: CK.pay.unavailable[locale] }} />
          ) : (
            !free && <PaymentSection locale={locale} disabled={busy} onExpressConfirm={(e) => checkout.payWithExpress(e, form.billing)} />
          )}
          <div className="space-y-3 pt-2">
            <CheckoutNotice notice={notice} />
            <PaymentButton phase={checkout.phase} amount={formatMoney(total, config.currency)} free={free} disabled={!canPay} locale={locale} />
            <p className="text-center text-xs text-slate-500">{CK.pay.reassure[locale]}</p>
            {!free && canPay && <p className="text-center text-xs text-slate-400">{CK.pay.poweredBy[locale]}</p>}
          </div>
        </Step>
      </form>

      {desktop && (
        <div className="self-start lg:sticky lg:top-8">
          <OrderSummary {...summary} />
        </div>
      )}
    </div>
  );
}

/** Estado del cupón: se valida y calcula en el servidor; aquí solo se muestra. */
function useCoupon(course: CourseDetail, locale: Locale): CouponApi {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const validate = useMutation({
    mutationFn: (code: string) =>
      api<{ code: string; type: Coupon['type']; value: number | null; discountCOP: number }>('/coupons/validate', { method: 'POST', body: { courseId: course.id, code } }),
  });
  return {
    coupon,
    pending: validate.isPending,
    error,
    onRemove: () => setCoupon(null),
    onApply: async (code) => {
      setError(null);
      try {
        const r = await validate.mutateAsync(code);
        setCoupon({ code: r.code, type: r.type, value: r.value, discountCOP: r.discountCOP });
        track.promoApplied(r.code);
      } catch (err) {
        setError(err instanceof ApiError && err.status === 400 ? CK.promo.invalid[locale] : CK.pay.loadFailed[locale]);
        throw err;
      }
    },
  };
}

function CheckoutWithStripe({ course, user, config }: { course: CourseDetail; user: User; config: CheckoutConfig }) {
  const locale = useLocale();
  const promo = useCoupon(course, locale);
  const stripePromise = useMemo(() => (config.publishableKey ? getStripe(config.publishableKey) : null), [config.publishableKey]);
  const total = course.priceCOP - (promo.coupon?.discountCOP ?? 0);
  // Monto en la unidad mínima de la moneda. Con cupón del 100% no hay pago con Stripe:
  // Elements conserva el subtotal (no acepta 0) pero nunca se confirma nada.
  const amount = Math.round((total > 0 ? total : course.priceCOP) * 100);

  return (
    <Elements
      stripe={stripePromise}
      options={stripePromise ? { mode: 'payment', amount, currency: config.currency.toLowerCase(), appearance, fonts: FONTS, locale } : undefined}
    >
      <CheckoutForm course={course} user={user} config={config} promo={promo} locale={locale} />
    </Elements>
  );
}

export default function Checkout() {
  const { slug = '' } = useParams();
  const locale = useLocale();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading, error, refetch } = useCourse(slug);
  const config = useQuery({ queryKey: ['checkout-config'], queryFn: () => api<CheckoutConfig>('/orders/checkout-config'), staleTime: 60_000 });

  useEffect(() => {
    if (course?.isEnrolled) navigate(`/aprender/${course.slug}`, { replace: true });
    else if (course) track.beginCheckout({ id: course.id, name: course.title, price: course.priceCOP });
  }, [course, navigate]);

  if (isLoading || config.isLoading) return <PageLoader />;
  if (error && errorKind(error) !== 'notFound') return <ErrorState kind={errorKind(error)} onRetry={() => refetch()} />;
  if (config.error) return <ErrorState kind={errorKind(config.error)} onRetry={() => config.refetch()} />;
  if (!course || !user || !config.data) return <NotFound />;

  return (
    <div className="container-page max-w-[1080px] pb-16 pt-8 sm:pt-12">
      <Seo title={`${CK.title[locale]} · ${course.title}`} noindex />
      <Link to={`/cursos/${course.slug}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={15} aria-hidden /> {CK.back[locale]}
      </Link>
      <header className="mb-8 mt-5 sm:mb-10">
        <h1 className="text-[1.9rem] font-semibold leading-tight tracking-[-0.03em] text-slate-900 sm:text-4xl">{CK.title[locale]}</h1>
        <p className="mt-2 text-slate-600">{CK.sub[locale]}</p>
      </header>
      <CheckoutWithStripe course={course} user={user} config={config.data} />
    </div>
  );
}
