---
id: story-fix-managed-relaunch-thread-binding
kind: story
stage: done
tags: [bug]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Replace stale Codex thread binding on managed relaunch

## Symptom

After an earlier `agent-codex` launch failed, retrying briefly opened Codex,
immediately marked the tab `×`, returned to the shell, and recorded:

```text
Session is already bound to a different Codex thread
```

The forced TUI shutdown also left the user's terminal input mode altered.

## Root cause

The persistent tab record retained `nativeThreadId` after the previous launcher
ended. A new managed launch owns a new private app-server and root thread, but
the launch claim preserved the old thread ID; the observer then rejected the new
valid binding as a conflict and terminated the TUI.

## Fix approach

When a managed launcher claims the registered session, clear the prior
`nativeThreadId` while recording the new launcher PID. The observer can then bind
the new runtime's root thread without replacing the stable tab/project identity.

## Regression test

`tests/application/launch-managed-codex.test.ts` starts with a persisted previous
thread ID and proves relaunch completes cleanly with the newly discovered root
thread bound.

## Implementation notes

- Execution capability: focused local repair; the failure was one stale
  runtime-owned field crossing launcher lifetimes, with a deterministic
  application-level reproduction.
- Files changed: `src/application/launch-managed-codex.ts`,
  `tests/application/launch-managed-codex.test.ts`, and the managed runtime
  ownership wording in the foundation docs.
- Regression evidence: the relaunch test returned `failed` with the persisted
  previous thread before the fix and now returns `clean` with the new `root`
  thread bound.
- Original reproduction: the live session record contained a previous
  `nativeThreadId` and the exact launcher diagnostic `Session is already bound
  to a different Codex thread`; no managed launcher or app-server process
  remained afterward.
- Verification: focused launch/observer tests pass (9/9), `npm run typecheck`
  passes, and the full suite rerun passes (172 passed, 2 opt-in skipped).
- Adjacent issue parked: `idea-websocket-test-cleanup-hang` records an
  intermittent unrelated full-suite cleanup hang that passed in isolation and
  on rerun.

## Review (2026-08-16)

**Verdict**: Approve with comments

**Blockers**: none
**Important**: `idea-terminal-mode-restoration` preserves exact TTY restoration
after any future Agent Board-forced remote-TUI shutdown; it does not block the
verified sequential-relaunch repair.
**Nits**: none
**Rejected**: none

**Notes**: Bounded inline standalone-story review; no independent or cross-model
reviewer ran. Correctness, sequencing, persistence boundaries, regression
coverage, command/security impact, compatibility, and foundation-doc alignment
were inspected. Clearing only the prior runtime-owned thread binding at the
new launch claim preserves stable session, identity, terminal, attention, and
observation fields. The deterministic failed-retry test, focused tests, and
green full-suite rerun support closure.
