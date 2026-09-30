import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Check, Mic, RotateCcw, Volume2, X } from 'lucide-react';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/format';

type Tab = 'order' | 'fill' | 'speak';
type Feedback = 'correct' | 'incorrect' | null;

function FeedbackBanner({ value }: { value: Feedback }) {
  const { t } = useTranslation();
  return (
    <div aria-live="polite" className="min-h-12">
      <AnimatePresence>
        {value && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'mt-4 flex items-center gap-2 rounded-xl px-4 py-3 font-semibold',
              value === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
            )}
          >
            {value === 'correct' ? <Check size={18} aria-hidden /> : <X size={18} aria-hidden />}
            {t(value === 'correct' ? 'demo.correct' : 'demo.incorrect')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 1. Ordenar palabras (tap + drag para reordenar, funciona en táctil) ─────
const TARGET = ['Where', 'is', 'the', 'station', '?'];
const BANK = ['station', 'is', '?', 'are', 'Where', 'the'];

function OrderExercise() {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const available = BANK.filter((w) => !answer.includes(w));

  const add = (w: string) => {
    setFeedback(null);
    setAnswer((a) => [...a, w]);
  };
  const remove = (w: string) => {
    setFeedback(null);
    setAnswer((a) => a.filter((x) => x !== w));
  };
  const check = () => {
    track.demoLessonInteracted('order');
    setFeedback(answer.join(' ') === TARGET.join(' ') ? 'correct' : 'incorrect');
  };

  return (
    <div>
      <p className="text-slate-600">{t('demo.orderInstructions')}</p>
      <Reorder.Group
        axis="x"
        values={answer}
        onReorder={setAnswer}
        className={cn(
          'mt-5 flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3 transition',
          feedback === 'correct' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-slate-50',
        )}
        aria-label="Tu respuesta"
      >
        {answer.map((w) => (
          <Reorder.Item
            key={w}
            value={w}
            whileDrag={{ scale: 1.1, zIndex: 10 }}
            className="cursor-grab touch-none list-none active:cursor-grabbing"
          >
            <button
              onClick={() => remove(w)}
              className="rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white shadow-md"
              aria-label={`Quitar ${w}`}
            >
              {w}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Palabras disponibles">
        {available.map((w) => (
          <motion.button
            key={w}
            layout
            whileTap={{ scale: 0.92 }}
            onClick={() => add(w)}
            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-800 shadow-sm hover:border-brand-300"
          >
            {w}
          </motion.button>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={check} disabled={!answer.length} className="btn-primary">{t('demo.check')}</button>
        <button onClick={() => { setAnswer([]); setFeedback(null); }} className="btn-ghost" aria-label={t('demo.reset')}>
          <RotateCcw size={16} aria-hidden />
        </button>
      </div>
      <FeedbackBanner value={feedback} />
    </div>
  );
}

// ─── 2. Completar frases ───────────────────────────────────────────────────
const FILL = [
  { before: 'I', after: 'from Colombia.', options: ['am', 'is', 'are'], answer: 'am' },
  { before: 'She', after: 'coffee every morning.', options: ['drink', 'drinks', 'drinking'], answer: 'drinks' },
  { before: 'We', after: 'to Cartagena last year.', options: ['go', 'gone', 'went'], answer: 'went' },
];

function FillExercise() {
  const { t } = useTranslation();
  const [values, setValues] = useState<string[]>(FILL.map(() => ''));
  const [checked, setChecked] = useState(false);
  const allCorrect = FILL.every((f, i) => values[i] === f.answer);

  return (
    <div>
      <p className="text-slate-600">{t('demo.fillInstructions')}</p>
      <ol className="mt-5 space-y-3">
        {FILL.map((f, i) => {
          const ok = values[i] === f.answer;
          return (
            <li key={i} className="flex flex-wrap items-center gap-2 text-lg font-medium text-slate-800">
              <span>{f.before}</span>
              <label className="sr-only" htmlFor={`fill-${i}`}>Espacio {i + 1}</label>
              <select
                id={`fill-${i}`}
                value={values[i]}
                onChange={(e) => {
                  setChecked(false);
                  setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)));
                }}
                className={cn(
                  'rounded-lg border-2 bg-white px-3 py-1.5 font-semibold outline-none focus:ring-4 focus:ring-brand-100',
                  checked ? (ok ? 'border-emerald-500 text-emerald-700' : 'border-rose-400 text-rose-700') : 'border-brand-300 text-brand-700',
                )}
              >
                <option value="">___</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <span>{f.after}</span>
            </li>
          );
        })}
      </ol>
      <button
        onClick={() => { setChecked(true); track.demoLessonInteracted('fill'); }}
        disabled={values.some((v) => !v)}
        className="btn-primary mt-5"
      >
        {t('demo.check')}
      </button>
      <FeedbackBanner value={checked ? (allCorrect ? 'correct' : 'incorrect') : null} />
    </div>
  );
}

// ─── 3. Pronunciación con Web Speech API ──────────────────────────────────
const PHRASE = 'I would like a coffee, please';

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, '').split(/\s+/).filter(Boolean);

function SpeakExercise() {
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => setHeard(e.results[0][0].transcript);
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => rec.abort();
  }, []);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(PHRASE);
    u.lang = 'en-US';
    u.rate = 0.85;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('en-US'));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  const listen = () => {
    if (!recRef.current || listening) return;
    setHeard(null);
    setListening(true);
    track.demoLessonInteracted('speak');
    try {
      recRef.current.start();
    } catch {
      setListening(false);
    }
  };

  const target = normalize(PHRASE);
  const said = heard ? normalize(heard) : [];
  const matched = target.map((w) => said.includes(w));
  const accuracy = heard ? Math.round((matched.filter(Boolean).length / target.length) * 100) : 0;

  return (
    <div>
      <p className="text-slate-600">{t('demo.speakInstructions')}</p>
      <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-center text-2xl font-bold">
        {PHRASE.split(' ').map((word, i) => (
          <span
            key={i}
            className={cn('mx-1 transition-colors', heard ? (matched[i] ? 'text-emerald-600' : 'text-rose-500') : 'text-slate-900')}
          >
            {word}
          </span>
        ))}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={speak} className="btn-ghost"><Volume2 size={18} aria-hidden /> {t('demo.listen')}</button>
        <button onClick={listen} disabled={!supported || listening} className={cn('btn-primary', listening && 'animate-pulse')}>
          <Mic size={18} aria-hidden /> {listening ? t('demo.listening') : t('demo.record')}
        </button>
      </div>
      <div aria-live="polite" className="mt-4 text-center">
        {!supported && <p className="text-sm text-slate-500">{t('demo.unsupported')}</p>}
        {heard && (
          <>
            <p className="text-sm text-slate-500">{t('demo.youSaid')} “{heard}”</p>
            <p className={cn('mt-1 text-lg font-bold', accuracy >= 80 ? 'text-emerald-600' : 'text-amber-600')}>
              {t('demo.accuracy', { pct: accuracy })} {accuracy >= 80 ? '🎉' : ''}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Contenedor ───────────────────────────────────────────────────────────
export function DemoLesson() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('order');
  const tabs: Tab[] = ['order', 'fill', 'speak'];

  return (
    <section id="clase-demo" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <h2 className="section-title">{t('demo.title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('demo.subtitle')}</p>
          <div className="mt-8 hidden rounded-2xl bg-brand-950 p-6 text-white lg:block">
            <p className="font-semibold">{t('demo.ctaTitle')}</p>
            <Link to="/cursos" className="btn-accent mt-4">{t('demo.cta')} →</Link>
          </div>
        </div>

        <div className="card p-5 sm:p-8">
          <div role="tablist" aria-label={t('demo.title')} className="mb-6 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {tabs.map((k) => (
              <button
                key={k}
                role="tab"
                id={`tab-${k}`}
                aria-selected={tab === k}
                aria-controls={`panel-${k}`}
                onClick={() => setTab(k)}
                className={cn('relative rounded-lg px-2 py-2.5 text-sm font-semibold transition', tab === k ? 'text-brand-700' : 'text-slate-500')}
              >
                {tab === k && <motion.span layoutId="demo-tab" className="absolute inset-0 rounded-lg bg-white shadow-sm" />}
                <span className="relative">{t(`demo.tabs.${k}`)}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'order' && <OrderExercise />}
            {tab === 'fill' && <FillExercise />}
            {tab === 'speak' && <SpeakExercise />}
          </div>
        </div>

        <Link to="/cursos" className="btn-primary lg:hidden">{t('demo.cta')} →</Link>
      </div>
    </section>
  );
}
