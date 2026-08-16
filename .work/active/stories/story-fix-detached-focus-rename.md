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

`agent-name <label>` always resolves its target from current Ghostty focus but
does not verify that the command itself is attached to an interactive terminal.
Agent-tool execution therefore looks equivalent to an intentional shell command
even though it has no reliable originating tab.

## Fix approach

Require interactive stdin for the one-label form before invoking registration.
Keep the no-argument native rename prompt available to the noninteractive macOS
Shortcut, and keep ordinary shell plus Codex `! agent-name ...` usage unchanged.

## Regression test

`tests/cli/agent-name.test.ts` supplies non-TTY stdin with one label and requires
a stable conflict message, exit 1, and zero registration calls. The test first
reproduced the unintended registration call and now passes with the guard.

## Implementation and documentation notes

- The CLI now rejects a non-TTY one-label invocation before calling the
  registration use case or resolving Ghostty focus. The stable failure is:

  ```text
  CONFLICT: agent-name <label> must run in the target terminal; use Codex ! or a shell prompt
  ```

- Interactive shell and Codex `! agent-name <label>` usage remains supported.
  The no-argument path intentionally remains noninteractive so the macOS
  Shortcut can capture the focused registered session before showing its
  native prompt.
- The operator guide, configuration guide, specification, and architecture now
  distinguish these two invocation contracts. Regenerate the knowledge index
  and run the documentation review after the implementation verification pass.

## Verification

- The focused CLI regression proves a detached one-label invocation returns
  exit 1 without calling registration, while the noninteractive no-argument
  Shortcut path remains available.
- The packed-install journey proves the shipped binary refuses a detached
  rename and still registers normally when the harness explicitly supplies an
  interactive terminal boundary.
- `npm run typecheck` passes.
- `npm test` passes all 181 tests, with the two real-environment probes remaining
  opt-in and skipped by default.
