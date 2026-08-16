---
name: agent-board-architecture
description: Read this before implementing or changing Agent Board modules, process topology, state contracts, or external adapters.
type: architecture
kind: planning
status: locked
nav_priority: high
updated: 2026-08-16
summary: |
  Agent Board V1 is a local TypeScript modular monolith with four small CLI binaries and no permanently installed daemon. Each supervised tab runs a launcher-owned Codex app-server, remote TUI, and observer; normalized state is atomically persisted and projected through one policy into Ghostty titles and the `agents` board.
decisions:
  - Managed app-server plus `codex --remote` is the default Codex V1 topology; ordinary Codex remains an explicit degraded-confidence fallback.
  - Each supervised tab owns its short-lived launcher, app-server, TUI, and observer process group; there is no global resident daemon.
  - The implementation is a Node.js 22+ TypeScript modular monolith with runtime-validated external boundaries.
  - One versioned session record is the source of truth and is updated atomically under a per-session lock.
  - The domain stores orthogonal identity, activity, attention, health, adapter evidence, and terminal presence; visible statuses are derived centrally.
  - Ghostty 1.3+ AppleScript stable IDs and targeted tab-title overrides are the primary terminal contract.
  - Completion acknowledgement is Board-owned and clears when the registered Ghostty tab is reliably focused, with an explicit acknowledgement command as fallback.
  - Experimental Codex protocol compatibility is version-gated and failures degrade visibly rather than being reclassified as native state.
  - V1 exposes observation, naming, and board administration, with no semantic agent actions; focus navigation, notifications, GUI, remote, and hardware remain outside the runtime boundary.
---

# Architecture: Agent Board

*Last updated: 2026-08-16*

> How the system is built. For product intent, see [Vision](VISION.md),
> [Specification](SPEC.md), and [Principles](PRINCIPLES.md). Runtime decisions
> are grounded in the [Codex topology brief](../.research/analysis/briefs/codex-detector-topology.md)
> and [Ghostty contract brief](../.research/analysis/briefs/ghostty-registration-liveness.md).

## System overview

Agent Board is one installable local CLI package. It has several entry points,
but one domain model and one set of adapters.

```text
Ghostty tab
  │
  ├─ agent-name <label> ───────────────┐
  │                                    │
  └─ agent-codex [codex args...]       │
       │                               │
       ├─ resolve/register tab         │
       ├─ codex app-server :0          │
       ├─ Board observer client ───────┼─> session service
       └─ codex --remote <endpoint>    │        │
                                                v
                                     versioned session store
                                         │             │
                                  title projection   agents
                                         │             │
                                         v             v
                               Ghostty tab override  terminal board
```

`agent-codex` is the default launcher. It binds an ephemeral loopback port by
starting `codex app-server --listen ws://127.0.0.1:0`, initializes a second
observer client, then gives the terminal directly to `codex --remote`. Codex
selects the port and prints the resolved endpoint, avoiding fixed-port conflicts
across tabs. Loopback WebSocket deliberately supersedes the research brief's
provisional Unix-socket recommendation because it is the transport verified with
both the remote TUI and a concurrent observer. Unix-socket multi-client support
may replace it later if an integration test proves equivalent behavior. The
launcher exists only while that Codex TUI exists.

The ordinary `codex` path is not presented as evidence-equivalent. A later
fallback adapter may consume documented hooks and notifications, but every
record and board row must identify that mode as partial-confidence observation.

## Process topology

### Per-tab managed launcher

One `agent-codex` process owns one supervised tab's runtime:

1. Resolve the currently focused Ghostty window, tab, and terminal IDs.
2. Find the existing Board session for that terminal or register one using the
   repository directory name as an editable initial label.
3. Start app-server on an ephemeral loopback WebSocket endpoint and wait for its
   advertised readiness with a bounded timeout.
