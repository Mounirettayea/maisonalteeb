# MAISON AL TEEB — Storefront

Arabic-first, responsive storefront for Maison Al Teeb. The repository contains the public shop, a staff product manager, a barcode scanner, a landing page and a password-recovery page.

## Stack

- Static HTML, CSS and browser JavaScript
- Vite 8 for local development and production builds
- Supabase Auth, Postgres and Storage
- WhatsApp checkout (this is not an online payment gateway)

## Project map

- `index.html` — storefront, product catalogue, cart and WhatsApp checkout
- `admin.html` — staff login, product management, stock and barcode fields
- `public/scanner.html` — barcode lookup
- `public/supabase-config.js` — public Supabase URL and publishable key, plus storefront/admin enhancements
- `public/admin-scanner.js` — camera barcode scanning for the admin page
- `public/admin-timeout.js` — staff-session inactivity handling
- `public/cart-controls.js` — cart quantity controls
- `reset-password.html` — Supabase password recovery
- `supabase-schema.sql` — idempotent baseline for products, profiles and product-media policies

## Local development

Use Node.js 22 or a supported Node.js 20 release for Vite 8.

```bash
npm install
npm run dev
```

## Validation and production build

```bash
npm run check
npm run build
npm run preview
```

The `check` command syntax-checks repository JavaScript and parses inline scripts in HTML entry points. GitHub Actions runs the same checks and a Vite production build on pushes and pull requests.

## Supabase configuration

The storefront reads the public configuration from `/supabase-config.js`, served from `public/supabase-config.js` by Vite.

- The browser may contain the project URL and a Supabase **publishable** key (`sb_publishable_...`) or legacy anon key.
- Never place a Supabase `service_role` key or secret key in this repository or browser code.
- Keep Row Level Security enabled. The SQL baseline grants only the table privileges needed by the storefront and uses RLS policies to restrict staff operations.
- Staff roles are stored in `public.profiles.role` and must be assigned by an administrator; do not authorize using user-editable user metadata.
- Apply `supabase-schema.sql` only after reviewing it against the target Supabase project. It is intended for the Maison Al Teeb storefront tables and product-media bucket, not other applications that may share this Supabase project.

## Product catalogue rules

- The live catalogue is loaded from `public.products`; Supabase is the source of truth when the request succeeds.
- Products with a missing, zero or invalid price are intentionally omitted from the customer-facing catalogue until staff enter a valid price. They remain available in the admin list for correction.
- The admin gallery and database constraint are aligned at a maximum of six images per product.
- Product barcodes must be unique when present.

## Deployment

The repository includes `vercel.json` and `vite.config.js`. Connect the GitHub repository to Vercel and use the configured `npm run build` command with `dist` as the output directory. Confirm the production domain and Supabase redirect URLs in their dashboards before publishing changes.
