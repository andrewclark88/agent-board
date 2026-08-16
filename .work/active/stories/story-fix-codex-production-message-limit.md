---
id: story-fix-codex-production-message-limit
kind: story
stage: review
tags: [bug]
parent: null
depends_on: []
release_binding: null
gate_origin: null
created: 2026-08-16
updated: 2026-08-16
---

# Accept bounded production-sized Codex notifications

## Symptom

After the managed TUI opened and the new thread bound successfully,
`agent-codex` immediately marked the tab `×`, terminated the TUI, and recorded:

```text
Codex app-server message exceeds configured limit
```

## Root cause

`AppServerClient` capped every incoming WebSocket message at 1 MiB before
classifying its method. A disposable Codex 0.147.0 app-server/remote-TUI probe
measured legitimate `app/list/updated` notifications at 3,692,503 to 3,700,435
bytes. Agent Board does not consume that method, but the undersized global cap
closed the observer before it could ignore the notification.

## Fix approach

Raise the bounded default message limit to 8 MiB, which accommodates the
measured production payload with headroom while retaining explicit size
protection. Caller-supplied lower limits and their rejection behavior remain
unchanged.

## Regression test

`tests/integrations/codex/client.test.ts` sends a 4 MiB unknown
`app/list/updated` notification under the default limit and proves the client
ignores it while completing the following request.

## Implementation notes

- Execution capability: focused local repair plus a disposable installed-runtime
  measurement; the defect is one disproven adapter-boundary default.
- Files changed: `src/integrations/codex/client.ts`,
  `tests/integrations/codex/client.test.ts`, and current adapter delivery notes.
- Regression evidence: the new 4 MiB ignored-notification test failed with the
  exact live error under the 1 MiB default and passes under the 8 MiB default;
  explicit 100-byte rejection, binary-message rejection, and notification
  overflow coverage remain green.
- Original reproduction: a disposable Codex 0.147.0 app-server, raw observer,
  and remote TUI measured `app/list/updated` at 3,692,503 bytes initially and
  3,700,435 bytes on later updates. The probe used no Agent Board registration
  or Ghostty title mutation and was shut down afterward.
- Verification: focused client tests pass (6/6), `npm run typecheck` passes, and
  the full suite passes (173 passed, 2 opt-in skipped).
- Adjacent issues parked: none; general forced-shutdown TTY restoration remains
  separately tracked by `idea-terminal-mode-restoration`.
