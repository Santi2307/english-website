# Despliegue gratis: Vercel + Render + Neon + Brevo

Esta guía publica la plataforma completa (web, API, base de datos y emails) **sin pagar y sin tarjeta de crédito**.

```
Usuario ──► Vercel (web)  ──/api──►  Render (API Express)  ──►  Neon (PostgreSQL)
                                          │
                                          ├──►  Brevo (emails)
                                          └──◄  Wompi (webhook de pagos)

cron-job.org ──cada 10 min──► Render /api/health   (evita que el servidor se duerma)
```

| Servicio | Plan gratis | Límite que importa |
|---|---|---|
| Vercel | Hobby | Sobra para este proyecto |
| Render | Free | 750 h al mes (alcanza para 1 servicio 24/7). Se duerme tras 15 min sin tráfico. |
| Neon | Free | 0,5 GB y 100 horas de cómputo al mes. Se suspende tras 5 min sin uso. |
| Brevo | Free | 300 emails al día |
| cron-job.org | Gratis | — |

> **Por qué así:**
> - El Postgres gratis de Render **se borra a los 30 días**; Neon no expira.
> - Render gratis **bloquea SMTP**, así que los emails van por la API HTTP de Brevo.
> - Resend gratis solo envía a tu propio correo si no tienes un dominio verificado.

Sigue los pasos en orden, porque cada uno usa datos del anterior. Tiempo estimado: 40 minutos.

---

## 1. Base de datos en Neon

