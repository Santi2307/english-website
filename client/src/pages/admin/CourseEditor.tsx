import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, Plus, Trash2, Video } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { PageLoader, Spinner } from '@/components/ui/Spinner';
import type { AdminCourse, AdminLesson, AdminModule } from './types';

const url = z.string().trim().refine((v) => v === '' || /^https?:\/\//.test(v), 'URL http(s)');

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  slug: z.string().regex(/^[a-z0-9-]{3,}$/, 'Solo minúsculas, números y guiones'),
  subtitle: z.string().min(3, 'Requerido'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']),
  goal: z.enum(['CONVERSATION', 'BUSINESS', 'EXAM', 'KIDS']),
  priceCOP: z.coerce.number().int().min(0),
  compareAtCOP: z.coerce.number().int().min(0).optional(),
  badge: z.enum(['', 'BESTSELLER', 'NEW']),
  coverImage: url,
  coverColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  previewVideoUrl: url,
  durationHours: z.coerce.number().int().min(0),
  instructorName: z.string().min(2, 'Requerido'),
  instructorBio: z.string(),
  instructorAvatar: url,
  whatYouLearn: z.string(),
  published: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function toForm(c?: AdminCourse): FormValues {
  return {
    title: c?.title ?? '',
    slug: c?.slug ?? '',
    subtitle: c?.subtitle ?? '',
    description: c?.description ?? '',
    level: c?.level ?? 'A1',
    goal: c?.goal ?? 'CONVERSATION',
    priceCOP: c?.priceCOP ?? 0,
    compareAtCOP: c?.compareAtCOP ?? undefined,
    badge: c?.badge ?? '',
    coverImage: c?.coverImage ?? '',
    coverColor: c?.coverColor ?? '#4f46e5',
    previewVideoUrl: c?.previewVideoUrl ?? '',
    durationHours: c?.durationHours ?? 0,
    instructorName: c?.instructorName ?? '',
    instructorBio: c?.instructorBio ?? '',
    instructorAvatar: c?.instructorAvatar ?? '',
    whatYouLearn: c?.whatYouLearn.join('\n') ?? '',
    published: c?.published ?? false,
  };
}

function toPayload(v: FormValues) {
  return {
    ...v,
    badge: v.badge || null,
    compareAtCOP: v.compareAtCOP || null,
    coverImage: v.coverImage || null,
    previewVideoUrl: v.previewVideoUrl || null,
    instructorAvatar: v.instructorAvatar || null,
    whatYouLearn: v.whatYouLearn.split('\n').map((s) => s.trim()).filter(Boolean),
  };
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-600" role="alert">{error}</span>}
    </label>
  );
}

// ─── Lecciones ─────────────────────────────────────────────────────────────
function LessonRow({ lesson, onChanged }: { lesson: AdminLesson; onChanged: () => void }) {
  const [draft, setDraft] = useState(lesson);
  const [open, setOpen] = useState(false);
  useEffect(() => setDraft(lesson), [lesson]);

  const save = useMutation({
    mutationFn: () =>
      api(`/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        body: {
          title: draft.title,
          description: draft.description,
          durationMinutes: draft.durationMinutes,
          videoId: draft.videoId || null,
          isFreePreview: draft.isFreePreview,
          position: draft.position,
        },
      }),
    onSuccess: onChanged,
  });
  const remove = useMutation({ mutationFn: () => api(`/admin/lessons/${lesson.id}`, { method: 'DELETE' }), onSuccess: onChanged });

  return (
    <li className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm font-medium" aria-expanded={open}>
          {lesson.position + 1}. {lesson.title}
          {lesson.videoId && <Video size={14} className="ml-2 inline text-emerald-600" aria-label="Con video" />}
          {lesson.isFreePreview && <span className="ml-2 rounded bg-brand-50 px-1.5 text-xs text-brand-700">Gratis</span>}
        </button>
        <button onClick={() => confirm('¿Eliminar lección?') && remove.mutate()} className="rounded p-1.5 text-rose-600 hover:bg-rose-50" aria-label="Eliminar lección">
          <Trash2 size={15} aria-hidden />
        </button>
      </div>
      {open && (
        <div className="grid gap-3 border-t border-slate-100 p-3 sm:grid-cols-2">
          <Field label="Título"><input className="input py-2" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Video ID (Bunny videoId / Mux playbackId)">
            <input className="input py-2 font-mono text-sm" value={draft.videoId ?? ''} onChange={(e) => setDraft({ ...draft, videoId: e.target.value })} />
          </Field>
          <Field label="Descripción" className="sm:col-span-2">
            <textarea rows={2} className="input py-2" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Duración (min)"><input type="number" min={1} className="input py-2" value={draft.durationMinutes} onChange={(e) => setDraft({ ...draft, durationMinutes: Number(e.target.value) })} /></Field>
          <Field label="Posición"><input type="number" min={0} className="input py-2" value={draft.position} onChange={(e) => setDraft({ ...draft, position: Number(e.target.value) })} /></Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.isFreePreview} onChange={(e) => setDraft({ ...draft, isFreePreview: e.target.checked })} className="h-4 w-4" />
            Vista previa gratuita
          </label>
          <div className="flex justify-end">
            <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary py-2 text-sm"><Check size={16} aria-hidden /> Guardar</button>
          </div>
        </div>
      )}
    </li>
  );
}

function ModuleCard({ mod, onChanged }: { mod: AdminModule; onChanged: () => void }) {
  const [title, setTitle] = useState(mod.title);
  const [newLesson, setNewLesson] = useState('');
  useEffect(() => setTitle(mod.title), [mod.title]);

  const rename = useMutation({ mutationFn: () => api(`/admin/modules/${mod.id}`, { method: 'PUT', body: { title } }), onSuccess: onChanged });
  const remove = useMutation({ mutationFn: () => api(`/admin/modules/${mod.id}`, { method: 'DELETE' }), onSuccess: onChanged });
  const addLesson = useMutation({
    mutationFn: () => api('/admin/lessons', { method: 'POST', body: { moduleId: mod.id, title: newLesson, position: mod.lessons.length } }),
    onSuccess: () => {
      setNewLesson('');
      onChanged();
    },
  });

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex gap-2">
        <input className="input py-2 font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Título del módulo" />
        {title !== mod.title && <button onClick={() => rename.mutate()} className="btn-primary px-3 py-2" aria-label="Guardar título"><Check size={16} aria-hidden /></button>}
        <button onClick={() => confirm('¿Eliminar módulo y sus lecciones?') && remove.mutate()} className="rounded-xl px-3 text-rose-600 hover:bg-rose-50" aria-label="Eliminar módulo">
          <Trash2 size={16} aria-hidden />
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {mod.lessons.map((l) => <LessonRow key={l.id} lesson={l} onChanged={onChanged} />)}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (newLesson.trim().length >= 2) addLesson.mutate();
        }}
      >
        <input className="input py-2 text-sm" placeholder="Nueva lección…" value={newLesson} onChange={(e) => setNewLesson(e.target.value)} />
        <button type="submit" className="btn-ghost shrink-0 py-2 text-sm"><Plus size={16} aria-hidden /> Lección</button>
      </form>
    </div>
  );
}

// ─── Editor ────────────────────────────────────────────────────────────────
export default function CourseEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [newModule, setNewModule] = useState('');
  const [saved, setSaved] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ['admin', 'course', id],
    queryFn: () => api<AdminCourse>(`/admin/courses/${id}`),
    enabled: !isNew,
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, dirtyFields } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toForm(),
  });
  useEffect(() => {
    if (course) reset(toForm(course));
  }, [course, reset]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'course', id] });
    qc.invalidateQueries({ queryKey: ['courses'] });
  };

  const save = useMutation({
    mutationFn: (v: FormValues) =>
      isNew
        ? api<AdminCourse>('/admin/courses', { method: 'POST', body: toPayload(v) })
        : api<AdminCourse>(`/admin/courses/${id}`, { method: 'PUT', body: toPayload(v) }),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (isNew) navigate(`/admin/cursos/${c.id}`, { replace: true });
    },
  });

  const addModule = useMutation({
    mutationFn: () => api('/admin/modules', { method: 'POST', body: { courseId: id, title: newModule, position: course?.modules?.length ?? 0 } }),
    onSuccess: () => {
      setNewModule('');
      refresh();
    },
  });

  if (!isNew && (isLoading || !course)) return <PageLoader />;

  const e = (k: keyof FormValues) => errors[k]?.message as string | undefined;
  const serverError = save.error instanceof ApiError ? save.error : null;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <Link to="/admin/cursos" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700"><ArrowLeft size={16} aria-hidden /> Cursos</Link>
        <h1 className="mt-2 text-2xl font-extrabold">{isNew ? 'Nuevo curso' : course!.title}</h1>
      </div>

      <form onSubmit={handleSubmit((v) => save.mutate(v))} className="card grid gap-4 p-6 sm:grid-cols-2" noValidate>
        <Field label="Título" error={e('title')}>
          <input
            className="input"
            {...register('title', {
              onChange: (ev) => isNew && !dirtyFields.slug && setValue('slug', slugify(ev.target.value)),
            })}
          />
        </Field>
        <Field label="Slug (URL)" error={e('slug')}><input className="input font-mono text-sm" {...register('slug')} /></Field>
        <Field label="Subtítulo" error={e('subtitle')} className="sm:col-span-2"><input className="input" {...register('subtitle')} /></Field>
        <Field label="Descripción" error={e('description')} className="sm:col-span-2"><textarea rows={4} className="input" {...register('description')} /></Field>
        <Field label="Nivel">
          <select className="input" {...register('level')}>{['A1', 'A2', 'B1', 'B2', 'C1'].map((l) => <option key={l}>{l}</option>)}</select>
        </Field>
        <Field label="Objetivo">
          <select className="input" {...register('goal')}>
            <option value="CONVERSATION">Conversación</option>
            <option value="BUSINESS">Negocios</option>
            <option value="EXAM">IELTS / TOEFL</option>
            <option value="KIDS">Niños</option>
          </select>
        </Field>
        <Field label="Precio (COP)" error={e('priceCOP')}><input type="number" min={0} step={1000} className="input" {...register('priceCOP')} /></Field>
        <Field label="Precio antes (COP, opcional)"><input type="number" min={0} step={1000} className="input" {...register('compareAtCOP')} /></Field>
        <Field label="Badge">
          <select className="input" {...register('badge')}>
            <option value="">Ninguno</option>
            <option value="BESTSELLER">Más vendido</option>
            <option value="NEW">Nuevo</option>
          </select>
        </Field>
        <Field label="Duración (horas)"><input type="number" min={0} className="input" {...register('durationHours')} /></Field>
        <Field label="Imagen de portada (URL)" error={e('coverImage')}><input className="input" {...register('coverImage')} /></Field>
        <Field label="Color de portada">
          <div className="flex gap-2">
            <input type="color" className="h-12 w-14 cursor-pointer rounded-lg border border-slate-300" value={watch('coverColor')} onChange={(ev) => setValue('coverColor', ev.target.value, { shouldDirty: true })} aria-label="Selector de color" />
            <input className="input font-mono text-sm" {...register('coverColor')} />
          </div>
        </Field>
        <Field label="Trailer (URL de embed pública)" error={e('previewVideoUrl')} className="sm:col-span-2"><input className="input" {...register('previewVideoUrl')} /></Field>
        <Field label="Instructor" error={e('instructorName')}><input className="input" {...register('instructorName')} /></Field>
        <Field label="Foto del instructor (URL)" error={e('instructorAvatar')}><input className="input" {...register('instructorAvatar')} /></Field>
        <Field label="Bio del instructor" className="sm:col-span-2"><textarea rows={2} className="input" {...register('instructorBio')} /></Field>
        <Field label="Lo que vas a aprender (uno por línea)" className="sm:col-span-2"><textarea rows={4} className="input" {...register('whatYouLearn')} /></Field>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="h-4 w-4" {...register('published')} /> Publicado (visible en el catálogo)
        </label>
        <div className="flex items-center justify-end gap-3">
          {serverError && <p className="text-sm text-rose-600" role="alert">{serverError.message}</p>}
          {saved && <p className="text-sm font-medium text-emerald-700">Guardado ✓</p>}
          <button type="submit" disabled={save.isPending} className="btn-primary">
            {save.isPending && <Spinner className="h-4 w-4 border-white/40 border-t-white" />} {isNew ? 'Crear curso' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {!isNew && course && (
        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-bold">Módulos y lecciones</h2>
          {course.modules?.map((m) => <ModuleCard key={m.id} mod={m} onChanged={refresh} />)}
          <form
            className="flex gap-2"
            onSubmit={(ev) => {
              ev.preventDefault();
              if (newModule.trim().length >= 2) addModule.mutate();
            }}
          >
            <input className="input" placeholder="Nuevo módulo…" value={newModule} onChange={(ev) => setNewModule(ev.target.value)} />
            <button type="submit" className="btn-primary shrink-0"><Plus size={16} aria-hidden /> Módulo</button>
          </form>
        </section>
      )}
    </div>
  );
}
