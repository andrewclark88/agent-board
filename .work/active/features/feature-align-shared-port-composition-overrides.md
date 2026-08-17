---
id: feature-align-shared-port-composition-overrides
kind: feature
stage: drafting
tags: [refactor]
parent: null
depends_on: []
release_binding: null
gate_origin: patterns
created: 2026-08-16
updated: 2026-08-16
---

# Align shared ports and composition overrides

## Brief

Reconcile the three behavior-preserving inconsistencies found by the patterns
gate. Reuse the shared focused-terminal capability in managed launch, and type
Codex composition overrides against the narrow process and terminal ports they
consume rather than concrete adapters.

## Child checkpoints

- `gate-patterns-inconsistency-launcher-focused-terminal-port`
- `gate-patterns-inconsistency-codex-terminal-override`
- `gate-patterns-inconsistency-codex-process-override`

## Simplification opportunity

Delete one duplicate port declaration and remove two unnecessary concrete-type
dependencies from composition seams. Runtime construction and public behavior
must remain unchanged.

## Acceptance Criteria

- [ ] Managed launch imports the canonical focused-terminal capability.
- [ ] Codex process and terminal overrides are expressed as narrow ports.
- [ ] Existing composition and managed-launch behavior remains unchanged.
- [ ] Typecheck, focused tests, build, and the full suite pass.
