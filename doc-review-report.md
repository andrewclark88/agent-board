# Doc Review Report

**Project:** Agent Board

**Date:** 2026-08-27

**Scope:** Independent re-verification of the Codex `0.149.x` → `0.150.x`
supported-family widening (story: `.work/active/stories/story-fix-codex-0-150-compatibility.md`,
stage `review`). This is a fresh, from-scratch audit — not a diff against
the prior report — covering all 6 indexed system planning docs
(`docs/ARCHITECTURE.md`, `docs/configuration.md`, `docs/VISION.md`,
`docs/SPEC.md`, `docs/PRINCIPLES.md`, `docs/research-plan.md`), `README.md`,
`AGENTS.md`, the three knowledge-index layers, the source adapter
(`src/integrations/codex/compatibility.ts` and its consumer
`src/application/doctor.ts`), the regression test
(`tests/integrations/codex/endpoint.test.ts`), the copyable example
(`examples/codex/status-line.toml`), and a repo-wide grep for every remaining
Codex version-string reference to catch drift outside the named files.

**Documents reviewed:** 6 system planning docs + README + AGENTS + 3
knowledge-index layers + code/test/example surfaces. No module-level planning
docs are discoverable in this project (single-module system).

**Passes run:** 1 system-level pass (no modules discovered).

**Issues found:** 0 Critical, 0 High, 0 Medium, 0 Low, 1 Info

**Exit gate: PASS.** 0 Critical, 0 High.

## Pass 1: System-Level

### Critical (0)

None. The prior report's Critical — `docs/ARCHITECTURE.md:610-612` omitting
`0.149.x` from the accepted family — is confirmed fixed on disk. Current text
reads "Codex `0.147.x`, `0.148.x`, `0.149.x`, or `0.150.x`" (lines 610-611),
matching `SUPPORTED_CODEX_FAMILY` in code.

### High (0)

None.

### Medium (0)

None. The prior report's Medium — a stale header comment in
`examples/codex/status-line.toml` — is confirmed fixed on disk. Line 1 now
reads "...on the tested 0.147.x, 0.148.x, 0.149.x, or 0.150.x setup.",
matching `docs/configuration.md:214`.

### Low (0)

None.

### Info (1)

This report supersedes the prior root-level `doc-review-report.md`, which
recorded the audit that found and specified the fixes for the Critical and
Medium findings closed out above.

## Clean Areas

- **Single source of truth holds.** `SUPPORTED_CODEX_MINORS = new Set([147,
  148, 149, 150])` and `SUPPORTED_CODEX_FAMILY = "0.147.x, 0.148.x, 0.149.x,
  or 0.150.x"` (`src/integrations/codex/compatibility.ts:4-5`) are the only
  definitions; `src/application/doctor.ts` consumes `SUPPORTED_CODEX_FAMILY`
  by reference for all three doctor messages (`CODEX_UNAVAILABLE`,
  `CODEX_VERSION_UNSUPPORTED`, `CODEX_VERSION_UNKNOWN`) with no duplicated
  literal family strings in code paths.
- **Regression test matches the code contract.**
  `tests/integrations/codex/endpoint.test.ts:34-42` asserts `0.147.0-0.150.1`
  all compatible and `0.151.0` unsupported — full inclusive boundary coverage
  of the accepted family plus the first excluded minor.
- **All four operator-facing documents agree**, verified independently by
  direct read (not by diff against the prior report):
  - `docs/ARCHITECTURE.md:610-611` — "Codex `0.147.x`, `0.148.x`, `0.149.x`,
    or `0.150.x`"
  - `docs/configuration.md:214` — "tested Codex 0.147.x, 0.148.x, 0.149.x,
    and 0.150.x setups"
  - `README.md:24,316` — "Codex 0.147.x, 0.148.x, 0.149.x, or 0.150.x"
  - `examples/codex/status-line.toml:1` — "tested 0.147.x, 0.148.x, 0.149.x,
    or 0.150.x setup"
- **Repo-wide grep for every `0.14x`/`0.15x` string** (across `.md`, `.ts`,
  `.toml`, `.yaml`, excluding `.research/`) turned up no other stale
  version-family claim. Other hits are either individual test fixture
  versions inside the accepted range (`tests/integrations/codex/process.test.ts`,
  `tests/application/launch-managed-codex.test.ts`, `tests/application/doctor.test.ts`,
  `tests/e2e/packaged-failure.test.ts` — all use in-range sample versions, not
  family statements) or historical `.work/archive/` and `.work/active/`
  substrate items describing scope as of their own creation date (e.g. the
  `0.148.x`-era epic/feature files), which are work-tracking artifacts, not
  planning docs, and are expected to reflect the family known at the time
  they were written.
- **Full test suite is green:** `npm test` → 231 tests, 228 passed, 0 failed,
  3 intentional opt-in skips (fresh run performed for this audit).
- `docs/VISION.md`, `docs/SPEC.md`, `docs/PRINCIPLES.md`, and
  `docs/research-plan.md` make no Codex-version-family claims, so they carry
  no drift risk from this change.
- `AGENTS.md` makes no version-specific Codex claims.
- All six system planning docs carry compliant frontmatter
  (`description`, `type`, `updated`, `status`); no frontmatter findings.
- The three knowledge-index layers (`docs/knowledge-index.yaml`,
  `docs/knowledge-index-nav.yaml`, `docs/knowledge-index-detail.yaml`) were
  regenerated at `generated_at: 2026-08-27T23:43:09Z`, at or after every
  system doc's frontmatter `updated: 2026-08-27` timestamp, and contain no
  Codex version-family statements of their own that could drift (the only
  version-tagged index content is unrelated schema-evidence tags like
  `symmetry-codex-local-schema-0-148-0`, which name a research artifact, not
  a supported-family claim).

## Blocking Briefs Status

Not applicable — this project has no `roadmap.md`; `docs/research-plan.md`
(status: `locked`) records all pre-architecture research as complete with no
open blocking briefs. The Codex `0.149.x`→`0.150.x` widening is a bounded
compatibility repair under the existing narrow-tested-family policy, not a
new architectural decision requiring research.

## DONE Phase Verification

Not applicable — this project tracks delivery through `.work/` substrate
items rather than a phased roadmap. `story-fix-codex-0-150-compatibility` is
at `stage: implementing` (not `done`); the working tree currently holds the
uncommitted fix with zero outstanding Critical/High/Medium/Low doc findings
against it.

## Provenance Summary

The managed-provider topology remains grounded in the locked Codex detector,
Ghostty registration/liveness, and Codex-Claude symmetric-support research
(all `research_method: /research` or `/scout`, all `status: locked`). No new
provenance was fabricated or required for this bounded compatibility repair;
no refresh candidates identified.
