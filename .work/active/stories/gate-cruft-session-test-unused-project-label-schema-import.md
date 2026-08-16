---
id: gate-cruft-session-test-unused-project-label-schema-import
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

# Remove the unused ProjectLabelSchema test import

## Confidence

High

## Category

unused import

## Location

`tests/domain/session.test.ts:16`

## Evidence

```typescript
  ProjectLabelSchema,
```

TypeScript reports TS6133 because `ProjectLabelSchema` has no use beyond this import.

## Removal

Remove the `ProjectLabelSchema` specifier from the existing domain-session import.
