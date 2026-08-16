---
id: gate-cruft-reconcile-unused-project-session-import
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

# Remove the unused reconciliation projection import

## Confidence

High

## Category

unused import

## Location

`src/application/reconcile-session.ts:17`

## Evidence

```typescript
import { projectSession } from "../domain/projection.js";
```

TypeScript reports TS6133 because `projectSession` has no use beyond this import.

## Removal

Delete the unused import line. No callers, tests, or surrounding imports need adjustment.
