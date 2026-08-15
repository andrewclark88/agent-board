---
id: epic-operational-readiness-packaged-e2e
kind: feature
stage: drafting
tags: [e2e-test, integration]
parent: epic-operational-readiness
depends_on: [epic-operational-readiness-doctor-command]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Packaged Vertical-Slice Proof

## Brief

Prove the V1 from its packed npm artifact, not source-only imports. Install the
tarball into a temporary prefix, invoke all four public bins, and use temporary
state plus deterministic fake Codex/Ghostty executable boundaries to exercise
registration, working, input-needed, completion-unread, idle, error, board/title
parity, acknowledgement, unregister, diagnosis, and cleanup.

Keep default tests hermetic and safe. Add separately named opt-in probes for the
installed Codex protocol and a disposable Ghostty surface; they must never touch
existing user tabs and must skip with an explicit reason when prerequisites are
absent. No release/deployment automation belongs here.

## Epic context

- Parent: `epic-operational-readiness`.
- Depends on the public doctor contract and validates the complete packaged V1.

## Foundation and research

- `docs/ARCHITECTURE.md` — packaging and contract-derived testing pyramid.
- `docs/SPEC.md` — five-state acceptance boundary and responsiveness.
- Runtime research briefs — installed protocol and safe Ghostty probe limits.

<!-- The /e2e-test-design pass fills the scenario matrix and implementation units. -->
