---
id: epic-swarm-attention-board
kind: epic
stage: drafting
tags: [cli, state]
parent: null
depends_on: [epic-ghostty-project-surface, epic-managed-codex-observation]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Swarm Attention Board

## Brief

Deliver the end-to-end operator experience for supervising several registered
tabs. The `agents` command reads and reconciles the shared store, renders compact
status rows with evidence diagnostics, and keeps title and board projections
consistent. Completion attention clears through reliably observed Ghostty focus
or an explicit acknowledgement command; input-required state clears only from
agent evidence.

This arc also owns safe unregister and stale-session presentation so dead or
hidden sessions never masquerade as live work. It remains a terminal control
plane: focus navigation, notifications, GUI, semantic actions, and hardware are
outside this epic.

## Research briefs

- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — grounds attention routing, unread completion, liveness diagnostics, and deferred controls.
- `.research/analysis/briefs/ghostty-registration-liveness.md` — establishes focus and visibility evidence constraints.
- `.research/analysis/briefs/codex-detector-topology.md` — defines the available lifecycle evidence and completion boundaries.

## Foundation references

- `docs/VISION.md` — at-a-glance supervision outcome.
- `docs/SPEC.md` — board rendering, acknowledgement, expiry, and acceptance scenarios.
- `docs/ARCHITECTURE.md` — independent commands, reconciliation, and shared projection flow.

## Anticipated child features

Provisional seams are the board query/renderer, attention acknowledgement, and
safe stale/unregister operations.

<!-- The /epic-design pass will fill in real child feature specifics into a
## Decomposition section below this one. -->
