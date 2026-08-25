---
id: story-fix-codex-0-149-compatibility
kind: story
stage: review
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-25
updated: 2026-08-25
---

# Restore managed launch with Codex 0.149.x

## Symptom

After Codex updated to `0.149.1`, invoking `agent-codex` returned without opening
the remote TUI or printing an explanation.

## Root cause

`checkCodexCompatibility` admitted only the explicitly tested `0.147.x` and
`0.148.x` families. The managed launcher therefore rejected `0.149.1` before
starting app-server, recorded the failure in session state, and returned a
failed outcome without surfacing that lifecycle detail on stderr.

## Fix approach

Admit `0.149.x` at the existing narrow compatibility boundary after verifying
the installed `0.149.1` generated schema satisfies Agent Board's required
observation contract. Keep the next unverified minor rejected.

## Regression test

`tests/integrations/codex/endpoint.test.ts` asserts `0.149.1` is compatible and
`0.150.0` remains unsupported. The opt-in installed-Codex probe verifies the
current app-server schema shapes against the real `0.149.1` executable.

## Acceptance Criteria

- [x] `agent-codex` passes its version gate with installed Codex `0.149.1`.
- [x] The installed Codex schema still satisfies Agent Board's observation contract.
- [x] The next unverified Codex minor remains rejected.

## Implementation notes

- Execution capability: local focused repair, because the root cause and fix are
  confined to the tested Codex compatibility boundary.
- Files changed: `src/integrations/codex/compatibility.ts`,
  `tests/integrations/codex/endpoint.test.ts`, and compatibility references in
  `README.md`, `docs/ARCHITECTURE.md`, `docs/configuration.md`, and
  `examples/codex/status-line.toml`.
- Regression evidence: the new `0.149.1` assertion failed before the fix and
  passed after it; `0.150.0` remains rejected.
- Full confirmation: 228 tests passed with three opt-in probes skipped; the
  separately enabled installed-Codex probe passed against `0.149.1`; the built
  compatibility check returns `{ compatible: true, version: "0.149.1" }`; and
  `agent-board doctor --json` reports `CODEX_COMPATIBLE` with `ready: true`.
- The original remote-TUI launch was not repeated from the automation PTY because
  doing so could register and take over the operator's currently focused Ghostty
  tab; the failed version gate that caused the silent exit was exercised directly.
- Adjacent issues parked: none.
