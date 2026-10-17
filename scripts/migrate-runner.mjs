/** Serialize deploys before reading bookkeeping; rollback each failed file. */
export async function applyMigrations(client, files, readMigration, log = console.log) {
  // Fixed application namespace. Session lock covers bookkeeping and all files.
  const lock = [1953066612, 1634560359];
  await client.query("SELECT pg_advisory_lock($1, $2)", lock);
  try {
    await client.query(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const applied = new Set(
      (await client.query("SELECT name FROM _migrations")).rows.map((r) => r.name),
    );
    let count = 0;
    for (const { name } of files) {
      if (applied.has(name)) continue;
      const sql = await readMigration(name);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch {
          /* Preserve the original failure. */
        }
        throw error;
      }
      applied.add(name);
      log(`[migrate] applied ${name}`);
      count += 1;
    }
    return count;
  } finally {
    await client.query("SELECT pg_advisory_unlock($1, $2)", lock);
  }
}
