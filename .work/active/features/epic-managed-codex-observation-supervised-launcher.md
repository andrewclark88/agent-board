---
id: epic-managed-codex-observation-supervised-launcher
kind: feature
stage: drafting
tags: [integration, cli]
parent: epic-managed-codex-observation
depends_on: [epic-managed-codex-observation-app-server-client, epic-managed-codex-observation-lifecycle-adapter]
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Supervised Codex Launcher

## Brief

Deliver `agent-codex`: resolve/register the current terminal session, start one
app-server on `ws://127.0.0.1:0`, wait for advertised readiness, initialize the
observer, launch `codex --remote <endpoint>` with direct terminal IO and Board
title ownership, and supervise the process group until clean or failed exit.

The launcher must keep startup/cleanup bounded, pass Codex arguments safely,
preserve normal TUI interrupt behavior, terminate children on hangup/termination,
classify abnormal exits visibly, and leave a live registered tab idle after a
clean TUI exit. It does not install a resident service.

## Inherited design decisions

- One short-lived launcher owns one tab's app-server/TUI/observer group.
- Managed mode is default; ordinary `codex` is not presented as equivalent.

## Research and foundation references

- `.research/analysis/briefs/codex-detector-topology.md` — managed workflow and process risks.
- `.research/attestation/codex-cli-managed-runtime-probe.md` — remote-TUI and endpoint behavior.
- `docs/ARCHITECTURE.md` — per-tab launcher steps, signals, and observability.
