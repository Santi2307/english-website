import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Award, Check, Drama, Flame, Layers, Mic, PenLine, PlayCircle, X, Zap } from 'lucide-react';
import { BENTO } from '@/data/bento';
import { cn } from '@/lib/format';

type Locale = 'es' | 'en';

/** Avanza un contador cada `ms` solo mientras el bloque está en pantalla. */
function useTicker(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => clearInterval(id);
  }, [inView, steps, ms]);
  return { ref, step, inView };
}

function Tile({ icon, title, body, className, children, dark }: { icon: ReactNode; title: string; body: string; className?: string; children: ReactNode; dark?: boolean }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col overflow-hidden rounded-[2rem] p-6',
        dark ? 'bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white shadow-xl' : 'glass-strong',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('grid h-9 w-9 place-items-center rounded-xl', dark ? 'bg-white/10' : 'bg-slate-900 text-white')} aria-hidden>{icon}</span>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className={cn('mt-2 text-sm leading-relaxed', dark ? 'text-white/75' : 'text-slate-600')}>{body}</p>
      <div className="mt-5 flex flex-1 items-end" aria-hidden>{children}</div>
    </motion.li>
  );
}

const SLIDES = [
  { en: 'Nice to meet you!', es: '¡Mucho gusto!' },
  { en: 'How much is it?', es: '¿Cuánto cuesta?' },
  { en: "I'm looking forward to it.", es: 'Tengo muchas ganas.' },
];

function MiniClassDemo() {
  const { ref, step } = useTicker(SLIDES.length, 2600);
  const slide = SLIDES[step];
  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-peach-200/25 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
          <p className="text-2xl font-extrabold sm:text-3xl">
            {slide.en.split(' ').map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }} className="mr-2 inline-block">
                {w}
              </motion.span>
            ))}
          </p>
          <p className="mt-1 text-white/70">{slide.es}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-900"><PlayCircle size={18} /></span>
        <div className="flex flex-1 gap-1.5">
          {SLIDES.map((_, i) => (
            <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              {i === step && <motion.span className="block h-full bg-white" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'linear' }} />}
              {i < step && <span className="block h-full bg-white" />}
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold text-white/60">10 min</span>
      </div>
    </div>
  );
}

const BARS = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.95, 0.65, 0.8, 0.45, 0.9, 0.55, 0.75, 0.35];
const PRON_WORDS = ['Thank', 'you', 'very', 'much'];

function PronunciationDemo() {
  const { ref, step, inView } = useTicker(PRON_WORDS.length + 2, 700);
  return (
    <div ref={ref} className="w-full">
      <div className="flex h-14 items-center justify-center gap-1">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-full bg-brand-500"
            animate={inView ? { scaleY: [0.25, h, 0.35, h * 0.8, 0.25] } : { scaleY: 0.25 }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.06 }}
            style={{ height: '100%', originY: 0.5 }}
          />
        ))}
      </div>
      <p className="mt-3 flex flex-wrap justify-center gap-1.5 text-sm font-bold">
        {PRON_WORDS.map((w, i) => (
          <span key={w} className={cn('rounded-lg px-2 py-0.5 transition-colors duration-300', i < step ? 'bg-emerald-100 text-emerald-800' : 'bg-white/80 text-slate-500')}>{w}</span>
        ))}
      </p>
      <p className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-slate-500"><Mic size={12} /> {step > PRON_WORDS.length ? '100%' : `${Math.round((Math.min(step, PRON_WORDS.length) / PRON_WORDS.length) * 100)}%`}</p>
    </div>
  );
}

const CHAT = [
  { me: false, text: "Hi! What's your name?" },
  { me: true, text: "I'm Camila. Nice to meet you!" },
  { me: false, text: 'Nice to meet you too!' },
];

function RolePlayDemo({ locale }: { locale: Locale }) {
  const { ref, step } = useTicker(CHAT.length + 2, 1300);
  return (
    <div ref={ref} className="w-full space-y-2">
      {CHAT.slice(0, Math.min(step + 1, CHAT.length)).map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn('flex', m.me ? 'justify-end' : 'justify-start')}>
          <span className={cn('max-w-[85%] rounded-2xl px-3 py-2 text-sm font-medium', m.me ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm bg-white text-slate-800 shadow-sm')}>
            {m.me && <Mic size={12} className="mr-1 inline -translate-y-px" />}
            {m.text}
          </span>
        </motion.div>
      ))}
      {step < CHAT.length && CHAT[step + 1]?.me && (
        <p className="text-right text-xs font-semibold text-slate-500">{locale === 'es' ? '🎙️ Tu turno…' : '🎙️ Your turn…'}</p>
      )}
    </div>
  );
}

