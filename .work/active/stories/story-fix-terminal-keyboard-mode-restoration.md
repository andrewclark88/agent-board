---
id: story-fix-terminal-keyboard-mode-restoration
kind: story
stage: done
tags: [bug, integration, cli]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Restore terminal keyboard reporting after forced Codex shutdown

## Symptom

After an observer failure tears down the managed Codex TUI, the shell returns
but Control-C and other modified keys emit odd character sequences until the
operator runs `reset`.

## Root cause

The existing launcher recovery reapplies the exact pre-launch `stty` snapshot,
which restores Unix terminal flags but not terminal-emulator modes. Codex
enables enhanced CSI-u keyboard reporting in its TUI. Agent Board can terminate
that TUI with `SIGTERM` after an observer failure, bypassing Codex's normal exit
cleanup and leaving Ghostty's keyboard-reporting stack active.

Current upstream Codex performs a stronger exit reset by popping and resetting
keyboard-enhancement flags and disabling xterm modifyOtherKeys. Agent Board
owns forced child teardown, so its terminal restoration must provide the same
defensive cleanup before returning control to the shell.

## Repair

- After successfully restoring the captured `stty` state, emit Codex's
  defensive keyboard cleanup sequence to the controlling terminal output.
- Keep exact `stty` restoration; do not invoke blanket `reset` or `stty sane`.
- Preserve the managed outcome if cleanup output fails, using the existing
  actionable restoration failure path.

## Regression evidence

`tests/integrations/terminal-mode.test.ts` expects terminal restoration to emit
the keyboard reset. Before the repair, the adapter emits nothing and the test
fails with an empty actual value.

## Acceptance

- Forced managed exit restores both the Unix terminal mode and CSI-u /
  modifyOtherKeys reporting state.
- Normal managed exits retain the same cleanup guarantee.
- Non-terminal launches remain silent and existing outcome semantics remain
  unchanged.

## Implementation notes

- Extended the existing terminal-mode boundary after exact `stty` restoration;
  launcher outcome and signal orchestration remain unchanged.
- The reset mirrors Codex's current exit cleanup: pop one enhancement level,
  reset any remaining CSI-u levels, and disable modifyOtherKeys. It runs before
  the parent shell redraws its prompt.
- A synchronous terminal-output failure uses the existing typed restoration
  error path, preserving the managed exit code and `reset` recovery guidance.
- Regression coverage proves exact output, non-terminal silence, and cleanup
  failure semantics. Typecheck, build, focused CLI/adapter tests, and the full
  hermetic suite pass (192 passed, 2 opt-in probes skipped).

## Review (2026-08-16)

**Verdict**: Approve

**Blockers**: none

**Important**: none

**Nits**: none

**Rejected**: none

**Notes**: Bounded inline standalone-story review; no independent or cross-model
code reviewer ran. The review checked cleanup ordering, normal and forced exit
paths, non-terminal behavior, output/error semantics, command-injection risk,
and parity with Codex's current keyboard cleanup. The fixed sequence is
terminal control output rather than shell input, follows exact opaque `stty`
restoration, and is idempotent after a normal Codex exit. Focused regressions,
the full hermetic suite, current operator/architecture docs, and a fresh corpus
audit with 0 Critical and 0 High findings support closure.
