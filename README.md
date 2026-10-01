# English Academy — Plataforma de cursos de inglés online 🇨🇴

Plataforma para vender cursos de inglés a estudiantes en Colombia: landing interactiva orientada a conversión, catálogo, checkout con **Wompi** (tarjeta, PSE, Nequi, Botón Bancolombia), dashboard del estudiante con reproductor, racha y certificado PDF, y panel de administración.

## Arquitectura

```
                        ┌──────────────────────────── Vercel ───────────────────────────┐
  Navegador ──────────► │ React 18 + Vite (SPA)                                          │
  (móvil primero)       │   /api/*  y  /sitemap.xml  ──rewrite──►  backend              │
                        └───────────────────────────────┬───────────────────────────────┘
                                                        │  cookie httpOnly first-party
                        ┌──────────────────────── Render ───────────────────────────────┐
  Wompi ──webhook─────► │ Express + TS   routes → controllers → services → Prisma       │ ──► PostgreSQL (Neon)
  (transaction.updated) │   helmet · CORS · rate limit · Zod · sanitización · CSRF       │
                        │   Wompi (firma integridad / checksum eventos / API)           │ ──► Brevo / Resend (email)
                        │   Bunny Stream / Mux (URLs firmadas con expiración)           │
                        └────────────────────────────────────────────────────────────────┘
```

**Decisiones clave**

- **Cookie first-party.** El frontend proxya `/api` al backend (Vite en dev, `vercel.json` en producción). La cookie JWT es `httpOnly; SameSite=Lax`, lo que evita los problemas de cookies de terceros en Safari/iOS. Además, toda petición que cambia estado exige el header `X-Requested-With: fetch` como defensa CSRF.
- **El cliente nunca envía montos.** El precio, el cupón y la firma se calculan en el servidor. El secreto de integridad nunca sale del backend.
- **Webhook idempotente.** El cambio de estado es un `updateMany` condicionado al estado actual, la inscripción usa un `upsert` sobre `@@unique([userId, courseId])` y los efectos secundarios (email, uso del cupón) solo corren si esa llamada hizo la transición. Probado con 3 webhooks idénticos concurrentes: se aplica 1 y los otros 2 quedan como `already_processed`.
- **`/pago/resultado` no confía en la URL.** Consulta la orden al backend. Si sigue `PENDING` (el webhook aún no llega), el backend consulta la transacción **directamente a la API de Wompi** y verifica que la referencia coincida antes de usarla.
- **Rendimiento.** Code splitting por ruta. Las secciones bajo el pliegue son lazy. El 3D (three.js, ~220 KB gzip) se descarga solo en dispositivos capaces y cuando el navegador está libre (`requestIdleCallback`). No se precarga en `index.html`. JS inicial ≈ 150 KB gzip.

## Estructura de carpetas

```
english-website/
├── package.json              # npm workspaces (client, server)
├── docker-compose.yml        # PostgreSQL local
├── server/
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma     # User, Course, Module, Lesson, Order, Enrollment, LessonProgress,
│   │   │                     # Coupon, Review, PaymentEvent, Notification, NotificationPreference,
│   │   │                     # AuthToken, KnownDevice
│   │   ├── migrations/
│   │   └── seed.ts           # 4 cursos + admin + estudiantes demo + cupones
│   └── src/
│       ├── index.ts / app.ts
│       ├── config/env.ts     # variables validadas con Zod (falla al arrancar si falta algo)
│       ├── middleware/       # auth (JWT, roles, CSRF), validate, sanitize, rateLimit, error
│       ├── schemas/          # Zod: auth, course, order, admin
│       ├── routes/           # auth, courses, coupons, orders, me, lessons, admin, webhooks
│       ├── controllers/
│       ├── services/         # auth, course, pricing, payment, wompi, video,
│       │                     # learning, certificate (PDF), admin, notificationPreferences
│       ├── notifications/    # eventos, motor, reglas, canales, proveedores, plantillas, tests
│       └── utils/
└── client/
    ├── .env.example
    ├── vercel.json           # rewrites /api → backend + SPA fallback + cache de assets
    ├── index.html            # meta SEO/OG estáticos + JSON-LD
    ├── public/               # favicon, og-image.png, robots.txt
    └── src/
        ├── main.tsx / App.tsx    # providers + rutas lazy
        ├── i18n/                 # es.ts (fuente de tipos), en.ts
        ├── lib/                  # api, analytics (GA4 + Meta Pixel), wompi, format, types
        ├── hooks/                # useAuth, useCourses, useDeviceCapability
        ├── data/                 # preguntas del test de nivel, testimonios
        ├── components/
        │   ├── layout/           # Navbar, Footer, WhatsAppButton, Layout
        │   ├── landing/          # Hero, Hero3D, StatsBar, LevelTest, DemoLesson,
        │   │                     # CoursesShowcase, Testimonials, Faq, FinalCta
        │   ├── course/           # CourseCard (flip), PriceTag, BadgePill
        │   ├── auth/             # GoogleButton, RequireAuth
        │   └── ui/               # Seo, CourseCover, Stars, Spinner, AnimatedCounter, Reveal
        └── pages/
            ├── Home, Catalog, CourseDetail, Auth, Checkout, PaymentResult, NotFound
            ├── dashboard/        # Dashboard (racha, progreso, certificado), Learn (reproductor)
            └── admin/            # Metrics, Courses, CourseEditor, Orders, Coupons
```

