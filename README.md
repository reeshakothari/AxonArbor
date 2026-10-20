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
    admin/              admin dashboard: login, inline page editor, enquiries, images, history
    api/contact/        contact form route handler (stores enquiries in Supabase)
    sitemap.ts, robots.ts, icon.png, apple-icon.png, opengraph-image.png
  components/
    layout/             Header, Footer, Logo, Container
    sections/           Hero, ProblemSection, VendorConstellation, PullQuote, PillarGrid,
                        CapabilityStack, BeyondTraining, CTABand, PageHeader, PersonCard
    forms/              ContactForm
    motion/             MotionProvider (Framer Motion, problem section only), Reveal (CSS)
    ui/                 Button, Eyebrow, SectionIntro
  views/                page bodies, shared by the public site and the inline editor
  content/              default copy as typed objects (types.ts describes the model)
  lib/                  content loader, Supabase clients, admin data access, stega markers
  proxy.ts              refreshes the admin session cookie on /admin requests
supabase/migrations/    SQL for the Axon Arbor tables, functions and media bucket
```

## Editing content (admin)

Admins edit the site at **/admin** without touching code:

- **Edit website**: the real pages with draft content. Click any text to change it, click any
  image to upload or pick a replacement, and use *All settings* for links, lists, menu items
  and search-engine text. Edits autosave as drafts.
- **Publish** copies drafts live and expires the `axon-arbor-content` cache tag, so the public
  site updates on the next visit with no redeploy. Every publish is kept in *Publish history*
  and can be restored.
- **Enquiries**: contact form submissions (read/unread, archive, notes, CSV export).
- **Images**: the `axon-arbor-media` storage bucket.

How it works: `src/content/*.ts` are the defaults. Supabase (`axon_arbor_content`, one draft
and one published row per page) stores edited copies, which `src/lib/content.ts` merges over
the defaults. In the editor every display string carries invisible zero-width markers
(`src/lib/stega.ts`) so a click on rendered text maps back to its field.

### Supabase

Project `supabase-charcoal-planet` is shared with other sites, so every object is prefixed
`axon_arbor_` and editing is limited to users in `axon_arbor_admins`. Run
`supabase/migrations/20261020000000_axon_arbor_cms.sql` once, then add an admin:

1. Supabase dashboard → Authentication → Users → *Add user* (email + password, auto-confirm).
2. SQL editor:
   `insert into public.axon_arbor_admins (user_id, email) select id, email from auth.users where email = 'admin@example.com';`

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
| `NEXT_PUBLIC_SUPABASE_URL` | project URL | Supabase project (defaults to supabase-charcoal-planet) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | project key | Publishable key (safe to expose; RLS protects data) |

## TODO

- Contact form: also notify the team by email (`src/app/api/contact/route.ts`).
- Phase 2: consultant and organisation dashboards, onboarding.
