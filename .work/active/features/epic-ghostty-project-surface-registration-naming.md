---
id: epic-ghostty-project-surface-registration-naming
kind: feature
stage: drafting
tags: [integration, cli, state]
parent: epic-ghostty-project-surface
depends_on: [epic-ghostty-project-surface-applescript-adapter]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Focused Tab Registration and Naming

## Brief

Deliver the idempotent registration use case and `agent-name <label>` command.
Capture the focused Ghostty hierarchy, derive optional repository/branch context,
reuse the existing Board session for that terminal under the registry lock, and
persist a validated human-controlled label independently from machine status.

Registration must prevent duplicate rows under concurrent invocations, reject
unsafe names before external calls, and render the initial canonical title. It
does not infer Codex state or own global board output.

## Inherited design decisions

- Terminal ID is the registration dedupe key; label/repo/branch are presentation context.
- The store registry lock owns lookup/create serialization.

## Research and foundation references

- `.research/analysis/briefs/ghostty-registration-liveness.md` — stable identity capture.
- `docs/SPEC.md` — naming workflow and registration requirements.
- `docs/ARCHITECTURE.md` — register-session application service and command boundary.
