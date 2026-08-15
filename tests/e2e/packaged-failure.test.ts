import { test } from "node:test";
import assert from "node:assert/strict";

import { createPackageHarness, type PackageHarness } from "./support/package-harness.js";

interface Row { sessionId: string; label: string; glyph: string; status: string; diagnostics: string[]; }

async function rows(harness: PackageHarness): Promise<Row[]> {
  const result = await harness.run("agents", ["--json"]);
  assert.equal(result.code, 0, result.stderr);
  return (JSON.parse(result.stdout) as { sessions: Row[] }).sessions;
}

async function waitForRow(harness: PackageHarness, predicate: (row: Row) => boolean): Promise<Row> {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    const row = (await rows(harness)).find(predicate);
    if (row) return row;
    await new Promise<void>((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Timed out waiting for row: ${JSON.stringify(await rows(harness))}`);
}

test("packed failure journeys preserve actionable errors and retryable records", async () => {
  const harness = await createPackageHarness();
  let launcher;
  try {
    let result = await harness.run("agent-name", ["unsafe\nlabel"]);
    assert.equal(result.code, 1);
    assert.match(result.stderr, /INVALID_LABEL/u);
    assert.match((await harness.run("agents", ["--json"])).stdout, /sessions":\[\]/u);

    await harness.writeScenario((value) => ({
      ...value,
      ghostty: {
        ...value.ghostty,
        version: "Ghostty 1.2.9",
        defaultConfig: "macos-applescript = true\n",
        userConfig: "macos-applescript = false\n",
        automationDenied: true,
      },
      codex: { ...value.codex, version: "codex-cli 0.100.0" },
    }));
    result = await harness.run("agent-board", ["doctor"]);
    assert.equal(result.code, 1);
    assert.match(result.stdout, /CODEX_VERSION_UNSUPPORTED/u);
    assert.match(result.stdout, /GHOSTTY_VERSION_UNSUPPORTED/u);
    assert.match(result.stdout, /GHOSTTY_APPLESCRIPT_DISABLED/u);
    assert.match(result.stdout, /GHOSTTY_AUTOMATION_DENIED/u);

    await harness.writeScenario((value) => ({
      ...value,
      ghostty: { ...value.ghostty, version: "Ghostty 1.3.1", userConfig: "macos-applescript = true\n", automationDenied: false },
      codex: { ...value.codex, version: "codex-cli 0.147.2", status: "error" },
    }));
    result = await harness.run("agent-name", ["reporting"]);
    assert.equal(result.code, 0, result.stderr);
    await harness.writeScenario((value) => ({ ...value, ghostty: { ...value.ghostty, snapshotAvailable: false } }));
    const diagnostic = await waitForRow(harness, (row) => row.label === "reporting" && row.glyph === "?");
    assert.equal(diagnostic.status, "diagnostic");
    assert.match(diagnostic.diagnostics.join(" "), /terminal is unknown/u);

    await harness.writeScenario((value) => ({ ...value, ghostty: { ...value.ghostty, snapshotAvailable: true, focusedTerminalId: "term-one" } }));
    launcher = harness.start("agent-codex");
    await waitForRow(harness, (row) => row.label === "reporting" && row.status === "error");
    launcher.child.kill("SIGTERM");
    await launcher.exit;
  } finally {
    if (launcher && launcher.child.exitCode === null) launcher.child.kill("SIGTERM");
    if (launcher) await launcher.exit;
    await harness.close();
  }
});

test("failed title clear retains a record for a healthy retry", async () => {
  const harness = await createPackageHarness();
  try {
    let result = await harness.run("agent-name", ["clear-me"]);
    assert.equal(result.code, 0, result.stderr);
    const current = await harness.run("agents", ["--json"]);
    const sessionId = (JSON.parse(current.stdout) as { sessions: Array<{ sessionId: string }> }).sessions[0]?.sessionId;
    assert.ok(sessionId);
    await harness.writeScenario((value) => ({ ...value, ghostty: { ...value.ghostty, titleActionFails: true } }));
    result = await harness.run("agent-board", ["unregister", sessionId]);
    assert.equal(result.code, 1);
    assert.match(result.stderr, /rejected the title action/u);
    assert.equal((await rows(harness)).length, 1);
    await harness.writeScenario((value) => ({ ...value, ghostty: { ...value.ghostty, titleActionFails: false } }));
    result = await harness.run("agent-board", ["unregister", sessionId]);
    assert.equal(result.code, 0, result.stderr);
    assert.equal((await rows(harness)).length, 0);
  } finally {
    await harness.close();
  }
});
