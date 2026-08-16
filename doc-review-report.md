# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited HEAD:** `3addfd3`
**Documents reviewed:** 6 current system planning documents (6 system + 0 module), plus 1 superseded historical document, 10 indexed research records, `AGENTS.md`, `README.md`, operator examples, implementation, tests, and all 40 current `.work/` records
**Passes run:** 1 fresh full system-level pass; 0 module passes (no module planning corpus exists)
**Issues found:** Critical **0** · High **0** · Medium **1** · Low **0** · Info **2**

## Mechanical Exit Gate

**PASS — Critical = 0 and High = 0.**

This fresh full Phase 1–3 audit found no Critical or High issue. The mechanical
exit condition is satisfied, so no Critical/High auto-fix iteration or follow-up
re-audit is required.

## Phase 1: Discovery

- `docs/knowledge-index.yaml` exists and lists 17 records: 6 current planning
  documents, 10 research records, and 1 explicitly superseded historical
  document. Every indexed path exists.
- Current system planning corpus: `docs/VISION.md`, `docs/PRINCIPLES.md`,
  `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/configuration.md`, and
  `docs/research-plan.md`.
- No module north stars, `docs/*/architecture/` module trees, or `modules/`
  planning directories exist. There is therefore no module pass to run.
- Current planning frontmatter compliance is 6/6. Each current planning document
  has a non-empty description, project-supported type, kind, status, and updated
  value. The two focused decision briefs declare `/research`; the locked
  prior-art parent declares `/scout`.
- All three generated knowledge-index layers share generation time
  `2026-08-16T18:39:55Z`. The navigator reports the committed final substrate
  counts: 5 active done epics, 15 active done features, 6 active done stories,
  8 backlog records, and 6 archive stubs.
- All local Markdown links in the planning, operator, and work corpus resolve.
  Both blocking runtime briefs, the prior-art parent, the managed-runtime
  attestation, and the two operator configuration examples exist on disk. Every
  archive-stub `git_ref` resolves to a commit.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (1)

#### Older completed features retain unchecked acceptance criteria

**Files:**
`.work/active/features/epic-trustworthy-session-core-domain-contract.md`,
`.work/active/features/epic-trustworthy-session-core-atomic-store.md`,
`.work/active/features/epic-trustworthy-session-core-transition-projection.md`,
`.work/active/features/epic-ghostty-project-surface-applescript-adapter.md`,
`.work/active/features/epic-ghostty-project-surface-registration-naming.md`,
`.work/active/features/epic-ghostty-project-surface-title-reconciliation.md`, and
`.work/active/features/epic-managed-codex-observation-app-server-client.md`

**What:** These seven features remain at `stage: done`, carry implementation
and review evidence, and have their claimed production and test outputs on disk,
but all 83 acceptance-criteria checkboxes in their bodies remain unchecked.
Newer done features use checked criteria. The older boxes are stale completion
metadata, not evidence that their outputs are absent, but they can mislead a
reader who inspects the bodies without reconciling stage and review evidence.

**Fix:** In a substrate-hygiene pass, verify each criterion against its existing
implementation/review evidence and check the satisfied boxes. Do not reopen or
redesign the completed features merely to normalize their metadata.

### Low (0)

None.

### Info (2)

#### No separate roadmap document

**Files:** `docs/research-plan.md`, `.work/`, and
`.work/backlog/roadmap-deferred-product-horizon.md`

**What:** Delivery status is intentionally owned by `.work/`; the research plan
owns completed and deferred research, and the backlog preserves non-binding
future product options. No current planning document claims a separate phase
roadmap exists.

**Disposition:** Informational. No NEXT-phase blocker is hidden by this shape.

#### Terminal-mode restoration is a preserved adjacent problem

**Files:** `docs/ARCHITECTURE.md`, `docs/SPEC.md`,
`.work/archive/story-fix-managed-relaunch-thread-binding.md` (`git_ref:
1e2c960`), and `.work/backlog/idea-terminal-mode-restoration.md`

**What:** The completed managed-relaunch repair replaces stale runtime-owned
thread metadata while preserving stable Board, Ghostty, and project identity.
Its review evidence at commit `1e2c960` explicitly treats exact terminal-mode
restoration after Agent Board-forced TUI shutdown as adjacent, not part of that
repair. The observed Control-C symptom and immediate `reset` / `stty sane`
recovery are preserved in the dedicated backlog record. Current planning docs
do not claim general TTY restoration.

**Disposition:** Correctly separated future work, not drift in the completed
relaunch contract.

