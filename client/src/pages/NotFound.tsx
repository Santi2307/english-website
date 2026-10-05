import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/ui/Seo';
import { ErrorState } from '@/components/ui/ErrorState';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={`${t('status.notFoundTitle')} · English Academy`} noindex />
      <ErrorState kind="notFound" />
    </>
  );
}
