import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle, Logo } from './Navbar';
import { whatsappUrl } from './WhatsAppButton';
import { track } from '@/lib/analytics';

export function Footer() {
  const { t } = useTranslation();
  const cols = [
    {
      title: t('footer.product'),
      links: [
        { to: '/#como-funciona', label: t('nav.howItWorks') },
        { to: '/#practicar', label: t('nav.practice') },
        { to: '/#test-de-nivel', label: t('nav.levelTest') },
        { to: '/cursos', label: t('nav.courses') },
      ],
    },
    {
      title: t('footer.account'),
      links: [
        { to: '/ingresar', label: t('nav.signIn') },
        { to: '/registro', label: t('nav.register') },
        { to: '/#precios', label: t('nav.pricing') },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 space-y-4 md:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">{t('footer.tagline')}</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="eyebrow">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.to}><Link to={l.to} className="text-slate-600 transition-colors hover:text-slate-900">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="eyebrow">{t('footer.contact')}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={whatsappUrl(t('footer.whatsappMessage'))} target="_blank" rel="noopener noreferrer" onClick={() => track.whatsappClick('footer')} className="text-slate-600 transition-colors hover:text-slate-900">
                WhatsApp
              </a>
            </li>
            <li><a href="#" className="text-slate-600 transition-colors hover:text-slate-900">{t('footer.terms')}</a></li>
            <li><a href="#" className="text-slate-600 transition-colors hover:text-slate-900">{t('footer.privacy')}</a></li>
          </ul>
        </div>
      </div>
      <div className="container-page">
        <div className="flex flex-col gap-4 border-t border-slate-200 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} English Academy. {t('footer.rights')}</p>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
