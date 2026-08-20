---
id: research-handoff-codex-claude-symmetric-support-1
kind: feature
stage: drafting
tags: [integration, state]
parent: epic-codex-claude-symmetric-support
depends_on: []
release_binding: null
gate_origin: null
research_origin: codex-claude-symmetric-support
created: 2026-08-20
updated: 2026-08-20
---

# Provider-neutral adapter identity and capability contract

## Finding

Extend Agent Board's session and adapter boundary so Codex and Claude can share
normalized state transitions, glyph meanings, acknowledgement behavior, and
terminal projection while retaining provider-native identity, binding data,
evidence kind, confidence, and capabilities.

The common contract must distinguish observation capabilities from semantic
control capabilities. Unsupported or stale evidence projects diagnostic `?`
rather than a convenient primary state.

## Simplification opportunity

Generalize the existing provider discriminator and binding boundary in place;
do not introduce a parallel Claude session model or a second projection policy.

## Research grounding

**Source**: `.research/analysis/campaigns/codex-claude-symmetric-support/parent.md`
(slug: `codex-claude-symmetric-support`)

The shared product boundary already exists above the current Codex adapter; it
needs plural provider identity and capability metadata before a Claude adapter
can join it honestly.
