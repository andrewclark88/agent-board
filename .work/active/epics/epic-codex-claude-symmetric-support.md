---
id: epic-codex-claude-symmetric-support
kind: epic
stage: drafting
tags: [integration, cli, state]
parent: null
depends_on: []
release_binding: null
gate_origin: null
research_origin: codex-claude-symmetric-support
created: 2026-08-20
updated: 2026-08-20
---

# Symmetric Codex and Claude supervision

## Brief

Enable Andrew to run `agent-claude` in ordinary interactive Claude tabs beside
`agent-codex` tabs and read both through the same Agent Board glyph, title,
naming, acknowledgement, and attention-routing workflow.

Symmetry is outcome-level, not signal-level. Codex retains its managed
app-server observer; Claude uses a managed ordinary CLI with bundled
observation hooks. Provider identity, evidence authority, confidence,
capabilities, and fallback diagnostics remain inspectable, and unsupported
evidence projects `?` rather than a false primary state.

## Strategic decisions

- **Shared product contract**: both providers use `○`, `●`, `✓`, `!`, and `×`
  for the same operator outcomes; `?` remains the honest diagnostic fallback.
- **Claude topology**: preserve the ordinary interactive Claude CLI and add a
  per-run observation plugin/hook integration; do not replace it with an
  SDK-owned agent loop.
- **Control boundary**: this epic is observation and attention routing only.
  Generic terminal keys never imply semantic approval or question response.
- **Confidence boundary**: Claude prompt-start and user-interrupt recovery stay
  lower-confidence until validated; presentation parity does not erase that.
- **UI alignment**: reuse the existing tab-title and `agents` board vocabulary.
  No new UI surface or mockup is required.

## Feature arc

1. `research-handoff-codex-claude-symmetric-support-1` — provider-neutral
   adapter identity and capability contract.
2. `research-handoff-codex-claude-symmetric-support-2` — managed
   `agent-claude` launcher and lifecycle adapter.
3. `research-handoff-codex-claude-symmetric-support-3` — capability diagnostics
   and doctor coverage.
4. `research-handoff-codex-claude-symmetric-support-4` — mixed-provider glyph
   and packaged-runtime validation.

## Simplification opportunity

Keep glyph projection, session persistence, Ghostty title ownership,
acknowledgement, reconciliation, and board rendering provider-neutral. Reuse the
existing launcher/store/title capabilities rather than cloning Codex
application logic. Provider-specific code should be limited to lifecycle
acquisition, compatibility, native binding, and evidence mapping.

## Foundation roll-forward

- `docs/VISION.md` expands the supported first-user workflow from Codex-only to
  mixed Codex and Claude tabs.
- `docs/SPEC.md` defines shared outcome glyphs over asymmetric provider
  evidence.
- `docs/ARCHITECTURE.md` adds the managed Claude launcher/hook topology while
  retaining the daemonless modular-monolith boundary.
- `docs/PRINCIPLES.md` needs no change; its existing capability and evidence
  rules already govern the expansion.

## Research grounding

**Source**: `.research/analysis/campaigns/codex-claude-symmetric-support/parent.md`
(slug: `codex-claude-symmetric-support`)

The full-rigor campaign and locked position establish the provider-neutral
contract, topology choice, confidence limitations, and required validation
matrix for this delivery arc.
