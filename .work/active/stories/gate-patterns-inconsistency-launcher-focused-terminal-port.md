---
id: gate-patterns-inconsistency-launcher-focused-terminal-port
kind: story
stage: drafting
tags: [refactor]
parent: null
depends_on: []
release_binding: null
gate_origin: patterns
created: 2026-08-16
updated: 2026-08-16
---

# Reuse the shared focused-terminal port in managed launch

## Pattern

`shared-capability-port-reuse`

## Divergence

`src/application/launch-managed-codex.ts:24` redeclares
`FocusedTerminalPort`, although the same capability is already owned by
`src/domain/ports.ts:44`.

## Behavior-preserving reconciliation

Import the shared type and remove the local declaration. This changes only the
compile-time ownership of the interface; runtime construction and calls remain
unchanged.
