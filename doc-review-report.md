# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-16
**Audited revision:** `eefcac5` (after gate-tests `f7273bc` and gate-cruft `eefcac5`)
**System planning docs reviewed:** 6
**Module docs reviewed:** 0 across 0 discovered modules
**Planning frontmatter compliance:** 6/6
**Passes run:** 1 system-level pass; no module passes were applicable
**Issues found:** Critical 1, High 1, Medium 5, Low 0, Info 0
**Mechanical exit gate (Critical=0 and High=0): FAIL**

This was a findings-only Phase 1-3 audit. Phase 4 auto-fixes, the iterative
re-audit loop, and Phase 5 knowledge-index regeneration were deliberately not
run. No tests or builds were run; code and test reality were checked through
read-only inspection of the current files and existing durable evidence.

## Scope audited

- Indexed current planning docs: `docs/VISION.md`, `docs/SPEC.md`,
  `docs/ARCHITECTURE.md`, `docs/PRINCIPLES.md`, `docs/research-plan.md`, and
  `docs/configuration.md`.
- Operator and project rules: `README.md`, `AGENTS.md`,
  `.agents/rules/agile-workflow.md`, and `.work/CONVENTIONS.md`.
- Historical context: `docs/project-brief.md` and `MIGRATION_REPORT.md`.
- Generated knowledge layers: `docs/knowledge-index-nav.yaml`,
  `docs/knowledge-index.yaml`, and `docs/knowledge-index-detail.yaml`.
- Research prerequisites and verification: the prior-art campaign, both focused
  runtime briefs, their verification records, cited attestations, and local
  captures under `.research/`.
- Current implementation and test inventory: `package.json`, all tracked files
  under `src/`, all tracked files under `tests/`, and both copyable examples.
- Delivery substrate: all active epics/features/stories, all backlog notes/items,
  all 14 archive stubs and their historical `git_ref` bodies, and all 56 items
  emitted by gate-tests/gate-cruft.
- Local references: every tracked Markdown path link and Markdown anchor, plus
  exact artifact paths declared by done active work items.

## Phase 1 inventory

The knowledge index contains six current system-level planning documents and no
module-specific planning documents. A scan found no `docs/*/architecture/`
planning sets and no `modules/` tree, so a module pass would invent a boundary
the repository does not have.

All six planning docs have non-empty `description`, project-valid `type`, and
current `updated` fields. Their dates are not stale. `research_method` is not
required on these planning types. The historical project brief is explicitly
superseded by `docs/VISION.md` and is indexed as historical rather than current.

## Pass 1: System-level findings

### Critical (1)

#### A done packaged-E2E feature still declares an output file that does not exist

**Files:** `.work/active/features/epic-operational-readiness-packaged-e2e.md`;
`tests/e2e/support/`

**What:** The done feature's Unit 1 file contract names
`tests/e2e/support/scenario.ts`. That file is absent from the current tree and
has no history at the audited revision. The implemented support files are
`tests/e2e/support/package-harness.ts` and `tests/e2e/support/board.ts`.
The feature's implementation notes list the actual files changed but do not
record that the planned `scenario.ts` responsibility was consolidated or
removed. Under the doc-review DONE-output rule, a done item that still names a
missing expected file is mechanically Critical even when equivalent behavior
appears to have been consolidated elsewhere.

**Fix:** Amend the feature body to record the actual implementation discrepancy
and remove or replace the stale `scenario.ts` declaration. Do not create a
ceremonial helper if `package-harness.ts` already owns the responsibility.

### High (1)

#### The locked persisted-session schema uses field names that the store rejects

**Files:** `docs/ARCHITECTURE.md`; `docs/SPEC.md`; `src/domain/session.ts`;
`src/infrastructure/session-files.ts`

**What:** The locked architecture introduces the block as the validated record
stored in each state file, but documents snake_case keys such as
`schema_version`, `session_id`, `project_label`, `native_thread_id`,
`completion_observed_at`, and `evidence_kind`. The strict Zod schema and the JSON
writer use camelCase keys (`schemaVersion`, `sessionId`, `projectLabel`,
`nativeThreadId`, `completionObservedAt`, and `evidenceKind`). `docs/SPEC.md`
repeats much of the snake_case vocabulary. A builder or diagnostic tool following
the locked document would produce records that the current application rejects.

