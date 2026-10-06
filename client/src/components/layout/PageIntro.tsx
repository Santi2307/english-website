import type { ReactNode } from 'react';
import { RevealLines, Reveal } from '../ui/Reveal';

/** Apertura de las páginas secundarias: editorial, sin tarjetas, con el mismo ritmo que el home. */
export function PageIntro({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children?: ReactNode }) {
  return (
    <header className="container-page pb-14 pt-12 sm:pb-20 sm:pt-20">
      <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>
      <RevealLines as="h1" className="statement mt-5 max-w-4xl" lines={[title]} delay={0.05} />
      <Reveal as="p" delay={0.15} className="lead mt-6 max-w-2xl">{lead}</Reveal>
      {children}
    </header>
  );
}
