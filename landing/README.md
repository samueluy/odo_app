# Odo Landing (Next.js + Tailwind + Vercel + Lemon Squeezy)

This is the web landing page for Odo, built for Product Hunt launch and Vercel hosting.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Vercel deployment config
- Lemon Squeezy checkout links

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Add your Lemon Squeezy checkout URL in `.env.local`:

```bash
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL=https://your-store.lemonsqueezy.com/buy/your-checkout-id
NEXT_PUBLIC_PRODUCTHUNT_URL=https://www.producthunt.com/products/odo
```

4. Run locally:

```bash
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repo.
3. Set the project root directory to `landing`.
4. Add environment variables:
   - `NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL`
   - `NEXT_PUBLIC_PRODUCTHUNT_URL`
   - `DATABASE_URL` (Neon connection string)
5. Deploy.

## Lemon Squeezy Notes

- This landing uses direct checkout links.
- For advanced conversion tracking, add Lemon Squeezy events or webhooks in a backend route later.

## Live Demo + Global Visitor Odometer

- The entire landing page is a live mouse-tracking test track.
- Pointer movement anywhere on-page is converted into distance.
- Personal odometer is stored in browser local storage.
- Global total is posted to `/api/visitor-odometer` and stored in Neon Postgres when `DATABASE_URL` is configured.
- If `DATABASE_URL` is not set, the API falls back to Vercel KV (Upstash REST) when KV env vars are provided.

Required environment variables (Neon):

- `DATABASE_URL`

Optional fallback environment variables (KV):

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

If neither Neon nor KV is configured, the demo still works locally for the visitor lap meter and returns a non-configured state for global totals.

## Brand Assets

Brand files are under:

- [public/brand/logo-mark.svg](public/brand/logo-mark.svg)
- [public/brand/logo-wordmark.svg](public/brand/logo-wordmark.svg)
- [public/brand/icon.svg](public/brand/icon.svg)
- [public/brand/og-odo.svg](public/brand/og-odo.svg)

Brand rules are documented in [BRANDKIT.md](BRANDKIT.md).
