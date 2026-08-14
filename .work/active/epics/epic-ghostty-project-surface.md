---
id: epic-ghostty-project-surface
kind: epic
stage: drafting
tags: [integration, cli]
parent: null
depends_on: [epic-trustworthy-session-core]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Ghostty Project Surface

## Brief

Make a Ghostty tab a stable, nameable Agent Board session and keep its complete
title synchronized with the canonical projection. This arc owns discovery of
the focused Ghostty window/tab/terminal hierarchy, registration and rename,
targeted `set_tab_title`, configuration diagnostics, and hierarchy-aware
presence reconciliation across reorder, movement, close, and undo-close.

It must transport untrusted project labels safely across the AppleScript
boundary and degrade visibly when Ghostty version, permissions, or title config
are incompatible. It does not infer Codex lifecycle state or render the global
board.

## Research briefs

- `.research/analysis/briefs/ghostty-registration-liveness.md` — validates stable IDs, targeted title actions, and hidden undo-close behavior.
- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — compares title mechanisms and establishes AppleScript as primary.

## Foundation references

- `docs/SPEC.md` — registration, rename, title ownership, liveness, and safety requirements.
- `docs/ARCHITECTURE.md` — Ghostty adapter, script transport, session identity, and reconciliation rules.

## Anticipated child features

Provisional seams are the validated AppleScript adapter, idempotent registration
and naming, and hierarchy-aware title/liveness reconciliation.

<!-- The /epic-design pass will fill in real child feature specifics into a
## Decomposition section below this one. -->
