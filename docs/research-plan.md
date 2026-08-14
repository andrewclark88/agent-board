---
name: agent-board-research-plan
description: Read this for the completed pre-architecture research decisions and the entry conditions for deliberately deferred follow-up research.
type: research-plan
kind: planning
status: draft
nav_priority: high
updated: 2026-08-14
summary: |
  Scout and both focused pre-architecture engagements are complete. Managed remote TUI is accepted as the V1 default, so no research blocker remains before delivery decomposition.
decisions:
  - No deep-research or research-program campaign is warranted before the first proof.
  - Codex detector topology is the first pre-architecture decision because it changes workflow friction and state fidelity.
  - Ghostty scripting behavior requires an empirical integration check in addition to documentation research.
  - Store encoding and implementation language are well-understood reversible choices and need no external research yet.
  - Hardware, wireless, remote aggregation, and multi-agent research remain deferred until their entry conditions are met.
  - Ghostty 1.3+ AppleScript IDs and targeted tab-title overrides are validated for V1, with hierarchy-aware liveness required for undo-close.
  - Managed app-server plus remote TUI is the V1 default; ordinary Codex remains a degraded-confidence fallback.
---

# Agent Board research plan

## Completed discovery

The prior-art Scout engagement is complete and verified at:

`.research/analysis/campaigns/agent-board-prior-art/parent.md`

It covers Codex lifecycle interfaces, Ghostty title/session APIs, direct attention
supervisors, state-model patterns, liveness, and preservation of the old product
horizon.

## Completed pre-architecture research

### 1. Codex detector topology — `/research` complete

Output: `.research/analysis/briefs/codex-detector-topology.md`

Question: In Andrew's real Ghostty workflow, which supported launch topology
provides the smallest acceptable combination of startup friction, TUI fidelity,
state completeness, reliability, and recoverability?

Compare:

- unchanged ordinary `codex` plus hooks/notifications; and
- a small managed launcher that starts app-server and connects the TUI through
  `codex --remote` over a local endpoint.

The engagement should include a bounded local prototype because official docs
have already established the topology but cannot establish experiential parity.
Measure coverage for working, input/approval waits, completion, immediate idle,
error, interruption, session end, and acknowledgement. Inspect version-specific
generated schemas from the installed Codex build.

Rationale: this finding changes the first supported adapter, install/startup
experience, normalized confidence contract, and possibly process topology.

Result: both topologies are viable, but only managed app-server plus remote TUI
provided authoritative active/idle transitions to a concurrent observer. Andrew
accepted the managed recommendation as the V1 default; the implementation must
version-gate the experimental interface.

### 2. Ghostty registration and liveness contract — `/research` complete

Output: `.research/analysis/briefs/ghostty-registration-liveness.md`

Question: Against the installed supported Ghostty release, do AppleScript IDs and
targeted tab-title actions remain stable across rename, focus, reorder, agent exit,
tab close/undo-close, window movement, and unregister?

The engagement should read the installed app's bundled `Ghostty.sdef` and run a
bounded integration probe. It should also verify configuration diagnostics,
Automation permission behavior, title clearing, bell-title interaction, and
whether hidden undo-close surfaces remain enumerable.

Rationale: this finding changes identity, stale cleanup, minimum Ghostty version,
and whether OSC must remain a supported fallback.

Result: stable IDs and targeted title set/update/clear are suitable for V1.
Closed tabs remain enumerable during undo-close and return with the same IDs, so
reconciliation must distinguish visibility from process/surface existence.

## Optional follow-ups after architecture

- Acknowledgement behavior — a small usability/telemetry study if focus, prompt,
  and explicit-ack signals remain ambiguous after the detector prototype.
- Store contention — a technical brief only if concurrent writers make the
  initial atomic-file design insufficient.
- Second agent adapter — `/brief` when a specific Claude or other-agent feature
  is promoted; do not research generic parity in advance.
- Notification and menu-bar behavior — `/research` after terminal V1 provides
  false-positive and acknowledgement data.
- Focus/navigation — local Ghostty prototype when that backlog option is promoted.
- External protocol and simulated client — architecture research only after a
  second live consumer exists.
- Hardware, wireless, battery, enclosure, and premium-market questions — a
  `/research-program` only after software usage demonstrates a physical product
  decision worth changing.

## No research currently needed

- local CLI framework and implementation language;
- atomic local file encoding;
- table rendering for `agents`;
- repo and branch discovery; and
- basic installation documentation.

These are mainstream, reversible implementation choices. The locked architecture
selects Node.js/TypeScript, atomic versioned session files, and a small terminal
renderer; feature design should refine them only within those boundaries.
