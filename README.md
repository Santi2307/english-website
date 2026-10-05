# English Academy

A speaking-first English learning platform for Spanish speakers: real-life conversation practice, interactive lessons, and paid learning paths with local payments (Colombia).

**Live:** [english-website-orpin.vercel.app](https://english-website-orpin.vercel.app)

## Features

- **Interactive lessons:** vocabulary, grammar, dialogues with voice role-play, pronunciation practice, and 9 exercise types with spaced review.
- **Adaptive level test:** CEFR placement (A1–C1) built from a generative question bank, so the same question is never shown twice to a user.
- **Payments:** checkout through Wompi (cards, PSE, Nequi), with server-side pricing, signed requests, and idempotent webhooks.
- **Student dashboard:** progress, streaks, and PDF certificates.
- **Admin panel:** courses, lesson content, orders, coupons, and metrics.
- **Transactional email:** event-driven, with retries, preferences, and bilingual templates.
- **Bilingual UI** (ES/EN), mobile-first and accessible.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4, TanStack Query, Framer Motion, i18next |
| Backend | Node.js, Express 5, TypeScript, Prisma, Zod |
| Database | PostgreSQL |
| Integrations | Wompi (payments), Brevo / Resend (email), Bunny Stream / Mux (signed video), Web Speech API |
| Infrastructure | Vercel (web), Render (API), Neon (Postgres) |

## Architecture

```
Browser ──► Vercel (React SPA) ──/api/* rewrite──► Render (Express API) ──► PostgreSQL (Neon)
                                                        │
                                   Wompi webhooks ──────┤──► Brevo (email)
                                                        └──► Bunny / Mux (signed video URLs)
```

- **First-party session cookie.** The SPA proxies `/api` to the backend, so the JWT lives in an `httpOnly`, `SameSite=Lax` cookie with no third-party cookie issues. State-changing requests require an anti-CSRF header.
- **Server-authoritative payments.** Prices, coupons, and integrity signatures are computed only on the server. Webhooks are verified, checked against the order amount, and applied idempotently.
- **Event-driven notifications.** Services emit domain events. A notification engine handles templating, user preferences, deduplication, and retries with backoff.
- **Validated configuration and content.** Environment variables and lesson content are validated with Zod, so the app fails fast at startup instead of at runtime.

## Getting started

**Prerequisites:** Node.js 20+ and Docker (or any PostgreSQL instance).

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env

npm run db:up        # start PostgreSQL in Docker
npm run db:migrate   # apply migrations
npm run db:seed      # sample courses, lessons, users, and coupons

npm run dev          # API on :4000, web on :5173
```

Seeded accounts and coupons are defined in [`server/prisma/seed.ts`](server/prisma/seed.ts). In local development, emails are written to `server/.email-previews/` instead of being sent.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run API and web in watch mode |
| `npm run build` | Build server and client |
| `npm run typecheck` | Type-check both workspaces |
| `npm test --workspace server` | Run the server test suite (Vitest) |
| `npm run seed:content --workspace server` | Sync lesson content without touching user data |

## Project structure

```
client/             React SPA
  src/components/   UI by domain (home, lesson, course, layout, ui)
  src/pages/        Routes (public, dashboard, admin)
  src/data/         Copy, question banks, and static content
server/             Express API
  prisma/           Schema, migrations, seed, and lesson content
  src/              Routes → controllers → services, middleware, notifications
render.yaml         Render blueprint for the API
```

## Deployment

The project deploys on free tiers: Vercel for the web, Render for the API, and Neon for PostgreSQL. See the step-by-step guide in [DEPLOY.md](DEPLOY.md) (in Spanish).

## Security

- Input validation with Zod and HTML sanitization on every request body.
- `helmet`, CORS restricted to the client origin, and rate limiting on auth, email, and order endpoints.
- bcrypt password hashing, session invalidation when a password changes, and only hashed tokens stored for email links.
- Role-based admin routes, signed and expiring video URLs, and constant-time webhook signature checks.
