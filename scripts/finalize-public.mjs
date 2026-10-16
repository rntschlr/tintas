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
console.log(`[public metadata] Sitemap and robots.txt use ${origin}`);
