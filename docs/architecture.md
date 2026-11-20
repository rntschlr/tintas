# Architecture

Tinta is a public, server-rendered Hungarian learning notebook. It does not
require accounts, databases, or external APIs for learner progress.

## Components

| Component | Responsibility |
| --- | --- |
| React + TanStack Router/Start | Lessons, navigation, search, and server rendering |
| `src/data/` | Hungarian grammar, phrases, examples, and practice content |
| `src/lib/hungarian.ts` | Vowel harmony and conjugation helpers |
| `src/lib/search-core.ts` | Accent-aware search scoring |
| `src/lib/quiz-session.ts` | Drill results and retry selection |
| `src/lib/progress.ts` | Bookmarks and progress in browser `localStorage` |
| Nitro and `server/` | Server responses, security headers, and `/health` |
| Cloudflare Pages | Website and static assets; no learner record database |

The browser stores progress under `tinta-progress`. Another device or browser
profile does not share this data. Clearing site data removes progress. Storage
failures do not prevent visitors from reading lessons.

## Project layout

- `src/routes/`: page routes and page-specific metadata
- `src/components/`: reusable interface and workbenches
- `src/data/`: version-controlled learning content
- `src/lib/`: small, testable behavior and browser storage
- `server/`: HTTP security middleware and health endpoint
- `public/`: manifest, icons, social image, sitemap, and security text
- `scripts/`: release metadata and production smoke checks
- `native/`: independent optional Capacitor iOS wrapper (not used by Cloudflare)

No authentication, preview OAuth, Grok bridge, PostgreSQL migrations, or server
connector scaffold is part of this application. Add server-side data handling
only in a separate reviewed change with a clear learner need.

## Security and deployment

Static assets receive headers from `public/_headers`. Server-rendered pages
receive equivalent headers from `server/middleware/00-security.ts`.
Cloudflare does not apply `_headers` automatically to Pages Functions.

The Content Security Policy limits object loading and base URLs, but does not
claim to be a strict script nonce policy. The HSTS header includes subdomains.
Confirm HTTPS for any subdomain before changing it.

`VITE_PUBLIC_SITE_URL` sets the canonical website origin at build time. It
must be an HTTPS origin. A change requires a new build and affects sitemap,
canonical metadata, and social URLs.

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run
build:cf`, `npm run test:production`, and `npm run test:browser` (after
installing the Playwright browser) before release. GitHub Actions performs
these checks for pull requests.

See [deployment](deployment.md) for Cloudflare settings and rollback.
