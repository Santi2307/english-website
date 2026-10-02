import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Dumbbell, MessageCircle, PlayCircle, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/format';
import type { LessonContent } from '@/lib/lessonContent';
import { MiniClass } from './MiniClass';
import { Vocabulary } from './Vocabulary';
import { DialogueReader, GrammarCard } from './GrammarDialogue';
import { Practice } from './Practice';

type Step = 'class' | 'vocab' | 'grammar' | 'dialogue' | 'practice';

type Props = {
  title: string;
  content: LessonContent;
  bestScore: number | null;
  onFinish: (score: number) => void;
  finishing?: boolean;
};

export function LessonContentView({ title, content, bestScore, onFinish, finishing }: Props) {
  const steps = [
    { id: 'class' as const, label: 'Mini-clase', icon: PlayCircle, show: content.slides.length > 0 },
    { id: 'vocab' as const, label: 'Vocabulario', icon: Sparkles, show: content.vocabulary.length > 0 },
    { id: 'grammar' as const, label: 'Gramática', icon: BookOpen, show: !!content.grammar },
    { id: 'dialogue' as const, label: 'Diálogo', icon: MessageCircle, show: !!content.dialogue },
    { id: 'practice' as const, label: 'Práctica', icon: Dumbbell, show: content.exercises.length > 0 },
  ].filter((s) => s.show);

  const [step, setStep] = useState<Step>(steps[0]?.id ?? 'practice');
  const idx = steps.findIndex((s) => s.id === step);

  // Al cambiar de lección, volver al primer paso
  useEffect(() => setStep(steps[0]?.id ?? 'practice'), [content]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <p className="glass flex items-start gap-2.5 rounded-2xl px-4 py-3 text-slate-700">
        <Target size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
        <span><strong className="font-semibold text-slate-900">Objetivo:</strong> {content.objective}</span>
      </p>

      <nav aria-label="Pasos de la lección" className="glass sticky top-16 z-20 flex gap-1 overflow-x-auto rounded-full p-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            aria-current={step === s.id ? 'step' : undefined}
            className={cn('relative flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition', step === s.id ? 'text-white' : 'text-slate-600 hover:text-slate-900')}
          >
            {step === s.id && <motion.span layoutId="lesson-step" className="absolute inset-0 rounded-full bg-slate-900" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <s.icon size={16} className="relative" aria-hidden />
            <span className="relative">{i + 1}. {s.label}</span>
          </button>
        ))}
      </nav>

      <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {step === 'class' && <MiniClass slides={content.slides} title={title} />}
          {step === 'vocab' && <Vocabulary items={content.vocabulary} />}
          {step === 'grammar' && content.grammar && <GrammarCard grammar={content.grammar} />}
          {step === 'dialogue' && content.dialogue && <DialogueReader dialogue={content.dialogue} />}
          {step === 'practice' && <Practice exercises={content.exercises} bestScore={bestScore} onFinish={onFinish} finishing={finishing} />}
      </motion.div>

      {step !== 'practice' && idx < steps.length - 1 && (
        <div className="flex justify-end">
          <button onClick={() => setStep(steps[idx + 1].id)} className="btn-primary">
            Siguiente: {steps[idx + 1].label} →
          </button>
        </div>
      )}
    </div>
  );
}
