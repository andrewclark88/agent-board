---
id: feature-managed-working-liveness-launcher-probe
kind: story
stage: implementing
tags: [state, integration]
parent: feature-managed-working-liveness
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Add a non-destructive launcher liveness boundary

Introduce the domain port and Node process adapter that answer whether the
persisted managed launcher PID still exists using signal 0. Preserve explicit
`EPERM`/`ESRCH` semantics and inject all process behavior in tests.

## Acceptance evidence

- Existing, missing, permission-denied, and unsafe PID cases are covered at the
  adapter boundary.
- No test or production probe sends a destructive process signal.
