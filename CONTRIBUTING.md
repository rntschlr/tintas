# Contributing to Tinta

Tinta is a Hungarian learning notebook. Keep changes small, understandable,
and helpful to learners. Browser progress must remain private and local.

## Set up

Use Node 22 and the committed lockfile:

```bash
git clone https://github.com/rntschlr/tintas.git
cd tintas
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:8080>. No account, database, or API credential is
needed to develop the public app. Never commit `.env.local`, Cloudflare
tokens, or private data. `VITE_` values may be exposed to the browser.

## Work in the right place

- Edit Hungarian learning material in `src/data/`. Check spelling, accents,
  translations, and grammar examples.
- Edit the interface in `src/routes/` and `src/components/`.
- Keep domain logic in `src/lib/` and add targeted tests for changes.
- Keep progress in browser `localStorage`; do not add tracking or server
  persistence without an explicit privacy review.
- Keep the Cloudflare release pipeline independent of the optional `native/`
  Capacitor wrapper.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build:cf
npm run test:production
npx playwright install chromium
npm run test:browser
```

`test:production` exercises the built Cloudflare handler and metadata.
`test:browser` checks desktop/mobile behavior with the built worker through
a local HTTP adapter. Neither proves that a Cloudflare deployment succeeded.

When changing the interface, check keyboard focus, narrow screens, browser
console errors, and direct URL refreshes. For progress changes, check reload,
malformed storage, and storage-disabled behavior. Keep screenshots in
`docs/screenshots/` accurate and remove outdated captions.

## Pull requests

Describe the learner problem, scope, test results, and any remaining risk.
Avoid unnecessary dependencies and unrelated code changes. Never merge a
failing check. Publish only from `main` after CI has passed. Report security
issues privately under [SECURITY.md](SECURITY.md).
