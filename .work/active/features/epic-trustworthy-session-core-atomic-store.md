---
id: epic-trustworthy-session-core-atomic-store
kind: feature
stage: drafting
tags: [state]
parent: epic-trustworthy-session-core
depends_on: [epic-trustworthy-session-core-domain-contract]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Atomic Session Store

## Brief

Implement the local versioned session repository with a configurable state root,
per-session and registration locking, validation on every read, revision-aware
mutations, atomic same-directory replacement, deterministic listing, and bounded
diagnostic/pruning primitives.

The store must preserve fields owned by concurrent use cases, recover cleanly
from interrupted temporary writes, and never reinterpret invalid or unsupported
records as healthy state.

## Inherited design decisions

- One JSON file per session is canonical; filesystem mechanics stay behind the
  domain store port.

## Research and foundation references

- `docs/ARCHITECTURE.md` — State and concurrency model.
- `docs/SPEC.md` — Local-first, atomic, inspectable persistence contract.
