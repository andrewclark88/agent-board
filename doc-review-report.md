# Doc Review Report

- **Project:** Agent Board
- **Date:** 2026-08-16
- **Audited revision:** `8af1f4b78c17f7a790b445c168d72fc85b546245`
- **Reviewer model:** GPT-5.6 Sol; Sol was used because the instructed Sonnet reviewer is unavailable in this harness.
- **System planning docs reviewed:** 6
- **Module docs reviewed:** 0 across 0 discovered modules
- **Planning frontmatter compliance:** 6/6
- **Passes run:** 1 fresh system-level Phase 1-3 pass; no module passes were applicable
- **Issues found:** Critical 0, High 0, Medium 3, Low 0, Info 0
**Mechanical exit gate:** **PASS** (`Critical=0` and `High=0`)

This was the requested read-only Phase 1-3 audit. No Phase 4 fixes or Phase 5
regeneration were performed. The only changed file is this report. Per the
delegation boundary, no build or test command was run and no subagent or
peeragent was used.

## Phase 1 inventory and frontmatter

The current system planning set is:

1. `docs/VISION.md` (`north-star`)
2. `docs/SPEC.md` (`spec`)
3. `docs/ARCHITECTURE.md` (`architecture`)
4. `docs/PRINCIPLES.md` (`principles`)
5. `docs/research-plan.md` (`research-plan`)
6. `docs/configuration.md` (`design`)

All six have non-empty `description`, project-valid `type`, current `updated`
dates, and the required planning metadata. `research_method` is not required on
these planning types. The superseded `docs/project-brief.md` also has compliant
historical frontmatter and points to `docs/VISION.md`; it is not counted as a
current planning document.

Dynamic discovery found no `docs/*/architecture/` planning set, no `modules/`
tree, and no non-system current north star. The source tree is the modular
monolith described by the system architecture, so no module pass was
applicable.

The regenerated knowledge layers currently agree on 17 indexed documents:
6 planning, 10 research, and 1 historical. The navigator's substrate summary
also matches disk exactly: 5 active epics, 15 active features, 68 active
stories, 8 backlog files, 16 archive stubs, and 0 releases. The pattern digest,
pattern skill, and pattern directory each expose the same 7 patterns.

## Severity summary

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 0 |
| Info | 0 |

No Critical or High finding remains. Medium findings are reported for manual
disposition and do not trigger another pass.

## Pass 1: System-level findings

### Critical (0)

No Critical findings.

### High (0)

No High findings.

### Medium (3)

#### 1. The generated full index silently normalizes source research types

**Files:** `docs/knowledge-index.yaml:66-104`;
`.research/analysis/briefs/codex-detector-topology.md:1-17`;
`.research/analysis/briefs/ghostty-registration-liveness.md:1-17`;
`.research/analysis/campaigns/agent-board-prior-art/parent.md:1-18`

**What:** The full index says it is generated from frontmatter and that
frontmatter is the source of truth, but it emits the two focused briefs as
`type: brief` although their source type is `technical-brief`, and emits the
Scout parent as `type: campaign` although its source type is `landscape`. The
latest regeneration retained this behavior. It may be intentional taxonomy
normalization, but the artifact does not distinguish normalized type from
source type, so exact-type consumers cannot tell which value was authored.

**Fix:** Preserve the source type, or emit separate source and normalized type
fields and document which one consumers should filter. This is semantic index
hygiene; current blocker paths, provenance, and navigation are unaffected.

#### 2. The locked architecture still describes mechanisms that are not implemented

**Files:** `docs/ARCHITECTURE.md:155-157`, `:169-173`, `:320-323`,
`:443-469`; `src/domain/registries.ts:1-13`; `src/domain/projection.ts`;
`src/integrations/codex/lifecycle.ts`; `src/cli/agent-board.ts:26-64`;
`src/integrations/ghostty/diagnostics.ts:29-51`;
`src/application/doctor.ts:109-126`;
`src/integrations/codex/compatibility.ts:1-48`

**What:** Several present-tense implementation claims remain broader than the
code:

- `registries.ts` owns enum/value registries only. Native event mappings,
  glyphs, precedence, and freshness live in lifecycle/projection/composition
  modules rather than in the registry "in one place."
- The CLI parsers are small handwritten functions; `node:util.parseArgs` is not
  used.
