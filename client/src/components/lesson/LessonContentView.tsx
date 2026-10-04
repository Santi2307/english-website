import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, BookOpenText, Check, Dumbbell, MessageCircle, Mic2, PlayCircle, Rocket, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/format';
import type { LessonContent } from '@/lib/lessonContent';
import { MiniClass } from './MiniClass';
import { Vocabulary } from './Vocabulary';
import { DialogueReader, GrammarCard } from './GrammarDialogue';
import { Practice } from './Practice';
import { CultureCard, MissionCard, MistakesView, PronunciationLab, ReadingView } from './Deepen';

type Step = 'class' | 'vocab' | 'grammar' | 'mistakes' | 'pronunciation' | 'dialogue' | 'reading' | 'practice' | 'mission';

type Props = {
  lessonId?: string;
  title: string;
  content: LessonContent;
  bestScore: number | null;
  onFinish: (score: number) => void;
  finishing?: boolean;
};

export function LessonContentView({ lessonId, title, content, bestScore, onFinish, finishing }: Props) {
  const steps = [
    { id: 'class' as const, label: 'Mini-clase', icon: PlayCircle, show: content.slides.length > 0 },
    { id: 'vocab' as const, label: 'Vocabulario', icon: Sparkles, show: content.vocabulary.length > 0 },
    { id: 'grammar' as const, label: 'Gramática', icon: BookOpen, show: !!content.grammar },
    { id: 'mistakes' as const, label: 'Errores típicos', icon: AlertTriangle, show: !!content.mistakes?.length },
    { id: 'pronunciation' as const, label: 'Pronunciación', icon: Mic2, show: !!content.pronunciation },
    { id: 'dialogue' as const, label: 'Diálogo', icon: MessageCircle, show: !!content.dialogue },
    { id: 'reading' as const, label: 'Lectura', icon: BookOpenText, show: !!content.reading },
    { id: 'practice' as const, label: 'Práctica', icon: Dumbbell, show: content.exercises.length > 0 },
    { id: 'mission' as const, label: 'Misión', icon: Rocket, show: !!content.mission },
  ].filter((s) => s.show);

  const [step, setStep] = useState<Step>(steps[0]?.id ?? 'practice');
  const [visited, setVisited] = useState<Set<Step>>(() => new Set([steps[0]?.id ?? 'practice']));
  const idx = steps.findIndex((s) => s.id === step);
  // El dato cultural acompaña a la lectura; sin lectura, al diálogo
  const cultureAt: Step = content.reading ? 'reading' : 'dialogue';

  const go = (s: Step) => {
    setStep(s);
    setVisited((v) => new Set(v).add(s));
  };

  // Al cambiar de lección, volver al primer paso
  useEffect(() => {
    const first = steps[0]?.id ?? 'practice';
    setStep(first);
    setVisited(new Set([first]));
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <p className="glass flex items-start gap-2.5 rounded-2xl px-4 py-3 text-slate-700">
        <Target size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
        <span><strong className="font-semibold text-slate-900">Objetivo:</strong> {content.objective}</span>
      </p>

      <div className="flex items-center gap-3 px-1">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70" aria-hidden>
          <motion.div className="h-full rounded-full bg-brand-600" animate={{ width: `${(visited.size / steps.length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold tabular-nums text-slate-500">{visited.size}/{steps.length} secciones</span>
      </div>

      <nav aria-label="Pasos de la lección" className="glass sticky top-16 z-20 flex gap-1 overflow-x-auto rounded-full p-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            aria-current={step === s.id ? 'step' : undefined}
            className={cn('relative flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition', step === s.id ? 'text-white' : 'text-slate-600 hover:text-slate-900')}
          >
            {step === s.id && <motion.span layoutId="lesson-step" className="absolute inset-0 rounded-full bg-slate-900" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            {visited.has(s.id) && step !== s.id ? (
              <Check size={16} className="relative text-emerald-600" aria-label="Visitado" />
            ) : (
              <s.icon size={16} className="relative" aria-hidden />
            )}
            <span className="relative">{i + 1}. {s.label}</span>
          </button>
        ))}
      </nav>

      <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
        {step === 'class' && <MiniClass slides={content.slides} title={title} />}
        {step === 'vocab' && <Vocabulary items={content.vocabulary} />}
        {step === 'grammar' && content.grammar && <GrammarCard grammar={content.grammar} />}
        {step === 'mistakes' && content.mistakes && <MistakesView mistakes={content.mistakes} />}
        {step === 'pronunciation' && content.pronunciation && <PronunciationLab pronunciation={content.pronunciation} />}
        {step === 'dialogue' && content.dialogue && <DialogueReader dialogue={content.dialogue} />}
        {step === 'reading' && content.reading && <ReadingView reading={content.reading} />}
        {step === cultureAt && content.culture && <CultureCard culture={content.culture} />}
        {step === 'practice' && <Practice exercises={content.exercises} bestScore={bestScore} onFinish={onFinish} finishing={finishing} />}
        {step === 'mission' && content.mission && <MissionCard mission={content.mission} storageKey={`mission:${lessonId ?? title}`} />}
      </motion.div>

      {idx < steps.length - 1 && (
        <div className="flex justify-end">
          <button onClick={() => go(steps[idx + 1].id)} className={step === 'practice' ? 'btn-glass' : 'btn-primary'}>
            Siguiente: {steps[idx + 1].label} →
          </button>
        </div>
      )}
    </div>
  );
}
