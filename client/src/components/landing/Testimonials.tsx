import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { Stars } from '../ui/Stars';
import { cn } from '@/lib/format';
import { usePrefersReducedMotion } from '@/hooks/useDeviceCapability';

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 font-bold text-white" aria-hidden>
      {initials}
    </span>
  );
}

function VideoTestimonial({ video, name }: { video: NonNullable<Testimonial['video']>; name: string }) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);
  const [failed, setFailed] = useState(false);

  // Solo muestra el reproductor si el archivo existe (evita un botón de play roto)
  useEffect(() => {
    let alive = true;
    fetch(video.src, { method: 'HEAD' })
      .then((r) => alive && setAvailable(r.ok && (r.headers.get('content-type') ?? '').startsWith('video/')))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [video.src]);

  if (!available || failed) return null;
  return (
    <div className="relative mb-5 aspect-video overflow-hidden rounded-xl bg-brand-950">
      {playing ? (
        <video src={video.src} poster={video.poster} controls autoPlay playsInline className="h-full w-full" onError={() => setFailed(true)} />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-800 to-brand-950"
          aria-label={`${t('testimonials.watch')}: ${name}`}
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-brand-700 shadow-xl transition group-hover:scale-110">
            <Play size={28} className="ml-1 fill-current" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

export function Testimonials() {
  const { t } = useTranslation();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const n = TESTIMONIALS.length;

  const go = useCallback((d: number) => setState(([i]) => [(i + d + n) % n, d]), [n]);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [paused, reduced, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  const item = TESTIMONIALS[index];

  return (
    <section className="py-16 sm:py-24" aria-roledescription="carrusel" aria-label={t('testimonials.title')}>
      <div className="container-page">
        <h2 className="section-title text-center">{t('testimonials.title')}</h2>

        <div
          className="relative mx-auto mt-10 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir >= 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir >= 0 ? -80 : 80 }}
                transition={{ duration: 0.35 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="card cursor-grab p-6 active:cursor-grabbing sm:p-10"
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} / ${n}`}
              >
                {item.video && <VideoTestimonial video={item.video} name={item.name} />}
                <Quote className="text-brand-200" size={36} aria-hidden />
                <blockquote className="mt-2 text-lg font-medium leading-relaxed text-slate-800 sm:text-xl">“{item.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar name={item.name} />
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role} · {item.city}</p>
                  </div>
                  <div className="ml-auto hidden text-right sm:block">
                    <Stars value={item.rating} />
                    <p className="mt-1 text-xs font-medium text-brand-600">{item.course}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => go(-1)} className="rounded-full border border-slate-200 bg-white p-2.5 hover:bg-slate-50" aria-label={t('testimonials.prev')}>
              <ChevronLeft size={20} aria-hidden />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`${i + 1}`}
                  aria-current={i === index}
                  className={cn('h-2.5 rounded-full transition-all', i === index ? 'w-8 bg-brand-600' : 'w-2.5 bg-slate-300')}
                />
              ))}
            </div>
            <button onClick={() => go(1)} className="rounded-full border border-slate-200 bg-white p-2.5 hover:bg-slate-50" aria-label={t('testimonials.next')}>
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
