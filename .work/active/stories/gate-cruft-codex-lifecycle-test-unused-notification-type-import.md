---
id: gate-cruft-codex-lifecycle-test-unused-notification-type-import
kind: story
stage: implementing
tags: [cleanup]
parent: null
depends_on: []
release_binding: null
gate_origin: cruft
created: 2026-08-16
updated: 2026-08-16
---

# Remove the unused CodexNotification test import

## Confidence

High

## Category

unused import

## Location

`tests/integrations/codex/lifecycle.test.ts:6`

## Evidence

```typescript
import type { CodexNotification } from "../../../src/integrations/codex/protocol.js";
```

TypeScript reports TS6133 because `CodexNotification` has no use beyond this import.

## Removal

Delete the unused type-import line. No callers, tests, or surrounding imports need adjustment.