4. Connect the Board observer and complete protocol initialization.
5. Start the remote Codex TUI with inherited stdin/stdout/stderr and the exact
   override `-c tui.terminal_title=[]`; Codex requires this setting to be a
   sequence, and the empty sequence disables its title components so the
   Ghostty adapter owns the registered title.
6. Normalize observed thread and turn events, update the store, and render the
   tab title after each meaningful transition.
7. Poll focused Ghostty identity only while unread completion exists. Reliable
   focus clears completion attention; input-required attention remains until
   Codex reports that the wait ended.
8. On clean TUI exit, stop app-server, mark the agent activity idle with explicit
   process-exit evidence, and leave the project tab registered.
9. On launcher, protocol, or app-server failure, record a visible diagnostic or
   error before bounded cleanup.

The launcher ignores terminal `SIGINT` while the child TUI is active so Codex
retains its normal interrupt behavior. Termination and hangup signals trigger
bounded child cleanup. Child processes are never adopted as a machine-wide
service.

### Independent CLI invocations

- `agent-name [label]` registers or renames the focused Ghostty tab, then
  re-renders from the latest complete session record. With no label, it captures
  the focused registered session before opening the native macOS rename prompt;
  Cancel is a successful no-op and Rename changes only the project label/title.
- `agents` reconciles Ghostty presence, renders every registered session, and
  repairs stale title projection where safe. One successfully validated
  application-wide snapshot is also the authority for closed-session cleanup:
  a session classified `missing` is removed and omitted from that board result.
  `hidden` (including Ghostty undo-close) and `unknown` sessions remain
  registered; snapshot failure removes nothing. A failed removal leaves the
  missing diagnostic visible so a later board read can retry.
- `agent-board doctor` validates versions, executables, Automation permission,
  Ghostty config conflicts, Codex protocol compatibility, and state-directory
  access.
- `agent-board ack [session]` is the explicit completion acknowledgement fallback.
- `agent-board unregister [session]` clears the title override and removes the
  registration through a recoverable, session-scoped operation.

These commands do not require the managed launcher to be running.

## Module map

```text
src/
  domain/
    session.ts              normalized session schema and invariants
    registries.ts           status/evidence/capability source of truth
    transitions.ts          native observation -> normalized transition
    projection.ts           one status/title/board projection policy
    ports.ts                store, terminal, agent-event, clock, process ports

  application/
    acknowledge-session.ts  explicit/focus-derived acknowledgement target resolution
    acknowledge.ts          completion acknowledgement transition
    doctor.ts               runtime, state, Codex, and Ghostty diagnostics
    launch-managed-codex.ts supervised lifecycle orchestration
    list-sessions.ts        board query and diagnostic annotations
    observe-agent.ts        apply validated Codex observations
    observe-managed-codex.ts managed Codex lifecycle observation
    prompt-rename-session.ts focused-session capture and native rename application
    reconcile-session.ts    terminal/launcher presence and expiry
    register-session.ts     idempotent register/rename use case
    render-title.ts         locked read-current-state then targeted render
    resolve-session-target.ts explicit/focused session resolution
    unregister-agent-session.ts title clear and session removal
    unregister-session.ts   unregister transition
    watch-completion-focus.ts focus-derived completion acknowledgement

  integrations/
    codex/                  app-server protocol, WebSocket client, lifecycle,
                            thread binding, compatibility, and process hosting
    ghostty/                AppleScript client/protocol, title actions, and diagnostics
    macos/                  native rename prompt through macOS Automation
    git/                    repository context lookup
    command-config.ts       absolute executable override validation
    process-runner.ts       bounded external-process execution
  infrastructure/
    json-session-store.ts   atomic JSON records and scoped locks
    file-lock.ts            crash-aware lock implementation
    session-files.ts        record file layout and parsing
    state-diagnostics.ts    state-directory probe
    state-paths.ts          state-root resolution

  cli/
    agent-board.ts          doctor, ack, unregister command router
    agent-name.ts           naming entry point
    agents.ts               board entry point
    agent-codex.ts          managed-launch entry point
    doctor-output.ts        stable doctor rendering
    output.ts               stable board/CLI error rendering
    is-main.ts              installed-bin entry-point guard

  composition/
    create-agent-board.ts   doctor, ack, and unregister wiring
    create-agent-codex.ts   managed Codex wiring
    create-agent-name.ts   naming wiring
    create-agents.ts        board wiring

tests/
  domain/                   pure transition/projection tests
  application/              use-case tests with fake ports
  cli/                      command parsing, rendering, and packaging guards
  infrastructure/           store, lock, file, and state-directory tests
  integrations/              Codex, Ghostty, Git, and process-boundary tests
  e2e/                      packed fake Codex/Ghostty/Automation vertical slices
  integration/               opt-in installed Codex/Ghostty probes
```

