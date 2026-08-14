---
name: agent-board-architecture
description: Read this for the current high-level system boundaries, data flow, dependencies, and research-gated architecture choices.
type: architecture
kind: planning
status: draft
nav_priority: high
updated: 2026-08-14
summary: |
  Agent Board is organized around a normalized session domain with ports for agent evidence, terminal control, storage, and clocks. Runtime probes validate Ghostty title/session control and both Codex observation modes; the only remaining process-topology gate is whether managed-launch friction is acceptable for the trustworthy default.
decisions:
  - The normalized session model is independent of Codex, Ghostty, storage format, and process topology.
  - Agent and terminal integrations are separate adapters because they provide different evidence and capabilities.
  - One projection policy drives every status glyph and label.
  - Ghostty 1.3+ AppleScript IDs and targeted tab-title actions are the validated primary terminal integration.
  - The first store is local, versioned, atomically updated, and usable without a daemon.
  - Codex managed-TUI and ordinary-TUI modes remain separate adapter capabilities until product taste selects the default.
  - Ghostty liveness reconciliation uses current window/tab ancestry plus surface existence because undo-closed terminals remain enumerable.
  - A composition root owns process wiring; domain logic does not import infrastructure adapters.
  - External action capabilities are excluded from the first architecture boundary.
---

# Agent Board high-level architecture

## Architecture intent

This document records the stable boundaries needed for detailed design and
decomposition. It does not yet select the default Codex launch topology because
the completed prototype leaves a consequential product-taste tradeoff between
startup continuity and state fidelity.

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
reconciles visible tab ancestry separately from live terminal surfaces, reports
configuration conflicts, and later may expose focus capability. V1 uses
observation and title capabilities only.

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
and triggers the same title projection. `agents` reconciles terminal liveness
and current window/tab membership, reads the canonical records, and renders the
board. Application-wide terminal enumeration alone cannot prove visibility
because Ghostty retains undo-closed surfaces with their original IDs.

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

The first platform depends on:

- Ghostty 1.3+ macOS AppleScript support and the installed application's
  scripting dictionary;
- macOS Automation permission for the invoking process;
- Codex hooks/notifications for explicitly lower-confidence ordinary-TUI
  observation, or a launcher-owned Codex app-server plus `codex --remote` and a
  concurrent observer for authoritative managed-TUI activity; and
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

### Validated by the runtime engagements

- Ghostty stable IDs survive targeted title set/update/clear.
- Clearing the tab-title override restores normal title behavior.
- Undo-closed tabs remain enumerable and return with their original IDs.
- A Codex remote TUI retains the familiar prompt and configured status surface.
- A second app-server client can discover the remote-TUI thread and observe its
  active/idle transitions without proxying terminal bytes.
- Ordinary-TUI hooks and notifications do not provide equivalent working and
  immediate-idle coverage.

### Taste-gated before detailed process topology

- whether managed remote TUI is the trustworthy default with ordinary mode as
  an explicit degraded-confidence fallback, or ordinary mode is the default
  with a narrower product promise;
- how acknowledgement is observed reliably; and
- the smallest launcher/store lifecycle for the selected mode.

## Biggest architectural risk

The largest risk is hiding managed-launch complexity poorly enough that a
technically faithful detector makes starting Codex feel meaningfully harder.
The inverse risk is choosing an unchanged standalone TUI while continuing to
promise five authoritative states it cannot expose. The prototype has made the
tradeoff concrete; product taste must now choose which side is the default.

## Evolution boundaries

A future resident event hub can implement the same store/event ports when live
subscriptions or multiple consumers earn it. Additional agents implement the
agent port; additional terminals implement the terminal port. Focus and semantic
actions extend the capability contract independently of observation. Software or
hardware surfaces consume the normalized state and never become its authority.
