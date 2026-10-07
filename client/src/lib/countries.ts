import type { Locale } from '@/hooks/useLocale';

/**
 * Países para el checkout: código ISO, prefijo telefónico y reglas de dirección.
 * Los nombres los traduce el navegador (Intl.DisplayNames), así no cargamos
 * listas de nombres en dos idiomas.
 */
const RAW =
  'AF93 AL355 DZ213 AD376 AO244 AG1 AR54 AM374 AU61 AT43 AZ994 BS1 BH973 BD880 BB1 BY375 BE32 BZ501 BJ229 BT975 BO591 BA387 BW267 BR55 BN673 BG359 BF226 BI257 KH855 CM237 CA1 CV238 CF236 TD235 CL56 CN86 CO57 KM269 CG242 CD243 CR506 CI225 HR385 CU53 CY357 CZ420 DK45 DJ253 DM1 DO1 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FJ679 FI358 FR33 GA241 GM220 GE995 DE49 GH233 GR30 GD1 GT502 GN224 GW245 GY592 HT509 HN504 HK852 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IL972 IT39 JM1 JP81 JO962 KZ7 KE254 KI686 KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ML223 MT356 MH692 MR222 MU230 MX52 FM691 MD373 MC377 MN976 ME382 MA212 MZ258 MM95 NA264 NR674 NP977 NL31 NZ64 NI505 NE227 NG234 KP850 MK389 NO47 OM968 PK92 PW680 PS970 PA507 PG675 PY595 PE51 PH63 PL48 PT351 PR1 QA974 RO40 RU7 RW250 KN1 LC1 VC1 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 LK94 SD249 SR597 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TO676 TT1 TN216 TR90 TM993 TV688 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VU678 VA39 VE58 VN84 YE967 ZM260 ZW263 AW297 CW599';

export type Country = { code: string; dial: string; name: string };

/** Los primeros de la lista: el mercado principal y los más frecuentes. */
export const SUGGESTED = ['US', 'CA', 'GB', 'CO', 'MX', 'ES'];

const cache = new Map<Locale, Country[]>();

export function countries(locale: Locale): Country[] {
  const hit = cache.get(locale);
  if (hit) return hit;
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale], { type: 'region' });
  } catch {
    names = null;
  }
  const list = RAW.split(' ')
    .map((t) => {
      const code = t.slice(0, 2);
      return { code, dial: `+${t.slice(2)}`, name: names?.of(code) ?? code };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  cache.set(locale, list);
  return list;
}

export const findCountry = (code: string, locale: Locale) => countries(locale).find((c) => c.code === code);

/** Quita tildes para que "Peru" encuentre "Perú" y "canada" encuentre "Canadá". */
export const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/** Reglas de dirección por país. Las mismas que valida el servidor (order.schema.ts). */
export const POSTAL: Record<string, { pattern: RegExp; required: boolean; example: string }> = {
  US: { pattern: /^\d{5}(-\d{4})?$/, required: true, example: '94103' },
  CA: { pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, required: true, example: 'M5V 2T6' },
  CO: { pattern: /^\d{6}$/, required: false, example: '110111' },
  MX: { pattern: /^\d{5}$/, required: false, example: '06600' },
  ES: { pattern: /^\d{5}$/, required: false, example: '28001' },
  GB: { pattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, required: true, example: 'SW1A 1AA' },
};

/** Países donde el estado/provincia/departamento es obligatorio (igual que el servidor). En el resto es opcional. */
export const REGION_REQUIRED = new Set(['US', 'CA', 'CO', 'MX', 'AU', 'BR']);

type RegionKind = 'department' | 'state' | 'province' | 'county' | 'region';
const REGION: Record<string, RegionKind> = { CO: 'department', US: 'state', MX: 'state', BR: 'state', VE: 'state', AU: 'state', CA: 'province', AR: 'province', ES: 'province', EC: 'province', PA: 'province', GB: 'county', IE: 'county' };
export const regionKind = (code: string): RegionKind => REGION[code] ?? 'region';

/** País inicial razonable: el de la zona horaria del navegador si lo reconocemos, si no Colombia. */
export function guessCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const byZone: Record<string, string> = {
      'America/Bogota': 'CO', 'America/Mexico_City': 'MX', 'America/Lima': 'PE', 'America/Santiago': 'CL',
      'America/Argentina/Buenos_Aires': 'AR', 'America/Caracas': 'VE', 'America/Guayaquil': 'EC', 'America/Panama': 'PA',
      'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Montreal': 'CA', 'America/Edmonton': 'CA',
      'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US', 'America/Phoenix': 'US',
      'Europe/Madrid': 'ES', 'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Australia/Sydney': 'AU',
    };
    return byZone[tz] ?? 'CO';
  } catch {
    return 'CO';
  }
}
