# Deploy Tinta at tintas.app

Tinta runs as a public, server-rendered Cloudflare Pages site. Its canonical origin is `https://tintas.app`. The existing Pages project is named **`tinta`**, and its assigned Pages hostname is `https://tinta-4pr.pages.dev`. The project name does not change when a custom domain is attached. No database, no sign-in: bookmarks and progress stay in each visitor’s browser.

## Release configuration

GitHub Actions builds and uploads the site to the existing Cloudflare Pages Direct Upload project. Pull requests run checks without deployment; pushes to `main` and manual runs on `main` can deploy.

In GitHub → repository **Settings → Secrets and variables → Actions**, configure:

- Secret `CLOUDFLARE_API_TOKEN`, scoped to the account's Cloudflare Pages Edit permission.
- Secret `CLOUDFLARE_ACCOUNT_ID`, identifying the account that owns the Pages project.
- Repository variable `VITE_PUBLIC_SITE_URL` = `https://tintas.app`.

The workflow checks types, lint, tests, the production build, server responses, and browser interactions before uploading. Missing deployment secrets produce an explicit skip rather than a live site. Keep the `tinta` project name in `wrangler.toml` and the workflow's deploy command aligned.

Verify each deployment in Cloudflare and open the actual URL it returns. A successful local build alone is not proof of publication.

The workflow builds standalone mode with auth disabled. Private platform preview/auth helpers remain in source for compatibility but are not part of the public learning flow. Do not enable auth just to publish the notebook.

## Connect or change the canonical domain

1. Open Pages project **`tinta`** → **Custom domains → Set up a domain** and associate both `tintas.app` and `www.tintas.app` with the project.
2. Follow Cloudflare's DNS instructions. An apex domain such as `example.com` must be a Cloudflare zone in the same account with Cloudflare nameservers; a subdomain can use a CNAME at another DNS provider. Associate the domain in Pages before adding a CNAME.
3. Wait for domain verification and HTTPS activation.
4. Set the GitHub Actions repository variable `VITE_PUBLIC_SITE_URL` to `https://tintas.app` and rerun the workflow on `main`. This sets page canonical URLs, share-image URLs, structured data, `robots.txt`, and every sitemap entry together. Changing a Cloudflare runtime variable alone does not rebuild metadata created by GitHub Actions.
5. Once the canonical hostname works over HTTPS, configure permanent Cloudflare redirects from `www.tintas.app` and the production `tinta-4pr.pages.dev` hostname to `https://tintas.app`, preserving paths and query strings. Verify the redirects do not loop.

Progress stored on the old hostname will not automatically move to the new one: browser localStorage is isolated by origin. No server-side progress copy exists.

### Enforce HTTPS in the Cloudflare zone

The `Strict-Transport-Security` response header only helps a browser that already reached the site over HTTPS. What enforces the upgrade for the first request is the zone configuration, so set it in the dashboard for `tintas.app`, in this order:

1. **SSL/TLS → Overview** → encryption mode **Full (strict)**.
2. **SSL/TLS → Edge Certificates** → **Always Use HTTPS: On**.
3. **SSL/TLS → Edge Certificates** → **Automatic HTTPS Rewrites: On**.
4. Confirm the Universal certificate is Active and covers `tintas.app` **and** `www.tintas.app`.
5. Verify both hostnames before going further:

   ```bash
   curl -sI  https://tintas.app/     | grep -i strict-transport
   curl -sIL https://www.tintas.app/ | grep -i strict-transport
   ```

6. Only once both are clean, **SSL/TLS → Edge Certificates → HSTS → Enable**: max-age 12 months, **Apply HSTS Policy to subdomains: on**, **No-Sniff: on**, **Preload: off**.

Do not submit the domain to [hstspreload.org](https://hstspreload.org). Preloading is baked into browser binaries and is slow and awkward to undo; the header plus the zone setting already cover every returning visitor.

Cloudflare references: [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Direct Upload with CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [redirecting pages.dev](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/).

For any future `.hu` domain, registration approval and DNS delegation must be checked separately. The registry's eight-day publication period does not itself prevent a conditionally registered domain from being used. See the [official `.hu` registration process](https://www.domain.hu/egy-domain-regisztralasanak-folyamata/).

## Production checks

- `/health` returns HTTP 200 and `{"status":"ok","service":"tinta"}` with `Cache-Control: no-store`. It is a liveness check, not a database or external-service readiness check.
- `/`, `/practice`, and a case-detail URL load on a direct visit and a refresh.
- `/robots.txt`, `/sitemap.xml`, canonical links, and `og:image` all use the chosen production origin.
- Inspect an HTML response for `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and the limited CSP restricting objects and base URLs. The CSP is deliberately scoped; it does not claim a nonce-based script policy.
- Check `Strict-Transport-Security` on a static path too (for example `/og.jpg`), which proves `public/_headers` shipped, and on `https://www.tintas.app/` as well as the apex — the header carries `includeSubDomains`.
- Confirm no original builder extension script is requested in standalone mode. Test bookmarks, full/topic drills, retry, mobile navigation, and keyboard focus.
- Check unknown URLs return 404, the social card renders, and the browser console has no app errors.

The server applies response headers to SSR separately from static `_headers`: Cloudflare does not apply that file to Pages Functions responses. See [Cloudflare headers](https://developers.cloudflare.com/pages/configuration/headers/).

## Build locally

```bash
npm ci
npm run typecheck
npm run lint
npm test
VITE_PUBLIC_SITE_URL=https://example.com npm run build:cf
VITE_PUBLIC_SITE_URL=https://example.com npm run test:production
```

`https://example.com` is a documentation example, not a deployed Tinta domain. Omit the override to use the `https://tintas.app` default. `build:cf` writes the selected origin into generated `dist` metadata without changing source files. Inspect the output before uploading.

## Operations and rollback

Use GitHub Actions logs for build failures and Cloudflare deployment logs for runtime failures. Do not log credentials, cookies, or learner data. Cloudflare's deployment history can roll production back to a known-good deployment; follow up with a Git revert so the next build matches the restored version. Keep credentials in Actions/Cloudflare secret settings, never in `VITE_` variables or source control.

A previous source revision included a platform preview OAuth credential. It has been removed from active source; history still contains it. The issuer/broker owner must rotate or revoke it if it remains valid. Public standalone deployment does not need that credential.
