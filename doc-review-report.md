# Documentation Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited HEAD:** `5c40859`
**Documents reviewed:** 7 current system documents (`README.md` plus 6 indexed
planning documents), 1 superseded historical document, 10 indexed research
records, the project instruction/process chain, current implementation and
tests, examples, and the complete `.work/` substrate.
**Passes run:** 1 fresh system-level pass; 0 module passes.
**Frontmatter compliance:** 7/7 indexable system/historical documents; the 2
blocking technical briefs and Scout parent also carry required provenance.
**Issues found:** Critical **0** · High **0** · Medium **2** · Low **0** · Info **1**

## Mechanical exit gate

`Critical 0 / High 0 = PASS`

The final post-repair corpus is free of Critical and High drift. The current
Codex discovery and terminal-recovery contracts agree across planning docs,
operator docs, code, tests, research boundaries, generated indexes, and the
reviewed and archived repair stories.

## Pass 1: System-level findings

### Critical (0)

None.

### High (0)

None.

### Medium (2)

#### Completed feature bodies retain unchecked acceptance criteria

**Files:** Seven older `stage: done` feature bodies under
`.work/active/features/`.

**What:** These completed records retain 84 unchecked acceptance boxes even
though their implementation notes, reviews, code, and tests support completion.
This is stale substrate status prose, not evidence that the shipped capability
is absent.

**Fix:** During a bounded substrate-hygiene pass, verify and check the satisfied
criteria without reopening the completed designs.

#### Packaged-E2E design retains an obsolete planned helper path

**Files:** `.work/active/features/epic-operational-readiness-packaged-e2e.md`

**What:** The design still names `tests/e2e/support/scenario.ts`, which does not
exist. The implemented scenario model and harness are in
`tests/e2e/support/package-harness.ts`; the packaged tests use that path.

**Fix:** Replace the obsolete planned path with the implemented helper path, or
record that the planned helper was consolidated into `package-harness.ts`.

### Low (0)

None.

### Info (1)

#### No module-level planning corpus

No module north stars, `docs/*/architecture/` trees, or `modules/` planning
directories were discovered. The full cascading review therefore correctly
contains one system pass and zero module passes.

## Current repair-contract verification

### Codex loaded-thread discovery

| Contract | Current evidence | Result |
| --- | --- | --- |
| `thread/loaded/list` returns ordered thread-ID strings. | `docs/ARCHITECTURE.md`; `ThreadLoadedListResponseSchema` in `src/integrations/codex/protocol.ts`; protocol/client tests; packaged fake Codex | Consistent |
| Each ID is resolved through `thread/read` with `{ threadId, includeTurns: false }`. | `AppServerClient.loadedThreads`; client regression; installed-schema probe | Consistent |
| Discovery returns enriched status, cwd, and parent metadata to existing root binding. | Internal `ThreadLoadedListResultSchema`; `thread-binding.ts`; architecture lifecycle section | Consistent |
| Subscription precedes discovery so a root-start race cannot lose the first event. | `observe-managed-codex.ts`; thread-binding regression; architecture | Consistent |
| Malformed or mismatched responses fail closed and name the drifted JSON-RPC method. | `client.ts`; protocol/client negative tests; README/architecture failure language | Consistent |

The archived repair stub
`.work/archive/story-fix-codex-loaded-thread-schema.md` is at `stage: done` and
points to review commit `3719113`. That commit resolves to the full story
history, including root cause, regression evidence, implementation notes, clean
verification, and an approving bounded review. Archive commit `5c40859`
correctly replaces the active body with the bodyless reference stub.

### Two-stage terminal restoration

| Contract | Current evidence | Result |
| --- | --- | --- |
| Capture the exact pre-launch terminal state with shell-free `/bin/stty -g`. | `src/integrations/terminal-mode.ts`; terminal-mode tests; architecture | Consistent |
| Restore that opaque termios snapshot after every managed exit path. | `runAgentCodexWithSignals` `finally`; CLI regressions; README/architecture | Consistent |
| After successful termios restoration, emit CSI-u pop/reset twice, then disable xterm modifyOtherKeys. | `KEYBOARD_REPORTING_RESET = "\x1b[<u\x1b[<u\x1b[>4;0m"`; exact-output regression; README/architecture | Consistent |
| Skip capture/restoration for non-terminal stdin and refuse launch when terminal capture fails. | `SttyTerminalMode.capture`; adapter/CLI tests; architecture | Consistent |
| Restoration failure preserves the managed outcome and tells the operator to run `reset`. | `agent-codex.ts`; CLI regression; README/architecture | Consistent |