The domain imports no filesystem, process, WebSocket, AppleScript, or wall-clock
implementation. Ports exist only at these real boundaries; internal pure
functions do not receive ceremonial interfaces.

## Domain and storage contract

### Session record

Each file under the state directory is one validated record:

```text
schema_version
revision
session_id

identity:
  project_label
  repo_path?
  git_branch?
  created_at

terminal:
  adapter = ghostty
  window_id
  tab_id
  terminal_id
  presence = visible | hidden | missing | unknown
  observed_at

agent:
  adapter = codex
  mode = managed | ordinary
  native_thread_id?
  launcher_pid?
  activity = unknown | idle | working
  attention = none | completion_unread | input_required
  completion_observed_at?  # required while completion is unread
  health = live | stale | error
  observed_at
  evidence_kind
  confidence = authoritative | corroborated | inferred
  detail?
```

The primary five glyphs are not stored. `projection.ts` derives them from the
record registry. Diagnostic states such as missing terminal or incompatible
adapter may use a clearly non-primary `?` projection rather than lying with
idle or error.

### Physical layout

```text
${AGENT_BOARD_STATE_DIR:-$HOME/.local/state/agent-board}/
  v1/
    sessions/<session-id>.json
    locks/<session-id>.lock/
    locks/registry.lock/
```

`AGENT_BOARD_STATE_DIR` makes tests and advanced installations hermetic. The
default is deliberately transparent and user-inspectable.

Every mutation:

1. acquires the registry or session lock with a bounded timeout;
2. reads and validates the latest record;
3. changes only the fields owned by the use case;
4. increments `revision`;
5. writes a unique temporary file in the same directory;
6. flushes and atomically renames it over the canonical record; and
7. releases the lock.

Read paths need no lock because canonical files are replaced atomically. Lock
metadata uses `proper-lockfile` heartbeat `mtime` updates; a lock is eligible
for takeover when its heartbeat exceeds the configured stale threshold, without
an owner-process liveness check. Invalid JSON, unknown schema versions, and
broken invariants fail with actionable diagnostics; they are never interpreted
heuristically.

### Identity and idempotency

`session_id` is Board-owned UUID identity. Ghostty IDs are adapter binding, not
the primary key. Registration under the registry lock scans for the current
terminal ID and updates that record rather than duplicating it. Repository path,
label, branch, and tab index are never identity keys.

## State transition and projection policy

The registry defines native event mappings, allowed normalized values, display
labels, glyphs, precedence, confidence, and freshness in one place.

```text
terminal missing or observation unusable       -> ? diagnostic
agent health error                             -> × error
attention input_required                       -> ! needs input
attention completion_unread                    -> ✓ finished / unread
activity working with fresh evidence           -> ● working
visible registered tab otherwise               -> ○ idle
```

Managed event rules:

- thread `active` with no wait flags starts or continues `working`;
- `waitingOnApproval` or `waitingOnUserInput` sets `input_required`;
- successful turn completion sets `idle + completion_unread`;
- interrupted completion sets `idle + none`;
- failed turn or `systemError` sets `error` with native detail;
- a clean TUI process exit leaves a visible registered project idle and records
  the process-exit evidence; it does not impersonate terminal disappearance;
