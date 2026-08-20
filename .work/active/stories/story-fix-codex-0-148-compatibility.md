---
id: story-fix-codex-0-148-compatibility
kind: story
stage: done
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-20
updated: 2026-08-20
---

# Restore managed launch with Codex 0.148.x

## Symptom

After updating Codex with `npm install -g @openai/codex`, `agent-codex` exits
without launching the managed TUI. `agent-board doctor` reports
`CODEX_VERSION_UNSUPPORTED` for the installed `codex-cli 0.148.0`.

## Root cause

`src/integrations/codex/compatibility.ts` accepts only minor version 147 even
though the installed Codex 0.148.0 schema probe passes Agent Board's narrow
notification, outcome, and thread-binding contract. The upstream 0.148.0 CLI
also retains the required loopback app-server and remote-TUI commands.

## Fix approach

Extend the explicit compatibility allowlist through Codex 0.148.x while keeping
future minor releases fail-closed. Refresh operator-facing compatibility text
to describe the tested families.

## Regression test

`tests/integrations/codex/endpoint.test.ts` asserts that 0.148.0 is accepted and
0.149.0 remains unsupported. Before the fix, the 0.148.0 assertion fails with
the reported unsupported-version result.

## Implementation notes

- **Execution capability:** Focused inline implementation was selected because
  the root cause was one explicit allowlist at a narrow external boundary. A
  bounded documentation worker refreshed the operator-facing claims after the
  code change; no independent implementation worker was needed.
- **Files changed:** `src/integrations/codex/compatibility.ts`,
  `tests/integrations/codex/endpoint.test.ts`,
  `tests/application/doctor.test.ts`, `README.md`,
  `docs/ARCHITECTURE.md`, `docs/configuration.md`,
  `examples/codex/status-line.toml`, the generated knowledge-index layers, and
  `doc-review-report.md`.
- **Regression evidence:** The new 0.148.0 assertion failed before the code
  change and passed afterward; 0.149.0 remains unsupported.
- **Full-suite evidence:** `npm test` passed 200 tests with 2 opt-in integration
  skips and no failures.
- **Original reproduction:** `agent-board doctor` now reports
  `CODEX_COMPATIBLE` for installed Codex 0.148.0 and returns `Ready`.
- **Live boundary evidence:** The installed-schema integration probe passed.
  A real 0.148.0 app-server also started on an ephemeral loopback endpoint,
  completed JSON-RPC initialization and `thread/loaded/list`, and shut down
  cleanly.
- **Documentation checks:** Knowledge-index lint reported 0 errors and 0
  warnings. A fresh system-level documentation audit reported 0 Critical and 0
  High findings.
- **Adjacent issues parked:** None. The audit retained one non-blocking note
  about historical 0.147-only wording in completed feature bodies; current
  foundation docs and implementation are consistent.

## Review (2026-08-20)

**Verdict**: Approve

**Blockers**: none

**Important**: none

**Nits**: none

**Rejected**: none

**Notes**: Bounded inline standalone-story review at the project's standard
weight; no independent, fresh-context, or cross-model reviewer ran. The diff
addresses the stale allowlist directly, retains a fail-closed future-version
boundary, and includes a regression test that failed before the fix. The full
suite, real installed-schema probe, live app-server initialize/query probe,
operator doctor, knowledge-index lint, and system documentation audit are
green. Security-specific lenses were bounded to the unchanged shell-free local
process boundary; no auth, secret, path, or remote-network behavior changed.
