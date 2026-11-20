import { readFileSync, writeFileSync } from "node:fs";
import { loadEnv } from "vite";
import { siteOrigin, sitemapForOrigin } from "./site-config.mjs";

const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
const origin = siteOrigin(env.VITE_PUBLIC_SITE_URL);
writeFileSync(
  "dist/sitemap.xml",
  sitemapForOrigin(readFileSync("public/sitemap.xml", "utf8"), origin),
);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`[public metadata] Sitemap and robots.txt use ${origin}`);
