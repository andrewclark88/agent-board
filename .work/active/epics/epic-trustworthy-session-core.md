---
id: epic-trustworthy-session-core
kind: epic
stage: drafting
tags: [state]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Trustworthy Session Core

## Brief

Deliver the local source of truth that every Agent Board surface shares. This
arc owns the normalized identity, activity, attention, health, evidence, and
terminal-presence contracts; validated transitions; atomic per-session storage;
and the single projection policy that derives the five primary glyphs.

It must make concurrent CLI and observer updates safe, keep invalid or stale
records visible as diagnostics, and remain inspectable without a daemon or
database. It does not own Codex protocol messages, Ghostty scripting, or the
final CLI workflows; those consume this capability through ports.

## Research briefs

- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — grounds the multidimensional state model, acknowledgement semantics, and no-daemon V1.
- `.research/analysis/briefs/ghostty-registration-liveness.md` — establishes terminal presence as distinct from process liveness.

## Foundation references

- `docs/SPEC.md` — normalized observed state, projection precedence, and persistence requirements.
- `docs/ARCHITECTURE.md` — session record, store concurrency, domain modules, and error conventions.
- `docs/PRINCIPLES.md` — one truthful state model and visible confidence.

## Anticipated child features

Provisional seams are the domain/state contract, atomic session repository, and
central transition/projection service.

<!-- The /epic-design pass will fill in real child feature specifics into a
## Decomposition section below this one. -->
