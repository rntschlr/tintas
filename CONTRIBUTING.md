# Contributing to Tinta

Tinta is a public Hungarian grammar notebook. Keep changes useful to learners, easy to review, and consistent with the privacy promise: reading progress, bookmarks, and drill scores stay in the browser.

## Set up

Use Node **22** ([`.nvmrc`](.nvmrc)) and the committed npm lockfile.

```bash
git clone https://github.com/rntschlr/tintas.git
cd tintas
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

The development server uses **http://localhost:8080**. Vite defaults to the public standalone configuration with auth disabled. Retain the explicit flags from [`.env.example`](.env.example), including `VITE_AUTH_ENABLED=false`, so local and deployment settings remain easy to inspect.

Do not commit `.env.local`, `.grok/app-env.json`, database credentials, or deployment tokens. Variables beginning with `VITE_` are public build configuration, never a place for secrets.

## Understand the boundaries

- `src/data/` contains learning material. Preserve accents and verify Hungarian examples when changing content.
- `src/lib/hungarian.ts`, `search-core.ts`, and `quiz-session.ts` contain testable language, search, and quiz logic.
- `src/lib/progress.ts` owns browser-local learner state. Keep storage failures nonfatal.
- `src/routes/` and `src/components/` contain the notebook interface.
- `server/` contains the Nitro server layer. Optional auth, database, and connector modules are inherited infrastructure, not a shipped account-sync feature.

See [Architecture](docs/architecture.md) before changing server behavior. See [Deployment](docs/deployment.md) for Cloudflare and domain configuration.

## Validate a change

```bash
npm run typecheck
npm run lint
npm test
npm run build:cf
npm run test:production
```

`build:cf` builds the public Cloudflare application without running database migrations. The generic `npm run build` builds the configured server target without database writes. If enabling the optional PostgreSQL backend, run `npm run db:migrate` explicitly before starting it.

`test:production` exercises the built Cloudflare worker handler directly. Run it after `build:cf`; it checks the resulting server behavior without publishing the site. Keep the same `VITE_PUBLIC_SITE_URL` for both commands when testing a custom origin.

Use the development server for interface inspection, and the [deployment guide](docs/deployment.md) to verify the built application in its hosting runtime. Confirm changed routes also work when opened directly or refreshed. For interface changes, inspect a desktop and a narrow mobile viewport, use the keyboard, and check the browser console. For progress or quiz changes, exercise reload persistence, topic selection, answers, results, and any changed retry behavior.

Add or update focused tests when behavior changes. Avoid tests that only repeat implementation details. Some scaffold tests cover private generator documents and skip when those documents are absent from a public checkout. `npm run check:auth` compares the environment against a running development server; it is not a standalone unit test.

## Update screenshots

The README loads images directly from `docs/screenshots/`. Keep those paths stable when replacing captures.

1. Run the app with public standalone flags and a clean browser profile.
2. Capture the actual application at a consistent viewport; the existing desktop images are **1440 × 900**.
3. Check fonts, accents, focus states, and layout. Exclude browser chrome and personal information.
4. Save PNGs in `docs/screenshots/`, and update the README captions if the visible state changes.

Use real browser captures for interface screenshots. The current README explicitly identifies older reference captures; remove that note only when all relevant screenshots have been refreshed and verified.

## Submit a pull request

Explain the user-facing problem, what changes, and how you verified it. Include before/after screenshots for material interface changes and call out any verification you could not complete.

Keep the product name **Tinta** and the existing repository slug. Preserve real given names in Hungarian name-day data. Avoid generated build output and unrelated formatting churn.

Pull requests run the Cloudflare workflow checks without deploying. Deployment is restricted to `main` with configured credentials. Report vulnerabilities through [SECURITY.md](SECURITY.md).

### Browser regression checks

After `npm run build:cf`, install the test browser once with `npx playwright install chromium`, then run `npm run test:browser`. CI installs Chromium and runs the same check before deployment. It exercises the actual built worker through a loopback HTTP adapter at desktop and mobile widths, including malformed localStorage, bookmark persistence, search navigation and uncaught browser errors. It does not emulate Cloudflare bindings or replace Safari/native-device testing. A local Chrome binary can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

The public build fixes its deployment flags itself. Generic `npm run build` remains available for other configured Nitro targets, but database migrations are always an explicit `npm run db:migrate` operation.
