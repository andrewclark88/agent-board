---
id: story-fix-ghostty-trailing-newlines
kind: story
stage: done
tags: [bug, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Accept Ghostty AppleScript's trailing output terminator

## Symptom

During the first live managed-session test, `agent-codex` reported
`ADAPTER_FAILURE: Ghostty AppleScript failed with exit code 1`. A subsequent
`agents --json` marked the registered terminal `unknown`, and a direct snapshot
probe failed with `Ghostty snapshot row has unknown marker: ""`.

## Root cause

Ghostty's snapshot AppleScript constructs a row string that already ends in a
line feed. `/usr/bin/osascript` then terminates the returned value with another
line feed, so real output ends in `\n\n`. The protocol boundary removes exactly
one trailing line break and interprets the remaining blank line as an unknown
snapshot row. The same assumption affects hierarchy output, which is assembled
with the same trailing-row pattern.

## Fix approach

Normalize all contiguous trailing line terminators at the Ghostty protocol
boundary while preserving strict rejection of blank or malformed rows inside
the payload. Do not loosen field, duplicate-ID, or marker validation.

## Regression test

`tests/integrations/ghostty/protocol.test.ts` passes a production-shaped
snapshot ending in `\n\n` and expects the same strict parsed identities as the
single-terminator fixture. The test failed before the fix with the reproduced
unknown-empty-marker error.

## Implementation notes

- Execution capability: inline focused repair; one parser helper and its stable
  protocol tests fully contain the change.
- Files changed: `src/integrations/ghostty/protocol.ts` and
  `tests/integrations/ghostty/protocol.test.ts`.
- Regression evidence: the production-shaped `\n\n` snapshot failed before the
  fix and passes afterward; hierarchy accepts the same AppleScript terminator
  while an interior blank row remains invalid.
- Full confirmation: focused protocol tests pass, typecheck passes, the full
  suite passes, and a live `GhosttyClient.snapshot()` now returns all three
  visible/enumerable terminals without a protocol error. `agents --json`
  repaired the affected session from `unknown` to `idle`.
- Adjacent issue parked: the original exit-code failure was independently
  reproduced as invalid `perform action ... against term` AppleScript syntax
  and will be repaired as its own focused story.
- Simplification: no new parser mode or lenient row filtering; only contiguous
  output terminators are normalized, preserving strict interior validation.

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none

**Important**: none

**Nits**: none

**Rejected**: none

**Notes**: Bounded inline standalone-story review. The change is limited to
the external protocol terminator boundary, preserves strict interior and field
validation, and is covered by a before-failing regression plus live adapter
confirmation. No independent or cross-model reviewer ran, as required for a
standalone story.
