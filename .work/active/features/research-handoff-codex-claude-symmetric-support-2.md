---
id: research-handoff-codex-claude-symmetric-support-2
kind: feature
stage: drafting
tags: [integration, cli, state]
parent: epic-codex-claude-symmetric-support
depends_on: [research-handoff-codex-claude-symmetric-support-1]
release_binding: null
gate_origin: null
research_origin: codex-claude-symmetric-support
created: 2026-08-20
updated: 2026-08-20
---

# Managed agent-claude launcher and lifecycle adapter

## Finding

Add an installed `agent-claude` command that launches the ordinary interactive
Claude CLI with a bundled, per-run Agent Board plugin/hook integration. Translate
session identity, prompt submission, permission requests, MCP elicitation,
normal completion, API failure, and session end into guarded normalized session
mutations.

The adapter is observation-first. A Board-side failure must not block Claude,
generic terminal keys must not be presented as semantic approval, and working
start plus interruption recovery remain visibly lower-confidence until runtime
validation establishes safe reconciliation.

## Simplification opportunity

Reuse the current registration, guarded mutation, title rendering, focus
acknowledgement, process hosting, and composition patterns. Keep only Claude
event parsing, mapping, compatibility, plugin assets, and launch argv
provider-specific.

## Research grounding

**Source**: `.research/analysis/campaigns/codex-claude-symmetric-support/parent.md`
(slug: `codex-claude-symmetric-support`)

Claude's hook/plugin route provides the smallest topology that preserves its
ordinary TUI while producing the lifecycle evidence required for common glyphs.
