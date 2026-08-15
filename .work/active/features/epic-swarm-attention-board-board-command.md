---
id: epic-swarm-attention-board-board-command
kind: feature
stage: drafting
tags: [cli, state]
parent: epic-swarm-attention-board
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Swarm Board Command

## Brief

Deliver `agents`, the persistent terminal view over every registered session.
One application query reconciles the current Ghostty hierarchy, attempts safe
title repair, projects each latest canonical record through the existing shared
policy, and returns stable row data for compact human and versioned JSON output.

The board must make uncertainty inspectable without bloating tab titles. It
surfaces terminal presence, evidence confidence/mode, stale observations, and a
visible-but-unsynchronized title as row diagnostics; one Ghostty target failure
must not erase unrelated rows. It does not mutate attention, remove records,
launch agents, add a daemon, or navigate to a tab.

## Epic context

- Parent epic: `epic-swarm-attention-board`
- Position in epic: read-only foundation; operator controls depend on its stable
  row, output, and error conventions.

## Inherited design decisions

- Sort by label, creation time, and session ID; add short-ID display only for
  duplicate labels.
- Reconcile synchronously from one Ghostty snapshot and degrade adapter failures
  per row, while invalid persisted records fail visibly.
- Surface visible `titleRendered: false` as an explicit synchronization
  diagnostic.
- Provide compact human output plus a versioned JSON envelope; no graphical UI.
- Preserve disconnected records until explicit unregister; never auto-prune in V1.

## Research briefs

- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — attention-board
  projection, diagnostics, liveness, and daemon deferral.
- `.research/analysis/briefs/ghostty-registration-liveness.md` — hierarchy-aware
  visibility and undo-close evidence.
- `.research/analysis/briefs/codex-detector-topology.md` — lifecycle evidence and
  confidence boundaries consumed by rows.

## Foundation references

- `docs/VISION.md` — shared terminal board outcome.
- `docs/SPEC.md` — persistent-board examples, diagnostic annotations, and stale
  session behavior.
- `docs/ARCHITECTURE.md` — independent `agents` command, projection policy,
  diagnostics, and JSON output.

<!-- The /feature-design pass fills interfaces, implementation units, and tests. -->
