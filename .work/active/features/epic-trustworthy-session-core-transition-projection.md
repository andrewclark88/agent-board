---
id: epic-trustworthy-session-core-transition-projection
kind: feature
stage: drafting
tags: [state]
parent: epic-trustworthy-session-core
depends_on: [epic-trustworthy-session-core-domain-contract, epic-trustworthy-session-core-atomic-store]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Transition and Projection Policy

## Brief

Implement application services that apply validated partial observations to the
latest session revision and derive the one canonical attention projection used
by Ghostty titles and board rows. Encode precedence for error, input-required,
completion-unread, working, idle, and diagnostic states plus freshness and clean
process-exit behavior.

Acceptance requires identical projections for identical records regardless of
caller, no false primary glyph for stale or ambiguous evidence, and transition
tests covering field ownership and acknowledgement boundaries.

## Inherited design decisions

- Projection is pure, diagnostic `?` is outside the five primary symbols, and
  process exit is observation evidence.

## Research and foundation references

- `docs/ARCHITECTURE.md` — Projection policy and application services.
- `docs/SPEC.md` — Projection precedence and acknowledgement requirements.
- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — attention and evidence semantics.
