# Sanchari Platform

Admin-managed public site for Sanchari: content and images are entirely
controlled from `/admin`, and any edit an admin makes is live on the
homepage immediately — no rebuild or redeploy needed for content changes.

This is the trust-building Phase 1 build: a public homepage plus a full
admin panel (login, password reset, hero/categories/testimonials/gallery
management, inquiry inbox). Booking, payments and invoicing are a later
phase — see project notes.

## Stack

- Next.js 16 (App Router, TypeScript) + Tailwind CSS
- Prisma ORM — SQLite for local dev/test, Postgres in production
- Hand-rolled session auth (bcrypt + DB-backed sessions/reset tokens) — no
  third-party auth library
- Swappable adapters for storage (local disk in dev, Cloudinary in
  production) and email (console-logged in dev, Resend in production),
  selected automatically based on which env vars are set
- Vitest + Testing Library for the test suite (built test-first throughout)

## Local development

No third-party accounts are required to run this locally.

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Then:

- Visit `http://localhost:3000` for the public site.
- Visit `http://localhost:3000/admin/login` and sign in with the
  `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` from your `.env`.
- Edit the hero text, add a category, upload a gallery image — the
  homepage reflects it immediately on refresh, no restart needed.
- Try "Forgot password?" — since no `RESEND_API_KEY` is set, the reset
  link is printed to the terminal running `npm run dev` instead of emailed.
  Copy it into the browser to complete the flow.

## Testing

```bash
npm test        # full suite (unit + integration), runs once
npm run test:watch
npm run lint
npm run typecheck
npm run build   # production build
```

Tests run against a separate SQLite file (`prisma/test.db`), so running the
suite never touches data used for manual `npm run dev` demos. Test files run
sequentially (see `vitest.config.mts`) since they share that one database
file — parallel file execution caused cross-file races.

## Deploying

The app is designed to deploy to Vercel with three free-tier services
providing the persistent pieces local dev fakes:

1. **Neon** (Postgres) — create a project, copy its connection string into
   `DATABASE_URL` in Vercel's environment variables.
2. **Cloudinary** — create an account, copy the "API Environment variable"
   value into `CLOUDINARY_URL`. Once this is set, image uploads
   automatically switch from local disk to Cloudinary — no code change.
3. **Resend** — create an account and API key, set `RESEND_API_KEY` and
   `RESEND_FROM_EMAIL`. Once set, password-reset emails switch from
   console-logging to actually sending — no code change.
4. Set `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`, and
   `NEXT_PUBLIC_SITE_URL` (the deployed URL) as well.
5. Import the GitHub repo into Vercel — it auto-deploys on every push to
   `main`.

### First Postgres deploy — read before you do this

SQLite and Postgres migration histories are **not interchangeable**. Do not
just flip the `provider` in `prisma/schema.prisma` and reuse the existing
`prisma/migrations` folder — the SQL in there is SQLite-specific. Instead,
for the first Postgres deploy:

```bash
rm -rf prisma/migrations
# set DATABASE_URL to the Neon connection string, and provider to "postgresql"
npx prisma migrate dev --name init
npm run db:seed
```

Commit the freshly generated `prisma/migrations` folder — from that point on,
`prisma migrate deploy` runs normally against Postgres on every deploy.

## Project structure

```
prisma/schema.prisma       Database schema (SQLite locally, Postgres in prod)
prisma/seed.ts             Creates the one admin account + starter content
src/lib/                   Auth, sessions, rate limiting, storage/email adapters,
                            content repositories — all test-driven
src/app/api/               REST API routes (auth, admin content, public inquiry)
src/app/admin/(public)/    Login, forgot-password, reset-password — no auth gate
src/app/admin/(protected)/ Dashboard, hero, categories, testimonials, gallery,
                            inquiries — gated by src/app/admin/(protected)/layout.tsx
src/app/page.tsx           Public homepage (force-dynamic — always reads live data)
src/proxy.ts               Edge-runtime cookie-presence check only (see comments —
                            the real session validation can't run here)
tests/                     Mirrors src/, unit + integration tests
```

## What's deliberately not here yet

Online payments, real-time booking/availability, and invoicing are a
separate, later phase. See the project's WRD and proposal documents for the
full roadmap — this build covers the full public site (packages, itineraries,
about, contact) and its admin panel, with enquiries as lead-capture only —
no payment gateway or booking engine yet.
