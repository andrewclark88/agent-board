---
id: epic-managed-codex-observation-lifecycle-adapter
kind: feature
stage: drafting
tags: [integration, state]
parent: epic-managed-codex-observation
depends_on: [epic-managed-codex-observation-app-server-client]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Codex Lifecycle Adapter

## Brief

Bind the dedicated remote TUI's root thread and map validated app-server status,
waiting flags, turn completion/failure, and close/error evidence into Agent
Board's normalized transition union. Apply observations through the atomic
application service and retain explicit evidence/confidence metadata.

Thread ambiguity, missing required fields, unknown required enums, or an
unsupported installed version must produce visible adapter failure. The adapter
does not own process spawning, Ghostty titles, or a second agent backend.

## Inherited design decisions

- Active/idle status is authoritative; unread completion remains Board-owned.
- Dedicated process scope narrows candidates, but ambiguity is never guessed through.

## Research and foundation references

- `.research/analysis/briefs/codex-detector-topology.md` — event semantics and observed limitations.
- `.research/attestation/codex-cli-managed-runtime-probe.md` — concurrent observer evidence.
- `docs/SPEC.md` — normalized state and confidence requirements.
- `docs/ARCHITECTURE.md` — observer/thread-binding algorithm.
