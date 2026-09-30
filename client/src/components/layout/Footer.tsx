import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './Navbar';
import { whatsappUrl } from './WhatsAppButton';
import { track } from '@/lib/analytics';

const METHODS = ['Visa', 'Mastercard', 'PSE', 'Nequi', 'Bancolombia'];

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-slate-600">{t('footer.tagline')}</p>
          <a
            href={whatsappUrl(t('footer.whatsappMessage'))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track.whatsappClick('footer')}
            className="inline-block text-sm font-semibold text-green-700 hover:underline"
          >
            {t('footer.whatsapp')} →
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm text-slate-600">
          <Link to="/cursos" className="hover:text-brand-600">{t('nav.courses')}</Link>
          <Link to="/#test-de-nivel" className="hover:text-brand-600">{t('nav.levelTest')}</Link>
          <Link to="/#faq" className="hover:text-brand-600">{t('nav.faq')}</Link>
          <Link to="/ingresar" className="hover:text-brand-600">{t('nav.login')}</Link>
          <a href="#" className="hover:text-brand-600">{t('footer.terms')}</a>
          <a href="#" className="hover:text-brand-600">{t('footer.privacy')}</a>
        </nav>
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">{t('footer.payments')} Wompi</p>
          <ul className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <li key={m} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{m}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} English Academy · {t('footer.rights')}
      </p>
    </footer>
  );
}
