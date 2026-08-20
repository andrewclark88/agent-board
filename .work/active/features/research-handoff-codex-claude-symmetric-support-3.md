---
id: research-handoff-codex-claude-symmetric-support-3
kind: feature
stage: drafting
tags: [integration, cli, state]
parent: null
depends_on: [research-handoff-codex-claude-symmetric-support-1, research-handoff-codex-claude-symmetric-support-2]
release_binding: null
gate_origin: null
research_origin: codex-claude-symmetric-support
created: 2026-08-20
updated: 2026-08-20
---

# Cross-provider capability diagnostics and doctor coverage

## Finding

Expose provider adapter identity, evidence authority, confidence, capability,
extension provenance, and fallback reasons through session diagnostics and the
operator doctor. Detect the installed Claude CLI and required plugin/hook
surface, and fail visibly to diagnostic state when policy, version, packaging,
or hook availability prevents trustworthy observation.

Keep detection, state authority, presentation metadata, session identity, and
terminal control distinct so an inferred or unavailable capability never
masquerades as provider-native state.

## Research grounding

**Source**: `.research/analysis/campaigns/codex-claude-symmetric-support/parent.md`
(slug: `codex-claude-symmetric-support`)

The research and Herdr prior art make explainable capability degradation a
condition of honest provider-neutral support, not an optional debugging aid.
