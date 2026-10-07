import type { Request } from 'express';
import { clientLocale } from './requestContext.js';

/**
 * Los errores se escriben en español en el código; aquí está su versión en
 * inglés. El error handler y los rate limiters los traducen según el idioma
 * que envía el navegador (X-Client-Locale), así el usuario los lee en el mismo
 * idioma que la página.
 */
const EN: Record<string, string> = {
  // Genéricos
  'Datos inválidos': 'Invalid data',
  'El registro ya existe': 'This record already exists',
  'No encontrado': 'Not found',
  'Ruta no encontrada': 'Route not found',
  'Error interno': 'Something went wrong on our end. Please try again.',
  'No autenticado': 'You need to sign in',
  'No autorizado': "You don't have access to this",
  'Solicitud rechazada': 'Request rejected',

  // Límites de uso
  'Demasiados intentos. Intenta de nuevo en unos minutos.': 'Too many attempts. Try again in a few minutes.',
  'Demasiadas solicitudes de pago. Espera un momento.': 'Too many payment requests. Please wait a moment.',
  'Demasiadas solicitudes. Intenta de nuevo en una hora.': 'Too many requests. Try again in an hour.',

  // Cuenta
  'Email o contraseña incorrectos': 'Incorrect email or password',
  'Ya existe una cuenta con este email': 'An account with this email already exists',
  'La contraseña actual no es correcta': 'Your current password is incorrect',
  'El enlace no es válido o ya expiró. Solicita uno nuevo.': 'This link is invalid or has expired. Request a new one.',
  'El enlace para cancelar la suscripción no es válido': 'This unsubscribe link is invalid',
  'Tu email ya está verificado': 'Your email is already verified',
  'Token inválido': 'Invalid token',
  'Nada que actualizar': 'Nothing to update',
  'Google login no está configurado': 'Google sign-in is not configured',
  'Token de Google inválido': 'Invalid Google token',
  'Email de Google no verificado': 'Your Google email is not verified',

  // Validación de campos
  'Mínimo 8 caracteres': 'At least 8 characters',
  'Debe incluir letras': 'Must include letters',
  'Debe incluir números': 'Must include numbers',
  'Solo minúsculas, números y guiones': 'Only lowercase letters, numbers and hyphens',
  'Solo letras, números, guiones': 'Only letters, numbers and hyphens',
  'El porcentaje no puede superar 100': 'The percentage cannot exceed 100',
  'Debe ser una URL http(s)': 'Must be an http(s) URL',

  // Cursos y aprendizaje
  'Curso no encontrado': 'Course not found',
  'Curso inválido': 'Invalid course',
  'Lección no encontrada': 'Lesson not found',
  'Inicia sesión para ver esta lección': 'Sign in to watch this lesson',
  'No estás inscrito en este curso': "You're not enrolled in this course",
  'Ya estás inscrito en este curso': "You're already enrolled in this course",
  'Solo estudiantes inscritos pueden dejar reseñas': 'Only enrolled students can leave reviews',
  'Completa todas las lecciones para obtener el certificado': 'Complete every lesson to get your certificate',

  // Pagos
  'Cupón inválido o expirado': 'Invalid or expired coupon',
  'Código postal inválido': 'Enter a valid postal code',
  'Orden no encontrada': 'Order not found',
  'Los pagos no están disponibles en este momento': 'Payments are not available right now',
};

/** Traduce un mensaje al idioma del cliente. Si no hay traducción, lo deja igual. */
export function localize(req: Request, message: string): string {
  return clientLocale(req) === 'en' ? (EN[message] ?? message) : message;
}

/** Traduce también los mensajes por campo (detalles de validación). */
export function localizeDetails(req: Request, details: unknown): unknown {
  if (!details || typeof details !== 'object' || clientLocale(req) !== 'en') return details;
  return Object.fromEntries(
    Object.entries(details as Record<string, unknown>).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.map((m) => (typeof m === 'string' ? localize(req, m) : m)) : v,
    ]),
  );
}

export const spanishMessages = () => Object.keys(EN);
