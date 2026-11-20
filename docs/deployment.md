# Cloudflare deployment

Tinta runs on Cloudflare Pages. The Pages project name is **`tinta`** and
the canonical public origin is **https://tintas.app**. The public application
has no account service or learner database.

## Required GitHub settings

In the repository's Actions secrets, set:

- `CLOUDFLARE_API_TOKEN`: token with Cloudflare Pages edit permission for
  this project.
- `CLOUDFLARE_ACCOUNT_ID`: account that owns the `tinta` Pages project.

Set the Actions repository variable `VITE_PUBLIC_SITE_URL` to
`https://tintas.app`.

The workflow in `.github/workflows/cloudflare.yml` runs on PRs and pushes
to `main`. PRs run checks only. On `main`, the workflow deploys **only after**
a clean install, complete dependency audit, TypeScript, lint, unit tests,
Cloudflare build, server smoke, and browser smoke. If deployment credentials
are missing, the release job fails rather than claiming success.

Credentials belong in GitHub/Cloudflare secret stores, never in source files
or a public `VITE_` variable.

## Build and test locally

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build:cf
npm run test:production
npx playwright install chromium
npm run test:browser
```

Use the same `VITE_PUBLIC_SITE_URL` value for the build and production smoke.
`npm run build:cf` writes metadata to `dist/` and does not deploy it.

## Domain and HTTPS

Attach `tintas.app` and `www.tintas.app` to the Cloudflare Pages project
under Custom domains. Follow Cloudflare's DNS instructions. Check the real
`pages.dev` hostname in the Pages dashboard; do not rely on an old name.

Enable **Full (strict)** SSL/TLS and **Always Use HTTPS** in the Cloudflare
zone. Confirm valid TLS certificates cover both hostnames. Redirect `www`
and the `pages.dev` hostname to `https://tintas.app` without loops and with
paths preserved.

The HSTS header is `max-age=31536000; includeSubDomains`, without preload.
Verify HTTPS works for every subdomain before enabling or changing HSTS in the
Cloudflare dashboard. Do not add the domain to an HSTS preload list casually.

After changing `VITE_PUBLIC_SITE_URL`, rebuild. Changing a runtime variable
alone will not update generated sitemap, canonical URLs, or share metadata.

## Post-release verification

1. Confirm a successful deploy step in the GitHub Actions workflow and a
   matching deployed revision in Cloudflare Pages.
2. Open `https://tintas.app/`, `/practice`, `/cases/inessive`, and `/lab`
   in a fresh browser, then reload each.
3. Check `/health` responds with status 200 and
   `{"status":"ok","service":"tinta"}`. This is liveness, not readiness.
4. Check `/sitemap.xml`, `/robots.txt`, canonical URLs and the social image.
5. Check HTTPS and security headers on server-rendered pages **and** static
   assets, e.g. `/og.jpg`. Cloudflare static `_headers` do not apply to
   server responses.
6. Verify desktop/mobile navigation, bookmark persistence, drills, search,
   error-free browser console, and unknown-path 404 responses.
7. Check that `/api/auth/get-session`, `/auth/popup`, and `/__grok/`
   endpoints remain absent.

Cloudflare's deployment history supports rollback to a previous known-good
deployment. Follow up with a Git revert to prevent the next build from
reintroducing a bad revision.

## Historical credential notice

A previous source revision included a platform-preview OAuth credential.
The active public application does not use it, and its scaffold has been
removed. Git history can still contain the former value. Its issuer must
revoke or rotate it if it has ever been valid; deleting current source code
does not revoke a credential.
