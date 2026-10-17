import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { applyMigrations } from "./migrate-runner.mjs";

/** Model a session advisory lock shared by two independent deploy clients. */
function database() {
  let tail = Promise.resolve();
  const rows = [];
  const effects = [];
  const events = [];
  function connect() {
    let unlock;
    let transaction = [];
    return {
      async query(sql, args = []) {
        if (sql.startsWith("SELECT pg_advisory_lock")) {
          const previous = tail;
          tail = new Promise((resolve) => {
            unlock = resolve;
          });
          await previous;
        } else if (sql.startsWith("SELECT pg_advisory_unlock")) {
          unlock();
        } else if (sql === "SELECT name FROM _migrations") {
          return { rows: rows.map((name) => ({ name })) };
        } else if (sql === "BEGIN") transaction = [];
        else if (sql.startsWith("INSERT INTO _migrations"))
          transaction.push(() => rows.push(args[0]));
        else if (sql === "COMMIT") transaction.forEach((effect) => effect());
        else if (sql === "ROLLBACK") transaction = [];
        else if (sql === "FAIL") throw new Error("invalid migration");
        else if (!sql.startsWith("CREATE TABLE IF NOT EXISTS _migrations")) {
          transaction.push(() => effects.push(sql));
        }
        events.push(sql);
        return { rows: [] };
      },
    };
  }
  return { connect, rows, effects, events };
}
const files = [{ name: "0001.sql" }];

test("concurrent deployers re-read bookkeeping after acquiring the lock", async () => {
  const db = database();
  const run = () =>
    applyMigrations(
      db.connect(),
      files,
      async () => "CREATE EXAMPLE",
      () => {},
    );
  const counts = await Promise.all([run(), run()]);
  assert.deepEqual(counts.sort(), [0, 1]);
  assert.deepEqual(db.effects, ["CREATE EXAMPLE"]);
  assert.deepEqual(db.rows, ["0001.sql"]);
});

test("a failing file rolls back, releases the lock, and can be retried", async () => {
  const db = database();
  await assert.rejects(
    applyMigrations(
      db.connect(),
      files,
      async () => "FAIL",
      () => {},
    ),
    /invalid migration/,
  );
  assert.deepEqual(db.rows, []);
  assert.ok(db.events.includes("ROLLBACK"));
  assert.match(db.events.at(-1), /pg_advisory_unlock/);
  assert.equal(
    await applyMigrations(
      db.connect(),
      files,
      async () => "CREATE EXAMPLE",
      () => {},
    ),
    1,
  );
});

test("reading a missing file releases the lock without opening a transaction", async () => {
  const db = database();
  await assert.rejects(
    applyMigrations(db.connect(), files, async () => {
      throw new Error("missing file");
    }),
    /missing file/,
  );
  assert.equal(db.events.includes("BEGIN"), false);
  assert.match(db.events.at(-1), /pg_advisory_unlock/);
});

test("production migration command fails instead of claiming success without a database", () => {
  const result = spawnSync(process.execPath, ["scripts/migrate.mjs"], {
    cwd: new URL("../", import.meta.url),
    env: { ...process.env, NODE_ENV: "production", DATABASE_URL: " " },
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /DATABASE_URL is required/);
});
