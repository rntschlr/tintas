import { spawnSync } from "node:child_process";

// Build the public Cloudflare Pages app and rewrite its sitemap metadata.
// Learner data stays in localStorage; there is no database or account service.
const env = { ...process.env, NITRO_PRESET: "cloudflare-pages" };
for (const args of [
  ["node_modules/vite/bin/vite.js", "build"],
  ["scripts/finalize-public.mjs"],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.error) {
    console.error("[public build] Could not start command:", result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
