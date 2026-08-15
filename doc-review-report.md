# Doc Review Report

**Project:** agent-board
**Date:** 2026-08-14
**Review basis:** fresh independent audit after `e852d47` and `a5aeac9`
**Documents reviewed:** 6 current foundation/planning docs, 1 superseded historical concept doc, `AGENTS.md`, `README.md`, `MIGRATION_REPORT.md`, the indexed research corpus, all current source/test surfaces, and the `.work/` substrate
**Module docs:** none discovered; the architecture's source-module map was checked directly against the repository
**Passes run:** 1 system-level pass plus source, test, work-substrate, link, frontmatter, provenance, and blocking-brief audits

## Exit gate

**PASS — 0 Critical, 0 High.**

The prior Critical/High findings are resolved:

- `AGENTS.md` now describes the completed foundation and delivery arc rather
  than routing back to the concept checkpoint.
- The canonical health contract is `live | stale | error`; clean process exit
  remains evidence and is covered by the domain tests.
- `README.md` documents the installed four-command workflow and operational
  phase rather than directing the operator to rerun completed research or
  bootstrap decomposition.

No Critical/High auto-fix loop was required. Per the review request, this pass
does not edit planning or implementation docs; the report is the only artifact
written.

## Findings

### Critical (0)

None.

### High (0)

None.

### Medium (4)

#### M1. Knowledge indexes are stale relative to current docs and substrate

**Files:** `docs/knowledge-index.yaml:40-46`, `docs/knowledge-index-detail.yaml:91-95`, `docs/knowledge-index-nav.yaml:15-24`, `docs/research-plan.md:6-10`, `.work/`

**What:** The source research plan is `status: complete` and says the terminal
V1 arc is implemented and verified, but the generated terse index still says
`status: draft`, the detail index retains the pre-delivery summary, and the
navigator reports the old substrate shape (`active: epic=5, feature=3, story=0;
backlog=1`). A fresh generator run against a read-only copy produced
`active: epic=0, feature=0, story=0; backlog=4` and the current research-plan
summary/status. The stale navigator can misroute a future session.

**Fix:** Regenerate the three knowledge-index layers from the current
frontmatter and substrate after resolving M2.

#### M2. `research-plan` frontmatter uses an unrecognized status

**Files:** `docs/research-plan.md:4-8`

**What:** The source declares `status: complete`. The knowledge-index linter
reports this as a warning because its known foundation-document statuses are
`draft`, `in-progress`, `legacy`, `locked`, and `superseded`; the generated index
therefore does not reliably preserve the source status. This is the metadata
cause of part of M1.

**Fix:** Choose the project’s intended recognized terminal status (for example,
`locked`) or extend the index status vocabulary deliberately, then regenerate
the index. The review did not make that taste/metadata choice autonomously.

#### M3. README overstates forwarding of Codex arguments

**Files:** `README.md:106-107`, `src/integrations/codex/process.ts:97-108,231-237`, `tests/integrations/codex/process.test.ts:36-47`

**What:** README says `agent-codex` “forwards extra Codex arguments unchanged.”
The implementation intentionally rejects topology-owned arguments such as
`--remote`, remote-auth/url variants, `--`, and attempts to override
`tui.terminal_title`, then appends its own `--remote` endpoint and title config.
This is the correct safety behavior, but the user-facing claim is too broad.

**Fix:** Say that supported extra Codex arguments are forwarded unchanged while
Agent Board reserves the remote-transport and terminal-title options, with a
short error/remediation note.

#### M4. Bootstrap report retains an obsolete next step

**Files:** `MIGRATION_REPORT.md:1-9,56-59`, `AGENTS.md:22-34`, `.work/` query via `.work/bin/work-view --scope all`

**What:** The bootstrap report correctly records its historical source shape,
but its unqualified “Next step” still instructs the operator to run
`research-pipeline:epicize` and design the queue. The repository now has a
completed delivery substrate: all 5 epics, 14 features, and 6 stories are
`stage: done`, and the current guidance says the terminal V1 arc is complete.
An operator reading the root report could restart an obsolete phase.

**Fix:** Mark the report explicitly historical or replace the next-step section
with a completed-bootstrap note that points to current `.work/` state.

### Low (1)

#### L1. Architecture summary wording can be clearer about board administration

**Files:** `docs/ARCHITECTURE.md:20`, `docs/ARCHITECTURE.md:100-113`, `docs/SPEC.md:113-128`

