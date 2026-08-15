import assert from "node:assert/strict";
import { test } from "node:test";

import { renderDoctor, renderDoctorJson } from "../../src/cli/doctor-output.js";
import type { DoctorReport } from "../../src/application/doctor.js";

const report: DoctorReport = Object.freeze({
  schemaVersion: 1,
  checkedAt: "2026-08-15T00:00:00.000Z",
  ready: false,
  checks: Object.freeze([
    Object.freeze({ component: "runtime", code: "RUNTIME_SUPPORTED", severity: "info", message: "Node.js 22.12.0 is supported" }),
    Object.freeze({ component: "state", code: "STATE_DIRECTORY_UNAVAILABLE", severity: "error", message: "State is unavailable", remediation: "Check permissions." }),
    Object.freeze({ component: "ghostty", code: "GHOSTTY_TITLE_BELL", severity: "warning", message: "Title bell is enabled" }),
  ]),
});

test("doctor human output groups stable checks and remediation without causes", () => {
  const output = renderDoctor(report);
  assert.match(output, /^AGENT BOARD DOCTOR\n/u);
  assert.match(output, /Runtime\n  \[ok\] RUNTIME_SUPPORTED/u);
  assert.match(output, /State\n  \[error\] STATE_DIRECTORY_UNAVAILABLE: State is unavailable\n    Remediation: Check permissions\./u);
  assert.match(output, /Ghostty\n  \[warn\] GHOSTTY_TITLE_BELL/u);
  assert.match(output, /Not ready\.\n$/u);
  assert.equal(output.includes("cause"), false);
});

test("doctor JSON is the newline-terminated canonical report", () => {
  assert.equal(renderDoctorJson(report), `${JSON.stringify(report)}\n`);
});