1. Crea una cuenta en [neon.com](https://neon.com) (puedes entrar con GitHub).
2. Crea un proyecto:
   - **Name:** `english-academy`
   - **Postgres version:** la que venga por defecto
   - **Region:** **AWS US East (N. Virginia)**, la misma región que usaremos en Render.
3. En **Connect**, desactiva **Connection pooling** y copia el connection string. Se ve así:
   ```
   postgresql://neondb_owner:XXXX@ep-algo-123.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   Guárdalo: es tu `DATABASE_URL`. Si al migrar Prisma se queja del parámetro `channel_binding`, quítalo de la URL.
4. Desde tu computador, crea las tablas y carga los cursos de ejemplo:
   ```bash
   cd english-website/server
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require" npx prisma migrate deploy

   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST.neon.tech/neondb?sslmode=require" npx prisma migrate deploy
   
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require" npm run seed
   ```
   El seed también carga el contenido interactivo de las 36 lecciones. Si en el futuro editas el contenido en `server/prisma/content/`, actualízalo en producción con:
   ```bash
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require" npm run seed:content
   ```
   El seed crea el admin (`admin@englishacademy.co` / `Admin12345!`). **Cambia esa contraseña** desde Ajustes apenas entres.

## 2. Emails con Brevo

1. Crea una cuenta en [brevo.com](https://www.brevo.com) con el plan **Free**.
2. **Verifica el remitente:** ve a **Senders, Domains & Dedicated IPs → Senders → Add a sender**, usa tu Gmail (o el correo que quieras) y confirma el email que te llega.
3. **Crea la API key:** ve a **SMTP & API → API Keys → Generate a new API key** y cópiala (empieza con `xkeysib-`). Es tu `BREVO_API_KEY`.

> **Sobre el remitente:** como Gmail no es un dominio tuyo, Brevo reescribe la dirección técnica del remitente para cumplir las reglas de Gmail y Yahoo. Tus usuarios verán **"English Academy"** como nombre, y si responden, la respuesta llega a tu `EMAIL_REPLY_TO`. Cuando compres un dominio (~US$10 al año), autentícalo en Brevo (SPF y DKIM) para que se vea `hola@tudominio.com` y mejore la entregabilidad.

## 3. Backend en Render

1. Crea una cuenta en [render.com](https://render.com) entrando con GitHub.
2. Ve a **New → Blueprint**, elige el repo `Santi2307/english-website` y dale **Apply**. Render lee `render.yaml` y crea el servicio `english-academy-api` (plan Free, región Virginia).
3. Te pedirá las variables marcadas como `sync: false`:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | El connection string de Neon (paso 1) |
   | `CLIENT_URL` | La URL de tu web en Vercel, p. ej. `https://english-website.vercel.app` (sin `/` al final) |
   | `API_URL` | `https://english-academy-api.onrender.com`. Confírmala en el dashboard del servicio cuando se cree. |
   | `EMAIL_FROM` | `English Academy <el-email-que-verificaste@gmail.com>` |
   | `EMAIL_REPLY_TO` | El mismo email u otro donde quieras recibir respuestas |
   | `SUPPORT_EMAIL` | El email que verán los usuarios para pedir ayuda |
   | `BREVO_API_KEY` | `xkeysib-...` (paso 2) |
   | `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET` | Tus llaves de **pruebas** de Wompi (`pub_test_…`, etc.) |
   | `GOOGLE_CLIENT_ID` | Déjalo vacío si no usas login con Google |

   `JWT_SECRET` y `BREVO_WEBHOOK_TOKEN` se generan solos. Las demás ya vienen configuradas.
4. Espera a que termine el primer deploy (3-5 minutos). En **Logs** deberías ver:
   ```
   All migrations have been successfully applied.
   🚀 API lista en http://localhost:10000 (Wompi: sandbox)
   📬 Notificaciones activas (EMAIL_MODE=live, proveedor=brevo)
   ```
5. **Prueba:** abre `https://english-academy-api.onrender.com/api/health`. Debe responder `{"ok":true}`.

> Si el arranque falla por una variable, el log dice exactamente cuál (`❌ Variables de entorno inválidas: …`).

## 4. Conectar la web (Vercel)

1. Revisa `client/vercel.json`: debe apuntar a la URL real de Render. Si Render te asignó otra (p. ej. `english-academy-api-x1y2.onrender.com`), reemplázala en las dos líneas, haz commit y push.
2. En Vercel, ve a **Project → Settings → Environment Variables** y agrega:
   - `VITE_SITE_URL` = tu URL de Vercel
   - `VITE_WHATSAPP_NUMBER` = `573151378651`
   - Opcionales: `VITE_GOOGLE_CLIENT_ID`, `VITE_GA_MEASUREMENT_ID`, `VITE_META_PIXEL_ID`
3. **Redeploy** para aplicar los cambios.

La web llama a `/api/...` en su propio dominio y Vercel lo reenvía a Render. Así la cookie de sesión es del mismo sitio y funciona también en iPhone y Safari.

## 5. Mantener el servidor despierto (cron-job.org)

Render gratis se duerme tras 15 minutos sin visitas, y la siguiente visita tarda ~1 minuto en despertarlo. Lo evitamos con un ping gratuito:

1. Crea una cuenta en [cron-job.org](https://cron-job.org).
2. **Create cronjob:**
   - **URL:** `https://english-academy-api.onrender.com/api/health`
   - **Schedule:** cada **10 minutos**
3. Guarda.

`/api/health` **no toca la base de datos**, así que Neon sigue durmiendo cuando no hay usuarios y no gasta horas. Un servicio despierto 24/7 consume ~730 de las 750 horas gratis de Render.

## 6. Webhooks

**Wompi.** En el dashboard de Wompi (modo pruebas), ve a **Desarrolladores → URL de eventos** y pega:
```
https://english-academy-api.onrender.com/api/webhooks/wompi
```

**Brevo (opcional, recomendado).** Sirve para que el log marque los emails como entregados o rebotados, y para dejar de escribirle a direcciones inválidas.
1. En Render, copia el valor de `BREVO_WEBHOOK_TOKEN` (en **Environment**).
2. En Brevo, ve a **Transactional → Settings → Webhooks → Add a new webhook**:
   - **URL:** `https://english-academy-api.onrender.com/api/webhooks/brevo?token=EL_TOKEN`
   - **Eventos:** Delivered, Hard bounce, Invalid email, Blocked, Complaint

## 7. Verificación final

En tu web de Vercel:

1. Regístrate con un email real tuyo. Deberías recibir **"Bienvenido a English Academy"** y **"Confirma tu email"**; revisa también spam y promociones.
2. Abre el link de verificación y comprueba que dice "¡Email verificado!".
3. Prueba **¿Olvidaste tu contraseña?** y que llegue el email.
4. Compra un curso con el cupón `TEST100` y comprueba que llega el recibo.

Si algo no llega, revisa en este orden:
- **Render → Logs.** Cada envío deja una línea `[notifications] enviado …` o `FALLÓ … <motivo>`.
- **Brevo → Transactional → Logs.**
- **El log de notificaciones en Neon (SQL Editor):**
  ```sql
  select "eventType", template, recipient, status, attempts, "errorMessage", "createdAt"
  from "Notification" order by "createdAt" desc limit 20;
  ```

## Problemas comunes

| Síntoma | Causa y solución |
|---|---|
| "No pudimos conectar con el servidor" en la web | Render está desplegando o dormido, o `vercel.json` apunta a otra URL. Abre `/api/health` directamente. |
| Brevo `401 unauthorized` en los logs | `BREVO_API_KEY` incorrecta |
| Brevo `400` sobre el sender | El email de `EMAIL_FROM` no está verificado en Brevo (paso 2.2) |
| Los links de los emails van a `localhost` | `CLIENT_URL` en Render quedó mal |
| Login funciona pero la sesión se pierde | `CLIENT_URL` no coincide exactamente con la URL de Vercel |
| "Demasiados intentos" para todos los usuarios | `TRUST_PROXY` debe ser `2` (ya viene así en `render.yaml`) |

## Cuando crezcas

- **Dominio propio:** autentícalo en Brevo (o cambia a `EMAIL_PROVIDER=resend`) y actualiza `CLIENT_URL`, `index.html` y `robots.txt`.
- **Render Starter (US$7 al mes):** sin suspensión, y ya no necesitas cron-job.org.
- **Producción de pagos:** cambia a `WOMPI_ENV=production` con las llaves `pub_prod_…`, que deben ir **solo** en el dashboard de Render y nunca en el repo.
