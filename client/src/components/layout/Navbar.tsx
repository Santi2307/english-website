import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth, useAuthActions } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { cn } from '@/lib/format';

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="shrink-0">
      <rect width="64" height="64" rx="15" className="fill-slate-900" />
      <path d="M19 19h21v6.5H26.5v3.75h11.5v6.5H26.5v3.75H40V46H19z" fill="#fff" />
      <circle cx="48" cy="42.5" r="5.5" className="fill-brand-500" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap text-[0.95rem] font-semibold tracking-[-0.01em] text-slate-900">
      <LogoMark />
      <span>English Academy</span>
    </Link>
  );
}

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const es = i18n.language.startsWith('es');
  // Con sesión iniciada, el idioma también queda en la cuenta (idioma de los emails)
  const change = (l: 'es' | 'en') => {
    i18n.changeLanguage(l);
    if (user && user.locale !== l) {
      api<{ user: User }>('/auth/profile', { method: 'PATCH', body: { locale: l } })
        .then((r) => qc.setQueryData(['me'], r.user))
        .catch(() => { /* no bloquea el cambio de idioma en pantalla */ });
    }
  };
  return (
    <div className={cn('inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium', className)} role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => change(l)}
          aria-pressed={(l === 'es') === es}
          className={cn('rounded-md px-2.5 py-1 uppercase transition-colors', (l === 'es') === es ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900')}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Navbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  // Con el menú móvil abierto, la página de atrás no se desplaza
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { to: '/how-it-works', label: t('nav.howItWorks') },
    { to: '/practice', label: t('nav.practice') },
    { to: '/pricing', label: t('nav.pricing') },
  ];
  const startHref = user ? '/mi-cuenta' : '/registro';

  const onLogout = async () => {
    await logout.mutateAsync();
    navigate('/');
  };

  return (
    <>
    {/* Arriba se funde con la página; al bajar, barra sólida y limpia (sin vidrio) */}
    <header className={cn('sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300', open || scrolled ? 'border-slate-200 bg-white' : 'border-transparent bg-transparent')}>
      <nav aria-label="Principal" className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-10">
          <Logo />
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => cn('rounded-md px-3 py-2 text-sm transition-colors duration-200', isActive ? 'font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900')}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link to="/admin" className="btn-quiet btn-sm hidden md:inline-flex">{t('nav.admin')}</Link>}
              <button onClick={onLogout} className="btn-quiet btn-sm hidden md:inline-flex">{t('nav.logout')}</button>
            </>
          ) : (
            <Link to="/ingresar" className="btn-quiet btn-sm hidden md:inline-flex">{t('nav.signIn')}</Link>
          )}
          <Link to={startHref} className="btn-primary btn-sm">{user ? t('nav.dashboard') : t('nav.start')}</Link>
          <button
            className="-mr-2 grid h-10 w-10 place-items-center rounded-lg text-slate-700 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('nav.menu')}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </nav>
    </header>

      {/* Menú móvil: hoja a pantalla completa, con objetivos táctiles grandes.
          Va fuera del <header>: su backdrop-filter crearía un contenedor para el position:fixed */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-white px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden"
          >
            <ul className="divide-y divide-slate-200 border-b border-slate-200">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex h-14 items-center text-lg font-medium text-slate-900">{l.label}</Link>
                </li>
              ))}
              {user?.role === 'ADMIN' && (
                <li><Link to="/admin" className="flex h-14 items-center text-lg font-medium text-slate-900">{t('nav.admin')}</Link></li>
              )}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-slate-500">{t('nav.language')}</span>
              <LanguageToggle />
            </div>
            <div className="mt-auto grid gap-2 pt-8">
              <Link to={startHref} className="btn-primary btn-lg w-full">{user ? t('nav.dashboard') : t('nav.start')}</Link>
              {user ? (
                <button onClick={onLogout} className="btn-secondary btn-lg w-full">{t('nav.logout')}</button>
              ) : (
                <Link to="/ingresar" className="btn-secondary btn-lg w-full">{t('nav.signIn')}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
