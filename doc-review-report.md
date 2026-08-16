# Documentation Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited HEAD:** `b2a553f`
**Documents reviewed:** 9 current system planning/process documents (`README.md`, `AGENTS.md`, six indexed planning docs, and `.work/CONVENTIONS.md`), 1 superseded historical document, 10 indexed research records, implementation, tests, examples, and all current `.work/` records.
**Passes:** 1 independent system pass; 0 module passes.
**Severity:** Critical **0** · High **0** · Medium **2** · Low **0** · Info **1**

## Mechanical exit gate

`Critical 0 / High 0 = PASS`

No current planning assertion is materially false, unsafe, or contradictory. The
managed-working-liveness implementation and its documentation are aligned.

## Pass 1 findings

### Critical (0)

None.

### High (0)

None.

### Medium (2)

#### Completed feature bodies retain unchecked acceptance criteria

**Files/evidence:** Seven older `stage: done` feature bodies under
`.work/active/features/`; they retain implementation/review evidence but 84
unchecked acceptance boxes in aggregate.

**What:** This is stale substrate status prose, not evidence of missing shipped
capabilities. Current code, tests, and work-item implementation notes support the
done claims.

**Fix:** Run a bounded substrate-hygiene pass to verify and check the satisfied
criteria without reopening completed designs.

#### Packaged-E2E design retains an obsolete planned path

**Files/evidence:** `.work/active/features/epic-operational-readiness-packaged-e2e.md:110`
mentions `tests/e2e/support/scenario.ts`, which is absent; the implemented helper
and scenario types are in `tests/e2e/support/package-harness.ts`.

**What:** Final implementation notes and packaged journeys are present and pass;
only the earlier unit path is stale.

**Fix:** Remove the obsolete path or annotate its consolidation into
`package-harness.ts`.

### Low (0)

None.

### Info (1)

#### No module-level planning corpus

No module north stars, `docs/*/architecture/` trees, or `modules/` planning
directories were discovered. The cascading review therefore correctly consists
of one system pass and zero module passes.

## Inventory and consistency evidence

- `docs/knowledge-index.yaml` and `docs/knowledge-index-nav.yaml` agree: 17
  indexed records = 6 planning, 10 research, and 1 superseded historical.
- All 17 indexed paths exist. The six indexed planning documents have complete
  v2 frontmatter (`name`, `description`, `type`, `kind`, `status`, `updated`).
  `README.md`, `AGENTS.md`, and `.work/CONVENTIONS.md` are process/operator
  documents and are intentionally outside the generated planning-doc index.
- Generated substrate counts match disk and `work-view`: active 5 epics, 15
  features, 8 stories; backlog 8; archive 11; releases 0. Done child stories
  retained under `active/stories` alongside the archived feature are consistent
  with the repository's retained done-child pattern.
- All local Markdown references inspected resolve, including the two research
  briefs and both configuration example fragments. Archive stub `git_ref`
  values resolve.
- Ownership is clear: foundation docs describe current product truth; research
  owns evidence; `.work/` owns delivery state; Git owns history. The historical
  `docs/project-brief.md` is explicitly superseded and was used only for conflict
  checking.

## Managed working-liveness contract

| Contract assertion | Evidence | Result |
| --- | --- | --- |
| A persisted `launcherPid` is binding context, not proof by itself. | `src/application/reconcile-session.ts:146-169`, `src/domain/projection.ts:60-67`, `tests/application/prompt-rename-session.test.ts`, `tests/application/reconcile-session.test.ts` | Consistent. |
| Only the current signal-zero probe can produce `verifiedLauncherPid`, and it must match the latest stored PID before projection authorizes old working evidence. | `src/application/reconcile-session.ts:154-188,226-272`; `src/domain/projection.ts:50-67`; `src/application/render-title.ts:41-47` | Consistent. |
| A live probe does not rewrite native observation or refresh it periodically. | `src/application/reconcile-session.ts:167-169`; reconciliation tests | Consistent. |
| A dead or unprobeable launcher becomes stale, corroborated diagnostic evidence while retaining PID binding context. | `src/application/reconcile-session.ts:160-188`; `tests/application/reconcile-session.test.ts:118-128`; `docs/SPEC.md:161-169`; `docs/ARCHITECTURE.md:378-388` | Consistent. |
| Direct title/rename paths retain freshness fallback without verified proof. | `src/application/render-title.ts`; `tests/application/prompt-rename-session.test.ts` (“persisted launcher PID as verified liveness”); architecture/spec | Consistent. |
| Reconciliation carries proof into both title and board row projection. | `reconcile-session.ts:248-272`, `list-sessions.ts:87-123`, `tests/application/list-sessions.test.ts:148-169`, packaged golden journeys | Consistent. |
| There is no daemon, heartbeat, or schema migration for this feature. | `README.md:25-26`, `docs/SPEC.md:19-20,166-169`, `docs/ARCHITECTURE.md:10-18,387-388`; source schema unchanged | Consistent. |

README, SPEC, ARCHITECTURE, PRINCIPLES, configuration, AGENTS, and the research
plan agree on managed app-server plus remote TUI as the V1 topology, ordinary
registration as diagnostic, visible confidence/staleness, local-first operation,
and no semantic agent actions. The liveness addition preserves those decisions.

## Blocking briefs and provenance

| Artifact | Decision supported | Exists | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex app-server/remote-TUI topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, titles, and conservative liveness | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

No blocking brief is missing or stale relative to the settled V1 decisions. The
managed-liveness change is an implementation refinement inside the accepted
topology, not a reopened research decision. No refresh candidate is applicable.

## DONE verification

| Arc | Expected output | Evidence | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Domain, atomic store, transitions, projections | `src/domain`, `src/infrastructure`, tests | Present |
| Ghostty project surface | AppleScript adapter, registration, reconciliation, titles | `src/integrations/ghostty`, application tests | Present |
| Managed Codex observation | App-server client, lifecycle, launcher, process boundary | `src/integrations/codex`, launcher tests, opt-in schema probe | Present |
| Swarm attention board | Query/render, acknowledgement, unregister | `src/application`, CLI tests | Present |
| Operational readiness | Doctor and packaged E2E journeys | `src/application/doctor.ts`, `tests/e2e` | Present; stale planned path is Medium above |
| Companion configuration | Examples, guide, README routing | `examples/`, `docs/configuration.md` | Present |
| Managed working liveness | Signal-zero probe, projection policy, stale diagnostics | `src/integrations/launcher-liveness.ts`, focused tests, archived feature and done child stories | Present |

## Verification summary

- `npm run typecheck`: passed.
- `npm test`: 193 total, 191 passed, 2 opt-in live probes skipped, 0 failed
  (the runner emitted the complete test results; this environment left an open
  test handle after the final skipped probes and required interruption).
- Focused liveness tests cover healthy long-running working state, missing and
  unprobeable launchers, PID mismatch/fallback behavior, stale diagnostics, and
  board/title parity.
- Knowledge index and navigator are regenerated at `2026-08-16T20:54:56Z` and
  agree with the on-disk corpus and substrate counts.

Only `doc-review-report.md` was overwritten. No source, test, index, work item,
or other project file was changed.
