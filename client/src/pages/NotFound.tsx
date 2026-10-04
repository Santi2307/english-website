import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center text-center">
      <Seo title="Página no encontrada · English Academy" noindex />
      <div>
        <p className="text-7xl font-semibold text-slate-200">404</p>
        <h1 className="mt-2 text-2xl font-bold">Oops! Page not found</h1>
        <p className="mt-1 text-slate-600">La página que buscas no existe.</p>
        <Link to="/cursos" className="btn-primary mt-6">Ver cursos</Link>
      </div>
    </div>
  );
}
