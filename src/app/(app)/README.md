# (app) route group — reserved for phase 2

Authenticated areas will live here, separate from the public `(marketing)` pages:

- Consultant dashboard
- Organisation dashboard
- Onboarding (company name, location, employee count, …)
- Admin panel for editing site content (copy currently lives in `src/content/*.ts`)

Add an `(app)/layout.tsx` with its own chrome and auth guard when this work starts.
The public `/sign-in` placeholder is in `(marketing)/sign-in`.
