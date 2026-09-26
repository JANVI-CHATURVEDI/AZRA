# AZRA — production site

Personal brand / studio site for **AZRA**.
Stack: **Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript**, hosted on **Vercel**.

```
AZRA/
├── web/       the public site
└── README.md
```

There is no backend: the contact form hands the brief to the visitor's mail
client (`mailto:`) with a copy-to-clipboard fallback, and every page is
prerendered as static content. If a server-side need shows up later (real
email delivery, accounts, webhooks), it becomes a Next.js route handler in
`web/` — not a second service.

## Local development

```powershell
cd web
npm install
npm run dev                                # http://localhost:3000
```

Quality gates (all must pass):

```powershell
npm run lint        # ESLint (eslint-config-next)
npm run typecheck   # tsc --noEmit
npm test            # Vitest — mailto, mission clock
npm run format:check
npm run build       # production build, all routes static
npm run check:visual # Playwright render QA at 1440x900 + 390x844
```

## Deploy (Vercel)

Import this repo with **Root Directory = `web`** (framework preset: Next.js,
auto-detected), set `NEXT_PUBLIC_SITE_URL` to the production domain, ship.
`robots.txt` and `sitemap.xml` publish automatically.

See `web/README.md` for the project structure, the design rules that keep the
codebase tidy, and the full script reference.
