# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Documents reviewed:** 6 current system planning documents (6 system + 0 module), plus 1 superseded historical document, 10 indexed research records, `AGENTS.md`, `README.md`, examples, code, tests, and current `.work/` evidence
**Passes run:** 1 full system-level pass; 0 module passes (no module planning corpus exists)
**Issues found:** Critical **0** · High **0** · Medium **1** · Low **1** · Info **2**

## Exit Gate

**Clean:** Critical = **0** and High = **0**.

This was the required fresh full audit after the relaunch-binding planning-doc
edits. The first complete pass returned zero Critical and zero High findings,
so no Critical/High auto-fix iteration or follow-up re-audit was required.

## Phase 1: Discovery

- `docs/knowledge-index.yaml` exists and lists 17 paths: 6 current planning
  documents, 10 research records, and 1 explicitly superseded historical
  document. Every indexed path exists.
- Current system planning corpus: `docs/VISION.md`, `docs/PRINCIPLES.md`,
  `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/configuration.md`, and
  `docs/research-plan.md`.
- No module north stars, `docs/*/architecture/` module trees, or `modules/`
  planning directories were found. A module pass has no subject.
- Frontmatter compliance is 6/6 for current planning documents and 17/17 under
  the project's enforced index schema. Each current planning document has a
  non-empty `description`, supported project `type`, `kind`, `status`, and
  `updated` value. Decision-bearing research declares `/research` or `/scout`
  provenance where required.
- All local Markdown links in the reviewed planning/operator corpus resolve.
  Both blocking runtime briefs, the prior-art parent, configuration examples,
  and the managed-runtime attestation exist on disk. All five archive-stub
  `git_ref` values resolve to commits.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (1)

#### Generated knowledge indexes predate the relaunch-binding decisions

**Files:** `docs/knowledge-index.yaml`, `docs/knowledge-index-nav.yaml`,
`docs/knowledge-index-detail.yaml` versus `docs/SPEC.md` and
`docs/ARCHITECTURE.md`

**What:** The current source frontmatter updates `docs/SPEC.md` to 2026-08-16
and adds the stable-session/runtime-binding decision to both `SPEC` and
`ARCHITECTURE`. The full and navigator indexes still report the specification
as updated on 2026-08-15. The detail index omits the new relaunch decision from
both documents' generated `decisions` lists. This is derived-navigation drift,
not a defect in the source planning documents.

**Fix:** Regenerate all three knowledge-index layers from current frontmatter
with the project's knowledge-index workflow. Do not hand-edit generated YAML.

### Low (1)

#### Completed launcher feature notes omit the new launch-claim step

**Files:**
`.work/active/features/epic-managed-codex-observation-supervised-launcher.md`
versus `.work/active/stories/story-fix-managed-relaunch-thread-binding.md`,
`docs/ARCHITECTURE.md`, and `src/application/launch-managed-codex.ts`

**What:** The completed feature's Unit 3 implementation sequence still moves
directly from app-server startup to client connection/observer initialization.
The repaired implementation now inserts a session claim that records the
current launcher PID and removes the prior `nativeThreadId` before connecting
the observer. The active repair story accurately records the correction, so
the stale feature prose does not obscure current product truth or acceptance.

**Fix:** When normal delivery bookkeeping next touches the completed feature,
add the launch-claim step or a short pointer to the relaunch repair story.

### Info (2)

#### No separate roadmap document

**Files:** `docs/research-plan.md`, `.work/`,
`.work/backlog/roadmap-deferred-product-horizon.md`

**What:** Delivery status is intentionally owned by `.work/`; the research plan
owns completed and deferred research, while the backlog preserves non-binding
future product options. No current planning document claims that a separate
phase roadmap exists.

**Disposition:** Informational. No NEXT-phase blocker is hidden by this shape.

#### Terminal-mode restoration remains explicitly outside the relaunch repair

**Files:** `docs/ARCHITECTURE.md`, `docs/SPEC.md`,
`.work/active/stories/story-fix-managed-relaunch-thread-binding.md`,
`.work/backlog/idea-terminal-mode-restoration.md`

**What:** The relaunch contract covers persistent Board/Ghostty/project
identity and replacement of launcher/thread metadata. It does not claim to
restore an arbitrary shell TTY after Agent Board forcibly tears down a failed
remote TUI. The observed Control-C/terminal-mode symptom and immediate
`reset`/`stty sane` recovery are preserved in a dedicated backlog idea.

