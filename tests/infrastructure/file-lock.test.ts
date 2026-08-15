import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";
import assert from "node:assert/strict";
import lockfile from "proper-lockfile";

const execFileAsync = promisify(execFile);

test("a contending process stays alive and reports the bounded lock timeout", async () => {
  const root = await mkdtemp(join(tmpdir(), "agent-board-lock-test-"));
  const anchor = join(root, "session.lock");
  await writeFile(anchor, "", "utf8");
  const release = await lockfile.lock(anchor, { realpath: false, stale: 2_000 });
  const sourceUrl = new URL("../../src/infrastructure/file-lock.ts", import.meta.url).href;
  const script = [
    `import { withFileLock } from ${JSON.stringify(sourceUrl)};`,
    `await withFileLock(${JSON.stringify(anchor)}, { timeoutMs: 100, staleMs: 2_000 }, async () => undefined);`,
  ].join("\n");

  try {
    const result: { code?: number; stdout?: string; stderr?: string } = await execFileAsync(process.execPath, ["--import", "tsx", "--input-type=module", "--eval", script], {
      cwd: process.cwd(),
      timeout: 2_000,
    }).catch((error: unknown) => error as { code?: number; stdout?: string; stderr?: string });

    assert.notEqual(result.code, undefined, "contending child unexpectedly exited successfully");
    assert.match(result.stderr ?? "", /LOCK_TIMEOUT|Timed out acquiring state lock/u);
  } finally {
    await release();
    await rm(root, { recursive: true, force: true });
  }
});
