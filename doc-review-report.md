# Doc Review Report

**Project:** agent-board
**Date:** 2026-08-14
**Review basis:** fresh independent audit after `c754922` and `0567e32`
**Documents reviewed:** 6 current foundation/planning docs, 1 superseded historical concept doc, `AGENTS.md`, `README.md`, `MIGRATION_REPORT.md`, the indexed research corpus, all current source/test surfaces, and the `.work/` substrate
**Module docs:** none discovered; the architecture's source-module map was checked directly against the repository
**Passes run:** 1 complete system-level pass plus source, test, work-substrate, link, frontmatter, provenance, and blocking-brief audits

## Exit gate

**PASS — 0 Critical, 0 High, 0 Medium, 0 Low.**

The fresh audit found no current documentation blockers or material drift. All
five findings from the prior report are resolved:

| Prior finding | Resolution verified |
|---|---|
| M1 — stale knowledge indexes | `docs/knowledge-index.yaml`, `docs/knowledge-index-detail.yaml`, and `docs/knowledge-index-nav.yaml` now reflect current source frontmatter and the complete substrate; a fresh generator comparison differs only in timestamps. |
| M2 — unrecognized research-plan status | `docs/research-plan.md:6` and the generated index now use recognized `status: locked`. |
| M3 — README overstated Codex argument forwarding | `README.md:107-109` now documents supported forwarding and reserved remote/title arguments. |
| M4 — obsolete bootstrap next step | `MIGRATION_REPORT.md:1-4,59-63` now marks the report historical and records the completed outcome. |
| L1 — architecture wording | `docs/ARCHITECTURE.md:20` now explicitly says V1 includes board administration but no semantic agent actions. |

The prior Critical/High findings remain resolved: health is `live | stale |
error` with clean process exit represented as evidence, and README/AGENTS route
operators to the shipped V1 workflow.

## Critical (0)

None.

## High (0)

None.

## Medium (0)

None.

## Low (0)

None.

## Info (2)

- `docs/project-brief.md` is correctly historical and superseded by its
  frontmatter; the old daemon/tmux/hardware ideas remain preserved in the
  backlog and current specification.
- `VISION.md`, `SPEC.md`, and `PRINCIPLES.md` remain living product-truth docs
  with `status: draft`, while the architecture and research plan are locked.
  This is intentional document-role metadata, not a contradiction.

## System-level consistency checks

### Knowledge index and frontmatter

- The committed knowledge indexes are `schema_version: 2` for the terse and
  detail layers, with the navigator at schema version 3.
- A fresh run of the prescribed generator against a read-only project copy
  reported **0 errors and 0 warnings**, 16 indexed documents, and 29 substrate
  items. The generated content matches the committed indexes apart from
  `generated_at` timestamps.
- All 16 indexed docs have the expected index metadata. The historical
  `MIGRATION_REPORT.md` is intentionally a root operational report, not an
  indexable planning document.

### Product and architecture consistency

- The five-state projection and orthogonal health/activity/attention/evidence
  model agree across `docs/VISION.md`, `docs/SPEC.md`,
  `docs/ARCHITECTURE.md`, source registries/projection, and tests. No canonical
  `health: exited` value exists; clean process exit remains evidence.
- The architecture module map matches the current `src/` tree, including the
  command-config seam, four composition modules, doctor output, and packaged
  and opt-in integration test directories.
- The four public npm bins are consistent across `package.json`, README,
  architecture, composition, CLI entry points, and packaged e2e coverage:
  `agent-codex`, `agent-name`, `agents`, and `agent-board`.
- The loopback WebSocket choice is explicitly documented as superseding the
  research brief's provisional Unix-socket recommendation, including the
  concurrent observer/remote-TUI verification rationale and future
  simplification condition (`docs/ARCHITECTURE.md:57-65`).
- The completed research plan accurately records Scout plus both focused
  engagements, the managed Codex default, Ghostty validation, and deferred
  follow-up entry conditions (`docs/research-plan.md:23-110`).
- README setup, doctor, launcher, board, acknowledgement/unregister, recovery,
  testing, and uninstall instructions match the implemented command surfaces.
  Reserved Codex argument behavior is now stated accurately.
- All reviewed relative Markdown links resolve. Canonical absolute process
  references in `AGENTS.md` and all blocking research artifacts exist.

### Delivery and code verification

- `.work/bin/work-view --scope all` reports 5 done epics, 14 done features,
  6 done stories, and 4 intentionally preserved backlog ideas. The navigator's
  active-tier counts correctly include completed active-tier records by design.
- The completed arcs' expected source and test surfaces are present: session
  core, Ghostty project surface, managed Codex observation, swarm board, and
  operational readiness.
- `npm test` completed with 159 passing tests, 0 failures, and 2 explicitly
  skipped opt-in live probes (installed Codex schema and disposable Ghostty).
  The pretest build completed successfully.
- Done work items retain their original design checklists in several bodies,
  but their stage, implementation notes, review records, and verification
  sections provide the authoritative completion evidence; no missing shipped
  output was found.

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

The current documentation corpus is aligned with source, tests, research, and
completed work. The prescribed exit gate passes with zero Critical, High,
Medium, or Low findings. No planning or implementation docs were edited during
this review; only this report artifact was updated.
