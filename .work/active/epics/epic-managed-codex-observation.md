---
id: epic-managed-codex-observation
kind: epic
stage: drafting
tags: [integration, cli]
parent: null
depends_on: [epic-trustworthy-session-core]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Managed Codex Observation

## Brief

Deliver the trustworthy Codex V1 adapter and `agent-codex` workflow. One
launcher per supervised tab starts an ephemeral loopback app-server, initializes
a concurrent observer, runs the normal remote TUI on the terminal, binds the
correct thread, maps validated runtime events into normalized state, and performs
bounded child cleanup.

This arc owns experimental-protocol version gating, observer confidence,
thread-binding ambiguity, failure diagnostics, and process supervision. It does
not own Ghostty scripting or duplicate the state/projection policy. Ordinary
Codex remains explicitly lower confidence and may be diagnosed without being
presented as equivalent lifecycle coverage.

## Research briefs

- `.research/analysis/briefs/codex-detector-topology.md` — selects managed app-server plus remote TUI and records lifecycle coverage and risks.
- `.research/attestation/codex-cli-managed-runtime-probe.md` — validates concurrent observation and ephemeral loopback endpoint behavior on the installed Codex.
- `.research/analysis/campaigns/agent-board-prior-art/parent.md` — grounds native versus inferred state and unread completion semantics.

## Foundation references

- `docs/SPEC.md` — Codex integration, confidence, error, and observation-only requirements.
- `docs/ARCHITECTURE.md` — managed launcher topology, protocol boundary, process rules, and compatibility policy.

## Anticipated child features

Provisional seams are the narrow app-server protocol client, normalized Codex
observer, and supervised managed-launch workflow with visible degradation.

<!-- The /epic-design pass will fill in real child feature specifics into a
## Decomposition section below this one. -->
