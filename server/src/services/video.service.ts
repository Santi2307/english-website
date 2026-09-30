import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type Playback = { provider: 'bunny' | 'mux'; embedUrl: string; expiresAt: string } | null;

/**
 * Genera una URL de reproducción firmada y con expiración.
 * - Bunny Stream: token = SHA256_HEX(tokenKey + videoId + expires)
 * - Mux: JWT RS256 con aud "v" firmado con la signing key
 */
export function signedPlayback(videoId: string | null): Playback {
  if (!videoId) return null;
  const expires = Math.floor(Date.now() / 1000) + env.VIDEO_URL_TTL_SECONDS;
  const expiresAt = new Date(expires * 1000).toISOString();

  if (env.VIDEO_PROVIDER === 'bunny' && env.BUNNY_LIBRARY_ID && env.BUNNY_TOKEN_KEY) {
    const token = crypto.createHash('sha256').update(`${env.BUNNY_TOKEN_KEY}${videoId}${expires}`).digest('hex');
    return {
      provider: 'bunny',
      embedUrl: `https://iframe.mediadelivery.net/embed/${env.BUNNY_LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true`,
      expiresAt,
    };
  }

  if (env.VIDEO_PROVIDER === 'mux' && env.MUX_SIGNING_KEY_ID && env.MUX_SIGNING_PRIVATE_KEY) {
    const key = Buffer.from(env.MUX_SIGNING_PRIVATE_KEY, 'base64').toString('ascii');
    const token = jwt.sign({ sub: videoId, aud: 'v', exp: expires, kid: env.MUX_SIGNING_KEY_ID }, key, {
      algorithm: 'RS256',
      noTimestamp: true,
    });
    return {
      provider: 'mux',
      embedUrl: `https://player.mux.com/${videoId}?playback-token=${token}`,
      expiresAt,
    };
  }

  return null;
}
