import type { Request, Response } from 'express';
import * as prefs from '../services/notificationPreferences.service.js';

export async function getPreferences(req: Request, res: Response) {
  res.json(await prefs.getPreferences(req.user!.id));
}

export async function updatePreferences(req: Request, res: Response) {
  res.json(await prefs.updatePreferences(req.user!.id, req.body));
}

/**
 * La usa la página /preferencias/baja y también el "one-click unsubscribe"
 * (RFC 8058) de Gmail/Apple Mail, que hace POST directo a esta URL.
 */
export async function unsubscribe(_req: Request, res: Response) {
  res.json(await prefs.unsubscribe(res.locals.query.token));
}