- a new active turn clears prior completion attention and recoverable error;
- focus acknowledges completion only when AppleScript identifies the registered
  window, selected tab, and focused terminal; elapsed time alone never does.

If detailed turn outcome is temporarily unavailable, `active -> idle` may
produce completion attention only at `corroborated` confidence and must retain
that evidence detail. It must not convert a known failure or interruption into
success.

The lifecycle adapter keeps the app-server notification iterator established
before discovery so a root-thread start/discovery race cannot lose the first
event. It binds only one viable root in the dedicated process, persists the
native thread binding before applying lifecycle observations, and refuses
ambiguous or contradictory evidence. An authoritative interruption is a
distinct normalized transition that clears completion attention; retryable
Codex errors remain diagnostic evidence within the active lifecycle.

## Ghostty integration

The adapter invokes `/usr/bin/osascript` with constant scripts and passes user
data as positional arguments, never by interpolating labels into AppleScript.
The application boundary validates tab labels before adapter transport and
rejects control characters.

Registration captures window, tab, and terminal IDs from the active hierarchy.
Title rendering targets the terminal ID with `set_tab_title:<glyph> <label>`.
Unregister clears with `set_tab_title:`.

Reconciliation performs one structured hierarchy snapshot. A terminal found in
the expected current window/tab ancestry is `visible`; an application-wide
terminal that has lost that ancestry is `hidden`; an absent ID is `missing`.
The distinction is necessary because undo-closed surfaces remain alive and
enumerable with stable IDs. Batch reconciliation for `agents` removes only the
authoritatively `missing` records from that validated snapshot. Single-session
reconciliation remains diagnostic, and an invalid or unavailable snapshot maps
sessions to `unknown` without deleting anything.

Setup diagnostics require:

- Ghostty with the official AppleScript object model;
- AppleScript enabled and macOS Automation permission granted;
- no incompatible fixed global `title`;
- title bell decoration disabled so the prefix position remains stable; and
- a usable `set_tab_title` action.

## Codex integration

The observer validates every JSON-RPC message before mapping it. It binds only
the root remote-TUI thread created within its dedicated app-server process;
unrelated or child thread events cannot overwrite the tab record. The binding
algorithm uses the dedicated process scope, thread start/load events, parent
metadata when available, and the expected working directory. Ambiguity produces
an explicit diagnostic instead of guessing.

Protocol compatibility is checked against the installed Codex version and the
minimum event/schema shapes Agent Board needs. V1 does not vendor the entire
generated app-server schema; it maintains narrow boundary schemas for the
methods it consumes and integration-tests them against the installed generator.
Unknown additive fields are allowed. Missing required fields or changed enum
semantics fail the managed adapter visibly.

App-server readiness, observer initialization, and child shutdown all have
bounded timeouts. The local endpoint binds loopback only, lives for one launcher,
and is never advertised beyond the machine.

## Technology and dependencies

| Dependency | Purpose | Constraint |
| --- | --- | --- |
| Node.js | CLI/process runtime | `>=22`; modern ESM, child-process, filesystem, and test support |
| TypeScript | domain and boundary contracts | Strict mode; compiled before packaging |
| Zod | JSON, CLI, config, and AppleScript boundary validation | Runtime dependency; schemas are authoritative |
| `ws` | app-server observer WebSocket client | Runtime dependency; loopback client only |
| `proper-lockfile` | crash-aware cross-process session locking | Runtime dependency; lock scope is state directory only |
| `tsx` + Node test runner | TypeScript test execution | Development dependency only |
| Codex CLI | managed agent backend and remote TUI | Version diagnosed at startup; app-server interface is experimental |
| Ghostty | terminal identity and title projection | macOS AppleScript-capable release |
| `/usr/bin/osascript` | Ghostty scripting transport | macOS system dependency |

There is no CLI framework, database, web framework, logging service, or GUI
dependency. `node:util.parseArgs` and small command modules are sufficient.

## Error and diagnostic conventions

