---
id: epic-operational-readiness
kind: epic
stage: drafting
tags: [cli, integration, prose]
parent: null
depends_on: [epic-ghostty-project-surface, epic-managed-codex-observation, epic-swarm-attention-board]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Operational Readiness

## Brief

Turn the assembled capabilities into a reliable local tool Andrew can install,
diagnose, exercise, and remove. This arc owns package entry points, the
`agent-board doctor` experience, hermetic end-to-end scenarios using fake Codex
and Ghostty boundaries, opt-in installed-tool integration checks, and concise
installation/usage/uninstall documentation.

It validates the complete vertical slice across multiple simulated sessions and
the supported local environment without mutating unrelated live tabs. It does
not introduce deployment infrastructure, a release process, a GUI, or deferred
product capabilities.

## Research briefs

- `.research/analysis/briefs/codex-detector-topology.md` — supplies version-gating and live integration constraints.
- `.research/analysis/briefs/ghostty-registration-liveness.md` — supplies Automation, configuration, and safe live-probe constraints.
- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — grounds the smallest useful terminal-first release boundary.

## Foundation references

- `docs/SPEC.md` — installation, diagnostics, safety, responsiveness, and acceptance scenarios.
- `docs/ARCHITECTURE.md` — binaries, dependency policy, testing pyramid, and observability rules.
- `docs/PRINCIPLES.md` — low friction, reversibility, and proportional V1 rigor.

## Anticipated child features

Provisional seams are packaging and setup, actionable diagnostics, hermetic
end-to-end validation, and operator documentation.

<!-- The /epic-design pass will fill in real child feature specifics into a
## Decomposition section below this one. -->
