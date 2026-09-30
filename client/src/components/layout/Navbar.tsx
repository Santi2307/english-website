import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import { useAuth, useAuthActions } from '@/hooks/useAuth';
import { cn } from '@/lib/format';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900">
      <img src="/favicon.svg" alt="" width={32} height={32} />
      <span>English<span className="text-brand-600">Academy</span></span>
    </Link>
  );
}

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith('es') ? 'en' : 'es');
  const links = [
    { to: '/cursos', label: t('nav.courses') },
    { to: '/#test-de-nivel', label: t('nav.levelTest') },
    { to: '/#clase-demo', label: t('nav.demo') },
    { to: '/#faq', label: t('nav.faq') },
  ];

  const onLogout = async () => {
    await logout.mutateAsync();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all',
        scrolled ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-lg' : 'bg-transparent',
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Principal">
        <Logo />

        <ul className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className="transition hover:text-brand-600">{l.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={toggleLang} className="btn px-3 py-2 text-sm text-slate-600 hover:bg-slate-100" aria-label={t('nav.language')}>
            <Globe size={16} aria-hidden /> {i18n.language.startsWith('es') ? 'EN' : 'ES'}
          </button>
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link to="/admin" className="btn px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">{t('nav.admin')}</Link>}
              <Link to="/mi-cuenta" className="btn-primary px-4 py-2 text-sm">{t('nav.myCourses')}</Link>
              <button onClick={onLogout} className="btn px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/ingresar" className="btn px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">{t('nav.login')}</Link>
              <Link to="/registro" className="btn-primary px-4 py-2 text-sm">{t('nav.register')}</Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t('nav.menu')}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-200 bg-white md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">{l.label}</Link>
              ))}
              <button onClick={toggleLang} className="flex items-center gap-2 rounded-lg px-3 py-3 text-left font-medium text-slate-700 hover:bg-slate-50">
                <Globe size={18} aria-hidden /> {t('nav.language')}
              </button>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {user ? (
                  <>
                    <Link to="/mi-cuenta" className="btn-primary">{t('nav.myCourses')}</Link>
                    {user.role === 'ADMIN'
                      ? <Link to="/admin" className="btn-ghost">{t('nav.admin')}</Link>
                      : <button onClick={onLogout} className="btn-ghost">{t('nav.logout')}</button>}
                  </>
                ) : (
                  <>
                    <Link to="/ingresar" className="btn-ghost">{t('nav.login')}</Link>
                    <Link to="/registro" className="btn-primary">{t('nav.register')}</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
