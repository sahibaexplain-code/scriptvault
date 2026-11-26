# ScriptVault

A premium, dark-themed e-commerce store for ready-made YouTube, Instagram Reels and documentary scripts, plus custom script commissions.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres, private Storage) · Razorpay

> **New to this?** Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). It walks you from zero to a live site on Vercel, one click at a time.

---

## Demo mode vs live mode

The site works the moment you run it, with **no keys at all**. It decides its mode from your environment variables, and a banner at the top of every page always tells visitors which mode they're in.

| | **Demo mode** (no Supabase keys) | **Live mode** (Supabase connected) |
|---|---|---|
| Catalogue | 18 sample scripts + 4 bundles from `src/lib/catalog/sample-data.ts` | Read from your Supabase database |
| Accounts | Disabled; login page explains this | Real sign-up, login, password reset |
| Checkout | **Simulated** payment dialog (success or failure) | Real Razorpay checkout, verified on the server |
| Purchases | Saved only in the visitor's browser | Stored in the database |
| Downloads | **Watermarked free preview only.** Paid text is never sent | Full script, only after the server confirms the purchase |
| Admin | Read-only preview with sample data | Upload, edit, price, publish, delete |
| Forms | Validated, nothing stored | Saved to the database |
| Banner | "Demo mode" | "Test payments" with `rzp_test_` keys, none with live keys |

If Supabase is set but Razorpay isn't, the store works and checkout shows "Payments offline".

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. To go live, copy `.env.example` to `.env.local`, fill it in (see below) and restart.

## Environment variables

| Variable | Where to find it | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your site's address, e.g. `https://scriptvault.vercel.app` | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key | No (protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key | **YES** |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay → Account & Settings → API Keys → Key Id | No |
| `RAZORPAY_KEY_SECRET` | Shown once when you generate the key | **YES** |
| `RAZORPAY_WEBHOOK_SECRET` | The secret you type when creating the webhook | **YES** |

**Rule:** only variables starting with `NEXT_PUBLIC_` reach the browser. Never add that prefix to a secret. Secrets are read only in `src/lib/server-env.ts`, which imports `server-only`, so the build **fails** if client code ever tries to import it.

## Database

* `supabase/schema.sql`: tables, Row Level Security policies, the atomic `fulfil_order` function, and storage buckets. Run it once in the Supabase SQL Editor (it is safe to re-run).
* `supabase/seed.sql`: the sample catalogue. Regenerate it after editing the sample data with `npm run seed:sql`.

| Table | Who can read | Who can write |
|---|---|---|
| `scripts`, `bundles`, `bundle_items`, `categories` | Everyone (published rows); buyers (scripts they own); admins (all) | Server (admin API) |
| `script_contents` (**the paid text**) | **Nobody** via the API (RLS on, no policies) | Server only |
| `orders`, `order_items`, `purchases` | The owner and admins | Server only, after payment verification |
| `custom_requests` | The owner and admins | Server (validated API) |
| `contact_messages`, `download_events` | Nobody via the API | Server only |
| `profiles` | The owner and admins | Owner can change `full_name` only; `role` is locked |

### Make yourself an admin

1. Sign up on your site.
2. In Supabase → SQL Editor, run:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

3. Refresh the site. An **Admin** link appears in the header.

## How payments work

```
Browser                        Your server (Vercel)                     Razorpay
───────                        ────────────────────                     ────────
Pay ₹X ──── cart IDs only ───▶ /api/checkout/create-order
                               • signed in?
                               • prices re-read from DB (client prices ignored)
                               • already owned? exclusive still available?
                               • insert order (status: created)  ────▶ create order
◀──────── razorpay_order_id ──
Razorpay checkout (UPI/card) ─────────────────────────────────────────▶ takes payment
◀─────────────────── payment_id + signature ──────────────────────────
POST /api/checkout/verify ───▶ • HMAC-SHA256 signature check (timing-safe)
                               • fetch payment from Razorpay: right order,
                                 right amount, captured/authorized? ──▶
                               • fulfil_order() → purchases rows
                                                                        webhook
/api/webhooks/razorpay ◀────── same fulfil_order(), signature-checked ◀─ payment.captured
```

`fulfil_order` runs in one database transaction and is **idempotent**: if both the browser callback and the webhook arrive, the order is fulfilled once. If two customers race to buy the same exclusive licence, the first verified payment wins and the second order is marked **review** (shown in Admin → Orders) for a refund.

## How downloads are protected

`GET /api/download/<scriptId>?format=pdf|docx`

