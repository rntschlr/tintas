import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv } from "vite";
import { siteOrigin, sitemapForOrigin } from "./site-config.mjs";

/** `public/__grok` is scaffold for the install-page tests. The public site must not serve it. */
function omitShippedGrok(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const path = join(dir, name);
    if (name === "__grok") {
      rmSync(path, { recursive: true, force: true });
      console.log(`[public metadata] Omitted scaffold directory ${path}`);
      continue;
    }
    try {
      if (statSync(path).isDirectory()) omitShippedGrok(path);
    } catch {
      // A raced or special file is not a publish path we need to walk.
    }
  }
}

const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
const origin = siteOrigin(env.VITE_PUBLIC_SITE_URL);
writeFileSync(
  "dist/sitemap.xml",
  sitemapForOrigin(readFileSync("public/sitemap.xml", "utf8"), origin),
);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
omitShippedGrok("dist");
// Nitro records every public file as a static exclude before this script deletes
// __grok. Leaving those excludes in place makes Pages keep serving the old CSS
// from an earlier upload instead of the worker's 404.
const routesPath = "dist/_routes.json";
const routes = JSON.parse(readFileSync(routesPath, "utf8"));
if (Array.isArray(routes.exclude)) {
  const exclude = routes.exclude.filter((entry) => !String(entry).includes("__grok"));
  if (exclude.length !== routes.exclude.length) {
    routes.exclude = exclude;
    writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`);
    console.log("[public metadata] /__grok is no longer a static asset route");
  }
}
console.log(`[public metadata] Sitemap and robots.txt use ${origin}`);
