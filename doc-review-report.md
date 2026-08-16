# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited HEAD:** `5af8411`
**Documents reviewed:** 6 current system planning documents (6 system + 0 module), plus 1 superseded historical document, 10 indexed research records, `AGENTS.md`, `README.md`, operator examples, implementation, tests, and all 45 current `.work/` records
**Passes run:** 1 fresh independent system-level pass; 0 module passes
**Issues found:** Critical **0** · High **0** · Medium **2** · Low **0** · Info **1**

## Mechanical Critical/High Gate

**PASS — Critical = 0 and High = 0.**

The fresh full Phase 1–3 audit found no Critical or High issue. The
identity-based detached-rename repair is consistent across the shipped command
path, process topology, operator documentation, specification, architecture,
tests, work item, and regenerated knowledge indexes.

This delegated audit was explicitly limited to the canonical report. No
planning document, generated index, source file, test, work item, commit, or
remote state was changed.

## Phase 1: Discovery

- `docs/knowledge-index.yaml` exists and lists 17 records: 6 current planning
  documents, 10 research records, and 1 explicitly superseded historical
  document. Every indexed path exists.
- Current system planning corpus: `docs/VISION.md`, `docs/PRINCIPLES.md`,
  `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/configuration.md`, and
  `docs/research-plan.md`.
- No module north stars, `docs/*/architecture/` planning trees, or `modules/`
  planning directories exist. Therefore no module pass applies.
- Current planning frontmatter compliance is **6/6**. Each current planning
  document has a non-empty description, project-supported type, and updated
  date. Planning types do not require `research_method`.
- All local Markdown links resolve. Every indexed path exists, and all nine
  archive-stub `git_ref` values resolve to commits.
- The regenerated navigator matches the current substrate: 5 active epics,
  15 active features, 7 active stories, 9 backlog records, and 9 archive
  records.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (2)

#### Completed features retain 84 unchecked acceptance criteria

**Files:**
`.work/active/features/epic-trustworthy-session-core-transition-projection.md`,
`.work/active/features/epic-ghostty-project-surface-registration-naming.md`,
`.work/active/features/epic-trustworthy-session-core-atomic-store.md`,
`.work/active/features/epic-ghostty-project-surface-title-reconciliation.md`,
`.work/active/features/epic-trustworthy-session-core-domain-contract.md`,
`.work/active/features/epic-managed-codex-observation-app-server-client.md`, and
`.work/active/features/epic-ghostty-project-surface-applescript-adapter.md`

**What:** These seven features are at `stage: done`, carry implementation and
review evidence, and have their claimed production/test outputs on disk, but
their bodies retain 84 unchecked acceptance boxes: 14, 14, 13, 12, 11, 10, and
10 respectively. This is systematic stale substrate status prose, not evidence
of a missing DONE capability.

**Fix:** In a substrate-hygiene pass, verify each criterion against the existing
implementation/review evidence and check the satisfied boxes without reopening
the completed designs.

#### Packaged-E2E design retains a consolidated file path

**Files:**
`.work/active/features/epic-operational-readiness-packaged-e2e.md:110` and
`tests/e2e/support/package-harness.ts`

**What:** The done feature's Unit 1 still lists
`tests/e2e/support/scenario.ts`, which does not exist. The scenario types and
state helpers were consolidated into `package-harness.ts`; the feature's final
implementation notes correctly list the final harness and executable fixtures.
The packaged capability exists and passes, so this is stale planned-path prose
rather than a missing DONE output.

**Fix:** Remove the obsolete path or annotate its consolidation into
`package-harness.ts`.

### Low (0)

None.

### Info (1)

#### No module-level planning corpus discovered

**Files:** `docs/` and `docs/ARCHITECTURE.md:520`

**What:** There are no module north stars, `docs/*/architecture/` planning
trees, or `modules/` planning directories. Architecture also states that no
other architecture document exists in the index.

**Disposition:** Informational. The full cascading review therefore consists of
one system pass and zero module passes.

