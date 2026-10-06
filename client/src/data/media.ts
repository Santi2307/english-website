/**
 * Video del hero.
 *
 * PLACEHOLDER: todavía no hay video definitivo. Mientras `sources` esté vacío,
 * HeroVideo muestra una escena construida con la interfaz (videollamada de
 * entrevista), no un video de stock.
 *
 * Cuando tengas el video final:
 *   1. Exporta 2 versiones sin audio, 6–12 s en loop:
 *      - hero.webm (VP9/AV1) y hero.mp4 (H.264), 1280×720, < 2.5 MB
 *      - hero-vertical.mp4 para móvil (720×900) si el encuadre cambia mucho
 *   2. Exporta el primer fotograma como hero-poster.webp (< 80 KB).
 *   3. Súbelos a client/public/video/ y completa esta config.
 *
 * Qué debería mostrar (ver brief): una persona real en una conversación real
 * (entrevista, reunión, pedir algo), primero insegura y luego más cómoda.
 * Nada de stock genérico ni personas sonriendo a una laptop.
 */
export type VideoSource = { src: string; type: 'video/webm' | 'video/mp4'; media?: string };

export const HERO_VIDEO: { sources: VideoSource[]; poster: string | null; label: string } = {
  sources: [],
  poster: null,
  label: 'Persona respondiendo una entrevista de trabajo en inglés',
};
