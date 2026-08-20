---
id: research-handoff-codex-claude-symmetric-support-4
kind: feature
stage: drafting
tags: [integration, cli, state]
parent: epic-codex-claude-symmetric-support
depends_on: [research-handoff-codex-claude-symmetric-support-1, research-handoff-codex-claude-symmetric-support-2, research-handoff-codex-claude-symmetric-support-3]
release_binding: null
gate_origin: null
research_origin: codex-claude-symmetric-support
created: 2026-08-20
updated: 2026-08-20
---

# Mixed Codex-Claude glyph and packaged-runtime validation

## Finding

Verify that concurrent `agent-codex` and `agent-claude` tabs project the same
primary glyphs for equivalent operator outcomes while retaining independent
provider identity, Ghostty identity, evidence confidence, diagnostics, naming,
and Board-owned completion acknowledgement.

Cover launch and resume, working, permission and other input waits, completion,
acknowledgement, interruption, provider and managed-process failure, background
work, clean and forced exit, unsupported extensions or versions, and concurrent
mixed-provider sessions. Absent or stale evidence must yield `?`, and no raw
terminal key may be described as semantic approval.

## Simplification opportunity

Extend the packed CLI harness with a fake Claude executable and hook-event
driver, reusing the existing fake Ghostty, state directory, title assertions,
and Board row parser.

## Research grounding

**Source**: `.research/analysis/campaigns/codex-claude-symmetric-support/parent.md`
(slug: `codex-claude-symmetric-support`)

The cross-provider runtime matrix is the release evidence that makes shared
glyph support a trustworthy product claim rather than a presentation-only edit.
