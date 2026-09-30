import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

type Props = { title: string; description?: string; image?: string; noindex?: boolean; jsonLd?: object };

export function Seo({ title, description, image = '/og-image.png', noindex, jsonLd }: Props) {
  const { pathname } = useLocation();
  const url = `${SITE}${pathname}`;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${SITE}${image}`} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
