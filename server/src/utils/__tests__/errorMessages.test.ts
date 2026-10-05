import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Request } from 'express';
import { describe, expect, it } from 'vitest';
import { localize, localizeDetails, spanishMessages } from '../errorMessages.js';

const req = (headers: Record<string, string>) =>
  ({
    get: (h: string) => headers[h.toLowerCase()],
    acceptsLanguages: () => false,
  }) as unknown as Request;

const en = req({ 'x-client-locale': 'en' });
const es = req({ 'x-client-locale': 'es' });

describe('mensajes de error localizados', () => {
  it('traduce al inglés cuando la página está en inglés', () => {
    expect(localize(en, 'Email o contraseña incorrectos')).toBe('Incorrect email or password');
    expect(localize(es, 'Email o contraseña incorrectos')).toBe('Email o contraseña incorrectos');
  });

  it('traduce los mensajes por campo', () => {
    expect(localizeDetails(en, { password: ['Mínimo 8 caracteres'] })).toEqual({ password: ['At least 8 characters'] });
  });

  it('todo mensaje que el servidor lanza tiene traducción', () => {
    const src = join(import.meta.dirname, '..', '..');
    const files: string[] = [];
    const walk = (d: string) =>
      readdirSync(d).forEach((f) => {
        const p = join(d, f);
        if (statSync(p).isDirectory()) { if (!['__tests__', 'config', 'lessonContent'].includes(f)) walk(p); }
        else if (p.endsWith('.ts')) files.push(p);
      });
    walk(src);
    // Configuración y contenido de lecciones quedan fuera: sus errores no llegan al usuario
    const pattern = /(?:badRequest|unauthorized|forbidden|notFound|conflict)\(\s*'([^']+)'|\.(?:min|max|regex|refine)\([^'\n]*?,\s*'([^']+)'\)|limited\('([^']+)'\)/g;
    const known = new Set(spanishMessages());
    const missing = files.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(pattern)].map((m) => m[1] ?? m[2] ?? m[3]).filter((m) => !known.has(m)),
    );
    expect(missing).toEqual([]);
  });
});
