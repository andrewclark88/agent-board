---
id: epic-trustworthy-session-core-domain-contract
kind: feature
stage: drafting
tags: [state]
parent: epic-trustworthy-session-core
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Session Domain Contract

## Brief

Define the strict TypeScript and runtime-validated contract for Agent Board
session identity, terminal presence, normalized agent state, observation
evidence, revisions, and stable error codes. Expose the ports needed by storage,
clock, terminal, and agent-event adapters without importing concrete processes
or filesystem behavior.

Acceptance requires invalid records and unsafe labels to fail explicitly,
orthogonal state dimensions to remain independently writable, and clean process
exit to remain evidence rather than a health value.

## Inherited design decisions

- The parent epic's canonical schema, no-compatibility, adapter-boundary, and
  projection ownership decisions are fixed inputs.

## Research and foundation references

- `docs/ARCHITECTURE.md` — Domain model, module map, and error conventions.
- `docs/SPEC.md` — Normalized observed state and functional requirements.
- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — multidimensional state rationale.
