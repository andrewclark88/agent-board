---
id: gate-patterns-inconsistency-codex-process-override
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

# Narrow the Codex process composition override to its capability

## Pattern

`port-overrideable-per-binary-composition-root`

## Divergence

`src/composition/create-agent-codex.ts:21` types the process override as the
concrete `CodexProcessHost`, unlike the other composition roots' capability
typed override seams.

## Behavior-preserving reconciliation

Type the override as `ManagedLaunchDependencies["processes"]` or an equivalent
narrow port. This preserves every invoked method and the production default.
