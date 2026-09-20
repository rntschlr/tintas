import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { chromium } from "playwright";
import worker from "../dist/_worker.js/index.js";

// Local test adapter for the built Cloudflare handler and its static assets.
// This intentionally does not claim to emulate Cloudflare bindings or caching.
const root = resolve("dist");
const mime = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    const relative = file.slice(root.length + 1);
    if (
      file.startsWith(root + sep) &&
      !relative.startsWith("_worker.js") &&
      (await stat(file).catch(() => null))?.isFile()
    ) {
      res.writeHead(200, { "content-type": mime[extname(file)] ?? "text/plain" });
      res.end(await readFile(file));
      return;
    }
    const response = await worker.fetch(
      new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers,
      }),
      {},
      {
        waitUntil(promise) {
          void promise.catch(() => {});
        },
        passThroughOnException() {},
      },
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) Readable.fromWeb(response.body).pipe(res);
    else res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(500).end("Test server error");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {}),
  });
  for (const width of [1280, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    await page.evaluate(() =>
      localStorage.setItem(
        "tinta-progress",
        JSON.stringify({
          state: { seen: null, bookmarks: "broken", quizBest: -1, markSeen: "not a function" },
          version: 0,
        }),
      ),
    );
    await page.goto(`${origin}/alphabet`);
    const bookmark = page.getByRole("button", { name: "Bookmark this sheet", exact: true });
    await bookmark.click();
    await page.reload();
    await page.getByRole("button", { name: "Remove bookmark", exact: true }).waitFor();
    assert.equal(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("tinta-progress")).state.bookmarks.includes("alphabet"),
      ),
      true,
    );
    await page.getByRole("button", { name: /Search/ }).click();
    await page.getByPlaceholder("ház, accusative, szeretlek, s/sz…").fill("accusative");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /Accusative/i })
      .first()
      .click();
    await page.waitForURL("**/cases/accusative");
    // The H1 is the case's English job; the Latin name and the endings moved
    // into the sheet body so the heading reads as a sentence.
    await page.getByRole("heading", { level: 1, name: /the thing you act on/i }).waitFor();
    await page.getByText("Accusative · direct object").waitFor();
    assert.deepEqual(errors, [], `browser errors at ${width}px`);
    await context.close();
  }
  console.log(
    "Production browser smoke passed: desktop/mobile, malformed storage recovery, bookmark persistence, search navigation, no uncaught errors.",
  );
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
// Nitro owns background timers; all assertions and browser cleanup completed.
process.exit(0);
