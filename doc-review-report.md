# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited HEAD:** `3f97bc5` plus the uncommitted terminal-mode restoration worktree
**Documents reviewed:** 6 current system planning documents (6 system + 0 module), plus 1 superseded historical document, 10 indexed research records, `AGENTS.md`, `README.md`, operator examples, implementation, tests, and all 41 current `.work/` records
**Passes run:** 1 fresh full system-level pass; 0 module passes (no module planning corpus exists)
**Issues found:** Critical **0** · High **0** · Medium **0** · Low **4** · Info **1**

## Mechanical Exit Gate

**PASS — Critical = 0 and High = 0.**

The prior terminal-capture High and regression-evidence Medium are resolved.
This freshly dispatched full audit found no Critical or High issue, so the
mechanical exit condition is satisfied. No Critical/High auto-fix iteration or
additional re-audit is required.

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
  has a non-empty description, project-supported type, updated date, and project
  metadata. The two focused decision briefs declare `/research`; the locked
  prior-art parent declares `/scout`.
- All local Markdown links in the planning and operator corpus resolve. Both
  completed runtime briefs, the prior-art parent, and the two operator
  configuration examples exist on disk. Every archive-stub `git_ref` resolves
  to a commit.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (0)

None.

### Low (4)

#### Generated navigator has stale substrate counts

**Files:** `docs/knowledge-index-nav.yaml:15` and `.work/`

**What:** The generated navigator reports 6 active stories, 8 backlog records,
and 6 archive stubs. The current worktree contains 7 active stories, 7 backlog
records, and 7 archive stubs. Planning and research document discovery remains
correct; only the passive substrate snapshot is stale.

**Fix:** Regenerate the knowledge index after the terminal-mode story reaches
its final tier so all three derived layers record the settled substrate counts.

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
This is visual substrate hygiene rather than a missing capability.

**Fix:** In a substrate-hygiene pass, verify each criterion against its existing
implementation/review evidence and check the satisfied boxes. Do not reopen or
redesign the completed features merely to normalize their metadata.

#### Active repair story records an outdated suite count

**Files:** `.work/active/stories/story-fix-terminal-mode-restoration.md:57`

**What:** The implementation note records 175 passing tests with 2 opt-in probes
skipped. The fresh full audit run reports 182 tests: 180 passing, 0 failing, and
2 opt-in probes skipped. The implementation and regressions are green; only the
durable evidence count is stale.

**Fix:** Record the final verification count before advancing the story to
review.

#### Completed packaged-E2E design retains one obsolete planned path

**Files:**
`.work/active/features/epic-operational-readiness-packaged-e2e.md:107`

**What:** Unit 1 still names `tests/e2e/support/scenario.ts`, but that file does
not exist. The feature's final implementation notes name only
`package-harness.ts`, executable fixtures, and the packaged suites, all of which
exist and pass. Scenario support was consolidated during implementation, leaving
the planned path stale rather than the capability absent.

**Fix:** Remove the obsolete path or annotate its consolidation into the final
harness when performing substrate hygiene.

### Info (1)

#### No separate roadmap or module planning corpus

**Files:** `docs/research-plan.md`, `.work/`, and
`.work/backlog/roadmap-deferred-product-horizon.md`

**What:** Delivery status is intentionally owned by `.work/`; the research plan
owns completed and deferred research, and the backlog preserves non-binding
future product options. No current planning document claims a separate phase
roadmap exists, and no module planning surface exists.

**Disposition:** Informational. No NEXT-phase blocker is hidden by this shape.

## Terminal-Mode Restoration Re-Audit

| Contract | Evidence inspected | Result |
| --- | --- | --- |
| Non-terminal stdin is the only silent capture skip. | `src/integrations/terminal-mode.ts`, CLI composition, and adapter regression | Consistent. A non-TTY returns no snapshot without invoking `/bin/stty`. |
| A real TTY either captures successfully or fails before launch. | Terminal adapter, `runAgentCodexWithSignals`, architecture, README, and capture-failure regressions | Consistent. Spawn, nonzero, missing, empty, oversized, or malformed capture fails visibly; the CLI returns 1 before calling the managed launcher. |
| Capture and restore remain exact and shell-free. | Terminal adapter and exact argv/stdio regression | Consistent. `/bin/stty -g` uses the controlling terminal and the validated opaque snapshot is reapplied as one argv value with `shell:false`. |
| Restoration runs after every managed return/throw path once a snapshot exists. | Signal-aware CLI, supervised-launcher delivery record, and CLI regressions | Consistent. Thrown launch failure and returned managed outcome both restore from `finally` after managed cleanup and listener removal. |
| Restore failure does not replace the managed result. | CLI implementation, restore-failure regression, README, and architecture | Consistent. The original exit code remains authoritative and stderr supplies `reset` recovery guidance. |
| Blanket terminal defaults are never imposed. | Adapter source, architecture, delivery record, and README | Consistent. Production code never invokes `stty sane`; that command remains operator-only fallback guidance. |

Fresh verification during this re-audit completed successfully: `npm run
typecheck`; package build; and `npm test` with **182 tests**, **180 passing**, **0
failing**, and **2 opt-in integration probes skipped**.

## Clean Areas

- The prior capture-failure gap is closed in source, tests, architecture,
  operator guidance, and delivery evidence.
- Vision, principles, specification, and architecture retain clear ownership:
  product outcome and guardrails remain separate from behavioral and process
  contracts, with one projection policy rather than duplicated renderer state.
- Stable Board/Ghostty/project identity remains consistently distinguished from
  launcher-owned PID and native thread metadata across planning docs, source,
  and tests.
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

No phase roadmap exists, so there are no phase-specific DONE declarations to
verify. The `.work/` delivery arcs supporting the completed V1 claim were
checked directly.

| Delivery arc | Current status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | Domain contracts, atomic store/lock, transition/projection code and tests | Present |
| Ghostty project surface | Done | AppleScript client/protocol/diagnostics, registration, reconciliation, title code and tests | Present |
| Managed Codex observation | Done | App-server client, lifecycle/thread binding, launcher, protocol/process tests, and opt-in probe | Present |
| Swarm attention board | Done | Board query/rendering, acknowledgement/unregister controls, and tests | Present |
| Operational readiness | Done | Doctor, packed-artifact harness, golden/failure/chaos journeys, and opt-in probes | Present |
| Companion terminal configuration | Done | Ghostty/Codex examples, configuration guide, README routing, and validation evidence | Present |
| Terminal-mode restoration repair | Implementing | Exact-mode adapter, CLI integration, capture/restore/managed-outcome regressions, architecture and README updates | Present and aligned; story review/archival remains normal delivery state |

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`. There are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates.

## Audit Boundary

This fresh Phase 1–3 cascading re-audit inspected every current system planning
document discovered from `docs/knowledge-index.yaml`, the superseded historical
checkpoint for conflict only, operator docs and examples, implementation and
test sources, all active/backlog/archive substrate records, blocking research
and attestation existence/provenance, generated-index consistency, local links,
schemas, decisions, staleness, completed outputs, and the full tracked plus
untracked worktree diff. No module planning corpus was discovered, so no module
pass applied.

Only `doc-review-report.md` was overwritten. No source planning document,
generated index, implementation file, work item, package file, commit, or remote
state was changed by this audit.
