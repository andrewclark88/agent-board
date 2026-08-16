---
id: feature-managed-working-liveness-projection-policy
kind: story
stage: implementing
tags: [state, integration]
parent: feature-managed-working-liveness
depends_on: [feature-managed-working-liveness-launcher-probe]
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Project long-running work from verified launcher liveness

Integrate the launcher probe into reconciliation and let a live managed launcher
authorize hours-old working evidence. Preserve the age threshold for unbound
records and convert a missing launcher into explicit stale diagnostic evidence
before title/board projection.

## Acceptance evidence

- The exact hours-long working regression remains `●` while its launcher lives.
- Missing launcher evidence becomes `?`, never idle, completion, or error.
- Existing state precedence and full packaged journeys remain green.
