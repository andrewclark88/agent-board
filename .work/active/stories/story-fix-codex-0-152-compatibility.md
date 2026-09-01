---
id: story-fix-codex-0-152-compatibility
kind: story
stage: done
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-09-01
updated: 2026-09-01
---

# Restore managed launch with Codex 0.152.x

## Symptom

After Codex updated to `codex-cli 0.152.0`, `agent-codex` rejected the installed
CLI as unsupported before starting its managed app-server and remote TUI.

## Root cause

`src/integrations/codex/compatibility.ts` enumerated tested compatible minor
families only through `0.150.x`. The installed `0.152.0` app-server still passes
Agent-Board's live narrow schema contract, but the static gate had not been
updated with that evidence.

## Fix approach

Admit the verified `0.152.x` family through the existing narrow compatibility
gate and update operator-facing compatibility guidance. Do not infer support
for the unverified `0.151.x` family or later releases.

## Regression test

`tests/integrations/codex/endpoint.test.ts` asserts that `codex-cli 0.152.0` is
accepted. The test failed before the implementation with an `unsupported`
compatibility result. The opt-in installed probe confirms the 0.152 app-server
still exposes all lifecycle shapes consumed by Agent-Board.

## Implementation notes

- **Execution capability:** Focused host implementation with the installed
  Codex boundary as live evidence. The change is a narrow standalone bug fix;
  documentation alignment used one scoped worker, while code review remains
  inline as required for standalone stories.
- **Files changed:** `src/integrations/codex/compatibility.ts`,
  `tests/integrations/codex/endpoint.test.ts`, `README.md`,
  `docs/ARCHITECTURE.md`, `docs/configuration.md`,
  `examples/codex/status-line.toml`, generated knowledge indexes, and
  `doc-review-report.md`.
- **Regression test:** The new `0.152.0` assertion failed before the fix with
  `reasonCode: unsupported`, then passed after adding minor `152` to the narrow
  supported set. The existing `0.151.0` exclusion remains green.
- **Four-step confirmation:** The focused unit test passes; `npm test` passes
  231/231 with three intentional opt-in skips; the live installed schema probe
  passes against `codex-cli 0.152.0`; and `agent-board doctor --json` reports
  `CODEX_COMPATIBLE` for `0.152.0` with the full local system ready.
- **Documentation and index:** Current runtime claims are aligned and knowledge
  regeneration completed with zero errors. The required system doc review
  returned 0 Critical and 0 High findings.
- **Adjacent issue not bundled:** `docs/PRINCIPLES.md` still uses pre-Claude
  Codex-only wording for the narrow proof. The doc review records this as a
  Medium finding; per its policy, it is surfaced rather than auto-fixed inside
  this compatibility repair.

## Review (2026-09-01)

**Verdict**: Approve

**Blockers**: none
**Important**: none
**Nits**: none
**Rejected**: none

**Notes**: Bounded inline standalone-story review at the project's standard
weight; no independent, fresh-context, or cross-model reviewer ran. Correctness
review confirmed the change addresses the static version-gate root cause while
retaining the explicit `0.151.x` exclusion. The regression assertion fails on
the old gate and passes on the new one; the live schema probe, full suite, and
doctor result supply proportionate boundary evidence. The change only broadens
an explicitly tested compatibility family, introduces no command-execution or
data-handling change, and keeps operator and foundation assertions aligned.
Security-specific review was non-applicable beyond confirming no executable
boundary changed.
