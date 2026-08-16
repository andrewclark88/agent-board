---
id: story-fix-unobserved-ordinary-projection
kind: story
stage: done
tags: [bug, state, ui]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Project unobserved ordinary registrations as diagnostic

## Symptom

An already-running ordinary Codex tab was accidentally registered by
`agent-name`. Its title displayed `○ test-tab-rename` and then remained idle
while the agent was visibly working, making an unobserved session look like a
trustworthy managed idle session.

## Root cause

The projection policy adds an inferred-evidence diagnostic but still allows a
visible `mode: ordinary`, `activity: idle`, `health: live` record through the
canonical idle branch. Registration alone therefore claims `○ idle` even
though no lifecycle observer exists.

## Fix approach

Treat every ordinary-mode registration as diagnostic before agent health,
attention, or activity projection. Add `session is not managed` to its
diagnostics and render `? <project-label>`. Managed sessions retain the existing
five-state precedence.

## Regression test

`tests/domain/projection.test.ts` constructs the exact ordinary inferred
registration shape observed in live state and requires diagnostic status,
`? agent-board`, and explicit unmanaged/inferred diagnostics. It fails against
the current `○ idle` projection.

## Implementation notes

- Execution capability: focused local domain-policy repair. The defect was one
  precedence omission in the existing projection source of truth.
- Changed `projectSession` so ordinary mode contributes `session is not
  managed` and resolves to diagnostic before health, attention, and activity.
  Removed the board renderer's redundant ordinary-mode annotation so title and
  board consume the same diagnostic.
- Updated registration, board, reconciliation, and packaged-journey expectations
  so agent-name-only tabs consistently render `?`, while managed idle remains
  `○`.
- Regression evidence: the new exact live-state projection test failed as
  `○ idle` before the fix and passes as `? diagnostic` afterward.
- Original reproduction: after rebuilding, one live `agents` reconciliation
  changed `test-tab-rename` to `? ... diagnostic [session is not managed;
  evidence is inferred]`; the managed `test-tab-name1` session remained `○`
  with its authoritative acknowledgement evidence.
- Verification: `npm run typecheck` and the full hermetic suite pass (181
  passed, 2 opt-in skipped).
- Documentation: commit `2d94a1b` aligns README, SPEC, architecture, and the
  completed projection feature. Commit `4eccdd5` corrects the board feature's
  diagnostic ownership note. The required fresh full-corpus audit passes its
  mechanical gate with 0 Critical and 0 High findings; its one current-scope
  Medium was the now-corrected ownership note.
- Adjacent issues parked separately: `idea-refuse-detached-focus-rename` and
  `idea-fix-hotkey-rename-routing`.

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none

**Important**: none

**Nits**: none

**Rejected**: none

**Notes**: Bounded inline standalone-story review. Correctness follows the
normalized mode boundary: an ordinary registration has no observer and cannot
truthfully project health, attention, or activity, while managed sessions retain
the existing five-state precedence. The regression matches the live record,
shared projection still drives both title and board, the packaged journey proves
ordinary-to-managed promotion, and the full suite plus live reconciliation are
green. No security-sensitive boundary or public schema changed. Documentation
and the fresh full-corpus audit align. No independent or cross-model review was
used, per the standalone-story review contract.
