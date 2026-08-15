---
id: epic-operational-readiness-packaged-e2e-failure
kind: story
stage: implementing
tags: [e2e-test, testing]
parent: epic-operational-readiness-packaged-e2e
depends_on: [epic-operational-readiness-packaged-e2e-infra]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Packaged failure journeys

Implement Unit 3 from the parent feature: invalid inputs, independent doctor
failures, snapshot degradation, Codex failure projection, and recoverable
unregister/title-clear failure.

Acceptance:

- Failures have stable exit/output semantics and never create false idle,
  completion, or successful removal.
- Canonical files remain parseable and retryable after every failed operation.
- One failed dependency does not hide independent doctor evidence.

Test integrity: park real product bugs with a linked skipped failing test; fix
bad fixtures in-session; never loosen an error invariant merely to go green.