**Fix:** Make the architecture's persisted-record block reproduce the actual
camelCase schema exactly. If the SPEC block is intentionally conceptual, label
it as such and link to the exact persisted schema rather than presenting two
unqualified naming conventions.

### Medium (5)

#### The auto-loaded navigator omits all newly emitted gate work

**Files:** `docs/knowledge-index-nav.yaml`; `.work/active/stories/`;
`.work/backlog/`

**What:** The navigator reports 8 active stories and 6 backlog entries. The
current substrate contains 63 active stories and 8 backlog entries. The delta
includes 55 active gate findings and one backlog gate finding from `f7273bc` and
`eefcac5`; the navigator's generated timestamp predates those commits. Epic,
feature, and archive counts remain accurate. Because this file is auto-loaded
for session orientation, the stale summary hides the quality-checkpoint queue.

**Fix:** Regenerate all knowledge-index layers after the checkpoint's work-item
emission. Do not hand-edit the derived navigator.

#### The generated full index silently changes source research types

**Files:** `docs/knowledge-index.yaml`;
`.research/analysis/briefs/codex-detector-topology.md`;
`.research/analysis/briefs/ghostty-registration-liveness.md`;
`.research/analysis/campaigns/agent-board-prior-art/parent.md`

**What:** The generated index says `generated_from: frontmatter` and says
frontmatter is the source of truth, but it changes both focused briefs from
source `type: technical-brief` to indexed `type: brief`, and the Scout parent
from source `type: landscape` to indexed `type: campaign`. This may be intended
taxonomy normalization, but the generated artifact does not label it as such;
exact-type consumers cannot tell source metadata from a normalized class.

**Fix:** Preserve the source type, or emit separate source and normalized type
fields and document which one consumers should filter.

#### The locked architecture describes implementation mechanisms that are absent

**Files:** `docs/ARCHITECTURE.md`; `src/domain/registries.ts`;
`src/domain/projection.ts`; `src/integrations/codex/lifecycle.ts`;
`src/cli/agent-board.ts`; `src/integrations/ghostty/diagnostics.ts`

**What:** Several present-tense implementation descriptions have drifted:

- `registries.ts` contains enum/value registries only; native event mappings,
  glyphs, precedence, and freshness are split across lifecycle, projection, and
  composition modules rather than defined in that registry "in one place".
- CLI parsing is handwritten; `node:util.parseArgs` is not used.
- Zod validates domain/Codex JSON boundaries, but CLI grammar, Ghostty config,
  and AppleScript protocol output are manually validated rather than Zod-backed.
- No opt-in structured debug-logging surface exists, while the architecture says
  it is available.
- `agent-board doctor` version-gates Codex `0.147.x`; it does not itself inspect
  the generated protocol shapes, despite the independent-command description
  calling this a protocol-compatibility check.

**Fix:** Update the locked architecture to describe the actual ownership and
current mechanisms, or implement a deliberately chosen missing mechanism only
when it is still a real requirement.

#### The testing-strategy section claims coverage that the test gate says is absent

**Files:** `docs/ARCHITECTURE.md`;
`.work/active/stories/gate-tests-stale-lock-takeover.md`;
`.work/active/stories/gate-tests-packaged-idle-error-title-parity.md`;
`tests/infrastructure/file-lock.test.ts`; `tests/e2e/packaged-golden.test.ts`;
`tests/e2e/packaged-failure.test.ts`

**What:** The locked architecture says store tests cover stale-lock recovery and
the packed E2E suite proves title/board parity through error. The fresh test gate
records that no test proves abandoned stale-lock takeover and that packed tests
do not assert the external title for idle or error outcomes. These are current
coverage gaps, not missing production files, but the architecture states them as
already-covered facts.

**Fix:** Until the emitted High test items are drained, phrase these as required
coverage rather than completed coverage. After implementation, restore factual
present-tense wording only when the named assertions exist.

#### Work-item frontmatter does not match the project-declared substrate schema

