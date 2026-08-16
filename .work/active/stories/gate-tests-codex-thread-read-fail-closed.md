---
id: gate-tests-codex-thread-read-fail-closed
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

# Cover malformed and mismatched loaded-thread repair responses

## Priority

High

## Value evidence

Item: `story-fix-codex-loaded-thread-schema`

Contract / risk / regression / maintenance cost: The hydrated repair requires malformed loaded-list/thread-read responses to fail closed (`3719113:.work/active/stories/story-fix-codex-loaded-thread-schema.md:47`), and production rejects a returned thread ID that differs from the request (`src/integrations/codex/client.ts:205`). Schema tests reject malformed values (`tests/integrations/codex/protocol.test.ts:35`), while the client path covers only successful matching enrichment (`tests/integrations/codex/client.test.ts:39`).

## Gap type

bug-regression

## Suggested test

```typescript
test("loadedThreads fails closed on malformed and mismatched thread/read", async () => { /* return malformed metadata and then a different id; assert method-specific ADAPTER_FAILURE and no result */ });
```

## Test location (suggested)

`tests/integrations/codex/client.test.ts`