**What:** The architecture decision says V1 “exposes observation and naming
only,” while the shipped V1 also exposes `ack` and `unregister`. The surrounding
architecture and specification make the intended distinction—no semantic agent
controls—clear, so this is not a capability contradiction, but the summary can
be read too literally.

**Fix:** Clarify the phrase as “observation, naming, and board administration;
no semantic agent actions.”

### Info (2)

- `docs/project-brief.md` is correctly treated as historical and superseded by
  its frontmatter; its broader daemon/tmux/hardware ideas remain preserved in
  the backlog and current specification.
- `VISION.md`, `SPEC.md`, and `PRINCIPLES.md` remain `status: draft` while the
  architecture is locked and V1 is shipped. This is acceptable if these are
  living product-truth documents rather than release records; no contradiction
  was found.

## System-level consistency checks

### Clean areas

- The five-state projection and orthogonal health/activity/attention/evidence
  model agree across `docs/VISION.md`, `docs/SPEC.md`,
  `docs/ARCHITECTURE.md`, source registries/projection, and tests. There is no
  `health: exited` schema value; clean process exit is evidence.
- The architecture's module map matches the current `src/` tree, including the
  `command-config.ts` executable seam, four composition modules, doctor output,
  and packaged/opt-in test directories.
- The four public npm bins are consistent across `package.json`, README,
  architecture, composition, CLI entry points, and packaged e2e coverage:
  `agent-codex`, `agent-name`, `agents`, and `agent-board`.
- The loopback WebSocket choice is explicitly documented as superseding the
  research brief's provisional Unix-socket recommendation, with the concurrent
  observer/remote-TUI verification rationale and a bounded future simplification
  condition (`docs/ARCHITECTURE.md:57-65`).
- The completed research plan accurately records Scout plus both focused
  engagements, the managed Codex default, Ghostty validation, and deferred
  follow-up entry conditions (`docs/research-plan.md:23-110`).
- README setup, doctor, launcher, board, acknowledgement/unregister, recovery,
  testing, and uninstall instructions match the implemented command surfaces.
  The only command-usage drift found is the reserved-argument overstatement in
  M3.
- Relative Markdown links in the reviewed docs resolve. The canonical absolute
  process references in `AGENTS.md` also exist on disk.
- The source-level completion claims are backed by the substrate: `.work/bin/work-view
  --scope all` reports 5 done epics, 14 done features, 6 done stories, and 4
  intentionally preserved backlog ideas.
- `npm test` completed with 159 passing tests, 0 failures, and 2 intentionally
  skipped opt-in live probes (Codex schema and disposable Ghostty).

## Blocking briefs status

| Brief/artifact | Blocks | Exists on disk? | Status |
|---|---|---:|---|
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | foundation/architecture context | Yes | locked, verified Scout |
| `.research/analysis/briefs/codex-detector-topology.md` | Codex adapter topology | Yes | locked, `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity/title/liveness | Yes | locked, `/research` complete |
| `.research/analysis/briefs/runtime-research-verification.txt` | runtime evidence record | Yes | present verification artifact |

No blocking brief listed by the current foundation or work items is missing.

## DONE phase verification

| Completed arc | Expected surface | Files/tests present? | Result |
|---|---|---:|---|
| Trustworthy session core | domain contracts, projection/transitions, atomic store/locks | Yes | verified |
| Ghostty project surface | AppleScript adapter, registration/naming, title/presence reconciliation | Yes | verified |
| Managed Codex observation | app-server client, lifecycle adapter, supervised launcher | Yes | verified |
| Swarm attention board | board rendering, shared projection, operator controls | Yes | verified |
| Operational readiness | doctor, packaged e2e, operator guide/README | Yes | verified |

All tracked delivery items are done; no DONE item claims an absent source or
test output.

## Research provenance summary

The decision-bearing brief corpus contains:

| `research_method` | Briefs | Latest updated |
|---|---:|---|
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The remaining indexed research files are campaign decomposition/specialist
artifacts or attestations rather than separate decision briefs. There are no
refresh candidates: the lower-tier Scout parent and the higher-tier focused
briefs all carry the same update date, so none satisfies the review rule of
being older than the latest higher-tier brief.

## Fresh audit conclusion

The shipped V1 documentation is substantively aligned with source, tests,
research, and completed work. The exit gate passes mechanically because there
are no Critical or High findings. Before the next autonomous work cycle, resolve
the generated-index drift/status warning (M1/M2), then consider the README
reserved-argument clarification and bootstrap-report archival (M3/M4).
