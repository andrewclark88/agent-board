# Doc Review Report

**Project:** Agent Board
**Date:** 2026-08-15
**Documents reviewed:** 6 system planning documents, 0 module planning documents
**Passes run:** 1 (system-level; no module planning corpus exists)
**Supporting evidence inspected:** `AGENTS.md`, `.agents/rules/agile-workflow.md`, `README.md`, current `.work/` state, the two locked runtime briefs, the prior-art parent, the implementation, and its application/packaged tests.
**Issues found:** Critical **0** · High **0** · Medium **0** · Low **0** · Info **0**

## Exit Gate

**Clean:** Critical = **0** and High = **0**.

## Pass 1: System-Level

### Critical (0)

None.

### High (0)

None.

### Medium (0)

None.

### Low (0)

None.

### Info (0)

None.

## Automatic Missing-Session Cleanup Verification

The new cleanup contract is consistent at every reviewed boundary.

| Contract | Documentation | Implementation and tests | Result |
| --- | --- | --- | --- |
| A valid, application-wide Ghostty snapshot is the sole cleanup authority. | `docs/SPEC.md:137-147`; `docs/ARCHITECTURE.md:106-112,327-334` | `src/application/reconcile-session.ts:235-250` validates one snapshot before per-record processing. | Consistent |
| Only `missing` is pruned and omitted from the same `agents` response. | `docs/SPEC.md:138-141`; `docs/ARCHITECTURE.md:108-110`; `README.md:151-156` | `src/application/reconcile-session.ts:251-255`; `tests/application/list-sessions.test.ts:123-142`; `tests/e2e/packaged-golden.test.ts:84-93`. | Consistent |
| `hidden`/undoable and `unknown` records are retained. | `docs/SPEC.md:141-146`; `docs/ARCHITECTURE.md:110-112,327-334`; `README.md:153-156` | `tests/application/reconcile-session.test.ts:104-124,143-154`. | Consistent |
| A failed removal leaves the diagnostic row and allows a later retry. | `docs/SPEC.md:144-147`; `docs/ARCHITECTURE.md:111-112` | `src/application/reconcile-session.ts:256-263`; `tests/application/reconcile-session.test.ts:127-141`. | Consistent |
| Direct single-session reconciliation remains non-destructive. | `docs/SPEC.md:146-147`; `docs/ARCHITECTURE.md:331-334` | `src/application/reconcile-session.ts:208-224`; `tests/application/reconcile-session.test.ts:90-102`. | Consistent |
| Unregister is exceptional: release an open/hidden tab, troubleshoot, or uninstall; it is not normal `⌘W` cleanup. | `README.md:151-156,202-210,281-294`; `docs/configuration.md:194-204` | `src/application/unregister-session.ts` retains explicit release behavior; cleanup is separately exercised through the board path. | Consistent |

The current feature explicitly keeps refresh cadence out of V1 while preserving
the future refreshing-board direction in its risk note; the existing deferred
horizon separately preserves a daemon, notifications, menu-bar, and
always-on-top dashboard behind evidence-based entry conditions. This is aligned
with `docs/SPEC.md`, `docs/VISION.md`, and
`.work/backlog/roadmap-deferred-product-horizon.md`.

## Clean Areas

- The six current system planning documents have the required non-empty
  frontmatter fields (`description`, `type`, and `updated`), and their
  frontmatter matches `docs/knowledge-index.yaml`. The historical
  `docs/project-brief.md` is explicitly superseded by `docs/VISION.md` and is
  not presented as current product truth.
- No module planning documents were discovered in the knowledge index,
  `docs/`, or a `modules/` tree. A system-only pass is therefore the complete
  cascading review for this repository.
- Product scope is aligned: local-first attention routing, one Ghostty tab per
  Codex session, no tmux, no resident daemon, no semantic agent actions, and
  deferred GUI/remote/hardware surfaces agree across the vision, principles,
  specification, architecture, README, and backlog.
- The four packaged binaries described by the architecture and README are
  present in `package.json` and implemented under `src/cli/`.