## Correr en local

Requisitos: Node 20+ y Docker (o un PostgreSQL propio).

```bash
npm install                              # instala client y server (workspaces)
cp server/.env.example server/.env       # ajusta si tu Postgres es otro
cp client/.env.example client/.env

npm run db:up                            # levanta PostgreSQL en Docker
npm run db:migrate                       # crea las tablas
npm run db:seed                          # 4 cursos, admin, estudiantes y cupones

npm run dev                              # API :4000 + web :5173
```

Abre http://localhost:5173.

| Usuario | Email | Contraseña |
|---|---|---|
| Admin | `admin@englishacademy.co` | `Admin12345!` |
| Estudiante demo (inscrito en todo) | `valentina@demo.co` | `Demo12345!` |

**Cupones del seed:** `BIENVENIDO20` (20 %) y `TEST100` (100 %: inscribe sin pasar por Wompi, útil para probar el dashboard sin pagar).

## Configurar Wompi (sandbox)

1. Crea una cuenta en [comercios.wompi.co](https://comercios.wompi.co) y cambia al **modo de pruebas**.
2. En **Desarrolladores → Llaves del API** copia a `server/.env`:
   - `WOMPI_PUBLIC_KEY` (`pub_test_...`)
   - `WOMPI_PRIVATE_KEY` (`prv_test_...`)
3. En **Desarrolladores → Secretos para integración técnica** copia:
   - Integridad → `WOMPI_INTEGRITY_SECRET`
   - Eventos → `WOMPI_EVENTS_SECRET`
4. Deja `WOMPI_ENV=sandbox`. Para producción cambia a `production` y usa las llaves `pub_prod_`/`prv_prod_`. El backend elige automáticamente `sandbox.wompi.co` o `production.wompi.co`.

**Datos de prueba en sandbox**

| Método | Aprobado | Rechazado |
|---|---|---|
| Tarjeta | `4242 4242 4242 4242` (cualquier CVC y fecha futura) | `4111 1111 1111 1111` |
| Nequi | `3991111111` | `3992222222` |
| PSE | Banco "que aprueba" | Banco "que rechaza" |

**Flujo implementado**

1. `POST /api/orders { courseId, couponCode? }` crea la orden `PENDING`, aplica el cupón en el servidor, genera una referencia única y la firma `SHA256(referencia + montoEnCentavos + COP + secretoIntegridad)`.
2. El frontend abre el Widget con la llave pública, la referencia, el monto, la firma y `redirectUrl`.
3. `POST /api/webhooks/wompi` valida `SHA256(valores de signature.properties + timestamp + secretoEventos)`, verifica que el monto y la moneda coincidan con la orden, actualiza el estado (`APPROVED`, `DECLINED`, `VOIDED`, `ERROR`) y, **solo si queda `APPROVED`**, crea la inscripción y envía el email. Cada evento queda auditado en `PaymentEvent`.
4. `/pago/resultado?order=…` consulta el estado al backend y hace polling mientras siga `PENDING` (típico en PSE).

## Exponer el webhook con ngrok

Wompi necesita una URL pública para enviar eventos a tu máquina:

```bash
ngrok http 4000
# → https://abcd-1234.ngrok-free.app
```

En Wompi, **Desarrolladores → URL de eventos** (modo pruebas), pega:

```
https://abcd-1234.ngrok-free.app/api/webhooks/wompi
```

Haz una compra de prueba y verás en la consola del backend la transición de la orden. Si el webhook falla, `/pago/resultado` reconcilia consultando la API de Wompi, así que el flujo igual termina bien.

> Sin ngrok puedes simular un evento firmado: calcula el checksum con `WOMPI_EVENTS_SECRET` y haz `POST` a `/api/webhooks/wompi` (ver `verifyEventChecksum` en `server/src/services/wompi.service.ts`).

## Videos (Bunny Stream o Mux)

Las lecciones guardan solo un `videoId`. El backend genera una URL de embed **firmada y con expiración** (`VIDEO_URL_TTL_SECONDS`) únicamente para usuarios inscritos, o para cualquiera si la lección es "vista previa gratuita".

- **Bunny Stream** (recomendado en LATAM por costo): `VIDEO_PROVIDER=bunny`, `BUNNY_LIBRARY_ID` y `BUNNY_TOKEN_KEY`. Activa *Token Authentication* en la librería. En el admin, `videoId` es el GUID del video.
- **Mux**: `VIDEO_PROVIDER=mux`, `MUX_SIGNING_KEY_ID` y `MUX_SIGNING_PRIVATE_KEY` (la clave en base64, tal como la entrega Mux). Usa playback policy *signed*. En el admin, `videoId` es el `playbackId`.
- Con `VIDEO_PROVIDER=none` el reproductor muestra "video no disponible".

El trailer público del curso (`previewVideoUrl`) es una URL de embed normal que no requiere firma.

## Notificaciones y emails

Los emails se disparan por **eventos**. Ningún servicio, controlador ni componente de UI llama a `sendEmail`: publican un hecho de negocio y el motor decide qué enviar.

```
auth / pagos / aprendizaje
  └─ events.emit('USER_REGISTERED', payload, { id: user.id })
       └─ NotificationEngine
            ├─ rules.ts            evento → [canal, plantilla, categoría]
            ├─ preferencias        seguridad y transaccionales siempre pasan
            ├─ idempotencia        clave única "USER_REGISTERED:<id>:email"
            ├─ tabla Notification  log + cola (queued → processing → sent/failed/…)
            └─ EmailChannel → plantilla → EmailProvider (Resend | Preview | Sandbox)
```

Todo vive en `server/src/notifications/`:

| Archivo | Responsabilidad |
|---|---|
| `events.ts` | Catálogo tipado de eventos y bus en proceso |
| `rules.ts` | Qué notificación produce cada evento; separa datos persistibles de sensibles |
| `engine.ts` | Idempotencia, preferencias, supresión por rebote, reintentos, worker |
| `store.ts` | Persistencia (Prisma). La interfaz permite cambiar a BullMQ/SQS |
| `channels/email.channel.ts` | Render + headers `List-Unsubscribe` + entrega |
| `providers/` | `EmailProvider` (Resend sin SDK, Preview a archivos, Sandbox con lista blanca) |
| `templates/` | Componentes (layout, botón, tarjetas, badges, footer) y los 6 emails |
| `preferences.ts` / `unsubscribe.ts` | Política por categoría y tokens de baja firmados |

### Emails incluidos

| Evento | Plantilla | Categoría |
|---|---|---|
| `USER_REGISTERED` | Bienvenida | Transaccional |
| `EMAIL_VERIFICATION_REQUESTED` | Verificar email (24 h, un solo uso) | Transaccional |
| `PASSWORD_RESET_REQUESTED` | Restablecer contraseña (30 min, un solo uso) | Seguridad |
| `PASSWORD_CHANGED` | Alerta de seguridad | Seguridad |
| `NEW_SIGN_IN` | Alerta de seguridad (solo si el dispositivo es nuevo) | Seguridad |
| `ORDER_APPROVED` | Acción completada (recibo) | Transaccional |
| `ORDER_FAILED` | Actualización de cuenta (pago no completado) | Transaccional |
| `ACCOUNT_UPDATED` | Actualización de cuenta | Actividad de la cuenta (opcional) |
| `COURSE_COMPLETED` | Acción completada (certificado) | Actividad de la cuenta (opcional) |

- **Categorías que siempre llegan:** Seguridad y Transaccional. No se pueden desactivar ni tienen link de baja.
- **Categorías opcionales:** Actividad de la cuenta, Novedades y Consejos. Se controlan desde `/mi-cuenta/ajustes`.
- **Marketing:** exige consentimiento explícito con fecha (casilla desmarcada al registrarse), de acuerdo con la Ley 1581 de 2012.

### Probar en local sin enviar nada

Con `EMAIL_MODE=preview` (el valor por defecto) ningún email sale de tu máquina:

- **Vista previa de todas las plantillas y variantes:** http://localhost:4000/api/dev/emails, con enlaces a español, inglés, texto plano y "sin nombre". Solo existe fuera de producción.
- **Emails generados por la app:** se guardan como `.html` y `.txt` en `server/.email-previews/` (ignorada por git). La consola imprime la ruta de cada uno.

**Para recibir emails reales en tu bandeja sin arriesgar a usuarios:**

```
EMAIL_MODE=sandbox
RESEND_API_KEY=re_...
EMAIL_SANDBOX_ALLOWLIST=tu-email@gmail.com
```

Solo las direcciones de la lista reciben el email real; las demás se desvían a preview. El servidor **se niega a arrancar** con `EMAIL_MODE=live` si `NODE_ENV` no es `production`.

### Producción con Resend (con dominio propio)

> Sin dominio propio usa **Brevo** (`EMAIL_PROVIDER=brevo`, el valor por defecto): ver [DEPLOY.md](DEPLOY.md#2-emails-con-brevo).

1. En [resend.com](https://resend.com), verifica tu dominio (registros SPF y DKIM) y crea una API key.
2. Configura las variables:
   ```
   EMAIL_MODE=live
   RESEND_API_KEY=re_...
   EMAIL_FROM="English Academy <hola@tudominio.com>"
   EMAIL_REPLY_TO=...
   SUPPORT_EMAIL=...
   ```
3. Opcional: en Resend, ve a **Webhooks**, apunta a `https://tu-dominio.com/api/webhooks/resend` con los eventos `email.delivered`, `email.bounced` y `email.complained`, y copia el signing secret en `RESEND_WEBHOOK_SECRET`. Con eso el log pasa a `DELIVERED`/`BOUNCED`, y a las direcciones que rebotan se les deja de escribir durante 30 días.

### Garantías

- **Sin duplicados.** Cada notificación tiene una clave de idempotencia única en la base de datos, y la misma clave se envía a Resend (`Idempotency-Key`). Un evento procesado 5 veces produce 1 email.
- **No bloquea.** El registro, el login y los pagos responden de inmediato; el envío corre en segundo plano, y un fallo del proveedor nunca rompe el flujo de negocio.
- **Reintentos.**
  - Errores temporales (timeout, 429, 5xx): se reintentan a los 1 min, 5 min, 30 min y 2 h.
  - Errores permanentes (4xx, dirección inválida): se marcan `FAILED` de inmediato.
  - Si el proceso se cae a mitad de un envío, el lease vence y la notificación vuelve a la cola.
- **Nada sensible en la base de datos.**
  - Los tokens de verificación y reset solo existen en el link del email; en la base de datos queda su hash SHA-256.
  - La IP y la ubicación de las alertas viven solo en memoria.
  - Si el servidor se reinicia antes de enviar, esa notificación falla de forma segura, sin mandar un link roto, y el usuario puede pedir otro.
- **Sesiones.** Cambiar o restablecer la contraseña cierra todas las demás sesiones (`sessionVersion` en el JWT).

**Consultar el log:**

```sql
select "eventType", template, recipient, status, attempts, "errorMessage", "createdAt", "sentAt"
from "Notification" order by "createdAt" desc limit 50;
```

### Cómo extender

- **Un email nuevo:**
  1. Agrega el evento y su payload en `events.ts`.
  2. Crea la plantilla en `templates/` con los componentes existentes y regístrala en `templates/index.ts`.
  3. Agrega la regla en `rules.ts`, con su categoría.
  4. Publica el evento desde el servicio: `void events.emit('MI_EVENTO', payload, { id })`.
- **Otro proveedor (Postmark, SES):** implementa `EmailProvider` y selecciónalo en `providers/index.ts`.
- **Otro canal (SMS, push, in-app):** implementa `Channel` y regístralo en `notifications/index.ts`. Luego agrega reglas con `channel: 'sms'`; ni los emisores ni el motor cambian.

### Tests

```bash
npm test --workspace server
```

62 tests que no usan la base de datos ni el proveedor real. Cubren:
- Render de cada plantilla en los dos idiomas, datos faltantes, escape de HTML y URLs peligrosas.
- Links generados y el flujo de eventos.
- Duplicados (incluidos 5 eventos concurrentes).
- Preferencias y categorías bloqueadas.
- Datos sensibles fuera del log.
- Reintentos, errores permanentes, intentos agotados, leases vencidos y rebotes.
- Clasificación de errores de Resend, el modo sandbox y la firma del webhook.

## Otras integraciones

- **Google login.** Crea un OAuth Client ID tipo *Web* en Google Cloud, agrega tus orígenes (`http://localhost:5173` y tu dominio) y pon el mismo ID en `GOOGLE_CLIENT_ID` (server) y `VITE_GOOGLE_CLIENT_ID` (client). El backend verifica el ID token.
- **Analítica.** Configura `VITE_GA_MEASUREMENT_ID` y `VITE_META_PIXEL_ID`. Se cargan tras la primera interacción (o a los 3 s) para no afectar el LCP. Eventos que se envían:
  - Test de nivel: `level_test_start` y `generate_lead`/`Lead`.
  - Clase demo: `demo_lesson_interaction`.
  - Embudo de compra: `view_item`/`ViewContent`, `begin_checkout`/`InitiateCheckout` y `purchase`/`Purchase` (deduplicado por orden).
  - WhatsApp: `contact`.
- **WhatsApp.** `VITE_WHATSAPP_NUMBER=573151378651` (formato internacional sin `+`).
- **Fotos.** En `client/public/images/people/`, con licencia Unsplash. Ver `CREDITS.md`: son de stock y deben reemplazarse por profes y estudiantes reales antes de lanzar.
- **Testimonios en video.** Pon los `.mp4` en `client/public/videos/` con los nombres de `src/data/testimonials.ts`. Si un archivo no existe, la tarjeta se muestra solo con texto.

## Despliegue

La guía paso a paso está en **[DEPLOY.md](DEPLOY.md)**. Despliega todo gratis y sin tarjeta:

- **Vercel:** la web.
- **Render:** la API, con `render.yaml`.
- **Neon:** PostgreSQL.
- **Brevo:** los emails.
- **cron-job.org:** mantiene la API despierta.

## SEO

- Meta tags, Open Graph y JSON-LD. `index.html` los trae estáticos para la landing, y cada página los sobrescribe con `react-helmet-async`. Hay schema `Course` en el detalle y `FAQPage` en las preguntas frecuentes.
- `/sitemap.xml` es dinámico: lo genera el backend con los cursos publicados.
- **Limitación.** Google ejecuta JavaScript, pero otros crawlers (WhatsApp, Facebook, LinkedIn) solo leen el HTML inicial. Por eso el detalle de cada curso comparte la imagen y el título genéricos. Si el SEO orgánico es prioridad, el siguiente paso recomendado es **migrar la landing, el catálogo y el detalle del curso a Next.js** (SSG/ISR), manteniendo este mismo backend. Una alternativa intermedia es un servicio de prerender (p. ej. Prerender.io) configurado en Vercel.

## Seguridad

- **Entrada:** Zod en todas las rutas y sanitización de HTML en los bodies.
- **HTTP:** `helmet`, CORS restringido a `CLIENT_URL` con credenciales y rate limiting (general, auth y órdenes).
- **Sesión:** JWT en cookie `httpOnly` + `Secure` en producción, header anti-CSRF y login con bcrypt (cost 12) que tarda lo mismo exista o no el email.
- **Autorización:** rutas de admin protegidas por rol. El `videoId` nunca se expone en endpoints públicos. `?next=` solo acepta rutas internas (no hay open redirect).
- **Wompi:** checksum comparado en tiempo constante y verificación de monto y moneda en cada evento.

## Pendientes y siguientes pasos sugeridos

- El panel admin está solo en español. El contenido de los cursos (títulos, descripciones) se guarda en un solo idioma.
- Reembolsos: el estado `VOIDED` revoca la inscripción, pero el reembolso se gestiona en el dashboard de Wompi.
- Tests automatizados (Vitest + Supertest para el webhook y el flujo de orden).
- Verificación pública de certificados por código (`certificateCode` ya existe en `Enrollment`).
