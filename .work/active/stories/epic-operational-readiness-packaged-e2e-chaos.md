---
id: epic-operational-readiness-packaged-e2e-chaos
kind: story
stage: implementing
tags: [e2e-test, testing]
parent: epic-operational-readiness-packaged-e2e
depends_on: [epic-operational-readiness-packaged-e2e-golden]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Deterministic degradation and recovery

Implement Unit 4 from the parent feature: readiness-gated app-server loss,
Ghostty snapshot loss/restoration, and launcher termination during an active
remote TUI.

Acceptance:

- Each injected failure is deterministic and asserts a named visible
  degradation/recovery invariant.
- Owned processes exit within bounded TERM→KILL cleanup and no canonical record
  is corrupt or falsely completed.
- Tests assert product output/state, never only fixture signals.

Test integrity: park real product bugs with a linked skipped failing test; fix
bad fixtures in-session; never hide or de-randomize a failure by weakening its
assertions.