- Zod validates the domain and Codex JSON boundaries, but CLI grammar, Ghostty
  config, and AppleScript protocol output are manually validated rather than
  Zod-backed.
- No opt-in structured debug-logging surface exists, although the architecture
  describes one as a current convention.
- `agent-board doctor` version-gates Codex `0.147.x`; the generated-protocol
  shape checks live in the separate opt-in installed Codex integration probe,
  not in doctor itself.

**Fix:** Narrow the locked architecture to the actual ownership and mechanisms,
or deliberately implement any mechanism that remains a real requirement. The
runtime behavior described elsewhere remains coherent; this finding concerns
implementation-description precision.

#### 3. Work-item frontmatter does not match the project-declared substrate field set

**Files:** `AGENTS.md:58-63`; typed Markdown under `.work/active/`,
`.work/backlog/`, and `.work/archive/`

**What:** `AGENTS.md` lists `research_refs` and `research_origin` as work-item
frontmatter fields. There are 105 typed work items at current HEAD, and none
declares either field. Relevant epics and features cite their research inputs
in prose and those paths exist, but the machine-readable linkage promised by
the project rule is absent.

**Fix:** Either backfill optional/empty fields plus real references where
grounding exists, or clarify in `AGENTS.md` and the substrate schema when the
fields are optional. Preserve the existing prose citations as human-readable
context.

### Low (0)

No Low findings.

### Info (0)

No Info findings.

## Clean areas

- `docs/SPEC.md:184-189` now explicitly defines its domain tables as
  conceptual terminology, not serialized JSON. The exact Architecture record
  uses camelCase and matches the strict `src/domain/session.ts:85-135` schema,
  including `schemaVersion`, `sessionId`, `projectLabel`, `nativeThreadId`,
  `launcherPid`, `completionObservedAt`, and `evidenceKind`.
- The done packaged-E2E feature names the actual support files
  `tests/e2e/support/package-harness.ts` and `tests/e2e/support/board.ts`, assigns
  scenario ownership explicitly, and says there is no separate scenario
  artifact. Both files exist and `tests/e2e/support/scenario.ts` is absent as
  intended.
- `package.json:12-17` exposes exactly four binaries: `agent-name`,
  `agent-codex`, `agents`, and `agent-board`. README and Architecture use the
  same count and names.
- The five regression gaps are represented in current tests: malformed and
  mismatched Codex thread repair (`tests/integrations/codex/client.test.ts:82`),
  four post-server startup cleanup failures
  (`tests/application/launch-managed-codex.test.ts:114-186`), packed idle/error
  title parity (`tests/e2e/packaged-golden.test.ts:36-41` and
  `tests/e2e/packaged-failure.test.ts:46-50`), real controlling-PTY restoration
  (`tests/integration/terminal-restoration.test.ts:36-100`), and crash-stale lock
  takeover (`tests/infrastructure/file-lock.test.ts:39-99`).
- All eight cruft stories are `done`, and inspection confirms the named unused
  imports are absent while the retained imports remain in use.
- The two newly completed aggregate features are reviewed and archived as
  Git-backed stubs. `feature-adjudicate-acceptance-format-findings` resolves at
  `d1e5ed7`; `feature-align-shared-port-composition-overrides` resolves at
  `f9630c8`. Both historical bodies contain an Approve verdict. Their archive
  transitions are `f02675c` and `2390370` respectively.
- All 16 archive stubs have a resolvable `git_ref`, and each reference contains
  its full pre-archive item body at the expected active path.
- The current pattern digest and all seven detailed pattern documents agree
  with the inspected implementation boundaries, including shared capability
  ports, per-binary composition roots, guarded mutation, latest durable title
  projection, full terminal identity, bounded shell-free execution, and the
  packed scenario harness.
- All 29 tracked local Markdown links outside the prior report resolve; the one
  local anchor reference resolves to the configuration guide's
  `Title ownership and rename shortcut` heading. Current literal source/test/doc
  paths named by planning and done-delivery records exist. The only apparent
  missing path in the documentation-repair story is its deliberate reference
  to the removed/nonexistent `scenario.ts` claim.
- README, foundation docs, code, and tests agree on the principal V1 topology:
  managed Codex app-server plus remote TUI, Ghostty 1.3+ AppleScript targeting,
  ordinary registration remaining diagnostic, no resident daemon, and no
  semantic agent-control commands.
