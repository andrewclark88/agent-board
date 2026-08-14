---
id: epic-managed-codex-observation-app-server-client
kind: feature
stage: drafting
tags: [integration]
parent: epic-managed-codex-observation
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-14
updated: 2026-08-14
---

# Codex App-Server Client

## Brief

Implement the narrow local WebSocket/JSON-RPC client Agent Board needs: parse
the app-server's advertised ephemeral endpoint, connect and initialize, correlate
requests/responses, expose validated loaded-thread and lifecycle notifications,
and diagnose installed Codex/version/schema incompatibility.

The client must tolerate additive fields, bound messages and stderr context,
cancel pending requests on disconnect, and remain testable against captured
fixtures plus a fake WebSocket server. It does not choose a thread or mutate
session state.

## Inherited design decisions

- Loopback WebSocket is the verified concurrent-observer transport.
- The protocol is experimental and version-gated; failure never masquerades as native state.

## Research and foundation references

- `.research/analysis/briefs/codex-detector-topology.md` — topology and required event coverage.
- `.research/attestation/codex-cli-managed-runtime-probe.md` — observed endpoint and event fixtures.
- `docs/ARCHITECTURE.md` — protocol client and compatibility boundary.
