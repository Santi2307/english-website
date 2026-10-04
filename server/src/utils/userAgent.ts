export type ParsedUserAgent = {
  browser: string | null;
  os: string | null;
  deviceType: 'mobile' | 'tablet' | 'desktop' | null;
};

// Orden importa: Edge/Opera/Samsung incluyen "Chrome" en su UA
const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\//, 'Edge'],
  [/OPR\/|Opera/, 'Opera'],
  [/SamsungBrowser\//, 'Samsung Internet'],
  [/Brave/, 'Brave'],
  [/Firefox\/|FxiOS\//, 'Firefox'],
  [/CriOS\/|Chrome\//, 'Chrome'],
  [/Safari\//, 'Safari'],
];
const OSES: [RegExp, string][] = [
  [/iPhone|iPad|iPod/, 'iOS'],
  [/Android/, 'Android'],
  [/Windows NT/, 'Windows'],
  [/Mac OS X|Macintosh/, 'macOS'],
  [/CrOS/, 'ChromeOS'],
  [/Linux/, 'Linux'],
];

/** Parser mínimo sin dependencias: suficiente para "Chrome en Android · Celular". */
export function parseUserAgent(ua: string | undefined | null): ParsedUserAgent {
  if (!ua) return { browser: null, os: null, deviceType: null };
  const browser = BROWSERS.find(([re]) => re.test(ua))?.[1] ?? null;
  const os = OSES.find(([re]) => re.test(ua))?.[1] ?? null;
  const deviceType = /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))
    ? 'tablet'
    : /Mobi|iPhone|Android/.test(ua)
      ? 'mobile'
      : 'desktop';
  return { browser, os, deviceType };
}