## Identity-Based Detached Rename Verification

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Managed launch carries the stable Board identity into both Codex processes. | `src/application/launch-managed-codex.ts`, launcher tests | Consistent. The registered `sessionId` is passed to both `startAppServer` and `startRemoteTui`; relaunch retains the Board/Ghostty identity while replacing managed runtime metadata. |
| App-server receives process identity and an explicit shell-policy bridge. | `src/integrations/codex/process.ts`, `tests/integrations/codex/process.test.ts`, captured Codex 0.147.0 app-server help | Consistent. Spawn receives `env.AGENT_BOARD_SESSION_ID`, and argv receives `-c shell_environment_policy.set.AGENT_BOARD_SESSION_ID=<JSON string>`. The installed help capture documents dotted `-c key=value` parsing as TOML and uses `shell_environment_policy` as its example family. |
| Agent-tool shell descendants receive exact identity after Codex filtering. | Architecture, active story root-cause record, process-host implementation/test | Consistent at Agent Board's owned boundary. The policy `set` override is passed on app-server startup instead of relying on process inheritance alone. |
| Remote TUI and Codex `!` descendants carry exact identity. | `src/integrations/codex/process.ts`, process-host test | Consistent. The remote TUI spawn inherits stdio and receives `env.AGENT_BOARD_SESSION_ID` while retaining the reserved `tui.terminal_title=[]` override. |
| Bound one-label rename never consults focus. | `src/cli/agent-name.ts`, `src/application/register-session.ts`, CLI/application tests | Consistent. The CLI trims the inherited ID and supplies `targetSessionId`; registration mutates that exact record and renders its stored terminal identity. The explicit path never calls `terminal.current()` or repository discovery. |
| Unbound detached rename is refused before a focus-derived mutation. | `src/cli/agent-name.ts`, CLI regression, packed-install journey | Consistent. A non-TTY one-label call without a bound ID returns exit 1 with the stable conflict and makes zero registration calls. The packed binary reproduces the refusal. |
| Interactive unbound fallback remains available. | CLI regression, packed-install journey | Consistent. With no bound ID and interactive stdin, the one-label form retains the intended current-Ghostty-focus registration/rename behavior. |
| No-argument macOS Shortcut behavior is unchanged. | `src/cli/agent-name.ts`, `src/application/prompt-rename-session.ts`, prompt/CLI tests, configuration guide | Consistent. Zero arguments bypass the one-label TTY guard, capture the focused registered session before opening the native dialog, treat Cancel as success, and preserve identity/state/binding on Rename. |
| Existing managed sessions require one restart. | `README.md`, `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/configuration.md`, active story | Consistent and prominent. Environment changes are not retroactive; a session launched before this build can still emit the unbound conflict from `! agent-name ...` until it exits and restarts through `agent-codex`. |

The reported `!agent-name crux-2` conflict is therefore compatible with the
documented upgrade boundary when it came from a managed Codex process launched
before this repair. After one fresh `agent-codex` launch, both Codex `!` and
agent-tool invocations take the identity-bound path; the exact error remains the
correct safeguard for truly unbound non-TTY calls.

## Clean Areas

- README, configuration guide, specification, architecture, and the active
  story agree on the two one-label targeting paths and the exact restart caveat.
- The stable Board session ID is distinct from the human label, Ghostty adapter
  identity, launcher PID, and native Codex thread binding across docs and code.
- Exact targeting remains constrained to the stored session's terminal identity;
  title rendering re-reads current durable state and rejects a changed binding.
- The no-argument Shortcut path remains focus-captured and race-aware rather
  than inheriting the managed-session environment path.
- Managed app-server plus remote TUI remains the V1 default throughout current
  product truth and the completed research record.
- Vision and principles remain aligned with the repair: a detached command may
  not infer semantic target identity from incidental frontmost focus.
- Generated knowledge layers are current with their source frontmatter and
  substrate counts.
- All four packaged commands named by architecture and operator docs match
  `package.json` and the installed-bin E2E coverage.

## Blocking Briefs Status

There is no missing NEXT blocker. The locked V1 architecture and this repair's
unchanged topology remain grounded by these on-disk artifacts.

| Brief | Supports | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex app-server/remote-TUI topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, targeted title rendering, and conservative liveness | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

The later `shell_environment_policy.set` bridge is a bounded implementation
correction inside the accepted managed topology. Its external CLI shape is
supported by the checked-in Codex 0.147.0 help capture, and its exact argv is
covered at the process boundary; it does not reopen the topology decision.

## DONE Output Verification

No separate phase roadmap exists; delivery state is intentionally owned by
`.work/`. The completed V1 arcs were checked directly.

| Delivery arc | Current status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain contracts, atomic store/lock, transition/projection code and tests | Present |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, title code and tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, protocol/process tests, and opt-in probe | Present; repair extends its existing process boundary |
| Swarm attention board | Done | Board query/rendering, acknowledgement/unregister controls, and tests | Present |
| Operational readiness | Done | Doctor, packed-artifact harness, golden/failure/chaos journeys, and opt-in probes | Present; one stale planned-path Medium above |
| Companion terminal configuration | Done | Ghostty/Codex examples, configuration guide, README routing, and validation evidence | Present |
| Detached-focus rename repair | Review | Exact identity propagation, CLI/application guard, tests, docs, work record, and regenerated indexes | Present and green; normal bounded review/tier transition remains |

The repair story is at `stage: review`, so it is not subject to the skill's
DONE-output enforcement. No done item is missing a runtime capability or test
suite.

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`. There are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates. The remaining indexed campaign components are supporting scaffold
or specialist artifacts without load-bearing `research_method` fields.

## Verification

Fresh verification completed successfully against audited HEAD:

- `npm run typecheck`
- `npm test`: **186 tests**, **184 passing**, **0 failing**, **2 opt-in live probes skipped**
- all local Markdown links in `README.md` and `docs/*.md` resolve
- all 17 knowledge-index paths exist
- all 9 archive-stub commit references resolve
- tracked worktree was clean before this report was replaced

## Audit Boundary

This fresh Phase 1–3 system audit inspected every current planning document
discovered from `docs/knowledge-index.yaml`, the superseded historical checkpoint
for conflict only, operator docs and examples, the identity/launch/registration/
title implementation paths, focused and packaged regressions, all current
active/backlog/archive records, blocking research existence and provenance,
generated-index consistency, local links, schema and decision consistency,
staleness, and completed outputs. No module planning corpus was discovered.

Only `doc-review-report.md` was overwritten by this audit.
