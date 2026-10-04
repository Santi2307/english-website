import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Check, Mic, RotateCcw, Shuffle, Volume2, X } from 'lucide-react';
import { nextFillSet, nextOrderItem, nextSpeakPhrase } from '@/data/demoBank';
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

/** Botón "Otro ejercicio" común a las tres pestañas. */
function NextButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button onClick={onClick} className="btn-ghost">
      <Shuffle size={16} aria-hidden /> {t('demo.next')}
    </button>
  );
}

const sentence = (words: string[]) => words.join(' ').replace(/ ([?.,!])/g, '$1');

// ─── 1. Ordenar palabras (tap + drag para reordenar, funciona en táctil) ─────
type Token = { key: string; w: string };

function OrderExercise() {
  const { t } = useTranslation();
  const [item, setItem] = useState(nextOrderItem);
  const tokens = useMemo<Token[]>(() => item.bank.map((w, i) => ({ key: `${item.id}-${i}`, w })), [item]);
  const [answer, setAnswer] = useState<Token[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const available = tokens.filter((tk) => !answer.includes(tk));

  const add = (tk: Token) => {
    setFeedback(null);
    setAnswer((a) => [...a, tk]);
  };
  const remove = (tk: Token) => {
    setFeedback(null);
    setAnswer((a) => a.filter((x) => x !== tk));
  };
  const check = () => {
    track.demoLessonInteracted('order');
    setFeedback(answer.map((x) => x.w).join(' ') === item.target.join(' ') ? 'correct' : 'incorrect');
  };
  const next = () => {
    setItem(nextOrderItem());
    setAnswer([]);
    setFeedback(null);
  };

  return (
    <div>
      <p className="text-slate-600">{t('demo.orderInstructions')}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">“{item.es}”</p>
      <Reorder.Group
        axis="x"
        values={answer}
        onReorder={setAnswer}
        className={cn(
          'mt-5 flex min-h-16 flex-wrap items-center gap-2 rounded-xl border border-dashed p-3 transition',
          feedback === 'correct' ? 'border-emerald-400 bg-emerald-50' : feedback === 'incorrect' ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-slate-50',
        )}
        aria-label="Tu respuesta"
      >
        {answer.map((tk) => (
          <Reorder.Item key={tk.key} value={tk} whileDrag={{ scale: 1.1, zIndex: 10 }} className="cursor-grab touch-none list-none active:cursor-grabbing">
            <button onClick={() => remove(tk)} className="rounded-lg bg-slate-900 px-3.5 py-2 font-medium text-white" aria-label={`Quitar ${tk.w}`}>
              {tk.w}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Palabras disponibles">
        {available.map((tk) => (
          <motion.button
            key={tk.key}
            layout
            whileTap={{ scale: 0.92 }}
            onClick={() => add(tk)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-800 shadow-xs hover:border-slate-400"
          >
            {tk.w}
          </motion.button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {feedback === 'correct' ? (
          <button onClick={next} className="btn-primary"><Shuffle size={16} aria-hidden /> {t('demo.next')}</button>
        ) : (
          <>
            <button onClick={check} disabled={answer.length < 2} className="btn-primary">{t('demo.check')}</button>
            <button onClick={() => { setAnswer([]); setFeedback(null); }} className="btn-ghost" aria-label={t('demo.reset')}>
              <RotateCcw size={16} aria-hidden />
            </button>
            <NextButton onClick={next} />
          </>
        )}
      </div>
      <FeedbackBanner value={feedback} />
      {feedback === 'incorrect' && <p className="-mt-1 text-sm text-slate-500">{sentence(item.target)}</p>}
    </div>
  );
}

// ─── 2. Completar frases ───────────────────────────────────────────────────
function FillExercise() {
  const { t } = useTranslation();
  const [set, setSet] = useState(nextFillSet);
  const [values, setValues] = useState<string[]>(() => set.map(() => ''));
  const [checked, setChecked] = useState(false);
  const allCorrect = set.every((q, i) => values[i] === q.options[q.answer]);

  const next = () => {
    const fresh = nextFillSet();
    setSet(fresh);
    setValues(fresh.map(() => ''));
    setChecked(false);
  };

  return (
    <div>
      <p className="text-slate-600">{t('demo.fillInstructions')}</p>
      <ol className="mt-5 space-y-4">
        {set.map((q, i) => {
          const [before, after = ''] = q.prompt.split('___');
          const correct = q.options[q.answer];
          const ok = values[i] === correct;
          return (
            <li key={q.id}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-medium text-slate-800">
                {before.trim() && <span>{before.trim()}</span>}
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
                  {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {after.trim() && <span>{after.trim()}</span>}
              </div>
              {checked && !ok && <p className="mt-1 text-sm font-semibold text-emerald-700">{t('demo.fillCorrect', { answer: correct })}</p>}
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        {checked && allCorrect ? (
          <button onClick={next} className="btn-primary"><Shuffle size={16} aria-hidden /> {t('demo.next')}</button>
        ) : (
          <>
            <button
              onClick={() => { setChecked(true); track.demoLessonInteracted('fill'); }}
              disabled={values.some((v) => !v)}
              className="btn-primary"
            >
              {t('demo.check')}
            </button>
            <NextButton onClick={next} />
          </>
        )}
      </div>
      <FeedbackBanner value={checked ? (allCorrect ? 'correct' : 'incorrect') : null} />
    </div>
  );
}

// ─── 3. Pronunciación con Web Speech API ──────────────────────────────────

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

const DIGITS: Record<string, string> = { '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten' };
// El reconocedor a veces devuelve números en cifras ("6 months"): los pasamos a palabras
const normalize = (s: string) =>
  s.toLowerCase().replace(/[’]/g, "'").replace(/\b(10|[1-9])\b/g, (d) => DIGITS[d]).replace(/[^a-z' ]/g, '').split(/\s+/).filter(Boolean);

function SpeakExercise() {
  const { t } = useTranslation();
  const [phrase, setPhrase] = useState(nextSpeakPhrase);
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
    const u = new SpeechSynthesisUtterance(phrase);
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

  const next = () => {
    recRef.current?.abort();
    setListening(false);
    setHeard(null);
    setPhrase(nextSpeakPhrase());
  };

  const target = normalize(phrase);
  const said = heard ? normalize(heard) : [];
  const matched = target.map((w) => said.includes(w));
  const accuracy = heard ? Math.round((matched.filter(Boolean).length / target.length) * 100) : 0;

  return (
    <div>
      <p className="text-slate-600">{t('demo.speakInstructions')}</p>
      <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-xl font-medium sm:text-2xl">
        {phrase.split(' ').map((word, i) => (
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
        <NextButton onClick={next} />
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
    <section id="clase-demo" className="section border-t border-slate-200">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <h2 className="section-title">{t('demo.title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('demo.subtitle')}</p>
          <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-500">
            <Shuffle size={15} aria-hidden /> {t('demo.fresh')}
          </p>
          <Link to="/cursos" className="btn-secondary mt-8 hidden lg:inline-flex">{t('demo.cta')}</Link>
        </div>

        <div className="card p-5 sm:p-8">
          <div role="tablist" aria-label={t('demo.title')} className="mb-6 grid grid-cols-3 gap-1 rounded-[10px] bg-slate-100 p-1">
            {tabs.map((k) => (
              <button
                key={k}
                role="tab"
                id={`tab-${k}`}
                aria-selected={tab === k}
                aria-controls={`panel-${k}`}
                onClick={() => setTab(k)}
                className={cn('relative rounded-lg px-1.5 py-2 text-[13px] font-medium leading-tight transition sm:text-sm', tab === k ? 'text-slate-900' : 'text-slate-500')}
              >
                {tab === k && <motion.span layoutId="demo-tab" className="absolute inset-0 rounded-lg bg-white shadow-xs" />}
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

        <Link to="/cursos" className="btn-secondary lg:hidden">{t('demo.cta')}</Link>
      </div>
    </section>
  );
}
