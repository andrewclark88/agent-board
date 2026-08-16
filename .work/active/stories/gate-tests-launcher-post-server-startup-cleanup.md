---
id: gate-tests-launcher-post-server-startup-cleanup
kind: story
stage: implementing
tags: [testing]
parent: null
depends_on: []
release_binding: null
gate_origin: tests
created: 2026-08-16
updated: 2026-08-16
---

# Cover managed-launch cleanup across post-server startup failures

## Priority

High

## Value evidence

Item: `epic-managed-codex-observation-supervised-launcher`

Contract / risk / regression / maintenance cost: The feature requires app-server, observer, focus watcher, and TUI cleanup exactly once for every startup/runtime failure (`.work/active/features/epic-managed-codex-observation-supervised-launcher.md:282`). Production has distinct connect, initialize, observer-start, and TUI-start failure points (`src/application/launch-managed-codex.ts:134`, `:135`, `:139`, `:150`) with cleanup at line 192, while `tests/application/launch-managed-codex.test.ts:112-192` does not cover those post-server startup failures.

## Gap type

complex-unit

## Suggested test

```typescript
test("managed launch cleans post-server startup failures exactly once", async () => { /* table: connect, initialize, observer, TUI failures; assert stop/close counts, error evidence, cleared launcher binding */ });
```

## Test location (suggested)

`tests/application/launch-managed-codex.test.ts`
