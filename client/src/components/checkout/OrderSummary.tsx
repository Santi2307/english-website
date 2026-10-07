import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Tag, X } from 'lucide-react';
import { CK, fill } from '@/data/checkout';
import type { Locale } from '@/hooks/useLocale';
import type { CourseDetail } from '@/lib/types';
import { T } from '@/lib/motion';
import { cn, formatMoney } from '@/lib/format';
import { CourseCover } from '../ui/CourseCover';
import { Spinner } from '../ui/Spinner';

export type Coupon = { code: string; type: 'PERCENT' | 'FIXED' | null; value: number | null; discountCOP: number };

type PromoProps = {
  locale: Locale;
  currency: string;
  coupon: Coupon | null;
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  pending: boolean;
  error: string | null;
};

/** "¿Tienes un código?": cerrado por defecto, se abre suavemente y aplica en el servidor. */
function PromoCode({ locale, currency, coupon, onApply, onRemove, pending, error }: PromoProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');

  if (coupon) {
    const pct = coupon.type === 'PERCENT' && coupon.value ? `−${coupon.value}%` : `−${formatMoney(coupon.discountCOP, currency)}`;
    return (
      <div className="flex items-center justify-between gap-3 rounded-[10px] bg-slate-100 px-3.5 py-2.5 text-sm">
        <span className="flex min-w-0 items-center gap-2 text-slate-800">
          <Tag size={15} className="shrink-0 text-slate-500" aria-hidden />
          <span className="truncate font-medium">{fill(CK.promo.applied[locale], { code: coupon.code })}</span>
          <span className="font-mono text-xs text-slate-500">{pct}</span>
        </span>
        <button type="button" onClick={onRemove} aria-label={CK.promo.remove[locale]} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900">
          <X size={15} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls="promo-panel" onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
        {CK.promo.toggle[locale]}
        <ChevronDown size={14} className={cn('transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="promo-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: T.ui }}
            exit={{ opacity: 0, height: 0, transition: T.micro }}
            className="overflow-hidden"
          >
            <form
              className="pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim()) onApply(code.trim()).catch(() => undefined);
              }}
            >
              <label htmlFor="promo" className="sr-only">{CK.promo.label[locale]}</label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  autoComplete="off"
                  autoCapitalize="characters"
                  maxLength={40}
                  placeholder={CK.promo.label[locale]}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'promo-error' : undefined}
                  className={cn('h-11 w-full min-w-0 rounded-[10px] border bg-white px-3.5 font-mono text-sm uppercase tracking-wide outline-none transition-[border-color,box-shadow] duration-200 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:border-slate-900 focus:ring-4 focus:ring-slate-900/[0.06]', error ? 'border-rose-500' : 'border-slate-300')}
                />
                <button type="submit" disabled={pending || !code.trim()} aria-busy={pending} className="btn-secondary h-11 shrink-0">
                  {pending ? <Spinner className="h-4" /> : CK.promo.apply[locale]}
                </button>
              </div>
              {error && <p id="promo-error" className="pt-1.5 text-sm text-rose-700">{error}</p>}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Props = { course: CourseDetail; locale: Locale; currency: string } & Omit<PromoProps, 'locale' | 'currency'>;

function Totals({ course, coupon, locale, currency }: { course: CourseDetail; coupon: Coupon | null; locale: Locale; currency: string }) {
  const s = CK.summary;
  const discount = coupon?.discountCOP ?? 0;
  const total = course.priceCOP - discount;
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between gap-4"><dt className="text-slate-600">{s.subtotal[locale]}</dt><dd className="font-mono tabular-nums text-slate-900">{formatMoney(course.priceCOP, currency)}</dd></div>
      <AnimatePresence initial={false}>
        {discount > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: T.ui }} exit={{ opacity: 0, height: 0, transition: T.micro }} className="flex justify-between gap-4 overflow-hidden">
            <dt className="text-slate-600">{s.discount[locale]} · <span className="font-mono text-xs">{coupon?.code}</span></dt>
            <dd className="font-mono tabular-nums text-emerald-700">−{formatMoney(discount, currency)}</dd>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-baseline justify-between gap-4 border-t border-slate-200 pt-4">
        <dt className="text-base font-semibold text-slate-900">{s.total[locale]}</dt>
        <dd className="font-mono text-xl font-semibold tabular-nums tracking-tight text-slate-900">{formatMoney(total, currency)}</dd>
      </div>
      <p className="pt-1 text-xs leading-relaxed text-slate-500">{fill(CK.summary.currencyNote[locale], { currency })}</p>
    </dl>
  );
}

