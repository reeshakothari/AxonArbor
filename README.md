# Axon Arbor — marketing site

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion. Deploys to Vercel.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (must pass with zero type/lint errors)
npm run lint
```

## Structure

```
src/
  app/
    (marketing)/        public pages: /, /programmes, /hospitality, /about, /contact, /sign-in
    (app)/              reserved for phase 2 dashboards (see its README)
    api/contact/        contact form route handler (validates + logs for now)
    sitemap.ts, robots.ts, icon.png, apple-icon.png, opengraph-image.png
  components/
    layout/             Header, Footer, Logo, Container
    sections/           Hero, ProblemSection, VendorConstellation, PullQuote, PillarGrid,
                        CapabilityStack, BeyondTraining, CTABand, PageHeader, PersonCard
    forms/              ContactForm
    motion/             MotionProvider (Framer Motion, problem section only), Reveal (CSS)
    ui/                 Button, Eyebrow, SectionIntro
  content/              all page copy as typed objects (types.ts describes the model)
  lib/                  metadata helper, shared contact validation
```

## Editing content

All copy lives in `src/content/*.ts`, typed by `src/content/types.ts`. Components never
hard-code copy, so this layer can later be swapped for a CMS or Supabase.

## Brand rules

- Colours: amber `#FFC107` (accents and fills only, never small text on white), black,
  white, and greys derived from black. The default Tailwind palette is disabled in
  `globals.css`, so other hues are unavailable by design.
- Type: Gelasio (headings), Inter (body), Montserrat (labels, buttons, stats).
- Logo: `public/brand/logo.png`, used unaltered (cropped only by CSS in `Logo.tsx`).
- British English throughout.

## Motion

- The problem section pins on desktop screens at least 640px tall (`pin:` variant) and
  resolves the vendor constellation as you scroll. Phones get a stacked version.
- Section reveals and the pull-quote use CSS scroll-driven animations (no JS).
- Everything respects `prefers-reduced-motion`.

## Environment

| Variable               | Default                    | Purpose                              |
| ---------------------- | -------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | `https://www.axonarbor.in` | Canonical URLs, sitemap, OG metadata |

## TODO

- Contact form: deliver enquiries by email (`src/app/api/contact/route.ts`).
- Phase 2: dashboards, onboarding and admin panel in `(app)`.
