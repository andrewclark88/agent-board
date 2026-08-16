---
id: story-fix-terminal-mode-restoration
kind: story
stage: review
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Restore the pre-launch terminal mode after managed Codex exits

## Symptom

When Agent Board terminates the remote Codex TUI after an observer failure,
the shell can return with the terminal still in raw mode. Control-C then emits
literal characters instead of interrupting normally until the operator runs
`reset` or `stty sane`.

## Root cause

The managed launcher owns TUI teardown but does not preserve or restore the
controlling terminal's pre-launch mode. A forced child shutdown can therefore
bypass Codex's own terminal cleanup.

## Fix approach

Capture the exact `stty -g` state before managed launch and restore that exact
snapshot in the launcher's `finally` path. If stdin is not a terminal, skip the
operation. Never apply a blanket `stty sane`, because that could overwrite an
operator's intentional settings.

## Regression test

Prove the signal-aware launcher restores the captured state after both a
managed failure and a thrown launch error, without masking the command's exit
status.

## Implementation notes

- Promoted from `idea-terminal-mode-restoration` after the raw-terminal symptom
  recurred during live managed-launch testing.
- Added a small shell-free `SttyTerminalMode` boundary. It captures only when
  stdin is a terminal, bounds and validates the opaque `stty -g` snapshot, and
  reapplies that snapshot as one argv value.
- The signal-aware CLI restores in `finally`, after managed child cleanup and
  listener removal. Restore failure preserves the launcher result and prints
  the `reset` recovery action.
- Regression coverage proves thrown and returned managed failures restore the
  exact captured value, a real-TTY capture failure prevents launch, and a
  restore failure preserves the managed exit code with recovery guidance.
  Adapter tests prove exact argv/stdio, non-terminal skip behavior, and failed
  or malformed capture rejection.
- A disposable tool PTY was changed to `raw -echo`; the implementation restored
  canonical input, echo, and signal handling without touching Ghostty.
- Verification: `npm run typecheck` and the full hermetic suite pass (180
  passed, 2 opt-in skipped).
- Documentation: current launcher architecture, completed delivery notes, and
  README recovery guidance describe the new guarantee. The required fresh
  full-corpus documentation re-audit passes its mechanical gate with 0 Critical,
  0 High, and 0 Medium findings.
