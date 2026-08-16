---
id: story-fix-ghostty-title-action-parameter
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

# Use Ghostty's valid targeted action parameter

## Symptom

The first live `agent-codex` launch failed with
`ADAPTER_FAILURE: Ghostty AppleScript failed with exit code 1`. Directly
invoking the registered tab's title update reproduced exit code 1 with
`syntax error: Expected end of line but found identifier. (-2741)`.

## Root cause

Both title scripts invoke `perform action ... against term`, but Ghostty 1.3.1's
bundled `Ghostty.sdef` declares the target parameter name as `on`. AppleScript
therefore rejects the generated script at compile time before Ghostty can
perform or report the action. The hermetic fake adapter accepted scripts by
action substring and did not validate this parameter grammar.

## Fix approach

Change the set-title and clear-title scripts to `perform action ... on term`,
matching the installed Ghostty dictionary and the already captured runtime
research. Update the opt-in disposable Ghostty probe to use the same valid
grammar. Do not alter title content, terminal targeting, or error mapping.

## Regression test

`tests/integrations/ghostty/client.test.ts` asserts that both exact AppleScript
requests use Ghostty's declared `on term` parameter. It fails before the fix on
the current `against term` scripts. Live confirmation will execute set and
clear against the already registered terminal, followed by the disposable
surface integration probe.

## Implementation notes

- Execution capability: inline focused repair; the bug is two constant
  AppleScript parameter tokens plus their existing boundary tests.
- Files changed: `src/integrations/ghostty/scripts.ts`,
  `tests/integrations/ghostty/client.test.ts`, and
  `tests/integration/disposable-ghostty.test.ts`.
- Regression evidence: the client request test failed before the fix because
  both scripts contained `against term`; both now assert Ghostty's declared
  `on term` grammar.
- Live confirmation: set → clear → restore succeeded against the registered
  tab; `agents --json` returned `titleRendered: true`; the opt-in disposable
  Ghostty test created an isolated window, performed set and clear actions,
  and closed the test window successfully.
- Test-fixture correction: the live probe no longer assumes Ghostty's optional
  terminal `title` property is present and uses Ghostty's explicit `close
  window` command. These were stale probe assumptions exposed after the action
  script first became executable, not product behavior changes.
- Full confirmation: focused client tests, typecheck, full suite, and live
  Ghostty integration test pass.
- Adjacent issues parked: the doctor reports Automation availability but does
  not execute a targeted title action, so it could not catch this shipped
  script defect. Preserve that as a separate diagnostic-hardening item.
- Simplification: no action abstraction or fallback transport was added.

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none

**Important**: none

**Nits**: none

**Rejected**: none

**Notes**: Bounded inline standalone-story review. The implementation matches
the installed Ghostty 1.3.1 dictionary, retains positional argument transport
and terminal-ID targeting, and has unit, full-suite, direct-live, and
disposable-live evidence. The stale integration-probe assertions were narrowed
to the stable action result contract. No independent or cross-model reviewer
ran, as required for a standalone story.
