# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited HEAD:** `2d94a1b` plus the shared uncommitted ordinary-projection implementation, tests, and story
**Documents reviewed:** 6 current system planning documents (6 system + 0 module), plus 1 superseded historical document, 10 indexed research records, `AGENTS.md`, `README.md`, operator examples, implementation, tests, and all 44 current `.work/` records
**Passes run:** 1 fresh independent system-level pass; 0 module passes
**Issues found:** Critical **0** · High **0** · Medium **4** · Low **0** · Info **1**

## Mechanical Critical/High Gate

**PASS — Critical = 0 and High = 0.**

The fresh full system pass found no Critical or High issue. The invocation's
explicit read-only boundary superseded the skill's auto-fix and index-regeneration
phases, so no planning document, generated index, source file, test, work item,
commit, or remote state was changed.

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
- All local Markdown links resolve. The canonical absolute references in
  `AGENTS.md` resolve, every indexed path exists, and every archive-stub
  `git_ref` resolves to a commit.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (4)

#### Generated knowledge artifacts predate the ordinary-projection decision

**Files:** `docs/ARCHITECTURE.md:12`, `docs/SPEC.md:18`,
`docs/knowledge-index-detail.yaml:15`,
`docs/knowledge-index-detail.yaml:67`, and
`docs/knowledge-index-nav.yaml:18`

**What:** The source frontmatter now says ordinary mode is a registration-only
diagnostic state until managed observation attaches. The derived detail index
still preserves the superseded claim that ordinary observation is a
degraded-confidence fallback. The navigator was generated before the current
story and two rename-safety backlog records: it reports 6 active stories and 7
backlog records, while the worktree contains 7 and 9 respectively. The source
docs and `.work/bin/work-view` remain authoritative, so this does not create a
Critical/High delivery gap.

**Fix:** Regenerate all knowledge-index layers from current frontmatter and
substrate state after the ordinary-projection story reaches its settled tier.

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
of missing DONE capability.

**Fix:** In a substrate-hygiene pass, verify each criterion against the existing
implementation/review evidence and check the satisfied boxes without reopening
the completed designs.

#### Board-command feature assigns ordinary diagnostics to the wrong layer

**Files:**
`.work/active/features/epic-swarm-attention-board-board-command.md:74`,
`.work/active/features/epic-swarm-attention-board-board-command.md:93`,
`.work/active/features/epic-swarm-attention-board-board-command.md:139`,
`src/domain/projection.ts:56`, and `src/application/list-sessions.ts:71`

**What:** The completed feature still says the board layer adds ordinary-mode
detail. Current source correctly centralizes `session is not managed` in
`projectSession`, and the board consumes that canonical diagnostic without
adding a duplicate. The stale ownership prose could invite a later builder to
reintroduce renderer drift.

**Fix:** Update the completed feature's design and implementation notes to say
ordinary-mode diagnostics originate in canonical projection; the board layer
adds only board-specific title-sync and corroborated-evidence annotations.

#### Packaged-E2E design retains a consolidated file path

**Files:**
`.work/active/features/epic-operational-readiness-packaged-e2e.md:109` and
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

**Files:** `docs/` and `docs/ARCHITECTURE.md:498`

**What:** There are no module north stars, `docs/*/architecture/` planning
trees, or `modules/` planning directories. Architecture also states that no
other architecture document exists in the index.

**Disposition:** Informational. The full cascading review therefore consists of
one system pass and zero module passes.