- The state and projection contracts agree: versioned atomic JSON session
  records, separate terminal presence and agent state, and a shared board/title
  projection are represented in `docs/ARCHITECTURE.md` and the domain and
  application modules.
- The Ghostty brief's close/undo finding is preserved faithfully: enumerable
  out-of-hierarchy terminals are hidden rather than missing. The Codex brief's
  managed remote-TUI decision, experimental-boundary caution, and ordinary-mode
  degradation remain accurately represented in the current architecture.
- Cross-document Markdown targets in the README, configuration guide, and
  architecture resolve to current files. Example Ghostty and Codex fragments
  exist at the documented paths.
- `docs/knowledge-index.yaml`, `docs/knowledge-index-nav.yaml`, and
  `docs/knowledge-index-detail.yaml` were freshly regenerated at
  `2026-08-15T20:04:11Z`; their only current working-tree delta is the derived
  timestamp and active-feature count for this new feature.

## Blocking Briefs Status

There is no separate roadmap phase document. The research plan identifies the
two completed, decision-bearing runtime engagements; both remain on disk and
match the locked architecture.

| Brief | Supports / blocks | Exists on disk? | Status |
| --- | --- | --- | --- |
| `.research/analysis/briefs/codex-detector-topology.md` | Managed Codex observation and launcher | Yes | Locked; `/research` complete |
| `.research/analysis/briefs/ghostty-registration-liveness.md` | Ghostty identity, title ownership, liveness, and cleanup | Yes | Locked; `/research` complete |
| `.research/analysis/campaigns/agent-board-prior-art/parent.md` | Foundational V1 scope and deferred horizon | Yes | Locked; `/scout` complete |

The automatic-cleanup feature introduces no consequential unresolved external
question: it applies the already-validated Ghostty `visible | hidden | missing |
unknown` liveness contract. No missing blocker exists for the current review
stage.

## DONE Verification

The following delivery arcs are marked `done` in `.work/` and their described
runtime and test surfaces exist. This audit inspected existence and contract
alignment; it did not rerun the test suite because this was a read-only audit.

| Arc | Status | Expected output verified on disk | Result |
| --- | --- | --- | --- |
| Trustworthy session core | Done | `src/domain/`, `src/infrastructure/`, and domain/infrastructure tests | Present |
| Ghostty project surface | Done | `src/integrations/ghostty/`, registration/reconciliation/unregister application modules and tests | Present |
| Managed Codex observation | Done | `src/integrations/codex/`, managed launcher/observer modules and tests | Present |
| Swarm attention board | Done | `src/application/list-sessions.ts`, `src/cli/agents.ts`, composition, and CLI/application tests | Present |
| Operational readiness | Done | doctor command, package harness, packed golden/failure/chaos tests, and opt-in integration probes | Present |
| Automatic missing-session cleanup | **Review** (not claimed done) | batch cleanup code, application tests, and packed golden close/re-read journey | Present and aligned |

## Work-State Consistency

`.work/bin/work-view --stage review` and `--ready` both identify only
`feature-automatic-missing-session-cleanup`. Its `stage: review` accurately
matches its implementation and verification notes; it has not been incorrectly
described as completed. The future refreshing board remains a preserved option,
not an untracked V1 promise.

## Provenance Summary

| research_method | Decision-bearing artifacts | Latest updated |
| --- | ---: | --- |
| `/research` | 2 | 2026-08-14 |
| `/scout` | 1 | 2026-08-14 |

The remaining campaign working artifacts are supporting Agentic Research
records rather than independent decision briefs. The corpus's highest applicable
brief tier is `/research`; there are no lower-tier decision briefs updated
before a newer higher-tier brief, so there are no refresh candidates.

## Audit Boundary

This report is an independent documentation and artifact-consistency audit. It
does not replace the feature's required code review or its recorded test
verification; it confirms that the current documentation truth is aligned with
the implemented cleanup behavior and with the settled Ghostty research
contract.
