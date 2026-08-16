# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Documents reviewed:** 6 current system planning documents (6 system + 0 module), plus 1 superseded historical document, 10 indexed research records, `AGENTS.md`, `README.md`, operator examples, implementation, tests, and current `.work/` evidence
**Passes run:** 1 fresh full system-level pass; 0 module passes (no module planning corpus exists)
**Issues found:** Critical **0** · High **0** · Medium **1** · Low **0** · Info **2**

## Exit Gate

**Clean:** Critical = **0** and High = **0**.

The required fresh full cascading audit returned zero Critical and zero High
findings. The mechanical exit gate is therefore satisfied. No Critical/High
auto-fix iteration or additional re-audit is required.

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
- All local Markdown links in the reviewed planning, operator, and active-work
  corpus resolve. Both blocking runtime briefs, the prior-art parent,
  configuration examples, and the managed-runtime attestation exist on disk.
  All five archive-stub `git_ref` values resolve to commits.

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

**What:** These seven features are at `stage: done`, include implementation and
review evidence, and have their claimed production and test outputs on disk,
but all 83 acceptance-criteria checkboxes in them remain unchecked. Newer done
features use checked criteria, so the older boxes are stale completion metadata
rather than evidence of missing output. They can nevertheless mislead a reader
who inspects the feature body instead of relying only on its stage and review.

**Fix:** In a normal substrate-hygiene pass, verify each criterion against the
existing implementation/review evidence and mark the satisfied boxes checked.
Do not reopen or redesign the completed features merely to normalize their
checkboxes.

### Low (0)

None.

### Info (2)

#### No separate roadmap document

**Files:** `docs/research-plan.md`, `.work/`, and
`.work/backlog/roadmap-deferred-product-horizon.md`

**What:** Delivery status is intentionally owned by `.work/`; the research plan
owns completed and deferred research, while the backlog preserves non-binding
future product options. No current planning document claims that a separate
phase roadmap exists.

**Disposition:** Informational. No NEXT-phase blocker is hidden by this shape.

#### Terminal-mode restoration remains explicitly outside the relaunch repair

**Files:** `docs/ARCHITECTURE.md`, `docs/SPEC.md`,
`.work/active/stories/story-fix-managed-relaunch-thread-binding.md`, and
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
| All generated index layers reflect the current specification date. | `docs/knowledge-index.yaml`, `docs/knowledge-index-nav.yaml`, and `docs/knowledge-index-detail.yaml` | Consistent. Full and navigator layers report `docs/SPEC.md` updated 2026-08-16; all layers share generation time `2026-08-16T18:35:22Z`. |
| Both new relaunch decisions appear in generated detailed knowledge. | `docs/ARCHITECTURE.md`, `docs/SPEC.md`, and `docs/knowledge-index-detail.yaml` | Consistent. The detail index includes both the architecture decision that runtime metadata is replaced and the specification decision that native thread ownership is per launcher/app-server lifetime. |
| Board session, Ghostty binding, and project label persist across sequential `agent-codex` launches in the same registered tab. | Specification and architecture identity sections; `registerSession`; launch claim mutation; relaunch regression test | Consistent. Registration reuses terminal identity, and the launch claim spreads the current record without changing `sessionId`, `identity`, or `terminal`. |
| Every launch owns a short-lived launcher and private app-server/native thread. | Architecture process topology; `launchManagedCodex`; `CodexProcessHost`; active repair story | Consistent. App-server startup is per invocation, while launcher PID and native thread are runtime-owned metadata. |
| The launch claim records the current launcher PID and clears a previous native thread before observer binding. | Launcher feature Unit 3; `src/application/launch-managed-codex.ts`; `src/application/observe-managed-codex.ts`; `tests/application/launch-managed-codex.test.ts` | Consistent. Unit 3 now names the claim explicitly. Production mutation removes `nativeThreadId` and records `process.pid` before client connection, initialization, and observation; the regression test proves the new root replaces `previous-thread`. |
| Relaunch does not promise general TTY recovery. | `docs/SPEC.md`; `docs/ARCHITECTURE.md`; README recovery guidance; terminal-mode backlog item | Consistent. No current planning or operator contract claims shell-mode restoration; the separate observed risk remains deferred. |

No tests were run during this audit. The audit relied on the focused regression
and full-suite evidence already recorded in
`story-fix-managed-relaunch-thread-binding` (focused launch/observer 9/9,
typecheck passing, full suite 172 passing with 2 opt-in skips) and inspected the
corresponding test and production code directly.

## Clean Areas

- Vision, principles, specification, and architecture retain clear ownership:
  product outcome and guardrails are separate from behavioral and process
  contracts, with no duplicated renderer state machine.
- The relaunch additions agree across `SPEC`, `ARCHITECTURE`, the supervised
  launcher feature, the repair story, production source, and regression test.
  Stable Board/Ghostty/project identity is distinct from launcher-owned PID and
  native Codex thread metadata.
- The three generated knowledge-index files are current: `SPEC` is dated
  2026-08-16, both relaunch decisions appear in the detail layer, and navigator
  substrate counts reflect the current active/backlog/archive trees.
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
  title ownership, macOS Services rename setup, and the typed
  `tui.terminal_title=[]` override.
- Every completed V1 delivery arc has its expected implementation and test
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
| Managed relaunch repair | Review | Launch claim clears the stale binding before observer startup; focused regression and full-suite evidence recorded | Present and consistent |

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The highest applicable brief tier is `/research`. There are no lower-tier
decision briefs older than a newer higher-tier run, so there are no refresh
candidates.

## Audit Boundary and Provenance

This fresh Phase 1–3 cascading audit inspected every current system planning
document discovered from `docs/knowledge-index.yaml`, the superseded historical
checkpoint for conflict only, current operator docs and examples,
implementation and focused tests, active/done/review/backlog/archive substrate
state, blocking research briefs, and derived-index consistency. No module
planning corpus was discovered, so no module pass applied.

The audit did not modify source planning docs, generated indexes, code, work
items, package files, commits, or remote state; only this report was replaced.
