---
id: epic-swarm-attention-board-operator-controls
kind: feature
stage: drafting
tags: [cli, state]
parent: epic-swarm-attention-board
depends_on: [epic-swarm-attention-board-board-command]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Explicit Operator Controls

## Brief

Deliver `agent-board ack [session-id]` and `agent-board unregister
[session-id]` as the V1's narrow explicit control surface. With no argument, a
command resolves the currently focused registered Ghostty terminal; with an
argument, it accepts only the exact Board session ID. Ambiguous labels, display
order, and prefixes never select a destructive target.

Acknowledgement clears completion-unread only through the existing canonical
transition and reconciles title state without clearing input-required attention.
Unregister delegates to the existing recoverable operation, clearing a visible
or undo-hidden title override before record removal and retaining the record on
failure. This feature establishes an additive subcommand router for the later
`doctor` command, but does not implement diagnostics, focus navigation, generic
keystrokes, semantic agent actions, or automatic expiry.

## Epic context

- Parent epic: `epic-swarm-attention-board`
- Position in epic: write-capability consumer of the board command's output,
  target-display, and error conventions.

## Inherited design decisions

- Omitted targets mean the current registered Ghostty terminal; explicit targets
  are full session IDs only.
- Labels are presentation, never action identity.
- Mutating commands use terse human output in V1; structured automation is not
  yet an earned contract.
- The command router is a small explicit registry that can add `doctor` later.
- Disconnected records remain until explicit unregister; there is no auto-prune.

## Research briefs

- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — Board-owned
  acknowledgement and capability-gated action constraints.
- `.research/analysis/briefs/ghostty-registration-liveness.md` — reliable focus
  identity and title clearing for visible/undo-hidden targets.

## Foundation references

- `docs/SPEC.md` — explicit acknowledgement fallback, unregister reversibility,
  and observation-only safety boundary.
- `docs/ARCHITECTURE.md` — `agent-board ack|unregister` command contracts and
  independent invocation topology.
- `docs/PRINCIPLES.md` — human/machine separation and semantic-action restraint.

<!-- The /feature-design pass fills interfaces, implementation units, and tests. -->
