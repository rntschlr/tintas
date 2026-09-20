import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { loadEnv } from "vite";
import { siteOrigin } from "./site-config.mjs";

// Exercise the actual built fetch handler without a browser or external services.
// This is a server smoke check, not mobile/visual or deployed-Cloudflare QA.
const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
const origin = siteOrigin(env.VITE_PUBLIC_SITE_URL);
const { default: worker } = await import("../dist/_worker.js/index.js");
const context = { waitUntil() {}, passThroughOnException() {} };
const locations = [
  ...readFileSync("dist/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => match[1]);
assert.ok(locations.length > 20);
assert.equal(new Set(locations).size, locations.length, "sitemap has no duplicates");
assert.ok(locations.every((url) => new URL(url).origin === origin));
const routes = locations.map((url) => new URL(url).pathname);
for (const path of routes) {
  const response = await worker.fetch(new Request(`${origin}${path}`), {}, context);
  const html = await response.text();
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get("set-cookie"), null, `public page sets no session: ${path}`);
  assert.match(response.headers.get("content-type"), /text\/html/, path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
  assert.equal(
    response.headers.get("strict-transport-security"),
    "max-age=31536000; includeSubDomains",
    `HSTS on the SSR path, which public/_headers cannot cover: ${path}`,
  );
  assert.ok(response.headers.get("content-security-policy").includes("object-src 'none'"), path);
  const canonicals = html.match(/<link[^>]+rel="canonical"[^>]*>/g) ?? [];
  assert.equal(canonicals.length, 1, `single canonical URL: ${path}`);
  assert.ok(canonicals[0].includes(`href="${origin}${path}"`), `canonical URL: ${path}`);
  if (path === "/cases/inessive")
    assert.ok(
      html.includes("When not to use it"),
      "nested case detail renders through the parent outlet",
    );
  assert.ok(html.includes(`${origin}/og.jpg`), `share image: ${path}`);
  assert.ok(!html.includes("grok-app-builder/extensions.js"), `standalone chrome: ${path}`);
  for (const name of ["twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"])
    assert.match(html, new RegExp(`name="${name}"`), `${name}: ${path}`);

  // Structured data: exactly one graph per page, and the site nodes only on "/".
  const blocks = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
  assert.equal(blocks.length, 1, `single JSON-LD block: ${path}`);
  // The router escapes & < > as \u00xx, which stays valid inside JSON strings.
  const graph = JSON.parse(blocks[0])["@graph"];
  assert.ok(Array.isArray(graph) && graph.length > 0, `JSON-LD @graph: ${path}`);
  const types = graph.map((node) => node["@type"]);
  assert.ok(types.includes("BreadcrumbList"), `BreadcrumbList: ${path}`);
  const siteNodes = types.filter((type) => type === "WebSite" || type === "Organization");
  assert.deepEqual(
    siteNodes.sort(),
    path === "/" ? ["Organization", "WebSite"] : [],
    `WebSite/Organization belong on "/" only, not ${path}`,
  );
  const page = graph.find(
    (node) => node["@id"] === `${origin}${path === "/" ? "/" : path}#webpage`,
  );
  assert.ok(page, `page node keyed by canonical URL: ${path}`);
  if (path === "/harmony") assert.equal(page["@type"], "LearningResource", "lesson route");
  if (path === "/cases/inessive") {
    assert.equal(page["@type"], "LearningResource", "case sheet is a lesson");
    const term = graph.find((node) => node["@type"] === "DefinedTerm");
    assert.ok(term, "case sheet emits a DefinedTerm");
    assert.equal(term.termCode, "-ban / -ben", "DefinedTerm carries the suffixes");
  }
}
const health = await worker.fetch(new Request(`${origin}/health`), {}, context);
assert.equal(health.status, 200);
assert.equal(health.headers.get("cache-control"), "no-store");
assert.deepEqual(await health.json(), { status: "ok", service: "tinta" });
for (const path of [
  "/api/auth/get-session",
  "/auth/popup",
  "/__app-env",
  "/__grok/manifest.webmanifest",
]) {
  const response = await worker.fetch(new Request(`${origin}${path}`), {}, context);
  assert.equal(response.status, 404, `private scaffold endpoint absent: ${path}`);
  await response.body?.cancel();
}
const head = await worker.fetch(new Request(`${origin}/`, { method: "HEAD" }), {}, context);
assert.equal(head.status, 200);
assert.equal(await head.text(), "");
const missing = await worker.fetch(new Request(`${origin}/not-a-real-page`), {}, context);
assert.equal(missing.status, 404);
const missingCase = await worker.fetch(new Request(`${origin}/cases/not-a-real-case`), {}, context);
assert.equal(missingCase.status, 404);
assert.ok(readFileSync("dist/robots.txt", "utf8").includes(`${origin}/sitemap.xml`));
// Static assets are served by Cloudflare, not this worker, so _headers is the
// only thing that secures them. Assert it shipped rather than fetching it.
assert.match(
  readFileSync("dist/_headers", "utf8"),
  /Strict-Transport-Security: max-age=31536000; includeSubDomains/,
  "HSTS reaches static assets via _headers",
);
// Assert that dormant auth/database/connector and preview bridge code stays out
// of both published JavaScript targets. This catches accidental root imports.
const forbidden = [
  "grok-preview-bridge",
  "@electric-sql/pglite",
  "__Host-grok-auth",
  "connectors.grok.me",
];
for (const file of readdirSync("dist", { recursive: true })) {
  if (!/\.(?:m?js)$/.test(file) || !statSync(`dist/${file}`).isFile()) continue;
  const code = readFileSync(`dist/${file}`, "utf8");
  for (const marker of forbidden) assert.ok(!code.includes(marker), `${file} contains ${marker}`);
}
console.log(
  `Production smoke passed: ${routes.length} rendered routes, health, 404, headers, standalone metadata, ${locations.length} sitemap URLs.`,
);
// The imported server owns background timers; this one-shot CLI has finished all awaited checks.
process.exit(0);
