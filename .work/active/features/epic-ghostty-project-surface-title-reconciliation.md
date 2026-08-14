---
id: epic-ghostty-project-surface-title-reconciliation
kind: feature
stage: drafting
tags: [integration, state]
parent: epic-ghostty-project-surface
depends_on: [epic-ghostty-project-surface-applescript-adapter, epic-ghostty-project-surface-registration-naming]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Title and Presence Reconciliation

## Brief

Reconcile every registered Ghostty identity against the current application
hierarchy, classify visible/hidden/missing/unknown presence, update terminal
evidence without overwriting agent-owned fields, and set or clear the exact
canonical title only on a verified target. Repair drift during safe state writes
and board reads.

The feature must handle tab reorder, window movement, close, undo-close, and
unregister without using process liveness as a substitute for hierarchy. It does
not expire records by arbitrary time or focus another tab.

## Inherited design decisions

- Hidden/undoable and missing are distinct; both avoid false live-looking titles.
- Projection is consumed, never reimplemented, and the whole title is Board-owned.

## Research and foundation references

- `.research/analysis/briefs/ghostty-registration-liveness.md` — hierarchy/undo behavior.
- `docs/ARCHITECTURE.md` — reconciliation and title renderer modules.
- `docs/SPEC.md` — stale/dead session safety and title acceptance cases.