## Ordinary-Projection Contract Verification

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Registration without observation remains ordinary. | `src/application/register-session.ts` and registration tests | Consistent. A new registration stores `mode: ordinary`, registration evidence, and inferred confidence. |
| Every visible ordinary record is diagnostic before health, attention, or activity. | `src/domain/projection.ts`, domain and board tests | Consistent. Projection appends exact `session is not managed` and short-circuits to `? diagnostic` before all managed-state branches. |
| Titles and board rows share the same policy. | `src/application/render-title.ts`, `src/application/list-sessions.ts`, registration/board/E2E tests | Consistent. Both consume `projectSession`; the board no longer duplicates the ordinary-mode diagnostic. |
| Managed launch unlocks the five canonical glyphs. | `src/application/launch-managed-codex.ts`, lifecycle tests, packaged golden journey | Consistent. The managed launcher changes the mode to `managed`; ordinary registration alone never claims `○`, `●`, `✓`, `!`, or `×`. |
| Source docs and delivery record state the same invariant. | `README.md`, `docs/SPEC.md`, `docs/ARCHITECTURE.md`, transition/projection feature, active repair story | Consistent. All describe registration as distinct from managed observation and use the exact operator diagnostic. |

Fresh verification completed successfully:

- `npm run typecheck`
- `npm run build`
- `npm test`: **183 tests**, **181 passing**, **0 failing**, **2 opt-in live probes skipped**

## Clean Areas

- The committed README, specification, architecture, and completed projection
  feature agree with the shared implementation and regressions: ordinary mode
  always projects `? diagnostic` with `session is not managed`.
- Managed app-server plus remote TUI remains the V1 default everywhere current
  truth describes it; the five canonical glyphs require managed observation.
- Vision and principles remain aligned with the repair: inference never
  masquerades as native state, and title/board rendering has one source of truth.
- The two rename concerns are explicitly parked as unverified backlog work. They
  do not make the current configuration guidance false and do not expand this
  repair's delivery scope.
- Stable Board/Ghostty/project identity remains distinct from launcher PID and
  native thread binding across docs, code, and tests.
- Local-first storage, centralized projection, Ghostty stable-ID targeting,
  conservative liveness, completion acknowledgement, and observation-only
  scope remain consistent.
- All four packaged commands named by architecture and operator docs match
  `package.json` and the CLI composition roots.

## Blocking Briefs Status

There is no missing NEXT blocker. The locked V1 architecture remains grounded
by these on-disk artifacts.

| Brief | Supports | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex observation and launcher topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, liveness, and cleanup | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

## DONE Output Verification

No separate phase roadmap exists; delivery state is intentionally owned by
`.work/`. The completed V1 arcs were checked directly.

| Delivery arc | Current status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain contracts, atomic store/lock, transition/projection code and tests | Present; ordinary-projection addendum aligns with the shared repair |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, title code and tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, protocol/process tests, and opt-in probe | Present |
| Swarm attention board | Done | Board query/rendering, acknowledgement/unregister controls, and tests | Present; one Medium ownership-prose finding above |
| Operational readiness | Done | Doctor, packed-artifact harness, golden/failure/chaos journeys, and opt-in probes | Present; one consolidated planned-path finding above |
| Companion terminal configuration | Done | Ghostty/Codex examples, configuration guide, README routing, and validation evidence | Present |
| Ordinary-projection repair | Implementing | Canonical policy change, board deduplication, unit/application/E2E regressions, README/SPEC/architecture alignment | Present and green; normal review/tier transition remains |

The ordinary-projection story is `stage: implementing`, so it is not subject to
the skill's DONE-output enforcement. No done item is missing a runtime
capability or test suite.

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`. There are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates. The remaining indexed campaign components are supporting scaffold
or specialist artifacts without load-bearing `research_method` fields.

## Audit Boundary

This fresh Phase 1–3 cascading audit inspected every current system planning
document discovered from `docs/knowledge-index.yaml`, the superseded historical
checkpoint for conflict only, operator docs and examples, implementation and
test sources, all active/backlog/archive substrate records, blocking research
existence/provenance, generated-index consistency, local links, schema and
decision consistency, staleness, completed outputs, and the full tracked plus
untracked worktree diff. No module planning corpus was discovered.

Only `doc-review-report.md` was overwritten. No source planning document,
generated index, implementation file, test, work item, package file, commit, or
remote state was changed by this audit.
