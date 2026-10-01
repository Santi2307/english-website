import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '../course/CourseCard';
import { Reveal } from '../ui/Reveal';

function Skeleton() {
  return <div className="h-[440px] animate-pulse rounded-2xl bg-white/60" />;
}

export function CoursesShowcase() {
  const { t } = useTranslation();
  const { data, isLoading } = useCourses({ sort: 'popular' });

  return (
    <section id="cursos" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">{t('coursesSection.title')}</h2>
            <p className="mt-3 text-slate-600">{t('coursesSection.subtitle')}</p>
          </div>
          <Link to="/cursos" className="btn-glass self-start py-2.5 text-sm sm:self-auto">{t('coursesSection.all')} →</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} />)
            : data?.slice(0, 4).map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
