import assert from "node:assert/strict";
import { test } from "node:test";

import { diagnoseSystem, type DoctorDependencies } from "../../src/application/doctor.js";
import type { GhosttyDiagnosticReport } from "../../src/integrations/ghostty/diagnostics.js";

const cleanGhostty: GhosttyDiagnosticReport = {
  version: "1.3.1",
  automationReady: true,
  diagnostics: [],
};

function dependencies(overrides: Partial<DoctorDependencies> = {}): DoctorDependencies {
  return {
    clock: { now: () => new Date("2026-08-15T00:00:00.000Z") },
    nodeVersion: "22.12.0",
    state: { probe: async () => "/private/state" },
    codex: { version: async () => "0.147.2" },
    ghostty: async () => cleanGhostty,
    ...overrides,
  };
}

test("diagnoseSystem runs every component, orders evidence, and freezes the report", async () => {
  const calls: string[] = [];
  const report = await diagnoseSystem(dependencies({
    state: { probe: async () => { calls.push("state"); throw new Error("permission denied"); } },
    codex: { version: async () => { calls.push("codex"); throw new Error("codex missing"); } },
    ghostty: async () => { calls.push("ghostty"); return cleanGhostty; },
  }));

  assert.deepEqual(calls, ["state", "codex", "ghostty"]);
  assert.equal(report.ready, false);
  assert.deepEqual(report.checks.map((item) => item.component), ["runtime", "state", "codex", "ghostty", "ghostty"]);
  assert.deepEqual(report.checks.map((item) => item.code), [
    "RUNTIME_SUPPORTED",
    "STATE_DIRECTORY_UNAVAILABLE",
    "CODEX_UNAVAILABLE",
    "GHOSTTY_AUTOMATION_READY",
    "GHOSTTY_VERSION_SUPPORTED",
  ]);
  assert.equal(Object.isFrozen(report), true);
  assert.equal(Object.isFrozen(report.checks), true);
  assert.equal(Object.isFrozen(report.checks[0]), true);
});

test("diagnoseSystem maps Ghostty diagnostics and keeps warnings ready", async () => {
  const report = await diagnoseSystem(dependencies({
    ghostty: async () => ({
      version: "1.3.1",
      automationReady: true,
      diagnostics: [{
        code: "GHOSTTY_TITLE_BELL",
        severity: "warning",
        message: "Title bell decoration is enabled",
        remediation: "Add no-title to bell-features.",
      }],
    }),
  }));
  assert.equal(report.ready, true);
  assert.deepEqual(report.checks.filter((item) => item.component === "ghostty").map((item) => item.code), [
    "GHOSTTY_AUTOMATION_READY",
    "GHOSTTY_TITLE_BELL",
    "GHOSTTY_VERSION_SUPPORTED",
  ]);
});

test("diagnoseSystem rejects invalid clock and boundary report shapes", async () => {
  await assert.rejects(
    diagnoseSystem(dependencies({ clock: { now: () => new Date("invalid") } })),
    /valid Date/u,
  );
  await assert.rejects(
    diagnoseSystem(dependencies({ ghostty: async () => ({ automationReady: true, diagnostics: "bad" } as unknown as GhosttyDiagnosticReport) })),
    /invalid shape/u,
  );
});

