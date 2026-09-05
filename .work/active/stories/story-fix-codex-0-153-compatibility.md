---
id: story-fix-codex-0-153-compatibility
kind: story
stage: review
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-09-05
updated: 2026-09-05
---

# Restore managed launch with Codex 0.153.x

## Symptom

After Codex updated to `codex-cli 0.153.4`, `agent-codex` rejected the installed
CLI as unsupported before starting its managed app-server and remote TUI.

## Root cause

`src/integrations/codex/compatibility.ts` enumerates only Codex minor families
whose live app-server contract has been verified. The latest allowlist ended at
`0.152.x`, so the newly installed `0.153.4` was rejected even though its
generated schemas still satisfy Agent-Board's narrow observation contract.

## Fix approach

Admit the live-verified `0.153.x` family through the existing compatibility gate
and align operator-facing compatibility guidance. Preserve the explicit
exclusion of unverified families.

## Regression test

`tests/integrations/codex/endpoint.test.ts` asserts that `codex-cli 0.153.4` is
accepted. Before the implementation, it fails with `reasonCode: unsupported`.
The opt-in installed probe confirms the local 0.153 app-server still exposes
the schema shapes and lifecycle values consumed by Agent-Board.

## Implementation notes

- **Execution capability:** Focused host implementation with a scoped
  documentation worker and an independent system-doc audit. The repair changes
  one tested compatibility boundary and does not alter the managed Codex
  topology or protocol mapping.
- **Files changed:** `src/integrations/codex/compatibility.ts`,
  `tests/integrations/codex/endpoint.test.ts`, `README.md`,
  `docs/ARCHITECTURE.md`, `docs/configuration.md`,
  `examples/codex/status-line.toml`, the generated knowledge indexes, and
  `doc-review-report.md`.
- **Regression test:** The new `0.153.4` assertion failed before the fix with
  `reasonCode: unsupported`, then passed after adding minor `153` to the narrow
  supported set.
- **Four-step confirmation:** The focused regression test passes; `npm test`
  passes 231 tests with 3 intentional opt-in skips; the live installed schema
  probe passes against `codex-cli 0.153.4`; and the rebuilt local
  `agent-board doctor --json` reports `CODEX_COMPATIBLE` with the full local
  system ready.
- **Documentation and index:** Operator-facing support claims are aligned;
  knowledge-index regeneration completed with zero errors; the required fresh
  system doc audit returned 0 Critical and 0 High findings.
- **Adjacent issue not bundled:** `docs/research-plan.md` retains stale wording
  about ordinary Codex as a degraded-confidence fallback. The doc review
  records it as a Medium finding for separate alignment.
