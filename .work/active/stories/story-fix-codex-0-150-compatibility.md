---
id: story-fix-codex-0-150-compatibility
kind: story
stage: review
tags: [bug, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-27
updated: 2026-08-27
---

# Restore managed launch with Codex 0.150.x

## Symptom

After Codex updates to `0.150.1`, `agent-codex` exits before starting the managed
app-server and `agent-board doctor` reports `CODEX_VERSION_UNSUPPORTED`.

## Root cause

`src/integrations/codex/compatibility.ts` explicitly admits only Codex minor
families 147 through 149. The installed 0.150.1 app-server still satisfies the
consumed schema, WebSocket initialization, and loaded-thread discovery contracts,
but the pre-launch version gate rejects it before those capabilities can run.

## Fix approach

Add minor family 150 to the tested compatibility set and align the operator
documents and copyable example that state the tested Codex range. Keep the
explicit version gate because app-server remains an experimental external
boundary.

## Regression test

`tests/integrations/codex/endpoint.test.ts` asserts that `codex-cli 0.150.1` is
accepted by the same compatibility boundary used by managed launch and doctor.

## Implementation notes

- **Execution capability:** focused local implementation, because the verified
  regression was confined to one explicit external-version gate and its owned
  documentation; no cross-subsystem coordination was required.
- **Files changed:** `src/integrations/codex/compatibility.ts`,
  `tests/integrations/codex/endpoint.test.ts`, `README.md`,
  `docs/ARCHITECTURE.md`, `docs/configuration.md`,
  `examples/codex/status-line.toml`, and the regenerated knowledge indexes and
  documentation review report.
- **Regression evidence:** the new `0.150.1` assertion failed before the fix
  with `reasonCode: unsupported` and passes after adding minor family 150; the
  next untested family, `0.151.0`, remains explicitly rejected.
- **Four-step confirmation:** the targeted regression passes; `npm test` passes
  with 228 tests and 3 intentional opt-in skips; the live installed-Codex schema
  probe passes on 0.150.1; and the rebuilt `agent-board doctor --json` reports
  `CODEX_COMPATIBLE` for 0.150.1 with overall readiness `true`.
- **Documentation verification:** knowledge-index lint reports zero errors, and
  a mandatory fresh Sonnet doc-review audit reports 0 Critical and 0 High
  findings after its initial architecture/example findings were corrected.
- **Adjacent issues parked:** none.
