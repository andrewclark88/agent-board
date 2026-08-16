---
id: story-fix-detached-focus-rename
kind: story
stage: review
tags: [bug, cli, integration]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Refuse detached focus-based label changes

## Symptom

Andrew entered `agent-name test-tab-rename` as a Codex prompt in one tab. The
agent executed it through a detached tool process, and the focus-based command
registered and renamed a different Ghostty tab that happened to be frontmost.

## Root cause

`agent-name <label>` originally resolved every target from current Ghostty focus
and did not carry the managed session's stable identity into Codex descendants.
Agent-tool execution therefore targeted whichever tab happened to be frontmost.
The first TTY-only safeguard was incomplete because Codex `!` also runs without
a TTY, despite being a legitimate descendant of the intended managed session.
Live verification then showed that app-server process environment alone was
also insufficient: Codex filters agent-tool shell subprocess environments
through `shell_environment_policy`.

## Fix approach

Give both the Codex app-server and remote TUI launched by `agent-codex` their
originating Agent Board session ID through their process environments. For the
app-server, also set
`shell_environment_policy.set.AGENT_BOARD_SESSION_ID` through a Codex `-c`
override so agent-tool shells reliably inherit the ID after policy filtering.
A one-label command inheriting that ID—whether through Codex `!` or agent tool
execution—renames the exact session and never consults focus. Require
interactive stdin only for the fallback focus-based form used outside a managed
session. Keep the no-argument native rename prompt available to the
noninteractive macOS Shortcut.

## Regression test

`tests/cli/agent-name.test.ts` supplies non-TTY stdin with one label. Without a
managed session id it requires a stable conflict, exit 1, and zero registration
calls. With a managed session id it requires an explicit-target rename that
does not depend on a TTY or Ghostty focus.

## Implementation and documentation notes

- `agent-codex` passes the stable Board session ID into both owned Codex process
  environments. Its app-server command also passes
  `-c shell_environment_policy.set.AGENT_BOARD_SESSION_ID=<JSON-encoded-session-id>`;
  this explicit policy bridge, rather than process inheritance alone, carries
  the ID into agent-tool shell descendants. The remote TUI environment carries
  it into Codex `!` descendants.
- The CLI forwards an inherited ID to registration as an explicit target, which
  renames only that record and renders its stored terminal without querying
  current focus.
- Without a bound ID, the CLI rejects a non-TTY one-label invocation before
  calling registration or resolving Ghostty focus. The stable failure is:

  ```text
  CONFLICT: agent-name <label> must run in the target terminal; use Codex ! or a shell prompt
  ```

- Direct interactive shell usage outside managed Codex remains supported by the
  focus-based fallback. Codex `!` and agent tool usage work because they inherit
  exact managed session identity, not because either supplies a TTY.
- The no-argument path intentionally remains noninteractive so the macOS
  Shortcut can capture the focused registered session once before showing its
  native prompt.
- Already-running managed Codex sessions must exit and restart through
  `agent-codex` once to inherit the new environment binding.
- The operator guide, configuration guide, specification, and architecture now
  distinguish these two invocation contracts. Regenerate the knowledge index
  and run the documentation review after the implementation verification pass.

## Verification

- Focused CLI regressions prove an unbound detached one-label invocation returns
  exit 1 without calling registration, while a non-TTY command with a managed
  session ID passes that explicit target and the no-argument Shortcut path
  remains available.
- Process integration coverage proves the app-server receives both its
  `AGENT_BOARD_SESSION_ID` process environment and JSON-encoded
  `shell_environment_policy.set` argument, while the remote TUI receives the
  process environment binding. The packed-install journey proves the shipped
  binary refuses an unbound detached rename, supports the interactive focus
  fallback, and accepts an explicit managed-session target without a TTY.
- `npm run typecheck` passes.
- `npm test` passes the full hermetic suite, with the two real-environment
  probes remaining opt-in and skipped by default.
