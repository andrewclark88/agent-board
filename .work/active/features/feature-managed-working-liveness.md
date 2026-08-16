---
id: feature-managed-working-liveness
kind: feature
stage: drafting
created: 2026-08-16
updated: 2026-08-16
tags: [state, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
---

# Keep managed working state truthful for long-running turns

## Brief

A healthy managed Codex turn can remain active for hours without emitting
another lifecycle transition. The current 60-second `workingFreshForMs` policy
demotes that authoritative `working` observation to `?` whenever `agents`
reconciles after the threshold, even though the owned launcher and observer are
still healthy. The next real event restores the correct glyph, which Andrew
observed live when `?` returned to `✓` at completion.

Replace elapsed event age as the sole liveness signal for managed working state.
Keep `● working` while the managed observation topology is demonstrably alive,
and degrade to `?` when that topology is actually lost or cannot be trusted.
Preserve conservative handling for abandoned state, future timestamps,
ordinary/unmanaged sessions, closed terminals, and normal completion/input/error
transitions.

## Simplification opportunity

Remove the misleading coupling between legitimate turn duration and the
60-second projection threshold. Reuse the existing managed launcher identity and
reconciliation boundary if they provide sufficient liveness evidence; avoid a
daemon, heartbeat protocol, or new persisted schema unless the existing runtime
evidence cannot express the contract safely.

## Source observation

Promoted from `idea-managed-working-freshness`. Andrew runs agent tasks lasting
many hours, so a fixed one-minute working lifetime makes the attention board
materially untrustworthy even though eventual completion still recovers.