function Details({ course, locale }: { course: CourseDetail; locale: Locale }) {
  const { t } = useTranslation();
  const s = CK.summary;
  const includes = t('course.includes', { returnObjects: true }) as string[];
  return (
    <>
      <div className="flex gap-4">
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg">
          <CourseCover title={course.title} level={course.level} goal={course.goal} color={course.coverColor} image={course.coverImage} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold leading-snug tracking-[-0.01em] text-slate-900">{course.title}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">{course.level} · {course.durationHours} {s.hours[locale]} · {course.lessonsCount} {s.lessons[locale]}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{course.subtitle}</p>

      <div className="mt-5 rounded-[10px] bg-slate-100/70 px-3.5 py-3">
        <p className="text-sm font-medium text-slate-900">{s.billing[locale]}</p>
        <p className="mt-0.5 text-xs text-slate-500">{s.noRenewal[locale]} {s.guarantee[locale]}</p>
      </div>

      {Array.isArray(includes) && includes.length > 0 && (
        <>
          <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-500">{s.includes[locale]}</p>
          <ul className="mt-2.5 space-y-2 text-sm text-slate-700">
            {includes.map((i) => (
              <li key={i} className="flex items-start gap-2.5"><Check size={15} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />{i}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

/** Resumen en escritorio: columna fija a la derecha, sin repetir la landing. */
export function OrderSummary({ course, locale, currency, ...promo }: Props) {
  return (
    <aside aria-labelledby="summary-title" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
      <h2 id="summary-title" className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-500">{CK.summary.title[locale]}</h2>
      <div className="mt-5"><Details course={course} locale={locale} /></div>
      <div className="mt-6 border-t border-slate-200 pt-5"><PromoCode locale={locale} currency={currency} {...promo} /></div>
      <div className="mt-5"><Totals course={course} coupon={promo.coupon} locale={locale} currency={currency} /></div>
    </aside>
  );
}

/** Resumen en móvil: barra compacta con el total que se expande para ver el detalle. */
export function MobileSummary({ course, locale, currency, ...promo }: Props) {
  const [open, setOpen] = useState(false);
  const total = course.priceCOP - (promo.coupon?.discountCOP ?? 0);
  return (
    <section aria-label={CK.summary.title[locale]} className="rounded-2xl border border-slate-200 bg-white">
      <button type="button" aria-expanded={open} aria-controls="mobile-summary" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900">{course.title}</span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            {open ? CK.summary.hide[locale] : CK.summary.show[locale]}
            <ChevronDown size={13} className={cn('transition-transform duration-200', open && 'rotate-180')} aria-hidden />
          </span>
        </span>
        <span className="font-mono text-base font-semibold tabular-nums text-slate-900">{formatMoney(total, currency)}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="mobile-summary" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: T.ui }} exit={{ opacity: 0, height: 0, transition: T.micro }} className="overflow-hidden">
            <div className="border-t border-slate-200 px-4 pb-5 pt-4"><Details course={course} locale={locale} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-4 border-t border-slate-200 px-4 py-4">
        <PromoCode locale={locale} currency={currency} {...promo} />
        <Totals course={course} coupon={promo.coupon} locale={locale} currency={currency} />
      </div>
    </section>
  );
}
