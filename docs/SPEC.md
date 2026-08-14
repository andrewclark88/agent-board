---
name: agent-board-spec
description: Read this to understand the first product contract, normalized domain model, behavior, constraints, and acceptance boundary.
type: spec
kind: planning
status: draft
nav_priority: high
updated: 2026-08-14
summary: |
  The first Agent Board release registers one Codex session per Ghostty tab, stores identity and observed state locally, projects five attention symbols into machine-maintained tab titles, and renders the same records through an `agents` command. The contract separates activity, attention, health, and evidence so simple labels remain truthful.
decisions:
  - One supervised agent per Ghostty tab is the first-release operating constraint.
  - Project labels are human-controlled presentation and never session identity.
  - Five visible symbols are derived from orthogonal stored state rather than persisted as canonical truth.
  - Stale and ambiguous sessions never silently map to idle or error; process exit remains observation evidence.
  - Registration captures validated stable Ghostty identity and renders the complete tab-title override.
  - Managed app-server plus remote TUI is the trustworthy V1 default; ordinary-TUI observation remains an explicitly degraded-confidence fallback.
  - The local store is versioned and atomically readable; a resident daemon is not a first-release requirement.
  - The first release is observation-only and exposes no semantic agent actions.
---

# Agent Board specification

## Product boundary

Agent Board observes registered coding-agent sessions, normalizes the evidence it
can obtain, and projects the resulting attention state into Ghostty tab titles
and a terminal board. It does not own the agent's task, decide what the agent
should do, or control the agent in the first release.

## Core capabilities

### Register and name the current session

An ergonomic command such as:

```bash
agent-name data-platform
```

registers or renames the supervised agent in the currently focused Ghostty tab.
Registration records a stable Agent Board session ID, the human label, repository
context when available, adapter identity, and Ghostty window/tab/terminal IDs.

Renaming changes only the display label. It does not change session identity,
machine state, repo path, or adapter binding.

### Observe Codex state

The Codex adapter ingests supported native lifecycle evidence and records both
the normalized result and its evidence quality.

The desired visible semantics are:

```text
○ idle
● working
✓ finished / unread
! needs user input
× error
```

“Needs user input” includes approval and direct-question waits at the projection
layer. Adapter detail may distinguish them for diagnostics.

The completed runtime prototype keeps two integration modes deliberately
distinct. Managed-TUI observation is the supported default:

- Ordinary-TUI observation preserves an unchanged `codex` launch and uses
  documented hooks and notifications. Its incomplete working/idle coverage must
  remain visibly lower-confidence.
- Managed-TUI observation launches app-server first and connects the Codex TUI
  with `codex --remote`, preserving the terminal interface while enabling richer
  machine-readable lifecycle state. A concurrent observer successfully received
  a remote-TUI thread's active and idle transitions on the installed build.

The product must not claim ordinary-TUI observation has the same fidelity as the
managed path without evidence.

### Render the Ghostty tab title

Agent Board owns the complete registered tab title:

```text
<status-glyph> <project-label>
```

The glyph always occupies the first display position. Both a status change and a
rename re-render the entire value from independently stored fields.

The first Ghostty adapter targets a registered tab/terminal through the official
macOS scripting interface and a machine-maintained tab-title override. The
installed release preserved stable IDs across title updates and restored normal
title behavior when the override was cleared. OSC title sequences are a
compatibility fallback, not the default ownership mechanism.

Unregistering clears Agent Board's override so ordinary Ghostty title behavior
can resume.

### Render the persistent board

The initial command:

```bash
agents
```

shows every current registered session in a stable, scannable order:

```text
AGENT BOARD

● data-platform        working
! acquisition          needs input
✓ agent-board          finished
○ legacy-engine        idle
× reporting            error
```

When evidence is stale, partial, or inferred, the board may add a terse
diagnostic annotation. The tab remains intentionally compact.

### Acknowledge and expire attention

A native completion event sets completion attention to unread. Acknowledgement
must be caused by an explicit or reliably observed operator interaction, not by
elapsed time alone. Implementation validation must prove reliable Ghostty-focus
acknowledgement and retain explicit `agent-board ack` as the fallback.

The board reconciles registered Ghostty identities during reads and state writes.
A missing terminal surface becomes disconnected/stale, not idle or error. A
terminal that remains application-enumerable but is absent from its expected
current window/tab hierarchy is hidden/undoable evidence, not proof of a visible
session. A disconnected record may remain as a bounded diagnostic tombstone
before being pruned.

## Domain model

### Session identity

