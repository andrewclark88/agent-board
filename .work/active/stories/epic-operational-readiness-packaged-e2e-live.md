---
id: epic-operational-readiness-packaged-e2e-live
kind: story
stage: implementing
tags: [e2e-test, testing, integration]
parent: epic-operational-readiness-packaged-e2e
depends_on: [epic-operational-readiness-packaged-e2e-golden]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Opt-in installed compatibility probes

Implement Unit 5 from the parent feature: separately named, environment-gated
Codex narrow-contract and disposable-Ghostty identity/title probes.

Acceptance:

- Default `npm test` never starts either live probe.
- Missing opt-in/prerequisites produce explicit skips before live mutation.
- Ghostty mutation targets only a newly created captured surface and always
  clears/closes it in `finally`; no existing tab is borrowed.
- The Codex probe is bounded and validates only the protocol shapes consumed by
  Agent Board.

Test integrity: park real compatibility bugs with a linked skipped failing test;
fix bad fixtures in-session; never turn a failed live contract into a silent
pass.
