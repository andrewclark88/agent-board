---
id: gate-patterns-inconsistency-codex-terminal-override
kind: story
stage: drafting
tags: [refactor]
parent: feature-align-shared-port-composition-overrides
depends_on: []
release_binding: null
gate_origin: patterns
created: 2026-08-16
updated: 2026-08-16
---

# Narrow the Codex terminal composition override to ports

## Pattern

`port-overrideable-per-binary-composition-root`

## Divergence

`src/composition/create-agent-codex.ts:19` requires the concrete
`GhosttyClient` type for its terminal override in addition to the registration,
reconciliation, and focus capabilities it actually consumes.

## Behavior-preserving reconciliation

Replace the concrete constraint with the required shared-port intersection.
The production default and every runtime method call remain unchanged.
