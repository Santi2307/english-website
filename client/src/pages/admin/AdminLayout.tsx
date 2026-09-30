import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, ExternalLink, Receipt, TicketPercent } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/Spinner';
import { cn } from '@/lib/format';

const NAV = [
  { to: '/admin', label: 'Métricas', icon: BarChart3, end: true },
  { to: '/admin/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/admin/ordenes', label: 'Órdenes', icon: Receipt },
  { to: '/admin/cupones', label: 'Cupones', icon: TicketPercent },
];

export default function AdminLayout() {
  return (
    <div className="min-h-dvh bg-slate-50 lg:flex">
      <Seo title="Admin · English Academy" noindex />
      <aside className="border-b border-slate-200 bg-brand-950 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:shrink-0 lg:border-0">
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/admin" className="font-extrabold">EA <span className="text-brand-300">Admin</span></Link>
          <Link to="/" className="flex items-center gap-1 text-xs text-brand-300 hover:text-white">Sitio <ExternalLink size={12} aria-hidden /></Link>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn('flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium', isActive ? 'bg-white/15 text-white' : 'text-brand-200 hover:bg-white/5')
              }
            >
              <Icon size={16} aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
