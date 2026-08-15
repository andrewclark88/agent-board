---
id: epic-operational-readiness-operator-guide
kind: feature
stage: drafting
tags: [prose]
parent: epic-operational-readiness
depends_on: [epic-operational-readiness-doctor-command, epic-operational-readiness-packaged-e2e]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Operator Guide

## Brief

Write the concise, verified path from checkout or packed install to the daily
Ghostty workflow: prerequisites, install, doctor, name/register, managed Codex
launch, board inspection, acknowledgement, unregister, troubleshooting, and
uninstall. Explain the five symbols, confidence/liveness diagnostics, state
location, reversibility, and current managed-mode limitations.

Literal commands come before optional aliases or keybindings. The guide must not
claim automatic config changes, ordinary-mode parity, GUI/hardware features, or
live-test safety beyond what the completed implementation proves.

## Epic context

- Parent: `epic-operational-readiness`.
- Final arc; depends on the verified doctor and packed workflow.

## Foundation references

- `README.md` — primary landing path.
- `docs/SPEC.md` and `docs/ARCHITECTURE.md` — supported contract.
- Completed feature items and CLI fixtures — authoritative command behavior.

<!-- The /prose-author pass writes the guide against completed behavior. -->