**Files:** `AGENTS.md`; typed Markdown items under `.work/active/`,
`.work/backlog/`, and `.work/archive/`

**What:** `AGENTS.md` declares `research_refs` and `research_origin` among the
work-item frontmatter fields, and the retained build process directs agents to
read an item's cited `research_refs`. None of the 98 typed work items currently
contains either field, including the 56 newly emitted gate items. Relevant
completed epics and features cite research paths in prose, and those paths all
exist, but the durable machine-readable linkage promised by the project rules is
absent.

**Fix:** Either backfill the declared fields (using empty/null values where no
research applies and real paths where the body already cites grounding) or amend
the project rule to state accurately when those fields are optional. Preserve
body citations as human-readable context.

### Low (0)

No Low findings.

### Info (0)

No Info findings.

## Module passes

No module-level north star or architecture set was discovered. The source tree
is a single modular monolith described by the system architecture, so no module
pass was applicable.

## Clean areas

- The planning set, README, code, and tests agree on the principal V1 topology:
  managed Codex app-server plus remote TUI, Ghostty 1.3+ AppleScript targeting,
  ordinary registration remaining diagnostic, and no semantic agent-control
  commands.
- The README command grammar, four package binaries, Node/Codex/Ghostty support
  boundaries, state-root behavior, rename targeting, acknowledgement,
  unregister, static `agents` snapshot, terminal restoration guidance, and
  current limits match the inspected code.
- Every source/test path in the architecture module inventory exists; no module
  directory is silently omitted by the documented modular-monolith boundary.
- All tracked Markdown local path links and Markdown anchors resolve.
- All body-level `.research/` paths cited by work items resolve.
- All 14 archive stubs contain a resolvable `git_ref`; each referenced commit
  contains the full historical item at its pre-archive path.
- The prior-art Scout and both focused runtime engagements are present and end
  in APPROVED verification evidence.
- Deferred daemon, adapters, navigation, GUI, remote, and hardware directions
  remain represented in the backlog without being described as V1 runtime scope.

## Blocking briefs status

| Brief | Blocks | Exists on disk? | Verification status |
|---|---|---:|---|
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundation scope and architecture direction | Yes | Locked; campaign verdict APPROVED |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex topology and compatibility boundary | Yes | Locked; focused verification APPROVED |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, and liveness contract | Yes | Locked; focused verification APPROVED |

There is no missing NEXT-phase blocking brief.

## DONE-claim verification

| Area | Current status | Artifact/result check |
|---|---|---|
| 5 active epics | `done` | Expected source/test module families exist; review and verification evidence is recorded |
| 15 active features | `done` | 14 have all exact declared artifact paths; packaged E2E retains the missing `scenario.ts` declaration reported above |
| 8 active non-gate stories | `done` | Named implementation/test artifacts exist and acceptance evidence is recorded |
| 14 archive stubs | `done` | 14/14 `git_ref` values resolve and contain each full pre-archive item |
| Gate-tests findings | 5 implementing, 42 drafting, 1 backlog | Present and internally consistent with the inspected test inventory; they qualify current coverage claims |
| Gate-cruft findings | 8 implementing | Present at current HEAD; no source cleanup has yet been applied |

No done epic or feature is missing its whole source/test output family. The one
Critical result is the exact missing planned helper path, not an absent packaged
E2E subsystem.

## Provenance summary

| `research_method` | Indexed grounded artifacts | Latest updated |
|---|---:|---|
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |
| `/research-program` | 0 | — |
| `/deep-research` | 0 | — |
| `/brief` | 0 | — |
| `hand-written` | 0 | — |
| `migrated` | 0 | — |
| `(missing)` | 0 among the three decision-bearing grounded artifacts | — |

`/research` is the highest tool in the skill's defined fidelity ordering that is
used by the decision-bearing corpus. No lower-tier brief predates a later
higher-tier brief, so there are no refresh candidates. `/scout` is reported
separately because it is the actual provenance of the landscape campaign but is
not assigned a tier by that ordering.

## Final result

- Critical: 1
- High: 1
- Medium: 5
- Low: 0
- Info: 0

**Mechanical exit gate:** FAIL — 1 Critical and 1 High finding remain.
