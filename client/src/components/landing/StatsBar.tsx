import { useTranslation } from 'react-i18next';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export function StatsBar() {
  const { t } = useTranslation();
  const stats = [
    { value: 12500, suffix: '+', label: t('stats.students') },
    { value: 4.9, decimals: 1, suffix: '/5', label: t('stats.rating') },
    { value: 240, suffix: '+', label: t('stats.lessons') },
    { value: 32, label: t('stats.cities') },
  ];
  return (
    <section aria-label="Resultados" className="border-y border-slate-200 bg-white">
      <dl className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse text-center">
            <dt className="mt-1 text-sm text-slate-500">{s.label}</dt>
            <dd className="text-3xl font-extrabold text-brand-700 sm:text-4xl">
              <AnimatedCounter to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
