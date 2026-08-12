# AEGIS Intelligence — Enterprise AI Governance Platform

A production-quality React + TypeScript rebuild of the Stitch prototype, unified under a
single design system and branded consistently as **AEGIS Intelligence** across all 14 pages.

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check + production build to dist/
npm run lint     # type-check only
```

> This app was built in a sandboxed environment without npm registry access, so the
> dependency tree could not be installed or build-verified here. It has been checked with
> `tsc --noEmit` against locally available React sources (no syntax errors, all internal
> `@/` imports resolve correctly) — run `npm install` on a machine with internet access to
> pull in `@types/react`, Vite, Tailwind, etc. and do a full build before shipping.

Sign in with any Enterprise ID + passcode — auth is a mock service (`src/services/authService.ts`)
that stores a session in `localStorage`; there's no real backend.

## Architecture

```
src/
  types/        Central domain types (Agent, Policy, Incident, Transaction, …)
  data/         Mock datasets — the "seed data" for the mock API layer
  services/     Async functions that stand in for a real backend (simulated latency,
                in-memory mutation for approve/reject/save/toggle flows)
  contexts/     AuthContext, ToastContext, RouterContext (see "Routing" below)
  hooks/        useAsync — the loading/success/error/empty data-fetching pattern used
                by every page
  components/
    ui/         Reusable primitives: Button, Badge, Card, Table, Modal, Drawer, Toast,
                Input/Select/Textarea/Switch, Skeleton, EmptyState, ErrorState, Tabs,
                ProgressBar
    charts/     Hand-rolled SVG LineChart / BarChart / DonutChart / Sparkline
    layout/     Sidebar, TopBar, AppShell, PageHeader
    icons/      Icon — a single wrapper around Material Symbols so every icon in the
                app is sized and weighted identically
  pages/        One component per route, composed entirely from the above
  router/       Route path constants
```

Every page follows the same shape: `AppShell` → `PageHeader` → data via `useAsync` →
loading skeleton / error state / empty state / populated view. There is no page-specific
one-off styling — everything is built from the shared `components/ui` and `components/charts`
library, and every color, radius, spacing value, and font comes from `tailwind.config.ts`.

## Routing

There's no React Router dependency (this environment couldn't install one to verify against).
Instead `src/contexts/RouterContext.tsx` is a ~40-line hash-based router (`#/approvals`, etc.)
with the same `navigate()` / `path` ergonomics you'd get from a real router. If you'd rather
use `react-router-dom`, it's a drop-in swap — `ROUTES` in `src/router/routes.ts` already
defines every path as a constant used throughout the app.

## Design system

Single source of truth: `tailwind.config.ts`.

- **Color** — one dark palette (`bg`, `surface` + 4 elevations, `border` + 2 variants, `ink`
  + 3 variants, `accent` lime, and semantic `success`/`warning`/`danger`/`info`). Nothing in
  the app hardcodes a hex value outside this file.
- **Type** — Inter for all UI text, JetBrains Mono for IDs/hashes/timestamps/code, on a
  fixed scale (`display`, `h1`–`h3`, `body-lg`/`body`/`body-sm`, `caption`, `label`).
- **Radius** — `sm`(2px) → `xl`(12px), sharp and consistent (Palantir/Datadog-style, not
  bubbly).
- **Spacing / shadows / motion** — shared tokens (`shadow-card`, `shadow-elevated`,
  `animate-fade-in`, `animate-pulse-glow`) instead of one-off values per page.

## Assumptions made while merging the two Stitch exports

- **Branding**: "AEGIS Intelligence" used everywhere (nav, login, page titles), replacing
  the older "Aegis AI OS" naming from the first export.
- **Theme**: the project mixed a light Mission Control mockup with a dark Login mockup.
  Consolidated on **one dark theme** throughout, matching the more premium/enterprise
  Login treatment, since running both themes across different pages was exactly the kind
  of inconsistency this rebuild was meant to remove.
- **Pages with no mockup** (Payment Requests, Guardrails, Analytics, Audit Logs, Settings)
  were designed fresh, strictly reusing the shared component library so they read as
  native parts of the same product.
- **Charts**: implemented as small dependency-free SVG components rather than pulling in
  a charting library, since this environment couldn't install/verify one.

## Known gaps to close before production

- No real backend — every `services/*.ts` file is a mock; wire these to your actual API.
- No automated tests.
- Accessibility pass done at the component level (focus rings, aria-labels, semantic
  elements) but hasn't been audited with a screen reader.
- If you swap in `react-router-dom`, update `App.tsx`'s route table and remove
  `contexts/RouterContext.tsx`.