The archived repair stub
`.work/archive/story-fix-terminal-keyboard-mode-restoration.md` is at
`stage: done` and points to review commit `af155e6`. That commit resolves to the
full story history, including the termios-versus-emulator root cause, exact
cleanup sequence, regression evidence, clean verification, and an approving
bounded review. Archive commit `5c40859` correctly replaces the active body with
the bodyless reference stub. The earlier termios-only repair remains separately
traceable through its archived stub and review commit `37e520f`.

## Inventory and cross-reference integrity

- Current indexed system planning docs are `VISION`, `SPEC`, `ARCHITECTURE`,
  `PRINCIPLES`, `research-plan`, and `configuration`; `README.md` is the
  unindexed operator entry point. `docs/project-brief.md` is explicitly
  historical and superseded by `docs/VISION.md`.
- Current local Markdown references resolve, including the configuration
  fragments, system planning links, and the two blocking runtime briefs.
- The generated full, detail, and navigator indexes share timestamp
  `2026-08-16T21:40:25Z` and report 17 documents: 6 planning, 10 research, and
  1 historical.
- Generated substrate counts match disk and `work-view`: 5 active epics, 15
  active features, 8 active stories, 7 backlog items, 13 archive stubs, and no
  release record. `work-view --stage review` is empty after both repairs were
  approved and archived.
- All archive-stub `git_ref` values resolve. The two current repair refs recover
  their complete reviewed bodies rather than pointing to missing or premature
  history.
- The architecture module map matches the current `src/` boundaries and the
  test-pyramid claims match existing domain, application, integration,
  infrastructure, CLI, packaged-E2E, and opt-in compatibility tests.
- The current docs consistently keep ordinary Codex registration diagnostic,
  managed app-server plus remote TUI as V1, confidence visible, state local,
  and semantic agent actions outside V1.

## Blocking research status

| Artifact | Decision supported | Exists | Status |
| --- | --- | --- | --- |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Ghostty/Codex-first scope and deferred horizon | Yes | Locked; `/scout` complete |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed app-server/remote-TUI topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Stable Ghostty identity, titles, and conservative liveness | Yes | Locked; `/research` complete |

The frozen Codex brief's provisional Unix-socket recommendation and older title
configuration evidence are not current contracts. `docs/ARCHITECTURE.md`
explicitly records the verified loopback-WebSocket decision and current
`tui.terminal_title=[]` override, so the research record does not create active
drift.

## Provenance summary

| `research_method` | Records | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |
| Missing on decision-bearing brief/parent | 0 | — |

No research refresh candidate is required. Both implementation repairs adapt
already selected runtime boundaries to verified local behavior; neither reopens
the settled topology or Ghostty product decision.

## DONE-claim verification

| Completed arc | Expected output | On-disk evidence | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Domain model, atomic store, transitions, projection | `src/domain`, `src/infrastructure`, corresponding tests | Present |
| Ghostty project surface | AppleScript adapter, naming, title/presence reconciliation | `src/integrations/ghostty`, application/integration tests | Present |
| Managed Codex observation | App-server client, lifecycle, launcher, process boundary | `src/integrations/codex`, launcher tests, installed-schema probe | Present |
| Swarm attention board | Shared board projection, acknowledgement, unregister | application/CLI code and tests | Present |
| Operational readiness | Doctor, operator guide, packaged journeys | doctor code/tests, `README.md`, `tests/e2e` | Present; one stale planned path is Medium above |
| Companion configuration | Ghostty/Codex merge examples and setup guide | `examples/`, `docs/configuration.md` | Present |
| Managed working liveness | Signal-zero probe and verified projection policy | `launcher-liveness.ts`, reconciliation/projection tests, archived feature evidence | Present |
| Loaded-thread schema repair | ID-list discovery enriched through `thread/read` | protocol/client code, regressions, installed-schema probe, archived reviewed story | Present |
| Terminal keyboard restoration repair | Exact termios restore followed by CSI-u/modifyOtherKeys cleanup | terminal-mode/CLI code, regressions, archived reviewed story | Present |

The parent verification run reports the complete suite clean at 192 passed and
2 opt-in probes skipped, and the live installed Codex schema probe clean. This
documentation pass did not rerun tests.

## Clean areas

- Architecture, specification, README, archived repair evidence, and adapters
  use the same loaded-list-ID plus thread-read contract.
- Architecture, README, archived repair evidence, and implementation use the
  same exact termios-then-keyboard-reset order and recovery semantics.
- Blocking research artifacts and all cited local paths exist.
- Superseded historical and frozen research material is clearly separated from
  current product truth.
- Generated knowledge indexes reflect the post-archive documentation and
  substrate shape.

No Critical or High auto-fix iteration was required. This fresh full audit is
the mandatory exit verification and returns `Critical 0 / High 0`.
