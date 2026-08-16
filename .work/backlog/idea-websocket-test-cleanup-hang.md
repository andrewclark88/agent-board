---
id: idea-websocket-test-cleanup-hang
created: 2026-08-16
updated: 2026-08-16
tags: [tests]
---

Two full-suite runs remained alive in
`tests/integrations/codex/client.test.ts` after the disconnect test, apparently
while entering or cleaning up the notification overflow/oversized/binary test.
The same suite has also completed normally in other runs, so preserve this as a
test-harness cleanup investigation rather than bundling it with the managed
relaunch repair. The stuck processes were explicitly terminated after their
exact test process groups were verified.
