import { WHY } from '@/data/home';
import { useLocale } from '@/hooks/useLocale';
import { Reveal, RevealLines } from '../ui/Reveal';

/** El problema, sin tarjetas: tres frases, mucho aire, para leer despacio. */
export function WhyThisExists() {
  const locale = useLocale();
  return (
    <section className="border-t border-slate-200 py-28 sm:py-40">
      <div className="container-page max-w-[60rem]">
        <Reveal as="p" className="text-xl font-medium tracking-[-0.015em] text-slate-400 sm:text-2xl">{WHY.a[locale]}</Reveal>
        <RevealLines as="h2" className="statement mt-6 sm:mt-8" lines={WHY.b[locale]} delay={0.15} gap={0.14} />
        <Reveal as="p" delay={0.35} className="lead mt-12 max-w-xl sm:mt-16">{WHY.c[locale]}</Reveal>
      </div>
    </section>
  );
}
