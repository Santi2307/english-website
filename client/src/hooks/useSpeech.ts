import { useCallback, useEffect, useRef, useState } from 'react';

/** Voz en inglés del navegador (Web Speech API). Sin costo ni dependencias. */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const pickVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang === 'en-US' && /Samantha|Google US|Jenny|Aria/i.test(v.name)) ?? voices.find((v) => v.lang.startsWith('en-US')) ?? voices.find((v) => v.lang.startsWith('en'));
  };

  const speak = useCallback(
    (text: string, opts: { rate?: number; onEnd?: () => void } = {}) => {
      if (!supported) {
        opts.onEnd?.();
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = opts.rate ?? 0.9;
      const voice = pickVoice();
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        opts.onEnd?.();
      };
      u.onerror = (e) => {
        setSpeaking(false);
        // "interrupted"/"canceled" son nuestros propios stop(): no se cuentan como fin
        if (e.error !== 'interrupted' && e.error !== 'canceled') opts.onEnd?.();
      };
      window.speechSynthesis.speak(u);
    },
    [supported],
  );

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  // Al desmontar, que no siga hablando en otra pantalla
  useEffect(() => stop, [stop]);

  return { speak, stop, speaking, supported };
}

type Recognition = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

/** Reconocimiento de voz (Chrome/Edge/Safari). En Firefox no existe: `supported` = false. */
export function useListen() {
  const recRef = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onresult = (e) => setTranscript(e.results[0][0].transcript);
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => rec.abort();
  }, []);

  const start = useCallback(() => {
    if (!recRef.current) return;
    setTranscript(null);
    setListening(true);
    try {
      recRef.current.start();
    } catch {
      setListening(false);
    }
  }, []);

  return { start, listening, transcript, supported, reset: () => setTranscript(null) };
}

/** % de palabras de la frase objetivo que aparecen en lo que se dijo. */
export function pronunciationScore(target: string, said: string) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
  const t = norm(target);
  const s = new Set(norm(said));
  return { words: t.map((w) => ({ word: w, ok: s.has(w) })), pct: t.length ? Math.round((t.filter((w) => s.has(w)).length / t.length) * 100) : 0 };
}