function FixDemo() {
  const { ref, step } = useTicker(2, 2400);
  const fixed = step === 1;
  return (
    <div ref={ref} className="w-full space-y-2 text-base font-bold">
      <p className={cn('flex items-center gap-2 rounded-xl px-3 py-2 transition-colors', fixed ? 'bg-white/60 text-slate-400' : 'bg-rose-50 text-rose-800')}>
        <X size={16} className="shrink-0" />
        <span className="relative">
          I have 25 years.
          <motion.span className="absolute left-0 top-1/2 h-0.5 bg-rose-400" animate={{ width: fixed ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
        </span>
      </p>
      <AnimatePresence>
        {fixed && (
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
            <Check size={16} className="shrink-0" /> I&apos;m 25 years old.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlashcardDemo({ locale }: { locale: Locale }) {
  const { ref, step } = useTicker(2, 2200);
  return (
    <div ref={ref} className="w-full [perspective:800px]">
      <motion.div className="relative h-24 [transform-style:preserve-3d]" animate={{ rotateY: step ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 15 }}>
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white text-center shadow-md [backface-visibility:hidden]">
          <p className="text-lg font-black text-slate-900">🤝 Get along with</p>
        </div>
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-brand-900 px-3 text-center text-white shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-bold">Llevarse bien con</p>
        </div>
      </motion.div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold">
        <span className="rounded-full bg-white/80 py-1.5 text-center text-slate-600">{locale === 'es' ? 'Otra vez' : 'Again'}</span>
        <span className="rounded-full bg-emerald-600 py-1.5 text-center text-white">{locale === 'es' ? 'Lo sé' : 'Got it'}</span>
      </div>
    </div>
  );
}

function XpDemo({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [xp, setXp] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setXp(Math.round(1240 * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className="grid w-full gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-white/80 p-4 text-center">
        <p className="flex items-center justify-center gap-1 text-3xl font-black tabular-nums text-amber-500"><Zap size={24} className="fill-amber-400" />{xp.toLocaleString('es-CO')}</p>
        <p className="text-xs font-semibold text-slate-500">XP</p>
      </div>
      <div className="rounded-2xl bg-white/80 p-4 text-center">
        <motion.p className="flex items-center justify-center gap-1 text-3xl font-black text-orange-500" animate={inView ? { scale: [1, 1.12, 1] } : {}} transition={{ duration: 1.6, repeat: Infinity }}>
          <Flame size={24} className="fill-orange-400" />14
        </motion.p>
        <p className="text-xs font-semibold text-slate-500">{locale === 'es' ? 'días de racha' : 'day streak'}</p>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-accent-300 to-accent-500 p-4 text-brand-950">
        <Award size={32} className="shrink-0" />
        <div className="leading-tight">
          <p className="text-sm font-black">{locale === 'es' ? 'Certificado' : 'Certificate'}</p>
          <p className="text-xs font-semibold opacity-80">PDF · {locale === 'es' ? 'descargable' : 'downloadable'}</p>
        </div>
      </div>
    </div>
  );
}

export function FeaturesBento() {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language.startsWith('en') ? 'en' : 'es';
  const b = BENTO;

  return (
    <section id="como-funciona" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="section-title">{b.title[locale]}</h2>
          <p className="mt-3 text-lg text-slate-600">{b.subtitle[locale]}</p>
          <p className="glass mt-5 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700">{b.stats[locale]}</p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          <Tile dark className="md:col-span-2" icon={<PlayCircle size={18} />} title={b.miniclass.title[locale]} body={b.miniclass.body[locale]}>
            <MiniClassDemo />
          </Tile>
          <Tile icon={<Mic size={18} />} title={b.pronunciation.title[locale]} body={b.pronunciation.body[locale]}>
            <PronunciationDemo />
          </Tile>
          <Tile icon={<Drama size={18} />} title={b.roleplay.title[locale]} body={b.roleplay.body[locale]}>
            <RolePlayDemo locale={locale} />
          </Tile>
          <Tile icon={<PenLine size={18} />} title={b.fix.title[locale]} body={b.fix.body[locale]}>
            <FixDemo />
          </Tile>
          <Tile icon={<Layers size={18} />} title={b.flashcards.title[locale]} body={b.flashcards.body[locale]}>
            <FlashcardDemo locale={locale} />
          </Tile>
          <Tile className="md:col-span-3" icon={<Zap size={18} />} title={b.xp.title[locale]} body={b.xp.body[locale]}>
            <XpDemo locale={locale} />
          </Tile>
        </ul>
      </div>
    </section>
  );
}
