---
id: epic-operational-readiness-doctor-command
kind: feature
stage: drafting
tags: [cli, integration]
parent: epic-operational-readiness
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Actionable Doctor Command

## Brief

Deliver `agent-board doctor [--json]` from one typed diagnostic report covering
the supported runtime, Codex compatibility, Ghostty version/config/Automation
contract, and Agent Board state-directory access. Human and JSON output must
carry stable codes, severity, and remediation; diagnosed errors return nonzero
without hiding the rest of the report.

Reuse the existing bounded process and Ghostty diagnostic boundaries. The check
may make and remove a private probe inside Agent Board's state directory but
must not rename tabs, start an agent, modify configuration, or touch repositories.
Extend the command registry without weakening `ack`/`unregister` grammar.

## Epic context

- Parent: `epic-operational-readiness`.
- First arc; supplies a public health contract used by packaged proof and docs.

## Foundation and research

- `docs/SPEC.md` — setup diagnostics and platform constraints.
- `docs/ARCHITECTURE.md` — doctor surface, JSON convention, dependencies.
- `.research/analysis/briefs/codex-detector-topology.md` — compatibility gate.
- `.research/analysis/briefs/ghostty-registration-liveness.md` — version,
  config, dictionary, and Automation requirements.

<!-- The /feature-design pass fills interfaces, units, and tests. -->
