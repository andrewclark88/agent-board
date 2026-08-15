import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const enabled = process.env.AGENT_BOARD_LIVE_CODEX === "1";
const command = process.env.AGENT_BOARD_CODEX_COMMAND ?? "codex";

test("installed Codex reports the narrow compatibility contract", { skip: !enabled ? "Set AGENT_BOARD_LIVE_CODEX=1 to opt into the installed Codex probe" : false }, async () => {
  if (process.env.AGENT_BOARD_CODEX_COMMAND !== undefined && !isAbsolute(command)) {
    assert.fail("AGENT_BOARD_CODEX_COMMAND must be an absolute executable path");
  }
  let result;
  try {
    result = await execFileAsync(command, ["--version"], { env: process.env, timeout: 2_000, maxBuffer: 32 * 1024 });
  } catch (error) {
    assert.fail(`Installed Codex compatibility probe could not start: ${error instanceof Error ? error.message : String(error)}`);
  }
  assert.equal(typeof result.stdout, "string");
  assert.match(`${result.stdout}\n${result.stderr}`, /\b\d+\.\d+\.\d+\b/u);

  const outputRoot = await mkdtemp(join(tmpdir(), "agent-board-codex-schema-"));
  try {
    const schemaResult = await execFileAsync(command, ["app-server", "generate-json-schema", "--out", outputRoot], { env: process.env, timeout: 5_000, maxBuffer: 128 * 1024 });
    assert.equal(schemaResult.stderr, "", schemaResult.stderr);
    const files = await readdir(outputRoot, { recursive: true });
    const notification = files.find((file) => file.endsWith("ServerNotification.json"));
    assert.ok(notification, "Codex schema output did not include ServerNotification.json");
    const schema = JSON.parse(await readFile(join(outputRoot, notification), "utf8")) as unknown;
    const text = JSON.stringify(schema);
    for (const required of ["waitingOnApproval", "waitingOnUserInput", "idle", "active", "systemError", "completed", "interrupted", "failed", "inProgress"]) {
      assert.match(text, new RegExp(required, "u"), `Codex schema is missing ${required}`);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