- Domain/application errors are typed with stable codes and human messages.
- External process failures include command name, exit status, bounded stderr,
  and remediation, but never dump environment variables or auth material.
- User-facing commands write normal output to stdout and diagnostics to stderr.
- `--json` output uses a versioned envelope for doctor and board automation.
- Debug logging is opt-in, structured, local, and redacts prompt content and
  tokens. Agent Board needs lifecycle metadata, not conversation content.
- Degraded modes are named in every detailed board row and diagnostic output.

## Testing strategy

The test pyramid follows contracts rather than implementation lines:

1. Pure domain tests exhaust projection precedence and transition tables.
2. Store tests cover atomic replacement, schema rejection, lock contention,
   stale-lock recovery, and concurrent rename/status updates.
3. Codex adapter tests replay minimal recorded protocol fixtures for idle,
   working, both wait flags, completion, interruption, failure, system error,
   incompatible schema, and disconnect.
4. Ghostty adapter tests cover structured snapshot parsing, ID-based targeting,
   label escaping, title clear, hidden/undoable hierarchy, and failures.
5. Hermetic end-to-end tests use fake `codex` and `osascript` executables to
   prove register -> working -> waiting/completed/error -> title + board parity.
6. Opt-in installed integration tests verify the current Codex schema and a
   temporary Ghostty window without touching existing user tabs.

No test asserts private function call order where a behavioral contract is
available. Real-GUI tests remain bounded and opt-in.

## Installation and operation

The package exposes four binaries through npm packaging: `agent-codex`,
`agent-name`, `agents`, and `agent-board`. Development uses `npm link`; V1 user
installation may use a local checkout or packed tarball. No shell startup file
is mutated automatically. Documentation may offer an optional alias only after
showing the literal command it replaces.

## What's deferred

- a permanently installed event daemon or shared app-server;
- automatic shell aliases or Ghostty keybinding mutation;
- ordinary-TUI parity work beyond a truthful degraded adapter boundary;
- Claude or another agent adapter;
- focus/jump navigation and semantic agent actions;
- notifications, menu-bar, always-on-top, or GUI surfaces;
- external protocol, simulator, or remote aggregation;
- tmux integration; and
- custom hardware, wireless, battery, or enclosure work.

These remain preserved as backlog ideas with entry conditions rather than
phases in the V1 architecture.

## Bounded compatibility and tuning checks

- Managed observation currently accepts Codex `0.147.x`; `agent-board doctor`
  reports unsupported or unrecognized versions before launch. Compatibility is
  intentionally a narrow tested family, not an implicit promise for every
  future Codex release. A future upgrade must refresh the generated-schema
  integration probe and lifecycle fixtures together.
- The packaged golden journey proves lifecycle/title/board convergence under
  one second with the default observer and focus polling settings. The interval
  remains a tunable operational parameter, but changing it is a performance
  decision rather than an unresolved module-boundary question.
- Detailed outcome coverage remains bounded by the installed app-server schema:
  missing or changed required shapes fail visibly, while unknown additive fields
  remain tolerated. Any future protocol change is handled through the Codex
  compatibility boundary and its installed-schema probe.

None changes the module boundaries. These are bounded compatibility and
integration-maintenance decisions, not a reason to reopen the V1 topology.

## Related documents

| Document | Purpose |
| --- | --- |
| [Vision](VISION.md) | Product outcome and first user |
| [Specification](SPEC.md) | Behavioral and acceptance contract |
| [Principles](PRINCIPLES.md) | Tradeoff heuristics and guardrails |
| [Research plan](research-plan.md) | Completed and deferred research |
| [Codex topology brief](../.research/analysis/briefs/codex-detector-topology.md) | Managed/ordinary runtime evidence |
| [Ghostty contract brief](../.research/analysis/briefs/ghostty-registration-liveness.md) | Registration, title, and liveness evidence |

## Related architecture docs

No other `type: architecture` document currently exists in the knowledge index.
