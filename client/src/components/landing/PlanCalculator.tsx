import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { animate, motion } from 'framer-motion';
import { CalendarClock, Flag, Info, Sparkles } from 'lucide-react';
import { COURSE_FOR_GOAL, GOAL_LEVELS, GUIDED_HOURS, PLAN, START_LEVELS, type StartLevel } from '@/data/plan';
import { savedLevel } from '@/data/levelTest';
import { useCourses } from '@/hooks/useCourses';
import { track } from '@/lib/analytics';
import { cn, formatCOP } from '@/lib/format';
import type { Level } from '@/lib/types';

const ORDER: StartLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

/** Número que se desliza suavemente hasta el nuevo valor. */
function Rolling({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const controls = animate(from.current, value, { duration: 0.5, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) });
    from.current = value;
    return () => controls.stop();
  }, [value]);
  return <>{shown}</>;
}

function Segmented<T extends string>({ label, options, value, onChange, render }: { label: string; options: T[]; value: T; onChange: (v: T) => void; render: (v: T) => string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-700">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={cn('relative rounded-full px-3.5 py-2 text-sm font-bold transition', value === o ? 'text-white' : 'bg-white/70 text-slate-700 hover:bg-white')}
          >
            {value === o && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-full bg-slate-900" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <span className="relative">{render(o)}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Slider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-sm font-semibold text-slate-700">
        {label} <span className="text-lg font-black tabular-nums text-slate-900">{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-glass h-2 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: `linear-gradient(to right, var(--color-brand-600) ${pct}%, rgb(255 255 255 / 0.8) ${pct}%)` }}
      />
    </label>
  );
}

export function PlanCalculator() {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en' : 'es';
  const fromTest = useMemo(() => savedLevel(), []);
  // Sin test previo se parte de un caso típico (A2 → B1); con test, desde el nivel obtenido
  const [from, setFrom] = useState<StartLevel>(fromTest && fromTest !== 'C1' ? fromTest : 'A2');
  const [to, setTo] = useState<Level>(() => GOAL_LEVELS.find((g) => ORDER.indexOf(g) > ORDER.indexOf(fromTest ?? 'A2')) ?? 'B1');
  const [minutes, setMinutes] = useState(45);
  const [days, setDays] = useState(5);
  const tracked = useRef(false);
  const { data: courses } = useCourses();

  const hours = Math.max(0, GUIDED_HOURS[to] - GUIDED_HOURS[from]);
  const weeks = Math.ceil((hours * 60) / (minutes * days));
  const months = Math.max(1, Math.round(weeks / 4.345));
  const reached = hours === 0;
  const course = courses?.find((c) => c.slug === COURSE_FOR_GOAL[to]);

  // Hitos intermedios: semana en la que llegarías a cada nivel
  const milestones = ORDER.slice(ORDER.indexOf(from) + 1, ORDER.indexOf(to) + 1).map((lvl) => ({
    level: lvl,
    week: Math.ceil(((GUIDED_HOURS[lvl] - GUIDED_HOURS[from]) * 60) / (minutes * days)),
  }));

  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    if (!tracked.current) {
      tracked.current = true;
      track.planCalculated(from, to, minutes);
    }
  };

  return (
    <section id="plan" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700">
              <CalendarClock size={16} aria-hidden /> {PLAN.eyebrow[locale]}
            </p>
            <h2 className="section-title mt-4">{PLAN.title[locale]}</h2>
            <p className="mt-3 text-lg text-slate-600">{PLAN.subtitle[locale]}</p>

            <div className="glass-strong mt-8 space-y-6 rounded-[2rem] p-6">
              <Segmented label={PLAN.from[locale]} options={START_LEVELS} value={from} onChange={touch(setFrom)} render={(l) => (l === 'A0' ? PLAN.zero[locale] : l)} />
              <Segmented label={PLAN.to[locale]} options={GOAL_LEVELS} value={to} onChange={touch(setTo)} render={(l) => l} />
              <Slider label={PLAN.minutes[locale]} value={minutes} min={10} max={120} step={5} onChange={touch(setMinutes)} suffix=" min" />
              <Slider label={PLAN.days[locale]} value={days} min={1} max={7} step={1} onChange={touch(setDays)} suffix="" />
              <p className="text-sm">
                {fromTest ? (
                  <span className="text-slate-500">✓ {PLAN.savedLevel[locale]}: <strong className="text-slate-800">{fromTest}</strong></span>
                ) : (
                  <a href="#test-de-nivel" className="font-semibold text-slate-800 hover:text-slate-950">{PLAN.noLevel[locale]} →</a>
                )}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-7 text-white shadow-2xl sm:p-9 lg:mt-24">
            <motion.div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-peach-200/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              aria-hidden
            />
            {reached ? (
              <p className="relative text-xl font-bold">{PLAN.reached[locale]}</p>
            ) : (
              <div className="relative" aria-live="polite">
                <p className="text-white/70">{PLAN.result[locale]}</p>
                <p className="mt-1 flex items-baseline gap-3">
                  <span className="text-6xl font-black tabular-nums sm:text-7xl"><Rolling value={weeks > 16 ? months : weeks} /></span>
                  <span className="text-2xl font-bold">{weeks > 16 ? PLAN.months[locale] : PLAN.weeks[locale]}</span>
                </p>
                <p className="mt-1 text-sm text-white/60">≈ {hours} {PLAN.hours[locale]} · {minutes} min × {days}/7</p>

                <ol className="mt-8 space-y-3">
                  {milestones.map((m, i) => (
                    <motion.li
                      key={m.level}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black', m.level === to ? 'bg-accent-400 text-brand-950' : 'bg-white/10')}>
                        {m.level === to ? <Flag size={16} aria-label={m.level} /> : m.level}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full bg-white/70" animate={{ width: `${(m.week / Math.max(weeks, 1)) * 100}%` }} transition={{ duration: 0.5 }} />
                      </div>
                      <span className="w-20 shrink-0 text-right text-sm tabular-nums text-white/80">
                        {weeks > 16
                          ? `${locale === 'es' ? 'mes' : 'month'} ${Math.max(1, Math.round(m.week / 4.345))}`
                          : `${locale === 'es' ? 'sem.' : 'week'} ${m.week}`}
                      </span>
                    </motion.li>
                  ))}
                </ol>

                {course && (
                  <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-white/60"><Sparkles size={12} aria-hidden /> {PLAN.suggested[locale]}</p>
                      <p className="font-bold">{course.title}</p>
                      <p className="text-sm text-white/70">{formatCOP(course.priceCOP)}</p>
                    </div>
                    <Link to={`/cursos/${course.slug}`} className="btn-accent shrink-0 px-5 py-2.5 text-sm">{locale === 'es' ? 'Ver curso' : 'View course'} →</Link>
                  </div>
                )}
              </div>
            )}
            <p className="relative mt-6 flex gap-2 text-xs leading-relaxed text-white/55">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden /> {PLAN.disclaimer[locale]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
