---
id: epic-ghostty-project-surface-applescript-adapter
kind: feature
stage: drafting
tags: [integration]
parent: epic-ghostty-project-surface
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Ghostty AppleScript Adapter

## Brief

Implement the validated macOS/Ghostty boundary for active-context discovery,
full hierarchy enumeration, targeted tab-title set/clear, installed version and
configuration checks, and actionable Automation errors. Scripts remain constant
source files or constants and accept all dynamic values as positional arguments.

The adapter must distinguish protocol/parse errors from missing permissions or
unsupported Ghostty and expose deterministic fixtures so most tests run without
launching the app. It does not register sessions or decide projected status.

## Inherited design decisions

- Ghostty 1.3+ AppleScript is mandatory; no implicit OSC fallback.
- IDs and labels are arguments, never interpolated script.

## Research and foundation references

- `.research/analysis/briefs/ghostty-registration-liveness.md` — installed API and failure contract.
- `docs/ARCHITECTURE.md` — Ghostty adapter and diagnostics boundaries.
- `docs/SPEC.md` — title ownership and safe label transport.
