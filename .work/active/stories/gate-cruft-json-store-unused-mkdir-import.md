---
id: gate-cruft-json-store-unused-mkdir-import
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

# Remove the unused JSON-store mkdir import

## Confidence

High

## Category

unused import

## Location

`src/infrastructure/json-session-store.ts:1`

## Evidence

```typescript
import { mkdir, readdir, rm } from "node:fs/promises";
```

TypeScript reports TS6133 because `mkdir` has no use beyond this import.

## Removal

Remove the `mkdir` specifier while retaining `readdir` and `rm`.
