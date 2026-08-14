# Agent-Board project guidance

Agent-Board uses Andrew's retained workflow:

- `agile-workflow` owns durable delivery state in `.work/`;
- `research-pipeline` owns project discovery, prior art, architecture, knowledge,
  and quality orchestration; and
- `agentic-research` owns grounded research execution and `.research/`.

Canonical process references:

- `/Users/andrewclark/dev/skills-v2/AGENTS.md`
- `/Users/andrewclark/dev/skills-v2/plugins/research-pipeline/docs/build-process.md`
- `/Users/andrewclark/dev/skills-v2/plugins/research-pipeline/docs/research-composition.md`
- `/Users/andrewclark/dev/skills-v2/plugins/agile-workflow/docs/ARCHITECTURE.md`

Workbench is prior art only. Do not create Workbench-owned `.work`, `.research`,
or `.knowledge` state in this project. Ideas such as outcome-first routing,
proportional ceremony, semantic autonomy, and review weight may be adopted
individually through the retained workflow.

## Current state

This repository has completed foundation ideation, a verified prior-art Scout,
and the two blocking runtime engagements. The managed Codex app-server plus
remote-TUI topology is the accepted V1 default, the Ghostty 1.3+ AppleScript
contract is validated, and `docs/ARCHITECTURE.md` is locked.

The current arc is delivery: bootstrap `.work/`, preserve deferred product ideas
in the backlog, decompose the terminal V1 into dependency-linked work items, and
run the agile-workflow queue through implementation and review. Use Agentic
Research only when a consequential unresolved question would change a delivery
decision; do not reopen settled research by default.

## Product guardrails

- The product is an attention router for supervising agents, not a faster input
  device or terminal-specific macro pad.
- Vendor neutrality is a product requirement, but the first implementation may
  be intentionally narrow.
- Generic keystrokes must never imply semantic approval.
- State confidence and adapter capability must remain visible; inferred process
  state must not masquerade as native agent state.
- Software control-plane learning precedes custom PCB, battery, radio, and
  enclosure commitments.
- Local-first operation and meaningful offline behavior are foundational.

## Durable state

Git owns history. Foundation docs own current product truth. `.research/` owns
evidence. `.work/` items own delivery once created. Chat history is not an
authoritative project artifact.