**Disposition:** Correct scope boundary, not missing current documentation.

## Managed Relaunch Contract Verification

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Board session, Ghostty binding, and project label persist across sequential `agent-codex` launches in the same registered tab. | `docs/SPEC.md`; `docs/ARCHITECTURE.md`; `registerSession`; launch mutation; relaunch regression test. | Consistent. Registration reuses terminal identity and the claim mutation spreads the current record without changing `sessionId`, `identity`, or `terminal`. |
| Every launch owns a short-lived launcher and private app-server/native thread. | Architecture process topology; `launchManagedCodex`; `CodexProcessHost`; active repair story. | Consistent. App-server startup is per invocation, and the native thread is rebound for that managed runtime. |
| The launch claim records the current launcher PID and clears a previous native thread before observer binding. | `src/application/launch-managed-codex.ts`; `src/application/observe-managed-codex.ts`; `tests/application/launch-managed-codex.test.ts`. | Consistent. The store mutation writes `launcherPid: process.pid` and removes `nativeThreadId` before `connectClient`, initialization, and `observeManagedCodex`; the regression test fails without this order and now binds `root` over `previous-thread`. |
| Relaunch does not promise general TTY recovery. | `docs/SPEC.md`; `docs/ARCHITECTURE.md`; terminal-mode backlog item. | Consistent. No planning contract claims shell-mode restoration; that separate observed risk remains deferred. |

Focused executable verification also passed:

- `npm run typecheck`
- `npx tsx --test --test-concurrency=1 tests/application/launch-managed-codex.test.ts`
  (6/6 passing)

## Clean Areas

- Vision, principles, specification, and architecture retain clear ownership:
  product outcome and guardrails are separate from behavioral and process
  contracts, with no duplicated state machine.
- The relaunch additions agree across `SPEC` and `ARCHITECTURE`: persistent
  Board/Ghostty/project identity is distinct from launcher-owned PID and native
  thread metadata.
- The new contract is narrower than terminal recovery, retroactive attachment,
  daemon supervision, or concurrent multi-agent control; none of those are
  implied.
- Managed app-server plus remote TUI remains the V1 default, and ordinary Codex
  remains an explicitly degraded-confidence boundary everywhere current truth
  describes it.
- Local-first storage, centralized projection, Ghostty stable-ID targeting,
  conservative liveness, completion acknowledgement, and observation-only
  scope remain aligned between planning docs and implementation.
- The four binaries named in architecture and operator docs match
  `package.json`, `src/cli/`, and composition roots.
- README/configuration instructions and copyable examples agree on Ghostty
  title ownership and the typed `tui.terminal_title=[]` override.
- All completed V1 delivery arcs have their expected implementation and test
  surfaces on disk. The current relaunch repair story is correctly at review
  with focused and full-suite verification recorded.

## Blocking Briefs Status

There is no NEXT delivery phase naming a missing blocking brief. The locked V1
architecture remains grounded by these on-disk artifacts.

| Brief | Supports | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex observation and launcher topology | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, liveness, and cleanup | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

## DONE Verification

| Delivery arc | Status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain, storage, lock, and transition/projection tests | Present |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, and title tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, protocol/process tests, and opt-in probe | Present |
| Swarm attention board | Done | Board application, CLI renderer, acknowledgement/unregister, and tests | Present |
| Operational readiness | Done | Doctor, packed artifact harness, golden/failure/chaos tests, and opt-in probes | Present |
| Companion terminal configuration | Done | Ghostty/Codex fragments, configuration guide, README routing, and validation record | Present |
| Managed relaunch repair | Review | Stale binding cleared on launcher claim; focused regression and full-suite evidence recorded | Present and consistent |

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`. There are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates.

## Audit Boundary and Provenance

This fresh Phase 1–3 cascading audit inspected all current system planning
documents discovered from `docs/knowledge-index.yaml`, the superseded
historical checkpoint for conflict only, current operator docs and examples,
implementation and focused tests, active/done/backlog/archive substrate state,
blocking research briefs, and derived-index consistency. No module planning
corpus was discovered, so no module pass applied.

The audit used the inherited reviewer capability because the requested
Sonnet-named override was unavailable. It did not modify source planning docs,
generated indexes, code, work items, package files, commits, or remote state;
only this report was replaced.