## Managed Relaunch Contract Verification

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Generated knowledge reflects the final relaunch decisions. | `docs/ARCHITECTURE.md`, `docs/SPEC.md`, and all three knowledge-index layers | Consistent. Architecture and specification are dated 2026-08-16, both decisions appear in the detail index, and all layers share the final generation time. |
| Board session, Ghostty binding, and project identity persist across sequential launches in one registered tab. | Specification and architecture identity sections; registration and launch code; relaunch regression test | Consistent. Registration reuses terminal identity, and the launch claim leaves stable session, identity, and terminal fields intact. |
| Each launch owns a short-lived launcher, private app-server, and native Codex thread. | Architecture topology; supervised-launcher feature; `src/application/launch-managed-codex.ts` | Consistent. Runtime ownership is per invocation rather than attached permanently to the Board session. |
| The new launch clears the prior native thread before the observer binds its own root. | `src/application/launch-managed-codex.ts`, `src/application/observe-managed-codex.ts`, and `tests/application/launch-managed-codex.test.ts` | Consistent. The claim removes `nativeThreadId`, records the current launcher PID, and the regression proves the observer binds the new `root` thread. |
| The repair is complete historical delivery evidence, not current active work. | `.work/archive/story-fix-managed-relaunch-thread-binding.md` and Git history at `1e2c960` | Consistent. The bodyless stub is `stage: done`; commit `1e2c960` contains the approved bounded review with no blockers. |
| Relaunch does not promise exact TTY recovery after forced shutdown. | Current planning docs, archived repair evidence, and `.work/backlog/idea-terminal-mode-restoration.md` | Consistent. The observed terminal-mode risk remains explicitly deferred. |

No tests were run during this audit. Existing evidence was inspected directly:
the archived repair points to `1e2c960`, whose completed review records focused
launch/observer tests at 9/9, passing typecheck, and a full suite of 172 passing
tests with 2 opt-in probes skipped. The corresponding production and regression
test sources remain present and aligned.

## Clean Areas

- Vision, principles, specification, and architecture retain clear ownership:
  product outcome and guardrails remain separate from behavioral and process
  contracts, with one projection policy rather than duplicated renderer state.
- Stable Board/Ghostty/project identity is consistently distinguished from
  launcher-owned PID and native thread metadata across planning docs, delivery
  evidence, source, and tests.
- Managed app-server plus remote TUI remains the V1 default everywhere current
  truth describes it; ordinary Codex remains explicitly degraded-confidence.
- Local-first storage, centralized projection, Ghostty stable-ID targeting,
  conservative liveness, completion acknowledgement, and observation-only scope
  align between foundation docs and implementation.
- The four packaged commands named by architecture and operator docs match
  `package.json`, `src/cli/`, and the composition roots.
- README, configuration guidance, and examples agree on Ghostty title ownership,
  the macOS Services rename setup, and the typed
  `tui.terminal_title=[]` override.
- Every completed V1 delivery arc has its expected implementation and test
  surface on disk. All active delivery items are done; the relaunch repair is a
  bodyless archive stub backed by reviewed Git evidence at `1e2c960`.
- The superseded `docs/project-brief.md` is clearly historical and points to the
  current foundation set; its earlier daemon, tmux, multi-agent, and hardware
  ideas do not masquerade as current scope.

## Blocking Briefs Status

There is no NEXT delivery phase naming a missing blocking brief. The locked V1
architecture remains grounded by these on-disk artifacts.

| Brief | Supports | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex observation and launcher topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, liveness, and cleanup | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

## DONE Output Verification

| Delivery arc | Current status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain contracts, atomic store/lock, transition/projection code and tests | Present |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, title code and tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, protocol/process tests, and opt-in probe | Present |
| Swarm attention board | Done | Board query/rendering, acknowledgement/unregister controls, and tests | Present |
| Operational readiness | Done | Doctor, packed-artifact harness, golden/failure/chaos journeys, and opt-in probes | Present |
| Companion terminal configuration | Done | Ghostty/Codex examples, configuration guide, README routing, and validation evidence | Present |
| Managed relaunch repair | Done; archived | Launch claim clears stale thread ownership before observer binding; archive stub points to reviewed evidence at `1e2c960` | Present and consistent |

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`. There are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates.

## Audit Boundary

This fresh Phase 1–3 cascading audit inspected every current system planning
document discovered from `docs/knowledge-index.yaml`, the superseded historical
checkpoint for conflict only, operator docs and examples, implementation and
test sources, all active/backlog/archive substrate records, blocking research
and attestation existence/provenance, generated-index consistency, local links,
schemas, decisions, staleness, and completed outputs. No module planning corpus
was discovered, so no module pass applied.

Only `doc-review-report.md` was overwritten. No source planning document,
generated index, implementation file, work item, package file, commit, or remote
state was changed.
