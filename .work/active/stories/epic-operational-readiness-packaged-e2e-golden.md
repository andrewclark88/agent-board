---
id: epic-operational-readiness-packaged-e2e-golden
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

# Packaged golden journeys

Implement Unit 2 from the parent feature: actual installed-bin journeys for
doctor/all-bin packaging, two-session register/rename and title-board parity,
managed lifecycle convergence across working/input/completion/idle, and safe
acknowledge/unregister.

Acceptance:

- Assertions observe only public command output, installed canonical state, and
  externally visible mock-service title/process outcomes.
- Each lifecycle event converges title and board within the declared 1,000 ms.
- The multi-session journey preserves independent identity and cleanup.

Test integrity: park real product bugs with a linked skipped failing test; fix
bad fixtures in-session; never game an assertion or mirror product logic.