- The previously stale test-strategy claims are now backed by the five landed
  regression tests. The regenerated navigator now includes all drained quality
  work and matches the current substrate totals.

## Blocking research and phase verification

| Artifact | Decision blocked | Exists | Provenance / verification |
|---|---|---:|---|
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundation scope and architecture direction | Yes | `/scout`; locked; campaign verdict APPROVED |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex topology and compatibility boundary | Yes | `/research`; locked; focused runtime verification APPROVED |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title, and liveness contract | Yes | `/research`; locked; focused runtime verification APPROVED |

No blocking brief is missing. `docs/research-plan.md` consistently says Scout
and both pre-architecture runtime engagements are complete, managed app-server
plus remote TUI is accepted, and future research remains entry-condition based.
The briefs were not structurally re-reviewed; only existence, named blocker
role, provenance, and recorded verification were checked.

## DONE and substrate verification

| Surface | Current state | Verification |
|---|---|---|
| Active epics | 5/5 `done` | Expected source/test module families exist; completion and review evidence is recorded |
| Active features | 15/15 `done` | Named delivery surfaces exist, including corrected packaged-E2E ownership |
| Active stories | 68/68 `done` | Includes the five regression gaps, eight cruft cleanups, pattern alignment, acceptance adjudication children, and documentation repair |
| Archive | 16/16 `done` stubs | Every `git_ref` resolves to the complete historical body |
| Review queue | Empty | `work-view --stage review` returned no items |
| Backlog | 8 files | Deferred product ideas plus one low test-quality story; no file is presented as current V1 scope |
| Releases | 0 | Consistent with tag-based mapping and the absence of a released-version claim |

The terminal V1 delivery-arc claim in `AGENTS.md` is supported by the done
dependency graph, four packaged binaries, current source/test families,
packaged E2E artifacts, operator doctor, and recorded review evidence. No done
epic or feature is missing its expected output family.

## Provenance summary

| `research_method` | Decision-bearing artifacts | Latest updated |
|---|---:|---|
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |
| `/research-program` | 0 | — |
| `/deep-research` | 0 | — |
| `/brief` | 0 | — |
| `hand-written` | 0 | — |
| `migrated` | 0 | — |
| `(missing)` | 0 among the three decision-bearing blocker artifacts | — |

`/research` is the highest method present from doc-review's defined fidelity
ordering. `/scout` is reported separately because it is the actual landscape
provenance but is not assigned a tier by that ordering. There are no lower-tier
briefs predating a later higher-tier brief, so there are no refresh candidates.

## Commands and read-only checks

- Confirmed revision and clean pre-report worktree with `git rev-parse`,
  `git status --short`, and recent `git log`/`git show` inspection.
- Enumerated tracked and hidden project files with `rg --files` and dynamic
  module scans with `find`/`rg`.
- Read the complete project `AGENTS.md`, `.work/CONVENTIONS.md`, every
  `.agents/rules/*.md`, the project pattern skill and all seven pattern
  references, all three knowledge-index layers, all current planning docs,
  `README.md`, `package.json`, and relevant current/historical work records.
- Queried substrate state with `.work/bin/work-view --ready`, `--blocked`,
  `--stage review`, and `--scope all`.
- Checked all 16 archive references with `git cat-file` and inspected the two
  named reviewed feature bodies with `git show`.
- Inspected the current domain schema, persistence, projection, reconciliation,
  managed Codex, Ghostty, CLI, composition, packed-E2E, regression-test, and
  cleanup surfaces directly. No executable test or build was run.
- Counted current knowledge/substrate/pattern/package surfaces from disk and
  compared them with generated index values.
- Scanned tracked Markdown links, anchors, and path-shaped literal references.
- Confirmed the regenerated index set is the current HEAD commit and that its
  derived counts match disk. The reported generator result of 0 lint errors and
  0 warnings was not rerun because regeneration would violate the read-only
  boundary.

## Final gate

- Critical: **0**
- High: **0**
- Medium: **3**
- Low: **0**
- Info: **0**

**Mechanical exit gate: PASS.** No Critical or High issue requires a fix or a
further audit iteration. The three Medium findings are non-blocking manual
hygiene items.
