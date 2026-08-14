---
name: agent-board-architecture
description: Read this for the current high-level system boundaries, data flow, dependencies, and research-gated architecture choices.
type: architecture
kind: planning
status: draft
nav_priority: high
updated: 2026-08-14
summary: |
  Agent Board is organized around a normalized session domain with ports for agent evidence, terminal control, storage, and clocks. Thin CLI, Codex, Ghostty, store, and renderer adapters compose into a local event-to-projection flow; detailed process topology waits on two focused prototypes.
decisions:
  - The normalized session model is independent of Codex, Ghostty, storage format, and process topology.
  - Agent and terminal integrations are separate adapters because they provide different evidence and capabilities.
  - One projection policy drives every status glyph and label.
  - Ghostty 1.3+ AppleScript IDs and targeted tab-title actions are the candidate primary terminal integration.
  - The first store is local, versioned, atomically updated, and usable without a daemon.
  - Codex managed-TUI and ordinary-TUI modes remain separate adapter capabilities until prototyped.
  - A composition root owns process wiring; domain logic does not import infrastructure adapters.
  - External action capabilities are excluded from the first architecture boundary.
---

# Agent Board high-level architecture

## Architecture intent

This document records only the boundaries needed to direct research and later
decomposition. It does not select an implementation language, storage encoding,
package layout, daemon protocol, or production process topology.

## Modules

### Session domain

Owns session identity, normalized activity/attention/health/evidence fields,
transition validation, acknowledgement, liveness reconciliation rules, and the
five-symbol projection policy. It depends only on explicit ports.

### Agent adapter port and Codex adapter

Converts agent-native evidence into normalized observations. The Codex adapter
will expose its actual capability/evidence mode rather than hiding whether it is
backed by ordinary-TUI hooks or managed app-server events.

### Terminal adapter port and Ghostty adapter

Registers terminal identity, renders/clears complete tab-title overrides,
reconciles live terminal surfaces, reports configuration conflicts, and later
may expose focus capability. V1 uses observation and title capabilities only.

### State store port and local adapter

Reads and atomically writes versioned session records. The initial adapter may be
a small local file or directory of per-session records; the port must not assume
a daemon, database, socket, or multi-client protocol.

### Application services

Coordinates register/rename, ingest observation, acknowledge, reconcile, list,
and unregister use cases. Each use case validates boundary input before changing
domain state.

### CLI and board renderer

Provides `agent-name`, `agents`, setup diagnostics, and bounded maintenance
commands. The renderer consumes normalized records and projection results; it
does not reconstruct agent semantics.

### Composition root

Selects platform adapters, owns any helper process lifecycle, and wires the
domain to the Codex, Ghostty, store, clock, and CLI boundaries.

## Data flow

```text
Codex native evidence ──> Codex adapter ──> normalized observation
                                               │
                                               v
                                     session transition policy
                                               │
                                      atomic local state store
                                        │                │
                                        v                v
                              Ghostty title adapter    agents renderer
```

Registration begins from the CLI, resolves the focused Ghostty identity, creates
or updates a session record, and renders the complete tab title. Later lifecycle
evidence enters through the Codex adapter, is normalized once, updates the store,
and triggers the same title projection. `agents` reconciles terminal liveness,
reads the canonical records, and renders the board.

## Ports and dependency direction

The domain defines ports for:

- session record storage;
- agent observation input;
- terminal identity/title/liveness;
- time; and
- optional diagnostic logging.

Infrastructure adapters implement those ports. Domain transitions do not import
Ghostty scripting, Codex protocol types, filesystem APIs, or wall-clock globals.

Extensible sets—normalized state values, evidence kinds, projection precedence,
and adapter capabilities—have one authoritative registry/schema from which
validation and display behavior derive. External event payloads, CLI input, local
records, and scripting results are validated at their entry boundaries.

## External dependencies

The candidate first platform depends on:

- Ghostty 1.3+ macOS AppleScript support and the installed application's
  scripting dictionary;
- macOS Automation permission for the invoking process;
- Codex hooks/notifications for ordinary-TUI observation, or Codex app-server
  plus `codex --remote` for managed-TUI observation; and
- the local filesystem for the initial store.

No cloud service, tmux server, database service, GUI framework, or custom device
is a first-release dependency.

## Settled versus research-gated choices

### Settled

- human label and machine state are independent;
- visible glyphs are projections from normalized evidence;
- one session per Ghostty tab;
- Agent Board owns the complete registered title;
- Ghostty and Codex are adapters behind domain ports;
- local atomic state precedes any daemon; and
- V1 is observation-only.

### Research-gated before detailed architecture

- whether the supported Codex path is a managed remote TUI, a lower-fidelity
  ordinary TUI, or both with explicit capability tiers;
- how managed-TUI startup affects the current Ghostty/Codex experience;
- exact event coverage and transition precedence for the selected Codex mode;
- how acknowledgement is observed reliably;
- whether undo-closed Ghostty surfaces remain AppleScript-enumerable; and
- the smallest store/process topology that remains atomic under concurrent
  adapter updates.

## Biggest architectural risk

The largest risk is promising five authoritative Codex states while preserving
an unchanged standalone TUI workflow that does not expose all of them. The
architecture must resolve that tradeoff through a focused prototype and an
explicit product decision, not by increasing inference until it looks native.

## Evolution boundaries

A future resident event hub can implement the same store/event ports when live
subscriptions or multiple consumers earn it. Additional agents implement the
agent port; additional terminals implement the terminal port. Focus and semantic
actions extend the capability contract independently of observation. Software or
hardware surfaces consume the normalized state and never become its authority.
