---
id: gate-tests-real-pty-forced-shutdown-restoration
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

# Protect terminal-mode regressions through a real PTY boundary

## Priority

High

## Value evidence

Item: `story-fix-terminal-mode-restoration`

Contract / risk / regression / maintenance cost: The raw-terminal regression requires exact pre-launch mode restoration after forced shutdown (`37e520f:.work/active/stories/story-fix-terminal-mode-restoration.md:31`), with keyboard reporting restoration at `af155e6:.work/active/stories/story-fix-terminal-keyboard-mode-restoration.md:35`. Adapter tests replace `/bin/stty` and writes (`tests/integrations/terminal-mode.test.ts:7`), CLI tests inject the port (`tests/cli/agent-codex.test.ts:53`), and packaged execution ignores stdin (`tests/e2e/support/package-harness.ts:174`).

## Gap type

bug-regression

## Suggested test

```typescript
test("forced managed shutdown restores controlling PTY and keyboard cleanup", async () => { /* capture stty -g, force failure, compare post-exit snapshot, assert CSI-u and modifyOtherKeys reset bytes */ });
```

## Test location (suggested)

`tests/integration/terminal-restoration.test.ts`
