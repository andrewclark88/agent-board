---
id: idea-lock-contention-silent-exit
created: 2026-08-14
updated: 2026-08-14
tags: [bug]
---

Packaged concurrency testing exposed a production lock bug: when another Agent
Board process holds a session lock, `proper-lockfile` retry timers are unreferenced,
so a contending CLI can exit successfully before its pending command promise
settles and print no output. The same retry configuration uses `forever: true`,
which also defeats the intended bounded `LOCK_TIMEOUT` behavior.

Reproduction evidence is captured in the packaged-e2e feature review. Repair the
lock configuration, add a deterministic contention regression, and verify that a
real contending `agents --json` invocation waits and emits valid JSON.
