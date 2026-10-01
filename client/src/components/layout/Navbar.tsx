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
      <span>English Academy</span>
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
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <nav
        aria-label="Principal"
        className={cn(
          'mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pl-4 pr-2 transition-all duration-300 sm:pl-5',
          scrolled ? 'glass-strong' : 'glass',
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className="transition hover:text-slate-950">{l.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={toggleLang} className="btn px-3 py-2 text-sm text-slate-600 hover:bg-white/60" aria-label={t('nav.language')}>
            <Globe size={16} aria-hidden /> {i18n.language.startsWith('es') ? 'EN' : 'ES'}
          </button>
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link to="/admin" className="btn px-3 py-2 text-sm text-slate-700 hover:bg-white/60">{t('nav.admin')}</Link>}
              <Link to="/mi-cuenta" className="btn-primary px-4 py-2 text-sm">{t('nav.myCourses')}</Link>
              <button onClick={onLogout} className="btn px-3 py-2 text-sm text-slate-500 hover:bg-white/60">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/ingresar" className="btn px-3 py-2 text-sm text-slate-700 hover:bg-white/60">{t('nav.login')}</Link>
              <Link to="/registro" className="btn-primary px-4 py-2 text-sm">{t('nav.register')}</Link>
            </>
          )}
        </div>

        <button
          className="rounded-full p-2 text-slate-700 md:hidden"
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
            className="glass-strong mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-3">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="rounded-2xl px-3 py-3 font-medium text-slate-700 hover:bg-white/60">{l.label}</Link>
              ))}
              <button onClick={toggleLang} className="flex items-center gap-2 rounded-2xl px-3 py-3 text-left font-medium text-slate-700 hover:bg-white/60">
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
