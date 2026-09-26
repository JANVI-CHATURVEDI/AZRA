# AZRA — web

Personal brand / studio site for **AZRA** (`Design. Build. Ship.`), built with
Next.js (App Router) + React + Tailwind CSS v4, GSAP ScrollTrigger + Lenis for
the multi-phase scroll system, Framer Motion for micro-interactions, deployed
to Vercel.

## Scripts

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Dev server with hot reload                        |
| `npm run build`        | Production build (`next build`)                   |
| `npm run start`        | Serve the production build                        |
| `npm run lint`         | ESLint (eslint-config-next, core-web-vitals + TS) |
| `npm run typecheck`    | `tsc --noEmit`                                    |
| `npm test`             | Vitest unit tests (mailto, mission clock)         |
| `npm run format`       | Prettier write (`format:check` to verify)         |
| `npm run check:visual` | Playwright render check + screenshots (below)     |

## Visual check

`scripts/visual-check.mjs` loads the **built** site at 1440×900 and 390×844
with system Chrome (no browser download) and fails on any of: a console error,
horizontal overflow, a missing `<h1>`, fonts that never loaded, an intro
overlay that fails to dismiss (or replays after reload), a broken mobile
menu, a reveal that never fires, a progress bar that never moves, a custom
cursor that is missing its dot or trailing ring, does not invert what it
covers, or does not change/reset state over interactive elements, a work line
that will not stop on hover or open a project when clicked, letter bloat that
never got applied, or a wave backdrop that is missing, not fixed behind the
page, or stacked above the content. Screenshots land in `screenshots/`
(git-ignored).

`npm run shots` (against a running build) captures the interactive effects —
the cursor inverting the text under it, letters bloating on hover, and the work
line frozen mid-run — so they can be eyeballed without a live pointer.

```powershell
npm run build
npm run start -- -p 3100                    # 3000 may already be taken
$env:CHECK_URL="http://127.0.0.1:3100"; npm run check:visual
```

## Structure

```
src/
  app/                 App Router: layout (fonts, SEO, JSON-LD), page, not-found,
                       robots.ts, sitemap.ts, icon.svg, globals.css (design tokens)
  components/
    effects/           Arrival overlay, 3D gradient wave backdrop, custom cursor
                       (dot + trailing ring), global letter bloat, scroll reveal
    layout/            Header (hover-expanding [menu], mobile panel, progress), footer, HUD status
                       bar, skip link
    scroll/            Scroll system: SmoothScroll (Lenis + anchor routing),
                       StackPhase (pinned overlap), HorizontalPhase (horizontal
                       passage — see "Scroll system" below)
    sections/          One file per page section: hero, manifesto, services,
                       work (rotating line), process, partnership, contact(+form)
  content/             All copy and site config — edit words here, never in JSX
  hooks/               Client subscriptions: mission clock, session flags
  lib/                 Pure logic: mailto builder, mission clock, cn() helper,
                        JSON-LD builder, gsap plugin registration
scripts/               visual-check.mjs (Playwright render QA), optimize-images.mjs
                       (assets/work-source PNG -> public/work WebP)
assets/
  work-source/         Original project screenshots (source for optimize-images)
```

Rules of the house:

- **Tokens only** — colors/spacing come from `@theme` in `globals.css`; no raw
  hex sprinkled in components.
- **Content is data** — every paragraph a human might rewrite lives in
  `src/content/`.
- **Logic is pure** — anything with an if-statement lives in `src/lib/` and has
  a test next to it.
- Server components by default; `"use client"` only where there is state or an
  effect (arrival, cursor, wave background, reveal, header, HUD, contact form,
  work, scroll phases).
- **Honest content** — work samples are real projects in `public/work/`
  (regenerate WebPs with `node scripts/optimize-images.mjs`); no invented
  clients, crew or metrics.

## Environment

Copy `.env.example` to `.env.local` if you need to override defaults:

| Variable               | Default               | Purpose                                                 |
| ---------------------- | --------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://azra.studio` | Canonical origin for metadata, sitemap, robots, JSON-LD |

There is no backend in this app by design: the contact form POSTs the brief
straight to the inbox through a FormSubmit hash endpoint, and falls back to a
prefilled `mailto:` draft (painted after the confirmation panel) if that
endpoint cannot be reached.

## Scroll system

Three phases, composed in `src/app/page.tsx`:

1. **StackPhase** (hero → manifesto → services): sheets pin and the next one
   slides up over them. Tune the cover parallax (`y: -80`, dim to `0.25`) in
   `scroll/stack-phase.tsx`; sheet heights come from `.stack-slot` (`100svh`).
2. **HorizontalPhase** (work → process): desktop ≥1024px only; vertical scroll
   scrubs the track sideways. Tune the lag with `scrub: 0.6` in
   `scroll/horizontal-phase.tsx`; below 1024px or with reduced motion it is a
   plain vertical stack (structural fallback, no JS).
3. **Normal flow** (partnership → contact → footer).

Reordering or adding children is enough — pin ranges derive from the layout
and recalculate via `invalidateOnRefresh`. Reduced motion disables the whole
system natively (no Lenis, no pins, no sideways).

## Deploy (Vercel)

1. Import the repo in Vercel with **Root Directory = `web`**
   (framework preset: Next.js — auto-detected).
2. Set `NEXT_PUBLIC_SITE_URL` to the real production domain.
3. Ship. `robots.ts` and `sitemap.ts` publish automatically at
   `/robots.txt` and `/sitemap.xml`.