1. Verifies the session with Supabase Auth (cookie-based).
2. Checks the `purchases` table for that user and script (admins bypass this).
3. If the admin uploaded a PDF or DOCX, the server returns a **60-second signed URL** to the private `script-files` bucket.
4. Otherwise it generates the file on the fly from `script_contents.body`. PDFs embed Noto Sans and Noto Sans Devanagari, so Hindi renders with correct conjuncts; DOCX uses Nirmala UI for Devanagari.
5. Every file is stamped "Licensed to <email> · <licence> · Order <id>", and each download is logged.

## Licensing rules

* **Standard:** sold any number of times.
* **Exclusive:** offered only on scripts that have **never** been sold. The first standard sale switches exclusivity off automatically. An exclusive sale unpublishes the script permanently; the buyer keeps access.
* **Bundles:** grant a standard licence for every included script.

## Project structure

```
scriptvault/
├── assets/fonts/              Noto fonts embedded in generated PDFs (OFL licence)
├── docs/DEPLOYMENT.md         Beginner deployment guide (Supabase + Razorpay + Vercel)
├── scripts/generate-seed.ts   Builds supabase/seed.sql from the sample data
├── supabase/
│   ├── schema.sql             Tables, RLS, fulfil_order(), storage buckets
│   └── seed.sql               Sample catalogue (generated)
├── src/
│   ├── proxy.ts               Refreshes the auth cookie; guards /dashboard /admin /checkout
│   ├── app/
│   │   ├── page.tsx                     Homepage
│   │   ├── scripts/page.tsx             Explore: search + filters (server-rendered)
│   │   ├── scripts/[slug]/page.tsx      Product page (static, revalidated every 5 min)
│   │   ├── bundles/ custom/ about/ contact/
│   │   ├── privacy/ terms/ refund-policy/
│   │   ├── login/ account/reset/ auth/callback/ auth/signout/
│   │   ├── cart/ checkout/ checkout/success/
│   │   ├── dashboard/                   Purchases, downloads, order history, requests
│   │   ├── admin/                       Overview, scripts (CRUD + uploads), orders, requests
│   │   └── api/
│   │       ├── checkout/create-order    Server-side pricing + Razorpay order
│   │       ├── checkout/verify          Signature + payment verification + fulfilment
│   │       ├── webhooks/razorpay        Signed webhook (backup fulfilment)
│   │       ├── download/[scriptId]      Purchase-gated PDF/DOCX delivery
│   │       ├── custom-request, contact  Validated form endpoints (honeypot spam trap)
│   │       └── admin/…                  Admin-only script and request management
│   ├── components/            UI: header, cards, generated thumbnails, modals, forms…
│   └── lib/
│       ├── env.ts             Public flags (demo/live/test mode)
│       ├── server-env.ts      Secrets (server-only)
│       ├── catalog/           Data access + sample data (+ server-only paid bodies)
│       ├── supabase/          Browser, server, service-role and proxy clients
│       ├── pricing.ts         Authoritative cart pricing
│       ├── razorpay.ts        Razorpay client + signature verification
│       ├── documents.ts       PDF (pdfkit) and DOCX (docx) generation
│       ├── admin-*.ts         Admin data + form/upload validation
│       └── demo-store.ts      Demo-mode order history (browser only)
└── .env.example
```

## Customising

* **Brand colours & fonts:** the `@theme` block in `src/app/globals.css`.
* **Categories:** `CATEGORIES` in `src/lib/catalog/sample-data.ts` (keep the `categories` table in sync, or re-run the seed).
* **Contact details & legal text:** `src/app/contact/page.tsx`, `privacy`, `terms`, `refund-policy`. Replace every `[bracketed]` placeholder and have a lawyer review them.
* **Sample script bodies are abridged.** Replace them with full manuscripts in Admin, or upload your PDF/DOCX files.

## Security checklist

- [x] Paid text never reaches the client: separate `server-only` module locally, locked table in live mode. Verified by scanning the build output.
- [x] Prices recalculated on the server; client totals are display-only.
- [x] Razorpay signatures verified with HMAC-SHA256 + `timingSafeEqual`, plus a server-to-server payment fetch.
- [x] Webhook signature verified against the raw body.
- [x] Fulfilment is transactional and idempotent.
- [x] RLS on every table; the service-role key is only used after an explicit auth/role check.
- [x] Uploads validated by size and magic bytes; paid files in a private bucket behind 60-second signed URLs.
- [x] Open-redirect protection on `?next=` parameters; security headers set in `next.config.ts`.
- [ ] Recommended before launch: enable Supabase email confirmation and leaked-password protection, add rate limiting (e.g. Vercel WAF rules) on `/api/*`, and set up transactional email for receipts.
