import { test } from "node:test";
import assert from "node:assert/strict";

import { createPackageHarness, waitForScenario, type PackageHarness } from "./support/package-harness.js";

interface Row {
  sessionId: string;
  label: string;
  glyph: string;
  status: string;
  agentMode: string;
  titleRendered: boolean;
}

async function rows(harness: PackageHarness): Promise<Row[]> {
  const result = await harness.run("agents", ["--json"]);
  assert.equal(result.code, 0, result.stderr);
  return (JSON.parse(result.stdout) as { sessions: Row[] }).sessions;
}

async function waitForRow(harness: PackageHarness, predicate: (row: Row) => boolean, timeoutMs = 2_000): Promise<Row> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const match = (await rows(harness)).find(predicate);
    if (match) return match;
    await new Promise<void>((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Timed out waiting for board row: ${JSON.stringify(await rows(harness))}`);
}

test("packed golden journeys preserve board/title parity and independent session identity", async () => {
  const harness = await createPackageHarness({
    ghostty: {
      terminals: {
        "term-two": { windowId: "window-two", tabId: "tab-two", terminalId: "term-two", workingDirectory: "/tmp/second-project" },
      },
    },
  });
  let launcher;
  try {
    let result = await harness.run("agent-name", ["data-platform"]);
    assert.equal(result.code, 0, result.stderr);
    await harness.writeScenario((scenario) => ({ ...scenario, ghostty: { ...scenario.ghostty, focusedTerminalId: "term-two" } }));
    result = await harness.run("agent-name", ["acquisition"]);
    assert.equal(result.code, 0, result.stderr);

    let currentRows = await rows(harness);
    assert.deepEqual(currentRows.map((row) => row.label), ["acquisition", "data-platform"]);
    let scenario = await harness.readScenario();
    assert.equal(scenario.ghostty.terminals["term-one"]?.title, "○ data-platform");
    assert.equal(scenario.ghostty.terminals["term-two"]?.title, "○ acquisition");

    await harness.writeScenario((value) => ({ ...value, ghostty: { ...value.ghostty, focusedTerminalId: "term-one" }, codex: { ...value.codex, status: "idle" } }));
    launcher = harness.start("agent-codex");
    const managed = await waitForRow(harness, (row) => row.label === "data-platform" && row.agentMode === "managed");
    assert.equal(managed.glyph, "○");

    for (const [status, glyph, title] of [["working", "●", "● data-platform"], ["input", "!", "! data-platform"]] as const) {
      const startedAt = performance.now();
      await harness.writeScenario((value) => ({ ...value, codex: { ...value.codex, status } }));
      const row = await waitForRow(harness, (candidate) => candidate.label === "data-platform" && candidate.glyph === glyph, 900);
      assert.equal(row.titleRendered, true);
      scenario = await waitForScenario(harness, (candidate) => candidate.ghostty.terminals["term-one"]?.title === title, 900);
      assert.equal(scenario.ghostty.terminals["term-one"]?.title, title);
      assert.ok(performance.now() - startedAt < 1_000, `lifecycle convergence exceeded 1000ms for ${status}`);
    }

    // Codex reports resolution of the input wait before the final idle edge;
    // this is the public lifecycle contract that clears input attention.
    await harness.writeScenario((value) => ({ ...value, codex: { ...value.codex, status: "working" } }));
    await waitForRow(harness, (candidate) => candidate.label === "data-platform" && candidate.glyph === "●");
    const completionStartedAt = performance.now();
    await harness.writeScenario((value) => ({ ...value, codex: { ...value.codex, status: "idle" } }));
    const completed = await waitForRow(harness, (candidate) => candidate.label === "data-platform" && candidate.glyph === "✓", 900);
    assert.equal(completed.status, "finished");
    scenario = await waitForScenario(harness, (candidate) => candidate.ghostty.terminals["term-one"]?.title === "✓ data-platform", 900);
    assert.equal(scenario.ghostty.terminals["term-one"]?.title, "✓ data-platform");
    assert.ok(performance.now() - completionStartedAt < 1_000, "completion convergence exceeded 1000ms");

    result = await harness.run("agent-board", ["ack"]);
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /Acknowledged/u);
    await waitForRow(harness, (candidate) => candidate.label === "data-platform" && candidate.glyph === "○");

    result = await harness.run("agent-board", ["unregister", completed.sessionId]);
    assert.equal(result.code, 0, result.stderr);
    currentRows = await rows(harness);
    assert.deepEqual(currentRows.map((row) => row.label), ["acquisition"]);
    scenario = await waitForScenario(harness, (candidate) => candidate.ghostty.terminals["term-one"]?.title === "");
    assert.equal(scenario.ghostty.terminals["term-two"]?.title, "○ acquisition");
  } finally {
    if (launcher) launcher.child.kill("SIGTERM");
    if (launcher) await launcher.exit;
    await harness.close();
  }
});