```text
board_session_id          stable Agent Board identity
project_label             user-controlled presentation
repo_path?                discovered context
git_branch?               discovered context
adapter                    codex initially
native_session_id?        adapter binding
ghostty_window_id
ghostty_tab_id
ghostty_terminal_id
```

Project label, repo path, branch, and terminal position are not identity keys.

### Normalized observed state

```text
activity:    unknown | idle | working
attention:   none | completion_unread | input_required
completion_observed_at?: required while attention=completion_unread
health:      live | stale | error
observation:
  observed_at
  evidence_kind
  confidence: authoritative | corroborated | inferred
  adapter_detail?
```

### Projection precedence

```text
health=error                           -> × error
attention=input_required               -> ! needs input
attention=completion_unread             -> ✓ finished / unread
activity=working and observation fresh -> ● working
activity=idle and health=live           -> ○ idle
stale/ambiguous                         -> diagnostic/expiry policy, not a false glyph
```

The projection policy is a single source of truth shared by title and board
renderers. A clean agent-process exit is recorded as observation evidence, not
as agent health. If the registered Ghostty tab remains live, the agent becomes
idle; terminal disappearance is represented independently by terminal presence.

## Functional requirements

1. Re-registering a known current terminal updates its label rather than creating
   a duplicate session.
2. Two concurrent sessions may share a repository or label without sharing
   identity.
3. A lifecycle event updates the store and registered Ghostty title from one
   normalized transition.
4. `agents` and the title renderer cannot maintain independent status mappings.
5. Invalid records or unsupported schema versions fail visibly rather than being
   interpreted heuristically.
6. Closing a Ghostty tab cannot leave a live-looking working or attention state
   indefinitely.
7. Setup diagnostics detect incompatible Ghostty/Codex title settings and missing
   macOS Automation permission.
8. Names reject control characters and are safely transported through the
   Ghostty scripting boundary.
9. The first release continues to provide meaningful board inspection without a
   network connection.
10. No first-release command sends approval, input, interrupt, or arbitrary
    keystrokes to an agent.

## Non-functional requirements

- Local-first: session records and control traffic remain on the local machine.
- Offline-capable: registration, stored-state inspection, and title/board
  rendering work without internet access.
- Responsive: observed transitions should appear on the relevant surfaces at
  human-immediate, sub-second scale when the selected adapter supplies an event;
  implementation-time integration tests will establish and enforce the exact
  budget.
- Crash-tolerant: interrupted writes never leave a partially readable canonical
  record.
- Inspectable: a user can determine why a state was chosen, how fresh it is, and
  which adapter evidence produced it.
- Reversible: uninstalling or unregistering restores normal terminal-title
  behavior and does not modify repositories.
- Proportionate: the first release does not require a permanently installed
  daemon, database server, terminal multiplexer, or GUI framework. A
  launcher-owned local app-server process remains permissible if managed mode is
  selected.

## Platform constraints

- macOS is the only first-release operating system.
- Ghostty 1.3 or later with AppleScript enabled is the supported terminal
  contract; setup verifies the installed dictionary and Automation permission.
- One supervised agent per Ghostty tab is supported; split aggregation is not.
- Codex is the only first-release agent adapter.
- Codex's own terminal-title writer must be coordinated or disabled when Agent
  Board title ownership is active.
- Ghostty title decoration that displaces the fixed prefix must be disabled or
  diagnosed.

## Acceptance boundary

The first release succeeds when Andrew can open several supported Ghostty/Codex
sessions, name them, start work, and use either the tab bar or `agents` to
identify working, input-needed, completed-unread, idle, and failed sessions
without visiting each tab. State changes are timely, uncertainty is not hidden,
dead sessions are reconciled, and installation/usage can be repeated from the
documentation.

Managed-TUI launch is accepted as the default. Its activity coverage is
sufficient for the core contract; human-wait, detailed turn outcome, and
acknowledgement behavior remain required implementation-level integration tests.
Ordinary mode may be offered only with a visibly narrower confidence promise;
it must never relabel inference as equivalent native state.

## Preserved future options

These are intentionally uncommitted and should become backlog ideas after the
delivery substrate exists:

- resident daemon/event hub — when multiple long-lived consumers or proactive
  behavior require subscriptions;
- additional agent adapters — after Codex semantics are trustworthy;
- optional tmux adapter — only for an intentionally supported tmux audience;
- focus/jump navigation — after terminal identity is reliable;
- macOS notifications, menu-bar, and always-on-top views — after false-positive
  and acknowledgement behavior is measured;
- capability-gated semantic actions — only with native action support and exact
  session binding;
- simulated external client — after an external display/control protocol exists;
- physical display and controls — after software usage reveals persistent
  physical affordances worth building; and
- remote aggregation — after observed multi-machine demand.
